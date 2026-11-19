import type { LessonBridge } from '../../types';
import { p, apunte, formula, tabla, nota, aviso } from '../helpers';

/**
 * Costura pedagógica del track de robótica (133 lecciones, b0–b14).
 * Cada entrada explica por qué existe el tema, de dónde viene y adónde va,
 * nombrando siempre la lección vecina por su título real.
 */
export const roboticsBridges: Record<string, LessonBridge> = {

  // ==================== B0: ORIENTACIÓN Y SUPERVIVENCIA ====================
  'r0-1': {
    why: `La robótica es la única rama de la ingeniería donde tu código se encuentra con un cable suelto y no con un stack trace. Un modelo de IA se clona en una tarde; un brazo que agarra sin romper el objeto no, porque los datos para entrenarlo hay que generarlos moviendo hardware real. Saber esto el primer día evita que pierdas semanas buscando en internet una respuesta que solo existe en el banco de trabajo.`,
    from: `No hay lección anterior: aquí solo se decide por qué conviene entrar por la robótica y no quedarse en la IA pura.`,
    to: `Queda la pregunta de dónde se trabaja realmente: la responde «Qué hace realmente un ingeniero de robótica», que reparte el campo en siete capas con sus herramientas.`,
    analogy: `Es como elegir entre cocinar con una receta descargada y fabricar el horno: la receta se copia en segundos, el horno hay que diseñarlo, cablearlo y calibrarlo.`,
    extraBlocks: [
      p(`El brazo de 6 ejes cuesta 20.000–60.000 €, pero la celda completa ronda los 80.000 €: el robot es solo el 25 % del presupuesto. El 75 % restante es ingeniería, seguridad e integración, que es justo donde hay trabajo.`),
      apunte(`El dato que casi nadie menciona: los datos físicos no se pueden scrapear. Cada episodio de teleoperación cuesta tiempo real de una persona moviendo un brazo, así que el cuello de botella del robot learning es la captura, no la arquitectura del modelo.`),
      tabla(['Habilidad', 'Se puede falsear', 'Se clona en una tarde'], [
        ['Prompt de un LLM', 'Algo', 'Sí'],
        ['Leer un esquemático', 'No', 'No'],
        ['Hacer que un eje no tiemble', 'No', 'No'],
        ['Generar datos reales de contacto', 'No', 'No']
      ])
    ]
  },
  'r0-2': {
    why: `Un ingeniero no «hace robots» en abstracto: responde una pregunta concreta dentro de una capa y debe ser lo suficientemente literato en las demás para discutir con el que viene al lado. Si no conoces las fronteras, intentas dominar siete disciplinas a la vez y no profundizas en ninguna. Esta lección evita ese error antes de que quemes tiempo y dinero.`,
    from: `«Por qué robótica (y no solo IA)» te convenció de que la barrera física es real; faltaba saber cómo se divide ese trabajo entre especialidades.`,
    to: `La pregunta abierta es cómo estudiarlo todo sin dispersarse: «Cómo usar esta academia» da el método de trabajo y la regla del README.`,
    analogy: `Es como un equipo de fútbol: el portero no hace de delantero, pero tiene que entender qué espera el delantero del pase.`,
    extraBlocks: [
      p(`En una oferta real de firmware aparecen C++, ESP-IDF, PWM y RTOS; en una de percepción aparecen OpenCV, PCL, cámaras y tf2. Ninguna pide las siete capas: piden profundidad en una y vocabulario en el resto.`),
      apunte(`Los anuncios casi nunca exigen un título concreto, pero sí «hardware real» y «debugging». La razón es práctica: un fallo de integración no se delega a otro equipo porque nadie más tiene el robot en la mesa.`),
      nota(`Si vienes de ser SWE, tu deuda no es programar: es electrónica y control. Por eso el track arranca en el multímetro y no en ROS 2.`)
    ]
  },
  'r0-3': {
    why: `Un portafolio de robótica se mide en cosas que se movieron y en números que alguien puede verificar, no en cursos terminados. Sin una regla de documentación desde el primer proyecto, llegas a la entrevista con repos que no sabes defender. Esta lección fija el formato antes de que acumules desorden.`,
    from: `«Qué hace realmente un ingeniero de robótica» te mostró las siete capas; aquí se decide cómo registrar el trabajo en cada una de ellas.`,
    to: `Con el método de estudio fijado, el siguiente paso es la primera capa física: «Voltaje, corriente, resistencia y ley de Ohm» empieza por el multímetro.`,
    analogy: `Es como abrir el cuaderno de laboratorio antes del primer experimento: el día que algo falla, el apunte es la única prueba de lo que mediste.`,
    extraBlocks: [
      p(`Un README con 20 s de vídeo, un esquemático, tres cifras medidas y la sección «qué se rompió» vale más que diez repositorios con el código del tutorial sin tocar.`),
      apunte(`Exporta el progreso a JSON al final de cada semana. No es burocracia: te permite migrar de dispositivo sin perder el historial de qué decidiste y cuándo.`),
      aviso(`Copiar un proyecto sin entenderlo es trampas detectables en cinco preguntas. En robótica el entrevistador pide el porqué de cada cable, no el link del tutorial.`)
    ]
  },

  // ==================== B1: ELECTRÓNICA DESDE CERO ====================
  'r1-1': {
    why: `Todo lo que viene después —un divisor, un driver, una lectura de ADC— es ley de Ohm con más capas. Si no sabes distinguir presión de caudal, confundirás voltaje con corriente y acabarás quemando un pin intentando alimentar un motor. Esta es la única lección donde una formula mal aplicada cuesta hardware irreversible.`,
    from: `«Cómo usar esta academia» te dio el método de trabajo; ahora empieza la primera capa física y el instrumento que la mide.`,
    to: `La ley de Ohm funciona en un resistor suelto, pero un circuito tiene varios: «Kirchhoff, series y paralelos» da las reglas para reducirlos.`,
    analogy: `Un circuito es como agua en una tubería: el voltaje es la presión, la corriente el caudal y la resistencia lo estrecho que está el paso; lo que se disipa es calor, no agua consumida.`,
    extraBlocks: [
      p(`LED rojo de Vf = 1.8 V alimentado a 3.3 V con 10 mA: R = (3.3 − 1.8)/0.010 = 150 Ω. La potencia es I²R = 0.015 W, así que una resistencia de 1/4 W sobra; con 5 V la misma R disiparía 0.32 W y ya habría que subir a 1/2 W.`),
      apunte(`El multímetro en modo corriente va EN SERIE: para medirlo hay que cortar el circuito. Ponerlo en paralelo como el voltaje crea un cortocircuito y funde el fusible; es el error de principiante más caro del banco.`),
      formula(`V = I · R    |    P = V · I = I² · R = V² / R`)
    ]
  },
  'r1-2': {
    why: `Kirchhoff convierte la intuición en contabilidad: la corriente que entra en un nodo sale y las caídas de un lazo suman cero. Sin esas dos leyes no puedes predecir un circuito con más de un elemento, y tener que montarlo para ver qué pasa es caro y lento.`,
    from: `«Voltaje, corriente, resistencia y ley de Ohm» resolvía un resistor; aquí se reduce una red entera de ellos.`,
    to: `Con series y paralelos dominados falta el truco más usado: «Divisores de voltaje y su trampa» aplica KVL para fabricar una tensión menor.`,
    analogy: `En paralelo la tensión es la misma en cada rama como la presión en dos grifos del mismo tubo; en serie la corriente es la misma como el caudal que pasa por dos estrechamientos seguidos.`,
    extraBlocks: [
      p(`R1 = 10 kΩ y R2 = 20 kΩ en serie con 9 V: I = 9/30.000 = 0.3 mA; la caída en R1 es 3 V y en R2 es 6 V. Ese nodo intermedio de 6 V es la salida de un divisor.`),
      apunte(`Dos resistencias iguales en paralelo dan la mitad; dos desiguales dan menos que la menor. Es útil para aumentar la corriente disponible de una fuente, pero no para «repartir» voltaje: en paralelo el voltaje no se reparte.`, ``),
      formula(`Serie: Rt = ΣRi    |    Paralelo: 1/Rt = Σ(1/Ri)    |    2 en paralelo: Rt = R1·R2/(R1+R2)`)
    ]
  },
  'r1-3': {
    why: `El divisor es la forma más barata de adaptar un sensor de 5 V a una entrada de 3.3 V, y también el fallo más silencioso del principiante: funciona en vacío y se desploma en cuanto lo cargas. Saber calcular su impedancia evita perder horas mirando un ADC que «lee mal».`,
    from: `«Kirchhoff, series y paralelos» te dio la reducción; el divisor es solo KVL más Ohm aplicados a dos resistencias.`,
    to: `El divisor supone que nadie carga la salida; «Capacitores y desacople» introduce el primer elemento que sí cambia de comportamiento con el tiempo.`,
    analogy: `Un divisor es como dos grifos en serie con una manguera intermedia: si pinchas la manguera para sacar mucha agua, la presión en ese punto cae.`,
    extraBlocks: [
      p(`Para bajar 5 V a 3.3 V con R1 = 10 kΩ: R2 = R1·Vout/(Vin − Vout) = 10k·3.3/1.7 ≈ 19.4 kΩ. La corriente por el divisor es 5/(10k+19.4k) ≈ 0.17 mA; si el ADC consumiera 0.17 mA, la lectura se desplomaría a la mitad.`),
      apunte(`La regla del 10×: la corriente del divisor debe ser al menos diez veces la de la carga. En un ADC de ESP32 basta con bajar a 2 kΩ/3.3 kΩ (1 mA) o añadir un seguidor con op-amp; subir la corriente cuesta energía pero compra estabilidad.`),
      formula(`Vout = Vin · R2/(R1 + R2)    |    R2 = R1 · Vout/(Vin − Vout)`)
    ]
  },
  'r1-4': {
    why: `Un capacitor es un depósito que responde antes que la fuente: por eso cada chip lleva uno pegado a sus pines. Si no entiendes que en DC es un circuito abierto y en transitorio un corto, no sabrás explicar por qué un robot se resetea al arrancar un motor.`,
    from: `«Divisores de voltaje y su trampa» terminó con una salida que se hunde al cargarla; el capacitor es la primera herramienta que sostiene esa tensión.`,
    to: `Sabes guardar energía, pero aún no sabes dejarla pasar solo en un sentido: «Diodos, LEDs y protectores» introduce la válvula unidireccional.`,
    analogy: `Es como un depósito de agua conectado a la red: cuando abres el grifo de golpe, el depósito da el primer chorro antes de que la bomba reaccione.`,
    extraBlocks: [
      p(`τ = R·C. Con R = 10 kΩ y C = 100 µF, τ = 1 s: a los 1 s el capacitor está al 63 %, a los 5 s al 99 %. En desacople, 100 nF a 2 mm del pin cubre 10–100 MHz; un 100 µF a 5 cm no cubre nada de eso.`),
      apunte(`La constante de tiempo no es el tiempo de carga «completa»: es el 63 %. Los ingenieros de banco usan 5τ como regla práctica porque e⁻⁵ ≈ 0.0067, y aun así el error del 0.7 % importa en un filtro.`),
      formula(`τ = R · C    |    Vc(t) = V · (1 − e^(−t/τ))    |    Q = C · V`)
    ]
  },
  'r1-5': {
    why: `El diodo aparece en todas partes: como LED, como protección y como camino de escape para la energía de una bobina. Si lo montas al revés en una bobina, creas un cortocircuito; si omites el flyback, quemas el transistor. Es una lección donde la dirección de la corriente decide si el circuito sobrevive.`,
    from: `«Capacitores y desacople» te enseñó a guardar energía; el diodo decide por dónde se descarga esa energía cuando cortas una bobina.`,
    to: `Con LED, flyback y protección ya puedes conmutar, pero necesitas un interruptor controlable: «Transistores y MOSFETs como interruptores» lo pone en manos del microcontrolador.`,
    analogy: `Un diodo es como una válvula de retención en una tubería: deja pasar el agua en un sentido y la bloquea en el otro; el flyback es una válvula de alivio que se abre solo cuando sube demasiado la presión.`,
    extraBlocks: [
      p(`LED blanco con Vf = 3.0 V a 10 mA desde 12 V: R = (12 − 3)/0.01 = 900 Ω; usa 910 Ω estándar y la potencia es 0.09 W. Con 5 V serían 200 Ω (usa 220 Ω).`),
      apunte(`El diodo flyback se monta en INVERSO sobre la bobina: cátodo al lado positivo, ánodo a masa. En directo cortocircuita la fuente; en inverso solo conduce cuando la fem inducida invierte la polaridad al abrir el interruptor.`),
      aviso(`Un LED sin resistencia no «se quema luego»: se quema en el primer milisegundo. Calcula R antes de soldar, no después de verlo brillar.`)
    ]
  },
  'r1-6': {
    why: `Un pin de GPIO da 20 mA y un motor pide 500 mA; sin etapa de conmutación no hay robot que se mueva. Elegir entre BJT y MOSFET no es cuestión de moda: un MOSFET mal excitado con 3.3 V se queda en zona activa y se cocina.`,
    from: `«Diodos, LEDs y protectores» te dio el camino de descarga; aquí aparece el interruptor que abre y cierra ese camino.`,
    to: `Ya sabes conmutar cargas; falta decidir quién alimenta todo: «Fuentes, reguladores y baterías LiPo» cierra el bloque de energía.`,
    analogy: `El transistor es como un grifo manejado con poca fuerza: con un toque pequeño en el mando (base o gate) controlas un caudal grande por la tubería principal.`,
    extraBlocks: [
      p(`BJT con hFE = 100 para conmutar 100 mA: Ib ≈ 1 mA, así que con 3.3 V necesitas Rb ≈ (3.3 − 0.7)/0.001 ≈ 2.6 kΩ; usa 2.2 kΩ para asegurar saturación. Un MOSFET logic-level con Rds(on) = 50 mΩ a 3 A disipa 0.45 W.`),
      apunte(`Un MOSFET «de potencia» que no es logic-level puede necesitar 10 V de gate. Con 3.3 V conduce a medias, se calienta y falla: comprueba siempre la curva Rds(on) frente a Vgs en el datasheet.`),
      formula(`BJT: Ib ≈ Ic/hFE    |    MOSFET: P_disip = I² · Rds(on)    |    Vgs debe superar Vgs(th) con margen`)
    ]
  },
  'r1-7': {
    why: `Todo robot necesita una tensión estable, y la fuente elegida mal es la causa de la mitad de los fallos «de software» que verás después. Un LDO con Vin ≫ Vout convierte la diferencia en calor; una LiPo mal tratada puede incendiarse. Dimensionar con margen es una decisión de seguridad, no de estilo.`,
    from: `«Transistores y MOSFETs como interruptores» ya conmuta la carga; ahora hay que darle una alimentación que aguante el pico.`,
    to: `Con la energía resuelta, hace falta leer el plano antes de soldar: «Leer esquemáticos y datasheets» convierte el PDF en decisiones.`,
    analogy: `Un regulador es como un regulador de presión de gas: mantiene la salida constante aunque la entrada (la botella) baje, siempre que no le pidas más caudal del que puede dar.`,
    extraBlocks: [
      p(`LiPo 2S 2200 mAh 30C: Imáx = 30 · 2.2 = 66 A. Con un buck de 7.4 V a 5 V al 90 % y un motor de 1.5 A, la batería ve ≈ 1.5·5/(7.4·0.9) ≈ 1.13 A; sobra. La corriente de arranque, no la media, dimensiona el cable.`),
      apunte(`El brownout no es un bug de código: al arrancar, el motor pide I_stall = V/Ra y hunde VDD. La receta es fuente con margen, 470 µF junto al driver y ramas separadas para motor y lógica con un único punto de unión de masas.`),
      tabla(['Fuente', 'Ventaja', 'Coste real'], [
        ['LDO 7805', 'Simple, limpia', 'Disipa (Vin−Vout)·I: con 12→5 V y 1 A, 7 W de calor'],
        ['Buck LM2596', '~90 % eficiente', 'Ruido de conmutación, necesita desacople'],
        ['Buck-boost', 'Sostiene V con batería baja', 'Más caro y más ruidoso']
      ])
    ]
  },
  'r1-8': {
    why: `Un esquemático no dice dónde van las piezas, sino cómo se conectan: saber leerlo te libera de copiar cableados de fotos que nadie puede verificar. En un datasheet de 200 páginas, buscar con Ctrl+F la sección correcta ahorra horas y evita confundir el límite de destrucción con el rango de funcionamiento.`,
    from: `«Fuentes, reguladores y baterías LiPo» planteó la pregunta de qué componente elegir; el datasheet es donde se contesta.`,
    to: `Con el esquemático leído, queda ejecutarlo físicamente: «El banco: multímetro, protoboard y soldadura» convierte el papel en una unión fiable.`,
    analogy: `Leer un esquemático es como leer un plano de fontanería: no te dice dónde poner el grifo en la pared, pero sí qué tubería va a qué desagüe.`,
    extraBlocks: [
      p(`Un LM1117-3.3 con Vin = 12 V y 200 mA disipa (12 − 3.3)·0.2 ≈ 1.74 W: en un SOT-223 sin disipador la unión sube ~120 °C sobre ambiente. El datasheet te lo dice en la curva de deriva térmica, no en la primera página.`),
      apunte(`Absolute Maximum Ratings es el punto de destrucción; Recommended Operating Conditions es donde se garantiza que funciona. Diseñar en la zona media entre ambos es normal; diseñar en el primero es ruleta rusa.`),
      nota(`El «Typical Application Circuit» suele ser oro: es el único esquema que el fabricante garantiza que funciona con los valores que pone.`)
    ]
  },
  'r1-9': {
    why: `En robótica un cable suelto no tiene log: el multímetro y una buena soldadura son tus únicos instrumentos de depuración. Medir corriente en paralelo o confundir una unión fría con un fallo de código te puede costar una tarde entera, o una placa.`,
    from: `«Leer esquemáticos y datasheets» te dio el mapa; aquí se aprende a comprobar que el montaje coincide con el mapa.`,
    to: `La electrónica ya está bajo control; el bloque siguiente cambia de herramienta: «Python para robótica» introduce el software que manejará esos sensores.`,
    analogy: `Una unión fría es como un tornillo puesto a mano sin apretar: aguanta hasta que vibras, y entonces falla justo cuando nadie está mirando.`,
    extraBlocks: [
      p(`Una resistencia de 10 kΩ medida en circuito puede dar 8 kΩ porque otra rama de 40 kΩ está en paralelo. Levanta un extremo antes de medir: es la diferencia entre un componente bueno y una lectura engañosa.`),
      apunte(`La punta del multímetro en modo continuidad puede tener 0.2 Ω propios. Resta esa resistencia de las sondas antes de culpar a una soldadura, sobre todo cuando mides planos de masa.`),
      aviso(`Nunca sueldes con la placa alimentada. El estaño caliente puede puentear dos pines y el daño aparece semanas después como «algo raro que a veces pasa».`)
    ]
  },

  // ==================== B2: PYTHON, TERMINAL Y GIT ====================
  'r2-1': {
    why: `Un script de 30 líneas se convierte en un nodo ROS 2 y después en un sistema con tres procesos; escribirlo sin types ni logging convierte la depuración en arqueología. Python no es opcional en robótica: es el pegamento entre el hardware y los modelos.`,
    from: `«El banco: multímetro, protoboard y soldadura» terminó la capa física; ahora entra el código que leerá esos sensores.`,
    to: `Necesitas moverte por la terminal y versionar: «Terminal y Git» da el entorno donde vive todo el trabajo posterior.`,
    analogy: `Es como pasar de apuntar a mano a una hoja de cálculo: al principio da igual, pero cuando tienes 10.000 lecturas, la estructura es lo que te salva.`,
    extraBlocks: [
      p(`Un logger con dataclass y json.dump escribe 100 muestras con 3 claves en ~40 KB; el mismo contenido en CSV son ~6 KB. Elige JSON cuando importe la estructura y CSV cuando importe el volumen.`),
      apunte(`vars(x) funciona con dataclasses porque devuelve __dict__; con __slots__ no existe y json.dump fallará. Es un detalle que aparece justo cuando el logger lleva dos semanas funcionando.`),
      nota(`Nunca instales paquetes con sudo pip: rompe el Python del sistema y ROS 2 deja de importar. Un venv por proyecto es higiene, no burocracia.`)
    ]
  },
  'r2-2': {
    why: `ROS 2, ESP-IDF, Docker y colcon no tienen interfaz gráfica: viven en la shell. Sin Git con commits pequeños, un cambio que funcionaba se pierde para siempre y no puedes decir qué revisión del firmware falló en el banco.`,
    from: `«Python para robótica» te dio el lenguaje; «Terminal y Git» da el sitio donde se ejecuta y se guarda.`,
    to: `Con el entorno listo falta el lenguaje de tiempo real: «C++ esencial para robótica» prepara el terreno para ROS 2 y firmware.`,
    analogy: `Hacer commits es como etiquetar los tarros de un laboratorio con fecha: el contenido puede ser el mismo, pero sin etiqueta no sabes cuál caducó.`,
    extraBlocks: [
      p(`Un repo con 40 commits de una línea cada uno permite hacer git bisect y encontrar en 6 pasos el commit que rompió el PWM. Un único «initial commit» no permite hacer nada de eso.`),
      apunte(`git push -u origin main fija el upstream la primera vez; después basta git push. Es un detalle que parece cosmético y evita escribir la ruta remota en cada empuje.`),
      aviso(`Nunca subas credenciales WiFi ni tokens al repo. Un ESP32 con la contraseña en el código se cuela en el historial de Git aunque lo borres después.`)
    ]
  },
  'r2-3': {
    why: `Python manda en alto nivel, pero el control a 1 kHz y los nodos ROS 2 de alta tasa se escriben en C++. No hace falta ser experto: basta con entender punteros, referencias, const y RAII para leer un error del compilador sin pánico.`,
    from: `«Terminal y Git» te dejó compilar; ahora el compilador empieza a exigir precisión sobre quién posee la memoria.`,
    to: `Con los dos lenguajes cubiertos, entras en la capa donde se toca el metal: «GPIO: entradas, salidas y niveles».`,
    analogy: `Una referencia es como un acceso directo a una carpeta; un puntero es la dirección escrita en un papel. Con el acceso directo no puedes perderte; con el papel puedes copiar una dirección equivocada.`,
    extraBlocks: [
      p(`std::clamp(pwm, 0, 255) convierte setSpeed(300) en 255 y setSpeed(-5) en 0. Sin el clamp, un uint8_t desborda: 300 se convierte en 44 y el motor gira al revés de lo esperado.`),
      apunte(`El const al final de speed() const convierte this en puntero a const: el compilador rechaza cualquier escritura en los miembros. Es un contrato que tu futuro yo agradecerá al depurar.`),
      formula(`// smart pointers: shared_ptr cuenta dueños; unique_ptr solo uno\nauto m = std::make_shared<Motor>(9);   // se libera solo al salir de ámbito`)
    ]
  },

  // ==================== B3: MICROCONTROLADORES ====================
  'r3-1': {
    why: `Un pin configurado como entrada sin pull-up flota y lee ruido: el robot «ve» botones que nadie pulsó. Entender niveles, corriente máxima y estados flotantes evita el 80 % de los fallos digitales del primer mes.`,
    from: `«C++ esencial para robótica» te dio el lenguaje; aquí esa sintaxis empieza a comandar pines reales.`,
    to: `Un GPIO solo da todo o nada; «PWM: simular un analógico con digital» consigue valores intermedios jugando con el tiempo.`,
    analogy: `Un pin flotante es como una antena sin conectar: capta cualquier ruido; una resistencia pull-up es como una cuerda que lo ata a una posición conocida.`,
    extraBlocks: [
      p(`Botón con INPUT_PULLUP entre pin 4 y GND: sin pulsar el pin lee HIGH (~3.3 V); al pulsar cae a 0 V. Si la resistencia interna es ~30 kΩ, la corriente al pulsar es solo 3.3/30.000 ≈ 0.11 mA.`),
      apunte(`El flanco de bajada ocurre en el instante en que el pin pasa de HIGH a LOW. Contar niveles en vez de flancos hace que un botón mantenido sume cientos de pulsaciones por segundo.`),
      aviso(`20 mA por pin es el límite absoluto, no el recomendado. Un LED directo sin resistencia desde un GPIO puede degradar el driver del pin aunque «funcione» hoy.`)
    ]
  },
  'r3-2': {
    why: `El PWM es la forma en que un digital simula un analógico: el motor no ve pulsos, ve el promedio. Si ignoras la frecuencia, el servo tiembla o el motor zumba; si ignoras la resolución, no puedes ajustar la velocidad fina.`,
    from: `«GPIO: entradas, salidas y niveles» daba solo 0 y 1; el PWM introduce el concepto de valor medio.`,
    to: `El PWM manda señales hacia fuera; «ADC y lectura de sensores analógicos» hace el camino inverso: convertir un voltaje en número.`,
    analogy: `Es como un grifo que abres y cierras muy rápido: el cubo se llena como si saliera un chorro continuo, aunque el grifo nunca esté a medias.`,
    extraBlocks: [
      p(`LED a 3.3 V con PWM al 25 %: Vmedio = 0.825 V. Con 8 bits, un paso es 3.3/256 ≈ 12.9 mV; con 10 bits, 3.2 mV. Saber esto evita perseguir un brillo que el hardware no puede representar.`),
      apunte(`Frecuencia y resolución compiten en el ESP32: a 20 kHz con 10 bits el LEDC consume otro canal; subir a 100 kHz obliga a bajar resolution. Consulta la tabla del datasheet antes de fijar ambos.`),
      tabla(['Aplicación', 'Frecuencia', 'Por qué'], [
        ['LED', '>200 Hz', 'Por encima de la visión de parpadeo'],
        ['Servo RC', '50 Hz', 'El ancho del pulso codifica el ángulo'],
        ['Motor DC', '10–20 kHz', 'Por encima del oído'],
        ['Stepper', '>20 kHz', 'Micropasos suaves'],
      ])
    ]
  },
  'r3-3': {
    why: `El ADC es la puerta de entrada del mundo analógico al código, y el ESP32 tiene un ADC que no es lineal en los extremos. Si conectas un sensor de 5 V directo, quemas el pin; si no promedias, tu control persigue ruido.`,
    from: `«PWM: simular un analógico con digital» iba de código a voltaje; el ADC hace el viaje de vuelta.`,
    to: `Leer sensores a intervalos fijos con un bucle es frágil; «Interrupciones y debouncing» reacciona a eventos sin perderlos.`,
    analogy: `Un ADC es como una báscula que solo da números enteros: pesa 2048 gramos cuando hay 1.65 V; cuanto más fina la escala, mejor la medida.`,
    extraBlocks: [
      p(`ESP32, 12 bits, Vref ≈ 3.3 V: raw 2048 → V = 2048/4095 · 3.3 ≈ 1.65 V, un LSB ≈ 0.8 mV. Un potenciómetro al 25 % da raw ≈ 1024 y V ≈ 0.83 V.`),
      apunte(`El divisor de «Divisores de voltaje y su trampa» (r1-3) vuelve aquí: es obligatorio para un sensor de 5 V. Baja R para que la impedancia del ADC no desplace la lectura.`),
      aviso(`El ADC del ESP32 no tolera 5 V en ningún pin. Un sensor de 5 V conectado directo no «lee mal»: destruye la entrada.`)
    ]
  },
  'r3-4': {
    why: `Si consultas un botón con delay() puedes perder un pulso de 10 ms; una interrupción lo captura, pero una ISR larga rompe el tiempo real de todo el sistema. Aprender a delegar el trabajo al loop es una disciplina que pagará en los encoders de más adelante.`,
    from: `«ADC y lectura de sensores analógicos» muestreaba cada cierto tiempo; las interrupciones avisan cuando ocurre algo, sin esperar al turno.`,
    to: `Con eventos ya dominados, falta dar salida a varios sensores a la vez: «I²C, SPI y UART» organiza la comunicación.`,
    analogy: `La ISR es como un timbre: avisa, pero no hay que hacer la cena en la puerta. Pones una nota (flag) y sigues con lo que estabas haciendo.`,
    extraBlocks: [
      p(`Un botón rebota 5–20 ms: a 100 Hz de polling, un rebote genera 5 lecturas falsas. Con debounce de 50 ms mediante millis(), el contador sube de 1 en 1.`),
      apunte(`La flag compartida con la ISR debe ser volatile: sin ello el compilador puede cachear la lectura en un registro y el loop nunca ve el cambio. Es un bug que desaparece al compilar con -O0 y vuelve con -O2.`),
      aviso(`Dentro de una ISR: sin Serial, sin delay, sin new, sin float. Solo poner un flag o escribir en una cola con la variante FromISR.`)
    ]
  },
  'r3-5': {
    why: `Tres buses, tres lógicas distintas: I²C direcciona por número, SPI por pin de selección y UART es punto a punto. Elegir mal o cruzar SDA con SCL te deja un sensor mudo y sin pista de dónde está el fallo.`,
    from: `«Interrupciones y debouncing» resolvía cuándo leer; ahora se decide cómo se habla con el sensor.`,
    to: `Los buses conectan sensores locales; «ESP32: WiFi, HTTP y OTA» abre el robot a la red y plantea qué va en el micro y qué en la computadora.`,
    analogy: `I²C es como un interfono con números de habitación; SPI es como un teléfono con un botón de llamada por aparato; UART es una línea directa entre dos personas.`,
    extraBlocks: [
      p(`Con direcciones de 7 bits hay 128 valores teóricos (0x00–0x7F), pero MPU6050 puede aparecer en 0x68 o 0x69 según el pin AD0. Un escáner I²C en dos líneas te lo dice en un segundo.`),
      apunte(`I²C a 400 kHz con cables de 30 cm y pull-ups de 4.7 kΩ suele fallar: la capacitación del cable aplana los flancos. Baja a 100 kHz o reduce las resistencias a 2.2 kΩ.`),
      tabla(['Bus', 'Hilos', 'Selección', 'Mejor para'], [
        ['I²C', 'SDA, SCL', 'Dirección 7 bits', 'Sensores lentos'],
        ['SPI', 'SCK, MOSI, MISO, CS', 'CS por dispositivo', 'ADC y pantallas rápidas'],
        ['UART', 'TX, RX', 'Punto a punto', 'Logs, GPS, enlace al Pi']
      ])
    ]
  },
  'r3-6': {
    why: `El ESP32 puede servir una página web con 20 líneas, pero no puede correr ROS 2: confundir los papeles produce arquitecturas que se caen bajo carga. Saber que el micro hace tiempo real y el Pi hace visión y DDS es una decisión de sistema que ahorra meses.`,
    from: `«I²C, SPI y UART» conectaba sensores; aquí uno de esos buses se usa para hablar con una computadora de alto nivel.`,
    to: `Cuando llegan WiFi y red, el bucle simple ya no basta: «RTOS y tiempo real» separa tareas con prioridades.`,
    analogy: `Es como una cocina: el micro es el cocinero que no puede esperar, el Pi es el camarero que organiza pedidos; UART es el pasillo por el que se pasan los platos.`,
    extraBlocks: [
      p(`Un endpoint HTTP que devuelve 24 bytes de telemetría a 10 Hz son 240 B/s; WiFi los manda sin esfuerzo. Si subes a 1 kHz de imagen, el mismo enlace se ahoga: ahí toca usar ESP-NOW o UART al Pi.`),
      apunte(`OTA es comodidad y riesgo a la vez: una actualización fallida deja el robot fuera de servicio. Ten siempre un botón de boot configurable y una imagen de respaldo antes de flashear por aire.`),
      aviso(`Nunca pongas el SSID y la contraseña en el código que subes a GitHub; los escáneres de repositorios los encuentran en minutos.`)
    ]
  },
  'r3-7': {
    why: `Un lazo de control a 1 kHz no puede compartir hilo con un envío WiFi que bloquea 200 ms: el robot se queda sin control justo cuando más lo necesita. Un RTOS con prioridades y colas convierte esa intuición en una garantía de sistema.`,
    from: `«ESP32: WiFi, HTTP y OTA» introdujo la red, que es precisamente la tarea que bloquea y no puede ir en el hilo crítico.`,
    to: `Con tareas y prioridades definidas, cambias de escala: «Motores DC y sus ecuaciones» modela la planta que esas tareas van a controlar.`,
    analogy: `Es como un bombero con dos encargos: apagar el fuego (control) y rellenar un formulario (telemetría). El formulario se hace cuando no hay fuego.`,
    extraBlocks: [
      p(`Con WCET de 300 µs y periodo de 1 ms, la tarea de control usa el 30 % del núcleo. Quedan 700 µs para las demás; si la telemetría consume 4 ms cada segundo, cabe sin problema.`),
      apunte(`Con tick de 100 Hz por defecto, pdMS_TO_TICKS(1) da 0 o 1 tick: no existe un periodo de 1 ms real. Hay que subir CONFIG_FREERTOS_HZ a 1000 antes de sintonizar cualquier lazo.`),
      formula(`Uso de CPU = Σ WCET_i / T_i    |    dos globales compartidas = condición de carrera; una Queue no`)
    ]
  },

  // ==================== B4: MOTORES Y ETAPAS DE POTENCIA ====================
  'r4-1': {
    why: `Un motor no se describe con una sola cifra: la corriente manda sobre el par y el voltaje sobre la velocidad. Saber leer la curva par–velocidad evita dimensionar con el par de parada, que es un pico de un milisegundo, y quemar el driver en el primer arranque.`,
    from: `«RTOS y tiempo real» te dio el esqueleto temporal; ahora aparece la planta física que ese lazo debe mover.`,
    to: `El modelo dice cuánto par hace falta pero no cómo invertir el giro: «Puente H y drivers de motor» resuelve la dirección.`,
    analogy: `El motor DC es como una bicicleta: la corriente es la fuerza que haces en el pedal (par) y el voltaje es la cadencia que puedes mantener (velocidad).`,
    extraBlocks: [
      p(`Motor de 12 V con Ra = 2 Ω y Ke = 0.05: en vacío ω = 12/0.05 = 240 rad/s ≈ 2290 rpm. Parado, I = 12/2 = 6 A y τ = 0.3 N·m: la corriente de parada es el dato que dimensiona el driver.`),
      apunte(`La potencia mecánica τ·ω es máxima a mitad de la curva: par = τ_parada/2 y velocidad = ω_vacío/2. Un motor bien elegido trabaja cerca de ahí, no en vacío ni parado.`),
      formula(`V = Ia·Ra + Ke·ω    |    τ = Kt·Ia    |    η = τ·ω / (V·Ia)   (en parada η = 0)`)
    ]
  },
  'r4-2': {
    why: `Invertir el giro de un motor DC exige invertir dos terminales, y hacerlo con transistores mal combinados pone Vcc directo a masa: el shoot-through funde el driver en microsegundos. Entender la tabla del puente H es la diferencia entre un robot que retrocede y una placa quemada.`,
    from: `«Motores DC y sus ecuaciones» dio el par y la velocidad; el puente H añade el signo.`,
    to: `El puente decide sentido, pero aún no controla la magnitud: «PWM y frenado regenerativo» gobierna el promedio y la frenada.`,
    analogy: `Un puente H es como un conmutador de cuatro interruptores en una cruz: activas una diagonal para ir hacia delante y la otra para ir hacia atrás; nunca cierres los dos de una columna.`,
    extraBlocks: [
      p(`Con TB6612, AIN1=1/AIN2=0 y PWMA=128 da giro al 50 % en un sentido; AIN1=AIN2=1 cortocircuita el motor y frena. El pin STBY a LOW deja todo flotando: el motor sigue girando por inercia.`),
      apunte(`Los drivers integrados añaden dead-time de ~1 µs entre conmutaciones. Si construyes tu propio puente sin ese hueco, dos MOSFET de la misma rama se solapan y la corriente solo está limitada por sus resistencias internas.`),
      tabla(['Driver', 'Corriente cont.', 'Nota'], [
        ['L298N', '2 A', 'Pierde ~2 V: calienta y limiting la velocidad'],
        ['TB6612', '1.2 A', 'Eficiente, ideal para robots pequeños'],
        ['BTS7960', '43 A', 'Para motores grandes, exige cableado grueso']
      ])
    ]
  },
  'r4-3': {
    why: `El PWM no entrega un voltaje analógico: entrega pulsos que la inductancia del motor promedia. Saber elegir frecuencia y modo de decay evita el zumbido a baja velocidad y el pico de tensión que sube el bus cuando frenas.`,
    from: `«Puente H y drivers de motor» fijaba el sentido; el PWM fija cuánto y con qué suavidad.`,
    to: `Controlar un motor DC con pulsos exige contar vueltas: «Motores paso a paso y microstepping» ofrece posición sin encoder, con sus propias trampas.`,
    analogy: `Frenar regenerativamente es como bajar una cuesta en coche con el freno motor: la energía del movimiento vuelve a la batería en vez de calentar las pastillas.`,
    extraBlocks: [
      p(`Con bus de 12 V y duty = 0.25, Vmedio = 3 V. Si el motor consume 2 A a ese duty, entrega 6 W; al frenar regenerativo, la corriente vuelve al bus y puede subirlo por encima de 12 V si la fuente no la absorbe.`),
      apunte(`En slow decay se cortocircuita el motor y la corriente inductiva se apaga despacio (poco rizado); en fast decay se devuelve al bus (frena más, pero puede disparar la tensión). Los drivers modernos mezclan ambos.`),
      aviso(`Un PWM por debajo de 100 Hz se oye y se siente como tirones. Sube por encima de 10 kHz antes de culpar al motor de «vibrar».`)
    ]
  },
  'r4-4': {
    why: `Un stepper avanza un ángulo fijo por pulso, lo que permite controlar posición sin encoder… mientras no pierdas pasos. Ajustar la corriente del driver y usar rampas es lo que separa un eje preciso de uno que vibra y se salta pasos al arrancar.`,
    from: `«PWM y frenado regenerativo» gobernaba un motor DC continuo; el stepper cambia el paradigma por pulsos discretos.`,
    to: `El stepper «cree» su posición; «Servos RC y servos de bus» introduce la realimentación dentro del propio actuador.`,
    analogy: `Un stepper es como un reloj de cuerda con escape: cada diente de la rueda avanza un paso fijo; si fuerzas el mecanismo, salta un diente y el reloj ya no marca la hora correcta.`,
    extraBlocks: [
      p(`NEMA 17 de 1.8°: 200 pasos/vuelta; a 1/16 microstepping son 3200 micropasos. Para 3 vueltas exactas hay que enviar 9600 pulsos, y la resolución teórica es 0.1125° por micropaso.`),
      apunte(`A 1/16 el par relativo cae al 15–30 % del full step: la suavidad se paga con fuerza. Si el eje pierde pasos, baja la microsubdivisión antes de subir la corriente.`),
      formula(`I ≈ Vref/(8·Rs). Con Rs = 0.1 Ω y 1 A deseado → Vref ≈ 0.8 V. Mide Vref con el motor desconectado.`)
    ]
  },
  'r4-5': {
    why: `El servo RC es un motor, un reductor, un potenciómetro y un controlador en una caja: tú mandas un ancho de pulso y él se encarga de llegar y mantenerse. Pero no te dice si llegó; el servo de bus sí reporta posición, carga y temperatura, y esa diferencia decide si puedes detectar un atasco.`,
    from: `«Motores paso a paso y microstepping» daba pasos sin realimentación; el servo trae la realimentación dentro.`,
    to: `Los servos son fáciles de usar, pero no son la única forma de tener par preciso: «BLDC y control FOC» lleva la conmutación electrónica al límite.`,
    analogy: `Un servo RC es como un termostato con motor: le dices 22 °C (1500 µs) y él enciende y apaga hasta estar ahí; el servo de bus además te dice qué temperatura tiene.`,
    extraBlocks: [
      p(`Pulso de 1000 µs → 0°, 1500 µs → 90°, 2000 µs → 180°. Si un servo solo llega a 170° con 2000 µs, calibras el extremo con attach(pin, 500, 2400) en vez de cambiar el código de ángulo.`),
      apunte(`Alimentar un servo desde el pin 5 V de la placa es la receta del brownout: un pico de 1–2 A hunde la lógica. Fuente separada de 5–7.4 V, 470 µF en paralelo y GND común, siempre.`),
      tabla(['', 'Servo RC', 'Servo de bus'], [
        ['Señal', 'PWM 50 Hz', 'UART / RS-485 en cadena'],
        ['Realimentación', 'No disponible', 'Posición, carga, temperatura'],
        ['Precisión', '~1°', '0.29° o mejor']
      ])
    ]
  },
  'r4-6': {
    why: `Un BLDC no tiene cepillos que conmuten por él: hay que excitar las fases en el instante exacto. FOC convierte tres corrientes en dos componentes donde el par es simple, y hacerlo mal produces vibración y calor en vez de par limpio.`,
    from: `«Servos RC y servos de bus» escondían la conmutación dentro de la caja; aquí hay que hacerla uno mismo.`,
    to: `Un motor solo es útil si sabes cuánto ha girado: «Encoders y odometría de ruedas» cierra la realimentación de posición.`,
    analogy: `FOC es como empujar un columpio siempre en el momento justo: si empujas en fase con el movimiento, el par es máximo; si empujas fuera de fase, solo haces ruido.`,
    extraBlocks: [
      p(`Con 7 pares de polos y encoder de 500 PPR, un giro eléctrico son 500 cuentas pero un giro mecánico son 3500. Si el PPR está mal, el motor «busca» un ángulo que no existe y vibra al iniciar.`),
      apunte(`En el sistema dq, Id es el flujo y Iq el par: se mantiene Id = 0 porque el flujo ya lo da el imán. Si Id se desvía, el MOSFET calienta sin producir movimiento útil.`),
      aviso(`Empieza con voltage_limit bajo (2–3 V) y súbelo poco a poco. Un BLDC conectado a las tres fases de un driver DC se destruye en el primer intento.`)
    ]
  },
  'r4-7': {
    why: `El encoder convierte un motor en un servo: sin sus cuentas no hay control de posición ni odometría. Pero una cuenta falsa por ruido se convierte en distancia inventada, y el robot «avanza» estando parado justo cuando el motor arranca.`,
    from: `«BLDC y control FOC» necesitaba conocer el ángulo del rotor; el encoder es ese mismo sensor aplicado a las ruedas.`,
    to: `Saber contar vueltas no basta para elegir el motor: «Cajas reductoras, backlash y selección de motor» cruza par, velocidad e inercia.`,
    analogy: `Un encoder incremental es como contar los dientes que pasan por un sensor: el orden de dos señales desfasadas te dice si avanzas o retrocedes.`,
    extraBlocks: [
      p(`PPR = 500 con decodificación x4 y rueda de 0.1 m: 2000 pulsos/vuelta y 1/(π·0.1) ≈ 3.18 vueltas/m, es decir ≈6366 pulsos/m. Con PPR mal puesto, la odometría se desvía un 20 % sin aviso.`),
      apunte(`La ISR de encoder a 200 kHz no puede usar attachInterrupt: cada flanco tiene 5 µs. El periférico PCNT del ESP32 cuenta por hardware sin cargar la CPU.`),
      formula(`distancia = cuenta/(PPR·4) · π·D    |    v = Δcuenta/(Δt·PPR·4) · π·D`)
    ]
  },
  'r4-8': {
    why: `Un motor pequeño gira rápido y con poco par; la caja reductora cambia una cosa por la otra. Elegir la relación sin mirar eficiencia ni inercia refleja produce un brazo que levanta en la hoja de cálculo y se queda corto en la mesa.`,
    from: `«Encoders y odometría de ruedas» miden el movimiento; ahora hay que decidir qué motor y qué reducción lo producen.`,
    to: `Con el motor seleccionado queda protegerlo: «Brownout y protección de la etapa de potencia» ataca el fallo que aparece al arrancar.`,
    analogy: `Es como una bicicleta con marchas: la marched baja sube la fuerza en la rueda pero reduce la velocidad, y cada cambio de cadena pierde un poco de energía.`,
    extraBlocks: [
      p(`Robot de 3 kg, rueda de 0.05 m y a = 1 m/s²: F = 3 N y τ_rueda = 0.15 N·m. Con N = 20 y η = 0.8, el motor debe dar 0.15/(20·0.8) ≈ 9.4 mN·m; con margen ×2, 19 mN·m.`),
      apunte(`La inercia de la carga se divide por N² al reflejarla al motor: una reducción alta «aligera» la carga pero añade juego y rozamiento. Más reducción no siempre significa mejor control.`),
      formula(`ω_out = ω_m/N    |    τ_out = τ_m·N·η    |    J_reflejada = J_carga/(N²·η)`)
    ]
  },
  'r4-9': {
    why: `El fallo más frustrante de un banco es el reset al acelerar: no es un bug de código, es una caída de tensión. Saber leer la causa del reset del ESP32 y colocar el bulk en el sitio correcto ahorra días de depuración equivocada.`,
    from: `«Cajas reductoras, backlash y selección de motor» dimensionó la carga; ahora hay que dimensionar la alimentación frente a su pico.`,
    to: `La electrónica ya está protegida, pero el sensor sigue dando números crudos: «Sensores básicos, acondicionamiento y calibración» los convierte en unidades reales.`,
    analogy: `Es como un grifo que se queda sin presión cuando abres otro a la vez: la tubería es demasiado estrecha para dos caudos; un depósito local evita el tirón.`,
    extraBlocks: [
      p(`Cable AWG 24 de 0.084 Ω/m en ida y vuelta de 2 m son 0.336 Ω. Con 2 A de arranque, ΔV = 0.67 V: un bus de 5 V llega como 4.33 V al regulador. Cambiar a AWG 18 (0.021 Ω/m) baja la caída a 0.17 V.`),
      apunte(`esp_reset_reason() devuelve 9 para brownout y 4 para watchdog. Mirar ese código antes de abrir el depurador distingue en diez segundos un problema de energía de uno de software.`),
      formula(`ΔV = I_pico · (R_batería + R_cable + R_conector)    |    Q = C · ΔV`)
    ]
  },

  // ==================== B5: SENSORES Y ESTIMACIÓN ====================
  'r5-1': {
    why: `Un sensor rara vez da un número limpio: da una tensión, una corriente o un tren de pulsos que hay que acondicionar y calibrar. Sin una calibración de dos puntos, tu «distancia en cm» es solo un raw multiplicado por una constante inventada.`,
    from: `«Brownout y protección de la etapa de potencia» estabilizó la alimentación; ahora la señal del sensor puede leerse sin ruido de fuente.`,
    to: `Con un número calibrado en mano, «Ultrasonido y ToF láser» convierte el tiempo de vuelo en distancia.`,
    analogy: `Calibrar es como ajustar una báscula con un peso conocido: primero el cero (offset) y luego una referencia (ganancia); sin eso, lo que lees es una estimación.`,
    extraBlocks: [
      p(`Sensor que da 0.4 V a 10 cm y 2.4 V a 80 cm: pendiente = 2.0/70 = 0.0286 V/cm, así que d_cm = (V − 0.4)/0.0286. Sin restar el offset, a 10 cm leerías 14 cm.`),
      apunte(`Promedia 16 muestras para bajar el ruido √16 = 4 veces, no 16. Reducir ruido por promediado cuesta raíz cuadrada del esfuerzo: es un techo que ningún código rompe.`),
      formula(`valor = V/Vref · (2ⁿ − 1)    |    resolución = Vref/2ⁿ    |    d = (raw − offset) · escala`)
    ]
  },
  'r5-2': {
    why: `Ambos sensores miden tiempo y lo convierten en distancia, pero fallan en materiales distintos: el ultrasonido absorbe con espuma y el ToF se satura al sol. Elegir uno sin mirar la superficie obliga a rediseñar el robot después de haber soldado.`,
    from: `«Sensores básicos, acondicionamiento y calibración» convirtió raw en unidades; ahora se decide qué magnitud física medir.`,
    to: `La distancia puntual no da orientación: «IMU: acelerómetro, giroscopio y magnetómetro» añade inclinación y rumbo.`,
    analogy: `El ultrasonido es como el murciélago: oye el eco, pero una alfombra se lo traga; el ToF es como un flash y un cronómetro: ve mejor, pero el sol lo deslumbra.`,
    extraBlocks: [
      p(`HC-SR04 con eco de 1000 µs: d = 0.0343 cm/µs · 1000 / 2 ≈ 17 cm. Sin el factor 2 leerías 34 cm; con pulseIn sin timeout y el sensor desconectado, el programa se queda colgado 30 ms o más.`),
      apunte(`La velocidad del sonido sube 0.6 m/s por °C: a 30 °C es 349 m/s en vez de 343. En 4 m eso son 7 cm de error si no compensas temperatura.`),
      tabla(['Superficie', 'HC-SR04', 'VL53L0X'], [
        ['Madera', 'Bien', 'Bien'],
        ['Espuma / tela', 'Falla (absorbe)', 'Bien'],
        ['Cristal', 'Devuelve eco raro', 'Puede saturar'],
        ['Luz solar directa', 'Indiferente', 'Ruidoso']
      ])
    ]
  },
  'r5-3': {
    why: `La IMU da tres señales que se complementan y se engañan entre sí: el acelerómetro mide gravedad más aceleración, el giroscopio mide velocidad angular y el magnetómetro ve el norte… si no hay motor cerca. Saber qué sensor falla en cada situación es la base de la fusión.`,
    from: `«Ultrasonido y ToF láser» medían distancia al objeto; la IMU mide cómo está el propio robot.`,
    to: `El giroscopio sufre deriva al integrar: «Deriva del giroscopio y su calibración» mide y corrige ese sesgo.`,
    analogy: `El acelerómetro es como una plomada: siempre apunta abajo, salvo que estés en un ascensor; el giroscopio es como un tacómetro que acumula error al integrar.`,
    extraBlocks: [
      p(`MPU6050 en rango ±2 g: 16384 LSB/g. Si ax = 8192, la aceleración es 0.5 g ≈ 4.9 m/s². En reposo, el módulo del vector debe ser ≈9.81 m/s²; si da 9.5, hay escala o montaje mal calibrado.`),
      apunte(`La IMU odia las vibraciones: un motor desbalanceado a 100 Hz inyecta picos que el acelerómetro interpreta como inclinación. Aísla con espuma y cablea corto antes de culpar al filtro.`),
      formula(`roll = atan2(ay, az)    |    pitch = atan2(−ax, √(ay² + az²))`)
    ]
  },
  'r5-4': {
    why: `Integrar un giroscopio con 0.5 °/s de sesgo te da 30° de error en un minuto aunque el robot no se mueva. Modelar la deriva como b·t te dice por qué calibrar en reposo ayuda y por qué no basta para siempre.`,
    from: `«IMU: acelerómetro, giroscopio y magnetómetro» presentó los tres sensores; aquí aparece el defecto del que más duele al integrar.`,
    to: `La calibración quita el sesgo constante, pero no el ruido: «Filtro complementario» usa el acelerómetro para corregir a largo plazo.`,
    analogy: `Es como un reloj que adelanta 2 segundos por hora: si no lo ajustas, al cabo de un día la hora está mal aunque el mecanismo sea bueno.`,
    extraBlocks: [
      p(`Giroscopio con bias 0.5 °/s integrado a 100 Hz durante 60 s: 6000 muestras · 0.005° = 30°. Restando el bias medido (promedio de 5 s en reposo), el error cae a ~0.1° por el ruido.`),
      apunte(`El bias cambia con temperatura: un MPU6050 caliente puede derivar el doble que frío. Calibra a la temperatura de trabajo o repite el cero en cada arranque con el robot quieto.`),
      formula(`θ(t) = θ₀ + ω_real·t + b·t + ∫n dt    →    el término b·t crece LINEALMENTE`)
    ]
  },
  'r5-5': {
    why: `El giroscopio es bueno ahora y malo después; el acelerómetro es malo ahora y bueno después. El filtro complementario les da la razón a cada uno en su banda con diez líneas de código, y es suficiente para el 90 % de los robots.`,
    from: `«Deriva del giroscopio y su calibración» dejó claro que el sesgo nunca se elimina del todo; aquí se corrige con otra fuente.`,
    to: `El filtro complementario tiene ganancia fija: «Filtro de Kalman» la calcula sola a partir de las incertidumbres.`,
    analogy: `Es como conducir mirando el volante (giroscopio) para girar rápido y el horizonte (acelerómetro) para no salirte del carril a largo plazo.`,
    extraBlocks: [
      p(`Con dt = 0.01 s y τ = 0.5 s, α = τ/(τ+dt) ≈ 0.98: el 98 % del cambio viene del giroscopio y solo el 2 % corrige el acelerómetro. Subir α a 0.995 da τ ≈ 2 s: muy suave, pero tarda en corregir la deriva.`),
      apunte(`Si el robot acelera, el acelerómetro deja de medir solo gravedad y el filtro da un tirón. En aplicaciones dinámicas baja (1−α) o detecta |a| ≫ 9.81 y congira la corrección.`),
      formula(`θ[k] = α·(θ[k−1] + ω·dt) + (1−α)·θ_acel    |    α ≈ τ/(τ + dt)`)
    ]
  },
  'r5-6': {
    why: `Kalman no es «un promedio inteligente»: mantiene una incertidumbre y decide en cada paso cuánto creerse el modelo frente a la medición. Sin entender Q y R, puedes producir una estimación preciosa y sistemáticamente equivocada.`,
    from: `«Filtro complementario» usaba pesos fijos; aquí los pesos se calculan con la confianza real de cada fuente.`,
    to: `Un filtro 1D no fusiona sensores distintos: «Fusión de sensores» generaliza el esquema con un EKF multicomponente.`,
    analogy: `Es como preguntar a dos testigos: crees más al que tiene mejor historial, pero cambias de opinión según lo seguro que estés tú mismo.`,
    extraBlocks: [
      p(`Con P = 0.2 y R = 0.01, K = 0.2/(0.2+0.01) = 0.952: te crees casi toda la medición. Tras corregir, P cae a 0.0096 y K baja a ~0.49: ahora te crees más el modelo.`),
      apunte(`Q y R no son «números mágicos»: mide la varianza del sensor en reposo para R y estima cuánto cambia el estado entre pasos para Q. Si la salida va retrasada, sube Q; si vibra, sube R.`),
      formula(`K = P⁻/(P⁻ + R)    |    x = x⁻ + K·(z − x⁻)    |    P = (1 − K)·P⁻`)
    ]
  },
  'r5-7': {
    why: `Ningún sensor lo hace todo bien: el encoder es preciso a corto plazo pero resbala, el IMU deriva, el GPS da 1–10 Hz y la visión falla con la luz. La fusión no es magia, es asignar covarianzas honestas a cada fuente.`,
    from: `«Filtro de Kalman» resolvía un sensor con un modelo; aquí entran varios sensores con modelos distintos.`,
    to: `La fusión necesita posición reliable y continua: «Odometría de un robot diferencial y su error» produce justo esa entrada.`,
    analogy: `Es como un comité de navegantes: el que lleva el compás manda en giros rápidos, el que ve el sol corrige de vez en cuando, y se pondera según quién haya acertado antes.`,
    extraBlocks: [
      p(`Un GPS con salto de 2 m al que le pones covarianza 0.01 m² arruina la odometría en un solo paso. La covarianza correcta es ~(2 m)² = 4 m²: el EKF casi lo ignora y solo lo usa para corregir deriva lenta.`),
      apunte(`Todos los sensores deben llegar con timestamp y en el mismo marco. Sin tf2 (bloque b7), fusionar IMU y encoder es mezclar manzanas con peras.`),
      tabla(['Sensor', 'Aporta', 'Falla en'], [
        ['Encoder', 'Desplazamiento preciso', 'Deslizamiento'],
        ['IMU', 'Orientación rápida', 'Deriva'],
        ['GPS', 'Posición global', 'Interiores, baja tasa'],
        ['Visión / LIDAR', 'Relación con el entorno', 'Luz, oclusión']
      ])
    ]
  },
  'r5-8': {
    why: `La odometría es barata y suave a corto plazo, pero acumula error para siempre: un giro de 5° se convierte en metros de desviación. Entender de dónde viene el error te dice cuándo hace falta SLAM en vez de seguir afinando el encoder.`,
    from: `«Fusión de sensores» necesitaba una odometría de entrada; aquí se construye esa estimación desde las ruedas.`,
    to: `Como la odometría deriva sin límite, «LIDAR y nubes de puntos» aporta la observación absoluta del entorno que la corrige.`,
    analogy: `Es como caminar con los ojos cerrados contando pasos: sabes cuánto has avanzado, pero un paso corto se acumula y al final estás en otra habitación.`,
    extraBlocks: [
      p(`Un cuadrado de 1 m con L = 0.3 m: cada tramo exige Δθ = 90°. Si el radio de rueda está mal un 1 %, el lado mide 1.01 m y el cierre falla 4 cm. Con 1° de error por giro, el cierre se abre ~7 cm.`),
      apunte(`Usar el ángulo medio θ + Δθ/2 en la integración reduce el error frente a usar el ángulo final. Es un detalle de 2 líneas que mejora la trayectoria curvada de forma medible.`),
      formula(`Δs = (Δs_d + Δs_i)/2    |    Δθ = (Δs_d − Δs_i)/L    |    x += Δs·cos(θ + Δθ/2)`)
    ]
  },
  'r5-9': {
    why: `Un LIDAR convierte tiempo de vuelo en un anillo de distancias: es la observación absoluta que corrige la odometría y la base del SLAM. Saber filtrar infinitos y sincronizar con odometría evita mapas desalineados que parecen correctos en RViz.`,
    from: `«Odometría de un robot diferencial y su error» deriva sin límite; el LIDAR aporta referencias al entorno.`,
    to: `La nube 2D del LIDAR es el primer paso de la fabricación: «CAD paramétrico» cambia el mapa del entorno por el modelo de las piezas.`,
    analogy: `Es como un radar de barco que gira: cada pulso devuelve una distancia y, al juntarlos, dibuja la costa alrededor.`,
    extraBlocks: [
      p(`Un LaserScan de 360 rangos a 1° con un objeto a 2 m en el frente: x ≈ 0, y ≈ 2.0 m. Los rayos que no vuelven dan inf: filtrar con np.isfinite evita que el mapa explote.`),
      apunte(`Con LIDAR y odometría desincronizados, el mapa se desalinea al girar aunque el sensor esté perfecto. Sella cada scan con timestamp y usa tf2 con el stamp del dato, no con now().`),
      aviso(`Nunca mires el emisor láser ni lo apuntes a los ojos: un RPLidar es clase 1 en uso normal, pero un LIDAR abierto de alta potencia no perdona.`)
    ]
  },

  // ==================== B6: FABRICACIÓN, CAD Y MECÁNICA ====================
  'r6-1': {
    why: `En CAD paramétrico no dibujas líneas: defines relaciones que se recalculan. Si cambias el motor de 20 a 24 mm y todo se actualiza solo, has diseñado; si tienes que editar 40 vértices, has dibujado. Esa diferencia se nota el día que cambia un proveedor.`,
    from: `«LIDAR y nubes de puntos» cerró la percepción del entorno; ahora se modela el robot que lo recorrerá.`,
    to: `Los parámetros solo sirven si el croquis está bien atado: «Croquis y restricciones» fija los grados de libertad.`,
    analogy: `Es como una hoja de cálculo frente a un dibujo a mano: cambias una celda y todas las fórmulas se actualizan; en el papel tienes que borrar y redibujar.`,
    extraBlocks: [
      p(`Un soporte con motor_d = 24 y holgura = 0.3 da un taladro de 24.3 mm. Si el modelo usa motor_d como parámetro maestro, cambiar a 28 mm regenera el soporte en un segundo.`),
      apunte(`STEP conserva geometría exacta e historial de operaciones; STL es solo una malla de triángulos. Para un taller, STEP; para la impresora, 3MF/STL.`),
      formula(`taladro = diámetro_nominal + holgura    |    holgura típica FDM = 0.2–0.4 mm`)
    ]
  },
  'r6-2': {
    why: `Un croquis sin restricciones es blando: arrastras un punto y la forma se deforma sin aviso. Restringirlo hasta que el software diga «fully constrained» es la única forma de que un modelo sobreviva al cambio de una cota.`,
    from: `«CAD paramétrico» introdujo las variables; aquí se evita que las cotas peleen entre sí.`,
    to: `Con piezas rígidas ya definidas, «Ensamblajes y cotas entre piezas» las acopla con juntas.`,
    analogy: `Es como tensionar una tienda de campaña: mientras falte una cuerda, la lona baila; cuando todas están tensas, la forma es estable.`,
    extraBlocks: [
      p(`Un rectángulo tiene 8 grados de libertad (4 puntos × 2). Con 4 coincidencias, 2 restricciones horizontales/verticales, ancho y alto quedan 0 grados: fully constrained.`),
      apunte(`Nombra las cotas («diametro_eje», no «d1»). Las ecuaciones posteriores usan ese nombre y el día que cambies de servo, cambias un valor en un sitio, no diez.`),
      aviso(`Un contorno con un hueco de 0.01 mm parece cerrado a simple vista pero extruye una superficie, no un sólido. Usa la herramienta de verificar contorno cerrado.`)
    ]
  },
  'r6-3': {
    why: `Un ensamblaje no pega piezas: declara cómo se acoplan. Usar una junta de más o de menos produce un modelo que se mueve de forma imposible o que se niega a actualizarse. Detectar interferencias antes de imprimir ahorra una pieza fallida por día.`,
    from: `«Croquis y restricciones» fijó cada pieza; ahora se fija la relación entre ellas.`,
    to: `El siguiente salto es el proceso de fabricación: «Diseño para impresión 3D (DFM)» adapta la geometría a la máquina.`,
    analogy: `Es como montar un mueble: si atornillas la misma pata en dos sitios con cotas distintas, el mueble se tuerce; una junta por grado de libertad que quieres quitar.`,
    extraBlocks: [
      p(`Una junta coincidente quita 3 grados de libertad; una concéntrica, 2; una de distancia, 1. Un eje con dos rodamientos necesita una concéntrica y una de distancia, no dos coincidentes.`),
      apunte(`En top-down, las cotas maestras viven en un esqueleto y las piezas heredan de él. Cambias el diámetro del eje una vez y el soporte, la rueda y la arandela se actualizan juntos.`),
      aviso(`La herramienta de detección de interferencias (clash) muestra colisiones que no se ven en el render. Pásala siempre antes de exportar.`)
    ]
  },
  'r6-4': {
    why: `La impresión FDM deposita material en capas: un voladizo de 60° o un puente de 40 mm fallan por física, no por mala suerte. Diseñar para el proceso evita piezas que se deforman, se desprenden o no caben.`,
    from: `«Ensamblajes y cotas entre piezas» dio la geometría ideal; DFM la adapta a lo que la boquilla puede hacer.`,
    to: `Los taladros impresos nunca salen a la cota exacta: «Tolerancias y ajustes» mide la holgura real de tu máquina.`,
    analogy: `Es como apilar cintas de papel: una capa sobresaliendo un poco aguanta, pero si sobresale demasiado se cae; la dirección de las capas decide dónde se rompe la pieza.`,
    extraBlocks: [
      p(`Con boquilla de 0.4 mm, una pared debe ser ≥1.2 mm (3·nozzle). Un voladizo por encima de 45° necesita soportes; un puente de más de 20–30 mm se cae.`),
      apunte(`La anisotropía manda: una pieza impresa es más débil entre capas (Z) que dentro de una capa (XY). Orienta las capas para que la carga no separe capas, o usa más perímetros.`),
      tabla(['Regla', 'Valor FDM', 'Si la ignoras'], [
        ['Espesor de pared', '≥3·nozzle', 'Pieza frágil'],
        ['Juego en taladros', '0.2–0.4 mm', 'Eje atascado'],
        ['Voladizo', '<45°', 'Necesita soportes'],
        ['Relleno', '15–25 %', 'Peso y tiempo innecesarios']
      ])
    ]
  },
  'r6-5': {
    why: `Ninguna pieza sale exactamente a la cota del CAD: la tolerancia es el rango admitido y el ajuste es la relación entre dos piezas. Un juego mal elegido se traduce en una rueda que baila o en un eje que no entra ni a martillazos.`,
    from: `«Diseño para impresión 3D (DFM)» ya advirtió que el plástico se encoge; aquí se cuantifica cuánto.`,
    to: `La tolerancia se mide con la máquina calibrada: «Calibración de la impresora» ajusta extrusión y cama para que el número sea reproducible.`,
    analogy: `Es como un tapón y una botella: si el tapón es demasiado justo no entra; si es demasiado flojo se cae. El juego correcto se mide, no se supone.`,
    extraBlocks: [
      p(`Eje de 8.0 mm en taladro de 8.3 mm: juego = +0.3 mm → holgura. En taladro de 7.9 mm: juego = −0.1 mm → presión, que en PLA agrieta la pieza.`),
      apunte(`Imprime una galga con taladros de 7.8, 8.0, 8.2 y 8.4 mm y un eje de 8.0. Mide con calibrador: ese número es la tolerancia de TU impresora, no la del foro ni la del catálogo.`),
      formula(`juego = D_taladro − d_eje    →    positivo = holgura, negativo = interferencia`)
    ]
  },
  'r6-6': {
    why: `Una impresora mal calibrada convierte diseños correctos en piezas defectuosas: la primera capa no pega, las capas se separan o las esquinas se levantan. Diagnosticar por síntoma evita cambiar parámetros al azar durante horas.`,
    from: `«Tolerancias y ajustes» dio el número objetivo; ahora se ajusta la máquina para que lo cumpla.`,
    to: `Con piezas fiables, «Tornillería, rodamientos y transmisiones» decide cómo unirlas y hacerlas girar.`,
    analogy: `Es como afinar una guitarra: si el mástil está torcido, por mucho que ajustes las cuerdas el sonido sale mal; primero nivelas la base.`,
    extraBlocks: [
      p(`Si al extruir 100 mm salen 98 mm, el factor de flujo debe subir a 100/98 ≈ 1.02. El cubo de 20 mm tiene que medir 20 ± 0.2 mm con calibrador: 19.6 mm significa sobreextrusión o cama desnivelada.`),
      apunte(`Lleva un registro con filamento, temperatura, Z-offset y flujo. Cuando una pieza salga mal, comparas con la última calibración buena: es el equivalente a un log de Git para hardware.`),
      aviso(`Un hotend obstruido o un ventilador gripado pueden causar un incendio. No dejes la impresora sin supervisión las primeras horas.`)
    ]
  },
  'r6-7': {
    why: `Tres cajas deciden la mecánica: cómo unes, cómo giras y cómo transmites. Mezclar roscas métricas e imperiales o dejar un rodamiento sin precarga produce juegos y vibraciones que después nadie logra quitar con software.`,
    from: `«Calibración de la impresora» asegura que la pieza coincide con el modelo; ahora se decide cómo se acopla.`,
    to: `Con la tornillería elegida, «Diseñar un soporte desde un datasheet» convierte un PDF en esas cotas reales.`,
    analogy: `Un eje con dos rodamientos es como una puerta con dos bisagras: si una está floja, la puerta baila; si apretas demasiado, roza y se desgasta.`,
    extraBlocks: [
      p(`Un rodamiento 608 mide 8×22×7 mm y un MR105 5×10×4 mm. El juego axial típico con dos rodamientos es 0.05–0.15 mm: menos y se calienta, más y vibra.`),
      apunte(`Aprieta los tornillos en plástico solo con los dedos. Un destornillador eléctrico deforma el taladro y la rosca se rompe al tercer ciclo, no en el montaje.`),
      aviso(`Un tornillo 6-32 no es un M3: se «rosca» a fuerza y destruye el taladro. No mezcles sistemas en el mismo ensamblaje.`)
    ]
  },
  'r6-8': {
    why: `El trabajo mecánico real empieza con un PDF, no con un modelo listo. Saber extraer la brida, el patrón de taladros y el diámetro del eje de un datasheet es una de las habilidades más rentables: evita diseñar para un motor «parecido».`,
    from: `«Tornillería, rodamientos y transmisiones» eligió los elementos; aquí se obtiene la cota exacta del fabricante.`,
    to: `Ese soporte es la pieza que se montará en «Construir y calibrar el brazo SO-101», donde la calibración decide si es reproducible.`,
    analogy: `Es como copiar una receta de un envase: no vale «un poco de azúcar», valen los gramos que pone el fabricante si quieres que el pastel salga igual.`,
    extraBlocks: [
      p(`NEMA 17: brida 42.3 mm, taladros de 3 mm en cuadrado de 31 mm, eje de 5 mm. El soporte lleva 42.6 mm de alojamiento, cuatro taladros de 3.4 mm a 31 mm y pasaje de 5.2 mm.`),
      apunte(`Imprime primero una versión de 2 mm de espesor y prueba el ajuste con el motor real. Ahorra horas frente a imprimir el soporte completo cuatro veces.`),
      aviso(`Los clones difieren del original 0.5–1 mm. Mide siempre tu pieza con calibrador: el PDF es una guía, no la verdad.`)
    ]
  },
  'r6-9': {
    why: `El SO-101 junta mecánica, bus de servos y grabación de datos: es el primer sistema donde una calibración inestable arruina algo más que la precisión. Si el cero cambia entre sesiones, la política verá estados distintos para la misma pose.`,
    from: `«Diseñar un soporte desde un datasheet» dio las piezas; aquí se ensamblan y se calibran hasta que leader y follower coinciden.`,
    to: `Con el brazo calibrado y reproducibile, «Instalación, workspace y conceptos ROS 2» lo integra en un sistema mayor.`,
    analogy: `Es como afinar dos instrumentos antes de tocar juntos: si uno está un tono más alto, la música suena mal aunque cada uno esté bien construido.`,
    extraBlocks: [
      p(`Con tres servos STS3215 en bus y un error de seguimiento de 0.5° por servo, el efector se desvía ~2 mm a 200 mm de radio. Si el offset cambia 10° entre sesiones, el desvío salta a 35 mm y la demo no se reproduce.`),
      apunte(`Asigna los IDs de uno en uno, con un solo servo conectado. Dos servos con el mismo ID responden a la vez y el brazo hace un movimiento brusco al energizarse.`),
      aviso(`Sujeta el brazo la primera vez que lo alimentas: un servo fuera de rango puede girar de golpe hasta su tope.`)
    ]
  },

  // ==================== B7: ROS 2 Y SIMULACIÓN ====================
  'r7-1': {
    why: `ROS 2 no es un SO ni un lenguaje: es un middleware donde procesos pequeños se descubren solos gracias a DDS. Sin entender el modelo de comunicación, un nodo que «no aparece» parece un bug de código cuando en realidad es un source olvidado o un dominio distinto.`,
    from: `«Construir y calibrar el brazo SO-101» dio el hardware; ahora hace falta el sistema que lo orquesta.`,
    to: `Con el workspace compilado, «Nodos y topics» escribe el primer productor y consumidor de datos.`,
    analogy: `DDS es como una sala donde todos gritan su nombre y lo que ofrecen: no hay centralita, pero cada uno sabe quién publica el tema que le interesa.`,
    extraBlocks: [
      p(`El error del primer día es «package not found»: falta source install/setup.bash tras colcon build. Primero se carga /opt/ros/... para tener los comandos y después install/setup.bash para encontrar TU paquete.`),
      apunte(`Dos equipos en la misma red no se ven si tienen distinto ROS_DOMAIN_ID. Es un número, no un fallo de red: pon el mismo dominio en ambos antes de mirar el firewall.`),
      aviso(`ROS 2 no es tiempo real: el lazo a 1 kHz sigue viviendo en el microcontrolador y habla por UART, como viste en «ESP32: WiFi, HTTP y OTA».`)
    ]
  },
  'r7-2': {
    why: `Un topic es un canal con nombre y tipo: publicador y suscriptor no se conocen, DDS los empareja. Elegir mal el QoS hace que «no llegue nada» aunque ambos nodos estén vivos y el tipo sea correcto.`,
    from: `«Instalación, workspace y conceptos ROS 2» levantó el grafo; aquí se publica el primer mensaje real.`,
    to: `Los topics fluyen sin esperar respuesta; «Services y actions» añade petición–respuesta y tareas largas con progreso.`,
    analogy: `Un topic es como una emisora de radio: emite para quien quiera escuchar, y si llegas tarde te pierdes lo que ya pasó.`,
    extraBlocks: [
      p(`Un publicador best effort con un suscriptor reliable no conecta: las políticas son incompatibles. Con una cámara a 30 Hz conviene best effort; perder un frame es mejor que acumular lag.`),
      apunte(`La calidad de servicio no es solo reliability: transient local guarda el último mensaje, imprescindible para /tf_static y mapas. Sin ella, un nodo que arranca tarde no ve la transformada.`),
      formula(`ros2 topic info -v /mi_topic   # muestra tipo y QoS de publicadores y suscriptores`)
    ]
  },
  'r7-3': {
    why: `Un service responde una pregunta; una action encarga una tarea que tarda y puede cancelarse. Usar un service para «navegar hasta la esquina» bloquea al cliente durante minutos sin feedback, y es un error de diseño que se paga en depuración.`,
    from: `«Nodos y topics» movía flujo continuo; aquí aparece la necesidad de una respuesta concreta.`,
    to: `Cada nodo necesita además configuración: «Parámetros y launch files» centraliza velocidades y nombres sin recompilar.`,
    analogy: `Un service es como preguntar la hora; una action es como encargar un pastel: te dan tickets de progreso y puedes cancelar el pedido.`,
    extraBlocks: [
      p(`Nav2 expone /navigate_to_pose como action: el feedback incluye distance_remaining, que baja de 5.0 a 0.0 m. Con un service solo tendrías «empezado» y «terminado», sin saber dónde está.`),
      apunte(`Un service sin timeout puede colgar al cliente para siempre si el servidor cae. wait_for_service(timeout) convierte un bloqueo indefinido en un error controlado.`),
      tabla(['Patrón', 'Bloqueante', 'Feedback', 'Ejemplo'], [
        ['Topic', 'No', 'No', '/cmd_vel'],
        ['Service', 'Sí', 'No', '/reset_map'],
        ['Action', 'No', 'Sí', '/navigate_to_pose']
      ])
    ]
  },
  'r7-4': {
    why: `Un robot con doce nodos lanzados a mano en doce terminales no es reproducible: los parámetros cambian entre pruebas y nadie sabe qué configuración falló. Los launch files y los YAML convierten ese caos en un único comando.`,
    from: `«Services y actions» definió la interacción; ahora se decide cómo arranca y se configura todo junto.`,
    to: `Con los nodos orquestados, «tf2: el árbol de transformadas» resuelve dónde está cada sensor respecto al robot.`,
    analogy: `Es como un guion de obra de teatro: en vez de decir a cada actor cuándo salir, lo escribes una vez y todos entran en el momento correcto.`,
    extraBlocks: [
      p(`Un launch con vel_max = 0.6 en simulación y 0.3 en el real evita que el robot se desborde al pasar del Gazebo al hardware. Dos YAML, un mismo nodo.`),
      apunte(`Los nombres de parámetros son API pública: renombrar «vel_max» rompe todos los YAML y los dashboards. Documenta cada parámetro y ponle valor por defecto sensato.`),
      nota(`ros2 param set /control vel_max 0.8 cambia el valor en caliente: útil para sintonizar sin recompilar, peligroso si no lo registras.`)
    ]
  },
  'r7-5': {
    why: `El láser está a 10 cm del centro y la cámara a 20 cm y arriba: sin tf2, cada nodo habla en su propio marco y los datos no se pueden comparar. Los errores de tf suelen ser de tiempo, no de geometría.`,
    from: `«Parámetros y launch files» arranca los nodos; tf2 les dice cómo interpretar sus medidas en un marco común.`,
    to: `El árbol de marcos se define en el modelo del robot: «URDF, xacro y RViz» lo describe y lo visualiza.`,
    analogy: `tf2 es como un mapa con leyendas: el punto del láser no está «en el robot», está 10 cm a la izquierda del centro; sin la leyenda, sumas manzanas con peras.`,
    extraBlocks: [
      p(`Si pides una transformada con now() en vez del stamp del scan, en un robot a 0.5 m/s el punto se desplaza 5 cm respecto al mapa. 5 cm es la diferencia entre esquivar un obstáculo y chocar.`),
      apunte(`Nunca publiques dos veces el mismo par de marcos: si robot_state_publisher ya publica base→laser desde el URDF, no lo publiques tú también. Aparece un bucle y tf2 se queja.`),
      formula(`p_base = T_base_odom · T_odom_map · p_map    →    SLAM publica map→odom; odometría publica odom→base_link`)
    ]
  },
  'r7-6': {
    why: `URDF es la fuente de verdad para tf, simulación y control: un link sin <inertial> se ve bien en RViz pero el simulador no sabe cuánto pesa. Definir masa e inercia correctas evita que el robot «flote» en Gazebo después.`,
    from: `«tf2: el árbol de transformadas» consumía marcos; el URDF los genera automáticamente desde el modelo.`,
    to: `Con el modelo validado, «rosbag: grabar, reproducir e inspeccionar» permite capturar lo que hacen esos marcos en una ejecución real.`,
    analogy: `URDF es como el plano de un muñeco articulado: no solo dices dónde va cada pieza, sino cuánto pesa y alrededor de qué eje gira.`,
    extraBlocks: [
      p(`Un link de 0.3 × 0.2 × 0.1 m y 2 kg tiene Ixx ≈ m(h² + d²)/12 ≈ 2·(0.04+0.01)/12 ≈ 0.0083 kg·m². Poner 0.01 «de ojo» está bien en RViz y mal en Gazebo.`),
      apunte(`En ROS, Z arriba y X adelante. Un origin con rpy mal puesto hace que el robot salga «acostado»: revisa primero las rotaciones antes de culpar al modelo 3D.`),
      aviso(`robot_state_publisher publica las transformadas estáticas: no las publiques tú desde el nodo del sensor o tendrás marcos duplicados.`)
    ]
  },
  'r7-7': {
    why: `Un rosbag guarda mensajes con marcas de tiempo: capturas el fallo una vez y lo reproduces con exactitud las veces que hag falta. Sin --clock y use_sim_time, los nodos siguen leyendo el reloj real y el replay no mueve nada.`,
    from: `«URDF, xacro y RViz» dio el modelo; el rosbag captura cómo se comporta en el mundo real.`,
    to: `Los datos grabados alimentan los controladores: «ros2_control» separa la lógica de control del hardware.`,
    analogy: `Es como una cámara de seguridad para el robot: grabas el incidente y lo vuelves a ver a media velocidad las veces que quieras.`,
    extraBlocks: [
      p(`Grabar /image sin comprimir a 30 Hz y 640×480 son ~27 MB/s: un minuto llena 1.6 GB. Con /image/compressed baja a ~2 MB/s.`),
      apunte(`El flujo correcto es: grabar, reproducir con --clock, poner use_sim_time en los nodos y añadir un topic echo. Eso convierte un fallo aleatorio en un banco determinista.`),
      aviso(`Si el replay no mueve los nodos, comprueba las dos cosas a la vez: --clock en el play y use_sim_time=true en cada nodo. Una sin la otra no funciona.`)
    ]
  },
  'r7-8': {
    why: `ros2_control separa el controlador del hardware mediante interfaces: el mismo diff_drive sirve para el robot real y para Gazebo cambiando solo el plugin. Sin esa capa, cada cambio de simulador obliga a reescribir el control.`,
    from: `«rosbag: grabar, reproducir e inspeccionar» aporta datos reproducibles; ros2_control aporta la interfaz sobre la que probar el control.`,
    to: `Con controladores cargados, «Simulación: Gazebo, MuJoCo e Isaac Sim» permite entrenar y validar sin romper hardware.`,
    analogy: `Es como un enchufe estándar: el controlador es el electrodoméstico y el plugin es el adaptador al tomacorriente del país; cambias el adaptador, no el electrodoméstico.`,
    extraBlocks: [
      p(`Declarar <command_interface name="velocity"/> y <state_interface name="position"/> en el URDF define qué puedes mandar y qué puedes leer. Si el controlador pide position y no está declarada, falla con «interface not found».`),
      apunte(`Nunca actives dos controladores que escriban en la misma interfaz: se pelean por el joint. Desactiva uno con switch_controllers antes de activar otro.`),
      tabla(['Controlador', 'Entrada', 'Uso'], [
        ['diff_drive_controller', '/cmd_vel', 'Robots de dos ruedas'],
        ['joint_trajectory_controller', 'Posición por joint', 'Brazos'],
        ['joint_state_broadcaster', 'Estado', 'Casi siempre activo']
      ])
    ]
  },
  'r7-9': {
    why: `Simular permite entrenar sin romper nada, pero un simulador con físicas inventadas da una falsa sensación de éxito. Gazebo, MuJoCo e Isaac Sim no compiten: responden a preguntas distintas (sensores, contacto, fotorrealismo).`,
    from: `«ros2_control» ya dio las interfaces; aquí se elige el mundo donde ejecutarlas.`,
    to: `Con sensores simulados disponibles, «SLAM, Nav2, MoveIt 2 y testing en ROS 2» construye el robot que hace cosas.`,
    analogy: `Es como entrenar en un simulador de vuelo: sirve para los procedimientos, pero si los vientos y la masa del avión son falsos, el primer vuelo real te lo recuerda.`,
    extraBlocks: [
      p(`Con 2048 entornos en paralelo y episodios de 1000 pasos se generan ~2 millones de transiciones en segundos. Un solo robot físico necesitaría semanas para lo mismo.`),
      apunte(`El domain randomization (masa, fricción, retardos, luz) es lo que hace que lo aprendido en sim sobreviva al paso al robot real: hacer el entrenamiento más difícil mejora la transferencia.`),
      aviso(`Si el robot flota en Gazebo, revisa <inertial> y <collision> del URDF antes de tocar los parámetros del mundo.`)
    ]
  },
  'r7-10': {
    why: `SLAM, Nav2 y MoveIt 2 son tres problemas distintos que comparten el mismo grafo ROS 2: mapa y localización, navegación y manipulación. Probarlos solo en simulación y sin tests automatizados es la receta para un fallo en la demostración final.`,
    from: `«Simulación: Gazebo, MuJoCo e Isaac Sim» proporciona el mundo; aquí se despliegan las capacidades de alto nivel.`,
    to: `ROS 2 ya sabe mover al robot; el siguiente bloque responde cómo decidir la acción de control con «PID por intuición».`,
    analogy: `Es como la diferencia entre saber conducir y tener un mapa, un GPS y un plan de ruta: cada herramienta resuelve una parte, y las tres deben hablar el mismo idioma.`,
    extraBlocks: [
      p(`SLAM Toolbox publica map→odom al detectar loop closure: si la odometría acumuló 2 m de deriva, esa corrección salta de golpe en el mapa pero el robot no se mueve.`),
      apunte(`Un rosbag con el recorrido real es el mejor banco de pruebas: ejecuta SLAM y Nav2 sobre los mismos datos antes de soltar el sistema en el robot.`),
      tabla(['Herramienta', 'Pregunta', 'Salida'], [
        ['SLAM Toolbox', '¿Dónde estoy y cómo es el sitio?', 'Mapa 2D + map→odom'],
        ['Nav2', '¿Cómo llego a (x,y)?', '/navigate_to_pose'],
        ['MoveIt 2', '¿Cómo muevo el brazo sin chocar?', 'Trayectoria por ros2_control']
      ])
    ]
  },

  // ==================== B8: CONTROL Y CINEMÁTICA ====================
  'r8-1': {
    why: `Un controlador no sabe dónde debe estar: solo mide dónde está y calcula la diferencia. Entender el lazo error→acción explica por qué un motor con PID llega al objetivo aunque cambie la carga, algo que ningún código de «mover a posición X» logra.`,
    from: `«SLAM, Nav2, MoveIt 2 y testing en ROS 2» decides dónde ir; falta decidir cómo generar la orden para el motor.`,
    to: `La intuición del termostato no dice cuánto vale cada ganancia: «Términos P, I, D y el windup» las separa con números.`,
    analogy: `Es un termostato: si hace frío enciendes (P), si lleva rato frío subes la potencia (I) y si la temperatura sube muy rápido bajas antes de pasarte (D).`,
    extraBlocks: [
      p(`Con error de 10° y Kp = 0.5 la orden es 5; con Kp = 2 es 20, cuatro veces más rápido pero con riesgo de pasarse. Duplicar Kp no duplica la calidad: duplica la agresividad.`),
      apunte(`En control se llama planta al sistema que dominas: motor, horno o brazo. El PID no la modela al detalle; reacciona a lo que mide. Esa ignorancia deliberada es su robustez.`),
      formula(`e(t) = y_deseado − y_medido    |    u(t) = Kp·e + Ki·∫e dt + Kd·de/dt`)
    ]
  },
  'r8-2': {
    why: `La integral elimina el error permanente, pero si el actuador está saturado sigue acumulando y luego se descarga de golpe: el windup. Saber congelar la integral cuando PWM está al 100 % evita el «se pasa y luego vuelve despacio» que confunde a todo principiante.`,
    from: `«PID por intuición» presentó las tres acciones; aquí se analiza qué pasa cuando una de ellas se desborda.`,
    to: `Con las ganancias entendidas, «Sintonización y respuesta al escalón» da el método para elegirlas con métricas.`,
    analogy: `El windup es como frenar un coche con el freno de mano puesto: al soltarlo, el coche da un tirón porque llevabas demasiada fuerza acumulada.`,
    extraBlocks: [
      p(`Con Ki = 2 y error de 10° durante 3 s, la integral suma 60; si la orden máxima era 10, la integral «sobrante» tarda segundos en descargarse y el eje se pasa 30° de golpe.`),
      apunte(`La derivada amplifica ruido: un encoder con cuantización de 1 cuenta y dt = 1 ms da una derivada de 1000 cuentas/s de un solo salto. Filtra la medición antes de derivar, no después.`),
      formula(`u = Kp·e + Ki·Σe·Δt + Kd·(e_k − e_{k−1})/Δt    |    anti-windup: no integrar si u está saturado`)
    ]
  },
  'r8-3': {
    why: `Sintonizar a ojo funciona hasta que cambia la carga; medir overshoot y tiempo de asentamiento convierte la discusión en números. Sin un criterio, dos ingenieros pueden defender ganancias opuestas con la misma evidencia.`,
    from: `«Términos P, I, D y el windup» explicó el efecto de cada ganancia; aquí se elige su valor.`,
    to: `La prueba del escalón da curvas, pero no modelo: «Función de transferencia» las convierte en una ecuación que predice la respuesta.`,
    analogy: `Es como ajustar la suspensión de una moto: no basta con «más blanda», hay que medir cuánto rebota y cuánto tarda en estabilizarse.`,
    extraBlocks: [
      p(`Con Ziegler–Nichols y Ku = 8, Tu = 0.4 s: Kp = 4.8, Ki = 14.4, Kd = 0.24. Da ~25 % de overshoot: úsalo como punto de partida y baja Kp un 20 % si exiges <10 %.`),
      apunte(`El escalón para sintonizar debe hacerse sin saturar el actuador. Si el PWM está al 100 %, estás midiendo el límite del driver, no la respuesta del controlador.`),
      tabla(['Métrica', 'Qué mide', 'Objetivo típico'], [
        ['Rise time', '10 % → 90 %', 'Corto'],
        ['Overshoot', 'Exceso máximo', '<10–20 %'],
        ['Settling time', 'Entrar en ±2 %', 'Corto'],
        ['Error estacionario', 'Diferencia final', '≈0']
      ])
    ]
  },
  'r8-4': {
    why: `La función de transferencia comprime toda la dinámica de un sistema lineal en una expresión: sin ella, predecir la respuesta cerrada exige simular cada cambio. Saber que el denominador 1+GC decide la estabilidad permite diseñar sobre papel antes de soldar.`,
    from: `«Sintonización y respuesta al escalón» midió la conducta; aquí se construye el modelo que la explica.`,
    to: `Una función de transferencia no ve estados internos ni sistemas de varias entradas: «Espacio de estados» los hace explícitos.`,
    analogy: `Es como la ficha técnica de un coche: en vez de probar cada carretera, te da la relación entre pisar el acelerador y la velocidad que esperas.`,
    extraBlocks: [
      p(`Motor con kt = 0.01, ke = 0.01, R = 1 Ω, J = 0.0002, b = 0.0001: G(s) = 0.01/(0.0002s + 0.0001 + 0.0001) = 0.01/(0.0002s + 0.0002). Ganancia DC = 50, τ = 1 s.`),
      apunte(`Identifica G(s) experimentalmente con un escalón o una señal PRBS: ajusta ganancia, constante de tiempo y retardo. Un retardo de 5 ms no modelado arruina la predicción a frecuencias altas.`),
      formula(`T(s) = G(s)·C(s)/(1 + G(s)·C(s))    →    estables si todos los polos tienen parte real negativa`)
    ]
  },
  'r8-5': {
    why: `El espacio de estados guarda toda la información necesaria para predecir el futuro en un vector x: posición, velocidad, corriente. Sin él no puedes decir si un modo es incontrolable o inobservable, y diseñar un observador para un sistema no observable es perder el tiempo.`,
    from: `«Función de transferencia» resumía la entrada-salida; aquí se abre la caja y se ven los estados internos.`,
    to: `Con A, B, C, D definidos, «LQR: control óptimo lineal» calcula la ganancia en vez de elegirla a ojo.`,
    analogy: `Es como conducir con instrumentos: la función de transferencia solo ve el velocímetro; el espacio de estados ve también el nivel de combustible y la temperatura del motor.`,
    extraBlocks: [
      p(`Carro con m = 1, b = 0.2: A = [[0,1],[0,−0.2]], B = [[0],[1]], C = [1,0]. La matriz de controlabilidad [B, AB] tiene rango 2; si fuera 1, ningún empuje movería cierto modo.`),
      apunte(`Un observador estima lo que no mides: ẋ̂ = Ax̂ + Bu + L(y − Cx̂). Coloca los polos del error 2–5 veces más rápidos que los del control, o el estimador llegará tarde.`),
      formula(`ẋ = A·x + B·u    |    y = C·x + D·u    |    controlable: rango[B AB …] = n`)
    ]
  },
  'r8-6': {
    why: `LQR sustituye la sintonización a ojo por un coste que penaliza error y esfuerzo: te dice cuánto vale cada grado de agresividad. Sin entender Q y R, subes la ganancia hasta que el motor satura y culpas al modelo.`,
    from: `«Espacio de estados» dio las matrices A y B; LQR las usa para resolver la ganancia K de forma óptima.`,
    to: `LQR no respeta límites de par: «MPC: control predictivo por horizonte móvil» mete las restricciones dentro del optimizador.`,
    analogy: `Es como elegir ruta entre rapidez y gasolina: Q penaliza llegar tarde y R penaliza el consumo; el optimizador encuentra el equilibrio por ti.`,
    extraBlocks: [
      p(`Con Q = diag([10,1]) y R = 0.1, priorizas posición y el esfuerzo es barato: K grande. Sube R a 10 y la misma planta se vuelve lenta pero no satura.`),
      apunte(`LQR garantiza márgenes razonables (≥60° de fase) si (A,B) es controlable y (A,Q) detectable. Esa garantía es por lo que se usa antes de saltar a MPC.`),
      formula(`J = ∫(xᵀQx + uᵀRu)dt    |    K = R⁻¹·Bᵀ·P, con AᵀP + PA − PBR⁻¹BᵀP + Q = 0`)
    ]
  },
  'r8-7': {
    why: `MPC resuelve en cada ciclo cuál es la mejor secuencia de acciones para los próximos N pasos y aplica solo la primera. Es la única herramienta aquí que puede decir «no pases de este par» dentro del propio cálculo.`,
    from: `«LQR: control óptimo lineal» daba una ganancia fija sin restricciones; aquí se optimiza con límites explícitos.`,
    to: `El control ya decide la acción óptima, pero aún no sabe dónde tiene la pinza: «Cinemática directa» calcula la pose desde los ángulos.`,
    analogy: `Es como conducir mirando 15 s por delante: eliges la mejor trayectoria respetando los límites del coche, haces el primer movimiento y vuelves a mirar.`,
    extraBlocks: [
      p(`Con horizonte N = 15 y u limitado a ±1, el optimizador respeta el tope aunque el error pida 5. Si el solve tarda 8 ms en un lazo de 1 ms, reduce N o cambia a OSQP.`),
      apunte(`El coste computacional es la desventaja real: MPC en robots rápidos se compila con CasADi o ACADO. Empieza con N pequeño y mide el tiempo de resolución antes de subirlo.`),
      tabla(['', 'LQR', 'MPC'], [
        ['Restricciones', 'No', 'Sí, explícitas'],
        ['Cálculo', 'Ganancia constante', 'Optimización online'],
        ['Horizonte', 'Infinito', 'Finito N']
      ])
    ]
  },
  'r8-8': {
    why: `La cinemática directa responde a una pregunta que parece trivial pero no lo es: si muevo cada servo a este ángulo, ¿dónde acaba la pinza? Sin marcos y convenciones documentadas, tu FK y tu IK no coincidirán nunca.`,
    from: `«MPC: control predictivo por horizonte móvil» decide el esfuerzo; ahora se calcula la geometría resultante.`,
    to: `La directa es única; la inversa puede tener muchas soluciones o ninguna: «Cinemática inversa» ataca ese problema.`,
    analogy: `Es como leer un reloj de agujas: conoces los ángulos y la longitud de cada aguja, y calculas dónde está la punta.`,
    extraBlocks: [
      p(`Brazo planar con L1 = 1, L2 = 0.8 y q1 = 30°, q2 = 45°: x = cos30 + 0.8·cos75 ≈ 0.866 + 0.207 = 1.073; y = sin30 + 0.8·sin75 ≈ 0.5 + 0.773 = 1.273.`),
      apunte(`Las matrices 4×4 no conmutan: T₀¹·T₁² no es lo mismo que T₁²·T₀¹. Si tu FK no coincide con el robot real, dibuja los marcos a mano y comprueba una matriz por eslabón.`),
      formula(`x = L1·cos(q1) + L2·cos(q1+q2)    |    y = L1·sin(q1) + L2·sin(q1+q2)`)
    ]
  },
  'r8-9': {
    why: `La cinemática inversa es el problema que el usuario ve: «pon la pinza aquí». Es más difícil que la directa porque puede tener dos ramas, una o ninguna, y una solución matemáticamente válida puede ser físicamente imposible.`,
    from: `«Cinemática directa» calculó la pose desde q; aquí se invierte la flecha.`,
    to: `La IK da ángulos, pero no dice con qué velocidad se puede mover: «Jacobiano y singularidades» conecta velocidades y detecta zonas vedadas.`,
    analogy: `Es como apoyar la mano en un punto de la mesa con el codo arriba o abajo: dos posturas llegan al mismo sitio, y una puede chocar con la mesa.`,
    extraBlocks: [
      p(`Brazo con L1 = 1, L2 = 0.8 y objetivo (1.2, 0.5): c2 = (1.44+0.25−1−0.64)/(2·1·0.8) = 0.656, q2 ≈ ±49°. Si el objetivo fuera (2.0, 0), c2 > 1: fuera del espacio de trabajo.`),
      apunte(`Fija siempre una rama (elbow up/down) o parte de una semilla cercana a la postura actual. Un solver que cambia de rama entre llamadas hace que el brazo «salte» sin razón.`),
      aviso(`Una IK que ignora límites devuelve ángulos imposibles. Valida q dentro del rango y comprueba colisiones antes de ejecutar.`)
    ]
  },
  'r8-10': {
    why: `El Jacobiano convierte velocidades de motor en velocidades de la pinza y al revés. Cerca de una singularidad su inversa se dispara: los motores van a máxima velocidad para mover la punta apenas un milímetro.`,
    from: `«Cinemática inversa» dio los ángulos; el Jacobiano dice qué tan rápido y con qué riesgo se alcanza la pose.`,
    to: `El Jacobiano es velocidad sin fuerzas: «Dinámica del robot» introduce masa, gravedad y pares.`,
    analogy: `Es como intentar empujar una puerta justo en el marco: por mucha fuerza que hagas, no se mueve; el brazo totalmente estirado está en esa misma postura.`,
    extraBlocks: [
      p(`En el brazo planar con q2 = 0 (totalmente estirado), det(J) = −L1·L2·sin(q2) = 0. Cualquier velocidad lateral de la pinza exigiría q̇ infinito: hay una dirección perdida.`),
      apunte(`Usa damped least squares: J⁺ = Jᵀ(JJᵀ + λ²I)⁻¹ con λ ≈ 0.01–0.1. La seudoinversa sin amortiguar amplifica el ruido del encoder justo donde más precisión necesitas.`),
      formula(`ẋ = J(q)·q̇    |    q̇ = J⁺·ẋ    |    τ = Jᵀ·F   (el mapa inverso también sirve para fuerzas)`)
    ]
  },
  'r8-11': {
    why: `La dinámica responde cuánto par hay que aplicar en cada eje para seguir una trayectoria rápida. Sin compensar gravedad e inercia, el PID debe generar ese par con error, y el brazo cae en cuanto aflojas el control.`,
    from: `«Jacobiano y singularidades» daba velocidades; aquí entra la masa que hay que acelerar.`,
    to: `Con el modelo dinámico conocido, «Planificación de trayectorias» genera curvas que respetan aceleración y jerk.`,
    analogy: `Es como empujar un carrito lleno: además de la dirección, necesitas saber cuánto pesa y cuánto cuesta arrancarlo y frenarlo.`,
    extraBlocks: [
      p(`Brazo de 0.5 kg a 0.3 m: par de gravedad ≈ 0.5·9.81·0.3 = 1.47 N·m. Sin feedforward, el PID necesita error permanente para generarlo; con g(q) compensada, Ki puede ser pequeño.`),
      apunte(`M(q) depende de q: no es constante como en un motor simple. Un error del 20 % en la inercia del URDF se nota en aceleraciones altas, aunque la gravedad esté bien.`),
      formula(`M(q)·q̈ + C(q,q̇)·q̇ + g(q) + F(q̇) = τ`)
    ]
  },
  'r8-12': {
    why: `Encontrar un camino libre de colisiones no basta: si la aceleración cambia de golpe, el brazo tiembla al frenar. Planificar incluye suavizar y remuestrear en tiempo con perfiles S-curve o polinomios de quinto grado.`,
    from: `«Dinámica del robot» dio los pares; ahora se genera la curva que el controlador debe seguir.`,
    to: `La trayectoria asume contacto nulo: «Control de fuerza e impedancia» abre la puerta a tareas donde el robot debe tocar.`,
    analogy: `Es como dibujar una curva con un lápiz: unir puntos con líneas rectas da esquinas; una curva suave respeta la inercia del brazo.`,
    extraBlocks: [
      p(`Polinomio quinto de 0 a 1 rad en T = 1 s: a3 = 10, a4 = −15, a5 = 6. En t = 0.5, q̇ = 3·10·0.25 + 4·(−15)·0.125 + 5·6·0.0625 = 1.875 rad/s, y la aceleración arranca y acaba en cero.`),
      apunte(`Un camino en el espacio de configuraciones no dice a qué velocidad recorrerlo. El time-parameterization es un paso separado y es donde se enforcan jerk y aceleración.`),
      tabla(['Planificador', 'Espacio', 'Ideal para'], [
        ['A*', 'Rejilla 2D', 'Robots móviles'],
        ['RRT / RRT*', 'Alta dimensión', 'Brazos con obstáculos'],
        ['CHOMP / STOMP', 'Optimización', 'Suavizar con restricciones']
      ])
    ]
  },
  'r8-13': {
    why: `El control de posición es rígido: si encuentra un obstáculo, sigue empujando hasta que algo cede. Para ensamblar, limpiar o sostener un huevo hay que controlar la relación fuerza–movimiento, no solo la posición.`,
    from: `«Planificación de trayectorias» asumió espacio libre; aquí aparece el contacto real con el entorno.`,
    to: `Con el contacto dominado, «Sistemas subactuados» plantea el caso extremo: menos actuadores que grados de libertad.`,
    analogy: `Es la diferencia entre una pinza de acero y un brazo con resorte: uno obliga al objeto, el otro se adapta a él.`,
    extraBlocks: [
      p(`Con M = 1, B = 10 y K = 100, si el objeto se mueve 1 cm el robot genera F ≈ K·0.01 = 1 N. Si subes K a 1000, la misma desviación da 10 N: puede romper el objeto.`),
      apunte(`Con K alto y B bajo el contacto rebota: es un sistema poco amortiguado. Busca amortiguamiento crítico B ≈ 2·√(M·K) ≈ 20 antes de bajar K.`),
      tabla(['Enfoque', 'Entrada', 'Salida'], [
        ['Impedancia', 'Posición', 'Fuerza'],
        ['Admittance', 'Fuerza medida', 'Posición'],
        ['Fuerza directa', 'Fuerza deseada', 'Par']
      ])
    ]
  },
  'r8-14': {
    why: `Un sistema subactuado tiene más grados de libertad que actuadores: no puedes ordenar cada variable por separado. El péndulo invertido solo se estabiliza moviendo la base, y entender ese acoplamiento evita intentar controlar el ángulo directamente.`,
    from: `«Control de fuerza e impedancia» gestionaba el contacto; aquí el reto es el equilibrio con recursos escasos.`,
    to: `El LQR linealizado del cart-pole funciona cerca del equilibrio: «Análisis en frecuencia» revela qué pasa cuando el lazo se acerca a la inestabilidad.`,
    analogy: `Es como equilibrar un palo en la mano: no lo enderezas empujando el palo, sino moviendo la mano hacia donde se cae.`,
    extraBlocks: [
      p(`Con M = 1 kg, m = 0.1 kg y l = 0.5 m, el péndulo con θ = 10° sin control cae en ~0.5 s. Con LQR sobre [x, ẋ, θ, θ̇] y Q = diag([1,1,10,1]) se mantiene y el carro vuelve al centro.`),
      apunte(`La linealización solo es válida cerca de θ = 0. Si el péndulo cae 40°, el LQR lineal ya no sabe qué hacer: necesitas un control no lineal o una estrategia de recuperación.`),
      tabla(['Sistema', 'Actuadores / GDL', 'Idea'], [
        ['Cart-pole', '1 / 2', 'Mover la base'],
        ['Cuadricóptero', '4 / 6', 'Inclinarse para trasladarse'],
        ['Bípedo', 'Pocos / muchos', 'Transferencia de peso']
      ])
    ]
  },
  'r8-15': {
    why: `El dominio de la frecuencia revela márgenes de estabilidad que el escalón no muestra: un brazo con un modo resonante puede temblar aunque el escalón «se vea bien». Saber leer Bode evita subir Kp a un lazo que ya está al límite.`,
    from: `«Sistemas subactuados» terminó con LQR sobre modelo lineal; aquí se mide la robustez real de esos lazos.`,
    to: `El control ya es estable y medible; el bloque siguiente añade la capacidad de ver: «Fundamentos de imagen» abre la percepción.`,
    analogy: `Es como empujar un columpio: si empujas a su frecuencia natural, amplificas el movimiento; el Bode te dice qué frecuencias amplifican.`,
    extraBlocks: [
      p(`Con margen de fase de 10°, el sistema tiene poco amortiguamiento y un overshoot grande. Un margen de 45–60° es el rango sano; por debajo de 30° empieza a oscilar con cualquier perturbación.`),
      apunte(`Un pico de magnitud con caída brusca de fase marca una resonancia mecánica. Si el ancho de banda del lazo la cruza, ningún aumento de Kp arregla el temblor: hace falta un filtro notch.`),
      formula(`t_rise ≈ 0.35/BW    |    margen de fase = 180° + ∠G(jω_c)`)
    ]
  },

  // ==================== B9: VISIÓN Y PERCEPCIÓN 3D ====================
  'r9-1': {
    why: `Una imagen es una rejilla de números, y OpenCV los guarda en BGR, no RGB. Confundir el orden de canales o trabajar con uint8 al restar imágenes produce colores invertidos y desbordamientos que parecen fallos del modelo.`,
    from: `«Análisis en frecuencia» cerró el control; ahora el robot necesita ver para decidir dónde actuar.`,
    to: `Con la imagen cargada, «Filtrado y umbrales» separa el objeto del fondo con la herramienta más barata.`,
    analogy: `Es como una cuadrícula de baldosas: cada baldosa guarda un número de 0 a 255; en color guarda tres, y el orden de los tres importa.`,
    extraBlocks: [
      p(`Una imagen 1280×720 en BGR son 1280·720·3 = 2.76 MB sin comprimir. A 30 Hz eso son 83 MB/s: por eso los topics de cámara se comprimen en ROS 2.`),
      apunte(`Restar dos imágenes uint8 desborda: 10 − 20 da 246, no −10. Convierte a float32 antes de operar si vas a calcular diferencias.`),
      aviso(`En OpenCV el origen (0,0) está arriba a la izquierda y y crece hacia abajo, al revés que en el sistema de coordenadas del robot.`)
    ]
  },
  'r9-2': {
    why: `El umbral es la forma más barata de separar un objeto del fondo, pero un umbral fijo calibrado en el laboratorio falla al cambiar de sala. Otsu y el umbral adaptativo existen para cuando no controlas la iluminación.`,
    from: `«Fundamentos de imagen» dio la imagen en gris; aquí se decide qué píxeles son objeto.`,
    to: `El umbral trabaja píxel a píxel, sin vecindad: «Convolución» introduce filtros que miran los píxeles de al lado.`,
    analogy: `Es como separar monedas de una cinta por peso: pones un corte en 128 y todo lo que pesa más cae a un lado; si cambia la luz, cambia el peso.`,
    extraBlocks: [
      p(`Con Otsu sobre un histograma bimodal (fondo en 40, objeto en 200), el umbral automático cae cerca de 120. Si el histograma es un solo pico ancho, Otsu elige mal: ahí hace falta adaptativo.`),
      apunte(`Un blur Gaussiano 5×5 antes del umbral evita que el ruido se convierta en miles de puntos blancos. Después, una apertura morfológica quita los puntos sueltos que quedaron.`),
      formula(`adaptativo: umbral por región → tolera sombras y gradientes; fijo: umbral global → falla con luz desigual`)
    ]
  },
  'r9-3': {
    why: `La convolución es la operación detrás de casi todo el procesamiento de imágenes: suavizar, detectar bordes o realzar no son algoritmos distintos, son kernels distintos. Entender padding y stride explica por qué la salida cambia de tamaño.`,
    from: `«Filtrado y umbrales» trabajaba píxel a píxel; aquí se mira una vecindad de 3×3.`,
    to: `Con los kernels de gradiente ya disponibles, «Detección de bordes y features» los usa para encontrar puntos rastreables.`,
    analogy: `Es como pasar un tampón de 3×3 por toda la imagen: en cada posición multiplicas y sumas, y el resultado es un píxel nuevo.`,
    extraBlocks: [
      p(`Sobel x = [[−1,0,1],[−2,0,2],[−1,0,1]]. Sobre un borde vertical que pasa de 10 a 200, la respuesta es ~2·(200−10) = 380: el gradiente marca dónde cambia la intensidad.`),
      apunte(`Un kernel de suavizado debe sumar 1; si suma 5, la imagen se aclara 5 veces en cada pasada. Normaliza siempre los kernels de promedio.`),
      nota(`Una CNN no es más que muchas capas de convolución aprendidas: los kernels no los escribes, los aprende el gradiente descendente.`)
    ]
  },
  'r9-4': {
    why: `Sin features no hay visión geométrica: necesitas puntos que reconozcas de un frame a otro para estimar movimiento. Canny da bordes continuos por histéresis; ORB da puntos rápidos y libres, y el test de ratio filtra los emparejamientos dudosos.`,
    from: `«Convolución» dio los gradientes; Canny y ORB los convierten en bordes y puntos utilizables.`,
    to: `Los puntos de imagen solo son útiles si sabes a qué rayo del mundo corresponden: «Calibración de cámara» da esa traducción.`,
    analogy: `Canny es como seguir una línea de contorno con un dedo: conserva el trazo aunque haya pequeños huecos, porque no suelta un punto dudoso si conecta con uno seguro.`,
    extraBlocks: [
      p(`Con el test de ratio de Lowe a 0.75, de 500 emparejamientos crudos sobreviven ~80; con RANSAC sobre una homografía quedan ~60 inliers. Sin esos filtros, tu odometría visual salta.`),
      apunte(`Una pared lisa tiene pocas features: el SLAM visual se pierde. Añade luz rasante o un patrón artificial si controlas el entorno; cambiar el detector no crea textura donde no hay.`),
      tabla(['Detector', 'Tipo', 'Ventaja'], [
        ['Canny', 'Bordes', 'Histéresis, líneas continuas'],
        ['SIFT', 'Features', 'Invariante a escala'],
        ['ORB', 'Features', 'Rápido y libre para SLAM en CPU']
      ])
    ]
  },
  'r9-5': {
    why: `La calibración traduce píxeles a rayos: sin intrínsecos y distorsión, cualquier medida en metros es falsa. Un error de reproyección mayor de 1 píxel te dice que las fotos están borrosas o el tablero mal detectado.`,
    from: `«Detección de bordes y features» encuentra esquinas; la calibración les asigna coordenadas en el mundo.`,
    to: `Con una cámara calibrada, «Visión estereo» usa dos de ellas para obtener profundidad por disparidad.`,
    analogy: `Es como ajustar la escala de un mapa: sin saber cuántos centímetros vale cada píxel, puedes medir con la regla pero no saber la distancia real.`,
    extraBlocks: [
      p(`Con fx = 525 px y un objeto a 2 m que mide 0.2 m de ancho, su imagen mide 525·0.2/2 ≈ 52.5 px. Si fx está mal un 10 %, la medida de tamaño se desvía 5 px.`),
      apunte(`Guarda K y dist en YAML junto al código. La calibración envejece: si golpeas la cámara o cambias el objetivo, repítela y vuelve a medir el RMS.`),
      formula(`u = fx·X/Z + cx    |    v = fy·Y/Z + cy    |    RMS de reproyección < 1 px`)
    ]
  },
  'r9-6': {
    why: `El estereo obtiene profundidad sin active lighting: la disparidad es inversamente proporcional a Z. Pero el error crece con el cuadrado de la distancia, así que duplicar la distancia cuadruplica el error.`,
    from: `«Calibración de cámara» dio los intrínsecos; con dos cámaras calibradas se puede rectificar y emparejar.`,
    to: `La profundidad por píxel es el paso previo a «Nubes de puntos», donde esos valores se vuelven geometría 3D.`,
    analogy: `Es como mirar con dos ojos: el dedo cerca del nariz parece más desplazado que un edificio lejano; ese desplazamiento mide la distancia.`,
    extraBlocks: [
      p(`Con f = 525 px, b = 0.12 m y un objeto a 2 m, d = f·b/Z = 525·0.12/2 ≈ 31.5 px. Con δd = 1 px, δZ ≈ Z²/(f·b) ≈ 0.063 m: 6 cm de error a 2 m.`),
      apunte(`Duplicar la línea base mejora la precisión lejana pero reduce el rango cercano: aparece una zona ciega donde los campos de visión no se solapan.`),
      formula(`Z = f·b/d    |    δZ ≈ (Z²/(f·b))·δd    →    error ∝ distancia²`)
    ]
  },
  'r9-7': {
    why: `Una nube de puntos tiene millones de tripletos y procesarla sin reducir es lento. El voxel grid, las normales y la segmentación del suelo son los tres pasos que convierten ese caos en algo que un planificador puede usar.`,
    from: `«Visión estereo» entregó un mapa de profundidad; aquí se convierte en una estructura 3D manejable.`,
    to: `Con dos nubes alineadas surge la pregunta de cómo juntarlas: «ICP y registro de nubes» resuelve el alineamiento.`,
    analogy: `Es como tamizar arena: pasas el tamiz de 2 cm y te quedas con un grano por celda; la forma sigue ahí, pero hay 100 veces menos granos.`,
    extraBlocks: [
      p(`Voxel de 2 cm sobre una nube de 3 millones de puntos puede dejar ~50.000 sin perder la forma general. Calcular normales con KNN = 20 cuesta O(N·20), así que reduce antes de estimar.`),
      apunte(`Las normales por PCA sobre los vecinos más cercanos son la base de casi todo lo demás: planos, segmentación, ICP punto-plano y renderizado.`),
      tabla(['Formato', 'Uso', 'Nota'], [
        ['PCD', 'PCL y ROS', 'Nativo'],
        ['PLY', 'Intercambio', 'Con colores'],
        ['PointCloud2', 'ROS 2 en tiempo real', 'Estándar de topics']
      ])
    ]
  },
  'r9-8': {
    why: `ICP alinea dos nubes iterando vecino más cercano y transformación rígida, pero es local: si las nubes empiezan lejos, converge a un mínimo falso. Saber dar una semilla con odometría o registro global evita un mapa «alineado» y equivocado.`,
    from: `«Nubes de puntos» dio la representación; ahora se juntan varios escaneos.`,
    to: `El registro alinea geometría; «Detección de objetos con YOLO» añade semántica: qué objeto hay en esa geometría.`,
    analogy: `Es como juntar dos fotos de un puzzle: si las pones casi en su sitio, encajan; si las giras 90°, el algoritmo se queda con una coincidencia falsa.`,
    extraBlocks: [
      p(`Con max_correspondence_distance = 0.10 m y una semilla de odometría, ICP punto-plano suele dar fitness > 0.8. Sin semilla, fitness 0.3 y una rotación de 40°: es un mínimo local.`),
      apunte(`Punto-plano converge mejor que punto-punto cuando tienes normales: minimiza la distancia al plano tangente y tolera muestreos distintos entre escaneos.`),
      aviso(`Un ICP con inicialización por defecto (identidad) solo funciona si los dos sensores comparten marco. En robots en movimiento, usa la odometría como semilla.`)
    ]
  },
  'r9-9': {
    why: `YOLO responde «qué hay y dónde» en una sola pasada, y sus métricas (IoU, precision, recall, mAP) explican por qué subir la confianza mejora precision pero hunde recall. Sin NMS, la misma red produce tres cajas sobre el mismo objeto.`,
    from: `«ICP y registro de nubes» daba geometría sin etiquetas; aquí entra la clasificación semántica.`,
    to: `Una caja es burda para agarrar: «Segmentación» da la máscara píxel a píxel que necesita la pinza.`,
    analogy: `Es como un guardia que señala con un rectángulo todo lo que ve: rápido y útil, pero el rectángulo no sigue el contorno del objeto.`,
    extraBlocks: [
      p(`Con conf = 0.5 e IoU = 0.45, un detector nano corre a 30–60 FPS en Jetson Orin. Subir conf a 0.9 elimina falsos positivos pero puede bajar el recall del 90 % al 60 %.`),
      apunte(`La métrica mAP agrega precision-recall sobre todas las clases y umbrales de IoU. Un mAP alto con tu clase crítica en recall bajo no sirve para el robot.`),
      formula(`IoU = área_intersección / área_unión    |    NMS suprime cajas con IoU > umbral`)
    ]
  },
  'r9-10': {
    why: `La detección da cajas; la segmentación da la forma exacta, necesaria para calcular el centro de masa o los píxeles que pertenecen a una pieza antes de agarrarla. Con la cámara calibrada, la máscara se lleva a 3D y el brazo recibe un punto real.`,
    from: `«Detección de objetos con YOLO» localizó el objeto; aquí se afina hasta el píxel.`,
    to: `La percepción ya da objetos y geometría, pero el mapa global aún deriva: «SLAM visual» cierra el bucle localización–mapeo.`,
    analogy: `Es la diferencia entre dibujar un rectángulo alrededor de una taza y recortar la taza con tijeras: el recorte te dice dónde está exactamente el borde.`,
    extraBlocks: [
      p(`Una máscara de 500 píxeles con K⁻¹ y profundidad media de 1.2 m da un centro 3D; un error de 5 px en el centro se traduce en ~1 cm a 1.2 m con fx = 525.`),
      apunte(`SAM permite segmentar con un prompt (un punto o una caja) sin reentrenar: útil para crear datasets de manipulación en minutos en vez de horas.`),
      aviso(`Los metálicos brillantes rompen máscaras por reflejos. Cambia el ángulo de la luz antes de reentrenar la red.`)
    ]
  },
  'r9-11': {
    why: `En interiores no hay GPS: el SLAM visual construye el mapa mientras estima la posición usando features que pasan de un frame a otro. Sin loop closure la deriva crece para siempre, y una cámara monocular ni siquiera conoce la escala absoluta.`,
    from: `«Segmentación» dio objetos; aquí se usa la misma geometría de features para construir el mapa global.`,
    to: `El SLAM visual necesita baja latencia y exposición estable: «Fallos típicos de iluminación» cierra el bloque con el enemigo más común.`,
    analogy: `Es como caminar por una ciudad desconocida reconociendo esquinas: sabes cuánto has avanzado, pero solo al volver a una plaza ya vista corriges el mapa.`,
    extraBlocks: [
      p(`Con ORB y 2000 features por frame, una cámara a 30 Hz genera 60.000 descriptores por segundo. Con ratio test 0.75 y RANSAC quedan ~50 inliers por par: suficiente para findEssentialMat si hay >= 8.`),
      apunte(`La escala monocular es ambigua: un robot pequeño cerca y uno grande lejos producen la misma imagen. La IMU (VIO), el estereo o una medida conocida resuelven la escala.`),
      aviso(`Fija exposición y balance de blancos. La exposición automática cambia la apariencia entre frames y rompe los emparejamientos aunque la cámara esté perfectamente calibrada.`)
    ]
  },
  'r9-12': {
    why: `La mayoría de los fallos de visión no son del modelo, son de la luz: un detector que funciona en el laboratorio falla junto a una ventana. Mirar el histograma antes de reentrenar ahorra semanas de trabajo inútil.`,
    from: `«SLAM visual» depende de fotometría estable; aquí se diagnostica lo que la rompe.`,
    to: `Con la percepción cerrada, «Por qué aprender en vez de programar» plantea el salto: cuando la regla no se puede escribir, se aprende.`,
    analogy: `Es como intentar leer un letrero con el sol de frente: no es que no sepas leer, es que la luz no te deja ver las letras.`,
    extraBlocks: [
      p(`Si más del 5 % de los píxeles están en 255, el histograma dice sobreexposición. Bajar la exposición 2 EV reduce la señal a la mitad (×0.25 en intensidad lineal).`),
      apunte(`Las luces LED a 50/60 Hz parpadean: con exposiciones cortas capturas distintos niveles en frames consecutivos. Ajusta el tiempo de exposición a un múltiplo del periodo o usa iluminación DC.`),
      tabla(['Síntoma', 'Causa', 'Arreglo'], [
        ['Sobreexposición', 'Luz directa', 'Bajar exposición, HDR'],
        ['Sombras duras', 'Fuente puntual', 'Difusor'],
        ['Reflejos', 'Metal', 'Cambiar ángulo de luz'],
        ['Parpadeo', 'LED 50/60 Hz', 'Exposición sincronizada']
      ])
    ]
  },

  // ==================== B10: ROBOT LEARNING ====================
  'r10-1': {
    why: `Hay tareas que sabemos hacer con las manos pero no sabemos escribir como regla: abrir un tarro resbaladizo o doblar una camiseta. El aprendizaje existe para esos casos, y conviene recordar que no sustituye al control clásico: se apoya en él.`,
    from: `«Fallos típicos de iluminación» cerró la percepción programada; ahora aparece lo que no se puede programar.`,
    to: `La forma más directa de aprender es copiar al experto: «Imitation learning y behavioral cloning» formula esa idea.`,
    analogy: `Es la diferencia entre enseñar a alguien a andar en bici con un manual y ponerlo en la bici y guiarlo hasta que lo haga solo.`,
    extraBlocks: [
      p(`Un modelo de lenguaje se entrena con todo internet; un robot, con tal vez 50 demostraciones de 20 s = 1000 s de interacción. Por eso la captura, no la arquitectura, es el cuello de botella.`),
      apunte(`Un sistema moderno mezcla: controlador clásico garantiza estabilidad a 1 kHz y una política aprendida decide la secuencia a 5–50 Hz. Esperar que la política reemplace al PID es un error común.`),
      tabla(['Enfoque', 'Brilla en', 'Límite'], [
        ['Control clásico', 'Tareas con modelo claro', 'Contacto y textura'],
        ['Imitation', 'Demos humanas fáciles', 'Calidad de las demos'],
        ['RL', 'Recompensa medible en sim', 'Sim-to-real y seguridad']
      ])
    ]
  },
  'r10-2': {
    why: `Behavioral cloning convierte cada par (observación, acción) en un ejemplo supervisado: simple y rápido, pero sufre covariate shift. Un pequeño error lleva al robot a estados nunca vistos y la trayectoria se desvía sin recuperación.`,
    from: `«Por qué aprender en vez de programar» eligió las tareas; aquí se decide cómo aprenderlas copiando al experto.`,
    to: `BC falla por falta de cobertura: «Teleoperación y datasets de demostración» ataca el problema en la fuente, grabando variedad.`,
    analogy: `Es como aprender a conducir solo con vídeos de día soleado: en cuanto llueve, estás en una situación que nunca viste y no sabes reaccionar.`,
    extraBlocks: [
      p(`Con 10 episodios de BC la tasa de éxito puede ser 30 %; con 50 episodios que incluyan correcciones sube a 70 %. No es el modelo: es la cobertura de estados.`),
      apunte(`Normalizas acciones con la media del dataset y te olvidas de desnormalizar al ejecutar: el robot recibe valores en [-1,1] donde esperaba newton-metros. Es el error más frecuente al desplegar BC.`),
      formula(`L(θ) = E[(o,a)~D] ||π_θ(o) − a||²    →    regresión supervisada sobre demostraciones`)
    ]
  },
  'r10-3': {
    why: `Las demostraciones son el combustible: un setup incómodo produce episodios entrecortados que la política aprende como si fueran correctos. Grabar con variedad intencional y revisar los episodios decide más que elegir el modelo.`,
    from: `«Imitation learning y behavioral cloning» mostró que BC se desvía fuera del dataset; aquí se graba un dataset que cubra esos estados.`,
    to: `Con demos limpias, «ACT: Action Chunking with Transformers» cambia la forma de predecir para reducir el error acumulado.`,
    analogy: `Es como grabar un tutorial de cocina: si la cámara tiembla y saltas pasos, el alumno aprenderá tus saltos, no la receta.`,
    extraBlocks: [
      p(`20 demos idénticas generalizan peor que 50 con posiciones, luz y orientación variadas. La regla: cambia solo lo que quieres que la política ignore y repite lo que debe aprender.`),
      apunte(`Leader y follower deben empezar exactamente en la misma pose. Si el offset cambia entre episodios, la misma observación corresponde a acciones distintas: el dataset se contradice solo.`),
      aviso(`Descarta episodios con fallos o teleoperación entrecortada. «Meter ruido» en el dataset es peor que tener menos datos: la política lo copiará con la misma fidelidad.`)
    ]
  },
  'r10-4': {
    why: `ACT predice un bloque de 30–100 acciones de una vez con un Transformer: al comprometerse con una trayectoria coherente evita el temblor paso a paso de BC. El truco está en el replaneo frecuente para no perder reactividad.`,
    from: `«Teleoperación y datasets de demostración» entregó episodios limpios; ACT cambia la arquitectura que los consume.`,
    to: `ACT da una salida directa y no representa bien varias soluciones: «Diffusion policy» modela la distribución completa por denoising.`,
    analogy: `Es como dibujar una línea con un movedizo continuo en vez de dar puntos sueltos: el trazo queda suave porque decides 50 puntos a la vez.`,
    extraBlocks: [
      p(`Con chunk = 50 a 50 Hz, la política decide cada 1 s de movimiento. Si replaneas cada 10 pasos (200 ms), tienes 5 oportunidades de corregir por chunk: equilibrio entre suavidad y reacción.`),
      apunte(`El temporal ensemble promedia varios chunks solapados: suaviza más, pero añade latencia. En tareas de contacto, un chunk demasiado largo ignora cambios inesperados en la escena.`),
      tabla(['Parámetro', 'Efecto'], [
        ['chunk K grande', 'Más coherencia, menos reactividad'],
        ['Replaneo cada N pasos', 'N pequeño = más reactivo'],
        ['Temporal ensemble', 'Más suavidad, más latencia']
      ])
    ]
  },
  'r10-5': {
    why: `Diffusion policy convierte ruido en una secuencia de acciones condicionada a las observaciones. Su ventaja real es la multimodalidad: si un objeto se puede agarrar por arriba o por el lado, predecir la media agarraría justo en el medio y fallaría.`,
    from: `«ACT: Action Chunking with Transformers» predecía un chunk directo; aquí se genera por denoising iterativo.`,
    to: `Imitar demos tiene límite: «Reinforcement learning: PPO y SAC» introduce aprender por recompensa, sin copiar al experto.`,
    analogy: `Es como esculpir: empiezas con un bloque de arcilla informe (ruido) y vas retirando capas hasta que aparece la forma (la acción), guiado por la observación.`,
    extraBlocks: [
      p(`Con 10 pasos de denoising y un modelo de 1 ms por paso, la inferencia cuesta 10 ms: cabe en un lazo de 50 Hz. Con 50 pasos ya son 50 ms y el robot reacciona tarde.`),
      apunte(`Más pasos no siempre significa mejor política: por encima de 10–20 la ganancia es marginal y el coste lineal. Mide latencia antes de subirlos.`),
      formula(`a_{t−1} = α·(a_t − γ·ε_θ(a_t, o, t) + z)   →   el modelo predice ruido, no la acción final`)
    ]
  },
  'r10-6': {
    why: `RL no copia demostraciones: prueba acciones y maximiza retorno. PPO es estable y paralelizable pero desperdicia datos; SAC reutiliza el replay buffer y aprende con muchas menos interacciones, algo crítico cuando el robot real es caro.`,
    from: `«Diffusion policy» cerraba el imitation learning; aquí se aprende sin experto, solo con recompensa.`,
    to: `El algoritmo no define el éxito: «Diseño de recompensas» convierte la tarea en la señal que el agente optimizará.`,
    analogy: `PPO es como probar recetas y quedarse solo con las del último intento; SAC es como guardar todas las recetas probadas y volver a usarlas.`,
    extraBlocks: [
      p(`Con 50.000 pasos y SAC en Pendulum-v1, el retorno sube a ~−200 en pocos minutos; PPO con el mismo presupuesto converge más lento pero escala mejor en 2048 entornos paralelos.`),
      apunte(`Con γ = 0.9 el agente casi ignora el futuro; con γ = 0.99 valora recompensas 100 pasos adelante. En manipulación, γ demasiado bajo produce políticas miopes.`),
      tabla(['', 'PPO', 'SAC'], [
        ['Tipo', 'On-policy', 'Off-policy con buffer'],
        ['Eficiencia de muestra', 'Baja', 'Alta'],
        ['Uso típico', 'Locomoción masiva', 'Manipulación continua']
      ])
    ]
  },
  'r10-7': {
    why: `La recompensa es la definición formal del éxito: el robot optimizará exactamente lo que escribas, no lo que querías decir. Diseñarla mal produce reward hacking, y la curva de retorno no lo delata hasta que ves el vídeo.`,
    from: `«Reinforcement learning: PPO y SAC» dio el optimizador; ahora se define qué debe optimizar.`,
    to: `El entrenamiento ocurre en simulación: «Sim-to-real» explica por qué ese éxito no se traslada automáticamente al robot.`,
    analogy: `Es como pagar a un operario por «número de cajas movidas»: las mueve rápido de un lado a otro y nadie ha cargado nada útil.`,
    extraBlocks: [
      p(`Con r = −distancia + 0.5·cos(orient) − 0.001·||τ||² + 100·éxito, si la penalización de esfuerzo sube a 0.1 el robot aprende a no moverse: el término domina.`),
      apunte(`El potential-based shaping, r′ = r + γΦ(s′) − Φ(s), acelera el aprendizaje sin cambiar la política óptima. Es la forma segura de dar recompensas densas.`),
      aviso(`Depura la recompensa con vídeos, no solo con la curva. El reward hacking se ve en el comportamiento mucho antes de que la métrica lo refleje.`)
    ]
  },
  'r10-8': {
    why: `Entrenar en simulación es rápido y seguro, pero el simulador nunca es exacto: masa, fricción, retardo e iluminación siempre difieren. El sim-to-real gap se cierra aleatorizando el dominio y calibrando lo que se puede medir.`,
    from: `«Diseño de recompensas» fijó el objetivo; ahora se entrena en un mundo que no es exactamente el real.`,
    to: `La aleatorización se ejecuta en simuladores masivos: «LeRobot: el pipeline completo» baja esa política al robot físico.`,
    analogy: `Es como entrenar con viento y baches artificiales: el día de la carrera real, ya sabes reaccionar aunque el circuito sea distinto.`,
    extraBlocks: [
      p(`Aleatorizar masa ×[0.7,1.3], fricción ×[0.5,1.5] y latencia [0,30 ms] durante el entrenamiento puede bajar el éxito en sim un 10 % pero subirlo en real un 40 %. Hacer el entrenamiento más difícil mejora la transferencia.`),
      apunte(`No aleatorices sin límite: si la masa varía ×0.1 a ×10, la política se vuelve conservadora y torpe. Los rangos deben cubrir la incertidumbre real, no ser arbitrarios.`),
      tabla(['Fuente de gap', 'Ejemplo', 'Mitigación'], [
        ['Dinámica', 'Backlash no modelado', 'Aleatorizar inercia y fricción'],
        ['Sensores', 'Latencia de cámara', 'Añadir retardo en sim'],
        ['Visual', 'Texturas irreales', 'Domain randomization']
      ])
    ]
  },
  'r10-9': {
    why: `LeRobot unifica conectar, grabar, entrenar y evaluar: sin un pipeline común, cada paso usa un formato distinto y los datos no se pueden compartir. Es el equivalente a Hugging Face Transformers pero para robots.`,
    from: `«Sim-to-real» entregó una política robusta; LeRobot da el circuito completo para llevarla al hardware.`,
    to: `Para entrenar a gran escala hacen falta simuladores paralelos: «MuJoCo Playground e Isaac Lab» acelera la generación de datos.`,
    analogy: `Es como una cadena de montaje: en vez de llevar la pieza de un taller a otro con planos distintos, todo pasa por la misma línea con el mismo formato.`,
    extraBlocks: [
      p(`Con 30 episodios a 30 Hz y 6 articulaciones, el dataset tiene ~54.000 filas de acción. Guardar las observaciones de dos cámaras 640×480 son ~3 GB por episodio: comprime o reduce resolución.`),
      apunte(`Cada fila lleva observation.* y action.*. Si la acción grabada no es exactamente la que recibió el servo (por escalado o retardo), la política aprenderá un mapeo erróneo.`),
      nota(`Empieza con un brazo barato como SO-100/101 y el pipeline completo antes de comprar hardware más caro.`)
    ]
  },
  'r10-10': {
    why: `El RL necesita millones de interacciones y un solo robot no las produce: los simuladores modernos ejecutan miles de copias en GPU. Elegir MuJoCo, Isaac Lab o Gazebo decide si entrenas en minutos o en semanas.`,
    from: `«LeRobot: el pipeline completo» cerró el ciclo en hardware; aquí se escala la generación de experiencia.`,
    to: `Con políticas entrenadas a escala, «Modelos VLA: visión, lenguaje y acción» intenta añadir comprensión de instrucciones.`,
    analogy: `Es como pasar de un estudiante con un solo libro a mil estudiantes leyendo en paralelo: el conocimiento llega mil veces más rápido.`,
    extraBlocks: [
      p(`Con 2048 entornos y episodios de 1000 pasos, cada "segundo" de reloj produce ~2 millones de transiciones. Con 128 entornos solo 128.000: 16 veces menos.`),
      apunte(`MuJoCo es ligero y su contacto es muy estable; Isaac Lab escala mejor pero exige GPU NVIDIA y tiene curva de aprendizaje más dura. Empieza por MuJoCo.`),
      aviso(`Un resultado precioso en simulación no garantiza transferencia. Valida siempre en el robot real, aunque sea con unos pocos episodios.`)
    ]
  },
  'r10-11': {
    why: `Un VLA toma imagen e instrucción y devuelve acciones: promete generalizar a objetos nuevos sin programar cada tarea. Pero su latencia es de decenas a cientos de milisegundos y alucina como un LLM, así que no puede reemplazar al control de 1 kHz.`,
    from: `«MuJoCo Playground e Isaac Lab» entregó políticas rápidas y especializadas; aquí se prueba un modelo con comprensión de lenguaje.`,
    to: `Con todo el repertorio de políticas disponible, «Métricas de éxito y evaluación» exige medirlas con un protocolo honrado.`,
    analogy: `Es como un jefe que decide qué hacer y un capataz que ejecuta: el jefe entiende el encargo, pero no debe manejar la herramienta a 1 kHz.`,
    extraBlocks: [
      p(`Un VLA a 3 Hz tarda ~330 ms por decisión: en ese tiempo un brazo a 0.5 m/s recorre 16 cm. Por eso se usa a alto nivel y se delega la ejecución a ACT o a un PID.`),
      apunte(`Los tokens de acción se discretizan en buckets (por ejemplo 256 por articulación). Cuantos menos buckets, más fácil de predecir pero peor precisión final.`),
      aviso(`Añade límites de velocidad y un monitor que pare el robot si la acción propuesta es peligrosa. Un VLA alucina acciones igual que un LLM alucina texto.`)
    ]
  },
  'r10-12': {
    why: `Un 80 % de éxito sin contexto no dice casi nada: ¿con cuántos objetos, en cuántas sesiones y con qué criterio? Un protocolo honrado con intervalos de confianza y varias semillas evita un reporte engañoso.`,
    from: `«Modelos VLA: visión, lenguaje y acción» ofrece una política más; aquí se decide cómo juzgarla.`,
    to: `El portfolio profesional empieza a construirse con esas cifras: «El portafolio que aguanta tres preguntas» las convierte en artefactos defendibles.`,
    analogy: `Es como medir un tirador con 20 disparos: acertar 16 suena bien, pero sin saber la distancia ni el viento, el número no predice el próximo concurso.`,
    extraBlocks: [
      p(`Con N = 20 y p = 0.8, IC95% ≈ 1.96·√(0.8·0.2/20) ≈ ±0.175: el intervalo es [0.63, 0.97]. Dos policies con 80 % y 85 % no son distinguibles con esa muestra.`),
      apunte(`No escojas el checkpoint con mejor éxito en el mismo conjunto que usas para reportar: es sobreajuste al test. Reserva escenarios solo para evaluación final.`),
      formula(`tasa de éxito = éxitos/N    |    IC95% ≈ 1.96·√(p·(1−p)/N)`)
    ]
  },

  // ==================== B11: PROFESIONAL ====================
  'r11-1': {
    why: `Un portafolio se juzga por artefactos verificables, no por certificados: vídeo, números medidos y una sección de fallos. Tres proyectos defendibles valen más que veinte repositorios copiados, y la regla de las tres preguntas lo pone a prueba.`,
    from: `«Métricas de éxito y evaluación» dio las cifras; aquí se empaquetan para que otro pueda verificarlas.`,
    to: `Con los artefactos listos, «Entrevistas técnicas de robótica» entrena a explicarlos a tres niveles bajo presión.`,
    analogy: `Es como un escaparate: no importa cuántos objetos tengas en el almacén, importa que los tres que expones se puedan inspeccionar de cerca.`,
  },
  'r11-2': {
    why: `En una entrevista de robótica el fallo puede ser físico y el entrevistador pide cifras: la diferencia está en responder contexto → decisión → consecuencia → alternativa. Improvisar una definición que no sabes es peor que decir cómo la investigarías.`,
    from: `«El portafolio que aguanta tres preguntas» preparó los artefactos; ahora se entrena la defensa verbal.`,
    to: `Las respuestas técnicas incluyen límites y riesgos: «Seguridad, estándares y responsabilidad» pone el marco legal y físico.`,
    analogy: `Es como declarar en un juicio: no basta con decir «funcionó», hay que explicar qué mediste, qué decidiste y qué descartaste.`,
  },
  'r11-3': {
    why: `En robótica un bug puede romper un dedo o quemar una casa: la seguridad es una restricción de diseño desde el primer día, no un trámite final. Un brazo pequeño no es seguro «por ser pequeño»: se demuestra con fuerzas y distancias medidas.`,
    from: `«Entrevistas técnicas de robótica» incluye decisiones con consecuencias; aquí se formalizan los límites que no se pueden negociar.`,
    to: `Con la seguridad como restricción, «Demanda, salarios y cómo empezar» sitúa dónde se aplica todo ese conocimiento.`,
    analogy: `Es como el cinturón de seguridad: no se pone después del accidente, se pone antes de arrancar y se comprueba cada vez.`,
  },
  'r11-4': {
    why: `El robot es solo el 25 % del coste de una celda: el valor está en la ingeniería y la integración. Saber esto evita elegir un primer empleo por el hardware y te orienta a donde se paga por hacer que funcione.`,
    from: `«Seguridad, estándares y responsabilidad» añadió una restricción al diseño; ahora se traduce en una decisión de carrera.`,
    to: `El mercado pide profundidad en una capa: «Especialidad: percepción y visión» abre el repaso de los seis caminos.`,
    analogy: `Es como comprar una cocina: la nevera es cara, pero lo que encarece el proyecto es la instalación, la fontanería y la seguridad.`,
  },
  'r11-5': {
    why: `Quien hace percepción pasa más tiempo con cámaras mal iluminadas y nubes desalineadas que entrenando modelos. La calibración es la mitad del trabajo: un modelo mediocre con buenos intrínsecos gana a uno excelente con la cámara mal calibrada.`,
    from: `«Demanda, salarios y cómo empezar» mostró que la especialización se elige trabajando; aquí se describe el primero de los seis caminos.`,
    to: `La percepción responde qué hay y dónde; «Especialidad: control y estimación» responde qué está pasando y qué hacer al respecto.`,
    analogy: `Es como un topógrafo: antes de medir distancias, calibra el teodolito; si el instrumento está mal, todo el mapa está mal.`,
  },
  'r11-6': {
    why: `Control decide qué hacer y estimación decide qué está pasando: sin una estimación fiable, el mejor controlador persigue un estado equivocado. Empezar por un motor con encoder y un péndulo invertido cubre el 80 % de los problemas posteriores.`,
    from: `«Especialidad: percepción y visión» daba la observación del mundo; aquí se convierte en estado y en acción.`,
    to: `Con el estado estimado, «Especialidad: manipulación y planificación» se ocupa de llegar y agarrar.`,
    analogy: `Es como conducir de noche: el control es el volante y la estimación es el parabrisas; si no ves, girar bien no sirve.`,
  },
  'r11-7': {
    why: `Manipulación es llegar y agarrar sin romper nada: combina cinemática, planificación con colisiones y contacto. Mejorar el dedo de una pinza puede subir la tasa de éxito más que cambiar el modelo, y eso se olvida demasiado.`,
    from: `«Especialidad: control y estimación» daba la acción precisa; aquí se decide cómo llegar y cómo agarrar.`,
    to: `Cuando la regla de agarre no se puede escribir, «Especialidad: robot learning» toma el relevo con datos.`,
    analogy: `Es como recoger una uva con pinzas de cocina: puedes tener un brazo perfecto, pero si la punza resbala, la uva se rompe.`,
  },
  'r11-8': {
    why: `Robot learning sustituye código por datos, y su cuello de botella no es el modelo: son los datos y una evaluación honesta. Saber grabar demos limpias y reportar intervalos de confianza distingue a quien publica números creíbles.`,
    from: `«Especialidad: manipulación y planificación» tiene límites que el aprendizaje puede superar; aquí se especializa en eso.`,
    to: `Todo ese entrenamiento necesita timing real: «Especialidad: embedded y firmware» baja al nivel del microcontrolador.`,
    analogy: `Es como la diferencia entre escribir recetas y encontrarlas probando: necesitas muchos ensayos y un cuaderno honesto.`,
  },
  'r11-9': {
    why: `Firmware es donde el código toca el metal: PWM, timers, DMA e interrupciones. Un osciloscopio barato que muestra una señal I²C en vivo ahorra semanas de conjeturas; sin él, el timing determinista es solo una idea en un paper.`,
    from: `«Especialidad: robot learning» entrenó políticas; aquí se garantiza que el lazo que las ejecuta sea real.`,
    to: `Con el firmware medido, «Especialidad: simulación y sistemas» sube a integrar todos los subsistemas.`,
    analogy: `Es como reparar un coche con el capó cerrado: puedes cambiar piezas a ciegas, o enchufar un diagnóstico y ver qué pasa.`,
  },
  'r11-10': {
    why: `Simulación e integración son dos caras de la misma moneda y suelen ser la mejor entrada para quien viene de SWE: contenedores, CI y código limpio se transfieren; solo faltan marcos, inercias y contactos.`,
    from: `«Especialidad: embedded y firmware» garantizó el lazo; aquí se hace que todos los lazos convivan en un robot real.`,
    to: `Con las seis especialidades repasadas, «Cómo seguir aprendiendo» propone el bucle sostenible para no caer en el curso infinito.`,
    analogy: `Es como ser el director de una orquesta: no tocas cada instrumento, pero sabes cuándo entra cada uno y que todos suenen afinados.`,
  },
  'r11-11': {
    why: `La robótica no se termina: lo que importa es un bucle que no dependa de la motivación. Un concepto por semana, un proyecto por mes y la regla de oro —si no lo puedes medir, no sabes si funciona— convierten el estudio en una costumbre.`,
    from: `«Especialidad: simulación y sistemas» cerró el mapa de caminos; aquí se decide cómo recorrerlos sin agotarse.`,
    to: `El bucle vuelve al banco con preguntas más duras: «Caída de tensión y brownout» reinicia la profundización eléctrica desde cero.`,
    analogy: `Es como ir al gimnasio: no sirve un mes intensivo, sirve una rutina que puedas repetir el año que viene.`,
  },

  // ==================== B12: DEPURACIÓN ELÉCTRICA Y EMC ====================
  'r12-1': {
    why: `Un motor pide su corriente de parada en el primer milisegundo, no la nominal: 5–10 veces más. Esa corriente atraviesa cable, conector y masa, y cualquier ohmicio se convierte en una caída que reinicia el micro sin dejar rastro. No es un bug de código, es un bug de energía.`,
    from: `«Cómo seguir aprendiendo» cerró el track básico; aquí se vuelve al banco con «Brownout y protección de la etapa de potencia» (r4-9) y se exige precisión de milivoltios.`,
    to: `Sabes que la caída existe; «Desacople y capacitor bulk» calcula cuánta capacidad hace falta para limitarla.`,
    analogy: `Es como abrir dos grifos a la vez en una casa con tubería fina: la presión cae en toda la casa y el calentador se apaga; el cable es la tubería.`,
    extraBlocks: [
      p(`Cable AWG 24 de 0.084 Ω/m en 2 m de ida y vuelta son 0.336 Ω. Con 2 A de arranque, ΔV = 0.67 V. Un AWG 18 (0.021 Ω/m) baja la caída a 0.17 V sin cambiar nada más.`),
      apunte(`Subir el umbral de BOR de 2.7 a 2.9 V evita arrancar con tensión insegura, pero aumenta los resets. Es un parche: arregla la impedancia de la fuente, no el punto de disparo.`),
      formula(`ΔV = I · R_parasito    |    R_cable = ρ·L/A    |    P = I²·R   (ρ_cobre ≈ 1.7e-8 Ω·m)`)
    ]
  },
  'r12-2': {
    why: `El desacople no da más tensión: entrega corriente durante el instante en que la fuente no reacciona. El 100 nF atiende transitorios de decenas de nanosegundos y el 100 µF sostiene cientos de microsegundos; son complementarios, no intercambiables.`,
    from: `«Caída de tensión y brownout» identificó la causa; aquí se dimensiona el depósito local que la compensa.`,
    to: `El capacitor se coloca y se calcula, pero hay que verlo: «Osciloscopio y analizador lógico» proporciona la instrumentación.`,
    analogy: `Es como un depósito de agua en el tejado: no aumenta la presión de la red, pero da el primer cubo cuando abres el grifo antes de que bombee.`,
    extraBlocks: [
      p(`Pico de 2 A durante 0.5 ms con C = 100 µF y ESR = 20 mΩ: descarga = 2·0.0005/0.0001 = 10 mV; ESR = 2·0.02 = 40 mV; total 50 mV. Con un electrolítico de ESR 0.2 Ω serían 410 mV y reset.`),
      apunte(`Por encima de la frecuencia de resonancia, la impedancia de un capacitor crece con f por el ESL: 2πfL. Por eso un 1 µF no sustituye a un 100 nF en 10–100 MHz.`),
      formula(`ΔV ≈ I·Δt/C + I·ESR    |    f_resonancia = 1/(2π·√(ESL·C))`)
    ]
  },
  'r12-3': {
    why: `Un multímetro promedia; un osciloscopio muestra la historia. Para cazar un brownout necesitas ver los 100 µs previos al reset, con disparo, pre-trigger y una sonda que no cargue el nodo. Sin eso, estás adivinando.`,
    from: `«Desacople y capacitor bulk» predijo la caída; aquí se mide para confirmarla.`,
    to: `La misma instrumentación sirve para las señales digitales: «Ruido en encoders y conteo fiable» usa el analizador lógico sobre A/B.`,
    analogy: `Es la diferencia entre un termómetro que da la temperatura media del día y una cámara térmica que muestra el pico de cada segundo.`,
    extraBlocks: [
      p(`Con 100 MHz de ancho de banda, t_rise ≈ 0.35/100e6 = 3.5 ns. Para una señal útil de 20 MHz hay que muestrear a ≥100 MSa/s (Nyquist ×5 de margen).`),
      apunte(`La punta de masa del osciloscopio está unida a tierra de red: conectarla a un nodo flotante puede cortocircuitar el circuito por el cable de alimentación. Usa sonda diferencial.`),
      aviso(`La sonda 1× (1 MΩ // ~100 pF) carga un nodo de alta impedancia y deforma el flanco que mides. Usa 10× y compénsala antes de cada sesión.`)
    ]
  },
  'r12-4': {
    why: `Un flanco espurio en un encoder es una distancia inventada. Con 1000 PPR y rueda de 65 mm, una cuenta vale 51 µm: diez glitches por segundo suman 0.5 mm/s de deriva mientras el robot está parado. El síntoma aparece justo al arrancar el motor.`,
    from: `«Osciloscopio y analizador lógico» capturó la forma de onda; aquí se interpreta en señales de cuadratura.`,
    to: `El ruido suele venir por la masa compartida: «Masas, bucles de tierra e inmunidad» ataca la causa en vez del síntoma.`,
    analogy: `Es como un sensor de puerta que salta cuando pasa un camión: no es que la puerta se abra, es que la vibración engaña al contacto.`,
    extraBlocks: [
      p(`A 3000 rpm con 1000 PPR y x4, la frecuencia de fase es 1000·4·3000/60 = 200 kHz: cada flanco dura 5 µs. Un filtro software de 20 µs descarta glitches pero come pulsos reales: usa PCNT.`),
      apunte(`La malla del cable de encoder se conecta a tierra en UN solo extremo, el del receptor. Conectarla en ambos crea un bucle de tierra que introduce exactamente el ruido que querías quitar.`),
      formula(`distancia = cuentas·π·D/(PPR·4)    |    f_pulso = PPR·4·rpm/60`)
    ]
  },
  'r12-5': {
    why: `La masa no es un sumidero infinito: es un conductor con resistencia e inductancia. Cuando el retorno del motor pasa por el mismo tramo que la referencia del sensor, aparece una tensión que se suma a la lectura. Eso explica ADCs que «bailan» solo cuando el motor gira.`,
    from: `«Ruido en encoders y conteo fiable» vio cuentas falsas; aquí se explica por qué el cableado compartido las produce.`,
    to: `Con la masa ordenada, «Preventivas: snubbers, TVS y filtros» controla el transitorio en el origen.`,
    analogy: `Es como dos vecinos que comparten un tubo de desagüe: cuando uno vacía la bañera, el agua sube por el desagüe del otro.`,
    extraBlocks: [
      p(`Con 2 A de retorno sobre 0.02 Ω compartidos, V_error = 40 mV. En un ADC de 12 bits y 3.3 V son 40/3.3·4095 ≈ 50 cuentas de error: más que toda la señal de un sensor pequeño.`),
      apunte(`La corriente de retorno busca el camino de menor inductancia, justo debajo de la pista de ida. Si cortas el plano bajo una señal rápida, la corriente rodea la ranura y la zona se vuelve antena.`),
      formula(`V_error = I_ruido·R_compartido + L·dI/dt    |    R = ρ·L/A`)
    ]
  },
  'r12-6': {
    why: `El flyback retarda la extinción del campo y no sirve en señales rápidas: ahí entran snubber, TVS y ferrita. No evitan el transitorio, deciden dónde se disipa su energía; dimensionarlos mal deja un ringing que rompe el aislamiento.`,
    from: `«Masas, bucles de tierra e inmunidad» ordenó el retorno; ahora se ataca el pico en el nodo de conmutación.`,
    to: `Con las preventivas aplicadas, «EMC práctico: emisiones e inmunidad» mira el efecto a nivel de sistema.`,
    analogy: `Es como una válvula de alivio en una caldera: no impide que suba la presión, pero decide por dónde escapa el vapor.`,
    extraBlocks: [
      p(`Con L = 100 nH y C_parásita = 100 pF, R_snub ≈ √(L/C) = 31.6 Ω → 33 Ω. C_snub ≈ 400 pF → 470 pF. A 24 V y 20 kHz, P ≈ 470e-12·576·20.000 ≈ 5.4 mW: sobra una resistencia de 1/4 W.`),
      apunte(`Para un bus de 5 V, elige TVS con V_RWM ≥ 5 V y V_C por debajo del máximo del chip (por ejemplo 9 V frente a 12 V de tolerancia). Si V_RWM es menor, el TVS conduce en reposo y se calienta.`),
      aviso(`Un diodo flyback en paralelo con una bobina va en inverso: ánodo a masa y cátodo al positivo. Al revés es un cortocircuito directo.`)
    ]
  },
  'r12-7': {
    why: `Una placa de 4 cm no irradia eficientemente por debajo de 1 GHz, pero un cable de 25 cm sí: a 300 MHz es λ/4. Casi todos los problemas de EMC en robótica nacen de un cable sin filtrar, no del chip.`,
    from: `«Preventivas: snubbers, TVS y filtros» trataron el componente; aquí se trata el cable como antena.`,
    to: `Con el diseño blindado, «Checklist de banco y registro de fallos» convierte la puesta en marcha en un procedimiento seguro.`,
    analogy: `Es como una radio: el chip es el transistor diminuto, pero la antena es el cable largo; por mucho que bajes la potencia del transistor, la antena sigue emitiendo.`,
    extraBlocks: [
      p(`A 300 MHz, λ = 3e8/3e8 = 1 m y λ/4 = 25 cm. Un cable de motor de 25 cm es, por tanto, una antena casi perfecta en esa frecuencia.`),
      apunte(`El modo común circula en el mismo sentido por todos los conductores y vuelve por masa: su campo no se cancela y es el que suele fallar. Un common-mode choke añade impedancia solo a ese modo.`),
      tabla(['Banda', 'Fuente típica', 'Mitigación'], [
        ['<1 MHz', 'Buck y retorno', 'Bulk, plano de masa'],
        ['1–30 MHz', 'MOSFET', 'Snubber, ferrita'],
        ['30–300 MHz', 'Flancos y cables', 'Serie 22–100 Ω, malla'],
        ['>300 MHz', 'Osciladores', 'Blindaje, choke']
      ])
    ]
  },
  'r12-8': {
    why: `La diferencia entre un hobby y un trabajo profesional es la calidad del registro cuando algo falla. Fuente limitada, continuidad en frío y un informe con fecha, revisión, captura y criterio numérico convierten un misterio en una medición verificable.`,
    from: `«EMC práctico: emisiones e inmunidad» terminó el diseño; ahora se documenta que funciona y por qué.`,
    to: `El registro disciplinado es la puerta al tiempo real: «FreeRTOS: tareas, prioridades y colas» exige la misma precisión pero en el dominio temporal.`,
    analogy: `Es como el cuaderno de un piloto: no sirve para presumir, sirve para que el que viene después sepa exactamente qué pasó en el vuelo anterior.`,
    extraBlocks: [
      p(`Un informe con «VDD mínimo 3.24 V, umbral 3.20 V, captura_07.png, revC» permite a otro repetir la prueba. Uno que dice «funciona bien» no permite nada.`),
      apunte(`Arranca siempre con la fuente limitada a 100 mA. Si entra en limitación, para: un cortocircuito o un electrolítico invertido se paga una sola vez.`),
      nota(`Esta lección y «Validación: 1000 ciclos sin deslizamiento» (r14-8) comparten la misma regla del README: vídeo, esquema, números y qué se rompió.`)
    ]
  },

  // ==================== B13: TIEMPO REAL Y ESTIMACIÓN ====================
  'r13-1': {
    why: `Controlar a 1 kHz y enviar telemetría por WiFi no pueden compartir hilo: la red bloquea y el control no puede esperar. Un RTOS separa ambos en tareas con prioridades y colas, y vTaskDelayUntil mantiene el periodo sin acumular deriva.`,
    from: `«Checklist de banco y registro de fallos» ordenó el hardware; aquí se ordena el tiempo, que es «RTOS y tiempo real» (r3-7) llevado a la práctica.`,
    to: `Con tareas definidas hace falta demostrar que caben: «Deadlines, jitter y planificación» da el test de uso de CPU.`,
    analogy: `Es como un quirófano: el cirujano no puede esperar a que el administrativo termine un formulario; el formulario se hace después, en otra mesa.`,
    extraBlocks: [
      p(`Con WCET de 300 µs y T = 1 ms, la tarea de control usa 30 % del núcleo. vTaskDelay espera desde que termina y acumula el tiempo de ejecución; vTaskDelayUntil espera hasta un instante absoluto y mantiene el ritmo.`),
      apunte(`Con tick de 100 Hz, pdMS_TO_TICKS(1) es 0 o 1 tick: no hay periodo de 1 ms. Sube CONFIG_FREERTOS_HZ a 1000 antes de medir cualquier jitter.`),
      formula(`Uso de CPU = Σ WCET_i/T_i    |    xQueueSendFromISR para ISR → tarea, nunca una global sin proteger`)
    ]
  },
  'r13-2': {
    why: `Un sistema de tiempo real no es rápido, es predecible: importa el peor caso y si llega antes del deadline. Con tres tareas, el límite de Rate Monotonic es 0.78, no 1.0: dejar el 22 % libre no es despilfarro, es margen para interrupciones.`,
    from: `«FreeRTOS: tareas, prioridades y colas» creó las tareas; aquí se comprueba si el conjunto es programable.`,
    to: `El análisis es teórico: «PID con feedforward» mejora la respuesta real adelantando la parte predecible de la orden.`,
    analogy: `Es como organizar un horario de trenes: no basta con que cada trayecto sea corto, hay que probar que ninguno se cruza en la peor hora punta.`,
    extraBlocks: [
      p(`Control 300 µs/1 ms (U=0.30), estimación 1.2 ms/5 ms (U=0.24), telemetría 4 ms/1 s (U=0.004): U total 0.544 < 0.780. Cabe con margen.`),
      apunte(`El jitter se mide con un toggle de GPIO y un analizador: guarda max|medido − teórico|, no la media. Un promedio bonito esconde el peor caso.`),
      formula(`U_RM ≤ n·(2^(1/n) − 1)    →    n=2: 0.828, n=3: 0.780`)
    ]
  },
  'r13-3': {
    why: `El PID corrige el error, pero siempre llega tarde: necesita verlo para reaccionar. El feedforward adelanta gravedad, velocidad y aceleración que ya conoces; con g(q) compensada, Ki puede ser pequeño y no hay windup en el arranque.`,
    from: `«Deadlines, jitter y planificación» garantizó el cuándo; aquí se mejora el qué de la orden de control.`,
    to: `Con el controlador completo, queda sintonizarlo con números: «Filtro de Kalman lineal» afina la medición que alimenta el lazo.`,
    analogy: `Es como empujar un columpio: además de corregir después, sabes que en el punto más alto hay que empujar antes de que baje.`,
    extraBlocks: [
      p(`Brazo de 0.5 kg a 0.30 m: g(q) = 1.47·cos(q) N·m. Sin ese término, el PID necesita error permanente para sostener el brazo; con él, el error estacionario desaparece con Ki pequeño.`),
      apunte(`La derivada filtrada usa α = dt/(dt + τ_f) con τ_f = 3–10 ms. Sin filtro, un salto de 1 cuenta del encoder genera un pico de control que se ve como comezón en el motor.`),
      formula(`u = Kp·e + Ki·∫e dt + Kd·ė + Kv·v_des + Ka·a_des + g(q)`)
    ]
  },
  'r13-4': {
    why: `Kalman mantiene una estimación y su incertidumbre, y calcula la ganancia en cada paso: no es un promedio fijo. Si R no refleja el ruido real del sensor, produces una trayectoria preciosa y sistemáticamente sesgada.`,
    from: `«PID con feedforward» necesita una medición fiable; aquí se construye esa estimación con «Filtro de Kalman» (r5-6) en versión de banco.`,
    to: `El filtro lineal supone modelo lineal: «EKF con IMU» linealiza en cada paso para orientación no lineal.`,
    analogy: `Es como combinar un mapa que sabes que está desactualizado con una señal de GPS que a veces salta: crees más a uno u otro según cuánto fallen habitualmente.`,
    extraBlocks: [
      p(`Encoder con R = 0.01 m² y modelo con Q = 0.005 m²: con P = 0.2, K = 0.952 (casi te crees la medida); tras corregir P ≈ 0.0096 y K ≈ 0.49. La confianza se actualiza sola.`),
      apunte(`Mide R como varianza del sensor en reposo y estima Q por las aceleraciones no modeladas. Si la estimación va retrasada, sube Q; si vibra, sube R.`),
      formula(`K = P⁻/(P⁻+R)    |    x = x⁻ + K·(z − x⁻)    |    P = (1−K)·P⁻`)
    ]
  },
  'r13-5': {
    why: `La orientación es no lineal: el EKF linealiza con el Jacobiano en cada paso y añade el sesgo del giroscopio al estado. Con un sesgo de 0.02 rad/s sin corregir, acumulas 1.15° por segundo aunque el robot esté quieto.`,
    from: `«Filtro de Kalman lineal» daba el ciclo predecir–corregir; aquí se aplica a una IMU con «Deriva del giroscopio y su calibración» (r5-4) como estado estimado.`,
    to: `El filtro ya da el estado; «Sintonización y métricas de respuesta» cierra el lazo con criterios numéricos.`,
    analogy: `Es como corregir un reloj que adelanta: no solo ajustas la hora, sino que estimas cuánto adelanta por hora y lo vas restando.`,
    extraBlocks: [
      p(`Giro a 200 Hz con sesgo 0.02 rad/s: en 10 s el error sin corregir es 0.2 rad ≈ 11.5°. El EKF estima b y lo resta; el ángulo final queda por debajo de 2°.`),
      apunte(`El acelerómetro mide aceleración específica: si el robot acelera en línea recta, el ángulo deducido es falso. Sube R temporalmente cuando |a| se aleje de 9.81 m/s².`),
      formula(`x = [θ, b]ᵀ    |    θ_k = θ_{k−1} + (ω_g − b)·Δt    |    F = [[1, −Δt],[0, 1]]`)
    ]
  },
  'r13-6': {
    why: `Sintonizar es optimizar una métrica, no probar números: primero defines overshoot <5 % y asentamiento <300 ms, y después ajustas. Sin esas cifras, una discusión sobre Kp es solo una opinión.`,
    from: `«EKF con IMU» entregó el estado; aquí se regula la respuesta con «Sintonización y respuesta al escalón» (r8-3) como base.`,
    to: `Incluso bien sintonizado, el lazo puede tener jitter: «Temporización determinista y medición con GPIO» mide cuándo se ejecuta.`,
    analogy: `Es como ajustar una suspensión con un cronómetro y una regla: no dices «más blanda», dices «rebota menos de 5 cm y se asienta en 0.3 s».`,
    extraBlocks: [
      p(`Con Ku = 8 y Tu = 0.4 s, Ziegler–Nichols da Kp = 4.8, Ki = 14.4, Kd = 0.24 y ~25 % de overshoot. Para exigir <5 %, baja Kp un 20 % y añade Kd.`),
      apunte(`Mide el escalón sin saturar el actuador: si el PWM está al 100 %, estás midiendo el límite del driver, no la respuesta del controlador.`),
      formula(`overshoot = 100·(y_max − ref)/ref    |    t_s(2%) = primer instante tras el cual |y−ref| < 0.02·ref`)
    ]
  },
  'r13-7': {
    why: `La temporización determinista es la diferencia entre un controlador que funciona en la mesa y uno que funciona bajo carga. Un pulso de GPIO marca el inicio de cada iteración; sus desviaciones son el jitter real, no el que supones.`,
    from: `«Sintonización y métricas de respuesta» ajustó la ganancia; ahora se verifica que el periodo se cumple.`,
    to: `Con el lazo medido, «Telemetría sin romper el deadline» envía los datos sin arruinar la temporización.`,
    analogy: `Es como el metrónomo de un pianista: si el pulso se retrasa, la pieza se descompone aunque las notas sean correctas.`,
    extraBlocks: [
      p(`Con periodo de 1 ms, un jitter de 100 µs es el 10 %. Un solo ciclo retrasado 5 ms en un brazo en movimiento puede significar un golpe.`),
      apunte(`digitalWrite dentro de la tarea crítica añade varios microsegundos: escribe directo al registro (GPIO.out_wr1ts / wr1tc) para no contaminar la medida.`),
      tabla(['Fuente de jitter', 'Magnitud', 'Solución'], [
        ['vTaskDelay', '100–500 µs', 'vTaskDelayUntil'],
        ['Serial.println', '1–10 ms', 'Tarea de baja prioridad'],
        ['I²C bloqueante', '1–5 ms', 'Timeout corto'],
        ['Context switch', '5–20 µs', 'Fijar a un núcleo']
      ])
    ]
  },
  'r13-8': {
    why: `La telemetría es la ventana al robot, pero un printf en la tarea de control cuesta milisegundos. La solución es producir datos en un ring buffer y dejar que una tarea de baja prioridad los envíe: un robot ciego pero estable es mejor que uno con datos perfectos que se resetea.`,
    from: `«Temporización determinista y medición con GPIO» fijó el pulso; aquí se asegura que los datos no lo desplacen.`,
    to: `Con la instrumentación cerrada, «Requerimientos y desglose de métricas» aplica la misma disciplina numérica al diseño mecánico.`,
    analogy: `Es como un avión con caja negra: graba en un buffer, pero el piloto no se detiene a escribir el informe mientras aterriza.`,
    extraBlocks: [
      p(`A 100 Hz con 24 bytes por trama en UART 8N1: 100·24·10 = 24 kbit/s, lejos de 921600 baud. A 1 kHz con 16 bytes por muestra binaria son 160 kbit/s: aún cabe.`),
      apunte(`Con un productor y un consumidor no hacen falta cerrojos: el productor solo escribe y actualiza escritas, el consumidor solo lee y actualiza leidas. Los locks se pagarían en la ruta crítica.`),
      formula(`bitrate = frecuencia · bytes_por_trama · 10    (8 datos + start + stop)`)
    ]
  },

  // ==================== B14: MECATRÓNICA Y DIMENSIONADO ====================
  'r14-1': {
    why: `«Un brazo que mueva cosas» no es un requisito; «levanta 500 g a 300 mm con flecha <2° durante 1000 ciclos» sí lo es. Sin cifras verificables, elegir motor es una discusión de opiniones y nadie puede decir si el diseño cumple.`,
    from: `«Telemetría sin romper el deadline», «Checklist de banco» (r12-8) y «Métricas de éxito» (r10-12) inculcaron el criterio numérico; ahora se aplica a la mecánica.`,
    to: `La matriz da el par mínimo; «Selección de actuador con margen 1,5×» convierte ese número en un motor concreto.`,
    analogy: `Es como encargar un mueble: no dices «grande y resistente», dices «180 cm, 40 kg de carga, 2 mm de holgura»; el carpintero puede cobrarte por eso.`,
    extraBlocks: [
      p(`REQ-01 (500 g) y REQ-02 (300 mm) dan τ = 0.5·9.81·0.3 = 1.471 N·m. Con margen 1.5×, el diseño exige 2.207 N·m; ese número gobierna la compra del motor.`),
      apunte(`Todo requisito sin método de verificación es una fuente de discusiones futuras. «Rigidez suficiente» falla; «flecha <2° con 500 g a 300 mm, medida con goniómetro» pasa.`),
      tabla(['ID', 'Requisito', 'Verificación'], [
        ['REQ-01', 'Carga 500 g', 'Báscula'],
        ['REQ-03', 'Flecha <2°', 'Goniómetro'],
        ['REQ-04', '1000 ciclos', 'Contador'],
        ['REQ-05', '0 deslizamientos', 'Marcas en el eje']
      ])
    ]
  },
  'r14-2': {
    why: `Un motor que alcanza justo el par teórico falla en cuanto el cable calienta o la batería baja. El margen de 1.5× cubre incertidumbre de modelo, desgaste y temperatura, y hay que comprobar par continuo y curva par–velocidad, no el pico de parada.`,
    from: `«Requerimientos y desglose de métricas» dio 2.207 N·m; aquí se busca un actuador que los cumpla de forma sostenida.`,
    to: `Elegido el motor, «Engranajes, reducción y backlash» decide cómo adaptar su par y velocidad al eje.`,
    analogy: `Es como comprar una furgoneta por su carga máxima momentánea: si el motor aguanta 3 N·m solo 2 s, no sirve para 1000 ciclos.`,
    extraBlocks: [
      p(`Con 90° en 0.5 s, ω = (π/2)/0.5 = 3.14 rad/s. P_mec = 1.471·3.14 ≈ 4.62 W; con η = 0.7 el motor debe entregar ≈6.6 W además de los 2.21 N·m.`),
      apunte(`El par de parada es un pico transitorio: I_stall = V/Ra. El par continuo y su curva de velocidad son los que dimensionan el trabajo real y la temperatura.`),
      formula(`τ_diseño = 1.5 · m·g·r · factor_dinámico    |    P = τ·ω / η`)
    ]
  },
  'r14-3': {
    why: `La reducción multiplica par pero también juego y refleja inercia al motor por N². Elegir 100:1 para ganar fuerza puede convertir el brazo en un sistema blando e imposible de controlar con precisión.`,
    from: `«Selección de actuador con margen 1,5×» fijó el motor; aquí se decide cuántas vueltas suyas dan una de salida.`,
    to: `La correa dentada es una alternativa al engranaje: «Correas dentadas y pretensado» la dimensiona.`,
    analogy: `Es una bicicleta con marchas: subes la fuerza en la rueda, pero también aumentas el juego de la cadena y el esfuerzo al pedalar de golpe.`,
    extraBlocks: [
      p(`Motor de 0.08 N·m con N = 30 y dos etapas de η = 0.9: τ_out = 0.08·30·0.81 = 1.94 N·m (no llega). Con N = 40 da 2.59 N·m: cumple los 2.21 N·m.`),
      apunte(`El juego de 1° en la entrada se divide por N en la salida: con 40:1 son 0.025°. En cambio la inercia de la carga se divide por N²: más reducción aligera al motor pero añade rozamiento.`),
      formula(`τ_out = η·N·τ_m    |    ω_out = ω_m/N    |    J_reflejada = J_carga/N²`)
    ]
  },
  'r14-4': {
    why: `La correa dentada es silenciosa y casi sin juego, siempre que esté bien tensada: poco pretensado salta dientes, mucho calienta los rodamientos. El radio de la polea se calcula, no se supone, porque una diferencia de 3× cambia la fuerza transmitida.`,
    from: `«Engranajes, reducción y backlash» planteó la alternativa; aquí se dimensiona la transmisión por correa.`,
    to: `Con la transmisión definida, «CAD paramétrico y diseño para fabricar» convierte las cotas en piezas.`,
    analogy: `Es como la cadena de una bicicleta: floja salta, demasiado tensa desgasta los piñones; el punto correcto se mide con el dedo a mitad de vano.`,
    extraBlocks: [
      p(`Polea GT2 de 20 dientes con paso 2 mm: circunferencia 40 mm → r ≈ 6.4 mm, no 20 mm. Con τ = 1.47 N·m, F_tangencial = 1.47/0.0064 ≈ 230 N; con r = 20 mm serían solo 73.5 N.`),
      apunte(`El pretensado recomendado es ~15 % de la resistencia a la rotura: 400 N → 60 N. La desviación a mitad de vano debe ser 2–3 mm: la regla del pulgar.`),
      aviso(`Una correa demasiado tensa dobla el eje del motor y destruye el rodamiento en pocos ciclos. Respeta la carga radial del datasheet.`)
    ]
  },
  'r14-5': {
    why: `Un modelo paramétrico es un conjunto de relaciones: si cambias la carga de 500 a 800 g, el espesor debe recalcularse solo. Hacerlo a mano es dibujar, no diseñar, y el error aparece cuando alguien cambia una cota sin avisar.`,
    from: `«Correas dentadas y pretensado» cerró la transmisión; aquí se modelan las piezas que la soportan.`,
    to: `Las cotas nominales no bastan: «Tolerancias y cadenas dimensionales» decide cuánto se pueden apartar en fabricación.`,
    analogy: `Es como una hoja de cálculo frente a un dibujo a mano: cambias la carga en una celda y el espesor se actualiza; en el papel tienes que borrar todo.`,
    extraBlocks: [
      p(`Con I_req = 1.2e-9 m⁴ y ancho b = 0.020 m, espesor h = (12·I/b)^(1/3) ≈ (7.2e-7)^(1/3) ≈ 9 mm. Si I se duplica, h crece ×2^(1/3) ≈ 1.26, no ×2.`),
      apunte(`Antes de fabricar pregúntate: ¿puedo sujetar la pieza?, ¿hay taladros cerca del borde?, ¿esquinas internas sin radio? Una esquina viva es imposible de fresar con fresa cilíndrica.`),
      tabla(['Entregable', 'Formato', 'Para qué'], [
        ['Modelo', 'FCStd / SLDPRT', 'Modificaciones futuras'],
        ['Pieza neutra', 'STEP', 'Taller'],
        ['Impresión', '3MF', 'Slicer'],
        ['Plano', 'PDF / DXF', 'Cotas y tolerancias']
      ])
    ]
  },
  'r14-6': {
    why: `Tres piezas con ±0.1 mm no suman ±0.1 mm: en el peor caso suman ±0.3 mm. Diseñar sin cadena de tolerancias es confiar en que los errores se cancelen, y eso falla justo en la última pieza de la serie.`,
    from: `«CAD paramétrico y diseño para fabricar» dio las cotas nominales; aquí se decide su dispersión aceptable.`,
    to: `La tolerancia elegida debe verificarse con rigidez: «Rigidez, flecha y selección de sección» comprueba que la pieza no se deforma bajo carga.`,
    analogy: `Es como apilar tres hojas de papel con un recorte cada una: si cada una se desvía 1 mm, al final el dibujo está 3 mm fuera.`,
    extraBlocks: [
      p(`Tres cotas de ±0.1 mm: peor caso ±0.3 mm, RSS √(0.01·3) = ±0.173 mm. Si la holgura requisito es 0.2 mm, el peor caso la rechaza y el RSS la acepta: hay que decidir método.`),
      apunte(`RSS asume errores independientes; el peor caso es siempre válido. En piezas impresas, mide la holgura real con una galga antes de elegir 0.2 o 0.4 mm.`),
      formula(`Peor caso: T_total = ΣT_i    |    RSS: T_total = √(ΣT_i²)`)
    ]
  },
  'r14-7': {
    why: `La flecha depende de E y del momento de inercia I, que crece con el cubo del espesor. Bajar h de 10 a 3 mm multiplica la flecha ~37 veces: la pieza no se rompe, pero la punta se desvía 4° y el requisito falla.`,
    from: `«Tolerancias y cadenas dimensionales» fijó la geometría fabricable; aquí se comprueba que esa geometría es suficientemente rígida.`,
    to: `Con el dimensionado completo, «Validación: 1000 ciclos sin deslizamiento» demuestra que todo aguanta en la vida real.`,
    analogy: `Es como una estantería: no se rompe, pero se comba en el centro; meter un tablero más grueso por arriba y abajo da casi la misma rigidez con menos peso que un bloque macizo.`,
    extraBlocks: [
      p(`Aluminio E = 69 GPa, F = 4.905 N, L = 0.30 m, b = 20 mm, h = 10 mm: I = 1.67e-9 m⁴, θ ≈ 0.11°. Con h = 3 mm, I cae ~37× y θ ≈ 4.1°: fuera del límite de 2°.`),
      apunte(`La rigidez crece con h³, así que conviene aumentar la altura de la sección en la dirección de la carga y vaciar el centro. Un tubo da casi la misma I que una barra maciza con mucha menos masa.`),
      formula(`δ = F·L³/(3·E·I)    |    θ = F·L²/(2·E·I)    |    I = b·h³/12`)
    ]
  },
  'r14-8': {
    why: `La validación no es ver que se mueve: es demostrar con números y de forma reproducible que cada requisito se cumple. 1000 ciclos con la carga real detectan aflojamientos y desgaste que una prueba de diez minutos nunca mostrará.`,
    from: `«Rigidez, flecha y selección de sección» cerró el dimensionado; «Requerimientos y desglose de métricas» (r14-1) pone los criterios que aquí se verifican.`,
    to: `La pregunta que queda es cómo sostener este rigor cuando la especificación cambie: el bucle de «Cómo seguir aprendiendo» (r11-11) y una nueva matriz de requisitos (r14-1) reinician el ciclo.`,
    analogy: `Es como probar una maleta en un viaje real en vez de en la tienda: el asa aguanta diez levantamientos, pero la costura falla en el viaje número quinientos.`,
    extraBlocks: [
      p(`Criterio binario: ciclos ≥ 1000, θ medido 0.18° < 2°, I_pico < 3 A, marcas alineadas. Con esos cuatro números, otro puede repetir y confirmar o refutar el resultado.`),
      apunte(`Inspecciona cada 100 ciclos, no solo al final: un tornillo que no se mueve en 10 puede girar 2° en 500, y detenerte entonces conserva la evidencia del fallo original.`),
      aviso(`Detén el ensayo ante el primer deslizamiento o temperatura anómala: seguir acumula daño y destruye la causa del fallo.`)
    ]
  }
};
