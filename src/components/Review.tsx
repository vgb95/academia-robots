import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStore } from '../state/store';
import { fid, formatInterval, isDue, qid, type Grade, type SrsRecord } from '../state/srs';
import { allLessons, findLesson } from '../data/tracks';
import { flashcards, type Flashcard } from '../data/extras/flashcards';
import type { Question } from '../types';

type QueueItem =
  | { id: string; kind: 'flashcard'; card: Flashcard }
  | { id: string; kind: 'quiz'; question: Question; lessonTitle: string };

const GRADE_LABELS = ['Olvidado', 'Difícil', 'Bien', 'Fácil'] as const;
const GRADE_STYLES: React.CSSProperties[] = [
  { color: 'var(--red)', borderColor: 'var(--red)' },
  { color: 'var(--amber)', borderColor: 'var(--amber)' },
  {},
  { background: 'var(--green)', borderColor: 'var(--green)', color: '#fff' }
];

/** Clave local YYYY-MM-DD, igual a la que guarda `gradeItem`. */
function dayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Barajado determinista: la misma fecha produce siempre el mismo orden. */
function seededShuffle<T>(items: T[], seed: number): T[] {
  const a = items.slice();
  let s = seed || 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQueue(srs: Record<string, SrsRecord>): QueueItem[] {
  const candidates: QueueItem[] = [];

  for (const card of flashcards) {
    const id = fid(card.id);
    if (isDue(srs[id])) candidates.push({ id, kind: 'flashcard', card });
  }
  for (const { lesson } of allLessons()) {
    (lesson.quiz ?? []).forEach((question, i) => {
      const id = qid(lesson.id, i);
      if (isDue(srs[id])) candidates.push({ id, kind: 'quiz', question, lessonTitle: lesson.title });
    });
  }

  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  return seededShuffle(candidates, seed)
    .map(item => ({ item, lapses: srs[item.id]?.lapses ?? 0 }))
    .sort((a, b) => b.lapses - a.lapses)
    .slice(0, 15)
    .map(x => x.item);
}

function streakLength(days: string[]): number {
  const set = new Set(days);
  const d = new Date();
  if (!set.has(dayKey(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

function practiceCells(): (string | null)[] {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - 27);
  const offset = (start.getDay() + 6) % 7; // lunes = 0
  const cells: (string | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let i = 0; i < 28; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    cells.push(dayKey(d));
  }
  return cells;
}

const eyebrowStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10.5,
  fontWeight: 600,
  letterSpacing: '.12em',
  textTransform: 'uppercase',
  color: 'var(--accent)'
};

export function ReviewPage() {
  const { state, ready, answerQuiz, gradeItem } = useStore();
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [built, setBuilt] = useState(false);
  const [index, setIndex] = useState(0);
  const [reviewed, setReviewed] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [chosen, setChosen] = useState<number | undefined>(undefined);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (ready && !built) { setQueue(buildQueue(state.srs)); setBuilt(true); }
  }, [ready, built, state.srs]);

  const total = queue.length;
  const item = queue[index];
  const pct = total ? Math.round(reviewed / total * 100) : 0;
  const streak = useMemo(() => streakLength(state.practiceDays), [state.practiceDays]);
  const cells = useMemo(() => practiceCells(), []);
  const doneSet = useMemo(() => new Set(state.practiceDays), [state.practiceDays]);
  const rec = item ? state.srs[item.id] : undefined;

  const advance = useCallback(() => {
    if (finished || total === 0) return;
    if (index >= total - 1) { setFinished(true); return; }
    setIndex(i => i + 1);
    setRevealed(false);
    setChosen(undefined);
    setAnswered(false);
  }, [finished, index, total]);

  const gradeCard = useCallback((grade: Grade) => {
    if (!item || item.kind !== 'flashcard' || answered) return;
    gradeItem(item.id, grade);
    setRevealed(true);
    setAnswered(true);
    setReviewed(n => n + 1);
    if (grade >= 2) setCorrect(n => n + 1);
  }, [item, answered, gradeItem]);

  const answerQuestion = useCallback((choice: number) => {
    if (!item || item.kind !== 'quiz' || answered) return;
    const ok = choice === item.question.answer;
    answerQuiz(item.id, choice);
    gradeItem(item.id, ok ? 3 : 1);
    setChosen(choice);
    setAnswered(true);
    setReviewed(n => n + 1);
    if (ok) setCorrect(n => n + 1);
  }, [item, answered, answerQuiz, gradeItem]);

  const restart = useCallback(() => {
    setQueue(buildQueue(state.srs));
    setIndex(0);
    setReviewed(0);
    setCorrect(0);
    setRevealed(false);
    setChosen(undefined);
    setAnswered(false);
    setFinished(false);
  }, [state.srs]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) return;
      if (finished || total === 0 || !item) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (item.kind === 'flashcard' && !revealed && !answered) { setRevealed(true); return; }
        if (answered) advance();
        return;
      }
      if (/^[1-4]$/.test(e.key)) {
        e.preventDefault();
        if (answered) return;
        const n = Number(e.key) - 1;
        if (item.kind === 'flashcard') gradeCard(n as Grade);
        else if (n < item.question.options.length) answerQuestion(n);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [finished, total, item, revealed, answered, advance, gradeCard, answerQuestion]);

  return <div className="page">
    <div className="breadcrumb"><span>Inicio</span><span>/</span><span>Repaso</span></div>

    <header className="page-header">
      <div style={eyebrowStyle}>REPETICIÓN ESPACIADA</div>
      <h1>Repaso de hoy</h1>
      <p>Una cola corta de lo que toca repasar ahora: flashcards y preguntas de quiz que tu memoria pide revisar. Califica con honestidad y el algoritmo decidirá cuándo volver a verlo.</p>
    </header>

    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <div style={{ flex: '1 1 480px', minWidth: 0 }}>
        <div className="track-bar" style={{ marginBottom: 14 }}><div style={{ width: `${pct}%` }} /></div>

        {finished ? (
          <div className="quiz-card" style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ ...eyebrowStyle, justifyContent: 'center' }}>REPETICIÓN ESPACIADA / RESUMEN</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, letterSpacing: '-.035em', margin: '10px 0 6px' }}>Repaso completado</h2>
            <p style={{ color: 'var(--muted)', fontSize: 13, margin: '0 0 16px' }}>Has llegado al final de la cola de hoy.</p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-2)', marginBottom: 12 }}>
              {correct} aciertos · {reviewed} repasados · {total} debidos
            </div>
            <div className="track-bar"><div style={{ width: `${total ? Math.round(correct / total * 100) : 0}%` }} /></div>
            <button className="btn" style={{ marginTop: 18 }} onClick={restart}>Reiniciar cola</button>
          </div>
        ) : !ready ? (
          <div className="quiz-card" style={{ maxWidth: 640, margin: '0 auto', color: 'var(--muted)', fontSize: 14 }}>
            Preparando tu cola de repaso…
          </div>
        ) : !item ? (
          <div className="quiz-card" style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ ...eyebrowStyle, justifyContent: 'center' }}>TODO AL DÍA</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, letterSpacing: '-.035em', margin: '10px 0 6px' }}>Nada pendiente hoy</h2>
            <p style={{ color: 'var(--muted)', fontSize: 13, margin: '0 0 16px' }}>No hay tarjetas ni preguntas debidas. Vuelve mañana o sigue avanzando en las lecciones.</p>
            <button className="btn btn-ghost" onClick={restart}>Recalcular cola</button>
          </div>
        ) : (
          <>
            <div style={{ ...eyebrowStyle, marginBottom: 10 }}>
              {index + 1} / {total} · {item.kind === 'flashcard' ? 'FLASHCARD' : 'QUIZ'}
            </div>

            {item.kind === 'flashcard' ? (
              <>
                <div style={{ ...eyebrowStyle, color: 'var(--muted)', marginBottom: 8 }}>{item.card.module.toUpperCase()}</div>
                <div
                  className={`flashcard${revealed ? ' flipped' : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-label="Girar flashcard"
                  onClick={() => setRevealed(r => !r)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setRevealed(r => !r); } }}
                >
                  <div className="flashcard-inner">
                    <div className="flashcard-face front">
                      <small>Flashcard · {item.card.module}</small>
                      <h2>{item.card.front}</h2>
                      {item.card.hint && <div className="hint">{item.card.hint}</div>}
                    </div>
                    <div className="flashcard-face back">
                      <strong>Respuesta</strong>
                      <p>{item.card.back}</p>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
                  {GRADE_LABELS.map((label, g) => (
                    <button
                      key={label}
                      className="btn btn-ghost"
                      disabled={answered}
                      style={{ ...GRADE_STYLES[g], flex: '1 1 110px' }}
                      onClick={() => gradeCard(g as Grade)}
                    >
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: .7, marginRight: 5 }}>{g + 1}</span>{label}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 10 }}>Toca la tarjeta o pulsa → para ver la respuesta. Pulsa 1–4 para calificar.</div>
              </>
            ) : (
              <div className="quiz-card">
                <div style={{ ...eyebrowStyle, color: 'var(--muted)', marginBottom: 8 }}>{item.lessonTitle}</div>
                <div className="quiz-q">{item.question.q}</div>
                <div className="quiz-options">
                  {item.question.options.map((op, j) => {
                    const cls = chosen === undefined ? '' : j === item.question.answer ? 'correct' : j === chosen ? 'wrong' : 'dim';
                    return <button key={j} className={cls} disabled={answered} onClick={() => answerQuestion(j)}>{op}</button>;
                  })}
                </div>
              </div>
            )}

            {answered && (
              <div style={{ marginTop: 14 }}>
                {item.kind === 'quiz' && (
                  <div className={`quiz-why ${chosen === item.question.answer ? 'ok' : 'bad'}`}>{item.question.why}</div>
                )}
                {rec && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', marginTop: 10 }}>
                    Próximo repaso: {formatInterval(rec)}
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginTop: 18 }}>
              <button className="btn" disabled={!answered} onClick={advance}>
                {index === total - 1 ? 'Ver resumen →' : 'Siguiente →'}
              </button>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--faint)' }}>1–4 calificar · → siguiente</span>
            </div>
          </>
        )}
      </div>

      <aside style={{ flex: '0 1 250px', display: 'grid', gap: 12 }}>
        <div className="lab-rail-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            <span>Racha</span><span style={{ color: 'var(--accent)', fontWeight: 600 }}>{streak}d</span>
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 21, letterSpacing: '-.03em', margin: '8px 0 2px' }}>
            {streak} {streak === 1 ? 'día' : 'días'} consecutivos
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>Últimas 4 semanas de práctica</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((w, i) => (
              <div key={i} style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--faint)' }}>{w}</div>
            ))}
            {cells.map((key, i) => key === null
              ? <div key={`empty-${i}`} />
              : <div key={key} title={key} style={{ aspectRatio: '1 / 1', borderRadius: 2, border: '1px solid var(--line)', background: doneSet.has(key) ? 'var(--accent)' : 'var(--line-2)' }} />
            )}
          </div>
        </div>

        <div className="lab-rail-card">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>Cola de hoy</div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, letterSpacing: '-.03em', margin: '8px 0 2px' }}>{reviewed} / {total}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{reviewed} repasados / {total} debidos</div>
          <div className="track-bar"><div style={{ width: `${pct}%` }} /></div>
          <div style={{ marginTop: 14, display: 'grid', gap: 4, fontSize: 12, color: 'var(--muted)' }}>
            <div><strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>1–4</strong> calificar</div>
            <div><strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>→</strong> siguiente</div>
          </div>
        </div>
      </aside>
    </div>
  </div>;
}

export function PreTest({ lessonId, moduleId }: { lessonId: string; moduleId: string }) {
  const { answerQuiz, gradeItem } = useStore();
  const [skipped, setSkipped] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [chosen, setChosen] = useState<Record<number, number>>({});
  const [fcGrade, setFcGrade] = useState<Grade | undefined>(undefined);

  const questions = useMemo(() => findLesson(lessonId)?.lesson.quiz?.slice(0, 2) ?? [], [lessonId]);
  const card = useMemo(() => {
    const own = flashcards.filter(fc => fc.module === moduleId);
    return own[0] ?? flashcards.find(fc => fc.module === 'ambos') ?? flashcards[0];
  }, [moduleId]);

  if (skipped || (questions.length === 0 && !card)) return null;

  const answer = (i: number, choice: number) => {
    if (chosen[i] !== undefined) return;
    const q = questions[i];
    if (!q) return;
    const id = qid(lessonId, i);
    const ok = choice === q.answer;
    answerQuiz(id, choice);
    gradeItem(id, ok ? 3 : 1);
    setChosen(c => ({ ...c, [i]: choice }));
  };

  const grade = (g: Grade) => {
    if (fcGrade !== undefined) return;
    gradeItem(fid(card.id), g);
    setFcGrade(g);
  };

  const allDone = questions.every((_, i) => chosen[i] !== undefined) && fcGrade !== undefined;

  return <div style={{ margin: '0 0 28px' }}>
    <div style={eyebrowStyle}>ANTES DE EMPEZAR</div>
    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, letterSpacing: '-.035em', margin: '6px 0 12px' }}>Tres preguntas de entrada</h2>

    {questions.length > 0 && (
      <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {questions.map((q, i) => (
          <div className="quiz-card" key={i} style={{ margin: 0 }}>
            <div className="quiz-q">{q.q}</div>
            <div className="quiz-options">
              {q.options.map((op, j) => {
                const c = chosen[i];
                const cls = c === undefined ? '' : j === q.answer ? 'correct' : j === c ? 'wrong' : 'dim';
                return <button key={j} className={cls} disabled={c !== undefined} onClick={() => answer(i, j)}>{op}</button>;
              })}
            </div>
            {chosen[i] !== undefined && <div className={`quiz-why ${chosen[i] === q.answer ? 'ok' : 'bad'}`}>{q.why}</div>}
          </div>
        ))}
      </div>
    )}

    <div className="quiz-card" style={{ margin: '10px 0 0' }}>
      <div className="quiz-q">{card.front}</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="btn btn-ghost" onClick={() => setRevealed(r => !r)}>{revealed ? 'Ocultar respuesta' : 'Ver respuesta'}</button>
        {revealed && <span style={{ fontSize: 13, color: 'var(--ink-2)', flex: '1 1 220px' }}>{card.back}</span>}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
        {GRADE_LABELS.map((label, g) => (
          <button
            key={label}
            className="btn btn-ghost"
            disabled={fcGrade !== undefined}
            style={{ flex: '1 1 100px', ...GRADE_STYLES[g] }}
            onClick={() => grade(g as Grade)}
          >{label}</button>
        ))}
      </div>
    </div>

    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginTop: 12 }}>
      <button className="btn btn-ghost" onClick={() => setSkipped(true)}>Omitir</button>
      {allDone && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)' }}>Listo · puedes seguir con la lección</span>}
    </div>
  </div>;
}
