import type { Game } from '../data/games';

export interface GameStats extends Game {
	// Undefined for unreleased games, which have no public page
	url: string | undefined;
	thumbnailUrl: string | undefined;
	visits: number;
	favorites: number;
}

async function getJson<T>(url: string): Promise<T> {
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(`Roblox API request failed (${res.status}): ${url}`);
	}
	return res.json() as Promise<T>;
}

// Roblox's stats endpoints are keyed by universe ID, not the place ID shown in game URLs
async function getUniverseId(placeId: number): Promise<number> {
	const { universeId } = await getJson<{ universeId: number | null }>(
		`https://apis.roblox.com/universes/v1/places/${placeId}/universe`,
	);
	if (universeId === null) {
		throw new Error(`No Roblox universe found for place ${placeId}`);
	}
	return universeId;
}

export async function getGameStats(games: Game[]): Promise<GameStats[]> {
	const universeIds = await Promise.all(games.map((game) => getUniverseId(game.placeId)));
	const ids = universeIds.join(',');

	const [details, thumbnails] = await Promise.all([
		getJson<{
			data: { id: number; visits: number; favoritedCount: number; canonicalUrlPath: string }[];
		}>(`https://games.roblox.com/v1/games?universeIds=${ids}`),
		getJson<{
			data: { universeId: number; thumbnails: { state: string; imageUrl: string }[] }[];
		}>(
			`https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${ids}&countPerUniverse=1&size=768x432&format=Webp`,
		),
	]);

	return games.map((game, i) => {
		const universeId = universeIds[i];
		const thumbnail = thumbnails.data
			.find((t) => t.universeId === universeId)
			?.thumbnails.find((t) => t.state === 'Completed');

		// Private games return placeholder details, so only thumbnails are usable
		if (game.unreleased) {
			return { ...game, url: undefined, thumbnailUrl: thumbnail?.imageUrl, visits: 0, favorites: 0 };
		}

		const detail = details.data.find((d) => d.id === universeId);
		if (!detail) {
			throw new Error(`No Roblox game details returned for ${game.name} (universe ${universeId})`);
		}

		return {
			...game,
			url: `https://www.roblox.com${detail.canonicalUrlPath}`,
			thumbnailUrl: thumbnail?.imageUrl,
			visits: detail.visits,
			favorites: detail.favoritedCount,
		};
	});
}
