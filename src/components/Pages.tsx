import { useEffect, useMemo, useState } from 'react';
import { tracks, getTrack, allLessons, stats, findLesson } from '../data/tracks';
import { resources, projects, glossary, bomTiers, companies } from '../data/shared';
import { useStore } from '../state/store';
import { href } from '../router';
import { RichText } from './BlockRenderer';

export function HomePage() {
  const { state } = useStore();
  const s = stats();
  const done = allLessons().filter(x => state.progress[x.lesson.id] === 'done').length;
  const pct = Math.round(done / Math.max(1, s.lessons) * 100);
  const last = state.lastLesson ? findLesson(state.lastLesson) : undefined;

  return <div className="page home">
    <section className="hero">
      <div className="hero-badge">ROADMAP INTERACTIVO · OFFLINE · ESPAÑOL</div>
      <h1>Dos caminos.<br /><span>Un mismo objetivo:</span><br />dominar la tecnología que mueve el mundo.</h1>
      <p className="hero-lead">Una academia gigante para convertirte en ingeniero de robótica desde cero absoluto, o en AI Engineer si ya eres desarrollador. Contenido técnico claro, ejemplos visuales, prácticas reales y notas que se quedan en tu dispositivo.</p>
      <div className="hero-stats">
        <div><strong>{s.lessons}</strong><span>lecciones</span></div>
        <div><strong>{s.modules}</strong><span>bloques</span></div>
        <div><strong>{Math.round(s.minutes / 60)}</strong><span>horas de contenido</span></div>
        <div><strong>{resources.length}</strong><span>recursos</span></div>
      </div>
      {last && <a className="resume" href={href(`/lesson/${last.lesson.id}`)}>▶ Continuar donde lo dejaste: <strong>{last.lesson.title}</strong></a>}
    </section>

    <section className="track-cards">
      {tracks.map(t => {
        const lessons = t.modules.flatMap(m => m.lessons);
        const d = lessons.filter(l => state.progress[l.id] === 'done').length;
        const p = Math.round(d / Math.max(1, lessons.length) * 100);
        return <a key={t.id} className="track-card" style={{ '--accent': t.accent } as React.CSSProperties} href={href(`/track/${t.id}`)}>
          <div className="track-icon">{t.icon}</div>
          <h2>{t.title}</h2>
          <div className="track-tagline">{t.tagline}</div>
          <p>{t.description}</p>
          <div className="track-meta"><span>{t.modules.length} bloques</span><span>{lessons.length} lecciones</span><span>{p}% completado</span></div>
          <div className="track-bar"><div style={{ width: `${p}%` }} /></div>
          <div className="track-cta">Entrar en el track →</div>
        </a>;
      })}
    </section>

    <section className="home-sections">
      <a href={href('/library')}><span>📚</span><strong>Biblioteca</strong><small>{resources.length} recursos verificados y filtrables</small></a>
      <a href={href('/projects')}><span>🛠️</span><strong>Proyectos</strong><small>{projects.length} cosas que se mueven (o razonan)</small></a>
      <a href={href('/glossary')}><span>📖</span><strong>Glosario</strong><small>{glossary.length} términos explicados</small></a>
      <a href={href('/kit')}><span>🔧</span><strong>Banco y BOM</strong><small>4 tiers de presupuesto</small></a>
      <a href={href('/cases')}><span>🦾</span><strong>Casos reales</strong><small>Robos reales desmontados</small></a>
      <a href={href('/flashcards')}><span>🃏</span><strong>Flashcards</strong><small>Repetición espaciada</small></a>
      <a href={href('/troubleshooting')}><span>🩺</span><strong>Diagnóstico</strong><small>Cuando algo no funciona</small></a>
      <a href={href('/cheatsheets')}><span>📋</span><strong>Chuletas</strong><small>Comandos y fórmulas</small></a>
    </section>

    <section className="manifesto">
      <h2>La regla de esta academia</h2>
      <p>Un portafolio de robótica se mide en <strong>cosas que se movieron</strong>, no en cursos terminados. Un portafolio de IA se mide en <strong>sistemas que funcionan y sabes explicar</strong>. Aquí cada lección termina en una práctica con criterios concretos.</p>
    </section>

    <div className="home-progress">Progreso global: <strong>{pct}%</strong> · {done} de {s.lessons} lecciones completadas</div>
  </div>;
}

