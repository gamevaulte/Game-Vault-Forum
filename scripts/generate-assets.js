import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';
import { GifWriter } from 'omggif';
import { PNG } from 'pngjs';

// Ensure directories exist
const publicDir = path.resolve('public');
const assetsDir = path.resolve('public/assets');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

/**
 * Creates the high-precision SVG for the Game Vault Favicon and Logo
 */
function generateFaviconSvg(rotationDeg = 0, glowIntensity = 1) {
  const primaryGlow = `rgba(168, 85, 247, ${0.4 * glowIntensity})`;
  const cyanGlow = `rgba(6, 182, 212, ${0.7 * glowIntensity})`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#111322"/>
      <stop offset="50%" stop-color="#090a12"/>
      <stop offset="100%" stop-color="#05060b"/>
    </linearGradient>

    <linearGradient id="shieldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4"/>
      <stop offset="40%" stop-color="#a855f7"/>
      <stop offset="70%" stop-color="#ec4899"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>

    <linearGradient id="gearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="50%" stop-color="#2e1065"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>

    <linearGradient id="cyanAccent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22d3ee"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>

    <linearGradient id="purpleAccent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c084fc"/>
      <stop offset="100%" stop-color="#9333ea"/>
    </linearGradient>

    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="10" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Outer Rounded Hexagonal Vault Shield -->
  <rect x="24" y="24" width="464" height="464" rx="100" fill="url(#bgGrad)"/>
  
  <!-- Glowing Hexagonal Outer Border -->
  <rect x="24" y="24" width="464" height="464" rx="100" fill="none" stroke="url(#shieldBorder)" stroke-width="14" filter="url(#neonGlow)"/>

  <!-- Cyber Vault Corner Rivets / Circuit Pins -->
  <circle cx="88" cy="88" r="10" fill="#06b6d4"/>
  <circle cx="424" cy="88" r="10" fill="#a855f7"/>
  <circle cx="88" cy="424" r="10" fill="#a855f7"/>
  <circle cx="424" cy="424" r="10" fill="#06b6d4"/>

  <!-- Cyber Tech Circuit Guideline Tracks -->
  <circle cx="256" cy="256" r="180" fill="none" stroke="#312e81" stroke-width="3" stroke-dasharray="16 10"/>
  <circle cx="256" cy="256" r="145" fill="none" stroke="#1e293b" stroke-width="2"/>

  <!-- Rotating Vault Door Wheel Mechanism -->
  <g transform="rotate(${rotationDeg} 256 256)">
    <!-- Outer Gear Wheel Base -->
    <circle cx="256" cy="256" r="128" fill="url(#gearGrad)" stroke="#6b21a8" stroke-width="8"/>

    <!-- 8 Vault Door Gear Teeth -->
    <rect x="240" y="104" width="32" height="32" rx="6" fill="url(#purpleAccent)"/>
    <rect x="240" y="376" width="32" height="32" rx="6" fill="url(#purpleAccent)"/>
    <rect x="104" y="240" width="32" height="32" rx="6" fill="url(#purpleAccent)"/>
    <rect x="376" y="240" width="32" height="32" rx="6" fill="url(#purpleAccent)"/>
    
    <!-- Diagonal Gear Teeth with Cyan Accents -->
    <g transform="rotate(45 256 256)">
      <rect x="244" y="108" width="24" height="28" rx="6" fill="url(#cyanAccent)"/>
      <rect x="244" y="376" width="24" height="28" rx="6" fill="url(#cyanAccent)"/>
      <rect x="108" y="244" width="28" height="24" rx="6" fill="url(#cyanAccent)"/>
      <rect x="376" y="244" width="28" height="24" rx="6" fill="url(#cyanAccent)"/>
    </g>

    <!-- Mid Gear Ring -->
    <circle cx="256" cy="256" r="92" fill="#090a12" stroke="#a855f7" stroke-width="6"/>

    <!-- Inner Spokes / Crosshairs -->
    <line x1="256" y1="168" x2="256" y2="344" stroke="#c084fc" stroke-width="12" stroke-linecap="round"/>
    <line x1="168" y1="256" x2="344" y2="256" stroke="#c084fc" stroke-width="12" stroke-linecap="round"/>

    <!-- 4 Lock Pins / Controller Grip Notches -->
    <circle cx="256" cy="190" r="10" fill="#22d3ee"/>
    <circle cx="256" cy="322" r="10" fill="#22d3ee"/>
    <circle cx="190" cy="256" r="10" fill="#22d3ee"/>
    <circle cx="322" cy="256" r="10" fill="#22d3ee"/>

    <!-- Central Glowing Core -->
    <circle cx="256" cy="256" r="44" fill="url(#gearGrad)" stroke="#06b6d4" stroke-width="8"/>
    <polygon points="256,224 284,256 256,288 228,256" fill="url(#cyanAccent)"/>
    <circle cx="256" cy="256" r="8" fill="#ffffff"/>
  </g>
</svg>`;
}

/**
 * Creates an image-only logo SVG (transparent background option for gaming avatar & logo)
 */
function generateLogoEmblemSvg(rotationDeg = 0, pulseFactor = 1) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#13172c"/>
      <stop offset="100%" stop-color="#080911"/>
    </linearGradient>

    <linearGradient id="neonGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4"/>
      <stop offset="50%" stop-color="#a855f7"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>

    <linearGradient id="spokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#c084fc"/>
    </linearGradient>

    <filter id="emblemGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Isolated Emblem Shield (Dark Obsidian Gaming Emblem) -->
  <path d="M256,32 L440,96 L440,300 C440,390 350,460 256,488 C162,460 72,390 72,300 L72,96 Z"
        fill="url(#shieldGrad)"
        stroke="url(#neonGlowGrad)"
        stroke-width="12"
        filter="url(#emblemGlow)"/>

  <!-- Inner Cybernetic Shield Inset -->
  <path d="M256,56 L416,112 L416,290 C416,368 338,432 256,458 C174,432 96,368 96,290 L96,112 Z"
        fill="none"
        stroke="#4338ca"
        stroke-width="3"
        stroke-dasharray="14 8"/>

  <!-- Rotating Central Vault Core -->
  <g transform="rotate(${rotationDeg} 256 260)">
    <!-- Gear Rim -->
    <circle cx="256" cy="260" r="115" fill="#0f111e" stroke="url(#neonGlowGrad)" stroke-width="8"/>

    <!-- Gear Teeth -->
    <rect x="242" y="125" width="28" height="28" rx="6" fill="#a855f7"/>
    <rect x="242" y="367" width="28" height="28" rx="6" fill="#a855f7"/>
    <rect x="121" y="246" width="28" height="28" rx="6" fill="#a855f7"/>
    <rect x="363" y="246" width="28" height="28" rx="6" fill="#a855f7"/>

    <g transform="rotate(45 256 260)">
      <rect x="244" y="127" width="24" height="26" rx="6" fill="#06b6d4"/>
      <rect x="244" y="367" width="24" height="26" rx="6" fill="#06b6d4"/>
      <rect x="123" y="248" width="26" height="24" rx="6" fill="#06b6d4"/>
      <rect x="363" y="248" width="26" height="24" rx="6" fill="#06b6d4"/>
    </g>

    <!-- Inner Wheel & Spokes -->
    <circle cx="256" cy="260" r="80" fill="#181a2e" stroke="#6366f1" stroke-width="4"/>
    <line x1="256" y1="185" x2="256" y2="335" stroke="url(#spokeGrad)" stroke-width="10" stroke-linecap="round"/>
    <line x1="181" y1="260" x2="331" y2="260" stroke="url(#spokeGrad)" stroke-width="10" stroke-linecap="round"/>

    <!-- Vault Core Diamond -->
    <circle cx="256" cy="260" r="38" fill="#0d0e17" stroke="#22d3ee" stroke-width="6"/>
    <polygon points="256,236 278,260 256,284 234,260" fill="#38bdf8"/>
    <circle cx="256" cy="260" r="7" fill="#ffffff"/>
  </g>
</svg>`;
}

