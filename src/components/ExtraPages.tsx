import { useMemo, useState } from 'react';
import { cases } from '../data/extras/cases';
import { flashcards } from '../data/extras/flashcards';
import { troubleshooting } from '../data/extras/troubleshooting';
import { cheatsheets } from '../data/extras/cheatsheets';
import { href } from '../router';
import { useStore } from '../state/store';

function PageHead({ crumb, title, desc }: { crumb: string; title: string; desc: string }) {
  return <>
    <div className="breadcrumb"><a href={href('/')}>Inicio</a><span>/</span>{crumb}</div>
    <header className="page-header"><h1>{title}</h1><p>{desc}</p></header>
  </>;
}

export function CasesPage() {
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');
  const cats = [...new Set(cases.map(c => c.category))];
  const list = cases.filter(c => (cat === 'all' || c.category === cat) && (q === '' || (c.name + c.summary + c.lesson + c.sensors.join(' ')).toLowerCase().includes(q.toLowerCase())));
  return <div className="page">
    <PageHead crumb="Casos reales" title="⛭ Anatomía de robots reales" desc={`${cases.length} sistemas reales desmontados capa por capa. La pregunta importante no es qué hace cada robot, sino qué lección técnica te deja a ti.`} />
    <div className="filters">
      <input className="search-input" placeholder="Buscar robot o empresa…" value={q} onChange={e => setQ(e.target.value)} />
      <select value={cat} onChange={e => setCat(e.target.value)}><option value="all">Todas las categorías</option>{cats.map(c => <option key={c} value={c}>{c}</option>)}</select>
      <span className="count">{list.length} casos</span>
    </div>
    <div className="case-grid">{list.map(c => <details key={c.id} className="case-card">
      <summary><span className="badge">{c.category}</span><strong>{c.name}</strong><small>{c.track === 'ambos' ? 'robótica + IA' : c.track}</small></summary>
      <div className="case-body">
        <p>{c.summary}</p>
        <h4>Arquitectura</h4>
        <div className="case-layers">{c.architecture.map((a, i) => <div key={i}><span>{a.layer}</span><p>{a.detail}</p></div>)}</div>
        <div className="case-facts">
          <div><strong>Sensores</strong><span>{c.sensors.join(' · ')}</span></div>
          <div><strong>Computación</strong><span>{c.compute}</span></div>
          <div><strong>Control</strong><span>{c.control}</span></div>
          <div><strong>Aprendizaje</strong><span>{c.learning}</span></div>
        </div>
        <div className="case-lesson"><strong>▸ Lección para ti</strong><p>{c.lesson}</p></div>
        <div className="case-links">{c.resources.map((r, i) => <a key={i} href={r.url} target="_blank" rel="noreferrer">↗ {r.label}</a>)}</div>
      </div>
    </details>)}</div>
  </div>;
}

export function FlashcardsPage() {
  const [track, setTrack] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const { state, toggleCheck } = useStore();
  const modules = useMemo(() => [...new Set(flashcards.map(f => f.module))].sort(), []);
  const list = useMemo(() => {
    const base = flashcards.filter(f => (track === 'all' || f.track === track || f.track === 'ambos') && (moduleFilter === 'all' || f.module === moduleFilter));
    return shuffle ? [...base].sort(() => Math.random() - 0.5) : base;
  }, [track, moduleFilter, shuffle]);
  const card = list[idx % Math.max(1, list.length)];
  const known = card ? state.checks[`fc-${card.id}`] : false;
  const knownCount = list.filter(f => state.checks[`fc-${f.id}`]).length;
  const next = () => { setIdx(i => (i + 1) % Math.max(1, list.length)); setFlipped(false); };
  const prev = () => { setIdx(i => (i - 1 + Math.max(1, list.length)) % Math.max(1, list.length)); setFlipped(false); };
  return <div className="page">
    <PageHead crumb="Flashcards" title="◫ Repetición espaciada" desc={`${flashcards.length} tarjetas para repasar conceptos en cualquier momento. Date la vuelta a la tarjeta, juzga si la sabías y sigue. Tu progreso se guarda en el dispositivo.`} />
    <div className="filters">
      <select value={track} onChange={e => { setTrack(e.target.value); setIdx(0); setFlipped(false); }}><option value="all">Todos los tracks</option><option value="robotica">Robótica</option><option value="ai">AI Engineer</option><option value="ambos">Ambos</option></select>
      <select value={moduleFilter} onChange={e => { setModuleFilter(e.target.value); setIdx(0); setFlipped(false); }}><option value="all">Todos los módulos</option>{modules.map(m => <option key={m} value={m}>{m}</option>)}</select>
      <button className="btn btn-ghost" onClick={() => { setShuffle(s => !s); setIdx(0); setFlipped(false); }}>{shuffle ? '⇌ Orden aleatorio' : '↔ Orden original'}</button>
      <span className="count">{knownCount} / {list.length} sabidas</span>
    </div>
    {card ? <div className="flashcard-wrap">
      <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(f => !f)} role="button" tabIndex={0} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setFlipped(f => !f); }}>
        <div className="flashcard-inner">
          <div className="flashcard-face front">
            <span className="badge">{card.module} · {card.track}</span>
            <h2>{card.front}</h2>
            {card.hint && <p className="hint">Pista: {card.hint}</p>}
            <small>Toca para ver la respuesta</small>
          </div>
          <div className="flashcard-face back">
            <strong>Respuesta</strong><p>{card.back}</p><small>Toca para volver</small>
          </div>
        </div>
      </div>
      <div className="flashcard-controls">
        <button className="btn btn-ghost" onClick={prev}>← Anterior</button>
        <button className={`btn ${known ? 'btn-done' : ''}`} onClick={() => { toggleCheck(`fc-${card.id}`); next(); }}>{known ? '✓ Sabida' : 'Marcar como sabida'}</button>
        <button className="btn btn-ghost" onClick={next}>Siguiente →</button>
      </div>
      <div className="flashcard-pos">{idx + 1} / {list.length}</div>
    </div> : <p className="muted">No hay tarjetas con esos filtros.</p>}
  </div>;
}

