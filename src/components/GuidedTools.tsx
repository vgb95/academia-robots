import { useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { href } from '../router';

/* ==========================================================================
   Herramientas guiadas. Cuatro páginas independientes, sin editor libre:
   el usuario introduce una acción por paso y la escena responde.
   ========================================================================== */

type Crumb = { label: string; path?: string };

function ToolShell({ eyebrow, title, description, crumbs, children }: {
  eyebrow: string;
  title: string;
  description: string;
  crumbs: Crumb[];
  children: ReactNode;
}) {
  return (
    <div className="page tool-page">
      <nav className="breadcrumb tool-breadcrumb" aria-label="Ruta de navegación">
        <a href={href('/')}>Inicio</a>
        {crumbs.map(c => <span key={c.label} className="tool-crumb">
          <span aria-hidden="true">/</span>
          {c.path ? <a href={href(c.path)}>{c.label}</a> : <span>{c.label}</span>}
        </span>)}
      </nav>
      <header className="page-header tool-page-header">
        <div className="tool-eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      {children}
    </div>
  );
}

function crumbsFor(title: string): Crumb[] {
  return [
    { label: 'Laboratorio', path: '/laboratorio' },
    { label: 'Herramientas' },
    { label: title }
  ];
}

/* --------------------------------------------------------------------------
   1. Circuito guiado
   -------------------------------------------------------------------------- */

type CircuitStep = {
  id: string;
  label: string;
  mark: string;
  prompt: string;
  condition: string;
  phrase: string;
};

const CIRCUIT_STEPS: CircuitStep[] = [
  {
    id: 'bateria',
    label: 'Batería',
    mark: 'BAT',
    prompt: 'Empieza por la fuente: coloca la batería.',
    condition: 'Falta la fuente: sin diferencia de potencial no circula corriente.',
    phrase: 'La batería fija los 5 V que pondrán en movimiento la corriente.'
  },
  {
    id: 'resistencia',
    label: 'Resistencia',
    mark: 'R',
    prompt: 'Limita el paso de corriente antes de llegar al LED.',
    condition: 'La resistencia va antes del LED: sin ella la corriente sería excesiva.',
    phrase: 'La resistencia impone el límite: 330 Ω sujetan la corriente.'
  },
  {
    id: 'cable',
    label: 'Cable',
    mark: '—',
    prompt: 'Continúa el trazo con el cable.',
    condition: 'Hace falta el cable: el lazo sigue abierto y no hay retorno.',
    phrase: 'El cable cierra el recorrido y devuelve la corriente al negativo.'
  },
  {
    id: 'led',
    label: 'LED',
    mark: 'LED',
    prompt: 'Termina colocando el LED en el lazo.',
    condition: 'El LED va al final, con el cátodo hacia el terminal negativo.',
    phrase: 'El LED se enciende: el circuito está completo.'
  }
];

const CIRCUIT_PALETTE = ['bateria', 'resistencia', 'led', 'cable'];

const CIRCUIT_V = 5;
const CIRCUIT_VF = 2;
const CIRCUIT_R = 330;
const CIRCUIT_I_MA = ((CIRCUIT_V - CIRCUIT_VF) / CIRCUIT_R) * 1000;

export function GuidedCircuitPage() {
  const [placed, setPlaced] = useState<string[]>([]);
  const [error, setError] = useState<{ id: string; msg: string; nonce: number } | null>(null);

  const complete = placed.length === CIRCUIT_STEPS.length;
  const current = CIRCUIT_STEPS[placed.length];
  const lastPhrase = placed.length > 0 ? CIRCUIT_STEPS[placed.length - 1].phrase : null;
  const drawn = (placed.length / CIRCUIT_STEPS.length) * 100;

  function tryPlace(id: string) {
    if (complete) return;
    if (id === current.id) {
      setPlaced(p => [...p, id]);
      setError(null);
    } else {
      setError({ id, msg: current.condition, nonce: Date.now() });
    }
  }

  return (
    <ToolShell
      eyebrow="Herramienta 01 · Circuito guiado"
      title="Arma un circuito, paso a paso"
      description="Coloca un elemento en cada paso. Si aciertas, el trazo avanza y aparece una frase; si no, el elemento titubea y verás la condición que falta. Al terminar, el nodo muestra la corriente."
      crumbs={crumbsFor('Circuito guiado')}
    >
      <section className="tool-card circuit-card">
        <div className="tool-card-head">
          <h2 className="tool-card-title">Lazo en serie</h2>
          <span className="tool-mono">Paso {Math.min(placed.length + 1, 4)} / 4 · {complete ? 'Completo' : 'En curso'}</span>
        </div>

        <div className="circuit-stage">
          <svg viewBox="0 0 720 300" className="circuit-svg" role="img" aria-label="Esquema del circuito en serie">
            <path
              className="circuit-wire"
              d="M140 240 L140 60 L580 60 L580 240 Z"
              pathLength={100}
              strokeDasharray="100"
              strokeDashoffset={100 - drawn}
            />

            {placed.includes('bateria') && <g className="circuit-glyph">
              <line x1="122" y1="140" x2="158" y2="140" />
              <line x1="130" y1="160" x2="150" y2="160" />
              <text x="106" y="136">+</text>
              <text x="106" y="166">−</text>
              <text x="100" y="196">5 V</text>
            </g>}

            {placed.includes('resistencia') && <g className="circuit-glyph">
              <polyline points="300,60 310,46 324,74 338,46 352,74 366,60" />
              <text x="333" y="32" textAnchor="middle">330 Ω</text>
            </g>}

            {placed.includes('led') && <g className="circuit-glyph">
              <polygon points="562,130 600,150 562,170" />
              <line x1="602" y1="128" x2="602" y2="172" />
              <line x1="610" y1="134" x2="620" y2="124" />
              <line x1="610" y1="166" x2="620" y2="176" />
              <text x="626" y="154">LED</text>
            </g>}

            {placed.includes('cable') && <g className="circuit-glyph">
              <circle cx="360" cy="240" r="6" />
              <text x="360" y="268" textAnchor="middle">cable</text>
            </g>}

            {complete && <g className="circuit-current">
              <circle cx="470" cy="60" r="5" />
              <text x="470" y="38" textAnchor="middle">I = {CIRCUIT_I_MA.toFixed(2)} mA</text>
              <text x="470" y="92" textAnchor="middle">I = (V − Vf) / R</text>
            </g>}

            <text className="circuit-corner" x="140" y="278" textAnchor="middle">−</text>
            <text className="circuit-corner" x="580" y="278" textAnchor="middle">retorno</text>
          </svg>
        </div>

        <p className="circuit-goal">{complete ? 'Circuito cerrado y simulado.' : current.prompt}</p>
        {lastPhrase && <p className="circuit-phrase">{lastPhrase}</p>}
        {error && <p className="circuit-error" role="status">FALTA · {error.msg}</p>}

        <div className="circuit-palette" aria-label="Elementos disponibles">
          {CIRCUIT_PALETTE.map(id => {
            const step = CIRCUIT_STEPS.find(s => s.id === id)!;
            const done = placed.includes(id);
            const hesitating = error?.id === id;
            return <button
              key={id + (hesitating ? '-' + error.nonce : '')}
              type="button"
              className={`circuit-chip ${done ? 'circuit-chip--done' : ''} ${hesitating ? 'circuit-chip--hesitate' : ''}`}
              onClick={() => tryPlace(id)}
              disabled={done || complete}
            >
              <span className="circuit-chip-icon" aria-hidden="true">{step.mark}</span>
              <span>{step.label}</span>
            </button>;
          })}
        </div>

        <div className="tool-actions">
          <button type="button" className="tool-btn" onClick={() => { setPlaced(CIRCUIT_STEPS.map(s => s.id)); setError(null); }} disabled={complete}>
            Ver completo
          </button>
          <button type="button" className="tool-btn tool-btn--ghost" onClick={() => { setPlaced([]); setError(null); }}>
            Reiniciar
          </button>
          <span className="tool-mono circuit-progress">V = {CIRCUIT_V.toFixed(1)} V · Vf = {CIRCUIT_VF.toFixed(1)} V · R = {CIRCUIT_R} Ω</span>
        </div>
      </section>
    </ToolShell>
  );
}

/* --------------------------------------------------------------------------
   2. Osciloscopio
   -------------------------------------------------------------------------- */

function pwmPoints(freq: number, duty: number): string {
  const cycles = Math.max(1, Math.min(8, Math.round(freq / 500)));
  const period = 640 / cycles;
  const on = period * duty / 100;
  const yHigh = 80;
  const yLow = 200;
  const out: string[] = [];
  for (let k = 0; k < cycles; k++) {
    const x = 40 + k * period;
    out.push(
      `${x.toFixed(1)},${yLow}`,
      `${x.toFixed(1)},${yHigh}`,
      `${(x + on).toFixed(1)},${yHigh}`,
      `${(x + on).toFixed(1)},${yLow}`,
      `${(x + period).toFixed(1)},${yLow}`
    );
  }
  return out.join(' ');
}

function i2cPaths(freq: number) {
  const bitW = Math.max(26, Math.min(72, 40000 / freq));
  const bits = [1, 0, 1, 0, 0, 1, 0, 0];
  const x0 = 40;
  const startX = x0 + 28;
  const ySdaHigh = 96, ySdaLow = 152, ySclHigh = 196, ySclLow = 252;

  const sda = [`M ${x0} ${ySdaHigh}`, `L ${startX} ${ySdaHigh}`, `L ${startX} ${ySdaLow}`];
  const scl = [`M ${x0} ${ySclHigh}`, `L ${startX + 8} ${ySclHigh}`];

  bits.forEach((bit, i) => {
    const bx = startX + 8 + i * bitW;
    sda.push(`L ${bx.toFixed(1)} ${bit ? ySdaHigh : ySdaLow}`);
    scl.push(`L ${bx.toFixed(1)} ${ySclLow}`);
    scl.push(`L ${(bx + bitW / 2).toFixed(1)} ${ySclHigh}`);
    scl.push(`L ${(bx + bitW).toFixed(1)} ${ySclLow}`);
  });

  const stopX = startX + 8 + bits.length * bitW + 16;
  scl.push(`L ${stopX.toFixed(1)} ${ySclHigh}`);
  sda.push(`L ${stopX.toFixed(1)} ${ySdaLow}`, `L ${stopX.toFixed(1)} ${ySdaHigh}`);

  return { sda: sda.join(' '), scl: scl.join(' '), stopX };
}

function knobTurn(value: number, min: number, max: number): number {
  return -135 + ((value - min) / (max - min)) * 270;
}

export function OscilloscopePage() {
  const [freq, setFreq] = useState(1000);
  const [duty, setDuty] = useState(50);
  const [mode, setMode] = useState<'pwm' | 'i2c'>('pwm');

  const i2c = i2cPaths(freq);
  const periodMs = 1000 / freq;
  const vHighLabel = mode === 'pwm' ? (5 * duty / 100).toFixed(2) : '—';

  return (
    <ToolShell
      eyebrow="Herramienta 02 · Osciloscopio"
      title="Lee la forma de onda"
      description="Mueve las dos perillas para cambiar frecuencia y ancho de pulso. Observa el trazo fino sobre la rejilla y cambia a I²C para ver cómo se reparten SDA y SCL."
      crumbs={crumbsFor('Osciloscopio')}
    >
      <section className="tool-card scope-card">
        <div className="scope-head">
          <span className="tool-mono">Trazo continuo · rejilla 40 px</span>
          <div className="scope-mode">
            <label className="scope-mode-label" htmlFor="scope-mode-select">Señal</label>
            <select
              id="scope-mode-select"
              className="scope-select"
              value={mode}
              onChange={e => setMode(e.target.value as 'pwm' | 'i2c')}
            >
              <option value="pwm">PWM</option>
              <option value="i2c">I²C · SDA/SCL</option>
            </select>
          </div>
        </div>

        <div className="scope-stage">
          <svg viewBox="0 0 720 300" className="scope-svg" role="img" aria-label={mode === 'pwm' ? 'Forma de onda PWM' : 'Tramas I2C con SDA y SCL'}>
            <g className="scope-grid">
              {Array.from({ length: 18 }, (_, i) => 40 + i * 40).map(x => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="300" />)}
              {Array.from({ length: 8 }, (_, i) => 20 + i * 40).map(y => <line key={`h${y}`} x1="0" y1={y} x2="720" y2={y} />)}
            </g>
            <line className="scope-axis" x1="40" y1="150" x2="680" y2="150" />

            {mode === 'pwm' ? <>
              <line className="scope-ref" x1="40" y1="80" x2="680" y2="80" />
              <line className="scope-ref" x1="40" y1="200" x2="680" y2="200" />
              <text className="scope-axis-label" x="44" y="72">ALTO · 5 V</text>
              <text className="scope-axis-label" x="44" y="216">BAJO · 0 V</text>
              <polyline className="scope-trace" points={pwmPoints(freq, duty)} />
            </> : <>
              <text className="scope-lane-sda" x="44" y="88">SDA</text>
              <text className="scope-lane-scl" x="44" y="188">SCL</text>
              <path className="scope-scl" d={i2c.scl} />
              <path className="scope-sda" d={i2c.sda} />
              <text className="scope-axis-label" x="44" y="286">START</text>
              <text className="scope-axis-label" x={Math.min(i2c.stopX + 4, 640)} y="286">STOP</text>
            </>}

            <text className="scope-axis-label" x="680" y="288" textAnchor="end">t →</text>
          </svg>
        </div>

        <div className="knobs">
          <label className="knob">
            <span className="knob-dial" style={{ '--turn': `${knobTurn(freq, 100, 5000)}deg` } as CSSProperties} aria-hidden="true">
              <span className="knob-pointer" />
            </span>
            <span className="knob-body">
              <span className="knob-name">Frecuencia</span>
              <input className="knob-range" type="range" min={100} max={5000} step={50} value={freq} onChange={e => setFreq(Number(e.target.value))} aria-label="Frecuencia" />
              <span className="knob-value">{(freq / 1000).toFixed(2)} kHz · T = {periodMs.toFixed(2)} ms</span>
            </span>
          </label>

          <label className="knob">
            <span className="knob-dial" style={{ '--turn': `${knobTurn(duty, 10, 90)}deg` } as CSSProperties} aria-hidden="true">
              <span className="knob-pointer" />
            </span>
            <span className="knob-body">
              <span className="knob-name">Ancho de pulso</span>
              <input className="knob-range" type="range" min={10} max={90} step={1} value={duty} onChange={e => setDuty(Number(e.target.value))} aria-label="Ancho de pulso" />
              <span className="knob-value">{duty} % · V media = {vHighLabel} V</span>
            </span>
          </label>
        </div>

        <div className="tool-readouts">
          <div className="tool-readout"><span>Período</span><strong>{periodMs.toFixed(2)} ms</strong></div>
          <div className="tool-readout"><span>Duty</span><strong>{duty} %</strong></div>
          <div className="tool-readout"><span>Señal</span><strong>{mode === 'pwm' ? 'PWM' : 'I²C'}</strong></div>
        </div>
      </section>
    </ToolShell>
  );
}

/* --------------------------------------------------------------------------
   3. Brazo 2 DOF con cinemática inversa
   -------------------------------------------------------------------------- */

const ARM_L1 = 120;
const ARM_L2 = 90;
const ARM_BASE = { x: 250, y: 210 };
const ARM_REACH = ARM_L1 + ARM_L2;

function solveIK(tx: number, ty: number) {
  const dx = tx - ARM_BASE.x;
  const dy = ty - ARM_BASE.y;
  const raw = Math.hypot(dx, dy) || 1;
  const d = Math.min(Math.max(raw, Math.abs(ARM_L1 - ARM_L2) + 0.5), ARM_REACH);
  const ux = dx / raw;
  const uy = dy / raw;
  const ex = ARM_BASE.x + ux * d;
  const ey = ARM_BASE.y + uy * d;
  const cos2 = (d * d - ARM_L1 * ARM_L1 - ARM_L2 * ARM_L2) / (2 * ARM_L1 * ARM_L2);
  const q2 = Math.acos(Math.max(-1, Math.min(1, cos2)));
  const q1 = Math.atan2(ey - ARM_BASE.y, ex - ARM_BASE.x)
    - Math.atan2(ARM_L2 * Math.sin(q2), ARM_L1 + ARM_L2 * Math.cos(q2));
  const jx = ARM_BASE.x + ARM_L1 * Math.cos(q1);
  const jy = ARM_BASE.y + ARM_L1 * Math.sin(q1);
  return { ex, ey, jx, jy, q1, q2, d };
}

function toDeg(rad: number): string {
  return (rad * 180 / Math.PI).toFixed(1);
}

export function ArmViewerPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [target, setTarget] = useState({ x: 400, y: 110 });
  const [dragging, setDragging] = useState(false);
  const [showJacobian, setShowJacobian] = useState(false);

  const sol = solveIK(target.x, target.y);
  const det = ARM_L1 * ARM_L2 * Math.sin(sol.q2);
  const singular = Math.abs(Math.sin(sol.q2)) < 0.03;

  function updateTarget(e: ReactPointerEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg) return;
    const m = svg.getScreenCTM();
    if (!m) return;
    const p = svg.createSVGPoint();
    p.x = e.clientX;
    p.y = e.clientY;
    const local = p.matrixTransform(m.inverse());
    setTarget({ x: local.x, y: local.y });
  }

  function onHandleDown(e: ReactPointerEvent<SVGCircleElement>) {
    e.stopPropagation();
    setDragging(true);
    svgRef.current?.setPointerCapture(e.pointerId);
  }

  function onStageDown(e: ReactPointerEvent<SVGSVGElement>) {
    setDragging(true);
    svgRef.current?.setPointerCapture(e.pointerId);
    updateTarget(e);
  }

  function onStageUp(e: ReactPointerEvent<SVGSVGElement>) {
    if (!dragging) return;
    setDragging(false);
    if (svgRef.current?.hasPointerCapture(e.pointerId)) svgRef.current.releasePointerCapture(e.pointerId);
  }

  return (
    <ToolShell
      eyebrow="Herramienta 03 · Cinemática 2 DOF"
      title="Mueve el extremo del brazo"
      description="Arrastra el extremo con el dedo o el ratón. La cinemática inversa calcula los dos ángulos en tiempo real y los anota junto a cada articulación."
      crumbs={crumbsFor('Brazo 2 DOF')}
    >
      <section className="tool-card arm-card">
        <div className="tool-card-head">
          <h2 className="tool-card-title">Brazo planar de dos eslabones</h2>
          <span className="tool-mono">L1 = {ARM_L1} · L2 = {ARM_L2} · 2 grados de libertad</span>
        </div>

        <div className="arm-stage">
          <svg
            ref={svgRef}
            viewBox="0 0 700 400"
            className="arm-svg"
            role="img"
            aria-label="Brazo robótico de dos eslabones con cinemática inversa"
            onPointerDown={onStageDown}
            onPointerMove={e => { if (dragging) updateTarget(e); }}
            onPointerUp={onStageUp}
            onPointerCancel={onStageUp}
          >
            <g className="arm-grid">
              {[100, 200, 300, 400, 500, 600].map(x => <line key={`x${x}`} x1={x} y1="0" x2={x} y2="400" />)}
              {[80, 160, 240, 320].map(y => <line key={`y${y}`} x1="0" y1={y} x2="700" y2={y} />)}
            </g>

            <circle className="arm-workspace" cx={ARM_BASE.x} cy={ARM_BASE.y} r={ARM_REACH} />

            <line className="arm-ground" x1="150" y1="250" x2="560" y2="250" />
            {Array.from({ length: 20 }, (_, i) => 160 + i * 20).map(x =>
              <line key={`h${x}`} className="arm-hatch" x1={x} y1="250" x2={x - 8} y2="258" />
            )}

            <polygon className="arm-pedestal" points="232,250 268,250 258,214 242,214" />

            <line className="arm-link-1" x1={ARM_BASE.x} y1={ARM_BASE.y} x2={sol.jx} y2={sol.jy} />
            <line className="arm-link-2" x1={sol.jx} y1={sol.jy} x2={sol.ex} y2={sol.ey} />

            <circle className="arm-joint" cx={ARM_BASE.x} cy={ARM_BASE.y} r="8" />
            <circle className="arm-joint" cx={sol.jx} cy={sol.jy} r="7" />
            <circle className="arm-handle" cx={sol.ex} cy={sol.ey} r="13" onPointerDown={onHandleDown} />

            <text className="arm-angle" x={sol.jx + 12} y={sol.jy - 12}>θ₁ {toDeg(sol.q1)}°</text>
            <text className="arm-angle" x={(sol.jx + sol.ex) / 2 + 12} y={(sol.jy + sol.ey) / 2 + 22}>θ₂ {toDeg(sol.q2)}°</text>
            <text className="arm-angle" x={ARM_BASE.x - 40} y="278">BASE</text>

            {singular && showJacobian && <text className="arm-singular-label" x={sol.ex + 20} y={sol.ey - 18}>SINGULARIDAD</text>}
          </svg>
        </div>

        <div className="tool-readouts">
          <div className="tool-readout"><span>Ángulo θ₁</span><strong>{toDeg(sol.q1)}°</strong></div>
          <div className="tool-readout"><span>Ángulo θ₂</span><strong>{toDeg(sol.q2)}°</strong></div>
          <div className="tool-readout"><span>Alcance</span><strong>{sol.d.toFixed(1)}</strong></div>
          <div className="tool-readout"><span>det(J)</span><strong>{det.toFixed(1)}</strong></div>
        </div>

        <div className="tool-actions">
          <button type="button" className="tool-btn" onClick={() => setShowJacobian(v => !v)}>
            {showJacobian ? 'Ocultar Jacobiano/singularidad' : 'Ver Jacobiano/singularidad'}
          </button>
          <button type="button" className="tool-btn tool-btn--ghost" onClick={() => setTarget({ x: ARM_BASE.x + ARM_REACH, y: ARM_BASE.y })}>
            Llevar al límite
          </button>
        </div>

        {showJacobian && <div className="arm-jacobian">
          <div className="arm-jac-title">Jacobiano analítico</div>
          <p>det(J) = L₁ · L₂ · sen θ₂ = <strong>{det.toFixed(1)}</strong></p>
          <p>Cuando el brazo se estira del todo, θ₂ tiende a 0° y el determinante cae a cero: el extremo pierde la capacidad de moverse en la dirección radial.</p>
          <p className="arm-singular">
            {singular
              ? `Singularidad alcanzada · extensión ${sol.d.toFixed(1)} de ${ARM_REACH}`
              : `Lejos de la singularidad · extensión ${sol.d.toFixed(1)} de ${ARM_REACH}`}
          </p>
        </div>}
      </section>
    </ToolShell>
  );
}

