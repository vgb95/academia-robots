// Registro de diagramas SVG. Cada entrada es una función que devuelve markup SVG.
// Se usan generadores (flow / layers / compare / plot) para cubrir muchos conceptos
// con un mismo lenguaje visual: fondo oscuro, acentos cian/violeta/ámbar.

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const wrap = (inner: string, w = 760, h = 280) =>
  `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" style="width:100%;height:auto;display:block">` +
  `<rect width="${w}" height="${h}" rx="14" fill="#15181C"/>` +
  `<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="14" fill="none" stroke="#2C3138"/>` +
  inner + `</svg>`;

const text = (x: number, y: number, s: string, size = 14, color = '#F2F1ED', anchor = 'middle', weight = 500) =>
  `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" text-anchor="${anchor}" font-weight="${weight}" font-family="system-ui,-apple-system,Segoe UI,sans-serif">${esc(s)}</text>`;

const box = (x: number, y: number, w: number, h: number, label: string, sub = '', color = '#7FD1C1') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#1B1F26" stroke="${color}" stroke-width="1.5"/>` +
  text(x + w / 2, y + (sub ? h / 2 - 4 : h / 2 + 5), label, 14, '#F7F6F2', 'middle', 650) +
  (sub ? text(x + w / 2, y + h / 2 + 15, sub, 11, '#A2A8B2') : '');

const arrow = (x1: number, y1: number, x2: number, y2: number, color = '#5B6472') =>
  `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${color}" stroke-width="2" marker-end="url(#a)"/>`;

const defs = `<defs><marker id="a" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#5B6472"/></marker></defs>`;

type Node = { label: string; sub?: string; color?: string };
const flow = (title: string, nodes: Node[], w = 760, h = 210): string => {
  const top = 42, n = nodes.length;
  const gap = 26, bw = Math.min(150, (w - 80 - gap * (n - 1)) / n), bh = 74;
  const total = bw * n + gap * (n - 1), start = (w - total) / 2;
  let s = defs + text(w / 2, 26, title, 16, '#D7D8D3', 'middle', 700);
  nodes.forEach((nd, i) => {
    const x = start + i * (bw + gap);
    s += box(x, top + 28, bw, bh, nd.label, nd.sub, nd.color || '#7FD1C1');
    if (i < n - 1) s += arrow(x + bw + 4, top + 65, x + bw + gap - 6, top + 65);
  });
  return wrap(s, w, h);
};

const layers = (title: string, items: Node[], w = 760): string => {
  const h = 70 + items.length * 62;
  let s = text(w / 2, 28, title, 16, '#D7D8D3', 'middle', 700);
  items.forEach((it, i) => {
    const y = 46 + i * 62;
    s += `<rect x="${(w - 560) / 2}" y="${y}" width="560" height="50" rx="10" fill="#1B1F26" stroke="${it.color || '#7FD1C1'}" stroke-width="1.4"/>`;
    s += text(w / 2 - 250, y + 31, it.label, 14, '#F7F6F2', 'start', 650);
    if (it.sub) s += text(w / 2 + 250, y + 31, it.sub, 11, '#A2A8B2', 'end');
  });
  return wrap(s, w, h);
};

const compare = (title: string, left: Node, right: Node, notes: string[], leftColor = '#7FD1C1', w = 760): string => {
  const h = 240;
  let s = defs + text(w / 2, 26, title, 16, '#D7D8D3', 'middle', 700);
  s += box(40, 60, 300, 90, left.label, left.sub, leftColor);
  s += box(w - 340, 60, 300, 90, right.label, right.sub, right.color || '#B9A6FF');
  s += `<path d="M340 105 L${w - 340} 105" stroke="#5B6472" stroke-width="2" marker-end="url(#a)"/>`;
  notes.forEach((nt, i) => { s += text(w / 2, 180 + i * 24, '• ' + nt, 12, '#A2A8B2'); });
  return wrap(s, w, h);
};

const plot = (title: string, curves: { pts: string; color: string; label: string }[], w = 760, h = 280): string => {
  let s = text(w / 2, 26, title, 16, '#D7D8D3', 'middle', 700);
  s += `<line x1="60" y1="230" x2="${w - 40}" y2="230" stroke="#3A414C"/>`;
  s += `<line x1="60" y1="40" x2="60" y2="230" stroke="#3A414C"/>`;
  s += text(w / 2, 260, 'tiempo →', 12, '#8B93A0');
  s += text(20, 140, 'salida', 12, '#8B93A0');
  curves.forEach((c, i) => {
    s += `<polyline points="${c.pts}" fill="none" stroke="${c.color}" stroke-width="2.5"/>`;
    s += `<rect x="${w - 190}" y="${44 + i * 22}" width="12" height="12" rx="3" fill="${c.color}"/>`;
    s += text(w - 170, 55 + i * 22, c.label, 12, '#D7D8D3', 'start');
  });
  return wrap(s, w, h);
};

const raw = (s: string, w = 760, h = 280) => wrap(defs + s, w, h);

