import type { LessonBridge } from '../../../types';
import { p, h, aviso, diagrama, tabla, lista, pasos, widget } from '../../helpers';

/**
 * Profundización académica de las dos últimas lecciones del bloque de
 * electrónica (r1-8 y r1-9). Se integra con el contenido divulgativo de
 * part1.ts: aquí se convierte el «saber qué es» en «saber hacerlo sin quemar
 * nada», con números verificables y criterios de decisión para el banco.
 */
export const electronicsLessonDeep: Record<string, LessonBridge> = {

  'r1-8': {
    why: `Un esquemático no guarda las coordenadas de ninguna pieza: guarda la topología, es decir, qué nodo se une a qué nodo. Quien no domina ese lenguaje se queda copiando cableados de fotografías que nadie puede verificar y acaba montando un circuito que «parece» el de internet pero no funciona. Y un datasheet de 200 páginas no está escrito para leerse de principio a fin, sino para consultarse: saber ir en dos minutos a la sección correcta es la diferencia entre elegir un regulador con margen y descubrir en el banco que el sensor solo tolera 3.6 V. Esta lección convierte dos documentos intimidatorios en herramientas de decisión rápida.`,
    from: `«Fuentes, reguladores y baterías LiPo» terminó planteando qué componente elegir y con qué margen de corriente. La respuesta definitiva no está en un tutorial, sino en el datasheet del fabricante, y el plano donde se concreta esa elección es el esquemático.`,
    to: `Con el mapa leído queda ejecutarlo: «El banco: multímetro, protoboard y soldadura» convierte cada símbolo en una unión física y cada red en un cable comprobado con el instrumento. Sin esta lección, el banco se convierte en adivinanzas; con ella, cada medida tiene un nodo esperado contra el que compararla.`,
    analogy: `Leer un esquemático es como leer el plano de una instalación de fontanería o el mapa del metro: no te dice dónde poner el grifo en la pared ni en qué esquina está la estación, pero sí qué tubería llega a cada desagüe y qué línea conecta cada parada. La posición física la decide el instalador; la conectividad la decide el plano.`,
    extraBlocks: [
      h('1. El esquemático es un grafo, no un plano de situaciones'),

      p(`Un esquemático es un grafo eléctrico dibujado con símbolos normalizados: los componentes son los vértices y los conductores son las aristas. Lo único que afirma con rigor es que ciertos terminales comparten el mismo potencial eléctrico. Un nodo es un punto de unión eléctrica y una red (net, en inglés) es el conjunto de todos los conductores unidos a ese nodo, aunque aparezcan dibujados en cuatro rincones distintos del papel. Por eso un cable que cruza otro sin punto no establece contacto: el cruce es un cruce de puentes, no una soldadura. Y por eso el símbolo de masa repetido doce veces representa una sola red, la referencia de 0 V, aunque los doce símbolos estén separados por centímetros de dibujo. La consecuencia práctica es importante: el esquemático no dice que U1 esté a la izquierda de R3 ni que el pin 1 esté arriba en la placa. Decide la conectividad, no la colocación; la colocación la fijarán después el diseño de la PCB, el chasis y la mecánica. Confundir ambas cosas es el origen de media docena de errores de montaje que veremos al final de esta lección.`),

      diagrama('esquematico', `Del símbolo al montaje: el mismo nodo puede dibujarse en varios sitios con una etiqueta, y un cruce sin punto no es una unión.`),

      tabla(['Símbolo', 'Qué representa', 'Qué debes mirar siempre'], [
        ['R', 'Resistor', 'Valor en ohmios, tolerancia y potencia (1/4 W, 1/2 W)'],
        ['C', 'Capacitor', 'Capacidad, tensión de trabajo y si es polarizado'],
        ['L', 'Bobina o inductor', 'Inductancia y corriente de saturación'],
        ['D', 'Diodo', 'Vf y corriente directa; la barra marca el cátodo'],
        ['LED', 'Diodo emisor de luz', 'Vf, corriente y resistencia limitadora asociada'],
        ['Q', 'Transistor o MOSFET', 'Tipo NPN/PNP o N/P y pinout B-C-E o G-D-S'],
        ['U (o IC)', 'Circuito integrado', 'Referencia al datasheet y número de pin'],
        ['Y', 'Cristal o resonador', 'Frecuencia y capacitancia de carga de los C asociados'],
        ['GND', 'Referencia de 0 V', 'Que todos los símbolos de masa son la misma red'],
        ['Vcc, +3V3, +5V', 'Alimentación', 'Valor exacto y que no se confunda con una señal'],
        ['~, barra sobre nombre, /', 'Señal invertida, PWM o activo a nivel bajo', 'El contexto: /RESET activa a 0, una tilde sobre el nombre es lógica invertida'],
        ['S, J, TP, F', 'Interruptor, conector, punto de prueba, fusible', 'Qué se espera medir en ese punto y su corriente']
      ]),

      p(`Cada símbolo lleva un designador de referencia formado por una letra de clase y un número de instancia: R1 es el primer resistor, C3 el tercer capacitor, U2 el segundo circuito integrado y D4 el cuarto diodo. El número no indica el orden físico ni la importancia: solo identifica de forma única ese componente dentro del proyecto. Si un integrado contiene cuatro compuertas, el esquemático las nombra U1A, U1B, U1C y U1D para recordar que comparten encapsulado, y el datasheet dirá cuál de esas compuertas corresponde a cada pin. Junto al designador aparece el valor: 10 kΩ, 100 nF, 47 µF/16 V, 1N4148, LM358. Esos cuatro datos —clase, instancia, valor y, si aplica, tensión o potencia— son los que se repetirán en la lista de materiales (BOM, bill of materials) y en la serigrafía de la placa, de modo que designador, BOM y placa deben coincidir uno a uno. La tolerancia merece atención: un resistor de ±5 % de la serie E12 (10, 12, 15, 18, 22, 33, 39, 47, 56, 68, 82) sirve para limitar un LED, pero un divisor de tensión que alimenta un ADC necesita ±1 % de la serie E96 para no regalar precisión. Los capacitadores suelen traer ±20 % por defecto y una tensión de trabajo que debe superar con margen la alimentación: un 10 µF/6.3 V en un rail de 5 V está pidiendo fallar en cuanto el regulador se pase por encima. Y las equivalencias de marcaje —103 son 10 nF, 104 son 100 nF, 222 son 2.2 nF— evitan pedir el componente equivocado.`),

      diagrama('esquematico', `Símbolos y designadores: la letra dice la clase (R, C, L, D, Q, U) y el número identifica la instancia; todos los símbolos de masa son la misma red.`),

      widget('bom'),

      h('2. Leer en orden: de izquierda a derecha y de arriba abajo'),

      p(`Un esquemático se lee como se lee un texto: en Occidente, de izquierda a derecha y de arriba abajo, siguiendo el flujo de la energía y de la información. Arriba suelen dibujarse los railes de alimentación y abajo la masa; a la izquierda entran los conectores y sensores, en el centro está el integrado que piensa, y a la derecha salen las cargas o las señales hacia el microcontrolador. Esa convención no es una ley física, pero es tan universal que cualquier desviación merece una nota. El método de lectura conviene ejecutarlo siempre en el mismo orden para no omitir nada: primero localiza los railes y anota sus voltajes; después identifica el componente activo principal y consulta su pinout; luego recorre las señales desde la entrada hasta la salida; y finalmente verifica los caminos de retorno y el desacople. Seguir este orden convierte una hoja llena de símbolos en una lista de comprobaciones.`),

      pasos([
        { title: 'Localiza los railes de alimentación', text: `Busca Vcc, +3V3, +5V o VBAT arriba y GND abajo. Anota cada tensión: un +3V3 alimenta el sensor, un +5V el servo y un VBAT el motor. Si un rail no tiene valor escrito, busca la etiqueta global en otra hoja.` },
        { title: 'Encuentra el componente activo', text: `Normalmente es U1: un microcontrolador, un sensor o un driver. Lee su referencia y ve al datasheet para saber qué hace cada pin. Sin este paso, un pin llamado INT podría confundirse con una alimentación.` },
        { title: 'Sigue la señal de entrada', text: `Desde el conector de la izquierda, recorre el cable hasta el primer elemento: una resistencia pull-up, un filtro RC, un diodo de protección. Apunta el valor de cada uno; ese es el acondicionamiento de la señal.` },
        { title: 'Recorre la ruta hasta el integrado', text: `En cada pin del chip pregunta de dónde viene y hacia dónde va la línea. Marca los pines sin conectar (con una cruz o NC) y los que llevan una etiqueta de red en lugar de un cable dibujado.` },
        { title: 'Comprueba el desacople', text: `Busca un capacitor de 100 nF a 1 o 2 mm de cada pin de alimentación de cada integrado, más un bulk de 10 a 470 µF cerca del regulador o del driver. Si no está, el robot se reseteará al arrancar un motor.` },
        { title: 'Verifica los retornos a masa', text: `Toda corriente que sale de un rail debe volver a él. Sigue cada rama hasta un símbolo de GND y confirma que pertenece a la misma red; en sistemas con motor y lógica se suelen unir en un único punto (star ground) para evitar que el pico del motor se cuele en la masa del ADC.` },
        { title: 'Contrasta con la lista de materiales', text: `Cuenta los designadores del plano y compáralos con el BOM. Si el esquemático tiene tres resistencias y la lista cuatro, hay un componente sin colocar o una referencia duplicada. Este paso evita el clásico «sobra una pieza en la bolsa».` }
      ]),

      p(`Dentro de esa lectura, los nodos y las redes merecen un párrafo propio. Un punto relleno en la intersección de dos conductores significa unión eléctrica; cuatro líneas que se cruzan sin punto son cuatro conductores que se ignoran, y un pequeño arco en forma de puente es la forma antigua de indicar exactamente lo mismo. Una red se etiqueta con un nombre —SDA, SCL, +3V3, RESET_N— y esa etiqueta la hace equipotencial en todo el dibujo: medir SDA en el sensor y medir SDA en el microcontrolador debe dar el mismo voltaje, salvo la caída minúscula del cable. Las etiquetas locales solo valen dentro de una hoja; las globales cruzan hojas. Los buses se dibujan como una línea gruesa con una barra y un número, por ejemplo 8 para un bus de datos de ocho bits, y cada conducto del bus hereda ese nombre con un sufijo. Entender esto tiene una consecuencia directa en el banco: cuando el multímetro —lo veremos en la próxima lección— no da la tensión esperada en un pin, el fallo no está «en el cable de al lado», sino en algún punto de esa red, y hay que recorrerla completa antes de culpar al chip.`),

      h('3. Cómo exprimir un datasheet de 200 páginas en 2 minutos'),

      pasos([
        { title: 'Ctrl+F: Absolute Maximum Ratings', text: `Es el primer alto. Aquí el fabricante dice qué valor destruye el dispositivo: tensión de alimentación, tensión en cualquier pin, corriente por pin y temperatura de unión. Escribe los números en tu cuaderno y subraya que son límites de supervivencia, no de funcionamiento.` },
        { title: 'Ctrl+F: Recommended Operating Conditions', text: `Es el rango donde el fabricante garantiza que el chip cumple sus especificaciones. Si la alimentación recomendada es de 2.8 a 3.3 V y tu rail es de 3.3 V ±2 %, estás en el límite: un pico de 3.4 V ya no está garantizado aunque no destruya el chip.` },
        { title: 'Ctrl+F: Pin Configuration o Pinout', text: `Localiza el dibujo del encapsulado con la numeración de pines y la pequeña muesca o punto que identifica el pin 1. Comprueba que el símbolo del esquemático usa los mismos números: un pin 4 en el plano debe ser el pin 4 físico.` },
        { title: 'Ctrl+F: Typical Application o Application Circuit', text: `Es el esquema que el fabricante garantiza que funciona con los valores que pone. Copia su topología y sus capacitor de desacople, resistencias pull-up y valores de cristal; después ajusta si hace falta, pero no inventes partiendo de cero.` },
        { title: 'Ctrl+F: Package u Ordering Information', text: `El mismo chip se vende en DIP, SOT-23, QFN o TSSOP, y cada uno tiene un sufijo distinto en la referencia de pedido. Confirmar el encapsulado aquí evita recibir un componente que no cabe en tu protoboard ni en la huella de la placa.` }
      ]),

      tabla(['Sección', 'Pregunta que responde', 'Trampa típica'], [
        ['Absolute Maximum Ratings', '¿Qué lo destruye?', 'Diseñar en este límite creyendo que funciona'],
        ['Recommended Operating Conditions', '¿Dónde se garantiza el funcionamiento?', 'Ignorar la tolerancia de tu propia fuente'],
        ['Electrical Characteristics', '¿Qué tensión, corriente o tiempo esperar?', 'Leer solo la columna Typical y olvidar Min y Max'],
        ['Pin Configuration and Functions', '¿Qué hace cada pin y dónde está el pin 1?', 'Contar pines desde el lado equivocado del chip'],
        ['Typical Application Circuit', '¿Cómo se conecta de forma probada?', 'Copiarlo sin adaptar la tensión de tu sistema'],
        ['Package Information', '¿Qué huella y qué referencia pedir?', 'Confundir la variante comercial con la industrial'],
        ['Revision History', '¿Qué cambió respecto a la versión que conocía?', 'Usar un error corregido en una revisión antigua']
      ]),

      aviso(`Absolute Maximum Ratings y Recommended Operating Conditions no son intercambiables. Un sensor puede tener un máximo absoluto de 4 V y un funcionamiento garantizado solo hasta 3.6 V: alimentarlo a 3.3 V es correcto, alimentarlo a 3.9 V «no lo quema» pero tampoco cumple especificación, y alimentarlo a 4.3 V lo destruye. La frase que aparece en letra pequeña —stresses beyond those listed may cause permanent damage— no es una advertencia retórica: la unión de silicio no se regenera.`),

      h('4. Tres ejemplos guiados: tensión, protocolo, pines y montaje'),

      pasos([
        { title: 'Ejemplo 1: VL53L0X, medidor de distancia ToF', text: `Ctrl+F «Supply voltage»: el rango recomendado está alrededor de 2.8 a 3.3 V, así que jamás se alimenta directamente de un rail de 5 V. Ctrl+F «I2C»: habla a 400 kHz y su dirección por defecto es 0x29. Ctrl+F «Pin description»: VIN, GND, SDA, SCL, XSHUT y GPIO1. En el esquemático, XSHUT lleva una resistencia pull-up a VIN y GPIO1 se deja al aire o se usa como indicador de medición lista. Ctrl+F «Application»: el fabricante exige un capacitor de 100 nF junto a VIN y, si el módulo no los trae, resistencias pull-up de 2.2 kΩ en SDA y SCL. Con un microcontrolador de 5 V hace falta un adaptador de nivel en esos dos líneas, no solo en la alimentación.` },
        { title: 'Ejemplo 2: MPU6050, acelerómetro y giroscopio', text: `El chip se alimenta a 3.3 V en VDD y VDDIO; la placa GY-521 añade un regulador que acepta 5 V en VCC, pero los niveles lógicos de SDA y SCL siguen siendo de 3.3 V y conviene adaptarlos. Ctrl+F «AD0»: ese pin elige la dirección I²C, 0x68 si está a masa y 0x69 si está a VDDIO; por eso en el esquemático aparece una resistencia de 10 kΩ a GND y un puente soldable para cambiarla. Ctrl+F «INT»: la salida de interrupción avisa de datos listos y se conecta a un pin de entrada del micro con su propia pull-up. El circuito típico añade 100 nF entre VDD y GND y 10 nF entre VDDIO y GND, separados como indica el datasheet.` },
        { title: 'Ejemplo 3: DS18B20, termómetro de un solo hilo', text: `Ctrl+F «Supply Voltage»: admite de 3.0 a 5.5 V, lo que permite alimentarlo directamente del rail de 3.3 V o de 5 V sin adaptadores. Ctrl+F «Pin Assignment»: GND, DQ (datos) y VDD; en el encapsulado TO-92 el orden de los pines visto de frente es el que manda, y confundir DQ con VDD es un error clásico. Ctrl+F «Pull-up resistor»: la línea DQ necesita una resistencia de 4.7 kΩ a VCC; sin ella el bus nunca sube a nivel alto y el micro lee una línea muerta. La modalidad de alimentación parásita permite prescindir de VDD tomando energía del propio bus, pero solo si el código respeta los tiempos de un pull-up fuerte; para un primer montaje, usa siempre las tres patillas.` }
      ]),

      h('5. Del esquemático a la protoboard (y al revés)'),

      p(`Pasar del papel a la protoboard no es copiar la forma del dibujo, sino reconstruir cada red. El procedimiento inverso —de la protoboard al esquemático— es igual de importante cuando te encuentras un montaje ajeno y tienes que documentarlo. En ambos casos la unidad de trabajo es la red, no el componente.`),

      pasos([
        { title: 'Enumera las redes', text: `Antes de insertar nada, escribe una lista con cada red: +3V3, GND, SDA, SCL, salida del sensor. Decide qué fila de la protoboard representará cada una y márcala con un trozo de cinta.` },
        { title: 'Coloca los integrados cruzando el surco central', text: `El cuerpo del chip se apoya sobre la ranura y sus patillas quedan en filas distintas a cada lado. Así cada pin tiene su propia fila y no se puentea con el de enfrente.` },
        { title: 'Alterna alimentación y masa en cada chip', text: `En seriales y sensores, coloca los pines de VCC y GND en filas opuestas y llévalos a los railes laterales con cables cortos. Añade el capacitor de 100 nF exactamente entre esas dos filas.` },
        { title: 'Monta los componentes discretos en su red', text: `Cada resistor, capacitor o diodo del esquemático ocupa su propia fila o cruza dos filas distintas si es un elemento en serie. Resiste la tentación de ahorrar filas acortando patillas: el corto mal medido es un puente invisible.` },
        { title: 'Cablea red por red, no componente por componente', text: `Toma una red de la lista y une todos sus puntos; después marca la red como terminada. Cablear por componentes deja siempre algún extremo olvidado.` },
        { title: 'Verifica con continuidad antes de alimentar', text: `Con la fuente desconectada, comprueba que VCC y GND no se tocan y que cada pin del integrado llega a su red. Solo entonces enciendes. Para el camino inverso, haz lo mismo pero anotando en un papel cada fila y convirtiéndola en etiqueta de red.` }
      ]),

      lista([
        `Conectar Vcc a GND: es el error más caro. Si el esquemático tiene un +5V que cruza una masa, comprueba si hay punto de unión; un capacitor polarizado al revés o un regulador con las patillas invertidas produce el mismo cortocircuito y humo enseguida.`,
        `Confundir el pin 1: los integrados llevan una muesca, un punto o un bisel en un extremo. Contar pines desde el lado equivocado invierte el pinout completo; en un regulador SOT-223, por ejemplo, cambia GND por Vout.`,
        `Creer que el símbolo representa la posición física: en el esquemático el pin de alimentación suele dibujarse arriba y la masa abajo, pero en la placa pueden estar en cualquier lado. Guíate siempre por el número de pin y por el dibujo del encapsulado del datasheet.`,
        `Dar por supuesto que un cruce de líneas es una unión: sin punto no hay contacto. Al revés, dos tramos separados con la misma etiqueta de red sí están unidos aunque no se toquen en el dibujo.`,
        `Ignorar los pines NC o sin conectar: dejar al aire un pin de configuración puede fijar una dirección I²C distinta o activar un modo de prueba; comprueba qué dice el datasheet de cada pin sin usar.`,
        `Pedir el encapsulado equivocado: el mismo chip en DIP y en QFN tiene el mismo nombre funcional pero huellas incompatibles. Confirma el sufijo de pedido antes de cerrar la lista de materiales.`
      ], false)
    ]
  },

  'r1-9': {
    why: `En robótica un cable suelto no deja log, una soldadura fría no lanza excepción y una batería descargada se manifiesta como un «bug de software». El multímetro y una unión bien hecha son los únicos instrumentos que convierten una sospecha en una medida. Saber qué significa OL, por qué la corriente se mide en serie y cómo se funde el fusible del aparato evita la tarde perdida y, en el caso de una LiPo o de una fuente, evita un incidente.`,
    from: `«Leer esquemáticos y datasheets» entregó el mapa con cada nodo y su tensión esperada. Aquí se aprende a comprobar que el montaje coincide con ese mapa y a reparar lo que no coincide.`,
    to: `Con la electrónica bajo control, el bloque siguiente cambia de herramienta: «Python para robótica» introduce el lenguaje que leerá esos sensores y convertirá las medidas en decisiones. El banco queda como el lugar donde se verifica, una y otra vez, que el código mueve lo que debe mover.`,
    analogy: `Una unión fría es como un tornillo puesto a mano sin apretar: aguanta en el taller, pero en cuanto el robot vibra falla justo cuando nadie está mirando. Y medir corriente en paralelo es como abrir una compuerta de golpe en una tubería a presión: el agua sale por donde no debía y el fusible es la trampilla que revienta para salvar la bomba.`,
    extraBlocks: [
      h('1. El multímetro: cuatro imprescindibles, siete en total, y una regla de oro'),

      p(`Un multímetro digital (DMM) es un voltímetro, un amperímetro y un ohmímetro en un mismo aparato, con una resolución típica de 3½ dígitos, es decir 2000 cuentas. En modo tensión su impedancia de entrada es de unos 10 MΩ, lo bastante alta para no cargar un circuito de señal; en modo corriente, en cambio, inserta una resistencia interna pequeña (shunt) que produce una caída de tensión llamada burden voltage, de 100 a 200 mV a plena escala en el jack de mA y mucho menor en el de 10 A; esa caída se resta de tu rail y puede desplazar una medida sensible. Esa diferencia explica la regla de oro del banco: el voltímetro se conecta en paralelo, el amperímetro en serie, y confundirlos tiene consecuencias. De los siete modos, cuatro son imprescindibles —V DC, resistencia, continuidad y corriente— y los otros tres —V AC, diodo y capacitancia— completan el total; cuando alguien habla de «los cuatro modos», se refiere a esos imprescindibles. Antes de medir, haz siempre el mismo gesto: comprueba en qué jack está enchufada la sonda roja y qué posición ocupa el dial. El hábito de mirar dos veces antes de tocar el circuito ahorra más placas que cualquier conocimiento teórico.`),

      diagrama('multimetro', `Cuatro imprescindibles, siete en total: los modos del multímetro y la posición correcta de las sondas en cada uno.`),

      tabla(['Modo', 'Qué mide', 'Cómo se conecta', 'Lectura sana / lectura sospechosa'], [
        ['V DC', 'Tensión continua', 'En paralelo, rojo a + y negro a GND', '3.28 V en un rail de 3V3; 0 V si el rail está caído'],
        ['V AC', 'Tensión alterna en valor eficaz (RMS)', 'En paralelo, sin importar polaridad', '230 V en la red; valores absurdos si el modo es DC'],
        ['Ω', 'Resistencia', 'En paralelo y con el circuito SIN alimentar', '10.1 kΩ en una de 10 kΩ ±1 %; OL si está abierta'],
        ['Continuidad', 'Resistencia muy baja con zumbador', 'En paralelo y sin alimentar', 'Beep si hay unión; silencio si el cable está cortado'],
        ['Corriente (A, mA)', 'Circulación de carga', 'EN SERIE, cortando el circuito', '0.02 A en un LED; cortocircuito si se pone en paralelo'],
        ['Diodo', 'Caída directa Vf en voltios', 'Rojo al ánodo, negro al cátodo', '0.6 V en silicio, 1.8 a 3 V en LED; 0.00 si está en corto'],
        ['Capacitancia', 'Capacidad en F, µF, nF', 'En paralelo, capacitor descargado y aislado', '98 nF en uno de 100 nF; OL si está abierto']
      ]),

      diagrama('multimetro_medidas', `Tensión y resistencia en paralelo; corriente en serie cortando la rama. El fusible protege solo el jack de mA, no el de 10 A en muchos modelos.`),

      p(`Dos símbolos del display concentran la mitad de las dudas del principiante. OL significa over limit o circuito abierto: en modo resistencia indica que no hay camino conductor entre las sondas, que es exactamente lo que debe pasar al medir un cable cortado o un fusible fundido; en modo tensión significa que el valor supera el rango elegido y hay que subir de escala. En modo diodo, OL en los dos sentidos indica un diodo abierto. En el otro extremo, 0.00 significa una resistencia prácticamente nula: en continuidad es la unión buscada, pero en modo diodo en ambos sentidos indica un diodo en cortocircuito, y al medir un capacitor puede ser simplemente que aún no ha cargado. Entre ambos extremos está la lectura engañosa: una resistencia de 10 kΩ medida «en circuito» puede dar 8 kΩ porque otra rama de 40 kΩ está en paralelo. Levanta un extremo del componente antes de fiarte de su valor, y recuerda que las propias sondas suman alrededor de 0.2 Ω en continuidad: réstalos antes de culpar a una soldadura.`),

      aviso(`Cómo fundes el fusible y cómo no fundirlo: se funde al poner el multímetro en modo corriente y conectarlo en paralelo entre Vcc y GND, porque el amperímetro es casi un cortocircuito; también al dejar las sondas en los jacks de corriente y medir tensión, o al superar el límite de 10 A en un jack que a menudo no tiene fusible. Para evitarlo: mueve la sonda roja al jack de A solo en el momento de medir corriente y devuélvela al de V justo después; empieza siempre por la escala más alta y baja; para corrientes grandes o desconocidas usa una pinza amperimétrica o una resistencia shunt; y nunca conectes el modo corriente directamente a una fuente. El fusible es un consumible barato, pero la sustitución debe ser del mismo valor y tipo, nunca un trozo de papel de aluminio.`),

      h('2. La protoboard por dentro'),

      p(`La protoboard es una matriz de contactos elásticos debajo de unos agujeros. En la zona central, cada grupo de cinco agujeros alineados en una fila está unido eléctricamente: si insertas dos patillas en la misma fila, quedan conectadas sin soldadura. El surco central que recorre la placa a lo largo separa dos bloques de filas y está calculado para que el cuerpo de un integrado DIP se apoye sobre él, dejando sus patillas a cada lado en filas distintas. A los lados corren los railes de alimentación, columnas verticales de contactos unidos en toda su longitud, normalmente con una interrupción en la mitad: conviene comprobar con continuidad si tu modelo tiene el rail partido antes de dar por hecho que el +5V de arriba llega hasta abajo. La protoboard no es un circuito ideal: los contactos tienen una resistencia de decenas de miliohmios que crece con el uso, los railes delgados no toleran más de un par de amperios y las conexiones sueltas aparecen como fallos intermitentes que ningún simulador predice. Por eso es una herramienta de prototipado, no de producto: sirve para validar el esquemático, no para dejar el robot funcionando en una carrera con vibraciones. Un error frecuente es dar por unidas las dos mitades de una fila de cinco por «que están cerca»: cada bloque de cinco es una isla, y las dos columnas de un rail separadas por la muesca central son redes distintas salvo que las unas con un cable.`),

      diagrama('protoboard', `Estructura interna de una protoboard: filas de cinco contactos, surco central para integrados y railes laterales de alimentación.`),

      diagrama('protoboard_filas', `Vista detallada de las filas: cinco agujeros unidos por fila a cada lado del surco, y railes verticales partidos en la mitad.`),

      h('3. Soldadura: cinco pasos para una unión fiable'),

      pasos([
        { title: 'Estañar la punta', text: `Calienta el soldador y aplica una pequeña cantidad de estaño directamente sobre la punta limpia. Una película fina de estaño transfiere calor mucho mejor que el metal desnudo y protege la punta de la oxidación.` },
        { title: 'Limpiar la punta', text: `Pasa la punta por una esponja húmeda o, mejor, por lana de latón. La esponja enfría más y puede crear choques térmicos; la lana de latón limpia sin bajar apenas la temperatura. Hazlo antes de cada unión, no solo al empezar.` },
        { title: 'Calentar la unión, no el estaño', text: `Apoya la punta donde se tocan la patilla y la almohadilla, manteniendo el soldador a unos 45 grados. Cuenta uno o dos segundos: la unión debe alcanzar la temperatura de fusión antes de que llegue el estaño. Si calientas el estaño directamente, obtienes una bola fría.` },
        { title: 'Alimentar el estaño', text: `Acerca el alambre por el lado opuesto de la punta, a la unión ya caliente. El estaño debe fluir hacia la pista y mojarla formando un cono cóncavo. Retira el alambre en cuanto haya suficiente; demasiado estaño crea puentes entre pines vecinos.` },
        { title: 'Enfriar sin mover', text: `Retira primero el alambre y después el soldador, y mantén la pieza inmóvil uno o dos segundos hasta que el estaño se solidifique. Moverla en ese instante produce una grieta interna que no se ve pero que fallará con la vibración. Revisa la unión a contraluz: brillante y cónica es buena; mate y agrietada, hay que recalentarla.` }
      ]),

      diagrama('soldadura', `Secuencia correcta: estañar, limpiar, calentar la unión, alimentar estaño y retirar sin mover.`),

      diagrama('soldadura_union', `Anatomía de una unión: cono cóncavo y brillante que moja pista y patilla, frente a una unión fría opaca y esférica.`),

      p(`Soldar es crear una aleación metalúrgica entre el estaño, la patilla y la almohadilla; no es pegar estaño encima. El secreto no es más estaño, sino más calor en el sitio correcto y un flux que limpie la superficie mientras se funde. El procedimiento conviene ejecutarlo como un ritual, sobre todo en montaje de agujero pasante, que es lo primero que se aprende; el SMD llegará mucho más adelante. La aleación importa: el estaño con plomo más común es 60/40 o el eutéctico 63/37, que funde a 183 °C, es muy fluido y perdona errores de temperatura. El estaño sin plomo, normalmente SAC305 (96.5 % estaño, 3 % plata, 0.5 % cobre), funde alrededor de 217 °C, es más rígido y tiene una ventana de trabajo más estrecha, así que exige una punta unos 20 o 30 °C más caliente (350 a 380 °C frente a 320 a 350 °C del con plomo) y una mano más segura. El flux —en resina dentro del propio alambre o aplicado aparte con pasta— elimina la capa de óxido y permite que el estaño moje el cobre; sin flux, el estaño se queda en forma de perla. Las puntas cónicas llegan a pines densos y son buenas para SMD, pero retienen poco calor; las puntas tipo cuchilla tocan más superficie y son ideales para componentes de agujero pasante y pistas anchas. Una punta oxidada o con hoyos no transmite calor: se limpia, se estaña y, si está picada, se cambia. El humo del flux irrita, así que se suelda con ventilación o extractor. Para detectar una unión fría sin instrumentos, mira desde un ángulo rasante con buena luz: una unión buena es cónica, brillante y moja tanto la pista como el conductor, mientras que una fría es opaca, granulada y parece una bola posada sobre el metal. Si ves una bola redondeada, una grieta, una superficie mate y gris o una patilla que se mueve dentro del agujero, recalienta con un poco de flux y estaño fresco. La unión fría suele dar continuidad con el multímetro, así que la continuidad por sí sola no demuestra que la soldadura sea buena.`),

      p(`Desoldar es tan importante como soldar, porque tarde o temprano habrá que corregir un pin puenteado. Con bombilla de succión (solder sucker), primero añade un poco de estaño fresco a la unión para que vuelva a fluir, espera a que esté bien líquida y luego aplica la bombilla sin dejar que la punta obstruya el orificio; el estaño caliente se aspira de una vez. Con trenza de cobre (desoldador trenzado), coloca la trenza sobre la unión con un poco de flux, apoya el soldador encima y el cobre absorberá el estaño por capilaridad; retira trenza y soldador a la vez, antes de que se enfríe. Nunca fuerces una pieza mientras el estaño aún está sólido: arrancas la almohadilla de la placa. En cuanto a la ESD (descarga electrostática), tu cuerpo puede acumular varios kilovoltios sin notarlos y destruir la compuerta de un MOSFET o la entrada de un integrado: usa pulsera conectada a masa y estera antiestática cuando trabajes con SMD, guarda las piezas en bolsas antiestáticas, manipúralas por los bordes y toca un objeto metálico conectado a tierra antes de empezar.`) ,

      h('4. Checklist de seguridad y ejercicios de medición y reparación'),

      lista([
        `LiPo (recapitulación de r1-7): nunca las pinches, las deformes ni las calientes; usa siempre cargador balanceador específico y supervisa la carga. Para almacenarlas, déjalas alrededor de 3.8 V por celda en bolsa ignífuga, lejos de metales y de la luz directa. Si una celda se hincha, se retira del servicio de inmediato.`,
        `Gafas de protección: el estaño salpicado y los recortes de patillas vuelan. Usa gafas cuando cortes cables, sueldes o taladres, sin excepción.`,
        `Ventilación: el humo del flux y del plomo no es inofensivo. Trabaja con ventana abierta o extractor y lávate las manos antes de comer.`,
        `Soldador caliente: déjalo en su soporte, nunca sobre la mesa, y desconéctalo al terminar. El estaño líquido y la punta a 350 °C queman en un contacto breve.`,
        `Nunca sueldes con la placa alimentada: un puente accidental puede destruir el regulador o el micro antes de que lo notes, y el daño aparecerá semanas después como «algo raro que a veces pasa».`,
        `Antes de alimentar un montaje nuevo, mide con continuidad que Vcc y GND no estén unidos y repasa visualmente los pines del integrado con el datasheet delante.`,
        `Ejercicio de medición 1: mide un rail de 3.3 V en modo V DC y anota el valor real. Cambia a V AC y comprueba cuánto marca: si la fuente está bien, será unos milivoltios de rizado, no 3.3 V.`,
        `Ejercicio de medición 2: mide una resistencia de 10 kΩ primero en el circuito montado y después con un extremo levantado. Compara ambas lecturas y explica la diferencia por las ramas en paralelo.`,
        `Ejercicio de medición 3: con el LED de un divisor encendido, mide la caída en su resistencia limitadora. Si esperas 1.5 V y marcas 0 V, buscas un puente; si marcas el rail completo, el LED está abierto o al revés.`,
        `Ejercicio de reparación 1: corta un cable a propósito, confirma OL en continuidad, suéldalo y comprueba que suena el zumbador y que la resistencia de las sondas es solo la propia (unos 0.2 Ω).`,
        `Ejercicio de reparación 2: crea una unión fría a propósito calentando poco el estaño y observa con luz rasante su aspecto mate; luego desolda con trenza y repite la unión hasta obtener un cono brillante.`,
        `Ejercicio de reparación 3: puentea dos pines vecinos de un conector, localiza el corte con continuidad y retíralo con bombilla de succión sin levantar la almohadilla.`
      ], false),

      widget('bom')
    ]
  }
};
