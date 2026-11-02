// Games listed on the /games page. Stats and thumbnails are fetched from Roblox at build time.
// `placeId` is the number in the game's URL: roblox.com/games/<placeId>/...

export interface Game {
	placeId: number;
	// Display name, since the live Roblox title often carries event prefixes like "[UPDATE]"
	name: string;
	description: string;
	// Shown with an "Unreleased" badge instead of stats, and excluded from totals
	unreleased?: boolean;
}

export const GAMES: Game[] = [
	{
		placeId: 112619156837009,
		name: 'Build A Blue Lock Squad',
		description: 'Roll and collect 200+ Blue Lock characters to build the ultimate squad.',
	},
	{
		placeId: 4282985734,
		name: 'Combat Warriors',
		description: 'A fast-paced fighting game built around melee and ranged weapon combat.',
	},
	{
		placeId: 112389801624808,
		name: 'Star Strikers',
		description: 'A tower defense game, currently in development.',
		unreleased: true,
	},
];
