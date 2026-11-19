import type { LessonBridge } from '../../../types';
import { apunte, formula, diagrama, pasos, tabla, h, lista } from '../../helpers';

/**
 * Profundización de electrónica para la lección r1-3 (Divisores de voltaje y su trampa).
 * Se centra en la derivación del divisor, el diseño con valores normalizados,
 * la potencia, el efecto de la carga (Thevenin) y las soluciones prácticas.
 */
export const electronicsLessonDeep: Record<string, LessonBridge> = {
  'r1-3': {
    why: `El divisor de voltaje es el circuito más usado y el más maltratado de la electrónica básica. Sirve para adaptar un sensor de 5 V a un ADC de 3.3 V, para crear una referencia, para leer un potenciómetro o para bajar un nivel lógico; y sin embargo falla en silencio en cuanto conectas una carga, porque deja de ser la relación limpia que prometía la fórmula. Entender su impedancia de salida —y la idea de Thevenin detrás— separa a quien copia un par de resistencias de quien diseña un circuito que funciona con el sensor real, con el cable real y con la placa real.`,
    from: `«Kirchhoff, series y paralelos» te entregó las dos herramientas: KVL para sumar caídas en el lazo y la ley de Ohm para convertir cada resistencia en una caída de tensión. El divisor no es un tema nuevo: es KVL más Ohm aplicados a dos resistencias en serie y un nodo intermedio al que llamamos salida.`,
    to: `El divisor se comporta como un circuito resistivo puro: su salida no depende del tiempo. «Capacitores y desacople» introduce el primer elemento cuya respuesta sí cambia con el tiempo, y explica por qué esa misma salida que ahora es estable empieza a filtrar, a retardarse y a necesitar un capacitor cerca del pin que la lee.`,
    analogy: `Imagina dos tramos de manguera en serie con una unión intermedia: la presión que encuentras en esa unión es la fracción de la presión total que cae antes de llegar a la salida. Si pinchas la manguera en la unión para sacar agua, la presión se hunde; por eso el divisor da tensiones preciosas pero no alimenta cargas.`,

    extraBlocks: [
      apunte(`Partimos de un lazo simple: una fuente Vin, una resistencia R1 arriba, una resistencia R2 abajo y el punto entre ambas, que es Vout. KVL dice que la suma de caídas en el lazo cerrado es cero, así que Vin = VR1 + VR2. La ley de Ohm dice que VR1 = I·R1 y VR2 = I·R2. Como las dos resistencias están en serie, por ambas circula exactamente la misma corriente I; no hay ningún nodo intermedio que consuma corriente porque todavía no hemos conectado nada a Vout. Sustituyendo en KVL queda Vin = I·R1 + I·R2 = I·(R1 + R2), y despejamos la corriente del lazo: I = Vin/(R1 + R2). Ahora solo falta preguntar por la caída que nos interesa, la de R2, porque Vout se mide justo encima de R2: Vout = VR2 = I·R2 = Vin·R2/(R1 + R2). Fíjate en lo que ha pasado: la corriente I se ha cancelado y Vout ya no depende de ella, solo de Vin y de la proporción entre resistencias. Esa es la razón profunda de que el divisor sea tan popular: la tensión de salida queda fijada por una razón geométrica entre dos componentes, no por el valor absoluto de la corriente. La intuición de la proporción es esta: en serie la corriente es común, luego cada resistencia se queda con una caída directamente proporcional a su valor. Si R2 vale el doble que R1, R2 se queda con dos tercios de Vin y R1 con un tercio. Si R1 y R2 son iguales, cada una se queda con la mitad y Vout = Vin/2. En general Vout es Vin multiplicado por el tanto por ciento que R2 representa del total R1 + R2. El nodo intermedio «se sienta» a una altura eléctrica igual a la fracción de resistencia que tiene por debajo. Esta imagen mental —cuánta resistencia hay debajo del nodo— permite estimar cualquier divisor en la cabeza antes de tocar la calculadora.`, '1. De KVL y Ohm a la fórmula del divisor'),
      formula(`Vout = Vin · R2 / (R1 + R2) = Vin · k     donde     k = R2 / (R1 + R2) es el factor de división`, `R1 va arriba, a Vin; R2 va abajo, a GND (masa, el punto de referencia de 0 V). Si intercambias las dos, obtienes el complemento 1 − k y la salida ya no es la que buscabas.`),
      diagrama('divisor', 'El nodo entre R1 y R2 es la salida: Vout es la caída sobre R2.'),

      pasos([
        { title: '1. Fija el factor de división', text: `Queremos 3.3 V partiendo de 5 V, así que k = Vout/Vin = 3.3/5 = 0.66. Es decir, R2 debe valer el 66 % de la resistencia total y R1 el 34 % restante.` },
        { title: '2. Elige R1 y despeja R2', text: `De k = R2/(R1 + R2) se saca R2 = R1·k/(1 − k) = R1·Vout/(Vin − Vout). Tomando R1 = 10 kΩ: R2 = 10k·3.3/(5 − 3.3) = 10k·3.3/1.7 ≈ 19.4 kΩ.` },
        { title: '3. Redondea a un valor normalizado', text: `En la serie E24 tenemos 19 kΩ y 20 kΩ. Con 20 kΩ, Vout = 5·20/(10 + 20) = 3.33 V; con 19 kΩ, Vout = 5·19/29 ≈ 3.28 V. Si el dispositivo alimentado por 3.3 V admite un 2 % de margen, 20 kΩ es aceptable, pero conviene comprobarlo.` },
        { title: '4. Mejora el par si hace falta', text: `Una combinación E24 más fina es R1 = 4.7 kΩ y R2 = 9.1 kΩ: k = 9.1/13.8 = 0.6594 y Vout ≈ 3.297 V, con un error de solo −0.1 %. Además la resistencia total baja a 13.8 kΩ, lo que reduce la impedancia de salida.` },
        { title: '5. Verifica corriente y potencia', text: `Con 10 kΩ y 20 kΩ, I = 5/30 kΩ ≈ 0.167 mA. La potencia total es Vin·I ≈ 0.83 mW, repartida en 0.28 mW para R1 y 0.56 mW para R2: cualquier resistencia de 1/16 W sobra. El divisor solo genera una referencia; no alimentes nada con él.` }
      ]),

      pasos([
        { title: '1. Calcula el factor', text: `Queremos 1.8 V desde 3.3 V (típico para el núcleo de algún sensor o MCU de bajo consumo): k = 1.8/3.3 = 0.5455.` },
        { title: '2. Despeja la relación entre resistencias', text: `R2 = R1·Vout/(Vin − Vout) = R1·1.8/(3.3 − 1.8) = R1·1.8/1.5 = 1.2·R1. La resistencia inferior debe valer 1.2 veces la superior.` },
        { title: '3. Busca un par E24 exacto', text: `La serie E24 contiene el 12, que es justo 1.2 veces el 10. Con R1 = 10 kΩ y R2 = 12 kΩ: Vout = 3.3·12/(10 + 12) = 3.3·12/22 = 1.8 V exactos, sin error de redondeo.` },
        { title: '4. Comprueba la corriente', text: `I = 3.3/22 kΩ = 0.15 mA. La potencia disipada es 3.3·0.15 mA ≈ 0.5 mW. Si necesitas menos impedancia de salida, usa R1 = 4.7 kΩ y R2 = 5.6 kΩ (E24): k = 5.6/10.3 = 0.544 y Vout ≈ 1.795 V, con I ≈ 0.32 mA.` },
        { title: '5. Decisión', text: `Para una referencia de alta impedancia, 10 kΩ y 12 kΩ es la elección limpia. Para un nodo que será muestreado rápido por un ADC, baja a 4.7 kΩ y 5.6 kΩ o añade un buffer.` }
      ]),

      pasos([
        { title: '1. Factor de división', text: `De 12 V a 5 V: k = 5/12 = 0.4167. R2 debe ser el 41.7 % del total y R1 el 58.3 %.` },
        { title: '2. Relación necesaria', text: `R2 = R1·5/(12 − 5) = R1·5/7 ≈ 0.714·R1. Con R1 = 10 kΩ harían falta 7.14 kΩ; en E24 están 6.8 kΩ y 7.5 kΩ, que dan 4.86 V y 5.14 V respectivamente.` },
        { title: '3. Ajuste con valores E24', text: `Un par mejor es R1 = 4.7 kΩ y R2 = 3.3 kΩ: k = 3.3/8.0 = 0.4125 y Vout = 12·0.4125 = 4.95 V, un −1 % aceptable para una referencia. Otra opción es R1 = 10 kΩ y R2 = 6.8 kΩ si prefieres menos consumo.` },
        { title: '4. Mira la potencia y la temperatura', text: `Con 4.7 kΩ y 3.3 kΩ la corriente es 12/8 kΩ = 1.5 mA y la potencia total es 12·1.5 mA = 18 mW, repartidos en 10.6 mW y 7.4 mW. Sigue siendo seguro con resistencias de 1/8 W, pero ya no es despreciable si el divisor está siempre conectado a una batería.` },
        { title: '5. Advertencia de diseño', text: `Este divisor sirve para crear una referencia o para medir los 12 V con un ADC, nunca para alimentar un circuito de 5 V. Para alimentar carga usa un regulador: un 7805 o, mejor, un buck conmutado que no convierta 7 V de diferencia en calor. Aquí la tensión de entrada además puede variar, y un divisor la sigue ciegamente mientras que un regulador la mantiene.` }
      ]),

      tabla(['Objetivo', 'k = Vout/Vin', 'R1', 'R2 (E24)', 'Vout real', 'Error'], [
        ['5 V → 3.3 V', '0.660', '4.7 kΩ', '9.1 kΩ', '3.297 V', '−0.1 %'],
        ['3.3 V → 1.8 V', '0.545', '10 kΩ', '12 kΩ', '1.800 V', '0.0 %'],
        ['12 V → 5 V', '0.417', '4.7 kΩ', '3.3 kΩ', '4.950 V', '−1.0 %'],
        ['5 V → 2.5 V', '0.500', '10 kΩ', '10 kΩ', '2.500 V', '0.0 %']
      ]),

      apunte(`Los valores de la tabla pertenecen a las series normalizadas E12 y E24. E12 tiene doce valores por década —10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82— y E24 añade otros doce intermedios —11, 13, 16, 20, 24, 30, 36, 43, 51, 62, 75, 91—, todos multiplicables por 10, 100, 1000 y así sucesivamente. La tolerancia típica es del 10 % en E12 y del 5 % en E24, así que incluso un divisor «exacto» en el papel puede desviarse varios puntos en la placa: dos resistencias del 5 % en direcciones opuestas pueden dar un error de hasta el 10 % en k. Por eso conviene recalcular siempre Vout con los valores reales elegidos, comprar resistencias del 1 % cuando la referencia importa y, si hace falta, añadir un recorte en software. La serie E24 casi siempre permite acertar dentro del 1 % sin recurrir a E96 más caras.`, 'Series E12 y E24: del número bonito al componente real'),

      formula(`I_div = Vin / (R1 + R2)      P_R1 = I²·R1      P_R2 = I²·R2      P_total = Vin² / (R1 + R2) = Vin · I_div`, `La potencia disipada en cada resistencia es I²·R; elige una potencia nominal al menos el doble de la calculada para no trabajar en el límite térmico.`),
      diagrama('potencia_resistencia', 'La energía que no llega a la salida se convierte en calor en las dos resistencias.'),
      apunte(`Hay un compromiso oculto en el valor absoluto de R1 y R2. La fórmula de Vout solo depende de la razón entre ellos, así que 10 kΩ y 20 kΩ dan la misma tensión que 100 Ω y 200 Ω. Lo que cambia es todo lo demás. Con resistencias altas, la corriente del divisor es pequeña y se gasta poca energía, pero la impedancia vista desde la salida —R1 en paralelo con R2— es grande, y cualquier corriente que la carga robe desplaza la tensión. Con resistencias bajas, la impedancia de salida es pequeña y el divisor aguanta mejor la carga y el ruido, pero la corriente permanente y la potencia disipada crecen. En el ejemplo de 5 V, pasar de 10 kΩ/20 kΩ (I ≈ 0.167 mA, P ≈ 0.83 mW) a 100 Ω/200 Ω (I ≈ 16.7 mA, P ≈ 83 mW) multiplica el consumo por cien. En un proyecto alimentado por USB eso es irrelevante; en un sensor alimentado por batería durante meses, es la diferencia entre durar una temporada o durar un fin de semana. La regla práctica es empezar con resistencias en el rango de 1 kΩ a 100 kΩ, bajarlas solo cuando la carga o la velocidad lo exijan, y pasar a un buffer cuando bajarlas ya cueste demasiada energía.`, 'Corriente, potencia y el equilibrio oculto'),

      formula(`Vth = Vin · R2 / (R1 + R2)      Rth = R1 ∥ R2 = R1·R2 / (R1 + R2)      Vout_cargada = Vth · RL / (Rth + RL)`, `Para hallar Rth se cortocircuita la fuente Vin (se sustituye por un cable a masa) y se mira la resistencia que queda entre Vout y GND: R1 y R2 quedan en paralelo. El error relativo es Rth / (Rth + RL).`),
      diagrama('divisor_carga', 'La carga RL queda en paralelo con R2: ya no puedes usar la fórmula ideal.'),
      apunte(`Aquí está la trampa que da nombre a la lección. La fórmula Vout = Vin·R2/(R1 + R2) es cierta solo si nadie saca corriente del nodo intermedio. En cuanto conectas un pin ADC, un comparador o cualquier entrada, esa entrada presenta una impedancia de entrada finita RL a masa y la carga queda en paralelo con R2. El equivalente de R2 pasa a ser R2' = R2 ∥ RL, que siempre es menor que R2, y por tanto Vout cae. La forma elegante de verlo es el equivalente de Thevenin: desde el nodo de salida, todo el divisor se comporta como una fuente ideal de valor Vth —la tensión en vacío, que es justo la fórmula clásica— en serie con una resistencia Rth igual a R1 en paralelo con R2. Al conectar RL se forma un segundo divisor entre Rth y RL, y la salida real es Vth·RL/(Rth + RL). El error cometido al usar la fórmula ideal es exactamente Rth/(Rth + RL): si RL vale diez veces Rth el error es del 9,1 %, si vale cien veces Rth baja al 1 %. La regla del 10× es la misma idea expresada en corriente: pedir I_div ≥ 10·I_carga equivale a RL ≥ 10·Rth, así que deja ese 9,1 % y no un error nulo. Fíjate en la consecuencia incómoda: esa regla popular deja errores de varios por ciento, suficiente para que un ADC de 12 bits pierda varios cientos de cuentas. Cuando la precisión importa, exige RL al menos cien veces Rth o añade un buffer. En un ADC, además, la impedancia no es puramente resistiva: el convertidor tiene un capacitor de muestreo y una resistencia de conmutación, de modo que la impedancia eficaz depende de la frecuencia de muestreo y del tiempo de adquisición. Por eso los datasheet recomiendan impedancias de fuente bajas, del orden de unos pocos kΩ, o un capacitor junto al pin que suministre la carga instantánea durante el muestreo.`, 'La carga, la impedancia del ADC y el equivalente de Thevenin'),

      tabla(['Caso', 'Divisor', 'Rth', 'Carga RL', 'Vout real', 'Error'], [
        ['ADC de alta impedancia', '10 kΩ / 20 kΩ', '6.67 kΩ', '1 MΩ', '3.311 V', '0.66 %'],
        ['Carga media', '10 kΩ / 20 kΩ', '6.67 kΩ', '10 kΩ', '2.00 V', '40 %'],
        ['Divisor bajo mismo RL', '100 Ω / 200 Ω', '66.7 Ω', '10 kΩ', '3.311 V', '0.66 % (I = 16.7 mA, P = 83 mW)']
      ]),

      lista([
        `Bajar R: es la solución más simple. Mantener la razón R2/(R1 + R2) pero dividir ambos valores por cien reduce Rth en el mismo factor y hace que la carga apenas influya. El precio es la corriente permanente y el calor: en el tercer caso del ejemplo se consume 83 mW solo para tener una referencia.`,
        `Buffer con op-amp: se coloca un amplificador operacional en configuración de seguidor entre Vout y la carga. Su entrada apenas consume corriente y su salida puede entregar decenas de mA, así que el divisor sigue viendo una carga casi infinita mientras el op-amp alimenta el ADC o el cable. Es la solución precisa y eficiente cuando la referencia es importante.`,
        `Diodo Zener: una zener en paralelo con la salida, con una resistencia series desde Vin, fija Vout alrededor de su tensión de ruptura Vz mientras circule corriente suficiente. Es barato y robusto como referencia burda, pero menos preciso que un regulador, depende de la corriente y disipa corriente de deriva continuamente.`,
        `Regulador: un LDO (low-dropout, regulador lineal de baja caída) como 7805 o AMS1117, o un buck conmutado si la diferencia de tensión es grande, mantiene Vout aunque cambie la carga o Vin. Es la única respuesta correcta cuando hay que alimentar algo de verdad; el divisor nunca debe usarse como fuente de alimentación.`
      ]),

      apunte(`Un amplificador operacional, u op-amp, es un chip con dos entradas —invertida y no invertida— que amplifica la diferencia entre ellas con una ganancia enorme. Si conectas la salida directamente a la entrada invertida y aplicas Vout del divisor a la no invertida, el dispositivo ajusta su salida hasta que ambas entradas coinciden: la ganancia efectiva es 1 y la salida copia la entrada. Eso es un seguidor de tensión o buffer. Lo maravilloso no es la copia, sino el aislamiento: la entrada del op-amp tiene una impedancia del orden de MΩ o más, así que no roba corriente al divisor y Vout se mantiene ideal; la salida, en cambio, tiene una impedancia de unos pocos ohmios y puede mover la carga o cargar el capacitor de un ADC sin que la tensión se desplome. Dos detalles al elegirlo: debe ser rail-to-rail si vas a trabajar cerca de 0 V o de la alimentación, y su rango de salida está limitado por sus propias tensiones de alimentación (un op-amp alimentado a 5 V no puede dar 5 V exactos salvo que sea rail-to-rail). Un MCP6001 o un TLV6001 alimentados a 3.3 V o 5 V cubren la mayoría de los casos de robótica.`, 'Qué es un buffer con op-amp y por qué salva el divisor'),

      apunte(`Tres usos cotidianos del divisor. Primero, niveles lógicos: el TX de un sensor a 5 V no debe entrar directo en el RX de un ESP32 a 3.3 V, porque el pin solo tolera VDD + 0.3 V. Un divisor con R1 = 1.6 kΩ y R2 = 3.3 kΩ baja 5 V a 3.32 V; con R1 = 2 kΩ y R2 = 3.3 kΩ se obtiene 3.13 V, más conservador. Ojo con la velocidad: las resistencias y la capacitancia parásita de la entrada forman un filtro pasa bajo que redondea los flancos, así que en UART rápido o SPI conviene bajar R o usar un level shifter dedicado. Segundo, sensores resistivos: un potenciómetro es literalmente un divisor con el cursor en el nodo intermedio, y la posición del cursor decide k; una LDR (fotorresistencia) baja su resistencia con la luz, y si la pones como R2 la salida sube con la iluminación, mientras que como R1 baja; un termistor NTC reduce su resistencia al calentarse, así que colocándolo como R1 la salida sube con la temperatura (10 kΩ/10 kΩ a 25 °C dan 1.65 V desde 3.3 V, y si el NTC cae a 5 kΩ la salida sube a 2.2 V). En los tres casos la relación entre resistencia y magnitud física es no lineal, así que hay que calibrar con dos puntos o con una tabla. Tercero, referencias: un divisor a partir de una alimentación limpia crea la mitad de escala, 1.65 V desde 3.3 V, para polarizar una señal AC, fijar el umbral de un comparador o dar una referencia a un ADC. Si la referencia ha de ser estable, tómala de una fuente de estabilidad superior a la alimentación y añádele un buffer; si la alimentación es ruidosa, el ruido se divide también y aparece en tu medida.`, 'Aplicaciones: niveles lógicos, sensores resistivos y referencias'),
      diagrama('gpio_limit', 'Un GPIO no tolera más que su alimentación: baja el nivel con un divisor antes de entrar.'),

      h('7. Tabla de errores típicos'),
      tabla(['Síntoma o error', 'Causa', 'Solución'], [
        ['La salida cae al conectar el ADC o la carga', 'La carga queda en paralelo con R2 y reduce su equivalente', 'Baja R, aumenta RL por encima de 100·Rth o añade un buffer'],
        ['Esperaba 3.3 V y mido 1.7 V', 'R1 y R2 están invertidos: obtienes el complemento 1 − k', 'R1 siempre arriba hacia Vin, R2 abajo hacia GND'],
        ['La lectura flota o salta sin sentido', 'Falta GND común entre la fuente, el divisor y el microcontrolador', 'Conecta todas las masas en un único punto; sin referencia común no hay Vout definida'],
        ['El divisor funciona en vacío pero falla con el sensor real', 'Resistencias demasiado altas: Rth grande, ruido y capacitancia parásita', 'Baja a unos kΩ, pon un capacitor de desacople o usa un seguidor'],
        ['La tensión cambia cuando cambia la alimentación', 'Un divisor no regula: sigue a Vin multiplicado por k', 'Usa una referencia o un regulador si Vin no es estable'],
        ['La resistencia se calienta', 'Corriente excesiva al bajar mucho R', 'Sube R, reparte potencia o elige una resistencia de mayor potencia nominal']
      ]),

      apunte(`Tres ejercicios resueltos para fijar el método. Ejercicio A: diseña un divisor que dé 2.5 V desde 5 V con R1 = 10 kΩ. k = 0.5, así que R2 = 10k·2.5/(5 − 2.5) = 10 kΩ; I = 5/20 kΩ = 0.25 mA y P_total = 5·0.25 mA = 1.25 mW. Dos resistencias iguales, mitad de tensión. Ejercicio B: el divisor anterior de 10 kΩ/10 kΩ con Vin = 9 V se carga con RL = 1 kΩ. Vth = 4.5 V y Rth = 10k ∥ 10k = 5 kΩ; la salida real es 4.5·1/(5 + 1) = 0.75 V, un error del 83 %. La carga de 1 kΩ es cinco veces menor que Rth y se come la referencia: hace falta un buffer. Ejercicio C: un termistor NTC de 10 kΩ a 25 °C se coloca como R1 con R2 = 10 kΩ y Vin = 3.3 V; Vout = 1.65 V. Si el NTC baja a 5 kΩ por temperatura, Vout = 3.3·10/(5 + 10) = 2.2 V. La subida de 1.65 V a 2.2 V codifica el calor, pero la curva R(T) del NTC es exponencial: para convertirla en grados necesitas la ecuación de Steinhart-Hart o una tabla de calibración, no una simple regla de tres.`, '8. Ejercicios resueltos'),

      lista([
        `Define Vin, la Vout deseada y calcula k = Vout/Vin.`,
        `Elige R1 dentro de un rango razonable, normalmente entre 1 kΩ y 100 kΩ, pensando en consumo.`,
        `Calcula R2 = R1·Vout/(Vin − Vout) y redondea a un valor E12 o E24.`,
        `Recalcula Vout con los valores reales y comprueba que el error cabe en la tolerancia del dispositivo.`,
        `Calcula I_div y la potencia de cada resistencia; elige una potencia nominal con margen del doble.`,
        `Calcula Rth = R1 ∥ R2 y compáralo con la impedancia de la carga: exige RL ≥ 100·Rth si quieres menos del 1 % de error.`,
        `Si la carga es baja o cambiante, no basta con bajar R: pon un buffer, una zener o un regulador.`,
        `Verifica el GND común entre todas las partes y que Vout nunca supere el límite del pin que la recibe.`,
        `Mide con el multímetro en vacío y con la carga conectada; si las dos cifras coinciden, el diseño está cerrado.`,
        `Documenta los valores elegidos, la tensión medida y el motivo de la elección en el README del proyecto.`
      ])
    ]
  }
};
