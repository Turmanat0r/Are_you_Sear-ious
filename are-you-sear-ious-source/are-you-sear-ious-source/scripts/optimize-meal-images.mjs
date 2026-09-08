import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';

const allCuts = [
  'pepper-ribeye',
  'strip-steak',
  'sirloin-steak',
  'pork-shoulder',
  'pork-chop',
  'pork-tenderloin',
  'smoky-chicken',
  'chicken-breast',
  'chicken-drumsticks',
  'lemon-salmon',
  'cod-fillet',
  'halibut-fillet',
];
if (!process.argv[2])
  throw new Error('Supply the directory containing the original meal PNGs.');
const inputDirectory = path.resolve(process.argv[2]);
const outputDirectory = path.resolve('public/meals');
const selected = process.argv.length > 3 ? process.argv.slice(3) : allCuts;
if (selected.some((id) => !allCuts.includes(id)))
  throw new Error('Unknown cut ID.');
await mkdir(outputDirectory, { recursive: true });
let originalBytes = 0,
  optimizedBytes = 0;
for (const id of selected) {
  const source = path.join(inputDirectory, id + '.png');
  const destination = path.join(outputDirectory, id + '.webp');
  const original = await stat(source);
  const result = await sharp(source)
    .rotate()
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(destination);
  originalBytes += original.size;
  optimizedBytes += result.size;
  console.log(
    JSON.stringify({
      id,
      sourceBytes: original.size,
      webpBytes: result.size,
      width: result.width,
      height: result.height,
    }),
  );
}
console.log(
  JSON.stringify({
    images: selected.length,
    originalBytes,
    optimizedBytes,
    savedPercent: +(100 * (1 - optimizedBytes / originalBytes)).toFixed(1),
  }),
);
