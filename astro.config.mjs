// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://josephh.dev/',
	integrations: [mdx(), sitemap()],
	image: {
		// Roblox game thumbnails and the Discord avatar, downloaded and optimised at build time
		domains: ['tr.rbxcdn.com', 'cdn.discordapp.com'],
	},
});
