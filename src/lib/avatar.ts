// Build-time only: uses sharp and the filesystem, so never import this from client scripts
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';
import { avatarUrl, fetchAvatarHash } from './discord';

let hashPromise: Promise<string | null> | undefined;
let sourcePromise: Promise<Buffer> | undefined;

// Fetched once per build and shared by every page. Resolves to null if there's no custom
// avatar or Lanyard is unreachable, in which case the site falls back to the local headshot
export function getBuildAvatarHash(): Promise<string | null> {
	hashPromise ??= fetchAvatarHash().catch((error: unknown) => {
		console.warn(`Couldn't fetch Discord avatar, falling back to the local headshot: ${error}`);
		return null;
	});
	return hashPromise;
}

async function loadSource(): Promise<Buffer> {
	const hash = await getBuildAvatarHash();
	if (!hash) {
		// Relative to the project root, which is where Astro runs
		return readFile('src/assets/headshot.png');
	}
	const res = await fetch(avatarUrl(hash, 512));
	if (!res.ok) {
		throw new Error(`Discord avatar download failed (${res.status})`);
	}
	return Buffer.from(await res.arrayBuffer());
}

// Square PNG of the avatar for the self-hosted favicons
export async function getAvatarPng(size: number): Promise<Uint8Array> {
	sourcePromise ??= loadSource();
	return new Uint8Array(await sharp(await sourcePromise).resize(size, size).png().toBuffer());
}
