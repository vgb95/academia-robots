import { useCallback, useEffect, useMemo, useState } from 'react';
import { collectPracticeQuestions, type PracticeQuestion } from '../data/practice';
import { useStore } from '../state/store';

type TrackFilter = 'all' | 'robotica' | 'ai';
type ModeFilter = 'all' | 'failed' | 'random';

/** Barajado determinista: la misma semilla produce siempre el mismo orden. */
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

export function PracticePage() {
  const { state, answerQuiz, toggleCheck } = useStore();
  const all = useMemo(() => collectPracticeQuestions(), []);

  const [track, setTrack] = useState<TrackFilter>('all');
  const [moduleId, setModuleId] = useState('all');
  const [mode, setMode] = useState<ModeFilter>('all');
  const [seed, setSeed] = useState(() => Date.now() % 100000);
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  const moduleOptions = useMemo(() => {
    const seen = new Map<string, string>();
    all.forEach(q => {
      if (track === 'all' || q.trackId === track) seen.set(q.moduleId, q.moduleTitle);
    });
    return [...seen.entries()].map(([id, title]) => ({ id, title }));
  }, [all, track]);

  const set = useMemo(() => {
    let list = all.filter(q =>
      (track === 'all' || q.trackId === track) &&
      (moduleId === 'all' || q.moduleId === moduleId)
    );
    if (mode === 'failed') {
      list = list.filter(q => {
        const given = state.quiz[q.key];
        return given !== undefined && given !== q.answer;
      });
    }
    if (mode === 'random') list = seededShuffle(list, seed);
    return list;
  }, [all, track, moduleId, mode, state.quiz, seed]);

  const total = set.length;
  const answered = set.filter(q => state.quiz[q.key] !== undefined).length;
  const correct = set.filter(q => state.quiz[q.key] === q.answer).length;
  const wrong = answered - correct;
  const hitRate = answered ? Math.round(correct / answered * 100) : 0;
  const progress = total ? Math.round((index + 1) / total * 100) : 0;

  const cur: PracticeQuestion | undefined = set[index];
  const chosen = cur ? state.quiz[cur.key] : undefined;
  const known = cur ? !!state.checks[cur.checkKey] : false;

  const goNext = useCallback(() => {
    if (finished || total === 0) return;
    if (index < total - 1) setIndex(i => i + 1);
    else setFinished(true);
  }, [finished, index, total]);

  const goPrev = useCallback(() => {
    if (finished) { setFinished(false); return; }
    setIndex(i => Math.max(0, i - 1));
  }, [finished]);

  const restart = useCallback(() => {
    setIndex(0);
    setFinished(false);
    setSeed(s => s + 1);
  }, []);

  const changeTrack = (value: string) => {
    setTrack(value as TrackFilter);
    setModuleId('all');
    setIndex(0);
    setFinished(false);
  };
  const changeModule = (value: string) => {
    setModuleId(value);
    setIndex(0);
    setFinished(false);
  };
  const changeMode = (value: string) => {
    setMode(value as ModeFilter);
    setIndex(0);
    setFinished(false);
    if (value === 'random') setSeed(s => s + 1);
  };
  const resetFilters = () => {
    setTrack('all');
    setModuleId('all');
    setMode('all');
    setIndex(0);
    setFinished(false);
  };

  // Si un filtro reduce el set, mantén el cursor dentro de los límites.
  useEffect(() => {
    if (index >= total) setIndex(total > 0 ? total - 1 : 0);
  }, [index, total]);

  // Navegación con teclado, sin interferir con los selects de los filtros.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(el.tagName)) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  const failedQuestions = set.filter(q =>
    state.quiz[q.key] !== undefined && state.quiz[q.key] !== q.answer
  );

  return <div className="page practice-page">
    <header className="page-header" style={{ borderLeft: '3px solid var(--rust)' }}>
      <div className="sheet-eyebrow">PRÁCTICA / MODO REPASO</div>
      <h1>Modo práctica</h1>
      <p>Todas las preguntas de la academia en un solo sitio. Responde, lee el porqué y marca las que ya dominas. Tu progreso se guarda igual que en las lecciones.</p>
      <div className="chips">
        <span>{all.length} preguntas en total</span>
        <span>{total} en este set</span>
        <span>{answered} respondidas</span>
        <span>{correct} aciertos</span>
      </div>
    </header>

    <div className="filters">
      <select value={track} onChange={e => changeTrack(e.target.value)} aria-label="Track">
        <option value="all">Ambos tracks</option>
        <option value="robotica">Robótica</option>
        <option value="ai">AI Engineer</option>
      </select>
      <select value={moduleId} onChange={e => changeModule(e.target.value)} aria-label="Módulo">
        <option value="all">Todos los módulos</option>
        {moduleOptions.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
      </select>
      <select value={mode} onChange={e => changeMode(e.target.value)} aria-label="Modo">
        <option value="all">Todas</option>
        <option value="failed">Solo falladas</option>
        <option value="random">Aleatorio</option>
      </select>
      <span className="count">{total} preguntas · {hitRate}% acierto</span>
    </div>

    {finished && total > 0 ? (
      <div className="sheet" style={{ maxWidth: 680, margin: '0 auto' }}>
        <div className="sheet-head">
          <div className="sheet-eyebrow">PRÁCTICA / RESUMEN</div>
          <div className="sheet-title">Repaso completado</div>
          <p className="sheet-subtitle">Has llegado al final del set de {total} preguntas.</p>
        </div>
        <div className="chips">
          <span>{answered} respondidas</span>
          <span>{correct} aciertos</span>
          <span>{wrong} falladas</span>
          <span>{hitRate}% de acierto</span>
        </div>
        <div className="track-bar" style={{ marginTop: 14 }}><div style={{ width: `${hitRate}%` }} /></div>
        {failedQuestions.length > 0 && <div className="callout apunte" style={{ marginTop: 16 }}>
          <div className="callout-title">Preguntas para repasar</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12 }}>
            {failedQuestions.slice(0, 8).map(q => <li key={q.key}>{q.q}</li>)}
          </ul>
          <button className="btn btn-ghost" style={{ marginTop: 10 }} onClick={() => { setMode('failed'); setIndex(0); setFinished(false); }}>
            Repasar solo falladas
          </button>
        </div>}
        <div className="sheet-actions" style={{ marginTop: 16 }}>
          <button className="btn" onClick={restart}>Reiniciar set</button>
          <button className="btn btn-ghost" onClick={() => { setFinished(false); setIndex(0); }}>Volver a la primera</button>
        </div>
      </div>
    ) : total === 0 || !cur ? (
      <div className="sheet" style={{ maxWidth: 680, margin: '0 auto' }}>
        <div className="sheet-head">
          <div className="sheet-eyebrow">PRÁCTICA / SIN PREGUNTAS</div>
          <div className="sheet-title">Nada que repasar aquí</div>
          <p className="sheet-subtitle">
            {mode === 'failed'
              ? 'Todavía no has fallado ninguna pregunta con estos filtros. Responde unas cuantas en modo «Todas» y vuelve.'
              : 'No hay preguntas que coincidan con los filtros seleccionados.'}
          </p>
        </div>
        <div className="sheet-actions" style={{ marginTop: 16 }}>
          <button className="btn" onClick={resetFilters}>Ver todas las preguntas</button>
        </div>
      </div>
    ) : (
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 460px', minWidth: 0 }}>
          <div className="track-bar" style={{ marginBottom: 12 }}><div style={{ width: `${progress}%` }} /></div>
          <div className="sheet">
            <div className="sheet-head">
              <div className="sheet-eyebrow">
                PREGUNTA {index + 1} / {total} · {cur.trackId === 'robotica' ? 'ROBÓTICA' : 'AI ENGINEER'} · {cur.moduleTitle}
              </div>
              <div className="sheet-title">{cur.lessonTitle}</div>
              <p className="sheet-subtitle">Elige la respuesta correcta y lee el porqué.</p>
            </div>
            <div className="quiz-card">
              <div className="quiz-q">{cur.q}</div>
              <div className="quiz-options">{cur.options.map((op, j) => {
                const cls = chosen === undefined ? '' : j === cur.answer ? 'correct' : j === chosen ? 'wrong' : 'dim';
                return <button
                  key={j}
                  className={cls}
                  onClick={() => answerQuiz(cur.key, j)}
                  disabled={chosen !== undefined}
                >{op}</button>;
              })}</div>
              {chosen !== undefined && <div className={`quiz-why ${chosen === cur.answer ? 'ok' : 'bad'}`}>{cur.why}</div>}
            </div>
          </div>
          <div className="lab-bottom-nav">
            <button className="btn btn-ghost" onClick={goPrev} disabled={index === 0}>← Anterior</button>
            <button className="btn" onClick={goNext}>{index === total - 1 ? 'Terminar →' : 'Siguiente →'}</button>
            <button className="btn btn-ghost" onClick={restart}>Repetir</button>
            <button className={`btn ${known ? 'btn-done' : 'btn-ghost'}`} onClick={() => toggleCheck(cur.checkKey)}>
              {known ? '✓ Me la sé' : 'Me la sé / Marcar'}
            </button>
            <span className="lab-kbd">← → navegar</span>
          </div>
        </div>
        <aside style={{ flex: '0 1 240px', display: 'grid', gap: 12 }}>
          <div className="lab-rail-card">
            <div className="lab-rail-top"><span>PROGRESO</span><span className="lab-rail-badge">{answered}/{total}</span></div>
            <div className="lab-rail-note">
              <strong>{correct}</strong> aciertos · <strong>{wrong}</strong> falladas · <strong>{total - answered}</strong> sin responder
            </div>
            <div className="lab-rail-controls">
              <button className="btn btn-ghost" onClick={goPrev} disabled={index === 0}>←</button>
              <button className="btn btn-green" onClick={goNext}>Siguiente →</button>
            </div>
            <div className="lab-rail-hint">← → para navegar · Repetir vuelve al inicio</div>
          </div>
          <div className="lab-rail-card">
            <div className="lab-rail-title">ESTA PREGUNTA</div>
            <div className="lab-rail-note">
              {known ? 'Marcada como sabida. Ya puedes seguir.' : 'Sin marcar. Usa «Me la sé» cuando la domines.'}
            </div>
            <div className="lab-rail-controls">
              <button className={`btn ${known ? 'btn-done' : 'btn-ghost'}`} onClick={() => toggleCheck(cur.checkKey)}>
                {known ? '✓ Me la sé' : 'Marcar "Me la sé"'}
              </button>
            </div>
          </div>
        </aside>
      </div>
    )}
  </div>;
}
