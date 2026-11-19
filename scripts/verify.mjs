// Auditoría de integridad del contenido. Ejecuta: node scripts/verify.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const read = p => readFileSync(p, 'utf8');
const src = 'src';
const extras = readdirSync('src/data/extras').filter(f => f.endsWith('.ts')).map(f => `src/data/extras/${f}`);
// Archivos de datos nuevos (bloques avanzados, Physical AI y banco de evaluación).
const newDataFiles = [
  'src/data/robotics/advanced.ts',
  'src/data/ai/advanced.ts',
  'src/data/physical/index.ts',
  'src/data/capstones.ts',
  'src/data/interviews.ts',
  'src/data/robotics/bridges.ts',
  'src/data/ai/bridges.ts',
  ...extras
];
const dataFiles = [
  'src/data/robotics/part1.ts', 'src/data/robotics/part2.ts', 'src/data/robotics/part3.ts',
  'src/data/ai/index.ts', 'src/data/ai/agentic.ts', 'src/data/labs.ts', 'src/data/shared.ts',
  ...newDataFiles
];
const all = dataFiles.map(read).join('\n');
let problems = 0;
const fail = (msg) => { console.log('  ✗ ' + msg); problems++; };
const ok = (msg) => console.log('  ✓ ' + msg);

console.log('\n=== Integridad de contenido ===\n');

// Lecciones y IDs (r = robótica, a = IA, p = Physical AI)
const lessonIds = [...all.matchAll(/id: '([rap]\d+-\d+)'/g)].map(m => m[1]);
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

// Laboratorios
const labSrc = read('src/data/labs.ts');
const labIds = [...labSrc.matchAll(/^\s+id: '(lab-[^']+)'/gm)].map(m => m[1]);
const dupLabs = labIds.filter((x, i) => labIds.indexOf(x) !== i);
if (dupLabs.length) fail('IDs de laboratorio duplicados: ' + [...new Set(dupLabs)].join(', '));
else ok(`${labIds.length} laboratorios con IDs únicos`);

