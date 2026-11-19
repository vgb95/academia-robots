// Diagramas específicos de electrónica. Se merges en getDiagram() sin tocar el registro principal.
const wrap = (inner: string, w = 760, h = 300) =>
  `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" style="width:100%;height:auto;display:block"><rect width="${w}" height="${h}" rx="10" fill="#15181C"/><rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="10" fill="none" stroke="#2C3138"/>${inner}</svg>`;
const txt = (x: number, y: number, s: string, size = 13, color = '#F2F1ED', anchor: 'start' | 'middle' | 'end' = 'middle') =>
  `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" text-anchor="${anchor}" font-family="system-ui,sans-serif">${s}</text>`;
const box = (x: number, y: number, w: number, h: number, label: string, color = '#7FD1C1', sub = '') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="#1B1F26" stroke="${color}" stroke-width="1.5"/>` +
  txt(x + w / 2, y + (sub ? h / 2 - 2 : h / 2 + 5), label, 13, '#F7F6F2') +
  (sub ? txt(x + w / 2, y + h / 2 + 16, sub, 10, '#A2A8B2') : '');
const line = (x1: number, y1: number, x2: number, y2: number, color = '#5B6472', dash = '') =>
  `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${color}" stroke-width="2" ${dash ? `stroke-dasharray="${dash}"` : ''}/>`;
const arrow = (x: number, y: number, color = '#F5C16C') =>
  `<path d="M${x - 6} ${y - 5} L${x} ${y} L${x - 6} ${y + 5} Z" fill="${color}"/>`;

