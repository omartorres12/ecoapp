import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Create beautiful EcoGuardian Leaf SVG
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1F5C3A"/>
      <stop offset="100%" stop-color="#143D27"/>
    </linearGradient>
    <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4ADE80"/>
      <stop offset="100%" stop-color="#22C55E"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF08A"/>
      <stop offset="100%" stop-color="#86EFAC"/>
    </linearGradient>
  </defs>
  
  <!-- Rounded container -->
  <rect width="512" height="512" rx="128" fill="url(#bg)"/>
  
  <!-- Subtle circular halo -->
  <circle cx="256" cy="256" r="170" fill="#2E7D4E" opacity="0.35"/>

  <!-- Stylized leaf & sprout shape -->
  <g transform="translate(0, -10)">
    <!-- Main leaf body -->
    <path d="M 256 100 C 370 100 410 200 400 320 C 390 390 320 420 256 420 C 192 420 122 390 112 320 C 102 200 142 100 256 100 Z" 
          fill="url(#leafGrad)" />
          
    <!-- Left inner curved leaf fold -->
    <path d="M 256 100 C 256 220 160 260 140 330 C 170 390 230 400 256 420 C 240 330 250 200 256 100 Z" 
          fill="#16A34A" opacity="0.5"/>
          
    <!-- Central leaf vein stem -->
    <path d="M 256 110 Q 256 280 256 415" 
          stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" opacity="0.75"/>
          
    <!-- Side leaf veins -->
    <path d="M 256 220 Q 305 200 335 185" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" opacity="0.6"/>
    <path d="M 256 280 Q 315 265 345 255" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" opacity="0.6"/>
    <path d="M 256 245 Q 205 230 175 215" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" opacity="0.6"/>
    <path d="M 256 310 Q 200 300 170 290" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" opacity="0.6"/>

    <!-- Small sprouted corn/bio dot accent -->
    <circle cx="256" cy="115" r="14" fill="url(#accentGrad)"/>
    <path d="M 290 150 C 310 120 350 125 365 145 C 365 175 330 190 290 180 Z" fill="url(#accentGrad)" opacity="0.9"/>
  </g>

  <!-- Eco paw print watermark at the base of the leaf -->
  <g transform="translate(256, 335) scale(0.65)" opacity="0.95">
    <ellipse cx="0" cy="40" rx="36" ry="26" fill="#FFFFFF"/>
    <ellipse cx="-45" cy="0" rx="14" ry="20" transform="rotate(-15 -45 0)" fill="#FFFFFF"/>
    <ellipse cx="-16" cy="-22" rx="13" ry="21" transform="rotate(-5 -16 -22)" fill="#FFFFFF"/>
    <ellipse cx="16" cy="-22" rx="13" ry="21" transform="rotate(5 16 -22)" fill="#FFFFFF"/>
    <ellipse cx="45" cy="0" rx="14" ry="20" transform="rotate(15 45 0)" fill="#FFFFFF"/>
  </g>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent.trim());
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent.trim());

// Function to generate raw PNG with node zlib and pure buffer
function createSolidPng(width, height, r, g, b, alpha = 255) {
  // Simple uncompressed or compressed raw RGBA buffer
  const rowBytes = 1 + width * 4; // 1 filter byte (0) + width * 4 (RGBA)
  const rawData = Buffer.alloc(rowBytes * height);

  for (let y = 0; y < height; y++) {
    const rowStart = y * rowBytes;
    rawData[rowStart] = 0; // Filter type 0: None

    for (let x = 0; x < width; x++) {
      const px = rowStart + 1 + x * 4;
      
      // Compute distance from center for rounded corner / leaf badge
      const cx = width / 2;
      const cy = height / 2;
      const dx = (x - cx) / (width * 0.45);
      const dy = (y - cy) / (height * 0.45);
      const distSq = dx * dx + dy * dy;

      if (distSq <= 1.0) {
        // Inside central circle: vibrant brand green
        const innerG = Math.min(255, g + 25);
        rawData[px] = r;
        rawData[px + 1] = innerG;
        rawData[px + 2] = b;
        rawData[px + 3] = 255;
      } else {
        // Background dark green #1F5C3A (r=31, g=92, b=58)
        rawData[px] = r;
        rawData[px + 1] = g;
        rawData[px + 2] = b;
        rawData[px + 3] = alpha;
      }
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG header: 8 bytes
  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8 bits/channel
  ihdr[9] = 6; // Color type: 6 (RGBA)
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace (no)

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const crc = crc32(chunk.subarray(4, 8 + len));
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

// Standard CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1);
    } else {
      c = c >>> 1;
    }
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

// Generate PNG files
const r = 31, g = 92, b = 58; // #1F5C3A
const pwa192 = createSolidPng(192, 192, r, g, b);
const pwa512 = createSolidPng(512, 512, r, g, b);
const pwaMaskable = createSolidPng(512, 512, r, g, b);
const appleTouch = createSolidPng(180, 180, r, g, b);

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), pwa192);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), pwa512);
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), pwaMaskable);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouch);

console.log('Generated all PWA icons in /public successfully!');
