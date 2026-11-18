import { useEffect, useMemo, useState } from 'react';
import type { Module, Question, Track } from '../types';
import { allLessons, allModules, tracks } from '../data/tracks';
import { flashcards } from '../data/extras/flashcards';
import { href } from '../router';
import { useStore } from '../state/store';
import { fid, formatInterval, qid, type Grade } from '../state/srs';

const DAY = 86400000;
const EXAM_SECONDS = 25 * 60;
const MAX_EXAM_QUESTIONS = 20;

/* ------------------------------------------------------------------ */
/* Utilidades compartidas                                              */
/* ------------------------------------------------------------------ */

type MasteryLevel = 'Novato' | 'En curso' | 'Sólido' | 'Dominado';

function levelFor(value: number): MasteryLevel {
  if (value < 0.25) return 'Novato';
  if (value < 0.5) return 'En curso';
  if (value < 0.8) return 'Sólido';
  return 'Dominado';
}

/** Intervalo de Wilson: aproximación honesta al IC 95% de una proporción. */
function wilson(correct: number, total: number): [number, number] {
  if (total === 0) return [0, 0];
  const z = 1.96;
  const p = correct / total;
  const den = 1 + (z * z) / total;
  const center = (p + (z * z) / (2 * total)) / den;
  const margin = (z * Math.sqrt((p * (1 - p)) / total + (z * z) / (4 * total * total))) / den;
  return [Math.max(0, center - margin) * 100, Math.min(1, center + margin) * 100];
}

