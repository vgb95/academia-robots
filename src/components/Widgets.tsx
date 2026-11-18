import { useMemo, useState } from 'react';

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="widget"><div className="widget-title">🧮 {title}</div>{children}</div>;
}
function Field({ label, value, onChange, step = '1', unit }: { label: string; value: number; onChange: (n: number) => void; step?: string; unit?: string }) {
  return <label className="field"><span>{label}</span><span className="field-input">
    <input type="number" inputMode="decimal" step={step} value={value} onChange={e => onChange(Number(e.target.value))} />
    {unit && <em>{unit}</em>}
  </span></label>;
}
function Result({ label, value }: { label: string; value: string }) {
  return <div className="result"><span>{label}</span><strong>{value}</strong></div>;
}

export function OhmWidget() {
  const [v, setV] = useState(5), [r, setR] = useState(330);
  const i = r > 0 ? v / r : 0;
  const p = v * i;
  return <Card title="Calculadora de Ohm">
    <div className="widget-grid">
      <Field label="Voltaje" value={v} onChange={setV} step="0.1" unit="V" />
      <Field label="Resistencia" value={r} onChange={setR} step="1" unit="Ω" />
    </div>
    <div className="results">
      <Result label="Corriente I = V/R" value={`${(i * 1000).toFixed(2)} mA`} />
      <Result label="Potencia P = V·I" value={`${(p * 1000).toFixed(1)} mW`} />
    </div>
    <p className="widget-hint">Una resistencia de 1/4 W soporta 250 mW. Si P va más alto, cambia la potencia.</p>
  </Card>;
}

export function DividerWidget() {
  const [vin, setVin] = useState(5), [r1, setR1] = useState(10000), [r2, setR2] = useState(20000);
  const vout = r1 + r2 > 0 ? vin * r2 / (r1 + r2) : 0;
  const current = r1 + r2 > 0 ? vin / (r1 + r2) : 0;
  return <Card title="Divisor de voltaje">
    <div className="widget-grid">
      <Field label="Vin" value={vin} onChange={setVin} step="0.1" unit="V" />
      <Field label="R1 (arriba)" value={r1} onChange={setR1} step="100" unit="Ω" />
      <Field label="R2 (abajo)" value={r2} onChange={setR2} step="100" unit="Ω" />
    </div>
    <div className="results">
      <Result label="Vout" value={`${vout.toFixed(3)} V`} />
      <Result label="Corriente" value={`${(current * 1000).toFixed(3)} mA`} />
    </div>
    <div className="bar"><div style={{ width: `${Math.min(100, vout / Math.max(vin, 0.001) * 100)}%` }} /></div>
    <p className="widget-hint">Vout = Vin · R2/(R1+R2). Recuerda: si conectas una carga baja, este valor cae.</p>
  </Card>;
}

export function LedWidget() {
  const [vs, setVs] = useState(5), [vf, setVf] = useState(2), [ifma, setIf] = useState(10);
  const r = ifma > 0 ? (vs - vf) / (ifma / 1000) : 0;
  const p = Math.pow((ifma / 1000), 2) * r;
  return <Card title="Resistencia para LED">
    <div className="widget-grid">
      <Field label="Alimentación" value={vs} onChange={setVs} step="0.1" unit="V" />
      <Field label="Vf del LED" value={vf} onChange={setVf} step="0.1" unit="V" />
      <Field label="Corriente deseada" value={ifma} onChange={setIf} step="1" unit="mA" />
    </div>
    <div className="results">
      <Result label="Resistencia" value={r > 0 ? `${Math.round(r)} Ω → ${Math.round(r / 10) * 10} Ω estándar` : '—'} />
      <Result label="Disipación" value={`${(p * 1000).toFixed(1)} mW`} />
    </div>
    <p className="widget-hint">Vf típico: rojo 1.8 V · verde 2.1 V · blanco/azul 3.0 V.</p>
  </Card>;
}

export function PwmWidget() {
  const [duty, setDuty] = useState(50), [freq, setFreq] = useState(1000);
  const period = 1000 / freq;
  return <Card title="Visualizador de PWM">
    <div className="widget-grid">
      <Field label="Duty cycle" value={duty} onChange={setDuty} step="1" unit="%" />
      <Field label="Frecuencia" value={freq} onChange={setFreq} step="100" unit="Hz" />
    </div>
    <svg viewBox="0 0 600 130" className="pwm-svg" role="img" aria-label="Forma de onda PWM">
      <rect width="600" height="130" fill="#0d1426" rx="8" />
      <line x1="20" y1="100" x2="580" y2="100" stroke="#3b4b70" />
      <line x1="20" y1="30" x2="580" y2="30" stroke="#243252" strokeDasharray="4 4" />
      {[0, 1, 2, 3].map(i => {
        const x = 20 + i * 140;
        const on = 140 * duty / 100;
        return <polyline key={i} points={`${x},100 ${x},30 ${x + on},30 ${x + on},100 ${x + 140},100`} fill="none" stroke="#7dd3fc" strokeWidth="3" />;
      })}
      <text x="30" y="122" fill="#93a4c8" fontSize="11">0 V</text>
      <text x="540" y="122" fill="#93a4c8" fontSize="11">t →</text>
    </svg>
    <div className="results">
      <Result label="Tensión media (5 V)" value={`${(5 * duty / 100).toFixed(2)} V`} />
      <Result label="Periodo" value={`${period.toFixed(2)} ms`} />
    </div>
  </Card>;
}