export const D: Record<string, () => string> = {
  // --- Electrónica ---
  ley_ohm: () => raw(
    `<circle cx="380" cy="140" r="104" fill="#1B1F26" stroke="#7FD1C1" stroke-width="2"/>` +
    text(380, 78, 'V', 30, '#F5C16C', 'middle', 800) + text(380, 200, 'I · R', 24, '#7FD1C1', 'middle', 800) +
    text(200, 145, 'V = voltaje', 15, '#F2F1ED') + text(560, 145, 'I = corriente', 15, '#F2F1ED') +
    text(380, 265, 'R = resistencia  (Ω)', 14, '#A2A8B2')),
  divisor: () => flow('Divisor de voltaje', [
    { label: 'Vin', sub: 'ej. 5 V' }, { label: 'R1', sub: 'caída' }, { label: 'nodo Vout', sub: 'aquí mides', color: '#F5C16C' }, { label: 'R2', sub: 'a GND' }
  ]),
  serie_paralelo: () => compare('Series vs paralelo', { label: 'Serie', sub: 'misma I, suma R' }, { label: 'Paralelo', sub: 'misma V, baja R' }, ['Serie: Rt = R1+R2+…', 'Paralelo: 1/Rt = 1/R1+1/R2+…']),
  capacitor: () => plot('Carga de un capacitor (τ = R·C)', [
    { pts: '60,230 110,180 170,120 260,80 400,58 560,50 720,48', color: '#7FD1C1', label: 'Vc' },
    { pts: '60,50 110,100 170,160 260,205 400,225 560,230 720,230', color: '#B9A6FF', label: 'I' }
  ]),
  transistor: () => flow('Transistor como interruptor', [
    { label: 'Entrada lógica', sub: '3.3 V / 5 V' }, { label: 'Base', sub: 'resistencia limitadora' }, { label: 'Colector–Emisor', sub: 'conmuta la carga' }, { label: 'Carga', sub: 'LED / motor', color: '#F5C16C' }
  ]),
  mosfet: () => flow('MOSFET de canal N', [
    { label: 'Gate', sub: 'voltaje, casi sin I' }, { label: 'Canal', sub: 'se forma al superar Vth' }, { label: 'Drenaje→Fuente', sub: 'conduce I alta', color: '#F5C16C' }
  ]),
  pwm: () => raw(
    text(380, 26, 'PWM: ancho de pulso = potencia media', 16, '#D7D8D3', 'middle', 700) +
    `<polyline points="60,200 140,200 140,70 250,70 250,200 360,200 360,70 470,70 470,200 580,200 580,70 690,70 690,200 720,200" fill="none" stroke="#7FD1C1" stroke-width="3"/>` +
    `<line x1="60" y1="200" x2="720" y2="200" stroke="#3A414C"/>` +
    text(195, 60, 'duty 50%', 12, '#F5C16C') + text(60, 230, '0 V', 12, '#8B93A0') + text(700, 230, 't', 12, '#8B93A0')),
  led: () => flow('LED y resistencia limitadora', [
    { label: 'Fuente', sub: '5 V' }, { label: 'R', sub: '(Vs−Vf)/If' }, { label: 'LED', sub: 'Vf ≈ 2 V', color: '#F5C16C' }, { label: 'GND' }
  ]),
  diodo: () => compare('Diodo: una sola dirección', { label: 'Directa', sub: 'conduce ≈0.7 V' }, { label: 'Inversa', sub: 'bloquea' }, ['LED, rectificación, protección', 'El diodo Schottky cae menos (0.3 V)']),
  fuente: () => flow('Regulación de tensión', [
    { label: 'Entrada', sub: '12 V / USB' }, { label: 'Regulador', sub: 'buck o LDO' }, { label: 'Salida', sub: '5 V o 3.3 V', color: '#F5C16C' }, { label: 'Carga', sub: 'MCU + sensores' }
  ]),
  lipo: () => compare('LiPo: cuidado extremo', { label: 'Celdas', sub: '1S=3.7 V, 2S=7.4 V' }, { label: 'C-rating', sub: 'I = C · Ah' }, ['Nunca descargar por debajo de 3.0 V/celda', 'Cargar solo con cargador balanceador'], '#F5C16C'),
  esquematico: () => flow('Leer un esquemático', [
    { label: 'Símbolos', sub: 'R, C, D, Q, GND' }, { label: 'Nodos/redes', sub: 'quién se conecta a quién' }, { label: 'Valores', sub: '10k, 100nF' }, { label: 'Montaje', sub: 'en protoboard' }
  ]),
  multimetro: () => layers('Multímetro: qué medir', [
    { label: 'V DC', sub: 'paralelo entre los puntos' }, { label: 'Resistencia Ω', sub: 'con el circuito apagado' },
    { label: 'Continuidad', sub: 'pita si hay conexión' }, { label: 'Corriente A', sub: 'EN SERIE (cuidado: funde el fusible)' }
  ]),
  protoboard: () => layers('Protoboard: filas y columnas', [
    { label: 'Barras laterales', sub: 'railes de + y −, van en toda la placa' },
    { label: 'Filas numeradas', sub: 'los 5 agujeros de cada fila están unidos' },
    { label: 'Surco central', sub: 'los chips se montan a caballo' }
  ]),
  soldadura: () => pasosSvg('Uniones de soldadura', [
    ['1.estañar', 'calienta la punta y aplica estaño'], ['2.calentar', 'calienta la unión, NO el estaño'],
    ['3.alimentar', 'el estaño fluye por capilaridad'], ['4.enfriar', 'no muevas hasta que brille']
  ]),

  // --- Microcontroladores ---
  gpio: () => compare('GPIO: entrada vs salida', { label: 'OUTPUT', sub: 'conduce alto/bajo' }, { label: 'INPUT', sub: 'lee nivel' }, ['Nunca excedas ~20 mA por pin', 'Entrada flotante = ruido: usa pull-up/down']),
  adc: () => flow('ADC: del analógico al digital', [
    { label: 'Sensor', sub: '0–3.3 V' }, { label: 'Muestreo', sub: 'fija el valor' }, { label: 'Cuantización', sub: '12 bits → 4096 niveles' }, { label: 'Valor', sub: '0…4095', color: '#F5C16C' }
  ]),
  interrupcion: () => flow('Interrupción', [
    { label: 'Evento', sub: 'flanco del botón' }, { label: 'ISR', sub: 'rutina cortísima' }, { label: 'Flag', sub: 'avisar al loop' }, { label: 'Loop', sub: 'hace el trabajo', color: '#F5C16C' }
  ]),
  i2c: () => flow('I²C: 2 hilos, muchos dispositivos', [
    { label: 'SDA', sub: 'datos' }, { label: 'SCL', sub: 'reloj' }, { label: 'Dirección 7-bit', sub: 'cada dispositivo' }, { label: 'ACK', sub: 'confirmación' }
  ]),
  spi: () => flow('SPI: 4 hilos, más rápido', [
    { label: 'SCK', sub: 'reloj' }, { label: 'MOSI / MISO', sub: 'datos' }, { label: 'CS/SS', sub: 'selecciona esclavo', color: '#F5C16C' }
  ]),
  uart: () => flow('UART: serial asíncrono', [
    { label: 'TX', sub: 'envía' }, { label: 'RX', sub: 'recibe' }, { label: 'Baud rate', sub: 'ambos igual' }, { label: 'Bits de parada', sub: 'trama' }
  ]),
  rtos: () => layers('RTOS: tareas con prioridad', [
    { label: 'Tarea crítica', sub: 'control de motor — 1 kHz' }, { label: 'Tarea de sensores', sub: '100 Hz' },
    { label: 'Tarea de red', sub: '10 Hz' }, { label: 'Scheduler', sub: 'cambia de contexto (context switch)' }
  ]),
  arquitectura: () => layers('Arquitectura real: Pi + MCU', [
    { label: 'Raspberry Pi', sub: 'Linux, ROS 2, visión, alto nivel' },
    { label: 'UART / USB', sub: 'mensajes simples, no PWM directo' },
    { label: 'ESP32 / STM32', sub: 'tiempo real: PWM, encoders, PID', color: '#F5C16C' },
    { label: 'Motores y sensores', sub: 'el mundo físico' }
  ]),

  // --- Motores ---
  motor_dc: () => flow('Motor DC', [
    { label: 'Voltaje', sub: 'controla velocidad' }, { label: 'Corriente', sub: 'controla par' },
    { label: 'PWM', sub: 'regula V media' }, { label: 'Eje', sub: 'giro', color: '#F5C16C' }
  ]),
  h_bridge: () => raw(
    text(380, 26, 'Puente H: invertir la polaridad', 16, '#D7D8D3', 'middle', 700) +
    box(120, 70, 110, 60, 'Q1', 'alto') + box(430, 70, 110, 60, 'Q2', 'alto') +
    box(120, 170, 110, 60, 'Q3', 'bajo') + box(430, 170, 110, 60, 'Q4', 'bajo') +
    text(380, 135, 'M', 26, '#F5C16C', 'middle', 800) +
    `<line x1="230" y1="100" x2="360" y2="130" stroke="#5B6472" stroke-width="2"/>` +
    `<line x1="530" y1="100" x2="400" y2="130" stroke="#5B6472" stroke-width="2"/>` +
    text(380, 275, 'Q1+Q4 → gira un sentido · Q2+Q3 → el contrario', 12, '#A2A8B2')),
  stepper: () => flow('Motor paso a paso', [
    { label: 'Fases', sub: 'A+, A−, B+, B−' }, { label: 'Secuencia', sub: 'energiza en orden' },
    { label: 'Microstepping', sub: 'subdivide el paso' }, { label: 'Posición', sub: 'sin encoder', color: '#F5C16C' }
  ]),
  servo: () => flow('Servo (RC)', [
    { label: 'PWM 50 Hz', sub: '1–2 ms de pulso' }, { label: 'Electrónica interna', sub: 'comparador' },
    { label: 'Motor + engranajes', sub: '' }, { label: 'Potenciómetro', sub: 'realimentación', color: '#F5C16C' }
  ]),
  foc: () => flow('FOC: control vectorial', [
    { label: 'Medición', sub: 'corrientes / sensor' }, { label: 'Clarke+Park', sub: 'a coordenadas dq' },
    { label: 'PI en dq', sub: 'par y flujo' }, { label: 'SVPWM', sub: 'a fases', color: '#F5C16C' }
  ]),
  encoder: () => flow('Encoder y odometría', [
    { label: 'Pulsos A/B', sub: 'fases en cuadratura' }, { label: 'Dirección', sub: 'por el orden' },
    { label: 'Cuenta', sub: 'pulsos acumulados' }, { label: 'Distancia', sub: 'cuenta · (π·D)/PPR', color: '#F5C16C' }
  ]),
  brownout: () => flow('Brownout: el clásico', [
    { label: 'Motor arranca', sub: 'pico de corriente' }, { label: 'Cae V', sub: 'la fuente no da más' },
    { label: 'MCU se resetea', sub: 'por debajo del mínimo', color: '#FF7A70' }, { label: 'Solución', sub: 'fuente grande + C de desacople' }
  ]),

  // --- Sensores ---
  imu: () => layers('IMU: 9 grados de libertad', [
    { label: 'Acelerómetro', sub: 'aceleración + gravedad → inclinación' },
    { label: 'Giroscopio', sub: 'velocidad angular → muy estable a corto plazo' },
    { label: 'Magnetómetro', sub: 'norte → corrige la deriva en yaw' }
  ]),
  complementario: () => flow('Filtro complementario', [
    { label: 'Acelerómetro', sub: 'lento pero sin deriva' }, { label: 'α', sub: 'peso bajo' },
    { label: 'Giroscopio', sub: 'rápido pero deriva' }, { label: 'Ángulo', sub: 'suave y estable', color: '#F5C16C' }
  ]),
  kalman: () => flow('Filtro de Kalman (ciclo)', [
    { label: 'Predecir', sub: 'modelo + incertidumbre' }, { label: 'Medir', sub: 'sensor + ruido' },
    { label: 'Kalman gain', sub: 'peso óptimo' }, { label: 'Corregir', sub: 'estado + covarianza', color: '#F5C16C' }
  ]),
  tof: () => compare('Ultrasonido vs ToF láser', { label: 'HC-SR04', sub: 'cone ancho, barato' }, { label: 'VL53L0X', sub: 'cono 35°, preciso' }, ['El ultrasonido falla en superficies blandas', 'ToF es mejor para medidas cortas']),
  lidar: () => flow('LIDAR 360°', [
    { label: 'Láser', sub: 'pulso de luz' }, { label: 'Reflejo', sub: 'vuelve al sensor' },
    { label: 'Tiempo de vuelo', sub: 'd = c·t/2' }, { label: 'Nube 2D', sub: '(x,y) por ángulo', color: '#F5C16C' }
  ]),
  camara: () => pasosSvg('Calibración de cámara', [
    ['1.capturar', '20–30 fotos del tablero'], ['2.esquinas', 'detecta los puntos del chessboard'],
    ['3.intrínsecos', 'fx, fy, cx, cy + distorsión'], ['4.reproyección', 'error < 1 px es bueno']
  ]),
  nube: () => flow('Procesar una nube de puntos', [
    { label: 'Voxel grid', sub: 'reducir densidad' }, { label: 'Normales', sub: 'estimar' },
    { label: 'Segmentación', sub: 'suelo / objetos' }, { label: 'ICP', sub: 'alinear nubes', color: '#F5C16C' }
  ]),

  // --- Mecánica / CAD ---
  cad: () => layers('CAD paramétrico', [
    { label: 'Croquis', sub: 'geometría + restricciones' }, { label: 'Operaciones', sub: 'extruir, recortar, taladrar' },
    { label: 'Ensamblaje', sub: 'restricciones entre piezas' }, { label: 'Planos/DFM', sub: 'para fabricar' }
  ]),
  tolerancias: () => compare('Ajustes y tolerancias', { label: 'Holgura', sub: 'eje < taladro' }, { label: 'Presión', sub: 'eje > taladro' }, ['Imprime una galga y mide TU máquina', '0.2–0.4 mm típico en FDM']),
  impresion: () => flow('Impresión 3D (FDM)', [
    { label: 'Modelo 3D', sub: 'STL / 3MF' }, { label: 'Slicer', sub: 'capas, relleno' },
    { label: 'Impresora', sub: 'temperatura, adherencia' }, { label: 'Pieza', sub: 'medir e iterar', color: '#F5C16C' }
  ]),
  so101: () => layers('SO-101: brazo de aprendizaje', [
    { label: 'Leader', sub: 'lo mueves con la mano' }, { label: 'Follower', sub: 'repite los movimientos' },
    { label: 'Servos STS3215', sub: 'reportan posición por bus' }, { label: 'LeRobot', sub: 'grabar demos y entrenar', color: '#F5C16C' }
  ]),

  // --- ROS 2 ---
  ros_graf: () => flow('Grafo ROS 2', [
    { label: 'Nodo', sub: 'proceso' }, { label: 'Topic', sub: 'pub/sub' }, { label: 'Service', sub: 'req/resp' },
    { label: 'Action', sub: 'objetivo + feedback', color: '#F5C16C' }
  ]),
  tf: () => raw(
    text(380, 26, 'Árbol de transformadas (tf2)', 16, '#D7D8D3', 'middle', 700) +
    box(310, 56, 140, 46, 'map', 'fijo') +
    box(310, 130, 140, 46, 'odom', 'continuo') +
    box(310, 204, 140, 46, 'base_link', 'robot', '#F5C16C') +
    box(90, 204, 140, 46, 'laser', 'sensor') + box(530, 204, 140, 46, 'camera', 'sensor') +
    arrow(380, 102, 380, 128) + arrow(380, 176, 380, 202) +
    arrow(310, 227, 232, 227) + arrow(450, 227, 528, 227) +
    text(380, 268, 'map→odom lo publica SLAM · odom→base lo publica la odometría', 11, '#A2A8B2')),
  urdf: () => flow('URDF / xacro', [
    { label: 'links', sub: 'masa, inercia, visual' }, { label: 'joints', sub: 'tipo y límites' },
    { label: 'xacro', sub: 'macros y parámetros' }, { label: 'robot_state_publisher', sub: 'publica tf', color: '#F5C16C' }
  ]),
  control_ros: () => flow('ros2_control', [
    { label: 'URDF <ros2_control>', sub: 'interfaces' }, { label: 'controller_manager', sub: 'carga controladores' },
    { label: 'diff_drive / JTC', sub: 'lógica' }, { label: 'hardware interface', sub: 'real o Gazebo', color: '#F5C16C' }
  ]),
  gazebo: () => layers('Simulación', [
    { label: 'SDF world', sub: 'suelo, luces, obstáculos' }, { label: 'Modelo URDF', sub: 'el robot' },
    { label: 'Plugins', sub: 'lidar, cámara, IMU' }, { label: 'Datos en topics', sub: '/scan, /image, /imu', color: '#F5C16C' }
  ]),
  nav2: () => flow('Nav2: navegación', [
    { label: 'Mapa / costmap', sub: 'dónde puedo ir' }, { label: 'Planner', sub: 'ruta global' },
    { label: 'Controller', sub: 'velocidades locales' }, { label: 'BT', sub: 'comportamiento', color: '#F5C16C' }
  ]),
  slam: () => flow('SLAM: mapa + localización', [
    { label: 'Sensor', sub: 'lidar / cámara' }, { label: 'Odometría', sub: 'movimiento estimado' },
    { label: 'Grafo', sub: 'restricciones + loop closure' }, { label: 'Mapa', sub: 'occupancy grid', color: '#F5C16C' }
  ]),
  moveit: () => flow('MoveIt 2', [
    { label: 'Planning scene', sub: 'robot + obstáculos' }, { label: 'IK', sub: 'pose → articulaciones' },
    { label: 'Planner', sub: ' trayectoria sin colisiones' }, { label: 'Execute', sub: 'ros2_control', color: '#F5C16C' }
  ]),
  rosbag: () => flow('rosbag: grabar y replay', [
    { label: 'Grabar', sub: 'ros2 bag record' }, { label: '.db3 + metadata', sub: 'en disco' },
    { label: 'Replay', sub: 'ros2 bag play' }, { label: 'Debug', sub: 'misma entrada, otra vez', color: '#F5C16C' }
  ]),

  // --- Control y cinemática ---
  pid: () => raw(
    text(380, 26, 'Lazo PID', 16, '#D7D8D3', 'middle', 700) +
    box(40, 90, 110, 56, 'setpoint', 'deseo') + box(190, 90, 100, 56, 'Σ', 'error') +
    box(330, 90, 150, 56, 'P · I · D', 'controlador', '#F5C16C') + box(520, 90, 110, 56, 'planta', 'motor') +
    arrow(150, 118, 188, 118) + arrow(290, 118, 328, 118) + arrow(480, 118, 518, 118) +
    `<path d="M630 118 H700 V200 H240 V148" fill="none" stroke="#5B6472" stroke-width="2" marker-end="url(#a)"/>` +
    text(470, 220, 'realimentación (sensor)', 12, '#A2A8B2')),
  pid_respuesta: () => plot('Respuesta al escalón', [
    { pts: '60,230 120,110 170,90 230,130 300,150 420,148 560,150 720,150', color: '#7FD1C1', label: 'bien sintonizado' },
    { pts: '60,230 110,70 160,170 210,60 260,180 320,70 400,165 500,100 620,150 720,140', color: '#FF7A70', label: 'Kp demasiado alto' },
    { pts: '60,230 160,200 260,180 400,160 560,145 720,135', color: '#B9A6FF', label: 'Ki alto / lento' }
  ]),
  paso: () => flow('Función de transferencia', [
    { label: 'Entrada u(t)', sub: 'señal de control' }, { label: 'Modelo G(s)', sub: 'dinámica' },
    { label: 'Salida y(t)', sub: 'respuesta' }, { label: 'Realimentación', sub: 'cierra el lazo', color: '#F5C16C' }
  ]),
  estado: () => flow('Espacio de estados', [
    { label: 'Estado x', sub: 'posición, velocidad…' }, { label: 'ẋ = Ax+Bu', sub: 'evolución' },
    { label: 'y = Cx+Du', sub: 'medición' }, { label: 'Observador', sub: 'estimar x', color: '#F5C16C' }
  ]),
  lqr: () => flow('LQR: balance coste/esfuerzo', [
    { label: 'Dinámica lineal', sub: 'A, B' }, { label: 'Matrices Q, R', sub: 'pesos' },
    { label: 'Ecuación de Riccati', sub: 'resuelve P' }, { label: 'K = R⁻¹BᵀP', sub: 'u = −Kx', color: '#F5C16C' }
  ]),
  mpc: () => layers('MPC: horizonte móvil', [
    { label: 'Predecir', sub: 'N pasos por delante' }, { label: 'Optimizar', sub: 'minimiza coste con restricciones' },
    { label: 'Aplicar', sub: 'solo el primer control' }, { label: 'Repetir', sub: 'cada ciclo (receding horizon)', color: '#F5C16C' }
  ]),
  cinematica: () => raw(
    text(380, 26, 'Cinemática directa: 2 eslabones', 16, '#D7D8D3', 'middle', 700) +
    `<line x1="180" y1="220" x2="360" y2="120" stroke="#7FD1C1" stroke-width="10" stroke-linecap="round"/>` +
    `<line x1="360" y1="120" x2="540" y2="180" stroke="#B9A6FF" stroke-width="10" stroke-linecap="round"/>` +
    `<circle cx="180" cy="220" r="12" fill="#F5C16C"/><circle cx="360" cy="120" r="12" fill="#F5C16C"/>` +
    `<circle cx="540" cy="180" r="12" fill="#FF7A70"/>` +
    text(270, 160, 'L1, θ1', 13, '#F2F1ED') + text(450, 135, 'L2, θ2', 13, '#F2F1ED') +
    text(540, 215, '(x,y)', 13, '#FF7A70')),
  ik: () => flow('Cinemática inversa', [
    { label: 'Pose deseada', sub: 'x, y, z, orientación' }, { label: 'Solver', sub: 'numérico / analítico' },
    { label: 'Ángulos q', sub: 'articulaciones' }, { label: 'Comprobar', sub: 'colisiones y límites', color: '#F5C16C' }
  ]),
  jacobiano: () => flow('Jacobiano J(q)', [
    { label: 'Vel. articulaciones q̇', sub: '' }, { label: 'J(q)', sub: 'derivadas' },
    { label: 'Vel. end-effector ẋ', sub: 'ẋ = J q̇' }, { label: 'Singularidad', sub: 'rango cae', color: '#FF7A70' }
  ]),
  trayectoria: () => flow('Planificación de trayectoria', [
    { label: 'Inicio / meta', sub: 'configuraciones' }, { label: 'Buscar', sub: 'A*, RRT, PRM' },
    { label: 'Suavizar', sub: 'velocidad y aceleración' }, { label: 'Ejecutar', sub: 'con control', color: '#F5C16C' }
  ]),
  subactuado: () => layers('Sistemas subactuados', [
    { label: 'Péndulo / cart-pole', sub: 'menos actuadores que grados de libertad' },
    { label: 'Balanceo', sub: 'requiere moverse para no caer' },
    { label: 'Marcha', sub: 'captura, transferencia, empuje' },
    { label: 'Herramientas', sub: 'LQR, Lyapunov, trajectory optimization' }
  ]),
  fuerza: () => compare('Control de posición vs fuerza', { label: 'Posición', sub: 'rígido, preciso' }, { label: 'Fuerza', sub: 'adaptable, seguro' }, ['Impedancia: relación fuerza–movimiento', 'Clave para contacto y manipulación']),
  frencuencia: () => plot('Respuesta en frecuencia', [
    { pts: '60,60 200,70 320,90 430,140 520,200 620,225 720,230', color: '#7FD1C1', label: 'magnitud' },
    { pts: '60,220 200,210 320,180 430,120 520,90 620,80 720,75', color: '#B9A6FF', label: 'fase' }
  ]),

  // --- Visión ---
  convolucion: () => flow('Convolución (filtro)', [
    { label: 'Imagen', sub: 'píxeles' }, { label: 'Kernel 3×3', sub: 'bordes / enfoque' },
    { label: 'Barrido', sub: 'producto + suma' }, { label: 'Mapa de características', sub: '', color: '#F5C16C' }
  ]),
  yolo: () => flow('Detección de objetos', [
    { label: 'Imagen', sub: '' }, { label: 'Backbone CNN', sub: 'características' },
    { label: 'Head', sub: 'cajas + clases' }, { label: 'NMS', sub: 'quita duplicados', color: '#F5C16C' }
  ]),
  slam_visual: () => flow('SLAM visual / VIO', [
    { label: 'Features', sub: 'esquinas, ORB' }, { label: 'Match', sub: 'entre frames' },
    { label: 'Geometría', sub: 'epipolar / PnP' }, { label: 'Optimización', sub: 'bundle adjustment', color: '#F5C16C' }
  ]),

  // --- Robot learning ---
  imitation: () => flow('Imitation learning', [
    { label: 'Demostraciones', sub: 'teleoperación' }, { label: 'Dataset', sub: '(obs, acción)' },
    { label: 'Entrenar', sub: 'política π' }, { label: 'Desplegar', sub: 'en el robot', color: '#F5C16C' }
  ]),
  act: () => layers('ACT / Diffusion Policy', [
    { label: 'Observación', sub: 'cámara + estado' }, { label: 'Chunk de acciones', sub: 'predice varias de una vez' },
    { label: 'Transformer / difusión', sub: 'denoising iterativo' }, { label: 'Ejecución', sub: 'replanea cada N pasos', color: '#F5C16C' }
  ]),
  rl: () => flow('Reinforcement learning', [
    { label: 'Agente', sub: 'política π' }, { label: 'Acción', sub: 'motor' },
    { label: 'Entorno', sub: 'nuevo estado + reward' }, { label: 'Actualizar', sub: 'maximiza retorno', color: '#F5C16C' }
  ]),
  sim2real: () => flow('Sim-to-real', [
    { label: 'Entrenar en sim', sub: 'rápido y paralelo' }, { label: 'Dominio aleatorizado', sub: 'masa, fricción, luz' },
    { label: 'Transferir', sub: 'al robot real' }, { label: 'Ajustar', sub: 'fine-tune con datos reales', color: '#F5C16C' }
  ]),
  lerobot: () => layers('LeRobot: pipeline', [
    { label: 'Conectar', sub: 'robot o simulador' }, { label: 'Record', sub: 'episodios' },
    { label: 'Train', sub: 'política (ACT, Diffusion, PPO)' }, { label: 'Eval', sub: 'tasa de éxito', color: '#F5C16C' }
  ]),
  vla: () => flow('Modelo VLA', [
    { label: 'Imagen + texto', sub: 'instrucción' }, { label: 'Backbone VLM', sub: 'entiende la escena' },
    { label: 'Acciones', sub: 'tokens de movimiento' }, { label: 'Robot', sub: 'ejecuta', color: '#F5C16C' }
  ]),

  // --- AI Engineer ---
  roles: () => layers('Mapa de roles en IA', [
    { label: 'Research Engineer', sub: 'nuevos modelos y entrenamientos' },
    { label: 'ML Engineer', sub: 'entrenar, evaluar, desplegar modelos' },
    { label: 'AI Engineer', sub: 'LLMs, RAG, agentes, producto' },
    { label: 'MLOps / Platform', sub: 'infra, pipelines, observabilidad' }
  ]),
  algebra: () => layers('Álgebra que se usa cada día', [
    { label: 'Vector / matriz', sub: 'datos, embeddings, pesos' }, { label: 'Producto punto', sub: 'similitud' },
    { label: 'Producto de matrices', sub: 'capas de una red' }, { label: 'Autovalores', sub: 'PCA, estabilidad', color: '#F5C16C' }
  ]),
  gradiente: () => raw(
    text(380, 26, 'Descenso de gradiente', 16, '#D7D8D3', 'middle', 700) +
    `<path d="M120 70 Q380 40 640 90 Q680 200 480 230 Q300 250 200 180" fill="none" stroke="#3A414C" stroke-width="2"/>` +
    `<circle cx="220" cy="160" r="8" fill="#F5C16C"/><circle cx="320" cy="205" r="8" fill="#F5C16C"/>` +
    `<circle cx="430" cy="213" r="8" fill="#F5C16C"/><circle cx="520" cy="160" r="8" fill="#7FD1C1"/>` +
    text(380, 270, 'θ ← θ − η·∇L(θ)   (η = learning rate)', 14, '#F2F1ED')),
  overfitting: () => plot('Curvas de entrenamiento', [
    { pts: '60,220 160,170 260,130 380,105 520,95 720,90', color: '#7FD1C1', label: 'train loss' },
    { pts: '60,220 160,175 260,140 380,150 520,190 720,220', color: '#FF7A70', label: 'val loss' }
  ]),
  arbol: () => raw(
    text(380, 26, 'Árbol de decisión', 16, '#D7D8D3', 'middle', 700) +
    box(320, 52, 120, 44, 'x1 > 2.5?', '', '#F5C16C') +
    box(150, 140, 120, 44, 'x2 > 1?', '') + box(490, 140, 120, 44, 'clase A', '', '#7FD1C1') +
    box(70, 225, 110, 40, 'clase B', '', '#B9A6FF') + box(250, 225, 110, 40, 'clase C', '', '#B9A6FF') +
    `<path d="M350 96 L210 138" stroke="#5B6472" stroke-width="2"/><path d="M410 96 L550 138" stroke="#5B6472" stroke-width="2"/>` +
    `<path d="M180 184 L125 223" stroke="#5B6472" stroke-width="2"/><path d="M240 184 L305 223" stroke="#5B6472" stroke-width="2"/>`),
  clustering: () => raw(
    text(380, 26, 'Clustering: agrupar sin etiquetas', 16, '#D7D8D3', 'middle', 700) +
    `<circle cx="200" cy="150" r="70" fill="#7FD1C1" opacity="0.12"/><circle cx="540" cy="170" r="80" fill="#B9A6FF" opacity="0.12"/>` +
    [[170,130],[220,170],[190,190]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#7FD1C1"/>`).join('') +
    [[520,140],[570,190],[540,210],[500,180]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#B9A6FF"/>`).join('') +
    text(200, 260, 'grupo 1', 12, '#7FD1C1') + text(540, 260, 'grupo 2', 12, '#B9A6FF')),
  ml_pipeline: () => flow('Pipeline de ML', [
    { label: 'Datos', sub: 'limpieza' }, { label: 'Features', sub: 'ingeniería' },
    { label: 'Modelo', sub: 'entrenar' }, { label: 'Evaluar', sub: 'métricas' }, { label: 'Desplegar', sub: 'servir', color: '#F5C16C' }
  ]),
  perceptron: () => flow('Neurona artificial', [
    { label: 'Entradas x', sub: 'x1…xn' }, { label: 'Pesos w + b', sub: '∑wᵢxᵢ+b' },
    { label: 'Activación', sub: 'ReLU, sigmoid' }, { label: 'Salida', sub: 'ŷ', color: '#F5C16C' }
  ]),
  backprop: () => flow('Backpropagation', [
    { label: 'Forward', sub: 'calcular ŷ' }, { label: 'Loss', sub: 'comparar con y' },
    { label: 'Gradientes', sub: 'cadena hacia atrás' }, { label: 'Actualizar', sub: 'pesos', color: '#F5C16C' }
  ]),
  cnn: () => layers('CNN: de píxeles a conceptos', [
    { label: 'Convolución', sub: 'filtros locales' }, { label: 'Activación + Pooling', sub: 'no linealidad y reducción' },
    { label: 'Más capas', sub: 'jerarquía de features' }, { label: 'Clasificador', sub: 'fully connected', color: '#F5C16C' }
  ]),
  rnn: () => flow('RNN / LSTM', [
    { label: 'x(t)', sub: 'entrada actual' }, { label: 'Estado h(t−1)', sub: 'memoria' },
    { label: 'Celda', sub: 'compuertas' }, { label: 'h(t)', sub: 'nueva memoria', color: '#F5C16C' }
  ]),
  attention: () => raw(
    text(380, 26, 'Self-attention: cada token mira a todos', 16, '#D7D8D3', 'middle', 700) +
    [0,1,2,3].map(i => `<rect x="${80 + i*140}" y="60" width="110" height="110" rx="8" fill="#1B1F26" stroke="#3A414C"/>`).join('') +
    [0,1,2,3].map(i => text(135 + i*140, 125, ['El','gato','duerme','aquí'][i], 14, '#F2F1ED')).join('') +
    [[0,1,0.9],[1,0,0.7],[2,3,0.8],[3,2,0.6]].map(([a,b,o]) =>
      `<path d="M${135 + a*140} 60 Q${135 + a*140} 40 ${135 + b*140} 40" fill="none" stroke="#F5C16C" stroke-width="${2+o*3}" opacity="${o}"/>`).join('') +
    text(380, 215, 'QKᵀ / √d → softmax → pesos · V', 14, '#F2F1ED') +
    text(380, 250, 'multi-head = varias proyecciones en paralelo', 12, '#A2A8B2')),
  transformer: () => layers('Bloque Transformer', [
    { label: 'Token embedding + posición', sub: '' },
    { label: 'Multi-head attention', sub: 'masked (decoder)' },
    { label: 'Add & LayerNorm', sub: 'conexión residual' },
    { label: 'FFN', sub: 'MLP por token' }, { label: 'Add & LayerNorm', sub: 'salida', color: '#F5C16C' }
  ]),
  tokenizacion: () => flow('Tokenización', [
    { label: 'Texto', sub: '"hola mundo"' }, { label: 'BPE', sub: 'subpalabras' },
    { label: 'IDs', sub: '[15496, 995]' }, { label: 'Embeddings', sub: 'vectores', color: '#F5C16C' }
  ]),
  generacion: () => flow('Generación autorregresiva', [
    { label: 'Prompt', sub: 'tokens' }, { label: 'Forward', sub: 'logits' },
    { label: 'Sampling', sub: 'temp / top-p' }, { label: 'Nuevo token', sub: 'se añade y repite', color: '#F5C16C' }
  ]),
  kv_cache: () => compare('KV cache', { label: 'Sin caché', sub: 'recalcula todo' }, { label: 'Con caché', sub: 'guarda K,V' }, ['Ahorra O(n²) → O(n) por token', 'Cuesta memoria: crece con el contexto']),
  quantization: () => flow('Cuantización', [
    { label: 'FP16 / BF16', sub: '2 bytes' }, { label: 'INT8', sub: '1 byte' },
    { label: 'INT4', sub: '0.5 byte (AWQ, GPTQ)' }, { label: 'Trade-off', sub: 'menos memoria, algo de calidad', color: '#F5C16C' }
  ]),
  speculative: () => flow('Decoding especulativo', [
    { label: 'Modelo pequeño', sub: 'propone k tokens' }, { label: 'Modelo grande', sub: 'verifica en 1 pasada' },
    { label: 'Aceptar / rechazar', sub: '' }, { label: 'Speedup', sub: '2–3×', color: '#F5C16C' }
  ]),
  serving: () => layers('Servir un LLM en producción', [
    { label: 'Tokenizer', sub: 'entrada' }, { label: 'Scheduler', sub: 'continuous batching' },
    { label: 'Motor', sub: 'vLLM / TGI / TensorRT-LLM' }, { label: 'Streaming', sub: 'SSE al cliente', color: '#F5C16C' }
  ]),
  evals: () => flow('Evaluación de un LLM', [
    { label: 'Dataset', sub: 'casos de prueba' }, { label: 'Métrica', sub: 'exactitud / LLM-judge' },
    { label: 'Comparar', sub: 'vs baseline' }, { label: 'Regresión', sub: 'detectar mejoras', color: '#F5C16C' }
  ]),
  rag: () => flow('RAG: recuperar + generar', [
    { label: 'Pregunta', sub: 'del usuario' }, { label: 'Embed + buscar', sub: 'vector DB' },
    { label: 'Contexto', sub: 'trozos relevantes' }, { label: 'LLM', sub: 'responde con contexto', color: '#F5C16C' }
  ]),
  chunking: () => layers('Chunking de documentos', [
    { label: 'Tamaño', sub: '200–800 tokens según caso' }, { label: 'Solape', sub: '10–20% para no perder contexto' },
    { label: 'Estructura', sub: 'por sección / encabezado' }, { label: 'Metadatos', sub: 'fuente y fecha para citar' }
  ]),
  vectordb: () => flow('Búsqueda vectorial', [
    { label: 'Texto', sub: '→ embedding' }, { label: 'Índice', sub: 'HNSW / IVF' },
    { label: 'k vecinos', sub: 'similitud coseno' }, { label: 'Rerank', sub: 'cross-encoder', color: '#F5C16C' }
  ]),
  agentes: () => flow('Agente con herramientas', [
    { label: 'Objetivo', sub: 'del usuario' }, { label: 'Razonar', sub: 'ReAct: piensa' },
    { label: 'Actuar', sub: 'llama a una herramienta' }, { label: 'Observar', sub: 'lee el resultado y repite', color: '#F5C16C' }
  ]),
  mcp: () => flow('MCP: protocolo de herramientas', [
    { label: 'Host / cliente', sub: 'tu app' }, { label: 'MCP client', sub: 'conecta' },
    { label: 'MCP server', sub: 'expone tools/resources' }, { label: 'Sistema', sub: 'archivos, APIs, BD', color: '#F5C16C' }
  ]),
  memoria: () => layers('Memoria de un agente', [
    { label: 'Corto plazo', sub: 'historial de la conversación' },
    { label: 'Largo plazo', sub: 'hechos y preferencias en vector DB' },
    { label: 'Episódica', sub: 'experiencias pasadas' }, { label: 'Working memory', sub: 'estado de la tarea', color: '#F5C16C' }
  ]),
  multiagente: () => layers('Multi-agente', [
    { label: 'Orquestador', sub: 'divide y coordina' }, { label: 'Especialistas', sub: 'investigador, coder, reviewer' },
    { label: 'Mensajes', sub: 'comparten contexto' }, { label: 'Síntesis', sub: 'resultado final', color: '#F5C16C' }
  ]),
  drift: () => plot('Data drift', [
    { pts: '60,120 160,125 260,118 360,122 460,130 560,175 660,210 720,225', color: '#FF7A70', label: 'producción' },
    { pts: '60,130 160,125 260,128 360,124 460,127 560,126 660,128 720,126', color: '#7FD1C1', label: 'entrenamiento' }
  ]),
  mlops: () => layers('MLOps: el ciclo completo', [
    { label: 'Datos versionados', sub: 'DVC / lakeFS' }, { label: 'Experimentos', sub: 'MLflow / W&B' },
    { label: 'Pipeline', sub: 'CI/CD' }, { label: 'Registro de modelos', sub: 'MLflow registry' },
    { label: 'Monitoreo', sub: 'drift + performance', color: '#F5C16C' }
  ]),
  diffusion: () => flow('Modelo de difusión', [
    { label: 'Ruido', sub: 'x_T' }, { label: 'U-Net', sub: 'predice ruido ε' },
    { label: 'Denoising', sub: 'paso a paso' }, { label: 'Imagen', sub: 'x_0', color: '#F5C16C' }
  ]),
  multimodal: () => flow('Modelo multimodal', [
    { label: 'Imagen / audio', sub: 'encoder' }, { label: 'Proyección', sub: 'al espacio de tokens' },
    { label: 'LLM', sub: 'razona sobre todo' }, { label: 'Respuesta', sub: 'texto / acción', color: '#F5C16C' }
  ]),
  distillation: () => compare('Destilación', { label: 'Teacher', sub: 'modelo grande' }, { label: 'Student', sub: 'modelo pequeño' }, ['Aprende de logits suaves (temperatura)', 'Menos coste, casi la misma calidad']),
  edge: () => layers('IA en el dispositivo', [
    { label: 'Cuantización', sub: 'INT4 / INT8' }, { label: 'Compilación', sub: 'Core ML / TFLite / ONNX' },
    { label: 'NPU / GPU', sub: 'hardware dedicado' }, { label: 'Privacidad', sub: 'los datos no salen', color: '#F5C16C' }
  ]),
  seguridad: () => layers('Seguridad de LLM', [
    { label: 'Prompt injection', sub: 'instrucciones maliciosas en datos' },
    { label: 'Jailbreaks', sub: 'eluden las restricciones' },
    { label: 'Fugas de PII', sub: 'datos personales' },
    { label: 'Defensas', sub: 'input/output filters, sandbox, permisos', color: '#F5C16C' }
  ]),
  t3_arquitectura: () => layers('T3 Code: control plane de agentes', [
    { label: 'Harnesses locales', sub: 'Claude Code · Codex · OpenCode · Cursor · Grok · Antigravity', color: '#B9A6FF' },
    { label: 'Adaptadores', sub: 'cada agente → eventos comunes' },
    { label: 'T3 Code', sub: 'threads, permisos, diffs, checkpoints, worktrees', color: '#F5C16C' },
    { label: 'Clientes', sub: 'desktop · web · iOS · Android', color: '#7FD1C1' }
  ]),
  t3_thread: () => flow('Un hilo, un workspace aislado', [
    { label: 'New thread', sub: 'elige agente y modelo' }, { label: 'Worktree', sub: 'rama propia' },
    { label: 'Edits + diff', sub: 'revisión por turno' }, { label: 'Commit / PR', sub: 'un botón', color: '#F5C16C' }
  ]),
  t3_permisos: () => layers('Modos de permiso', [
    { label: 'Supervised', sub: 'pregunta antes de cada comando o cambio' },
    { label: 'Auto-accept edits', sub: 'acepta ediciones; otras acciones preguntan' },
    { label: 'Auto', sub: 'menos fricción, aún con límites' },
    { label: 'Full access', sub: 'sin preguntas: solo en entornos desechables', color: '#FF7A70' }
  ]),
  huang_loop: () => flow('Aprender con IA hasta entender', [
    { label: 'No sé preguntar', sub: 'pídele a la IA que formule la pregunta' },
    { label: 'Pregunta afinada', sub: 'revísala: ¿refleja lo que quieres?' },
    { label: 'Respuesta', sub: 'explícamelo como si no supiera' },
    { label: 'Otra IA la critica', sub: 'contrasta dos respuestas', color: '#B9A6FF' },
    { label: 'Fuente primaria', sub: 'verifica cifras y fechas', color: '#F5C16C' }
  ], 760, 230),
  explotar_ia: () => compare('Dos formas de usar IA', { label: 'Delegar', sub: 'que piense por ti' }, { label: 'Aprender', sub: 'que te enseñe a pensar' }, [
    'Delegar: rápido, frágil, no acumula criterio',
    'Aprender: lento al principio, construye ventaja durable',
    'La carrera la gana quien explota mejor la tecnología'
  ]),
  orquestacion_trabajo: () => layers('Orquestar IA en el trabajo', [
    { label: 'Elige una tarea', sub: 'repetitiva, acotada, medible' },
    { label: 'Define "mejor" antes', sub: 'tiempo, precisión, claridad o coste' },
    { label: 'Elige agente y permisos', sub: 'según riesgo y contexto' },
    { label: 'Paraleliza en worktrees', sub: 'un hilo por tarea' },
    { label: 'Revisa y mide', sub: 'diff, verificaciones y métrica real', color: '#7FD1C1' }
  ]),
  diseno_ia: () => layers('System design de un sistema de IA', [
    { label: 'Requisitos', sub: 'latencia, coste, calidad' }, { label: 'Selección de modelo', sub: 'tamaño vs coste' },
    { label: 'Retrieval y caché', sub: 'si aplica' }, { label: 'Observabilidad', sub: 'trazas y evals' },
    { label: 'Fallbacks', sub: 'degradación elegante', color: '#F5C16C' }
  ])
};

function pasosSvg(title: string, items: string[][]): string {
  let s = text(380, 28, title, 16, '#D7D8D3', 'middle', 700);
  items.forEach(([label, sub], i) => {
    const y = 52 + i * 56;
    s += `<circle cx="60" cy="${y + 20}" r="16" fill="#F5C16C"/>` + text(60, y + 26, String(i + 1), 14, '#15181C', 'middle', 800);
    s += `<rect x="92" y="${y}" width="620" height="42" rx="9" fill="#1B1F26" stroke="#2C3138"/>`;
    s += text(110, y + 19, label, 13, '#F7F6F2', 'start', 650);
    s += text(110, y + 34, sub, 11, '#A2A8B2', 'start');
  });
  return wrap(defs + s, 760, 52 + items.length * 56 + 16);
}

import { electronicsDiagrams } from './diagrams-electronics';

export function getDiagram(name: string): string | null {
  const fn = D[name] ?? electronicsDiagrams[name];
  if (fn) return fn();
  // Fallback: diagrama genérico para nombres no registrados.
  return wrap(defs + text(380, 130, name.replace(/_/g, ' '), 20, '#F2F1ED', 'middle', 700) +
    text(380, 165, 'esquema conceptual', 12, '#A2A8B2'), 760, 220);
}