const labBlocks = labSrc.slice(labSrc.indexOf('export const labs')).split(/\n\s*\{\s*\n/).slice(1);
const labProblems = [];
for (const b of labBlocks) {
  const id = ((b.match(/^\s+id: '(lab-[^']+)'/m) || [])[1]) || '?';
  const nodes = [...b.matchAll(/\{ id: '([^']+)'/g)].map(m => m[1]);
  const nodeSet = new Set(nodes);
  const edges = [...b.matchAll(/\{ from:\s*'([^']+)',\s*to:\s*'([^']+)'/g)];
  const badEdges = edges.flatMap(m => [m[1], m[2]]).filter(x => !nodeSet.has(x));
  if (badEdges.length) labProblems.push(`${id}: aristas hacia nodos inexistentes (${[...new Set(badEdges)].join(', ')})`);
  const steps = [...b.matchAll(/active:\s*\[([^\]]*)\]/g)];
  const badActive = steps.flatMap(m => [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1])).filter(x => !nodeSet.has(x));
  if (badActive.length) labProblems.push(`${id}: pasos con nodos inexistentes (${[...new Set(badActive)].join(', ')})`);
  const learn = ((b.match(/learn:\s*\[([^\]]*)\]/) || [])[1] || '');
  const learnCount = [...learn.matchAll(/'([^']+)'/g)].length;
  if (steps.length < 4) labProblems.push(`${id}: solo ${steps.length} pasos (mínimo 4)`);
  if (nodes.length < 4) labProblems.push(`${id}: solo ${nodes.length} nodos (mínimo 4)`);
  if (learnCount < 3) labProblems.push(`${id}: solo ${learnCount} items de aprendizaje (mínimo 3)`);
}
if (labProblems.length) labProblems.forEach(fail);
else ok(`${labBlocks.length} laboratorios íntegros: aristas, pasos y checklist coherentes`);

const cjkLabs = labSrc.split('\n').map((line, i) => /[\u3040-\u9fff\u3400-\u4dbf\uac00-\ud7af]/.test(line) ? i + 1 : null).filter(Boolean);
if (cjkLabs.length) fail('Caracteres CJK en src/data/labs.ts: ' + cjkLabs.slice(0, 8).join(', '));
else ok('Sin caracteres CJK en laboratorios');

// Capstones
const capSrc = read('src/data/capstones.ts');
const capstoneIds = [...capSrc.matchAll(/id: '(cap-[^']+)'/g)].map(m => m[1]);
if (capstoneIds.length !== 2) fail(`Se esperaban 2 capstones, hay ${capstoneIds.length}`);
const dupCaps = capstoneIds.filter((x, i) => capstoneIds.indexOf(x) !== i);
if (dupCaps.length) fail('IDs de capstone duplicados: ' + [...new Set(dupCaps)].join(', '));
else ok(`${capstoneIds.length} capstones con IDs únicos`);

const capBlocks = capSrc.slice(capSrc.indexOf('export const capstones')).split(/\n  \{\n/).slice(1);
const capProblems = [];
for (const b of capBlocks) {
  const id = ((b.match(/id: '(cap-[^']+)'/) || [])[1]) || '?';
  if (!/rubric:\s*\[/.test(b)) {
    capProblems.push(`${id}: sin rúbrica`);
    continue;
  }
  const criteria = [...b.matchAll(/criterion:/g)].length;
  if (criteria !== 5) capProblems.push(`${id}: rúbrica con ${criteria} criterios (esperados 5)`);
}
if (capProblems.length) capProblems.forEach(fail);
else ok(`${capBlocks.length} capstones íntegros: rúbrica de 5 criterios cada uno`);

// Entrevistas
const intSrc = read('src/data/interviews.ts');
const interviewIds = [...intSrc.matchAll(/id: '(int-[^']+)'/g)].map(m => m[1]);
if (interviewIds.length !== 150) fail(`Se esperaban 150 entrevistas, hay ${interviewIds.length}`);
const dupInt = interviewIds.filter((x, i) => interviewIds.indexOf(x) !== i);
if (dupInt.length) fail('IDs de entrevista duplicados: ' + [...new Set(dupInt)].join(', '));
else ok(`${interviewIds.length} entrevistas con IDs únicos`);

const intBlocks = intSrc.slice(intSrc.indexOf('export const interviewQuestions')).split(/\n  \{\n/).slice(1);
const intProblems = [];
for (const b of intBlocks) {
  const id = ((b.match(/id: '(int-[^']+)'/) || [])[1]) || '?';
  if (!/answer:\s*\{/.test(b)) {
    intProblems.push(`${id}: sin respuesta estructurada`);
    continue;
  }
  for (const field of ['context', 'decision', 'tradeoff']) {
    if (!new RegExp(`\\n\\s+${field}:`).test(b)) intProblems.push(`${id}: answer.${field} ausente`);
  }
  const followups = ((b.match(/followups:\s*\[([\s\S]*?)\]/) || [])[1]) || '';
  const followupCount = [...followups.matchAll(/'[^']*'/g)].length;
  if (followupCount !== 2) intProblems.push(`${id}: ${followupCount} followups (esperados 2)`);
}
if (intProblems.length) intProblems.forEach(fail);
else ok(`${intBlocks.length} entrevistas íntegras: contexto, decisión, compensación y 2 followups`);

// Caracteres CJK en los archivos nuevos
const cjk = /[\u3040-\u9fff\u3400-\u4dbf\uac00-\ud7af]/;
const cjkNew = [];
for (const p of newDataFiles) {
  read(p).split('\n').forEach((line, i) => { if (cjk.test(line)) cjkNew.push(`${p}:${i + 1}`); });
}
if (cjkNew.length) fail('Caracteres CJK en archivos nuevos: ' + cjkNew.slice(0, 8).join(', '));
else ok('Sin caracteres CJK en los archivos nuevos');

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
for (const p of dataFiles.filter(f => f.includes('robotics/') || f.includes('/ai/') || f.includes('/physical/'))) {
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
const expansion = read('src/data/extras/expansion.ts');
const urls = [...`${shared}\n${expansion}`.matchAll(/url:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
const dupUrls = urls.filter((x, i) => urls.indexOf(x) !== i);
if (dupUrls.length) fail('URLs duplicadas: ' + dupUrls.length);
else ok(`${urls.length} recursos con URLs únicas`);

const resumen = `${lessonIds.length} lecciones, ${labIds.length} laboratorios, ${capstoneIds.length} capstones, ${interviewIds.length} entrevistas`;
console.log('\n' + (problems === 0 ? `✅ Todo correcto · ${resumen}` : `❌ ${problems} problema(s) · ${resumen}`) + '\n');
process.exit(problems ? 1 : 0);
