import { useEffect, useState, type ReactNode } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { tracks, findLesson } from '../data/tracks';
import { useStore } from '../state/store';
import { href, go, useRoute } from '../router';

const folderColors = ['', 'violet', 'blue', 'pink', 'olive', '', 'violet', 'blue', 'pink', 'olive', '', 'violet', 'blue'];

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const route = useRoute();
  const { state } = useStore();
  const currentTrack = route.name === 'lesson'
    ? findLesson(route.id)?.track
    : 'track' in route ? tracks.find(t => t.id === route.track)
    : undefined;
  const total = tracks.reduce((n, t) => n + t.modules.flatMap(m => m.lessons).length, 0);
  const done = tracks.reduce((n, t) => n + t.modules.flatMap(m => m.lessons).filter(l => state.progress[l.id] === 'done').length, 0);
  const pct = Math.round(done / Math.max(1, total) * 100);

  return <nav className="sidebar" onClick={onNavigate}>
    <div className="sidebar-course-head"><strong>Curso</strong><span className="sidebar-course-count">{total} lecciones</span></div>
    {tracks.map(t => (
      <div key={t.id}>
        <a className={`folder-row ${currentTrack?.id === t.id ? 'active' : ''}`} href={href(`/track/${t.id}`)}>
          <span className="folder-icon">▤</span>
          <span className="folder-name">{t.title.replace(' desde cero', '')}</span>
        </a>
        {(currentTrack?.id === t.id ? t.modules : []).map((m, i) => {
          const md = m.lessons.filter(l => state.progress[l.id] === 'done').length;
          return <a key={m.id} className="folder-row" style={{ paddingLeft: 26 }} href={href(`/track/${t.id}/${m.id}`)}>
            <span className={`folder-icon ${folderColors[i % folderColors.length]}`}>▸</span>
            <span className="folder-name">{m.title}</span>
            <span className="folder-count">{md}/{m.lessons.length}</span>
          </a>;
        })}
      </div>
    ))}
    <div className="sidebar-course-head" style={{ marginTop: 18 }}><strong>Herramientas</strong></div>
    {[
      ['/laboratorio', '⬡', 'Laboratorio'], ['/practica', '✓', 'Práctica'],
      ['/library', '§', 'Biblioteca'], ['/projects', '⚒', 'Proyectos'],
      ['/glossary', '¶', 'Glosario'], ['/kit', '⌗', 'Banco y BOM'],
      ['/ruta', '⌁', 'Hoja de ruta'], ['/plan', '▦', 'Plan de estudio'],
      ['/esquemas', '◫', 'Esquemas'], ['/cases', '⛭', 'Casos reales'],
      ['/flashcards', '◫', 'Flashcards'], ['/troubleshooting', '⚕', 'Diagnóstico'],
      ['/cheatsheets', '≡', 'Chuletas'], ['/offline', '◉', 'Offline e iPad'],
      ['/notes', '✎', 'Mis notas']
    ].map(([path, icon, label]) => <a key={path} className="folder-row" href={href(path)}>
      <span className="folder-icon">{icon}</span><span className="folder-name">{label}</span>
    </a>)}
    <div className="sidebar-progress">
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}><strong>PROGRESO</strong><span>{done} / {total}</span></div>
      <div className="sidebar-progress-bar"><div className="sidebar-progress-fill" style={{ width: `${pct}%` }} /></div>
    </div>
    <div className="sidebar-foot">Offline · en tu iPad</div>
  </nav>;
}

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const [query, setQuery] = useState('');
  const [night, setNight] = useState(false);
  const { needRefresh, updateServiceWorker } = useRegisterSW();
  const route = useRoute();

  useEffect(() => {
    const on = () => setOnline(true), off = () => setOnline(false);
    window.addEventListener('online', on); window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  useEffect(() => { setOpen(false); }, [route]);
  useEffect(() => {
    let t = '';
    if (route.name === 'track' || route.name === 'module') t = route.track;
    else if (route.name === 'lesson') t = findLesson(route.id)?.track.id ?? '';
    document.documentElement.dataset.track = t;
  }, [route]);
  useEffect(() => {
    document.documentElement.dataset.theme = night ? 'night' : '';
  }, [night]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        document.getElementById('topnav-search')?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const tabs: [string, string, string][] = [
    ['/', 'Aprender', 'inicio'],
    ['/practica', 'Práctica', 'practica'],
    ['/laboratorio', 'Laboratorio', 'labs'],
    ['/cheatsheets', 'Chuletas', 'cheatsheets']
  ];
  const activeTab = (key: string) =>
    key === 'inicio' ? (route.name === 'home' || route.name === 'track' || route.name === 'module' || route.name === 'lesson')
      : key === 'practica' ? route.name === 'practice' || route.name === 'projects'
      : key === 'labs' ? route.name === 'labs' || route.name === 'lab'
      : route.name === key;

  return <div className="app-shell">
    <header className="topnav">
      <button className="menu-btn" onClick={() => setOpen(o => !o)} aria-label="Abrir menú">☰</button>
      <a className="topnav-logo" href={href('/')}><span>⌬</span><span className="topnav-brand">Academia</span></a>
      <nav className="topnav-tabs">
        {tabs.map(([path, label, key]) => <a key={path} className={`topnav-tab ${activeTab(key) ? 'active' : ''}`} href={href(path)}>{label}</a>)}
      </nav>
      <div className="topnav-spacer" />
      <div className="topnav-search" id="topnav-search-wrap">
        <span>⌕</span>
        <input id="topnav-search" value={query} placeholder="Buscar lecciones y temas…" onChange={e => setQuery(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && query.trim()) { go(`/search/${encodeURIComponent(query.trim())}`); setQuery(''); } }} />
        <kbd>⌘K</kbd>
      </div>
      {!online && <span className="offline-chip">offline</span>}
      {needRefresh && <button className="btn-update" onClick={() => void updateServiceWorker(true)}>Actualizar</button>}
      <a className="topnav-pill" href={href('/notes')}>✎ Mis notas</a>
      <button className="topnav-icon" onClick={() => setNight(n => !n)} aria-label="Cambiar tema">{night ? '☀' : '☾'}</button>
      <a className="topnav-pill avatar" href={href('/notes')} title="Mi progreso">AC</a>
    </header>

    <aside className={`sidebar-wrap ${open ? 'open' : ''}`}><Sidebar onNavigate={() => setOpen(false)} /></aside>
    {open && <div className="scrim" onClick={() => setOpen(false)} />}
    <div className="main-wrap">
      <main className="main-content">{children}</main>
      <footer className="footer">Academia de Robótica & AI Engineer · funciona sin conexión · papel, tinta y método</footer>
    </div>
  </div>;
}