/* --------------------------------------------------------------------------
   4. Antes / después con divisor de voltaje
   -------------------------------------------------------------------------- */

const DIV_VIN = 5;
const DIV_R1 = 10000;
const DIV_R2 = 20000;
const DIV_RL = 10000;
const V_BEFORE = DIV_VIN * DIV_R2 / (DIV_R1 + DIV_R2);
const R2_PARALLEL = DIV_R2 * DIV_RL / (DIV_R2 + DIV_RL);
const V_AFTER = DIV_VIN * R2_PARALLEL / (DIV_R1 + R2_PARALLEL);

function levelY(v: number): number {
  return 240 - (v / DIV_VIN) * 160;
}

function DividerScene({ withLoad, tag }: { withLoad: boolean; tag: string }) {
  const topEnd = withLoad ? 560 : 490;
  const groundEnd = withLoad ? 560 : 490;
  const level = withLoad ? V_AFTER : V_BEFORE;
  const y = levelY(level);

  return <svg viewBox="0 0 720 320" className="compare-svg" role="img" aria-label={tag}>
    <text className="compare-tag" x="28" y="36">{tag}</text>

    <path className="compare-wire" d={`M90 240 L90 80 L${topEnd} 80`} />
    <path className="compare-wire" d={`M90 240 L${groundEnd} 240`} />
    <path className="compare-wire" d="M490 200 L490 240" />

    <polyline className="compare-wire" points="250,80 262,64 280,96 298,64 316,96 334,64 346,80" />
    <polyline className="compare-wire" points="490,100 478,112 502,124 478,136 502,148 478,160 502,172 490,184" />

    {withLoad && <>
      <path className="compare-wire" d="M560 80 L560 100 M560 184 L560 240" />
      <polyline className="compare-wire" points="560,100 548,112 572,124 548,136 572,148 548,160 572,172 560,184" />
      <text className="compare-tag" x="582" y="146">RL</text>
    </>}

    <line x1="74" y1="140" x2="106" y2="140" stroke="var(--ink)" strokeWidth="2" />
    <line x1="80" y1="160" x2="100" y2="160" stroke="var(--ink)" strokeWidth="2" />
    <text className="compare-tag" x="30" y="132">Vin 5 V</text>

    <circle className="compare-node" cx="490" cy="80" r="5" />
    <text className="compare-tag" x="466" y="66">A</text>

    <line className="compare-guide" x1="515" y1={y} x2="690" y2={y} />
    <text className="compare-level-label" x="690" y={y - 8} textAnchor="end">{level.toFixed(2)} V</text>
  </svg>;
}

