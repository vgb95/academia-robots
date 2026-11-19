import { useState } from 'react';
import type { LessonBridge } from '../types';
import { BlockRenderer, RichText } from './BlockRenderer';

// El contenido va en un panel plegable cerrado por defecto: en iPad no debe
// ocupar la pantalla antes de que el alumno haya leído la lección.
export function WhySection({ bridge }: { bridge?: LessonBridge }): React.ReactNode {
  const [open, setOpen] = useState(false);
  if (!bridge) return null;

  const panelId = 'why-bridge-panel';
  return <section style={{ margin: '28px 0' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <button
        className="btn btn-ghost"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(o => !o)}
      >{open ? 'Ocultar por qué y profundización' : 'Ver por qué y profundizar'}</button>
      {!open && <span className="muted">Por qué existe este tema, de dónde viene y adónde lleva.</span>}
    </div>
    <div id={panelId} hidden={!open} style={{ display: open ? 'block' : 'none', marginTop: 14 }}>
      <div className="callout-title">POR QUÉ IMPORTA</div>
      <p style={{ margin: '6px 0 14px' }}><RichText text={bridge.why} /></p>
      <p className="muted" style={{ margin: '0 0 14px' }}>Vengo de… <RichText text={bridge.from} /></p>
      {bridge.analogy && <aside className="callout apunte" style={{ margin: '14px 0' }}>
        <div className="callout-title">Analogía</div>
        <RichText text={bridge.analogy} />
      </aside>}
      {bridge.extraBlocks && bridge.extraBlocks.length > 0 && <div style={{ marginTop: 18 }}>
        <div className="objectives" style={{ marginBottom: 0 }}>
          <div className="callout-title">Profundización</div>
          <BlockRenderer blocks={bridge.extraBlocks} />
        </div>
      </div>}
    </div>
  </section>;
}

export function BridgeToNext({ bridge }: { bridge?: LessonBridge }): React.ReactNode {
  if (!bridge) return null;
  return <section style={{ margin: '28px 0' }}>
    <aside className="callout" style={{ margin: 0 }}>
      <div className="callout-title">¿Y DESPUÉS?</div>
      <p style={{ margin: 0 }}><RichText text={bridge.to} /></p>
    </aside>
  </section>;
}
