// Runs before every build (and before `npm run dev`).
// For each JPG or PNG in public/uploads it writes, into public/gen/:
//   name-640.webp and name-1280.webp   smaller modern copies the pages load
//   name-draft.webp                    a line drawing of the same screen, shown before the real one wipes in
// Editors keep uploading ordinary JPGs; nothing here needs doing by hand.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'public/uploads';
const OUT = 'public/gen';
const INK = [12, 12, 12];
const PAPER = [250, 248, 244];

fs.mkdirSync(OUT, { recursive: true });
const fresh = (out, src) => fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs;
let made = 0;

for (const file of fs.readdirSync(SRC)) {
  if (!/\.(jpe?g|png)$/i.test(file) || /^partner-/.test(file) || /-sm\.jpg$/.test(file)) continue;
  const src = path.join(SRC, file);
  const name = file.replace(/\.[^.]+$/, '');
  const meta = await sharp(src).metadata();

  for (const w of [640, 1280]) {
    const out = path.join(OUT, `${name}-${w}.webp`);
    if (fresh(out, src)) continue;
    await sharp(src).resize({ width: w, withoutEnlargement: true }).webp({ quality: 74 }).toFile(out);
    made++;
  }

  // Drawings only for ordinary screen-shaped images, not phone or whole-page captures.
  if (meta.height / meta.width <= 1.25) {
    const out = path.join(OUT, `${name}-draft.webp`);
    if (!fresh(out, src)) {
      const { data, info } = await sharp(src)
        .resize({ width: 640 })
        .greyscale()
        .blur(0.7)
        .convolve({ width: 3, height: 3, kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1] })
        .negate()
        .linear(2.2, -270) // push faint texture to white, keep real edges
        .raw()
        .toBuffer({ resolveWithObject: true });
      // Recolour: white becomes paper, black becomes ink.
      const px = info.width * info.height;
      const rgb = Buffer.alloc(px * 3);
      for (let i = 0; i < px; i++) {
        const t = data[i * info.channels] / 255;
        for (let c = 0; c < 3; c++) rgb[i * 3 + c] = Math.round(INK[c] + (PAPER[c] - INK[c]) * t);
      }
      await sharp(rgb, { raw: { width: info.width, height: info.height, channels: 3 } }).webp({ quality: 60 }).toFile(out);
      made++;
    }
  }
}
console.log(`images: ${made} file(s) written to ${OUT}`);
