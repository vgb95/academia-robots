import { leccion as L, modulo as M, err, q, p, apunte, nota, aviso, codigo, diagrama, tabla, lista, pasos, formula, widget, enlace } from '../helpers';
import type { Module } from '../../types';

export const physicalModules: Module[] = [

  // -------------------- P0: EL CUERPO COMO DATO --------------------
  M('p0', 'El cuerpo como dato', 'Por qué escalar texto no basta para mover un brazo', [
    L({
      id: 'p0-1', title: 'Por qué escalar texto no basta', min: 12, level: 'inicial',
      objectives: ['Entender qué aprende un modelo entrenado con texto y qué no', 'Identificar el salto que exige el mundo físico'],
      blocks: [
        p('Un modelo de lenguaje aprende a predecir el siguiente token. Con suficientes parámetros y suficiente texto, esa tarea se vuelve muy buena. Pero predecir la palabra "pinza" no dice nada sobre qué ocurre cuando dos dedos de metal aprieta un cubo blando.'),
        apunte('El límite del texto', 'El texto es una señal ya comprimida por seres humanos. El mundo físico no viene con etiquetas: hay que medirlo. Un LLM no puede scrapear internet para descubrir la fricción de tu mesa, porque esa información no está escrita en ninguna parte.'),
        diagrama('multimodal', 'Del texto a los sensores: la misma arquitectura, una señal muy distinta.'),
        tabla(['Pregunta', 'Texto', 'Mundo físico'], [
          ['¿Dónde está la taza?', 'Lo describe', 'Hay que medirlo'],
          ['¿Qué pasa si la suelto?', 'Lo imagina', 'Cae, rebota o se rompe'],
          ['¿Cuánto cuesta el error?', 'Cero', 'Un servo quemado']
        ]),
        p('Escalar texto mejora la fluentidez. No garantiza grounding, ni estabilidad, ni sentido del tiempo. En robótica el error no es una respuesta rara: es una colisión.'),
        nota('Esto no es un ataque a los LLM. Es un recordatorio de que su señal de entrenamiento y la señal del robot son cosas distintas.'),
        enlace('https://huggingface.co/lerobot', 'LeRobot', 'La librería abierta que veremos para conectar modelos y brazos reales.')
      ],
      errors: [err('El modelo explica perfectamente la tarea pero el brazo no se mueve', 'Confundir competencia verbal con competencia motora', 'Separa siempre dos preguntas: qué sabe decir y qué sabe hacer. Mide la segunda con episodios reales.')],
      practice: { task: 'Escribe una tarea cotidiana (abrir una puerta) y separa en dos columnas lo que un LLM puede describir y lo que solo se descubre midiendo con sensores. Menciona al menos tres magnitudes medibles.', success: ['Tres magnitudes concretas como fuerza, par o posición', 'Explicas por qué el texto no las contiene', 'No usas la palabra "entiende" sin definirla'] },
      quiz: [q('Según esta lección, ¿qué limitación fundamental tiene escalar solo texto?', ['Que los modelos son demasiado caros', 'Que el texto no contiene la información física que hay que medir', 'Que los LLM no saben escribir', 'Que internet se acaba'], 1, 'El texto está comprimido por humanos; la fricción, la dinámica y los contactos requieren sensores y datos del mundo real.')]
    }),
    L({
      id: 'p0-2', title: 'Grounding: anclar palabras al mundo', min: 14,
      objectives: ['Definir grounding como correspondencia entre símbolos y observaciones', 'Leer una política como función de imagen, instrucción y acción'],
      blocks: [
        p('Grounding es la correspondencia entre una instrucción y algo observable. "Apila el cubo rojo sobre el azul" solo tiene sentido si el modelo puede distinguir rojo de azul en su cámara y traducir esa diferencia en movimientos.'),
        formula('π(aₜ | oₜ, l) = P(acción en t | observación en t, instrucción)', 'La política es una distribución sobre acciones condicionada por lo que ve y por lo que le pides.'),
        diagrama('multimodal', 'La imagen y la instrucción se alinean antes de producir una acción.'),
        apunte('Grounding no es etiquetar', 'Un detector que dice "cubo rojo" no resuelve por sí solo la tarea. El grounding útil en robótica es el que termina en un comando de motor: si no cambia la acción, no ha cerrado el lazo.'),
        tabla(['Nivel', 'Qué hace', 'Ejemplo'], [
          ['Detección', 'Nombra objetos', 'Hay un cubo rojo'],
          ['Referencia', 'Resuelve la instrucción', 'El rojo es el de la izquierda'],
          ['Acción', 'Mueve el efector', 'Cerrar pinza y subir 8 cm']
        ]),
        p('En un VLA la misma red hace los tres pasos de forma implícita. Eso es cómodo y también opaco: cuando falla, no sabes si falló la visión, el lenguaje o el control.'),
        aviso('Cuidado con las demostraciones grabadas siempre con la misma frase. El modelo puede memorizar la instrucción y ignorarla: parece grounding, es solo correlación.')
      ],
      errors: [err('El robot obedece solo si repites la frase exacta del dataset', 'La instrucción está memorizada, no comprendida', 'Varía sinónimos, orden de palabras y posición de los objetos en las demostraciones.')],
      practice: { task: 'Diseña 5 variantes de la instrucción "apila el cubo rojo sobre el azul" que cambien color, posición y verbo sin cambiar la tarea. Explica qué error de grounding detectaría cada una.', success: ['Las 5 variantes son gramaticalmente distintas', 'Identificas qué se mantiene invariante', 'Nombras un fallo observable por variante'] },
      quiz: [q('¿Qué distingue el grounding útil en robótica de un simple etiquetado de objetos?', ['Que usa una cámara', 'Que la referencia termina afectando a la acción del robot', 'Que usa un LLM', 'Que funciona offline'], 1, 'Etiquetar no cierra el lazo: solo hay grounding útil cuando la percepción determina el movimiento.')]
    }),
    L({
      id: 'p0-3', title: 'La morfología importa', min: 13,
      objectives: ['Entender por qué el cuerpo condiciona la inteligencia', 'Comparar plataformas con distintos grados de libertad'],
      blocks: [
        p('La inteligencia no flota: vive en un cuerpo con masa, límites articulares y sensores concretos. Un brazo con 6 grados de libertad no aprende lo mismo que uno con 5, y un cuadrúpedo no aprende lo mismo que una pinza de dos dedos.'),
        diagrama('so101', 'El SO-101: un par leader/follower con servos que reportan posición.'),
        diagrama('subactuado', 'Cuando hay menos actuadores que grados de libertad, el cuerpo decide qué es posible.'),
        apunte('Encarnación con consecuencias', 'La morfología filtra el espacio de acciones: un dedo blando puede agarrar una fresa sin aplastarla; una pinza rígida necesita control de fuerza. Cambiar el hardware cambia la tarea, aunque la instrucción sea la misma.'),
        tabla(['Plataforma', 'Grados típicos', 'Consecuencia'], [
          ['SO-101', '5 + pinza', 'Barato, limitado en orientación'],
          ['Brazo industrial 6 ejes', '6', 'Alcanza cualquier pose, caro'],
          ['Mano multi-dedo', '20+', 'Rico en contacto, difícil de simular']
        ]),
        lista(['Mide siempre los límites articulares antes de entrenar.', 'Un cambio de pinza invalida parte de los datos previos.', 'La morfología define la recompensa implícita de la tarea.']),
        nota('Por eso los modelos cross-embodiment se entrenan con muchas morfologías: para que no se especialicen en un solo cuerpo.')
      ],
      errors: [err('Una política entrenada en un brazo falla en otro "parecido"', 'La morfología cambió los límites y la cinemática', 'Reentrena o fine-tunea con datos del nuevo cuerpo; no asumas transferencia por parecido visual.')],
      practice: { task: 'Elige dos plataformas distintas para la misma tarea de recoger una taza. Escribe tres diferencias morfológicas y predice en cuál será más fácil y por qué.', success: ['Tres diferencias concretas con números o grados', 'Predicción justificada con la cinemática', 'Mencionas una consecuencia en el dataset'] },
      quiz: [q('¿Por qué cambiar la pinza puede invalidar parte de un dataset?', ['Porque el color del robot cambia', 'Porque el espacio de acciones y los contactos son distintos', 'Porque el código deja de compilar', 'Porque la cámara se descalibra siempre'], 1, 'La morfología define qué acciones existen y cómo se producen los contactos; los datos describen ese cuerpo concreto.')]
    }),
    L({
      id: 'p0-4', title: 'Retroalimentación: el lazo que cierra', min: 15,
      objectives: ['Distinguir control abierto y cerrado', 'Leer una política como un bucle con observación continua'],
      blocks: [
        p('En lazo abierto mandas una secuencia de comandos y esperas. En lazo cerrado mides, comparas y corriges. Cualquier robot útil vive en el segundo régimen: sin realimentación, el más mínimo deslizamiento acumula error.'),
        diagrama('pid', 'Setpoint, error, controlador, planta y realimentación.'),
        formula('eₜ = objetivo − observaciónₜ        uₜ =_controlador(eₜ)', 'La acción se recalcula en cada ciclo, no una sola vez al principio.'),
        widget('pwm'),
        apunte('La frecuencia también es información', 'Un lazo a 50 Hz ve el mundo cada 20 ms. Un lazo a 5 Hz llega tarde a un contacto. En robot learning la política sustituye al controlador clásico, pero no puede sustituir al reloj: la periodicidad sigue siendo un requisito.'),
        tabla(['Régimen', 'Ventaja', 'Riesgo'], [
          ['Abierto', 'Simple, predecible', 'Deriva y colisión'],
          ['Cerrado', 'Corrige errores', 'Inestabilidad si el control es agresivo'],
          ['Cerrado con retardo', 'Realista', 'Oscilación por inferencia lenta']
        ]),
        aviso('Si la inferencia tarda más que el periodo de control, el lazo se vuelve inestable. Mide el p95 de latencia, no la media.')
      ],
      errors: [err('El brazo llega siempre 2 cm corto', 'La política ejecuta un plan en abierto sin corregir con la observación actual', 'Realimenta la pose medida en cada paso y replanea el resto del movimiento.')],
      practice: { task: 'Explica con tus palabras qué cambia si el lazo pasa de 50 Hz a 5 Hz durante una tarea de acercar la pinza a un cubo. Da un número: cuántos centímetros se mueve un efector a 10 cm/s en cada periodo.', success: ['Calculas 2 cm a 5 Hz y 0.2 cm a 50 Hz', 'Relacionas periodo con error acumulado', 'Mencionas el retardo de inferencia'] },
      quiz: [q('Un efector se mueve a 10 cm/s. ¿Cuánto avanza en un periodo de control de 5 Hz?', ['0.2 cm', '2 cm', '10 cm', '50 cm'], 1, 'El periodo es 1/5 s = 0.2 s; a 10 cm/s son 2 cm entre correcciones. A 50 Hz solo serían 0.2 cm.')]
    }),
    L({
      id: 'p0-5', title: 'Del LLM al agente encarnado', min: 16,
      objectives: ['Ver el paso de razonar en texto a actuar en el mundo', 'Situar al VLA dentro del agente encarnado'],
      blocks: [
        p('Un agente de software razona, llama a una herramienta y lee un resultado. Un agente encarnado hace lo mismo, pero su herramienta es un motor y su resultado es una cámara. La diferencia está en el coste del error y en el reloj.'),
        diagrama('agentes', 'Objetivo, razonar, actuar, observar y repetir: el mismo bucle, con hardware dentro.'),
        diagrama('vla', 'El VLA comprime percepción, lenguaje y acción en una sola red.'),
        tabla(['Agente de software', 'Agente encarnado'], [
          ['Herramienta: API', 'Herramienta: brazo'],
          ['Error: excepción', 'Error: colisión'],
          ['Sin reloj estricto', 'Requiere 50 Hz'],
          ['Estado en archivos', 'Estado en sensores']
        ]),
        apunte('Dos arquitecturas', 'Puedes poner un LLM arriba que descompone la tarea y un VLA abajo que ejecuta, o un VLA único que hace todo. La primera es interpretable y lenta; la segunda es rápida y opaca. Ambas existen en producción.'),
        nota('El marco útil no es "LLM o robot", sino dónde pones la frontera entre planificar y reaccionar.'),
        aviso('Un LLM que escribe "mueve la pinza 5 cm" no ha movido nada. Necesitas un traductor a comandos reales, y ese traductor es la política.')
      ],
      errors: [err('El agente planea bien pero se queda sin tiempo para actuar', 'El planificador ocupa todo el presupuesto de cómputo', 'Separa planificación lenta de ejecución rápida y reserva el ciclo de control para la política.')],
      practice: { task: 'Dibuja un sistema con un planificador de alto nivel y una política de bajo nivel para "poner la taza en el estante". Escribe qué frecuencia tiene cada uno y qué pasa si el planificador falla.', success: ['Dos frecuencias distintas y justificadas', 'La política sigue activa si el plan falla', 'Nombras una señal que cruza la frontera'] },
      quiz: [q('¿Cuál es la diferencia principal entre un agente de software y uno encarnado?', ['Que el primero usa Python', 'Que el segundo actúa sobre hardware con reloj y coste físico del error', 'Que el segundo no usa modelos', 'Que el primero no tiene memoria'], 1, 'La herramienta es un motor, el error es una colisión y el ciclo de control impone un presupuesto de tiempo.')]
    }),
    L({
      id: 'p0-6', title: 'Taxonomía de tareas físicas', min: 14,
      objectives: ['Clasificar tareas de manipulación por dificultad y tipo de contacto', 'Elegir métricas según la familia de tareas'],
      blocks: [
        p('No todas las tareas son "coger y soltar". Agruparlas bien evita comparar manzanas con peras al leer un paper o al diseñar un benchmark.'),
        tabla(['Familia', 'Ejemplo', 'Dificultad principal'], [
          ['Reach', 'Tocar un punto', 'Precisión'],
          ['Pick and place', 'Cubo de A a B', 'Agarre y suelta'],
          ['Push / slide', 'Desplazar sin levantar', 'Contacto continuo'],
          ['Insert', 'Pernil en taladro', 'Tolerancias milimétricas'],
          ['Deformable', 'Doblar ropa', 'Modelo desconocido'],
          ['Locomotion', 'Marcha', 'Estabilidad dinámica']
        ]),
        diagrama('fuerza', 'Control de posición frente a control de fuerza: la familia de tarea decide cuál necesitas.'),
        diagrama('subactuado', 'La marcha es subactuada: no puedes simplemente "posicionar" el cuerpo.'),
        apunte('Dónde está la dificultad', 'En insertar y en tareas deformables el fallo no está en la visión, sino en el contacto. Ahí el control de fuerza y la impedancia importan más que unos puntos de exactitud extra en el detector.'),
        lista(['Para reach: distancia final al objetivo.', 'Para pick and place: tasa de éxito y tiempo.', 'Para insert: fuerza máxima y número de intentos.', 'Para locomotion: distancia recorrida sin caer.'], true),
        nota('Esta taxonomía es una herramienta de conversación: te permite preguntar "¿de qué familia es esta tarea?" antes de elegir modelo.')
      ],
      errors: [err('Comparas tu tasa de éxito en pick and place con la de un paper de inserción', 'Familias de tareas distintas con métricas distintas', 'Compara solo dentro de la misma familia y con el mismo protocolo de semillas.')],
      practice: { task: 'Clasifica cinco tareas de tu entorno en la tabla y escribe una métrica principal y una de seguridad para cada una.', success: ['Cinco tareas clasificadas', 'Métrica principal y de seguridad por tarea', 'Justificas una familia difícil'] },
      quiz: [q('¿Qué familia de tareas pone el énfasis en el control de fuerza más que en la precisión de posición?', ['Reach', 'Inserción y objetos deformables', 'Clasificación por color', 'Lectura de un código de barras'], 1, 'En contacto prolongado o incierto, la impedancia y la fuerza mandan; la posición exacta no basta.')]
    }),
    L({
      id: 'p0-7', title: 'Lo que el paper no dice: historia y números reales', min: 17, level: 'intermedio',
      objectives: ['Situar los VLA en la historia de la robótica', 'Leer tasas de éxito con escepticismo'],
      blocks: [
        p('De los brazos teleoperados de los años 50 a Shakey, y de los controladores clásicos a los VLA, la promesa ha sido siempre la misma: que la máquina aprenda lo que antes programábamos. La diferencia hoy es el tamaño de los modelos y la baratura del hardware.'),
        tabla(['Época', 'Idea dominante', 'Límite real'], [
          ['Años 60–80', 'Planificación simbólica', 'Mundo desconocido'],
          ['Años 90–2010', 'Control y percepcion estadística', 'Poca generalización'],
          ['2015–2023', 'Imitación con deep learning', 'Datos caros'],
          ['2024 en adelante', 'VLA y modelos fundacionales', 'Latencia y fiabilidad']
        ]),
        apunte('Lo que el paper no dice', 'Un vídeo de 20 segundos con el mejor intento no es una tasa de éxito. Pregunta siempre: ¿cuántos episodios, con qué semillas, con cuántos objetos nuevos y cuántas veces falló antes de grabar? Sin esas cuatro respuestas, el número es marketing.'),
        aviso('Típico: un artículo anuncia 90 por ciento de éxito con la configuración exacta del entrenamiento. Con objetos, luz y semillas nuevas, la misma política baja a 60–70 por ciento. Ese descenso no es un detalle: es el resultado.'),
        lista(['Coste de datos: cada demostración real son minutos de teleoperación pagados.', 'Coste de fallo: un servo quemado y una pieza rota no salen en la tabla.', 'Coste de tiempo: evaluar 100 episodios de verdad lleva horas.'], true),
        p('La honestidad no resta valor al campo: lo hace más serio. Un sistema con 75 por ciento medido de verdad es más útil que uno con 95 por ciento anunciado sin protocolo.'),
        nota('Regla personal: escribe el número malo en tu README antes que el bueno. El malo es el que otros necesitan para decidir.')
      ],
      errors: [err('Repites la cifra del resumen en una presentación', 'No comprobaste el protocolo de evaluación', 'Añade siempre episodios, semillas, objetos y condiciones de luz antes de citar un porcentaje.')],
      practice: { task: 'Busca un paper de manipulación y escribe su tasa de éxito junto a cuatro datos que el resumen no dé: episodios, semillas, variación de objetos y coste de datos. Si no los encuentras, anótalo como "no reportado".', success: ['Cuatro campos completos o marcados como no reportados', 'Separas el vídeo del resultado medido', 'Escribes una frase de cautela'] },
      quiz: [q('¿Qué deberías exigir antes de creerte una tasa de éxito del 95 por ciento?', ['Que el vídeo sea bonito', 'Número de episodios, semillas nuevas, variación de objetos y condiciones', 'Que use un VLA', 'Que el código sea abierto'], 1, 'Sin protocolo de evaluación, el porcentaje describe la demo, no la robustez.')]
    })
  ]),

  // -------------------- P1: VER Y SENTIR --------------------
  M('p1', 'Ver y sentir', 'Sensores, estado y simulación antes de entrenar', [
    L({
      id: 'p1-1', title: 'Cámaras: el ojo del robot', min: 14,
      objectives: ['Elegir una cámara y entender sus parámetros', 'Relacionar la imagen con la observación de la política'],
      blocks: [
        p('La cámara no ve objetos: mide luz. La política recibe un tensor de píxeles y debe reconstruir a partir de él lo que necesita para actuar. Cuanto peor sea la imagen, más difícil será el aprendizaje.'),
        diagrama('camara', 'Del tablero de calibración a los parámetros intrínsecos.'),
        diagrama('yolo', 'Detección: imagen, backbone, head y supresión de duplicados.'),
        tabla(['Parámetro', 'Qué controla', 'Consecuencia'], [
          ['Resolución', 'Detalle disponible', 'Más pixels, más coste'],
          ['FPS', 'Frecuencia de observación', 'Pocos fps = mundo borroso'],
          ['Exposición', 'Brillo', 'Sobreexponer pierde color'],
          ['Campo de visión', 'Cuánto ve', 'Gran angular deforma bordes']
        ]),
        apunte('La luz es parte del dataset', 'Un modelo entrenado con luz de taller falla con luz de ventana. No es un fallo del modelo: es un cambio de distribución en la entrada. Randomiza la luz al grabar o al simular.'),
        aviso('Comprueba el autoexposición: si cambia sola entre episodios, el mismo objeto aparece con colores distintos y el modelo se confunde.'),
        lista(['Fija exposición y balance de blancos.', 'Sincroniza el timestamp de la imagen con el del estado del brazo.', 'Guarda también las imágenes fallidas, no solo las buenas.'])
      ],
      errors: [err('El modelo detecta el cubo en el portátil pero no en el robot', 'La cámara del robot tiene otra exposición y otro ángulo', 'Calibra y graba datos con la cámara exacta del despliegue.')],
      practice: { task: 'Configura una cámara para tu tarea y anota resolución, fps, exposición y campo de visión. Toma 10 fotos en dos iluminaciones distintas y compara el color del mismo objeto.', success: ['Cuatro parámetros anotados', 'Dos iluminaciones comparadas', 'Explicas el cambio observado'] },
      quiz: [q('¿Por qué fijar la exposición al grabar demostraciones?', ['Porque ahorra batería', 'Porque la autoexposición cambia la apariencia y rompe la consistencia del dataset', 'Porque aumenta los fps', 'Porque desactiva la cámara'], 1, 'La variación de exposición introduce cambios de color que el modelo interpreta como objetos distintos.')]
    }),
    L({
      id: 'p1-2', title: 'Propiocepción: saber dónde está uno', min: 14,
      objectives: ['Definir la propiocepción y sus señales típicas', 'Alinear articulaciones y velocidades con la imagen'],
      blocks: [
        p('La propriocepción es la medida del propio cuerpo: ángulos articulares, velocidades, a veces corriente de los motores. Es la señal más barata y más estable que tiene un robot.'),
        diagrama('estado', 'Estado, evolución, medición y observador.'),
        diagrama('encoder', 'Del pulso del encoder a la posición en metros.'),
        formula('q = (θ₁, …, θₙ)        q̇ = dq/dt', 'Vector de articulaciones y su velocidad: la forma mínima de estado interno.'),
        tabla(['Señal', 'Frecuencia típica', 'Uso'], [
          ['Ángulo de servo', '50–200 Hz', 'Posición actual'],
          ['Velocidad', '50–200 Hz', 'Suavidad del movimiento'],
          ['Corriente', '100 Hz', 'Detección de contacto barata']
        ]),
        apunte('Por qué importa tanto', 'La imagen te dice dónde está el cubo; la propriocepción te dice dónde está tu pinza. Sin las dos, la política no puede cerrar el lazo entre percepción y acción.'),
        nota('En LeRobot, el estado propioceptivo y la imagen se guardan juntos en el mismo paso de tiempo. Si se desincronizan, el modelo aprende asociaciones falsas.')
      ],
      errors: [err('El brazo cree estar en cero pero está girado', 'El encoder perdió su referencia al apagarse', 'Rehaz el home o guarda una referencia persistente antes de grabar datos.')],
      practice: { task: 'Registra durante 10 segundos los ángulos de un brazo o servo, calcula la velocidad por diferencia y comprueba que no hay saltos mayores que un valor razonable. Dibuja la señal resultante.', success: ['Ángulos y velocidad alineados en el tiempo', 'Detectas un salto o justificas su ausencia', 'Mencionas la frecuencia de muestreo'] },
      quiz: [q('¿Qué es la propriocepción en un brazo robótico?', ['La imagen de la cámara', 'La medida de sus propios ángulos y velocidades', 'La instrucción del usuario', 'La fuerza externa medida por un sensor'], 1, 'Son las señales internas del cuerpo: posición, velocidad y a veces corriente de los actuadores.')]
    }),
    L({
      id: 'p1-3', title: 'IMU y sensores force/torque', min: 15,
      objectives: ['Entender acelerómetro, giroscopio y sensor de fuerza', 'Saber cuándo hace falta medir contacto'],
      blocks: [
        p('La IMU mide aceleración y velocidad angular; el sensor force/torque mide fuerzas y pares en la muñeca. La primera responde "cómo me muevo"; el segundo responde "qué estoy empujando".'),
        diagrama('imu', 'Acelerómetro, giroscopio y magnetómetro en una IMU de 9 grados.'),
        diagrama('fuerza', 'Control de posición frente a control de fuerza.'),
        tabla(['Sensor', 'Mide', 'Fallos típicos'], [
          ['Acelerómetro', 'Aceleración + gravedad', 'Ruido, sesgo'],
          ['Giroscopio', 'Velocidad angular', 'Deriva en el tiempo'],
          ['Fuerza/par', 'F x, F y, F z, τ', 'Sesgo y calibración']
        ]),
        apunte('La gravedad confunde al acelerómetro', 'En reposo el acelerómetro ya mide 1 g hacia arriba. Para obtener inclinación hay que separar gravedad de aceleración real; para eso se usa el giroscopio y un filtro complementario.'),
        codigo('python', `import numpy as np

# Media de 200 muestras en reposo = sesgo del sensor force/torque
bias = np.mean([sensor.read() for _ in range(200)], axis=0)
fuerza_real = sensor.read() - bias
print("Fz corregida:", round(float(fuerza_real[2]), 3), "N")`, 'Restar el sesgo antes de medir contacto.'),
        aviso('Un sensor force/torque caro no arregla una mecánica mal alineada. Calibra primero el cero y el sistema de coordenadas.')
      ],
      errors: [err('La fuerza medida nunca es cero aunque no haya contacto', 'Sesgo del sensor sin restar', 'Promedia varias muestras en reposo y guarda el vector de corrección.')],
      practice: { task: 'Mide 200 muestras de un sensor inmóvil, calcula media y desviación típica, y escribe cuál es tu umbral mínimo de detección de contacto (media + 3 sigma).', success: ['Calculas media y desviación', 'Umbral derivado de los datos, no inventado', 'Explicas por qué se resta la media'] },
      quiz: [q('¿Por qué un acelerómetro en reposo no lee cero?', ['Porque está roto', 'Porque mide la aceleración de la gravedad', 'Porque tiene ruido de cuantización', 'Porque falta calibrar el giroscopio'], 1, 'En reposo mide aproximadamente 1 g; separar esa componente es trabajo del filtro.')]
    }),
    L({
      id: 'p1-4', title: 'Fusión de observaciones', min: 16, level: 'intermedio',
      objectives: ['Combinar imagen, estado y fuerza en una sola observación', 'Entender el alineamiento temporal'],
      blocks: [
        p('Una política rara vez usa un solo sensor. Lo normal esconcatenar imagen, ángulos, velocidades y quizá fuerza. La dificultad no es juntarlos, sino que lleguen a la misma frecuencia y con el mismo retardo.'),
        diagrama('kalman', 'Predecir, medir, ganancia de Kalman y corregir.'),
        diagrama('complementario', 'Filtro complementario: giroscopio rápido, acelerómetro estable.'),
        formula('oₜ = [ imagenₜ , qₜ , q̇ₜ , fₜ ]', 'Cada bloque debe corresponder al mismo instante t.'),
        tabla(['Señal', 'Frecuencia', 'Tratamiento'], [
          ['Imagen', '30 Hz', 'Último frame con timestamp'],
          ['Articulaciones', '100 Hz', 'Interpolar al instante de la imagen'],
          ['Fuerza', '100 Hz', 'Filtrar y alinear']
        ]),
        apunte('La trampa del último valor', 'Si usas siempre el último dato disponible sin mirar su timestamp, puedes mezclar una imagen de hace 40 ms con articulaciones de ahora. En movimiento rápido eso equivale a ver y actuar en momentos distintos.'),
        p('En un transformer de acción, el historial se apila: varias observaciones pasadas dan velocidad y aceleración implícitas sin calcularlas a mano.'),
        nota('En VLA, la fusión ocurre dentro del modelo: la imagen se convierte en tokens y el estado se inyecta como tokens o como vector concatenado.')
      ],
      errors: [err('El modelo funciona quieto pero falla en movimiento', 'Desalineamiento temporal entre imagen y estado', 'Guarda timestamps y realiza interpolación o buffer alineado antes de entrenar.')],
      practice: { task: 'Toma tres señales con frecuencias 30, 100 y 100 Hz y escribe un algoritmo de 5 pasos para alinearlas a 50 Hz. Indica qué haces si falta una muestra.', success: ['Cinco pasos ordenados', 'Uso explícito de timestamps', 'Política clara ante muestras faltantes'] },
      quiz: [q('¿Cuál es el principal riesgo al concatenar imagen y estado sin revisar timestamps?', ['Que el archivo sea más grande', 'Mezclar observaciones de instantes distintos', 'Que el modelo sea más lento', 'Que la imagen pierda color'], 1, 'El desalineamiento temporal enseña asociaciones falsas: el modelo ve un estado que no corresponde a esa imagen.')]
    }),
    L({
      id: 'p1-5', title: 'MuJoCo: el laboratorio físico', min: 16, level: 'intermedio',
      objectives: ['Entender qué simula un motor físico y por qué sirve', 'Montar un escenario mínimo de paso de tiempo'],
      blocks: [
        p('MuJoCo es un motor de física con contactos estables y rápido en CPU. Permite probar ideas miles de veces sin romper un servo, y es la base de muchos benchmarks de control y aprendizaje.'),
        diagrama('gazebo', 'Un mundo, un modelo, plugins de sensores y datos en topics.'),
        diagrama('sim2real', 'Entrenar en simulación, aleatorizar, transferir y ajustar.'),
        codigo('python', `import mujoco

model = mujoco.MjModel.from_xml_string(xml)
data  = mujoco.MjData(model)
dt = model.opt.timestep          # por ejemplo 0.002 s

for _ in range(500):
    mujoco.mj_step(model, data)  # avanza un paso físico
    if data.time >= 1.0:
        break`, 'El paso de tiempo define la resolución de toda la simulación.'),
        tabla(['Motor', 'Punto fuerte', 'Uso típico'], [
          ['MuJoCo', 'Contactos estables, CPU', 'Benchmarks, RL, control'],
          ['Isaac Sim / Lab', 'GPU paralelo, fotorrealismo', 'Entrenamiento masivo'],
          ['Gazebo', 'Integración ROS 2', 'Sistemas y sensores']
        ]),
        apunte('El timestep manda', 'Si simulas a 500 Hz pero tu robot real corre a 50 Hz, la política verá una dinámica distinta. Fija el periodo de control en la simulación y muestrea la observación a esa misma tasa.'),
        aviso('Un simulador no es la verdad: es una hipótesis sobre la física. Si tu política explota un detalle del simulador, el robot real te lo cobrará.')
      ],
      errors: [err('La política funciona en MuJoCo y falla en el robot', 'Periodo de control y parámetros de contacto distintos', 'Iguala timestep, masa, fricción y retardos antes de culpar al modelo.')],
      practice: { task: 'Carga un modelo XML mínimo en MuJoCo, cuenta cuántos pasos hay en 2 segundos con timestep 0.002 y comprueba el tiempo simulado final.', success: ['Obtienes 1000 pasos', 'El tiempo simulado es 2.0 s', 'Explicas qué pasa al duplicar el timestep'] },
      quiz: [q('Con un timestep de 0.002 s, ¿cuántos pasos son 1 segundo simulado?', ['50', '200', '500', '2000'], 2, '1 / 0.002 = 500 pasos. El periodo de control debe elegirse como múltiplo de ese paso.')]
    }),
    L({
      id: 'p1-6', title: 'Calibración: hacer que los números signifiquen algo', min: 15,
      objectives: ['Calibrar intrinsicos y extrinsicos', 'Verificar la calibración con una métrica de reproyección'],
      blocks: [
        p('Calibrar es convertir píxeles y pulsos en magnitudes con sentido. Sin calibración, una cámara da números y un encoder da cuentas, pero nadie sabe dónde está el objeto en coordenadas del robot.'),
        pasos([
          { title: 'Capturar', text: '20–30 imágenes del tablero desde ángulos y distancias distintas.' },
          { title: 'Detectar esquinas', text: 'Encuentra los puntos del patrón en cada imagen.' },
          { title: 'Resolver', text: 'Estima fx, fy, cx, cy y los coeficientes de distorsión.' },
          { title: 'Verificar', text: 'Reproyecta los puntos: un error por debajo de 1 píxel es bueno.' }
        ]),
        diagrama('camara', 'Flujo de calibración de cámara.'),
        tabla(['Calibración', 'Qué corrige', 'Si falla'], [
          ['Intrínseca', 'Lente y distorsión', 'Objetos deformados'],
          ['Extrínseca', 'Cámara respecto al robot', 'Agarre desplazado'],
          ['Cero articular', 'Referencia de los servos', 'Pose inicial errónea']
        ]),
        apunte('La calibración caduca', 'Un golpe, una vibración o un cambio de objective mueven la cámara. Repite la calibración extrínseca después de cualquier manipulación mecánica y registra la fecha.'),
        aviso('No confundas calibrar con ajustar a ojo. Si mueves la cámara hasta que "parece bien", estás sobreajustando a una sola escena.'),
        nota('En tareas de inserción, un error extrínseco de 3 mm puede ser la diferencia entre éxito y colisión.')
      ],
      errors: [err('La pinza siempre cae a la derecha del cubo', 'Transformada cámara-robot desactualizada', 'Recalibra la extrínseca y verifica con una medida física conocida.')],
      practice: { task: 'Calibra una cámara USB y escribe el error medio de reproyección en píxeles. Luego mide la distancia real entre dos esquinas del tablero y compárala con la estimada.', success: ['Error de reproyección reportado', 'Comparación con una medida física', 'Fecha de calibración anotada'] },
      quiz: [q('¿Qué indica un error de reproyección de 0.4 píxeles tras calibrar?', ['Que la cámara está rota', 'Que la calibración intrínseca es buena', 'Que hace falta más luz', 'Que el robot está descalibrado'], 1, 'El error de reproyección mide cuánto se separan los puntos predichos de los observados; por debajo de 1 px suele ser aceptable.')]
    }),
    L({
      id: 'p1-7', title: 'Lo que el paper no dice: ruido y fallos', min: 16, level: 'intermedio',
      objectives: ['Cuantificar la fiabilidad de los sensores', 'Leer con cautela las cifras de percepción'],
      blocks: [
        p('Los sensores fallan en silencio. Una cámara se desenfoca, un servo pierde pasos, una IMU deriva. Nada de eso aparece en la tabla de un paper, y todo aparece en tu log a las tres de la mañana.'),
        diagrama('drift', 'La distribución de producción se separa de la de entrenamiento.'),
        tabla(['Fallo', 'Frecuencia realista', 'Síntoma'], [
          ['Cámara desenfocada', 'Ocasional', 'Detecciones dudosas'],
          ['Servo con juego', 'Con uso', 'Histéresis en la posición'],
          ['IMU con deriva', 'Continua', 'Inclinación falsa'],
          ['Cable suelto', 'Impredecible', 'Dato congelado']
        ]),
        apunte('Lo que el paper no dice', 'Los artículos muestran la mediana. Tu trabajo real es mirar la cola: el 5 por ciento de episodios raros concentra casi todos los fallos. Reporta p95 de latencia y tasa de abortado, no solo la media.'),
        aviso('Un dato congelado es peor que un dato ruidoso: el modelo no detecta que algo va mal y sigue actuando sobre una mentira.'),
        lista(['Comprueba que el timestamp avanza en cada lectura.', 'Detecta valores constantes durante más de N muestras.', 'Guarda los episodios fallidos con la misma prioridad que los buenos.'], true),
        p('La robustez no se mide solo con éxitos: se mide con honestidad al contar los fallos y con rapidez al diagnosticarlos.'),
        nota('Un README que documenta tres fallos reales vale más que diez capturas bonitas.')
      ],
      errors: [err('La política falla de vez en cuando sin razón aparente', 'Un sensor se congela o pierde sincronía y nadie lo detecta', 'Añade monitor de timestamps y de valores constantes antes de culpar al modelo.')],
      practice: { task: 'Revisa un registro de sensores de 5 minutos y cuenta cuántas veces un valor se repite más de 20 muestras seguidas. Escribe una regla simple para marcar esos tramos como sospechosos.', success: ['Cuentas los tramos repetidos', 'Regla explícita con umbral', 'Dices qué harías con un tramo marcado'] },
      quiz: [q('¿Por qué un dato congelado es más peligroso que un dato ruidoso?', ['Porque ocupa menos memoria', 'Porque el sistema no nota el fallo y sigue actuando sobre información falsa', 'Porque es más lento', 'Porque no se puede guardar'], 1, 'El ruido se promedia; un valor congelado parece válido y no dispara ninguna alerta.')]
    })
  ]),

  // -------------------- P2: IMITAR ANTES DE RAZONAR --------------------
  M('p2', 'Imitar antes de razonar', 'Demostraciones, LeRobot y el brazo SO-101', [
    L({
      id: 'p2-1', title: 'Behavior cloning', min: 14,
      objectives: ['Derivar la idea de copiar acciones de demostraciones', 'Entender el error de acumulación por covariate shift'],
      blocks: [
        p('Behavior cloning es aprender una política imitando pares observación-acción. No hay recompensa, ni exploración: simplemente se minimiza la diferencia entre lo que hizo el experto y lo que predice la red.'),
        diagrama('imitation', 'Demostraciones, dataset, política y despliegue.'),
        formula('min_θ Σₜ ‖ π_θ(oₜ) − aₜ ‖²', 'Regression supervisada: la acción del experto es la etiqueta.'),
        apunte('Por qué funciona tan bien al principio', 'Con unas decenas de demostraciones ya obtienes una política que hace algo razonable. Por eso la imitación es el punto de partida natural antes de hablar de VLA o de RL.'),
        tabla(['Ventaja', 'Limitación'], [
          ['Simple de entrenar', 'No supera al experto'],
          ['Pocos datos', 'Sensible al estilo del demostrador'],
          ['Evaluación clara', 'Falla con estados no vistos']
        ]),
        aviso('El error se acumula: si la política se desvía 1 cm, entra en un estado que el experto nunca visitó, se desvía 2 cm y acaba colisionando. Eso es covariate shift.'),
        p('La solución práctica es predictor de chunks y replanificación frecuente, como en ACT: predices varias acciones de una vez y vuelves a mirar antes de que se acabe el trozo.')
      ],
      errors: [err('La política funciona los primeros segundos y luego se va hacia un lado', 'Covariate shift: el estado visitado no estaba en el dataset', 'Predice chunks cortos, replanea cada pocos pasos y añade demostraciones correctivas.')],
      practice: { task: 'Explica con un dibujo cómo un error pequeño se convierte en colisión. Escribe tres acciones correctivas que reduces al ver ese fallo.', success: ['Dibujo con tres pasos de desviación', 'Tres correctivas concretas', 'Mencionas la replanificación'] },
      quiz: [q('¿Qué es el covariate shift en behavior cloning?', ['Cambio de cámara', 'Que la política visita estados distintos a los del experto y acumula error', 'Cambio de learning rate', 'Que el dataset sea demasiado grande'], 1, 'Al desviarse, entran en distribuciones no vistas durante el entrenamiento y el error crece.')]
    }),
    L({
      id: 'p2-2', title: 'Demostraciones: calidad antes que cantidad', min: 14,
      objectives: ['Diseñar una sesión de grabación consistente', 'Detectar demostraciones malas antes de entrenar'],
      blocks: [
        p('Cien demostraciones malas enseñan cien formas de fallar. La consistencia importa más que el volumen: la misma tarea, el mismo ritmo y el mismo criterio de éxito.'),
        diagrama('imitation', 'Cada episodio es un par de secuencias: observaciones y acciones.'),
        lista(['Define el inicio y el fin de cada episodio antes de grabar.', 'Graba solo intentos que tú considerarías exitosos.', 'Varía la posición inicial, no el estilo de ejecución.', 'Descarta los episodios donde corregiste a mano.'], true),
        apunte('El demostrador también aprende', 'Si grabas 50 episodios seguidos, tu mano se vuelve más rápida y suave. El primer episodio y el último no siguen la misma distribución. Mezcla o descarta los extremos.'),
        tabla(['Síntoma', 'Causa probable', 'Acción'], [
          ['Movimientos erráticos', 'Fatiga del operador', 'Pausa y regraba'],
          ['Siempre el mismo inicio', 'Sin randomización', 'Mueve los objetos'],
          ['Éxito dudoso', 'Criterio difuso', 'Escribe el criterio antes']
        ]),
        aviso('Nunca corrijas al robot durante una grabación usando el mando si después vas a entrenar con eso: la corrección no es una acción de la política.'),
        nota('Registra también las demostraciones fallidas en un carpeta separada. Sirven para evaluar, no para entrenar.')
      ],
      errors: [err('La política imita movimientos bruscos e innecesarios', 'El demostrador corregía constantemente durante la grabación', 'Regraba con movimientos suaves y descarta los episodios con correcciones manuales.')],
      practice: { task: 'Escribe un protocolo de grabación de 7 pasos para una tarea sencilla, incluyendo criterio de éxito, variación inicial y cuándo descartar un episodio.', success: ['Siete pasos ejecutables', 'Criterio de éxito binario', 'Regla explícita de descarte'] },
      quiz: [q('¿Qué es más importante al grabar demostraciones para behavior cloning?', ['Grabar muchas horas seguidas', 'La consistencia y un criterio de éxito claro', 'Usar la cámara de mayor resolución', 'Grabar siempre desde la misma posición inicial'], 1, 'Un dataset pequeño y coherente enseña mejor que uno grande y contradictorio.')]
    }),
    L({
      id: 'p2-3', title: 'El formato LeRobot', min: 16,
      objectives: ['Conocer la estructura de un dataset LeRobot', 'Cargar episodios y entender su esquema'],
      blocks: [
        p('LeRobot es la librería de Hugging Face para grabar, entrenar y evaluar políticas. Su formato de dataset guarda observaciones, acciones, metadatos y vídeos en una estructura predecible.'),
        diagrama('lerobot', 'Conectar, grabar, entrenar y evaluar en el mismo pipeline.'),
        codigo('python', `from lerobot.datasets.lerobot_dataset import LeRobotDataset

ds = LeRobotDataset("mi-usuario/apilar-cubos")
ep = ds[0]
print(ep.keys())          # observation.* , action , task , ...
print(ep["action"].shape) # (dimension_de_accion,)`, 'Cargar un episodio y mirar su esquema.'),
        tabla(['Ruta', 'Contenido'], [
          ['data/chunk-*/episode_*.parquet', 'Observaciones y acciones'],
          ['videos/chunk-*/episode_*.mp4', 'Vista de las cámaras'],
          ['meta/info.json', 'FPS, shapes, nombres'],
          ['meta/episodes.jsonl', 'Índice de episodios'],
          ['meta/tasks.jsonl', 'Instrucciones por episode']
        ]),
        apunte('Por qué importa el formato', 'Cuando tu dataset sigue un esquema estándar, puedes usar entrenadores, visualizadores y métricas de la comunidad sin escribir adaptadores. Eso ahorra semanas.'),
        aviso('Normaliza las acciones igual al entrenar y al desplegar. Si el dataset guarda acciones en [-1, 1] y tu control las espera en grados, el robot hará movimientos diminutos o peligrosos.'),
        nota('Revisa siempre fps y shapes en meta/info.json antes de entrenar: son la fuente de verdad.')
      ],
      errors: [err('El modelo entrena pero las acciones de salida son ridículas', 'Rangos de normalización distintos entre entrenamiento y despliegue', 'Guarda los estadísticos de normalización junto al checkpoint y aplícalos en la inferencia.')],
      practice: { task: 'Carga un dataset LeRobot público e imprime las claves del primer episodio, la forma de la acción y el fps desde info.json. Explica qué representa cada una.', success: ['Tres datos impresos correctamente', 'Explicas la forma de la acción', 'Identificas dónde está el fps'] },
      quiz: [q('¿Dónde encuentras los fps y las formas de observaciones y acciones en un dataset LeRobot?', ['En el vídeo', 'En meta/info.json', 'En el nombre del repositorio', 'En el código del entrenador'], 1, 'meta/info.json es la fuente de verdad de la estructura del dataset.')]
    }),
    L({
      id: 'p2-4', title: 'Teleoperación', min: 15,
      objectives: ['Entender el par leader/follower', 'Evitar artefactos al grabar demostraciones'],
      blocks: [
        p('En teleoperación, una persona mueve un brazo maestro (leader) y el robot esclavo (follower) reproduce el movimiento. Es la forma más rápida de generar datos de calidad para tareas de manipulación.'),
        diagrama('so101', 'Leader, follower, servos STS3215 y LeRobot cerrando el ciclo.'),
        pasos([
          { title: 'Emparejar', text: 'Configura leader y follower con los mismos límites y sentido de giro.' },
          { title: 'Home', text: 'Lleva ambos brazos a la misma pose de referencia.' },
          { title: 'Grabar', text: 'Ejecuta la tarea con movimientos lentos y continuos.' },
          { title: 'Revisar', text: 'Reproduce el episodio y descarta las correcciones.' }
        ]),
        apunte('El retardo se nota', 'Si el follower va detrás del leader más de 100 ms, la persona empieza a corregir y el dataset se llena de movimientos nerviosos. Ajusta ganancia y frecuencia antes de grabar en serio.'),
        tabla(['Modo', 'Ventaja', 'Inconveniente'], [
          ['Articulaciones leader/follower', 'Barato y directo', 'Requiere calibración'],
          ['Joystick 6D', 'Rápido', 'Difícil para tareas finas'],
          ['Tracking de manos', 'Intuitivo', 'Ruido y oclusión']
        ]),
        aviso('No grabes con el follower chocando contra la mesa: cada golpe descalibra los servos y estropea varios episodios a la vez.'),
        nota('La teleoperación es el momento más caro del proyecto en tiempo humano. Trátala como una línea de producción: protocolo, revisión y control de calidad.')
      ],
      errors: [err('El follower no sigue al leader en el mismo sentido', 'Servos montados con orientaciones opuestas', 'Invierte el signo de las articulaciones afectadas en la configuración.')],
      practice: { task: 'Escribe una lista de comprobación de 6 pasos antes de grabar: home, límites, sentido, retardo, cámara y criterio de éxito. Márcala en una sesión real.', success: ['Seis pasos verificables', 'Ejecutada en una sesión', 'Anotas un problema detectado'] },
      quiz: [q('¿Qué problema introduce un retardo alto entre leader y follower al grabar?', ['Mejora la precisión', 'El operador corrige más y el dataset se vuelve errático', 'Aumenta el fps', 'Reduce el tamaño del dataset'], 1, 'La persona compensa el retraso con correcciones que después la política imita.')]
    }),
    L({
      id: 'p2-5', title: 'El SO-101 y su coste real', min: 13,
      objectives: ['Conocer el hardware del SO-101', 'Presupuestar un banco de aprendizaje con números honestos'],
      blocks: [
        p('El SO-101 es un brazo pequeño de código abierto de Hugging Face, con un leader y un follower, servos STS3215 y piezas impresas en 3D. Su atractivo es que hace robot learning accesible.'),
        widget('bom'),
        diagrama('so101', 'Las cuatro piezas del sistema: leader, follower, servos y software.'),
        tabla(['Concepto', 'Rango típico (USD)', 'Nota'], [
          ['Follower', '100–150', 'El brazo que ejecuta'],
          ['Leader', '100–150', 'El mando que empuñas'],
          ['Cámara y soporte', '20–60', 'Dos cámaras es mejor'],
          ['Envío y aduanas', '20–80', 'No sale en el anuncio']
        ]),
        apunte('El rango de 100–300 USD', 'Ese es el coste anunciado del hardware del brazo. El presupuesto real de un banco que funciona incluye cámaras, fuente, impresión de repuestos y un ordenador con GPU. Por eso el título dice "coste real".'),
        aviso('Compra repuestos de servos y engranajes desde el principio. Un brazo parado por una pieza de 8 USD es más caro que cualquier GPU.'),
        lista(['Imprime piezas con margen: 0.2–0.4 mm en FDM.', 'Etiqueta cada servo antes de montar: el cableado es indistinguible.', 'Guarda un juego de engranajes de repuesto.'])
      ],
      errors: [err('El presupuesto se queda corto a mitad del proyecto', 'Se contó solo el precio del brazo', 'Añade cámaras, envío, repuestos y ordenador al presupuesto inicial.')],
      practice: { task: 'Haz un presupuesto de 8 líneas para montar un banco SO-101 con dos cámaras. Añade un 20 por ciento de imprevistos y justifica dos partidas.', success: ['Ocho líneas con rangos', 'Imprevistos aplicados', 'Dos partidas justificadas'] },
      quiz: [q('¿Qué suele faltar en el precio anunciado de un brazo SO-101 de 100–300 USD?', ['Los servos', 'Cámaras, envío, repuestos y ordenador', 'El código abierto', 'Las piezas impresas'], 1, 'El precio del brazo no incluye todo el banco necesario para grabar y entrenar.')]
    }),
    L({
      id: 'p2-6', title: 'Calidad del dataset', min: 15,
      objectives: ['Auditar un dataset de demostraciones', 'Diseñar una estrategia de aumentación válida'],
      blocks: [
        p('Un dataset bueno cubre la variación que vas a encontrar al desplegar y nada más. Ni tan estrecho que falla con otra luz, ni tan amplio que nunca converge.'),
        diagrama('lerobot', 'El pipeline completo: grabar, revisar, entrenar y evaluar.'),
        tabla(['Dimensión', 'Pregunta', 'Si falla'], [
          ['Objetos', '¿Hay varias posiciones iniciales?', 'Solo funciona en una posición'],
          ['Luz', '¿Cambia entre episodios?', 'Falla por la ventana'],
          ['Velocidad', '¿Es consistente?', 'Movimientos erráticos'],
          ['Éxito', '¿Está todo bien etiquetado?', 'Aprende a fallar']
        ]),
        apunte('Aumentación con cuidado', 'Puedes girar o recortar imágenes, pero no cambiar el color del cubo si la tarea dice "cubo rojo". La aumentación debe preservar la semántica de la instrucción.'),
        p('Una regla práctica: graba el 80 por ciento con la configuración nominal y el 20 por ciento con variaciones deliberadas de posición, luz y objetos distractores.'),
        aviso('No mezcles datos de dos brazos con calibraciones distintas sin una etiqueta que lo indique. El modelo no sabrá a qué cuerpo corresponde cada acción.'),
        nota('Audita visualmente al menos el 10 por ciento de los episodios. Es el trabajo menos glamuroso y el que más mejora el resultado.')
      ],
      errors: [err('El éxito cae al cambiar la posición inicial del cubo', 'Todas las demostraciones empezaban igual', 'Graba variaciones deliberadas del estado inicial y vuelve a evaluar.')],
      practice: { task: 'Audita 20 episodios de un dataset y cuenta cuántos tienen luz, inicio y velocidad distintos. Escribe tres cambios para mejorar la cobertura.', success: ['Tres dimensiones contadas', 'Tres cambios concretos', 'Justificas uno con el fallo observado'] },
      quiz: [q('¿Qué aumentación sería inválida para una tarea con instrucción "apila el cubo rojo sobre el azul"?', ['Rotar la imagen unos grados', 'Cambiar el color del cubo rojo', 'Recortar borde', 'Cambiar ligeramente el brillo'], 1, 'Alterar el color rompe la semántica de la instrucción y enseña una tarea distinta.')]
    }),
    L({
      id: 'p2-7', title: 'Lo que el paper no dice: métricas', min: 16, level: 'intermedio',
      objectives: ['Elegir métricas que no engañen', 'Diseñar un protocolo de evaluación con semillas nuevas'],
      blocks: [
        p('La métrica más citada es la tasa de éxito, y es también la más fácil de manipular. Sin definir episodios, semillas y criterio, un 90 por ciento no significa gran cosa.'),
        diagrama('evals', 'Dataset, métrica, comparación con baseline y detección de regresiones.'),
        formula('tasa_de_éxito = episodios_con_éxito / episodios_totales', 'Un buen denominador importa más que un numerador bonito.'),
        tabla(['Métrica', 'Qué mide', 'Trampa'], [
          ['Success rate', 'Episodios completados', 'Misma semilla que el entrenamiento'],
          ['Tiempo', 'Duración media', 'Ignora los abortados'],
          ['Colisiones', 'Contactos no deseados', 'No se reporta'],
          ['Jitter', 'Suavidad', 'Difícil de definir']
        ]),
        apunte('Lo que el paper no dice', 'Cien episodios con semillas nuevas son el mínimo razonable. Con 20 episodios, un 80 por ciento es solo 16 aciertos: el intervalo de confianza es tan ancho que casi cualquier comparación es ruido.'),
        aviso('Nunca evalúes solo en el estado inicial del dataset. Si la política solo funciona ahí, no ha aprendido la tarea: ha memorizado la escena.'),
        lista(['Fija la semilla antes de empezar y no la cambies a mitad.', 'Cuenta los timeouts como fallo.', 'Publica los vídeos de los fallos, no solo los éxitos.'], true),
        nota('La evaluación es la parte del trabajo que nadie quiere hacer y la que decide si tu resultado es creíble.')
      ],
      errors: [err('Tu política dice 95 por ciento pero en vivo falla mucho', 'Evaluaste con las mismas semillas y estados del entrenamiento', 'Evalúa 100 episodios con semillas nuevas y objetos en posiciones inéditas.')],
      practice: { task: 'Diseña un protocolo de evaluación de 100 episodios: semillas, variación de objetos, criterio de éxito y tratamiento de timeouts. Escribe la tabla de resultados vacía.', success: ['Cien episodios con semillas nuevas', 'Criterio de éxito binario', 'Timeouts contados como fallo'] },
      quiz: [q('¿Por qué son preferibles 100 episodios con semillas nuevas a 20 con la semilla del entrenamiento?', ['Porque es más rápido', 'Porque reduce la incertidumbre y evita memorización', 'Porque ahorra vídeos', 'Porque el modelo entrena mejor'], 1, 'Más muestra y estados inéditos dan una estimación fiable y detectan sobreajuste a la escena.')]
    })
  ]),

  // -------------------- P3: VLA --------------------
  M('p3', 'VLA: visión + lenguaje → acción', 'Modelos grandes que devuelven movimientos', [
    L({
      id: 'p3-1', title: 'Imagen + instrucción → acción', min: 15,
      objectives: ['Describir el flujo completo de un VLA', 'Distinguir salida de texto de salida de acción'],
      blocks: [
        p('Un VLA toma una imagen y una instrucción en lenguaje natural y devuelve una acción o un trozo de acciones. No genera una explicación: genera números que van a los motores.'),
        diagrama('vla', 'Imagen y texto entran; tokens de acción salen; el robot ejecuta.'),
        formula('imagen + instrucción → encoder → tokens → acción aₜ', 'La acción es la salida, no el texto.'),
        tabla(['Entrada', 'Salida', 'Ejemplo'], [
          ['Imagen + "apila el cubo"', 'Δposición y cierre de pinza', 'VLA'],
          ['Imagen + "¿qué ves?"', 'Texto', 'VLM'],
          ['Solo imagen', 'Clase', 'Clasificador']
        ]),
        apunte('Por qué el lenguaje ayuda', 'La instrucción permite cambiar de tarea sin reentrenar: el mismo modelo puede coger, apilar o empujar según lo que le digas. Eso es imposible con una política de imitación pura especializada en una sola tarea.'),
        p('El coste es que la salida debe ser precisa y rápida. Un modelo que tarda 500 ms en decidir no puede controlar un brazo que se mueve a 50 Hz.'),
        aviso('Si tu VLA responde con texto descriptivo en vez de acciones, estás usando un VLM, no un VLA. Comprueba el tipo de salida antes de conectar el robot.')
      ],
      errors: [err('El modelo describe la escena pero no mueve el brazo', 'Es un VLM, no un VLA con head de acción', 'Usa un checkpoint con tokens de acción y un desnormalizador de acciones.')],
      practice: { task: 'Escribe un ejemplo de entrada y salida para un VLA y otro para un VLM con la misma imagen. Subraya la diferencia en la salida.', success: ['Dos ejemplos con la misma imagen', 'Salida numérica frente a textual', 'Explicas por qué uno mueve y otro no'] },
      quiz: [q('¿Qué diferencia un VLA de un VLM en robótica?', ['Que el VLA es más grande', 'Que el VLA devuelve acciones ejecutables, no texto', 'Que el VLM no usa imágenes', 'Que el VLA solo funciona offline'], 1, 'La head de acción y su desnormalización son las que permiten mover el robot.')]
    }),
    L({
      id: 'p3-2', title: 'OpenVLA 7B', min: 17, level: 'intermedio',
      objectives: ['Conocer la arquitectura y el tamaño de OpenVLA', 'Entender el coste de correr un modelo de 7B'],
      blocks: [
        p('OpenVLA es un modelo abierto de 7 mil millones de parámetros que combina un backbone de lenguaje con codificadores visuales y produce tokens de acción discretos. Se entrenó con un gran conjunto de datos de múltiples robots.'),
        diagrama('vla', 'Backbone de 7B, visión y tokens de acción.'),
        tabla(['Componente', 'Papel', 'Consecuencia'], [
          ['Backbone ~7B', 'Razonamiento y lenguaje', 'Mucho VRAM'],
          ['Codificadores visuales', 'DINOv2 y SigLIP', 'Dos vistas complementarias'],
          ['Tokens de acción', 'Salida discreta', 'Resolución limitada']
        ]),
        codigo('python', `from transformers import AutoModelForVision2Seq, AutoProcessor
import torch

model = AutoModelForVision2Seq.from_pretrained(
    "openvla/openvla-7b", torch_dtype=torch.bfloat16,
    low_cpu_mem_usage=True,
).to("cuda")
proc = AutoProcessor.from_pretrained("openvla/openvla-7b")`, 'Cargar un VLA de 7B exige GPU con suficiente memoria.'),
        apunte('Por qué 7B', 'El tamaño le da capacidad de seguir instrucciones y generalizar entre tareas. El precio es memoria y latencia: en una GPU de consumo hace falta cuantización para acercarse a tiempo real.'),
        aviso('Cargar 7B en bf16 ocupa unos 14 GB solo en pesos. Sin cuantizar, no cabe en Many GPUs pequeñas ni en un dispositivo edge.'),
        nota('OpenVLA es un buen punto de referencia para comparar: cualquier modelo pequeño que propongas debe decir cuánto pierde frente a él.')
      ],
      errors: [err('Se acaba la memoria al cargar el modelo', 'Pesos en bf16 sin cuantizar', 'Usa cuantización INT8/INT4 o un modelo más pequeño y mide la pérdida de éxito.')],
      practice: { task: 'Calcula la memoria aproximada de 7B parámetros en FP16 y en INT8. Compara con la VRAM de tu GPU y decide si necesitas cuantización.', success: ['~14 GB en FP16 y ~7 GB en INT8', 'Comparación con tu hardware', 'Decisión justificada'] },
      quiz: [q('Aproximadamente cuánto ocupan 7B parámetros en FP16?', ['1.4 GB', '7 GB', '14 GB', '70 GB'], 2, 'Cada parámetro ocupa 2 bytes en FP16: 7·10^9 · 2 ≈ 14 GB, sin contar activaciones.')]
    }),
    L({
      id: 'p3-3', title: 'π0 3B y flow matching', min: 17, level: 'avanzado',
      objectives: ['Entender la diferencia entre tokens discretos y acciones continuas', 'Describir el flow matching aplicado a acciones'],
      blocks: [
        p('π0, de Physical Intelligence, es un VLA de unos 3 mil millones de parámetros que genera acciones continuas mediante flow matching. En lugar de elegir entre tokens discretos, aprende a transformar ruido en un vector de acción suave.'),
        diagrama('diffusion', 'Ruido, red que predice el campo, denoising y acción final.'),
        formula('dx/dt = v_θ(x, t, cond)        x(0)=ruido → x(1)=acción', 'El modelo aprende el campo de velocidad que lleva del ruido a la acción.'),
        tabla(['', 'OpenVLA', 'π0'], [
          ['Tamaño', '7B', '3B'],
          ['Acción', 'Tokens discretos', 'Continua por flow'],
          ['Resolución', 'Limitada por bins', 'Fina'],
          ['Denoising', 'No', 'Varios pasos']
        ]),
        apunte('Flow contra difusión', 'Ambas son modelos de generación por pasos, pero flow matching aprende un campo de velocidad directo y suele necesitar menos pasos. En robótica eso se traduce en menos latencia para el mismo trozo de acciones.'),
        p('La salida es un chunk de acciones: varios pasos de control a la vez, ejecutados a alta frecuencia mientras se calcula el siguiente chunk.'),
        aviso('Más pasos de denoising dan acciones más limpias pero más retardo. Mide el número de pasos como una variable de tu presupuesto de latencia.')
      ],
      errors: [err('Las acciones salen temblorosas', 'Demasiados bins discretos o muy pocos pasos de denoising', 'Usa salida continua o aumenta los pasos y mide el coste en milisegundos.')],
      practice: { task: 'Explica con un ejemplo por qué un token discreto de posición pierde precisión frente a una salida continua. Da dos consecuencias en una tarea de inserción.', success: ['Ejemplo numérico con bins', 'Dos consecuencias concretas', 'Mencionas el coste en pasos'] },
      quiz: [q('¿Qué ventaja tiene el flow matching frente a tokens de acción discretos?', ['Que no necesita cámara', 'Que produce acciones continuas con mayor resolución', 'Que usa menos parámetros siempre', 'Que elimina la necesidad de evaluar'], 1, 'La acción continua no está limitada por bins y permite movimientos más finos, a coste de pasos de denoising.')]
    }),
    L({
      id: 'p3-4', title: 'Tokens de acción', min: 15,
      objectives: ['Entender la discretización de acciones', 'Medir el precio de la resolución'],
      blocks: [
        p('Para que un modelo de lenguaje produzca movimientos, hay que convertir cada componente de la acción en un token. Lo habitual es dividir el rango en bins y predecir el índice del bin.'),
        diagrama('tokenizacion', 'Texto, tokens y embeddings: la misma idea aplicada a acciones.'),
        formula('bin = round((a − a_min) / (a_max − a_min) · (N − 1))', 'Con N bins, la resolución es (a_max − a_min)/(N − 1).'),
        codigo('python', `import numpy as np

N = 256
lo, hi = -1.0, 1.0
def a_bin(x): return int(np.round((x - lo) / (hi - lo) * (N - 1)))
def a_real(b): return lo + b / (N - 1) * (hi - lo)

print(a_real(a_bin(0.137)))  # error de cuantización`, 'Ida y vuelta: discreto para el modelo, continuo para el motor.'),
        tabla(['Bins', 'Resolución en rango 2.0', 'Efecto'], [
          ['128', '15.7 mm por bin si es metros', 'Grueso para inserción'],
          ['256', '7.8 mm por bin', 'Aceptable en apilado'],
          ['512', '3.9 mm por bin', 'Mejor, más tokens']
        ]),
        apunte('El error no desaparece', 'Cada acción queda redondeada. En tareas de contacto, ese redondeo se acumula. Por eso los modelos continuos y los chunks largos con corrección son atractivos.'),
        aviso('Usa la misma discretización al entrenar y al desplegar. Cambiar el número de bins sin reentrenar produce acciones fuera de rango.')
      ],
      errors: [err('El brazo tiembla alrededor del objetivo', 'Resolución de bins demasiado gruesa', 'Aumenta el número de bins o cambia a salida continua y vuelve a medir.')],
      practice: { task: 'Calcula la resolución de 256 bins para un rango de -1 a 1 metros y el error máximo de cuantización. Repite con 512 bins.', success: ['256: ~7.8 mm por bin, error máximo ~3.9 mm', '512: ~3.9 mm por bin', 'Relacionas resolución y precisión final'] },
      quiz: [q('Con 256 bins en un rango de -1 a 1 m, ¿cuál es el error máximo por cuantización?', ['~7.8 mm', '~3.9 mm', '~1 mm', '~15 mm'], 1, 'El paso es 2/255 ≈ 7.8 mm y el error máximo es la mitad del paso, ≈3.9 mm.')]
    }),
    L({
      id: 'p3-5', title: 'Fine-tuning de un VLA', min: 17, level: 'intermedio',
      objectives: ['Adaptar un VLA a una tarea concretacon pocos datos', 'Evitar el olvido de la capacidad de lenguaje'],
      blocks: [
        p('El fine-tuning es la forma realista de usar un VLA: parte de un modelo preentrenado y ajústalo con unas decenas o centenas de demostraciones de tu tarea.'),
        diagrama('lerobot', 'Dataset propio, entrenamiento y evaluación en el mismo bucle.'),
        pasos([
          { title: 'Prepara', text: 'Normaliza imágenes y acciones con los estadísticos del modelo base.' },
          { title: 'Congela', text: 'Empieza congelando el backbone y entrenando solo la head.' },
          { title: 'Descongela', text: 'Con learning rate bajo, afina las últimas capas.' },
          { title: 'Evalúa', text: 'Comprueba también que sigue obedeciendo otras instrucciones.' }
        ]),
        tabla(['Datos propios', 'Riesgo', 'Mitigación'], [
          ['< 50 episodios', 'Overfitting', 'Congelar backbone'],
          ['Muy repetitivos', 'Memoriza la escena', 'Variar posiciones'],
          ['Una sola frase', 'Pierde lenguaje', 'Incluir sinónimos']
        ]),
        apunte('Cuánto bajar el learning rate', 'Para fine-tuning de un VLA se suele usar un learning rate una o dos órdenes de magnitud menor que en el preentrenamiento. Si sube demasiado, el modelo olvida el lenguaje y se convierte en una política de una sola tarea.'),
        aviso('Guarda un checkpoint antes del fine-tuning. Si el resultado es peor, necesitas poder volver sin reentrenar desde cero.'),
        nota('El objetivo no es batir al modelo base en su dominio, sino ganar en tu tarea sin perder demasiado en las demás.')
      ],
      errors: [err('Tras el fine-tuning solo obedece una frase exacta', 'Sobreajuste a una instrucción repetida', 'Añade paráfrasis y evalúa instrucciones que no estaban en el dataset.')],
      practice: { task: 'Planifica un fine-tuning con 50 demostraciones: qué capas congelas, learning rate relativo, cuántos checkpoints guardas y qué prueba de olvido haces.', success: ['Cuatro decisiones concretas', 'Prueba de olvido definida', 'Checkpoint de retroceso incluido'] },
      quiz: [q('¿Por qué congelar el backbone al fine-tunear con pocos datos?', ['Porque es más rápido y evita destruir el conocimiento previo', 'Porque así no hay que normalizar', 'Porque aumenta el número de parámetros', 'Porque elimina la necesidad de evaluar'], 1, 'El backbone ya contiene visión y lenguaje útiles; con pocos datos, moverlo mucho provoca sobreajuste y olvido.')]
    }),
    L({
      id: 'p3-6', title: 'Latencia y evaluación', min: 16, level: 'intermedio',
      objectives: ['Medir el presupuesto de tiempo de una política', 'Diseñar una evaluación comparable'],
      blocks: [
        p('Un VLA no solo debe acertar: debe acertar antes de que el brazo llegue al sitio equivocado. La latencia de extremo a extremo incluye captura, preprocesado, inferencia, desnormalización y envío al controlador.'),
        diagrama('evals', 'Evaluar es comparar contra un baseline y detectar regresiones.'),
        formula('presupuesto ≈ 100 ms por chunk · 50 Hz de control', 'Un chunk de acciones se ejecuta mientras se calcula el siguiente.'),
        tabla(['Etapa', 'Típico', 'Optimización'], [
          ['Captura', '10–30 ms', 'Buffer de frames'],
          ['Inferencia', '40–300 ms', 'Cuantización y chunks'],
          ['Control', '20 ms', 'Bucle dedicado']
        ]),
        apunte('Media versus p95', 'Un modelo con media de 60 ms y p95 de 190 ms falla de forma intermitente. Reporta siempre percentiles: p50, p95 y peor caso. El p95 es el que decide si el lazo es estable.'),
        p('En evaluación, compara contra dos baselines: un controlador humano teleoperado y una política de imitación pequeña. Si tu VLA no gana a ninguno en el mismo protocolo, no tiene sentido desplegarlo.'),
        aviso('Mide la latencia en el hardware de destino. Un número en una GPU de servidor no dice nada sobre un iPad o un Jetson.')
      ],
      errors: [err('La media de latencia es buena pero el robot oscila', 'Picos de latencia no medidos', 'Mide p95 y añade un watchdog que frene si el chunk llega tarde.')],
      practice: { task: 'Mide 200 inferencias y calcula media, p50, p95 y máximo. Escribe si el presupuesto de 100 ms se cumple en p95 y qué harías si no.', success: ['Cuatro estadísticos calculados', 'Juicio sobre el p95', 'Mitigación concreta'] },
      quiz: [q('¿Por qué reportar p95 de latencia y no solo la media?', ['Porque es más fácil de calcular', 'Porque los picos provocan fallos intermitentes en el lazo de control', 'Porque reduce el tamaño del modelo', 'Porque sustituye a la evaluación de éxito'], 1, 'La media esconde los picos que desestabilizan el control en tiempo real.')]
    }),
    L({
      id: 'p3-7', title: 'Lo que el paper no dice', min: 20, level: 'avanzado',
      objectives: ['Evaluar un VLA con criterios honestos', 'Completar la práctica estrella del track'],
      blocks: [
        p('Los vídeos de VLA muestran el mejor episodio. Lo que no muestran es cuántas semillas fallaron, cuánto costaron las demostraciones ni cuánto tardó cada acción en el hardware real.'),
        diagrama('vla', 'Del modelo a la métrica: la cadena completa que hay que medir.'),
        tabla(['Promesa', 'Pregunta incómoda', 'N honesto'], [
          ['Generaliza', '¿Con objetos nuevos?', '100 episodios, semillas nuevas'],
          ['Tiempo real', '¿p95 en el dispositivo?', '< 100 ms por acción'],
          ['Pocos datos', '¿De qué calidad?', '50 demos sintéticas revisadas']
        ]),
        apunte('Lo que el paper no dice', 'Un VLA de 7B puede necesitar una GPU cara para cumplir el presupuesto, y un modelo pequeño fine-tuneado puede ganar en una tarea estrecha. La comparación honesta es éxito por dólar y por milisegundo, no solo por parámetro.'),
        aviso('No reportes "éxito ≥80 por ciento" sin decir cuántos episodios, con qué semillas y en qué hardware. Un 80 por ciento sobre 10 episodios son ocho aciertos: casi ruido.'),
        lista(['Coste de datos: teleoperación o generación sintética.', 'Coste de inferencia: GPU o dispositivo edge.', 'Coste de fallo: reposición de objetos y tiempo de reset.'], true),
        p('La práctica siguiente reúne todo el track: visión, lenguaje, acción, fine-tuning, latencia y evaluación con semillas nuevas.'),
        nota('Si no puedes repetir tu propio número una semana después, no es una métrica: es una anécdota.')
      ],
      errors: [err('Reportas éxito alto con la misma semilla del entrenamiento', 'Evaluación sobre datos vistos', 'Genera semillas nuevas, fíjalas antes de evaluar y publica los fallos.')],
      practice: {
        task: 'PRÁCTICA ESTRELLA: "Apilar con palabras". En un SO-101 simulado, el robot debe obedecer la instrucción "apila el cubo rojo sobre el azul". Genera ~50 demostraciones sintéticas con variación de posiciones y luz, fine-tunea un VLA pequeño y evalúa 100 episodios con semillas nuevas. Criterio: éxito ≥80 por ciento, menos de 100 ms por acción (p95) y al menos un vídeo de fallo guardado.',
        success: [
          '50 demostraciones sintéticas con posiciones y luz variadas',
          'Éxito ≥80 por ciento en 100 episodios con semillas nuevas',
          'p95 de latencia <100 ms por acción en el hardware objetivo',
          'Instrucción parafraseada también obedecida y un fallo documentado'
        ]
      },
      quiz: [
        q('En la práctica "Apilar con palabras", ¿qué condición evita que el resultado sea solo memorización?', ['Usar 50 demostraciones', 'Evaluar 100 episodios con semillas nuevas', 'Usar un VLA pequeño', 'Simular el brazo'], 1, 'Las semillas nuevas y los estados inéditos son los que comprueban que la política generaliza.'),
        q('¿Qué latencia máxima por action exige la práctica estrella?', ['50 ms de media', 'Menos de 100 ms', '200 ms p95', 'Sin límite'], 1, 'El criterio es menos de 100 ms por acción, medido de forma honesta en el despliegue.')
      ]
    })
  ]),

  // -------------------- P4: SIMULAR PARA TRANSFERIR --------------------
  M('p4', 'Simular para transferir', 'Isaac Lab, aleatorización y la brecha con el mundo real', [
    L({
      id: 'p4-1', title: 'Isaac Lab', min: 16, level: 'intermedio',
      objectives: ['Entender la simulación paralela en GPU', 'Saber cuándo compensa Isaac Lab frente a MuJoCo'],
      blocks: [
        p('Isaac Lab es el framework de NVIDIA sobre Isaac Sim para entrenar robots con física acelerada en GPU. Permite ejecutar miles de entornos en paralelo y generar datos sintéticos con cameras realistas.'),
        diagrama('gazebo', 'Mundo, modelo, sensores y datos: la misma idea, acelerada en GPU.'),
        tabla(['', 'Isaac Lab', 'MuJoCo'], [
          ['Paralelismo', 'Miles en GPU', 'Varios en CPU'],
          ['Fotorrealismo', 'Alto (RTX)', 'Básico'],
          ['Coste', 'GPU potente', 'Ordenador normal'],
          ['Mejor para', 'RL masivo y visión', 'Control yBenchmarks']
        ]),
        codigo('python', `# Esquema conceptual de un entorno paralelo
num_envs = 4096
obs  = buffer_observaciones(num_envs)   # forma (4096, dim_obs)
acts = politica(obs)                    # una pasada para todos
estados = step(acts)                    # física en GPU`, 'La misma inferencia sirve para miles de copias del robot.'),
        apunte('Por qué el paralelismo cambia el juego', 'Con 4096 entornos, un minuto de cómputo equivale a horas de experiencia. Eso hace viables métodos de RL que antes eran imposibles, y abarata la generación de demostraciones sintéticas.'),
        aviso('Miles de entornos con el mismo error repiten el error miles de veces. La aleatorización no es opcional: es lo que convierte esa experiencia en algo transferible.'),
        nota('Empieza en MuJoCo para entender la física; salta a Isaac Lab cuando necesites escalar.')
      ],
      errors: [err('Entreno en miles de entornos y el robot real falla igual', 'Todos los entornos son idénticos, sin aleatorización', 'Randomiza masa, fricción, luz y retardos antes de escalar.')],
      practice: { task: 'Compara 4096 entornos en paralelo a 50 Hz durante 60 segundos: calcula cuántos pasos de experiencia se generan y cuánto tiempo de robot real representaría.', success: ['4096 · 50 · 60 = 12.3 millones de pasos', 'Comparación con tiempo real', 'Mencionas que la calidad depende de la randomización'] },
      quiz: [q('¿Cuál es la principal ventaja de Isaac Lab frente a MuJoCo?', ['Que no necesita física', 'El paralelismo masivo en GPU', 'Que es más barato siempre', 'Que no permite randomización'], 1, 'Miles de entornos simultáneos aceleran enormemente la recolección de experiencia.')]
    }),
    L({
      id: 'p4-2', title: 'Randomización de dominio', min: 15,
      objectives: ['Diseñar un rango de randomización útil', 'Evitar aleatorizar lo que no importa'],
      blocks: [
        p('Randomizar es cambiar los parámetros de la simulación en cada episodio para que la política no se enganche a un mundo único. Si el robot real siempre será distinto del simulado, entrena sobre una familia de mundos.'),
        diagrama('sim2real', 'Dominio aleatorizado entre entrenar y transferir.'),
        lista(['Masa y centro de masa de los objetos.', 'Fricción y coeficiente de rebote.', 'Retardo de actuación y ruido del sensor.', 'Posición e intensidad de las luces.', 'Texturas y colores de fondo.'], true),
        tabla(['Parámetro', 'Rango típico', 'Si no se randomiza'], [
          ['Masa', '0.5× a 2×', 'Fuerza mal calibrada'],
          ['Fricción', '0.3 a 1.2', 'Resbala en la mesa real'],
          ['Luz', 'Amplio', 'Falla con luz de ventana'],
          ['Retardo', '0 a 40 ms', 'Oscila en el robot real']
        ]),
        apunte('Randomiza la causa, no el síntoma', 'Cambiar el color del fondo ayuda si hay cambios de luz; cambiar la forma del cubo ayuda si varían los objetos. Añade parámetros por una razón física, no por costumbre.'),
        aviso('Demasiada randomización puede hacer la tarea imposible: si la fricción va de 0.01 a 10, la política nunca converge. Empieza con rangos estrechos y amplía según lo que falle en real.'),
        nota('La randomización es el equivalente simulado de grabar con variedad: misma idea, coste mucho menor.')
      ],
      errors: [err('La política es robusta en sim pero no en real', 'Los parámetros reales estaban fuera del rango simulado', 'Mide los parámetros reales y amplía el rango para incluirlos con margen.')],
      practice: { task: 'Diseña una tabla de randomización de 6 parámetros con rango y justificación física para una tarea de apilado. Marca cuáles medirías en el robot real.', success: ['Seis parámetros con rango', 'Justificación física por parámetro', 'Dos parámetros marcados para medir'] },
      quiz: [q('¿Qué problema causa aleatorizar demasiado un parámetro como la fricción?', ['Que el modelo sea más rápido', 'Que la tarea se vuelva imposible y la política no converja', 'Que aumente el éxito real', 'Que se reduzca el dataset'], 1, 'Un rango excesivo incluye mundos donde la tarea es inviable y estorba el aprendizaje.')]
    }),
    L({
      id: 'p4-3', title: 'La brecha sim-to-real', min: 16, level: 'intermedio',
      objectives: ['Identificar las fuentes de la brecha', 'Aplicar un plan de cierre por capas'],
      blocks: [
        p('La brecha sim-to-real es la diferencia entre lo que la política aprende en simulación y lo que encuentra en el robot. No es un número único: es una suma de errores de modelo, actuación, sensores y contacto.'),
        diagrama('sim2real', 'Cuatro etapas: sim, aleatorizar, transferir y ajustar con datos reales.'),
        tabla(['Fuente', 'En simulación', 'En real'], [
          ['Dinámica', 'Modelo ideal', 'Juego y flexión'],
          ['Contacto', 'Solver aproximado', 'Deformación real'],
          ['Sensores', 'Sin ruido', 'Ruido y retardo'],
          ['Luz', 'Texturas limpias', 'Reflejos y sombras']
        ]),
        apunte('Cerrar la brecha por capas', 'Primero iguala la dinámica y el tiempo. Luego aleatoriza percepción. Después añade unos pocos datos reales para ajustar. Saltar directamente al fine-tuning real suele ser caro e ineficiente.'),
        formula('brecha ≈ error_de_modelo + error_de_sensor + retardo', 'No es una fórmula exacta, pero recuerda que las causas se suman.'),
        aviso('Si la política falla en real, no culpes de inmediato al modelo. Mide primero: ¿está el retardo fuera de lo simulado? ¿Está la masa fuera de rango?'),
        nota('La meta no es una simulación perfecta, sino una política que tolere las diferencias inevitables.')
      ],
      errors: [err('El simulador da éxito del 95 por ciento y el real del 40', 'Brecha de dinámica y sensores sin medir', 'Mide parámetros reales, amplía rangos y añade fine-tuning con pocos episodios reales.')],
      practice: { task: 'Haz una lista de 8 diferencias entre tu simulador y tu robot y ordena las 3 que más afectan a tu tarea. Escribe cómo medirías cada una.', success: ['Ocho diferencias', 'Tres priorizadas con criterio', 'Método de medición para cada una'] },
      quiz: [q('¿Cuál es una forma eficaz de cerrar la brecha sim-to-real cuando el ajuste de dinámica ya es bueno?', ['Añadir unos pocos datos reales de fine-tuning', 'Aumentar el tamaño del modelo', 'Quitar la randomización', 'Reducir los episodios de evaluación'], 1, 'Los datos reales, aunque sean pocos, corrigen los desajustes que la simulación no puede predecir.')]
    }),
    L({
      id: 'p4-4', title: 'Sensores sintéticos', min: 14,
      objectives: ['Generar observaciones realistas en simulación', 'Conocer las trampas de la visión sintética'],
      blocks: [
        p('En simulación puedes producir imágenes, profundidad, IMU y fuerza sin cableado. Pero un sensor sintético perfecto enseña una política que luego se asusta con el ruido real.'),
        diagrama('camara', 'Calibración también en el mundo sintético.'),
        diagrama('yolo', 'Detección sobre imágenes generadas por el simulador.'),
        tabla(['Sensor sintético', 'Realismo', 'Añadir'], [
          ['RGB', 'Texturas limitadas', 'Ruido, exposición, desenfoque'],
          ['Profundidad', 'Muy limpia', 'Ruido y oclusiones'],
          ['IMU', 'Ideal', 'Deriva y sesgo'],
          ['Fuerza', 'Exacta', 'Resolución y retardo']
        ]),
        apunte('El realismo no es todo', 'A veces una textura simple generaliza mejor que un render precioso: obliga a la política a usar geometría en vez de memorizar materiales. Elige el nivel de detalle según la tarea.'),
        aviso('Si usas la cámara del simulador sin randomizar luz, el modelo aprenderá sombras que no existen en tu mesa. Añade fuentes de luz variables.'),
        lista(['Sincroniza la imagen sintética con el estado del brazo.', 'Añade latencia artificial a los sensores.', 'Guarda también frames con oclusiones parciales.'], true)
      ],
      errors: [err('El modelo falla con reflexos en la mesa real', 'El simulador no producía reflejos', 'Añade materiales speculares y fuentes de luz variables al entrenamiento.')],
      practice: { task: 'Configura una cámara sintética con tres fuentes de ruido y describe qué fallo real te ayuda a simular cada una.', success: ['Tres ruidos configurados', 'Fallo real asociado a cada uno', 'Sincronización temporal verificada'] },
      quiz: [q('¿Por qué puede ser contraproducente un sensor sintético demasiado perfecto?', ['Porque consume más GPU', 'Porque la política no aprende a tolerar el ruido real', 'Porque aumenta los fps', 'Porque cambia el color'], 1, 'Sin ruido ni retardo, el modelo se especializa en un mundo ideal que no existe en el despliegue.')]
    }),
    L({
      id: 'p4-5', title: 'Caso de marcha', min: 17, level: 'avanzado',
      objectives: ['Entender la marcha como problema subactuado', 'Aplicar sim-to-real a un robot con patas'],
      blocks: [
        p('Caminar es el ejemplo clásico de sim-to-real: el robot se cae si el modelo de contacto está mal, y entrenar en hardware rompe el robot. Por eso casi toda la marcha moderna se aprende en simulación.'),
        diagrama('subactuado', 'Marcha: captura, transferencia y empuje en un sistema subactuado.'),
        pasos([
          { title: 'Simular', text: 'Miles de cuadrúpedos con masa y fricción aleatorizadas.' },
          { title: 'Recompensa', text: 'Avanzar sin caer, con penalización a golpes y esfuerzo.' },
          { title: 'Transferir', text: 'Probar en hardware con un arnés de seguridad.' },
          { title: 'Ajustar', text: 'Fine-tuning con caídas reales registradas.' }
        ]),
        tabla(['Elemento', 'En sim', 'En real'], [
          ['Contacto del pie', 'Rígido', 'Almohadilla que se deforma'],
          ['Motor', 'Par ideal', 'Retardo y saturación'],
          ['Suelo', 'Plano', 'Desnivel y alfombra']
        ]),
        apunte('El truco del arnés', 'En las primeras pruebas reales el robot lleva un arnés. No es una trampa: es una forma de limitar el coste del fallo mientras se mide la brecha. Después se retira.'),
        aviso('Una recompensa que solo premia avanzar produce marchas que destrozan los motores. Penaliza el par excesivo y la frecuencia de impacto.'),
        nota('La marcha enseña una lección general: cuando el fallo es caro, simula primero y compra seguridad antes que coraje.')
      ],
      errors: [err('El robot caminó bien en simulación y se cae en el primer paso real', 'Retardo de motores no modelado', 'Añade retardo y saturación de par al simulador y vuelve a entrenar.')],
      practice: { task: 'Diseña una función de recompensa de 5 términos para marcha y justifica por qué al menos dos penalizan daño al hardware, no solo velocidad.', success: ['Cinco términos medibles', 'Dos términos de seguridad', 'Explicas el peso relativo'] },
      quiz: [q('¿Por qué se usa un arnés en las primeras pruebas reales de marcha?', ['Porque es más rápido', 'Para limitar el coste de las caídas mientras se mide la brecha', 'Para aumentar la velocidad', 'Porque el simulador no lo permite'], 1, 'El arnés reduce el daño durante la fase de transferencia y permite iterar con seguridad.')]
    }),
    L({
      id: 'p4-6', title: 'Tasa de éxito y honestidad', min: 15,
      objectives: ['Comparar resultados de simulación y realidad con el mismo protocolo', 'Detectar sobreajuste al simulador'],
      blocks: [
        p('La tasa de éxito en simulación suele ser mucho más alta que en real.Reportar solo la primera es engañoso, y reportar solo la segunda pierde información sobre el diseño del entrenamiento.'),
        diagrama('evals', 'Misma métrica, dos dominios: sim y real.'),
        formula('brecha = tasa_sim − tasa_real', 'Una brecha pequeña con ambas tasas altas es la señal sana.'),
        tabla(['Escenario', 'Sim', 'Real', 'Lectura'], [
          ['Bueno', '95%', '88%', 'Transferencia sólida'],
          ['Sospechoso', '99%', '40%', 'Sobreajuste al sim'],
          ['Malo', '60%', '55%', 'Tarea mal diseñada']
        ]),
        apunte('Por qué el 99 por ciento en sim es una alarma', 'Un éxito casi perfecto en simulación indica que la tarea es demasiado fácil para la política: no ha tenido que aprender a tolerar variación. Un poco de dificultad en el entrenamiento es sano.'),
        aviso('Usa el mismo criterio de éxito en sim y en real. Si en sim cuentas "casi apilado" y en real solo "apilado perfecto", la brecha es tuya, no del modelo.'),
        lista(['Muestra ambas tasas con el mismo número de episodios.', 'Usa semillas distintas en cada dominio.', 'Guarda los fallos de ambos dominios para comparar.'])
      ],
      errors: [err('Reportas 99 por ciento en simulación como resultado final', 'No mediste en el robot real', 'Añade siempre una columna real aunque sean 20 episodios, y marca la incertidumbre.')],
      practice: { task: 'Diseña una tabla de resultados con sim y real para 100 episodios cada una. Escribe cómo interpretarías una brecha de 10 puntos frente a una de 50.', success: ['Tabla con ambas columnas', 'Interpretación de dos brechas', 'Mismo criterio de éxito declarado'] },
      quiz: [q('¿Qué sugiere una tasa del 99 por ciento en simulación y del 40 por ciento en real?', ['Que el robot está roto', 'Que la política sobreajustó al simulador', 'Que la métrica es buena', 'Que hay demasiados datos'], 1, 'Una brecha grande indica que la política explotó regularidades del simulador que no existen en el mundo real.')]
    }),
    L({
      id: 'p4-7', title: 'Lo que el paper no dice', min: 16, level: 'intermedio',
      objectives: ['Cuantificar el coste real de la simulación', 'Leer con cautela los resultados de sim-to-real'],
      blocks: [
        p('Los videos de sim-to-real muestran el momento en que el robot por fin funciona. No muestran las semanas de ajuste de parámetros, las GPU alquiladas ni los servos rotos en el proceso.'),
        diagrama('sim2real', 'El camino completo, incluido el coste que no se ve.'),
        tabla(['Coste oculto', 'Ejemplo', 'Cómo reportarlo'], [
          ['Cómputo', 'GPU durante días', 'Horas y tipo de GPU'],
          ['Ingeniería', 'Ajuste de contacto', 'Semanas de calibración'],
          ['Hardware', 'Servos y piezas', 'Número de fallos reales'],
          ['Datos reales', 'Episodios de fine-tuning', 'Cantidad y tiempo']
        ]),
        apunte('Lo que el paper no dice', 'La simulación no es gratis: cambia coste de hardware por coste de ingeniería y cómputo. Antes de elegirla, calcula cuántas horas de tu tiempo valen esos parámetros de contacto que nadie documenta.'),
        aviso('No todos los fenómenos se simulan bien. La deformación de objetos blandos y los contactos con fricción compleja siguen siendo un dolor de cabeza incluso en los mejores simuladores.'),
        lista(['Reporta la versión exacta del simulador y sus parámetros.', 'Publica el espacio de randomización usado.', 'Cuenta los intentos reales fallidos, no solo el vídeo final.'], true),
        p('La simulación es una herramienta poderosa, no una atajo mágico. Su valor se mide en transferencia, no en la belleza del render.'),
        nota('La pregunta honesta no es "¿simula bien?", sino "¿cuánto me ahorró frente a probar en real?".')
      ],
      errors: [err('Reproduces el paper y no obtienes el mismo resultado', 'Faltan parámetros de simulación y randomización', 'Publica semillas, rangos y versión del simulador; pide los mismos al autor.')],
      practice: { task: 'Estima el coste de tu pipeline de simulación: horas de cómputo, horas de ajuste y episodios reales. Compáralo con grabar esa misma cantidad de datos solo en real.', success: ['Tres partidas cuantificadas', 'Comparación con alternativa real', 'Conclusión sobre cuándo compensa'] },
      quiz: [q('¿Cuál es una forma honesta de reportar un resultado de sim-to-real?', ['Solo el vídeo del éxito', 'Tasa en sim y en real con el mismo protocolo y coste de cómputo', 'Solo el porcentaje en simulación', 'Solo el número de parámetros'], 1, 'La comparabilidad exige ambos dominios, mismo criterio y transparencia sobre el coste.')]
    })
  ]),

  // -------------------- P5: DESPLEGAR --------------------
  M('p5', 'Desplegar', 'Del checkpoint en la nube al robot que responde', [
    L({
      id: 'p5-1', title: 'Cuantización', min: 15,
      objectives: ['Reducir memoria y latencia sin arruinar la política', 'Elegir entre INT8 e INT4'],
      blocks: [
        p('Cuantizar es representar los pesos con menos bits. Un modelo en INT8 ocupa la mitad que en FP16; en INT4, la cuarta parte. En robótica importa porque la memoria y la latencia son presupuestos duros.'),
        diagrama('quantization', 'FP16, INT8, INT4: menos bytes, algo de calidad.'),
        widget('coste-llm'),
        tabla(['Formato', 'Bytes por parámetro', '7B ocupa', 'Riesgo'], [
          ['FP16', '2', '~14 GB', 'Ninguno'],
          ['INT8', '1', '~7 GB', 'Pérdida leve'],
          ['INT4', '0.5', '~3.5 GB', 'Pérdida notable']
        ]),
        apunte('Mide calidad, no solo tamaño', 'Después de cuantizar, vuelve a evaluar la tasa de éxito. Un modelo INT4 que cabe en el dispositivo pero falla el 20 por ciento de los episodios no es una mejora.'),
        aviso('Cuantizar la head de acción puede degradar la precisión más que cuantizar el backbone. Prueba ambos por separado y decide con datos.'),
        nota('La cuantización es el primer paso del despliegue edge, no el último: después viene la compilación para el hardware concreto.'),
        enlace('https://huggingface.co/docs/transformers/quantization', 'Guía de cuantización de Transformers', 'Formatos y ejemplos para reducir el tamaño de modelos.')
      ],
      errors: [err('Tras cuantizar a INT4 la tasa de éxito cae demasiado', 'Demasiada pérdida de precisión en la salida', 'Prueba INT8 o cuantiza solo el backbone y conserva la head en mayor precisión.')],
      practice: { task: 'Cuantiza un modelo pequeño a INT8 y compara tamaño en disco, latencia y tasa de éxito en 20 episodios. Escribe la tabla de tres columnas.', success: ['Tres números medidos', 'Comparación con FP16', 'Decisión justificada con la tasa de éxito'] },
      quiz: [q('Un modelo de 7B en INT4 ocupa aproximadamente cuánto?', ['14 GB', '7 GB', '3.5 GB', '1 GB'], 2, '0.5 bytes por parámetro · 7·10^9 ≈ 3.5 GB, sin contar overhead.')]
    }),
    L({
      id: 'p5-2', title: 'Control a 50 Hz e inferencia <100 ms', min: 17, level: 'avanzado',
      objectives: ['Diseñar un bucle de control con presupuesto medible', 'Separar control rápido de inferencia lenta'],
      blocks: [
        p('El lazo de control corre a 50 Hz: una decisión cada 20 ms. La inferencia de un VLA puede tardar más, así que se usa un chunk de acciones: se predicen varios pasos y se ejecutan mientras llega el siguiente.'),
        diagrama('rtos', 'Tareas con prioridades: control, sensores y red.'),
        widget('pid'),
        formula('chunk de N acciones × 20 ms ≈ N · 20 ms de ejecución', 'Si la inferencia tarda menos que el chunk, el lazo nunca espera.'),
        tabla(['Tarea', 'Frecuencia', 'Prioridad'], [
          ['Control de servos', '50–200 Hz', 'Alta'],
          ['Lectura de sensores', '100 Hz', 'Alta'],
          ['Inferencia de política', '5–10 Hz', 'Media'],
          ['Telemetría y log', '1–10 Hz', 'Baja']
        ]),
        apunte('La regla del chunk', 'Si quieres 100 ms de presupuesto para la inferencia, predice un chunk de 5 acciones a 50 Hz y ejecútalas en 100 ms. El control sigue a 50 Hz aunque el modelo solo se ejecute 10 veces por segundo.'),
        aviso('Si la inferencia supera el chunk, el brazo se queda sin comandos. Añade un watchdog que mantenga la última acción segura o frene suavemente.'),
        p('En hardware real, mide el tiempo desde que se captura la imagen hasta que el servo recibe el comando. Esa es la latencia que importa, no la del modelo aislado.')
      ],
      errors: [err('El brazo se queda quieto a intervalos regulares', 'La inferencia tarda más que el chunk de acciones', 'Aumenta el chunk, optimiza el modelo o añade un buffer con acción de seguridad.')],
      practice: { task: 'Diseña un sistema con control a 50 Hz e inferencia de 100 ms. Calcula el tamaño mínimo del chunk y escribe qué hace el watchdog si la inferencia llega tarde.', success: ['Chunk de al menos 5 acciones', 'Presupuesto de 20 ms por acción', 'Watchdog con acción segura definida'] },
      quiz: [q('Con control a 50 Hz e inferencia de 100 ms, ¿cuántas acciones debe cubrir un chunk como mínimo?', ['2', '5', '20', '100'], 1, '100 ms / 20 ms por acción = 5 acciones. Así el control nunca espera al modelo.')]
    }),
    L({
      id: 'p5-3', title: 'Edge offline', min: 14,
      objectives: ['Entender las restricciones de correr en el dispositivo', 'Decidir qué se ejecuta localmente y qué en la nube'],
      blocks: [
        p('Edge offline significa que la política corre en el robot o en un dispositivo cercano, sin depender de internet. En robótica eso no es solo privacidad: es latencia y supervivencia cuando falla la red.'),
        diagrama('edge', 'Cuantización, compilación, NPU/GPU y privacidad.'),
        tabla(['Opción', 'Ventaja', 'Coste'], [
          ['Nube', 'Modelo grande', 'Latencia y dependencia de red'],
          ['Edge GPU', 'Baja latencia', 'Consumo y calor'],
          ['Edge CPU/NPU', 'Bajo consumo', 'Modelo pequeño']
        ]),
        apunte('Qué va en el dispositivo', 'La política de alto nivel y el control van siempre local. El planificador pesado y el logging pueden ir en la nube si la red aguanta, pero nunca en el camino crítico del lazo.'),
        lista(['Mide consumo energético y temperatura en carga sostenida.', 'Define qué pasa si la red cae: el robot debe seguir seguro.', 'Versiona el modelo y el runtime por separado.'], true),
        aviso('Un modelo que funciona en tu portátil puede calentar y throttlear en una caja sin ventilación. Prueba 30 minutos seguidos.'),
        nota('Offline también cambia las pruebas: necesitas reproducir el mismo modelo en el mismo hardware, sin servicios externos que cambien.')
      ],
      errors: [err('El robot falla cuando pierde WiFi', 'La política estaba en la nube', 'Mueve la inferencia crítica al dispositivo y usa la red solo para telemetría.')],
      practice: { task: 'Dibuja la arquitectura edge de tu robot: qué corre local, qué corre en red y qué ocurre si la red falla. Añade dos métricas que monitorizarás.', success: ['Separas ruta crítica y no crítica', 'Plan explícito ante pérdida de red', 'Dos métricas concretas'] },
      quiz: [q('¿Qué debe correr siempre en el dispositivo en un robot autónomo?', ['El entrenamiento', 'La política y el control en la ruta crítica', 'El monitor de datos', 'El dashboard'], 1, 'La ruta crítica no puede depender de la red; el resto puede moverse a la nube.')]
    }),
    L({
      id: 'p5-4', title: 'ONNX y WASM en iPad', min: 16, level: 'avanzado',
      objectives: ['Entender la ruta de exportación a un navegador', 'Conocer las limitaciones de WASM en Safari'],
      blocks: [
        p('Exportar a ONNX y ejecutar con un runtime WebAssembly permite correr un modelo dentro de una página web, incluso en un iPad. Es una forma barata de tener una demo interactiva sin app nativa.'),
        diagrama('edge', 'Cuantización, compilación y ejecución en el dispositivo.'),
        codigo('python', `# Exportar un modelo pequeño a ONNX
import torch
torch.onnx.export(
    policy, dummy_obs, "policy.onnx",
    input_names=["observation"], output_names=["action"],
    opset_version=17,
)`, 'La exportación fija las formas de entrada y salida.'),
        tabla(['Runtime', 'Ventaja', 'Limitación en iPad'], [
          ['ONNX Runtime Web (WASM)', 'Portátil', 'Sin GPU fiable en Safari'],
          ['Core ML (app nativa)', 'NPU del Apple Silicon', 'Requiere app'],
          ['WebGPU', 'Aceleración', 'Soporte variable']
        ]),
        apunte('WASM no es magia', 'En un navegador, WASM corre en CPU. Un modelo que tarda 40 ms en una GPU puede tardar varios cientos en WASM. Para robótica real, la demo del iPad sirve para visualizar, no para cerrar el lazo a 50 Hz.'),
        aviso('Comprueba el soporte de operadores: un modelo con operadores no soportados falla en tiempo de ejecución, no al exportar.'),
        nota('Una arquitectura sensata: VLA en un ordenador con GPU, iPad como interfaz que muestraEstado y envía instrucciones.')
      ],
      errors: [err('El modelo exportado falla al cargar en el navegador', 'Operador no soportado por el runtime WASM', 'Simplifica el grafo o usa un runtime con soporte para ese operador.')],
      practice: { task: 'Exporta un modelo pequeño a ONNX, mide su tamaño y el tiempo de inferencia en un navegador con WASM. Compara con el tiempo en Python.', success: ['Tamaño y dos latencias medidos', 'Explicas la diferencia', 'Identificas un operador sensible'] },
      quiz: [q('¿Cuál es la principal limitación de ONNX Runtime Web con WASM en un iPad?', ['Que no puede cargar modelos', 'Que corre principalmente en CPU, con latencia alta', 'Que no soporta imágenes', 'Que solo funciona en Safari'], 1, 'WASM ejecuta en CPU; la aceleración GPU/NPU depende del navegador y no está garantizada.')]
    }),
    L({
      id: 'p5-5', title: 'Monitoring', min: 14,
      objectives: ['Detectar degradación después del despliegue', 'Diseñar alertas útiles y no ruidosas'],
      blocks: [
        p('Desplegar no es terminar. La política empieza a encontrarse con luz, objetos y usuarios nuevos. Monitoring es la forma de enterarse antes de que el cliente lo haga.'),
        diagrama('mlops', 'Datos, experimentos, pipeline, registro y monitoreo.'),
        diagrama('drift', 'El drift aparece cuando la entrada real cambia respecto al entrenamiento.'),
        tabla(['Señal', 'Qué detecta', 'Alerta'], [
          ['Latencia p95', 'Degradación del runtime', '> 100 ms'],
          ['Tasa de éxito', 'Cambio de tarea o entorno', 'Caída de 10 puntos'],
          ['Drift de imagen', 'Luz u objetos nuevos', 'Distancia alta'],
          ['Valor congelado', 'Sensor roto', '20 muestras iguales']
        ]),
        apunte('Monitorea la entrada, no solo la salida', 'Si solo miras el éxito, descubres el problema cuando ya falló. El drift de la observación te avisa antes: la cámara cambió antes de que la política fallara.'),
        aviso('Demasiadas alertas son tan malas como ninguna. Cada alerta debe tener un dueño y una acción concreta.'),
        lista(['Guarda una muestra pequeña de episodios fallidos.', 'Registra la versión del modelo con cada episodio.', 'Revisa el dashboard cada semana, no solo cuando algo falla.'], true)
      ],
      errors: [err('El equipo descubre la degradación por un usuario', 'No había monitorización de drift ni de latencia', 'Añade alertas sobre la distribución de entrada y el p95 de latencia.')],
      practice: { task: 'Diseña un panel de 4 métricas con umbral y acción para cada una. Escribe qué harías si la tasa de éxito cae 10 puntos sin cambio de modelo.', success: ['Cuatro métricas con umbral', 'Acción concreta por métrica', 'Plan de diagnóstico ordenado'] },
      quiz: [q('¿Por qué monitorizar el drift de la entrada puede ser más útil que monitorizar solo el éxito?', ['Porque es más barato', 'Porque avisa antes de que falle la tarea', 'Porque sustituye a las pruebas', 'Porque reduce el tamaño del modelo'], 1, 'Los cambios en la distribución de entrada preceden a la caída de rendimiento.')]
    }),
    L({
      id: 'p5-6', title: 'Cuando la demo falla', min: 15,
      objectives: ['Saber reaccionar ante un fallo en vivo', 'Diseñar degradación elegante y seguridad'],
      blocks: [
        p('Toda demo falla en el momento menos oportuno. La diferencia entre un prototipo y un sistema es qué hace cuando eso pasa: ¿se detiene seguro o sigue moviéndose sin sentido?'),
        diagrama('brownout', 'La cadena de fallo típica: pico, caída de tensión y reset.'),
        pasos([
          { title: 'Detectar', text: 'Watchdog de latencia, sensor congelado o fuerza fuera de rango.' },
          { title: 'Frenar', text: 'Detener el movimiento con una trayectoria suave, no un corte brusco.' },
          { title: 'Aislar', text: 'Guardar el estado y el vídeo del episodio fallido.' },
          { title: 'Recuperar', text: 'Volver a un estado seguro y repetir la prueba con logging.' }
        ]),
        tabla(['Fallo', 'Respuesta correcta', 'Respuesta peligrosa'], [
          ['Inferencia tarde', 'Mantener última acción segura', 'Repetir acción anterior al azar'],
          ['Sensor congelado', 'Parar y avisar', 'Seguir con el último valor'],
          ['Fuerza excesiva', 'Retirar el efector', 'Aumentar la ganancia']
        ]),
        apunte('Degradación elegante', 'Un buen sistema pasa de "modo inteligente" a "modo seguro" sin intervención. En robótica, el modo seguro casi siempre significa parar, retirarse y pedir ayuda.'),
        aviso('Nunca pruebes la recuperación por primera vez delante de un cliente. Ensaya el fallo a propósito con objetos de cartón.'),
        nota('El vídeo del fallo con su diagnóstico es el mejor material que puedes mostrar en una entrevista.')
      ],
      errors: [err('Tras un fallo el brazo sigue moviéndose', 'No hay watchdog ni estado de seguridad', 'Define un estado seguro y una transición automática ante cualquier señal inválida.')],
      practice: { task: 'Escribe un plan de 6 pasos para provocar y documentar un fallo controlado de tu demo: qué señal fuerzas, qué observas y qué guardas.', success: ['Seis pasos ejecutables', 'Estado seguro definido', 'Datos del fallo guardados'] },
      quiz: [q('¿Cuál es la respuesta correcta ante una inferencia que llega tarde?', ['Repetir la última acción arbitrariamente', 'Mantener una acción segura y señalar el fallo', 'Aumentar la velocidad', 'Ignorar el retardo'], 1, 'La prioridad es la seguridad del lazo; repetir acciones al azar puede causar una colisión.')]
    }),
    L({
      id: 'p5-7', title: 'Lo que el paper no dice', min: 16, level: 'intermedio',
      objectives: ['Contar el coste total de desplegar una política', 'Cerrar el track con criterio honesto'],
      blocks: [
        p('El paper termina en la tabla de resultados. Tu proyecto termina cuando el robot lleva una semana funcionando sin que nadie lo rescate. Entre ambos puntos hay mantenimiento, fallos y decisiones incómodas.'),
        diagrama('evals', 'La evaluación no acaba en el paper: continúa en producción.'),
        tabla(['Partida', 'Lo que se dice', 'Lo que cuesta realmente'], [
          ['Inferencia', 'Tiempo real', 'GPU, calor y throttling'],
          ['Datos', 'Decenas de demos', 'Horas de teleoperación'],
          ['Robustez', 'Tasa de éxito', 'Reset y reposición de objetos'],
          ['Operación', 'Sin detalles', 'Monitorización y personas']
        ]),
        apunte('Lo que el paper no dice', 'El coste total incluye el tiempo de quien arregla la demo. Un sistema con 80 por ciento de éxito que necesita supervisión constante puede ser más caro que uno con 70 por ciento que se deja solo.'),
        aviso('No confundas "funciona en mi mesa" con "funciona en la mesa de otro". Cambia de sala, de luz y de operador antes de dar por terminado el proyecto.'),
        lista(['Publica la tasa de éxito y su intervalo de confianza.', 'Cuenta las horas de operación y los fallos atendidos.', 'Escribe qué parte no se pudo automatizar y por qué.'], true),
        p('Este track empezó con la idea de que el cuerpo es un dato. Termina con la certeza de que desplegar es una disciplina propia: medir, limitar y contar la verdad.'),
        nota('Tu mejor entregable no es el vídeo del éxito: es el registro de lo que falló y de cuánto costó arreglarlo.')
      ],
      errors: [err('Presentas el proyecto como terminado tras una demo buena', 'No mediste operación sostenida', 'Registra una semana de uso real con fallos y horas de mantenimiento antes de cerrar.')],
      practice: { task: 'Escribe el README final del track con: número de episodios y semillas, tasa de éxito e intervalo, p95 de latencia, coste de datos y una sección "lo que el paper no dice" con tres fallos reales.', success: ['Cinco secciones con números medidos', 'Tres fallos documentados con causa', 'Sin cifras sin protocolo'] },
      quiz: [q('¿Qué señal indica que un sistema está realmente desplegado, no solo demostrado?', ['Que el vídeo sea reciente', 'Que lleva una semana operando con fallos registrados y coste medido', 'Que use un VLA grande', 'Que esté en un paper'], 1, 'La operación sostenida con registro honesto distingue un prototipo de un sistema.')]
    })
  ])
];

export const physicalTrack = {
  id: 'fisica' as const,
  title: 'Manos con Modelo',
  tagline: 'Del token al torque: la IA aprende a ensuciarse las manos.',
  description: 'Seis bloques para llevar un modelo de lenguaje al mundo físico: por qué el texto no basta, qué sienten los robots, cómo imitar demostraciones, qué son los VLA, cómo simular para transferir y qué significa desplegar de verdad. Con números honestos, nombres reales y una práctica estrella que apila cubos con palabras.',
  icon: '⌬',
  accent: '#2F7A55',
  modules: physicalModules
};
