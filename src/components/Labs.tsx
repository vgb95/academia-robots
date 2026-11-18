import { useEffect, useState } from 'react';
import { labs, type Lab } from '../data/labs';
import { useStore } from '../state/store';
import { href } from '../router';

const toneFill: Record<string, string> = {
  green: '#e8efd9', violet: '#ebe3f1', orange: '#fbe5bd', mint: '#dff0de', plain: '#fbf7f1'
};
const toneStroke: Record<string, string> = {
  green: '#c9d6b3', violet: '#d5c8e2', orange: '#d5b07a', mint: '#bddb9e', plain: '#ddd3c5'
};

function LabScene({ lab, active }: { lab: Lab; active: string[] }) {
  const byId = Object.fromEntries(lab.nodes.map(n => [n.id, n]));
  return <svg viewBox="0 0 800 440" className="lab-scene-svg" role="img" aria-label={lab.title}>
    <defs>
      <pattern id="iso" width="44" height="24" patternUnits="userSpaceOnUse">
        <path d="M0 12 L22 0 L44 12 L22 24 Z" fill="none" stroke="#c6bbac" strokeWidth="1" />
      </pattern>
      <marker id="labArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="#6f6961" />
      </marker>
    </defs>
    <rect width="800" height="440" fill="url(#iso)" />
    {lab.edges.map((e, i) => {
      const a = byId[e.from], b = byId[e.to];
      if (!a || !b) return null;
      const lit = active.includes(e.from) && active.includes(e.to);
      return <g key={i}>
        <path d={`M${a.x} ${a.y} L${b.x} ${b.y}`} fill="none" stroke={lit ? '#7fc278' : '#bdb4a8'} strokeWidth={lit ? 2.4 : 1.3}
          strokeDasharray={lit ? undefined : '4 5'} markerEnd="url(#labArrow)" opacity={lit ? 1 : 0.7} />
        {e.label && lit && <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 9} textAnchor="middle" fill="#34302b" fontSize="11" fontFamily="system-ui, -apple-system, sans-serif">{e.label}</text>}
      </g>;
    })}
    {lab.nodes.map(n => {
      const isActive = active.includes(n.id);
      const w = n.w ?? Math.max(104, n.label.length * 9 + 34);
      return <g key={n.id} transform={`translate(${n.x - w / 2},${n.y - 23})`}>
        <rect x="3" y="3" width={w} height="46" rx="8" fill="#46413b" opacity={isActive ? 0.9 : 0.32} />
        <rect width={w} height="46" rx="8" fill={toneFill[n.tone ?? 'plain']} stroke={isActive ? '#17191D' : toneStroke[n.tone ?? 'plain']} strokeWidth={isActive ? 2 : 1.2} />
        <text x={w / 2} y="29" textAnchor="middle" fill="#17191D" fontSize="14" fontWeight={isActive ? 700 : 500} fontFamily="system-ui, -apple-system, sans-serif">{n.label}</text>
      </g>;
    })}
  </svg>;
}

export function LabsIndexPage() {
  return <div className="page lab-index">
    <div className="breadcrumb"><a href={href('/')}>Inicio</a><span>/</span>Laboratorio</div>
    <header className="page-header"><h1>Laboratorio</h1><p>Cada idea, un escenario que avanzas paso a paso. Toca «Siguiente» y observa qué cambia: eso que ves es lo que después sabes explicar.</p></header>
    <div className="lab-index-grid">
      {labs.map((l, i) => <a key={l.id} className={`lab-index-card ${l.track}`} href={href(`/laboratorio/${l.id}`)}>
        <div className="lab-index-num">LAB {String(i + 1).padStart(2, '0')} · {l.track === 'robotica' ? 'ROBÓTICA' : 'IA'}</div>
        <h2>{l.title}</h2>
        <p>{l.subtitle}</p>
        <div className="lab-index-meta"><span>{l.steps.length} pasos</span><span>{l.minutes} min</span><span>{l.level}</span></div>
      </a>)}
    </div>
  </div>;
}

