import { leccion as L, modulo as M, err, q, p, apunte, nota, aviso, codigo, diagrama, tabla, lista, pasos, formula, widget, enlace } from '../helpers';
import type { Module } from '../../types';

export const roboticsPart1: Module[] = [

M('b0', 'Orientación y supervivencia', 'Por qué robótica, qué es el trabajo y cómo usar esta academia', [
  L({
    id: 'r0-1', title: 'Por qué robótica (y no solo IA)', min: 10, level: 'inicial',
    objectives: ['Entender la ventaja estructural de la robótica frente a la IA pura', 'Situarse en el mapa del campo'],
    blocks: [
      p('La robótica es el cruce de electrónica, mecánica, control, percepción y software. Eso la hace difícil de aprender... y difícil de copiar. Un modelo de IA se clona en un fin de semana; un robot que camina, no.'),
      apunte('El argumento estructural', 'Los modelos ya funcionan; lo que falta es gente capaz de ponerlos en un cuerpo. El mundo físico no se puede scrapear: alguien tiene que mover una máquina real para generar datos. Y no hay respuesta en Stack Overflow para explicar por qué tu pinza se resbala.'),
      p('Esto no significa que la IA sea mala. Significa que la combinación "entiendo el hardware y además sé entrenar un modelo" es rara y valiosa. Por eso este roadmap existe: para que puedas llegar a la robótica desde cero y, más adelante, conectarla con IA.'),
      tabla(['Habilidad', 'Se puede falsear', 'Se puede clonar en un fin de semana'], [
        ['Prompt engineering', 'Algo', 'Sí'], ['Fine-tuning de un LLM', 'Algo', 'Sí'],
        ['Hacer que un motor gire con precisión', 'No', 'No'], ['Hacer que un brazo aprenda una tarea', 'No', 'No']
      ]),
      nota('A lo largo de la academia verás el icono de "apunte" para ideas clave, el de "nota al margen" para matices y el de "aviso" para cosas que pueden quemar hardware o tiempo.'),
      enlace('https://x.com/deronin_/status/2095180126359105955', 'Guía original de Ronin (@deronin_)', 'Fuente de la que se adapta el roadmap de 6 meses.')
    ],
    errors: [err('"Ya sé programar, esto será rápido"', 'Subestimar la parte física: un cable suelto no tiene stack trace.', 'Acepta que depurarás hardware con un multímetro, no con un debugger.')],
    practice: { task: 'Escribe en tu cuaderno tres razones por las que un robot que se cae no se puede delegar a un subagente. Luego explica una en voz alta sin mirar.', success: ['Mencionas el mundo físico y los datos', 'Mencionas que nadie clona tu robot', 'Lo dices con tus palabras'] },
    quiz: [q('¿Cuál es la principal ventaja "estructural" de la robótica según esta lección?', ['Que usa menos código', 'Que el mundo físico no se puede scrapear y requiere hardware real', 'Que no necesita Python', 'Que todos los trabajos son remotos'], 1, 'La barrera de entrada física es la que hace que el conocimiento sea difícil de clonar.')]
  }),
  L({
    id: 'r0-2', title: 'Qué hace realmente un ingeniero de robótica', min: 12,
    objectives: ['Conocer las especialidades y sus fronteras', 'Entender qué se mide en el trabajo real'],
    blocks: [
      p('Un ingeniero de robótica no "hace robots" en abstracto. Resuelve una de estas capas, y debe ser lo suficientemente literato en las demás para comunicarse.'),
      tabla(['Especialidad', 'Pregunta que responde', 'Herramientas típicas'], [
        ['Percepción / visión', '¿Qué hay y dónde está?', 'OpenCV, PCL, YOLO, cámaras, lidar'],
        ['Control y estimación', '¿Cómo mantengo el estado y la estabilidad?', 'PID, Kalman, LQR, MPC'],
        ['Planificación y manipulación', '¿Cómo llego y cómo agarro?', 'MoveIt 2, A*, RRT, IK'],
        ['Robot learning', '¿Cómo aprende la tarea en vez de programarla?', 'LeRobot, ACT, RL, Isaac Lab'],
        ['Embedded / firmware', '¿Cómo muevo el hardware en tiempo real?', 'C++, ESP-IDF, RTOS, PWM'],
        ['Simulación', '¿Cómo entreno y valido sin romper nada?', 'Gazebo, MuJoCo, Isaac Sim'],
        ['Sistemas e integración', '¿Cómo funciona todo junto?', 'ROS 2, Docker, CI, telemetría']
      ]),
      diagrama('arquitectura', 'La separación real entre computadora de alto nivel y microcontrolador de tiempo real.'),
      apunte('Lo que buscan las ofertas', 'C++ y Python, hardware real, profundidad en algo + literals en el resto, y debugging como habilidad propia. No suele aparecer un título universitario concreto.'),
      nota('Un término de la tabla: PWM (modulación por ancho de pulso) consiste en encender y apagar un pin muy rápido para simular un voltaje intermedio; lo veremos en detalle en r3-2.'),
      p('El error clásico es intentar dominar las siete capas a la vez. La estrategia correcta es volverte profundo en una y competente en el resto. Este roadmap te da esa base amplia y te deja elegir al final.'),
      nota('Si vienes de ser SWE, tu ventaja está en sistemas, tooling y software quality. Tu deuda está en electrónica y control. Por eso el track de robótica empieza en el multímetro, no en ROS.')
    ],
    practice: { task: 'Elige un proyecto real (por ejemplo un seguidor de línea) y escribe, para cada una de las 7 capas de la tabla, qué pregunta concreta responde y qué medirías para validarla. Marca cuál sería tu capa de profundidad y cuáles serían de "literato".', success: ['Cubres las 7 capas con una pregunta y una métrica cada una', 'Identificas tu capa de profundidad y justificas la elección', 'Nombras una herramienta real de cada capa'] },
    quiz: [q('¿Qué combinación de habilidades aparece de forma consistente en ofertas de robótica?', ['Solo C++', 'C++ y Python + hardware real + debugging', 'Solo machine learning', 'Un doctorado específico'], 1, 'La profundidad más la literatura y el hardware real son el denominador común.')]
  }),
  L({
    id: 'r0-3', title: 'Cómo usar esta academia', min: 8,
    objectives: ['Planificar el estudio', 'Saber qué registrar en cada proyecto'],
    blocks: [
      p('Cada lección tiene: objetivo, explicación sencilla, profundización técnica, un ejemplo visual, apuntes, errores comunes, una práctica con criterios de éxito y (casi siempre) un quiz corto.'),
      pasos([
        { title: 'Lee con calma', text: '2–3 horas al día es la carga de diseño. No intentes devorar un bloque en una sesión.' },
        { title: 'Haz la práctica', text: 'Un portafolio de robótica se mide en cosas que se movieron, no en cursos terminados.' },
        { title: 'Escribe la nota', text: 'Cada lección tiene un editor de notas. Escribe qué falló y cómo lo arreglaste.' },
        { title: 'Marca el progreso', text: 'La app guarda tu avance y lo puedes exportar a JSON para llevarlo a otro dispositivo.' }
      ]),
      aviso('No copies proyectos de internet sin entenderlos. En una entrevista te preguntarán por tu código, no por el tutorial.'),
      widget('bom'),
      apunte('Regla del README', 'Todo proyecto lleva: vídeo arriba, diagrama de cableado o arquitectura, números medidos de verdad y una sección que se llame "qué se rompió y cómo lo arreglé". Esa última sección es la que no se puede falsificar.')
    ],
    practice: { task: 'Planifica tus próximos 7 días con bloques de 2–3 horas y una lección asignada a cada bloque. Escribe el README de tu primer proyecto con vídeo, diagrama, tres números medidos de verdad y la sección "qué se rompió y cómo lo arreglé". Al final de la semana exporta tu progreso a JSON.', success: ['Tienes 7 bloques fechados con lección concreta', 'El README incluye las 4 secciones y números reales medidos', 'El JSON exportado contiene tu avance'] },
    quiz: [q('Según la "regla del README", ¿qué sección es imposible de falsificar en un portafolio de robótica?', ['La lista de cursos terminados', 'El vídeo del robot funcionando', '"Qué se rompió y cómo lo arreglé"', 'La foto del cableado'], 2, 'Cualquiera puede copiar un vídeo o un diagrama; solo quien depuró de verdad puede contar qué falló y cómo lo solucionó.')]
  })
  ]),

  // -------------------- BLOQUE 1: ELECTRÓNICA --------------------
  M('b1', 'Electrónica desde cero', 'Del voltaje al esquemático, pasando por el multímetro y el soldador', [
    L({
      id: 'r1-1', title: 'Voltaje, corriente, resistencia y ley de Ohm', min: 16,
      objectives: ['Definir V, I y R con analogías correctas', 'Calcular corriente en circuitos simples'],
      blocks: [
        p('Piensa en un circuito como en agua por una tubería. El **voltaje** es la presión, la **corriente** es el caudal y la **resistencia** es lo estrecha que es la tubería.'),
        formula('V = I · R   |   I = V / R   |   R = V / I', 'V en voltios (V), I en amperios (A), R en ohmios (Ω).'),
        diagrama('ley_ohm', 'El triángulo de Ohm: tapa lo que buscas y lee la operación.'),
        p('Ejemplo: un LED con Vf ≈ 2 V (la "caída de tensión" del LED: el voltaje que consume al encender, ~2 V) alimentado desde 5 V y con una resistencia de 330 Ω. La corriente es (5−2)/330 ≈ 9 mA. Suficiente para brillar, seguro para el pin.'),
        widget('ohm'),
        apunte('La analogía tiene un límite', 'En electricidad los electrones no se "consumen" como el agua: la corriente es igual en todos los puntos de un circuito en serie. Lo que se disipa es energía, en forma de calor.'),
        tabla(['Magnitud', 'Símbolo', 'Unidad', 'Se mide con'], [['Voltaje', 'V', 'voltio', 'multímetro en paralelo'], ['Corriente', 'I', 'amperio', 'multímetro en serie'], ['Resistencia', 'R', 'ohmio', 'multímetro con circuito apagado'], ['Potencia', 'P', 'vatio', 'P = V·I']]),
        lista(['Un pin de GPIO da ~20 mA máximo: nunca alimentes un motor directamente.', 'La potencia disipada en una resistencia es P = I²·R; respeta su potencia (1/4 W típico).'])
      ],
      errors: [
        err('El LED no enciende y huele a quemado', 'Pusiste el LED sin resistencia', 'Siempre calcula R = (Vs − Vf)/If antes de conectar.') ,
        err('La resistencia se calienta mucho', 'Disipas más vatios de los que soporta', 'Sube la potencia nominal de la resistencia o baja la corriente.')
      ],
      practice: { task: 'Calcula la resistencia para un LED rojo (Vf=1.8 V) a 10 mA desde 3.3 V. Verifícala en la calculadora de la lección.', success: ['R ≈ 150 Ω', 'Sabes por qué se resta Vf', 'Compruebas la potencia'] },
      quiz: [q('Con 5 V y una resistencia de 1 kΩ, ¿cuánta corriente circula?', ['5 A', '5 mA', '1 mA', '500 mA'], 1, 'I = V/R = 5/1000 = 0.005 A = 5 mA.')]
    }),
    L({
      id: 'r1-2', title: 'Kirchhoff, series y paralelos', min: 14,
      objectives: ['Aplicar las leyes de Kirchhoff', 'Calcular equivalentes en series y paralelos'],
      blocks: [
        p('Kirchhoff formaliza lo que ya intuías. **KVL**: la suma de caídas de tensión en un lazo cerrado es cero. **KCL**: la corriente que entra en un nodo es la que sale.'),
        diagrama('serie_paralelo', 'En serie sumas resistencias; en paralelo sumas conductancias.'),
        formula('Serie:  Rt = R1 + R2 + …        Paralelo:  1/Rt = 1/R1 + 1/R2 + …', ''),
        apunte('Por qué importa', ' El divisor de voltaje es solo KVL + Ohm. Si entiendes esto, puedes predecir el comportamiento de medio circuito sin simulador.'),
        p('Ejemplo: R1=10 kΩ y R2=10 kΩ en serie con 5 V. La corriente es 5/20000 = 0.25 mA. La caída en cada una es 2.5 V. Ese nodo intermedio es tu Vout.'),
        lista(['En paralelo la tensión es la misma en cada rama.', 'En serie la corriente es la misma en cada elemento.', 'Dos resistencias iguales en paralelo dan la mitad de resistencia.'])
      ],
      practice: { task: 'Diseña un divisor que convierta 5 V en 3.3 V usando un R1 de 10 kΩ. Calcula R2.', success: ['R2 ≈ 19.4 kΩ (o 20 kΩ estándar)', 'Justificas la elección'] },
      quiz: [q('Dos resistencias de 10 kΩ en paralelo, ¿cuánto valen?', ['20 kΩ', '10 kΩ', '5 kΩ', '100 kΩ'], 2, '1/Rt = 2/10k → Rt = 5 kΩ.')]
    }),
    L({
      id: 'r1-3', title: 'Divisores de voltaje y su trampa', min: 15,
      objectives: ['Diseñar divisores', 'Entender la carga y por qué fallan'],
      blocks: [
        p('Un divisor de voltaje toma una tensión mayor y produce una menor. Es la forma más barata de adaptar un sensor de 5 V a un ADC de 3.3 V. Un ADC (convertidor analógico-digital) es el periférico del microcontrolador que transforma un voltaje en un número; lo estudiaremos en detalle en r3-3.'),
        formula('Vout = Vin · R2 / (R1 + R2)', 'R1 arriba (a Vin), R2 abajo (a GND, la masa: el punto de referencia de 0 V, que veremos en r1-8).'),
        diagrama('divisor', 'El nodo entre R1 y R2 es la salida.'),
        aviso('La trampa: el divisor asume que nada carga la salida. Si conectas un pin ADC, este tiene una impedancia de entrada —la resistencia equivalente que el pin presenta a lo que conectas, que veremos en detalle en r3-3—; si conectas una carga baja, el divisor se desploma. Para sensores de alta impedancia está bien; para alimentar algo, usa un regulador o un buffer.'),
        apunte('Buffer o seguidor', 'Un amplificador operacional (op-amp) es un chip que amplifica la diferencia entre sus dos entradas. Configurado con ganancia 1 —un seguidor o buffer—, la salida copia la entrada pero puede entregar mucha más corriente: así la carga no descarga el divisor. Los op-amps se verán en detalle más adelante.'),
        apunte('Regla práctica', 'Haz que la corriente por el divisor sea al menos 10× la corriente que consumirá la carga. R total baja = más consumo pero más estabilidad.'),
        p('Ejemplo: convertir 5 V a 3.3 V con R1=10 kΩ. Despejando R2 de la fórmula: R2 = R1·Vout/(Vin−Vout) = 10k·3.3/1.7 ≈ 19.4 kΩ.'),
        widget('divisor')
      ],
      errors: [err('La lectura del ADC es menor de lo esperado', 'El divisor está siendo cargado por la impedancia del ADC', 'Baja los valores de R (ej. 2k/3.3k) o añade un seguidor con op-amp.')],
      practice: { task: 'En Falstad (enlace de recursos), monta un divisor 10k/20k con 5 V. Mide 3.33 V. Luego pon una carga de 1 kΩ en paralelo con R2 y observa cómo cae.', success: ['Mides ~3.33 V sin carga', 'Ves la caída al cargar', 'Sabes explicar por qué'] },
      quiz: [q('¿Qué pasa si conectas una carga de baja resistencia a la salida de un divisor?', ['La tensión sube', 'La tensión baja porque la carga desvía corriente', 'No pasa nada', 'Se quema el divisor'], 1, 'La carga en paralelo con R2 reduce su equivalente y baja Vout.')]
    }),
    L({
      id: 'r1-4', title: 'Capacitores y desacople', min: 14,
      objectives: ['Entender qué hace un capacitor', 'Saber por qué cada chip lleva uno'],
      blocks: [
        p('Un capacitor almacena carga. Ante cambios rápidos se comporta como un cortocircuito; en DC, como un circuito abierto. Eso lo hace perfecto para filtrar ruido y para dar un "colchón" de energía.'),
        diagrama('capacitor', 'La curva de carga exponencial: τ = R·C es el tiempo para llegar al 63%.'),
        formula('τ = R · C        Vc(t) = V·(1 − e^(−t/τ))', ''),
        apunte('El capacitor de desacople', 'Cada chip lleva un capacitor de 100 nF lo más cerca posible de sus pines de alimentación. Cuando el chip pide un pico de corriente, el capacitor lo suministra antes de que la fuente reaccione. Sin él, el voltaje cae y el chip se resetea.'),
        lista(['Cerámicos (MLCC): baratos, para desacople y filtrado de alta frecuencia.', 'Electrolíticos: mucha capacidad, para bulk y fuentes; tienen polaridad.', 'Tantalio: cuidado, si se polarizan mal pueden incendiarse.']),
        aviso('Los capacitores electrolíticos tienen + y −. Si los pones al revés pueden explotar. Los cerámicos no tienen polaridad.'),
        nota('En motores pon un capacitor grande (100–470 µF) en paralelo con la alimentación del driver, además del 100 nF de desacople del chip.')
      ],
      practice: { task: 'Calcula τ para R=10 kΩ y C=100 µF. ¿Cuánto tarda en cargarse al 99%? (≈5τ)', success: ['τ = 1 s', 'Sabes que 5τ ≈ 5 s'] },
      quiz: [q('¿Para qué sirve un capacitor de 100 nF junto a un IC?', ['Para aumentar la corriente permanente', 'Para desacoplar: entregar picos de corriente y filtrar ruido', 'Para alinear la tensión', 'Para proteger contra inversión de polaridad'], 1, 'Es el desacople clásico: colchón local de energía y filtro de ruido de alta frecuencia.')]
    }),
    L({
      id: 'r1-5', title: 'Diodos, LEDs y protectores', min: 12,
      objectives: ['Entender el diodo y sus usos', 'Calcular la resistencia de un LED'],
      blocks: [
        p('Un diodo deja pasar corriente en un sentido. El LED es un diodo que emite luz. El diodo Schottky cae menos tensión (~0.3 V) y es muy útil en fuentes y protección.'),
        diagrama('diodo', 'Directa vs inversa.'),
        diagrama('led', 'La resistencia limita la corriente del LED.'),
        formula('R = (V alimentación − Vf) / If deseada', 'Vf: rojo≈1.8 V, verde≈2.1 V, azul/blanco≈3.0 V.'),
        apunte('Diodo flyback', 'Cuando cortas la corriente de una bobina (motor, relay), esta genera un pico de voltaje en sentido inverso que puede quemar tu transistor. Un diodo en paralelo con la bobina, en sentido inverso, deja circular esa corriente y protege todo.'),
        aviso('Nunca conectes un LED directamente a una fuente sin resistencia limitadora. Tampoco excedas su corriente típica (20 mA para un LED estándar).')
      ],
      practice: { task: 'Calcula la R para un LED blanco (Vf=3.0 V) a 10 mA desde 5 V.', success: ['R = 200 Ω (usa 220 Ω estándar)'] },
      quiz: [q('¿Qué hace un diodo flyback?', ['Aumenta la velocidad del motor', 'Protege contra el pico inductivo al cortar la corriente', 'Convierte AC en DC', 'Ilumina'], 1, 'Da un camino a la corriente inductiva cuando se abre el interruptor.')]
    }),
    L({
      id: 'r1-6', title: 'Transistores y MOSFETs como interruptores', min: 18,
      objectives: ['Conmutar cargas con un transistor', 'Elegir entre BJT y MOSFET'],
      blocks: [
        p('Un pin de un microcontrolador da ~20 mA. Un motor puede pedir 500 mA. Necesitas un transistor que use la señal pequeña para controlar la corriente grande: es la idea de interruptor de estado sólido.'),
        diagrama('transistor', 'BJT: la corriente en la base controla la del colector.'),
        diagrama('mosfet', 'MOSFET: el voltaje en la gate crea el canal conductor.'),
        tabla(['', 'BJT (NPN)', 'MOSFET canal N'], [
          ['Se controla con', 'Corriente en base', 'Voltaje en gate'],
          ['Resistencia de base', 'Necesaria (1 kΩ típico)', 'Opcional (10 kΩ pull-down: fija la gate a 0 V)'],
          ['Caída al conductor', 'Vce(sat) ~0.2 V', 'Rds(on) · I (muy baja)'],
          ['Mejor para', 'Cargas pequeñas, barato', 'Cargas grandes, eficiente']
        ]),
        formula('BJT: Ib ≈ Ic / hFE        (hFE ~100). Para 100 mA → Ib ≈ 1 mA.', 'hFE es la ganancia de corriente del transistor: cuánto amplifica la corriente de base en el colector.'),
        apunte('Nivel lógico', 'Si usas un MOSFET con un ESP32 de 3.3 V, comprueba que sea "logic level": que conduzca bien con Vgs=3.3 V. Muchos MOSFETs necesitan 10 V en la gate; con solo 3.3 V no conduce del todo y se calienta.'),
        aviso('Siempre pon una resistencia entre la base del BJT y el pin, o una resistencia en la gate del MOSFET (y un pull-down), para evitar estados flotantes.')
      ],
      errors: [err('El transistor se calienta mucho', 'Está en zona activa, no saturation: no le diste suficiente base/gate', 'Aumenta la corriente de base o usa un MOSFET logic-level.')],
      practice: { task: 'Diseña el circuito para encender una tira LED de 12 V / 300 mA desde un pin de 3.3 V. Dibuja el esquemático y justifica el componente.', success: ['Usas MOSFET canal N', 'Incluyes resistencia de gate y pull-down', 'Conectas GND común'] },
      quiz: [q('¿Qué controla la corriente en un MOSFET?', ['La corriente en la gate', 'El voltaje entre gate y source', 'La temperatura', 'La frecuencia'], 1, 'El MOSFET se controla por voltaje (Vgs), con corriente de gate casi nula.')]
    }),
    L({
      id: 'r1-7', title: 'Fuentes, reguladores y baterías LiPo', min: 16,
      objectives: ['Elegir una fuente', 'Entender C-rating y seguridad LiPo'],
      blocks: [
        p('Todo robot necesita energía estable. Las fuentes lineales (LDO) son simples y limpias pero desperdician la diferencia de tensión como calor. Las fuentes conmutadas (buck) son eficientes pero más ruidosas.'),
        diagrama('fuente', 'De una entrada variable a una salida estable.'),
        tabla(['Tipo', 'Ventaja', 'Inconveniente', 'Cuándo'], [
          ['LDO (7805, AMS1117)', 'Simple, poco ruido', 'Ineficiente si Vin≫Vout', 'Caída pequeña, baja corriente'],
          ['Buck (LM2596)', 'Eficiente (90%)', 'Ruido de conmutación', 'Motor y cargas medias'],
          ['Buck-boost', 'Mantiene V con batería baja', 'Más caro', 'Robots con batería']
        ]),
        diagrama('lipo', 'LiPo: celdas y C-rating.'),
        formula('I máx = C-rating · capacidad(Ah).  Un 2S 2200mAh 30C → 66 A.', 'El C-rating es la tasa de descarga, expresada en múltiplos de la capacidad: 30C = 30 veces 2.2 Ah = 66 A.'),
        aviso('LiPo: nunca las dejes cargando sin supervisión, nunca las perfores ni las dejes caer por debajo de 3.0 V por celda. Guarda a ~3.8 V/celda si no las vas a usar. Usa siempre un cargador balanceador.'),
        apunte('Brownout', 'Un motor que arranca puede bajar la tensión lo suficiente para resetear tu microcontrolador. Solución: fuente con margen de corriente, capacitor bulk grande (470 µF) y separar la alimentación de motor y lógica con un regulador.'),
        diagrama('brownout', 'La cadena de fallo típica:' + ' ')
      ],
      practice: { task: 'Elige la fuente para un ESP32 + 2 motores que piden 1.5 A a 6 V, alimentado desde un LiPo 2S (7.4 V). Justifica.', success: ['Buck capaz de 2 A', 'Desacople y bulk', 'GND común'] },
      quiz: [q('Un pack LiPo 2S 2200 mAh con C-rating de 30 C, ¿qué corriente máxima puede entregar?', ['6.6 A', '30 A', '66 A', '2.2 A'], 2, 'I = C · capacidad(Ah) = 30 · 2.2 = 66 A. El "2S" indica el voltaje (7.4 V), no la corriente.')]
    }),
    L({
      id: 'r1-8', title: 'Leer esquemáticos y datasheets', min: 14,
      objectives: ['Interpretar un esquemático', 'Sacar información de un datasheet'],
      blocks: [
        p('Un esquemático es el mapa del circuito. No muestra dónde van las piezas físicamente, sino cómo se conectan. Aprender a leerlo te libera de copiar cableados de fotos.'),
        diagrama('esquematico', 'Del símbolo al montaje.'),
        tabla(['Símbolo', 'Qué es', 'Lo que debes mirar'], [
          ['R', 'Resistor', 'Valor y potencia'], ['C', 'Capacitor', 'Valor y voltaje'],
          ['D / LED', 'Diodo', 'Vf y corriente'], ['Q', 'Transistor', 'Tipo y pinout'],
          ['GND', 'Referencia 0 V', 'Que todos los GND estén unidos'], ['Vcc', 'Alimentación', 'Valor exacto'],
          ['~ o /', 'Señal invertida o PWM', 'Contexto']
        ]),
        apunte('Datasheet: lee solo lo que necesitas', 'Para un sensor mira: rango de alimentación, protocolo, pinout, rango de medida y el código de ejemplo. No leas las 200 páginas; busca con Ctrl+F.'),
        lista(['Busca primero el "Absolute Maximum Ratings": lo que destruye el chip.', 'Luego "Recommended Operating Conditions": lo que garantiza que funcione.', 'Los "Typical Application Circuit" suelen ser oro.'], true)
      ],
      practice: { task: 'Descarga el datasheet del sensor que usarás (VL53L0X o MPU6050) y escribe: tensión, protocolo y pines.', success: ['Encuentras los tres datos', 'Sabes dónde están en el PDF'] },
      quiz: [q('¿Qué sección de un datasheet te dice qué valor destruye permanentemente el chip?', ['Typical Application Circuit', 'Recommended Operating Conditions', 'Absolute Maximum Ratings', 'Pinout'], 2, 'Absolute Maximum Ratings es el límite de destrucción; Recommended Operating Conditions es el rango donde se garantiza el funcionamiento.')]
    }),
    L({
      id: 'r1-9', title: 'El banco: multímetro, protoboard y soldadura', min: 18,
      objectives: ['Medir sin romper nada', 'Hacer uniones fiables'],
      blocks: [
        p('El multímetro es tu herramienta de depuración más importante. En robótica, el bug a veces es un cable suelto o una batería caída, y nunca lo verás en un log.'),
        diagrama('multimetro', 'Modos de medida y cómo conectar.'),
        diagrama('protoboard', 'Cómo está conectada una protoboard por dentro.'),
        aviso('Medir corriente requiere cortar el circuito y poner el multímetro EN SERIE. Si lo pones en paralelo como el voltaje, haces un cortocircuito y fundes el fusible (o el multímetro).'),
        diagrama('soldadura', 'Secuencia para una buena unión.'),
        apunte('Señales de una unión fría', 'Estaño opaco, con grietas o en forma de bola: no hizo contacto. Una unión buena es cónica y brillante. Calienta la unión, no el estaño, y usa flux.'),
        lista(['Estaña la punta antes de empezar y límpiala con una esponja húmeda o latón.', 'Through-hole primero; SMD mucho más adelante.', 'Si algo no encaja, no fuerces: revisa el esquemático.'])
      ],
      errors: [
        err('El multímetro marca 0 o valores raros', 'Estás midiendo voltaje en modo corriente o al revés', 'Comprueba la posición de las sondas y el dial.'),
        err('Un pin suelto tras soldar', 'Unión fría por falta de calor', 'Recalienta con flux y estaño fresco.')
      ],
      practice: { task: 'Corta un cable a propósito, pon el multímetro en modo continuidad y confirma que no da continuidad. Luego suéldalo y verifica que sí.', success: ['Sabes usar continuidad', 'Tu unión pasa la prueba'] },
      quiz: [q('¿Cómo se mide la corriente con un multímetro?', ['En paralelo', 'En serie, cortando el circuito', 'Sin conectar, por inducción', 'En modo continuidad'], 1, 'El amperímetro va en serie; si lo pones en paralelo provocas un cortocircuito.')]
    })
  ]),

  // -------------------- BLOQUE 2: HERRAMIENTAS --------------------
  M('b2', 'Python, terminal y Git', 'Las herramientas que usarás cada semana durante todo el camino', [
    L({
      id: 'r2-1', title: 'Python para robótica', min: 16,
      objectives: ['Repasar lo esencial', 'Escribir scripts útiles para hardware'],
      blocks: [
        p('No necesitas ser desarrollador Python para empezar, pero sí dominar: tipos, funciones, clases, ficheros, JSON y entornos virtuales. Todo lo demás se aprende en contexto.'),
        codigo('python', `from dataclasses import dataclass
import json, time

@dataclass
class Lectura:
    sensor: str
    valor: float
    t: float

def guardar(lecturas: list[Lectura], path: str) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump([vars(x) for x in lecturas], f, indent=2)

lecturas = [Lectura("imu", 32.1, time.time())]
guardar(lecturas, "datos.json")`, 'Un patrón típico: dataclasses + JSON para logger de sensores.'),
        lista(['funciones y clases', 'file I/O y JSON', 'venv + pip (nunca instales paquetes globales)', 'type hints (te ahorran horas en ROS 2)', 'logging en vez de print para sistemas grandes']),
        apunte('Estilo', 'En robótica un script se convierte en un nodo, y un nodo en un sistema. Escribe código que otra persona (tú dentro de seis meses) pueda leer. Nombres claros > cleverness.'),
        enlace('https://cs50.harvard.edu/python/', 'CS50P', 'Curso riguroso y gratuito si quieres repasar desde cero.')
      ],
      practice: { task: 'Escribe un script que lea un CSV de lecturas de sensor, calcule media y desviación, y lo guarde en JSON.', success: ['Usa venv', 'Maneja errores de archivo', 'Tiene type hints'] },
      quiz: [q('En el logger de la lección, ¿qué hace vars(x) dentro de json.dump([vars(x) for x in lecturas], f)?', ['Convierte la fecha a timestamp', 'Devuelve el dict con los atributos de la dataclass para poder serializarla', 'Ordena las lecturas por sensor', 'Comprime el fichero JSON'], 1, 'vars() devuelve __dict__: un dict con sensor, valor y t. json.dump solo serializa tipos básicos, no la instancia directamente.')]
    }),
    L({
      id: 'r2-2', title: 'Terminal y Git', min: 14,
      objectives: ['Moverte por la shell', 'Versionar tus proyectos'],
      blocks: [
        p('La robótica vive en la línea de comandos: ROS 2, ESP-IDF, Docker y la mayoría de herramientas se manejan ahí.'),
        tabla(['Comando', 'Para qué'], [['cd / ls / pwd', 'Navegar'], ['grep / rg', 'Buscar en archivos'], ['chmod +x', 'Dar permisos de ejecución'], ['ssh', 'Conectarte a la Raspberry Pi'], ['source /opt/ros/...', 'Cargar el entorno ROS'], ['journalctl -u', 'Ver logs de un servicio']]),
        apunte('Git en hardware', 'Commitea cada cambio que funcione. Un repositorio con 40 commits pequeños cuenta una historia; uno con un único "initial commit" no dice nada.'),
        codigo('bash', `git init
git add .
git commit -m "Añadir driver TB6612 y prueba de PWM"
git remote add origin git@github.com:tu-usuario/proyecto.git
git push -u origin main`, 'Flujo mínimo.'),
        enlace('https://missing.csail.mit.edu/', 'The Missing Semester', 'Shell, git y herramientas que la universidad no enseña.'),
        enlace('https://learngitbranching.js.org/', 'Learn Git Branching', 'Para entender branches y merges de verdad.')
      ],
      practice: { task: 'Crea un repo para tu primer proyecto con README, foto y descripción del cableado.', success: ['README claro', 'Commits descriptivos', 'Licencia y .gitignore'] },
      quiz: [q('Además de subir la rama, ¿qué hace git push -u origin main la primera vez?', ['Borra las ramas locales', 'Configura origin/main como rama de seguimiento (upstream) de main', 'Crea un tag automático', 'Fusiona main con develop'], 1, 'Con -u (--set-upstream) Git recuerda el remoto y después basta con git push o git pull sin especificarlo.')]
    }),
    L({
      id: 'r2-3', title: 'C++ esencial para robótica', min: 15, level: 'intermedio',
      objectives: ['Leer y escribir C++ básico', 'Entender punteros y referencias'],
      blocks: [
        p('Python manda en alto nivel; C++ manda en tiempo real y en ROS 2 cuando el rendimiento importa. No necesitas ser un experto, pero sí entender punteros, referencias, const, clases y templates básicos.'),
        codigo('cpp', `#include <memory>
#include <vector>

class Motor {
public:
  explicit Motor(int pin) : pin_(pin) {}
  void setSpeed(int pwm) { pwm_ = pwm; }  // 0..255
  int speed() const { return pwm_; }
private:
  int pin_;
  int pwm_ = 0;
};

int main() {
  auto m = std::make_shared<Motor>(9);
  m->setSpeed(128);
}`, 'Clase simple con shared_ptr, típico en nodos ROS 2.'),
        tabla(['Concepto', 'Por qué importa'], [['Referencia &', 'Evita copias, permite modificar'], ['Puntero / smart pointer', 'Gestión de memoria sin new/delete manual'], ['const', 'Contrato de no modificar'], ['Template', 'Código genérico (std::vector, ROS msgs)'], ['RAII', 'Recursos se limpian al salir de ámbito']]),
        apunte('Consejo', 'Si vienes de Python, no intentes pelear con el compilador: lee el error de arriba abajo. El 90% de los errores son tipos o includes faltantes.')
      ],
      practice: { task: 'Extiende la clase Motor del bloque: añade un método setSpeed(int pwm) que limite el valor a 0…255 con std::clamp, compila con -Wall -Wextra y comprueba que m->setSpeed(300) deja speed()==255. Mantén el make_shared y el speed() const.', success: ['setSpeed(300) devuelve 255 y setSpeed(-5) devuelve 0', 'speed() sigue siendo const', 'Compila sin warnings'] },
      quiz: [q('¿Qué garantiza el const al final de int speed() const?', ['Que el valor devuelto no puede cambiar', 'Que el método no modifica los miembros del objeto', 'Que el objeto no se puede destruir', 'Que el compilador no optimiza la función'], 1, 'El const de método hace que this sea un puntero a const: el compilador rechaza cualquier escritura en los miembros desde dentro.')]
    })
  ]),

  // -------------------- BLOQUE 3: MICROCONTROLADORES --------------------
  M('b3', 'Microcontroladores y primeros robots', 'GPIO, PWM, ADC, interrupciones y protocolos', [
    L({
      id: 'r3-1', title: 'GPIO: entradas, salidas y niveles', min: 14,
      objectives: ['Configurar pines', 'Evitar estados flotantes'],
      blocks: [
        p('Un GPIO puede ser entrada o salida. Como salida pone 0 V (LOW) o 3.3/5 V (HIGH). Como entrada lee si el voltaje está por encima o por debajo de un umbral.'),
        diagrama('gpio', 'Entrada vs salida.'),
        apunte('Pull-up / pull-down', 'Si un botón no está conectado a nada cuando no lo pulsas, el pin "flota" y lee ruido. Una resistencia pull-up lo mantiene en HIGH hasta que lo conectas a GND. La mayoría de MCUs tienen pull-ups internos: INPUT_PULLUP.'),
        codigo('cpp', `pinMode(2, INPUT_PULLUP);   // botón a GND
void setup() { Serial.begin(115200); }
void loop() {
  if (digitalRead(2) == LOW) Serial.println("pulsado");
  delay(50);                 // debounce cutre (mejor: millis())
}`, 'Botón con pull-up interno.'),
        aviso('Nunca pongas más de ~20 mA por pin ni excedas el voltaje del chip (3.3 V en ESP32/ESP32-S3; 5 V tolerance solo en algunos pines).')
      ],
      errors: [err('El botón da lecturas aleatorias', 'Pin flotando por falta de pull-up', 'Usa INPUT_PULLUP o una resistencia externa de 10 kΩ.')],
      practice: { task: 'Cablea un pulsador entre el pin 4 y GND con INPUT_PULLUP. Cuenta las pulsaciones detectando solo el flanco de bajada (cambio de HIGH a LOW) con un debounce de 50 ms usando millis(), y muestra el total por Serial cada vez que cambie.', success: ['Sin pulsar, digitalRead(4) vale HIGH', 'El contador aumenta de 1 en 1, nunca de 2 en 2', 'No usas delay() en el código'] },
      quiz: [q('¿Para qué sirve un pull-up?', ['Aumentar la corriente', 'Fijar un nivel alto por defecto y evitar flotación', 'Filtrar ruido', 'Alimentar el motor'], 1, 'Establece el pin en HIGH cuando nadie lo conduce.')]
    }),
    L({
      id: 'r3-2', title: 'PWM: simular un analógico con digital', min: 15,
      objectives: ['Explicar duty cycle y frecuencia', 'Aplicar PWM a LED y motores'],
      blocks: [
        p('El PWM enciende y apaga muy rápido. Lo que percibes es el promedio: con duty 50% un LED brilla a media intensidad y un motor gira a media velocidad.'),
        diagrama('pwm', 'Ancho de pulso = energía entregada.'),
        formula('V medio = Vcc · duty        duty = ton / (ton + toff)', ''),
        tabla(['Aplicación', 'Frecuencia típica', 'Nota'], [['LED atenuar', '> 200 Hz', 'Evita parpadeo visible'], ['Servo RC', '50 Hz', 'Pulso 1–2 ms'], ['Motor DC', '1–20 kHz', 'Por encima del oído'], ['Stepper microstep', '> 20 kHz', 'Suavidad']]),
        codigo('cpp', `ledcSetup(0, 5000, 8);      // canal, 5 kHz, 8 bits
ledcAttachPin(25, 0);
ledcWrite(0, 128);           // 50% de 255`, 'ESP32: PWM con el peripheral LEDC.'),
        apunte('Cuidado con la resolución', 'A 8 bits tienes 256 niveles; a 10 bits, 1024. Si además subes mucho la frecuencia, el hardware puede limitar la resolución. En ESP32 consulta la doc de LEDC.')
      ],
      practice: { task: 'Haz que un LED respire (fade) con PWM y mide con el multímetro la tensión media en distintos duty.', success: ['Ves Vcc·duty', 'El LED no parpadea', 'Sabes cambiar frecuencia'] },
      quiz: [q('Un LED alimentado desde 3.3 V con un PWM al 25% de duty, ¿qué tensión media ve el LED?', ['0.825 V', '1.65 V', '2.475 V', '3.3 V'], 0, 'V medio = Vcc · duty = 3.3 · 0.25 = 0.825 V; es el promedio lo que percibe el ojo.')]
    }),
    L({
      id: 'r3-3', title: 'ADC y lectura de sensores analógicos', min: 12,
      objectives: ['Convertir voltaje a número', 'Manejar ruido y referencia'],
      blocks: [
        p('El ADC muestrea un voltaje y lo convierte en un entero. En ESP32 es de 12 bits: 0…4095 para 0…3.3 V aproximadamente.'),
        diagrama('adc', 'Del mundo analógico al número.'),
        formula('valor = V / Vref · (2^n − 1)        V = valor / (2^n − 1) · Vref', ''),
        codigo('cpp', `int raw = analogRead(34);
float v = raw / 4095.0f * 3.3f;`, 'ESP32: 12 bits por defecto.'),
        lista(['Promedia varias lecturas para reducir ruido.', 'Cuidado: el ADC del ESP32 no es lineal en los extremos; calibrar ayuda.', 'Nunca superes 3.3 V en un pin ADC (usa divisor).']),
        aviso('El pin ADC del ESP32 no tolera 5 V. Si tu sensor da 5 V, pon un divisor (lección r1-3).')
      ],
      practice: { task: 'Conecta un potenciómetro de 10 kΩ entre 3.3 V y GND y su wiper al pin 34. Promedia 64 lecturas de analogRead y convierte a voltios con la fórmula de 12 bits. Anota el raw y el voltaje con el wiper a mitad de recorrido y al 25%.', success: ['A mitad de recorrido lees raw≈2048 y V≈1.65 V', 'Al 25% lees V≈0.83 V', 'La media de 64 muestras reduce el ruido frente a una sola lectura'] },
      quiz: [q('En el ESP32 (ADC de 12 bits, Vref≈3.3 V), ¿qué voltaje corresponde a una lectura raw de 2048?', ['0.825 V', '1.65 V', '2.2 V', '3.3 V'], 1, 'V = 2048/4095 · 3.3 ≈ 1.65 V, es decir, casi la mitad del rango.')]
    }),
    L({
      id: 'r3-4', title: 'Interrupciones y debouncing', min: 14,
      objectives: ['Reaccionar a eventos sin polling', 'Evitar rebotes'],
      blocks: [
        p('Una interrupción salta inmediatamente cuando ocurre un evento (un flanco en un pin). Es la forma correcta de no perder pulsos rápidos, pero la ISR debe ser cortísima.'),
        diagrama('interrupcion', 'ISR avisa, el loop trabaja.'),
        aviso('Dentro de una ISR: no uses delay, no hagas Serial.println, no allocates memoria. Solo pon un flag volatile y sal.'),
        codigo('cpp', `volatile bool boton = false;
void IRAM_ATTR onButton() { boton = true; }

void setup() {
  attachInterrupt(digitalPinToInterrupt(2), onButton, RISING);
}
void loop() {
  if (boton) { boton = false;Serial.println("evento"); }
}`, 'Patrón ISR → flag → loop.'),
        apunte('Debounce por software', 'Un botón mecánico rebota durante ~5–20 ms. Puedes filtrar ignorando cambios durante ese tiempo (millis()) o usar un filtro RC + Schmitt trigger.')
      ],
      practice: { task: 'Cuenta pulsaciones con interrupción y muestra el total cada segundo. Añade debounce de 50 ms.', success: ['No cuenta dobles', 'ISR es corta', 'Usa volatile'] },
      quiz: [q('¿Por qué la bandera compartida entre una ISR y el loop debe declararse volatile?', ['Para que ocupe menos memoria', 'Para evitar que el compilador optimice la lectura y se quede con un valor cacheado', 'Para que la interrupción pueda escribirla antes', 'Para incrementar la prioridad de la tarea'], 1, 'volatile obliga a leer la variable desde memoria en cada acceso, porque la ISR puede cambiarla fuera del flujo normal del programa.')]
    }),
    L({
      id: 'r3-5', title: 'I²C, SPI y UART', min: 16,
      objectives: ['Elegir el protocolo', 'Entender direcciones y tramas'],
      blocks: [
        p('Tres formas de hablar con sensores. Elegir bien evita muchos dolores de cabeza.'),
        diagrama('i2c', 'I²C: dos hilos y direcciones.'),
        diagrama('spi', 'SPI: cuatro hilos y CS.'),
        diagrama('uart', 'UART: TX/RX y baud rate.'),
        tabla(['', 'I²C', 'SPI', 'UART'], [
          ['Hilos', 'SDA, SCL', 'SCK, MOSI, MISO, CS', 'TX, RX'],
          ['Velocidad', '100k / 400k Hz', 'hasta MHz', '9600…2M baud'],
          ['Direccionamiento', '7-bit por dispositivo', 'CS por dispositivo', 'Punto a punto'],
          ['Ideal para', 'Sensores lentos', 'Pantallas, SD, ADC rápidos', 'Logs, GPS, entre MCUs']
        ]),
        apunte('Error típico I²C', 'Si un dispositivo no responde, escanea el bus (I2CScanner). Conflictos de dirección y cables SDA/SCL cruzados son la causa más común.')
      ],
      practice: { task: 'Escanea tu bus I²C y anota las direcciones de todos los dispositivos conectados.', success: ['Encuentras cada sensor', 'Sabes su dirección hexadecimal'] },
      quiz: [q('Con direccionamiento I²C de 7 bits, ¿cuántas direcciones distintas existen teóricamente en el bus?', ['7', '64', '128', '256'], 2, '2^7 = 128 direcciones (0x00–0x7F), aunque varias están reservadas y no se pueden usar con sensores.')]
    }),
    L({
      id: 'r3-6', title: 'ESP32: WiFi, HTTP y OTA', min: 16, level: 'intermedio',
      objectives: ['Servir una página desde el microcontrolador', 'Actualizar por aire'],
      blocks: [
        p('El ESP32 puede ser un servidor web minúsculo. Esto te permite ver sensores en el móvil y manejar un servo sin app nativa.'),
        codigo('cpp', `#include <WiFi.h>
#include <WebServer.h>
WebServer server(80);

void setup() {
  WiFi.begin("TU_SSID", "TU_PASS");
  while (WiFi.status() != WL_CONNECTED) delay(500);
  server.on("/led", [](){
    int v = server.arg("v").toInt();
    analogWrite(2, v);
    server.send(200, "text/plain", "ok");
  });
  server.begin();
  Serial.println(WiFi.localIP());
}
void loop() { server.handleClient(); }`, 'Endpoint mínimo que controla un PWM.'),
        apunte('Arquitectura', 'El ESP32 es bueno en WiFi y tiempo real, pero no en ROS 2. En robots serios: ESP32 = motores y sensores; Raspberry Pi = ROS 2 y visión. Se conectan por UART.'),
        lista(['Usa ESP-NOW para comunicación directa y baja latencia entre ESP32.', 'OTA (Over The Air) te evita desconectar el cable cada cambio.', 'Nunca pongas credenciales en el código que subes a GitHub.']),
        diagrama('arquitectura', 'Dónde encaja el ESP32 en un robot completo.')
      ],
      practice: { task: 'Sirve una página con el valor de un sensor y un botón que mueva un servo. Accede desde tu iPad en la misma red.', success: ['Página accesible', 'Botón funciona', 'Sin credenciales en el código'] },
      quiz: [q('En un robot con Raspberry Pi + ESP32, ¿cuál es la razón principal de conectarlos por UART en vez de correr ROS 2 en el ESP32?', ['El UART es más rápido que el WiFi', 'El ESP32 no tiene recursos para ROS 2 y se dedica a tiempo real y motores', 'ROS 2 no funciona en Linux', 'El Pi no tiene pines GPIO'], 1, 'El ESP32 es bueno en WiFi y control en tiempo real; ROS 2 y la visión van en el Pi, y UART es el enlace simple y determinista entre ambos.')]
    }),
    L({
      id: 'r3-7', title: 'RTOS y tiempo real', min: 14, level: 'avanzado',
      objectives: ['Entender tareas y prioridades', 'Saber cuándo hace falta'],
      blocks: [
        p('En un robot, controlar un motor a 1 kHz y enviar telemetría por WiFi no pueden competir por el mismo hilo. Un RTOS (FreeRTOS en ESP32) separa tareas con prioridades.'),
        diagrama('rtos', 'Tareas con prioridades.'),
        lista(['Tarea de control: prioridad alta, periódica, sin bloqueos.', 'Tarea de red: prioridad baja, puede esperar.', 'Comunicación entre tareas: colas (queues) y semáforos, NO variables globales sin protección.'], true),
        apunte('Cuándo NO usar RTOS', 'Si solo haces blink y lees un sensor, un loop con millis() es suficiente y más simple. Añade complejidad solo cuando la necesites.')
      ],
      practice: { task: 'Crea dos tareas en FreeRTOS: una de control que alterne un GPIO a 1 kHz (periodo 1 ms) con prioridad alta, y una de telemetría que envíe el número de ciclos por Serial cada 1 s con prioridad baja. Pasa el contador de ciclos mediante una Queue y mide con un analizador lógico que el pin nunca se retrasa más de unos microsegundos.', success: ['La tarea de control mantiene el periodo de 1 ms', 'El contador viaja por una Queue, no por una global sin protección', 'La telemetría no bloquea ni retrasa el control'] },
      quiz: [q('Dos tareas de FreeRTOS incrementan el mismo contador sin protección y el valor final sale mal. ¿Qué mecanismo procede?', ['Aumentar la prioridad de ambas tareas', 'Usar una Queue o un mutex/semáforo para el acceso compartido', 'Declarar la variable como const', 'Poner un delay(1) en cada tarea'], 1, 'Las colas y los semáforos sincronizan el acceso; subir prioridades o añadir delays no evita la condición de carrera.')]
    })
  ])
];