function shuffle<T>(items: T[]): T[] {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const STOP_WORDS = new Set([
  'para', 'como', 'cuando', 'porque', 'entre', 'sobre', 'desde', 'hasta',
  'este', 'esta', 'esto', 'todo', 'todos', 'sabe', 'saber', 'puede', 'tiene',
  'hacer', 'usar', 'bien', 'mal', 'los', 'las', 'una', 'uno', 'del', 'que', 'por',
  'con', 'sin', 'son', 'sus', 'más', 'muy', 'cada', 'otro', 'nada', 'solo'
]);

/** Palabras de los metadatos de un módulo: sirven para medir proximidad. */
function tokenSet(module: Module): Set<string> {
  const out = new Set<string>();
  module.lessons.forEach(lesson => {
    const text = [
      ...lesson.objectives,
      ...(lesson.tags ?? []),
      ...(lesson.prereqs ?? []),
      ...(lesson.objectiveIds ?? [])
    ].join(' ').toLowerCase();
    text.split(/[^a-z0-9áéíóúñ]+/).forEach(word => {
      if (word.length >= 5 && !STOP_WORDS.has(word)) out.add(word);
    });
  });
  return out;
}

type Week = { key: string; label: string; start: number; upTo: number };

/** Ocho semanas naturales (lunes a domingo) terminando en la actual. */
function lastEightWeeks(): Week[] {
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const todayMs = today.getTime();
  const monday = todayMs - ((today.getUTCDay() + 6) % 7) * DAY;
  const weeks: Week[] = [];
  for (let i = 7; i >= 0; i--) {
    const start = monday - i * 7 * DAY;
    const end = start + 6 * DAY;
    const date = new Date(start);
    weeks.push({
      key: date.toISOString().slice(0, 10),
      label: `${date.getUTCDate()}/${date.getUTCMonth() + 1}`,
      start,
      upTo: Math.min(end, todayMs)
    });
  }
  return weeks;
}

function heatColor(dayCount: number): string {
  if (dayCount === 0) return 'var(--paper)';
  if (dayCount <= 2) return '#DED7CB';
  if (dayCount <= 4) return '#B9AA96';
  return '#877660';
}

/* ------------------------------------------------------------------ */
/* MasteryPage                                                         */
/* ------------------------------------------------------------------ */

type ModuleStat = {
  track: Track;
  module: Module;
  mastery: number;
  doneLessons: number;
  totalLessons: number;
  correctQuizzes: number;
  totalQuizzes: number;
  stableItems: number;
  totalSrs: number;
};

type Neighbor = { id: string; title: string; shared: number; origin: 'metadatos' | 'secuencia' };

export function MasteryPage() {
  const { state } = useStore();
  const lessonCount = useMemo(() => allLessons().length, []);

  const stats = useMemo<ModuleStat[]>(() => tracks.flatMap(track => track.modules.map(module => {
    let totalQuizzes = 0;
    let correctQuizzes = 0;
    const srsIds = new Set<string>();

    module.lessons.forEach(lesson => {
      srsIds.add(`ex:${lesson.id}`);
      (lesson.quiz ?? []).forEach((question, i) => {
        totalQuizzes += 1;
        srsIds.add(qid(lesson.id, i));
        if (state.quiz[`${lesson.id}-q${i}`] === question.answer) correctQuizzes += 1;
      });
    });
    flashcards.filter(card => card.module === module.id).forEach(card => srsIds.add(fid(card.id)));

    const doneLessons = module.lessons.filter(lesson => state.progress[lesson.id] === 'done').length;
    const stableItems = Object.values(state.srs).filter(record => srsIds.has(record.id) && record.stability > 7).length;

    // Dominio = 0.4·lecciones + 0.4·quizzes + 0.2·SRS estables, sobre el total
    // de cada dimensión. Las dimensiones sin ítems no penalizan la media.
    const dimensions = [
      { got: doneLessons, total: module.lessons.length, weight: 0.4 },
      { got: correctQuizzes, total: totalQuizzes, weight: 0.4 },
      { got: stableItems, total: srsIds.size, weight: 0.2 }
    ];
    const active = dimensions.filter(d => d.total > 0);
    const weightSum = active.reduce((sum, d) => sum + d.weight, 0);
    const mastery = weightSum > 0
      ? active.reduce((sum, d) => sum + d.weight * (d.got / d.total), 0) / weightSum
      : 0;

    return {
      track, module, mastery, doneLessons,
      totalLessons: module.lessons.length,
      correctQuizzes, totalQuizzes, stableItems, totalSrs: srsIds.size
    };
  })), [state.progress, state.quiz, state.srs]);

  const neighbors = useMemo(() => {
    const map = new Map<string, Neighbor[]>();
    stats.forEach(stat => {
      const mine = tokenSet(stat.module);
      const found: Neighbor[] = stats
        .filter(other => other.module.id !== stat.module.id)
        .map(other => {
          let shared = 0;
          tokenSet(other.module).forEach(token => { if (mine.has(token)) shared += 1; });
          return { other, shared };
        })
        .filter(x => x.shared > 0)
        .sort((a, b) => b.shared - a.shared)
        .slice(0, 3)
        .map(x => ({ id: x.other.module.id, title: x.other.module.title, shared: x.shared, origin: 'metadatos' as const }));

      if (found.length === 0) {
        const sameTrack = stats.filter(other => other.track.id === stat.track.id);
        const pos = sameTrack.findIndex(other => other.module.id === stat.module.id);
        [sameTrack[pos - 1], sameTrack[pos + 1]].forEach(other => {
          if (other) found.push({ id: other.module.id, title: other.module.title, shared: 0, origin: 'secuencia' });
        });
      }
      map.set(stat.module.id, found);
    });
    return map;
  }, [stats]);

  const weeks = useMemo(() => lastEightWeeks(), []);
  const practiceTimes = useMemo(
    () => state.practiceDays
      .map(day => Date.parse(`${day}T00:00:00Z`))
      .filter(time => !Number.isNaN(time)),
    [state.practiceDays]
  );
  const totalByWeek = weeks.map(week =>
    practiceTimes.filter(time => time >= week.start && time <= week.upTo).length
  );

  return <div className="page mastery-page">
    <header className="page-header">
      <div className="sheet-eyebrow">DOMINIO / MAPA DE CONOCIMIENTO</div>
      <h1>Dominio y repaso</h1>
      <p>Una lectura honesta de lo que has consolidado: lecciones terminadas, quizzes acertados y recuerdos que ya aguantan más de una semana. Todo se calcula con los datos guardados en este dispositivo.</p>
      <div className="chips">
        <span>{stats.length} módulos</span>
        <span>{lessonCount} lecciones</span>
        <span>{state.practiceDays.length} días de práctica</span>
        <span>{Object.values(state.srs).filter(r => r.stability > 7).length} ítems estables</span>
      </div>
    </header>

    <section>
      <h2 className="section-title">Dominio por módulo</h2>
      <div className="module-grid">
        {stats.map((stat, i) => {
          const pct = Math.round(stat.mastery * 100);
          return <a key={stat.module.id} className="module-card" href={href(`/track/${stat.track.id}/${stat.module.id}`)}>
            <span className="module-num">{String(i + 1).padStart(2, '0')}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3>{stat.module.title}</h3>
              <p>{stat.track.title} · {stat.totalLessons} lecciones · {stat.totalQuizzes} preguntas</p>
              <div className="module-bar"><div style={{ width: `${pct}%` }} /></div>
              <div className="module-meta">
                <span>{levelFor(stat.mastery)}</span>
                <span>{pct}% · {stat.doneLessons}/{stat.totalLessons} lecciones · {stat.correctQuizzes}/{stat.totalQuizzes} quizzes · {stat.stableItems}/{stat.totalSrs} estables</span>
              </div>
            </div>
          </a>;
        })}
      </div>
    </section>

    <section style={{ marginTop: 30 }}>
      <h2 className="section-title">Grafo de proximidad de objetivos</h2>
      <div className="callout apunte">
        <div className="callout-title">Cómo leer este grafo</div>
        <p style={{ margin: 0 }}>Nota: es un grafo de proximidad derivado de metadatos, no un prerrequisito verificado. Las aristas se infieren de objetivos, etiquetas y secuencia de publicación; indican cercanía temática, no dependencia demostrada.</p>
      </div>
      <div className="module-grid">
        {stats.map(stat => {
          const near = neighbors.get(stat.module.id) ?? [];
          return <div key={stat.module.id} className="module-card" style={{ display: 'block' }}>
            <h3><a href={href(`/track/${stat.track.id}/${stat.module.id}`)}>{stat.module.title}</a></h3>
            <p style={{ lineHeight: 1.7 }}>
              Vecinos: {near.length === 0 ? 'sin señales de proximidad' : near.map((n, i) => {
                const target = stats.find(s => s.module.id === n.id);
                return <span key={n.id}>
                  <a href={href(`/track/${target?.track.id ?? stat.track.id}/${n.id}`)}>{n.title}</a>
                  <span className="muted">{n.origin === 'metadatos' ? ` (${n.shared} señales)` : ' (secuencia)'}</span>
                  {i < near.length - 1 ? ' · ' : ''}
                </span>;
              })}
            </p>
          </div>;
        })}
      </div>
    </section>

    <section style={{ marginTop: 30 }}>
      <h2 className="section-title">Mapa de calor de práctica · últimas 8 semanas</h2>
      <p className="muted">Cada celda cuenta los días con al menos una respuesta de repetición espaciada. La intensidad es actividad real, no una estimación.</p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 12, minWidth: 620 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '6px 8px', fontWeight: 600 }}>Módulo</th>
              {weeks.map((week, i) => <th key={week.key} style={{ textAlign: 'center', padding: '6px 4px', fontWeight: 500, color: 'var(--muted)' }}>
                {week.label}<span style={{ display: 'block', fontWeight: 400 }}>{totalByWeek[i]} d</span>
              </th>)}
            </tr>
          </thead>
          <tbody>
            {stats.map(stat => <tr key={stat.module.id}>
              <td style={{ padding: '7px 8px', borderTop: '1px solid var(--line)' }}>
                <a href={href(`/track/${stat.track.id}/${stat.module.id}`)}>{stat.module.title}</a>
              </td>
              {weeks.map(week => {
                const count = practiceTimes.filter(time => time >= week.start && time <= week.upTo).length;
                return <td key={week.key} style={{ padding: '4px 4px', borderTop: '1px solid var(--line)' }}>
                  <div title={`Semana del ${week.label}: ${count} días de práctica`}
                    style={{ height: 22, borderRadius: 2, background: heatColor(count), border: '1px solid var(--line)' }} />
                </td>;
              })}
            </tr>)}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
        <span className="muted">Menos</span>
        {[0, 1, 3, 5].map(n => <span key={n} title={`${n} días`}
          style={{ width: 18, height: 12, borderRadius: 2, background: heatColor(n), border: '1px solid var(--line)' }} />)}
        <span className="muted">Más</span>
      </div>
    </section>
  </div>;
}