export const electronicsDiagrams: Record<string, () => string> = {
  ohm_agua: () => wrap(
    txt(380, 26, 'Analogía hidráulica: presión · caudal · estrechamiento', 15, '#D7D8D3') +
    box(40, 80, 170, 80, 'Depósito / bomba', '#F5C16C', 'V = presión') +
    box(300, 80, 170, 80, 'Tubería estrecha', '#FF7A70', 'R = resistencia') +
    box(560, 80, 160, 80, 'Rueda', '#7FD1C1', 'I = caudal') +
    line(210, 120, 298, 120, '#F5C16C') + arrow(270, 120) +
    line(470, 120, 558, 120, '#F5C16C') + arrow(530, 120) +
    txt(380, 210, 'Más presión → más caudal. Más estrechamiento → menos caudal.', 13) +
    txt(380, 240, 'Igual que: más voltaje → más corriente; más resistencia → menos corriente.', 12, '#A2A8B2')
  ),
  ohm_triangulo: () => wrap(
    txt(380, 26, 'Triángulo de Ohm: tapa lo que buscas', 15, '#D7D8D3') +
    `<path d="M380 55 L540 235 L220 235 Z" fill="#1B1F26" stroke="#7FD1C1" stroke-width="2"/>` +
    txt(380, 110, 'V', 34, '#F5C16C') + txt(330, 215, 'I', 26, '#7FD1C1') + txt(430, 215, 'R', 26, '#B9A6FF') +
    txt(380, 270, 'V = I·R   |   I = V/R   |   R = V/I', 15)
  ),
  serie_cadena: () => wrap(
    txt(380, 26, 'Serie: una sola corriente, varias caídas', 15, '#D7D8D3') +
    box(40, 90, 120, 70, 'Fuente', '#F5C16C', '12 V') +
    box(230, 90, 120, 70, 'R1', '#7FD1C1', '100 Ω') +
    box(410, 90, 120, 70, 'R2', '#B9A6FF', '200 Ω') +
    box(590, 90, 120, 70, 'R3', '#FF7A70', '300 Ω') +
    line(160, 125, 228, 125) + arrow(205, 125) + line(350, 125, 408, 125) + arrow(385, 125) +
    line(530, 125, 588, 125) + arrow(565, 125) +
    `<path d="M650 160 L650 230 L100 230 L100 160" fill="none" stroke="#5B6472" stroke-width="2"/>` +
    txt(380, 260, 'I = 12/600 = 20 mA en TODO el lazo · V_R1=2 V · V_R2=4 V · V_R3=6 V', 12, '#A2A8B2')
  ),
  paralelo_ramas: () => wrap(
    txt(380, 26, 'Paralelo: misma tensión, corrientes que se suman', 15, '#D7D8D3') +
    box(40, 110, 120, 70, 'Fuente', '#F5C16C', '12 V') +
    line(160, 145, 270, 145) +
    `<path d="M270 145 L270 70 M270 145 L270 220" fill="none" stroke="#5B6472" stroke-width="2"/>` +
    box(330, 45, 140, 60, 'R1 100 Ω', '#7FD1C1') + box(330, 190, 140, 60, 'R2 200 Ω', '#B9A6FF') +
    line(270, 75, 328, 75) + line(270, 220, 328, 220) +
    `<path d="M470 75 L540 75 M470 220 L540 220 M540 75 L540 220" fill="none" stroke="#5B6472" stroke-width="2"/>` +
    txt(610, 150, 'I1 = 120 mA', 13, '#7FD1C1') + txt(610, 178, 'I2 = 60 mA', 13, '#B9A6FF') +
    txt(380, 270, 'V es la misma en cada rama · I_total = I1 + I2 · 1/Rt = 1/R1 + 1/R2', 12, '#A2A8B2')
  ),
  resistencia_bandas: () => wrap(
    txt(380, 26, 'Código de colores: lee de izquierda a derecha', 15, '#D7D8D3') +
    `<rect x="180" y="120" width="400" height="52" rx="22" fill="#d5b07a" stroke="#1d1b18" stroke-width="2"/>` +
    `<rect x="250" y="120" width="26" height="52" fill="#b8602f"/><rect x="300" y="120" width="26" height="52" fill="#1f3b1c"/>` +
    `<rect x="350" y="120" width="26" height="52" fill="#a4824e"/><rect x="520" y="120" width="26" height="52" fill="#c5bcb0"/>` +
    txt(263, 200, '1', 13, '#F5C16C') + txt(313, 200, '0', 13, '#F5C16C') + txt(363, 200, '×10³', 13, '#F5C16C') + txt(533, 200, '±5 %', 13, '#F5C16C') +
    txt(380, 245, '10 × 1000 = 10 000 Ω = 10 kΩ · la última banda es la tolerancia', 13)
  ),
  potencia_resistencia: () => wrap(
    txt(380, 26, 'Potencia: la resistencia convierte energía en calor', 15, '#D7D8D3') +
    box(90, 90, 160, 80, 'Resistencia', '#F5C16C', 'R = 100 Ω') +
    txt(430, 110, 'P = V·I = I²·R = V²/R', 17, '#7FD1C1') +
    txt(430, 145, 'Con 0,1 A: P = 0,1²·100 = 1 W', 13) +
    txt(430, 175, 'Una de 1/4 W se quemaría', 13, '#FF7A70') +
    `<path d="M170 175 Q190 210 170 240 Q150 210 170 175" fill="#F5C16C" opacity="0.5"/>` +
    txt(380, 270, 'Elige una potencia nominal ≥ 2× la disipación calculada.', 12, '#A2A8B2')
  ),
  divisor_carga: () => wrap(
    txt(380, 26, 'Divisor cargado: la carga cambia la respuesta', 15, '#D7D8D3') +
    box(40, 100, 110, 60, 'Vin 5 V', '#F5C16C') + box(220, 100, 120, 60, 'R1 10 kΩ', '#7FD1C1') +
    box(430, 100, 120, 60, 'Vout', '#B9A6FF') + box(610, 100, 110, 60, 'GND', '#FF7A70') +
    line(150, 130, 218, 130) + line(340, 130, 428, 130) + line(550, 130, 608, 130) +
    box(430, 210, 120, 50, 'Carga 1 kΩ', '#FF7A70') + `<path d="M490 160 L490 208" stroke="#5B6472" stroke-width="2"/>` +
    txt(380, 280, 'Sin carga: 3,33 V · con 1 kΩ: R2∥1k ≈ 930 Ω → Vout ≈ 0,43 V', 12, '#A2A8B2')
  ),
  rc_carga: () => wrap(
    txt(380, 26, 'RC: τ = R·C marca el tiempo de respuesta', 15, '#D7D8D3') +
    `<line x1="70" y1="240" x2="700" y2="240" stroke="#3A414C"/><line x1="70" y1="50" x2="70" y2="240" stroke="#3A414C"/>` +
    `<path d="M70 240 Q170 95 300 70 Q450 52 700 50" fill="none" stroke="#7FD1C1" stroke-width="3"/>` +
    `<line x1="190" y1="70" x2="190" y2="240" stroke="#F5C16C" stroke-dasharray="5 5"/>` +
    txt(190, 262, 'τ', 13, '#F5C16C') + txt(380, 262, '3τ', 13, '#A2A8B2') + txt(650, 262, '5τ', 13, '#A2A8B2') +
    txt(380, 288, 'Al 63 % en τ · al 95 % en 3τ · al 99 % en 5τ', 12, '#A2A8B2')
  ),
  capacitor_descople: () => wrap(
    txt(380, 26, 'Desacople: el capacitor está junto al chip, no lejos', 15, '#D7D8D3') +
    box(60, 100, 140, 70, 'Fuente', '#F5C16C') + box(320, 100, 200, 90, 'IC', '#B9A6FF', 'pide picos de corriente') +
    line(200, 135, 318, 135) + `<path d="M100 180 L100 230 L250 230 L250 145" fill="none" stroke="#5B6472" stroke-width="2"/>` +
    box(240, 195, 100, 55, '100 nF', '#7FD1C1') + `<path d="M300 195 L300 165" stroke="#7FD1C1" stroke-width="2"/>` +
    txt(380, 275, 'El capacitor entrega el pico antes de que la fuente reaccione: evita el brownout.', 12, '#A2A8B2')
  ),
  led_curva: () => wrap(
    txt(380, 26, 'LED: curva I-V y recta de carga', 15, '#D7D8D3') +
    `<line x1="70" y1="240" x2="700" y2="240" stroke="#3A414C"/><line x1="70" y1="50" x2="70" y2="240" stroke="#3A414C"/>` +
    `<path d="M70 240 Q260 235 330 150 Q360 70 420 50" fill="none" stroke="#FF7A70" stroke-width="3"/>` +
    `<line x1="70" y1="230" x2="680" y2="70" stroke="#7FD1C1" stroke-width="2" stroke-dasharray="6 4"/>` +
    `<circle cx="355" cy="118" r="6" fill="#F5C16C"/>` +
    txt(380, 270, 'Punto de trabajo: (Vs − Vf)/R ≈ 9 mA · Vf ≈ 2 V (rojo)', 12, '#A2A8B2')
  ),
  bjt_curva: () => wrap(
    txt(380, 26, 'BJT como interruptor: la base manda, el colector conmuta', 15, '#D7D8D3') +
    box(50, 110, 140, 65, 'Pin 3,3 V', '#7FD1C1') + box(260, 110, 120, 65, 'Rb 1 kΩ', '#F5C16C') +
    box(450, 80, 120, 125, 'NPN', '#B9A6FF', 'C → E') +
    line(190, 142, 258, 142) + line(380, 142, 448, 142) +
    box(630, 60, 100, 50, 'Carga', '#FF7A70') + `<path d="M570 100 L628 85" stroke="#5B6472" stroke-width="2"/>` +
    `<path d="M510 205 L510 245 L100 245" fill="none" stroke="#5B6472" stroke-width="2"/>` +
    txt(380, 280, 'Ib ≈ (3,3−0,7)/1k = 2,6 mA → con hFE≈100 admite ~260 mA', 12, '#A2A8B2')
  ),
  mosfet_curva: () => wrap(
    txt(380, 26, 'MOSFET: voltaje en gate, canal entre drenaje y fuente', 15, '#D7D8D3') +
    box(60, 115, 140, 65, 'Pin 3,3 V', '#7FD1C1') + box(300, 115, 160, 65, 'Gate', '#B9A6FF', 'Vgs > Vth') +
    box(550, 75, 150, 130, 'D → S', '#F5C16C', 'Rds(on) bajo') +
    line(200, 147, 298, 147) + `<path d="M460 147 L548 130" stroke="#5B6472" stroke-width="2"/>` +
    txt(380, 250, 'Con Vgs = 3,3 V busca un MOSFET "logic level": si no, no conduce y se calienta.', 12, '#A2A8B2')
  ),
  fuente_buck: () => wrap(
    txt(380, 26, 'Buck: conmutar + filtrar para bajar tensión con eficiencia', 15, '#D7D8D3') +
    box(40, 100, 120, 65, '12 V', '#F5C16C') + box(220, 100, 140, 65, 'Conmutador', '#FF7A70') +
    box(420, 100, 140, 65, 'L + C', '#7FD1C1') + box(620, 100, 100, 65, '5 V', '#B9A6FF') +
    line(160, 132, 218, 132) + arrow(190, 132) + line(360, 132, 418, 132) + line(560, 132, 618, 132) +
    txt(380, 220, 'Vout ≈ D · Vin  (D = duty) · eficiencia típica 90 %', 15, '#F5C16C') +
    txt(380, 255, 'La LDO es más simple pero desperdicia (Vin−Vout)·I como calor.', 12, '#A2A8B2')
  ),
  lipo_celda: () => wrap(
    txt(380, 26, 'LiPo: celdas, estados de carga y C-rating', 15, '#D7D8D3') +
    box(60, 80, 180, 70, '1S', '#7FD1C1', '3,7 V nom · 4,2 V llena') +
    box(290, 80, 180, 70, '2S', '#B9A6FF', '7,4 V nom · 8,4 V llena') +
    box(520, 80, 180, 70, '3S', '#F5C16C', '11,1 V nom · 12,6 V llena') +
    txt(380, 200, 'I máx = C · Ah  →  30C · 2,2 Ah = 66 A', 16, '#F5C16C') +
    txt(380, 240, 'Nunca bajes de 3,0 V/celda · carga solo con balanceador · no la dejes sin supervisión.', 12, '#FF7A70')
  ),
  multimetro_medidas: () => wrap(
    txt(380, 26, 'Multímetro: en paralelo mides V, en serie mides I', 15, '#D7D8D3') +
    box(50, 90, 140, 60, 'Fuente', '#F5C16C') + box(300, 90, 140, 60, 'Resistencia', '#7FD1C1') + box(580, 90, 130, 60, 'Carga', '#B9A6FF') +
    line(190, 120, 298, 120) + line(440, 120, 578, 120) +
    box(300, 30, 140, 40, 'V · en paralelo', '#B9A6FF') + `<path d="M370 70 L370 88 L360 88 M370 88 L380 88" stroke="#B9A6FF" stroke-width="2"/>` +
    box(220, 200, 150, 55, 'A · EN SERIE', '#FF7A70') + `<path d="M190 120 L190 228 L218 228 M370 228 L370 120" fill="none" stroke="#FF7A70" stroke-width="2"/>` +
    txt(380, 285, 'Si pones el amperímetro en paralelo haces un corto y fundes el fusible.', 12, '#FF7A70')
  ),
  protoboard_filas: () => wrap(
    txt(380, 26, 'Protoboard: filas unidas, surco central aislado', 15, '#D7D8D3') +
    `<rect x="80" y="60" width="600" height="180" rx="8" fill="#1B1F26" stroke="#2C3138"/>` +
    Array.from({ length: 8 }, (_, i) => `<path d="M${130 + i * 70} 80 L${130 + i * 70} 118" stroke="#5B6472" stroke-width="2"/>`).join('') +
    `<path d="M80 140 L680 140 M80 165 L680 165" stroke="#F5C16C" stroke-width="3" stroke-dasharray="8 5"/>` +
    Array.from({ length: 8 }, (_, i) => `<path d="M${130 + i * 70} 188 L${130 + i * 70} 226" stroke="#5B6472" stroke-width="2"/>`).join('') +
    txt(380, 270, 'Los 5 agujeros de una fila están unidos · el surco central NO une los dos lados.', 12, '#A2A8B2')
  ),
  soldadura_union: () => wrap(
    txt(380, 26, 'Unión de soldadura: cónica y brillante vs fría y opaca', 15, '#D7D8D3') +
    box(60, 70, 300, 170, 'BUENA', '#7FD1C1') + box(400, 70, 300, 170, 'FRÍA', '#FF7A70') +
    `<path d="M150 180 L200 110 L250 180 Z" fill="#B9A6FF" stroke="#F2F1ED" stroke-width="2"/>` +
    `<circle cx="550" cy="150" r="38" fill="#8B93A0" stroke="#F2F1ED" stroke-width="2"/>` +
    txt(210, 270, 'Calienta la unión, no el estaño · brillo cónico · flux', 12, '#7FD1C1')
  ),
  pull_resistores: () => wrap(
    txt(380, 26, 'Pull-up / pull-down: un pin nunca debe flotar', 15, '#D7D8D3') +
    box(60, 80, 200, 65, 'Pull-up a 5 V', '#7FD1C1') + box(60, 190, 200, 65, 'Pin', '#B9A6FF') +
    `<path d="M260 112 L330 112 L330 222 L258 222" fill="none" stroke="#5B6472" stroke-width="2"/>` +
    box(380, 80, 200, 65, 'Pull-down a GND', '#F5C16C') + box(380, 190, 200, 65, 'Pin', '#B9A6FF') +
    `<path d="M580 112 L650 112 L650 222 L582 222" fill="none" stroke="#5B6472" stroke-width="2"/>` +
    txt(380, 285, 'Sin resistencia, el pin flota y lee ruido: el botón da pulsos falsos.', 12, '#A2A8B2')
  ),
  brownout_curve: () => wrap(
    txt(380, 26, 'Brownout: el arranque del motor hunde la tensión', 15, '#D7D8D3') +
    `<line x1="70" y1="240" x2="700" y2="240" stroke="#3A414C"/>` +
    `<line x1="70" y1="70" x2="700" y2="70" stroke="#F5C16C" stroke-dasharray="6 4"/>` +
    `<path d="M70 90 L200 90 L230 205 L300 120 L360 92 L700 90" fill="none" stroke="#7FD1C1" stroke-width="3"/>` +
    txt(640, 62, 'V mínima MCU', 11, '#F5C16C', 'end') + txt(230, 230, 'pico de I', 11, '#FF7A70') +
    txt(380, 275, 'Solución: fuente con margen, 100 nF junto al IC y 470 µF en la alimentación del driver.', 12, '#A2A8B2')
  ),
  gpio_limit: () => wrap(
    txt(380, 26, 'Un pin GPIO NO alimenta un motor', 15, '#D7D8D3') +
    box(50, 100, 170, 70, 'GPIO 3,3 V', '#7FD1C1', '≤ 20 mA') +
    box(320, 100, 160, 70, 'Driver / transistor', '#F5C16C', 'conmuta la carga') +
    box(590, 100, 130, 70, 'Motor', '#FF7A70', '500 mA') +
    line(220, 135, 318, 135) + arrow(290, 135) + line(480, 135, 588, 135) + arrow(560, 135) +
    box(320, 220, 160, 50, 'Fuente externa', '#B9A6FF') + `<path d="M400 170 L400 218" stroke="#B9A6FF" stroke-width="2"/>` +
    txt(380, 290, 'El pin solo manda la señal: la energía del motor viene de otra fuente.', 12, '#A2A8B2')
  )
};