export function BomWidget() {
  const tiers = [
    { id: 'Tier 0', price: '$0', items: ['Falstad Circuit Simulator', 'Tinkercad Circuits', 'All About Circuits'], desc: 'Aprende Ohm y divisores antes de gastar nada. Hazlo de verdad.' },
    { id: 'Tier 1', price: '$45–60', items: ['Kit Elegoo UNO R3 (~$43)', 'Multímetro digital (~$17)', 'Cables y resistencias'], desc: 'Kit solderless + multímetro. Empiezas a construir en días.' },
    { id: 'Tier 2', price: '$110–160', items: ['Pinecil V2 (~$26–36)', 'Estaño, flux, cortadores', 'Perfboard y pasivos extra'], desc: 'Añade soldadura y herramientas de banco.' },
    { id: 'Tier 3', price: '$200–300', items: ['Fuente de banco', 'RPLIDAR C1 (~$69)', 'Chasis de robot + LiPo'], desc: 'El banco completo para proyectos serios.' }
  ];
  const [active, setActive] = useState(1);
  return <Card title="Presupuesto por tiers">
    <div className="tier-tabs">{tiers.map((t, i) => <button key={t.id} className={i === active ? 'active' : ''} onClick={() => setActive(i)}>{t.id}<small>{t.price}</small></button>)}</div>
    <p className="widget-hint">{tiers[active].desc}</p>
    <ul className="clean-list">{tiers[active].items.map(x => <li key={x}>{x}</li>)}</ul>
    <p className="widget-hint">Compra el primer kit en Amazon o Elegoo directo para no esperar semanas. Después, AliExpress.</p>
  </Card>;
}

export function PidWidget() {
  const [kp, setKp] = useState(1.2), [ki, setKi] = useState(0.2), [kd, setKd] = useState(0.4);
  const pts = useMemo(() => {
    const arr: string[] = [];
    const overshoot = Math.max(0, (kp - 1) * 0.45 - kd * 0.25);
    const settle = Math.max(30, 230 - kp * 30 + kd * 60);
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const x = 60 + t * 650;
      const resp = 1 - Math.exp(-t * kp * 3.2) * (Math.cos(t * kp * 9) + overshoot * Math.sin(t * kp * 9));
      const noise = ki * 0.05 * Math.sin(t * 40);
      const y = 230 - Math.max(-0.3, Math.min(1.4, resp + noise)) * 170;
      arr.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    void settle;
    return arr.join(' ');
  }, [kp, ki, kd]);
  return <Card title="Simulador de respuesta PID">
    <div className="widget-grid">
      <Field label="Kp" value={kp} onChange={setKp} step="0.1" />
      <Field label="Ki" value={ki} onChange={setKi} step="0.05" />
      <Field label="Kd" value={kd} onChange={setKd} step="0.05" />
    </div>
    <svg viewBox="0 0 760 280" className="pwm-svg" role="img" aria-label="Respuesta al escalón del lazo PID">
      <rect width="760" height="280" fill="#0d1426" rx="8" />
      <line x1="60" y1="230" x2="720" y2="230" stroke="#3b4b70" />
      <line x1="60" y1="60" x2="60" y2="230" stroke="#3b4b70" />
      <line x1="60" y1="60" x2="720" y2="60" stroke="#ffbe5a" strokeDasharray="5 5" />
      <polyline points={pts} fill="none" stroke="#7dd3fc" strokeWidth="2.5" />
      <text x="670" y="52" fill="#ffbe5a" fontSize="11">setpoint</text>
    </svg>
    <p className="widget-hint">Sube Kp → más rápido pero oscila. Sube Kd → amortigua. Sube Ki → elimina error steady-state pero puede causar windup.</p>
  </Card>;
}

export function CosteLLMWidget() {
  const [inTokens, setIn] = useState(1000000), [outTokens, setOut] = useState(200000), [priceIn, setPin] = useState(3), [priceOut, setPout] = useState(15);
  const cost = inTokens / 1e6 * priceIn + outTokens / 1e6 * priceOut;
  return <Card title="Coste de inferencia LLM">
    <div className="widget-grid">
      <Field label="Tokens de entrada" value={inTokens} onChange={setIn} step="10000" />
      <Field label="Tokens de salida" value={outTokens} onChange={setOut} step="10000" />
      <Field label="$ / 1M entrada" value={priceIn} onChange={setPin} step="0.1" unit="$" />
      <Field label="$ / 1M salida" value={priceOut} onChange={setPout} step="0.1" unit="$" />
    </div>
    <div className="results"><Result label="Coste total" value={`$${cost.toFixed(2)}`} /><Result label="Coste por 1k peticiones" value={`$${(cost * 1000).toFixed(2)}`} /></div>
    <p className="widget-hint">La salida suele costar 3–5× más que la entrada. Optimiza el prompt y usa caché de prefijo antes de cambiar de modelo.</p>
  </Card>;
}

export function Widget({ id }: { id: string }) {
  switch (id) {
    case 'ohm': return <OhmWidget />;
    case 'divisor': return <DividerWidget />;
    case 'led': return <LedWidget />;
    case 'pwm': return <PwmWidget />;
    case 'bom': return <BomWidget />;
    case 'pid': return <PidWidget />;
    case 'coste-llm': return <CosteLLMWidget />;
    default: return null;
  }
}