async function renderPng(svgString, width, height) {
  const resvg = new Resvg(svgString, {
    fitTo: {
      mode: 'width',
      value: width,
    },
  });
  const pngData = resvg.render();
  return pngData.asPng();
}

/**
 * Builds a multi-resolution ICO file containing embedded PNG images (Vista/Win7+ standard supported by all browsers)
 */
function createIco(pngBuffers) {
  // pngBuffers: array of { width, height, buffer }
  const count = pngBuffers.length;
  const headerSize = 6;
  const entrySize = 16;
  let offset = headerSize + count * entrySize;

  const entries = [];
  let totalSize = offset;
  for (const item of pngBuffers) {
    totalSize += item.buffer.length;
  }

  const out = Buffer.alloc(totalSize);
  // Reserved: 0
  out.writeUInt16LE(0, 0);
  // Type: 1 (ICO)
  out.writeUInt16LE(1, 2);
  // Count
  out.writeUInt16LE(count, 4);

  let currentOffset = offset;
  for (let i = 0; i < count; i++) {
    const item = pngBuffers[i];
    const entryPos = headerSize + i * entrySize;
    // Width (0 means 256)
    out.writeUInt8(item.width >= 256 ? 0 : item.width, entryPos);
    // Height
    out.writeUInt8(item.height >= 256 ? 0 : item.height, entryPos + 1);
    // Color count
    out.writeUInt8(0, entryPos + 2);
    // Reserved
    out.writeUInt8(0, entryPos + 3);
    // Color planes
    out.writeUInt16LE(1, entryPos + 4);
    // Bits per pixel
    out.writeUInt16LE(32, entryPos + 6);
    // Size of image data
    out.writeUInt32LE(item.buffer.length, entryPos + 8);
    // Offset of image data
    out.writeUInt32LE(currentOffset, entryPos + 12);

    // Copy image data to offset
    item.buffer.copy(out, currentOffset);
    currentOffset += item.buffer.length;
  }

  return out;
}