export function TrackPage({ trackId }: { trackId: string }) {
  const t = getTrack(trackId);
  const { state } = useStore();
  if (!t) return <NotFound />;
  const lessons = t.modules.flatMap(m => m.lessons);
  const done = lessons.filter(l => state.progress[l.id] === 'done').length;
  return <div className="page">
    <div className="breadcrumb"><a href={href('/')}>Inicio</a><span>/</span>{t.title}</div>
    <header className="page-header" style={{ '--accent': t.accent } as React.CSSProperties}>
      <div className="page-icon">{t.icon}</div>
      <h1>{t.title}</h1>
      <p>{t.description}</p>
      <div className="chips"><span>{t.modules.length} bloques</span><span>{lessons.length} lecciones</span><span>{done} completadas</span></div>
    </header>
    <div className="module-grid">
      {t.modules.map((m, i) => {
        const md = m.lessons.filter(l => state.progress[l.id] === 'done').length;
        const p = Math.round(md / Math.max(1, m.lessons.length) * 100);
        return <a key={m.id} className="module-card" href={href(`/track/${t.id}/${m.id}`)}>
          <div className="module-num">{String(i).padStart(2, '0')}</div>
          <div>
            <h3>{m.title}</h3>
            <p>{m.subtitle}</p>
            <div className="module-meta"><span>{m.lessons.length} lecciones</span><span>{p}%</span></div>
            <div className="module-bar"><div style={{ width: `${p}%` }} /></div>
          </div>
        </a>;
      })}
    </div>
  </div>;
}

export function ModulePage({ trackId, moduleId }: { trackId: string; moduleId: string }) {
  const t = getTrack(trackId);
  const m = t?.modules.find(x => x.id === moduleId);
  const { state } = useStore();
  if (!t || !m) return <NotFound />;
  return <div className="page">
    <div className="breadcrumb"><a href={href('/')}>Inicio</a><span>/</span><a href={href(`/track/${t.id}`)}>{t.title}</a><span>/</span>{m.title}</div>
    <header className="page-header" style={{ '--accent': t.accent } as React.CSSProperties}>
      <h1>{m.title}</h1><p>{m.subtitle}</p>
      <div className="chips"><span>{m.lessons.length} lecciones</span><span>{m.lessons.reduce((n, l) => n + l.minutes, 0)} min</span></div>
    </header>
    <div className="lesson-list">
      {m.lessons.map((l, i) => {
        const st = state.progress[l.id] ?? 'todo';
        return <a key={l.id} className={`lesson-row ${st}`} href={href(`/lesson/${l.id}`)}>
          <span className="lesson-row-num">{String(i + 1).padStart(2, '0')}</span>
          <span className="lesson-row-body"><strong>{l.title}</strong><small>{l.objectives[0]}</small></span>
          <span className="lesson-row-meta"><small>{l.minutes} min</small><span className={`status-dot ${st}`} /></span>
        </a>;
      })}
    </div>
  </div>;
}

export function LibraryPage() {
  const [track, setTrack] = useState('all');
  const [type, setType] = useState('all');
  const [query, setQuery] = useState('');
  const list = useMemo(() => resources.filter(r =>
    (track === 'all' || r.track === track || r.track === 'ambos') &&
    (type === 'all' || r.type === type) &&
    (query === '' || (r.title + r.desc + r.module).toLowerCase().includes(query.toLowerCase()))
  ), [track, type, query]);
  const types = [...new Set(resources.map(r => r.type))];
  return <div className="page">
    <div className="breadcrumb"><a href={href('/')}>Inicio</a><span>/</span>Biblioteca</div>
    <header className="page-header"><h1>📚 Biblioteca de recursos</h1><p>{resources.length} recursos verificados. Se filtran por track, tipo y texto.</p></header>
    <div className="filters">
      <input className="search-input" placeholder="Buscar recurso…" value={query} onChange={e => setQuery(e.target.value)} />
      <select value={track} onChange={e => setTrack(e.target.value)}><option value="all">Todos los tracks</option><option value="robotica">Robótica</option><option value="ai">AI Engineer</option></select>
      <select value={type} onChange={e => setType(e.target.value)}><option value="all">Todos los tipos</option>{types.map(t => <option key={t} value={t}>{t}</option>)}</select>
      <span className="count">{list.length} recursos</span>
    </div>
    <div className="resource-grid">{list.map(r => <a key={r.id} className="resource-card" href={r.url} target="_blank" rel="noreferrer">
      <div className="resource-top"><span className="badge">{r.module}</span>{r.free ? <span className="badge free">gratis</span> : <span className="badge paid">de pago</span>}</div>
      <h3>{r.title} ↗</h3><p>{r.desc}</p><div className="resource-type">{r.type}</div>
    </a>)}</div>
  </div>;
}