/* ------------------------------------------------------------------ */
/* Question (misma tarjeta que usan las lecciones y el modo práctica)  */
/* ------------------------------------------------------------------ */

function Question({ question, chosen, onChoose, reveal, previous }: {
  question: Question;
  chosen?: number;
  onChoose: (index: number) => void;
  reveal?: boolean;
  previous?: number;
}) {
  return <div className="quiz-card">
    <div className="quiz-q">{question.q}</div>
    <div className="quiz-options">{question.options.map((option, j) => {
      const cls = reveal && chosen !== undefined
        ? (j === question.answer ? 'correct' : j === chosen ? 'wrong' : 'dim')
        : '';
      return <button key={j} className={cls}
        style={!reveal && chosen === j ? { borderColor: 'var(--accent)', borderWidth: 2 } : undefined}
        onClick={() => onChoose(j)} disabled={!!reveal}
      >{option}</button>;
    })}</div>
    {previous !== undefined && <p className="muted" style={{ fontSize: 12, marginTop: 10 }}>
      Referencia de tus respuestas anteriores: {previous === question.answer ? 'acertaste esta pregunta' : 'la fallaste'}. Este examen no modifica ese registro.
    </p>}
    {reveal && chosen !== undefined && <div className={`quiz-why ${chosen === question.answer ? 'ok' : 'bad'}`}>{question.why}</div>}
  </div>;
}