/**
 * Quantize RGBA pixels to 256-color palette for GIF
 */
function rgbaToIndexed(rgbaBuffer, width, height) {
  // Simple & fast octree / popular color quantizer
  const colorMap = new Map();
  const pixelsCount = width * height;
  
  // Step 1: count frequency
  for (let i = 0; i < pixelsCount; i++) {
    const idx = i * 4;
    const r = rgbaBuffer[idx] >> 3;
    const g = rgbaBuffer[idx + 1] >> 3;
    const b = rgbaBuffer[idx + 2] >> 3;
    const a = rgbaBuffer[idx + 3] < 128 ? 0 : 1;
    const key = (a << 15) | (r << 10) | (g << 5) | b;
    colorMap.set(key, (colorMap.get(key) || 0) + 1);
  }

  // Pick top 255 colors + transparent color
  const sortedColors = Array.from(colorMap.entries()).sort((a, b) => b[1] - a[1]);
  const palette = [];
  const paletteMap = new Map();

  // Color 0: transparent / background
  palette.push(0x05060b);

  for (const [key] of sortedColors) {
    if (palette.length >= 256) break;
    const a = (key >> 15) & 1;
    if (a === 0) continue;
    const r = ((key >> 10) & 0x1f) << 3;
    const g = ((key >> 5) & 0x1f) << 3;
    const b = (key & 0x1f) << 3;
    const colorInt = (r << 16) | (g << 8) | b;
    paletteMap.set(key, palette.length);
    palette.push(colorInt);
  }

  // Fill up palette to 256 if needed
  while (palette.length < 256) {
    palette.push(0);
  }

  // Step 2: map pixels
  const indexed = new Uint8Array(pixelsCount);
  for (let i = 0; i < pixelsCount; i++) {
    const idx = i * 4;
    const r = rgbaBuffer[idx] >> 3;
    const g = rgbaBuffer[idx + 1] >> 3;
    const b = rgbaBuffer[idx + 2] >> 3;
    const a = rgbaBuffer[idx + 3] < 128 ? 0 : 1;
    if (a === 0) {
      indexed[i] = 0;
    } else {
      const key = (a << 15) | (r << 10) | (g << 5) | b;
      indexed[i] = paletteMap.get(key) || 1;
    }
  }

  return { indexed, palette };
}

