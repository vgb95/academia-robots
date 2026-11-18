import { useEffect, useState, type ReactNode } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { tracks } from '../data/tracks';
import { useStore } from '../state/store';
import { href, go, useRoute } from '../router';

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const route = useRoute();
  const { state } = useStore();
  const currentTrack = route.name === 'lesson'
    ? (() => { const id = route.id; for (const t of tracks) for (const m of t.modules) if (m.lessons.some(l => l.id === id)) return t; })()
    : 'track' in route ? tracks.find(t => t.id === route.track)
    : undefined;
  return <nav className="sidebar" onClick={onNavigate}>
    <a className="brand" href={href('/')}><span className="brand-mark">⬢</span><span>Academia<strong>Robótica & IA</strong></span></a>
    <div className="sidebar-section-title">TRACKS</div>
    {tracks.map(t => <a key={t.id} className={`side-link ${currentTrack?.id === t.id ? 'active' : ''}`} href={href(`/track/${t.id}`)}>
      <span className="side-icon">{t.icon}</span><span>{t.title}</span>
    </a>)}
    {currentTrack && <>
      <div className="sidebar-section-title">BLOQUES · {currentTrack.title.toUpperCase()}</div>
      {currentTrack.modules.map((m, i) => {
        const done = m.lessons.filter(l => state.progress[l.id] === 'done').length;
        const p = Math.round(done / Math.max(1, m.lessons.length) * 100);
        return <a key={m.id} className="side-link small" href={href(`/track/${currentTrack.id}/${m.id}`)}>
          <span className="side-num">{String(i).padStart(2, '0')}</span><span className="side-label">{m.title}</span><span className="side-pct">{p}%</span>
        </a>;
      })}
    </>}
    <div className="sidebar-section-title">HERRAMIENTAS</div>
    {[
      ['/library', '📚', 'Biblioteca'], ['/projects', '🛠️', 'Proyectos'],
      ['/glossary', '📖', 'Glosario'], ['/kit', '🔧', 'Banco y BOM'],
      ['/cases', '🦾', 'Casos reales'], ['/flashcards', '🃏', 'Flashcards'],
      ['/troubleshooting', '🔧', 'Diagnóstico'], ['/cheatsheets', '📋', 'Chuletas'],
      ['/notes', '✍️', 'Mis notas'], ['/search', '🔎', 'Buscar']
    ].map(([path, icon, label]) => <a key={path} className="side-link" href={href(path)}><span className="side-icon">{icon}</span><span>{label}</span></a>)}
    <div className="sidebar-foot">Hecho para aprenderse a fondo.<br />Offline, en tu iPad.</div>
  </nav>;
}

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const { needRefresh, updateServiceWorker } = useRegisterSW();
  const route = useRoute();

  useEffect(() => {
    const on = () => setOnline(true), off = () => setOnline(false);
    window.addEventListener('online', on); window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  useEffect(() => { setOpen(false); }, [route]);

  return <div className="app-shell">
    <aside className={`sidebar-wrap ${open ? 'open' : ''}`}><Sidebar onNavigate={() => setOpen(false)} /></aside>
    {open && <div className="scrim" onClick={() => setOpen(false)} />}
    <div className="main-wrap">
      <header className="topbar">
        <button className="menu-btn" onClick={() => setOpen(o => !o)} aria-label="Abrir menú">☰</button>
        <button className="top-title" onClick={() => go('/')}>Academia <span>Robótica & AI Engineer</span></button>
        <div className="topbar-right">
          {!online && <span className="offline-chip">sin conexión · modo offline</span>}
          {needRefresh && <button className="btn-update" onClick={() => void updateServiceWorker(true)}>Hay una versión nueva · actualizar</button>}
          <a className="icon-btn" href={href('/search')} aria-label="Buscar">🔎</a>
          <a className="icon-btn" href={href('/notes')} aria-label="Mis notas">✍️</a>
        </div>
      </header>
      <main className="main-content">{children}</main>
      <footer className="footer">Academia de Robótica & AI Engineer · Contenido original en español · Funciona sin conexión</footer>
    </div>
  </div>;
}
