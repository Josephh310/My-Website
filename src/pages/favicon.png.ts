import type { APIRoute } from 'astro';
import { getAvatarPng } from '../lib/avatar';

export const GET: APIRoute = async () =>
	new Response(await getAvatarPng(192), { headers: { 'Content-Type': 'image/png' } });
