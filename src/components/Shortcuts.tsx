import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type Shortcut = { keys: string[]; label: string };

const SHORTCUTS: Shortcut[] = [
  { keys: ['←', '→'], label: 'Navegar entre lecciones y pasos del laboratorio' },
  { keys: ['Espacio'], label: 'Siguiente paso en el laboratorio' },
  { keys: ['⌘K', 'Ctrl+K'], label: 'Enfocar el buscador' },
  { keys: ['?'], label: 'Abrir o cerrar esta ayuda' },
  { keys: ['Escape'], label: 'Cerrar esta ayuda' },
];

function estaEscribiendo(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

export function ShortcutsProvider({ children }: { children: ReactNode }) {
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (abierto) {
          event.preventDefault();
          setAbierto(false);
        }
        return;
      }
      const esInterrogante = event.key === '?' || (event.key === '/' && event.shiftKey);
      if (!esInterrogante || estaEscribiendo(event.target)) return;
      event.preventDefault();
      setAbierto(prev => !prev);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [abierto]);

  return (
    <>
      {children}
      <button
        type="button"
        className="btn"
        aria-label="Abrir ayuda de atajos de teclado"
        title="Atajos de teclado (?)"
        onClick={() => setAbierto(true)}
        style={{
          position: 'fixed',
          right: 20,
          bottom: 20,
          width: 44,
          height: 44,
          padding: 0,
          borderRadius: '50%',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
        }}
      >
        ?
      </button>
      {abierto && (
        <div
          role="presentation"
          onClick={event => {
            if (event.target === event.currentTarget) setAbierto(false);
          }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(20, 18, 15, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10001,
            padding: 16,
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Atajos de teclado"
            className="lab-rail-card"
            style={{ width: '100%', maxWidth: 560, minHeight: 0, gap: 12 }}
          >
            <div className="lab-rail-title">ATAJOS DE TECLADO</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
              {SHORTCUTS.map(shortcut => (
                <div key={shortcut.label} style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    {shortcut.keys.map(key => <span key={key} className="badge">{key}</span>)}
                  </span>
                  <span>{shortcut.label}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setAbierto(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function ShortcutsButton() {
  return null;
}