export function LabPage({ id }: { id: string }) {
  const lab = labs.find(l => l.id === id);
  const { state, toggleCheck } = useStore();
  const [step, setStep] = useState(0);

  useEffect(() => { setStep(0); }, [id]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, textarea, select, button, [contenteditable]')) return;
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); setStep(s => Math.min(s + 1, (lab?.steps.length ?? 1) - 1)); }
      if (e.key === 'ArrowLeft') setStep(s => Math.max(s - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lab]);

  if (!lab) return <div className="page empty"><h1>404</h1><p>Ese laboratorio no existe.</p><a className="btn" href={href('/laboratorio')}>Ver todos</a></div>;

  const cur = lab.steps[step];
  const nextLab = labs[(labs.findIndex(l => l.id === lab.id) + 1) % labs.length];

  return <div className="page lab-page">
    <div className="breadcrumb"><a href={href('/')}>Inicio</a><span>/</span><a href={href('/laboratorio')}>Laboratorio</a><span>/</span>{lab.title}</div>
    <div className="lab-layout">
      <aside className="lab-sidebar">
        <div className="lab-side-head"><strong>LABORATORIO</strong><span>{labs.length} escenarios</span></div>
        {(['robotica', 'ai'] as const).map(track => <div key={track} className="lab-side-group">
          <div className="lab-side-label">{track === 'robotica' ? 'ROBÓTICA' : 'AI ENGINEER'}</div>
          {labs.filter(l => l.track === track).map(l => <a key={l.id} className={`lab-side-link ${l.id === lab.id ? 'active' : ''}`} href={href(`/laboratorio/${l.id}`)}>
            <span className="lab-side-dot" /><span>{l.title}</span>
          </a>)}
        </div>)}
        <div className="lab-side-foot">Mismo escenario, más claridad.</div>
      </aside>

      <section className="lab-main">
        <div className="lab-sheet">
          <div className="lab-sheet-head">
            <div className="lab-eyebrow">LAB · {lab.track === 'robotica' ? 'ROBÓTICA' : 'AI'} / PASO {step + 1} DE {lab.steps.length}</div>
            <h1>{lab.title}</h1>
            <p className="lab-subtitle">{lab.subtitle}</p>
            <div className="lab-meta"><span>{lab.minutes} min</span><span>{lab.level}</span><span>{lab.steps.length} pasos</span></div>
          </div>
          <div className="lab-stage">
            <LabScene lab={lab} active={cur.active} />
            <div className="lab-metrics">{cur.metrics?.map(([k, v]) => <div key={k} className="lab-metric"><small>{k}</small><strong>{v}</strong></div>)}</div>
          </div>
          <div className="lab-step-caption"><strong>{step + 1}. {cur.title}</strong><span>{cur.desc}</span></div>
          <div className="lab-step-track">
            {lab.steps.map((s, i) => <button key={i} className={`lab-step-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`} onClick={() => setStep(i)} title={s.title}>{i + 1}</button>)}
          </div>
        </div>
        <div className="lab-bottom-nav">
          <button className="btn btn-ghost" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>← Atrás</button>
          <button className="btn" onClick={() => setStep(s => Math.min(lab.steps.length - 1, s + 1))} disabled={step === lab.steps.length - 1}>Siguiente →</button>
          <button className="btn btn-ghost" onClick={() => setStep(0)}>Repetir</button>
          <span className="lab-kbd">← → · Espacio</span>
        </div>
        {step === lab.steps.length - 1 && <div className="lab-next"><span>¿Siguiente escenario?</span><a href={href(`/laboratorio/${nextLab.id}`)}>{nextLab.title} →</a></div>}
      </section>

      <aside className="lab-rail">
        <div className="lab-rail-card">
          <div className="lab-rail-top"><span>PASO {step + 1} / {lab.steps.length}</span><span className="lab-rail-badge">{step === 0 ? 'PROBLEMA' : step === lab.steps.length - 1 ? 'RESUMEN' : 'CONCEPTO'}</span></div>
          <div className="lab-rail-note">{cur.note ?? 'Observa qué se ilumina en cada paso.'}</div>
          <div className="lab-rail-controls">
            <button className="btn btn-ghost" onClick={() => setStep(s => Math.max(0, s - 1))}>← Atrás</button>
            <button className="btn btn-green" onClick={() => setStep(s => Math.min(lab.steps.length - 1, s + 1))}>Siguiente →</button>
          </div>
          <div className="lab-rail-hint">← → paso · Repetir vuelve al inicio</div>
        </div>
        <div className="lab-rail-card">
          <div className="lab-rail-title">APRENDERÁS</div>
          <div className="lab-learn-list">{lab.learn.map((item, i) => {
            const key = `lab-${lab.id}-${i}`;
            return <label key={i} className={state.checks[key] ? 'done' : ''}>
              <input type="checkbox" checked={!!state.checks[key]} onChange={() => toggleCheck(key)} /><span>{item}</span>
            </label>;
          })}</div>
        </div>
      </aside>
    </div>
  </div>;
}