export function TroubleshootingPage() {
  const [q, setQ] = useState('');
  const [track, setTrack] = useState('all');
  const list = troubleshooting.filter(t => (track === 'all' || t.track === track) && (q === '' || (t.symptom + t.category + t.causes.map(c => c.cause + c.check + c.fix).join(' ')).toLowerCase().includes(q.toLowerCase())));
  return <div className="page">
    <PageHead crumb="Troubleshooting" title="⚕ Diagnóstico de fallos" desc={`${troubleshooting.length} síntomas reales con causas probables, qué comprobar y cómo arreglarlo. Cuando algo no funcione, empieza por aquí antes de buscar en internet.`} />
    <div className="filters">
      <input className="search-input" placeholder="Describe el síntoma: motor no gira, loss no baja…" value={q} onChange={e => setQ(e.target.value)} />
      <select value={track} onChange={e => setTrack(e.target.value)}><option value="all">Ambos tracks</option><option value="robotica">Robótica</option><option value="ai">AI Engineer</option></select>
      <span className="count">{list.length} entradas</span>
    </div>
    <div className="trouble-list">{list.map(t => <details key={t.id} className="trouble-card">
      <summary><span className="badge">{t.category}</span><strong>{t.symptom}</strong></summary>
      <div className="trouble-body">{t.causes.map((c, i) => <div key={i} className="trouble-cause">
        <div><span className="error-label">Causa {i + 1}</span>{c.cause}</div>
        <div><span className="error-label">Comprueba</span>{c.check}</div>
        <div><span className="error-label">Arreglo</span>{c.fix}</div>
      </div>)}<div className="trouble-prev"><strong>Prevención:</strong> {t.prevention}</div></div>
    </details>)}</div>
  </div>;
}

export function CheatsheetsPage() {
  const [q, setQ] = useState('');
  const [track, setTrack] = useState('all');
  const list = cheatsheets.filter(c => (track === 'all' || c.track === track || c.track === 'ambos') && (q === '' || (c.title + c.description + c.groups.map(g => g.title + g.items.map(i => i.term + i.value + (i.note ?? '')).join(' ')).join(' ')).toLowerCase().includes(q.toLowerCase())));
  return <div className="page">
    <PageHead crumb="Chuleta" title="≡ Hojas de referencia rápida" desc={`${cheatsheets.length} hojas con comandos, fórmulas y snippets que necesitarás una y otra vez. Úsalas como reference, no como sustituto de las lecciones.`} />
    <div className="filters">
      <input className="search-input" placeholder="Buscar fórmula o comando…" value={q} onChange={e => setQ(e.target.value)} />
      <select value={track} onChange={e => setTrack(e.target.value)}><option value="all">Todos los tracks</option><option value="robotica">Robótica</option><option value="ai">AI Engineer</option></select>
      <span className="count">{list.length} hojas</span>
    </div>
    <div className="cheat-grid">{list.map(c => <details key={c.id} className="cheat-card" open={q !== ''}>
      <summary><strong>{c.title}</strong><small>{c.description}</small></summary>
      <div className="cheat-body">{c.groups.map((g, i) => <div key={i} className="cheat-group">
        <h4>{g.title}</h4>
        <div className="cheat-table">{g.items.map((it, j) => <div key={j} className="cheat-row">
          <code>{it.term}</code><span>{it.value}</span>{it.note && <em>{it.note}</em>}
        </div>)}</div>
      </div>)}</div>
    </details>)}</div>
  </div>;
}