export function ProjectsPage() {
  const [track, setTrack] = useState('all');
  const { state, toggleCheck } = useStore();
  const list = projects.filter(p => track === 'all' || p.track === track);
  return <div className="page">
    <div className="breadcrumb"><a href={href('/')}>Inicio</a><span>/</span>Proyectos</div>
    <header className="page-header"><h1>🛠️ Proyectos</h1><p>Un portafolio se construye con cosas que funcionan. Marca cada una cuando la tengas grabada, documentada y en GitHub.</p></header>
    <div className="filters">
      <select value={track} onChange={e => setTrack(e.target.value)}><option value="all">Todos</option><option value="robotica">Robótica</option><option value="ai">AI Engineer</option></select>
      <span className="count">{list.filter(p => state.checks[`proj-${p.id}`]).length} / {list.length} hechos</span>
    </div>
    <div className="project-list">{list.map(p => <label key={p.id} className={`project-row ${state.checks[`proj-${p.id}`] ? 'done' : ''}`}>
      <input type="checkbox" checked={!!state.checks[`proj-${p.id}`]} onChange={() => toggleCheck(`proj-${p.id}`)} />
      <span className="project-body"><span className="badge">{p.module}</span><strong>{p.title}</strong><small>{p.desc}</small></span>
      <span className="effort">{p.effort}</span>
    </label>)}</div>
    <div className="callout apunte"><div className="callout-title">📌 Plantilla de README</div>
      Todo proyecto lleva: vídeo arriba, diagrama de cableado o arquitectura, los números que mediste y una sección llamada <strong>"qué se rompió y cómo lo arreglé"</strong>. Esa sección es la que no se puede copiar de un tutorial.
    </div>
  </div>;
}

export function GlossaryPage() {
  const [query, setQuery] = useState('');
  const [letter, setLetter] = useState('all');
  const letters = [...new Set(glossary.map(g => g.term[0].toUpperCase()))].sort();
  const list = glossary.filter(g => (letter === 'all' || g.term[0].toUpperCase() === letter) && (query === '' || (g.term + g.short + g.long).toLowerCase().includes(query.toLowerCase())));
  return <div className="page">
    <div className="breadcrumb"><a href={href('/')}>Inicio</a><span>/</span>Glosario</div>
    <header className="page-header"><h1>📖 Glosario</h1><p>{glossary.length} términos. Los que aparecen subrayados en las lecciones llevan aquí su explicación.</p></header>
    <div className="filters"><input className="search-input" placeholder="Buscar término…" value={query} onChange={e => setQuery(e.target.value)} /><span className="count">{list.length} términos</span></div>
    <div className="letter-nav"><button className={letter === 'all' ? 'active' : ''} onClick={() => setLetter('all')}>Todos</button>{letters.map(l => <button key={l} className={letter === l ? 'active' : ''} onClick={() => setLetter(l)}>{l}</button>)}</div>
    <div className="glossary-list">{list.map(g => <div key={g.term} className="glossary-row"><div><strong>{g.term}</strong><span className="badge">{g.track}</span></div><p>{g.long}</p></div>)}</div>
  </div>;
}

