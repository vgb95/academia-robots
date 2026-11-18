import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { D, getDiagram } from '../data/diagrams';
import { href } from '../router';

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  background: 'rgba(12, 14, 17, 0.78)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24
};

const panelStyle: CSSProperties = {
  width: '100%',
  maxWidth: 980,
  maxHeight: '90vh',
  overflow: 'auto',
  background: 'var(--card, #fbf7f1)',
  border: '1px solid var(--line-strong, #ddd3c5)',
  borderRadius: 12,
  padding: 18
};

const panelHeadStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  marginBottom: 14
};

export function DiagramGalleryPage() {
  const keys = useMemo(() => Object.keys(D).sort(), []);
  const [query, setQuery] = useState('');
  const [openKey, setOpenKey] = useState<string | null>(null);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q === '' ? keys : keys.filter(k => k.toLowerCase().includes(q));
  }, [keys, query]);

  useEffect(() => {
    if (openKey === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenKey(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openKey]);

  const label = (key: string) => key.replace(/_/g, ' ');

  return <div className="page">
    <div className="breadcrumb"><a href={href('/')}>Inicio</a><span>/</span>Biblioteca visual</div>
    <header className="page-header">
      <span className="badge">BIBLIOTECA VISUAL</span>
      <h1>Esquemas</h1>
      <p>Todos los diagramas de las lecciones están aquí para repasar. Búscalos por nombre y ábrelos a tamaño completo cuando quieras verlos con calma.</p>
    </header>
    <div className="filters">
      <input className="search-input" placeholder="Buscar esquema por clave…" value={query} onChange={e => setQuery(e.target.value)} />
      <span className="count">{list.length} esquemas</span>
    </div>
    <div className="resource-grid">
      {list.map(key => <div key={key} className="resource-card">
        <div className="diagram-frame" dangerouslySetInnerHTML={{ __html: getDiagram(key) ?? '' }} />
        <h3>{label(key)}</h3>
        <button className="btn btn-ghost" onClick={() => setOpenKey(key)}>Ver grande</button>
      </div>)}
    </div>

    {openKey !== null && <div
      style={overlayStyle}
      onClick={e => { if (e.target === e.currentTarget) setOpenKey(null); }}
      role="presentation"
    >
      <div style={panelStyle} role="dialog" aria-modal="true" aria-label={label(openKey)}>
        <div style={panelHeadStyle}>
          <h3 style={{ margin: 0 }}>{label(openKey)}</h3>
          <button className="btn btn-ghost" onClick={() => setOpenKey(null)}>Cerrar</button>
        </div>
        <div className="diagram-frame" dangerouslySetInnerHTML={{ __html: getDiagram(openKey) ?? '' }} />
      </div>
    </div>}
  </div>;
}