export function BeforeAfterPage() {
  const [pct, setPct] = useState(50);
  const t = pct / 100;
  const vNow = V_BEFORE + (V_AFTER - V_BEFORE) * t;
  const rNow = DIV_R2 + (R2_PARALLEL - DIV_R2) * t;
  const yNow = levelY(vNow);

  return (
    <ToolShell
      eyebrow="Herramienta 04 · Antes / después"
      title="La carga cambia la lectura"
      description="Desliza para descubrir el mismo divisor con y sin carga. El trazo de salida y su lectura se mueven contigo: la resistencia en paralelo baja el voltaje del nodo."
      crumbs={crumbsFor('Antes / después')}
    >
      <section className="tool-card compare-card">
        <div className="tool-card-head">
          <h2 className="tool-card-title">Divisor con y sin carga</h2>
          <span className="tool-mono">Vin 5 V · R1 10 kΩ · R2 20 kΩ · RL 10 kΩ</span>
        </div>

        <div className="compare-stage">
          <div className="compare-layer" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}>
            <DividerScene withLoad={false} tag="ANTES · SIN CARGA" />
          </div>
          <div className="compare-layer" style={{ clipPath: `inset(0 0 0 ${pct}%)` }}>
            <DividerScene withLoad tag="DESPUÉS · CON CARGA" />
          </div>

          <svg viewBox="0 0 720 320" className="compare-live" aria-hidden="true">
            <line className="compare-live-line" x1="515" y1={yNow} x2="700" y2={yNow} />
            <circle className="compare-live-node" cx="515" cy={yNow} r="5" />
            <text className="compare-live-label" x="700" y={yNow - 10} textAnchor="end">{vNow.toFixed(2)} V</text>
          </svg>

          <div className="compare-divider" style={{ left: `${pct}%` }}>
            <span className="compare-grip" aria-hidden="true">‹ ›</span>
          </div>
        </div>

        <div className="compare-control">
          <span>Antes · sin carga</span>
          <input
            className="compare-range"
            type="range"
            min={0}
            max={100}
            value={pct}
            onChange={e => setPct(Number(e.target.value))}
            aria-label="Desplazar entre antes y después"
          />
          <span>Después · con carga</span>
        </div>

        <div className="compare-readout">
          <div><small>Vout</small><strong>{vNow.toFixed(2)} V</strong></div>
          <div><small>R2 equivalente</small><strong>{(rNow / 1000).toFixed(1)} kΩ</strong></div>
          <div><small>Estado</small><strong>{t < 0.5 ? 'SIN CARGA' : 'CON CARGA'}</strong></div>
        </div>

        <p className="tool-note">Sin carga, R2 vale 20 kΩ y el nodo queda en 3,33 V. Al conectar RL = 10 kΩ en paralelo, el equivalente baja a 6,7 kΩ y Vout cae a 2,00 V.</p>
      </section>
    </ToolShell>
  );
}
