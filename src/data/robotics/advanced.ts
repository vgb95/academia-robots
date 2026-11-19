import { leccion as L, modulo as M, err, q, p, h, apunte, nota, aviso, codigo, diagrama, tabla, lista, pasos, formula } from '../helpers';
import type { Module } from '../../types';

export const advancedRoboticsModules: Module[] = [

  // ==================== B12: DEPURACIÓN ELÉCTRICA Y EMC ====================
  M('b12', 'Depuración eléctrica y compatibilidad electromagnética', 'Caída de tensión, desacople, instrumentación, ruido, masas y EMC en banco', [

    L({
      id: 'r12-1', title: 'Caída de tensión y brownout', min: 20, level: 'avanzado',
      objectives: [
        'Predecir y medir la caída de tensión en cables, conectores y soldaduras',
        'Diagnosticar y eliminar un reset por brownout en el arranque de un motor'
      ],
      blocks: [
        p('Un motor no pide corriente poco a poco: en el primer milisegundo exige su corriente de parada, a menudo 5–10 veces la nominal. Esa corriente atraviesa cable, conector y plano de masa, y cada ohmicio se convierte en una caída de tensión. Si VDD baja por debajo del umbral de reset del microcontrolador, el firmware "muere" sin dejar rastro en el log: no es un bug de código, es un bug de energía.'),
        diagrama('brownout', 'La cadena completa: pico de corriente, caída de V, reset y solución con bulk más desacople.'),
        formula('ΔV = I · R_parasito        R_cable = ρ · L / A        P_disipada = I² · R', 'R_parasito incluye cable, conector, soldadura y plano de masa. ρ del cobre ≈ 1.7e-8 Ω·m.'),
        p('Ejemplo real: cable AWG 24 (0.205 mm², ≈0.084 Ω/m). Un tramo de ida y vuelta de 2 m son 0.336 Ω. Si el motor pide 2 A al arrancar, la caída es 2 · 0.336 = 0.67 V. Alimentando la lógica desde ese mismo punto con 5 V, el MCU ve 4.33 V: bastante por debajo del umbral de muchos chips a 3.3 V tras el regulador.'),
        tabla(['Elemento', 'Resistencia típica', 'Caída a 2 A', 'Síntoma'], [
          ['Cable AWG 24, 2 m ida/vuelta', '0.34 Ω', '0.67 V', 'Reset intermitente'],
          ['Conector JST mal contacto', '0.10 Ω', '0.20 V', 'Fallos al vibrar'],
          ['Soldadura fría', '0.05–0.50 Ω', '0.10–1.00 V', 'Calentamiento local'],
          ['Plano de masa compartido', '0.02 Ω', '0.04 V', 'Ruido en ADC']
        ]),
        apunte('Umbral de brownout (BOR)', 'El detector de brownout compara VDD con un umbral interno, típicamente 2.7–2.9 V en MCU de 3.3 V. Muchos chips permiten subir ese umbral por fusible o registro: subirlo de 2.7 V a 2.9 V evita arrancar con tensión insegura, pero aumenta los resets. Es un parche, no una solución: arregla la caída, no el síntoma.'),
        codigo('cpp', `// Registrar VDD durante el arranque del motor (ESP32, ADC de 12 bits)
#include <Arduino.h>
const int PIN_PWM = 25;
const int PIN_SENSE = 34;   // divisor 2:1, 5 V -> 2.5 V

void setup() {
  Serial.begin(921600);
  ledcSetup(0, 20000, 8);   // 20 kHz, 8 bits: por encima del oido
  ledcAttachPin(PIN_PWM, 0);
}

void loop() {
  static uint32_t t0 = micros();
  float vbus = analogRead(PIN_SENSE) / 4095.0f * 3.3f * 2.0f;
  Serial.printf("%lu,%.3f\\n", micros() - t0, vbus);
  if (millis() > 2000) ledcWrite(0, 255);  // escalon al 100%
  delay(1);
}`, 'Captura de Vbus a 1 kHz; el archivo CSV resultante se analiza en la lección r12-3.'),
        aviso('Nunca alimentes el motor desde la misma pista que VDD del MCU sin un punto de derivación claro. Separa las ramas lo antes posible y une las masas en un único punto (lección r12-5).')
      ],
      errors: [
        err('El robot se reinicia justo al arrancar, sin mensaje de error', 'Brownout por caída de VDD durante el pico de corriente del motor', 'Añade capacitor bulk de 100 µF junto al driver y desacople de 100 nF junto al MCU.'),
        err('El reset aparece solo cuando el cable está medio desenchufado', 'Resistencia de contacto elevada en el conector', 'Sustituye el conector, estaña los contactos y mide la caída con 2 A reales.'),
        err('Subir el umbral de BOR no eliminó el reinicio', 'La caída supera también el nuevo umbral', 'Dimensiona la fuente y el cableado: el BOR solo cambia el punto de disparo.')
      ],
      practice: {
        task: 'Reproduce el fallo: un motor DC arranca y reinicia la MCU. Coloca 100 nF junto a los pines de alimentación del MCU y 100 µF en paralelo en la entrada del driver, con cables cortos. Captura VDD con el osciloscopio o el ADC a ≥10 kS/s durante el arranque. Ajusta hasta que la caída de VDD sea <100 mV y verifica 100 ciclos de arranque/parada consecutivos sin ningún reset. Guarda la captura y el contador de resets en el README.',
        success: ['La captura muestra la caída de VDD por debajo de 100 mV tras añadir 100 nF + 100 µF', '100 ciclos de arranque completos sin reset (contador a 0)', 'El informe incluye la forma de onda, la posición de los capacitores y el umbral de BOR configurado']
      },
      quiz: [
        q('Un cable de 0.34 Ω (ida y vuelta) alimenta un motor que pide 2 A al arrancar. ¿Cuál es la caída de tensión aproximada?', ['0.17 V', '0.34 V', '0.67 V', '1.34 V'], 2, 'ΔV = I·R = 2 A · 0.34 Ω = 0.68 V; el cable de ida y el de vuelta suman sus resistencias.'),
        q('¿Cuál es la acción correcta ante un reset por brownout?', ['Subir el umbral de BOR y dar el problema por resuelto', 'Reducir la resistencia de la ruta de alimentación y añadir desacople y bulk', 'Añadir un delay en el código de arranque', 'Bajar la frecuencia del PWM sin medir'], 1, 'El BOR solo cambia el síntoma; la causa es una impedancia de fuente demasiado alta frente al pico de corriente.')
      ]
    }),

    L({
      id: 'r12-2', title: 'Desacople y capacitor bulk', min: 18, level: 'avanzado',
      objectives: [
        'Calcular la capacidad necesaria para limitar un hundimiento de tensión',
        'Diferenciar el papel del capacitor de 100 nF del de 100 µF y colocarlo bien'
      ],
      blocks: [
        p('Un capacitor de desacople no "da más tensión": entrega corriente durante el breve intervalo en que la fuente no puede reaccionar. Es un depósito local. El de 100 nF responde a transitorios de decenas de nanosegundos; el de 100 µF sostiene el bus durante cientos de microsegundos. Los dos son complementarios, no sustituibles.'),
        formula('ΔV ≈ I · Δt / C + I · ESR        f_resonancia = 1 / (2π·√(L_ESL · C))', 'El primer término es la descarga del capacitor; el segundo, la resistencia serie equivalente. El ESL domina por encima de la resonancia.'),
        p('Presupuesto numérico: pico de 2 A durante 0.5 ms, fuente lenta. Con C = 100 µF y ESR = 20 mΩ: ΔV = 2 · 0.0005 / 0.0001 = 10 mV por descarga, más 2 · 0.02 = 40 mV por ESR, total 50 mV. Con un electrolítico genérico de ESR 0.2 Ω el mismo sistema daría 410 mV y resetearía la MCU.'),
        tabla(['Capacitor', 'Rango eficaz', 'Función', 'Colocación'], [
          ['100 nF MLCC 0402', '1–100 MHz', 'Desacople de alta frecuencia', '≤2 mm del pin VDD, ruta corta a GND'],
          ['1 µF MLCC 0603', '0.1–10 MHz', 'Depósito intermedio', 'Junto al regulador'],
          ['100 µF MLCC o electrolítico', '100 Hz–10 kHz', 'Bulk del motor', 'En la entrada del driver'],
          ['470 µF electrolítico', '10–500 Hz', 'Bulk de fuente', 'Junto al buck']
        ]),
        codigo('cpp', `// Calcular el hundimiento de tensión según C y ESR
#include <cstdio>
int main() {
  const float I = 2.0f;        // A, pico del motor
  const float dt = 0.5e-3f;    // s, retardo de la fuente
  const float C  = 100e-6f;    // F
  const float ESR = 0.02f;     // ohmios, capacitor bajo ESR
  float dV_cap = I * dt / C;
  float dV_esr = I * ESR;
  std::printf("dVcap=%.1f mV  dVesr=%.1f mV  total=%.1f mV\\n",
              dV_cap*1e3f, dV_esr*1e3f, (dV_cap+dV_esr)*1e3f);
}`, 'Imprime 10 mV, 40 mV y 50 mV: suficiente para cumplir el objetivo de <100 mV.'),
        diagrama('capacitor', 'Respuesta exponencial: τ = R·C; a los 5τ el capacitor está cargado al 99%.'),
        apunte('Por qué 100 nF y no 1 µF', 'Un MLCC de 1 µF suele tener resonancia más baja y peor respuesta en el rango de 10–100 MHz que uno de 100 nF del mismo tamaño. Por eso se usan varios valores en paralelo: cada uno cubre una banda. Ojo: valores demasiado distintos pueden crear un pico de impedancia por resonancia entre ESL y C.'),
        aviso('Los capacitores electrolíticos y de tantalio tienen polaridad. Un tantalio invertido puede incendiarse; respeta la tensión nominal con al menos 1.5× de margen.')
      ],
      errors: [
        err('El capacitor está soldado pero el reset persiste', 'Está a 5 cm del pin y la inductancia de la ruta domina', 'Coloca el MLCC a ≤2 mm del pin VDD y conecta su masa directamente al plano.'),
        err('La caída baja con 100 µF pero aparece ruido de alta frecuencia', 'Falta el desacople de 100 nF', 'Añade 100 nF junto a cada chip con ruta de retorno corta.'),
        err('El capacitor de bulk se calienta', 'ESR alto con corriente de rizado elevada', 'Usa un MLCC o varios electrolíticos en paralelo para repartir la corriente de rizado.')
      ],
      practice: {
        task: 'Calcula el hundimiento de VDD para un pico de 1.5 A durante 0.8 ms con C = 100 µF. Después monta tres configuraciones: solo 100 nF, solo 100 µF y 100 nF + 100 µF. Mide la caída con el osciloscopio en el pin VDD del MCU durante 20 arranques de motor y tabula mínimo, máximo y desviación.',
        success: ['El cálculo da 12 mV por descarga más el término de ESR', 'La configuración conjunta presenta la menor caída', 'El informe explica qué rango de frecuencia cubre cada capacitor']
      },
      quiz: [
        q('En un capacitor de desacople, ¿qué término domina la caída a frecuencias muy altas?', ['La capacidad', 'El ESR', 'El ESL (inductancia serie)', 'La tensión nominal'], 2, 'Por encima de la frecuencia de resonancia, la impedancia crece con f por el ESL: 2πfL.'),
        q('Con I = 2 A, Δt = 0.5 ms y C = 100 µF, ¿cuánto vale la caída por descarga?', ['5 mV', '10 mV', '50 mV', '100 mV'], 1, 'ΔV = I·Δt/C = 2 · 0.0005 / 0.0001 = 10 mV; el ESR se suma aparte.')
      ]
    }),

    L({
      id: 'r12-3', title: 'Osciloscopio y analizador lógico', min: 20, level: 'avanzado',
      objectives: [
        'Elegir ancho de banda, velocidad de muestreo y sonda correctos',
        'Disparar sobre el evento correcto y decodificar buses con un analizador lógico'
      ],
      blocks: [
        p('Un multímetro promedia; un osciloscopio muestra la historia. Para cazar un brownout necesitas ver los 100 µs previos al reset, y eso exige disparo, memoria de captura y una sonda que no cargue el circuito. El analizador lógico complementa al osciloscopio cuando importan los flancos y los buses digitales, no los niveles analógicos.'),
        tabla(['Instrumento', 'Lo que mide', 'Cifra clave', 'Uso aquí'], [
          ['Multímetro', 'Promedio DC', '3.5 dígitos, ~5 lecturas/s', 'Tensión de reposo'],
          ['Osciloscopio 100 MHz', 'Forma de onda', '1 GSa/s, memoria 1 Mpts', 'Hundimiento de VDD'],
          ['Analizador lógico', 'Flancos y buses', '100–500 MSa/s, 8–16 canales', 'Encoder A/B, I²C, PWM'],
          ['Sonda 10×', 'Alta impedancia', '10 MΩ // 10 pF', 'Menos carga que 1×']
        ]),
        formula('t_rise ≈ 0.35 / BW        f_Nyquist = f_muestreo / 2', 'Con 100 MHz de ancho de banda, el flanco mínimo visible es ≈3.5 ns. Para 20 MHz de señal útil, muestrea a ≥100 MSa/s.'),
        diagrama('multimetro', 'Comparativa de modos: el multímetro es lento; para transitorios haz falta el osciloscopio.'),
        p('Configuración que funciona: acoplamiento DC, sonda 10×, disparo por flanco de bajada en VDD con nivel 3.0 V, pre-trigger del 50% y memoria suficiente para 20 ms. Repite 100 adquisiciones en modo persistencia: el peor caso aparece como la línea más baja.'),
        codigo('python', `import csv
from statistics import mean

v = []
with open('vdd.csv', newline='') as f:
    for fila in csv.DictReader(f):
        v.append(float(fila['vbus']))

v_min, v_max = min(v), max(v)
print(f"n={len(v)}  media={mean(v):.3f} V  min={v_min:.3f} V  max={v_max:.3f} V")
print("CUMPLE <100 mV" if (v_max - v_min) < 0.100 else "FALLA: revisar desacople")`, 'Análisis del CSV capturado en r12-1; comprueba el criterio de 100 mV.'),
        apunte('Masa del osciloscopio', 'La punta de masa del osciloscopio está unida a tierra de red. Si la conectas a un nodo que no es tierra, puedes cortocircuitar el circuito por el cable de alimentación del instrumento. Para medidas flotantes usa una sonda diferencial.'),
        aviso('Con sonda 1× (1 MΩ // ~100 pF) cargas un nodo de alta impedancia y puedes deformar justo el flanco que intentas medir. Usa 10× y compensa la sonda antes de cada sesión.')
      ],
      errors: [
        err('El osciloscopio muestra una línea plana aunque el MCU se resetea', 'Disparo en canal equivocado o nivel por encima de la caída real', 'Dispara por flanco de bajada en VDD a 3.0 V y aumenta el pre-trigger.'),
        err('La forma de onda cambia al conectar la sonda', 'La sonda 1× carga el nodo o la masa crea un lazo', 'Usa sonda 10× compensada y masa lo más corta posible.'),
        err('El analizador lógico lee pulsos de encoder de más', 'El umbral de nivel está mal ajustado o hay rebotes', 'Ajusta el umbral a 1.65 V para señales de 3.3 V y filtra pulsos <20 ns.')
      ],
      practice: {
        task: 'Captura 100 arranques de motor con el osciloscopio en modo persistencia, disparo por bajada de VDD a 3.0 V y sonda 10×. Exporta un CSV con el mínimo de cada captura. Con el analizador lógico decodifica simultáneamente las fases A/B del encoder y comprueba que no aparecen cuentas falsas durante el pico de corriente.',
        success: ['La captura incluye pre-trigger y el mínimo de VDD es legible', 'El mínimo se mantiene por encima de 3.0 V en las 100 capturas', 'El decoder de encoder no registra transiciones espurias']
      },
      quiz: [
        q('Con un osciloscopio de 100 MHz, ¿cuál es el tiempo de subida mínimo aproximado que puedes resolver?', ['0.35 ns', '3.5 ns', '35 ns', '350 ns'], 1, 't_rise ≈ 0.35/BW = 0.35/100e6 = 3.5 ns.'),
        q('¿Por qué se prefiere una sonda 10× frente a una 1× para medir VDD?', ['Porque amplifica la señal', 'Porque presenta menor capacitancia y menor carga sobre el nodo', 'Porque aumenta el ancho de banda del osciloscopio', 'Porque no necesita compensación'], 1, 'La sonda 10× tiene ~10 MΩ // 10 pF frente a ~1 MΩ // 100 pF; carga menos el circuito, aunque atenúa 10 veces.')
      ]
    }),

    L({
      id: 'r12-4', title: 'Ruido en encoders y conteo fiable', min: 18, level: 'avanzado',
      objectives: [
        'Identificar cómo el ruido eléctrico genera cuentas falsas en señales de cuadratura',
        'Implementar filtrado hardware y software sin perder pulsos reales'
      ],
      blocks: [
        p('Un encoder de cuadratura produce dos señales A y B desfasadas 90°. Si un pico de corriente del motor acopla ruido en el cable del sensor, un flanco espurio se interpreta como un paso y la odometría se desvía. El síntoma clásico: el robot "avanza" aunque esté parado, justo cuando el motor arranca.'),
        diagrama('encoder', 'Fases A/B en cuadratura: el orden de los flancos determina el sentido de giro.'),
        formula('distancia = cuentas · π · D / (PPR · 4)        f_pulso = PPR · 4 · rpm / 60', 'El factor 4 viene de contar los cuatro flancos por ciclo de cuadratura (x4 encoding).'),
        p('Ejemplo: encoder de 1000 PPR con rueda de 65 mm de diámetro. Cada cuenta vale π · 0.065 / 4000 = 51.1 µm. Un solo glitch equivale a 0.05 mm; diez glitches por segundo suman 0.5 mm/s de deriva. A 3000 rpm la frecuencia de fase es 1000 · 4 · 3000/60 = 200 kHz, así que cualquier filtro software debe responder en menos de 5 µs.'),
        tabla(['Técnica', 'Coste', 'Cuándo usarla'], [
          ['Schmitt trigger en la entrada', 'Un chip, ~0.50 €', 'Flancos lentos o ruidosos'],
          ['Cable trenzado + malla a un extremo', 'Cable', 'Siempre en cables >30 cm'],
          ['RS-422 diferencial', 'Transceiver', 'Entornos industriales o >1 m'],
          ['Filtro por tiempo mínimo entre flancos', 'Unas líneas de código', 'Glitches cortos (<20 µs)'],
          ['Contador de hardware (PCNT)', 'Periférico', 'Altas velocidades sin cargar la CPU']
        ]),
        codigo('cpp', `// ISR del encoder con rechazo de glitches cortos (ESP32)
#include <Arduino.h>
const byte PIN_A = 16, PIN_B = 17;
volatile int32_t cuentas = 0;
volatile uint32_t ultimoFlanco = 0;

void IRAM_ATTR onA() {
  uint32_t t = micros();
  if (t - ultimoFlanco < 20) return;   // rechaza rebote <20 us
  ultimoFlanco = t;
  cuentas += (digitalRead(PIN_B) == HIGH) ? 1 : -1;
}

void setup() {
  attachInterrupt(digitalPinToInterrupt(PIN_A), onA, CHANGE);
}
void loop() { /* leer 'cuentas' con interrupciones desactivadas */ }`, 'Para 200 kHz conviene sustituir la ISR por el periférico PCNT del ESP32.'),
        apunte('Malla del cable', 'La pantalla del cable de encoder se conecta a tierra en un solo extremo, normalmente el del receptor. Conectarla en ambos extremos crea un bucle de tierra (lección r12-5) que introduce exactamente el ruido que querías evitar.'),
        aviso('No filtres con un promedio de varias lecturas: un encoder es digital y una media puede inventar estados intermedios. Filtra por tiempo mínimo entre flancos o por histéresis, nunca promediando.'),
        nota('Regla de oro:si el conteo falla solo cuando el motor conmuta, el problema está en el cableado o en la masa, casi nunca en el sensor.')
      ],
      errors: [
        err('El encoder cuenta cuando el motor está parado', 'Ruido acoplado del cable de motor al cable de señal', 'Separa los cables, usa trenzado con malla y aplica un filtro de 20 µs.'),
        err('A alta velocidad se pierden cuentas', 'La ISR no puede seguir el ritmo de 200 kHz', 'Usa el contador de hardware PCNT o un encoder con salida diferencial.'),
        err('La dirección del giro sale invertida', 'Canales A y B cruzados en el cableado', 'Intercambia A y B o cambia el signo en la ISR.')
      ],
      practice: {
        task: 'Mueve el eje manualmente 10 vueltas y compara las cuentas del encoder con un calibrador. Después arranca el motor 50 veces con el encoder cableado junto al cable de motor: mide la deriva. Repite con trenzado y malla en un solo extremo y con el filtro de 20 µs. Cuantifica la mejora en cuentas y en milímetros.',
        success: ['Sin filtro aparece deriva; con trenzado y filtro la deriva es 0 cuentas', 'El error de 10 vueltas es <0.5 mm', 'La cuenta a 3000 rpm no se pierde con PCNT']
      },
      quiz: [
        q('Un encoder de 1000 PPR con rueda de 65 mm, ¿cuánto vale una cuenta en modo x4?', ['≈51 µm', '≈204 µm', '≈0.65 mm', '≈6.5 mm'], 0, 'π·D/(PPR·4) = π·0.065/4000 = 5.11e-5 m ≈ 51 µm.'),
        q('¿Qué filtrado es correcto para glitches en una señal de encoder?', ['Promediar varias muestras del nivel', 'Rechazar flancos separados por menos de un tiempo mínimo', 'Aplicar un filtro pasa bajo de 10 Hz', 'Usar un divisor de voltaje'], 1, 'El promedio inventa estados intermedios en una señal digital; el filtro por tiempo mínimo respeta los flancos reales.')
      ]
    }),

    L({
      id: 'r12-5', title: 'Masas, bucles de tierra e inmunidad', min: 18, level: 'avanzado',
      objectives: [
        'Explicar la acoplamiento por impedancia común y el bucle de tierra',
        'Diseñar un esquema de masa que no mezcle corrientes de motor y de sensor'
      ],
      blocks: [
        p('La masa no es un sumidero infinito: es un conductor con resistencia e inductancia. Cuando la corriente de retorno del motor atraviesa el mismo tramo de masa que la referencia del sensor, aparece una tensión que se suma a la lectura. Eso es acoplamiento por impedancia común y explica las lecturas de ADC que "bailan" solo cuando el motor gira.'),
        formula('V_error = I_ruido · R_compartido + L · dI/dt        R = ρ · L / A', 'Con 2 A y 0.02 Ω compartidos, el error es 40 mV: en un ADC de 12 bits y 3.3 V son 50 cuentas.'),
        p('El bucle de tierra aparece cuando dos puntos de un sistema están unidos a masa por dos caminos distintos, por ejemplo el cable de señal y la tierra de red del osciloscopio. La diferencia de potencial entre ambos puntos hace circular una corriente parásita que se suma a la señal.'),
        diagrama('esquematico', 'Del símbolo al montaje: decide dónde está el único punto de unión de las masas.'),
        tabla(['Estrategia', 'Qué resuelve', 'Riesgo'], [
          ['Masa en estrella en el punto de entrada', 'Impedancia común', 'Cables largos si se aplica mal'],
          ['Plano de masa continuo', 'Inductancia de retorno', 'Separar puede crear ranuras'],
          ['Rutas separadas para motor y lógica', 'Corrientes de alta dI/dt', 'Deben unirse en un solo punto'],
          ['Medida diferencial', 'Bucle de tierra en la instrumentación', 'Requiere sonda diferencial'],
          ['Aislamiento galvánico', 'Bucles entre equipos', 'Coste y capacitancia parásita']
        ]),
        codigo('python', `rho = 1.7e-8       # Ohm·m, cobre
L = 0.10           # m de pista compartida
A = 0.25e-6        # m^2, pista de 0.25 mm^2
R = rho * L / A
I = 2.0            # A, retorno del motor
print(f"R compartida = {R*1e3:.1f} mOhm")
print(f"Error = {I*R*1e3:.1f} mV")
print(f"Cuentas ADC (12 bits, 3.3 V) = {I*R/3.3*4095:.0f}")`, 'Imprime 6.8 mΩ, 13.6 mV y unas 17 cuentas de error.'),
        apunte('Retorno de la corriente', 'La corriente de retorno siempre busca el camino de menor inductancia, que suele estar justo debajo de la pista de ida. Si cortas el plano debajo de una señal rápida, la corriente rodea la ranura y la zona se convierte en una antena.'),
        aviso('Nunca conectes la masa del osciloscopio a un punto que no sea tierra: el cable de red del instrumento puede cerrar un bucle y destruir la placa. Usa sonda diferencial o alimentación aislada.')
      ],
      errors: [
        err('El ADC muestra ruido que crece con el PWM', 'Retorno del motor compartido con la referencia del ADC', 'Separa las rutas de retorno y únelas en estrella junto a la entrada de alimentación.'),
        err('Al conectar el osciloscopio cambia la lectura', 'La punta de masa cierra un bucle de tierra', 'Usa sonda diferencial o aísla el equipo bajo prueba.'),
        err('La lectura cambia al tacto', 'Masa flotante por soldadura fría', 'Revisa continuidad y vuelve a soldar con flux.')
      ],
      practice: {
        task: 'Mide con el osciloscopio la tensión entre el punto de masa del sensor y el de la batería mientras el motor acelera de 0 a 2 A. Repite después de cablear el retorno del sensor directamente a la batería (estrella). Tabula el pico de ruido antes y después y repite la medida del ADC con 64 muestras promediadas.',
        success: ['El pico de ruido en masa baja al menos 5 veces', 'La desviación del ADC con motor en marcha es <5 cuentas', 'El esquema final muestra un único punto de unión de masas']
      },
      quiz: [
        q('¿Qué es una acoplamiento por impedancia común?', ['Dos masas unidas por un capacitor', 'Corrientes de varios circuitos que comparten el mismo conductor de retorno', 'Un cable de señal con demasiada longitud', 'Una fuente con ruido de conmutación'], 1, 'La tensión desarrollada por una corriente sobre la resistencia compartida se suma a la señal de los demás circuitos.'),
        q('Con 2 A de retorno de motor sobre 0.02 Ω compartidos, ¿cuál es el error sobre una referencia analógica?', ['2 mV', '20 mV', '40 mV', '400 mV'], 2, 'V = I·R = 2 · 0.02 = 0.04 V = 40 mV.')
      ]
    }),

    L({
      id: 'r12-6', title: 'Preventivas: snubbers, TVS y filtros', min: 18, level: 'avanzado',
      objectives: [
        'Dimensionar un snubber RC y elegir un supresor TVS',
        'Aplicar medidas preventivas antes de que aparezca el fallo electromagnético'
      ],
      blocks: [
        p('Cada vez que conmutas una carga inductiva aparece un pico de tensión. El diodo flyback es la solución clásica en DC, pero	ralentiza la descarga del campo y no sirve en señales rápidas. Para esos casos están el snubber RC, el TVS y la ferrita: no evitan el transitorio, pero controlan dónde se disipa su energía.'),
        diagrama('diodo', 'Diodo en directa e inversa: el flyback aprovecha la inversa para dar salida a la corriente inductiva.'),
        formula('R_snub ≈ √(L / C_parásita)        C_snub ≈ 3–4 · C_parásita        P_R ≈ C_snub · V² · f', 'L es la inductancia del cable o bobinado; C_parásita la capacitancia del nodo de conmutación.'),
        p('Ejemplo: nodo de un MOSFET con L parasitaria de 100 nH y C_parásita de 100 pF. R = √(100e-9/100e-12) = 31.6 Ω, así que usamos 33 Ω. C_snub ≈ 400 pF, elegimos 470 pF. Con 24 V y 20 kHz, la potencia en la resistencia es ≈470e-12 · 576 · 20000 = 5.4 mW: una resistencia de 1/4 W sobra.'),
        lista([
          'Diodo flyback: motor y relay DC; simple, pero retarda la liberación del campo.',
          'TVS: absorbe picos de energía en la entrada de alimentación y en líneas expuestas.',
          'Snubber RC: controla el ringing en el nodo de conmutación de un MOSFET.',
          'Ferrita: añade impedancia a frecuencias altas sin afectar la DC.',
          'Resistencia de gate: baja dV/dt y reduce emisiones, a coste de conmutación más lenta.'
        ]),
        codigo('cpp', `// Calcular snubber RC y disipación
#include <cmath>
#include <cstdio>
int main() {
  float L = 100e-9f, Cp = 100e-12f;   // H, F
  float R = std::sqrt(L / Cp);        // 31.6 ohm
  float C = 4.0f * Cp;                // 400 pF
  float V = 24.0f, f = 20000.0f;
  float P = C * V * V * f;            // 4.6 mW
  std::printf("R=%.1f ohm  C=%.0f pF  P=%.1f mW\\n", R, C*1e12f, P*1e3f);
}`, 'Valores de partida; ajusta con el osciloscopio observando el overshoot.'),
        apunte('Elegir un TVS', 'La tensión de trabajo inversa (V_RWM) debe ser igual o mayor que la tensión normal del bus, y la tensión de sujeción (V_C) menor que el máximo que aguanta el chip. Para un bus de 5 V: V_RWM = 5 V, V_C ≈ 9 V y un chip con tolerancia de 12 V está a salvo.'),
        nota('Una ferrita no es una resistencia: a DC apenas tiene impedancia, pero a 100 MHz puede presentar cientos de ohmios. Por eso filtra ruido sin robar tensión.'),
        aviso('Un diodo flyback en paralelo con una bobina se monta en sentido inverso: ánodo a masa y cátodo al lado positivo. Al revés crea un cortocircuito directo.')
      ],
      errors: [
        err('El MOSFET conmuta con ringing de 40 V sobre 24 V', 'Falta snubber o el layout tiene demasiada inductancia', 'Añade snubber RC de 33 Ω + 470 pF lo más cerca posible del MOSFET.'),
        err('El TVS se calienta en reposo', 'V_RWM menor que la tensión del bus', 'Elige un TVS con V_RWM ≥ tensión normal y verifica la corriente de fuga.'),
        err('El diodo flyback se quemó', 'Colocado en sentido directo', 'Invierte el diodo: debe bloquear en funcionamiento normal.')
      ],
      practice: {
        task: 'Mide con osciloscopio el pico de drenaje de un MOSFET que conmuta un motor de 24 V. Añade un snubber RC calculado y reajusta R hasta que el pico baje de 30 V sin que la conmutación se vuelva excesivamente lenta. Añade después un TVS en la entrada y verifica con un generador de pulsos que la sujeción funciona.',
        success: ['El pico baja de 40 V a menos de 30 V', 'La potencia disipada en la resistencia del snubber es <10 mW', 'El TVS no conduce en funcionamiento normal (V_RWM correcta)']
      },
      quiz: [
        q('Para L = 100 nH y C_parásita = 100 pF, ¿qué resistencia de snubber RC es adecuada?', ['3.3 Ω', '33 Ω', '330 Ω', '3.3 kΩ'], 1, 'R ≈ √(L/C) = √(100e-9/100e-12) ≈ 31.6 Ω; el valor comercial es 33 Ω.'),
        q('¿Qué parámetro de un TVS debe ser mayor o igual que la tensión normal del bus?', ['V_C (sujeción)', 'V_RWM (trabajo inverso)', 'La corriente de fuga', 'La capacitancia'], 1, 'V_RWM garantiza que el TVS no conduzca en condiciones normales; V_C debe quedar por debajo del máximo del chip.')
      ]
    }),

    L({
      id: 'r12-7', title: 'EMC práctico: emisiones e inmunidad', min: 20, level: 'avanzado',
      objectives: [
        'Entender por qué un cable actúa como antena y cómo reducir emisiones',
        'Aplicar un plan de mitigación antes de un ensayo de compatibilidad electromagnética'
      ],
      blocks: [
        h('El cable es la antena'),
        p('Una placa de 4 cm apenas irradia eficientemente por debajo de 1 GHz, pero un cable de 25 cm sí: a 300 MHz su longitud es una cuarta parte de la longitud de onda y radía con mucha eficacia. Casi todos los problemas de EMC en robótica nacen de un cable de motor o de sensor sin filtrar, no del chip.'),
        formula('λ = c / f        L_antena ≈ λ / 4        c ≈ 3e8 m/s', 'A 300 MHz, λ = 1 m y la antena de cuarto de onda mide 0.25 m = 25 cm.'),
        tabla(['Banda', 'Longitud de onda', 'Fuente típica en un robot', 'Mitigación'], [
          ['<1 MHz', '>300 m', 'Buck, corriente de retorno', 'Bulk, plano de masa'],
          ['1–30 MHz', '300–10 m', 'Conmutación del MOSFET', 'Snubber, ferrita, gate resistor'],
          ['30–300 MHz', '10–1 m', 'Flancos digitales, cables', 'Serie 22–100 Ω, malla'],
          ['300 MHz–1 GHz', '1–0.3 m', 'Puertos, osciladores', 'Blindaje, common-mode choke']
        ]),
        diagrama('h_bridge', 'El puente H conmuta dos nodos: cada flanco es una fuente de emisiones radiadas y conductoras.'),
        p('Dos frentes distintos: emisiones (lo que tu robot irradia) e inmunidad (lo que aguanta). Un robot puede cumplir emisiones y todavía resets por una descarga electrostática. Por eso el plan incluye tanto la reducción de emisiones como la protección de entradas.'),
        lista([
          'Resistencia en serie de 22–100 Ω en salidas digitales rápidas: reduce dV/dt.',
          'Common-mode choke en cables largos: ataca la corriente de modo común.',
          'Malla conectada a 360° al conector metálico, no con una cola de cable.',
          'Cable de motor trenzado y lo más corto posible.',
          'TVS y RC en entradas expuestas al exterior.'
        ], true),
        codigo('python', `import math

c = 3e8
for f in [1e6, 30e6, 300e6, 1e9]:
    lam = c / f
    print(f"f={f/1e6:7.0f} MHz  lambda={lam:8.2f} m  antena lambda/4={lam/4*100:7.1f} cm")`, 'Calcula la longitud crítica de cable para cada frecuencia.'),
        apunte('Modo común vs modo diferencial', 'El modo diferencial viaja por ida y vuelta y su campo se cancela parcialmente. El modo común circula por todos los conductores en el mismo sentido y vuelve por masa: su campo no se cancela y es el que suele fallar en los ensayos. Un common-mode choke añade impedancia solo a ese modo.'),
        aviso('Los límites legales dependen de la región y del entorno (EN 55032, CISPR 25, FCC Parte 15). No des actuar por cumplir una cifra memorizada: mide con el equipo y el margen reales.')
      ],
      errors: [
        err('El robot falla un ensayo de emisiones radiated', 'Cable de motor sin trenzar ni filtrar', 'Añade common-mode choke y trenzado, y baja dV/dt con resistencia de gate.'),
        err('El robot se resetea al acercar un motor de otro equipo', 'Inmunidad insuficiente en líneas de entrada', 'Añade TVS y filtro RC en las líneas expuestas y revisa el plano de masa.'),
        err('La ferrita no hace nada', 'Está en el camino de retorno incorrecto o mal colocada', 'Colócala en modo común alrededor de todos los conductores del cable.')
      ],
      practice: {
        task: 'Identifica los tres cables más largos de tu robot y calcula su longitud eléctrica a 30, 100 y 300 MHz. Añade una resistencia de 33 Ω en serie en las salidas PWM y un common-mode choke en el cable del motor. Mide con sonda de campo cercano o receptor antes y después, y registra la reducción en dB.',
        success: ['Calculas la frecuencia donde cada cable es λ/4', 'La medición shows una reducción medible de emisiones', 'El informe distingue emisiones de inmunidad']
      },
      quiz: [
        q('A 300 MHz, ¿cuánto mide aproximadamente una antena de cuarto de onda?', ['2.5 cm', '25 cm', '1 m', '10 m'], 1, 'λ = 3e8/3e8 = 1 m; λ/4 = 0.25 m = 25 cm.'),
        q('¿Qué componente ataca específicamente las corrientes de modo común en un cable?', ['Un capacitor de desacople', 'Un common-mode choke', 'Un diodo flyback', 'Un regulador LDO'], 1, 'El common-mode choke presenta alta impedancia a la corriente que circula en el mismo sentido por todos los conductores.')
      ]
    }),

    L({
      id: 'r12-8', title: 'Checklist de banco y registro de fallos', min: 16, level: 'avanzado',
      objectives: [
        'Seguir una secuencia de puesta en marcha que no destruya hardware',
        'Documentar un fallo de forma reproducible para que otro pueda verificarlo'
      ],
      blocks: [
        p('La diferencia entre un hobby y un trabajo profesional no es el número de éxitos, sino la calidad del registro cuando algo falla. Un banco bien ordenado (fuente limitada, sondas, cuaderno y capturas) convierte un misterio en una medición.'),
        pasos([
          { title: 'Inspección visual', text: 'Revisa soldaduras, polaridad de electrolíticos y pines cortados con lupa antes de dar tensión.' },
          { title: 'Continuidad en frío', text: 'Con el circuito apagado, comprueba que VDD y GND no están cortocircuitados y que las masas están unidas.' },
          { title: 'Fuente limitada', text: 'Arranca con corriente limitada a 100 mA y tensión nominal. Si la fuente entra en limitación, para y revisa.' },
          { title: 'Primer encendido', text: 'Mide VDD en el pin del chip, no en la fuente. Compara con el datasheet.' },
          { title: 'Señales en orden', text: 'GPIO, reloj, PWM y comunicación, una a una. Nunca conectes todo a la vez.' },
          { title: 'Carga real', text: 'Motor y sensores con el cableado definitivo; repite las medidas de caída y ruido.' }
        ]),
        tabla(['Dato a registrar', 'Por qué', 'Ejemplo'], [
          ['Fecha y revisión de placa', 'Permite comparar versiones', 'revC, 2026-11-18'],
          ['Tensión en reposo y en pico', 'Detecta brownout', '3.31 V / 3.18 V'],
          ['Corriente pico', 'Dimensiona fuente', '2.4 A durante 0.6 ms'],
          ['Temperatura', 'Delata soldadura o sobrecarga', '48 °C en el driver'],
          ['Pass/Fail y criterio', 'Hace reproducible la verificación', 'VDD mín > 3.20 V'],
          ['Captura asociada', 'Evita discusiones subjetivas', 'captura_07.png']
        ]),
        codigo('python', `from dataclasses import dataclass, asdict
import json

@dataclass
class Prueba:
    id: str
    criterio: str
    medido: float
    umbral: float
    resultado: str

p = Prueba('B12-01', 'VDD minimo en arranque > 3.20 V', 3.24, 3.20, 'PASS')
with open('informe.json', 'w', encoding='utf-8') as f:
    json.dump(asdict(p), f, indent=2, ensure_ascii=False)`, 'Un registro mínimo pero verificable; scale a una lista de pruebas.'),
        apunte('Regla del README', 'Todo informe lleva: vídeo, esquema de cableado, números medidos de verdad y una sección "qué se rompió y cómo lo arreglé". Esa última sección es la que no se puede falsificar.'),
        nota('Un fallo documentado con fecha, revisión, captura y criterio de pass/fail vale más en una entrevista que diez proyectos que funcionan sin explicación.'),
        aviso('No conectes ni desconectes sensores con la placa encendida. Una descarga puede quemar un pin y el fallo aparecerá semanas después como "algo raro".')
      ],
      errors: [
        err('La fuente entra en limitación de corriente al encender', 'Cortocircuito o polaridad invertida', 'Apaga inmediatamente y revisa continuidad y polaridad con el multímetro.'),
        err('El fallo no se reproduce al día siguiente', 'No se registró la revisión ni las condiciones exactas', 'Guarda fecha, revisión, captura y criterio numérico de cada ensayo.'),
        err('El informe dice "funciona bien"', 'No hay métrica verificable', 'Sustituye adjetivos por números y umbrales: VDD mín, corriente pico, cuentas de error.')
      ],
      practice: {
        task: 'Aplica el checklist completo a tu robot y genera un informe con al menos 6 pruebas, cada una con criterio numérico, valor medido, umbral y captura asociada. Incluye los resultados de la práctica estrella de r12-1: caída <100 mV y 100 ciclos sin reset.',
        success: ['Las 6 pruebas tienen criterio y medición real, no adjetivos', 'El informe incluye la captura de VDD y el contador de resets a 0', 'La sección "qué se rompió y cómo lo arreglé" explica al menos un fallo']
      },
      quiz: [
        q('¿Cuál es la forma correcta de iniciar la puesta en marcha de una placa nueva?', ['Aplicar tensión nominal sin límite de corriente', 'Conectar todos los periféricos y luego encender', 'Fuente con corriente limitada y comprobación de continuidad previa', 'Soldar los conectores con la placa alimentada'], 2, 'La limitación de corriente y la comprobación en frío evitan destruir la placa ante un cortocircuito.'),
        q('¿Qué hace verificable un informe de fallos?', ['Decir que funciona bien', 'Incluir fecha, revisión, captura y criterio numérico', 'Usar muchas fotografías', 'Evitar mencionar el fallo'], 1, 'Sin condición reproducible y umbral numérico, otro no puede confirmar ni refutar el resultado.')
      ]
    })
  ]),

  // ==================== B13: CONTROL EN TIEMPO REAL Y ESTIMACIÓN ====================
  M('b13', 'Control en tiempo real y estimación', 'FreeRTOS, deadlines, PID con feedforward, Kalman, EKF, sintonización y telemetría', [

    L({
      id: 'r13-1', title: 'FreeRTOS: tareas, prioridades y colas', min: 20, level: 'avanzado',
      objectives: [
        'Dividir un firmware en tareas con prioridades y periodos explícitos',
        'Comunicar tareas e ISR mediante colas sin variables globales compartidas'
      ],
      blocks: [
        p('En un robot, controlar un motor a 1 kHz y enviar telemetría por WiFi no pueden compartir el mismo hilo: la red bloquea y el control no puede esperar. Un RTOS separa ambos en tareas con prioridades distintas y garantiza que la crítica se ejecute primero.'),
        diagrama('rtos', 'Tareas con prioridad: control a 1 kHz, sensores a 100 Hz, red a 10 Hz.'),
        tabla(['Tarea', 'Periodo', 'Prioridad', 'Restricción'], [
          ['Control', '1 ms (1 kHz)', 'Alta (3)', 'Sin bloqueos, sin Serial'],
          ['Lectura de sensores', '10 ms (100 Hz)', 'Media (2)', 'I²C con timeout corto'],
          ['Estimación', '5 ms (200 Hz)', 'Alta (3)', 'Cálculo acotado'],
          ['Telemetría', '1000 ms (1 Hz)', 'Baja (1)', 'Puede esperar'],
          ['ISR de encoder', 'Evento', 'Por encima de tareas', 'Microsegundos, solo flag']
        ]),
        codigo('cpp', `#include <Arduino.h>
QueueHandle_t qCiclos;

void TaskControl(void *arg) {
  TickType_t last = xTaskGetTickCount();
  const TickType_t periodo = pdMS_TO_TICKS(1);
  for (;;) {
    uint32_t n = xTaskGetTickCount();
    xQueueSend(qCiclos, &n, 0);          // nunca bloquear
    // leer encoder, ejecutar PID, escribir PWM ...
    vTaskDelayUntil(&last, periodo);      // periodo fijo, sin deriva
  }
}

void TaskTelemetria(void *arg) {
  uint32_t n;
  for (;;) {
    if (xQueueReceive(qCiclos, &n, pdMS_TO_TICKS(1000)) == pdTRUE)
      Serial.printf("ciclo %lu\\n", (unsigned long)n);
  }
}

void setup() {
  qCiclos = xQueueCreate(16, sizeof(uint32_t));
  xTaskCreatePinnedToCore(TaskControl, "control", 2048, nullptr, 3, nullptr, 1);
  xTaskCreatePinnedToCore(TaskTelemetria, "telemetria", 4096, nullptr, 1, nullptr, 0);
}
void loop() {}`, 'Patrón completo: vTaskDelayUntil para el periodo, Queue para el dato compartido.'),
        formula('Uso de CPU = Σ (WCET_i / T_i)        Tiempo muerto = tiempo hasta que la tarea crítica_listo', 'Con WCET de 300 µs y T = 1 ms, la tarea de control usa el 30% de un núcleo; el resto puede ir a telemetría.'),
        apunte('vTaskDelayUntil vs vTaskDelay', 'vTaskDelay espera una duración desde que termina la tarea, así que el periodo se acumula con el tiempo de ejecución y aparece jitter. vTaskDelayUntil espera hasta un instante absoluto: mantiene el ritmo aunque la tarea tarde un poco más.'),
        aviso('Dentro de una ISR no uses Serial, delay ni memoria dinámica. Solo una escritura volatile o xQueueSendFromISR con el parámetro de mayor prioridad.'),
        nota('En ESP-IDF el tick suele ser 100 Hz por defecto; para control a 1 kHz hay que subir CONFIG_FREERTOS_HZ a 1000.')
      ],
      errors: [
        err('Dos tareas incrementan el mismo contador y el valor sale mal', 'Acceso concurrente sin sincronización', 'Usa una Queue, un mutex o una sección crítica.'),
        err('El periodo de control se alarga con el tiempo', 'Uso de vTaskDelay en vez de vTaskDelayUntil', 'Cambia a vTaskDelayUntil con TickType_t absoluto.'),
        err('La tarea de red retrasa el PID', 'Prioridad de red demasiado alta o sección crítica larga', 'Baja la prioridad de red y nunca bloquees la tarea de control.')
      ],
      practice: {
        task: 'Crea dos tareas: control a 1 kHz que alterne un GPIO y lea un encoder, y telemetría a 1 Hz que envíe el número de ciclos. Pasa el contador por una Queue. Mide con analizador lógico que el periodo del GPIO se mantiene en 1 ms y que la telemetría no produce retrasos superiores a 100 µs.',
        success: ['El contador viaja por Queue, no por una global sin protección', 'El periodo del GPIO es 1.000 ms con jitter <100 µs', 'La telemetría corre en el otro núcleo con prioridad baja']
      },
      quiz: [
        q('¿Qué diferencia principal hay entre vTaskDelay y vTaskDelayUntil?', ['Ambos son identicos', 'vTaskDelayUntil fija instantes absolutos y evita acumular deriva de periodo', 'vTaskDelay solo funciona en ISR', 'vTaskDelayUntil desactiva el scheduler'], 1, 'vTaskDelay cuenta desde el final de la tarea; vTaskDelayUntil cuenta desde un instante de referencia y mantiene el ritmo.'),
        q('¿Qué mecanismo procede para pasar datos de una ISR a una tarea?', ['Una variable global volatile sin más', 'xQueueSendFromISR', 'Un printf en la ISR', 'Un delay en la ISR'], 1, 'La variante FromISR es segura para contexto de interrupción y evita bloquear.')
      ]
    }),

    L({
      id: 'r13-2', title: 'Deadlines, jitter y planificación', min: 18, level: 'avanzado',
      objectives: [
        'Definir periodo, deadline, WCET y jitter con números',
        'Predecir si un conjunto de tareas cabe en el presupuesto de tiempo'
      ],
      blocks: [
        p('Un sistema de tiempo real no es rápido: es predecible. Lo importante no es cuánto tarda de media una iteración, sino cuál es el peor caso y si ese peor caso llega antes del deadline. Para un lazo de 1 kHz, el deadline suele ser el propio periodo: 1 ms.'),
        formula('jitter_i = |t_i − i·T|        U = Σ WCET_i / T_i        U_RM ≤ n · (2^(1/n) − 1)', 'Para dos tareas, el límite de Rate Monotonic es 2·(2^(1/2)−1) ≈ 0.828. Para tres, ≈0.780.'),
        p('Ejemplo: control (WCET 300 µs, T = 1 ms), estimación (WCET 1.2 ms, T = 5 ms) y telemetría (WCET 4 ms, T = 1 s). U = 0.30 + 0.24 + 0.004 = 0.544. Con tres tareas el límite RM es 0.780, así que el conjunto es programable con margen.'),
        tabla(['Concepto', 'Definición', 'Ejemplo'], [
          ['Periodo T', 'Cada cuánto se ejecuta', '1 ms'],
          ['Deadline D', 'Instante límite de entrega', '1 ms (D = T)'],
          ['WCET', 'Peor tiempo de ejecución', '300 µs medido con GPIO'],
          ['Jitter', 'Desviación respecto al instante ideal', '50 µs pico'],
          ['Latencia', 'Tiempo desde evento hasta respuesta', '120 µs']
        ]),
        codigo('python', `tareas = [("control", 300e-6, 1e-3),
          ("estimacion", 1.2e-3, 5e-3),
          ("telemetria", 4e-3, 1.0)]
U = sum(w/T for _, w, T in tareas)
n = len(tareas)
limite = n * (2 ** (1/n) - 1)
print(f"U={U:.3f}  limite_RM={limite:.3f}  factible={U <= limite}")`, 'Imprime U=0.544, límite=0.780 y factible=True.'),
        apunte('Jitter medido, no supuesto', 'El jitter se mide con un toggle de GPIO y un analizador lógico: mide los periodos entre flancos y calcula max|medido − teórico|. Un promedio bonito esconde el peor caso; guarda el máximo.'),
        aviso('Una tarea con prioridad alta que se bloquea en una cola puede bloquear a todas las demás (priority inversion). Usa mutex con herencia de prioridad o colas con timeout corto.'),
        nota('En robots móviles, un deadline incumplido en el control de velocidad se nota como un tirón; en un brazo puede significar una colisión. El análisis de planificación no es burocracia: es seguridad.')
      ],
      errors: [
        err('El lazo funciona bien de media pero a veces da un tirón', 'Jitter pico alto por otra tarea o por serial en la crítica', 'Mide con GPIO y elimina bloqueos de la tarea de control.'),
        err('La suma de usos de CPU parece pequeña pero fallan deadlines', 'Se olvidó el coste de context switch y las interrupciones', 'Añade 5–10% de margen y mide el peor caso real.'),
        err('La tarea de mayor prioridad espera a la de menor', 'Inversión de prioridad por un mutex', 'Usa mutex con herencia de prioridad.')
      ],
      practice: {
        task: 'Mide con analizador lógico 1000 periodos de una tarea de control a 1 kHz. Calcula el periodo medio, el jitter máximo y el percentil 99. Compara con el objetivo de jitter <100 µs y decide si el conjunto de tareas cumple el test de planificación.',
        success: ['Calculas jitter como desviación máxima respecto al periodo ideal', 'El jitter máximo es <100 µs', 'El informe incluye WCET medido y test U ≤ límite']
      },
      quiz: [
        q('Para tres tareas periódicas con Rate Monotonic, ¿cuál es el límite aproximado de uso de CPU?', ['0.50', '0.69', '0.78', '1.00'], 2, 'n·(2^(1/n)−1) con n=3 da 3·(1.2599−1) ≈ 0.78.'),
        q('¿Cómo se mide el jitter de un lazo de control en hardware?', ['Con la media de Serial.println', 'Con un toggle de GPIO y un analizador lógico', 'Con el reloj del sistema operativo', 'Con un multímetro'], 1, 'El flanco del GPIO marcado en el analizador revela la desviación real de cada periodo.')
      ]
    }),

    L({
      id: 'r13-3', title: 'PID con feedforward', min: 20, level: 'avanzado',
      objectives: [
        'Añadir términos de velocidad, aceleración y gravedad a un PID',
        'Implementar anti-windup y derivada filtrada en un controlador real'
      ],
      blocks: [
        p('El PID corrige el error, pero siempre llega tarde: necesita ver el error para reaccionar. El feedforward adelanta la parte predecible de la orden. En un brazo, la gravedad y la aceleración deseada se conocen de antemano; compensarlas reduce el error que el PID debe corregir y mejora el seguimiento de trayectoria.'),
        formula('u = Kp·e + Ki·∫e dt + Kd·ė + Kv·v_des + Ka·a_des + g(q)', 'Kv y Ka son modelos de la planta; g(q) compensa la gravedad. El PID se encarga de lo imprevisto.'),
        diagrama('pid', 'El feedforward se suma a la salida del PID, antes de la planta.'),
        p('Ejemplo: brazo de 0.5 kg a 0.30 m. El par gravitacional máximo es m·g·r = 1.47 N·m. Si el controlador solo usara PID, necesitaría un error permanente para generar ese par. Con g(q) = 1.47·cos(q) N·m el error estacionario desaparece y Ki puede ser pequeño, evitando windup.'),
        codigo('cpp', `struct PIDFF {
  float kp, ki, kd, kv, ka, dt, integral, e_prev;
  float umin, umax;

  float update(float ref, float v_des, float a_des, float y, float g) {
    float e = ref - y;
    float u_ff = kv * v_des + ka * a_des + g;
    float u_p = kp * e;
    float u_d = kd * (e - e_prev) / dt;
    float u = u_p + integral + u_d + u_ff;

    float sat = fminf(umax, fmaxf(umin, u));
    // anti-windup: solo integrar si no se alcanzo la saturacion
    if (sat == u) integral += ki * e * dt;
    e_prev = e;
    return sat;
  }
};`, 'La integral se congela al saturar: evita el windup clásico del arranque.'),
        apunte('Derivada filtrada', 'La derivada del error amplifica el ruido del sensor. Se usa un filtro de primer orden: D_filtrada = (1−α)·D_anterior + α·(e_k − e_{k−1})/dt con α = dt/(dt + τ_f), típicamente τ_f = 3–10 ms.'),
        tabla(['Término', 'Mejora', 'Riesgo si se pasa'], [
          ['Kp', 'Respuesta rápida', 'Overshoot y ruido'],
          ['Ki', 'Elimina error estacionario', 'Windup y lentitud'],
          ['Kd', 'Amortigua', 'Ruido amplificado'],
          ['Kv', 'Sigue rampas', 'Depende del modelo'],
          ['Ka', 'Mejora arranques', 'Puede excitar vibraciones'],
          ['g(q)', 'Compensa gravedad', 'Error si la masa cambia']
        ]),
        aviso('El feedforward no sustituye a la realimentación: si el modelo está mal, el error crece y el PID debe corregirlo. Nunca dejes el lazo abierto confiando solo en el modelo.')
      ],
      errors: [
        err('El brazo se pasa de golpe tras estar saturado mucho rato', 'Integral windup', 'Congela la integral cuando la salida está saturada.'),
        err('La salida del controlador vibra con ruido', 'Derivada sin filtrar', 'Añade filtro de primer orden con τ_f ≈ 5 ms.'),
        err('El seguimiento de trayectoria va siempre retrasado', 'Falta feedforward de velocidad', 'Añade Kv·v_des y Ka·a_des.')
      ],
      practice: {
        task: 'Sobre tu eje o brazo, compara un PID solo con un PID + feedforward de gravedad y velocidad. Mide el error durante un barrido de 0 a 90 grados en 1 s. Ajusta Kv y Ka hasta reducir el error máximo al menos un 50% sin superar 5% de overshoot.',
        success: ['El error máximo con feedforward es <50% del PID solo', 'El overshoot se mantiene por debajo del 5%', 'La integral no crece durante la saturación (anti-windup verificado)']
      },
      quiz: [
        q('¿Qué problema resuelve el anti-windup?', ['El ruido de la derivada', 'La acumulación de la integral mientras el actuador está saturado', 'La gravedad del brazo', 'El jitter del reloj'], 1, 'Si se sigue integrando con el actuador al límite, la integral se descarga tarde y provoca un gran overshoot.'),
        q('En u = Kp·e + Ki·∫e + Kd·ė + Kv·v_des + Ka·a_des + g(q), ¿qué término es feedforward?', ['Kp·e', 'Ki·∫e', 'Kv·v_des + Ka·a_des + g(q)', 'Kd·ė'], 2, 'Los términos que usan referencia conocida (v_des, a_des) y modelo (g) se adelantan al error.')
      ]
    }),

    L({
      id: 'r13-4', title: 'Filtro de Kalman lineal', min: 22, level: 'avanzado',
      objectives: [
        'Formular predicción y corrección con covariance',
        'Sintonizar Q y R y comprobar la convergencia del filtro'
      ],
      blocks: [
        p('Un sensor es ruidoso; un modelo es incompleto. Kalman combina ambos con un peso óptimo que depende de sus incertidumbres. No es un promedio fijo: la ganancia cambia en cada paso según cuánto confíes en la predicción y en la medición.'),
        diagrama('kalman', 'Ciclo: predecir, medir, calcular ganancia y corregir.'),
        formula('Predicción: x⁻ = F·x,  P⁻ = F·P·Fᵀ + Q        Ganancia: K = P⁻·Hᵀ·(H·P⁻·Hᵀ + R)⁻¹        Corrección: x = x⁻ + K·(z − H·x⁻),  P = (I − K·H)·P⁻', 'Q es la incertidumbre del proceso; R la del sensor. K tiende a 1 si R es grande.'),
        p('Ejemplo 1D: estimar la posición de un robot con un encoder (R = 0.01 m²) y un modelo que se desvía Q = 0.005 m² por paso. Si P crece hasta 0.2, K = 0.2/(0.2+0.01) = 0.952: casi te crees la medida. Si P baja a 0.005, K = 0.005/0.015 = 0.333: te crees más el modelo.'),
        codigo('python', `class Kalman1D:
    def __init__(self, x=0.0, P=1.0, Q=0.005, R=0.01):
        self.x, self.P, self.Q, self.R = x, P, Q, R

    def step(self, z, dt=1.0):
        self.P += self.Q * dt              # predecir covarianza
        K = self.P / (self.P + self.R)     # ganancia de Kalman
        self.x += K * (z - self.x)         # corregir estado
        self.P *= (1.0 - K)                # corregir covarianza
        return self.x, K

f = Kalman1D()
medidas = [1.0, 1.1, 0.9, 1.05, 0.98]
for z in medidas:
    x, K = f.step(z)
    print(f"z={z:.2f}  x={x:.3f}  K={K:.3f}")`, 'Con R pequeño, K arranca alto y baja a medida que P se reduce.'),
        tabla(['Parámetro', 'Si es demasiado pequeño', 'Si es demasiado grande'], [
          ['Q', 'Filtro rígido, sigue mal los cambios', 'Sigue el ruido como si fuera señal'],
          ['R', 'Confía demasiado en el sensor ruidoso', 'Ignora el sensor y se queda con el modelo'],
          ['P inicial', 'Arranca con excesiva confianza', 'Tarda en converger']
        ]),
        apunte('Sintonización práctica', 'Mide la varianza del sensor en reposo: ahí tienes R. Para Q, estima cuánto cambia el estado entre pasos por aceleraciones no modeladas. Si el filtro va retrasado, sube Q; si vibra, sube R.'),
        nota('Kalman asume ruido gaussiano y sistema lineal. Si tu sensor tiene sesgo o el modelo es no lineal, pasa al EKF de la siguiente lección.')
      ],
      errors: [
        err('La estimación sigue con retraso los movimientos rápidos', 'Q demasiado pequeño', 'Aumenta Q para dar más peso al modelo.'),
        err('La estimación vibra igual que el sensor', 'R demasiado pequeño o Q demasiado grande', 'Mide la varianza real del sensor y ajusta R al alza.'),
        err('La covarianza P crece sin límite', 'R muy grande o el filtro no recibe mediciones', 'Revisa que z llegue cada paso y que R sea realista.')
      ],
      practice: {
        task: 'Registra 200 mediciones de un sensor de distancia con el objeto quieto y calcula R como varianza muestral. Ejecuta el filtro con Q = 0.005 y compara la desviación de la estimación frente a la media móvil de 5 muestras. Mueve el objeto 20 cm y mide el retardo en detectar el cambio.',
        success: ['R se calcula de datos reales, no a ojo', 'La desviación en reposo del Kalman es menor que la de la media móvil', 'El retardo al escalón está cuantificado en milisegundos']
      },
      quiz: [
        q('Si R (varianza del sensor) es mucho mayor que P, ¿qué ocurre con la ganancia K?', ['K tiende a 1', 'K tiende a 0 y se confía más en el modelo', 'K es siempre 0.5', 'El filtro se vuelve inestable'], 1, 'K = P/(P+R): si R domina, K es pequeño y la corrección casi no cambia la predicción.'),
        q('¿Qué parámetro del Kalman representa la incertidumbre del modelo?', ['R', 'Q', 'H', 'K'], 1, 'Q es la covarianza del proceso; R es la del sensor.')
      ]
    }),

    L({
      id: 'r13-5', title: 'EKF con IMU', min: 24, level: 'avanzado',
      objectives: [
        'Extender Kalman a un modelo no lineal mediante linealización',
        ' Estimar ángulo y sesgo del giroscopio fusionando IMU y acelerómetro'
      ],
      blocks: [
        p('La IMU combina un giroscopio muy estable a corto plazo pero con deriva, y un acelerómetro sin deriva pero muy ruidoso y sensible a vibraciones. El EKF fusiona ambos: el giroscopio propaga el estado y el acelerómetro corrige. Como la orientación es no lineal, se linealiza el modelo en cada paso con el Jacobiano.'),
        diagrama('imu', 'Acelerómetro, giroscopio y magnetómetro: qué aporta cada uno.'),
        diagrama('complementario', 'El filtro complementario es la alternativa simple al EKF para un solo eje.'),
        formula('x = [θ, b]ᵀ        θ_k = θ_{k−1} + (ω_g − b)·Δt        F = [[1, −Δt], [0, 1]]', 'θ es el ángulo, b el sesgo del giroscopio en rad/s. La medición del acelerómetro da θ́ ≈ atan2(ax, az).'),
        p('Números reales: giroscopio a 200 Hz con ruido 0.01 rad/s y deriva 0.02 rad/s; acelerómetro con ruido 0.1 m/s², que a 9.81 m/s² de gravedad equivale a 0.010 rad ≈ 0.6°. Sin corrección, el sesgo del giro 0.02 rad/s genera 1.15° de error por segundo. El EKF estima b y lo resta.'),
        codigo('python', `import numpy as np

class EKFIMU:
    def __init__(self):
        self.x = np.array([0.0, 0.0])          # [angulo, sesgo]
        self.P = np.diag([0.1, 0.01])
        self.Q = np.diag([1e-4, 1e-6])
        self.R = 0.01                          # rad^2, acelerometro

    def predict(self, gyro_rad, dt):
        theta, b = self.x
        self.x = np.array([theta + (gyro_rad - b) * dt, b])
        F = np.array([[1.0, -dt], [0.0, 1.0]])
        self.P = F @ self.P @ F.T + self.Q * dt

    def update(self, z_angle):
        H = np.array([[1.0, 0.0]])
        y = z_angle - H @ self.x
        S = H @ self.P @ H.T + self.R
        K = self.P @ H.T / S
        self.x = self.x + K.flatten() * y
        self.P = (np.eye(2) - K @ H) @ self.P

ekf = EKFIMU()
for i in range(200):
    ekf.predict(0.02, 0.005)     # giro con sesgo de 0.02 rad/s
    if i % 4 == 0:
        ekf.update(0.0)          # acelerometro: angulo 0, ruidoso
print("angulo=%.4f rad  sesgo_estimado=%.4f rad/s" % tuple(ekf.x))`, 'El filtro aprende el sesgo aunque el ángulo verdadero sea constante.'),
        apunte('Cuándo basta el complementario', 'Si solo necesitas inclinación en un eje y la IMU no sufre aceleraciones lineales fuertes, un filtro complementario con α ≈ 0.98 es más simple y consume mucho menos. Reserva el EKF para cuando necesites estimar sesgos o fusionar varias fuentes.'),
        aviso('El acelerómetro mide aceleración específica: si el robot acelera, el ángulo deducido es falso. Detecta aceleraciones por encima de cierto umbral y baja temporalmente el peso de esa medición.'),
        nota('Para orientación completa se usa un quaternion de 4 componentes y la matriz de rotación en lugar del ángulo simple; el principio es idéntico, con Jacobiano 4×4.')
      ],
      errors: [
        err('El ángulo estimado deriva aunque el robot esté quieto', 'Sesgo del giroscopio no estimado', 'Añade el sesgo al vector de estado y corrígelo con el acelerómetro.'),
        err('La estimación salta al acelerar el robot', 'El acelerómetro interpreta la aceleración lineal como inclinación', 'Aumenta R del acelerómetro cuando |a| se aleje de 9.81 m/s².'),
        err('El EKF diverge tras unos segundos', 'P o Q mal escalados o matriz no positiva', 'Verifica unidades (rad, rad/s) y simétrica P.')
      ],
      practice: {
        task: 'Con una IMU real, gira 90 grados y vuelve a 0 mientras registras giroscopio y acelerómetro a 200 Hz. Ejecuta el EKF del bloque y compara el ángulo final con un goniómetro. Repite con el giroscopio sesgado artificialmente sumando 0.05 rad/s y verifica que el filtro estima el sesgo.',
        success: ['El error final del ángulo es <2°', 'El sesgo estimado se acerca a 0.05 rad/s en menos de 5 s', 'La estimación no salta al mover el sensor en línea recta']
      },
      quiz: [
        q('¿Qué hace el Jacobiano en un EKF?', ['Filtra el ruido del sensor', 'Linealiza el modelo no lineal alrededor del estado actual', 'Incrementa la ganancia', 'Reduce el número de mediciones'], 1, 'El EKF calcula F y H como derivadas parciales del modelo en el punto de operación.'),
        q('Con un sesgo de giroscopio de 0.02 rad/s sin corregir, ¿cuánto error angular se acumula en 10 s?', ['0.2 rad (≈11.5°)', '0.02 rad (≈1.1°)', '2 rad (≈115°)', 'Ninguno'], 0, 'El error es b·t = 0.02 · 10 = 0.2 rad ≈ 11.5°.')
      ]
    }),

    L({
      id: 'r13-6', title: 'Sintonización y métricas de respuesta', min: 18, level: 'avanzado',
      objectives: [
        'Aplicar Ziegler-Nichols y ajustar ganancias con criterio numérico',
        'Medir overshoot, tiempo de asentamiento y error estacionario'
      ],
      blocks: [
        p('Sintonizar no es probar números al azar: es optimizar una métrica. Primero defines qué significa "bien" (overshoot <5%, asentamiento <300 ms) y después ajustas Kp, Ki y Kd hasta cumplirlo. Sin esas cifras, cualquier discusión sobre ganancias es una opinión.'),
        diagrama('pid_respuesta', 'Tres respuestas al escalón: bien sintonizado, Kp excesivo e integral excesiva.'),
        formula('overshoot = 100 · (y_max − ref) / ref        t_s(2%) = primer instante tras el cual |y − ref| < 0.02·ref', 'Se mide sobre la respuesta al escalón, con el actuador sin saturar.'),
        tabla(['Método', 'Procedimiento', 'Ventaja', 'Inconveniente'], [
          ['Ziegler-Nichols ciclo cerrado', 'Subir Kp hasta oscilación sostenida: Ku, Tu', 'Rápido', 'Agresivo, overshoot ~25%'],
          ['Relay auto-tuning', 'Relé con histéresis mide Ku, Tu', 'Automático, seguro', 'Requiere identificar planta'],
          ['Prueba y error dirigida', 'Kp → Ki → Kd con métrica', 'Intuitivo', 'Lento sin criterio'],
          ['ITAE / optimización', 'Minimizar ∫t·|e| dt', 'Objetivo único', 'Requiere simulación']
        ]),
        p('Ziegler-Nichols clásico para PID: Kp = 0.6·Ku, Ki = 1.2·Ku/Tu, Kd = 0.075·Ku·Tu. Si la oscilación aparece con Ku = 8 y periodo Tu = 0.4 s, resulta Kp = 4.8, Ki = 14.4, Kd = 0.24. Es un punto de partida: reduce Kp un 20% si el overshoot supera el 5%.'),
        codigo('python', `def metricas(t, y, ref, banda=0.02):
    sobre = 100.0 * (max(y) - ref) / ref
    fuera = [i for i, v in enumerate(y) if abs(v - ref) > banda * ref]
    ts = t[fuera[-1] + 1] if fuera and fuera[-1] + 1 < len(t) else t[-1]
    err = abs(y[-1] - ref) / ref * 100.0
    return sobre, ts, err

t = [i * 0.01 for i in range(100)]
y = [0.0] + [1.0 - (1.0 + 0.2*tt) * __import__('math').exp(-5*tt)
             for tt in t[1:]]
print("overshoot=%.1f%%  ts=%.3f s  error=%.2f%%" % metricas(t, y, 1.0))`, 'Calcula las tres métricas a partir de la respuesta muestreada.'),
        apunte('Orden de ajuste', 'Empieza con Ki = Kd = 0 y sube Kp hasta que la respuesta sea rápida pero con overshoot moderado. Añade Kd para amortiguar y por último Ki para eliminar el error residual. Nunca subas Ki antes de que el lazo esté amortiguado.'),
        aviso('Un escalón con el actuador saturado no sirve para sintonizar: mide overshoot solo en la zona lineal, si no estarás midiendo la limitación del PWM, no la del controlador.')
      ],
      errors: [
        err('El overshoot supera el 20%', 'Kp demasiado alto o Kd insuficiente', 'Reduce Kp un 20% y aumenta Kd gradualmente.'),
        err('El error estacionario no desaparece', 'Ki cero o muy pequeño', 'Añade Ki pequeño y comprueba anti-windup.'),
        err('La respuesta es lenta pero estable', 'Kp bajo o derivada excesiva', 'Sube Kp y reduce Kd.')
      ],
      practice: {
        task: 'Registra la respuesta al escalón de tu eje a 200 Hz. Calcula overshoot, tiempo de asentamiento al 2% y error estacionario. Ajusta las ganancias con el método de Ziegler-Nichols como punto de partida y refina hasta overshoot <5% y asentamiento <300 ms. Repite el escalón 10 veces y reporta el peor caso.',
        success: ['El overshoot del peor caso es <5%', 'El tiempo de asentamiento del peor caso es <300 ms', 'Las tres métricas se calculan de datos reales con el código de la lección']
      },
      quiz: [
        q('En Ziegler-Nichols de ciclo cerrado, ¿qué se busca al subir Kp?', ['El estado de saturación', 'La ganancia Ku y periodo Tu de la oscilación sostenida', 'El error estacionario', 'La frecuencia del PWM'], 1, 'Con Ku y Tu se calculan Kp = 0.6Ku, Ki = 1.2Ku/Tu y Kd = 0.075Ku·Tu.'),
        q('¿Cómo se define el tiempo de asentamiento al 2%?', ['El tiempo hasta el primer pico', 'El instante tras el cual la salida se mantiene dentro de ±2% de la referencia', 'El tiempo hasta que Ki empieza a actuar', 'El periodo de muestreo'], 1, 'Se mira el último instante en que la salida sale de la banda y se toma el siguiente.')
      ]
    }),

    L({
      id: 'r13-7', title: 'Temporización determinista y medición con GPIO', min: 20, level: 'avanzado',
      objectives: [
        'Garantizar que el lazo de control se ejecute en instantes predecibles',
        'Medir el jitter real con un toggle de GPIO y un analizador lógico'
      ],
      blocks: [
        p('La temporización determinista es la diferencia entre un controlador que funciona en la mesa y uno que funciona bajo carga. El lazo debe arrancar en el mismo instante relativo cada periodo, sin importar cuánto tarden la telemetría o la visión.'),
        formula('t_inicio(k) = t_0 + k·T + jitter(k)        jitter_máx = max |t_inicio(k) − (t_0 + k·T)|', 'El objetivo típico en un lazo de 1 kHz es jitter <100 µs, es decir, <10% del periodo.'),
        codigo('cpp', `// Marca de periodo con GPIO: un flanco por iteracion del control
#include <Arduino.h>
const int PIN_SYNC = 27;

void TaskControl(void *arg) {
  TickType_t last = xTaskGetTickCount();
  for (;;) {
    GPIO.out_wr1tc = (1u << PIN_SYNC);   // bajar sin lectura-modificacion
    GPIO.out_wr1ts = (1u << PIN_SYNC);   // subir: pulso de ~2 ciclos
    // --- lectura encoder, PID, escritura PWM ---
    vTaskDelayUntil(&last, pdMS_TO_TICKS(1));
  }
}
void setup() {
  pinMode(PIN_SYNC, OUTPUT);
  xTaskCreatePinnedToCore(TaskControl, "ctrl", 2048, nullptr, 3, nullptr, 1);
}
void loop() {}`, 'El pulso marca con precisión el inicio de cada iteración; mide los 1000 primeros periodos.'),
        tabla(['Fuente de jitter', 'Magnitud típica', 'Solución'], [
          ['vTaskDelay acumulativo', '100–500 µs', 'vTaskDelayUntil'],
          ['Serial.println en la crítica', '1–10 ms', 'Mover a tarea de baja prioridad'],
          ['Context switch', '5–20 µs', 'Fijar tarea a un núcleo'],
          ['I²C bloqueante', '1–5 ms', 'Timeout corto o tarea separada'],
          ['Recolección de datos', 'Variable', 'Ring buffer en ISR']
        ]),
        apunte('Medir con DWT', 'En Cortex-M, el registro DWT->CYCCNT cuenta ciclos de CPU. Leyéndolo antes y después del bloque de control obtienes el WCET en ciclos: 300000 ciclos a 100 MHz son 3 ms. En ESP32 usa esp_timer_get_time() o el GPIO y el analizador.'),
        aviso('Un toggle con digitalWrite dentro de la tarea crítica añade varios microsegundos. Para medir con precisión usa escritura directa al registro, como en el bloque de código.'),
        nota('Registra siempre el peor caso y el percentil 99, no solo la media. Un solo ciclo retrasado puede romper el lazo en el momento menos oportuno.')
      ],
      errors: [
        err('El pulso de sincronía aparece a intervalos irregulares', 'Se usa vTaskDelay en vez de vTaskDelayUntil', 'Cambia a vTaskDelayUntil y fija la tarea a un núcleo.'),
        err('Medir con digitalWrite aumenta el jitter', 'La llamada tarda varios microsegundos', 'Escribe directamente el registro GPIO.'),
        err('El jitter sube solo cuando envío telemetría', 'La telemetría corre en el mismo núcleo y con alta prioridad', 'Muévela a otro núcleo con prioridad baja y usa una Queue.')
      ],
      practice: {
        task: 'Practica estrella del módulo: con el brazo o eje montado, aplica un escalón de posición y registra la respuesta junto con el pulso de GPIO del lazo a 1 kHz. Ajusta las ganancias hasta obtener overshoot <5% y asentamiento <300 ms. Con el analizador lógico mide 1000 periodos del pulso y verifica jitter <100 µs. Entrega la captura, el CSV de la respuesta y el cálculo de las tres métricas.',
        success: ['Overshoot <5% y asentamiento <300 ms en 10 escalones consecutivos', 'Jitter máximo del pulso GPIO <100 µs medido sobre 1000 periodos', 'La captura muestra la respuesta y el pulso de sincronía alineados en el tiempo']
      },
      quiz: [
        q('¿Qué indica un pulso de GPIO irregular en un lazo a 1 kHz?', ['Que el encoder funciona', 'Que hay jitter en el inicio de las iteraciones', 'Que el PWM está al 100%', 'Que el filtro de Kalman convergió'], 1, 'El pulso marca el inicio de cada iteración: sus desviaciones son el jitter del lazo.'),
        q('¿Cuál es el objetivo de jitter de la práctica estrella?', ['<1 µs', '<100 µs', '<10 ms', '<100 ms'], 1, 'Con periodo de 1 ms, un jitter <100 µs equivale a menos del 10% del periodo.')
      ]
    }),

    L({
      id: 'r13-8', title: 'Telemetría sin romper el deadline', min: 16, level: 'avanzado',
      objectives: [
        'Diseñar un protocolo de telemetría acotado en ancho de banda',
        'Registrar datos desde ISR y tareas sin bloquear el control'
      ],
      blocks: [
        p('La telemetría es la ventana al robot, pero mal hecha es un problema de tiempo real: un printf en la tarea de control puede costar milisegundos. La solución es producir datos rápido en un buffer y dejar que una tarea de baja prioridad los envíe cuando pueda.'),
        formula('bitrate = frecuencia · bytes_por_trama · 10        (8 datos + 1 start + 1 stop)', 'A 100 Hz con 24 bytes por trama: 100 · 24 · 10 = 24 kbit/s, muy por debajo de 921600 baud.') ,
        tabla(['Dato', 'Frecuencia', 'Bytes', 'Justificación'], [
          ['Referencia y medición', '1 kHz', '2 × float32', 'Crítico para sintonizar'],
          ['Salida del controlador', '1 kHz', 'float32', 'Detecta saturación'],
          ['Cuentas del encoder', '1 kHz', 'int32', 'Odometría'],
          ['Estado de la IMU', '200 Hz', '3 × float32', 'Estimación'],
          ['Temperatura', '10 Hz', 'int16', 'Salud del driver']
        ]),
        codigo('cpp', `#include <cstdint>
const int N = 256;
struct Muestra { uint32_t t_us; float ref, med, u; };
static Muestra buffer[N];
static volatile uint16_t escritas = 0, leidas = 0;

void IRAM_ATTR registrar(float ref, float med, float u) {
  uint16_t w = escritas;
  if ((uint16_t)(w - leidas) < N) {
    buffer[w % N] = {static_cast<uint32_t>(micros()), ref, med, u};
    escritas = w + 1;                 // productor: solo escribe
  }
}
void enviar() {                       // tarea de baja prioridad
  while (leidas != escritas) {
    Muestra m = buffer[leidas % N];
    Serial.write(reinterpret_cast<uint8_t*>(&m), sizeof(m));
    leidas++;
  }
}`, 'Ring buffer de productor único y consumidor único: sin locks en la ruta crítica.'),
        p('Decimación: no todo debe enviarse a 1 kHz. Guarda las señales críticas a la frecuencia del lazo y el resto a su frecuencia natural. Si el enlace se satura, prioriza la integridad del control y deja caer telemetría: un robot ciego pero estable es mejor que uno con datos perfectos que se resetea.'),
        codigo('python', `import struct

def decodificar(ruta):
    with open(ruta, 'rb') as f:
        bloque = f.read()
    fmt = '<Ifff'          # t_us, ref, med, u
    tam = struct.calcsize(fmt)
    return [struct.unpack_from(fmt, bloque, i)
            for i in range(0, len(bloque) - tam + 1, tam)]

datos = decodificar('telemetria.bin')
print(f"muestras={len(datos)}  primera={datos[0]}")`, 'Formato binario: 16 bytes por muestra frente a ~60 bytes en texto CSV.'),
        apunte('Marcas de tiempo', 'Usa un contador monotónico (micros() o esp_timer) y no la hora del sistema. Así puedes alinear la telemetría con las capturas del osciloscopio aunque el reloj de pared salte.'),
        aviso('No imprimas floats con Serial.printf dentro de una ISR: la conversión a texto es lenta y no es reentrante. Escribe bytes en crudo y formatea fuera del lazo crítico.')
      ],
      errors: [
        err('El control se retrasa cada vez que envías datos', 'Escritura serial bloqueante en la tarea crítica', 'Usa ring buffer y una tarea de telemetría de baja prioridad.'),
        err('El archivo de telemetría tiene tramas partidas', 'Buffer desbordado o lectura sin verificar el índice', 'Comprueba (escritas − leidas) < N y descarta muestras si hace falta.'),
        err('Los timestamps van hacia atrás', 'Se usa tiempo de pared en vez de contador monotónico', 'Registra micros() o esp_timer_get_time().')
      ],
      practice: {
        task: 'Instrumenta tu lazo con el ring buffer y envía 10 s de telemetría a 1 kHz por UART a 921600 baud. Comprueba que ninguna muestra se pierde, decodifica el archivo binario con Python y grafica referencia frente a medición. Verifica con el GPIO que el jitter sigue siendo <100 µs con la telemetría activa.',
        success: ['Se reciben 10000 muestras sin huecos', 'El jitter con telemetría activa se mantiene <100 µs', 'El CSV decodificado permite calcular overshoot y asentamiento']
      },
      quiz: [
        q('A 100 Hz y 24 bytes por trama, ¿cuál es el bitrate aproximado en UART 8N1?', ['2.4 kbit/s', '24 kbit/s', '240 kbit/s', '2.4 Mbit/s'], 1, '100 · 24 · (8+2) = 24000 bit/s; el bit de start y el de stop se suman a los 8 datos.'),
        q('¿Por qué un ring buffer evita bloquear el lazo de control?', ['Porque comprime los datos', 'Porque el productor solo escribe y el consumidor lee en otra tarea, sin locks', 'Porque usa texto en vez de binario', 'Porque aumenta la prioridad de la ISR'], 1, 'Con un productor y un consumidor no hacen falta cerrojos, y el envío lento se hace fuera de la ruta crítica.')
      ]
    })
  ]),

  // ==================== B14: MECATRÓNICA Y DIMENSIONADO ====================
  M('b14', 'Mecatrónica y dimensionado', 'De los requerimientos al brazo validado: actuadores, transmisiones, CAD, tolerancias y rigidez', [

    L({
      id: 'r14-1', title: 'Requerimientos y desglose de métricas', min: 16, level: 'avanzado',
      objectives: [
        'Convertir una meta vaga en requisitos medibles y verificables',
        'Desglosar cada requisito hasta una decisión de diseño concreta'
      ],
      blocks: [
        p('"Un brazo que mueva cosas" no es un requisito; "levanta 500 g a 300 mm con flecha <2° durante 1000 ciclos sin deslizamiento" sí lo es. El dimensionado empieza siempre por cifras verificables, porque son las que permiten decidir entre un motor y otro sin discusiones.'),
        tabla(['ID', 'Requisito', 'Valor', 'Verificación'], [
          ['REQ-01', 'Carga útil', '500 g', 'Pesada en báscula'],
          ['REQ-02', 'Alcance horizontal', '300 mm', 'Cinta métrica desde el eje'],
          ['REQ-03', 'Flecha bajo carga', '<2°', 'Goniómetro o captura'],
          ['REQ-04', 'Durabilidad', '1000 ciclos', 'Contador + inspección'],
          ['REQ-05', 'Sin deslizamiento', '0 vueltas perdidas', 'Marcas en el eje']
        ]),
        p('Cada requisito se desglosa: la carga útil determina el par (REQ-01 → τ ≥ 1.47 N·m), el alcance determina la longitud del eslabón (REQ-02 → L = 300 mm), la flecha determina la rigidez (REQ-03 → I mínimo), y la durabilidad determina el margen térmico y de desgaste (REQ-04 → 1.5× de margen).'),
        pasos([
          { title: 'Capturar la necesidad', text: 'Escribe qué debe hacer el robot, sin soluciones: qué mueve, cuánto, hasta dónde y cuántas veces.' },
          { title: 'Cuantificar', text: 'Cada necesidad pasa a un número con unidad y un método de medida.' },
          { title: 'Desglosar', text: 'De la métrica system al par, la rigidez y la tolerancia de cada pieza.' },
          { title: 'Asignar margen', text: 'Aplica 1.5× sobre el par calculado y documenta por qué.' },
          { title: 'Verificar', text: 'Define la prueba que demuestra cada requisito antes de fabricar.' }
        ]),
        codigo('python', `reqs = {
  "REQ-01": {"valor": 0.500, "unidad": "kg", "verificacion": "bascula"},
  "REQ-02": {"valor": 0.300, "unidad": "m", "verificacion": "cinta"},
  "REQ-03": {"valor": 2.0, "unidad": "grados", "verificacion": "goniometro"},
  "REQ-04": {"valor": 1000, "unidad": "ciclos", "verificacion": "contador"},
}
tau = reqs["REQ-01"]["valor"] * 9.81 * reqs["REQ-02"]["valor"]
print(f"Par estatico minimo: {tau:.3f} N·m")
print(f"Con margen 1.5x: {1.5*tau:.3f} N·m")`, 'Del requisito al primer número de dimensionado: 1.471 N·m y 2.207 N·m.'),
        apunte('SMART en mecánica', 'Específico, Medible, Alcanzable, Relevante y con Tiempo definido. "Rigidez suficiente" falla; "flecha <2° con 500 g a 300 mm" pasa. El segundo obliga a calcular I y a medir con goniómetro.'),
        aviso('No añadas requisitos que no se puedan verificar. Cada requisito sin prueba asociada es una fuente de discusiones futuras.'),
        nota('Guarda la matriz de requisitos en el repositorio, junto al plano y al informe de validación. Es el documento que justifica cada decisión de compra.')
      ],
      errors: [
        err('El diseño "parece bien" pero nadie sabe si cumple', 'No hay criterio numérico', 'Convierte cada meta en un requisito con valor, unidad y verificación.'),
        err('Se eligió el motor por precio antes de calcular el par', 'Requisitos no desglosados', 'Calcula primero τ = m·g·r con margen y luego compara motores.'),
        err('El brazo cumple en banco pero falla en el robot', 'La prueba no reproduce la carga real', 'Verifica con la carga y el ciclo de trabajo auténticos.')
      ],
      practice: {
        task: 'Escribe la matriz de requisitos de un brazo 2-DOF que levante 500 g a 300 mm con flecha <2° y 1000 ciclos sin deslizamiento. Para cada requisito indica valor, unidad, método de verificación y el parámetro de diseño que afecta (par, rigidez, tolerancia, etc.).',
        success: ['La matriz tiene al menos 5 requisitos cuantificados', 'Cada requisito tiene método de verificación', 'El par con margen 1.5× se deriva de la matriz']
      },
      quiz: [
        q('¿Cuál de estas frases es un requisito verificable?', ['El brazo debe ser resistente', 'El brazo debe moverse suave', 'Flecha <2° con 500 g a 300 mm', 'El motor debe ser potente'], 2, 'Incluye valor, unidad, condición de carga y un método de medida claro.'),
        q('Con 0.5 kg a 0.3 m, ¿cuál es el par estático antes de aplicar margen?', ['0.49 N·m', '1.47 N·m', '2.21 N·m', '4.41 N·m'], 1, 'τ = m·g·r = 0.5 · 9.81 · 0.3 = 1.4715 N·m; con margen 1.5× sería 2.21 N·m.')
      ]
    }),

    L({
      id: 'r14-2', title: 'Selección de actuador con margen 1,5×', min: 20, level: 'avanzado',
      objectives: [
        'Calcular par, velocidad y potencia requeridos con margen de diseño',
        'Comparar motor DC, stepper y servo frente a una misma carga'
      ],
      blocks: [
        p('Elegir actuador es cruzar tres números: par, velocidad y potencia, con un margen que cubra incertidumbre de modelo, desgaste y temperatura. Un motor que justo alcanza el par teórico fallará en cuanto el cable se caliente o la batería baje.'),
        formula('τ_req = m · g · r · factor_dinámico        τ_diseño = 1.5 · τ_req        P = τ · ω', 'El factor dinámico cubre aceleraciones: 1.5–2 para movimientos suaves, hasta 4 para golpes.'),
        p('Nuestro caso: m = 0.5 kg, r = 0.30 m, factor dinámico 1.0 en movimiento lento. τ_req = 1.471 N·m. Con margen 1.5× → τ_diseño = 2.207 N·m. Si el brazo debe girar 90° en 0.5 s, ω = (π/2)/0.5 = 3.14 rad/s y la potencia mecánica es 1.471 · 3.14 = 4.6 W; con rendimiento 0.7 del tren, el motor debe entregar ≈6.6 W.'),
        tabla(['Actuador', 'Par típico', 'Velocidad', 'Precisión', 'Conveniencia aquí'], [
          ['Motor DC + engranaje 50:1', '3 N·m', 'Alta', 'Requiere encoder', 'Buena'],
          ['Stepper NEMA 17 + 20:1', '1.8 N·m', 'Media', 'Pasos sin realimentación', 'Justo, sin margen'],
          ['Servo industrial', '5 N·m', 'Media', 'Encoder absoluto', 'Excelente, caro'],
          ['BLDC + FOC + 30:1', '4 N·m', 'Alta', 'Encoder', 'Mejor si hay que ser rápido']
        ]),
        codigo('cpp', `#include <cmath>
int main() {
  const float m = 0.5f, g = 9.81f, r = 0.30f;
  const float din = 1.0f, margen = 1.5f;
  float tau_req = m * g * r * din;         // 1.471 N·m
  float tau_dis = margen * tau_req;        // 2.207 N·m
  float omega = (float)M_PI / 2.0f / 0.5f; // 3.14 rad/s
  float P_mec = tau_req * omega;           // 4.62 W
  float P_motor = P_mec / 0.7f;            // 6.6 W con eta=0.7
  return (tau_dis > 2.0f) ? 0 : 1;
}`, 'El candidato debe superar 2.207 N·m y 6.6 W simultáneamente.'),
        apunte('Par vs velocidad no son independientes', 'Un motor tiene una curva par–velocidad: a más velocidad, menos par disponible. Comprueba el punto de operación en la curva del fabricante con la relación de reducción elegida, no solo el par nominal en parada.'),
        aviso('El par de parada del motor no es el par de trabajo continuo. Consulta el par nominal y la temperatura de funcionamiento; un motor que aguanta 3 N·m solo durante 2 s no sirve para 1000 ciclos.'),
        nota('El margen de 1.5× es un mínimo de ingeniería: si la carga es mal conocida o hay impactos, sube a 2×. Documenta siempre el factor elegido.')
      ],
      errors: [
        err('El brazo levanta la carga pero se calienta en 100 ciclos', 'Se dimensionó con el par de parada, no el continuo', 'Usa el par continuo del datasheet y añade margen térmico.'),
        err('El motor elegido no llega a la velocidad requerida', 'Se miró solo el par, no la curva par–velocidad', 'Verifica el punto de operación con la reducción real.'),
        err('El stepper pierde pasos al arrancar', 'Sin margen de par y sin realimentación', 'Añade encoder o aumenta la reducción y el margen.')
      ],
      practice: {
        task: 'Selecciona un motor comercial real para el brazo. Descarga su datasheet, localiza par continuo, par de parada, velocidad nominal y corriente. Verifica por escrito que supera 2.207 N·m y 6.6 W en el punto de operación, y calcula la corriente de arranque para dimensionar el driver.',
        success: ['El par continuo del motor supera 2.207 N·m', 'La potencia disponible supera 6.6 W a la velocidad requerida', 'La corriente de arranque está calculada y el driver tiene margen ≥1.5×']
      },
      quiz: [
        q('Con m = 0.5 kg, r = 0.3 m y margen 1.5×, ¿qué par de diseño resulta?', ['1.47 N·m', '2.21 N·m', '0.98 N·m', '4.41 N·m'], 1, 'τ = 0.5·9.81·0.3 = 1.471 N·m; ×1.5 = 2.207 N·m.'),
        q('¿Por qué no dimensionar con el par de parada del motor?', ['Es menor que el par continuo', 'Solo se sostiene brevemente y no representa el trabajo continuo', 'No depende de la tensión', 'Es un valor teórico del engranaje'], 1, 'El par de parada es un pico transitorio; el diseño debe usar el par continuo y su curva de velocidad.')
      ]
    }),

    L({
      id: 'r14-3', title: 'Engranajes, reducción y backlash', min: 20, level: 'avanzado',
      objectives: [
        'Calcular la reducción necesaria y su efecto sobre par e inercia',
        'Medir y mitigar el juego (backlash) en el tren de engranajes'
      ],
      blocks: [
        p('La reducción multiplica el par y divide la velocidad, pero también multiplica el juego y refleja la inercia al motor por el cuadrado de la relación. Elegir 100:1 para ganar par puede convertir el brazo en un sistema blando e imposible de controlar con precisión.'),
        formula('τ_salida = η · N · τ_motor        ω_salida = ω_motor / N        J_reflejada = J_carga / N²', 'N es la reducción, η el rendimiento por etapa (0.9–0.95 en planetario, 0.7–0.9 en engranaje recto).'),
        p('Ejemplo: motor de 0.08 N·m con reducción planetaria 30:1 y η = 0.9 por etapa (dos etapas, η_total = 0.81). Par de salida = 0.08 · 30 · 0.81 = 1.94 N·m: por debajo de los 2.21 N·m requeridos. Con 40:1 resulta 2.59 N·m y cumple, pero el juego típico de 1° en entrada se convierte en 1°/40 = 0.025° en salida: aceptable frente al límite de 2°.'),
        tabla(['Tipo', 'Reducción típica', 'Backlash', 'Rendimiento', 'Uso'], [
          ['Engranaje recto', '1:1 a 10:1', '1–3°', '0.90', 'Bajo coste'],
          ['Planetario', '10:1 a 100:1', '0.5–2°', '0.90/etapa', 'Compacto, par alto'],
          ['Armónico (harmonic)', '50:1 a 160:1', '<1 minuto de arco', '0.80', 'Alta precisión'],
          ['Correa dentada', '1:1 a 10:1', 'Bajo si pretensada', '0.95', 'Bajo ruido']
        ]),
        codigo('python', `def salida(tau_m, N, eta=0.9, etapas=2):
    return tau_m * N * eta ** etapas

for N in [20, 30, 40, 50]:
    tau = salida(0.08, N)
    juego = 1.0 / N          # grados en la salida
    print(f"N={N:3d}:  tau={tau:.2f} N·m  backlash={juego:.3f} grados")` , 'Muestra que 40:1 es el primer candidato que supera 2.21 N·m.'),
        apunte('Compensación de backlash', 'El juego se elimina en software acercándose siempre desde el mismo sentido, o en hardware con engranajes de doble flanco y muelle. En un brazo con carga gravitatoria, acércate siempre desde arriba para que la gravedad mantenga los dientes en contacto.'),
        aviso('Un reductor armónico casi sin juego no perdona golpes: un impacto puede dañar el flexspline. Protege el tren con un limitador de par o control de fuerza.')
      ],
      errors: [
        err('El brazo tiene un juego visible al cambiar de sentido', 'Backlash del tren sin compensar', 'Acércate siempre desde el mismo sentido o usa un reductor de bajo juego.'),
        err('El motor se calienta con la reducción elegida', 'Rendimiento acumulado menor del supuesto', 'Multiplica el rendimiento por cada etapa y revisa el par real entregado.'),
        err('El control oscila al aumentar la reducción', 'Inercia reflejada y juego cambian la dinámica', 'Re-sintoniza el PID para la nueva relación.')
      ],
      practice: {
        task: 'Mide el backlash de tu reductor: bloquea la salida con un goniómetro y gira la entrada hasta que la salida empiece a moverse; registra el ángulo muerto. Repite con el sentido inverso y calcula el juego total en salida para N = 40. Comprueba que es <2°.',
        success: ['El juego medido en salida es <2°', 'La medición se repite en ambos sentidos', 'La tabla compara al menos tres relaciones de reducción con par y juego']
      },
      quiz: [
        q('Con un motor de 0.08 N·m, N = 40 y dos etapas de η = 0.9, ¿cuál es el par de salida?', ['2.59 N·m', '3.20 N·m', '2.21 N·m', '0.72 N·m'], 0, '0.08 · 40 · 0.9² = 0.08 · 40 · 0.81 = 2.592 N·m.'),
        q('¿Qué efecto tiene aumentar la reducción N sobre la inercia de la carga reflejada al motor?', ['La multiplica por N', 'La divide por N²', 'No la afecta', 'La duplica'], 1, 'J_reflejada = J_carga / N²: una reducción alta "aligera" la carga para el motor.')
      ]
    }),

    L({
      id: 'r14-4', title: 'Correas dentadas y pretensado', min: 16, level: 'avanzado',
      objectives: [
        'Dimensionar una transmisión por correa y calcular su tensión',
        'Ajustar el pretensado para evitar saltos de diente sin sobrecargar los rodamientos'
      ],
      blocks: [
        p('La correa dentada es silenciosa, sin apenas juego y muy eficiente, siempre que esté bien tensada. Si el pretensado es bajo, salta dientes bajo par; si es alto, calienta los rodamientos y desgasta la correa. El punto correcto se calcula, no se ajusta a ojo.'),
        formula('F_tangencial = τ / r_polea        F_1 − F_2 = F_tangencial        F_pretensado ≈ 0.15 · F_rotura', 'La diferencia de tensiones entre el lado tirante y el flojo transmite el par.'),
        p('Con τ = 1.47 N·m y polea de radio 20 mm (GT2 de 20 dientes, 40 mm de circunferencia): F_tangencial = 1.47/0.02 = 73.5 N. Si la correa tiene 400 N de resistencia a la rotura, el pretensado recomendado es ≈60 N. Con margen 1.5× sobre el par, la fuerza sube a 110 N y conviene revisar la polea o usar doble correa.'),
        tabla(['Parámetro', 'Valor', 'Nota'], [
          ['Paso de diente GT2', '2 mm', '20 dientes → 40 mm/rev'],
          ['Polea', '20 dientes, r = 20 mm', 'Aluminio o acero'],
          ['Fuerza tangencial', '73.5 N', 'τ/r'],
          ['Pretensado', '≈60 N', '15% de 400 N'],
          ['Desviación de la correa', '2–3 mm', 'Regla del pulgar a mitad de vano']
        ]),
        codigo('python', `import math
tau = 1.47           # N·m
r = 0.020            # m, polea de 20 dientes GT2
dientes = 20
paso = 0.002         # m
circ = dientes * paso
r_calc = circ / (2 * math.pi)
Ft = tau / r
pretensado = 0.15 * 400.0
print(f"circunferencia={circ*1000:.0f} mm  r={r_calc*1000:.1f} mm")
print(f"F tangencial={Ft:.1f} N  pretensado={pretensado:.0f} N")`, 'La circunferencia de 40 mm da un radio de 6.4 mm, no 20 mm: ajusta el número de dientes.'),
        apunte('Ojo con el radio', 'Una polea GT2 de 20 dientes tiene 40 mm de circunferencia, es decir r ≈ 6.4 mm. Para r = 20 mm necesitas ≈63 dientes. El ejemplo anterior muestra por qué hay que calcular siempre: con r = 6.4 mm la fuerza tangencial sube a 230 N.'),
        aviso('Una correa demasiado tensa puede doblar el eje del motor y destruir el rodamiento en pocos ciclos. Respeta la carga radial máxima indicada en el datasheet del motor.'),
        nota('Marca la correa y la polea con un punto para poder detectar saltos de diente durante la validación de los 1000 ciclos.')
      ],
      errors: [
        err('La correa salta dientes al arrancar', 'Pretensado insuficiente o par por encima del diseño', 'Aumenta el pretensado gradualmente y verifica que no supera la carga radial del eje.'),
        err('La correa y los rodamientos se calientan', 'Pretensado excesivo', 'Reduce la tensión hasta la desviación recomendada de 2–3 mm.'),
        err('La transmisión tiene juego al invertir', 'Dientes desgastados o poleas desalineadas', 'Alinea las poleas y sustituye la correa si los dientes están redondeados.')
      ],
      practice: {
        task: 'Monta una transmisión GT2 con polea de 60 dientes y mide la desviación de la correa a mitad de vano. Ajusta el pretensado hasta 2–3 mm. Aplica el par de diseño de 2.21 N·m y cuenta 200 ciclos de ida y vuelta comprobando que la marca de la correa no salta dientes.',
        success: ['La desviación medida está entre 2 y 3 mm', 'No se produce ningún salto de diente en 200 ciclos', 'El cálculo usa el radio real de la polea, no un valor supuesto']
      },
      quiz: [
        q('Una polea GT2 de 20 dientes con paso de 2 mm, ¿qué radio tiene aproximadamente?', ['6.4 mm', '20 mm', '40 mm', '63 mm'], 0, 'Circunferencia = 20 · 2 = 40 mm; r = 40/(2π) ≈ 6.4 mm.'),
        q('¿Qué síntoma indica pretensado excesivo en una correa dentada?', ['Salto de dientes', 'Calentamiento de rodamientos y desgaste', 'Juego al invertir', 'Ruido de engranaje'], 1, 'Exceso de tensión aumenta la carga radial y la fricción en los rodamientos.')
      ]
    }),

    L({
      id: 'r14-5', title: 'CAD paramétrico y diseño para fabricar', min: 18, level: 'avanzado',
      objectives: [
        'Construir un modelo donde las cotas dependan de parámetros',
        'Preparar piezas para fabricación con tolerancias y DFM en mente'
      ],
      blocks: [
        p('Un modelo paramétrico no es un dibujo: es un conjunto de relaciones. Si cambias la carga de 500 g a 800 g, el par cambia y el espesor del eslabón debe actualizarse solo. Eso se logra con cotas y ecuaciones, no con editar vértices a mano.'),
        diagrama('cad', 'Del croquis con restricciones al ensamblaje y a los planos de fabricación.'),
        lista([
          'Croquis totalmente restriccionado: sin grados de libertad.',
          'Variables globales: carga, alcance, margen, espesor.',
          'Ecuaciones: espesor = f(par, material, flecha máxima).',
          'Ensamblaje con restricciones entre piezas, no piezas flotantes.',
          'Salida STEP para el mecanizado y STL/3MF para impresión.'
        ], true),
        codigo('python', `# FreeCAD: eslabón parametrizado por el par requerido
import FreeCAD as App

carga = 0.5       # kg
alcance = 0.30    # m
margen = 1.5
tau = carga * 9.81 * alcance * margen   # 2.207 N·m
# rigidez: I requerido para flecha < 2 grados (ver r14-7)
I_req = 1.2e-9    # m^4, resultado del calculo
ancho = 0.020     # m
espesor = (12 * I_req / ancho) ** (1.0/3.0)
print(f"par={tau:.3f} N·m  espesor={espesor*1000:.1f} mm")`, 'Un cambio de carga o de alcance recalcula el espesor automáticamente.'),
        p('El ejemplo anterior es completo y coherente con el cálculo de rigidez: si I_req crece al doble, el espesor crece por la raíz cúbica, no linealmente. En CAD conviene expresar esa relación como una ecuación y dejarla visible en el árbol de operaciones.'),
        tabla(['Entregable', 'Formato', 'Para qué'], [
          ['Modelo paramétrico', 'FCStd / SLDPRT', 'Modificaciones futuras'],
          ['Pieza neutra', 'STEP', 'Taller e intercambio'],
          ['Impresión', '3MF', 'Slicer con perfiles por pieza'],
          ['Plano', 'PDF / DXF', 'Cotas y tolerancias'],
          ['Lista de materiales', 'CSV', 'Compras y costes']
        ]),
        apunte('DFM en diez segundos', 'Antes de fabricar, pregúntate: ¿puedo sujetar esta pieza en la máquina?, ¿hay taladros demasiado cerca del borde?, ¿necesito soportes en impresión 3D?, ¿qué cara debe quedar lisa? Responder esto evita prototipos inútiles.'),
        aviso('Un modelo bonito no es un modelo fabricable. Las esquinas internas sin radio son imposibles de fresar con una fresa cilíndrica: añade radios ≥ herramienta.')
      ],
      errors: [
        err('El croquis se deforma al cambiar una cota', 'Restricciones incompletas', 'Añade cotas y relaciones hasta que no queden grados de libertad.'),
        err('La pieza impresa no encaja con el modelo', 'No se consideró la contracción o el hilo de la impresora', 'Imprime una galga y mide tu máquina antes de fijar tolerancias.'),
        err('El taller no puede mecanizar la pieza', 'Radios internos nulos o taladros ciegos imposibles', 'Añade radios y revisa la accesibilidad de la herramienta.')
      ],
      practice: {
        task: 'Modela el eslabón del brazo con tres parámetros (carga, alcance, margen) y una ecuación que ajuste el espesor a partir del par. Cambia la carga a 800 g y verifica que el espesor se recalcula sin editar el croquis. Exporta STEP y plano PDF con tolerancias.',
        success: ['El croquis está totalmente restriccionado', 'Al cambiar la carga el espesor se actualiza solo', 'Los entregables incluyen STEP, plano y lista de materiales']
      },
      quiz: [
        q('¿Qué significa que un croquis esté totalmente restriccionado?', ['Que no tiene cotas', 'Que no le quedan grados de libertad', 'Que es muy pequeño', 'Que no se puede editar'], 1, 'Todas las posiciones están definidas por cotas y relaciones: el modelo no se deforma de forma imprevisible.'),
        q('¿Qué formato es más adecuado para intercambiar una pieza con un taller de mecanizado?', ['STL', 'STEP', 'PNG', 'CSV'], 1, 'STEP conserva geometría exacta y se interpreta en cualquier CAD; STL es una malla para impresión.')
      ]
    }),

    L({
      id: 'r14-6', title: 'Tolerancias y cadenas dimensionales', min: 18, level: 'avanzado',
      objectives: [
        'Calcular una cadena de tolerancias por caso peor y por RSS',
        'Elegir ajustes y holguras realistas para piezas impresas y mecanizadas'
      ],
      blocks: [
        p('Tres piezas con ±0.1 mm cada una no suman ±0.1 mm: en el peor caso suman ±0.3 mm. Diseñar sin cadena de tolerancias es diseñar confiando en que los errores se cancelen, y eso falla exactamente en la última pieza de la serie.'),
        formula('Peor caso: T_total = Σ T_i        RSS: T_total = √(Σ T_i²)', 'El método RSS asume errores independientes; el peor caso es conservador y siempre válido.'),
        p('Ejemplo: un eje de 8 mm en tres piezas apiladas, cada una con ±0.1 mm. Peor caso: ±0.3 mm. RSS: √(0.01+0.01+0.01) = √0.03 = ±0.173 mm. Si el requisito de holgura es 0.2 mm, el peor caso falla y el RSS cumple: ahí hay una decisión de fabricación que tomar.'),
        tabla(['Ajuste', 'Descripción', 'Uso típico'], [
          ['H7/g6', 'Holgura pequeña, deslizamiento libre', 'Eje en casquillo'],
          ['H7/h6', 'Holgura mínima', 'Posicionamiento preciso'],
          ['H7/p6', 'Presión ligera', 'Rodamiento en carcasa'],
          ['FDM 0.20–0.40 mm', 'Holgura empirica', 'Eje impreso en taladro impreso']
        ]),
        codigo('python', `import math
tols = [0.1, 0.1, 0.1]
peor = sum(tols)
rss = math.sqrt(sum(t*t for t in tols))
print(f"peor caso=+/-{peor:.3f} mm   RSS=+/-{rss:.3f} mm")
print("cumple 0.2 mm (peor caso)" if peor <= 0.2 else "falla en peor caso")`, 'Muestra que el enfoque conservador rechaza el diseño y el RSS lo acepta.'),
        diagrama('tolerancias', 'Holgura frente a presión: mide siempre en TU máquina, no en el catálogo.'),
        apunte('Galga de impresión', 'Antes de fijar la holgura de un eje impreso, imprime una tira con taladros de 7.8, 8.0, 8.2 y 8.4 mm y mide con un calibrador. La impresora real, no el ideal, decide el valor. En FDM, 0.2–0.4 mm de holgura es un punto de partida razonable.'),
        aviso('Una tolerancia más estrecha no es gratis: multiplica el coste de mecanizado. Especifica estrecha solo la cota que realmente afecta a la función (la interfaz), y deja holgura en el resto.')
      ],
      errors: [
        err('Las piezas impresas no encajan entre sí', 'Holgura calculada para una impresora ideal', 'Imprime una galga y mide la holgura real de tu máquina.'),
        err('El eje queda suelto tras 100 ciclos', 'Holgura excesiva y desgaste', 'Reduce la holgura o cambia el material del casquillo.'),
        err('El coste de mecanizado se dispara', 'Tolerancias estrechas en cotas no críticas', 'Aplica tolerancias funcionales solo donde afectan al ajuste.')
      ],
      practice: {
        task: 'Mide con calibrador tres piezas impresas que formen un apilamiento y calcula la cadena de tolerancias real. Compara el resultado con el método RSS y decide la holgura de un eje de 8 mm. Imprime una galga con 4 taladros y verifica cuál da un ajuste deslizante sin juego excesivo.',
        success: ['La cadena por peor caso y por RSS está calculada con medidas reales', 'La holgura elegida se valida con la galga impresa', 'El informe justifica qué cotas son críticas']
      },
      quiz: [
        q('Tres cotas de ±0.1 mm apiladas, ¿cuál es la tolerancia total en el peor caso?', ['±0.1 mm', '±0.173 mm', '±0.3 mm', '±0.03 mm'], 2, 'En el peor caso los errores se suman: 0.1 + 0.1 + 0.1 = 0.3 mm.'),
        q('¿Qué metodología asume errores independientes y da √ΣT²?', ['Peor caso', 'RSS', 'Peor caso ampliado', 'GD&T'], 1, 'RSS (root sum square) es menos conservadora que la suma lineal y requiere errores estadísticamente independientes.')
      ]
    }),

    L({
      id: 'r14-7', title: 'Rigidez, flecha y selección de sección', min: 20, level: 'avanzado',
      objectives: [
        'Calcular la flecha de un eslabón en voladizo y verificar el límite de 2°',
        'Comparar materiales y secciones con el mismo requisito de rigidez'
      ],
      blocks: [
        p('La flecha es la deformación elástica bajo carga. En un brazo no importa solo que no se rompa: importa que la punta no se desvíe. La rigidez a flexión depende sobre todo del módulo E y del momento de inercia I, y este crece con el cubo del espesor.'),
        formula('δ = F · L³ / (3 · E · I)        θ = F · L² / (2 · E · I)        I = b · h³ / 12', 'δ es la flecha en m, θ el ángulo en radianes, b el ancho y h el espesor en la dirección de flexión.'),
        p('Caso real: F = 0.5 · 9.81 = 4.905 N, L = 0.30 m, aluminio E = 69 GPa, sección b = 20 mm y h = 10 mm. I = 0.020 · 0.010³ / 12 = 1.67e-9 m⁴. δ = 4.905 · 0.027 / (3 · 69e9 · 1.67e-9) = 0.38 mm; θ = 4.905 · 0.09 / (2 · 69e9 · 1.67e-9) = 0.0019 rad = 0.11°. Cumple el límite de 2° con holgura.'),
        p('Si el espesor baja a 5 mm, I cae 8 veces (por h³) y θ sube a 0.88°; con 3 mm, I cae ≈37 veces y θ ≈4.1°: ya no cumple. Subir h de 10 a 12 mm multiplica I por 1.73 y reduce la flecha un 42% con poco peso adicional.'),
        tabla(['Material', 'E (GPa)', 'I relativo para igual δ', 'Densidad (g/cm³)'], [
          ['Aluminio 6061', '69', '1.0', '2.70'],
          ['Acero', '200', '0.35', '7.85'],
          ['Fibra de carbono', '70–130', '0.5–1.0', '1.60'],
          ['PLA impreso', '3.5', '20', '1.24']
        ]),
        codigo('python', `F = 0.5 * 9.81      # N
L = 0.30            # m
E = 69e9            # Pa, aluminio
b = 0.020           # m
for h_mm in [3, 5, 10, 12]:
    h = h_mm / 1000
    I = b * h**3 / 12
    delta = F * L**3 / (3 * E * I)       # m
    theta = F * L**2 / (2 * E * I)       # rad
    print(f"h={h_mm:2d} mm  I={I:.2e} m^4  flecha={delta*1000:.2f} mm  theta={theta*57.3:.2f} grados")`, 'Imprime 0.11° para 10 mm y ≈4.1° para 3 mm.'),
        diagrama('cinematica', 'Esquema del brazo de dos eslabones: la flecha se mide en el extremo del segundo eslabón.'),
        apunte('Dónde poner el material', 'La rigidez crece con h³, así que conviene aumentar la altura de la sección en la dirección de la carga y vaciar el centro. Un tubo o una sección en U da casi la misma rigidez que una barra maciza con mucha menos masa.'),
        aviso('El cálculo de voladizo asume carga en el extremo y un empotramiento perfecto. Si el soporte tiene juego, la flecha real será mayor: mídela siempre en el prototipo.')
      ],
      errors: [
        err('La flecha medida es mayor que la calculada', 'El empotramiento tiene holgura o la carga no está en el extremo', 'Mide el juego de la unión y vuelve a calcular con la geometría real.'),
        err('El brazo cumple la flecha pero pesa demasiado', 'Sección maciza sobredimensionada', 'Usa sección hueca o en U para mantener I con menos masa.'),
        err('La punta se desvía al cambiar de sentido', 'Backlash además de flecha', 'Corrige el juego (r14-3) antes de culpar a la rigidez.')
      ],
      practice: {
        task: 'Calcula la flecha y el ángulo del eslabón con h = 10 mm y con h = 12 mm. Monta el brazo con 500 g a 300 mm y mide el ángulo en el extremo con goniómetro o captura. Compara medición con cálculo y explica la diferencia si supera el 20%.',
        success: ['El ángulo calculado con h = 10 mm es ≈0.11° y cumple <2°', 'La medición en prototipo está dentro del 20% del cálculo', 'El informe explica el efecto de h³ sobre la rigidez']
      },
      quiz: [
        q('Si duplicas el espesor h de una sección rectangular, ¿cómo cambia el momento de inercia I?', ['×2', '×4', '×8', '×16'], 2, 'I = b·h³/12: al duplicar h, I se multiplica por 2³ = 8.'),
        q('Con aluminio E=69 GPa, F=4.905 N, L=0.3 m, b=20 mm y h=10 mm, ¿cuál es el ángulo aproximado?', ['0.11°', '1.1°', '2.5°', '4.1°'], 0, 'θ = F·L²/(2EI) ≈ 0.0019 rad ≈ 0.11°, muy por debajo del límite de 2°.')
      ]
    }),

    L({
      id: 'r14-8', title: 'Validación: 1000 ciclos sin deslizamiento', min: 20, level: 'avanzado',
      objectives: [
        'Diseñar un plan de ensayo que demuestre todos los requisitos',
        'Ejecutar y documentar la prueba de durabilidad del brazo 2-DOF'
      ],
      blocks: [
        p('La validación no es "ver que se mueve": es demostrar, con números y de forma reproducible, que cada requisito se cumple. El ensayo de durabilidad es el que separa un prototipo de un producto: 1000 ciclos reales, con la carga real, detectan holguras y desgaste que una prueba de 10 minutos nunca mostrará.'),
        pasos([
          { title: 'Preparación', text: 'Verifica aprietes, marca la correa y el eje con un punto de referencia y calibra el goniómetro.' },
          { title: 'Carga', text: 'Coloca 500 g exactos en el extremo, a 300 mm del eje.' },
          { title: 'Ciclo', text: 'Sube y baja el brazo completando el recorrido, con aceleración acotada para no golpear.' },
          { title: 'Registro', text: 'Cuenta ciclos, temperatura del motor y corriente pico en cada bloque de 100.' },
          { title: 'Inspección', text: 'Cada 100 ciclos revisa marcas, juego y flecha; para si aparece deslizamiento.' },
          { title: 'Informe', text: 'Tabula pass/fail por requisito con el valor medido y la captura asociada.' }
        ]),
        tabla(['Requisito', 'Medición', 'Resultado', 'Evidencia'], [
          ['500 g a 300 mm', 'Báscula y cinta', 'PASS', 'foto_01.jpg'],
          ['Flecha <2°', '0.11° calculado / 0.18° medido', 'PASS', 'gonio_03.png'],
          ['1000 ciclos', 'Contador a 1000', 'PASS', 'ciclos.csv'],
          ['Sin deslizamiento', 'Marcas alineadas', 'PASS', 'marcas_final.jpg'],
          ['Temperatura', 'Máx 48 °C', 'PASS', 'termica.csv']
        ]),
        codigo('python', `import csv, math

ciclos, corriente_max, temp_max = 0, 0.0, 0.0
with open('ciclos.csv', newline='') as f:
    for fila in csv.DictReader(f):
        ciclos = int(fila['ciclo'])
        corriente_max = max(corriente_max, float(fila['i_A']))
        temp_max = max(temp_max, float(fila['temp_C']))

theta = 0.18   # grados, medido con goniometro
ok = (ciclos >= 1000 and theta < 2.0 and corriente_max < 3.0)
print(f"ciclos={ciclos}  theta={theta} grados  Imax={corriente_max:.2f} A  T={temp_max:.0f} C")
print("VALIDACION: PASS" if ok else "VALIDACION: FAIL")`, 'Criterio de aceptación binario: sin adjetivos, solo números.'),
        apunte('Por qué 1000 ciclos', 'La mayoría de los fallos mecánicos son de fatiga o de aflojamiento progresivo. Un tornillo que no se mueve en 10 ciclos puede girar 2° en 500. El conteo obliga a revisar periódicamente en lugar de mirar solo al final.'),
        aviso('Detén el ensayo ante el primer signo de deslizamiento o temperatura anómala. Seguir acumula daño y destruye la evidencia del fallo original.'),
        nota('Un informe de validación con vídeo, capturas y números es la prueba más fuerte que puedes llevar a una entrevista: demuestra que sabes cerrar un diseño, no solo dibujarlo.')
      ],
      errors: [
        err('El brazo desliza en el ciclo 600', 'Pretensado insuficiente o tornillo aflojado', 'Para, marca la posición exacta y revisa aprietes y tensión antes de continuar.'),
        err('La flecha crece con los ciclos', 'Holgura progresiva en la unión', 'Añade arandelas de bloqueo y verifica el apriete con torque.'),
        err('El informe no convence a un revisor', 'Faltan criterios numéricos o evidencia', 'Añade valor medido, umbral y captura para cada requisito.')
      ],
      practice: {
        task: 'Practica estrella del módulo: valida un brazo 2-DOF que levanta 500 g a 300 mm. Mide la flecha en el extremo con goniómetro y verifica que es <2°. Ejecuta 1000 ciclos completos sin deslizamiento, comprobando las marcas cada 100 ciclos y registrando corriente y temperatura. Entrega vídeo, tabla de requisitos con pass/fail y el CSV de ciclos.',
        success: ['La flecha medida es <2° con 500 g a 300 mm', 'El contador llega a 1000 ciclos y las marcas siguen alineadas (0 deslizamientos)', 'Cada requisito tiene valor medido, umbral y evidencia asociada']
      },
      quiz: [
        q('¿Por qué se inspecciona cada 100 ciclos en lugar de solo al final?', ['Porque es más rápido', 'Para detectar aflojamientos y desgaste progresivos antes de perder la evidencia', 'Porque el motor se calienta menos', 'Porque el goniómetro se descarga'], 1, 'Los fallos mecánicos progresan: detectar el primer cambio permite corregir y conservar la causa.'),
        q('¿Qué convierte un ensayo en una validación reproducible?', ['Un vídeo sin datos', 'Criterios numéricos, valores medidos y evidencia asociada', 'Una opinión experta', 'Repetir solo una vez'], 1, 'Sin umbral y medición, otro no puede confirmar el resultado; el vídeo acompaña, no sustituye.')
      ]
    })
  ])
];
