import { leccion as L, modulo as M, err, q, p, h, apunte, nota, aviso, codigo, diagrama, tabla, lista, pasos, formula, widget } from '../helpers';
import type { Module } from '../../types';

export const roboticsPart2: Module[] = [

  // ==================== B4: MOTORES Y ETAPAS DE POTENCIA ====================
  M('b4', 'Motores y etapas de potencia', 'DC, stepper, servo, BLDC/FOC, drivers, encoders y fuentes', [

    L({
      id: 'r4-1', title: 'Motores DC y sus ecuaciones', min: 18, level: 'intermedio',
      objectives: ['Relacionar voltaje, corriente, par y velocidad en un motor DC', 'Calcular el punto de operación y detectar el régimen de parada'],
      blocks: [
        p('Un motor DC conviene energía eléctrica en movimiento. Lo útil no es memorizar su nombre, sino saber qué pasa si subes el voltaje, si le pones carga o si lo frenas: todo se resume en dos ecuaciones.'),
        diagrama('motor_dc', 'El voltaje manda sobre la velocidad; la corriente manda sobre el par.'),
        formula('V = Iₐ·Rₐ + Kₑ·ω        τ = Kₜ·Iₐ        (Kₑ ≈ Kₜ en unidades SI)', 'Rₐ es la resistencia del bobinado, ω la velocidad angular (rad/s) y Kₑ/Kₜ las constantes del motor.'),
        p('Ejemplo numérico: un motor de 12 V con Rₐ = 2 Ω y Kₑ = 0.05 V·s/rad. Sin carga (Iₐ≈0) gira a ω = V/Kₑ = 12/0.05 = 240 rad/s ≈ 2290 rpm. Si lo paras a mano, Iₐ = 12/2 = 6 A (corriente de parada) y el par es τ = 0.05·6 = 0.3 N·m.'),
        tabla(['Magnitud', 'Símbolo', 'La controla', 'Unidad'], [
          ['Voltaje aplicado', 'V', 'PWM / driver', 'V'],
          ['Velocidad', 'ω', 'V y carga', 'rad/s'],
          ['Corriente', 'Iₐ', 'Par demandado', 'A'],
          ['Par', 'τ', 'Iₐ', 'N·m'],
          ['Resistencia bobinado', 'Rₐ', 'Fabricante (datasheet)', 'Ω']
        ]),
        codigo('cpp', `// Estimar par y velocidad a partir de V y corriente medida
const float V = 12.0f;      // alimentación del driver
const float Ra = 2.0f;      // ohmios, del datasheet
const float Ke = 0.05f;     // V·s/rad
const float Kt = 0.05f;     // N·m/A

float Ia = (V - backEmf) / Ra;   // backEmf = Ke * omega medido
float torque = Kt * Ia;
float omega  = (V - Ia * Ra) / Ke;`, 'El mismo modelo que usará un lazo de control.'),
        apunte('La curva par–velocidad', 'Es una recta: a más par exigido, menos velocidad. La potencia mecánica τ·ω es máxima justo en la mitad: par = τ_parada/2 y velocidad = ω_vacío/2. Un motor bien elegido trabaja cerca de ahí, no en parada ni en vacío.'),
        formula('P_mec = τ·ω        P_el = V·Iₐ        η = P_mec / P_el', 'En parada P_mec = 0 pero P_el es máxima: toda la energía se pierde como calor en Rₐ.'),
        nota('La corriente de parada (stall current) suele ser 5–10× la corriente nominal. Es el número que dimensiona el driver y la fuente, no el de funcionamiento.'),
      ],
      errors: [
        err('El driver se quemó en el primer arranque', 'Dimensionaste para la corriente nominal, no para la de parada', 'Calcula I_stall = V/Rₐ y elige un driver con margen (≥1.5×).'),
        err('El motor no alcanza las rpm del datasheet', 'El datasheet indica velocidad en vacío; tú tienes carga', 'Mide con encoder bajo carga real y revisa caídas de tensión en el cableado.')
        ],
      practice: { task: 'Un motor de 6 V tiene Rₐ = 3 Ω y Kₑ = 0.02. Calcula ω en vacío, I de parada y τ de parada.', success: ['ω ≈ 300 rad/s ≈ 2865 rpm', 'I_stall = 2 A', 'τ_stall = 0.04 N·m'] },
      quiz: [
        q('¿Qué magnitud del motor DC está directamente ligada al par?', ['El voltaje', 'La corriente', 'La frecuencia PWM', 'La temperatura'], 1, 'τ = Kₜ·Iₐ: el par es proporcional a la corriente.'),
        q('Al parar el eje de un motor alimentado, ¿qué ocurre?', ['La corriente cae a cero', 'La corriente sube al máximo (stall) y se disipa calor', 'La velocidad sube', 'No pasa nada'], 1, 'Al caer la fem procedente de giro, solo limita Rₐ: I = V/Rₐ.')
        ],
      tags: ['motor', 'electrónica', 'modelo']
    }),

    L({
      id: 'r4-2', title: 'Puente H y drivers de motor', min: 16, level: 'intermedio',
      objectives: ['Explicar cómo un puente H invierte la polaridad del motor', 'Elegir un driver y cablearlo con seguridad'],
      blocks: [
        p('Un motor DC gira en un sentido si le pones +12 V en un terminal y GND en el otro, y al revés si inviertes ambos. Un puente H son cuatro interruptores (transistores) que hacen exactamente eso sin mover cables.'),
        diagrama('h_bridge', 'Q1/Q4 en diagonal: un sentido; Q2/Q3: el otro.'),
        tabla(['Q1', 'Q4', 'Q2', 'Q3', 'Resultado'], [
          ['ON', 'ON', 'OFF', 'OFF', 'Giro horario'],
          ['OFF', 'OFF', 'ON', 'ON', 'Giro antihorario'],
          ['ON', 'OFF', 'ON', 'OFF', 'Frenado (cortocircuita el motor)'],
          ['OFF', 'OFF', 'OFF', 'OFF', 'Coast (rueda libre)'],
          ['ON', 'OFF', 'OFF', 'OFF', 'INVÁLIDO: shoot-through']
        ]),
        aviso('Nunca actives los dos transistores de la misma rama (Q1 con Q3, o Q2 con Q4): pones Vcc directamente a GND y fundes el driver. Los drivers integrados añaden dead-time para evitarlo; si haces tu propio puente, añádelo tú.'),
        codigo('cpp', `#include "TB6612FNG.h"
// AIN1/AIN2 = dirección, PWMA = velocidad, STBY = enable
void girar(int pwm) {
  digitalWrite(STBY, HIGH);
  if (pwm >= 0) { digitalWrite(AIN1, HIGH); digitalWrite(AIN2, LOW); }
  else          { digitalWrite(AIN1, LOW);  digitalWrite(AIN2, HIGH); }
  analogWrite(PWMA, abs(pwm));   // 0..255
}
void frenar() { digitalWrite(AIN1, HIGH); digitalWrite(AIN2, HIGH); }`, 'Control típico con un driver TB6612 y Arduino.'),
        apunte('Dentro del driver', 'Un driver integrado (TB6612, DRV8833, L298N, BTS7960) ya trae los MOSFET, los diodos de recirculación y la lógica de dead-time. Tú solo das dos pines de dirección y uno de PWM. Activa el pin de enable/STBY o el motor quedará flotando.'),
        tabla(['Driver', 'Corriente cont.', 'Tensión', 'Para qué'], [
          ['L298N', '2 A', '7–12 V', 'Barato, viejo, pierde ~2 V'],
          ['TB6612', '1.2 A', '2.5–13.5 V', 'Pequeños robots, eficiente'],
          ['DRV8833', '1.5 A', '2.7–10.8 V', 'Compacto, 2 motores'],
          ['BTS7960', '43 A', '7–27 V', 'Motores grandes / high current']
        ]),
        formula('V_motor = Vcc · duty · signo(AIN1−AIN2)', 'La dirección la fijan las entradas lógicas; la magnitud la pone el PWM.'),
      ],
        errors: [
          err('El motor solo gira en un sentido', 'Uno de los pines de dirección no cambia o está mal conectado', 'Mide AIN1/AIN2 con el multímetro y cambia el código de prueba.'),
          err('El driver se calienta incluso sin carga', 'Shoot-through por dead-time insuficiente o MOSFET mal excitado', 'Usa un driver integrado o añade dead-time de ~1 µs.')
        ],
        practice: { task: 'Con un TB6612 y un motor, haz que gire 2 s en un sentido, frene 0.5 s y gire al revés. Mide la corriente en cada fase.', success: ['Gira en ambos sentidos', 'El frenado reduce la velocidad rápido', 'La corriente de arranque es mayor'] },
        quiz: [q('¿Qué combinación del puente H frena el motor acortándolo?', ['Los dos transistores de una rama', 'Los dos altos o los dos bajos cruzados', 'Todos apagados', 'Solo Q1'], 1, 'Activar Q1+Q2 o Q3+Q4 cortocircuita los terminales del motor: frenado dinámico.')],
      tags: ['motor', 'driver', 'potencia']
    }),

    L({
      id: 'r4-3', title: 'PWM y frenado regenerativo', min: 14, level: 'intermedio',
      objectives: ['Interpretar duty, frecuencia y resolución del PWM', 'Diferenciar coast, frenado y frenado regenerativo'],
      blocks: [
        p('El PWM no entrega un voltaje analógico: entrega pulsos. El motor, por su inductancia, ve el promedio. Con duty 50 % recibe la mitad de Vcc y gira aproximadamente a la mitad de velocidad.'),
        diagrama('pwm', 'Ancho de pulso = energía media entregada al bobinado.'),
        formula('V_medio = Vcc · duty        duty = t_on / (t_on + t_off)', 'En un puente H, duty = 0.7 equivale a +0.7·Vcc; duty = −0.7 a −0.7·Vcc.'),
        widget('pwm'),
        tabla(['Frecuencia', 'Efecto en el motor', 'Cuándo'], [
          ['< 100 Hz', 'Tirones, zumbido audible', 'Evitar'],
          ['1–5 kHz', 'Suave, algo de ruido', 'Servos y juguetes'],
          ['10–20 kHz', 'Por encima del oído', 'Robots, drones'],
          ['> 20 kHz', 'Muy suave, más pérdidas de conmutación', 'Stepper / FOC']
        ]),
        codigo('cpp', `// ESP32: LEDC a 20 kHz, 10 bits (0..1023)
ledcSetup(0, 20000, 10);
ledcAttachPin(PWMA, 0);
ledcWrite(0, 512);   // 50 % de Vcc

// Frenado dinámico (cortocircuitar el motor)
digitalWrite(AIN1, HIGH);
digitalWrite(AIN2, HIGH);
ledcWrite(0, 1023);`),
        apunte('Decay modes', 'Cuando cortas el PWM, la corriente inductiva necesita un camino. En slow decay se cortocircuita el motor (frena suave y con poco rizado); en fast decay se devuelve energía a la fuente (frena más y puede subir Vcc). Los drivers modernos mezclan ambos automáticamente.'),
        aviso('El frenado regenerativo puede elevar la tensión del bus DC por encima de Vcc. Si tu fuente no puede absorberla, añade un capacitor bulk grande o un freno con resistencia (brake chopper).'),
      ],
        errors: [err('El motor zumba y vibra a baja velocidad', 'Frecuencia PWM demasiado baja', 'Sube a > 10 kHz y aumenta la resolución a 10 bits.')],
        practice: { task: 'Mide la tensión media con el multímetro a duty 25/50/75 % y compara con Vcc·duty. Luego mide cuánto tarda en parar en coast vs frenado.', success: ['V_medio ≈ Vcc·duty', 'El frenado para antes', 'Explicas el camino de la corriente inductiva'] },
        quiz: [q('Con un bus de 12 V y duty 0.25, ¿qué voltaje medio ve el motor?', ['3 V', '0.25 V', '48 V', '12 V'], 0, 'V_medio = 12 · 0.25 = 3 V.')],
      tags: ['pwm', 'frenado', 'motor']
    }),

    L({
      id: 'r4-4', title: 'Motores paso a paso y microstepping', min: 17, level: 'intermedio',
      objectives: ['Calcular ángulo de paso y resolver microstepping', 'Ajustar la corriente de un driver y evitar pérdida de pasos'],
      blocks: [
        p('Un stepper no gira "cuando le das voltaje", sino "cuando le das un pulso". Cada pulso avanza un ángulo fijo. Eso permite controlar posición sin encoder... mientras no pierdas pasos.'),
        diagrama('stepper', 'Secuencia de fases A+/A−/B+/B− y subdivisión por microstepping.'),
        formula('pasos por vuelta = 360° / ángulo_de_paso        resolución = pasos · microsteps', 'Un NEMA 17 de 1.8° tiene 200 pasos/vuelta; a 1/16 microstepping → 3200 micropasos/vuelta.'),
        tabla(['Modo', 'Micropasos/vuelta', 'Ángulo', 'Suavidad', 'Par relativo'], [
          ['Full step', '200', '1.8°', 'Ruidoso', '100 %'],
          ['Half step', '400', '0.9°', 'Medio', '~70 %'],
          ['1/8', '1600', '0.225°', 'Suave', '~30 %'],
          ['1/16', '3200', '0.1125°', 'Muy suave', '~15–30 %']
        ]),
        codigo('cpp', `#include <AccelStepper.h>
AccelStepper stepper(AccelStepper::DRIVER, STEP_PIN, DIR_PIN);

void setup() {
  stepper.setMaxSpeed(1000);        // micropasos/s
  stepper.setAcceleration(500);
  // MS1/MS2/MS3 del driver a HIGH,HIGH,HIGH => 1/16
}
void loop() {
  stepper.moveTo(3200);             // una vuelta exacta
  stepper.run();                    // llama SIEMPRE, no uses delay
}`, 'Driver A4988/DRV8825 con interfaz step/dir.'),
        apunte('Ajustar la corriente', 'Los drivers A4988/DRV8825 tienen un potenciómetro. Con el motor desconectado, mide Vref en el pin y aplica I ≈ Vref/(8·Rs) para A4988 (Rs suele ser 0.1 Ω → Vref = I·0.8). Un A4988 con Rs=0.1 Ω a 1 A necesita Vref ≈ 0.8 V.'),
        aviso('Nunca desconectes el motor con el driver energized: la inductancia genera un pico que puede destruirlo. Ajusta la corriente ANTES de conectar el motor y usa un disipador o ventilador.'),
        p('El par cae con la velocidad porque la fem procedente de giro reduce la corriente disponible. Además, a baja velocidad aparece resonancia: zonas donde el motor vibra y pierde pasos. Aceleración gradual (rampas) y microstepping lo mitigan.'),
      ],
        errors: [
          err('El motor vibra y pierde pasos al arrancar', 'Aceleración demasiado alta o corriente baja', 'Baja la aceleración, sube Vref y usa microstepping 1/16.'),
          err('El motor se calienta mucho en reposo', 'Corriente excesiva o driver sin disipador', 'Reduce Vref; muchos drivers tienen modo standby/full-current reduction.')
        ],
        practice: { task: 'Configura 1/16 microstepping y haz girar exactamente 3 vueltas (9600 micropasos). Verifica con una marca en el eje.', success: ['Vuelve al punto de partida', 'El giro es suave y silencioso', 'La corriente está por debajo del límite del motor'] },
        quiz: [q('Un motor de 1.8° con 1/16 microstepping, ¿cuántos pulsos da por vuelta?', ['200', '400', '3200', '1600'], 2, '200 pasos × 16 micropasos = 3200.')],
      tags: ['stepper', 'microstepping', 'posición']
    }),

    L({
      id: 'r4-5', title: 'Servos RC y servos de bus', min: 15,
      objectives: ['Generar la señal PWM de un servo RC', 'Diferenciar servos RC de servos seriales y elegir alimentación'],
      blocks: [
        p('Un servo RC es un motor DC, una caja reductora, un potenciómetro y una electrónica de control en una sola caja. Tú no controlas el motor: controlas una señal y el servo se encarga de llegar y mantenerse.'),
        diagrama('servo', 'PWM 50 Hz: el ancho del pulso indica el ángulo.'),
        formula('pulso 1000 µs → 0°       1500 µs → 90°       2000 µs → 180°', 'Ángulo = (pulso_µs − 1000) / 1000 · 180° en un servo estándar.'),
        codigo('cpp', `#include <ESP32Servo.h>
Servo s;
void setup() {
  s.attach(13, 500, 2400);   // pin, pulso mínimo y máximo (µs)
}
void loop() {
  s.write(0);   delay(500);
  s.write(90);  delay(500);
  s.write(180); delay(500);
}`, 'ESP32Servo: los límites 500–2400 µs calibran el recorrido real.'),
        tabla(['Característica', 'Servo RC (PWM)', 'Servo de bus (Dynamixel, STS3215)'], [
          ['Señal', 'PWM 50 Hz, 1–2 ms', 'UART half-duplex / RS-485'],
          ['Cableado', '3 hilos (V, GND, señal)', '3 hilos (V, GND, data) en cadena'],
          ['Realimentación', 'No disponible para ti', 'Posición, carga, temperatura, voltaje'],
          ['Dirección', 'Por pin', 'ID configurable (0–253)'],
          ['Precisión', '~1°', '0.29° o mejor'],
          ['Uso típico', 'Juguetes, gimbals', 'Brazos, SO-101, humanoides']
        ]),
        apunte('Bus serial', 'En un bus todos los servos comparten el par de datos y se encadenan. Cada uno tiene un ID y responde solo a su comando, por lo que puedes leer su posición real y detectar si se ha atascado (overload). Es la base de brazos como el SO-101.'),
        aviso('Alimenta los servos con una fuente 5–7.4 V separada del microcontrolador y une los GND. Un servo que pide 1–2 A en un pico no debe alimentarse del pin 5 V de la placa: provoca brownout.'),
      ],
        errors: [
          err('El servo tiembla o se reinicia el ESP32', 'Alimentación compartida sin capacitor bulk', 'Fuente dedicada, 470 µF en paralelo y GND común.'),
          err('El servo no llega a 0° ni a 180°', 'Los pulsos 1000–2000 µs no coinciden con su mecánica', 'Calibra con attach(pin, 500, 2400) o barrido manual.')
        ],
        practice: { task: 'Barrido de 0 a 180° y vuelta. Mide con el bus del servo (STS3215) la diferencia entre posición comandada y real con una carga ligera.', success: ['Recorrido completo sin saltos', 'GND común verificado', 'En el servo de bus lees posición real'] },
        quiz: [q('¿Qué ancho de pulso corresponde a 90° en un servo RC estándar?', ['500 µs', '1000 µs', '1500 µs', '2000 µs'], 2, '1500 µs es el punto medio del rango 1000–2000 µs.')],
      tags: ['servo', 'pwm', 'bus']
    }),

    L({
      id: 'r4-6', title: 'BLDC y control FOC', min: 20, level: 'avanzado',
      objectives: ['Entender por qué el BLDC necesita conmutación electrónica', 'Seguir el flujo de un control FOC: Clarke, Park, PI y SVPWM'],
      blocks: [
        p('Un motor sin escobillas (BLDC/PMSM) mueve los imanes en el rotor y las bobinas en el estator. No hay cepillos que desgastar, pero tampoco conexión directa: hay que conmutar las fases en el momento exacto. Hacerlo bien es lo que se llama FOC.'),
        diagrama('foc', 'Corrientes medidas → coordenadas dq → PI → SVPWM a las tres fases.'),
        tabla(['', 'DC con cepillos', 'Stepper', 'BLDC / PMSM'], [
          ['Conmutación', 'Mecánica (cepillos)', 'Por pulsos de fase', 'Electrónica (ESC/FOC)'],
          ['Par a baja velocidad', 'Bueno', 'Muy bueno', 'Excelente con FOC'],
          ['Velocidad máx.', 'Media', 'Baja', 'Muy alta'],
          ['Eficiencia', 'Media', 'Baja', 'Alta (90–95 %)'],
          ['Realimentación', 'Opcional', 'Normalmente no', 'Encoder / sensor / sensorless']
        ]),
        p('La idea de FOC: medir las corrientes de fase, transformarlas a un sistema giratorio (dq) donde el par es simplemente la componente q y el flujo la d. Allí un PI normal mantiene Iq = deseado y Id = 0. Luego se vuelve a coordenadas de fase con SVPWM.'),
        formula('Clarke: (Ia,Ib,Ic) → (Iα,Iβ)        Park: (Iα,Iβ,θ) → (Id,Iq)        τ ∝ Iq', 'Necesitas conocer el ángulo del rotor: encoder, sensor Hall o estimación sensorless.'),
        codigo('cpp', `#include <SimpleFOC.h>
BLDCMotor motor = BLDCMotor(7);          // 7 pares de polos
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 11, 8);
Encoder encoder = Encoder(2, 3, 500);    // A, B, PPR

void setup() {
  encoder.init(); motor.linkSensor(&encoder);
  driver.voltage_power_supply = 12; driver.init();
  motor.linkDriver(&driver);
  motor.controller = MotionControlType::torque;
  motor.voltage_limit = 6;                // límite de seguridad
  motor.init(); motor.initFOC();
}
void loop() {
  motor.loopFOC();                        // alto frecuencia
  motor.move(0.5);                        // par deseado (normalized)
}`, 'SimpleFOC: la librería más accesible para empezar con FOC.'),
        apunte('Por qué no basta con six-step', 'La conmutación trapezoidal (six-step) es simple pero produce par pulsante y ruido. FOC mantiene el vector de corriente siempre perpendicular al flujo: par constante, menos vibración y control de posición preciso a baja velocidad.'),
        aviso('Un BLDC es trifásico: conecta las tres fases a un driver específico. Nunca lo alimentes directamente ni lo conectes a un driver de motor DC. Empieza con un voltage_limit bajo y aumenta poco a poco.'),
      ],
        errors: [
          err('El motor vibra y no gira al iniciar FOC', 'Secuencia de fases o PPR del encoder incorrectos', 'Comprueba el orden de las fases y calibra el encoders con motor.initFOC().'),
          err('El driver se calienta con el motor parado', 'Id no se mantiene en cero o corner cases de corriente', 'Verifica las resistencias shunt, los offsets de corriente y baja el límite.')
        ],
        practice: { task: 'Con SimpleFOC, haz que el motor mantenga posición frente a una perturbación manual. Registra Iq antes y después.', success: ['El motor vuelve a la posición', 'Iq aumenta al perturbar', 'La corriente se mantiene dentro del límite'] },
        quiz: [q('En el sistema dq de un FOC, ¿qué componente controla el par?', ['Id', 'Iq', 'Iα', 'La temperatura'], 1, 'Con Id = 0, el par es proporcional a Iq.')],
      tags: ['bldc', 'foc', 'avanzado']
    }),

    L({
      id: 'r4-7', title: 'Encoders y odometría de ruedas', min: 16, level: 'intermedio',
      objectives: ['Decodificar señales en cuadratura', 'Convertir pulsos en distancia y velocidad'],
      blocks: [
        p('Un encoder incremental da dos señales cuadradas (A y B) desfasadas 90°. El orden en que cambian dice el sentido; el número de flancos dice cuánto ha girado. Es la realimentación que convierte un motor en un servo.'),
        diagrama('encoder', 'Fases A/B en cuadratura → dirección, cuenta y distancia.'),
        formula('cuenta += ±1 por flanco        distancia = cuenta / (PPR · 4) · π · D', 'PPR = pulsos por vuelta; ×4 porque se cuentan los cuatro flancos (x4 encoding) si A y B cambian.'),
        tabla(['Tipo', 'Salida', 'Ventaja', 'Inconveniente'], [
          ['Incremental óptico', 'A/B (+Z)', 'Alta resolución', 'Pierde posición al apagar'],
          ['Incremental magnético', 'A/B', 'Robusto al polvo', 'Menos resolución'],
          ['Absoluto I²C/SPI', 'Valor numérico', 'No pierde posición', 'Más caro'],
          ['Hall (3 sensores)', '6 estados', 'Barato, para BLDC', 'Resolución baja']
        ]),
        codigo('cpp', `volatile long cuenta = 0;
void IRAM_ATTR encoderA() {
  // solo el flanco de subida de A; B dice el sentido
  cuenta += (digitalRead(ENC_B) == HIGH) ? 1 : -1;
}
void setup() {
  pinMode(ENC_A, INPUT_PULLUP); pinMode(ENC_B, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(ENC_A), encoderA, RISING);
} 
float distancia_m(long c) {
  return (float)c / (PPR * 4.0f) * PI * DIAMETRO_RUEDA_M;
}`, 'Decodificación x4 por interrupción en ESP32 (para alta velocidad usa la periferia PCNT).'),
        formula('v = Δcuenta / (Δt · PPR · 4) · π · D        ω = Δcuenta / (Δt · PPR · 4) · 2π', 'Derivar la cuenta da velocidad; ten cuidado con el ruido: filtra o usa una ventana de tiempo.'),
        apunte('Pulso índice (Z)', 'Algunos encoders añaden una tercera señal que aparece una vez por vuelta. Sirve para referenciar la posición absoluta al arrancar o para sincronizar el origen de un brazo.'),
        aviso('Las interrupciones de encoder son de altísima frecuencia: la ISR debe ser de pocas instrucciones. Si pierdes pulsos a alta velocidad, usa el contador por hardware (PCNT en ESP32) en vez de attachInterrupt.'),
      ],
        errors: [
          err('La cuenta sube aunque el motor esté parado', 'Rebote o ruido eléctrico en las señales A/B', 'Usa INPUT_PULLUP, cables cortos y un filtro RC o PCNT con filtro.'),
          err('La distancia medida diverge con el tiempo', 'PPR o diámetro de rueda mal introducidos', 'Calibra: mide 1 m real y ajusta el factor de conversión.')
        ],
        practice: { task: 'Cuenta 1000 flancos y comprueba cuánto gira la rueda. Calcula el diámetro efectivo a partir de la distancia real recorrida en 5 vueltas.', success: ['La cuenta es estable', 'El diámetro calculado coincide con el medido', 'La ISR es corta'] },
        quiz: [q('Con PPR=500, decodificación x4 y rueda de 0.1 m, ¿cuántos pulsos hay por metro?', ['500 · 4 / (π·0.1) ≈ 6366', '500 / 0.1 = 5000', '2000', '50'], 0, 'Pulsos/vuelta = 2000; vueltas/m = 1/(π·0.1) ≈ 3.18 → ≈ 6366 pulsos/m.')],
      tags: ['encoder', 'odometría', 'realimentación']
    }),

    L({
      id: 'r4-8', title: 'Cajas reductoras, backlash y selección de motor', min: 17, level: 'intermedio',
      objectives: ['Calcular par, velocidad e inercia refleja de una reducción', 'Elegir motor y reductora para una carga concreta'],
      blocks: [
        p('Un motor pequeño gira rápido pero con poco par. Una caja reductora cambia velocidad por par: reduce ω y multiplica τ. Es el mismo principio que una bicicleta con marchas.'),
        formula('ω_salida = ω_motor / N        τ_salida = τ_motor · N · η        J_reflejada = J_carga / (N² · η)', 'N = relación de reducción (ej. 30:1), η = eficiencia (0.6–0.9 según tipo).'),
        tabla(['Tipo', 'Relación típica', 'Eficiencia', 'Backlash', 'Uso'], [
          ['Engranaje recto', '2:1–10:1', '90 %', 'Medio', 'Juguetes, bajo coste'],
          ['Planetaria', '5:1–100:1', '80–90 %', 'Bajo-medio', 'Ruedas, brazos'],
          ['Tornillo sin fin', '10:1–100:1', '40–70 %', 'Alto', 'Autobloqueo'],
          ['Armónica (strain wave)', '50:1–160:1', '70–85 %', 'Casi cero', 'Robótica de precisión']
        ]),
        apunte('Backlash (juego)', 'Es el hueco entre dientes: al cambiar de sentido, el motor gira un poco antes de que salga el eje. En un brazo se traduce en imprecisión y oscilación. Se reduce con engranajes de precisión, precarga o compensando en software (acercarse siempre desde el mismo lado).'),
        p('Ejemplo: rueda de 0.05 m de radio, robot de 3 kg, aceleración deseada 1 m/s². Fuerza = m·a = 3 N; par en la rueda = 3·0.05 = 0.15 N·m. Con una reductora 20:1 de η=0.8, el motor debe dar 0.15/(20·0.8) ≈ 9.4 mN·m. Añade margen ×2 → 19 mN·m.'),
        pasos([
          { title: 'Define la carga', text: 'Masa, radio de rueda o brazo, aceleración y pendiente máxima.' },
          { title: 'Calcula el par', text: 'τ = F·r, incluye rozamiento y un factor de seguridad de 2–3.' },
          { title: 'Elige reducción', text: 'N = τ_necesario / (τ_motor · η). Comprueba que la velocidad resultante sirve.' },
          { title: 'Verifica corriente', text: 'I = τ/Kₜ y compara con la corriente continua del driver y la batería.' },
          { title: 'Comprueba inercia', text: 'J_reflejada cercana a J_motor da mejor respuesta; reductoras grandes empeoran el control.' }
        ]),
        widget('bom'),
        aviso('Un reductor autobloqueante (tornillo sin fin) puede no dejar caer un brazo al cortar energía, pero su eficiencia baja calienta la caja. Un brazo con carga vertical necesita además un freno o un diseño que no dependa solo del motor para sostenerse.'),
      ],
        errors: [
          err('El brazo "salta" al cambiar de dirección', 'Backlash de la caja reductora', 'Compensa en software o usa una reductora armónica/planetaria de mejor calidad.'),
          err('El motor se quema al subir una pendiente', 'Par calculado sin margen ni eficiencia', 'Añade factor 2–3 y divide por η de la caja.')
        ],
        practice: { task: 'Elige motor y reducción para mover 2 kg a 0.4 m/s con ruedas de 6 cm y pendiente del 10 %. Documenta cada número.', success: ['Par con margen', 'Corriente dentro del driver', 'Justificas la relación N'] },
        quiz: [q('Una reductora 10:1 con η=0.8 multiplica el par por:', ['10', '8', '0.8', '12.5'], 1, 'τ_out = τ_in · N · η = τ_in · 10 · 0.8 = 8·τ_in.')],
      tags: ['reductora', 'backlash', 'selección']
    }),

    L({
      id: 'r4-9', title: 'Brownout y protección de la etapa de potencia', min: 15, level: 'intermedio',
      objectives: ['Diagnosticar resets causados por caídas de tensión', 'Diseñar protecciones eléctricas básicas'],
      blocks: [
        p('El fallo más frustrante en robótica: el robot arranca, el motor pide corriente, la tensión cae, el microcontrolador se resetea y todo vuelve a empezar. No es un bug de código, es un brownout.'),
        diagrama('brownout', 'Pico de corriente → caída de V → reset del MCU → bucle infinito.'),
        formula('ΔV = I_pico · (R_batería + R_cableado + R_conector)        Q = C · ΔV', 'Un capacitor de 470 µF puede entregar ~0.47 A durante 1 ms con una caída de 1 V.'),
        diagrama('capacitor', 'El capacitor bulk actúa como colchón ante picos de corriente.'),
        tabla(['Protección', 'Qué hace', 'Dónde'], [
          ['Capacitor bulk 470 µF', 'Entrega picos de corriente', 'En paralelo con Vmotor, junto al driver'],
          ['100 nF cerámico', 'Desacople de alta frecuencia', 'Cada IC, lo más cerca posible'],
          ['Diodo flyback / TVS', 'Absorbe picos inductivos', 'A través de bobinas y líneas'],
          ['Fusible / polyfuse', 'Corta sobrecorriente', 'En serie con la batería'],
          ['Diodo de inversión', 'Evita daños al conectar al revés', 'En serie con la alimentación'],
          ['BOD del MCU', 'Reset controlado bajo umbral', 'Fusible de software (ESP32: CONFIG_BOD)']
        ]),
        codigo('cpp', `// ESP32: detectar la causa del último reset
#include "esp_system.h"
void setup() {
  Serial.begin(115200);
  Serial.printf("Razón de reset: %d\\n", esp_reset_reason());
  // 1=POWERON, 2=EXT, 12=RTC_SW, 9=BROWNOUT, 4=WDT
}`, 'Saber que fue brownout (código 9) evita horas de depuración equivocada.'),
        apunte('Separar alimentaciones', 'La receta robusta: batería → fusible → buck para lógica (3.3/5 V) y rama separada y gruesa para el driver de motor. Unir los GND en un único punto (star ground) cerca de la fuente evita que los picos del motor se cuelen en la lógica.'),
        aviso('Nunca alimentes motores desde el regulador 5 V de una placa de desarrollo: está pensado para la electrónica, no para 2 A. Un cable delgado o un conector JST mal crimpeado añade resistencia y causa brownout.'),
      ],
        errors: [
          err('El microcontrolador se reinicia al acelerar', 'Caída de tensión por corriente de arranque', 'Añade 470 µF junto al driver, cable más grueso y fuente con margen.'),
          err('El regulador huele a quemado tras unos minutos', 'Disipa más potencia de la debida', 'Usa un buck en vez de un LDO si Vin ≫ Vout.')
        ],
        practice: { task: 'Provoca un brownout acelerando bruscamente con un cable fino y observa el reset. Sustituye por cable grueso y añade 470 µF; repite y compara.', success: ['Identificas el código de reset', 'El capacitor reduce la caída', 'El sistema sigue vivo'] },
        quiz: [q('¿Qué solución ataca directamente un brownout en el arranque del motor?', ['Añadir más delay en el código', 'Un capacitor bulk junto al driver y fuente con margen', 'Subir el baud rate', 'Cambiar el lenguaje'], 1, 'El capacitor entrega el pico de corriente localmente y sostiene Vcc.')],
      tags: ['brownout', 'protección', 'fuente']
    })
  ]),

  // ==================== B5: SENSORES Y ESTIMACIÓN DE ESTADO ====================
  M('b5', 'Sensores y estimación de estado', 'Del ruido crudo a una estimación fiable del mundo', [

    L({
      id: 'r5-1', title: 'Sensores básicos, acondicionamiento y calibración', min: 16,
      objectives: ['Adaptar la señal de un sensor al ADC', 'Calibrar offset, ganancia y ruido'],
      blocks: [
        p('Un sensor rara vez da un número limpio. Da una tensión, una corriente o un tren de pulsos que hay que acondicionar (adaptar, filtrar, proteger) y calibrar (convertir a unidades reales).'),
        diagrama('adc', 'Del voltaje analógico al entero que lee tu microcontrolador.'),
        formula('valor = V / Vref · (2ⁿ − 1)        resolución = Vref / 2ⁿ', 'En un ADC de 12 bits con Vref=3.3 V: 4096 niveles, ~0.8 mV por nivel.'),
        widget('divisor'),
        p('Ejemplo: un sensor de distancia analógico da 0.4 V a 10 cm y 2.4 V a 80 cm. La pendiente es (2.4−0.4)/(80−10) = 0.0286 V/cm. Con offset 0.4 V, la distancia es d_cm = (V − 0.4)/0.0286.'),
        codigo('cpp', `// Calibración de dos puntos: crudo -> unidades reales
const float RAW_MIN = 412.0f, RAW_MAX = 2450.0f;  // medidas
const float D_MIN = 10.0f,  D_MAX = 80.0f;        // cm

float leerDistancia_cm() {
  float raw = 0;
  for (int i=0; i<16; i++) raw += analogRead(PIN);  // promedia ruido
  raw /= 16.0f;
  float f = (raw - RAW_MIN) / (RAW_MAX - RAW_MIN);  // 0..1
  return D_MIN + f * (D_MAX - D_MIN);
}`, 'Calibración de dos puntos + promediado: el patrón que reaparece en todos los sensores.'),
        tabla(['Acondicionamiento', 'Cuándo', 'Cómo'], [
          ['Divisor de voltaje', 'Sensor de 5 V a ADC de 3.3 V', 'Dos resistencias'],
          ['Filtro RC', 'Ruido de alta frecuencia', 'R + C a la entrada'],
          ['Pull-up', 'Salidas de colector abierto', 'Resistencia a Vcc'],
          ['Seguidor (op-amp)', 'Sensor de alta impedancia', 'Buffer'],
          ['Protección', 'Cables largos / entornos ruidosos', 'TVS, serie, GND común']
        ]),
        apunte('Calibración en dos pasos', '1) Offset: mide con entrada conocida cero y guarda el valor crudo. 2) Ganancia: mide con una referencia conocida y calcula la pendiente. Guarda ambos en EEPROM o en un archivo de configuración: d = (raw − offset) · escala.'),
        aviso('Nunca superes Vref en un pin ADC. Un sensor de 5 V conectado directo a un ESP32 de 3.3 V puede destruir el pin: usa un divisor o un level shifter.'),
      ],
        errors: [
          err('La lectura salta ±20 unidades', 'Ruido en la cadena analógica', 'Promedia 8–16 muestras, añade un RC de 1 kΩ/100 nF y cable apantallado.'),
          err('La conversión da valores negativos', 'El offset de calibración es mayor que la lectura mínima', 'Recalibra el punto cero con el sensor en su condición de referencia.')
        ],
        practice: { task: 'Calibra un potenciómetro o sensor analógico en dos puntos (0 y 100 %). Escribe offset y escala y verifica un punto intermedio.', success: ['El punto intermedio da el valor esperado', 'Promedias para reducir ruido', 'Guardas los coeficientes'] },
        quiz: [q('En un ADC de 12 bits con Vref 3.3 V, ¿cuánto vale un LSB?', ['~0.8 mV', '3.3 mV', '12 mV', '1 V'], 0, '3.3 V / 4096 ≈ 0.0008 V = 0.8 mV.')],
      tags: ['adc', 'calibración', 'ruido']
    }),

    L({
      id: 'r5-2', title: 'Ultrasonido y ToF láser', min: 15,
      objectives: ['Medir distancia con ultrasonido y con tiempo de vuelo óptico', 'Elegir el sensor según superficie y rango'],
      blocks: [
        p('Ambos miden distancia midiendo tiempo: ultrasonido mide el eco de una onda sonora; ToF (Time of Flight) mide cuánto tarda un pulso de luz en volver. La idea es la misma, los mediums son distintos.'),
        diagrama('tof', 'Cono amplio y barato frente a cono estrecho y preciso.'),
        formula('Ultrasonido: d = 343 m/s · t / 2        ToF: d = c · t / 2  (c ≈ 3·10⁸ m/s)', 'El factor 2 aparece porque el viaje es de ida y vuelta.'),
        tabla(['', 'HC-SR04 (ultrasonido)', 'VL53L0X / VL53L1X (ToF)'], [
          ['Rango', '2–400 cm', '2–200 cm / hasta 4 m'],
          ['Precisión', '~3 mm', '~1 mm'],
          ['Cono', '~30–60°', '~25–35°'],
          ['Superficies blandas', 'Falla (absorbe sonido)', 'Funciona mejor'],
          ['Coste', 'Muy bajo', 'Bajo-medio'],
          ['Interfaz', 'Trigger/Echo (GPIO)', 'I²C']
        ]),
        codigo('cpp', `// HC-SR04 con ESP32: pulso de trigger y eco
digitalWrite(TRIG, LOW); delayMicroseconds(2);
digitalWrite(TRIG, HIGH); delayMicroseconds(10);
digitalWrite(TRIG, LOW);
long us = pulseIn(ECHO, HIGH, 30000UL);   // timeout 30 ms
float d_cm = us * 0.0343f / 2.0f;         // 0.0343 cm/µs`, 'pulseIn con timeout: sin él, un sensor desconectado bloquea tu programa.'),
        apunte('Temperatura y ángulo', 'La velocidad del sonido varía con la temperatura: v ≈ 331 + 0.6·T(°C). En verano, sin compensar, el error puede ser de varios centímetros. Además, una superficie inclinada refleja el eco fuera del sensor: el ToF con cono estrecho aguanta mejor.'),
        aviso('El ultrasonido falla con espuma, tela, alfombras y superficies muy inclinadas; el ToF puede saturarse con luz solar intensa o cristales. Ninguno sustituye a un LIDAR para mapear.'),
      ],
        errors: [
          err('El HC-SR04 devuelve 0 constantemente', 'pulseIn sin timeout o eco demasiado débil', 'Añade timeout y comprueba la superficie y la alimentación 5 V.'),
          err('El VL53L0X da lecturas erráticas al sol', 'Luz ambiental saturando el sensor', 'Usa la cubierta negra del fabricante o reduce el tiempo de integración.')
        ],
        practice: { task: 'Mide la misma distancia con HC-SR04 y VL53L0X sobre madera, tela y cristal. Tabula los errores.', success: ['Mides los tres materiales', 'Explicas las diferencias', 'Usas timeout en pulseIn'] },
        quiz: [q('¿Por qué se divide entre 2 la fórmula del tiempo de vuelo?', ['Porque la luz va al doble de velocidad', 'Porque el pulso hace ida y vuelta', 'Porque el sensor tiene dos emisores', 'Porque hay dos sensores'], 1, 'El tiempo medido incluye ida y vuelta; la distancia es la mitad del recorrido total.')],
      tags: ['distancia', 'tof', 'ultrasonido']
    }),

    L({
      id: 'r5-3', title: 'IMU: acelerómetro, giroscopio y magnetómetro', min: 17,
      objectives: ['Interpretar las señales de una IMU de 9 DoF', 'Obtener inclinación a partir del acelerómetro'],
      blocks: [
        p('Una IMU combina tres sensores. El acelerómetro mide aceleración (incluida la gravedad), el giroscopio mide velocidad angular y el magnetómetro mide el campo magnético. Juntos dan orientación, pero cada uno tiene sus trampas.'),
        diagrama('imu', 'Los tres sensores de una IMU y qué aportan.'),
        tabla(['Sensor', 'Mide', 'Bueno para', 'Problema'], [
          ['Acelerómetro', 'm/s² (con gravedad)', 'Inclinación estática', 'Ruido y aceleración lineal'],
          ['Giroscopio', 'rad/s', 'Cambios rápidos', 'Deriva con el tiempo'],
          ['Magnetómetro', 'µT', 'Rumbo (yaw)', 'Interferencias metálicas']
        ]),
        formula('roll = atan2(a_y, a_z)        pitch = atan2(−a_x, sqrt(a_y² + a_z²))', 'En reposo, el vector de aceleración apunta a gravedad: de ahí sale la inclinación.'),
        codigo('cpp', `#include <Wire.h>
#include <MPU6050.h>
MPU6050 mpu;
void setup() {
  Wire.begin(); mpu.initialize();
  mpu.setFullScaleGyroRange(MPU6050_GYRO_FS_500);  // ±500 °/s
  mpu.setFullScaleAccelRange(MPU6050_ACCEL_FS_2);  // ±2 g
}
void loop() {
  int16_t ax, ay, az, gx, gy, gz;
  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
  float g = 9.81f / 16384.0f;        // ±2g -> 16384 LSB/g
  float ax_ms2 = ax * g;
  float roll = atan2(ay, az) * 180.0 / PI;
}`, 'Los factores de escala salen del rango elegido en el datasheet.'),
        apunte('Montaje y ejes', 'Anota la orientación física de la IMU respecto al robot. Un cambio de 90° en el montaje se compensa en software permutando y cambiando el signo de los ejes. Hazlo una vez y documentalo: es una fuente clásica de horas perdidas.'),
        aviso('La IMU odia las vibraciones: colócala lejos de motores, sobre espuma o con aislamiento mecánico, y cableada con hilos cortos. Un motor desbalanceado puede arruinar la lectura del acelerómetro.'),
      ],
        errors: [
          err('La inclinación cambia al acelerar', 'El acelerómetro mide también la aceleración lineal', 'Usa el filtro complementario (r5-5) para dar más peso al giroscopio en dinámica.'),
          err('El rumbo salta cerca de un motor', 'Interferencia magnética en el magnetómetro', 'Aleja el magnetómetro de corrientes y calibra el hard-iron/soft-iron.')
        ],
        practice: { task: 'Lee la IMU en reposo y inclínala 30°. Compara el roll del acelerómetro con el valor real.', success: ['Obtienes ~30°', 'Conoces la escala de los raw', 'Identificas el eje correcto'] },
        quiz: [q('¿Qué mide exactamente el acelerómetro cuando la IMU está en reposo?', ['Cero', 'Solo gravedad (1 g)', 'Velocidad angular', 'El norte'], 1, 'En reposo mide la aceleración de la gravedad, unos 9.81 m/s².')],
      tags: ['imu', 'orientación', 'sensores']
    }),

    L({
      id: 'r5-4', title: 'Deriva del giroscopio y su calibración', min: 14,
      objectives: ['Modelar la deriva como bias integrado', 'Medir y compensar el bias'],
      blocks: [
        p('Si integras la velocidad angular para obtener un ángulo, cualquier pequeño error se acumula. Un giroscopio que marca 0.5 °/s estando quieto te da 30° de error en un minuto. A eso se llama deriva.'),
        formula('θ(t) = θ₀ + ∫ (ω_real + b + n) dt = θ₀ + ω_real·t + b·t + ∫n dt', 'b es el bias (constante) y n el ruido; el término b·t crece linealmente.'),
        diagrama('frencuencia', 'El bias aparece como componente de baja frecuencia: crece al integrar.'),
        codigo('python', `import numpy as np

# Calibrar bias: promediar N muestras en reposo
gyro = np.array([0.48, 0.52, 0.50, 0.49, 0.51])  # °/s en reposo
bias = gyro.mean()   # 0.50 °/s

# Integrar 60 s con y sin corregir
w = np.zeros(600) + 0.50        # giroscopio quieto con bias
ang_sin = np.cumsum(w) * 0.1
ang_con = np.cumsum(w - bias) * 0.1
print(ang_sin[-1], ang_con[-1])  # 30.0° vs ~0.0°`),
        tabla(['Error', 'Comportamiento', 'Mitigación'], [
          ['Bias (offset)', 'Deriva lineal del ángulo', 'Calibrar en reposo y restarlo'],
          ['Random walk', 'Deriva como raíz del tiempo', 'Filtrado y fusión'],
          ['Dependencia T', 'El bias cambia al calentar', 'Calibrar a temperatura de trabajo'],
          ['Escala', 'Error proporcional a ω', 'Calibración con mesa giratoria']
        ]),
        apunte('Calibración práctica', 'Deja la IMU quieta 5–10 s y promedia: ese es tu bias. Guarda el valor y réstalo en cada lectura. Si el robot cambia de temperatura, repite. Muchas librerías lo hacen automáticamente al arrancar: no muevas el robot durante el primer segundo.'),
        nota('La deriva no se elimina solo con calibración perfecta: el ruido y los cambios de temperatura lo reintroducen. Por eso se fusiona con el acelerómetro (r5-5) o con Kalman (r5-6).'),
      ],
        errors: [
          err('El ángulo "se va" aunque el robot no se mueve', 'Bias del giroscopio sin restar', 'Calibra en reposo y resta el bias antes de integrar.'),
          err('La deriva cambia entre la clase y la tarde', 'Temperatura distinta', 'Calienta la IMU antes de calibrar o recalibra en cada arranque.')
        ],
        practice: { task: 'Integra el giroscopio 60 s en reposo, primero sin corregir y luego restando el bias medido. Compara el error final.', success: ['Ves la deriva lineal', 'El bias medido reduce el error', 'Sabes por qué no basta para siempre'] },
        quiz: [q('Un giroscopio con bias de 0.1 °/s, ¿cuánto deriva en 100 s?', ['0.1°', '1°', '10°', '100°'], 2, 'El error crece como b·t = 0.1 · 100 = 10°.')],
      tags: ['giroscopio', 'deriva', 'calibración']
    }),

    L({
      id: 'r5-5', title: 'Filtro complementario', min: 14,
      objectives: ['Combinar giroscopio y acelerómetro con pesos complementarios', 'Elegir α según la constante de tiempo'],
      blocks: [
        p('El giroscopio es excelente a corto plazo pero deriva; el acelerómetro es estable a largo plazo pero ruidoso y se engaña con aceleraciones. El filtro complementario les da la razón a cada uno en su zona: uno se encarga de lo rápido, el otro corrige lo lento.'),
        diagrama('complementario', 'α para el giroscopio, (1−α) para el acelerómetro.'),
        formula('θ[k] = α · (θ[k−1] + ω·dt) + (1 − α) · θ_acel        α ≈ τ/(τ + dt)', 'Con dt=0.01 s y τ=0.5 s, α ≈ 0.98: el 98 % del cambio viene del giroscopio.'),
        codigo('cpp', `float angulo = 0.0f;
const float dt = 0.01f;      // 100 Hz
const float alpha = 0.98f;   // tau ~0.5 s

void update(float gyro_dps, float roll_acc) {
  angulo += gyro_dps * dt;                       // predice
  angulo = alpha * angulo + (1-alpha) * roll_acc; // corrige
}`, 'Diez líneas que resuelven el 90 % de los problemas de inclinación.'),
        tabla(['α', 'τ (dt=10 ms)', 'Comportamiento'], [
          ['0.90', '0.09 s', 'Sigue muy bien, pero ruidoso'],
          ['0.98', '0.49 s', 'Equilibrio típico'],
          ['0.995', '2 s', 'Muy suave, tarda en corregir deriva']
        ]),
        apunte('Por qué se llama complementario', 'Los pesos suman 1 y los filtros son complementarios en frecuencia: el giroscopio aporta altas frecuencias (movimiento rápido) y el acelerómetro pasa frecuencias bajas (referencia a largo plazo). Es un filtro de Kalman simplificado con ganancia fija.'),
        aviso('Si el robot acelera o gira bruscamente, el acelerómetro deja de medir solo gravedad: el filtro puede dar un tirón. Baja (1−α) en aplicaciones muy dinámicas o pasa a Kalman con detección de aceleración lineal.'),
      ],
        errors: [
          err('El ángulo tiembla mucho', 'α demasiado bajo (mucho peso del acelerómetro)', 'Sube α a 0.98–0.99.'),
          err('El ángulo tarda segundos en corregirse', 'α demasiado alto', 'Baja α o aumenta el peso del acelerómetro.')
        ],
        practice: { task: 'Implementa el filtro a 100 Hz. Inclina el sensor y suéltalo: observa que vuelve al ángulo correcto sin la deriva del giroscopio solo.', success: ['Sin deriva a largo plazo', 'Respuesta rápida al movimiento', 'Sabes explicar α'] },
        quiz: [q('En el filtro complementario, ¿qué sensor corrige la deriva a largo plazo?', ['El giroscopio', 'El acelerómetro', 'El magnetómetro', 'Ninguno'], 1, 'El acelerómetro no deriva (mide gravedad) y fija el valor absoluto.')],
      tags: ['filtro', 'imu', 'orientación']
    }),

    L({
      id: 'r5-6', title: 'Filtro de Kalman', min: 20, level: 'avanzado',
      objectives: ['Seguir el ciclo predecir–medir–corregir', 'Sintonizar Q y R en un filtro 1D'],
      blocks: [
        p('Kalman es un filtro óptimo para sistemas lineales con ruido gaussiano. Mantiene una estimación y su incertidumbre, y en cada paso decide cuánto fiarse del modelo frente a la medición. Es el filtro complementario con ganancia calculada automáticamente.'),
        diagrama('kalman', 'Predicción, medición, ganancia de Kalman y corrección.'),
        formula('Predecir:  x̂⁻ = F·x̂        P⁻ = F·P·Fᵀ + Q\nActualizar:  K = P⁻·Hᵀ/(H·P⁻·Hᵀ + R)\n            x̂ = x̂⁻ + K·(z − H·x̂⁻)        P = (I − K·H)·P⁻', 'Q = incertidumbre del proceso (modelo), R = incertidumbre del sensor (medición).'),
        p('Intuición: si R es pequeño (sensor fiable), K crece y te crees más la medición. Si Q es pequeño (modelo fiable), K baja y te crees más la predicción. La magia está en que K se calcula solo a partir de Q y R.'),
        codigo('python', `class Kalman1D:
    def __init__(self, q=1e-4, r=1e-2):
        self.x, self.P = 0.0, 1.0
        self.q, self.r = q, r
    def step(self, z):
        # predecir (modelo: x se mantiene)
        self.P += self.q
        # actualizar con la medición z
        K = self.P / (self.P + self.r)
        self.x += K * (z - self.x)
        self.P *= (1 - K)
        return self.x

kf = Kalman1D(q=1e-5, r=0.05)
medidas = [1.0, 1.1, 0.9, 1.05, 0.98]
print([round(kf.step(z), 3) for z in medidas])`),
        tabla(['Ajuste', 'Efecto', 'Síntoma'], [
          ['Q alto', 'Confías poco en el modelo', 'Sigue mucho la medición, ruidoso'],
          ['Q bajo', 'Confías mucho en el modelo', 'Tarda en reaccionar'],
          ['R alto', 'Sensor poco fiable', 'Suaviza demasiado, se retrasa'],
          ['R bajo', 'Sensor muy fiable', 'Salta con el ruido']
        ]),
        apunte('De 1D a la IMU', 'Para orientación 3D se usa un EKF (Extended Kalman Filter) con estado [q, bias_gyro] y se linealiza con Jacobianos. Robot Localization en ROS 2 ya lo implementa: tú solo das las covarianzas de cada sensor.'),
        aviso('Kalman no arregla un sensor mal calibrado ni un modelo equivocado: si Q y R no reflejan la realidad, el filtro se reirá de ti con una estimación preciosa y sistemáticamente errónea.'),
      ],
        errors: [
          err('La estimación va muy retrasada', 'R demasiado alto o Q demasiado bajo', 'Baja R (confía más en el sensor) o sube Q.'),
          err('La salida es casi igual al sensor crudo', 'R demasiado bajo', 'Aumenta R para que el filtro suavice.')
        ],
        practice: { task: 'Genera 100 mediciones con ruido de una constante, filtra con Q=1e-5 y R=0.05, y compara el error medio con la media móvil.', success: ['El error RMS baja', 'Entiendes qué hace K', 'Sabes ajustar Q y R'] },
        quiz: [q('En Kalman, si el sensor es muy ruidoso, ¿qué debe pasar con R?', ['Bajar', 'Subir', 'Poner a cero', 'No importa'], 1, 'R alto reduce la ganancia K: el filtro se fía menos de la medición.')],
      tags: ['kalman', 'estimación', 'avanzado']
    }),

    L({
      id: 'r5-7', title: 'Fusión de sensores', min: 15, level: 'avanzado',
      objectives: ['Combinar sensores complementarios en un estado común', 'Elegir el nivel de fusión adecuado'],
      blocks: [
        p('Ningún sensor lo hace todo bien. La fusión combina varias fuentes para obtener una estimación mejor que cualquiera de ellas por separado: IMU + encoder + GPS + visión es el equipo típico de un robot móvil.'),
        diagrama('estado', 'Estado x, dinámica ẋ = Ax+Bu, medición y = Cx y observador.'),
        tabla(['Sensor', 'Aporta', 'Falla en'], [
          ['Encoder', 'Desplazamiento preciso a corto plazo', 'Deslizamiento de ruedas'],
          ['IMU', 'Orientación rápida', 'Deriva'],
          ['GPS', 'Posición global', 'Interiores, baja tasa (1–10 Hz)'],
          ['Visión / LIDAR', 'Relación con el entorno', 'Luz, oclusión, coste'],
          ['ToF / ultrasonido', 'Obstáculos cercanos', 'Rango corto']
        ]),
        formula('x = [p, v, q, b_g, b_a]        ẋ = f(x, u)        z_i = h_i(x) + n_i', 'Cada sensor i observa una parte del estado con su propio ruido n_i.'),
        lista(['Fusión a nivel de datos: combinar crudos (poco común, rígido).', 'Fusión a nivel de características/estado: cada sensor produce una estimación y un EKF las mezcla (lo habitual).', 'Fusión a nivel de decisión: cada sensor vota y se decide (clasificación, detección).'], true),
        codigo('cpp', `// Robot Localization (ROS 2): configuración típica de EKF
ekf_filter_node:
  ros__parameters:
    frequency: 50.0
    sensor_timeout: 0.1
    odom0: /wheel/odometry
    odom0_config: [true,true,false, false,false,false,
                   false,false,false, false,false,false, ...]
    imu0: /imu/data
    imu0_config: [false,false,false, true,true,true,
                  false,false,false, true,true,true, ...]
    odom1: /gps/fix  # pose global, con covarianza alta en z
    odom1_config: [true,true,false, ...]`, 'Cada sensor entra con un vector de configuración y sus covarianzas.'),
        apunte('Covarianzas = confianza', 'La fusión no es magia: el EKF pondera según la covarianza que le das. Si pones una covarianza minúscula a un GPS que salta 2 m, arruinarás la odometría. Mide el ruido real de cada sensor antes de escribir esos números.'),
        aviso('Todos los sensores deben estar en el mismo momento y sistema de coordenadas. Sin sincronización temporal y sin tf2 correcto (bloque b7), la fusión mezcla manzanas con peras.'),
      ],
        errors: [
          err('La posición fusionada salta', 'Covarianza de un sensor demasiado baja', 'Mide su ruido y aumenta R hasta que el salto desaparezca.'),
          err('La estimación se queda ciega al girar', 'IMU y odometría en marcos distintos o desincronizados', 'Revisa tf2 y las marcas de tiempo.')
        ],
        practice: { task: 'Fusiona odometría de ruedas con IMU en Robot Localization y compará la trayectoria con y sin IMU en un giro brusco.', success: ['La trayectoria es más estable', 'Entiendes el papel de las covarianzas', 'tf2 está correcto'] },
        quiz: [q('En un EKF, ¿qué determina cuánto pesa cada sensor?', ['El orden en el YAML', 'Su covarianza', 'El nombre del topic', 'La velocidad del CPU'], 1, 'Menor covarianza = mayor confianza = mayor peso en la corrección.')],
      tags: ['fusión', 'ekf', 'estimación']
    }),

    L({
      id: 'r5-8', title: 'Odometría de un robot diferencial y su error', min: 16, level: 'intermedio',
      objectives: ['Integrar el modelo de movimiento de un robot de dos ruedas', 'Identificar y limitar las fuentes de error'],
      blocks: [
        p('La odometría estima dónde está el robot integrando cuánto han girado sus ruedas. Es barata y suave a corto plazo, pero acumula error para siempre: es la razón de existir del SLAM.'),
        diagrama('encoder', 'Las cuentas de los encoders alimentan el modelo de movimiento.'),
        formula('Δs_d = 2π·r·Δn_d / N,  Δs_i = 2π·r·Δn_i / N\nΔθ = (Δs_d − Δs_i) / L,   Δs = (Δs_d + Δs_i)/2\nx += Δs·cos(θ+Δθ/2),  y += Δs·sin(θ+Δθ/2),  θ += Δθ', 'r = radio de rueda, L = distancia entre ruedas, N = pulsos por vuelta.'),
        codigo('cpp', `void actualizarOdom(double dl, double dr, double L) {
  double dc = (dr + dl) / 2.0;      // avance lineal
  double dth = (dr - dl) / L;       // giro
  x += dc * cos(th + dth/2.0);      // punto medio: más preciso
  y += dc * sin(th + dth/2.0);
  th += dth;
  // publicar nav_msgs/Odometry con covarianza creciente
}`, 'Usar el ángulo medio en vez del ángulo final reduce el error de integración.'),
        tabla(['Fuente de error', 'Efecto', 'Mitigación'], [
          ['Ruedas de distinto radio', 'Curvatura falsa', 'Calibra cada rueda por separado'],
          ['Deslizamiento', 'Subestima o sobreestima Δs', 'Aceleración suave, neumáticos con agarre'],
          ['Cuantización del encoder', 'Error acumulado pequeño', 'Mayor PPR, x4 decoding'],
          ['Deriva del giro', 'θ incorrecto → todo se tuerce', 'Fusión con IMU'],
          ['Baja tasa de muestreo', 'Pierde giros rápidos', '> 50 Hz']
        ]),
        apunte('Covarianza creciente', 'En ROS 2 el mensaje Odometry lleva una matriz de covarianza. La práctica correcta es hacerla crecer con el tiempo desde la última corrección absoluta (GPS, SLAM): el robot "sabe" que está menos seguro cuanto más se ha movido a ciegas.'),
        aviso('Nunca confíes en la odometría para navegar en una casa con alfombras o suelo resbaladizo durante mucho tiempo: un giro de 5° de error se convierte en metros de desviación. Necesitas SLAM o marcadores.'),
      ],
        errors: [
          err('El robot siempre gira un poco hacia un lado', 'Ruedas desiguales o L mal medido', 'Calibra L y los radios con una prueba de giro in situ.'),
          err('La trayectoria cerrada no cierra', 'Error de odometría acumulado', 'Es esperado: usa loop closure (SLAM).')
        ],
        practice: { task: 'Haz un cuadrado de 1 m con odometría y mide dónde acabas. Ajusta radio de rueda y L hasta reducir el error.', success: ['Cierras el cuadrado con < 10 cm de error', 'Ajustaste ambos parámetros', 'Explicas por qué nunca será perfecto'] },
        quiz: [q('¿Por qué la odometría necesita SLAM o GPS?', ['Porque es muy lenta', 'Porque acumula error ilimitadamente', 'Porque no funciona con motores DC', 'Porque consume mucha CPU'], 1, 'Es estimación relativa: integra errores pequeños que crecen sin corrección absoluta.')],
      tags: ['odometría', 'diferencial', 'error']
    }),

    L({
      id: 'r5-9', title: 'LIDAR y nubes de puntos', min: 16, level: 'intermedio',
      objectives: ['Entender el principio de un LIDAR 2D', 'Procesar una nube de puntos básica'],
      blocks: [
        p('Un LIDAR emite un pulso láser y mide el tiempo que tarda el reflejo. Repitiendo miles de veces por segundo mientras gira, obtiene un anillo de distancias: un mapa 2D del entorno. Es el sensor rey del SLAM y la navegación.'),
        diagrama('lidar', 'Pulso, reflejo, tiempo de vuelo y nube 2D.'),
        formula('d = c · Δt / 2        x = d·cos(φ),  y = d·sin(φ)', 'φ es el ángulo del azimuth; el resultado es una nube de puntos en el plano.'),
        tabla(['', 'LIDAR 2D (RPLidar)', 'LIDAR 3D (Livox, Ouster)'], [
          ['Salida', 'LaserScan (360°)',
            'PointCloud2 (x,y,z)'],
          ['Canales', '1', '10–128'],
          ['Coste', 'Bajo', 'Alto'],
          ['Uso', 'SLAM 2D, Nav2', 'SLAM 3D, percepción']
        ]),
        codigo('python', `import numpy as np
# Supón un LaserScan con 360 rangos y resolución de 1°
ranges = np.array(scan.ranges)
angles = np.deg2rad(np.arange(len(ranges)))
mask = np.isfinite(ranges) & (ranges < 8.0)   # descarta infinitos
pts = np.column_stack([ranges[mask]*np.cos(angles[mask]),
                       ranges[mask]*np.sin(angles[mask])])
print(f"{len(pts)} puntos válidos")`),
        diagrama('nube', 'Voxel grid, normales, segmentación de suelo e ICP.'),
        apunte('Primeros pasos con la nube', 'Antes de usar librerías pesadas: filtra valores infinitos, reduce densidad con un voxel grid, estima normales y separa el suelo (por altura z). Con eso ya puedes detectar obstáculos.'),
        aviso('Clase 1/1M: nunca mires directamente al emisor láser ni lo apuntes a los ojos de personas. Respeta la potencia y usa gafas si trabajas con LIDARs abiertos de alta potencia.'),
      ],
        errors: [
          err('El scan sale con huecos o infinitos', 'Rayos que no vuelven (superficies negras o cristales)', 'Filtra no finitos y aumenta el tiempo de integración del sensor.'),
          err('El mapa se desalinea al girar', 'Sincronización entre LIDAR y odometría', 'Sella los datos con timestamp y usa tf2.')
        ],
        practice: { task: 'Visualiza un LaserScan en RViz, filtra los rangos > 5 m y cuenta los puntos válidos en un semicírculo.', success: ['Ves el scan correctamente', 'Filtras infinitos', 'Obtienes la cuenta esperada'] },
        quiz: [q('En un LIDAR, ¿de dónde sale el factor 2 en d = c·t/2?', ['De dos emisores', 'Del viaje de ida y vuelta', 'De dos reflexiones', 'De la resolución'], 1, 'El pulso va hasta el objeto y vuelve: la distancia es la mitad del tiempo total.')],
      tags: ['lidar', 'pointcloud', 'slam']
    })
  ]),

  // ==================== B6: FABRICACIÓN, CAD Y MECÁNICA ====================
  M('b6', 'Fabricación, CAD y mecánica', 'Del croquis parametrizado al brazo calibrado', [

    L({
      id: 'r6-1', title: 'CAD paramétrico', min: 14,
      objectives: ['Pensar en parámetros y relaciones en vez de formas fijas', 'Elegir un modelo de CAD adecuado'],
      blocks: [
        p('En CAD paramétrico no dibujas una línea: defines una geometría gobernada por cotas y reglas. Si cambias el diámetro del motor de 20 a 24 mm, todo lo que depende de él se actualiza solo. Es la diferencia entre dibujar y diseñar.'),
        diagrama('cad', 'Croquis → operaciones → ensamblaje → planos/DFM.'),
        tabla(['Herramienta', 'Tipo', 'Ideal para'], [
          ['Fusion 360', 'Paramétrico + malla', 'Robótica, versionado en la nube'],
          ['Onshape', 'Paramétrico en navegador', 'Colaboración, sin instalar'],
          ['SolidWorks', 'Paramétrico', 'Industria'],
          ['FreeCAD', 'Paramétrico, open source', 'Aprender sin coste'],
          ['OpenSCAD', 'Por código', 'Piezas programables, trivial cambiar cotas']
        ]),
        codigo('scad', `// OpenSCAD: todo son parámetros
motor_d = 24;       // diámetro del motor
holgura = 0.3;      // juego para impresión FDM
altura  = 10;

difference() {
  cylinder(h=altura, r=motor_d/2 + 3);
  cylinder(h=altura+2, r=motor_d/2 + holgura);
}
// Cambia motor_d a 28 y todo se recalcula`, 'Un soporte paramétrico en 8 líneas.'),
        apunte('Parámetros maestros', 'Crea una tabla o un archivo con las cotas críticas (diámetro del eje, paso de tornillo, espesor de chapa) y referencia todo a ellas. El día que cambies de servo, cambias un número, no 40.'),
        pasos([
          { title: 'Define el requisito', text: 'Qué debe sujetar, qué carga soporta y qué interfaz tiene.' },
          { title: 'Croquiza con restricciones', text: 'Cotas, horizontalidad, concentricidad.' },
          { title: 'Operaciones simples', text: 'Extruir, recortar, taladrar; evita geometrías frágiles.' },
          { title: 'Valida', text: 'Masa, interferencias y espesores mínimos.' },
          { title: 'Exporta', text: 'STL/3MF para imprimir, STEP para enviar a un taller.' }
        ]),
        nota('STEP conserva geometría y es intercambiable entre CAD; STL solo es una malla de triángulos. Para fabricación mecánica, STEP; para impresión 3D, STL/3MF.'),
      ],
        errors: [err('Al cambiar una cota se rompe todo el modelo', 'Croquis sin restricciones o referencias a caras inestables', 'Restringe completamente el croquis y referencia planos de datos, no caras arbitrarias.')],
        practice: { task: 'Modela un soporte paramétrico para un motor con variable motor_d. Genera versiones para 20, 24 y 28 mm.', success: ['Un solo cambio regenera las tres', 'El croquis está totalmente restringido', 'Exportas STEP y STL'] },
        quiz: [q('¿Qué formato conviene enviar a un taller mecánico?', ['STL', 'STEP', 'PNG', 'JPG'], 1, 'STEP conserva la geometría exacta y es el estándar de intercambio CAD.')],
      tags: ['cad', 'paramétrico', 'diseño']
    }),

    L({
      id: 'r6-2', title: 'Croquis y restricciones', min: 14,
      objectives: ['Restringir completamente un croquis', 'Usar cotas y relaciones geométricas'],
      blocks: [
        p('Un croquis sin restricciones es un dibujo blando: puedes arrastrar sus puntos y deformarlo. Restringirlo es fijar sus grados de libertad con reglas (coincidencia, paralelismo, simetría) y cotas.'),
        tabla(['Restricción', 'Qué fija', 'Ejemplo'], [
          ['Coincidencia', 'Dos puntos se tocan', 'Extremo de línea en el origen'],
          ['Horizontal / vertical', 'Dirección', 'Base siempre horizontal'],
          ['Paralelo / perpendicular', 'Relación entre líneas', 'Paredes a 90°'],
          ['Concentricidad', 'Centros iguales', 'Taladro centrado en el cilindro'],
          ['Simetría', 'Espejo', 'Dos taladros simétricos'],
          ['Cota lineal / angular', 'Distancia o ángulo', '40 mm, 30°']
        ]),
        formula('grados de libertad = 2 · puntos − restricciones', 'Un rectángulo tiene 8 grados de libertad (4 puntos × 2); con 4 coincidencias + 2 horizontales/verticales + ancho + alto queda totalmente definido.'),
        pasos([
          { title: 'Ancla', text: 'Fija un punto o una arista al origen.' },
          { title: 'Relaciona', text: 'Añade coincidencia, horizontal, vertical, paralelo.' },
          { title: 'Cota', text: 'Añade las dimensiones reales con nombres significativos.' },
          { title: 'Comprueba', text: 'El software debe decir "fully constrained".' },
          { title: 'Prueba', text: 'Arrastra un punto: si no se mueve, está bien.' }
        ]),
        codigo('scad', `// En OpenSCAD la "restricción" es la propia ecuación
ancho = 40; alto = 25; radio = ancho/2;
translate([-ancho/2, -alto/2, 0])
  square([ancho, alto]);
// La simetría está garantizada por -ancho/2`, 'En CAD por código, las cotas son literales y no hay grados de libertad sueltos.'),
        apunte('Cotas como nombre, no como número', 'En Fusion/Onshape puedes nombrar una cota "diametro_eje". Las ecuaciones posteriores usan ese nombre: cambias el valor en un sitio y todo sigue. Es la base del diseño paramétrico real.'),
        aviso('Un croques sin cerrar (un hueco minúsculo) hace que extruir falle o produzca una superficie en vez de un sólido. Usa la herramienta de comprobar perimeter/contorno cerrado.'),
      ],
        errors: [err('El mensaje dice "under-constrained"', 'Faltan restricciones', 'Añade relaciones hasta que los grados de libertad sean cero.')],
        practice: { task: 'Dibuja una placa de 60×40 con cuatro taladros de 4 mm a 5 mm de los bordes. Deja el croquis fully constrained.', success: ['Dice fully constrained', 'Los taladros son simétricos', 'Cambias 60 por 80 y todo se mueve bien'] },
        quiz: [q('¿Qué significa que un croquis esté "fully constrained"?', ['Que está cerrado', 'Que no tiene grados de libertad', 'Que es bonito', 'Que tiene muchas cotas'], 1, 'Todos sus puntos tienen posición determinada por reglas y cotas.')],
      tags: ['cad', 'croquis', 'restricciones']
    }),

    L({
      id: 'r6-3', title: 'Ensamblajes y cotas entre piezas', min: 14,
      objectives: ['Posicionar piezas con restricciones de ensamblaje', 'Detectar interferencias antes de fabricar'],
      blocks: [
        p('Un ensamblaje coloca varias piezas usando relaciones (caras coincidentes, ejes concéntricos, distancias). No es pegarlas en su sitio: es declarar cómo se acoplan, para que al mover una se muevan las demás.'),
        pasos([
          { title: 'Fija la pieza base', text: 'Es el marco de referencia del ensamblaje.' },
          { title: 'Añade la primera junta', text: 'Coincidencia de caras o eje de un taladro con un eje.' },
          { title: 'Repite con criterio', text: 'Restringe cada pieza respecto a las anteriores o al datum.' },
          { title: 'Comprueba movimiento', text: 'Simula el giro del eje: ¿hay choques?' },
          { title: 'Analiza interferencias', text: 'La herramienta de clash detection te ahorra una impresión fallida.' }
        ]),
        tabla(['Junta', 'Uso típico', 'Grados que quita'], [
          ['Coincidente (mate)', 'Caras planas juntas', '3'],
          ['Concéntrico', 'Ejes alineados', '2'],
          ['Distancia', 'Separación controlada', '1'],
          ['Ángulo', 'Inclinación', '1'],
          ['Insert (hole/peg)', 'Tornillo en taladro', 'Varios a la vez']
        ]),
        apunte('Diseño "top-down" vs "bottom-up"', 'Bottom-up: diseñas piezas y las juntas. Top-down: defines el esqueleto (cotas maestras) y las piezas heredan de él. En robótica, top-down brilla: el bastidor y los soportes comparten las mismas cotas de motor y eje.'),
        codigo('scad', `// Ensamblaje conceptual: soporte + eje con juego
eje_d = 8; juego = 0.2;
module soporte() {
  difference() {
    cube([30, 20, 10]);
    translate([15,10,-1]) cylinder(h=12, r=eje_d/2 + juego);
  }
}
module eje() {
  translate([15,10,0]) cylinder(h=20, r=eje_d/2);
}
soporte(); eje();`, 'La relationships entre piezas son las ecuaciones compartidas (eje_d, juego).'),
        aviso('Un ensamblaje con juntas redundantes (dos piezas forzadas a la misma posición de dos maneras distintas) genera errores. Usa una junta por grado de libertad que quieras quitar.'),
      ],
        errors: [err('El ensamblaje se mueve de forma rara', 'Juntas insuficientes o redundantes', 'Elimina redundancias y añade juntas hasta fijar los grados deseados.')],
        practice: { task: 'Ensambla un motor, una rueda y un soporte con juntas paramétricas. Simula el giro y verifica que no hay colisiones.', success: ['Sin interferencias', 'Las cotas son compartidas', 'Puedes cambiar el motor y se actualiza'] },
        quiz: [q('¿Qué herramienta detecta choques entre piezas antes de fabricar?', ['Clash / interference detection', 'Renderizado', 'Exportar STL', 'Medir masa'], 0, 'La detección de interferencias muestra dónde dos sólidos se solapan.')],
      tags: ['ensamblaje', 'cad', 'interferencias']
    }),

    L({
      id: 'r6-4', title: 'Diseño para impresión 3D (DFM)', min: 16,
      objectives: ['Diseñar piezas imprimibles en FDM', 'Evitar fallos típicos de la impresión'],
      blocks: [
        p('Imprimir en 3D por deposición (FDM) no es como tallar: el material se deposita en capas y necesita apoyo, adherencia y ángulos razonables. Diseñar pensando en el proceso evita piezas que se deforman, se desprenden o no caben.'),
        diagrama('impresion', 'Modelo → slicer → impresora → medir e iterar.'),
        tabla(['Regla', 'Valor típico FDM', 'Por qué'], [
          ['Espesor de pared', '≥ 3·nozzle (1.2 mm con 0.4)', 'Resistencia'],
          ['Taladros verticales', 'Hazlos ligeramente mayores', 'El plástico se encoge'],
          ['Voladizos', '< 45°', 'Más allá necesita soportes'],
          ['Puentes', '< 20–30 mm', 'El filamento se cae'],
          ['Base en cama', 'Gran área y nivelada', 'Adherencia'],
          ['Orientación', 'Capas a favor de la carga', 'Evita delaminación']
        ]),
        apunte('Anisotropía', 'Una pieza impresa es más débil entre capas (eje Z) que dentro de una capa (XY). Si un soporte va a recibir carga, orienta las capas para que la fuerza no separe capas, o usa más relleno y paredes.'),
        codigo('scad', `// Taladros "sobredimensionados" para ajuste tras imprimir
eje = 8.0;
juego = 0.35;             // 0.2–0.4 mm típico en FDM
taladro = eje + juego;
difference() { cube([25,25,10]); cylinder(h=12, r=taladro/2); }`),
        aviso('Las piezas grandes y planas se deforman (warping) sobre todo en ABS: esquinas que se levantan. Usa PLA para empezar, cama caliente, brim y una caja cerrada si imprimes ABS.'),
        lista(['Usa 3–4 paredes (perímetros) antes que mucho relleno.', 'Relleno 15–25 % suele bastar; 100 % solo para piezas de carga.', 'Añade chaflán en la base para reducir el efecto del borde.', 'Deja 0.2–0.4 mm de juego en los ajustes deslizantes.'], true),
      ],
        errors: [
          err('La pieza se despegó de la cama', 'Mala adherencia o cama desnivelada', 'Nivela, limpia con alcohol, usa brim y baja la altura de la primera capa.'),
          err('Un taladro quedó demasiado justo', 'No compensaste el encogimiento', 'Aumenta el diámetro 0.2–0.4 mm o escaria con una broca.')
        ],
        practice: { task: 'Diseña un soporte con un taladro de 8 mm que admita un eje impreso sin atascarse. Imprime, mide e itera el juego.', success: ['El eje entra con juego', 'No hay soportes innecesarios', 'Documentas el juego final'] },
        quiz: [q('¿Por qué se sobredimensionan los taladros en FDM?', ['Por estética', 'Porque el plástico se encoge y la superficie es rugosa', 'Porque el slicer los ignora', 'Para ahorrar filamento'], 1, 'El juego compensa encogimiento y textura de capa.')],
      tags: ['impresión 3d', 'dfm', 'fdm']
    }),

    L({
      id: 'r6-5', title: 'Tolerancias y ajustes', min: 13,
      objectives: ['Elegir juntos entre eje y taladro', 'Medir la tolerancia real de tu impresora'],
      blocks: [
        p('Ninguna pieza sale exactamente a la cota del CAD. La tolerancia es el rango admitido; el ajuste es la relación entre dos piezas (un eje entra en un taladro con juego o con presión). En robótica, un ajuste mal elegido se traduce en juego, rozamiento o piezas que no encajan.'),
        diagrama('tolerancias', 'Holgura frente a presión: mide siempre tu propia máquina.'),
        tabla(['Ajuste', 'Resultado', 'Cuándo', 'En FDM (0.4 mm nozzle)'], [
          ['Holgura', 'El eje gira libre', 'Rodamientos, bisagras', '0.2–0.4 mm de juego'],
          ['Transición', 'Entra con presión suave', 'Piezas que se ensamblan', '0.1–0.2 mm'],
          ['Presión', 'Requiere martillo/prensa', 'Uniones permanentes', '−0.1 a 0 mm (no recomendable en plástico)']
        ]),
        formula('juego = D_taladro − d_eje', 'Positivo = holgura; negativo = interferencia (presión).'),
        apunte('Galga de calibración', 'Imprime un cubo con taladros de 7.8, 8.0, 8.2 y 8.4 mm y un eje de 8.0. Mide con calibrador cuál taladro da el ajuste que quieres. Ese número es la tolerancia real de TU impresora, no la del foro.'),
        codigo('scad', `eje_nominal = 8.0;
juego_medido = 0.25;   // de tu galga, no inventado
taladro = eje_nominal + juego_medido;  // 8.25 mm`, 'Un solo parámetro documentado evita diez iteraciones.'),
        aviso('No asumas que dos impresoras iguales dan las mismas cotas. Temperatura, humedad del filamento y calibración cambian el resultado; mide siempre la pieza final con un calibrador.'),
      ],
        errors: [
          err('El eje no entra en el taladro', 'Juego negativo por error de calibración', 'Mide la galga y aumenta el taladro el juego medido.'),
          err('La rueda baila en el eje', 'Demasiada holgura', 'Reduce el juego o añade un casquillo/arandela.')
        ],
        practice: { task: 'Imprime una galga de 4 taladros y un eje. Mide con calibrador y determine el juego que da un giro suave sin bailar.', success: ['Tienes un número medido', 'El eje gira sin juego excesivo', 'Actualizas tu parámetro'] },
        quiz: [q('Un eje de 8.0 mm en un taladro de 8.3 mm da un juego de:', ['0.3 mm (holgura)', '−0.3 mm (presión)', '0 mm', '8.3 mm'], 0, 'juego = 8.3 − 8.0 = +0.3 mm: ajuste con holgura.')],
      tags: ['tolerancias', 'ajustes', 'medición']
    }),

    L({
      id: 'r6-6', title: 'Calibración de la impresora', min: 15,
      objectives: ['Nivelar la cama y ajustar el extrusor', 'Diagnosticar fallos por síntomas visuales'],
      blocks: [
        p('Una impresora mal calibrada convierte diseños correctos en piezas defectuosas. La calibración no es un ritual: es alinear la máquina con lo que el slicer cree que está pasando.'),
        pasos([
          { title: 'Nivelar la cama', text: 'Ajusta los tornillos hasta que la distancia boquilla–cama sea uniforme (paper test o sonda automática).' },
          { title: 'Ajustar el Z-offset', text: 'Primera capa ni aplastada ni flotando: debe adherirse con líneas contiguas.' },
          { title: 'Calibrar extrusión', text: 'Extruye 100 mm y mide: si da 98 mm, sube el factor de flujo a ~102 %.' },
          { title: 'Temperatura y retractación', text: 'Torre de temperatura y pruebas de retractación para evitar hilos (stringing).' },
          { title: 'Velocidad y ventilador', text: 'Puente y esquinas: baja velocidad y más refrigeración si hay goteo.' }
        ]),
        tabla(['Síntoma', 'Causa probable', 'Arreglo'], [
          ['Primera capa no pega', 'Z-offset alto / cama sucia', 'Bajar Z, limpiar con alcohol, brim'],
          ['Capas separadas', 'Temperatura baja / ventilador excesivo', 'Subir 5–10 °C, bajar ventilador'],
          ['Hilos entre torres', 'Retractación insuficiente / filamento húmedo', 'Más retractación, secar filamento'],
          ['Esquinas levantadas', 'Warping, cama fría', 'Cama caliente, brim, caja'],
          ['Superficie ondulada', 'Cinturón flojo o extrusión irregular', 'Ajustar tensión, calibrar E-steps']
        ]),
        codigo('bash', `# Comandos típicos de calibración (Marlin)
M503                 ; ver configuración actual
M92 E96              ; E-steps/mm (ajustar tras medir)
M500                 ; guardar en EEPROM
G28                  ; home
G29                  ; mesh bed leveling`, 'Siempre guarda (M500) después de calibrar.'),
        apunte('Registro de calibración', 'Anota en un archivo: filamento, temperatura, Z-offset, factor de flujo y fecha. Cuando una pieza salga mal, compara con la última calibración conocida. Es el equivalente a un log de git para hardware.'),
        aviso('Nunca dejes la impresora sin supervisión las primeras horas: un HOTEND obstruido o un ventilador gripado pueden causar un incendio. Mantén el cableado ordenado y las conexiones firmes.'),
      ],
        errors: [err('El extrusor hace clic y no avanza', 'Hotend atascado o temperatura baja', 'Purgar, limpiar la boquilla y subir temperatura gradualmente.')],
        practice: { task: 'Calibra E-steps extruyendo 100 mm y ajusta el factor de flujo. Imprime un cubo de 20 mm y verifica sus dimensiones con calibrador.', success: ['E-steps dentro del 1 %', 'El cubo mide 20 ± 0.2 mm', 'Anotas los valores'] },
        quiz: [q('Si al extruir 100 mm solo salen 98 mm, ¿qué ajuste corresponda?', ['Bajar la temperatura', 'Subir el factor de extrusión ~2 %', 'Subir la velocidad', 'Cambiar el nozzle'], 1, 'Hay que aumentar el flujo aproximadamente 100/98 ≈ 1.02.')],
      tags: ['impresión 3d', 'calibración', 'mantenimiento']
    }),

    L({
      id: 'r6-7', title: 'Tornillería, rodamientos y transmisiones', min: 15,
      objectives: ['Elegir tornillos, rodamientos y elementos de transmisión', 'Calcular juego y precarga en un eje'],
      blocks: [
        p('La mecánica que sostiene un robot se decide en tres cajas: cómo unes (tornillería), cómo giras (rodamientos) y cómo transmites el movimiento (engranajes, correas, tornillos). Elegir bien evita juegos y vibraciones.'),
        tabla(['Elemento', 'Qué mirar', 'Uso típico'], [
          ['Tornillo M3', 'Longitud, paso 0.5 mm, cabeza', 'Fijar electrónica y soportes'],
          ['Tuerca Nyloc', 'Autobloqueante', 'Zonas con vibración'],
          ['Arandela', 'Repartir carga, evitar marcas', 'Bajo la cabeza del tornillo'],
          ['Rodamiento 608', '8×22×7 mm', 'Ruedas, ejes grandes'],
          ['Rodamiento MR105', '5×10×4 mm', 'Brazos pequeños'],
          ['Casquillo (bushing)', 'Barato, más fricción', 'Juntas lentas'],
          ['Correa GT2', 'Paso 2 mm, sin juego', 'Impresoras, brazos'],
          ['Tornillo de bola', 'Alta eficiencia', 'Mesas lineales']
        ]),
        formula('juego axial = 0.05–0.15 mm típico en ejes con dos rodamientos', 'Demasiado juego → vibración; demasiada precarga → calor y desgaste.'),
        codigo('scad', `// Taladro pasante M3 + avellanado para tornillo de cabeza plana
tornillo = 3.0; holgura = 0.3;
difference() {
  cube([20,20,6]);
  cylinder(h=8, r=(tornillo+holgura)/2);          // paso
  cylinder(h=2, r=(tornillo+holgura)/2 + 1.5);    // avellanado
}`, 'Un taladro pasante con holgura y cabeza avellanada.'),
        apunte('Precarga', 'En un eje con dos rodamientos, separarlos y apretar con una arandela elimina el juego axial. En impresión 3D, aprieta solo con los dedos: el plástico se deformation o se agrieta con un destornillador.'),
        aviso('No mezcles roscas métricas e imperiales en el mismo ensamblaje. Un tornillo 6-32 no es un M3: se "rosca" a fuerza y destruye el taladro.'),
        lista(['Usa tuercas Nyloc o tornillo con fijador de rosca en todo lo que vibre.', 'Un rodamiento necesita un asiento con la tolerancia correcta; si el taladro es grande, se gira dentro de la carcasa.', 'En transmisiones por correa, ajusta la tensión: floja salta dientes; apretada desgasta los rodamientos.'], true),
      ],
        errors: [
          err('La rueda tiene juego lateral', 'Rodamiento sin precarga o asiento holgado', 'Añade arandela de precarga o imprime el asiento con menos juego.'),
          err('La correa salta dientes', 'Tensión insuficiente o polea desalineada', 'Ajusta tensores y alinea las poleas.')
        ],
        practice: { task: 'Monta un eje con dos rodamientos 608 en una pieza impresa. Ajusta la precarga hasta que no haya juego pero gire libre.', success: ['Sin juego axial', 'Gira suave', 'Los tornillos llevan tuerca de seguridad'] },
        quiz: [q('¿Qué ventaja tiene una correa GT2 frente a un engranaje plástico?', ['Más juego', 'Menos juego y menor ruido', 'No necesita poleas', 'Es más barata siempre'], 1, 'La correa dentada no tiene backlash apreciable y transmite suavemente.')],
      tags: ['mecánica', 'rodamientos', 'transmisión']
    }),

    L({
      id: 'r6-8', title: 'Diseñar un soporte desde un datasheet', min: 16, level: 'intermedio',
      objectives: ['Extraer cotas críticas de un datasheet', 'Convertirlas en un soporte imprimible y verificable'],
      blocks: [
        p('El trabajo real de un ingeniero mecánico rara vez empieza con un modelo listo: empieza con un PDF. Saber convertir las cotas de un datasheet en un soporte es una de las habilidades más rentables que hay.'),
        pasos([
          { title: 'Descarga el datasheet', text: 'Busca el modelo exacto, no uno parecido.' },
          { title: 'Extrae el mechanical drawing', text: 'Diámetro del cuerpo, longitud del eje, patrón de taladros, rosca.' },
          { title: 'Anota los márgenes', text: 'Juego para el cuerpo (0.3 mm) y para el eje (0.2 mm).' },
          { title: 'Modela', text: 'Parámetros maestros = esas cotas.' },
          { title: 'Imprime y mide', text: 'Compara con el calibrador y ajusta.' }
        ]),
        tabla(['Dato del datasheet', 'Dónde está', 'Cómo se usa'], [
          ['Diámetro del cuerpo', 'Mechanical drawing', 'Taladro o abrazadera'],
          ['Patrón de tornillos', 'Vista superior', 'Distancias entre centros'],
          ['Diámetro del eje (D-shaft)', 'Vista lateral', 'Taladro con plana'],
          ['Longitud del eje', 'Vista lateral', 'Profundidad del soporte'],
          ['Peso', 'Specifications', 'Carga del soporte']
        ]),
        p('Ejemplo: un motor NEMA 17 tiene brida de 42.3 mm y taladros de 3 mm en un cuadrado de 31 mm. El soporte llevará un cuadrado de 42.6 mm (0.3 de juego), cuatro taladros de 3.4 mm a 31 mm y un cilindro pasante para el eje de 5 mm con 0.2 mm de juego.'),
        codigo('scad', `brida = 42.3; juego = 0.3; paso = 31.0;
taladro_tornillo = 3.4; eje = 5.0;
difference() {
  cube([brida+juego, brida+juego, 8], center=true);
  for (x=[-1,1]) for (y=[-1,1])
    translate([x*paso/2, y*paso/2, 0])
      cylinder(h=10, r=taladro_tornillo/2, center=true);
  cylinder(h=10, r=(eje+0.2)/2, center=true);
}`, 'Las tres cotas del datasheet convertidas en parámetros.'),
        apunte('Verificación', 'Antes de imprimir la versión final, imprime una versión delgada (2 mm) y prueba el ajuste con el motor real. Ahorra horas frente a imprimir el soporte completo cuatro veces.'),
        aviso('Los datasheets de clones a veces difieren del original en 0.5–1 mm. Mide siempre tu pieza física con un calibrador; el PDF es una guía, no una verdad.'),
      ],
        errors: [
          err('El motor no encaja en el soporte', 'Cota del datasheet distinta a la pieza real', 'Mide la brida con calibrador y actualiza el parámetro.'),
          err('Los tornillos no coinciden', 'Patrón de taladros incorrecto', 'Verifica la distancia entre centros en la vista superior.')
        ],
        practice: { task: 'Elige un motor o sensor real, descarga su datasheet y diseña un soporte paramétrico. Imprime la versión delgada y verifica el ajuste.', success: ['Tres cotas extraídas del PDF', 'Versión de prueba impresa', 'Ajuste verificado con calibrador'] },
        quiz: [q('¿Qué dato del datasheet determina la distancia entre los tornillos de una brida?', ['El peso', 'El patrón de taladros de la vista superior', 'El color', 'La corriente'], 1, 'El patrón de montaje da el cuadrado de centros de los taladros.')],
      tags: ['datasheet', 'soporte', 'diseño']
    }),

    L({
      id: 'r6-9', title: 'Construir y calibrar el brazo SO-101', min: 20, level: 'avanzado',
      objectives: ['Ensamblar un brazo con servos de bus', 'Calibrar posiciones, offsets y límites de trabajo'],
      blocks: [
        p('El SO-101 es un brazo de aprendizaje con dos unidades: un leader que mueves con la mano y un follower que repite. Cada servo STS3215 reporta su posición por bus, lo que permite grabar demostraciones y entrenar políticas con LeRobot.'),
        diagrama('so101', 'Leader, follower, servos STS3215 y LeRobot.'),
        pasos([
          { title: 'Imprime las piezas', text: 'Sigue la orientación de capas recomendada; las piezas de carga van con más relleno.' },
          { title: 'Asigna IDs', text: 'Configura un ID único por servo (1–6) antes de montarlos en cadena.' },
          { title: 'Ensambla con juego controlado', text: 'Aprieta tornillos sin deformar plástico; usa arandelas en las juntas.' },
          { title: 'Cablea el bus', text: 'Daisy-chain de datos con GND común y fuente 5–7.4 V dimensionada.' },
          { title: 'Calibra cada servo', text: 'Mueve a cero mecánico, guarda offset y define límites min/max.' },
          { title: 'Verifica leader/follower', text: 'Mueve el leader y comprueba que el follower sigue con el mismo ángulo.' }
        ]),
        codigo('python', `from lerobot.common.robot_devices.motors.dynamixel import DynamixelMotorsBus

bus = DynamixelMotorsBus(port="/dev/ttyUSB0", motor={
    "shoulder": (1, "sts3215"),
    "elbow":    (2, "sts3215"),
    "wrist":    (3, "sts3215"),
})
bus.connect()
# Leer posición actual y establecer offset de cero
pos = bus.read("Present_Position", "shoulder")
print("posición cruda:", pos)
bus.write("Offset_Position", "shoulder", -pos)`, 'Calibración de cero con la librería de LeRobot.'),
        tabla(['Parámetro', 'Qué ajusta', 'Síntoma si está mal'], [
          ['Offset de posición', 'Cero mecánico del servo', 'El brazo arranca torcido'],
          ['Límites min/max', 'Rango seguro', 'El servo hace tope y se calienta'],
          ['Modo de control', 'Posición vs torque', 'El follower no sigue'],
          ['ID del bus', 'Dirección de cada servo', 'Dos servos responden a la vez']
        ]),
        apunte('De la calibración al learning', 'Una calibración estable es lo que hace que las demostraciones sean reproducibles. Si el cero cambia entre sesiones, la política entrenada verá estados distintos para la misma pose: el error se dispara.'),
        aviso('Los servos pueden moverse bruscamente al energizarse si su posición actual está fuera de rango. Sujeta el brazo la primera vez, configura límites y ten una forma de cortar energía rápido.'),
      ],
        errors: [
          err('Dos servos responden al mismo comando', 'IDs duplicados en el bus', 'Asigna IDs únicos uno a uno, con un solo servo conectado.'),
          err('El follower no sigue al leader', 'Offsets distintos o modo de control incorrecto', 'Recalibra el cero de ambos y pon los servos en modo posición.')
        ],
        practice: { task: 'Ensambla y calibra el SO-101: IDs únicos, cero por servo y seguimiento leader→follower. Mueve el leader a tres poses y mide el error del follower.', success: ['IDs únicos verificados', 'Error de seguimiento < 1°', 'Cero estable tras reiniciar'] },
        quiz: [q('¿Por qué es crítica la calibración del cero en un brazo de learning?', ['Por estética', 'Porque las demostraciones deben ser reproducibles', 'Porque ahorra corriente', 'Porque cambia el ID'], 1, 'Un cero inestable cambia la observación de la misma pose y arruina el entrenamiento.')],
      tags: ['so101', 'brazo', 'calibración', 'lerobot']
    })
  ]),

  // ==================== B7: ROS 2 Y SIMULACIÓN ====================
  M('b7', 'ROS 2 y simulación', 'Nodos, tf2, URDF, ros2_control, Gazebo, SLAM, Nav2 y MoveIt 2', [

    L({
      id: 'r7-1', title: 'Instalación, workspace y conceptos ROS 2', min: 16,
      objectives: ['Instalar ROS 2 y crear un workspace con colcon', 'Entender nodos, DDS y el modelo de comunicación'],
      blocks: [
        p('ROS 2 no es un sistema operativo ni un lenguaje: es un middleware que permite a procesos pequeños (nodos) intercambiar mensajes. La pieza clave debajo es DDS, un estándar de comunicaciones en tiempo real que decide quién habla con quién sin un servidor central.'),
        diagrama('ros_graf', 'Nodos, topics, services y actions: el grafo ROS 2.'),
        tabla(['Concepto', 'Analogía', 'ROS 2'], [
          ['Nodo', 'Un programa', 'Proceso con un nombre'],
          ['Topic', 'Un canal de radio', 'Pub/sub, many-to-many'],
          ['Message', 'El paquete', 'Estructura tipada (.msg)'],
          ['Service', 'Una llamada', 'Request/response síncrono'],
          ['Action', 'Un encargo largo', 'Goal + feedback + resultado'],
          ['DDS', 'La red', 'Descubrimiento y transporte']
        ]),
        codigo('bash', `# Instalar ROS 2 Jazzy en Ubuntu 24.04 (resumen)
sudo apt update && sudo apt install ros-jazzy-desktop
source /opt/ros/jazzy/setup.bash

mkdir -p ~/ws/src && cd ~/ws/src
git clone <repo-de-ejemplo>
cd ~/ws && rosdep install --from-paths src -y
colcon build --symlink-install
source install/setup.bash`, 'El flujo estándar: source → rosdep → colcon build → source install.'),
        apunte('Por qué sourcear dos veces', 'Primero cargas el entorno base (/opt/ros/...), que da los comandos ros2. Después de compilar, sourceas install/setup.bash para que el sistema encuentre TU paquete. Olvidar el segundo source es el error más común del primer día.'),
        codigo('bash', `ros2 node list                # nodos vivos
ros2 topic list               # topics activos
ros2 topic echo /chatter      # ver mensajes
ros2 run demo_nodes_cpp talker
ros2 pkg create --build-type ament_py mi_paquete`, 'Comandos que usarás a diario.'),
        aviso('ROS 2 no es tiempo real por defecto: el control de motor a 1 kHz debe vivir en un microcontrolador (ESP32/STM32) y hablar con ROS por UART, como viste en la arquitectura del bloque b3.'),
      ],
        errors: [
          err('ros2 run dice "package not found"', 'No has sourceado install/setup.bash o no compilaste', 'Ejecuta colcon build y source install/setup.bash en la misma terminal.'),
          err('Los nodos no se ven entre dos equipos', 'DDS no descubre por red o dominio distinto', 'Configura ROS_DOMAIN_ID y el multicast/unicast de DDS.')
        ],
        practice: { task: 'Instala ROS 2, crea un workspace, compila el paquete de ejemplo y haz que talker y listener se vean. Lista nodos y topics.', success: ['colcon build termina sin errores', 'ros2 node list muestra ambos', 'Entiendes para qué se hace source'] },
        quiz: [q('¿Qué middleware subyace a ROS 2?', ['ZeroMQ', 'DDS', 'MQTT', 'HTTP'], 1, 'DDS gestiona descubrimiento y transporte de mensajes.')],
      tags: ['ros2', 'instalación', 'conceptos']
    }),

    L({
      id: 'r7-2', title: 'Nodos y topics', min: 16,
      objectives: ['Escribir un publicador y un suscriptor', 'Elegir QoS y entender el modelo pub/sub'],
      blocks: [
        p('Un topic es un canal con nombre y un tipo de mensaje. Los publicadores escriben, los suscriptores leen, y no hace falta que se conozcan: DDS los empareja por nombre y tipo. Es la forma más común de mover datos en un robot.'),
        diagrama('ros_graf', 'El grafo: varios nodos pueden publicar y suscribirse al mismo topic.'),
        codigo('python', `import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class Charla(Node):
    def __init__(self):
        super().__init__('hablador')
        self.pub = self.create_publisher(String, 'chatter', 10)
        self.timer = self.create_timer(0.5, self.tick)
        self.n = 0
    def tick(self):
        msg = String()
        msg.data = f'mensaje {self.n}'
        self.pub.publish(msg)
        self.get_logger().info(msg.data)
        self.n += 1

rclpy.init()
rclpy.spin(Charla())`, 'Publicador mínimo en Python (rclpy).'),
        codigo('cpp', `#include "rclcpp/rclcpp.hpp"
#include "std_msgs/msg/string.hpp"
using std_msgs::msg::String;

class Charla : public rclcpp::Node {
public:
  Charla() : Node("hablador_cpp") {
    pub_ = create_publisher<String>("chatter", 10);
    timer_ = create_wall_timer(std::chrono::milliseconds(500), [this](){
      auto msg = String(); msg.data = "hola desde C++";
      pub_->publish(msg);
    });
  }
private:
  rclcpp::Publisher<String>::SharedPtr pub_;
  rclcpp::TimerBase::SharedPtr timer_;
};`, 'El equivalente en C++ (rclcpp): mismo concepto, más control y rendimiento.'),
        tabla(['QoS', 'Significado', 'Cuándo'], [
          ['Best effort', 'Se pierden mensajes si hay congestión', 'Cámaras, lidar (datos que se renuevan)'],
          ['Reliable', 'Reintenta hasta entregar', 'Comandos, estados críticos'],
          ['Transient local', 'El último dato queda guardado', 'Parámetros, /tf_static, mapas'],
          ['Depth (queue)', 'Cuántos mensajes se guardan', 'Ajusta a la tasa y latencia']
        ]),
        apunte('Nombres con namespace', 'Usa nombres jerárquicos (/robot1/cmd_vel, /camera/image) y namespaces para evitar colisiones entre robots. Un buen grafo de topics es la mejor documentación de un sistema ROS.'),
        aviso('Un topic con QoS incompatible no conecta: por ejemplo, un suscriptor reliable no recibe de un publicador best effort. Si "no llega nada", comprueba primero QoS y tipo de mensaje con ros2 topic info -v.'),
      ],
        errors: [
          err('El suscriptor no recibe nada', 'QoS distinto o tipos de mensaje diferentes', 'Usa ros2 topic info -v para comparar.'),
          err('Mensajes duplicados en dos suscriptores', 'Varios publicadores con el mismo nombre', 'Lista con ros2 topic info y corrige el grafo.')
        ],
        practice: { task: 'Publica un Twist en /cmd_vel y suscríbete desde otro nodo. Cambia el QoS a best effort y observa la diferencia al saturar el canal.', success: ['Pub/sub conectan', 'Sabes ver el QoS', 'El tipo de mensaje coincide'] },
        quiz: [q('¿Qué QoS conviene para un stream de cámara?', ['Reliable', 'Best effort', 'Transient local', 'Ninguno'], 1, 'Se renueva constantemente: perder un frame es mejor que acumular lag.')],
      tags: ['ros2', 'topics', 'nodos']
    }),

    L({
      id: 'r7-3', title: 'Services y actions', min: 15,
      objectives: ['Implementar un service síncrono', 'Usar una action para tareas largas con feedback'],
      blocks: [
        p('Los topics son para flujo continuo. Cuando necesitas una respuesta concreta usas un service (petición–respuesta). Cuando la tarea tarda segundos o minutos y quieres progreso y poder cancelarla, usas una action.'),
        tabla(['', 'Topic', 'Service', 'Action'], [
          ['Patrón', 'Pub/sub', 'Request/response', 'Goal + feedback + result'],
          ['Bloqueante', 'No', 'Sí (espera respuesta)', 'No (asincróno)'],
          ['Feedback', 'No', 'No', 'Sí, durante la ejecución'],
          ['Cancelar', 'No', 'No', 'Sí'],
          ['Ejemplo', '/scan, /cmd_vel', '/reset_map', '/navigate_to_pose']
        ]),
        codigo('python', `from example_interfaces.srv import AddTwoInts

class Sumador(Node):
    def __init__(self):
        super().__init__('sumador')
        self.srv = self.create_service(AddTwoInts, 'sumar', self.sumar_cb)
    def sumar_cb(self, request, response):
        response.sum = request.a + request.b
        return response

# Cliente
cli = node.create_client(AddTwoInts, 'sumar')
req = AddTwoInts.Request(); req.a = 2; req.b = 3
futuro = cli.call_async(req)`, 'Un service síncrono de ejemplo.'),
        codigo('cpp', `#include "rclcpp_action/rclcpp_action.hpp"
#include "nav2_msgs/action/navigate_to_pose.hpp"
using Nav = nav2_msgs::action::NavigateToPose;

// Cliente de action: objetivo, feedback y resultado
auto goal = Nav::Goal();
goal.pose.header.frame_id = "map";
goal.pose.pose.position.x = 2.0;
goal.pose.pose.position.y = 1.0;
goal.pose.pose.orientation.w = 1.0;  // sin rotación
auto send_goal_options = rclcpp_action::Client<Nav>::SendGoalOptions();
send_goal_options.feedback_callback =
  [](auto, const auto feedback) {
    RCLCPP_INFO(node->get_logger(), "distancia restante: %.2f",
      feedback->distance_remaining);
  };`, 'Las actions son la base de Nav2 y MoveIt 2.'),
        apunte('Cuándo usar cada uno', '¿Envías datos todo el rato? Topic. ¿Preguntas algo y esperas? Service. ¿Encargas algo largo y quieres progreso o cancelación? Action. Elegir mal el patrón hace sistemas difíciles de depurar.'),
        aviso('Un service puede bloquear a quien lo llama si el servidor tarda o no existe. Pon siempre un timeout en el cliente; en ROS 2 usa wait_for_service() con un plazo.'),
      ],
        errors: [err('El cliente se queda esperando para siempre', 'Servidor caído o nombre distinto', 'Usa wait_for_service(timeout) y verifica con ros2 service list.')],
        practice: { task: 'Implementa un service que devuelva la distancia entre dos puntos y una action que cuente hasta N con feedback cada segundo.', success: ['El service responde', 'La action publica feedback', 'Puedes cancelarla'] },
        quiz: [q('¿Qué patrón ROS 2 permite cancelar una tarea en curso y recibir progreso?', ['Topic', 'Service', 'Action', 'Parameter'], 2, 'Las actions tienen goal, feedback y resultado, y soportan cancelación.')],
      tags: ['ros2', 'services', 'actions']
    }),

    L({
      id: 'r7-4', title: 'Parámetros y launch files', min: 15,
      objectives: ['Declarar y usar parámetros', 'Orquestar nodos con launchfiles'],
      blocks: [
        p('Los parámetros son la configuración de un nodo: velocidades máximas, nombres de topic, ganancias. Los launch files arrancan varios nodos a la vez y les pasan esa configuración. Sin ellos, tu robot es una colección de terminales.'),
        codigo('python', `# Nodo con parámetros declarados
class Control(Node):
    def __init__(self):
        super().__init__('control')
        self.declare_parameter('vel_max', 0.5)
        self.declare_parameter('ganancia', 2.0)
        self.vel_max = self.get_parameter('vel_max').value

# Cambiar en caliente desde terminal:
# ros2 param set /control vel_max 0.8
# ros2 param get /control ganancia`, 'Los parámetros se pueden cambiar sin recompilar.'),
        codigo('python', `from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(package='mi_paquete', executable='control',
             name='control', parameters=[{
                 'vel_max': 0.6, 'ganancia': 1.8
             }]),
        Node(package='robot_state_publisher',
             executable='robot_state_publisher',
             arguments=['robot.urdf']),
    ])`, 'Un launch file que arranca dos nodos y configura parámetros.'),
        tabla(['Herramienta', 'Para qué', 'Sintaxis'], [
          ['ros2 param', 'Leer/escribir en caliente', 'ros2 param list / set / get'],
          ['launch (Python)', 'Arrancar y configurar nodos', '.launch.py'],
          ['launch.xml / .yaml', 'Alternativas declarativas', 'Menos comunes'],
          ['ros2 launch', 'Ejecutar un launch', 'ros2 launch pkg file.launch.py']
        ]),
        apunte('Configuración por archivo YAML', 'En robots reales los parámetros viven en archivos YAML separados (config/params.yaml) y el launch los carga. Así puedes tener un perfil para simulación y otro para el robot físico sin tocar código.'),
        aviso('Un parámetro declarado pero no usado es ruido: documenta qué hace y ponle un valor por defecto sensato. Los nombres de parámetros son API pública: cámbialos con cuidado.'),
      ],
        errors: [err('El nodo ignora el parámetro que le paso', 'Nombre distinto o no declarado', 'Comprueba declare_parameter y ros2 param list.')],
        practice: { task: 'Crea un launch que arranque tu nodo con dos perfiles de parámetros (sim y real). Cambia un parámetro en caliente y observa el efecto.', success: ['El launch arranca todo', 'Los perfiles funcionan', 'El cambio en caliente se aplica'] },
        quiz: [q('¿Dónde se suelen guardar los parámetros de un robot real?', ['Dentro del código', 'En archivos YAML cargados por el launch', 'En el topic /param', 'En la memoria del microcontrolador'], 1, 'En config/*.yaml, con un perfil por escenario.')],
      tags: ['ros2', 'parámetros', 'launch']
    }),

    L({
      id: 'r7-5', title: 'tf2: el árbol de transformadas', min: 17,
      objectives: ['Publicar y consultar transformadas', 'Diagnosticar errores de marcos y tiempos'],
      blocks: [
        p('En un robot nothing está en el mismo sitio: el láser está a 10 cm del centro, la cámara a 20 cm y arriba. tf2 mantiene un árbol de marcos de coordenadas y convierte puntos de uno a otro con la transformada correcta en el instante correcto.'),
        diagrama('tf', 'map → odom → base_link → láser/cámara.'),
        tabla(['Marco', 'Quién lo publica', ' Naturaleza'], [
          ['map', 'SLAM', 'Fijo en el mundo, salta al corregir'],
          ['odom', 'Odometría / EKF', 'Continuo, deriva suavemente'],
          ['base_link', 'Estado del robot', 'Se mueve con el robot'],
          ['laser_frame', 'URDF / estático', 'Fijo respecto a base_link'],
          ['camera_link', 'URDF / estático', 'Fijo respecto a base_link']
        ]),
        codigo('python', `from tf2_ros import TransformBroadcaster
from geometry_msgs.msg import TransformStamped

def publicar():
    t = TransformStamped()
    t.header.stamp = node.get_clock().now().to_msg()
    t.header.frame_id = 'odom'
    t.child_frame_id = 'base_link'
    t.transform.translation.x = x
    t.transform.rotation.z = sin(theta/2)
    t.transform.rotation.w = cos(theta/2)
    broadcaster.sendTransform(t)`, 'odom → base_link se publica en cada ciclo de odometría.'),
        formula('p_base = T_base_odom · T_odom_map · p_map', 'tf2 encadena transformadas por el árbol; tú pides "este punto en este marco y en este instante".'),
        apunte('Consejo de oro', 'Nunca PUBLICO dos transformadas para el mismo par de marcos. Si robot_state_publisher publica laser→base desde el URDF, no lo publiques tú también en el nodo del láser: aparecerá un bucle y tf2 se quejará.'),
        aviso('Los errores de tf suelen ser de tiempo, no de geometría: pide transformadas con el timestamp del dato, no con "now", o tu nube de puntos y tu mapa estarán desalineados en robots en movimiento.'),
      ],
        errors: [
          err('"Lookup would require extrapolation into the future"', 'Timestamp del dato por delante del reloj que pubica tf', 'Sincroniza relojes y usa el stamp del mensaje, no now().'),
          err('"Frame laser does not exist"', 'Nadie publica la transformada o el nombre está mal escrito', 'Revisa ros2 run tf2_tools view_frames y los nombres.')
        ],
        practice: { task: 'Publica odom→base_link con tf2, visualiza el árbol con view_frames y consulta una punto del láser en el marco map.', success: ['El árbol es correcto', 'Sin transformadas duplicadas', 'La consulta temporal funciona'] },
        quiz: [q('¿Qué transformada publica normalmente el SLAM?', ['map → odom', 'odom → base_link', 'base → laser', 'Ninguna'], 0, 'SLAM corrige la deriva publicando map→odom; la odometría publica odom→base_link.')],
      tags: ['ros2', 'tf2', 'coordenadas']
    }),

    L({
      id: 'r7-6', title: 'URDF, xacro y RViz', min: 18,
      objectives: ['Describir un robot en URDF/xacro', 'Visualizar y depurar el modelo en RViz'],
      blocks: [
        p('URDF es un XML que describe los eslabones (links) del robot, sus articulaciones (joints), masa, inercia y aspecto visual. xacro añade macros yvariables para no repetir. Es la fuente de verdad para tf, simulación y control.'),
        diagrama('urdf', 'links, joints, xacro y robot_state_publisher.'),
        codigo('xml', `<?xml version="1.0"?>
<robot name="mini_robot" xmlns:xacro="http://www.ros.org/wiki/xacro">
  <xacro:property name="rueda_r" value="0.05"/>
  <link name="base_link">
    <visual><geometry><box size="0.3 0.2 0.1"/></geometry></visual>
    <collision><geometry><box size="0.3 0.2 0.1"/></geometry></collision>
    <inertial><mass value="2.0"/>
      <inertia ixx="0.01" iyy="0.01" izz="0.01" ixy="0" ixz="0" iyz="0"/>
    </inertial>
  </link>
  <joint name="rueda_izq" type="continuous">
    <parent link="base_link"/><child link="rueda_izq_link"/>
    <origin xyz="0 0.15 0" rpy="-1.5708 0 0"/>
    <axis xyz="0 0 1"/>
  </joint>
</robot>`, 'Un URDF/xacro mínimo con una articulación continua.'),
        tabla(['Etiqueta', 'Qué define', 'Ojo con'], [
          ['<link>', 'Eslabón rígido', 'visual, collision, inertial'],
          ['<joint>', 'Unión entre links', 'type: fixed, continuous, revolute, prismatic'],
          ['<origin>', 'Posición y orientación', 'rpy en radianes'],
          ['<axis>', 'Eje de giro', 'Coincida con el eje real'],
          ['<xacro:macro>', 'Plantilla reutilizable', 'Ideal para 4 ruedas iguales']
        ]),
        apunte('robot_state_publisher', 'Este nodo lee el URDF y publica todas las transformadas estáticas (las que no cambian). Por eso no debes publicarlas tú. Los joints que se mueven se publican con joint_states.'),
        codigo('bash', `ros2 launch robot_state_publisher robot_state_publisher.launch.py \\
  use_sim_time:=true
ros2 run rviz2 rviz2
# En RViz: Fixed Frame = base_link, añade RobotModel y TF`, 'Ver el modelo y el árbol TF en RViz.'),
        aviso('Un URDF sin <inertial> o con masas inventadas funciona en RViz pero falla en Gazebo y en control: el simulador necesita masa e inercia para la física. Usa valores reales o calcula la inercia de una caja.'),
      ],
        errors: [
          err('RViz dice "No transform from X to base_link"', 'Falta publicar joint_states o el URDF tiene un link huérfano', 'Arranca joint_state_publisher y revisa la jerarquía de joints.'),
          err('El robot sale "acostado" en RViz', 'Ejes o rpy incorrectos en <origin>', 'ROS usa Z arriba y X adelante; revisa las rotaciones.')
        ],
        practice: { task: 'Modela un robot de dos ruedas con xacro usando una macro para cada rueda. Cárgalo en RViz y verifica el árbol TF.', success: ['La macro evita duplicar código', 'RViz muestra el modelo', 'TF está completo'] },
        quiz: [q('¿Qué nodo publica las transformadas estáticas definidas en el URDF?', ['rviz2', 'robot_state_publisher', 'tf2_tools', 'rosbag'], 1, 'robot_state_publisher convierte el URDF en transformadas.')],
      tags: ['ros2', 'urdf', 'rviz']
    }),

    L({
      id: 'r7-7', title: 'rosbag: grabar, reproducir e inspeccionar', min: 13,
      objectives: ['Grabar un rosbag con los topics relevantes', 'Reproducir datos para depuración determinista'],
      blocks: [
        p('Un rosbag guarda mensajes con sus marcas de tiempo en un archivo .db3. Es la herramienta de depuración más poderosa de ROS: capturas el fallo una vez y lo reproduzes las veces que quieras, con exactamente la misma entrada.'),
        diagrama('rosbag', 'Grabar → .db3 + metadata → replay → debug.'),
        codigo('bash', `ros2 bag record -o prueba /scan /imu /odom /cmd_vel /tf
ros2 bag info prueba
ros2 bag play prueba --clock -r 0.5
# En otro terminal, con use_sim_time:=true:
ros2 param set /nodo use_sim_time true`, 'Graba, informa y reproduce a media velocidad.'),
        tabla(['Opción', 'Para qué', 'Consejo'], [
          ['-o nombre', 'Nombre del bag', 'Usa fecha y escenario'],
          ['--all / -a', 'Grabar todo', 'Genera archivos enormes'],
          ['-r 0.5', 'Reproducir a media velocidad', 'Ideal para ver fallos rápidos'],
          ['--clock', 'Publicar tiempo simulado', 'Necesario con use_sim_time'],
          ['--topics', 'Solo ciertos topics', 'Ahorra espacio']
        ]),
        apunte('Flujo de depuración', '1) Graba el fallo. 2) Reproduce con --clock. 3) Pon use_sim_time en tus nodos. 4) Añade un ros2 topic echo. Ahora tienes un banco de pruebas determinista: misma entrada, datos distintos en el código.'),
        aviso('Grabar /image sin comprimir llena el disco en minutos. Usa topics comprimidos (/image/compressed) o limita los topics y la duración.'),
      ],
        errors: [
          err('El replay no mueve a los nodos', 'No usas --clock o use_sim_time está en false', 'Activa ambas cosas.'),
          err('El bag pesa gigabytes', 'Grabaste imágenes sin comprimir', 'Usa /image/compressed y selecciona topics.')
        ],
        practice: { task: 'Graba 20 s de /scan y /odom mientras el robot gira. Reproduce a 0.5× con --clock y verifica que un nodo con use_sim_time ve los datos.', success: ['El bag se reproduce', 'El tiempo simulado funciona', 'Puedes inspeccionar mensajes'] },
        quiz: [q('¿Qué opción hace que los nodos usen el tiempo del bag en vez del real?', ['-r', '--clock + use_sim_time', '-o', '--all'], 1, '--clock publica el reloj simulado y use_sim_time lo consume.')],
      tags: ['ros2', 'rosbag', 'debug']
    }),

    L({
      id: 'r7-8', title: 'ros2_control', min: 17, level: 'intermedio',
      objectives: ['Describir hardware e interfaces en URDF', 'Cargar controladores y enviar comandos'],
      blocks: [
        p('ros2_control es la capa que separa la lógica de control del hardware. Define unas interfaces de hardware (position/velocity/effort) y unos controladores reutilizables (diff_drive, joint_trajectory). El mismo código sirve para el robot real y para Gazebo.'),
        diagrama('control_ros', 'URDF <ros2_control> → controller_manager → controlador → hardware.'),
        codigo('xml', `<ros2_control name="Robot" type="system">
  <hardware>
    <plugin>diff_drive_hardware/DiffDriveHardware</plugin>
  </hardware>
  <joint name="rueda_izq">
    <command_interface name="velocity"/>
    <state_interface name="position"/>
    <state_interface name="velocity"/>
  </joint>
  <joint name="rueda_der"> ... </joint>
</ros2_control>`, 'Declaración de interfaces: qué puedes mandar y qué puedes leer.'),
        codigo('bash', `ros2 control list_hardware_components
ros2 control list_controller_types
ros2 control load_controller diff_drive --set-state configure
ros2 control switch_controllers --activate diff_drive
ros2 topic pub /cmd_vel geometry_msgs/msg/Twist \\
  "{linear: {x: 0.2}, angular: {z: 0.1}}"`, 'Cargar y activar el controlador diferencial.'),
        tabla(['Controlador', 'Mando', 'Uso'], [
          ['diff_drive_controller', '/cmd_vel (Twist)', 'Robots de dos ruedas'],
          ['joint_trajectory_controller', 'posición por joint', 'Brazos'],
          ['joint_state_broadcaster', 'publica /joint_states', 'Casi siempre activo'],
          ['forward_command_controller', 'esfuerzo directo', 'Pruebas de bajo nivel']
        ]),
        apunte('Hardware real vs Gazebo', 'En el robot real escribes un plugin que habla con el ESP32 por serial. En Gazebo usas gz_ros2_control, que traduce esas mismas interfaces al motor del simulador. Cambias el plugin, no el controlador.'),
        aviso('Nunca actives dos controladores que escriban en la misma interfaz a la vez: se pelearán por el mismo joint. Desactiva uno antes de activar otro con switch_controllers.'),
      ],
        errors: [
          err('El robot no responde a /cmd_vel', 'Controlador no activo o hardware sin cargar', 'Comprueba list_controllers y list_hardware_components.'),
          err("Error: 'position' interface not found", 'El URDF no declara esa interfaz', 'Añade <state_interface name="position"/> al joint.')
        ],
        practice: { task: 'Configura diff_drive_controller en URDF, cárgalo y mueve el robot (real o simulado) con /cmd_vel. Verifica /odom.', success: ['El controlador está active', '/cmd_vel mueve el robot', '/odom se publica'] },
        quiz: [q('¿Qué controlador publica /joint_states a partir de las interfaces de estado?', ['diff_drive_controller', 'joint_state_broadcaster', 'moveit', 'rviz'], 1, 'El joint_state_broadcaster publica el estado de las articulaciones.')],
      tags: ['ros2', 'control', 'hardware']
    }),

    L({
      id: 'r7-9', title: 'Simulación: Gazebo, MuJoCo e Isaac Sim', min: 20, level: 'intermedio',
      objectives: ['Elegir un simulador según el objetivo', 'Integrar un robot URDF con sensores y control'],
      blocks: [
        p('Simular permite entrenar y probar sin romper hardware. Pero no todos los simuladores sirven para lo mismo: Gazebo se lleva bien con ROS 2 y sensores, MuJoCo destaca en dinámica y contacto, e Isaac Sim en fotorrealismo e IA a gran escala.'),
        diagrama('gazebo', 'Mundo SDF, modelo URDF, plugins y datos en topics.'),
        tabla(['Simulador', 'Fuerza', 'Ideal para'], [
          ['Gazebo (gz sim)', 'Integración ROS 2, sensores', 'Nav2, SLAM, ros2_control'],
          ['MuJoCo', 'Física rápida y precisa, contacto', 'Control, RL, brazos y manos'],
          ['Isaac Sim (NVIDIA)', 'Fotorrealismo, GPU, síntesis', 'Visión, sim-to-real, RL masivo'],
          ['Webots / CoppeliaSim', 'Fáciles de usar', 'Educación, prototipos']
        ]),
        codigo('xml', `<?xml version="1.0"?>
<sdf version="1.9">
  <world name="mundo">
    <include><uri>model://ground_plane</uri></include>
    <include><uri>model://sun</uri></include>
    <model name="mi_robot">
      <plugin filename="gz_ros2_control-system"
              name="gz_ros2_control::GazeboSimROS2ControlPlugin"/>
    </model>
  </world>
</sdf>`, 'Un mundo SDF mínimo con el plugin de ros2_control.'),
        codigo('bash', `ros2 launch gazebo_ros gazebo.launch.py
ros2 run ros_gz_bridge parameter_bridge \\
  /scan@sensor_msgs/msg/LaserScan[gz.msgs.LaserScan
ros2 topic echo /scan`, 'Gazebo publica sensores al grafo ROS mediante puentes (bridges).'),
        apunte('Sim-to-real', 'Lo que funciona en simulación no siempre funciona en el robot real. Aleatoriza masa, fricción, retardos e iluminación durante el entrenamiento (domain randomization) y ajusta con datos reales. Es el puente entre MuJoCo/Isaac y el hardware.'),
        diagrama('sim2real', 'Entrenar en sim → aleatorizar → transferir → ajustar.'),
        aviso('Un simulador con parámetros de física inventados te dará una falsa sensación de éxito. Comprueba que la masa, la inercia, la fricción y los límites de los joints coinciden con el robot real antes de confiar en los resultados.'),
      ],
        errors: [
          err('El robot flota o cae raro en Gazebo', 'Inercia o colisiones mal definidas en el URDF', 'Revisa <inertial> y <collision>.'),
          err('Los sensores no aparecen en ROS', 'Falta el bridge o el plugin', 'Lanza ros_gz_bridge o el plugin de gz_ros2_control.')
        ],
        practice: { task: 'Carga tu robot en Gazebo con un lidar y un IMU, arranca ros2_control y verifica /scan y /imu en RViz.', success: ['El robot se apoya bien', '/scan y /imu se publican', 'El mismo URDF sirve para sim y real'] },
        quiz: [q('¿Qué simulador suele elegirse para RL de manipulación con contacto preciso?', ['Gazebo', 'MuJoCo', 'RViz', 'rosbag'], 1, 'MuJoCo es rápido y muy preciso en dinámica y contacto.')],
      tags: ['ros2', 'gazebo', 'simulación']
    }),

    L({
      id: 'r7-10', title: 'SLAM, Nav2, MoveIt 2 y testing en ROS 2', min: 22, level: 'avanzado',
      objectives: ['Contrastar SLAM, navegación y manipulación', 'Verificar sistemas ROS 2 con pruebas automatizadas'],
      blocks: [
        p('Llegamos a la capa de "robot que hace cosas". SLAM construye un mapa y se localiza; Nav2 lleva al robot de un punto a otro; MoveIt 2 mueve un brazo sin chocar. Tres problemas distintos que comparten el mismo grafo ROS 2.'),
        h('SLAM: mapa + localización'),
        diagrama('slam', 'Sensor + odometría → grafo con loop closure → occupancy grid.'),
        tabla(['Herramienta', 'Sensor', 'Salida'], [
          ['SLAM Toolbox', 'LIDAR 2D', 'Mapa 2D + map→odom'],
          ['RTAB-Map', 'RGB-D / estéreo', 'Mapa 3D, nube y grafo'],
          ['Cartographer', 'LIDAR / IMU', 'Mapa 2D/3D de Google']
        ]),
        apunte('Loop closure', 'La odometría siempre deriva; SLAM detecta cuando vuelves a un sitio ya visto y añade una restricción al grafo. Esa corrección es lo que publica en map→odom.'),
        h('Nav2: navegación'),
        diagrama('nav2', 'Costmap → planner global → controller local → comportamiento BT.'),
        codigo('bash', `ros2 launch slam_toolbox online_async_launch.py
ros2 launch nav2_bringup navigation_launch.py
ros2 action send_goal /navigate_to_pose \\
  nav2_msgs/action/NavigateToPose "{pose: {pose: {position: {x: 2.0, y: 1.0}}}}"`
        ),
        h('MoveIt 2: manipulación'),
        diagrama('moveit', 'Planning scene → IK → planner sin colisiones → ros2_control.'),
        p('MoveIt 2 toma una pose deseada del efector final, resuelve la cinemática inversa a ángulos de articulación y busca una trayectoria libre de colisiones usando el planning scene. Luego la ejecuta a través de ros2_control. Es la herramienta estándar para brazos.'),
        h('Testing y C++/Python en ROS 2'),
        codigo('python', `import pytest
import rclpy
from mi_paquete.sumador import sumar

def test_suma():
    assert sumar(2, 3) == 5

# Prueba de nodo con launch_testing
# colcon test --packages-select mi_paquete
# colcon test-result --verbose`, 'colcon test ejecuta pytest o gtest y da un informe de resultados.'),
        tabla(['Herramienta', 'Lenguaje', 'Uso'], [
          ['launch_testing', 'Python', 'Arrancar nodos y comprobar topics'],
          ['pytest', 'Python', 'Pruebas unitarias de lógica'],
          ['gtest', 'C++', 'Pruebas unitarias de nodos C++'],
          ['colcon test', 'Ambos', 'Ejecutar toda la batería']
        ]),
        apunte('Elegir lenguaje', 'Python para prototipar, herramientas y nodos de alto nivel; C++ para control de bajo nivel, nodos con alta tasa y librerías de rendimiento. En un robot real conviven ambos sin problema.'),
        aviso('Prueba SIEMPRE con rosbag o en simulación antes de soltar un sistema de navegación o manipulación en el robot real: un planner mal configurado puede chocar o hacer movimientos bruscos.'),
      ],
        errors: [
          err('Nav2 no planifica ninguna ruta', 'Costmap vacío o robot fuera del mapa', 'Visualiza el costmap en RViz y verifica la pose inicial con /initialpose.'),
          err('MoveIt dice "no IK solution"', 'Pose inalcanzable o límites de joint Incorrectos', 'Comprueba los límites en el URDF y los límites del solver.')
        ],
        practice: { task: 'Con un rosbag de un recorrido, ejecuta SLAM Toolbox y Nav2 en simulación. Luego escribe una prueba pytest que verifique que tu controlador respeta vel_max.', success: ['El mapa se construye', 'Nav2 llega al objetivo', 'colcon test pasa'] },
        quiz: [q('¿Quién publica la transformada map→odom?', ['La odometría', 'SLAM', 'MoveIt', 'RViz'], 1, 'SLAM corrige la deriva de la odometría mediante map→odom.')],
      tags: ['ros2', 'slam', 'nav2', 'moveit', 'testing']
    })
  ])
];