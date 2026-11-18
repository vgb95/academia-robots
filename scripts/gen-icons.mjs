// Genera los iconos PNG de la PWA sin dependencias externas.
// Dibuja un degradado + un "nodo/circuito" estilizado directamente en RGBA.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'public', 'icons');
mkdirSync(OUT, { recursive: true });

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return (~c) >>> 0;
}
function chunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}
function png(size, pixels) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    pixels.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

function render(size, maskable = false) {
  const p = Buffer.alloc(size * size * 4);
  const cx = size / 2, cy = size / 2;
  const pad = maskable ? size * 0.18 : 0; // zona segura para maskable
  const R = size * (maskable ? 0.30 : 0.40);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      // degradado diagonal azul -> violeta
      const t = (x / size) * 0.5 + (y / size) * 0.5;
      let r = Math.round(16 + t * 70), g = Math.round(22 + t * 40), b = Math.round(48 + t * 120);
      // redondear esquinas (no en maskable: el SO ya recorta)
      if (!maskable) {
        const rad = size * 0.22;
        const dx = Math.max(rad - x, 0, x - (size - rad));
        const dy = Math.max(rad - y, 0, y - (size - rad));
        if (dx * dx + dy * dy > rad * rad) { p[i + 3] = 0; continue; }
      }
      // anillo exterior
      const d = Math.hypot(x - cx, y - cy);
      if (Math.abs(d - R) < size * 0.018) { r = 140; g = 225; b = 255; }
      // nodos en cruz
      const arm = R * 0.62;
      const onArmX = Math.abs(y - cy) < size * 0.018 && Math.abs(x - cx) < arm + size * 0.05;
      const onArmY = Math.abs(x - cx) < size * 0.018 && Math.abs(y - cy) < arm + size * 0.05;
      if (onArmX || onArmY) { r = 110; g = 200; b = 245; }
      // chip central
      const half = R * 0.36;
      if (Math.abs(x - cx) < half && Math.abs(y - cy) < half) { r = 250; g = 250; b = 255; }
      // "cerebro" simplificado: dos líneas dentro del chip
      if (Math.abs(y - cy + half * 0.25) < size * 0.014 && Math.abs(x - cx) < half * 0.6) { r = 90; g = 60; b = 200; }
      if (Math.abs(y - cy - half * 0.25) < size * 0.014 && Math.abs(x - cx) < half * 0.6) { r = 90; g = 60; b = 200; }
      // pads de conexión
      for (const [nx, ny] of [[cx - R, cy], [cx + R, cy], [cx, cy - R], [cx, cy + R]]) {
        if (Math.hypot(x - nx, y - ny) < size * 0.035) { r = 255; g = 190; b = 90; }
      }
      p[i] = r; p[i + 1] = g; p[i + 2] = b; p[i + 3] = 255;
    }
  }
  return png(size, p);
}

writeFileSync(join(OUT, 'icon-192.png'), render(192));
writeFileSync(join(OUT, 'icon-512.png'), render(512));
writeFileSync(join(OUT, 'icon-maskable-512.png'), render(512, true));
writeFileSync(join(OUT, 'apple-touch-icon.png'), render(180));
console.log('Iconos generados en', OUT);
