// Optional local pixel QA. This is a Skia Canvas adapter, not browser/download QA.
// Install @napi-rs/canvas@1.0.9 in an isolated prefix, then set SC_CANVAS_MODULE
// to that package's index.js. Run with the pinned Node and --import tsx.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { renderRedactedImage } from '../src/lib/analyzer/redactor.ts';

if (!process.env.SC_CANVAS_MODULE) throw new Error('Set SC_CANVAS_MODULE to the isolated @napi-rs/canvas index.js');
const { createCanvas, loadImage, ImageData } = await import(pathToFileURL(process.env.SC_CANVAS_MODULE).href);
let requests = 0;
globalThis.fetch = () => { requests++; throw new Error('No network allowed during local pixel QA'); };
globalThis.document = { createElement(name) {
  assert.equal(name, 'canvas');
  return createCanvas(1, 1);
} };

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, bytes) {
  const payload = Buffer.concat([Buffer.from(type), bytes]);
  const length = Buffer.alloc(4); length.writeUInt32BE(bytes.length);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(payload));
  return Buffer.concat([length, payload, crc]);
}
function chunks(png) {
  assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  const result = [];
  for (let offset = 8; offset < png.length;) {
    const length = png.readUInt32BE(offset);
    result.push(png.subarray(offset + 4, offset + 8).toString());
    offset += length + 12;
  }
  return result;
}
async function pixels(png) {
  const img = await loadImage(png);
  const canvas = createCanvas(img.width, img.height);
  canvas.getContext('2d').drawImage(img, 0, 0);
  return { width: img.width, height: img.height, data: canvas.getContext('2d').getImageData(0, 0, img.width, img.height).data };
}

const width = 64, height = 48;
const input = createCanvas(width, height);
const bytes = new Uint8ClampedArray(width * height * 4);
for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
  const i = (y * width + x) * 4;
  bytes.set([(x * 19) % 256, (y * 23) % 256, (x * 11 + y * 7) % 256, (x + y) % 3 ? 255 : 0], i);
}
input.getContext('2d').putImageData(new ImageData(bytes, width, height), 0, 0);
const original = input.toBuffer('image/png');
const marker = 'SC_SYNTHETIC_COMMENT_2026_10_01_NO_PERSONAL_DATA';
const marked = Buffer.concat([original.subarray(0, 33), chunk('tEXt', Buffer.from(`Comment\0${marker}`)), original.subarray(33)]);
assert.ok(chunks(marked).includes('tEXt'));
assert.ok(marked.includes(Buffer.from(marker)));
const image = await loadImage(marked);
const baseline = await renderRedactedImage(image, []);
const baselinePixels = await pixels(Buffer.from(await baseline.blob.arrayBuffer()));
const boxes = [
  { id: 'black', x: 8.2, y: 8.2, width: 23.3, height: 11.9, type: 'blackout' },
  { id: 'white', x: -4.3, y: 30.2, width: 13.5, height: 30, type: 'whiteout' },
  { id: 'outside', x: 200, y: 200, width: 10, height: 10, type: 'blackout' },
  { id: 'zero', x: 0, y: 0, width: 0, height: 10, type: 'blackout' },
];
const result = await renderRedactedImage(image, boxes);
const output = Buffer.from(await result.blob.arrayBuffer());
const decoded = await pixels(output);
assert.deepEqual([decoded.width, decoded.height], [width, height]);
assert.equal(result.blob.type, 'image/png');
assert.equal(output.includes(Buffer.from(marker)), false);
assert.equal(chunks(output).includes('tEXt'), false);
assert.deepEqual(Buffer.from(result.dataUrl.split(',')[1], 'base64'), output);
let opaquePixels = 0, unchangedPixels = 0;
for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
  const i = (y * width + x) * 4;
  const black = x >= 8 && x < 32 && y >= 8 && y < 21;
  const white = x >= 0 && x < 10 && y >= 30 && y < 48;
  const expected = black ? [20, 20, 19, 255] : white ? [255, 255, 255, 255] : Array.from(baselinePixels.data.subarray(i, i + 4));
  assert.deepEqual(Array.from(decoded.data.subarray(i, i + 4)), expected, `pixel ${x},${y}`);
  if (black || white) opaquePixels++; else unchangedPixels++;
}
assert.equal(requests, 0);
await mkdir('audit/export-qa', { recursive: true });
await writeFile('audit/export-qa/synthetic-source.png', marked);
await writeFile('audit/export-qa/synthetic-redacted.png', output);
console.log(JSON.stringify({ renderer: 'real application function with @napi-rs/canvas adapter', width, height,
  opaquePixels, unchangedPixels, sourceChunks: chunks(marked), exportedChunks: chunks(output),
  syntheticCommentRemoved: true, blobMatchesDataUrl: true, fetchAttempts: requests,
  limitation: 'Local Canvas/PNG evidence only; does not establish production browser download, all source metadata formats, OCR, or full-page network privacy.' }, null, 2));
