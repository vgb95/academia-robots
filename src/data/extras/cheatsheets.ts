export type CheatSection = {
  id: string;
  title: string;
  track: 'robotica' | 'ai' | 'ambos';
  description: string;
  groups: { title: string; items: { term: string; value: string; note?: string }[] }[];
};

export const cheatsheets: CheatSection[] = [
  /* =====================================================================
     1. SÍMBOLOS DE ESQUEMÁTICOS Y COMPONENTES
     ===================================================================== */
  {
    id: 'esquematicos',
    title: 'Símbolos de esquemáticos y componentes',
    track: 'robotica',
    description: 'Cómo leer y dibujar esquemáticos: símbolos, polaridad, referencias y convenciones de cableado.',
    groups: [
      {
        title: 'Símbolos de circuito',
        items: [
          { term: 'Resistencia', value: 'Zigzag (ANSI) o rectángulo hueco (IEC)', note: 'Ambos son equivalentes; el rectángulo domina en esquemas europeos.' },
          { term: 'Capacitor', value: 'Dos placas paralelas; una curva si es polarizado', note: 'La placa recta es el ánodo (+) en electrolíticos.' },
          { term: 'Inductor / bobina', value: 'Serie de arcos o semicírculos en línea', note: 'Con dos líneas rectas paralelas al lado es un núcleo de hierro.' },
          { term: 'Diodo', value: 'Símbolo: triángulo con barra (→|), la barra es el cátodo', note: 'La corriente va de ánodo a cátodo (hacia la barra).' },
          { term: 'LED', value: 'Diodo más dos flechas salientes (emisión de luz)', note: 'Flechas entrantes indican un fotodiodo.' },
          { term: 'Transistor NPN', value: 'Base en línea, emisor con flecha hacia afuera', note: 'Mnemotecnia: NPN = flecha hacia fuera (Not Pointing iN) · PNP = flecha hacia dentro (Points iN).' },
          { term: 'MOSFET', value: 'Compuerta aislada, canal con flecha de sustrato', note: 'La flecha hacia dentro identifica el canal N (NMOS).' },
          { term: 'Interruptor / pulsador', value: 'Dos contactos con brazo inclinado; el pulsador lleva un resorte', note: 'NA = normalmente abierto; NC = normalmente cerrado.' },
          { term: 'Cristal / oscilador', value: 'Dos placas con un rectángulo central', note: 'El oscilador activo añade un amplificador dentro del mismo símbolo.' },
          { term: 'Transformador', value: 'Dos bobinas frente a frente con líneas de núcleo entre ellas', note: 'Sin líneas de núcleo es un transformador de aire.' },
        ],
      },
      {
        title: 'Fuentes, masa y referencias',
        items: [
          { term: 'Masa / tierra', value: 'Tres líneas decrecientes o símbolo de horquilla', note: 'No equivale a tierra física; es el nodo de referencia de 0 V.' },
          { term: 'GND analógico (AGND)', value: 'Símbolo de masa con triángulo o letra A', note: 'Únelo a DGND en un único punto para evitar bucles de masa.' },
          { term: 'Fuente DC', value: 'Círculo con más y menos, o barra larga (+) y corta (-)', note: 'La barra larga es siempre el polo positivo.' },
          { term: 'Fuente AC', value: 'Círculo con una sinusoide en su interior', note: 'En esquemas de potencia se anota también la frecuencia.' },
          { term: 'Batería', value: 'Celdas alternas largas y cortas; la larga es +', note: 'Varias celdas en serie se dibujan como pares repetidos.' },
          { term: 'VCC / VDD', value: 'Etiqueta de red para la alimentación positiva', note: 'VCC suele ser 5 V (TTL) y VDD 3.3 V (CMOS), pero verifica el dato.' },
          { term: 'Net label', value: 'Nombre sobre la línea o en un rombo pequeño', note: 'Dos etiquetas iguales conectan aunque no haya línea dibujada.' },
          { term: 'Nodo con unión', value: 'Punto sólido donde se cruzan conductores', note: 'Sin punto, el cruce es solo un cruce: no hay conexión eléctrica.' },
        ],
      },
      {
        title: 'Componentes pasivos y su marcado',
        items: [
          { term: 'Resistencia SMD', value: 'Código de 3 o 4 dígitos: 103 = 10 kΩ, 1002 = 10 kΩ', note: 'El último dígito es el multiplicador; R47 significa 0.47 Ω.' },
          { term: 'Capacitor cerámico', value: '104 = 10 × 10^4 pF = 100 nF', note: 'Los cerámicos no tienen polaridad y se usan como desacople.' },
          { term: 'Capacitor electrolítico', value: 'Valor en µF y tensión máxima, por ejemplo 100 µF 16 V', note: 'La franja negativa marca el cátodo; respeta la polaridad.' },
          { term: 'Inductor SMD', value: 'Código como 221 = 220 µH o marcado directo', note: 'Verifica la corriente de saturación, no solo la inductancia.' },
          { term: 'Fusible', value: 'Pequeño rectángulo con línea interior o símbolo de fusible', note: 'Se especifica por corriente y curva de disparo (lento/rápido).' },
          { term: 'Ferrite bead', value: 'Cuenta de ferrita: símbolo de resistencia con línea dentro', note: 'Bloquea ruido de alta frecuencia sin apenas pérdida en DC.' },
          { term: 'Varistor / TVS', value: 'Resistencia con curva en V o diodo Zener doble', note: 'Protege contra sobretensiones y picos transitorios.' },
          { term: 'Potenciómetro', value: 'Resistencia con flecha o wiper en el punto medio', note: 'El terminal central es el cursor; úsalo como divisor de tensión.' },
        ],
      },
      {
        title: 'Semiconductores',
        items: [
          { term: 'Diodo rectificador', value: '1N4007: 1 A, 1000 V, caída aproximada de 0.7 V', note: 'Un diodo Schottky cae solo 0.2 a 0.4 V.' },
          { term: 'LED', value: 'Vf rojo ~2 V, verde/ámbar ~2.1 V, azul/blanco ~3.0 a 3.3 V', note: 'Siempre en serie con una resistencia limitadora.' },
          { term: 'Zener', value: 'Diodo con cátodo quebrado; Vz fija la tensión en inversa', note: 'Necesita resistencia en serie y corriente mínima de regulación.' },
          { term: 'Transistor NPN', value: '2N2222, BC547: conmuta carga en el colector', note: 'La base necesita ~0.7 V y corriente de base suficiente.' },
          { term: 'MOSFET lógico', value: 'IRLZ44N, AO3400: Vgs(th) bajo, conmuta con 3.3 V', note: 'Un MOSFET no lógico con Vgs(th) alto no enciende desde un ESP32.' },
          { term: 'Regulador LDO', value: 'AMS1117-3.3: entrada 5 V, salida 3.3 V', note: 'Requiere capacitores de entrada y salida; disipa (Vin - Vout)·I.' },
          { term: 'Convertidor buck', value: 'LM2596, MP1584: reduce tensión con alta eficiencia', note: 'Prefiere buck antes que LDO cuando la diferencia de tensión es grande.' },
          { term: 'Optoacoplador', value: 'LED + fototransistor dentro del mismo encapsulado', note: 'Aísla el lado de lógica del lado de potencia.' },
        ],
      },
      {
        title: 'Convenciones de lectura',
        items: [
          { term: 'Referencia', value: 'R1, R2 resistencias; C1 capacitores; U1 circuitos integrados', note: 'D, Q, J, SW corresponden a diodos, transistores, conectores y pulsadores.' },
          { term: 'Valor y tolerancia', value: 'Se escriben junto al símbolo: 10 kΩ 1%', note: 'La tolerancia no aparece siempre; búsquela en la hoja de datos.' },
          { term: 'Orientación', value: 'Lea de izquierda a derecha y de arriba abajo', note: 'En esquemas de potencia, la corriente suele bajar hacia la masa.' },
          { term: 'Patillas de CI', value: 'Se numeran en sentido antihorario desde la muesca o punto', note: 'En vista superior, el pin 1 queda a la izquierda de la muesca.' },
          { term: 'Buses', value: 'Línea gruesa con varias señales o etiqueta tipo D0..D7', note: 'Una barra oblicua con número indica cuántas líneas agrupa.' },
          { term: 'Conector', value: 'J para conector macho, P para hembra (o al revés según la casa)', note: 'Anote siempre el número de pin y la función junto al conector.' },
          { term: 'Prueba physical', value: 'TP1, TP2: puntos de test sin componente instalado', note: 'Útiles para soldar el multímetro y medir tensiones de depuración.' },
        ],
      },
    ],
  },

  /* =====================================================================
     2. LEYES DE ELECTRÓNICA Y FÓRMULAS
     ===================================================================== */
  {
    id: 'leyes-electronica',
    title: 'Leyes de electrónica y fórmulas',
    track: 'robotica',
    description: 'Las ecuaciones que se usan cada día: Ohm, Kirchhoff, divisores, transitorios RC y presupuesto de potencia.',
    groups: [
      {
        title: 'Ley de Ohm y potencia',
        items: [
          { term: 'Ley de Ohm', value: 'V = I · R   →   I = V / R   →   R = V / I', note: 'V en voltios, I en amperios, R en ohmios.' },
          { term: 'Potencia eléctrica', value: 'P = V · I = I² · R = V² / R', note: 'En vatios; es la base para dimensionar resistencias y fuentes.' },
          { term: 'Resistencia de un LED', value: 'R = (Vcc - Vf) / If', note: 'Vf es la caída del LED e If la corriente deseada, típica 10 a 20 mA.' },
          { term: 'Caída en resistor shunt', value: 'V = I · Rs', note: 'Rs pequeño y de baja tolerancia para medir corriente.' },
          { term: 'Resistencia equivalente serie', value: 'Req = R1 + R2 + ... + Rn', note: 'La corriente es la misma en todos los elementos.' },
          { term: 'Resistencia equivalente paralelo', value: '1/Req = 1/R1 + 1/R2 + ... + 1/Rn', note: 'Para dos resistencias: Req = (R1·R2)/(R1+R2).' },
          { term: 'Conductancia', value: 'G = 1 / R  (siemens)', note: 'En paralelo las conductancias se suman directamente.' },
          { term: 'Energía', value: 'E = P · t  (vatios-hora, Wh)', note: '1 Wh = 3600 J; útil para estimar autonomía de batería.' },
        ],
      },
      {
        title: 'Leyes de Kirchhoff',
        items: [
          { term: 'Ley de corrientes (KCL)', value: 'Suma de corrientes que entran = suma de las que salen', note: 'Aplícala en cada nodo del circuito.' },
          { term: 'Ley de tensiones (KVL)', value: 'Suma algebraica de tensiones en una malla = 0', note: 'Recorre la malla en un sentido y respeta los signos.' },
          { term: 'Convención de signos', value: 'Al atravesar una fuente de - a + se suma; de + a - se resta', note: 'Un error de signo es la causa más común al resolver mallas.' },
          { term: 'Superposición', value: 'La respuesta total es la suma de la respuesta de cada fuente activa', note: 'Apaga las demás fuentes: voltaje ideal se cortocircuita, corriente ideal se abre.' },
          { term: 'Teorema de Thévenin', value: 'Cualquier red lineal equivale a Vth en serie con Rth', note: 'Vth es el circuito abierto; Rth se mide con las fuentes apagadas.' },
          { term: 'Teorema de Norton', value: 'Red equivalente a una fuente In en paralelo con Rn', note: 'In = Vth / Rth; es el dual de Thévenin.' },
        ],
      },
      {
        title: 'Divisores y carga',
        items: [
          { term: 'Divisor de tensión', value: 'Vout = Vin · R2 / (R1 + R2)', note: 'R1 arriba (a Vin), R2 abajo (a masa).' },
          { term: 'Factor de división', value: 'k = R2 / (R1 + R2)', note: 'Un divisor de 5 V a 3.3 V necesita k = 0.66.' },
          { term: 'Divisor con carga', value: 'Vout = Vin · (R2 || RL) / (R1 + (R2 || RL))', note: 'La carga RL en paralelo con R2 reduce la salida; por eso el divisor no es un regulador.' },
          { term: 'Efecto de carga del ADC', value: 'Zin del ADC debe ser menor que ~10 × la impedancia de la fuente', note: 'En el ESP32 conviene un capacitor de 100 nF o un buffer en la entrada.' },
          { term: 'Acondicionamiento de sensor', value: 'Escala: Vout = (Vsensor - offset) · ganancia', note: 'Aplica el offset antes de amplificar para no saturar.' },
          { term: 'Resistencia pull-up', value: 'R = (Vcc - Vlow) / Isink', note: 'I2C usa típicas de 4.7 kΩ; baja a 2.2 kΩ si el bus es largo.' },
          { term: 'Histéresis', value: 'Umbral alto y bajo distintos: Vt+ y Vt-', note: 'Evita oscilaciones en comparadores con señales ruidosas.' },
        ],
      },
      {
        title: 'Transitorios RC y RL',
        items: [
          { term: 'Constante de tiempo RC', value: 'τ = R · C', note: 'Tras 5τ el capacitor está al ~99% del valor final.' },
          { term: 'Carga de capacitor', value: 'Vc(t) = Vf + (V0 - Vf) · e^(-t/τ)', note: 'V0 tensión inicial, Vf tensión final.' },
          { term: 'Descarga de capacitor', value: 'Vc(t) = V0 · e^(-t/τ)', note: 'A 1τ queda el 37% de la carga inicial.' },
          { term: 'Constante de tiempo RL', value: 'τ = L / R', note: 'La corriente en una bobina tarda en cambiar; por eso aparecen picos inductivos.' },
          { term: 'Corriente RL', value: 'I(t) = If · (1 - e^(-t/τ))', note: 'En el apagado, un diodo de libre circulación protege el driver.' },
          { term: 'Impedancia de capacitor', value: 'Xc = 1 / (2·π·f·C)', note: 'A alta frecuencia el capacitor se comporta casi como un corto.' },
          { term: 'Impedancia de inductor', value: 'Xl = 2·π·f·L', note: 'A alta frecuencia la bobina se opone más al paso de corriente.' },
          { term: 'Frecuencia de corte RC', value: 'fc = 1 / (2·π·R·C)', note: 'Es el punto a -3 dB de un filtro pasa-bajos de un polo.' },
        ],
      },
      {
        title: 'Baterías y potencia',
        items: [
          { term: 'Corriente LiPo', value: 'Imax = C-rating · Capacidad(Ah)', note: 'Una 2200 mAh 30C puede entregar 66 A en pico.' },
          { term: 'Autonomía estimada', value: 't(h) = Capacidad(Wh) · eficiencia / Potencia(W)', note: 'La eficiencia real de un robot suele estar entre 0.6 y 0.8.' },
          { term: 'Energía de batería', value: 'Wh = Vnom · Ah', note: 'Una LiPo 3S (11.1 V) de 5 Ah almacena ~55.5 Wh.' },
          { term: 'Divisor para medir batería', value: 'Vbat = Vadc · (R1 + R2) / R2', note: 'Elige R alto para no drenar la batería, pero bajo frente a la entrada del ADC.' },
          { term: 'Disipación de un regulador', value: 'Pd = (Vin - Vout) · I', note: 'Comprueba la resistencia térmica y añade disipador si hace falta.' },
          { term: 'Caída en cable', value: 'Vdrop = I · R cable', note: 'Cables finos y largos calientan y roban tensión a los motores.' },
          { term: 'Arranque de motor', value: 'Iarranque = 3 a 5 × Inominal', note: 'La fuente y el fusible deben soportar ese pico sin caer.' },
        ],
      },
    ],
  },

  /* =====================================================================
     3. CÓDIGOS DE COLORES DE RESISTENCIAS
     ===================================================================== */
  {
    id: 'codigos-resistencias',
    title: 'Códigos de colores de resistencias',
    track: 'robotica',
    description: 'Tabla de bandas de resistencias: dígitos, multiplicador, tolerancia y coeficiente térmico con ejemplos.',
    groups: [
      {
        title: 'Dígitos (primera y segunda banda)',
        items: [
          { term: 'Negro', value: '0', note: 'También es multiplicador ×1.' },
          { term: 'Marrón', value: '1', note: 'Como tolerancia significa ±1%.' },
          { term: 'Rojo', value: '2', note: 'Como tolerancia significa ±2%.' },
          { term: 'Naranja', value: '3', note: 'Como multiplicador significa ×1000.' },
          { term: 'Amarillo', value: '4', note: 'Como TCR, 25 ppm/K.' },
          { term: 'Verde', value: '5', note: 'Como TCR, 20 ppm/K.' },
          { term: 'Azul', value: '6', note: 'Como TCR, 10 ppm/K.' },
          { term: 'Violeta', value: '7', note: 'También aparece como TCR de 5 ppm/K.' },
          { term: 'Gris', value: '8', note: 'Como multiplicador significa ×10^8.' },
          { term: 'Blanco', value: '9', note: 'Rara vez se usa como multiplicador.' },
        ],
      },
      {
        title: 'Multiplicador (tercera banda)',
        items: [
          { term: 'Negro ×1', value: '10^0 = 1', note: 'Ejemplo: 47 × 1 = 47 Ω.' },
          { term: 'Marrón ×10', value: '10^1 = 10', note: 'Ejemplo: 47 × 10 = 470 Ω.' },
          { term: 'Rojo ×100', value: '10^2 = 100', note: 'Ejemplo: 47 × 100 = 4.7 kΩ.' },
          { term: 'Naranja ×1000', value: '10^3 = 1000', note: 'Ejemplo: 47 × 1000 = 47 kΩ.' },
          { term: 'Amarillo ×10^4', value: '10000', note: 'Ejemplo: 10 × 10^4 = 100 kΩ.' },
          { term: 'Verde ×10^5', value: '100000', note: 'Ejemplo: 10 × 10^5 = 1 MΩ.' },
          { term: 'Azul ×10^6', value: '1000000', note: 'Se usa en resistencias de alto valor.' },
          { term: 'Oro / Plata', value: '×0.1 / ×0.01', note: 'Aparecen en resistencias de baja resistancia, por ejemplo 0.47 Ω.' },
        ],
      },
      {
        title: 'Tolerancia (última banda)',
        items: [
          { term: 'Marrón', value: '±1%', note: 'Resistencias de precisión, típicas en electrónica moderna.' },
          { term: 'Rojo', value: '±2%', note: 'Precisión media.' },
          { term: 'Verde', value: '±0.5%', note: 'Alta precisión.' },
          { term: 'Azul', value: '±0.25%', note: 'Muy precisas y caras.' },
          { term: 'Violeta', value: '±0.1%', note: 'Se usan en shunt y referencias.' },
          { term: 'Oro / Plata / Sin banda', value: '±5% / ±10% / ±20%', note: 'Las de 4 bandas con oro son las más comunes en prototipos.' },
        ],
      },
      {
        title: 'Coeficiente térmico TCR (banda 5 o 6)',
        items: [
          { term: 'Marrón', value: '100 ppm/K', note: 'El más común en resistencias generales.' },
          { term: 'Rojo', value: '50 ppm/K', note: 'Buena estabilidad térmica.' },
          { term: 'Naranja', value: '15 ppm/K', note: 'Resistencias de precisión.' },
          { term: 'Amarillo', value: '25 ppm/K', note: 'Típico en resistencias de película metálica.' },
          { term: 'Azul', value: '10 ppm/K', note: 'Máxima estabilidad; especificaciones de precisión.' },
        ],
      },
      {
        title: 'Ejemplos y trucos',
        items: [
          { term: '4 bandas: marrón-negro-rojo-oro', value: '10 × 100 = 1000 Ω ±5% = 1 kΩ', note: 'Es el caso más habitual en practicar.' },
          { term: '4 bandas: amarillo-violeta-marrón-oro', value: '47 × 10 = 470 Ω ±5%', note: 'Muy usada como limitadora de LED.' },
          { term: '5 bandas: marrón-negro-negro-marrón-marrón', value: '100 × 1 = 100 Ω ±1%, TCR 100 ppm/K', note: 'En 5 bandas hay tres dígitos antes del multiplicador.' },
          { term: 'Leer la dirección', value: 'La banda de tolerancia suele ser la más separada', note: 'Empieza por el extremo opuesto a esa banda.' },
          { term: 'Oro o plata al final', value: 'Nunca es dígito: es tolerancia o multiplicador', note: 'Sirve para orientar la resistencia sin dudas.' },
          { term: 'SMD 3 dígitos', value: 'ABC = AB × 10^C', note: '472 = 4.7 kΩ; 101 = 100 Ω; 000 = 0 Ω (puente).' },
          { term: 'SMD 4 dígitos', value: 'ABCD = ABC × 10^D', note: '1002 = 10 kΩ; 4701 = 4.7 kΩ.' },
        ],
      },
    ],
  },

  /* =====================================================================
     4. GPIO / PWM / ADC EN ESP32 Y ARDUINO
     ===================================================================== */
  {
    id: 'gpio-pwm-adc',
    title: 'GPIO / PWM / ADC en ESP32 y Arduino',
    track: 'robotica',
    description: 'Referencia rápida de digital, PWM, ADC, interrupciones y pines especiales en ESP32 y Arduino.',
    groups: [
      {
        title: 'GPIO digital',
        items: [
          { term: 'pinMode', value: 'pinMode(pin, OUTPUT) o pinMode(pin, INPUT_PULLUP)', note: 'INPUT_PULLUP activa una resistencia interna ~30 a 50 kΩ.' },
          { term: 'digitalWrite', value: 'digitalWrite(pin, HIGH) / LOW', note: 'HIGH son 3.3 V en ESP32 y 5 V en Arduino UNO.' },
          { term: 'digitalRead', value: 'int estado = digitalRead(pin)', note: 'Devuelve HIGH o LOW; con pull-up, el pulsador activo a masa da LOW.' },
          { term: 'toggle', value: 'digitalWrite(pin, !digitalRead(pin))', note: 'Útil para parpadear sin variable de estado.' },
          { term: 'Corriente máxima GPIO', value: 'ESP32 ~20 mA recomendado; UNO ~20 mA recomendado, 40 mA absoluto', note: 'No alimentes motores ni LEDs potentes directamente desde un pin.' },
          { term: 'Niveles lógicos', value: 'ESP32 3.3 V; UNO 5 V', note: 'Nunca conectes 5 V a un pin del ESP32 sin divisor o level shifter.' },
          { term: ' Entrada flotante', value: 'Evitar: pinMode(pin, INPUT) sin resistencia', note: 'Un pin sin pull induce ruido y lecturas aleatorias.' },
          { term: 'Debounce por software', value: 'Si (millis() - tLast) > 50 ms then leer', note: 'Los pulsadores mecánicos rebotes durante 5 a 50 ms.' },
        ],
      },
      {
        title: 'PWM',
        items: [
          { term: 'Arduino analogWrite', value: 'analogWrite(pin, duty)  →  duty 0..255', note: 'En UNO los pines PWM son 3, 5, 6, 9, 10 y 11.' },
          { term: 'ESP32 ledcSetup', value: 'ledcSetup(canal, freq, resolucion)  →  ej. 5000 Hz, 8 bits', note: 'API clásica de Arduino-ESP32; 16 canales disponibles.' },
          { term: 'ESP32 ledcAttachPin', value: 'ledcAttachPin(pin, canal)', note: 'Asocia un GPIO cualquiera a un canal PWM.' },
          { term: 'ESP32 ledcWrite', value: 'ledcWrite(canal, duty)', note: 'Con 8 bits, duty va de 0 a 255; con 10 bits, de 0 a 1023.' },
          { term: 'ESP32 API nueva', value: 'ledcAttach(pin, freq, resolution); ledcWrite(pin, duty)', note: 'Arduino-ESP32 3.x usa el pin directamente, sin canal explícito.' },
          { term: 'Servo estandar', value: '50 Hz (periodo 20 ms), pulso 1 ms = 0°, 1.5 ms = 90°, 2 ms = 180°', note: 'Alimenta el servo con 5 V separados y comparte masa.' },
          { term: 'Frecuencia típica motores DC', value: '15 a 25 kHz', note: 'Por encima del rango audible evitas el zumbido.' },
          { term: 'Resolución vs frecuencia', value: 'En ESP32, mayor frecuencia reduce la resolución máxima del LEDC', note: 'A 20 kHz conviene bajar a 10 bits para no perder pasos.' },
        ],
      },
      {
        title: 'ADC',
        items: [
          { term: 'Arduino analogRead', value: 'int v = analogRead(A0)  →  0..1023 (10 bits)', note: 'Referencia por defecto de 5 V en UNO, ~1.1 V con INTERNAL.' },
          { term: 'ESP32 analogRead', value: 'int v = analogRead(pin)  →  0..4095 (12 bits)', note: 'El rango útil real está entre ~0.1 y ~3.2 V.' },
          { term: 'Conversión a voltios ESP32', value: 'V = v · 3.3 / 4095', note: 'Calibra con una referencia conocida: la Vref real varía entre placas.' },
          { term: 'Conversión a voltios UNO', value: 'V = v · 5.0 / 1023', note: 'Usa analogReference(INTERNAL) para mejorar resolución en señales pequeñas.' },
          { term: 'analogReference', value: 'analogReference(DEFAULT | INTERNAL | EXTERNAL)', note: 'En ESP32 se usa analogSetAttenuation() en su lugar.' },
          { term: 'Atenuación ESP32', value: 'analogSetAttenuation(ADC_0db | ADC_2_5db | ADC_6db | ADC_11db)', note: 'ADC_11db da ~0 a 3.3 V pero con más ruido.' },
          { term: 'ADC2 y WiFi', value: 'En ESP32, ADC2 no se puede usar mientras el WiFi está activo', note: 'Para lecturas analógicas con WiFi, usa ADC1 (GPIO 32 a 39).' },
          { term: 'Oversampling', value: 'Promedia N muestras para reducir ruido ~raíz(N)', note: '16 muestras dan 4 veces menos ruido, a costa de velocidad.' },
        ],
      },
      {
        title: 'Interrupciones y temporizadores',
        items: [
          { term: 'attachInterrupt', value: 'attachInterrupt(digitalPinToInterrupt(pin), ISR, RISING)', note: 'Modos: CHANGE, RISING, FALLING (ESP32 también ONLOW, ONHIGH).' },
          { term: 'ISR corta', value: 'La rutina debe ser breve; usa volatile y solo actualizar flags/contadores', note: 'No uses delay(), Serial ni malloc dentro de una ISR.' },
          { term: 'Variable volatile', value: 'volatile unsigned long pulsos = 0;', note: 'Evita que el compilador optimice lecturas que cambian en la ISR.' },
          { term: 'Sección crítica', value: 'noInterrupts(); ...; interrupts()', note: 'En ESP32 usa portENTER_CRITICAL para proteger datos compartidos.' },
          { term: 'millis()', value: 'if (millis() - t0 >= intervalo) { t0 = millis(); ... }', note: 'Nunca uses delay() si el robot debe seguir respondiendo.' },
          { term: 'micros()', value: 'Devuelve microsegundos desde el arranque', note: 'Se desborda aproximadamente cada 70 minutos.' },
        ],
      },
      {
        title: 'Pines especiales ESP32 y Arduino',
        items: [
          { term: 'ESP32 strapping pins', value: 'GPIO 0, 2, 12, 15 influyen en el arranque', note: 'Déjalos libres o con su estado correcto al resetear.' },
          { term: 'ESP32 entradas solo', value: 'GPIO 34 a 39 son solo entrada (no PWM, no pull-up interno)', note: 'Son excelentes para ADC (ADC1).' },
          { term: 'ESP32 pin integrado', value: 'GPIO 2 = LED onboard en muchas placas', note: 'Útil para una prueba rápida de blink sin cableado.' },
          { term: 'ESP32 pines I2C por defecto', value: 'SDA = GPIO 21, SCL = GPIO 22', note: 'En la API nueva cualquier pin puede ser I2C.' },
          { term: 'ESP32 pines SPI por defecto', value: 'SCK = 18, MISO = 19, MOSI = 23, CS = 5', note: 'VSPI es el bus habitual en Arduino-ESP32.' },
          { term: 'Arduino UNO I2C', value: 'SDA = A4, SCL = A5', note: 'En placas antiguas están además cerca del pin 13.' },
          { term: 'Arduino UNO SPI', value: 'SCK = 13, MISO = 12, MOSI = 11, SS = 10', note: 'El pin 10 debe ser salida para que SPI funcione como maestro.' },
          { term: 'Arduino UNO PWM', value: 'Pines 3, 5, 6, 9, 10, 11', note: 'Frecuencia ~490 Hz, ~980 Hz en 5 y 6.' },
        ],
      },
    ],
  },

  /* =====================================================================
     5. PROTOCOLOS I2C / SPI / UART
     ===================================================================== */
  {
    id: 'protocolos',
    title: 'Protocolos I2C / SPI / UART',
    track: 'robotica',
    description: 'Cableado, velocidades, direcciones y comandos de los tres buses serie más usados en robótica.',
    groups: [
      {
        title: 'I2C',
        items: [
          { term: 'Líneas', value: 'SDA (datos) + SCL (reloj), ambas con pull-up a Vdd', note: 'Normalmente 4.7 kΩ a 3.3 V; baja a 2.2 kΩ con cables largos.' },
          { term: 'Velocidades', value: 'Estándar 100 kHz, rápido 400 kHz, rápido plus 1 MHz, alta velocidad 3.4 MHz', note: 'Muchos sensores solo soportan 100 o 400 kHz.' },
          { term: 'Direcciones', value: '7 bits (0x08 a 0x77), el bit 8 indica lectura (1) o escritura (0)', note: 'Hay direcciones reservadas; evita 0x00 a 0x07 y 0x78 a 0x7F.' },
          { term: 'Dirección típica BMP280', value: '0x76 o 0x77 según el pin SDO', note: 'Consulta siempre la hoja de datos: algunos sensores permiten cambiarla.' },
          { term: 'Dirección típica MPU6050', value: '0x68 (AD0 a masa) o 0x69 (AD0 a Vdd)', note: 'Permite dos IMUs en el mismo bus.' },
          { term: 'Trama', value: 'START → dirección+R/W → ACK → datos → ACK → STOP', note: 'El esclavo confirma cada byte con un ACK.' },
          { term: 'Escanear bus (Arduino)', value: 'Wire.begin(); for(byte a=1;a<127;a++){ Wire.beginTransmission(a); if(Wire.endTransmission()==0) Serial.println(a); }', note: 'Imprime las direcciones que responden.' },
          { term: 'Leer registro', value: 'Wire.beginTransmission(addr); Wire.write(reg); Wire.endTransmission(false); Wire.requestFrom(addr, n);', note: 'endTransmission(false) mantiene la condición de repetido START.' },
        ],
      },
      {
        title: 'SPI',
        items: [
          { term: 'Líneas', value: 'SCK, MOSI (maestro a esclavo), MISO (esclavo a maestro), CS/SS', note: 'Cada esclavo necesita su propia línea CS.' },
          { term: 'Velocidad', value: 'Típicamente 1 a 40 MHz, según dispositivo y longitud de cable', note: 'Empieza bajo (1 MHz) y sube hasta que falle.' },
          { term: 'Modos CPOL/CPHA', value: 'Modo 0 (00), 1 (01), 2 (10), 3 (11)', note: 'CPOL = polaridad del reloj en reposo; CPHA = flanco de muestreo.' },
          { term: 'Modo más común', value: 'Mode 0: CPOL=0, CPHA=0', note: 'Muchos sensores y tarjetas SD usan 0 o 3; verifica el datasheet.' },
          { term: 'Configuración Arduino', value: 'SPI.beginTransaction(SPISettings(4000000, MSBFIRST, SPI_MODE0))', note: 'Siempre entre beginTransaction y endTransaction.' },
          { term: 'Seleccionar esclavo', value: 'digitalWrite(CS, LOW); ...; digitalWrite(CS, HIGH)', note: 'CS activo a bajo en la mayoría de dispositivos.' },
          { term: 'Transferencia', value: 'byte recibido = SPI.transfer(byte enviado)', note: 'SPI es full-duplex: cada envío devuelve un byte.' },
          { term: 'MSBFIRST / LSBFIRST', value: 'Orden de bits dentro de cada byte', note: 'Un orden incorrecto da datos invertidos aunque el reloj esté bien.' },
        ],
      },
      {
        title: 'UART / serie',
        items: [
          { term: 'Líneas', value: 'TX (transmisor) y RX (receptor), cruzadas entre dispositivos', note: 'Conecta TX de uno a RX del otro y comparte masa.' },
          { term: 'Baud rate', value: '9600, 115200, 921600 bits/s', note: 'Ambos extremos deben usar exactamente la misma velocidad.' },
          { term: 'Trama', value: 'Bit de inicio + 8 datos + paridad opcional + 1 o 2 bits de parada', note: 'Configuración típica: 8N1 (8 datos, sin paridad, 1 parada).' },
          { term: 'Configurar ESP32', value: 'Serial.begin(115200, SERIAL_8N1, rxPin, txPin)', note: 'En ESP32 puedes elegir cualquier pin; en UNO usas Serial o Serial1.' },
          { term: 'Nivel lógico', value: 'UART TTL de 3.3 V o 5 V; RS-232 usa ±12 V', note: 'Un adaptador USB-serial debe coincidir con el nivel del micro.' },
          { term: 'Serial.print / println', value: 'Serial.print(valor); Serial.println(valor)', note: 'println añade retorno de carro y salto de línea.' },
          { term: 'Leer con timeout', value: 'Serial.setTimeout(50); String s = Serial.readStringUntil(\"\\n\")', note: 'Sin timeout, readStringUntil puede bloquear mucho tiempo.' },
          { term: 'Longitud de cable', value: 'Con TTL, mantén cables cortos (menos de ~1 m)', note: 'Para distancias largas usa RS-485 o convertidores diferenciales.' },
        ],
      },
      {
        title: 'Comparativa y elección',
        items: [
          { term: 'I2C: cuándo usarlo', value: 'Muchos sensores lentos, pocos pines, cable corto', note: 'Direccionamiento por software evita gastar pines CS.' },
          { term: 'SPI: cuándo usarlo', value: 'Pantallas, tarjetas SD, ADC rápidos, alto throughput', note: 'Más pines y más velocidad; ideal para grandes volúmenes de datos.' },
          { term: 'UART: cuándo usarlo', value: 'GPS, módulos WiFi/Bluetooth, telemetría y depuración', note: 'Simple y punto a punto, sin reloj compartido.' },
          { term: 'Número de hilos', value: 'I2C = 2, SPI = 4 + CS por esclavo, UART = 2', note: 'I2C gana en ahorro de pines con muchos dispositivos.' },
          { term: 'Velocidad relativa', value: 'UART < I2C < SPI (típicamente)', note: 'Depende del dispositivo, pero SPI suele ser el más rápido.' },
          { term: 'Direccionamiento', value: 'I2C por dirección de 7 bits; SPI por pin CS; UART solo dos extremos', note: 'En I2C hay conflicto si dos dispositivos comparten dirección.' },
        ],
      },
      {
        title: 'Direcciones y trucos',
        items: [
          { term: 'Conflicto de direcciones I2C', value: 'Cambia la dirección con pines AD0/SDO o usa un multiplexor I2C', note: 'El PCA9548a ofrece 8 canales direccionables.' },
          { term: 'Level shifter I2C', value: 'MOSFET con pull-ups a ambos lados (ej. BSS138)', note: 'Necesario para mezclar sensores de 5 V con un micro de 3.3 V.' },
          { term: 'Pull-ups insuficientes', value: 'Síntoma: flancos redondeados y fallos a alta velocidad', note: 'Baja la resistencia o la frecuencia del bus.' },
          { term: 'Aislar un dispositivo SPI', value: 'CS en HIGH deselecciona; otros esclavos ignoran el reloj', note: 'Asegura CS en HIGH antes de inicializar el bus.' },
          { term: 'Cables I2C largos', value: 'Usa cableado trenzado y baja la velocidad a 100 kHz', note: 'La capacitancia del cable limita la subida de SDA y SCL.' },
          { term: 'Depurar con lógica', value: 'Un analizador lógico barato permite ver START, ACK y direcciones', note: 'PulseView + sigrok es una opción gratuita.' },
        ],
      },
    ],
  },

  /* =====================================================================
     6. MOTORES Y DRIVERS: ECUACIONES Y PINOUTS
     ===================================================================== */
  {
    id: 'motores-drivers',
    title: 'Motores y drivers: ecuaciones y pinouts',
    track: 'robotica',
    description: 'Ecuaciones de motores DC, servos y pasos a paso, además de pinouts y corrientes de los drivers habituales.',
    groups: [
      {
        title: 'Motor DC',
        items: [
          { term: 'Ecuación de tensión', value: 'V = I·R + Ke·ω + L·(di/dt)', note: 'En régimen permanente L·di/dt tiende a cero.' },
          { term: 'Fuerza electromotriz', value: 'Back-EMF = Ke · ω', note: 'Ke es la constante de velocidad, en V·s/rad o V/rpm.' },
          { term: 'Par motor', value: 'τ = Kt · I', note: 'En motor de imán permanente, Kt ≈ Ke en unidades SI.' },
          { term: 'Velocidad en vacío', value: 'ω ≈ V / Ke', note: 'La velocidad cae al aumentar la carga por la caída I·R.' },
          { term: 'Corriente de parada', value: 'Istall = V / R', note: 'Puede ser 5 a 10 veces la corriente nominal; cuidado con el driver.' },
          { term: 'Relación de reducción', value: 'ωout = ωmotor / N ; τout = τmotor · N · η', note: 'N es la reducción y η la eficiencia de la caja reductora.' },
          { term: 'Encoder CPR', value: 'Pulsos por vuelta; resolución efectiva = CPR · 4 (quadrature)', note: 'Cuenta flancos de ambos canales A y B para más resolución.' },
          { term: 'Velocidad por encoder', value: 'ω = 2·π · pulsos / (CPR · Δt)', note: 'Δt en segundos da rad/s.' },
        ],
      },
      {
        title: 'Servo estándar',
        items: [
          { term: 'Periodo PWM', value: '20 ms (50 Hz)', note: 'El ancho del pulso, no la frecuencia, define el ángulo.' },
          { term: 'Pulso 1.0 ms', value: 'Posición 0° (o -90° en servos de 180° continuos)', note: 'Algunos servos llegan a 0.5 ms y 2.5 ms.' },
          { term: 'Pulso 1.5 ms', value: 'Posición neutra / 90°', note: 'En un servo de rotación continua detiene el giro.' },
          { term: 'Pulso 2.0 ms', value: 'Posición 180°', note: 'Verifica el rango real: muchos servos no llegan a los extremos teóricos.' },
          { term: 'Ángulo desde pulso', value: 'ángulo = (pulso_us - 1000) · 180 / 1000', note: 'Ajusta los límites según tu servo para no forzar los topes.' },
          { term: 'Alimentación', value: '5 V separados, con capacitor de 100 a 470 µF', note: 'Comparte masa con el micro; nunca alimentes el servo desde el pin 5V del UNO.' },
        ],
      },
      {
        title: 'Motor paso a paso',
        items: [
          { term: 'Ángulo de paso', value: 'α = 360° / pasos_por_vuelta', note: 'Un NEMA 17 de 1.8° tiene 200 pasos por vuelta.' },
          { term: 'Modo full step', value: 'Una fase excitada por paso (o dos para más par)', note: 'Dos fases activas dan ~1.4 veces más par.' },
          { term: 'Microstepping', value: 'Pasos reales = pasos_base · subdivisiones (1/2, 1/4, 1/8, 1/16)', note: 'Aumenta suavidad y resolución, pero no el par real.' },
          { term: 'Velocidad en pasos', value: 'rpm = (f_paso · 60) / pasos_por_vuelta', note: 'f_paso es la frecuencia de pulsos STEP en Hz.' },
          { term: 'Secuencia de fases', value: 'A+ → B+ → A- → B- (full step de una fase)', note: 'Invertir el orden invierte el sentido de giro.' },
          { term: 'Par de retención', value: 'Par que mantiene con corriente y sin movimiento', note: 'Cae mucho al girar rápido por la inductancia de las bobinas.' },
          { term: 'Corriente por fase', value: 'Ajusta el driver al valor nominal del motor, no al máximo', note: 'Exceso de corriente calienta el motor y el driver.' },
        ],
      },
      {
        title: 'Drivers y pinouts',
        items: [
          { term: 'L298N', value: 'IN1, IN2 (dirección), ENA (PWM); hasta 2 A por canal', note: 'Caída de tensión alta (~2 V); disipa bastante calor.' },
          { term: 'L298N tabla', value: 'IN1=1,IN2=0 → adelante; 0,1 → atrás; 0,0 → freno; 1,1 → parada libre', note: 'ENA en LOW deshabilita el puente por completo.' },
          { term: 'TB6612FNG', value: 'IN1, IN2, PWM, STBY; 1.2 A continuo, 3 A pico', note: 'Mucho más eficiente que el L298N; STBY en HIGH para operar.' },
          { term: 'DRV8833', value: 'IN1/IN2 o PWM+PH; 1.5 A por canal', note: 'Muy usado en motores pequeños y robots compactos.' },
          { term: 'A4988', value: 'STEP, DIR, ENABLE, MS1/MS2/MS3; hasta ~1 A por fase', note: 'Necesita un capacitor de 100 µF en VMOT.' },
          { term: 'DRV8825', value: 'STEP, DIR, ENABLE, M0/M1/M2; hasta ~1.5 A, microstepping 1/32', note: 'Más corriente y resolución que el A4988.' },
          { term: 'TMC2209', value: 'STEP/DIR con UART; microstepping hasta 1/256, silencioso', note: 'StealthChop reduce el ruido; SpreadCycle da más par.' },
          { term: 'Puente H', value: 'Cuatro interruptores para invertir la polaridad del motor', note: 'Nunca actives simultaneously los dos de una misma rama: cortocircuito.' },
        ],
      },
      {
        title: 'Ecuaciones y cálculo',
        items: [
          { term: 'Duty a tensión', value: 'Vmedia = duty · Vbus', note: 'Con duty de 0 a 1; en Arduino, duty = valor/255.' },
          { term: 'Duty para una velocidad', value: 'duty ≈ ω · Ke / Vbus', note: 'Añade compensación de back-EMF en lazo cerrado.' },
          { term: 'Velocidad lineal', value: 'v = ω · r  (r = radio de la rueda)', note: 'Convierte rad/s a m/s antes de usar odometría.' },
          { term: 'Odometría diferencial', value: 'v = (vr + vl)/2 ; ωz = (vr - vl)/L', note: 'L es la distancia entre ruedas.' },
          { term: 'Cuentas a distancia', value: 'd = 2·π·r · pulsos / (CPR · reduction)', note: 'Aplica la reducción del motor antes del radio de la rueda.' },
          { term: 'Par en la rueda', value: 'τrueda = τmotor · N · η', note: 'N es la reducción y η la eficiencia del tren.' },
          { term: 'Energía cinética', value: 'Ec = 0.5 · m · v² + 0.5 · I · ω²', note: 'Útil para estimar la energía que debe disipar el freno.' },
          { term: 'Corriente total del sistema', value: 'Itotal = Imotores + Ielectronica + margen(20 a 50%)', note: 'Dimensiona fuente y fusibles con el pico de arranque.' },
        ],
      },
    ],
  },

  /* =====================================================================
     7. SENSORES IMU, TOF Y LIDAR
     ===================================================================== */
  {
    id: 'sensores',
    title: 'Sensores IMU, ToF y lidar: rangos y fórmulas',
    track: 'robotica',
    description: 'Rangos típicos, resolución, ecuaciones y buenas prácticas de IMUs, sensores ToF y lidars 2D/3D.',
    groups: [
      {
        title: 'IMU',
        items: [
          { term: 'Acelerómetro', value: 'Mide aceleración específica en m/s² o g; típico ±2/4/8/16 g', note: 'En reposo mide ~1 g apuntando hacia arriba, no cero.' },
          { term: 'Giroscopio', value: 'Mide velocidad angular en °/s o rad/s; típico ±250/500/1000/2000 °/s', note: 'Menor rango da mayor resolución y menos ruido.' },
          { term: 'MPU6050', value: 'IMU de 6 ejes, I2C 0x68/0x69, acel ±2g, giro ±250 °/s', note: 'Incluye DMP para fusión de datos en el propio chip.' },
          { term: 'MPU9250 / ICM20948', value: '9 ejes: acel + giro + magnetómetro', note: 'El magnetómetro necesita calibración dura y blanda.' },
          { term: 'Integración de giro', value: 'θ(t) = θ0 + ∫ ω dt  →  θ += ω · Δt', note: 'El error se acumula: el bias produce deriva lineal con el tiempo.' },
          { term: 'Doble integración de acel', value: 'v += a · Δt ; p += v · Δt', note: 'La posición diverge en segundos; por eso se fusiona con GPS o visión.' },
          { term: 'Pitch y roll desde acel', value: 'pitch = atan2(ax, sqrt(ay² + az²)); roll = atan2(ay, az)', note: 'Solo válido en reposo o movimiento suave, sin aceleraciones lineales.' },
          { term: 'Efecto de la gravedad', value: 'Compensa restando el vector g medido en calibración', note: 'Sin esta compensación el pitch/roll se sesga al acelerar.' },
        ],
      },
      {
        title: 'Sensores ToF',
        items: [
          { term: 'Principio', value: 'Mide el tiempo de vuelo de un pulso de luz: d = c · Δt / 2', note: 'El factor 1/2 es por el camino de ida y vuelta.' },
          { term: 'VL53L0X', value: 'Rango típico 0.03 a 2 m, interfaz I2C en la dirección 0x29', note: 'Necesita calibración de offset y crosstalk para medidas fiables.' },
          { term: 'VL53L1X', value: 'Rango hasta 4 m, FOV programable, I2C 0x29', note: 'Permite definir una región de interés (ROI) sobre el sensor.' },
          { term: 'TFmini / TFmini Plus', value: 'ToF infrarrojo 0.1 a 12 m, salida UART o I2C', note: 'Mejor en exteriores que el VL53L0X, aunque con menor precisión.' },
          { term: 'Resolución', value: 'Depende del tiempo de integración: más tiempo, más precisión y menos velocidad', note: 'Un modo rápido puede dar 1 cm de resolución a 50 Hz.' },
          { term: 'Superficies problemáticas', value: 'Negro absorbente, cristal y superficies inclinadas devuelven poca señal', note: 'La luz solar intensa también degrada la medida.' },
          { term: 'Filtrado recomendado', value: 'Mediana de 5 muestras + filtro de Kalman o complementario', note: 'La mediana elimina outliers antes de suavizar.' },
        ],
      },
      {
        title: 'Lidar',
        items: [
          { term: 'Lidar 2D (RPLidar A1)', value: '360°, 0.12 a 12 m, ~2000 muestras/s, UART 115200', note: 'Publica sensor_msgs/LaserScan en ROS 2.' },
          { term: 'YDLIDAR X4', value: '360°, hasta 10 m, 10 Hz típico', note: 'Verifica el puerto serie y los permisos antes de culpabilizar al driver.' },
          { term: 'Lidar 3D (Livox MID-360)', value: 'Nubes de puntos 3D, ciego ~0.1 m, rango decenas de metros', note: 'Requiere sincronización de tiempo y calibración extrínseca.' },
          { term: 'LaserScan', value: 'ranges[] + angle_min + angle_max + angle_increment', note: 'Índice: i = (ángulo - angle_min) / angle_increment.' },
          { term: 'Conversión polar a cartesiana', value: 'x = r·cos(θ), y = r·sin(θ)', note: 'θ = angle_min + i·angle_increment.' },
          { term: 'PointCloud2', value: 'Nube de puntos con campos x, y, z e intensidad', note: 'En ROS 2 se convierte con laser_geometry o depthimage_to_laserscan.' },
          { term: 'Frecuencia de escaneo', value: 'Típico 5 a 20 Hz en lidars 2D', note: 'A más velocidad del robot, másHz necesitas para no deformar el mapa.' },
        ],
      },
      {
        title: 'Fusión y filtros',
        items: [
          { term: 'Filtro complementario', value: 'θ = α·(θ + ω·Δt) + (1-α)·θacel', note: 'α típico 0.95 a 0.98: confía en el giro a corto plazo y en el acel a largo plazo.' },
          { term: 'Filtro de Kalman', value: 'Predicción con modelo + corrección con medición ponderada por ganancia K', note: 'K crece cuando la medición es fiable y decrece cuando lo es el modelo.' },
          { term: 'Madgwick / Mahony', value: 'Algoritmos de fusión de 9 ejes que corrigen la deriva del giro', note: 'Madgwick es más simple; Mahony permite ganancias ajustables.' },
          { term: 'Calibración de bias', value: 'Promedia el giroscopio en reposo durante 2 a 5 s y resta el valor', note: 'Repite la calibración tras cambios de temperatura.' },
          { term: 'Sincronización temporal', value: 'Sella cada muestra con el mismo reloj del sistema', note: 'En ROS 2 usa el tiempo del relój, no timestamps del sensor.' },
          { term: 'Detección de outliers', value: 'Descarta lecturas fuera de rango o con salto grande frente a la anterior', note: 'Un solo punto falso puede arruinar un SLAM o un filtro.' },
        ],
      },
      {
        title: 'Cálculos de rango y resolución',
        items: [
          { term: 'Resolución del ADC del sensor', value: 'Resolución = rango / 2^bits', note: '12 bits sobre 3.3 V dan ~0.8 mV por cuenta.' },
          { term: 'Error de ángulo lidar', value: 'Error lateral = r · sin(Δθ) ≈ r · Δθ', note: 'A 10 m y 1° de error, la desviación lateral es ~17 cm.' },
          { term: 'Precisión requerida', value: 'σ = resolución · √12 para ruido cuantizado uniforme', note: 'Útil para elegir entre sensores con distinta resolución.' },
          { term: 'Tiempo de integración', value: 'Δt ≥ 1 / frecuencia de muestreo deseada', note: 'Un sensor ToF a 50 Hz tiene como máximo 20 ms por muestra.' },
          { term: 'Cobertura de cámara', value: 'FOV = 2 · atan(sensor_width / (2·f))', note: 'Relaciona distancia focal y campo de visión.' },
          { term: 'Margen de seguridad', value: 'Distancia de parada = v·t_reacción + v²/(2·a_frenado)', note: 'Añade el retardo del sensor al tiempo de reacción.' },
        ],
      },
    ],
  },

  /* =====================================================================
     8. COMANDOS ROS 2 ESENCIALES
     ===================================================================== */
  {
    id: 'ros2',
    title: 'Comandos ROS 2 esenciales',
    track: 'robotica',
    description: 'Los comandos de línea de órdenes que necesitas para inspeccionar, publicar, depurar y grabar un sistema ROS 2.',
    groups: [
      {
        title: 'Nodos y topics',
        items: [
          { term: 'ros2 node list', value: 'ros2 node list', note: 'Muestra todos los nodos activos en el grafo.' },
          { term: 'ros2 node info', value: 'ros2 node info /turtlebot', note: 'Lista publicadores, suscriptores, servicios y acciones de un nodo.' },
          { term: 'ros2 topic list', value: 'ros2 topic list', note: 'Añade -t para ver el tipo de mensaje de cada topic.' },
          { term: 'ros2 topic info', value: 'ros2 topic info /scan -v', note: 'Muestra tipo, número de publicadores y suscriptores y QoS.' },
          { term: 'ros2 topic hz', value: 'ros2 topic hz /scan', note: 'Mide la frecuencia real de publicación; esencial para diagnosticar.' },
          { term: 'ros2 topic bw', value: 'ros2 topic bw /image_raw', note: 'Muestra el ancho de banda en MB/s del topic.' },
          { term: 'ros2 topic echo', value: 'ros2 topic echo /odom --field pose.pose.position', note: 'Imprime mensajes en vivo; --field filtra un campo.' },
          { term: 'ros2 topic type', value: 'ros2 topic type /cmd_vel', note: 'Devuelve el tipo, por ejemplo geometry_msgs/msg/Twist.' },
          { term: 'ros2 interface show', value: 'ros2 interface show geometry_msgs/msg/Twist', note: 'Muestra la definición completa de un mensaje.' },
        ],
      },
      {
        title: 'Publicar y suscribir',
        items: [
          { term: 'publicar Twist', value: 'ros2 topic pub /cmd_vel geometry_msgs/msg/Twist \"{linear: {x: 0.2}}\"', note: 'Añade -r 10 para publicar a 10 Hz de forma continua.' },
          { term: 'publicar una vez', value: 'ros2 topic pub -1 /cmd_vel geometry_msgs/msg/Twist \"{linear: {x: 0.2}}\"', note: '-1 envía un solo mensaje y termina.' },
          { term: 'publicarPose', value: 'ros2 topic pub /initialpose geometry_msgs/msg/PoseWithCovarianceStamped \"{...}\"', note: 'Útil para reubicar el robot en RViz.' },
          { term: 'suscribir con python', value: 'create_subscription(Twist, /cmd_vel, callback, 10)', note: 'El último argumento es la profundidad de la cola (QoS).' },
          { term: 'publicar con python', value: 'node.create_publisher(LaserScan, /scan, 10)', note: 'Usa self.get_clock().now().to_msg() para el timestamp.' },
          { term: 'qos override', value: 'ros2 topic echo /camera --qos-reliability best_effort', note: 'Permite suscribirse aunque el QoS no coincida por defecto.' },
        ],
      },
      {
        title: 'Servicios y acciones',
        items: [
          { term: 'ros2 service list', value: 'ros2 service list -t', note: 'Muestra servicios con su tipo.' },
          { term: 'ros2 service type', value: 'ros2 service type /set_map', note: 'Devuelve el tipo de servicio.' },
          { term: 'ros2 service call', value: 'ros2 service call /spawn turtlesim/srv/Spawn \"{x: 2, y: 2}\"', note: 'Los argumentos se pasan como diccionario YAML.' },
          { term: 'ros2 interface show srv', value: 'ros2 interface show std_srvs/srv/SetBool', note: 'Muestra la parte de request y response.' },
          { term: 'ros2 action list', value: 'ros2 action list -t', note: 'Lista acciones y sus tipos.' },
          { term: 'ros2 action send_goal', value: 'ros2 action send_goal /rotate_absolute turtlebot3_msgs/action/RotateAbsolute \"{theta: 1.57}\" --feedback', note: '--feedback muestra el progreso del objetivo.' },
        ],
      },
      {
        title: 'Parámetros',
        items: [
          { term: 'ros2 param list', value: 'ros2 param list', note: 'Añade el nombre del nodo para ver solo los suyos.' },
          { term: 'ros2 param get', value: 'ros2 param get /robot_state_publisher use_sim_time', note: 'Devuelve el valor y el tipo.' },
          { term: 'ros2 param set', value: 'ros2 param set /lidar_node port /dev/ttyUSB0', note: 'Cambia el valor en caliente si el nodo lo permite.' },
          { term: 'ros2 param dump', value: 'ros2 param dump /nav2_planner > planner.yaml', note: 'Guarda todos los parámetros en YAML para reutilizarlos.' },
          { term: 'ros2 param load', value: 'ros2 param load /nav2_planner planner.yaml', note: 'Carga un archivo de parámetros en un nodo.' },
          { term: 'declarar parámetro', value: 'self.declare_parameter(\"max_speed\", 0.5)', note: 'Usa self.get_parameter(\"max_speed\").value para leerlo.' },
        ],
      },
      {
        title: 'Launch, entorno y diagnóstico',
        items: [
          { term: 'ros2 launch', value: 'ros2 launch mi_paquete robot.launch.py use_sim_time:=true', note: 'Los argumentos se pasan con nombre:=valor.' },
          { term: 'ros2 run', value: 'ros2 run mi_paquete mi_nodo --ros-args -p freq:=10.0', note: '-p define un parámetro desde la línea de órdenes.' },
          { term: 'colcon build', value: 'colcon build --symlink-install', note: '--symlink-install evita recompilar al cambiar archivos Python o YAML.' },
          { term: 'source entorno', value: 'source /opt/ros/humble/setup.bash && source install/setup.bash', note: 'Hay que hacerlo en cada terminal nueva o añadirlo al .bashrc.' },
          { term: 'ROS_DOMAIN_ID', value: 'export ROS_DOMAIN_ID=42', note: 'Aísla robots o pruebas en la misma red; el valor va de 0 a 101.' },
          { term: 'ros2 doctor', value: 'ros2 doctor --report', note: 'Detecta versiones mezcladas, red y configuración problemática.' },
          { term: 'ros2 pkg', value: 'ros2 pkg executables turtlebot3_navigation2', note: 'Lista los ejecutables de un paquete instalado.' },
          { term: 'rqt_graph', value: 'rqt_graph', note: 'Dibuja el grafo de nodos y topics en tiempo real.' },
        ],
      },
      {
        title: 'Bags y gráficos',
        items: [
          { term: 'ros2 bag record', value: 'ros2 bag record -o salida /scan /odom /tf', note: 'Graba topics concretos; -a graba todos.' },
          { term: 'ros2 bag info', value: 'ros2 bag info salida', note: 'Muestra duración, mensajes y tipo de cada topic.' },
          { term: 'ros2 bag play', value: 'ros2 bag play salida --clock -r 0.5', note: '--clock publica tiempo simulado; -r cambia la velocidad de reproducción.' },
          { term: 'rviz2', value: 'rviz2 -d configuracion.rviz', note: 'Carga una configuración guardada de RViz.' },
          { term: 'rqt_reconfigure', value: 'ros2 run rqt_reconfigure rqt_reconfigure', note: 'Ajusta parámetros dinámicos con interfaz gráfica.' },
        ],
      },
    ],
  },

  /* =====================================================================
     9. TF2 Y URDF
     ===================================================================== */
  {
    id: 'tf2-urdf',
    title: 'tf2 y URDF: snippet de referencia',
    track: 'robotica',
    description: 'Comandos de tf2, estructura de un URDF válido y los errores más frecuentes al publicar transformaciones.',
    groups: [
      {
        title: 'Comandos tf2',
        items: [
          { term: 'ros2 tf2_tools view_frames', value: 'ros2 run tf2_tools view_frames', note: 'Genera un PDF con el árbol de transformaciones.' },
          { term: 'ros2 tf2_monitor', value: 'ros2 run tf2_ros tf2_monitor', note: 'Muestra retrasos y tasas de publicación de cada transformación.' },
          { term: 'transform echo', value: 'ros2 run tf2_ros tf2_echo map base_link', note: 'Imprime la transformación entre dos marcos en vivo.' },
          { term: 'static_transform_publisher', value: 'ros2 run tf2_ros static_transform_publisher 0 0 0.1 0 0 0 map odom', note: 'Argumentos: x y z yaw pitch roll (o quaternion) padre hijo.' },
          { term: 'publicar con quaternion', value: 'static_transform_publisher --x 0 --z 0.1 --qz 0.707 --qw 0.707 --frame-id map --child-frame-id odom', note: 'La forma explícita evita confusiones entre yaw/pitch/roll.' },
          { term: 'TF en Python', value: 'TransformBroadcaster().send_transform(TransformStamped())', note: 'Rellena header.stamp con el tiempo del reloj del nodo.' },
          { term: 'TF estático en launches', value: 'Node(package=\"tf2_ros\", executable=\"static_transform_publisher\", arguments=[...])', note: 'Úsalo para sensores fijos al chasis.' },
          { term: 'tf2_geometry_msgs', value: 'tf2_geometry_msgs.do_transform_pose(pose, transform)', note: 'Necesario para transformar poses, no solo puntos.' },
        ],
      },
      {
        title: 'Conceptos de TF',
        items: [
          { term: 'Árbol de marcos', value: 'Cada marco tiene exactamente un padre', note: 'No puede haber ciclos: eso rompe la búsqueda de transformaciones.' },
          { term: 'Cadena típica', value: 'map → odom → base_link → base_laser / camera_link', note: 'map es casi estático; odom se mueve sin salto; base_link es el cuerpo del robot.' },
          { term: 'map a odom', value: 'Lo publica SLAM o AMCL y corrige la deriva de la odometría', note: 'Puede saltar cuando se reubica el robot; por eso no debe publicarlo el driver.' },
          { term: 'odom a base_link', value: 'Lo publica la odometría de ruedas o IMU, continuo y sin saltos', note: 'Debe ser suave incluso si la estimación se desvía.' },
          { term: 'Convención de ejes', value: 'Eje X adelante, Y izquierda, Z arriba (convención ROS)', note: 'En visión, la cámara suele tener Z adelante, X derecha, Y abajo.' },
          { term: 'Lookup con tiempo', value: 'buffer.lookup_transform(target, source, rclpy.time.Time())', note: 'Time() = más reciente disponible; usa un tiempo concreto para datos pasados.' },
          { term: 'Extrapolación', value: 'tf2 puede extrapolar un poco, pero no demasiado', note: 'Errores de timestamp suelen aparecer como fallos de extrapolación.' },
        ],
      },
      {
        title: 'Etiquetas URDF',
        items: [
          { term: 'robot', value: '<robot name=\"mi_robot\"> ... </robot>', note: 'Etiqueta raíz obligatoria.' },
          { term: 'link', value: '<link name=\"base_link\"> con visual, collision e inertial', note: 'collision se usa para planificación; visual para RViz.' },
          { term: 'joint', value: '<joint name=\"joint1\" type=\"revolute\">', note: 'Tipos: fixed, revolute, continuous, prismatic, floating, planar.' },
          { term: 'parent / child', value: '<parent link=\"base_link\"/><child link=\"link1\"/>', note: 'Definen la dirección de la transformación.' },
          { term: 'origin', value: '<origin xyz=\"0 0 0.1\" rpy=\"0 0 0\"/>', note: 'Traslación en metros y rotación en radianes.' },
          { term: 'axis', value: '<axis xyz=\"0 0 1\"/>', note: 'Eje de rotación o traslación de la articulación.' },
          { term: 'limit', value: '<limit lower=\"-1.57\" upper=\"1.57\" effort=\"10\" velocity=\"2\"/>', note: 'Obligatorio en revolute y prismatic.' },
          { term: 'xacro:property', value: '<xacro:property name=\"ancho\" value=\"0.3\"/>', note: 'xacro añade macros y variables para no repetir valores.' },
        ],
      },
      {
        title: 'Snippet URDF / xacro',
        items: [
          { term: 'Cabecera xacro', value: '<robot xmlns:xacro=\"http://www.ros.org/wiki/xacro\" name=\"mi_robot\">', note: 'Necesario para usar propiedades y macros.' },
          { term: 'Link base', value: '<link name=\"base_link\"><visual><geometry><box size=\"0.3 0.2 0.1\"/></geometry></visual></link>', note: 'Añade también <collision> con la misma geometría.' },
          { term: 'Joint continuo', value: '<joint name=\"wheel_joint\" type=\"continuous\"><parent link=\"base_link\"/><child link=\"wheel\"/><axis xyz=\"0 1 0\"/></joint>', note: 'continuous no tiene límites: ideal para ruedas.' },
          { term: 'Inercia simplificada', value: '<inertial><mass value=\"1.0\"/><inertia ixx=\"0.01\" ixy=\"0\" ixz=\"0\" iyy=\"0.01\" iyz=\"0\" izz=\"0.01\"/></inertial>', note: 'URDF exige la matriz de inercia, aunque sea aproximada.' },
          { term: 'Sensor sobre link', value: '<gazebo reference=\"base_link\"><sensor name=\"lidar\" type=\"ray\"> ... </sensor></gazebo>', note: 'Las etiquetas de Gazebo van dentro del bloque gazebo.' },
          { term: 'Validar URDF', value: 'check_urdf mi_robot.urdf', note: 'Instalable con sudo apt install liburdfdom-tools.' },
        ],
      },
      {
        title: 'Errores comunes',
        items: [
          { term: 'Marco duplicado', value: 'Dos nodos publican el mismo frame_id', note: 'tf2 avisa con un warning y la transformación puede saltar.' },
          { term: 'Ciclo en el árbol', value: 'A → B y B → A', note: 'Rompe la cadena: revisa quién publica cada enlace.' },
          { term: 'Timestamp en el pasado', value: 'Datos con tiempo anterior al buffer disponible', note: 'Sincroniza relojes o usa el tiempo del sistema para todo.' },
          { term: 'Marcos con prefijo', value: 'Usar /base_link en vez de base_link', note: 'En ROS 2 los frame_id no deben empezar por barra.' },
          { term: 'Olvidar use_sim_time', value: 'Nodos desincronizados entre simulación y tiempo real', note: 'Pon el parámetro use_sim_time:=true en todos los nodos al usar Gazebo o bags.' },
          { term: 'Gravedad / ejes', value: 'Robot que cae o gira mal en RViz', note: 'Revisa que Z apunte arriba y que las masas e inercias sean coherentes.' },
        ],
      },
    ],
  },

  /* =====================================================================
     10. NAV2 Y SLAM
     ===================================================================== */
  {
    id: 'nav2-slam',
    title: 'Nav2 y SLAM: parámetros y comandos',
    track: 'robotica',
    description: 'Comandos de Navigation 2 y slam_toolbox, parámetros del costmap y de los planners, y marcos típicos.',
    groups: [
      {
        title: 'Comandos Nav2',
        items: [
          { term: 'arrancar nav2', value: 'ros2 launch nav2_bringup bringup_launch.py use_sim_time:=true map:=mapa.yaml', note: 'Levanta map server, AMCL, planner, controller y recovery.' },
          { term: 'slam launch', value: 'ros2 launch slam_toolbox online_async_launch.py use_sim_time:=true', note: 'Crea el mapa mientras teleoperas el robot.' },
          { term: 'guardar mapa', value: 'ros2 run nav2_map_server map_saver_cli -f mapa', note: 'Genera mapa.pgm y mapa.yaml; hay que hacerlo antes de apagar el nodo.' },
          { term: 'RViz con Nav2', value: 'ros2 launch nav2_bringup rviz_launch.py', note: 'Carga la configuración con los paneles de navegación.' },
          { term: 'Goal con RViz', value: 'Botón 2D Goal Pose sobre el mapa', note: 'Publica en /goal_pose como PoseStamped.' },
          { term: 'goal por terminal', value: 'ros2 topic pub /goal_pose geometry_msgs/msg/PoseStamped \"{header: {frame_id: map}, pose: {position: {x: 1.0, y: 0.5}}}\"', note: 'Necesita el quaternion de orientación; (0,0,0,1) es válido.' },
          { term: 'cancelar objetivo', value: 'ros2 action send_goal /navigate_to_pose nav2_msgs/action/NavigateToPose ...', note: 'También se cancela desde el panel de RViz.' },
          { term: 'ver estado BT', value: 'ros2 topic echo /behavior_tree_log', note: 'El árbol de comportamiento explica por qué el robot se queda parado.' },
        ],
      },
      {
        title: 'Costmap',
        items: [
          { term: 'global_costmap', value: 'Planificación a largo plazo sobre el mapa estático', note: 'Actualización lenta; usa el mapa YAML como capa estática.' },
          { term: 'local_costmap', value: 'Evitación de obstáculos en tiempo real, ventana rodante', note: 'Típico 3x3 m alrededor del robot.' },
          { term: 'robot_radius', value: 'robot_radius: 0.22  (o footprint poligonal)', note: 'Un valor demasiado grande hace que el robot no quepa por pasillos.' },
          { term: 'inflation_radius', value: 'inflation_radius: 0.30', note: 'Añade margen de seguridad alrededor de los obstáculos.' },
          { term: 'cost_scaling_factor', value: 'cost_scaling_factor: 5.0', note: 'Más alto = penalización más agresiva cerca de obstáculos.' },
          { term: 'resolution', value: 'resolution: 0.05  (5 cm por celda)', note: 'Más fina da mejor precisión pero más cómputo.' },
          { term: 'observation_range', value: 'Dentro de las capas laser/obstacle: max_obstacle_height, raytrace_max_range', note: 'Filtra suelo y techos para no marcarlos como obstáculos.' },
        ],
      },
      {
        title: 'Planificadores y controladores',
        items: [
          { term: 'NavFn / ThetaStar', value: 'Planificadores globales basados en cuadrícula', note: 'NavFn es Dijkstra rápido; ThetaStar suaviza la trayectoria.' },
          { term: 'SmacPlanner2D', value: 'Planificador global moderno basado en A* sobre el costmap', note: 'Es el recomendado en distribuciones recientes.' },
          { term: 'DWB / TEB', value: 'Controladores locales (DWB en Nav2, TEB como alternativa)', note: 'DWB evalúa trayectorias candidatas con críterios de velocidad y distancia.' },
          { term: 'max_vel_x', value: 'max_vel_x: 0.5  (m/s)', note: 'Ajusta según el espacio y la inercia del robot.' },
          { term: 'acc_lim_x', value: 'acc_lim_x: 1.0  (m/s²)', note: 'Límites de aceleración suaves evitan vuelcos y derrapes.' },
          { term: 'xy_goal_tolerance', value: 'xy_goal_tolerance: 0.15  (m)', note: 'Si es demasiado estricta, el robot oscila sin llegar a darse por logrado.' },
          { term: 'transform_tolerance', value: 'transform_tolerance: 0.1  (s)', note: 'Sube el valor si aparecen errores de transformación por latencia.' },
        ],
      },
      {
        title: 'SLAM',
        items: [
          { term: 'slam_toolbox modo', value: 'mode:=mapping para crear; mode:=localization para solo localizar', note: 'En localización usa el mapa guardado y no lo modifica.' },
          { term: 'map_update_interval', value: 'map_update_interval: 2.0  (s)', note: 'Cada cuánto se publica el mapa actualizado.' },
          { term: 'max_laser_range', value: 'max_laser_range: 12.0  (m)', note: 'Debe coincidir con el rango real del lidar.' },
          { term: 'minimum_travel_distance', value: 'minimum_travel_distance: 0.2  (m)', note: 'Distancia mínima entre escaneos aceptados para ahorrar cómputo.' },
          { term: 'loop_closure', value: 'Cierra el lazo cuando vuelve a un lugar ya visto', note: 'Corrige la deriva; si falla, el mapa se deforma.' },
          { term: 'AMCL', value: 'Localización con filtro de partículas sobre mapa conocido', note: 'Publica la transformación map → odom.' },
          { term: 'Reubicar', value: 'Botón 2D Pose Estimate en RViz o topic /initialpose', note: 'Esencial cuando el robot se pierde al arrancar.' },
        ],
      },
      {
        title: 'Tópicos, marcos y depuración',
        items: [
          { term: 'map → odom', value: 'Publicado por AMCL o SLAM', note: 'Puede saltar al reubicar; es la corrección de la odometría.' },
          { term: 'odom → base_link', value: 'Publicado por la odometría de ruedas', note: 'Debe ser continuo y sin discontinuidades.' },
          { term: '/scan', value: 'sensor_msgs/msg/LaserScan del lidar', note: 'Si falta, Nav2 no puede evitar obstáculos.' },
          { term: '/goal_pose', value: 'geometry_msgs/msg/PoseStamped con frame_id map', note: 'El destino debe estar en una celda libre del costmap.' },
          { term: '/cmd_vel', value: 'geometry_msgs/msg/Twist hacia la base', note: 'Solo un nodo debe publicar aquí a la vez.' },
          { term: 'Robot parado', value: 'Revisa /behavior_tree_log, /controller_server y el costmap en RViz', note: 'Casi siempre es un objetivo en zona inflada o un TF desactualizado.' },
        ],
      },
    ],
  },

  /* =====================================================================
     11. CONTROL PID Y FÓRMULAS DE CONTROL
     ===================================================================== */
  {
    id: 'pid',
    title: 'Control PID y fórmulas de control',
    track: 'robotica',
    description: 'La ecuación PID, el efecto de cada término, métodos de sintonización y métricas de respuesta temporal.',
    groups: [
      {
        title: 'Ecuación PID',
        items: [
          { term: 'Ecuación continua', value: 'u(t) = Kp·e(t) + Ki·∫e(t)dt + Kd·de(t)/dt', note: 'e(t) = consigna - medición.' },
          { term: 'Versión discreta', value: 'u[k] = Kp·e[k] + Ki·Ts·Σe[i] + Kd·(e[k]-e[k-1])/Ts', note: 'Ts es el periodo de muestreo en segundos.' },
          { term: 'Error', value: 'e[k] = setpoint[k] - measurement[k]', note: 'Si el signo está invertido, el lazo se vuelve positivo y diverge.' },
          { term: 'Tiempo de muestreo', value: 'Ts pequeño y constante; típico 1 a 20 ms en motores', note: 'Un Ts irregular degrada el término derivativo.' },
          { term: 'Salida limitada', value: 'u = clamp(u, u_min, u_max)', note: 'Imprescindible para no saturar el actuador.' },
          { term: 'Anti-windup', value: 'Congelar o limitar el integrador cuando la salida está saturada', note: 'Sin esto, el integrador acumula un error enorme y aparece un gran sobreimpulso.' },
        ],
      },
      {
        title: 'Efecto de los términos',
        items: [
          { term: 'Kp (proporcional)', value: 'Reduce el error y acelera la respuesta', note: 'Muy alto produce oscilaciones e inestabilidad.' },
          { term: 'Ki (integral)', value: 'Elimina el error estacionario', note: 'Muy alto causa sobreimpulso, lentitud y windup.' },
          { term: 'Kd (derivativo)', value: 'Aporta amortiguación y anticipa la tendencia', note: 'Amplifica el ruido de la medición; conviene filtrarlo.' },
          { term: 'Filtro del derivativo', value: 'D_filt = Kd·(e[k]-e[k-1])/(Ts + τf)', note: 'τf suave (0.01 a 0.1 s) reduce el ruido sin perder demasiado efecto.' },
          { term: 'Solo P', value: 'Deja error estacionario salvo que la planta tenga integrador natural', note: 'Suficiente en muchos seguidores de línea.' },
          { term: 'PI vs PID', value: 'PI es común en velocidad; PID en posición', note: 'La velocidad rara vez necesita derivativo porque ya está amortiguada.' },
        ],
      },
      {
        title: 'Formas y variantes',
        items: [
          { term: 'Forma ideal / paralela', value: 'Kp, Ki, Kd independientes', note: 'Es la que usan la mayoría de librerías y la más intuitiva.' },
          { term: 'Forma estándar', value: 'u = Kp·(e + (1/Ti)·∫e dt + Td·de/dt)', note: 'Ti = Kp/Ki y Td = Kd/Kp; más fácil de sintonizar por tiempos.' },
          { term: 'Control por velocidad (cascada)', value: 'Lazo externo de posición → consigna de velocidad → lazo interno', note: 'El lazo interno debe ser 3 a 10 veces más rápido.' },
          { term: 'Feedforward', value: 'u = u_PID + kff·setpoint_derivative', note: 'Mejora el seguimiento de consignas cambiantes sin subir Kp.' },
          { term: 'PID con ganancia programada', value: 'Kp, Ki, Kd variables según el punto de operación', note: 'Útil cuando la planta cambia, por ejemplo un brazo en distintas posturas.' },
          { term: 'Control en tiempo real', value: 'Bucle determinista con interrupciones o hilos con prioridad', note: 'Un jitter alto en Ts arruina un PID bien sintonizado.' },
        ],
      },
      {
        title: 'Sintonización',
        items: [
          { term: 'Ziegler-Nichols oscilación', value: 'Subir Kp hasta oscilación sostenida (Ku, Tu); Kp=0.6Ku, Ti=Tu/2, Td=Tu/8', note: 'Agresivo: produce sobreimpulso ~25%; útil como punto de partida.' },
          { term: 'Ziegler-Nichols respuesta', value: 'Curva en S: Kp=1.2·T/L, Ti=2L, Td=0.5L', note: 'L es el retardo y T la constante de tiempo de la curva.' },
          { term: 'Método de Cohen-Coon', value: 'Basado en L y T; más preciso que ZN para plantas con retardo', note: 'También tiende a respuestas agresivas.' },
          { term: 'Sintonización manual', value: '1) Kp hasta respuesta rápida 2) Kd para amortiguar 3) Ki para el error residual', note: 'El orden importa: añadir Ki demasiado pronto enmascara los otros efectos.' },
          { term: 'Autotuning', value: 'El controlador excita la planta y estima parámetros (relay, step response)', note: 'PID Autotune de Arduino es un ejemplo accesible.' },
          { term: 'Objetivo de fase/margen', value: 'Margen de fase 45 a 60°, margen de ganancia 6 a 10 dB', note: 'Criterio clásico de robustez en frequency domain.' },
          { term: 'Probar perturbaciones', value: 'Añade un escalón en la consigna y una perturbación en la carga', note: 'Un buen ajuste se juzga con ambos, no solo con el escalón.' },
        ],
      },
      {
        title: 'Métricas de respuesta',
        items: [
          { term: 'Sobreimpulso (overshoot)', value: 'Mp = (max - final) / final · 100%', note: 'Objetivo típico: menos del 10 al 20%.' },
          { term: 'Tiempo de subida', value: 'Tiempo para pasar del 10% al 90% del valor final', note: 'Mide qué tan rápida es la respuesta.' },
          { term: 'Tiempo de establecimiento', value: 'Tiempo hasta entrar y permanecer en una banda del 2% o 5%', note: 'Aproximadamente 4·τ para un sistema de primer orden.' },
          { term: 'Error estacionario', value: 'ess = lím e(t) cuando t → infinito', note: 'Se elimina con un integrador si la planta es estable.' },
          { term: 'Error cuadrático medio', value: 'IAE = ∫|e|dt ; ITAE = ∫t·|e|dt', note: 'ITAE penaliza los errores prolongados; es un buen criterio de sintonización.' },
          { term: 'Amortiguamiento ζ', value: 'ζ < 1 subamortiguado, ζ = 1 crítico, ζ > 1 sobreamortiguado', note: 'El compromiso habitual está en ζ ≈ 0.6 a 0.8.' },
          { term: 'Frecuencia natural', value: 'ωn: rapidez del sistema de segundo orden', note: 'Junto con ζ define por completo la respuesta de un modelo canónico.' },
        ],
      },
    ],
  },

  /* =====================================================================
     12. CINEMÁTICA Y TRANSFORMADAS
     ===================================================================== */
  {
    id: 'cinematica',
    title: 'Cinemática y transformadas',
    track: 'robotica',
    description: 'Matrices homogéneas, representaciones de rotación, Denavit-Hartenberg y el jacobiano en una sola hoja.',
    groups: [
      {
        title: 'Transformadas homogéneas',
        items: [
          { term: 'Matriz 4x4', value: 'T = [ R  p ; 0 0 0 1 ]', note: 'R es rotación 3x3 y p es traslación 3x1.' },
          { term: 'Composición', value: 'T_AB = T_A · T_B', note: 'El orden importa: las matrices no conmutan.' },
          { term: 'Transformar punto', value: 'p_A = R_AB · p_B + t_AB', note: 'Se escribe p_A = T_AB · [p_B; 1] en forma homogénea.' },
          { term: 'Inversa', value: 'T^-1 = [ Rᵀ  -Rᵀ·p ; 0 0 0 1 ]', note: 'Aprovecha que R es ortogonal: R^-1 = Rᵀ.' },
          { term: 'Traslación pura', value: 'Trans(x,y,z) con R = identidad', note: 'Basta con colocar x, y, z en la última columna.' },
          { term: 'Convención de marcos', value: 'T_AB lleva puntos de B a A', note: 'Mantén una notación consistente para no invertir sentidos.' },
        ],
      },
      {
        title: 'Rotaciones',
        items: [
          { term: 'Rotación X', value: 'Rx(θ) = [[1,0,0],[0,c,-s],[0,s,c]]', note: 'c = cos θ, s = sen θ.' },
          { term: 'Rotación Y', value: 'Ry(θ) = [[c,0,s],[0,1,0],[-s,0,c]]', note: 'Ojo con el signo del término s en la fila superior.' },
          { term: 'Rotación Z', value: 'Rz(θ) = [[c,-s,0],[s,c,0],[0,0,1]]', note: 'Es la más usada en robots móviles (yaw).' },
          { term: 'Roll-pitch-yaw', value: 'R = Rz(ψ)·Ry(θ)·Rx(φ)  (XYZ intrínseco)', note: 'En ROS se usa la convención fija XYZ, que invierte el orden.' },
          { term: 'Cuaternión', value: 'q = (w, x, y, z) con w = cos(θ/2), (x,y,z) = eje·sen(θ/2)', note: 'Evita el bloqueo de gimbal y es más estable que ángulos de Euler.' },
          { term: 'Rotar con cuaternión', value: `p' = q · p · q_conj'`, note: 'En código, usa una librería para no equivocarte en el orden del producto.' },
          { term: 'Euler a cuaternión (ZYZ común)', value: 'Se calcula con tf2 o scipy.spatial.transform.Rotation', note: 'En ROS 2: rclpy.utilities o tf_transformations.euler_to_quaternion.' },
          { term: 'Interpolación SLERP', value: 'Interpola cuaterniones en el camino más corto sobre la esfera', note: 'Lerp normal produce rotaciones no uniformes.' },
        ],
      },
      {
        title: 'Denavit-Hartenberg',
        items: [
          { term: 'Parámetros DH', value: 'a (longitud), α (torsión), d (desplazamiento), θ (ángulo)', note: 'θ es variable en articulaciones rotativas; d en prismáticas.' },
          { term: 'Matriz DH estándar', value: 'T = Rz(θ)·Trans(0,0,d)·Trans(a,0,0)·Rx(α)', note: 'Existen las convenciones clásica y modificada; no las mezcles.' },
          { term: 'Regla del eje z', value: 'El eje z_{i-1} coincide con el eje de la articulación i', note: 'El eje x es la normal común entre z_{i-1} y z_i.' },
          { term: 'Cadena cinemática', value: 'T_0n = T_01 · T_12 · ... · T_(n-1)n', note: 'Cada matriz depende de una articulación.' },
          { term: 'Grados de libertad', value: 'GDL = número de articulaciones independientes', note: 'Un brazo industrial típico tiene 6 GDL.' },
          { term: 'Espacio de trabajo', value: 'Conjunto de posiciones alcanzables por el extremo', note: 'Depende de las longitudes y límites de las articulaciones.' },
        ],
      },
      {
        title: 'Cinemática directa e inversa',
        items: [
          { term: 'Cinemática directa (FK)', value: 'q → T_0n  (de ángulos a pose del extremo)', note: 'Es determinista: una multiplicación de matrices.' },
          { term: 'Cinemática inversa (IK)', value: 'T_0n deseada → q', note: 'Puede tener cero, una o múltiples soluciones.' },
          { term: 'IK analítica', value: 'Solución cerrada, rápida y exacta para geometrías simples', note: 'Aprovecha el hecho de que tres ejes consecutivos se cortan en un punto.' },
          { term: 'IK numérica', value: 'Iterativa: minimiza ||T_actual - T_deseada|| con Jacobian pseudo-inversa', note: 'Más general, pero más lenta y dependiente de la semilla.' },
          { term: 'Pseudo-inversa', value: 'q_dot = J⁺ · x_dot', note: 'J⁺ = Jᵀ·(J·Jᵀ)^-1 cuando J tiene rango completo.' },
          { term: 'Singularidad', value: 'El jacobiano pierde rango y no hay movimiento en cierta dirección', note: 'Evítala con amortiguación (DLS) o restricciones de configuración.' },
        ],
      },
      {
        title: 'Jacobiano y velocidades',
        items: [
          { term: 'Jacobiano geométrico', value: 'x_dot = J(q) · q_dot', note: 'Relaciona velocidades de articulación con velocidad del extremo.' },
          { term: 'Parte lineal', value: 'Jv_i = z_{i-1} × (p_end - p_{i-1})  (articulación rotativa)', note: 'Para prismática, Jv_i = z_{i-1}.' },
          { term: 'Parte angular', value: 'Jw_i = z_{i-1}  (articulación rotativa)', note: 'Es cero para articulaciones prismáticas.' },
          { term: 'Dinámica: ecuación', value: 'M(q)·q_ddot + C(q,q_dot)·q_dot + g(q) = τ', note: 'M es la matriz de masa, C los términos Coriolis y g la gravedad.' },
          { term: 'LQR', value: 'Minimiza ∫(xᵀQx + uᵀRu)dt resolviendo la ecuación de Riccati', note: 'Q penaliza estados y R esfuerzo de control.' },
          { term: 'Diferencial de ruedas', value: 'x_dot = v·cos θ, y_dot = v·sin θ, θ_dot = ω', note: 'Modelo cinemático básico de un robot móvil de dos ruedas.' },
        ],
      },
    ],
  },

  /* =====================================================================
     13. VISIÓN Y CALIBRACIÓN DE CÁMARA
     ===================================================================== */
  {
    id: 'vision-calibracion',
    title: 'Visión y calibración de cámara',
    track: 'robotica',
    description: 'Modelo pinhole, distorsión, calibración con tablero de ajedrez y los snippets de OpenCV más usados.',
    groups: [
      {
        title: 'Modelo de cámara',
        items: [
          { term: 'Matriz intrínseca K', value: 'K = [[fx,0,cx],[0,fy,cy],[0,0,1]]', note: 'f en píxeles; (cx, cy) es el centro óptico.' },
          { term: 'Proyección', value: 'u = fx·X/Z + cx ; v = fy·Y/Z + cy', note: 'Coordenadas 3D en el marco de la cámara.' },
          { term: 'Coordenadas homogéneas', value: '[u, v, 1]ᵀ = K · [X, Y, Z]ᵀ', note: 'La división por Z se hace al normalizar.' },
          { term: 'Campo de visión', value: 'FOVx = 2·atan(W / (2·fx))', note: 'W es el ancho del sensor en píxeles.' },
          { term: 'Desproyección', value: 'X = (u - cx)·Z / fx ; Y = (v - cy)·Z / fy', note: 'Necesitas la profundidad Z para recuperar el punto 3D.' },
          { term: 'Extrínsecos', value: '[R|t] lleva puntos del mundo al marco de la cámara', note: 'En ROS son la transformación camera_link ↔ map/base_link.' },
        ],
      },
      {
        title: 'Distorsión',
        items: [
          { term: 'Coeficientes', value: 'k1, k2, k3 (radial), p1, p2 (tangential)', note: 'OpenCV los devuelve en ese orden.' },
          { term: 'Modelo radial', value: 'x_corr = x·(1 + k1·r² + k2·r⁴ + k3·r⁶)', note: 'r² = x² + y² en coordenadas normalizadas.' },
          { term: 'Distorsión de barril', value: 'k1 negativo: las líneas se curvan hacia afuera', note: 'Típica en lentes gran angular.' },
          { term: 'Distorsión de cojín', value: 'k1 positivo: las líneas se curvan hacia adentro', note: 'Aparece en algunos teleobjetivos.' },
          { term: 'Undistort', value: 'cv2.undistort(img, K, dist)', note: 'Corrige la imagen completa con los parámetros de calibración.' },
          { term: 'Mapas de remapeo', value: 'cv2.initUndistortRectifyMap + cv2.remap', note: 'Calcula los mapas una vez y reutilízalos en cada frame: mucho más rápido.' },
        ],
      },
      {
        title: 'Calibración',
        items: [
          { term: 'Patrón', value: 'Tablero de ajedrez 9x6 o ArUco/ChArUco', note: 'ChArUco es más robusto cuando la imagen está parcialmente ocluida.' },
          { term: 'Número de capturas', value: '15 a 30 imágenes en posiciones y orientaciones variadas', note: 'Cubre bordes, esquinas y distintas distancias.' },
          { term: 'Objetos del mundo', value: 'objpoints: rejilla 3D con cuadrados de tamaño conocido (en metros)', note: 'El tamaño del cuadrado debe ser exacto o la focal saldrá mal.' },
          { term: 'Calibrar', value: 'ret, K, dist, rvecs, tvecs = cv2.calibrateCamera(objpoints, imgpoints, size, None, None)', note: 'Ret es el error RMS; busca valores por debajo de ~0.5 píxel.' },
          { term: 'Guardar parámetros', value: 'np.savez(\"camara.npz\", K=K, dist=dist)', note: 'Guárdalos junto al código para no recalibrar en cada arranque.' },
          { term: 'Error RMS alto', value: 'Suele venir de imágenes borrosas o esquinas mal detectadas', note: 'Descarta capturas movidas y vuelve a calibrar.' },
          { term: 'Calibración ROS', value: 'ros2 run camera_calibration cameracalibrator --size 9x6 --square 0.025', note: 'Publica los resultados y genera un YAML listo para el driver.' },
        ],
      },
      {
        title: 'OpenCV: comandos y snippets',
        items: [
          { term: 'Leer imagen', value: 'img = cv2.imread(\"foto.jpg\")', note: 'OpenCV usa orden BGR, no RGB.' },
          { term: 'Leer video', value: 'cap = cv2.VideoCapture(0); ok, frame = cap.read()', note: 'Libera con cap.release() al terminar.' },
          { term: 'Convertir a gris', value: 'gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)', note: 'Muchas operaciones son más rápidas en escala de grises.' },
          { term: 'Umbral', value: '_, mask = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)', note: 'Otsu: cv2.THRESH_BINARY + cv2.THRESH_OTSU.' },
          { term: 'Contornos', value: 'contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)', note: 'Ordena por área con cv2.contourArea para quedarte con el objeto.' },
          { term: 'Bounding box', value: 'x,y,w,h = cv2.boundingRect(contorno)', note: 'Para cajas rotadas usa cv2.minAreaRect.' },
          { term: 'Filtro gaussiano', value: 'blur = cv2.GaussianBlur(img, (5,5), 0)', note: 'El tamaño del kernel debe ser impar.' },
          { term: 'Canny', value: 'edges = cv2.Canny(gray, 50, 150)', note: 'Los umbrales se ajustan según el contraste de la escena.' },
        ],
      },
      {
        title: 'Geometría epipolar y 3D',
        items: [
          { term: 'Matriz fundamental F', value: 'x2ᵀ · F · x1 = 0', note: 'Relaciona puntos correspondientes entre dos cámaras sin calibrar.' },
          { term: 'Matriz esencial E', value: 'E = t× · R ; x2ᵀ · E · x1 = 0 (coordenadas normalizadas)', note: 'Se obtiene de F con las intrínsecas: E = K2ᵀ·F·K1.' },
          { term: 'Triangulación', value: 'cv2.triangulatePoints(P1, P2, pts1, pts2)', note: 'Reconstruye el punto 3D a partir de dos vistas.' },
          { term: 'PnP', value: 'cv2.solvePnP(objpoints, imgpoints, K, dist)', note: 'Estima la pose de la cámara conociendo un objeto 3D y su proyección.' },
          { term: 'ArUco', value: 'cv2.aruco.detectMarkers(gray, dictionary)', note: ' útil para localización y calibración rápida en el robot.' },
          { term: 'Reproyección de profundidad', value: 'Punto 3D = (u-cx)/fx · Z, (v-cy)/fy · Z, Z', note: 'Es la base de los píxeles a nube de puntos en cámaras RGB-D.' },
        ],
      },
    ],
  },

  /* =====================================================================
     14. LEROBOT Y ROBOT LEARNING
     ===================================================================== */
  {
    id: 'lerobot',
    title: 'LeRobot y comandos de robot learning',
    track: 'robotica',
    description: 'Flujo de trabajo con LeRobot: instalar, grabar demostraciones, entrenar políticas de imitación y evaluarlas.',
    groups: [
      {
        title: 'Instalación y entorno',
        items: [
          { term: 'Clonar e instalar', value: 'git clone https://github.com/huggingface/lerobot.git && pip install -e ./lerobot', note: 'Usa un entorno virtual dedicado con Python 3.10 o superior.' },
          { term: 'Instalar con extras', value: 'pip install -e \".[feetech]\"', note: 'Los extras instalan dependencias de hardware específico (feetech, dynamixel, etc.).' },
          { term: 'Verificar instalación', value: 'python -c \"import lerobot; print(lerobot.__version__)\"', note: 'Si falla, revisa la versión de Python y los drivers USB.' },
          { term: 'Permisos serie', value: 'sudo usermod -aG dialout $USER', note: 'Necesario en Linux para acceder a /dev/ttyUSB sin root.' },
          { term: 'Listar puertos', value: 'ls /dev/ttyUSB*', note: 'En macOS suelen ser /dev/cu.usbserial-*.' },
          { term: 'Configurar robot', value: 'lerobot-setup-motors --robot.type=so100', note: 'Asigna IDs a los servos antes de montar el brazo.' },
        ],
      },
      {
        title: 'Grabación de demostraciones',
        items: [
          { term: 'Calibrar robot', value: 'lerobot-calibrate --robot.type=so100 --robot.port=/dev/ttyUSB0', note: 'Guarda los rangos de cada articulación en un archivo de calibración.' },
          { term: 'Teleoperar', value: 'lerobot-teleoperate --robot.type=so100 --robot.port=/dev/ttyUSB0', note: 'Prueba el lazo de control antes de grabar nada.' },
          { term: 'Grabar dataset', value: 'lerobot-record --robot.type=so100 --dataset.repo_id=usuario/tarea --dataset.num_episodes=50', note: 'Graba episodios con observaciones, acciones y recompensas.' },
          { term: 'Especificar FPS', value: '--dataset.fps=30', note: 'Mantén el mismo FPS en grabación, entrenamiento y evaluación.' },
          { term: 'Número de episodios', value: '50 a 200 para tareas simples de escritorio', note: 'Más episodios y más diversidad mejoran la generalización.' },
          { term: 'Directorio local', value: '--dataset.root=./datos', note: 'Por defecto intenta subir el dataset al Hub de Hugging Face.' },
          { term: 'Calidad de demostración', value: 'Movimientos suaves, sin pausas largas y con el mismo punto inicial', note: 'Los datos malos se aprenden igual de bien que los buenos.' },
        ],
      },
      {
        title: 'Entrenamiento',
        items: [
          { term: 'Entrenar política', value: 'lerobot-train --dataset.repo_id=usuario/tarea --policy.type=act', note: 'ACT es la política de imitación clásica con transformer y action chunking.' },
          { term: 'Política Diffusion', value: '--policy.type=diffusion', note: 'Modela la distribución de acciones con difusión; robusta con datos multimodales.' },
          { term: 'Política Pi0', value: '--policy.type=pi0', note: 'Modelo de visión-lenguaje-acción, más pesado pero con mejor generalización.' },
          { term: 'Épocas', value: '--training.num_epochs=100', note: 'Vigila la pérdida de validación para evitar sobreajuste.' },
          { term: 'Tamaño de lote', value: '--training.batch_size=32', note: 'Ajusta según la memoria de la GPU.' },
          { term: 'Dispositivo', value: '--training.device=cuda', note: 'Usa cuda si hay GPU; cpu solo para pruebas muy cortas.' },
          { term: 'Guardar checkpoint', value: '--training.output_dir=./outputs', note: 'Los checkpoints se pueden evaluar y subir al Hub después.' },
        ],
      },
      {
        title: 'Evaluación',
        items: [
          { term: 'Evaluar en robot', value: 'lerobot-eval --policy.path=./outputs/checkpoint --robot.type=so100', note: 'Ejecuta la política en hardware real con un número fijo de episodios.' },
          { term: 'Número de ensayos', value: '--eval.num_episodes=20', note: 'Mide la tasa de éxito como exitosos / total.' },
          { term: 'Semilla', value: '--eval.seed=42', note: 'Fija semillas para poder comparar políticas de forma justa.' },
          { term: 'Tasa de éxito', value: 'success_rate = episodios_exitosos / episodios_totales', note: 'Es la métrica principal en manipulación basada en imitación.' },
          { term: 'Reiniciar escena', value: 'Devuelve los objetos a la posición inicial entre ensayos', note: 'Sin esto la evaluación no es reproducible.' },
          { term: 'Registrar video', value: '--eval.record_video=true', note: 'Revisar fallos en video suele revelar errores de dataset, no de modelo.' },
        ],
      },
      {
        title: 'Datasets y políticas',
        items: [
          { term: 'Estructura del dataset', value: 'observations.images, observations.state, action, next.reward, episode_index', note: 'LeRobot usa un formato de columnas sobre arrow/parquet.' },
          { term: 'Ver dataset', value: 'python -c \"from lerobot.datasets.lerobot_dataset import LeRobotDataset; ds=LeRobotDataset(\"usuario/tarea\"); print(ds[0])\"', note: 'Útil para inspeccionar shapes y claves antes de entrenar.' },
          { term: 'Subir al Hub', value: 'python -m lerobot.scripts.push_dataset_to_hub --repo-id usuario/tarea --root ./datos', note: 'Necesitas un token de Hugging Face con permisos de escritura.' },
          { term: 'Cargar política', value: 'from lerobot.common.policies.factory import make_policy', note: 'La fábrica crea el modelo a partir del config del checkpoint.' },
          { term: 'Action chunking', value: 'La política predice varios pasos de acción futuros y los ejecuta en bloque', note: 'Reduce la latencia de inferencia y suaviza el movimiento.' },
          { term: 'Teleop con cámara', value: 'Observa imágenes de muñeca y escena para dar contexto a la política', note: 'La vista de muñeca mejora mucho las tareas de agarre fino.' },
          { term: 'Simulación primero', value: 'Prueba el pipeline en un entorno simulado antes de usar hardware', note: 'Ahorra tiempo y evita golpes durante la depuración.' },
        ],
      },
    ],
  },

  /* =====================================================================
     15. NUMPY Y ÁLGEBRA LINEAL
     ===================================================================== */
  {
    id: 'numpy',
    title: 'NumPy y álgebra lineal',
    track: 'ai',
    description: 'Creación, indexación, broadcasting y linalg: las operaciones de NumPy que aparecen en todo código de IA.',
    groups: [
      {
        title: 'Creación de arrays',
        items: [
          { term: 'np.array', value: 'np.array([1, 2, 3], dtype=np.float32)', note: 'Fija el dtype para controlar memoria y precisión.' },
          { term: 'np.zeros / ones', value: 'np.zeros((3,4)) ; np.ones((2,2), dtype=int)', note: 'La forma se pasa siempre como tupla.' },
          { term: 'np.arange', value: 'np.arange(0, 10, 2)  →  [0 2 4 6 8]', note: 'Equivale a range, pero devuelve un array.' },
          { term: 'np.linspace', value: 'np.linspace(0, 1, 5)  →  5 valores equidistantes', note: 'Ideal para ejes de gráficos y barridos de parámetros.' },
          { term: 'np.eye', value: 'np.eye(3)  →  matriz identidad 3x3', note: 'Útil como base para transformaciones.' },
          { term: 'np.random', value: 'np.random.default_rng(42).normal(0, 1, size=(100,))', note: 'default_rng es la API moderna y reproducible.' },
          { term: 'np.full', value: 'np.full((2,3), 7)', note: 'Rellena con un valor concreto.' },
          { term: 'np.frombuffer', value: 'np.frombuffer(bytes, dtype=np.uint8)', note: 'Convierte bytes de un sensor directamente en array sin copiar.' },
        ],
      },
      {
        title: 'Indexación y formas',
        items: [
          { term: 'shape / ndim / size', value: 'a.shape, a.ndim, a.size', note: 'size es el número total de elementos.' },
          { term: 'Indexar filas y columnas', value: 'a[0, :] (fila), a[:, 1] (columna), a[1:3, ::2]', note: 'Los slices no copian: devuelven una vista.' },
          { term: 'Indexado booleano', value: 'a[a > 0]', note: 'Devuelve una copia con los elementos que cumplen la máscara.' },
          { term: 'Fancy indexing', value: 'a[[0, 2, 4]]', note: 'También copia; útil para selecting aleatorio de índices.' },
          { term: 'reshape', value: 'a.reshape(-1, 1)', note: '-1 infiere esa dimensión automáticamente.' },
          { term: 'squeeze / expand_dims', value: 'np.squeeze(a) ; np.expand_dims(a, axis=0)', note: 'Quita o añade ejes de tamaño 1 sin copiar datos.' },
          { term: 'transpose / T', value: 'a.T o np.transpose(a, (2,0,1))', note: 'Para imágenes en HWC, np.moveaxis(a, -1, 0) da CHW.' },
          { term: 'copy', value: 'a.copy()', note: 'Necesario si vas a modificar una vista sin alterar el original.' },
        ],
      },
      {
        title: 'Operaciones y broadcasting',
        items: [
          { term: 'Operaciones elemento a elemento', value: 'a + b, a * b, a / b, a ** 2', note: 'Se aplican posición por posición, nunca como producto matricial.' },
          { term: 'Producto matricial', value: 'A @ B  o  np.matmul(A, B)', note: 'Dimensiones: (m,n) @ (n,p) → (m,p).' },
          { term: 'Producto punto', value: 'np.dot(a, b)', note: 'Para vectores 1D devuelve un escalar.' },
          { term: 'Broadcasting', value: '(3,1) + (1,4) → (3,4)', note: 'Las dimensiones deben coincidir o ser 1.' },
          { term: 'Broadcasting de media', value: 'X - X.mean(axis=0)', note: 'Escala cada columna restando su media, sin bucles.' },
          { term: 'where', value: 'np.where(a > 0, a, 0)', note: 'Equivale a un if vectorizado (ReLU se escribe así).' },
          { term: 'clip', value: 'np.clip(a, 0, 1)', note: 'Limitar valores, por ejemplo normalizar una imagen a [0,1].' },
          { term: 'Reducciones', value: 'a.sum(axis=0), a.mean(axis=1), a.max()', note: 'axis=0 colapsa filas (opera por columna).' },
        ],
      },
      {
        title: 'Álgebra lineal (np.linalg)',
        items: [
          { term: 'Norma', value: 'np.linalg.norm(v)', note: 'Por defecto norma L2; ord=1 para L1.' },
          { term: 'Producto cruz', value: 'np.cross(a, b)', note: 'Útil para vectores normales y Jacobianos.' },
          { term: 'Inversa', value: 'np.linalg.inv(A)', note: 'Evítala para resolver sistemas: usa solve.' },
          { term: 'Resolver Ax=b', value: 'np.linalg.solve(A, b)', note: 'Más estable y rápido que calcular la inversa.' },
          { term: 'Pseudo-inversa', value: 'np.linalg.pinv(J)', note: 'Esencial en cinemática inversa de robots.' },
          { term: 'Autovalores', value: 'w, V = np.linalg.eig(A)', note: 'Las columnas de V son los autovectores.' },
          { term: 'SVD', value: 'U, s, Vt = np.linalg.svd(A, full_matrices=False)', note: 'Base de PCA, compresión y reducción de dimensionalidad (LSI).' },
          { term: 'Determinante', value: 'np.linalg.det(A)', note: 'Cerca de cero indica matriz singular o mal condicionada.' },
        ],
      },
      {
        title: 'Estadística y utilidades',
        items: [
          { term: 'Media y desviación', value: 'a.mean(), a.std()', note: 'ddof=1 da la desviación muestral insesgada.' },
          { term: 'Percentiles', value: 'np.percentile(a, [25, 50, 75])', note: 'Útil para resumir latencias y errores.' },
          { term: 'Correlación', value: 'np.corrcoef(x, y)[0, 1]', note: 'Devuelve la matriz de correlación de Pearson.' },
          { term: 'Concatenar / apilar', value: 'np.concatenate([a,b], axis=0) ; np.stack([a,b])', note: 'stack añade un eje nuevo; concatenate no.' },
          { term: 'Unique', value: 'np.unique(a, return_counts=True)', note: 'Devuelve valores únicos y su frecuencia.' },
          { term: 'Guardar / cargar', value: 'np.save(\"x.npy\", a) ; np.load(\"x.npy\")', note: 'np.savez permite guardar varios arrays con nombre.' },
          { term: 'astype', value: 'a.astype(np.float32)', note: 'Convierte el tipo; float32 suele ser suficiente en ML y ahorra memoria.' },
        ],
      },
    ],
  },

  /* =====================================================================
     16. SCIKIT-LEARN Y MÉTRICAS DE ML
     ===================================================================== */
  {
    id: 'sklearn',
    title: 'scikit-learn y métricas de ML',
    track: 'ai',
    description: 'Pipelines, modelos clásicos, validación cruzada y todas las métricas de clasificación y regresión.',
    groups: [
      {
        title: 'Pipeline y preprocesado',
        items: [
          { term: 'Pipeline', value: 'Pipeline([(\"scaler\", StandardScaler()), (\"clf\", LogisticRegression())])', note: 'Evita data leakage: el scaler se ajusta solo con el entrenamiento.' },
          { term: 'División train/test', value: 'X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)', note: 'stratify mantiene las proporciones de clase.' },
          { term: 'StandardScaler', value: 'scaler.fit_transform(X)', note: 'Centra y escala a varianza unitaria; necesario para modelos lineales y SVM.' },
          { term: 'MinMaxScaler', value: 'Escala cada característica a [0,1]', note: 'Útil para redes neuronales y cuando necesitas límites conocidos.' },
          { term: 'OneHotEncoder', value: 'OneHotEncoder(handle_unknown=\"ignore\")', note: 'Convierte categóricas en columnas binarias.' },
          { term: 'ColumnTransformer', value: 'ColumnTransformer([(\"num\", scaler, num_cols), (\"cat\", ohe, cat_cols)])', note: 'Aplica un preproceso distinto según el tipo de columna.' },
          { term: 'Imputador', value: 'SimpleImputer(strategy=\"median\")', note: 'La mediana es más robusta que la media ante outliers.' },
          { term: 'fit / transform', value: 'fit aprende parámetros; transform aplica; fit_transform hace ambos', note: 'Nunca hagas fit sobre el conjunto de prueba.' },
        ],
      },
      {
        title: 'Modelos',
        items: [
          { term: 'Regresión lineal', value: 'LinearRegression()', note: 'Rápida e interpretable; asume linealidad.' },
          { term: 'Regresión logística', value: 'LogisticRegression(max_iter=1000)', note: 'Clasificación lineal con probabilidades calibradas.' },
          { term: 'Árbol de decisión', value: 'DecisionTreeClassifier(max_depth=5)', note: 'Limitar la profundidad evita sobreajuste.' },
          { term: 'Random Forest', value: 'RandomForestClassifier(n_estimators=200, random_state=42)', note: 'Robusto y buen baseline; da importancias de características.' },
          { term: 'Gradient Boosting', value: 'GradientBoostingClassifier() o HistGradientBoostingClassifier()', note: 'Hist es mucho más rápido en datasets grandes.' },
          { term: 'SVM', value: 'SVC(kernel=\"rbf\", C=1.0)', note: 'Necesita escalado; C controla el margen y el error.' },
          { term: 'KNN', value: 'KNeighborsClassifier(n_neighbors=5)', note: 'Sin entrenamiento explícito; sensible a la escala y a la dimensionalidad.' },
          { term: 'K-Means', value: 'KMeans(n_clusters=3, random_state=42)', note: 'Escala las variables antes de agrupar.' },
        ],
      },
      {
        title: 'Validación y ajuste',
        items: [
          { term: 'Validación cruzada', value: 'cross_val_score(model, X, y, cv=5, scoring=\"accuracy\")', note: 'Devuelve una puntuación por pliegue.' },
          { term: 'StratifiedKFold', value: 'StratifiedKFold(n_splits=5, shuffle=True, random_state=42)', note: 'Mantiene la proporción de clases en cada pliegue.' },
          { term: 'GridSearchCV', value: 'GridSearchCV(pipe, params, cv=5, scoring=\"f1\")', note: 'Prueba todas las combinaciones de hiperparámetros.' },
          { term: 'RandomizedSearchCV', value: 'RandomizedSearchCV(model, distro, n_iter=50, cv=5)', note: 'Más eficiente que grid cuando hay muchos parámetros.' },
          { term: 'Curva de aprendizaje', value: 'learning_curve(model, X, y, train_sizes=...)', note: 'Indica si ayuda más datos o un modelo más complejo.' },
          { term: 'Matriz de confusión', value: 'confusion_matrix(y_true, y_pred)', note: 'Filas = valor real, columnas = predicción.' },
          { term: 'Classification report', value: 'classification_report(y_true, y_pred)', note: 'Muestra precision, recall, F1 y soporte por clase.' },
        ],
      },
      {
        title: 'Métricas de clasificación',
        items: [
          { term: 'Accuracy', value: 'accuracy_score(y, y_pred)', note: 'Engaña con clases desbalanceadas.' },
          { term: 'Precisión', value: 'TP / (TP + FP)', note: 'De los que predije positivos, cuántos lo eran.' },
          { term: 'Recall (sensibilidad)', value: 'TP / (TP + FN)', note: 'De los positivos reales, cuántos detecté.' },
          { term: 'F1', value: '2 · precision · recall / (precision + recall)', note: 'Media armónica; útil cuando importan ambas.' },
          { term: 'Especificidad', value: 'TN / (TN + FP)', note: 'Capacidad de descartar correctamente los negativos.' },
          { term: 'ROC AUC', value: 'roc_auc_score(y, y_prob)', note: 'Área bajo la curva ROC; robusta a umbrales y desbalanceo.' },
          { term: 'Log loss', value: 'log_loss(y, y_prob)', note: 'Penaliza la confianza equivocada; se usa en competencias.' },
          { term: 'Balanceado', value: 'class_weight=\"balanced\" y scoring=\"f1_macro\"', note: 'Ayuda cuando una clase es mucho más frecuente.' },
        ],
      },
      {
        title: 'Métricas de regresión y clustering',
        items: [
          { term: 'MAE', value: 'mean_absolute_error(y, y_pred)', note: 'Interpretable en las unidades de la variable objetivo.' },
          { term: 'MSE', value: 'mean_squared_error(y, y_pred)', note: 'Penaliza más los errores grandes.' },
          { term: 'RMSE', value: 'np.sqrt(mean_squared_error(y, y_pred))', note: 'MSE en las unidades originales.' },
          { term: 'R²', value: 'r2_score(y, y_pred)', note: 'Proporción de varianza explicada; 1 es perfecto, 0 es la media.' },
          { term: 'MAPE', value: 'media de |(y - y_pred)/y| · 100', note: 'Útil en series temporales, pero falla si y = 0.' },
          { term: 'Silhouette', value: 'silhouette_score(X, labels)', note: 'Mide la calidad del agrupamiento; va de -1 a 1.' },
          { term: 'Inercia K-Means', value: 'kmeans.inertia_', note: 'Suma de distancias al centroide; úsala con el método del codo.' },
        ],
      },
    ],
  },

  /* =====================================================================
     17. PYTORCH Y DEEP LEARNING
     ===================================================================== */
  {
    id: 'pytorch',
    title: 'PyTorch y deep learning: snippets',
    track: 'ai',
    description: 'Tensores, autograd, definición de modelos, bucles de entrenamiento, pérdidas y utilidades de PyTorch.',
    groups: [
      {
        title: 'Tensores',
        items: [
          { term: 'Crear tensor', value: 'x = torch.tensor([[1., 2.], [3., 4.]])', note: 'Por defecto float32; especifica dtype si hace falta.' },
          { term: 'Ceros y aleatorios', value: 'torch.zeros(2,3) ; torch.randn(2,3)', note: 'randn genera valores con media 0 y varianza 1.' },
          { term: 'Desde NumPy', value: 't = torch.from_numpy(arr) ; arr = t.numpy()', note: 'Comparten memoria: modificar uno afecta al otro.' },
          { term: 'Forma y tipo', value: 'x.shape, x.dtype, x.device', note: 'Comprueba siempre el dtype antes de entrenar.' },
          { term: 'reshape / view', value: 'x.reshape(-1, 1) ; x.view(-1, 1)', note: 'view exige memoria contigua; reshape funciona siempre.' },
          { term: 'Indexación', value: 'x[0], x[:, 1], x[x > 0]', note: 'Igual que NumPy, con soporte GPU.' },
          { term: 'Mover a GPU', value: 'device = \"cuda\" if torch.cuda.is_available() else \"cpu\"; x = x.to(device)', note: 'Modelo, datos y objetivos deben estar en el mismo dispositivo.' },
          { term: 'Operaciones', value: 'x @ y (matmul), x * y (elemento a elemento), x.sum(), x.mean()', note: 'x.T transpone en 2D; usa x.transpose para más dimensiones.' },
        ],
      },
      {
        title: 'Autograd',
        items: [
          { term: 'requires_grad', value: 'x = torch.randn(3, requires_grad=True)', note: 'Activa el registro de operaciones para calcular gradientes.' },
          { term: 'backward', value: 'loss.backward()', note: 'Acumula gradientes en .grad de cada parámetro.' },
          { term: 'zero_grad', value: 'optimizer.zero_grad()', note: 'Limpia los gradientes antes de cada backward.' },
          { term: 'no_grad', value: 'with torch.no_grad(): y = model(x)', note: 'Desactiva el grafo en inferencia: ahorra memoria y tiempo.' },
          { term: 'detach', value: 'y = x.detach()', note: 'Separa un tensor del grafo sin copiar los datos.' },
          { term: 'Gradientes', value: 'for name, p in model.named_parameters(): print(name, p.grad)', note: 'Gradientes nulos o NaN delatan problemas de inicialización o lr.' },
        ],
      },
      {
        title: 'Modelo y entrenamiento',
        items: [
          { term: 'Definir modelo', value: 'class Net(nn.Module): __init__(self); forward(self, x)', note: 'Solo debes implementar forward; autograd se encarga del resto.' },
          { term: 'Capa lineal', value: 'self.fc = nn.Linear(in_features, out_features)', note: 'Incluye pesos y bias inicializados automáticamente.' },
          { term: 'Activaciones', value: 'nn.ReLU(), nn.Sigmoid(), nn.Tanh(), nn.GELU()', note: 'ReLU es el default; GELU es común en transformers.' },
          { term: 'Secuencial', value: 'nn.Sequential(nn.Linear(10,32), nn.ReLU(), nn.Linear(32,3))', note: 'Útil para arquitecturas simples en pocas líneas.' },
          { term: 'Modo entrenamiento', value: 'model.train()', note: 'Activa dropout y batch normalization.' },
          { term: 'Modo evaluación', value: 'model.eval()', note: 'Desactiva dropout y usa estadísticas acumuladas de BN.' },
          { term: 'Bucle de entrenamiento', value: 'for xb,yb in loader: opt.zero_grad(); loss=crit(model(xb),yb); loss.backward(); opt.step()', note: 'Ese es el patrón completo de una iteración.' },
          { term: 'Dataset / DataLoader', value: 'loader = DataLoader(ds, batch_size=32, shuffle=True, num_workers=4)', note: 'shuffle solo en entrenamiento, nunca en validación.' },
        ],
      },
      {
        title: 'Pérdidas y optimizadores',
        items: [
          { term: 'MSE', value: 'nn.MSELoss()', note: 'Regresión; espera salida y objetivo del mismo shape.' },
          { term: 'Cross entropy', value: 'nn.CrossEntropyLoss()', note: 'Clasificación multiclass; espera logits, no probabilidades.' },
          { term: 'BCE with logits', value: 'nn.BCEWithLogitsLoss()', note: 'Clasificación binaria; numéricamente más estable que BCE+ sigmoid.' },
          { term: 'SGD', value: 'optim.SGD(model.parameters(), lr=0.01, momentum=0.9)', note: 'Simple y fiable; el momentum acelera la convergencia.' },
          { term: 'Adam', value: 'optim.Adam(model.parameters(), lr=1e-3)', note: 'Default práctico para la mayoría de tareas.' },
          { term: 'AdamW', value: 'optim.AdamW(model.parameters(), lr=1e-4, weight_decay=0.01)', note: 'Preferido en transformers: separa mejor el decaimiento de pesos.' },
          { term: 'Scheduler', value: 'scheduler = optim.lr_scheduler.CosineAnnealingLR(opt, T_max=50)', note: 'Llama a scheduler.step() al final de cada época.' },
        ],
      },
      {
        title: 'Utilidades y guardado',
        items: [
          { term: 'Guardar estado', value: 'torch.save(model.state_dict(), \"modelo.pt\")', note: 'Guarda solo pesos; es más portable que guardar el objeto completo.' },
          { term: 'Cargar estado', value: 'model.load_state_dict(torch.load(\"modelo.pt\", map_location=device))', note: 'map_location evita errores al cargar en CPU un modelo entrenado en GPU.' },
          { term: 'Semilla', value: 'torch.manual_seed(42); np.random.seed(42)', note: 'Fija todas las semillas para resultados reproducibles.' },
          { term: 'Detectar GPU', value: 'torch.cuda.is_available() ; torch.cuda.empty_cache()', note: 'empty_cache libera memoria fragmentada de la GPU.' },
          { term: 'torch.no_grad + eval', value: 'model.eval(); with torch.no_grad(): ...', note: 'Ambos son necesarios para una evaluación correcta y eficiente.' },
          { term: 'torch.compile', value: 'model = torch.compile(model)', note: 'Acelera entrenamiento e inferencia compilando el grafo (PyTorch 2+).' },
          { term: 'Clip gradiente', value: 'torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)', note: 'Evita explosión de gradientes, habitual en RNN y transformers.' },
        ],
      },
    ],
  },

  /* =====================================================================
     18. LLMS, RAG E INFERENCIA
     ===================================================================== */
  {
    id: 'llms-rag',
    title: 'LLMs, RAG e inferencia: comandos y parámetros',
    track: 'ai',
    description: 'Transformers, parámetros de muestreo, pipelines RAG, fine-tuning eficiente y servidores de inferencia.',
    groups: [
      {
        title: 'Transformers y pipelines',
        items: [
          { term: 'Cargar modelo', value: 'AutoModelForCausalLM.from_pretrained(\"meta-llama/Llama-3.1-8B\")', note: 'Usa AutoModel para que la librería elija la clase correcta.' },
          { term: 'Tokenizer', value: 'tok = AutoTokenizer.from_pretrained(modelo); tok(prompt, return_tensors=\"pt\")', note: 'Usa el tokenizer exacto del modelo, nunca uno similar.' },
          { term: 'Pipeline', value: 'pipe = pipeline(\"text-generation\", model=modelo, tokenizer=tok)', note: 'La forma más rápida de probar un modelo.' },
          { term: 'Generar', value: 'out = model.generate(**inputs, max_new_tokens=128)', note: 'Devuelve ids; decodifica con tok.batch_decode(out, skip_special_tokens=True).' },
          { term: 'Chat template', value: 'tok.apply_chat_template(mensajes, tokenize=False, add_generation_prompt=True)', note: 'Imprescindible en modelos chat: respeta su formato de roles.' },
          { term: 'Cuantización', value: 'BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_quant_type=\"nf4\")', note: 'Reduce memoria drásticamente con poca pérdida de calidad.' },
          { term: 'Dispositivo', value: 'device_map=\"auto\" con accelerate', note: 'Distribuye capas entre GPU y CPU automáticamente.' },
          { term: 'Embeddings', value: 'modelo = SentenceTransformer(\"sentence-transformers/all-MiniLM-L6-v2\")', note: 'Devuelve vectores normalizados listos para similitud coseno.' },
        ],
      },
      {
        title: 'Parámetros de generación',
        items: [
          { term: 'temperature', value: '0 determinista, 0.7 equilibrado, >1 más creativo', note: 'Escala los logits antes del softmax; 0 usa argmax.' },
          { term: 'top_p (nucleus)', value: '0.9 típico', note: 'Conserva el conjunto mínimo de tokens cuya probabilidad suma p.' },
          { term: 'top_k', value: '50 típico', note: 'Corta a los k tokens más probables; la temperatura y top_p suelen bastar.' },
          { term: 'max_new_tokens', value: 'Número máximo de tokens generados', note: 'No confundir con max_length, que incluye el prompt.' },
          { term: 'repetition_penalty', value: '1.0 neutro, 1.1 a 1.2 reduce repeticiones', note: 'Penaliza tokens ya generados.' },
          { term: 'do_sample', value: 'True para muestreo; False para greedy', note: 'Con False, temperature y top_p no tienen efecto.' },
          { term: 'stop sequences', value: 'stop=[\"\\n\\n\", \"Fin:\"]', note: 'Corta la generación cuando aparece la cadena.' },
          { term: 'stream', value: 'stream=True en la API', note: 'Envía tokens progresivamente y mejora la latencia percibida.' },
          { term: 'semilla', value: 'seed=42 para reproducibilidad', note: 'Útil en evals, aunque no garantiza identidad entre versiones del modelo.' },
        ],
      },
      {
        title: 'RAG',
        items: [
          { term: 'Chunking', value: 'RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)', note: 'Solapamiento evita cortar una idea a mitad de trozo.' },
          { term: 'Embeddings + vector store', value: 'db = Chroma.from_documents(docs, embeddings)', note: 'Alternativas: FAISS, Qdrant, pgvector.' },
          { term: 'Recuperación', value: 'docs = db.similarity_search(pregunta, k=4)', note: 'k entre 3 y 6 es un buen punto de partida.' },
          { term: 'Búsqueda híbrida', value: 'Combina similitud vectorial con BM25', note: 'Mejora mucho los términos técnicos y nombres propios.' },
          { term: 'Reranking', value: 'CrossEncoder(...).rank(pregunta, docs)', note: 'Reordena los candidatos: más preciso y algo más lento.' },
          { term: 'Prompt con contexto', value: 'Responde solo con el contexto: {contexto}\nPregunta: {pregunta}', note: 'Pide citar fuentes para poder verificar la respuesta.' },
          { term: 'Métricas RAG', value: ' faithfulness, answer_relevancy, context_precision (RAGAS)', note: 'Separa fallos de recuperación de fallos de generación.' },
          { term: 'Caché de embeddings', value: 'No vuelvas a embeber documentos sin cambios', note: 'Ahorra coste y latencia en corpus grandes.' },
        ],
      },
      {
        title: 'Fine-tuning eficiente (PEFT)',
        items: [
          { term: 'LoRA', value: 'LoraConfig(r=16, lora_alpha=32, target_modules=[\"q_proj\",\"v_proj\"])',
            note: 'Entrena matrices de bajo rango: ~0.1% de parámetros.' },
          { term: 'QLoRA', value: 'LoRA sobre un modelo cargado en 4 bits', note: 'Permite afinar modelos grandes en una sola GPU.' },
          { term: 'SFT', value: 'SFTTrainer(model, train_dataset=ds, max_length=512)', note: 'Afinación supervisada con pares instrucción-respuesta.' },
          { term: 'DPO', value: 'DPOTrainer(model, ref_model=ref, beta=0.1)', note: 'Alinea con preferencias sin entrenar un modelo de recompensa.' },
          { term: 'Dataset de instrucciones', value: '{\"instruction\": \"...\", \"input\": \"...\", \"output\": \"...\"}', note: 'Calidad y diversidad importan más que cantidad.' },
          { term: 'Formato chat', value: 'Aplica el chat_template del modelo también al entrenamiento', note: 'Si el formato difiere, el modelo responde mal en inferencia.' },
          { term: 'Evaluar el tuning', value: 'Compara respuestas antes/después con un set de preguntas fijo', note: 'Sin evals, un fine-tuning puede empeorar el modelo base.' },
        ],
      },
      {
        title: 'Inferencia y serving',
        items: [
          { term: 'vLLM', value: 'vllm serve modelo --port 8000', note: 'PagedAttention y continuous batching: alto rendimiento.' },
          { term: 'Ollama', value: 'ollama run llama3.1', note: 'Modelos locales con una API HTTP sencilla en localhost:11434.' },
          { term: 'llama.cpp', value: './llama-server -m modelo.gguf --port 8080', note: 'Cuantización GGUF para CPU y hardware modesto.' },
          { term: 'TGI', value: 'text-generation-launcher --model-id modelo --num-shard 2', note: 'Servidor de Hugging Face con batching continuo.' },
          { term: 'API OpenAI-compatible', value: 'POST /v1/chat/completions con messages y model', note: 'vLLM, Ollama y TGI exponen esta interfaz: cambia solo la URL.' },
          { term: 'Métricas de serving', value: 'TTFT (tiempo al primer token), tokens/s, p95 de latencia', note: 'El TTFT mide percepción de rapidez; tokens/s mide throughput.' },
          { term: 'Batching continuo', value: 'Agrupa peticiones en curso en cada paso de decodificación', note: 'Multiplica el throughput frente a procesar una petición a la vez.' },
          { term: 'KV cache', value: 'Memoria caché de claves y valores de la atención', note: 'Suele ser el principal consumidor de VRAM con contextos largos.' },
        ],
      },
    ],
  },

  /* =====================================================================
      19. T3 CODE: COMANDOS Y FLUJO
      ===================================================================== */
  {
    id: 't3-code',
    title: 'T3 Code: comandos y flujo',
    track: 'ai',
    description: 'Instalación, CLIs, login y ciclo de trabajo con el agente: worktrees, permisos, checkpoints, diff, PR, policy y remoto.',
    groups: [
      {
        title: 'Instalación, CLIs y acceso',
        items: [
          { term: 'Instalación', value: 'npm i -g @t3/code  (o el gestor indicado por el proyecto)', note: 'Verifica la versión con t3 --version antes de empezar.' },
          { term: 'CLIs principales', value: 't3 (agente), t3-code (servicio/control plane)', note: 'La CLI de t3 es la interfaz de usuario; el control plane coordina las sesiones.' },
          { term: 'Login', value: 't3 login', note: 'Autentica contra el proveedor y guarda las credenciales en el perfil local.' },
          { term: 'Estado de sesión', value: 't3 status', note: 'Muestra login, workspace activo y threads en curso.' },
          { term: 'Proveedores', value: 't3 providers  →  selecciona modelo/backend', note: 'Los providers desacoplan el modelo del flujo de trabajo del agente.' },
          { term: 'Ayuda', value: 't3 --help  /  t3 <comando> --help', note: 'La forma más rápida de descubrir flags y subcomandos de tu versión.' },
          { term: 'Actualización', value: 'npm i -g @t3/code@latest', note: 'Tras actualizar, revisa changelog: los permisos y políticas pueden cambiar.' },
        ],
      },
      {
        title: 'Worktree, thread y ejecución',
        items: [
          { term: 'Arrancar tarea', value: 't3 " describir la tarea "', note: 'El brief debe incluir objetivo, criterios de aceptación y cómo verificar.' },
          { term: 'Worktree', value: 't3 worktree create  /  t3 worktree list', note: 'Cada tarea trabaja en un checkout aislado; evita tocar tu directorio principal.' },
          { term: 'Cambiar de worktree', value: 't3 worktree switch <nombre>', note: 'Útil para revisar el trabajo de otra tarea sin perder la sesión actual.' },
          { term: 'Thread', value: 't3 thread list  /  t3 thread resume <id>', note: 'Un thread es la conversación con su historial; puedes retomarlo más tarde.' },
          { term: 'Paralelismo', value: 'lanzar varios threads, cada uno en su worktree', note: 'Solo para tareas independientes con interfaces y archivos bien separados.' },
          { term: 'Plan antes de editar', value: 't3 --plan  (modo planificación)', note: 'El agente investiga y propone pasos sin escribir en el worktree.' },
          { term: 'Control plane', value: 'capa que decide qué herramienta actúa en cada paso', note: 'Separa la decisión de la ejecución local del agente.' },
        ],
      },
      {
        title: 'Permisos, checkpoints y seguridad',
        items: [
          { term: 'Modo de permiso', value: 'read-only | ask | auto-edit | auto-all', note: 'Define qué puede hacer el agente sin preguntar: leer, editar, ejecutar.' },
          { term: 'Solo lectura', value: 't3 --permission read-only', note: 'Explora y razona sin modificar nada; ideal para auditar propuestas.' },
          { term: 'Confirmación por acción', value: 't3 --permission ask', note: 'El agente pide aprobación antes de cada cambio o comando relevante.' },
          { term: 'Checkpoint', value: 't3 checkpoint create "<etiqueta>"', note: 'Guarda el estado de la sesión antes de un cambio grande o arriesgado.' },
          { term: 'Restaurar checkpoint', value: 't3 checkpoint restore <id>', note: 'Vuelve al estado anterior si el resultado empeoró; es un undo de sesión.' },
          { term: 'Listar checkpoints', value: 't3 checkpoint list', note: 'Permite comparar versiones intermedias de la misma tarea.' },
          { term: 'Policy', value: 't3 policy ...  (reglas de comandos, archivos y gasto)', note: 'Las policies son reglas granulares que bloquean acciones aunque el modo sea permisivo.' },
          { term: 'Límites', value: '--max-steps, --max-tokens, --budget, --timeout', note: 'Cortan ejecuciones en bucle y evitan facturas inesperadas.' },
          { term: 'Auditoría', value: 't3 log  /  historial del thread', note: 'Registra comandos y decisiones para revisar después qué hizo el agente.' },
        ],
      },
      {
        title: 'Diff, PR y remoto',
        items: [
          { term: 'Ver diff', value: 't3 diff  (o git diff dentro del worktree)', note: 'Revisa cambios reales, no solo el resumen del agente.' },
          { term: 'Revisar archivos tocados', value: 't3 diff --stat', note: 'Detecta archivos fuera de alcance antes de aceptar el trabajo.' },
          { term: 'Commitear', value: 't3 commit  /  git commit en el worktree', note: 'Cada tarea deja sus cambios confirmados en su propia rama.' },
          { term: 'Abrir PR', value: 't3 pr create', note: 'El agente crea título y descripción a partir de la tarea; requiere permiso de remoto.' },
          { term: 'Ver PRs', value: 't3 pr list', note: 'Sigue el estado de las propuestas generadas por los threads.' },
          { term: 'Remoto', value: 't3 remote  /  git fetch, git push', note: 'Limitar permisos de push evita escrituras no deseadas en ramas compartidas.' },
          { term: 'Human in the loop', value: 'aprobar plan → revisar diff → decidir PR', note: 'El agente ejecuta; la persona valida en cada punto clave.' },
          { term: 'Descartar tarea', value: 't3 worktree remove <nombre>', note: 'Si el resultado no sirve, se elimina el worktree sin afectar al repositorio principal.' },
        ],
      },
    ],
  },

  /* =====================================================================
      20. PATRONES DE ORQUESTACIÓN DE AGENTES
      ===================================================================== */
  {
    id: 'orquestacion',
    title: 'Patrones de orquestación de agentes',
    track: 'ai',
    description: 'Cómo repartir trabajo entre varios agentes: paralelización, revisor independiente, división de tareas, prompts de delegación y defensas contra fallos.',
    groups: [
      {
        title: 'Paralelización',
        items: [
          { term: 'Regla de oro', value: 'paraleliza solo tareas independientes', note: 'Si comparten archivos o estado, el paralelismo crea conflictos.' },
          { term: 'Fan-out', value: 'repartir una tarea en N ramas simultáneas', note: 'Cada rama con su propio worktree y su criterio de éxito.' },
          { term: 'Fan-in', value: 'reunir y sintetizar los N resultados', note: 'Un agente integrador valida y combina las piezas.' },
          { term: 'Aislamiento', value: 'un worktree por agente', note: 'Evita que un agente pise los cambios de otro.' },
          { term: 'Interfaces', value: 'definir entrada y salida de cada subtarea', note: 'Sin contrato claro, los resultados no se pueden ensamblar.' },
          { term: 'Coste de coordinación', value: 'tiempo y tokens extra por dividir y reunir', note: 'Para tareas pequeñas, un solo agente suele ser más barato y rápido.' },
          { term: 'Límites por rama', value: 'topes de pasos y tokens para cada agente', note: 'Una rama desbocada no debe bloquear a las demás.' },
        ],
      },
      {
        title: 'Revisor y control de calidad',
        items: [
          { term: 'Rol de reviewer', value: 'agente distinto del implementador', note: 'Contexto fresco y criterios propios: detecta lo que el autor no ve.' },
          { term: 'Sesgo de anclaje', value: 'quien escribió tiende a confirmar su enfoque', note: 'Por eso el revisor no debe ser la misma sesión.' },
          { term: 'Rúbrica de revisión', value: 'corrección, casos límite, alcance, estilo, seguridad', note: 'Dar criterios concretos mejora la revisión más que pedir "revisa esto".' },
          { term: 'Revisión ciega', value: 'pasar el diff sin el razonamiento del autor', note: 'Reduce el sesgo: el revisor juzga el código, no la intención.' },
          { term: 'Bucle de corrección', value: 'revisar → corregir → volver a revisar', note: 'Con límites: dos o tres iteraciones antes de escalar a un humano.' },
          { term: 'Segunda IA', value: 'modelo distinto contrastando la respuesta', note: 'Aporta divergencia frente a los sesgos del primer modelo.' },
          { term: 'Veredicto explícito', value: 'aprobar / reprobar con razones y evidencia', note: 'Evita reseñas ambiguas que no se pueden accionar.' },
        ],
      },
      {
        title: 'División de tareas y prompts de delegación',
        items: [
          { term: 'Descomposición', value: 'dividir por módulo, archivo o fase (investigar / implementar / testear)', note: 'Cada pieza debe tener un criterio de terminación claro.' },
          { term: 'Prompt de delegación', value: 'objetivo + contexto mínimo + restricciones + herramientas + formato + verificación', note: 'El contexto mínimo evita que el agente asuma cosas fuera de alcance.' },
          { term: 'Alcance explícito', value: 'lista de archivos permitidos y prohibidos', note: 'Es la defensa más simple contra cambios no deseados.' },
          { term: 'Formato de salida', value: 'pide JSON, lista o diff concreto', note: 'Facilita que el agente integrador pueda combinar resultados.' },
          { term: 'Criterio de éxito', value: 'tests que deben pasar o condición comprobable', note: 'Sin él, no se puede decidir si la subtarea terminó.' },
          { term: 'Orden de dependencias', value: 'investigación → implementación → revisión → integración', note: 'Solo paraleliza las fases que no se dependen entre sí.' },
          { term: 'Plantilla de encargo', value: 'Haz X en Y; no toques Z; verifica con W; responde en formato V.', note: 'Repetible y fácil de auditar entre threads.' },
        ],
      },
      {
        title: 'Cuándo no usar y defensas',
        items: [
          { term: 'No usar si…', value: 'tarea pequeña o muy acoplada', note: 'La coordinación cuesta más que el trabajo mismo.' },
          { term: 'No usar si…', value: 'no hay forma objetiva de verificar el resultado', note: 'Sin verificación, los errores se propagan sin control.' },
          { term: 'No usar si…', value: 'el contexto compartido es enorme', note: 'Repetirlo en cada agente dispara coste y contradicciones.' },
          { term: 'Defensa: checkpoints', value: 'guardar estado antes de cada fase', note: 'Permite volver atrás si una rama contamina el resultado.' },
          { term: 'Defensa: verificación', value: 'tests y fuentes primarias antes de aceptar', note: 'La salida de un agente es un borrador, no un hecho.' },
          { term: 'Defensa: límites', value: 'topes de pasos, tokens, coste y tiempo', note: 'Cortan bucles y contienen el impacto de un fallo.' },
          { term: 'Defensa: auditoría', value: 'registro de acciones de cada agente', note: 'Permite reconstruir qué pasó y dónde se introdujo el error.' },
          { term: 'Métrica de decisión', value: 'tiempo a resultado correcto y coste total vs. un agente', note: 'Si no mejora ambos, simplifica la orquestación.' },
        ],
      },
    ],
  },

  /* =====================================================================
      21. MÉTODO HUANG: PREGUNTAS Y VERIFICACIÓN
      ===================================================================== */
  {
    id: 'metodo-huang',
    title: 'Método Huang: preguntas y verificación',
    track: 'ai',
    description: 'Preguntar cómo preguntar, bucle recursivo, contraste con una segunda IA, fuentes primarias, controlabilidad y checklist de verificación con métricas antes/después.',
    groups: [
      {
        title: 'Preguntar cómo preguntar',
        items: [
          { term: 'Meta-pregunta', value: '¿Cómo debo formular esta pregunta para obtener una mejor respuesta?', note: 'Mejora el prompt antes de gastar una respuesta completa.' },
          { term: 'Pedir supuestos', value: '¿Qué estoy dando por supuesto y qué falta en el contexto?', note: 'Saca a la luz los vacíos que el humano no ve.' },
          { term: 'Bucle recursivo', value: 'pregunta → mejorar pregunta → repetir', note: 'Iterar sobre la pregunta suele dar más que iterar sobre la respuesta.' },
          { term: 'Ambigüedad', value: 'pedir que señale interpretaciones posibles', note: 'Una pregunta ambigua produce una respuesta correcta para el problema equivocado.' },
          { term: 'Formato primero', value: 'pedir la estructura de la respuesta antes del contenido', note: 'Fija la forma y luego pide el fondo.' },
          { term: 'Principio', value: 'la calidad de la respuesta está limitada por la calidad de la pregunta', note: 'Basura entra, basura sale.' },
        ],
      },
      {
        title: 'Contraste: segunda IA y fuente primaria',
        items: [
          { term: 'Segunda IA', value: 'otro modelo revisa la respuesta del primero', note: 'Modelo distinto o sesión independiente.' },
          { term: 'Por qué otro modelo', value: 'evita confirmación y sesgos compartidos', note: 'El mismo modelo tiende a ratificar su primera salida.' },
          { term: 'Pregunta al revisor', value: '¿Qué hay de incorrecto o incompleto aquí?', note: 'Pedir errores concretos da más que preguntar si te parece bien.' },
          { term: 'Fuente primaria', value: 'paper, documentación oficial, código o dato original', note: 'La IA es un atajo hacia la fuente, no un sustituto de ella.' },
          { term: 'Citar', value: 'pedir enlace o referencia verificable de cada afirmación', note: 'Una afirmación sin fuente es una hipótesis.' },
          { term: 'Trampas', value: 'alucinación, paráfrasis inexacta, fuente inventada', note: 'Especialmente peligroso cuando el tono es seguro.' },
          { term: 'Prioridad', value: 'fuente primaria > segunda IA > primera respuesta', note: 'Contrastar siempre de abajo arriba.' },
        ],
      },
      {
        title: 'Controlabilidad y definir "mejor"',
        items: [
          { term: 'Controlabilidad', value: 'el humano decide rumbo, límites y cuándo parar', note: 'La IA es el copiloto; el volante sigue tuyo.' },
          { term: 'Instrucciones precisas', value: 'rol, contexto, restricciones, formato y criterio de aceptación', note: 'Cuanto más explícito, menos improvisación.' },
          { term: 'Definir mejor', value: 'fijar métrica u objetivo antes de pedir una mejora', note: 'Sin definición, el modelo optimiza estilo en vez del problema.' },
          { term: 'Ejemplo de métrica', value: 'tasa de error, tiempo de ejecución, cobertura de tests, claridad', note: 'Debe ser medible y comprobable en el resultado.' },
          { term: 'Riesgo', value: 'mejoras que suenan bien pero no resuelven nada', note: 'El criterio evita optimizar la apariencia.' },
          { term: 'Límites de la sesión', value: 'pasos, tokens, coste y tiempo', note: 'Contienen la deriva y fuerzan a reevaluar.' },
        ],
      },
      {
        title: 'Verificación, checklist y métricas',
        items: [
          { term: 'Checklist 1', value: '¿Responde realmente a la pregunta planteada?', note: 'A veces responde a una pregunta vecina.' },
          { term: 'Checklist 2', value: '¿Está respaldada por una fuente primaria?', note: 'Busca el documento original, no una mención de segunda mano.' },
          { term: 'Checklist 3', value: '¿La confirmó una segunda IA o una prueba?', note: 'Contraste independiente del primer modelo.' },
          { term: 'Checklist 4', value: '¿Cumple el criterio de "mejor" definido?', note: 'Compara con la métrica acordada antes de empezar.' },
          { term: 'Métricas antes/después', value: 'registrar calidad, tiempo y errores antes y después', note: 'Sin línea base no se puede demostrar mejora.' },
          { term: 'Anti-patrón', value: 'aceptar la primera respuesta sin verificar', note: 'El borrador nunca es el producto final.' },
          { term: 'Anti-patrón', value: 'repetir la misma pregunta tras un mal resultado', note: 'Hay que reformular, no insistir.' },
          { term: 'Anti-patrón', value: 'delegar el juicio crítico al modelo', note: 'La decisión final siempre es humana.' },
          { term: 'Cierre del ciclo', value: 'reformular → contrastar → medir → decidir', note: 'Aceptar o iterar una vez más, con evidencia.' },
        ],
      },
    ],
  },

  /* =====================================================================
     22. LABORATORIO DE ROBÓTICA: ESCENARIOS PASO A PASO
     ===================================================================== */
  {
    id: 'laboratorio-robotica',
    title: 'Laboratorio de robótica: fórmulas y pasos clave',
    track: 'robotica',
    description: 'Referencia rápida de los escenarios interactivos: Ohm y RC, PWM de servo, PID, IMU, comandos ROS 2 y tf2/Nav2.',
    groups: [
      {
        title: 'Ohm, RC y PWM',
        items: [
          { term: 'Ley de Ohm', value: 'V = I · R', note: 'Base del escenario de LED y divisor: despeja I = V / R antes de montar.' },
          { term: 'Constante RC', value: 'τ = R · C', note: 'A 1τ el capacitor llega al 63% y a 5τ al 99%; mide el transitorio en Falstad.' },
          { term: 'Carga de capacitor', value: 'Vc(t) = Vf + (V0 - Vf)·e^(-t/τ)', note: 'V0 es la tensión inicial y Vf la final.' },
          { term: 'Resistencia de LED', value: 'R = (Vcc - Vf) / If', note: 'If típico de 10 a 20 mA; nunca alimentes el LED sin resistencia.' },
          { term: 'Duty PWM', value: 'Vmedia = duty · Vbus', note: 'En analogWrite, duty = valor / 255 con resolución de 8 bits.' },
          { term: 'Servo 50 Hz', value: 'Período 20 ms; pulso 1 ms = 0°, 1.5 ms = 90°, 2 ms = 180°', note: 'El ancho del pulso define el ángulo, no la frecuencia.' },
          { term: 'Ángulo desde pulso', value: 'ángulo = (pulso_us - 1000) · 180 / 1000', note: 'Ajusta los extremos reales de tu servo para no forzar los topes.' },
          { term: 'ADC a voltios', value: 'V = lectura · 3.3 / 4095', note: 'En ESP32 el rango útil está cerca de 0.1 a 3.2 V.' },
        ],
      },
      {
        title: 'Control PID',
        items: [
          { term: 'Ecuación discreta', value: 'u[k] = Kp·e[k] + Ki·Ts·Σe[i] + Kd·(e[k]-e[k-1])/Ts', note: 'e[k] = consigna - medición; Ts es el periodo de muestreo.' },
          { term: 'Kp', value: 'Reduce el error y acelera la respuesta', note: 'Muy alto produce oscilaciones.' },
          { term: 'Ki', value: 'Elimina el error estacionario', note: 'Muy alto causa sobreimpulso y windup.' },
          { term: 'Kd', value: 'Aporta amortiguación y anticipa la tendencia', note: 'Amplifica ruido: conviene filtrar la medición.' },
          { term: 'Anti-windup', value: 'Congela el integrador cuando la salida está saturada', note: 'Evita un gran sobreimpulso tras una saturación larga.' },
          { term: 'Ziegler-Nichols', value: 'Kp = 0.6·Ku, Ti = Tu/2, Td = Tu/8', note: 'Ku y Tu son la ganancia y el periodo de la oscilación sostenida.' },
          { term: 'Sobreimpulso', value: 'Mp = (max - final)/final · 100%', note: 'Objetivo típico: menos del 10 al 20%.' },
          { term: 'Error estacionario', value: 'ess = lím e(t) cuando t → infinito', note: 'Se elimina con un integrador si la planta es estable.' },
        ],
      },
      {
        title: 'IMU y filtros',
        items: [
          { term: 'Integrar giroscopio', value: 'θ += ω · Δt', note: 'El bias produce deriva lineal; calibra en reposo durante 2 a 5 s.' },
          { term: 'Pitch desde acel', value: 'pitch = atan2(ax, √(ay² + az²))', note: 'Solo válido en reposo o movimiento suave.' },
          { term: 'Filtro complementario', value: 'θ = α·(θ + ω·Δt) + (1-α)·θacel', note: 'α de 0.95 a 0.98: giro a corto plazo, acel a largo plazo.' },
          { term: 'Ganancia de Kalman', value: 'K = P·Hᵀ·(H·P·Hᵀ + R)⁻¹', note: 'K crece cuando la medición es fiable.' },
          { term: 'ToF', value: 'd = c · Δt / 2', note: 'El factor 1/2 es por el camino de ida y vuelta del pulso de luz.' },
          { term: 'Mediana de 5', value: 'Descarta outliers antes de filtrar', note: 'Un solo punto falso puede arruinar el filtro.' },
          { term: 'Odometría diferencial', value: 'v = (vr + vl)/2 ; ωz = (vr - vl)/L', note: 'L es la separación entre ruedas.' },
          { term: 'Millis sin delay', value: 'if (millis() - t0 >= Ts) { t0 = millis(); ... }', note: 'Mantiene el lazo de control respondiendo.' },
        ],
      },
      {
        title: 'Comandos ROS 2 y grafo',
        items: [
          { term: 'Listar nodos', value: 'ros2 node list', note: 'Muestra los nodos activos del grafo.' },
          { term: 'Info de nodo', value: 'ros2 node info /mi_nodo', note: 'Publicadores, suscriptores, servicios y parámetros.' },
          { term: 'Grafo visual', value: 'rqt_graph', note: 'Dibuja nodos y topics en tiempo real.' },
          { term: 'Listar topics', value: 'ros2 topic list -t', note: '-t añade el tipo de mensaje de cada topic.' },
          { term: 'Frecuencia real', value: 'ros2 topic hz /mi_topic', note: 'Diagnostica caídas de tasa en el lazo.' },
          { term: 'Publicar', value: 'ros2 topic pub -r 10 /cmd_vel geometry_msgs/msg/Twist "{linear: {x: 0.2}}"', note: '-r publica de forma continua a 10 Hz.' },
          { term: 'Echo con campo', value: 'ros2 topic echo /odom --field pose.pose.position', note: 'Filtra un campo concreto del mensaje.' },
          { term: 'Ver interfaces', value: 'ros2 interface show geometry_msgs/msg/Twist', note: 'Muestra la definición completa del mensaje.' },
        ],
      },
      {
        title: 'tf2 y Nav2',
        items: [
          { term: 'Árbol de marcos', value: 'map → odom → base_link → sensor_link', note: 'Cada marco tiene un solo padre; no puede haber ciclos.' },
          { term: 'Ver árbol TF', value: 'ros2 run tf2_tools view_frames', note: 'Genera un PDF con el grafo de transformaciones.' },
          { term: 'Echo de TF', value: 'ros2 run tf2_ros tf2_echo map base_link', note: 'Imprime la transformación entre dos marcos.' },
          { term: 'TF estático', value: 'ros2 run tf2_ros static_transform_publisher 0 0 0.1 0 0 0 map odom', note: 'Argumentos: x y z yaw pitch roll padre hijo.' },
          { term: 'Convención de ejes', value: 'X adelante, Y izquierda, Z arriba', note: 'Los frame_id no empiezan por barra en ROS 2.' },
          { term: 'Arrancar Nav2', value: 'ros2 launch nav2_bringup bringup_launch.py use_sim_time:=true map:=mapa.yaml', note: 'Levanta map server, AMCL, planner y controller.' },
          { term: 'Enviar objetivo', value: 'ros2 topic pub /goal_pose geometry_msgs/msg/PoseStamped "{...}"', note: 'El destino debe caer en una celda libre del costmap.' },
          { term: 'Robot parado', value: 'ros2 topic echo /behavior_tree_log', note: 'El árbol de comportamiento explica el bloqueo.' },
        ],
      },
    ],
  },

  /* =====================================================================
     23. LABORATORIO DE IA: ESCENARIOS PASO A PASO
     ===================================================================== */
  {
    id: 'laboratorio-ai',
    title: 'Laboratorio de IA: fórmulas y pasos clave',
    track: 'ai',
    description: 'Referencia rápida de los escenarios de IA: atención, retropropagación, caché KV, inferencia y evaluación de modelos.',
    groups: [
      {
        title: 'Atención y transformers',
        items: [
          { term: 'Producto punto escalado', value: 'Attention(Q,K,V) = softmax(Q·Kᵀ / √d_k)·V', note: '√d_k evita que los logits crezcan y saturen el softmax.' },
          { term: 'Formas de Q, K, V', value: 'Q,K,V ∈ R^(n · d_model); Q·Kᵀ ∈ R^(n · n)', note: 'n es la longitud de la secuencia.' },
          { term: 'Multi-head', value: 'head_i = Attention(Q·WQi, K·WKi, V·WVi)', note: 'Se concatenan los cabezales y se proyecta con Wᴼ.' },
          { term: 'Codificación posicional', value: 'PE(pos,2i) = sen(pos / 10000^(2i/d))', note: 'Aporta orden sin recurrencia.' },
          { term: 'Máscara causal', value: 'softmax se aplica solo a posiciones ≤ i', note: 'Impide que el token vea el futuro al generar.' },
          { term: 'Residual + LayerNorm', value: 'x = LayerNorm(x + Subcapa(x))', note: 'Estabiliza el entrenamiento de redes profundas.' },
          { term: 'Temperatura', value: 'softmax(logits / T)', note: 'T bajo es más determinista; T alto, más creativo.' },
          { term: 'top_p', value: 'Conserva el conjunto mínimo de tokens con probabilidad acumulada p', note: '0.9 es un valor típico.' },
        ],
      },
      {
        title: 'Backprop y entrenamiento',
        items: [
          { term: 'Regla de la cadena', value: '∂L/∂x = (∂L/∂y)·(∂y/∂x)', note: 'El grafo de autograd aplica esto capa por capa.' },
          { term: 'Gradiente de pesos', value: '∂L/∂W = xᵀ · δ', note: 'δ es el gradiente de la salida de la capa.' },
          { term: 'Pérdida', value: 'L = -Σ y_i · log(ŷ_i)', note: 'Entropía cruzada para clasificación multiclass.' },
          { term: 'Paso SGD', value: 'W ← W - lr · ∂L/∂W', note: 'El learning rate controla el tamaño del paso.' },
          { term: 'AdamW', value: 'momento + decaimiento de pesos desacoplado', note: 'Default práctico en transformers.' },
          { term: 'Clip de gradiente', value: 'clip_grad_norm_(params, 1.0)', note: 'Evita explosión de gradientes.' },
          { term: 'Ciclo de entrenamiento', value: 'zero_grad → forward → loss → backward → step', note: 'Olvidar zero_grad acumula gradientes de más.' },
          { term: 'Overfitting', value: 'Compara pérdida de entrenamiento y validación', note: 'Early stopping cuando la validación deja de bajar.' },
        ],
      },
      {
        title: 'Caché KV e inferencia',
        items: [
          { term: 'Qué guarda', value: 'K y V de todas las capas y tokens ya procesados', note: 'Evita recalcular el prefijo en cada paso de decodificación.' },
          { term: 'Forma de la caché', value: '[n_capas, n_tokens, n_cabezales, d_k] × 2 (K y V)', note: 'Crece linealmente con el contexto.' },
          { term: 'Memoria aprox.', value: '2 · n_capas · L · d_model · bytes_por_valor', note: 'Con fp16 son 2 bytes; multiplica por lote y secuencia.' },
          { term: 'Sin caché', value: 'Coste por token ∝ L²', note: 'Recalcular todo el prefijo es la comparación del escenario.' },
          { term: 'Con caché', value: 'Coste por token ∝ L', note: 'Solo se procesa el token nuevo.' },
          { term: 'TTFT', value: 'Tiempo hasta el primer token', note: 'Mide la percepción de rapidez.' },
          { term: 'Throughput', value: 'tokens generados / segundo', note: 'Mide el rendimiento sostenido.' },
          { term: 'Batching continuo', value: 'Agrupa peticiones en curso en cada paso', note: 'Multiplica el throughput frente a una petición a la vez.' },
        ],
      },
      {
        title: 'Evaluación de LLMs',
        items: [
          { term: 'División justa', value: 'train / valid / test con semilla fija', note: 'Nunca ajustes hiperparámetros sobre el test.' },
          { term: 'Exact match', value: 'pred == referencia', note: 'Métrica estricta; útil cuando hay una sola respuesta correcta.' },
          { term: 'F1', value: '2·P·R / (P + R)', note: 'Une precisión y recall en tareas de extracción.' },
          { term: 'Perplejidad', value: 'PPL = exp(pérdida media por token)', note: 'Más bajo es mejor; compara solo modelos con el mismo tokenizer.' },
          { term: 'ROUGE / BLEU', value: 'Solapamiento de n-gramas con la referencia', note: 'Rápido, pero no mide semántica.' },
          { term: 'Juez LLM', value: 'Otro modelo puntúa con una rúbrica', note: 'Contrasta con humanos: comparte sesgos.' },
          { term: 'RAGAS', value: 'faithfulness, answer_relevancy, context_precision', note: 'Separa fallos de recuperación y de generación.' },
          { term: 'Tasa de éxito', value: 'ensayos correctos / ensayos totales', note: 'Fija semilla y reinicia el escenario entre ensayos.' },
        ],
      },
      {
        title: 'Mini-bench paso a paso',
        items: [
          { term: '1. Definir tarea', value: 'Escribe la instrucción y el criterio de éxito', note: 'Sin criterio no hay métrica posible.' },
          { term: '2. Casos', value: '50 ejemplos con entrada y salida esperada', note: 'Incluye casos límite y difíciles.' },
          { term: '3. Línea base', value: 'Evalúa primero un modelo o regla simple', note: 'Sin base no se puede demostrar mejora.' },
          { term: '4. Fijar semilla', value: 'seed=42 y parámetros de generación constantes', note: 'La temperatura cambia los resultados.' },
          { term: '5. Ejecutar', value: 'Mismo prompt y mismo dataset para cada modelo', note: 'Registra latencia y coste además de la calidad.' },
          { term: '6. Analizar', value: 'Agrupa errores por categoría', note: 'Muestra ejemplos concretos, no solo el promedio.' },
          { term: '7. Reportar', value: 'Tabla con métrica, intervalo y número de casos', note: 'Publica el prompt y la versión del modelo.' },
          { term: '8. Repetir', value: 'Vuelve a medir tras cada cambio', note: 'El bench solo sirve si se usa de forma continua.' },
        ],
      },
    ],
  },
];
