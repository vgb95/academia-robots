import type { LessonBridge } from '../../../types';
import { p, h, apunte, nota, aviso, codigo, diagrama, tabla, lista, pasos, formula } from '../../helpers';

/**
 * Profundización de la lección r1-1: voltaje, corriente, resistencia y ley de Ohm.
 * Se entrega como LessonBridge para costar con el resto del track de robótica.
 * Todo el contenido es español técnico; sin caracteres CJK ni apóstrofos.
 */
export const electronicsLessonDeep: Record<string, LessonBridge> = {
  'r1-1': {
    why: `Todo lo que viene después en electrónica —un divisor, un filtro RC, un driver de motor, una lectura de ADC— es la ley de Ohm con una capa más encima. Si no se distingue presión de caudal, se confunde voltaje con corriente, se conecta un LED sin resistencia y se acaba quemando un pin que no se puede reparar. Esta es la única lección del track donde una fórmula mal aplicada destruye hardware de forma irreversible, y por eso merece un tratamiento mucho más detallado que el que cabe en 16 minutos de clase.`,
    from: `«Cómo usar esta academia» fijó el método de trabajo y la regla del README; aquí empieza la primera capa física y aparece el instrumento que la mide, el multímetro.`,
    to: `La ley de Ohm resuelve un resistor suelto, pero un circuito real tiene varios. Queda abierta la pregunta de cómo repartir tensiones y corrientes entre ellos: la responde «Kirchhoff, series y paralelos», que convierte la intuición en contabilidad exacta.`,
    analogy: `Un circuito es como agua en una tubería: el voltaje es la diferencia de presión entre dos puntos, la corriente es el caudal que pasa por una sección y la resistencia es lo estrecho del paso. El caudal es el mismo en serie; lo que cambia es la presión, y lo que se disipa es calor, no agua consumida.`,
    extraBlocks: [
      h(`Voltaje: diferencia de potencial, no energía que se gasta`),

      p(`Cuando decimos que una fuente da 5 V no estamos hablando de una cantidad de energía guardada dentro del cable, sino de una diferencia de potencial eléctrico entre dos puntos: el trabajo que la fuente realiza por cada unidad de carga que mueve de un punto a otro. Formalmente, V_AB = W_AB / Q, donde W_AB es el trabajo (en julios) necesario para llevar una carga Q (en culombios) desde A hasta B. El voltio es, por tanto, un julio por culombio: 1 V = 1 J/C. Esta definición explica por qué el voltaje siempre necesita dos puntos: hablar de 5 V sin decir respecto de qué es como hablar de la altura de una montaña sin indicar desde dónde se mide. En electrónica ese segundo punto es la masa o GND, que se toma como referencia de 0 V por convenio. La analogía de la presión en una tubería es útil, pero conviene no llevarla demasiado lejos: la presión puede citarse en un punto, mientras que el voltaje es siempre una diferencia entre dos. Lo que ocurre en un circuito no es que la carga se gaste: los electrones no desaparecen al pasar por una resistencia. Lo que se transforma es la energía potencial de esos electrones, que la fuente les entregó y que el resistor convierte en calor o el LED en luz. Al volver al terminal negativo de la fuente, la carga sigue siendo la misma; solo ha bajado de potencial. Por eso un circuito en serie no pierde corriente: la cuenta de carga entrante y saliente cuadra en cada elemento. Confundir voltaje con energía lleva a frases como el resistor consume voltaje, que son incorrectas: el resistor crea una caída de tensión, es decir una diferencia de potencial entre sus terminales, y disipa potencia, pero no consume electrones. Multiplicando la definición por la carga recuperamos la energía transferida: W = V · Q, una relación que explica por qué una batería de mayor capacidad (más culombios) puede entregar más energía aunque su tensión sea la misma.`),

      tabla(['Prefijo', 'Símbolo', 'Factor', 'Ejemplo en electrónica'], [
        ['mili', 'm', '10^-3', '3,3 V = 3300 mV; 20 mA = 0,02 A'],
        ['micro', 'µ', '10^-6', '2 µA de consumo en reposo; 100 µF de capacitor'],
        ['kilo', 'k', '10^3', '10 kΩ de pull-up; 1 kHz de señal'],
        ['mega', 'M', '10^6', '1 MΩ de impedancia de entrada; 16 MHz de reloj'],
        ['kilo aplicado a V', 'kV', '10^3', '5 kV en una descarga electrostática'],
        ['sin prefijo (base)', '', '10^0', '5 V, 330 Ω, 0,01 A']
      ]),

      apunte(`Voltaje entre dos puntos y referencia`, `Un multímetro mide tensión entre sus dos puntas: colocas la roja en el punto que quieres medir y la negra en la referencia. Si mides 5 V en un pin y 5 V en el otro extremo de un cable ideal, la diferencia entre esos dos puntos es 0 V aunque ambos estén a 5 V respecto de GND. Por eso dos puntos pueden estar a la misma tensión y no circular corriente entre ellos: hace falta una diferencia. En un circuito con varias fuentes, elegir un nodo como 0 V permite hablar de tensiones con un solo número en lugar de diferencias entre cada par posible. Cuando alguien dice que un pin está a 3,3 V, está diciendo que entre ese pin y GND hay 3,3 V. Y cuando el pin está en 0 V no significa que no tenga electrones, sino que está al mismo potencial que la referencia. Esta costumbre de medir siempre respecto de GND es la que hace que un esquemático se pueda leer de un vistazo.`),

      p(`La corriente eléctrica es el flujo de carga a través de una sección: I = ΔQ/Δt. Un amperio es un culombio por segundo, y un culombio son aproximadamente 6,24·10^18 electrones, porque cada electrón tiene una carga elemental de 1,602·10^-19 C con signo negativo. En un metal los electrones de conducción se desplazan con una deriva lenta, del orden de milímetros por segundo, pero la señal eléctrica se propaga a una fracción considerable de la velocidad de la luz porque el campo empuja a todos los electrones a la vez, como una columna de agua que se mueve entera. Históricamente se definió el sentido convencional de la corriente como el sentido en que fluiría la carga positiva, desde el terminal positivo de la fuente hacia el negativo por el circuito externo. Esa convención la estableció Benjamin Franklin antes de que se descubriera el electrón y se conserva porque todos los esquemáticos, flechas y ecuaciones la usan. En los metales los electrones viajan en sentido contrario al convencional: salen del terminal negativo y llegan al positivo. Ninguna de las dos visiones es incorrecta; basta con no mezclarlas en la misma frase. La corriente convencional es la que aparece en las ecuaciones de Kirchhoff y en las flechas de los esquemáticos; la corriente de electrones es útil para entender qué pasa dentro del material. En un semiconductor, además de electrones hay huecos, que son lugares vacíos que se comportan como carga positiva, y ambos contribuyen al transporte, por lo que la idea de un único portador negativo ya no basta. En resumen: cuando calculas I = V/R estás usando la magnitud de la corriente convencional, y el signo solo indica si el flujo va a favor o en contra de la dirección que elegiste como positiva. ¿Por qué la corriente es igual en todos los puntos de un circuito en serie? Porque no hay ningún nodo donde la carga pueda acumularse: existe un único camino. Si en un punto entraran más electrones por segundo de los que salen, la carga se acumularía allí y el potencial cambiaría hasta restaurar el equilibrio; en régimen estacionario eso no ocurre. Es la conservación de la carga, que en forma de ley de Kirchhoff de corrientes (KCL) dice que la suma de corrientes que entran en un nodo iguala a la que sale. La analogía hidráulica lo hace evidente: si dos tramos de tubería están en serie, el mismo caudal pasa por ambos aunque uno sea más estrecho; lo que cambia es la presión, no el caudal. En serie, por tanto, la corriente es la misma en la fuente, en cada resistor y en cada cable; lo que se reparte es el voltaje, en proporción a cada resistencia. Esa idea permite escribir I = V_total / R_total y después calcular cada caída como V_i = I · R_i. Si algún día mides corrientes distintas en dos puntos de un lazo que creías en serie, busca una rama en paralelo o una fuga: el circuito no era tan simple como parecía.`),

      diagrama(`ohm_agua`, `Analogía hidráulica: presión, caudal y estrechamiento; el caudal es el mismo en serie.`),

      p(`La resistencia mide la oposición que ofrece un material al paso de la corriente. No es una propiedad de un objeto aislado, sino de una geometría concreta hecha de un material concreto: R = ρ · L / A. Aquí ρ es la resistividad del material, en ohmios·metro; L es la longitud del conductor y A su sección transversal. Doble de longitud implica doble de resistencia, porque la carga encuentra el doble de obstáculos en serie; el doble de sección implica la mitad de resistencia, porque hay el doble de caminos en paralelo. El material importa más que la geometría: el cobre tiene una resistividad del orden de 1,68·10^-8 Ω·m y el nicrom (nichrome) ronda 1,1·10^-6 Ω·m, unas 65 veces mayor, y por eso el primero se usa en cables y el segundo en resistencias de calefacción. La temperatura también cuenta: en los metales, al subir la temperatura los átomos vibran más y dificultan el paso de los electrones, así que R aumenta de forma aproximadamente lineal, R(T) ≈ R0 · [1 + α · (T − T0)], con α ≈ 0,0039 por grado Celsius en el cobre. En los semiconductores ocurre lo contrario: más temperatura significa más portadores libres y menor resistencia, es decir un coeficiente negativo. Un filamento de bombilla incandescente es el ejemplo clásico: en frío tiene mucho menos resistencia que en caliente, lo que explica el pico de corriente que aparece justo al encenderla y que a menudo rompe el filamento en ese instante.`),

      formula(`R = ρ · L / A        R(T) = R0 · [1 + α · (T − T0)]`, `ρ en Ω·m, L en metros, A en metros cuadrados. α es el coeficiente térmico de resistividad: ≈ 0,0039 /°C para el cobre, negativo en semiconductores.`),

      tabla(['Material', 'ρ (Ω·m a 20 °C)', 'Coeficiente α (/°C)', 'Uso típico'], [
        ['Cobre', '1,68·10^-8', '+0,0039', 'Cables y pistas de PCB'],
        ['Aluminio', '2,65·10^-8', '+0,0043', 'Cables de alimentación'],
        ['Nicrom', '1,10·10^-6', '+0,0004', 'Resistencias y calefactores'],
        ['Carbón (grafito)', '≈ 3·10^-5', 'negativo', 'Resistencias económicas'],
        ['Silicio intrínseco', '≈ 2,3·10^3', 'negativo', 'Semiconductores y sensores']
      ]),

      diagrama(`resistencia_bandas`, `Código de colores: marrón, negro, naranja, oro = 10 kΩ con tolerancia del 5 %.`),

      p(`Si para un material óhmico mantenemos constante la temperatura, la corriente que lo atraviesa es proporcional a la tensión aplicada: al duplicar V se duplica I. Esa proporcionalidad se escribía antiguamente como I ∝ V y se convierte en igualdad introduciendo una constante: I = V / R, o de forma equivalente V = I · R. La resistencia no es otra cosa que el factor de proporcionalidad entre tensión y corriente; se mide en ohmios, y 1 Ω = 1 V/A. Despejar es solo aritmética: tapa la magnitud que buscas en el triángulo y lee la operación. La magnitud inversa es la conductancia, G = 1/R = I/V, y su unidad es el siemens (S). La ley de Ohm no es una ley fundamental como la conservación de la energía, sino una relación empírica que se cumple muy bien en metales y resistencias a temperatura constante; por eso es más correcto decir que un componente es óhmico que decir que la ley de Ohm es universal. Cuando la relación deja de ser una recta hablamos de elementos no lineales, y entonces V/I sigue siendo la resistencia estática en un punto de trabajo, pero ya no sirve para predecir qué ocurrirá si cambiamos la tensión: para eso hace falta la resistencia dinámica, r = dV/dI, calculada en las cercanías de ese punto.`),

      diagrama(`ohm_triangulo`, `V arriba, I y R abajo: V = I·R, I = V/R, R = V/I.`),

      pasos([
        {
          title: `1. LED rojo desde 5 V`,
          text: `Datos: fuente de 5 V, LED rojo con caída directa Vf ≈ 1,8 V y corriente deseada If = 10 mA (0,010 A). Paso 1: la resistencia debe absorber el resto de la tensión, V_R = Vs − Vf = 5 − 1,8 = 3,2 V. Paso 2: R = V_R / If = 3,2 / 0,010 = 320 Ω. Paso 3: elegimos el valor normalizado más cercano, 330 Ω. Paso 4: corriente real = 3,2 / 330 ≈ 9,7 mA, dentro del rango seguro. Paso 5: potencia disipada = I²·R ≈ 0,0097² · 330 ≈ 0,031 W, así que una resistencia de 1/4 W sobra.`
        },
        {
          title: `2. Resistor pull-up de un botón`,
          text: `Un pin se conecta a GND mediante un pulsador y necesita un pull-up a 5 V. Queremos unos 1 mA cuando el botón esté pulsado para tener un nivel bajo robusto sin gastar demasiado. Paso 1: R = V / I = 5 / 0,001 = 5000 Ω. Paso 2: usamos 4,7 kΩ, valor estándar. Paso 3: corriente real al pulsar = 5 / 4700 ≈ 1,06 mA. Paso 4: caída en la resistencia = 1,06 mA · 4,7 kΩ ≈ 5 V, por lo que el pin queda cerca de 0 V. Paso 5: con el botón suelto no circula corriente salvo la fuga de entrada, y el pin sube a 5 V; cuanto menor sea R, más rápido sube, pero más corriente gasta al pulsar.`
        },
        {
          title: `3. Divisor de 5 V a 3,3 V`,
          text: `Queremos alimentar una entrada de 3,3 V desde una fuente de 5 V con R1 = 10 kΩ entre Vin y Vout. Paso 1: despejamos del divisor, R2 = R1 · Vout / (Vin − Vout). Paso 2: R2 = 10 kΩ · 3,3 / (5 − 3,3) = 10k · 3,3 / 1,7 ≈ 19,4 kΩ. Paso 3: elegimos 20 kΩ normalizado. Paso 4: comprobamos Vout = 5 · 20 / (10 + 20) = 3,33 V. Paso 5: la corriente por el divisor, sin carga, es 5 / 30 kΩ ≈ 0,167 mA; si conectamos una carga que consuma algo parecido, el nodo se hunde y hay que bajar las resistencias o añadir un seguidor.`
        },
        {
          title: `4. Caída en el cable de una fuente`,
          text: `Una fuente de 5 V alimenta una carga que pide 2 A a través de un cable con 0,1 Ω de resistencia total. Paso 1: por Ohm, la caída en el cable es V_cable = I · R = 2 · 0,1 = 0,2 V. Paso 2: la tensión que llega a la carga es 5 − 0,2 = 4,8 V. Paso 3: la potencia perdida en el cable es P = I²·R = 4 · 0,1 = 0,4 W, que se convierte en calor. Paso 4: si la carga exige 5 V exactos, hay que usar cable más grueso (menos R) o una fuente con detección remota. Esta es la razón por la que un cable fino y largo hace que un motor arranque mal.`
        },
        {
          title: `5. Motor de 12 V con driver`,
          text: `Motor con resistencia de bobina de 24 Ω gobernado por un MOSFET con resistencia encendida Rds(on) = 0,1 Ω. Paso 1: con el rotor parado no hay fuerza contraelectromotriz, así que I_arranque = 12 / (24 + 0,1) ≈ 0,50 A. Paso 2: la caída en el driver es V_ds = 0,50 · 0,1 = 0,05 V. Paso 3: la potencia que disipa el MOSFET es I²·Rds ≈ 0,25 · 0,1 = 0,025 W, insignificante con un disipador pequeño. Paso 4: al girar aparece la fuerza contraelectromotriz, que se opone a la fuente, y la corriente baja; por eso el consumo en marcha es menor que al arranque. Paso 5: un pin GPIO no puede entregar 0,5 A, así que el pin solo manda la señal y la energía sale de la fuente de 12 V a través del driver.`
        },
        {
          title: `6. Sensor de temperatura en un divisor`,
          text: `Una termistor de 10 kΩ a 25 °C se coloca en el brazo inferior de un divisor con R1 = 10 kΩ alimentado a 3,3 V. Paso 1: Vout = Vin · R_sensor / (R1 + R_sensor) = 3,3 · 10 / (10 + 10) = 1,65 V. Paso 2: si el sensor sube a 20 kΩ, Vout = 3,3 · 20 / (10 + 20) = 2,20 V. Paso 3: un ADC de 12 bits convierte esos valores en códigos de 1,65/3,3 · 4095 ≈ 2048 y 2,20/3,3 · 4095 ≈ 2730. Paso 4: la corriente por el divisor es del orden de 0,165 mA, baja comparada con la impedancia de entrada del ADC, así que la lectura no se desploma. Paso 5: para precisión, hay que carácterizar la curva resistencia-temperatura del termistor, porque no es lineal.`
        }
      ]),

      codigo(`js`, `// Plantilla segura para dimensionar la resistencia de un LED.
// Todas las corrientes se pasan a amperios antes de calcular.
function disenoLED(Vs, Vf, If_mA) {
  const If = If_mA / 1000;          // mA -> A
  const Vr = Vs - Vf;               // tensión que cae en R
  if (Vr <= 0) throw new Error("Vf mayor que la fuente: el LED no encendera");
  const R = Vr / If;                // ley de Ohm
  const P = If * If * R;            // I^2 * R
  const nominal = 2 * P;            // margen de seguridad 2x
  return { R_ohm: R, P_W: P, nominal_W: nominal };
}
console.log(disenoLED(5, 1.8, 10));
// { R_ohm: 320, P_W: 0.032, nominal_W: 0.064 } -> 1/4 W sobra`, `Calculos con unidades y margen 2x`),

      formula(`P = V · I = I² · R = V² / R`, `La potencia es energia por unidad de tiempo: 1 W = 1 J/s. Las tres formas se transforman la una en la otra usando V = I·R.`),

      p(`La potencia eléctrica es la rapidez con la que se transfiere energía: P = W/t. Como V = W/Q e I = Q/t, al dividir W entre t obtenemos P = V · I, y sustituyendo la ley de Ohm aparecen las otras dos formas, P = I²·R y P = V²/R. La primera conviene cuando conoces corriente y resistencia, la segunda cuando tienes tensión y resistencia. Un resistor disipa toda esa potencia en forma de calor, y su potencia nominal indica cuánto calor puede evacuar al ambiente manteniendo su temperatura dentro de lo previsto. ¿Por qué se quema un resistor de 1/4 W? Porque la disipación calculada supera lo que el componente puede eliminar: con 100 Ω y 0,1 A, P = 0,1² · 100 = 1 W, cuatro veces por encima de 0,25 W; la temperatura sube, la resistencia deriva, el estaño se funde y el elemento acaba abierto o carbonizado. La regla práctica es elegir una potencia nominal al menos el doble de la disipación calculada: para 1 W hace falta un resistor de 2 W como mínimo, y más si trabaja dentro de una caja caliente o a alta temperatura ambiente. Este margen 2x absorbe las tolerancias, las variaciones de la fuente y el hecho de que el fabricante especifica la potencia a una temperatura concreta, por encima de la cual hay que reducirla. Volviendo al LED de 5 V y 330 Ω, la disipación era de apenas 0,031 W, así que incluso un resistor de 1/8 W sería suficiente; el de 1/4 W es el estándar barato y cómodo. En cambio, un divisor que quema 0,4 W necesita ya un resistor de 1 W, y una fuente lineal que tira (Vin − Vout)·I puede disipar varios vatios y exigir disipador.`),

      diagrama(`potencia_resistencia`, `La resistencia convierte energia en calor: elige un nominal de al menos 2x la disipacion calculada.`),

      p(`Vista como gráfica, la ley de Ohm de un componente óhmico es una recta que pasa por el origen: si representas V en el eje vertical e I en el horizontal, la pendiente es la resistencia R; si inviertes los ejes, la pendiente es la conductancia G = 1/R. La recta quiere decir que el componente se comporta igual a 1 V que a 5 V: mismo R, mismo coeficiente, sin importar la historia previa. Los elementos no lineales rompen esa recta. Un LED o un diodo siguen una relación exponencial del tipo I ≈ Is · (e^(V/(n·Vt)) − 1), con Vt ≈ 26 mV a temperatura ambiente: apenas conducen por debajo de su tensión de umbral y luego la corriente crece violentamente con pequeños aumentos de V. Por eso no tiene sentido aplicar R = V/I a un LED suelto: a 1,7 V puede dar microamperios y a 1,9 V ya varios miliamperios. En su lugar se usa la recta de carga del circuito y se busca el punto de trabajo donde se corta con la curva del diodo; alrededor de ese punto se define una resistencia dinámica r = dV/dI que sirve para pequeñas variaciones. El filamento de una bombilla incandescente es otro caso clásico: su curva se dobla porque la resistencia crece con la temperatura, de modo que en frío puede valer diez veces menos que en caliente y el arranque produce un pico de corriente. Un resistor sobrecalentado también deja de ser óhmico: su valor deriva y su curva se abre. En resumen, antes de escribir V = I·R conviene preguntarse si el componente es óhmico en las condiciones de trabajo; si no, esa ecuación solo describe un punto, no todo el comportamiento.`),

      p(`Para medir, el multímetro se conecta de dos maneras que no son intercambiables. El voltímetro va en paralelo entre los dos puntos cuya diferencia quieres conocer: tiene una impedancia de entrada muy alta, del orden de 10 MΩ, para no desviar corriente del circuito. Selecciona la escala de tensión continua (DCV) mayor que el valor esperado; si la escala es demasiado baja, el display muestra sobrecarga. Si inviertes las puntas, un multímetro digital simplemente muestra el signo negativo y no sufre daño; en un medidor analógico de aguja, en cambio, la aguja intentaría girar hacia atrás y podría golpear el tope. El amperímetro va en serie: hay que cortar el circuito e insertarlo, porque para medir corriente debe pasar por él toda la corriente de la rama. Su resistencia interna es muy baja para no añadir caída, y por eso jamás se pone en paralelo: eso equivale a un cortocircuito, circula una corriente enorme y se funde el fusible interno, que suele ser de 200 mA o de 10 A según el conector. Empieza siempre por la escala alta de 10 A y baja después si hace falta; el cable rojo en el conector de amperios y el negro en COM. Medir resistencia exige circuito apagado y, mejor aún, levantar un terminal del componente, porque de otro modo la red alrededor falsea la lectura y la tensión residual puede dañar el medidor. Un detalle que suele pasar desapercibido es la tensión de carga del amperímetro: aunque pequeña, en circuitos de baja tensión añade una caída que puede cambiar el punto de trabajo que intentas medir.`),

      diagrama(`multimetro_medidas`, `En paralelo se mide tensión; en serie se mide corriente. El amperímetro en paralelo hace un corto y funde el fusible.`),

      aviso(`Errores típicos que hay que vigilar. Dividir entre cero: si pones R = 0 en I = V/R obtienes una corriente infinita; en la realidad la resistencia del cable y la interna de la fuente limitan, pero el resultado es un cortocircuito con calor, chispas o fusible quemado, nunca un número manejable. Confundir mA con A: 20 mA son 0,020 A, no 20 A; si aplicas 20 A a un LED lo destruye al instante, así que convierte a unidades base antes de sustituir en la fórmula. Aplicar 5 V a un pin de 3,3 V: muchos microcontroladores de 3,3 V no toleran ese exceso y la entrada se daña; usa un divisor o un adaptador de nivel, y consulta el datasheet porque algunas entradas concretas sí son tolerantes a 5 V. Olvidar las unidades: escribir 330 sin ohmios o mezclar kΩ con Ω introduce un factor de mil en el resultado; escribe siempre V, A, Ω y W en cada paso y usa los prefijos con cuidado. Por último, restar mal la caída del LED: la tensión que cae en la resistencia es Vs − Vf, no Vs, y olvidar esa resta sobreestima la corriente.`),

      pasos([
        {
          title: `Ejercicio 1: LED blanco a 3,3 V`,
          text: `LED blanco con Vf = 3,0 V, If = 20 mA, fuente de 3,3 V. R = (3,3 − 3,0)/0,020 = 15 Ω. La potencia es I²·R = 0,0004 · 15 = 0,006 W. Observación importante: solo quedan 0,3 V para la resistencia, así que pequeñas variaciones de Vf cambian mucho la corriente; es mejor alimentar el LED desde 5 V o bajar la corriente a 10 mA.`
        },
        {
          title: `Ejercicio 2: corriente y potencia de una resistencia suelta`,
          text: `Resistencia de 4,7 kΩ conectada a 5 V. I = 5/4700 ≈ 1,06 mA. P = V·I = 5 · 0,00106 ≈ 5,3 mW. Con margen 2x hacen falta 10,6 mW: una resistencia de 1/8 W (125 mW) cumple de sobra, y la de 1/4 W es la elección habitual.`
        },
        {
          title: `Ejercicio 3: divisor cargado`,
          text: `R1 = 10 kΩ, R2 = 10 kΩ, Vin = 5 V y una carga de 1 kΩ en paralelo con R2. Sin carga Vout = 2,5 V. Con carga, R2 equivalente = 10k · 1k/(10k + 1k) ≈ 909 Ω, luego Vout = 5 · 909/(10000 + 909) ≈ 0,42 V. La carga hunde la salida: esto es exactamente la trampa del divisor que se verá en la lección r1-3.`
        },
        {
          title: `Ejercicio 4: pérdida en un cable`,
          text: `Fuente de 12 V, carga de 6 Ω y cable con 0,5 Ω en total. I = 12/(6 + 0,5) ≈ 1,85 A. Tensión en la carga = 1,85 · 6 ≈ 11,1 V. Potencia perdida en el cable = I²·R ≈ 3,41 · 0,5 ≈ 1,7 W, que se calienta; hay que usar cable más grueso o acortar la distancia.`
        }
      ]),

      tabla(['Magnitud o componente', 'Valor típico', 'Nota de diseño'], [
        ['Corriente máxima de un GPIO', '≤ 20 mA', 'Nunca alimentes un motor directamente'],
        ['Caída de un LED rojo / verde', '1,8 V / 2,1 V', 'R = (Vs − Vf)/If'],
        ['Caída de un LED azul / blanco', '3,0 V', 'Con 3,3 V queda poco margen'],
        ['Corriente de un LED estándar', '5–20 mA', '10 mA suele bastar y alarga la vida'],
        ['Resistor pull-up / pull-down', '4,7–10 kΩ', 'Más bajo = más rápido, más consumo'],
        ['Impedancia de entrada del multímetro', '≈ 10 MΩ', 'Por eso se conecta en paralelo'],
        ['Fusible típico del amperímetro', '200 mA / 10 A', 'Según el conector usado'],
        ['Tensión lógica de ESP32 / Arduino 3,3 V', '3,3 V', 'No aplicar 5 V sin adaptar nivel'],
        ['Resistencia de 1/4 W', '0,25 W nominal', 'Usar como máximo la mitad en diseño'],
        ['Resistividad del cobre', '1,68·10^-8 Ω·m', 'α ≈ 0,0039 /°C']
      ]),

      nota(`Cierre de la lección: antes de cerrar el cuaderno, repite en voz alta estas cuatro frases. El voltaje es una diferencia entre dos puntos, no energía gastada. La corriente es igual en todos los puntos de un lazo en serie. La resistencia depende de material, longitud, sección y temperatura. La potencia disipada debe ser como máximo la mitad de la potencia nominal del resistor. Si las cuatro te salen sin pensar, estás listo para Kirchhoff.`),

      lista([
        `Identifica siempre los dos puntos entre los que mides tensión y decide cuál es tu referencia de 0 V.`,
        `Convierte todos los prefijos a unidades base antes de sustituir: mA a A, kΩ a Ω, mV a V.`,
        `En un LED resta primero la caída Vf y solo después aplica R = V_R / If.`,
        `Comprueba la potencia con I²·R o V²/R y elige un resistor de al menos el doble de esa cifra.`,
        `Conecta el voltímetro en paralelo y el amperímetro en serie; nunca el amperímetro en paralelo.`,
        `Apaga el circuito antes de medir resistencia y levanta un terminal si la red puede influir.`,
        `Si la gráfica V-I no es una recta, no hables de resistencia constante: usa el punto de trabajo.`,
        `Escribe las unidades en cada línea de cálculo; un número sin unidad es una invitación al error.`
      ])
    ]
  }
};