/* ------------------------------------------------------------------ */
/* ExamPage                                                            */
/* ------------------------------------------------------------------ */

type ExamQuestion = Question & { key: string; objectives: string[]; lessonTitle: string };

export function ExamPage({ moduleId }: { moduleId: string }) {
  const { state } = useStore();
  const found = useMemo(() => allModules().find(x => x.module.id === moduleId), [moduleId]);

  const [attempt, setAttempt] = useState(0);
  const questions = useMemo<ExamQuestion[]>(() => {
    if (!found) return [];
    const list: ExamQuestion[] = [];
    found.module.lessons.forEach(lesson => {
      (lesson.quiz ?? []).forEach((question, i) => list.push({
        q: question.q,
        options: question.options,
        answer: question.answer,
        why: question.why,
        key: `${lesson.id}-q${i}`,
        objectives: lesson.objectives.length > 0 ? lesson.objectives : [lesson.title],
        lessonTitle: lesson.title
      }));
    });
    return shuffle(list).slice(0, MAX_EXAM_QUESTIONS);
  }, [found, attempt]);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [remaining, setRemaining] = useState(EXAM_SECONDS);
  const [submitted, setSubmitted] = useState(false);
  const [review, setReview] = useState(false);

  useEffect(() => {
    setIndex(0);
    setAnswers({});
    setRemaining(EXAM_SECONDS);
    setSubmitted(false);
    setReview(false);
  }, [moduleId, attempt]);

  const timeUp = remaining <= 0;
  useEffect(() => {
    if (submitted || timeUp) return;
    const timer = window.setInterval(() => setRemaining(seconds => Math.max(0, seconds - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [submitted, timeUp]);

  useEffect(() => {
    if (timeUp && !submitted) setSubmitted(true);
  }, [timeUp, submitted]);

  const total = questions.length;
  const current = questions[index];
  const answeredCount = questions.filter(q => answers[q.key] !== undefined).length;
  const correctCount = questions.filter(q => answers[q.key] === q.answer).length;
  const failed = questions.filter(q => answers[q.key] !== undefined && answers[q.key] !== q.answer);
  const [ciLow, ciHigh] = wilson(correctCount, total);
  const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const minutes = String(Math.floor(remaining / 60)).padStart(2, '0');
  const seconds = String(remaining % 60).padStart(2, '0');

  const byObjective = useMemo(() => {
    const map = new Map<string, { total: number; correct: number }>();
    questions.forEach(q => q.objectives.forEach(objective => {
      const row = map.get(objective) ?? { total: 0, correct: 0 };
      row.total += 1;
      if (answers[q.key] === q.answer) row.correct += 1;
      map.set(objective, row);
    }));
    return [...map.entries()]
      .map(([objective, row]) => ({ objective, ...row }))
      .sort((a, b) => b.total - a.total);
  }, [questions, answers]);

  const restart = () => setAttempt(n => n + 1);

  if (!found) return <div className="page">
    <header className="page-header"><h1>Examen</h1><p>Ese módulo no existe en la academia.</p></header>
    <div className="callout aviso"><div className="callout-title">Módulo no encontrado</div>
      <p style={{ margin: 0 }}>Vuelve al <a href={href('/')}>inicio</a> y elige un módulo desde su ruta.</p>
    </div>
  </div>;

  if (total === 0) return <div className="page">
    <header className="page-header"><h1>Examen · {found.module.title}</h1><p>Examen cronometrado de 25 minutos sobre este módulo.</p></header>
    <div className="callout"><div className="callout-title">Sin preguntas</div>
      <p style={{ margin: 0 }}>Este módulo todavía no tiene preguntas de quiz, así que no hay examen que mostrar.</p>
    </div>
  </div>;

  if (submitted && review) return <div className="page">
    <header className="page-header">
      <div className="sheet-eyebrow">EXAMEN / REPASO DE FALLADAS</div>
      <h1>{found.module.title}</h1>
      <p>Solo consulta: repasa qué fallaste y por qué. Tus respuestas anteriores y tu historial permanecen intactos.</p>
    </header>
    {failed.length === 0 ? (
      <div className="callout"><div className="callout-title">Sin fallos</div><p style={{ margin: 0 }}>No hay preguntas falladas en este intento.</p></div>
    ) : failed.map(q => <div key={q.key} className="quiz-card">
      <div className="quiz-q">{q.q}</div>
      <p className="muted" style={{ fontSize: 12, margin: '0 0 8px' }}>{q.lessonTitle}</p>
      <div className="quiz-why bad">Tu respuesta: {answers[q.key] === undefined ? 'sin responder' : q.options[answers[q.key]]}</div>
      <div className="quiz-why ok">Correcta: {q.options[q.answer]}</div>
      <p className="muted" style={{ fontSize: 13, marginBottom: 0 }}>{q.why}</p>
    </div>)}
    <div style={{ marginTop: 18, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <button className="btn" onClick={() => setReview(false)}>Volver al resultado</button>
      <button className="btn btn-ghost" onClick={restart}>Nuevo examen</button>
    </div>
  </div>;

  if (submitted) return <div className="page">
    <header className="page-header">
      <div className="sheet-eyebrow">EXAMEN / RESULTADO</div>
      <h1>{found.module.title}</h1>
      <p>Resultado de este intento. Las respuestas se han corregido sobre {total} preguntas; las que dejaste sin responder cuentan como fallo.</p>
    </header>
    <div className="sheet" style={{ maxWidth: 760 }}>
      <div className="sheet-head">
        <div className="sheet-title">{score}% de acierto</div>
        <p className="sheet-subtitle">{correctCount} aciertos de {total} preguntas · {answeredCount} respondidas</p>
      </div>
      <div className="module-bar" style={{ height: 8 }}><div style={{ width: `${score}%` }} /></div>
      <div className="callout nota" style={{ marginBottom: 0 }}>
        <div className="callout-title">Precaución con la nota</div>
        <p style={{ margin: 0 }}>IC 95% aproximado (intervalo de Wilson): <strong>{Math.round(ciLow)}% – {Math.round(ciHigh)}%</strong>. Con {total} preguntas el margen es amplio; esta nota es una estimación, no una medición exacta de tu dominio.</p>
      </div>

      <h3 style={{ marginTop: 22, fontSize: 16 }}>Desglose por objetivo</h3>
      <div style={{ display: 'grid', gap: 12 }}>
        {byObjective.map(row => {
          const pct = Math.round((row.correct / row.total) * 100);
          return <div key={row.objective}>
            <div className="module-meta" style={{ marginTop: 0 }}>
              <span>{row.objective}</span><span>{row.correct}/{row.total} · {pct}%</span>
            </div>
            <div className="module-bar"><div style={{ width: `${pct}%` }} /></div>
          </div>;
        })}
      </div>

      <div style={{ marginTop: 22, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="btn" onClick={() => setReview(true)}>Repasar falladas ({failed.length})</button>
        <button className="btn btn-ghost" onClick={restart}>Repetir examen</button>
      </div>
    </div>
  </div>;

  return <div className="page exam-page">
    <header className="page-header">
      <div className="sheet-eyebrow">EXAMEN / {found.track?.title ?? found.module.title}</div>
      <h1>Examen · {found.module.title}</h1>
      <p>{total} preguntas aleatorias del módulo, una por pantalla. Tienes 25 minutos. Puedes volver y cambiar cualquier respuesta antes de terminar.</p>
    </header>

    <div className="filters" style={{ alignItems: 'center' }}>
      <span className="badge" style={{ fontSize: 13, color: remaining < 300 ? 'var(--red)' : 'var(--ink)' }}>
        {minutes}:{seconds} restantes
      </span>
      <span className="count">Pregunta {index + 1} de {total} · {answeredCount} respondidas</span>
      <button className="btn" onClick={() => setSubmitted(true)}>Terminar examen</button>
    </div>

    <div className="callout nota">
      <div className="callout-title">Referencia, no respuesta</div>
      <p style={{ margin: 0 }}>Junto a cada pregunta se indica si la acertaste en una sesión anterior. El examen es en local y no escribe en tu historial: solo consulta <span className="muted">state.quiz</span>.</p>
    </div>

    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
      {questions.map((q, i) => <button key={q.key}
        className={`btn ${i === index ? '' : 'btn-ghost'}`}
        style={{ minWidth: 38, padding: '8px 10px', background: answers[q.key] !== undefined && i !== index ? '#EFF6F1' : undefined }}
        onClick={() => setIndex(i)}
        aria-label={`Ir a la pregunta ${i + 1}`}
      >{i + 1}</button>)}
    </div>

    {current && <>
      <p className="muted" style={{ fontSize: 12, marginBottom: 6 }}>{current.lessonTitle}</p>
      <Question question={current}
        chosen={answers[current.key]}
        onChoose={choice => setAnswers(prev => ({ ...prev, [current.key]: choice }))}
        previous={state.quiz[current.key]}
      />
    </>}

    <div className="lab-bottom-nav">
      <button className="btn btn-ghost" onClick={() => setIndex(i => Math.max(0, i - 1))} disabled={index === 0}>← Anterior</button>
      <button className="btn" onClick={() => index < total - 1 ? setIndex(i => i + 1) : setSubmitted(true)}>
        {index === total - 1 ? 'Terminar →' : 'Siguiente →'}
      </button>
      <span className="lab-kbd">← → para navegar</span>
    </div>
  </div>;
}

/* ------------------------------------------------------------------ */
/* ExplainPrompt                                                       */
/* ------------------------------------------------------------------ */

const GRADE_OPTIONS: { label: string; grade: Grade }[] = [
  { label: 'No lo supe', grade: 0 },
  { label: 'Parcial', grade: 1 },
  { label: 'Lo supe', grade: 3 }
];

function gradeLabel(grade: Grade): string {
  return GRADE_OPTIONS.find(option => option.grade === grade)?.label ?? 'Sin valorar';
}

export function ExplainPrompt({ lessonId, objectives, success }: {
  lessonId: string;
  objectives: string[];
  success: string[];
}) {
  const { state, gradeItem } = useStore();
  const [text, setText] = useState('');
  const [revealed, setRevealed] = useState(false);
  const itemId = `ex:${lessonId}`;
  const record = state.srs[itemId];

  return <div className="sheet">
    <div className="sheet-head">
      <div className="sheet-eyebrow">EXPLICAR SIN MIRAR</div>
      <div className="sheet-title">Explícalo con tus palabras</div>
      <p className="sheet-subtitle">Escribe cómo responderías a un compañero sin consultar la lección. Después destapa la rúbrica y juzga tu propia respuesta.</p>
    </div>

    <textarea value={text} onChange={e => setText(e.target.value)} rows={8}
      placeholder="Empieza por la idea central, da un ejemplo concreto y señala el error más habitual…"
      aria-label="Tu explicación" />

    <div className="sheet-actions" style={{ marginTop: 12 }}>
      {!revealed
        ? <button className="btn" onClick={() => setRevealed(true)}>He terminado, mostrar rúbrica</button>
        : <span className="muted">Rúbrica visible. Compara y autoevalúate.</span>}
    </div>

    {revealed && <div className="callout nota">
      <div className="callout-title">Rúbrica de la lección</div>
      <p style={{ margin: '0 0 6px', fontWeight: 650 }}>Objetivos</p>
      <ul style={{ margin: '0 0 14px', paddingLeft: 20, fontSize: 14 }}>
        {objectives.map((objective, i) => <li key={i}>{objective}</li>)}
      </ul>
      <p style={{ margin: '0 0 6px', fontWeight: 650 }}>Criterios de éxito</p>
      <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14 }}>
        {success.map((criterion, i) => <li key={i}>{criterion}</li>)}
      </ul>
    </div>}

    {revealed && <div style={{ marginTop: 14 }}>
      <p className="muted" style={{ marginBottom: 8 }}>¿Cómo te fue? Esta valoración alimenta tu repetición espaciada.</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {GRADE_OPTIONS.map(option => <button key={option.grade}
          className={`btn ${record?.lastGrade === option.grade ? '' : 'btn-ghost'}`}
          onClick={() => gradeItem(itemId, option.grade)}
        >{option.label}</button>)}
      </div>
      {record && <p className="muted" style={{ fontSize: 12, marginTop: 10 }}>
        Última autoevaluación: {gradeLabel(record.lastGrade)} · estabilidad {record.stability} días · próximo repaso {formatInterval(record)}.
      </p>}
    </div>}
  </div>;
}
