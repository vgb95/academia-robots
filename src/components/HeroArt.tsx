const inputs = [150, 205, 260];
const hidden = [125, 177, 229, 281];
const outputs = [177, 240];

const nodes: { x: number; y: number; r: number; fill: string }[] = [
  ...inputs.map((y, i) => ({ x: 470, y, r: 18, fill: i === 1 ? '#dff0de' : '#e7ddf5' })),
  ...hidden.map((y, i) => ({ x: 565, y, r: 18, fill: i % 2 === 0 ? '#e7ddf5' : '#dff0de' })),
  ...outputs.map((y, i) => ({ x: 665, y, r: i === 0 ? 21 : 19, fill: '#dff0de' }))
];

const edgesAtoB = inputs.flatMap(y1 => hidden.map(y2 => `M470 ${y1} L565 ${y2}`)).join(' ');
const edgesBtoC = hidden.flatMap(y1 => outputs.map(y2 => `M565 ${y1} L665 ${y2}`)).join(' ');

export function HeroArt() {
  return <svg viewBox="0 0 760 420" style={{ width: '100%', height: 'auto' }} role="img" aria-label="Dos trayectos: brazo robótico y red neuronal">
    <defs>
      <pattern id="heroIso" width="44" height="24" patternUnits="userSpaceOnUse">
        <path d="M0 12 L22 0 L44 12 L22 24 Z" fill="none" stroke="#c6bbac" strokeWidth="1" />
      </pattern>
      <marker id="heroArrow" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
        <path d="M0,0 L7,3.5 L0,7 Z" fill="#1d1b18" />
      </marker>
    </defs>

    <rect width="760" height="420" fill="#f4ebe0" />
    <rect width="760" height="420" fill="url(#heroIso)" />

    <path d="M25 30 H35 M30 25 V35 M725 30 H735 M730 25 V35" fill="none" stroke="#1d1b18" strokeWidth="2" opacity="0.35" />

    <rect x="40" y="54" width="308" height="300" rx="18" fill="#46413b" opacity="0.22" />
    <rect x="34" y="48" width="308" height="300" rx="18" fill="#fcdcbd" opacity="0.42" />
    <rect x="34" y="48" width="308" height="300" rx="18" fill="none" stroke="#1d1b18" strokeWidth="3" opacity="0.55" />

    <rect x="420" y="54" width="308" height="300" rx="18" fill="#46413b" opacity="0.22" />
    <rect x="414" y="48" width="308" height="300" rx="18" fill="#e7ddf5" opacity="0.48" />
    <rect x="414" y="48" width="308" height="300" rx="18" fill="none" stroke="#1d1b18" strokeWidth="3" opacity="0.55" />

    <path d="M70 330 H300" fill="none" stroke="#1d1b18" strokeWidth="2.5" strokeDasharray="10 8" opacity="0.35" />

    <rect x="96" y="312" width="150" height="24" rx="8" fill="#46413b" opacity="0.3" />
    <rect x="90" y="304" width="150" height="26" rx="8" fill="#cfe3b2" stroke="#1d1b18" strokeWidth="3.5" />
    <rect x="120" y="286" width="90" height="20" rx="6" fill="#fcdcbd" stroke="#1d1b18" strokeWidth="3" />

    <path d="M165 282 L128 198" fill="none" stroke="#1d1b18" strokeWidth="34" strokeLinecap="round" />
    <path d="M165 282 L128 198" fill="none" stroke="#fcdcbd" strokeWidth="27" strokeLinecap="round" />
    <circle cx="147" cy="240" r="3.5" fill="#1d1b18" />
    <circle cx="165" cy="282" r="15" fill="#f4ebe0" stroke="#1d1b18" strokeWidth="3.5" />
    <circle cx="165" cy="282" r="4.5" fill="#1d1b18" />

    <path d="M128 198 L238 146" fill="none" stroke="#1d1b18" strokeWidth="30" strokeLinecap="round" />
    <path d="M128 198 L238 146" fill="none" stroke="#cfe3b2" strokeWidth="23" strokeLinecap="round" />
    <circle cx="183" cy="172" r="3.5" fill="#1d1b18" />
    <circle cx="128" cy="198" r="15" fill="#cfe3b2" stroke="#1d1b18" strokeWidth="3.5" />
    <circle cx="128" cy="198" r="4.5" fill="#1d1b18" />

    <circle cx="238" cy="146" r="12" fill="#fcdcbd" stroke="#1d1b18" strokeWidth="3.5" />
    <path d="M238 146 L262 164" fill="none" stroke="#1d1b18" strokeWidth="20" strokeLinecap="round" />
    <path d="M238 146 L262 164" fill="none" stroke="#f4ebe0" strokeWidth="14" strokeLinecap="round" />

    <g transform="translate(252 150) rotate(8)">
      <rect x="4" y="5" width="34" height="36" rx="8" fill="#46413b" opacity="0.3" />
      <rect width="34" height="36" rx="8" fill="#fcdcbd" stroke="#1d1b18" strokeWidth="3.5" />
      <path d="M10 13 H24" stroke="#1d1b18" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M34 7 Q54 2 60 12 M34 29 Q54 36 60 25" fill="none" stroke="#1d1b18" strokeWidth="13" strokeLinecap="round" />
      <path d="M34 7 Q54 2 60 12 M34 29 Q54 36 60 25" fill="none" stroke="#f4ebe0" strokeWidth="8" strokeLinecap="round" />
    </g>
    <circle cx="320" cy="176" r="9" fill="#cfe3b2" stroke="#1d1b18" strokeWidth="3" />

    <path d="M348 206 H410" fill="none" stroke="#1d1b18" strokeWidth="3" strokeDasharray="6 6" strokeLinecap="round" markerEnd="url(#heroArrow)" />

    <path d={edgesAtoB} fill="none" stroke="#a99bbd" strokeWidth="1.8" opacity="0.85" />
    <path d={edgesBtoC} fill="none" stroke="#a99bbd" strokeWidth="1.8" opacity="0.85" />
    <path d="M470 205 L565 177 L665 177" fill="none" stroke="#7fbfa8" strokeWidth="3" strokeLinecap="round" />
    <circle cx="517" cy="191" r="4" fill="#f4ebe0" stroke="#1d1b18" strokeWidth="2" />
    <circle cx="615" cy="177" r="4" fill="#f4ebe0" stroke="#1d1b18" strokeWidth="2" />

    {outputs.map((y, i) => <circle key={`halo-${i}`} cx="665" cy={y} r="28" fill="none" stroke="#1d1b18" strokeWidth="1.5" strokeDasharray="3 5" opacity="0.3" />)}

    {nodes.map(n => <g key={`${n.x}-${n.y}`}>
      <circle cx={n.x + 3} cy={n.y + 4} r={n.r} fill="#46413b" opacity="0.3" />
      <circle cx={n.x} cy={n.y} r={n.r} fill={n.fill} stroke="#1d1b18" strokeWidth="3.5" />
      <circle cx={n.x} cy={n.y} r="5" fill="#1d1b18" />
    </g>)}

    <path d="M48 368 V356 H165 V336" fill="none" stroke="#1d1b18" strokeWidth="2" opacity="0.7" />
    <circle cx="165" cy="336" r="2.5" fill="#1d1b18" />
    <text x="48" y="386" fill="#1d1b18" fontSize="13" letterSpacing="2" fontFamily="JetBrains Mono, ui-monospace, monospace">FÍSICO</text>

    <path d="M712 368 V356 H610 V310" fill="none" stroke="#1d1b18" strokeWidth="2" opacity="0.7" />
    <circle cx="610" cy="310" r="2.5" fill="#1d1b18" />
    <text x="712" y="386" textAnchor="end" fill="#1d1b18" fontSize="13" letterSpacing="2" fontFamily="JetBrains Mono, ui-monospace, monospace">COGNITIVO</text>
  </svg>;
}
