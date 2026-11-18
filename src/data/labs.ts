export type LabTone = 'green' | 'violet' | 'orange' | 'mint' | 'plain';

export type LabNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  tone?: LabTone;
  w?: number;
};

export type LabEdge = { from: string; to: string; label?: string };

export type LabStep = {
  title: string;
  desc: string;
  active: string[];
  note?: string;
  metrics?: [string, string][];
};

export type Lab = {
  id: string;
  track: 'robotica' | 'ai';
  title: string;
  subtitle: string;
  level: string;
  minutes: number;
  nodes: LabNode[];
  edges: LabEdge[];
  steps: LabStep[];
  learn: string[];
};

export const labs: Lab[] = [
  {
    id: 'lab-ohm', track: 'robotica', title: 'Cómo viaja la corriente',
    subtitle: 'Sigue el recorrido de los electrones por un circuito y descubre dónde se pierde energía.',
    level: 'Principiante', minutes: 10,
    nodes: [
      { id: 'bat', label: 'batería 5 V', x: 120, y: 210, tone: 'orange' },
      { id: 'res', label: 'R · 330 Ω', x: 360, y: 120, tone: 'green' },
      { id: 'led', label: 'LED', x: 600, y: 210, tone: 'violet' },
      { id: 'gnd', label: 'GND', x: 360, y: 330, tone: 'mint' }
    ],
    edges: [{ from: 'bat', to: 'res', label: '+5 V' }, { from: 'res', to: 'led', label: '9 mA' }, { from: 'led', to: 'gnd' }, { from: 'gnd', to: 'bat' }],
    steps: [
      { title: 'La fuente', desc: 'La batería establece una diferencia de potencial de 5 V entre sus terminales. Es la "presión" que empuja a los electrones.', active: ['bat'], metrics: [['V', '5 V'], ['I', '0 mA'], ['P', '0 mW']] },
      { title: 'Cerrar el lazo', desc: 'Sin un camino de vuelta a GND no hay corriente. Conecta el retorno y el circuito se cierra.', active: ['bat', 'gnd'], metrics: [['V', '5 V'], ['I', '0 mA'], ['P', '0 mW']] },
      { title: 'Limitar la corriente', desc: 'El LED tiene una caída de ~2 V. Sin resistencia circularía demasiada corriente y se quemaría.', active: ['bat', 'res', 'gnd'], note: 'R = (5 − 2) / 0.01 = 300 Ω → usa 330 Ω.', metrics: [['V', '5 V'], ['I', '9 mA'], ['P', '40 mW']] },
      { title: 'El LED se enciende', desc: 'La corriente pasa por el LED y emite luz. La tensión restante cae en la resistencia en forma de calor.', active: ['bat', 'res', 'led', 'gnd'], metrics: [['V', '5 V'], ['I', '9 mA'], ['P', '45 mW']] },
      { title: 'Ley de Ohm', desc: 'En serie la corriente es la misma en todos los puntos. La suma de caídas (2 V + 3 V) es igual a la fuente (5 V).', active: ['bat', 'res', 'led', 'gnd'], note: 'V = I · R. Verifica siempre antes de conectar.', metrics: [['V', '5 V'], ['I', '9 mA'], ['ΣV', '5 V']] }
    ],
    learn: ['Qué es la diferencia de potencial', 'Por qué hace falta una resistencia', 'Que en serie la corriente es constante', 'Cómo aplicar V = I·R']
  },
  {
    id: 'lab-pwm', track: 'robotica', title: 'Anatomía de una señal PWM',
    subtitle: 'De una señal digital de encendido/apagado a una tensión media que controla un motor.',
    level: 'Principiante', minutes: 8,
    nodes: [
      { id: 'mcu', label: 'GPIO', x: 120, y: 210, tone: 'green' },
      { id: 'timer', label: 'timer', x: 320, y: 120, tone: 'plain' },
      { id: 'driver', label: 'driver', x: 520, y: 210, tone: 'orange' },
      { id: 'motor', label: 'motor', x: 700, y: 210, tone: 'violet' }
    ],
    edges: [{ from: 'mcu', to: 'timer' }, { from: 'timer', to: 'driver', label: 'PWM' }, { from: 'driver', to: 'motor' }],
    steps: [
      { title: 'Un pin digital', desc: 'El GPIO solo sabe dar 0 V o 3.3 V. No puede entregar 1.65 V directamente.', active: ['mcu'], metrics: [['duty', '0 %'], ['V media', '0 V'], ['rpm', '0']] },
      { title: 'El timer', desc: 'El periférico de temporización cuenta ciclos y decide cuándo subir y bajar la señal.', active: ['mcu', 'timer'], metrics: [['f', '5 kHz'], ['duty', '0 %'], ['rpm', '0']] },
      { title: 'Ancho de pulso', desc: 'Con duty 50 % el pin está alto la mitad del periodo. El promedio es 3.3 · 0.5 = 1.65 V.', active: ['mcu', 'timer', 'driver'], note: 'V media = Vcc · duty.', metrics: [['f', '5 kHz'], ['duty', '50 %'], ['V media', '1.65 V']] },
      { title: 'El driver amplifica', desc: 'El pin no puede mover un motor: el driver usa la señal PWM para conmutar una corriente mayor desde la fuente.', active: ['mcu', 'timer', 'driver', 'motor'], metrics: [['duty', '50 %'], ['I', '0.8 A'], ['rpm', '120']] },
      { title: 'Más duty, más giro', desc: 'Subir a 80 % aumenta la tensión media y el par. La frecuencia se elige por encima del oído para evitar silbidos.', active: ['driver', 'motor'], metrics: [['duty', '80 %'], ['I', '1.2 A'], ['rpm', '190']] }
    ],
    learn: ['Qué es el duty cycle', 'Por qué el promedio simula analógico', 'Que el GPIO no alimenta motores', 'Cómo elegir la frecuencia']
  },
  {
    id: 'lab-loop', track: 'robotica', title: 'Dentro de un lazo PID',
    subtitle: 'Observa cómo el error viaja del sensor al controlador y vuelve al motor.',
    level: 'Intermedio', minutes: 12,
    nodes: [
      { id: 'set', label: 'setpoint', x: 100, y: 130, tone: 'green' },
      { id: 'sum', label: 'error', x: 290, y: 130, tone: 'plain' },
      { id: 'pid', label: 'P·I·D', x: 470, y: 130, tone: 'orange' },
      { id: 'motor', label: 'motor', x: 660, y: 130, tone: 'violet' },
      { id: 'sensor', label: 'sensor', x: 470, y: 330, tone: 'mint' }
    ],
    edges: [{ from: 'set', to: 'sum' }, { from: 'sum', to: 'pid' }, { from: 'pid', to: 'motor' }, { from: 'motor', to: 'sensor' }, { from: 'sensor', to: 'sum', label: 'realimentación' }],
    steps: [
      { title: 'La meta', desc: 'El setpoint es la velocidad o posición deseada. El controlador no la conoce: solo compara.', active: ['set'], metrics: [['setpoint', '100'], ['error', '—'], ['u', '0']] },
      { title: 'Nace el error', desc: 'e = deseado − medido. Si el sensor dice 20 y quieres 100, el error es 80.', active: ['set', 'sum', 'sensor'], metrics: [['setpoint', '100'], ['error', '80'], ['u', '0']] },
      { title: 'Proporcional', desc: 'P reacciona al error actual: u = Kp·e. Kp alto acelera la respuesta pero puede hacerla oscilar.', active: ['set', 'sum', 'pid'], note: 'Empieza con Kp, añade D y deja I para el final.', metrics: [['Kp', '0.8'], ['error', '80'], ['u', '64']] },
      { title: 'Integral y derivativo', desc: 'I acumula el error pasado y elimina el offset permanente. D observa la velocidad de cambio y amortigua.', active: ['sum', 'pid', 'motor'], metrics: [['Ki', '0.2'], ['Kd', '0.4'], ['u', '71']] },
      { title: 'El lazo se cierra', desc: 'El sensor mide la salida real y realimenta el comparador. El ciclo se repite cientos de veces por segundo.', active: ['set', 'sum', 'pid', 'motor', 'sensor'], note: 'Si el lazo oscila: baja Kp o sube Kd.', metrics: [['error', '3'], ['u', '98'], ['f', '1 kHz']] }
    ],
    learn: ['Qué es la realimentación', 'Qué aporta cada término del PID', 'Por qué el lazo oscila', 'Cómo cerrar un control']
  },
  {
    id: 'lab-slam', track: 'robotica', title: 'Cómo un robot dibuja un mapa',
    subtitle: 'Del láser crudo al occupancy grid que usa Nav2 para navegar.',
    level: 'Avanzado', minutes: 14,
    nodes: [
      { id: 'lidar', label: 'lidar', x: 100, y: 160, tone: 'orange' },
      { id: 'odom', label: 'odometría', x: 100, y: 300, tone: 'green' },
      { id: 'scan', label: '/scan', x: 300, y: 160, tone: 'plain' },
      { id: 'graph', label: 'grafo', x: 500, y: 230, tone: 'violet' },
      { id: 'map', label: 'mapa', x: 700, y: 230, tone: 'mint' }
    ],
    edges: [{ from: 'lidar', to: 'scan' }, { from: 'odom', to: 'graph' }, { from: 'scan', to: 'graph' }, { from: 'graph', to: 'map' }],
    steps: [
      { title: 'El láser mide', desc: 'Cada pulso de luz vuelve con un tiempo de vuelo. d = c·t/2 da la distancia al obstáculo más cercano.', active: ['lidar'], metrics: [['puntos', '0'], ['deriva', '0 %'], ['mapa', '—']] },
      { title: 'Publicar /scan', desc: 'El driver publica 360 medidas por rotación en el topic /scan. Cada una es un ángulo y una distancia.', active: ['lidar', 'scan'], metrics: [['puntos', '360'], ['deriva', '0 %'], ['mapa', '—']] },
      { title: 'La odometría estima', desc: 'Los encoders dicen cuánto se movió el robot, pero acumulan error con cada giro.', active: ['lidar', 'scan', 'odom'], note: 'Sin corrección, el mapa se desalinea.', metrics: [['puntos', '360'], ['deriva', '4 %'], ['mapa', '—']] },
      { title: 'Grafo y loop closure', desc: 'SLAM añade restricciones entre poses. Al volver a un lugar ya visto detecta el bucle y corrige la deriva.', active: ['scan', 'odom', 'graph'], metrics: [['puntos', '12 k'], ['deriva', '0.4 %'], ['mapa', 'parcial']] },
      { title: 'Occupancy grid', desc: 'El resultado es una rejilla con celdas libres, ocupadas y desconocidas. Nav2 la usa para planificar.', active: ['scan', 'odom', 'graph', 'map'], note: 'map→odom lo publica SLAM, no la odometría.', metrics: [['puntos', '38 k'], ['deriva', '0.3 %'], ['mapa', 'listo']] }
    ],
    learn: ['Qué mide un lidar', 'Por qué deriva la odometría', 'Qué es el loop closure', 'Quién publica map→odom']
  },
  {
    id: 'lab-token', track: 'ai', title: 'Cómo viaja un prompt',
    subtitle: 'Del texto que escribes a los tokens que procesa el modelo, y vuelta a la respuesta.',
    level: 'Principiante', minutes: 9,
    nodes: [
      { id: 'user', label: 'tú', x: 100, y: 220, tone: 'green' },
      { id: 'tok', label: 'tokenizer', x: 290, y: 220, tone: 'plain' },
      { id: 'emb', label: 'embeddings', x: 470, y: 130, tone: 'violet' },
      { id: 'llm', label: 'LLM', x: 660, y: 220, tone: 'orange' },
      { id: 'out', label: 'respuesta', x: 470, y: 330, tone: 'mint' }
    ],
    edges: [{ from: 'user', to: 'tok' }, { from: 'tok', to: 'emb' }, { from: 'emb', to: 'llm' }, { from: 'llm', to: 'out' }],
    steps: [
      { title: 'Escribes', desc: 'El texto entra como una cadena de caracteres. El modelo nunca ve letras: solo números.', active: ['user'], metrics: [['tokens', '0'], ['contexto', '0 %'], ['tok/s', '—']] },
      { title: 'Tokenizar', desc: 'BPE divide el texto en subpalabras. "Hola mundo" puede ser 2 tokens; una palabra rara, varios.', active: ['user', 'tok'], note: 'Contar tokens antes de enviar evita sorpresas de coste.', metrics: [['tokens', '2'], ['contexto', '1 %'], ['tok/s', '—']] },
      { title: 'A vectores', desc: 'Cada token se convierte en un vector. Con la posición y la atención, el modelo construye contexto.', active: ['tok', 'emb'], metrics: [['tokens', '2'], ['d_model', '4096'], ['tok/s', '—']] },
      { title: 'Forward', desc: 'El modelo recorre todas las capas y produce logits: una distribución de probabilidad sobre el vocabulario.', active: ['emb', 'llm'], metrics: [['tokens', '18'], ['contexto', '8 %'], ['TTFT', '320 ms']] },
      { title: 'Generar', desc: 'Se muestrea un token, se añade al contexto y se repite. Por eso la salida aparece token a token.', active: ['user', 'tok', 'emb', 'llm', 'out'], note: 'La salida suele costar 3–5× más que la entrada.', metrics: [['tokens', '142'], ['tok/s', '48'], ['TTFT', '320 ms']] }
    ],
    learn: ['Qué es un token', 'Por qué importa contarlos', 'Qué son los logits', 'Por qué se genera token a token']
  },
  {
    id: 'lab-rag', track: 'ai', title: 'Dentro de un RAG',
    subtitle: 'Desde la pregunta del usuario hasta una respuesta con citas verificables.',
    level: 'Intermedio', minutes: 11,
    nodes: [
      { id: 'q', label: 'pregunta', x: 100, y: 220, tone: 'green' },
      { id: 'emb', label: 'embedding', x: 270, y: 220, tone: 'plain' },
      { id: 'db', label: 'vector DB', x: 440, y: 130, tone: 'violet' },
      { id: 'ctx', label: 'contexto', x: 620, y: 220, tone: 'orange' },
      { id: 'llm', label: 'LLM + cita', x: 440, y: 330, tone: 'mint' }
    ],
    edges: [{ from: 'q', to: 'emb' }, { from: 'emb', to: 'db' }, { from: 'db', to: 'ctx' }, { from: 'ctx', to: 'llm' }],
    steps: [
      { title: 'La pregunta', desc: 'El usuario pide algo sobre datos privados que el modelo no vio en su entrenamiento.', active: ['q'], metrics: [['recall', '—'], ['trozos', '0'], ['latencia', '0 ms']] },
      { title: 'Embed de la query', desc: 'La pregunta se convierte en un vector con el MISMO modelo usado para indexar los documentos.', active: ['q', 'emb'], note: 'Si cambias de modelo de embeddings, reindexa todo.', metrics: [['recall', '—'], ['trozos', '0'], ['latencia', '40 ms']] },
      { title: 'Buscar vecinos', desc: 'El índice HNSW devuelve los k trozos más similares. Un cross-encoder puede reordenarlos.', active: ['emb', 'db'], metrics: [['recall', '0.82'], ['trozos', '8'], ['latencia', '90 ms']] },
      { title: 'Construir el contexto', desc: 'Se meten los mejores trozos en la plantilla del prompt, con margen para la salida.', active: ['db', 'ctx'], note: 'Más contexto no es mejor: introduce ruido y coste.', metrics: [['recall', '0.91'], ['trozos', '4'], ['latencia', '120 ms']] },
      { title: 'Responder con cita', desc: 'El modelo genera la respuesta apoyándose en el contexto. Guarda los metadatos para poder citar la fuente.', active: ['q', 'emb', 'db', 'ctx', 'llm'], metrics: [['recall', '0.91'], ['trozos', '4'], ['TTFT', '480 ms']] }
    ],
    learn: ['Por qué hace falta RAG', 'La importancia del embedding', 'Qué hace el reranker', 'Cómo citar la fuente']
  },
  {
    id: 'lab-agent', track: 'ai', title: 'Un agente con herramientas',
    subtitle: 'El bucle observar → razonar → actuar que hay detrás de ReAct.',
    level: 'Intermedio', minutes: 10,
    nodes: [
      { id: 'goal', label: 'objetivo', x: 100, y: 220, tone: 'green' },
      { id: 'think', label: 'razona', x: 290, y: 130, tone: 'violet' },
      { id: 'tool', label: 'herramienta', x: 480, y: 220, tone: 'orange' },
      { id: 'obs', label: 'observa', x: 670, y: 130, tone: 'plain' },
      { id: 'mem', label: 'memoria', x: 480, y: 350, tone: 'mint' }
    ],
    edges: [{ from: 'goal', to: 'think' }, { from: 'think', to: 'tool' }, { from: 'tool', to: 'obs' }, { from: 'obs', to: 'think' }, { from: 'think', to: 'mem' }],
    steps: [
      { title: 'Objetivo', desc: 'El usuario da una meta, no una secuencia de pasos. El agente debe decidir cómo alcanzarla.', active: ['goal'], metrics: [['pasos', '0'], ['tokens', '0'], ['coste', '$0']] },
      { title: 'Razonar', desc: 'El modelo produce un pensamiento y la siguiente acción. ReAct alterna razonamiento y acción en el mismo hilo.', active: ['goal', 'think'], metrics: [['pasos', '1'], ['tokens', '320'], ['coste', '$0.01']] },
      { title: 'Llamar una herramienta', desc: 'El agente emite una tool call con argumentos. Tu código valida los permisos ANTES de ejecutarla.', active: ['think', 'tool'], note: 'Nunca ejecutes una acción destructiva sin confirmación.', metrics: [['pasos', '2'], ['tokens', '480'], ['coste', '$0.02']] },
      { title: 'Observar el resultado', desc: 'La salida de la herramienta vuelve al contexto como mensaje y el ciclo continúa.', active: ['tool', 'obs'], metrics: [['pasos', '3'], ['tokens', '760'], ['coste', '$0.03']] },
      { title: 'Memoria y parada', desc: 'El estado se guarda en memoria de corto plazo. Sin criterio de parada claro, el bucle puede repetirse indefinidamente.', active: ['goal', 'think', 'tool', 'obs', 'mem'], note: 'Limita iteraciones, detecta repeticiones y registra cada paso.', metrics: [['pasos', '7'], ['tokens', '2.1 k'], ['coste', '$0.09']] }
    ],
    learn: ['Qué es el bucle ReAct', 'Por qué validar las tool calls', 'Qué es la memoria de corto plazo', 'Cómo evitar bucles infinitos']
  },
  {
    id: 'lab-t3', track: 'ai', title: 'Orquestar agentes en T3 Code',
    subtitle: 'Un hilo, un worktree, un diff y un PR: paralelismo sin colisiones.',
    level: 'Avanzado', minutes: 12,
    nodes: [
      { id: 'cli', label: 'Claude / Codex', x: 110, y: 220, tone: 'violet' },
      { id: 't3', label: 'T3 Code', x: 300, y: 220, tone: 'green' },
      { id: 'wt', label: 'worktree', x: 490, y: 130, tone: 'plain' },
      { id: 'diff', label: 'diff', x: 660, y: 220, tone: 'orange' },
      { id: 'pr', label: 'PR', x: 490, y: 340, tone: 'mint' }
    ],
    edges: [{ from: 'cli', to: 't3' }, { from: 't3', to: 'wt' }, { from: 'wt', to: 'diff' }, { from: 'diff', to: 'pr' }],
    steps: [
      { title: 'Tus agentes ya están', desc: 'T3 Code no trae modelo: conduce las CLIs que ya tienes instaladas y autenticadas en tu máquina.', active: ['cli'], metrics: [['hilos', '0'], ['ramas', '0'], ['PR', '0']] },
      { title: 'Un control plane', desc: 'Adaptadores convierten la salida nativa de cada harness en eventos comunes: mismo chat, mismo diff, mismos permisos.', active: ['cli', 't3'], note: 'No revende tokens: usas tus suscripciones.', metrics: [['hilos', '1'], ['ramas', '0'], ['PR', '0']] },
      { title: 'Worktree por hilo', desc: 'Cada tarea vive en su propio directorio y rama. Dos agentes pueden trabajar en paralelo sin pisarse archivos.', active: ['t3', 'wt'], metrics: [['hilos', '3'], ['ramas', '3'], ['PR', '0']] },
      { title: 'Supervised primero', desc: 'Empieza en modo Supervised: apruebas comandos y cambios. Los checkpoints permiten volver a cualquier mensaje.', active: ['t3', 'wt', 'diff'], note: 'Full access solo en entornos desechables.', metrics: [['hilos', '3'], ['ramas', '3'], ['PR', '0']] },
      { title: 'Revisar y publicar', desc: 'Revisas el diff por turno y haces commit, push y PR con un botón. Un segundo agente puede revisar el primero.', active: ['cli', 't3', 'wt', 'diff', 'pr'], metrics: [['hilos', '3'], ['ramas', '3'], ['PR', '3']] }
    ],
    learn: ['Qué es un control plane', 'Por qué un worktree por hilo', 'Cómo funcionan los permisos', 'Cómo cerrar con un PR']
  },
  {
    id: 'lab-huang', track: 'ai', title: 'Aprender con IA hasta entender',
    subtitle: 'El bucle de preguntas, contraste y verificación que describe Jensen Huang.',
    level: 'Principiante', minutes: 8,
    nodes: [
      { id: 'ask', label: 'no sé preguntar', x: 110, y: 210, tone: 'green' },
      { id: 'refine', label: 'IA afina', x: 290, y: 120, tone: 'violet' },
      { id: 'answer', label: 'respuesta', x: 470, y: 210, tone: 'plain' },
      { id: 'crit', label: 'otra IA', x: 650, y: 120, tone: 'orange' },
      { id: 'source', label: 'fuente', x: 470, y: 340, tone: 'mint' }
    ],
    edges: [{ from: 'ask', to: 'refine' }, { from: 'refine', to: 'answer' }, { from: 'answer', to: 'crit' }, { from: 'answer', to: 'source' }, { from: 'crit', to: 'source' }],
    steps: [
      { title: 'No sabes preguntar', desc: 'En un tema nuevo el primer obstáculo es formular la pregunta. Empieza por ahí.', active: ['ask'], metrics: [['preguntas', '0'], ['fuentes', '0'], ['certeza', '—']] },
      { title: 'Pide ayuda para preguntar', desc: 'Pregunta a la IA cómo estructurar la pregunta. Luego revísala: no delegues tus prioridades.', active: ['ask', 'refine'], note: '¿Barato o rápido? Eso lo decides tú.', metrics: [['preguntas', '1'], ['fuentes', '0'], ['certeza', 'baja']] },
      { title: 'Explicación simple', desc: 'Pide que te lo explique como si no supieras nada. Lo que no entiendas se convierte en la siguiente pregunta.', active: ['refine', 'answer'], metrics: [['preguntas', '4'], ['fuentes', '0'], ['certeza', 'media']] },
      { title: 'Contrasta', desc: 'Pide a otra IA que critique la respuesta y compara ambas. Las discrepancias son las preguntas que faltaban.', active: ['answer', 'crit'], metrics: [['preguntas', '6'], ['fuentes', '1'], ['certeza', 'media']] },
      { title: 'Vuelve a la fuente', desc: 'Para fechas, cifras y citas, abre el documento original. La IA es un mapa, no el territorio.', active: ['ask', 'refine', 'answer', 'crit', 'source'], note: 'La ventaja no es usar IA: es entender mejor que quien la delega.', metrics: [['preguntas', '8'], ['fuentes', '3'], ['certeza', 'alta']] }
    ],
    learn: ['Preguntar cómo preguntar', 'Bucle recursivo', 'Contrastar dos respuestas', 'Verificar en la fuente']
  },
  {
    id: 'lab-servo', track: 'robotica', title: 'Cómo funciona un servo RC',
    subtitle: 'Del pulso PWM de 50 Hz al eje que sostiene su posición gracias a la realimentación.',
    level: 'Intermedio', minutes: 11,
    nodes: [
      { id: 'pwm', label: 'PWM 50 Hz', x: 100, y: 220, tone: 'green' },
      { id: 'cmp', label: 'comparador', x: 300, y: 130, tone: 'plain' },
      { id: 'motor', label: 'motor DC', x: 480, y: 220, tone: 'orange' },
      { id: 'gear', label: 'engranajes', x: 680, y: 220, tone: 'violet' },
      { id: 'pot', label: 'potenciómetro', x: 480, y: 350, tone: 'mint' }
    ],
    edges: [
      { from: 'pwm', to: 'cmp', label: '1–2 ms' },
      { from: 'cmp', to: 'motor', label: 'error' },
      { from: 'motor', to: 'gear' },
      { from: 'gear', to: 'pot', label: 'eje' },
      { from: 'pot', to: 'cmp', label: 'realimentación' }
    ],
    steps: [
      { title: 'El pulso de control', desc: 'El servo espera un pulso de 1 a 2 ms cada 20 ms (50 Hz). El ancho codifica el ángulo: 1 ms es 0°, 1.5 ms es el centro y 2 ms son 180°.', active: ['pwm'], metrics: [['f', '50 Hz'], ['pulso', '1.5 ms'], ['ángulo', '90°']] },
      { title: 'La electrónica compara', desc: 'El circuito interno mide el ancho del pulso y lo compara con la posición que reporta el potenciómetro acoplado al eje. No lee un ángulo absoluto: calcula una diferencia.', active: ['pwm', 'cmp', 'pot'], note: 'El servo no recibe "ve a 120°", sino "quédate donde indique este pulso".', metrics: [['setpoint', '90°'], ['medido', '60°'], ['error', '+30°']] },
      { title: 'El error mueve el motor', desc: 'Si el error es positivo, el comparador aplica tensión al motor DC en un sentido; si es negativo, en el contrario. Cuanto mayor el error, más rápido gira.', active: ['pwm', 'cmp', 'motor', 'pot'], metrics: [['error', '+30°'], ['V motor', '6 V'], ['rpm', '120']] },
      { title: 'Engranajes y par', desc: 'El motor gira rápido pero con poco par. Una caja reductora, por ejemplo 1:50, baja la velocidad y multiplica el par para poder mover un brazo con carga.', active: ['cmp', 'motor', 'gear'], note: 'El juego mecánico (backlash) de los engranajes limita la precisión final.', metrics: [['ratio', '1:50'], ['rpm salida', '2.4'], ['par', '0.8 N·m']] },
      { title: 'El lazo se cierra', desc: 'El potenciómetro gira con el eje de salida y devuelve la posición real al comparador. Cuando el error es casi cero el motor se detiene y el servo mantiene el ángulo.', active: ['pwm', 'cmp', 'motor', 'gear', 'pot'], note: 'Si el servo zumba, suele ser un pulso fuera de rango o una carga excesiva.', metrics: [['error', '0.5°'], ['posición', '120°'], ['I reposo', '0.15 A']] }
    ],
    learn: ['Qué codifica el pulso de 1–2 ms', 'Cómo el potenciómetro cierra el lazo', 'Por qué se usan engranajes reductores', 'Qué es el juego o backlash']
  },
  {
    id: 'lab-imu', track: 'robotica', title: 'Por qué deriva una IMU',
    subtitle: 'Giroscopio, acelerómetro y filtro complementario: cómo se obtiene un ángulo que no se aleja.',
    level: 'Intermedio', minutes: 12,
    nodes: [
      { id: 'gyro', label: 'giroscopio', x: 100, y: 130, tone: 'green' },
      { id: 'acc', label: 'acelerómetro', x: 100, y: 320, tone: 'mint' },
      { id: 'integ', label: 'integrador', x: 320, y: 130, tone: 'orange' },
      { id: 'fuse', label: 'filtro compl.', x: 520, y: 225, tone: 'plain' },
      { id: 'angle', label: 'ángulo limpio', x: 700, y: 225, tone: 'violet' }
    ],
    edges: [
      { from: 'gyro', to: 'integ', label: 'ω' },
      { from: 'integ', to: 'fuse', label: 'rápido' },
      { from: 'acc', to: 'fuse', label: 'lento' },
      { from: 'fuse', to: 'angle' }
    ],
    steps: [
      { title: 'Dos sensores distintos', desc: 'El giroscopio mide velocidad angular ω en grados por segundo. El acelerómetro mide aceleración, incluida la gravedad, y permite inferir la inclinación cuando el robot está quieto.', active: ['gyro', 'acc'], metrics: [['ω', '0 °/s'], ['deriva', '0°'], ['ángulo', '—']] },
      { title: 'Integrar el giroscopio', desc: 'El ángulo es la integral de la velocidad angular. Un sesgo de solo 0.5 °/s se convierte en 30° de error en 60 segundos, aunque el robot no se mueva.', active: ['gyro', 'integ'], note: 'El error del giroscopio crece con el tiempo porque se integra.', metrics: [['ω', '30 °/s'], ['sesgo', '0.5 °/s'], ['deriva 60 s', '30°']] },
      { title: 'El acelerómetro no deriva', desc: 'Con el robot detenido, la gravedad da la inclinación sin acumular error. Pero vibra con los motores y se engaña si el robot acelera: por eso no sirve para movimientos rápidos.', active: ['acc'], metrics: [['inclinación', '12°'], ['ruido', '±3°'], ['deriva', '0°']] },
      { title: 'Filtro complementario', desc: 'Se mezclan las dos señales: θ = 0.98·(θ + ω·dt) + 0.02·θ_acc. El giroscopio manda a corto plazo y el acelerómetro corrige el sesgo poco a poco.', active: ['gyro', 'integ', 'acc', 'fuse'], note: 'Subir α da más respuesta rápida pero corrige peor el sesgo.', metrics: [['α', '0.98'], ['dt', '10 ms'], ['deriva', '0.4°']] },
      { title: 'Una estimación estable', desc: 'La salida sigue giros bruscos sin vibrar y no se aleja después de varios minutos. Es la señal que luego consume el control de actitud del robot.', active: ['gyro', 'acc', 'integ', 'fuse', 'angle'], metrics: [['ángulo', '12.3°'], ['ruido', '±0.3°'], ['deriva 60 s', '0.5°']] }
    ],
    learn: ['Por qué integrar genera deriva', 'Qué aporta el acelerómetro', 'Cómo se formula el filtro complementario', 'Por qué conviene combinar ambos']
  },
  {
    id: 'lab-ros', track: 'robotica', title: 'El grafo de ROS 2',
    subtitle: 'Un nodo publica en un topic, otro suscribe; el service responde y la action informa del progreso.',
    level: 'Intermedio', minutes: 11,
    nodes: [
      { id: 'sensor', label: 'nodo sensor', x: 100, y: 150, tone: 'green' },
      { id: 'topic', label: 'topic /scan', x: 300, y: 150, tone: 'plain' },
      { id: 'nav', label: 'nodo nav', x: 500, y: 150, tone: 'violet' },
      { id: 'srv', label: 'service', x: 300, y: 330, tone: 'orange' },
      { id: 'act', label: 'action', x: 500, y: 330, tone: 'mint' }
    ],
    edges: [
      { from: 'sensor', to: 'topic', label: 'publish' },
      { from: 'topic', to: 'nav', label: 'subscribe' },
      { from: 'nav', to: 'srv', label: 'request' },
      { from: 'srv', to: 'nav', label: 'reply' },
      { from: 'nav', to: 'act', label: 'goal' },
      { from: 'act', to: 'nav', label: 'feedback' }
    ],
    steps: [
      { title: 'Nodos y descubrimiento', desc: 'Cada nodo es un proceso independiente. ROS 2 usa DDS para que los nodos se descubran entre sí y formen un grafo de comunicación sin un maestro central.', active: ['sensor', 'nav'], metrics: [['nodos', '2'], ['topics', '0'], ['servicios', '0']] },
      { title: 'Publicar en un topic', desc: 'El nodo sensor publica mensajes en /scan a 10 Hz. Es un flujo continuo y unidireccional: nadie confirma la recepción y cualquiera puede escuchar.', active: ['sensor', 'topic'], metrics: [['nodos', '2'], ['topics', '1'], ['frecuencia', '10 Hz']] },
      { title: 'Suscribirse', desc: 'El nodo de navegación recibe cada mensaje publicado. Un topic es many-to-many y asíncrono: el publicador no sabe cuántos suscriptores hay.', active: ['topic', 'nav'], note: 'El dato se descarta si el suscriptor no puede seguir el ritmo, salvo que uses QoS fiable.', metrics: [['topics', '1'], ['suscriptores', '2'], ['latencia', '12 ms']] },
      { title: 'Service: petición y respuesta', desc: 'Para una tarea puntual, como reiniciar el mapa, el cliente envía un request y espera un reply. Es síncrono: el cliente se bloquea hasta recibir la respuesta.', active: ['nav', 'srv'], note: 'Usa services solo para operaciones cortas; si tarda, mejor una action.', metrics: [['servicios', '1'], ['request', '1'], ['reply', '45 ms']] },
      { title: 'Action: objetivos largos', desc: 'Ir a una meta tarda segundos. La action recibe un goal, devuelve feedback periódico y un result final, y puede cancelarse a mitad de camino.', active: ['sensor', 'topic', 'nav', 'srv', 'act'], metrics: [['actions', '1'], ['feedback', '10 Hz'], ['result', 'éxito']] }
    ],
    learn: ['Qué es el grafo de nodos ROS 2', 'Diferencia entre topic y service', 'Cuándo usar una action', 'Por qué DDS descubre los nodos']
  },
  {
    id: 'lab-nav', track: 'robotica', title: 'De la nube de puntos a la navegación',
    subtitle: 'Lidar, costmap, planner y controller: la cadena que lleva de los puntos brutos a la velocidad de las ruedas.',
    level: 'Avanzado', minutes: 14,
    nodes: [
      { id: 'lidar', label: 'lidar', x: 100, y: 150, tone: 'orange' },
      { id: 'cloud', label: 'nube puntos', x: 300, y: 150, tone: 'plain' },
      { id: 'cost', label: 'costmap', x: 500, y: 150, tone: 'green' },
      { id: 'plan', label: 'planner', x: 300, y: 330, tone: 'violet' },
      { id: 'ctrl', label: 'controller', x: 500, y: 330, tone: 'mint' }
    ],
    edges: [
      { from: 'lidar', to: 'cloud', label: 'XYZ' },
      { from: 'cloud', to: 'cost', label: 'obstáculos' },
      { from: 'cost', to: 'plan', label: 'rejilla' },
      { from: 'plan', to: 'ctrl', label: 'ruta' },
      { from: 'ctrl', to: 'cost', label: 'odometría' }
    ],
    steps: [
      { title: 'El lidar barre', desc: 'Cada rotación entrega hasta 30 000 medidas de distancia con su ángulo correspondiente. Todavía no hay mapa: solo impulsos de luz que vuelven.', active: ['lidar'], metrics: [['puntos', '0'], ['coste', '—'], ['vel', '0 m/s']] },
      { title: 'Nube de puntos', desc: 'Cada medida se convierte en una coordenada (x, y, z) en el marco del sensor. Se filtran el suelo y el ruido antes de seguir.', active: ['lidar', 'cloud'], note: 'Sin filtrar el suelo, el costmap interpreta que casi todo está ocupado.', metrics: [['puntos', '30 k'], ['tras filtrar', '18 k'], ['vel', '0 m/s']] },
      { title: 'Construir el costmap', desc: 'Los puntos se proyectan sobre una rejilla de 5 cm. Cada celda tiene un coste: 0 si está libre, alto cerca de un obstáculo e infinito si está ocupada.', active: ['cloud', 'cost'], metrics: [['celdas', '250×250'], ['resolución', '5 cm'], ['inflación', '0.3 m']] },
      { title: 'Planificar la ruta', desc: 'El planner global busca, con A* o Dijkstra, el camino de menor coste desde la pose actual hasta la meta. La inflación de obstáculos deja margen de seguridad.', active: ['cost', 'plan'], note: 'Separa planner global (ruta larga) de controller local (reacción rápida).', metrics: [['longitud', '24 m'], ['coste', '142'], ['nodos', '1.8 k']] },
      { title: 'Seguir la ruta', desc: 'El controller local genera velocidades lineal y angular que persiguen la ruta esquivando obstáculos dinámicos. La odometría realimenta el costmap con el movimiento real.', active: ['lidar', 'cloud', 'cost', 'plan', 'ctrl'], metrics: [['v lineal', '0.4 m/s'], ['v angular', '0.2 rad/s'], ['meta', 'alcanzada']] }
    ],
    learn: ['Cómo se forma una nube de puntos', 'Qué es un costmap y su inflación', 'Diferencia entre planner y controller', 'Por qué la odometría realimenta el mapa']
  },
  {
    id: 'lab-attention', track: 'ai', title: 'Dentro de self-attention',
    subtitle: 'De un token a sus proyecciones Q, K y V, y de ahí a los pesos que construyen el contexto.',
    level: 'Avanzado', minutes: 13,
    nodes: [
      { id: 'tok', label: 'tokens', x: 100, y: 230, tone: 'green' },
      { id: 'qkv', label: 'Q · K · V', x: 290, y: 230, tone: 'plain' },
      { id: 'scores', label: 'scores QK', x: 480, y: 130, tone: 'violet' },
      { id: 'soft', label: 'softmax', x: 680, y: 230, tone: 'orange' },
      { id: 'ctx', label: 'contexto', x: 480, y: 340, tone: 'mint' }
    ],
    edges: [
      { from: 'tok', to: 'qkv', label: 'X·W' },
      { from: 'qkv', to: 'scores', label: 'Q·Kᵀ' },
      { from: 'scores', to: 'soft', label: '/√d' },
      { from: 'soft', to: 'ctx', label: 'pesos' },
      { from: 'qkv', to: 'ctx', label: 'V' }
    ],
    steps: [
      { title: 'Los tokens entran', desc: 'Cada token es un vector de dimensión d_model, por ejemplo 4096. La atención no trabaja directamente con ese vector, sino con tres vistas aprendidas de él.', active: ['tok'], metrics: [['tokens', '8'], ['d_model', '4096'], ['cabezas', '32']] },
      { title: 'Proyecciones Q, K y V', desc: 'Se multiplica la matriz X por tres matrices aprendidas W_Q, W_K y W_V. Q es la consulta, K la clave que se compara y V el valor que se acabará mezclando.', active: ['tok', 'qkv'], note: 'Con 32 cabezas, la dimensión por cabeza es 4096/32 = 128.', metrics: [['tokens', '8'], ['d_k', '128'], ['cabezas', '32']] },
      { title: 'Puntuaciones', desc: 'Se calcula score = Q·Kᵀ / √d_k. Dividir por √128, unos 11.3, evita que los productos sean enormes y los gradientes se desvanezcan tras el softmax.', active: ['qkv', 'scores'], metrics: [['escala', '11.3'], ['matriz', '8×8'], ['max score', '3.4']] },
      { title: 'Softmax y pesos', desc: 'El softmax convierte cada fila de puntuaciones en probabilidades que suman 1. Así cada token decide cuánto atender a cada uno de los demás.', active: ['scores', 'soft'], note: 'En un modelo causal se enmascaran las posiciones futuras con −∞.', metrics: [['suma pesos', '1.0'], ['peso máx', '0.42'], ['máscara', 'causal']] },
      { title: 'El vector de contexto', desc: 'Se combina V con esos pesos: out = Σ wᵢ·Vᵢ. Cada token sale con información mezclada de los demás, y eso es lo que entra en la siguiente capa.', active: ['tok', 'qkv', 'scores', 'soft', 'ctx'], metrics: [['tokens', '8'], ['d_out', '4096'], ['salida', 'contextual']] }
    ],
    learn: ['Qué significan Q, K y V', 'Por qué se escala por √d_k', 'Qué hace el softmax', 'Cómo se forma el vector de contexto']
  },
  {
    id: 'lab-backprop', track: 'ai', title: 'Cómo viaja un gradiente',
    subtitle: 'Forward, loss, backward y update: el recorrido completo de una iteración de entrenamiento.',
    level: 'Intermedio', minutes: 12,
    nodes: [
      { id: 'x', label: 'entrada x', x: 100, y: 220, tone: 'green' },
      { id: 'w', label: 'pesos W', x: 290, y: 220, tone: 'plain' },
      { id: 'loss', label: 'loss L', x: 480, y: 130, tone: 'orange' },
      { id: 'grad', label: '∇W', x: 680, y: 220, tone: 'violet' },
      { id: 'opt', label: 'optimizer', x: 480, y: 340, tone: 'mint' }
    ],
    edges: [
      { from: 'x', to: 'w', label: 'forward' },
      { from: 'w', to: 'loss', label: 'ŷ' },
      { from: 'loss', to: 'grad', label: '∂L/∂W' },
      { from: 'grad', to: 'opt', label: 'gradiente' },
      { from: 'opt', to: 'w', label: 'update' }
    ],
    steps: [
      { title: 'Forward pass', desc: 'La entrada atraviesa las capas: ŷ = f(x; W). Durante este paso se guarda cada activación intermedia porque el backward las necesitará.', active: ['x', 'w'], metrics: [['capas', '4'], ['ŷ', '0.31'], ['loss', '—']] },
      { title: 'Calcular la loss', desc: 'La función de pérdida compara la predicción con el valor real, por ejemplo L = (ŷ − y)². Es un escalar: un solo número que queremos minimizar.', active: ['w', 'loss'], note: 'Todo el entrenamiento se reduce a hacer que ese número baje.', metrics: [['y', '1.00'], ['ŷ', '0.31'], ['L', '0.48']] },
      { title: 'Backward pass', desc: 'Con la regla de la cadena se propaga ∂L/∂W desde la salida hacia atrás, capa por capa. Cada capa reutiliza las activaciones guardadas en el forward.', active: ['loss', 'grad'], metrics: [['∂L/∂ŷ', '−1.38'], ['∂L/∂W', '0.21'], ['capas', '4']] },
      { title: 'El optimizador', desc: 'SGD o Adam mueve los pesos en dirección opuesta al gradiente: W ← W − η·∇W. La tasa de aprendizaje η fija el tamaño del paso.', active: ['grad', 'opt'], note: 'Si η es demasiado alta, la loss rebota; si es baja, el aprendizaje es lento.', metrics: [['η', '1e−3'], ['|∇W|', '0.21'], ['paso', '0.00021']] },
      { title: 'La siguiente iteración', desc: 'Con los pesos actualizados, un nuevo forward produce una predicción más cercana al valor real y la loss baja. El ciclo se repite miles de veces.', active: ['x', 'w', 'loss', 'grad', 'opt'], metrics: [['iteración', '1'], ['L', '0.48'], ['L siguiente', '0.41']] }
    ],
    learn: ['Qué es el forward pass', 'Por qué la loss es un escalar', 'Cómo funciona la regla de la cadena', 'Qué hace el optimizador']
  },
  {
    id: 'lab-kv', track: 'ai', title: 'KV cache y generación rápida',
    subtitle: 'Por qué guardar K y V durante el prefill convierte la decodificación en un paso constante por token.',
    level: 'Avanzado', minutes: 12,
    nodes: [
      { id: 'prompt', label: 'prompt', x: 100, y: 220, tone: 'green' },
      { id: 'prefill', label: 'prefill', x: 290, y: 130, tone: 'plain' },
      { id: 'cache', label: 'KV cache', x: 480, y: 220, tone: 'violet' },
      { id: 'decode', label: 'decode', x: 680, y: 220, tone: 'orange' },
      { id: 'tok', label: 'nuevo token', x: 480, y: 340, tone: 'mint' }
    ],
    edges: [
      { from: 'prompt', to: 'prefill', label: 'n tokens' },
      { from: 'prefill', to: 'cache', label: 'K,V' },
      { from: 'cache', to: 'decode', label: 'atención' },
      { from: 'decode', to: 'tok', label: 'softmax' },
      { from: 'tok', to: 'cache', label: 'append K,V' },
      { from: 'tok', to: 'decode', label: 'siguiente' }
    ],
    steps: [
      { title: 'Prefill del prompt', desc: 'Los n tokens del prompt se procesan de una vez. En cada capa se calculan las matrices K y V de todas las posiciones y se guardan en la caché.', active: ['prompt', 'prefill'], metrics: [['tokens', '128'], ['caché', '0 MB'], ['TTFT', '—']] },
      { title: 'Cuánto ocupa la caché', desc: 'Se guarda K y V por capa, token y cabeza. Con 32 capas, 4096 dimensiones y 128 tokens: 2·32·128·4096·2 bytes, unos 67 MB.', active: ['prefill', 'cache'], note: 'La caché crece linealmente con el contexto y se reparte entre las réplicas.', metrics: [['tokens', '128'], ['caché', '67 MB'], ['capas', '32']] },
      { title: 'Decodificar un token', desc: 'Para generar el token siguiente solo se calcula Q del último token. Las K y V del historial se leen de la caché, así que no se repite el trabajo anterior.', active: ['cache', 'decode'], metrics: [['tokens', '129'], ['caché', '67 MB'], ['paso', '8 ms']] },
      { title: 'Añadir el nuevo par', desc: 'El token recién generado produce su propia K y V, que se concatenan al final de la caché. Con eso el siguiente paso ya tiene todo el historial disponible.', active: ['cache', 'decode', 'tok'], metrics: [['tokens', '130'], ['caché', '68 MB'], ['paso', '8 ms']] },
      { title: 'Por qué acelera', desc: 'Sin caché habría que recalcular la atención de todo el historial en cada token, un coste cuadrático. Con caché cada paso es lineal en la longitud actual.', active: ['prompt', 'prefill', 'cache', 'decode', 'tok'], note: 'Por eso un contexto de 128 k tokens dispara el consumo de VRAM.', metrics: [['tokens', '256'], ['caché', '134 MB'], ['ahorro', '~128×']] }
    ],
    learn: ['Qué guarda exactamente la KV cache', 'Cómo se calcula su tamaño', 'Prefill frente a decode', 'Por qué acelera la generación']
  },
  {
    id: 'lab-eval', track: 'ai', title: 'Cómo evaluar un sistema LLM',
    subtitle: 'Dataset, predicción, métrica, regresión y decisión: el ciclo que decide si un cambio se despliega.',
    level: 'Intermedio', minutes: 10,
    nodes: [
      { id: 'data', label: 'dataset', x: 100, y: 220, tone: 'green' },
      { id: 'pred', label: 'predicción', x: 290, y: 220, tone: 'plain' },
      { id: 'metric', label: 'métrica', x: 480, y: 130, tone: 'violet' },
      { id: 'reg', label: 'regresión', x: 680, y: 220, tone: 'orange' },
      { id: 'dec', label: 'decisión', x: 480, y: 340, tone: 'mint' }
    ],
    edges: [
      { from: 'data', to: 'pred', label: 'casos' },
      { from: 'pred', to: 'metric', label: 'respuestas' },
      { from: 'metric', to: 'reg', label: 'comparar' },
      { from: 'reg', to: 'dec', label: 'delta' },
      { from: 'dec', to: 'data', label: 'nuevo ciclo' }
    ],
    steps: [
      { title: 'Dataset de evaluación', desc: 'Se prepara un conjunto de casos con entrada y salida esperada. Debe parecerse al tráfico real y tener una versión congelada para poder comparar resultados.', active: ['data'], metrics: [['casos', '0'], ['accuracy', '—'], ['versión', '—']] },
      { title: 'Generar predicciones', desc: 'El sistema responde cada caso con una configuración fija: modelo, prompt y temperatura 0. Así dos ejecuciones producen el mismo resultado.', active: ['data', 'pred'], note: 'Sin temperatura 0 o semilla fija, una diferencia puede ser solo ruido.', metrics: [['casos', '250'], ['temperatura', '0'], ['latencia', '420 ms']] },
      { title: 'Calcular la métrica', desc: 'Se comparan predicciones con las referencias. Según la tarea se usa exact match, F1 o ROUGE; cuando no hay una única respuesta válida, un juez LLM con rúbrica.', active: ['pred', 'metric'], metrics: [['casos', '250'], ['accuracy', '0.86'], ['F1', '0.83']] },
      { title: 'Detectar regresiones', desc: 'Se compara con la versión anterior. Una caída de dos puntos en accuracy puede ser inaceptable aunque F1 suba. Hay que mirar también por segmentos.', active: ['metric', 'reg'], note: 'El promedio esconde fallos en minorías: evalúa cada segmento por separado.', metrics: [['accuracy', '0.86'], ['Δ vs v1', '−0.02'], ['segmentos', '6']] },
      { title: 'Decidir y repetir', desc: 'Con umbrales definidos de antemano se aprueba o bloquea el despliegue. Si hay regresión, se investiga la causa, se ajusta y se vuelve a medir con el mismo dataset.', active: ['data', 'pred', 'metric', 'reg', 'dec'], metrics: [['umbral', '0.88'], ['decisión', 'bloquear'], ['versión', 'v2.1']] }
    ],
    learn: ['Por qué fijar el dataset', 'Cómo elegir la métrica', 'Qué es una regresión', 'Cómo decidir el despliegue']
  }
];

export const findLab = (id: string) => labs.find(l => l.id === id);
