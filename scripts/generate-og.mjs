import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const svg = readFileSync(join(__dirname, 'og-image.svg'), 'utf-8');

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
});

const pngData = resvg.render();
const pngBuffer = pngData.asPng();

const outPath = join(__dirname, '../public/og-image.png');
writeFileSync(outPath, pngBuffer);

console.log('✓ OG image generated at public/og-image.png');
