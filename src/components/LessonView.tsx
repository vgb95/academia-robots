import { useEffect, useRef, useState } from 'react';
import type { Lesson, Module, Track } from '../types';
import { BlockRenderer } from './BlockRenderer';
import { useStore } from '../state/store';
import { href, go } from '../router';
import { neighborLessons } from '../data/tracks';
import { PreTest } from './Review';
import { ExplainPrompt } from './Mastery';

export function LessonView({ track, module, lesson }: { track: Track; module: Module; lesson: Lesson }) {
  const { state, setProgress, toggleCheck, answerQuiz, setNote, toggleBookmark, setLastLesson } = useStore();
  const [saved, setSaved] = useState(false);
  const touchX = useRef<number | null>(null);
  const { prev, next } = neighborLessons(lesson.id);
  const status = state.progress[lesson.id] ?? 'todo';
  const bookmarked = state.bookmarks.includes(lesson.id);
  const note = state.notes[lesson.id] ?? '';
  const doneCount = lesson.practice ? lesson.practice.success.filter((_, i) => state.checks[`${lesson.id}-c${i}`]).length : 0;

  useEffect(() => { setLastLesson(lesson.id); }, [lesson.id, setLastLesson]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft' && prev) go(`/lesson/${prev.lesson.id}`);
      if (e.key === 'ArrowRight' && next) go(`/lesson/${next.lesson.id}`);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 90) {
      if (dx > 0 && prev) go(`/lesson/${prev.lesson.id}`);
      if (dx < 0 && next) go(`/lesson/${next.lesson.id}`);
    }
    touchX.current = null;
  };
  const onTouchStart = (e: React.TouchEvent) => {
    // Ignora el swipe si el gesto empieza en una tabla/código desplazable o en un control.
    const el = (e.target as HTMLElement).closest('.table-wrap, .code-wrap, input, textarea, select, button, a');
    touchX.current = el ? null : e.touches[0].clientX;
  };

  return <article className="lesson"
    onTouchStart={onTouchStart}
    onTouchEnd={onTouchEnd}>

    <div className="breadcrumb">
      <a href={href(`/track/${track.id}`)}>{track.title}</a><span>/</span>
      <a href={href(`/track/${track.id}/${module.id}`)}>{module.title}</a>
    </div>

    <header className="lesson-header">
      <div className="lesson-kicker">{module.title} · {lesson.minutes} min · nivel {lesson.level}</div>
      <h1>{lesson.title}</h1>
      <div className="lesson-actions">
        <button className={`btn ${status === 'done' ? 'btn-done' : ''}`} onClick={() => setProgress(lesson.id, status === 'done' ? 'todo' : 'done')}>
          {status === 'done' ? '✓ Completada' : 'Marcar completada'}
        </button>
        <button className="btn btn-ghost" onClick={() => setProgress(lesson.id, status === 'doing' ? 'todo' : 'doing')}>
          {status === 'doing' ? '● En progreso' : '◌ En progreso'}
        </button>
        <button className="btn btn-ghost" onClick={() => toggleBookmark(lesson.id)}>{bookmarked ? '★ Guardada' : '☆ Guardar'}</button>
      </div>
    </header>

    <div className="objectives">
      <div className="objectives-title">Al terminar esta lección sabrás:</div>
      <ul>{lesson.objectives.map((o, i) => <li key={i}>{o}</li>)}</ul>
    </div>

    <PreTest lessonId={lesson.id} moduleId={module.id} />

    <BlockRenderer blocks={lesson.blocks} />

    {lesson.practice && <ExplainPrompt
      lessonId={lesson.id}
      objectives={lesson.objectives}
      success={lesson.practice.success}
    />}

    {lesson.errors && lesson.errors.length > 0 && <section className="errors-section">
      <h2 className="section-title">🔧 Errores comunes</h2>
      <div className="error-grid">{lesson.errors.map((e, i) => <div key={i} className="error-card">
        <div><span className="error-label">Síntoma</span>{e.symptom}</div>
        <div><span className="error-label">Causa</span>{e.cause}</div>
        <div><span className="error-label">Solución</span>{e.fix}</div>
      </div>)}</div>
    </section>}

    {lesson.practice && <section className="practice-section">
      <h2 className="section-title">🛠️ Práctica</h2>
      <p className="practice-task">{lesson.practice.task}</p>
      <div className="checklist">
        {lesson.practice.success.map((s, i) => {
          const id = `${lesson.id}-c${i}`;
          return <label key={i} className={state.checks[id] ? 'checked' : ''}>
            <input type="checkbox" checked={!!state.checks[id]} onChange={() => toggleCheck(id)} />
            <span>{s}</span>
          </label>;
        })}
      </div>
      <div className="practice-progress">{doneCount} / {lesson.practice.success.length} criterios cumplidos</div>
    </section>}

    {lesson.quiz && lesson.quiz.length > 0 && <section className="quiz-section">
      <h2 className="section-title">✅ Comprueba lo aprendido</h2>
      {lesson.quiz.map((qq, i) => {
        const key = `${lesson.id}-q${i}`;
        const chosen = state.quiz[key];
        return <div key={i} className="quiz-card">
          <div className="quiz-q">{qq.q}</div>
          <div className="quiz-options">{qq.options.map((op, j) => <button
            key={j}
            className={chosen === undefined ? '' : j === qq.answer ? 'correct' : j === chosen ? 'wrong' : 'dim'}
            onClick={() => answerQuiz(key, j)} disabled={chosen !== undefined}
          >{op}</button>)}</div>
          {chosen !== undefined && <div className={`quiz-why ${chosen === qq.answer ? 'ok' : 'bad'}`}>{qq.why}</div>}
        </div>;
      })}
    </section>}

    <section className="notes-section">
      <h2 className="section-title">✍️ Tus apuntes</h2>
      <p className="muted">Escribe aquí qué te costó, qué falló y cómo lo arreglaste. Se guardan en este dispositivo.</p>
      <textarea value={note} onChange={e => { setNote(lesson.id, e.target.value); setSaved(true); setTimeout(() => setSaved(false), 1200); }}
        placeholder="Ej.: el divisor daba 2.8 V en vez de 3.3 V porque cargué la salida con el ADC..." rows={7} />
      <div className="notes-footer"><span>{saved ? 'Guardado ✓' : `${note.length} caracteres`}</span></div>
    </section>

    <nav className="lesson-nav">
      {prev ? <a href={href(`/lesson/${prev.lesson.id}`)} className="nav-card"><small>← Anterior</small><strong>{prev.lesson.title}</strong></a> : <span />}
      {next ? <a href={href(`/lesson/${next.lesson.id}`)} className="nav-card next"><small>Siguiente →</small><strong>{next.lesson.title}</strong></a> : <span />}
    </nav>
  </article>;
}