export function KitPage() {
  return <div className="page">
    <div className="breadcrumb"><a href={href('/')}>Inicio</a><span>/</span>Banco y BOM</div>
    <header className="page-header"><h1>🔧 El banco y la BOM</h1><p>Empieza gratis en simuladores y sube de tier cuando tengas claro qué necesitas. Precios orientativos verificados en 2026.</p></header>
    <div className="tier-grid">{bomTiers.map(t => <div key={t.id} className="tier-card"><h3>{t.name}</h3><div className="tier-price">{t.price}</div><p>{t.description}</p><ul>{t.items.map(i => <li key={i}>{i}</li>)}</ul></div>)}</div>
    <h2 className="section-title">Dónde comprar</h2>
    <div className="callout nota"><div className="callout-title">✍️ Nota al margen</div>
      AliExpress es 3–10× más barato pero tarda 2–6 semanas. Amazon y Elegoo directo son el lugar correcto para el primer kit. Adafruit y SparkFun cuestan más, pero cada producto lleva un tutorial completo y soporte real. DigiKey y Mouser son para piezas exactas con datasheet genuino. Pololu es la mejor fuente de motores y drivers.
    </div>
    <h2 className="section-title">Empresas del sector</h2>
    <div className="company-grid">{companies.map(c => <div key={c.name} className="company-card"><strong>{c.name}</strong><span>{c.region}</span><p>{c.detail}</p></div>)}</div>
  </div>;
}

export function NotesPage() {
  const { state, exportJSON, importJSON, resetAll } = useStore();
  const notes = Object.entries(state.notes).filter(([, v]) => v.trim());
  return <div className="page">
    <div className="breadcrumb"><a href={href('/')}>Inicio</a><span>/</span>Mis notas</div>
    <header className="page-header"><h1>✍️ Mis notas y respaldo</h1><p>Todo se guarda en IndexedDB en este dispositivo. Exporta un JSON para llevarlo a otro sitio o importarlo en un iPad reinstalado.</p></header>
    <div className="backup-actions">
      <button className="btn" onClick={exportJSON}>⬇ Exportar respaldo JSON</button>
      <label className="btn btn-ghost">⬆ Importar respaldo<input type="file" accept="application/json" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) void importJSON(f); }} /></label>
      <button className="btn btn-danger" onClick={resetAll}>🗑 Borrar todo</button>
    </div>
    <div className="backup-meta">Último guardado: {state.updatedAt ? new Date(state.updatedAt).toLocaleString('es') : 'nunca'} · {notes.length} notas · {state.bookmarks.length} marcadores</div>
    <h2 className="section-title">Tus apuntes</h2>
    {notes.length === 0 ? <p className="muted">Todavía no has escrito apuntes. Ábrelos desde cualquier lección.</p> : <div className="notes-list">{notes.map(([id, text]) => {
      const found = findLesson(id);
      return <div key={id} className="note-card"><a href={href(`/lesson/${id}`)}>{found ? found.lesson.title : id}</a><p>{text}</p></div>;
    })}</div>}
    {state.bookmarks.length > 0 && <><h2 className="section-title">★ Guardadas</h2><div className="notes-list">{state.bookmarks.map(id => {
      const found = findLesson(id);
      return found ? <a key={id} className="note-card" href={href(`/lesson/${id}`)}>{found.lesson.title}</a> : null;
    })}</div></>}
  </div>;
}

export function SearchPage({ q }: { q: string }) {
  const [query, setQuery] = useState(q);
  useEffect(() => { setQuery(q); }, [q]);
  const list = useMemo(() => {
    const needle = query.toLowerCase().trim();
    if (!needle) return [];
    return allLessons().filter(x =>
      (x.lesson.title + ' ' + x.lesson.objectives.join(' ') + ' ' + x.lesson.blocks.map(b => 'text' in b ? b.text : '').join(' ')).toLowerCase().includes(needle)
    ).slice(0, 80);
  }, [query]);
  return <div className="page">
    <header className="page-header"><h1>🔎 Buscar</h1></header>
    <input className="search-input big" autoFocus placeholder="Busca en todas las lecciones…" value={query} onChange={e => { setQuery(e.target.value); window.history.replaceState(null, '', href(`/search/${encodeURIComponent(e.target.value)}`)); }} />
    <div className="search-results">{list.map(x => <a key={x.lesson.id} href={href(`/lesson/${x.lesson.id}`)}>
      <span className="badge">{x.module.title}</span><strong>{x.lesson.title}</strong><small>{x.lesson.objectives[0]}</small>
    </a>)}</div>
    {query && list.length === 0 && <p className="muted">Sin resultados para "{query}".</p>}
  </div>;
}

export function NotFound() {
  return <div className="page empty"><h1>404</h1><p>Esta página no existe.</p><a className="btn" href={href('/')}>Volver al inicio</a></div>;
}

export function RichTextPreview({ text }: { text: string }) { return <RichText text={text} />; }
