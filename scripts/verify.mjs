// Auditoría de integridad del contenido. Ejecuta: node scripts/verify.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const read = p => readFileSync(p, 'utf8');
const src = 'src';
const dataFiles = [
  'src/data/robotics/part1.ts', 'src/data/robotics/part2.ts', 'src/data/robotics/part3.ts',
  'src/data/ai/index.ts', 'src/data/shared.ts',
  ...readdirSync('src/data/extras').map(f => `src/data/extras/${f}`)
];
const all = dataFiles.map(read).join('\n');
let problems = 0;
const fail = (msg) => { console.log('  ✗ ' + msg); problems++; };
const ok = (msg) => console.log('  ✓ ' + msg);

console.log('\n=== Integridad de contenido ===\n');

// Lecciones y IDs
const lessonIds = [...all.matchAll(/id: '([ra]\d+-\d+)'/g)].map(m => m[1]);
const dup = lessonIds.filter((x, i) => lessonIds.indexOf(x) !== i);
if (dup.length) fail('IDs de lección duplicados: ' + [...new Set(dup)].join(', '));
else ok(`${lessonIds.length} lecciones con IDs únicos`);

// Diagramas
const diagramSrc = read('src/data/diagrams.ts');
const defined = new Set([...diagramSrc.matchAll(/^  ([a-z0-9_]+): \(\) =>/gm)].map(m => m[1]));
const used = new Set([...all.matchAll(/diagrama\('([a-z0-9_]+)'/g)].map(m => m[1]));
const missingDiagrams = [...used].filter(x => !defined.has(x));
if (missingDiagrams.length) fail('Diagramas inexistentes: ' + missingDiagrams.join(', '));
else ok(`${defined.size} diagramas definidos, ${used.size} usados, 0 referencias rotas`);

// Widgets
const widgetSrc = read('src/components/Widgets.tsx');
const widgetDefs = new Set([...widgetSrc.matchAll(/case '([a-z0-9-]+)':/g)].map(m => m[1]));
const usedWidgets = new Set([...all.matchAll(/widget\('([a-z0-9-]+)'/g)].map(m => m[1]));
const missingWidgets = [...usedWidgets].filter(x => !widgetDefs.has(x));
if (missingWidgets.length) fail('Widgets inexistentes: ' + missingWidgets.join(', '));
else ok(`${usedWidgets.size} widgets usados, todos disponibles`);

// Caracteres no españoles
const badChars = /[\u3040-\u9fff\u0400-\u04ff\u0600-\u06ff\uac00-\ud7af]/;
const bad = [];
for (const p of [...dataFiles, ...['src/App.tsx', 'src/main.tsx', 'src/router.ts', 'src/styles.css', 'index.html']]) {
  read(p).split('\n').forEach((line, i) => { if (badChars.test(line)) bad.push(`${p}:${i + 1}`); });
}
if (bad.length) fail('Caracteres no españoles en: ' + bad.slice(0, 8).join(', '));
else ok('Sin caracteres chinos/cirílicos/árabes accidentales');

// Marcadores de agente sin terminar
const markers = [...all.matchAll(/__APPEND_HERE__|__END__|\/\/ TODO|FIXME/g)].map(m => m[0]);
if (markers.length) fail('Marcadores pendientes: ' + [...new Set(markers)].join(', '));
else ok('Sin marcadores de trabajo pendiente');

// Prácticas y quizzes
let noPractice = 0, noQuiz = 0;
for (const p of dataFiles.filter(f => f.includes('robotics/') || f.includes('/ai/'))) {
  const s = read(p);
  const blocks = s.split(/\n\s*L\(\{/).slice(1);
  for (const b of blocks) {
    if (!/practice:\s*\{/.test(b)) noPractice++;
    if (!/quiz:\s*\[/.test(b)) noQuiz++;
  }
}
if (noPractice || noQuiz) console.log(`  ! ${noPractice} lecciones sin práctica, ${noQuiz} sin quiz`);
else ok('Todas las lecciones tienen práctica y quiz');

// Recursos
const shared = read('src/data/shared.ts');
const urls = [...shared.matchAll(/url:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
const dupUrls = urls.filter((x, i) => urls.indexOf(x) !== i);
if (dupUrls.length) fail('URLs duplicadas: ' + dupUrls.length);
else ok(`${urls.length} recursos con URLs únicas`);

console.log('\n' + (problems === 0 ? '✅ Todo correcto' : `❌ ${problems} problema(s)`) + '\n');
process.exit(problems ? 1 : 0);
