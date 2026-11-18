export type CaseStudy = {
  id: string;
  name: string;
  category: 'movil' | 'brazo' | 'humanoide' | 'cuadrupedo' | 'drone' | 'autonomo' | 'industria';
  track: 'robotica' | 'ai' | 'ambos';
  summary: string;
  architecture: { layer: string; detail: string }[];
  sensors: string[];
  compute: string;
  control: string;
  learning: string;
  lesson: string;
  resources: { label: string; url: string }[];
};

export const cases: CaseStudy[] = [
  {
    id: 'spot',
    name: 'Boston Dynamics Spot',
    category: 'cuadrupedo',
    track: 'ambos',
    summary: 'Cuadrúpedo eléctrico de Boston Dynamics para inspección industrial y operaciones en entornos peligrosos. Su valor está en la separación entre un lazo de marcha muy robusto y una capa de misión programable mediante SDK.',
    architecture: [
      { layer: 'Mecánica', detail: 'Chasis rígido de unos 30 kg con cuatro patas de tres articulaciones cada una (12 grados de libertad). Diseño sellado para trabajo en campo, con una bahía superior para cargas útiles.' },
      { layer: 'Actuación', detail: 'Doce actuadores eléctricos integrados con engranajes y freno. El salto de la hidráulica a la electricidad redujo ruido, consumo y mantenimiento.' },
      { layer: 'Sensado', detail: 'Cámaras estereoscópicas frontales, laterales y traseras, IMU, codificadores articulares y sensores de contacto en las almohadillas. El LIDAR y las cámaras térmicas entran como payload.' },
      { layer: 'Computación', detail: 'Ordenador a bordo para percepción y misiones más un subsistema de control determinista para el lazo de marcha. El Spot SDK expone ambos mediante API de servicio y telemetría.' },
      { layer: 'Control', detail: 'Control de cuerpo completo con MPC y patrones de marcha realimentados por propriocepción; compensa empujones, pendientes y deslizamiento de las patas.' },
      { layer: 'Planificación', detail: 'Autowalk permite grabar recorridos con waypoints y tomar instantáneas de inspección; la integración con ROS 2 añade navegación y tareas de alto nivel.' },
      { layer: 'Aprendizaje', detail: 'La estabilidad es modelo-based. El aprendizaje por refuerzo y los modelos de visión aparecen en investigación y en los payloads, no en el núcleo de la marcha.' }
    ],
    sensors: ['Estéreo frontal, lateral y trasero', 'IMU', 'Codificadores de articulación', 'Sensores de contacto en patas', 'LIDAR opcional', 'Cámara térmica opcional'],
    compute: 'CPU x86 a bordo para navegación y SDK; microcontrolador en tiempo real para el control motor a alta frecuencia.',
    control: 'MPC con modelo de masa central y dinámica simplificada de patas; el controlador de marcha corre a cientos de hertz y ajusta apoyo y fuerza en cada paso.',
    learning: 'Control basado en modelo como núcleo; RL para comportamientos experimentales y percepciones de alto nivel, con datos de flota y de payloads.',
    lesson: 'Spot demuestra que la robustez no exige un modelo gigante, sino un lazo de estabilidad rápido y determinista separado de una capa de misión que cambia según el trabajo. La electrificación de los actuadores simplificó el mantenimiento frente a los diseños hidráulicos anteriores. Además, la interfaz de payloads importa casi tanto como el robot: convierte un cuadrúpedo en una plataforma de sensores reutilizable.',
    resources: [
      { label: 'Documentación de desarrolladores de Spot', url: 'https://dev.bostondynamics.com/' },
      { label: 'Página oficial de Spot', url: 'https://www.bostondynamics.com/products/spot' }
    ]
  },
  {
    id: 'atlas',
    name: 'Boston Dynamics Atlas',
    category: 'humanoide',
    track: 'ambos',
    summary: 'El humanoide eléctrico de Boston Dynamics, con manos articuladas y cuerpo completo diseñado para manipulación industrial. Representa el cruce entre control de cuerpo entero y modelos fundacionales de robótica.',
    architecture: [
      { layer: 'Mecánica', detail: 'Humanoide de unos 1,9 m con torso, brazos y piernas de diseño propio; versión eléctrica de la plataforma que antes usaba hidráulica.' },
      { layer: 'Actuación', detail: 'Actuadores eléctricos custom con alta densidad de par, incluidas articulaciones de muñeca y manos con dedos articulados para manipulación fina.' },
      { layer: 'Sensado', detail: 'Cámaras de profundidad y RGB, IMU, codificadores en todas las articulaciones y sensores de fuerza/par en extremidades para contacto.' },
      { layer: 'Computación', detail: 'Ordenador embebido con GPU para percepción y planificación, más un bus de tiempo real para los lazos de control de las decenas de articulaciones.' },
      { layer: 'Control', detail: 'Control de cuerpo completo con optimización de contactos y MPC: coordina brazos, piernas y tronco para mantener equilibrio mientras manipula.' },
      { layer: 'Planificación', detail: 'Planificador de tareas y de movimientos con restricciones de contacto; reciente integración con modelos de lenguaje y visión de Google DeepMind.' },
      { layer: 'Aprendizaje', detail: 'Políticas de locomoción y manipulación entrenadas con RL en simulación y transferidas al robot, además de modelos VLA para instrucciones en lenguaje natural.' }
    ],
    sensors: ['Cámaras RGB y profundidad', 'IMU', 'Codificadores articulares', 'Sensores de fuerza/par', 'Sensores táctiles en manos'],
    compute: 'PC embebido con aceleración gráfica para visión y planificación; control en tiempo real sobre bus determinista.',
    control: 'MPC de cuerpo entero con restricciones de contacto y control de impedancia en brazos, manteniendo el centro de masa sobre la base de apoyo.',
    learning: 'RL sim-to-real para marcha y manipulación; modelos fundacionales multimodales para comprensión de tareas y razonamiento semántico.',
    lesson: 'Atlas enseña que un humanoide no es solo un problema de piernas: el verdadero reto es coordinar todo el cuerpo mientras las manos ejercen fuerza sobre el mundo. La vuelta a actuadores eléctricos obligó a rediseñar la cadena de transmisión y el control de par. Hoy además sirve de banco de pruebas para conectar modelos de lenguaje con control físico continuo.',
    resources: [
      { label: 'Página oficial de Atlas', url: 'https://bostondynamics.com/atlas/' },
      { label: 'Google DeepMind Research', url: 'https://deepmind.google/discover/blog/' }
    ]
  },
  {
    id: 'perseverance',
    name: 'NASA Perseverance (Mars 2020)',
    category: 'autonomo',
    track: 'robotica',
    summary: 'Rover de exploración marciana con suspensión rocker-bogie, navegación autónoma y un sistema de perforación y almacenamiento de muestras. Su autonomía está diseñada para sobrevivir a latencia de comunicaciones y radiación.',
    architecture: [
      { layer: 'Mecánica', detail: 'Seis ruedas con suspensión rocker-bogie de unos 1025 kg, diseñada para sortear rocas manteniendo las seis ruedas en contacto.' },
      { layer: 'Actuación', detail: 'Motores con reductores de armónicos y codificadores en cada rueda y en el mástil; accionamientos para el brazo perforador y el sistema de tubos de muestras.' },
      { layer: 'Sensado', detail: 'Mastcam-Z, SuperCam, PIXL, SHERLOC, MOXIE, Navcams, Hazcams, IMU, sensores de temperatura y codificadores; instrumentos científicos y de navegación.' },
      { layer: 'Computación', detail: 'Procesador radiation-hardened RAD750 con memoria limitada y buses redundantes; todo el software es verificable y tolerante a fallos.' },
      { layer: 'Control', detail: 'Lazos cerrados de motor y de articulación, con odometría visual y control de tracción; comandos de alto nivel se ejecutan como secuencias con supervisión.' },
      { layer: 'Planificación', detail: 'AutoNav planifica rutas evitando peligros mediante visión estereoscópica y seguimiento de características, sin depender de órbita en tiempo real.' },
      { layer: 'Aprendizaje', detail: 'No usa aprendizaje profundo a bordo: prioriza algoritmos clásicos deterministas y validados por la restricción de hardware espacial.' }
    ],
    sensors: ['Navcam y Hazcam estereoscópicas', 'Mastcam-Z', 'SuperCam', 'PIXL y SHERLOC', 'IMU', 'Codificadores de rueda y brazo', 'Sensores térmicos'],
    compute: 'RAD750 resistente a radiación con memoria ECC y arquitectura redundante; capacidad muy por debajo de un ordenador moderno.',
    control: 'Control de motores en lazo cerrado con odometría visual y deslizamiento estimado; secuencias de comandos con chequeos y paradas seguras.',
    learning: 'Visión por computadora clásica (detección de puntos característicos, correlación estéreo) en lugar de redes neuronales; el aprendizaje queda en tierra.',
    lesson: 'Perseverance muestra que cuando el hardware es irradiado, lento y con memoria escasa, la solución no es un modelo más grande sino algoritmos simples y auditables. La latencia de comunicaciones obliga a que el rover decida por sí mismo qué terreno es seguro. La cada vez más compleja cadena de perforación y almacenamiento recuerda que en robótica científica la manipulación precisa es tan crítica como la navegación.',
    resources: [
      { label: 'Misión Perseverance (NASA Science)', url: 'https://science.nasa.gov/mission/mars-2020-perseverance/' },
      { label: 'Mars 2020', url: 'https://mars.nasa.gov/mars2020/' }
    ]
  },
  {
    id: 'so-101',
    name: 'SO-101 (LeRobot / The Robot Studio)',
    category: 'brazo',
    track: 'ambos',
    summary: 'Brazo de bajo coste y código abierto de Hugging Face LeRobot, pensado para teleoperación y aprendizaje por imitación. Es la forma más accesible de entrenar políticas ACT o Diffusion Policy con datos propios.',
    architecture: [
      { layer: 'Mecánica', detail: 'Brazo de 6 grados de libertad con piezas impresas en 3D y estructura abierta; versión mejorada del SO-100 con mayor rigidez y calibración más sencilla.' },
      { layer: 'Actuación', detail: 'Servomotores Feetech STS3215 en cadena, con bus serie para comandar posición y leer estado; incluye un brazo líder para teleoperación.' },
      { layer: 'Sensado', detail: 'Codificadores de los servos y cámara USB externa; no hay sensores de fuerza, así que la percepción del contacto es visual.' },
      { layer: 'Computación', detail: 'Ordenador host con Python y PyTorch; el microcontrolador del bus de servos actúa como esclavo de posición.' },
      { layer: 'Control', detail: 'Control de posición a frecuencia moderada sobre los servos; las acciones de la política se envían como targets de articulación.' },
      { layer: 'Planificación', detail: 'Flujo de teleoperación → registro de demostraciones → entrenamiento → evaluación, todo dentro del ecosistema LeRobot.' },
      { layer: 'Aprendizaje', detail: 'Imitación con ACT o Diffusion Policy sobre pares imagen-acción; soporte para datasets en Hugging Face Hub y fine-tuning.' }
    ],
    sensors: ['Codificadores de servos STS3215', 'Cámara USB RGB', 'Lectura de corriente de los servos', 'Brazo líder como referencia humana'],
    compute: 'PC con Python/PyTorch para inferencia y entrenamiento; bus serie para los servos; sin GPU necesaria para políticas pequeñas.',
    control: 'Posición articular comandada a ~50 Hz desde la política, con limitación de velocidad y rangos seguros en el firmware de los servos.',
    learning: 'Imitación supervisada con action chunking (ACT) o modelos generativos de difusión; datos recogidos por teleoperación humana.',
    lesson: 'El SO-101 enseña que el coste ya no es la barrera para hacer robot learning: con servos baratos y código abierto puedes registrar demostraciones y entrenar una política en un fin de semana. También hace visible el límite de la teleoperación: sin sensores de fuerza, la política solo sabe lo que ve la cámara. Es el mejor punto de partida para entender el ciclo dato → política → robot real.',
    resources: [
      { label: 'Repositorio SO-ARM100', url: 'https://github.com/TheRobotStudio/SO-ARM100' },
      { label: 'LeRobot (Hugging Face)', url: 'https://github.com/huggingface/lerobot' }
    ]
  },
  {
    id: 'franka-panda',
    name: 'Franka Emika Panda',
    category: 'brazo',
    track: 'robotica',
    summary: 'Brazo colaborativo de 7 ejes muy usado en investigación por sus sensores de par en cada articulación y su interfaz de control en tiempo real. Es el caballo de batalla de los laboratorios de control y aprendizaje.',
    architecture: [
      { layer: 'Mecánica', detail: 'Brazo de 7 grados de libertad con 3 kg de carga y 855 mm de alcance; diseño serie-elástico ligero y pinza propia.' },
      { layer: 'Actuación', detail: 'Motores sin escobillas con reductores y sensores de par de alta resolución en las siete articulaciones.' },
      { layer: 'Sensado', detail: 'Sensores de fuerza/par articulares, codificadores de motor y de junta, sensor de par en el efector y pinza Franka Hand opcional.' },
      { layer: 'Computación', detail: 'Controlador FCI (Franka Control Interface) con un lazo en tiempo real a 1 kHz; se conecta por Ethernet a un PC con libfranka o ROS 2.' },
      { layer: 'Control', detail: 'Control de posición, velocidad, par e impedancia con restricciones de colisión y límites de momento integrados.' },
      { layer: 'Planificación', detail: 'Integración con MoveIt 2 y planificadores de trayectorias cartesianas; ejemplos de control de contacto y deslizamiento.' },
      { layer: 'Aprendizaje', detail: 'Plataforma favorita para RL, learning from demonstration y control con políticas neuronales gracias a la precisión del lazo de par.' }
    ],
    sensors: ['Sensores de par en 7 articulaciones', 'Codificadores de motor y junta', 'Sensor de fuerza en muñeca/pinza', 'Interruptores de seguridad'],
    compute: 'Controlador dedicado con lazo de 1 kHz; PC externo con libfranka o franka_ros2 para planificación y aprendizaje.',
    control: 'Control de impedancia y de par a 1 kHz con modelo dinámico y compensación de gravedad y fricción; interfaz directa para comandos de torque.',
    learning: 'RL y aprendizaje por demostración con observaciones proprioceptivas y visuales; la fidelidad del control de par hace que la transferencia desde simulación sea fiable.',
    lesson: 'Panda enseña por qué el sensado de par cambia el problema: con medidas de torque precisas puedes hacer control de impedancia y contacto de verdad, no solo seguir waypoints. El lazo a 1 kHz y una API abierta explican por qué se convirtió en estándar de investigación. La lección práctica es que la calidad de la interfaz de control determina qué experimentos son posibles.',
    resources: [
      { label: 'Documentación de Franka', url: 'https://frankaemika.github.io/docs/' },
      { label: 'franka_ros2', url: 'https://github.com/frankaemika/franka_ros2' }
    ]
  },
  {
    id: 'ur5e',
    name: 'Universal Robots UR5e',
    category: 'industria',
    track: 'robotica',
    summary: 'Cobot de 6 ejes de Universal Robots con sensor de fuerza/par en la brida, diseñado para trabajar junto a personas sin jaula. Representa la madurez del brazo colaborativo industrial programable por teach pendant.',
    architecture: [
      { layer: 'Mecánica', detail: 'Brazo articulado de 6 grados de libertad, 5 kg de carga útil y 850 mm de alcance, con diseño de baja inercia y bordes redondeados.' },
      { layer: 'Actuación', detail: 'Motores eléctricos con reductores y frenos; conjuntos modulares que permiten sustituir articulaciones en campo.' },
      { layer: 'Sensado', detail: 'Sensor de fuerza/par de 6 ejes en la brida de la herramienta, codificadores articulares y entradas digitales para pinzas y sensores externos.' },
      { layer: 'Computación', detail: 'Controlador UR con dos capas: un lazo de servo determinista y un intérprete de URScript; comunicación por Ethernet, Modbus TCP, PROFINET o EtherNet/IP.' },
      { layer: 'Control', detail: 'Control de movimiento con perfiles de aceleración y control basado en fuerza para tareas de contacto como pulido o inserción.' },
      { layer: 'Planificación', detail: 'Programación por teach pendant o URScript, con movimientos tipo PTP, lineales y circulares, más URCaps que amplían la funcionalidad.' },
      { layer: 'Aprendizaje', detail: 'El robot en sí no aprende: la inteligencia está en el programa y en sistemas externos que consumen su interfaz de fuerza y posición.' }
    ],
    sensors: ['Sensor F/T de 6 ejes en la brida', 'Codificadores articulares', 'E/S digitales y analógicas', 'Entradas de seguridad'],
    compute: 'Controlador industrial propietario con servo en tiempo real y capa de programación; driver ROS 2 oficial para integración.',
    control: 'Servocontrol de cada eje con perfiles suaves y modos de fuerza; funciones de seguridad certificadas como parada monitorizada y límites de momento.',
    learning: 'Sin aprendizaje a bordo; se usa como plataforma controlada por programas o como brazo físico para investigación externa.',
    lesson: 'El UR5e muestra que en industria la innovación suele estar en la interfaz, no en el algoritmo: enseñar con el pendant y tener un sensor F/T en la brida resolvió más problemas que cualquier política compleja. La certificación de seguridad es una parte del diseño, no un accesorio. Además, su API abierta lo convirtió en el brazo estándar para probar ideas de aprendizaje fuera del laboratorio.',
    resources: [
      { label: 'UR5e', url: 'https://www.universal-robots.com/products/ur5-robot/' },
      { label: 'Driver ROS 2 de Universal Robots', url: 'https://github.com/UniversalRobots/Universal_Robots_ROS2_Driver' }
    ]
  },
  {
    id: 'optimus',
    name: 'Tesla Optimus',
    category: 'humanoide',
    track: 'ambos',
    summary: 'Humanoide de Tesla que reaprovecha la pila de visión por computador y entrenamiento del coche autónomo. Su apuesta es aprender tareas de teleoperación humana y escalar datos como lo hace el programa FSD.',
    architecture: [
      { layer: 'Mecánica', detail: 'Humanoide de aproximadamente 1,73 m con cuerpo, brazos y piernas modulares; las versiones recientes redujeron masa y aumentaron la velocidad de marcha.' },
      { layer: 'Actuación', detail: 'Actuadores eléctricos propios con tornillos de rodillos y transmisiones compactas; manos con múltiples grados de libertad y tendones para dedos.' },
      { layer: 'Sensado', detail: 'Batería de cámaras del tipo Tesla Vision, IMU, codificadores articulares y sensores de fuerza en manos y pies para el contacto.' },
      { layer: 'Computación', detail: 'Ordenador de inferencia de Tesla derivado del FSD, con entrenamiento en su propio clúster y despliegue de redes comprimidas a bordo.' },
      { layer: 'Control', detail: 'Control de cuerpo completo con políticas de locomoción y manipulación; bajo nivel determinista y alto nivel gobernado por la red.' },
      { layer: 'Planificación', detail: 'Las tareas se aprenden observando a operadores teleoperados, con descomposición en secuencias y verificación visual del resultado.' },
      { layer: 'Aprendizaje', detail: 'Aprendizaje supervisado masivo y aprendizaje por refuerzo con datos de flota y simulación, reutilizando la infraestructura de datos de Tesla.' }
    ],
    sensors: ['Cámaras tipo Tesla Vision', 'IMU', 'Codificadores articulares', 'Sensores de fuerza en manos y pies', 'Sensores táctiles en desarrollo'],
    compute: 'Ordenador de inferencia propio con aceleradores, entrenamiento centralizado en clúster y actualizaciones periódicas del modelo.',
    control: 'Políticas de locomoción y manipulación con control de bajo nivel en tiempo real; el equilibrio se mantiene con realimentación proprioceptiva.',
    learning: 'Imitación de demostraciones humanas, RL y enorme volumen de datos; la misma filosofía de aprendizaje basado en datos del coche autónomo.',
    lesson: 'Optimus ilustra la transferencia de una pila de IA madura de un dominio a otro: la visión, el entrenamiento a escala y el ciclo de datos rápido son la ventaja, no la mecánica. También expone el coste de la generalidad: un humanoide debe resolver equilibrio, manipulación y percepción a la vez. Su desarrollo recuerda que en robótica moderna la infraestructura de datos es parte del producto.',
    resources: [
      { label: 'Tesla AI', url: 'https://www.tesla.com/AI' },
      { label: 'Tesla Optimus', url: 'https://www.tesla.com/optimus' }
    ]
  },
  {
    id: 'figure-02',
    name: 'Figure 02',
    category: 'humanoide',
    track: 'ambos',
    summary: 'Humanoide de Figure AI desplegado en líneas de fabricación (por ejemplo, BMW) con manos articuladas de alta destreza, cámaras y cómputo propio. Es un ejemplo de humanoide orientado a tareas industriales concretas.',
    architecture: [
      { layer: 'Mecánica', detail: 'Humanoide de alrededor de 1,68 m con brazos y piernas articulados, diseñado para manipular piezas y trabajar en espacios pensados para personas.' },
      { layer: 'Actuación', detail: 'Actuadores eléctricos integrados y manos con dieciséis grados de libertad, capaces de pinzas finas y manejo de herramientas.' },
      { layer: 'Sensado', detail: 'Cámaras RGB de múltiples ángulos, sensores de fuerza en las manos y articulaciones, IMU y micrófonos para interacción por voz.' },
      { layer: 'Computación', detail: 'Ordenador de a bordo con bastante más capacidad que la generación anterior, ejecutando inferencia de modelos de visión-lenguaje-acción.' },
      { layer: 'Control', detail: 'Control de cuerpo completo y de manos con realimentación táctil; el modelo de alto nivel emite comandos que el controlador convierte en movimiento.' },
      { layer: 'Planificación', detail: 'Planificación de tareas a partir de instrucciones en lenguaje y observación del entorno, con despliegue en celdas de producción reales.' },
      { layer: 'Aprendizaje', detail: 'Políticas VLA entrenadas con demostraciones y datos de despliegue; integración posterior con el modelo Helix de la propia empresa.' }
    ],
    sensors: ['Cámaras RGB multivista', 'Sensores de fuerza/par', 'Sensores táctiles en manos', 'IMU', 'Micrófonos'],
    compute: 'PC embebido con GPU para inferencia de modelos VLA y control en tiempo real de brazos y manos.',
    control: 'Control de brazo y mano con impedancia y sincronización del cuerpo, con lazos rápidos por debajo de la política de visión.',
    learning: 'Imitación y modelos visión-lenguaje-acción con datos recogidos en tareas industriales y simulación.',
    lesson: 'Figure 02 muestra que el despliegue comercial empieza por tareas estrechas: elegir un entorno con reglas claras permite que un humanoide frágil sea útil antes de ser general. La cantidad de grados de libertad de las manos desplaza el problema desde caminar hasta manipular con contacto rico. También evidencia que la arquitectura de dos velocidades, razonamiento lento y control rápido, es la que hace práctico un VLA en hardware real.',
    resources: [
      { label: 'Figure AI', url: 'https://www.figure.ai/' },
      { label: 'Presentación de Figure 02', url: 'https://www.figure.ai/news/figure-02' }
    ]
  },
  {
    id: 'digit',
    name: 'Agility Digit',
    category: 'humanoide',
    track: 'ambos',
    summary: 'Bípedo de Agility Robotics diseñado para mover cajas y totes en almacenes. Su diseño prioriza fiabilidad, autonomía y capacidad de carga por encima de la apariencia humana.',
    architecture: [
      { layer: 'Mecánica', detail: 'Bípedo de unos 1,75 m con brazos manipuladores y patas con articulaciones elastoméricas; orientado a manipulación de contenedores.' },
      { layer: 'Actuación', detail: 'Actuadores eléctricos con elementos elásticos en serie que almacenan energía y amortiguan impactos en cada paso.' },
      { layer: 'Sensado', detail: 'Cámaras de profundidad, LIDAR, IMU, codificadores y sensores de fuerza en los pies; percepción del entorno de almacén y de los totes.' },
      { layer: 'Computación', detail: 'Ordenador embebido con la navegación, la percepción y el control; integración con flotas y sistemas de gestión de almacén.' },
      { layer: 'Control', detail: 'Marcha dinámica con control de momento y captura con los brazos; transiciones robustas entre caminar, girar y manipular.' },
      { layer: 'Planificación', detail: 'Tareas de logística: ir a una estación, tomar un tote, transportarlo y depositarlo, con reintentos y detección de fallos.' },
      { layer: 'Aprendizaje', detail: 'RL para adaptar la marcha a cargas y superficies, con entrenamiento en simulación y ajuste en el robot real.' }
    ],
    sensors: ['Cámaras de profundidad', 'LIDAR', 'IMU', 'Codificadores articulares', 'Sensores de fuerza en pies'],
    compute: 'PC a bordo con GPU ligera para percepción y planificación de tareas logísticas; comunicación con el sistema de flota.',
    control: 'Control dinámico de equilibrio con realimentación de fuerza y momento; brazos coordinados con la marcha para transportar carga.',
    learning: 'Aprendizaje por refuerzo en simulación para la marcha y adaptación de carga; supervisión de tareas en el despliegue real.',
    lesson: 'Digit enseña que un humanoide útil no tiene que parecerse mucho a una persona: basta con que encaje en la infraestructura existente. La elasticidad de las articulaciones y el control dinámico reducen el coste energético de caminar. Su despliegue en logística recuerda que la métrica real es el tiempo de actividad y el número de totes movidos, no la belleza de la demo.',
    resources: [
      { label: 'Agility Digit', url: 'https://www.agilityrobotics.com/digit' },
      { label: 'Agility Robotics', url: 'https://www.agilityrobotics.com/' }
    ]
  },
  {
    id: 'unitree-go2-g1',
    name: 'Unitree Go2 y G1',
    category: 'cuadrupedo',
    track: 'ambos',
    summary: 'Familia de robots de bajo coste y alta difusión: el cuadrúpedo Go2 y el humanoide G1. Su SDK abierto y el uso intensivo de RL sim-to-real los han convertido en plataformas habituales de investigación.',
    architecture: [
      { layer: 'Mecánica', detail: 'Go2: cuadrúpedo ligero de cuatro patas con tres articulaciones por pata. G1: humanoide compacto de unos 1,3 m con brazos y, según versión, manos articuladas.' },
      { layer: 'Actuación', detail: 'Motores propios de alta densidad de par con reductores; en ambos modelos el hardware está optimizado para producción en volumen.' },
      { layer: 'Sensado', detail: 'IMU, codificadores, cámaras de profundidad y LIDAR opcional (Go2), además de sensores de fuerza en los pies en las versiones avanzadas.' },
      { layer: 'Computación', detail: 'Ordenador embebido con opción de Jetson para percepción; toda la pila de locomoción entrenada en simulación con Isaac Gym o similar.' },
      { layer: 'Control', detail: 'Políticas de RL que mapean observaciones proprioceptivas y visuales en comandos articulares, ejecutadas a alta frecuencia en el controlador del robot.' },
      { layer: 'Planificación', detail: 'SDK abierto con servicios de movimiento, navegación y manejo de sensores; ejemplos en ROS 2 y Python.' },
      { layer: 'Aprendizaje', detail: 'RL masivo en simulación con randomización de parámetros y transferencia directa; la comunidad entrena y comparte políticas propias.' }
    ],
    sensors: ['IMU', 'Codificadores articulares', 'Cámara de profundidad', 'LIDAR opcional', 'Sensores de fuerza en pies'],
    compute: 'SoC embebido propio más Jetson opcional para visión; inferencia de la política de marcha en el controlador de bajo nivel.',
    control: 'Política neuronal de locomoción a cientos de hertz sobre comandos de velocidad, con estabilización aprendida y parada de seguridad.',
    learning: 'Reinforcement learning con sim-to-real y domain randomization; datasets y ejemplos abiertos para manos y manipulación.',
    lesson: 'Unitree demuestra que el coste y la apertura aceleran la investigación: un cuadrúpedo o humanoide asequible con SDK público permite probar RL de extremo a extremo en horas. La contrapartida es que la robustez depende mucho de la randomización en simulación y de probar en el robot real. Estos equipos hicieron que dominar la simulación fuera tan importante como soldar.',
    resources: [
      { label: 'Unitree Go2', url: 'https://www.unitree.com/go2/' },
      { label: 'Unitree G1', url: 'https://www.unitree.com/g1/' }
    ]
  },
  {
    id: 'dji-drones',
    name: 'Drones DJI (Mavic / Matrice)',
    category: 'drone',
    track: 'robotica',
    summary: 'Familia de multirrotores de DJI que llevan dos décadas afinando el control en cascada, la fusión de sensores y los protocolos de seguridad. Son la referencia comercial de fiabilidad en drones.',
    architecture: [
      { layer: 'Mecánica', detail: 'Cuadricóptero o hexacóptero con brazos plegables, hélices optimizadas y estabilizador mecánico de tres ejes para la cámara.' },
      { layer: 'Actuación', detail: 'Motores brushless controlados por ESC con modulación PWM de alta frecuencia; la respuesta del conjunto motor-hélice define el ancho de banda del control.' },
      { layer: 'Sensado', detail: 'IMU redundante, barómetro, magnetómetro, GNSS, sensores visuales de descenso y frontales, ultrasonido y sensores de obstáculos según modelo.' },
      { layer: 'Computación', detail: 'SoC propietario con DSP de visión para evitar obstáculos y procesar vídeo; el SDK expone telemetría y comandos de vuelo.' },
      { layer: 'Control', detail: 'Control en cascada: lazo interno de velocidad angular, lazo de actitud y lazo de posición, con fusión de IMU y GNSS mediante filtro complementario o de Kalman.' },
      { layer: 'Planificación', detail: 'Modos de vuelo asistido, waypoints, return-to-home y seguimiento de objetivo; cálculo de trayectorias suaves y respeto de geofences.' },
      { layer: 'Aprendizaje', detail: 'Poco aprendizaje a bordo: la navegación y la evitación de obstáculos usan visión por computador y reglas; el machine learning queda en funciones de reconocimiento.' }
    ],
    sensors: ['IMU redundante', 'GNSS/GPS', 'Barómetro y magnetómetro', 'Cámaras de visión y sensores de obstáculos', 'Ultrasonido'],
    compute: 'SoC con DSP de visión y procesador de vuelo; enlace de radio para telemetría y comandos desde el mando o una app.',
    control: 'PID en cascada (velocidad angular → actitud → posición) con ganancias ajustadas empíricamente y lógica de failsafe ante pérdida de señal.',
    learning: 'Principalmente control clásico y visión geométrica; aprendizaje automático en tareas puntuales como detección de objetos.',
    lesson: 'Los drones DJI son la prueba de que un control PID en cascada bien afinado sigue siendo imbatible para el vuelo estable. La verdadera sofisticación está en la redundancia de sensores y en los comportamientos de seguridad ante fallos. También enseñan que la latencia y la saturación de los actuadores importan más que la complejidad del algoritmo.',
    resources: [
      { label: 'DJI', url: 'https://www.dji.com/' },
      { label: 'DJI Developer', url: 'https://developer.dji.com/' }
    ]
  },
  {
    id: 'waymo',
    name: 'Waymo (Waymo One)',
    category: 'autonomo',
    track: 'ambos',
    summary: 'Servicio de conducción autónoma de Google con sensores propios y una enorme inversión en simulación y seguridad. Es el ejemplo de pila modular con lidar y validación basada en escenarios.',
    architecture: [
      { layer: 'Mecánica', detail: 'Vehículos de serie adaptados con sensores integrados en el techo y los laterales, con redundancia en frenos, dirección y alimentación.' },
      { layer: 'Actuación', detail: 'Interfaz con el bus CAN del vehículo para acelerar, frenar y girar, con actuadores redundantes y un modo de parada segura.' },
      { layer: 'Sensado', detail: 'Lidar de largo y corto alcance, cámaras de amplio rango y radar, con sincronización temporal precisa y calibración continua.' },
      { layer: 'Computación', detail: 'Plataforma de cómputo propia con aceleradores para inferencia; centros de datos para entrenamiento y simulación a gran escala.' },
      { layer: 'Control', detail: 'Planificación de trayectorias con MPC y control de bajo nivel del vehículo, respetando límites de aceleración y confort.' },
      { layer: 'Planificación', detail: 'Predicción del comportamiento de peatones y vehículos, planificación de maniobras y comportamiento definido dentro de un área operativa.' },
      { layer: 'Aprendizaje', detail: 'Percepción y predicción basadas en deep learning, con datos de flota real y simulación de escenarios difíciles (Waymo Sim).' }
    ],
    sensors: ['Lidar de 360 grados', 'Cámaras multirango', 'Radar', 'IMU y GNSS de alta precisión', 'Sensores de rueda'],
    compute: 'Ordenador de a bordo con GPU/ASIC para percepción y planificación; infraestructura de entrenamiento y simulación en la nube.',
    control: 'MPC para la trayectoria y controladores de dirección y frenado con redundancia; monitorización de fallos y parada mínima segura.',
    learning: 'Redes neuronales para detección, seguimiento y predicción, entrenadas con millones de kilómetros y escenarios sintéticos.',
    lesson: 'Waymo muestra que la conducción autónoma es un problema de sistemas tanto como de IA: la fusión lidar-cámara-radar y la sincronización sensorial son la base de la percepción. La simulación permite entrenar y validar casos raros que no caben en la carretera. El área operativa delimitada y la redundancia explican por qué la seguridad se diseña, no se improvisa.',
    resources: [
      { label: 'Waymo Technology', url: 'https://waymo.com/tech/' },
      { label: 'Waymo Safety', url: 'https://waymo.com/safety/' }
    ]
  },
  {
    id: 'tesla-fsd',
    name: 'Tesla Full Self-Driving (FSD)',
    category: 'autonomo',
    track: 'ambos',
    summary: 'Sistema de conducción asistida de Tesla que apuesta por visión pura, sin lidar, y por una pila neuronal entrenada con la flota global. Es el gran experimento de escalado de datos en robótica.',
    architecture: [
      { layer: 'Mecánica', detail: 'Vehículo de serie con ocho cámaras que cubren todo el entorno, sin sensores de telémetro láser en la configuración de producción.' },
      { layer: 'Actuación', detail: 'Control electrónico de dirección, aceleración y frenado mediante el bus del coche, con supervisión del conductor.' },
      { layer: 'Sensado', detail: 'Ocho cámaras de distintos campos de visión y, en la práctica, información de movimiento del vehículo; la profundidad se infiere de la visión.' },
      { layer: 'Computación', detail: 'Ordenador FSD propio con unos 144 TOPS de inferencia, alimentado por un clúster de entrenamiento y una canalización de datos de flota.' },
      { layer: 'Control', detail: 'La red produce trayectorias y comandos de conducción que un controlador convierte en entradas al vehículo, con limitaciones de aceleración.' },
      { layer: 'Planificación', detail: 'Redes de planificación y ocupación que integran mapa, visión y comportamiento previsto de otros agentes.' },
      { layer: 'Aprendizaje', detail: 'Aprendizaje supervisado a escala masiva con datos de conductor, entrenamiento en simulación y evolución hacia arquitecturas de extremo a extremo.' }
    ],
    sensors: ['8 cámaras envolventes', 'IMU y sensores de rueda', 'Señal de control del vehículo', 'Datos de mapa y navegación'],
    compute: 'Ordenador FSD a bordo para inferencia y clúster de entrenamiento central; ciclo de datos con modo shadow y selección de escenas.',
    control: 'Comandos de conducción generados por la red y ejecutados por el controlador del chasis, con supervisión activa del conductor.',
    learning: 'Imitación de conductores humanos y entrenamiento con datos de flota y simulación; arquitecturas neuronales que sustituyen módulos clásicos.',
    lesson: 'FSD plantea la apuesta de que, con suficientes datos y cómputo, una pila neuronal puede reemplazar módulos diseñados a mano. El reto no es solo el modelo, sino la canalización que encuentra, etiqueta y entrena con los casos raros de millones de kilómetros. Es un recordatorio de que en robótica la escala de datos puede ser una ventaja estructural frente a la percepción artesanal.',
    resources: [
      { label: 'Tesla Autopilot y FSD', url: 'https://www.tesla.com/autopilot' },
      { label: 'Tesla AI', url: 'https://www.tesla.com/AI' }
    ]
  },
  {
    id: 'amazon-kiva-proteus',
    name: 'Amazon Kiva / Proteus',
    category: 'industria',
    track: 'robotica',
    summary: 'Robots móviles de Amazon Robotics: los clásicos Kiva que levantan estanterías y Proteus, que se introduce bajo carros. Un caso de automatización logística coordinada a escala de almacén.',
    architecture: [
      { layer: 'Mecánica', detail: 'Kiva: plataforma baja con un mecanismo de elevación de estanterías. Proteus: chasis bajo que se desliza bajo carros y los acopla para arrastrarlos.' },
      { layer: 'Actuación', detail: 'Motores de tracción con ruedas omnidireccionales o diferenciales y mecanismos dedicados para elevar o enganchar la carga.' },
      { layer: 'Sensado', detail: 'Cámaras hacia el suelo con códigos o marcas de referencia, LIDAR y sensores de proximidad para detectar personas, carros y obstáculos.' },
      { layer: 'Computación', detail: 'Ordenador a bordo con navegación y comunicación inalámbrica con un sistema central de gestión de flota y tareas.' },
      { layer: 'Control', detail: 'Control de velocidad y dirección con frenado seguro; detección y parada ante personas en el camino, con zonas de velocidad reducida.' },
      { layer: 'Planificación', detail: 'El sistema central asigna tareas, calcula rutas y resuelve conflictos de tráfico entre cientos de robots simultáneos.' },
      { layer: 'Aprendizaje', detail: 'Principalmente optimización y reglas; los datos operativos alimentan mejoras de planificación y percepción, no políticas neuronales críticas.' }
    ],
    sensors: ['Cámara de suelo / marcadores', 'LIDAR', 'Sensores de proximidad y parachoques', 'Codificadores de rueda'],
    compute: 'Controlador embebido por robot más servidor central de flota; wifi industrial y monitorización de estado.',
    control: 'Navegación segura con parada ante obstáculos y personas; prioridad de paso y límites de velocidad por zona.',
    learning: 'Optimización de flotas y reglas de tráfico; aprendizaje fuera de línea sobre patrones de operación.',
    lesson: 'Kiva y Proteus enseñan que en logística el robot es solo una pieza: el valor está en el sistema que coordina cientos de unidades sin colisiones. La simplicidad mecánica y la navegación por marcas fiables ganaron frente a soluciones más vistosas. La seguridad con personas cerca obliga a diseñar paradas y velocidades restrictivas desde el principio.',
    resources: [
      { label: 'Amazon Robotics', url: 'https://www.amazonrobotics.com/' },
      { label: 'Amazon About', url: 'https://www.aboutamazon.com/' }
    ]
  },
  {
    id: 'fetch-robotics',
    name: 'Fetch Robotics (Fetch y Freight)',
    category: 'movil',
    track: 'robotica',
    summary: 'Plataforma de robots móviles y móviles-manipuladores basada en ROS, adquirida por Zebra. Fue un referente de cómo integrar navegación y brazos con herramientas abiertas.',
    architecture: [
      { layer: 'Mecánica', detail: 'Freight es una base móvil diferencial; Fetch añade un brazo de 7 grados de libertad, pinza y mástil con sensores.' },
      { layer: 'Actuación', detail: 'Motores de tracción y articulaciones del brazo con controladores propios expuestos mediante interfaces ROS.' },
      { layer: 'Sensado', detail: 'LIDAR 2D para navegación, cámara de profundidad en el mástil y en la muñeca, IMU, codificadores y sensor de fuerza en la pinza.' },
      { layer: 'Computación', detail: 'PC a bordo con Ubuntu y ROS, con paquetes oficiales fetch_ros y una consola de gestión de flota (FetchCore).' },
      { layer: 'Control', detail: 'Navigation stack de ROS para moverse y MoveIt para el brazo, con control separado de base y manipulador.' },
      { layer: 'Planificación', detail: 'Tareas de entrega y recogida con waypoints, gestión de flota y sincronización con sistemas externos mediante API.' },
      { layer: 'Aprendizaje', detail: 'Sin aprendizaje a bordo; la plataforma sirve como banco de pruebas para algoritmos de navegación y manipulación desarrollados por terceros.' }
    ],
    sensors: ['LIDAR 2D', 'Cámara de profundidad en mástil y muñeca', 'IMU', 'Codificadores', 'Sensor de fuerza en pinza'],
    compute: 'PC con Ubuntu y ROS en cada robot; servidor de flota para asignación y monitorización.',
    control: 'Nav stack y MoveIt con controladores de bajo nivel; parada de seguridad y evitación de obstáculos en la base.',
    learning: 'Uso principal de métodos clásicos; las políticas de aprendizaje se desarrollan como investigación externa sobre la plataforma.',
    lesson: 'Fetch mostró que ROS puede ser el pegamento de un producto real: navigation y MoveIt permitieron separar moverse de manipular con interfaces claras. La lección clave es arquitectural: un móvil-manipulador necesita coordinar dos sistemas con dinámicas muy distintas. La gestión de flota es parte del diseño, no un añadido.',
    resources: [
      { label: 'Fetch Robotics', url: 'https://fetchrobotics.com/' },
      { label: 'fetch_ros', url: 'https://github.com/fetchrobotics/fetch_ros' }
    ]
  },
  {
    id: 'seed-vla-pi0',
    name: 'Seed-VLA / Physical Intelligence π0',
    category: 'brazo',
    track: 'ambos',
    summary: 'Modelos visión-lenguaje-acción de propósito general: la familia π0 de Physical Intelligence y propuestas como Seed-VLA. Su idea es una sola política que acepta instrucciones y controla distintos robots.',
    architecture: [
      { layer: 'Mecánica', detail: 'No es un robot concreto: se implementa sobre brazos como Franka, UR5e o plataformas móviles manipuladoras, con distintas morfologías.' },
      { layer: 'Actuación', detail: 'La salida del modelo es un trozo de acciones continuas (action chunk) que se envía como comandos de articulación o de efector.' },
      { layer: 'Sensado', detail: 'Imágenes de una o varias cámaras, estado proprioceptivo (posición y velocidad de juntas) y texto de la instrucción.' },
      { layer: 'Computación', detail: 'Inferencia en GPU, típicamente en un servidor o PC potente; el robot ejecuta las acciones con su controlador local.' },
      { layer: 'Control', detail: 'El modelo predice secuencias de acciones que se interpolan o ejecutan a frecuencia moderada, por encima del lazo de servo.' },
      { layer: 'Planificación', detail: 'La instrucción en lenguaje y la observación visual condicionan la acción; la generalización se apoya en el preentrenamiento multimodal.' },
      { layer: 'Aprendizaje', detail: 'Flow matching sobre acciones continuas con un backbone visión-lenguaje; entrenamiento con demostraciones de muchas tareas y robots.' }
    ],
    sensors: ['Cámaras RGB múltiples', 'Estado proprioceptivo de articulaciones', 'Instrucciones en lenguaje natural'],
    compute: 'GPU para el modelo VLA; controlador del robot ejecutando los trozos de acción con su propio lazo en tiempo real.',
    control: 'Action chunking: el modelo emite bloques de acciones continuas mediante flow matching y el robot las sigue con interpolación.',
    learning: 'Preentrenamiento visión-lenguaje más ajuste con demostraciones; flow matching y difusión para modelar distribuciones de acciones.',
    lesson: 'π0 y Seed-VLA muestran que la acción continua se puede modelar como un problema generativo, no solo como tokens discretos. El action chunking reduce la frecuencia de inferencia necesaria y suaviza el movimiento. La promesa es una política que generaliza entre robots y tareas, aunque todavía depende de datos reales y de un controlador local fiable.',
    resources: [
      { label: 'Physical Intelligence (π0)', url: 'https://www.physicalintelligence.company/blog/pi0' },
      { label: 'openpi', url: 'https://github.com/Physical-Intelligence/openpi' }
    ]
  },
  {
    id: 'rt2-palm-e',
    name: 'RT-2 y PaLM-E (Google DeepMind)',
    category: 'brazo',
    track: 'ai',
    summary: 'Dos hitos de la robótica con modelos fundacionales: RT-2 convierte acciones en tokens de texto y PaLM-E inyecta datos sensoriales en un modelo de lenguaje de gran escala.',
    architecture: [
      { layer: 'Mecánica', detail: 'Se evaluaron principalmente brazos de laboratorio con pinzas, en mesas y entornos de cocina y oficina.' },
      { layer: 'Actuación', detail: 'Comandos de movimiento discretos o de bajo nivel que se traducen en traslaciones y rotaciones del efector.' },
      { layer: 'Sensado', detail: 'Cámara RGB y, en PaLM-E, cualquier modalidad sensorial (imágenes, profundidad, estado) incrustada como vectores en el modelo.' },
      { layer: 'Computación', detail: 'Inferencia en GPU en estaciones de trabajo o en la nube; el robot ejecuta las acciones con su controlador habitual.' },
      { layer: 'Control', detail: 'RT-2 emite tokens que codifican acciones; un decodificador las convierte en comandos ejecutables por el robot.' },
      { layer: 'Planificación', detail: 'Razonamiento semántico: el modelo interpreta instrucciones como pon la manzana en el cuenco y decide la secuencia de acciones.' },
      { layer: 'Aprendizaje', detail: 'Co-fine-tuning con datos de robot y de web; PaLM-E entrena un modelo multimodal de decenas o cientos de miles de millones de parámetros.' }
    ],
    sensors: ['Cámara RGB', 'Entradas de lenguaje', 'Estado del robot', 'Señales sensoriales incrustadas en PaLM-E'],
    compute: 'Modelos grandes en GPU; el bucle de control real se ejecuta en el robot por separado.',
    control: 'Acciones discretizadas como tokens, decodificadas a movimientos del brazo con un controlador clásico por debajo.',
    learning: 'Aprendizaje multimodal a gran escala que transfiere conocimiento de internet a tareas físicas y razonamiento semántico.',
    lesson: 'RT-2 y PaLM-E establecieron que un modelo entrenado con texto e imágenes puede controlar un robot si las acciones se representan como tokens o incrustaciones. El resultado más importante fue la generalización semántica: entender objetos y verbos nunca vistos en datos de robot. Su límite también es instructivo: la frecuencia y la precisión del control siguen dependiendo de un controlador clásico por debajo.',
    resources: [
      { label: 'RT-2 (DeepMind)', url: 'https://deepmind.google/discover/blog/rt-2-new-model-translates-vision-and-language-into-robot-actions/' },
      { label: 'PaLM-E (DeepMind)', url: 'https://deepmind.google/discover/blog/palm-e-an-embodied-multimodal-language-model-that-can-think-and-speak/' }
    ]
  },
  {
    id: 'helix',
    name: 'Helix (OpenAI / Figure)',
    category: 'humanoide',
    track: 'ambos',
    summary: 'Modelo visión-lenguaje-acción para el humanoide Figure que separa un sistema lento de razonamiento de un sistema rápido de control continuo. Publicado en 2025 como arquitectura de dos niveles.',
    architecture: [
      { layer: 'Mecánica', detail: 'Se ejecuta en Figure 02, con brazos y manos articuladas que requieren control fino y coordinación con el torso.' },
      { layer: 'Actuación', detail: 'Acciones continuas para articulaciones del brazo, mano y tronco, con comandos de alta frecuencia al controlador del robot.' },
      { layer: 'Sensado', detail: 'Cámaras RGB múltiples, estado proprioceptivo y entrada de lenguaje; visión de las manos para tareas de contacto.' },
      { layer: 'Computación', detail: 'Dos redes a bordo: un VLM de varios miles de millones de parámetros y una política visuomotora ligera que corre a cientos de hertz.' },
      { layer: 'Control', detail: 'System 1 genera acciones a ~200 Hz; System 2 interpreta la escena y las instrucciones a unos pocos hertz y actualiza las representaciones.' },
      { layer: 'Planificación', detail: 'El sistema lento decide qué tarea hacer y provee contexto semántico; el rápido ejecuta movimientos reactivos y corrige en tiempo real.' },
      { layer: 'Aprendizaje', detail: 'Entrenamiento conjunto de ambos sistemas con datos de robots y tareas domésticas e industriales; el modelo aprende de demostraciones y lenguaje.' }
    ],
    sensors: ['Cámaras RGB multivista', 'Estado proprioceptivo', 'Visión de manos', 'Instrucciones en lenguaje'],
    compute: 'VLM (System 2) a baja frecuencia y política visuomotora (System 1) a alta frecuencia en el mismo robot.',
    control: 'Bucle jerárquico: el sistema rápido emite comandos de cuerpo completo a ~200 Hz mientras el lento razona a ~7-9 Hz.',
    learning: 'Aprendizaje de extremo a extremo con pares visión-lenguaje-acción y demostraciones, con el VLM guiando a la política rápida.',
    lesson: 'Helix aclara por qué un VLA grande no puede controlar un robot directamente: su frecuencia es demasiado baja. La solución es una arquitectura de dos velocidades, con semántica lenta y control reactivo rápido acoplados. Es el patrón que probablemente se repita en humanoides: el modelo entiende la tarea, pero una política ligera mantiene el equilibrio y corrige el contacto.',
    resources: [
      { label: 'Helix (Figure)', url: 'https://www.figure.ai/news/helix' },
      { label: 'Figure AI', url: 'https://www.figure.ai/' }
    ]
  },
  {
    id: 'isaac-groot',
    name: 'NVIDIA Isaac GR00T',
    category: 'humanoide',
    track: 'ambos',
    summary: 'Familia de modelos fundacionales y herramientas de NVIDIA para humanoides: GR00T N1 es un VLA abierto entrenado con datos sintéticos y reales, apoyado en Isaac Sim, Isaac Lab y Jetson.',
    architecture: [
      { layer: 'Mecánica', detail: 'Pensado para humanoides y manipuladores variados; el modelo se adapta a distintas encarnaciones mediante entradas de estado y visión.' },
      { layer: 'Actuación', detail: 'Predice acciones continuas con un transformer de difusión que se envían al controlador del robot como comandos articulares.' },
      { layer: 'Sensado', detail: 'Imágenes de cámaras externas y de la muñeca, lenguaje y estado proprioceptivo; en simulación se generan datos con dominio aleatorizado.' },
      { layer: 'Computación', detail: 'Entrenamiento en GPU de centro de datos con Isaac Lab y despliegue en Jetson Thor u otros ordenadores embebidos de NVIDIA.' },
      { layer: 'Control', detail: 'El modelo corre por encima del controlador en tiempo real, que ejecuta las acciones y mantiene estabilidad y límites de seguridad.' },
      { layer: 'Planificación', detail: 'Instrucciones en lenguaje y observaciones visuales condicionan la acción; la simulación permite entrenar tareas antes de pasar al robot.' },
      { layer: 'Aprendizaje', detail: 'Imitación con datos reales y sintéticos, generación de datos con modelos generativos y ajuste por encarnación.' }
    ],
    sensors: ['Cámaras RGB y de muñeca', 'Estado proprioceptivo', 'Lenguaje', 'Datos sintéticos de Isaac Sim'],
    compute: 'GPU para entrenamiento y simulación; Jetson a bordo para inferencia con modelos optimizados (TensorRT).',
    control: 'Acciones de difusión decodificadas a comandos del robot; el control de bajo nivel sigue siendo responsabilidad del firmware.',
    learning: 'Modelo fundacional VLA con difusión, preentrenamiento multimodal y simulación masiva para reducir datos reales.',
    lesson: 'GR00T muestra que la estrategia de plataforma en robótica es simulación, datos sintéticos y un modelo reutilizable entre robots. La apertura del modelo y las herramientas de Isaac bajan la barrera para entrenar humanoides sin flota propia. La lección técnica es que el cuello de botella ya es la calidad y diversidad de los datos de manipulación, no la arquitectura del modelo.',
    resources: [
      { label: 'NVIDIA Isaac GR00T', url: 'https://developer.nvidia.com/isaac-groot' },
      { label: 'Isaac-GR00T en GitHub', url: 'https://github.com/NVIDIA/Isaac-GR00T' }
    ]
  },
  {
    id: 'universal-robots',
    name: 'Universal Robots (familia UR y ecosistema UR+)',
    category: 'industria',
    track: 'robotica',
    summary: 'La empresa danesa que popularizó el cobot como producto. Más allá de un modelo concreto, su aportación fue un modelo de programación, seguridad certificada y un ecosistema de accesorios reutilizable.',
    architecture: [
      { layer: 'Mecánica', detail: 'Familia de brazos de 6 ejes (UR3e, UR5e, UR10e y posteriores) con la misma arquitectura mecánica y distintos tamaños y cargas.' },
      { layer: 'Actuación', detail: 'Módulos de articulación reemplazables con motor, reductor, freno y electrónica integrados, lo que simplifica el servicio en planta.' },
      { layer: 'Sensado', detail: 'Codificadores articulares y sensor de fuerza/par en la brida; entradas para pinzas, visión y dispositivos de seguridad externos.' },
      { layer: 'Computación', detail: 'Controlador que ejecuta URScript y expone interfaces Ethernet/IP, PROFINET, Modbus TCP y un driver ROS 2 oficial.' },
      { layer: 'Control', detail: 'Servo en tiempo real con perfiles de movimiento suaves, control por fuerza y funciones de seguridad monitorizada certificadas.' },
      { layer: 'Planificación', detail: 'Teach pendant con programación por arrastrar y enseñar, además de scripts para lógica, E/S y comunicaciones.' },
      { layer: 'Aprendizaje', detail: 'El robot no aprende por sí mismo: la inteligencia vive en el programa, los URCaps y los sistemas externos que se conectan.' }
    ],
    sensors: ['Codificadores articulares', 'Sensor F/T en brida', 'E/S digitales y analógicas', 'Entradas de seguridad'],
    compute: 'Controlador industrial con dos niveles: servo determinista e intérprete de URScript; integración con ROS 2 y PLC.',
    control: 'Control de movimiento y fuerza con límites de seguridad monitorizados y paradas de emergencia certificadas.',
    learning: 'Sin aprendizaje interno; el valor está en la facilidad de integración y en la compatibilidad con herramientas de IA externas.',
    lesson: 'Universal Robots enseñó que hacer un robot fácil de programar y seguro puede valer más que aumentar su rendimiento. La familia comparte arquitectura, lo que reduce el coste de soporte y facilita cambiar de modelo. El ecosistema de complementos convirtió el brazo en una plataforma: la innovación la hacen los integradores, no solo el fabricante.',
    resources: [
      { label: 'Universal Robots', url: 'https://www.universal-robots.com/' },
      { label: 'Ecosistema UR+', url: 'https://www.universal-robots.com/urplus/' }
    ]
  },
  {
    id: 'agrobot-cosecha',
    name: 'Agrobot (cosecha de fresas)',
    category: 'industria',
    track: 'ambos',
    summary: 'Robot agrícola de la empresa española Agrobot para recolectar fresas en campo abierto o invernadero. Combina visión para decidir madurez con múltiples brazos que cortan y depositan el fruto.',
    architecture: [
      { layer: 'Mecánica', detail: 'Plataforma móvil con pasillos entre plantas y una estructura con numerosos brazos de recolección que trabajan en paralelo.' },
      { layer: 'Actuación', detail: 'Brazos con articulaciones eléctricas y pinzas o cuchillos de corte diseñados para separar el fruto sin dañarlo.' },
      { layer: 'Sensado', detail: 'Cámaras de color e iluminación controlada para clasificar madurez, sensores de posición y detectores de presencia de fruta.' },
      { layer: 'Computación', detail: 'Ordenador industrial a bordo que ejecuta los modelos de visión y coordina los brazos, con telemetría para el operador.' },
      { layer: 'Control', detail: 'Sincronización entre el avance de la plataforma y el movimiento de cada brazo, con trayectorias calculadas desde la imagen.' },
      { layer: 'Planificación', detail: 'Priorización de frutos por madurez y posición, asignación de brazos y gestión de contenedores de salida.' },
      { layer: 'Aprendizaje', detail: 'Clasificadores y modelos de visión entrenados con imágenes de frutos en distintas condiciones de luz y estado de maduración.' }
    ],
    sensors: ['Cámaras RGB con iluminación controlada', 'Sensores de posición de brazo', 'Detectores de fruto', 'Sensores de avance de la plataforma'],
    compute: 'PC industrial con GPU ligera para inferencia de visión y control de los brazos en el mismo chasis.',
    control: 'Control de posición de los brazos con corrección visual, ajustando la trayectoria al punto de corte detectado.',
    learning: 'Visión por computador y clasificación supervisada para estimar madurez y localizar frutos en escenas variables.',
    lesson: 'La cosecha es el ejemplo más duro de percepción en entornos no estructurados: luz cambiante, oclusiones y frutos frágiles. Agrobot resuelve el problema repitiendo brazos baratos en paralelo en lugar de buscar un solo manipulador perfecto. La lección económica es decisiva: la línea entre un prototipo y un producto la marca el coste por kilo recolectado, no la precisión del brazo.',
    resources: [
      { label: 'Agrobot', url: 'https://agrobot.com/' }
    ]
  },
  {
    id: 'da-vinci',
    name: 'Sistema quirúrgico da Vinci (Intuitive Surgical)',
    category: 'brazo',
    track: 'robotica',
    summary: 'Sistema de cirugía robótica maestro-esclavo con consola para el cirujano, carro de pacientes con varios brazos e instrumentos articulados. Es el estándar de teleoperación de precisión en medicina.',
    architecture: [
      { layer: 'Mecánica', detail: 'Carro con hasta cuatro brazos sujetos a trocares de pequeño diámetro e instrumentos de siete grados de libertad con articulación en la punta.' },
      { layer: 'Actuación', detail: 'Transmisión por cables y poleas que permite instrumentos delgados y articulados, con motores en el carro y movimiento transmitido al interior del paciente.' },
      { layer: 'Sensado', detail: 'Endoscopio estereoscópico de alta resolución, sensores de posición en mandos y brazos; modelos recientes incorporan retroalimentación de fuerza.' },
      { layer: 'Computación', detail: 'Sistema dedicado y certificado que procesa la visión 3D y ejecuta el mapeo de movimientos con redundancia y supervisión continua.' },
      { layer: 'Control', detail: 'Teleoperación maestro-esclavo con escalado de movimiento, filtrado de temblor y punto remoto de rotación fijo en la pared abdominal.' },
      { layer: 'Planificación', detail: 'El cirujano planifica cada movimiento en tiempo real; el sistema limita el espacio de trabajo y mantiene la orientación segura de los instrumentos.' },
      { layer: 'Aprendizaje', detail: 'Sin aprendizaje automático en el lazo de control crítico; la automatización se limita a funciones asistidas y dispositivos específicos.' }
    ],
    sensors: ['Endoscopio 3D estereoscópico', 'Sensores de posición de mandos e instrumentos', 'Sensores de fuerza en versiones recientes', 'Pedales e interruptores de consola'],
    compute: 'Ordenador embebido certificado con procesamiento de vídeo y control determinista de los brazos.',
    control: 'Mapeo de consola a instrumento con escalado, supresión de temblor y restricción de centro remoto de movimiento.',
    learning: 'Sin RL en el control; la precisión viene de diseño mecánico, calibración y supervisión humana experta.',
    lesson: 'da Vinci es la referencia de teleoperación de alta precisión: escalar el movimiento y filtrar el temblor permite al cirujano trabajar por debajo de la resolución de su propia mano. El centro remoto de movimiento protege al paciente al mantener el instrumento pivotando en el trocar. Su historia también muestra una lección de diseño: durante años se prescindió del feedback de fuerza confiando solo en la visión, y las versiones recientes lo han recuperado.',
    resources: [
      { label: 'Sistema da Vinci', url: 'https://www.intuitive.com/en-us/products-and-services/da-vinci' },
      { label: 'Intuitive Surgical', url: 'https://www.intuitive.com/en-us' }
    ]
  }
];
