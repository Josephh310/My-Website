import type { APIRoute } from 'astro';
import { getAvatarPng } from '../lib/avatar';

const SIZE = 32;

// An ICO file holding a single PNG-encoded image, which all current browsers support
export const GET: APIRoute = async () => {
	const png = await getAvatarPng(SIZE);
	const header = new DataView(new ArrayBuffer(22));
	header.setUint16(2, 1, true); // type: icon
	header.setUint16(4, 1, true); // image count
	header.setUint8(6, SIZE); // width
	header.setUint8(7, SIZE); // height
	header.setUint16(10, 1, true); // colour planes
	header.setUint16(12, 32, true); // bits per pixel
	header.setUint32(14, png.byteLength, true); // image size
	header.setUint32(18, header.byteLength, true); // image offset

	const ico = new Uint8Array(header.byteLength + png.byteLength);
	ico.set(new Uint8Array(header.buffer));
	ico.set(png, header.byteLength);
	return new Response(ico, { headers: { 'Content-Type': 'image/x-icon' } });
};
