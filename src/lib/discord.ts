// Shared by the build and the browser, so this must stay free of Node-only imports

export const DISCORD_USER_ID = '1355164705018085466';

// Lanyard serves public Discord profile data without a bot token, but only for users
// who are members of its Discord server (discord.gg/lanyard)
const LANYARD_URL = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;

// Resolves to null if the account is using Discord's default avatar
export async function fetchAvatarHash(): Promise<string | null> {
	const res = await fetch(LANYARD_URL);
	if (!res.ok) {
		throw new Error(`Lanyard request failed (${res.status})`);
	}
	const { data } = (await res.json()) as { data: { discord_user: { avatar: string | null } } };
	return data.discord_user.avatar;
}

// The hash changes whenever the avatar does, so these URLs never serve a stale image.
// Discord only accepts power-of-two sizes between 16 and 4096
export function avatarUrl(hash: string, size: number, format: 'png' | 'webp' = 'png'): string {
	return `https://cdn.discordapp.com/avatars/${DISCORD_USER_ID}/${hash}.${format}?size=${size}`;
}