async function generateAll() {
  console.log('--- Generating Brand Assets & Favicons ---');

  // 1. Vector SVG Favicon
  const faviconSvg = generateFaviconSvg(0);
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg, 'utf8');
  console.log('✓ Created public/favicon.svg');

  // 2. High-res PNGs
  const png512 = await renderPng(faviconSvg, 512, 512);
  fs.writeFileSync(path.join(publicDir, 'favicon.png'), png512);
  fs.writeFileSync(path.join(assetsDir, 'favicon-512x512.png'), png512);
  console.log('✓ Created public/favicon.png (512x512)');

  const png180 = await renderPng(faviconSvg, 180, 180);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);
  console.log('✓ Created public/apple-touch-icon.png (180x180)');

  const png32 = await renderPng(faviconSvg, 32, 32);
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), png32);
  console.log('✓ Created public/favicon-32x32.png (32x32)');

  const png16 = await renderPng(faviconSvg, 16, 16);
  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), png16);
  console.log('✓ Created public/favicon-16x16.png (16x16)');

  const png48 = await renderPng(faviconSvg, 48, 48);

  // 3. Multi-resolution ICO file
  const icoBuffer = createIco([
    { width: 16, height: 16, buffer: png16 },
    { width: 32, height: 32, buffer: png32 },
    { width: 48, height: 48, buffer: png48 }
  ]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('✓ Created public/favicon.ico (Multi-size ICO with 16, 32, 48px)');

  // 4. Downloadable Image-Only Logo GIF (Animated 360-degree seamlessly looping emblem)
  console.log('Generating Animated Image-Only Logo GIF...');
  const gifSize = 256;
  const numFrames = 24; // 24 frames for ultra-smooth 90-degree symmetrical or full rotation
  const gifBuffer = Buffer.alloc(gifSize * gifSize * numFrames * 2 + 1024);
  const gifWriter = new GifWriter(gifBuffer, gifSize, gifSize, { loop: 0 });

  for (let frame = 0; frame < numFrames; frame++) {
    const rotation = (frame / numFrames) * 360;
    const pulse = 1 + Math.sin((frame / numFrames) * Math.PI * 2) * 0.3;
    const frameSvg = generateLogoEmblemSvg(rotation, pulse);

    const resvg = new Resvg(frameSvg, {
      fitTo: { mode: 'width', value: gifSize }
    });
    const rendered = resvg.render();
    const rawRgba = rendered.pixels;

    const { indexed, palette } = rgbaToIndexed(rawRgba, gifSize, gifSize);
    gifWriter.addFrame(0, 0, gifSize, gifSize, indexed, {
      palette,
      delay: 5, // 50ms per frame = 20fps smooth
      transparent: 0
    });
  }

  const finalGif = gifBuffer.subarray(0, gifWriter.end());
  fs.writeFileSync(path.join(publicDir, 'game-vault-logo.gif'), finalGif);
  fs.writeFileSync(path.join(assetsDir, 'game-vault-logo.gif'), finalGif);
  console.log(`✓ Created public/game-vault-logo.gif (${(finalGif.length / 1024).toFixed(1)} KB, 24 frames smooth loop)`);

  // 5. Downloadable Favicon GIF
  const favGifSize = 64;
  const favGifFrames = 16;
  const favGifBuffer = Buffer.alloc(favGifSize * favGifSize * favGifFrames * 2 + 1024);
  const favGifWriter = new GifWriter(favGifBuffer, favGifSize, favGifSize, { loop: 0 });

  for (let frame = 0; frame < favGifFrames; frame++) {
    const rotation = (frame / favGifFrames) * 360;
    const frameSvg = generateFaviconSvg(rotation);
    const resvg = new Resvg(frameSvg, { fitTo: { mode: 'width', value: favGifSize } });
    const rendered = resvg.render();
    const { indexed, palette } = rgbaToIndexed(rendered.pixels, favGifSize, favGifSize);
    favGifWriter.addFrame(0, 0, favGifSize, favGifSize, indexed, {
      palette,
      delay: 6,
      transparent: 0
    });
  }
  const finalFavGif = favGifBuffer.subarray(0, favGifWriter.end());
  fs.writeFileSync(path.join(publicDir, 'favicon.gif'), finalFavGif);
  console.log(`✓ Created public/favicon.gif (${(finalFavGif.length / 1024).toFixed(1)} KB)`);

  console.log('All brand assets generated successfully!');
}

generateAll().catch(err => {
  console.error('Failed to generate assets:', err);
  process.exit(1);
});
