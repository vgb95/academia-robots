// Base de conocimiento de diagnóstico para la academia.
// 110 entradas: 65 de robótica (rob-) y 45 de IA (ai-).
// Cada entrada describe un sintoma observable, causas probables con
// comprobación y reparación concretas, y una medida preventiva.

export type TroubleEntry = {
  id: string;
  track: 'robotica' | 'ai';
  category: string;
  symptom: string;
  causes: { cause: string; check: string; fix: string }[];
  prevention: string;
};

export const troubleshooting: TroubleEntry[] = [
  // =====================================================================
  // ROBÓTICA (65)
  // =====================================================================

  {
    id: 'rob-led-off',
    track: 'robotica',
    category: 'electrónica',
    symptom: 'El LED de estado no enciende al dar alimentación, aunque la placa parece recibir tensión.',
    causes: [
      { cause: 'LED soldado al revés (ánodo y cátodo invertidos).', check: 'Mide con un multímetro en modo diodo: debe dar ~1.8 V (rojo) o ~2.1 V (blanco) en un sentido y abrir en el otro; comprueba la pata larga hacia VCC.', fix: 'Desolda y vuelve a colocar el LED con el ánodo (pata larga) hacia la resistencia y el cátodo a masa.' },
      { cause: 'Resistencia limitadora ausente, quemada o de valor demasiado alto.', check: 'Mide la resistencia en circuito; calcula R = (Vcc - Vf) / If (p. ej. 5 V - 2 V a 10 mA = 300 Ω).', fix: 'Sustituye por una resistencia de 220–470 Ω según la tensión y el color del LED.' },
      { cause: 'Pin GPIO configurado como entrada o en nivel bajo por error de firmware.', check: 'Lee el estado del pin con un medidor lógico o añade un log: ¿el pin se configura como OUTPUT y se escribe HIGH?', fix: 'Configura el pin como salida en setup() y activa el nivel correcto (recuerda si el LED es activo-bajo).' },
      { cause: 'Alimentación real ausente por fusible fundido o conector suelto.', check: 'Mide Vcc en el riel de 5 V/3.3 V con el multímetro, no solo mires el cable.', fix: 'Reemplaza el fusible, revisa el conector y verifica la continuidad del riel.' }
    ],
    prevention: 'Diseña con resistencias limitadoras calculadas, añade un LED de energía directo a VCC independiente del firmware y verifica la polaridad con el multímetro antes de soldar.'
  },
  {
    id: 'rob-motor-stall',
    track: 'robotica',
    category: 'motores',
    symptom: 'El motor de CC zumba pero no gira, o gira solo si lo empujas con la mano.',
    causes: [
      { cause: 'Corriente insuficiente: se alimenta el motor desde el regulador 5 V del microcontrolador.', check: 'Mide la tensión en los bornes del motor bajo carga; si cae por debajo del 80 % del nominal, la fuente se hunde.', fix: 'Alimenta el motor desde una fuente o batería separada con soca común entre masas y un driver (L298N, TB6612, DRV8833).' },
      { cause: 'Señal PWM en un pin que no soporta PWM por hardware.', check: 'Consulta el mapa de pines: ¿el pin tiene salida PWM/timer? Mide con osciloscopio si hay tren de pulsos.', fix: 'Mueve la señal a un pin PWM por hardware y usa analogWrite()/ledcWrite() con la frecuencia adecuada.' },
      { cause: 'Freno del driver activo (pin EN/STBY en nivel incorrecto).', check: 'Mide el pin de enable/standby del driver; debe estar en el nivel que habilita el puente H.', fix: 'Activa correctamente EN/STBY en el init y comprueba la lógica activa-baja de tu driver concreto.' },
      { cause: 'Obstrucción mecánica o eje trabado.', check: 'Desacopla el motor del mecanismo y gira el eje a mano; debe girar libre y sin rozamiento.', fix: 'Libera el engranaje atascado, ajusta el apriete y revisa que no haya viruta o pieza que roce.' }
    ],
    prevention: 'Dimensiona la fuente para el pico de corriente de arranque (2–3 veces el nominal), separa la alimentación lógica de la de potencia y añade un fusible o limitador de corriente.'
  },
  {
    id: 'rob-motor-reversed',
    track: 'robotica',
    category: 'motores',
    symptom: 'El motor gira en sentido contrario al esperado y el robot avanza hacia atrás.',
    causes: [
      { cause: 'Cableado del motor invertido en el puente H.', check: 'Etiqueta los cables y sigue la ruta hasta OUT1/OUT2 del driver; compara con el esquema.', fix: 'Intercambia los dos cables del motor o invierte la lógica en el código (IN1/IN2).' },
      { cause: 'Convención de signo distinta entre librería y chasis.', check: 'Imprime el valor de la consigna y compara: ¿+1 en el código produce giro hacia delante en las dos ruedas?', fix: 'Aplica un factor -1 a la consigna del lado que corresponda y documenta la convención en el código.' },
      { cause: 'Motores izquierdo y derecho montados con orientación opuesta.', check: 'Con el robot en el aire, envía la misma consigna a ambos y observa si giran en direcciones opuestas respecto al chasis.', fix: 'Invierte la señal del motor montado al revés; los dos deben avanzar en la misma dirección física.' },
      { cause: 'Encoder con signo invertido que engaña al controlador de velocidad.', check: 'Gira el eje a mano y observa el conteo: ¿debería ser positivo y sale negativo?', fix: 'Invierte el canal A/B en el código del encoder o cambia el signo del factor de conversión.' }
    ],
    prevention: 'Define una convención única de signo (+ = avanzar), etiqueta los cables del chasis y añade un test de "giro hacia delante" en el arranque.'
  },
  {
    id: 'rob-motor-hot',
    track: 'robotica',
    category: 'motores',
    symptom: 'El motor se calienta mucho en funcionamiento normal y huele a aislamiento caliente.',
    causes: [
      { cause: 'Corriente de parada (stall) sostenida por carga excesiva o PWM demasiado bajo.', check: 'Mide la corriente con una pinza amperimétrica o un sensor INA219; compárala con el nominal y con la de arranque.', fix: 'Reduce la carga, aumenta el ciclo útil mínimo o usa un motor con más par; nunca dejes el motor bloqueado más de unos segundos.' },
      { cause: 'PWM con frecuencia demasiado baja que produce pulsos de corriente grandes.', check: 'Mide la frecuencia de la señal: por debajo de ~1 kHz el par es pulsante y el calentamiento sube.', fix: 'Sube la frecuencia PWM a 10–20 kHz (por encima del rango audible) manteniendo el mismo ciclo útil.' },
      { cause: 'Bobenado en corto parcial o devanado dañado.', check: 'Con el motor desconectado mide la resistencia entre bornes y compárala con un motor bueno; también mide aislamiento a la carcasa.', fix: 'Sustituye el motor: un devanado en corto no se repara de forma fiable.' },
      { cause: 'Puente H en línea recta por solape de señales (shoot-through).', check: 'Usa un osciloscopio en las dos patas del puente: ¿se solapan los pulsos de alta y baja?', fix: 'Usa un driver con tiempo muerto integrado y verifica que nunca se activan HIGH y LOW simultáneos.' }
    ],
    prevention: 'Añade un limitador o sensor de corriente con corte por sobrecarga, usa drivers con protección térmica y elige motor con margen de par del 30–50 %.'
  },
  {
    id: 'rob-brownout',
    track: 'robotica',
    category: 'alimentación',
    symptom: 'El microcontrolador se reinicia justo cuando el motor arranca (brownout), se pierde el estado y vuelve a ejecutar setup().',
    causes: [
      { cause: 'Caída de tensión en el riel lógica por compartir fuente con el motor.', check: 'Con un osciloscopio en modo captura única, observa Vcc del MCU al arrancar el motor; busca caídas por debajo del umbral de brownout.', fix: 'Separa las alimentaciones, une las masas en un único punto (star ground) y añade un regulador dedicado para la lógica.' },
      { cause: 'Condensadores de desacoplo insuficientes o mal situados.', check: 'Revisa si hay 100 nF cerca de cada pin de alimentación del MCU y 470–1000 µF en la entrada del driver.', fix: 'Añade 100 nF en paralelo en los pines Vcc/GND del chip y un electrolítico grande en el riel de motor.' },
      { cause: 'Cables finos o largos que añaden resistencia e inductancia.', check: 'Mide la caída de tensión entre la fuente y la placa con el motor en arranque; más de 0.3 V es sospechoso.', fix: 'Usa cable más grueso, acorta las distancias y emplea bornes de tornillo en lugar de jumpers para la potencia.' },
      { cause: 'Umbral de brownout del fusible/software mal configurado.', check: 'Consulta los fuses del micro (BODLEVEL) y los logs de reinicio para identificar la causa del reset.', fix: 'Ajusta el nivel de brownout a la tolerancia real de la fuente o desactívalo solo si la alimentación es estable.' }
    ],
    prevention: 'Dimensiona la fuente para el pico de arranque, desacopla cada etapa, usa masa en estrella y aplica rampas de aceleración (soft-start) en el control del motor.'
  },
  {
    id: 'rob-adc-noise',
    track: 'robotica',
    category: 'sensores',
    symptom: 'La lectura ADC de un sensor analógico salta varios bits incluso con el sensor inmóvil.',
    causes: [
      { cause: 'Ruido eléctrico acoplado desde el motor o la conmutación PWM.', check: 'Detén el motor y compara la desviación de la lectura; si baja drásticamente, el ruido es conductivo o radiado.', fix: 'Usa cable apantallado con la malla a masa en un extremo, aleja el cable del motor y añade un filtro RC (p. ej. 1 kΩ + 100 nF).' },
      { cause: 'Fuente de referencia ADC inestable.', check: 'Mide AREF con el multímetro y compártela con una lectura conocida; si AREF oscila, todas las lecturas oscilan.', fix: 'Usa la referencia interna (p. ej. 2.56 V o 3.3 V) con un condensador en AREF, o añade una referencia externa precisa.' },
      { cause: 'Señal de entrada de alta impedancia sin buffer.', check: 'Mide la impedancia de salida del sensor; si es alta, el ADC muestrea y descarga el nodo en cada conversión.', fix: 'Añade un seguidor de voltaje con op-amp entre el sensor y el ADC.' },
      { cause: 'Promediado insuficiente o muestreo en un cruce de conmutación.', check: 'Muestra 64 lecturas y calcula desviación estándar; sincroniza la captura lejos de los flancos PWM.', fix: 'Aplica media móvil o filtro mediano y muestrea justo después del flanco deactualización del sensor.' }
    ],
    prevention: 'Diseña el cableado analógico separado del de potencia, desacopla la referencia, filtra en hardware y valida la señal con un osciloscopio antes de fiarte del valor.'
  },
  {
    id: 'rob-button-bounce',
    track: 'robotica',
    category: 'firmware',
    symptom: 'Una sola pulsación del botón dispara dos o más acciones (doble pulso).',
    causes: [
      { cause: 'Rebote mecánico del contacto (bounce) interpretado como varios flancos.', check: 'Mira la señal con un osciloscopio o cuenta los flancos en el ISR: verás varias transiciones en ~5–20 ms.', fix: 'Implementa debounce por software (ignora flancos durante 50 ms) o un filtro RC de 10 kΩ + 100 nF con Schmitt trigger.' },
      { cause: 'ISR que detecta ambos flancos (CHANGE) en lugar de solo uno.', check: 'Revisa attachInterrupt: ¿usas RISING, FALLING o CHANGE?', fix: 'Usa un único flanco y bloquea las interrupciones durante el periodo de debounce.' },
      { cause: 'Variable de estado compartida sin volatile o sin protección.', check: 'Revisa si la variable flags se declara volatile y si se modifica dentro de la ISR.', fix: 'Declara la bandera como volatile, cópiala con interrupciones desactivadas y procésala en el bucle principal.' },
      { cause: 'Cable del botón muy largo actuando como antena.', check: 'Acorta el cable o añade una resistencia pull-down/pull-up fuerte (4.7 kΩ) y comprueba si desaparecen los falsos flancos.', fix: 'Usa pull-up interno o externo, cable corto y filtro RC en la entrada.' }
    ],
    prevention: 'Añade debounce desde el primer prototipo (hardware o software), usa interrupciones con un único flanco y declara volatile las variables compartidas con ISRs.'
  },
  {
    id: 'rob-i2c-missing',
    track: 'robotica',
    category: 'sensores',
    symptom: 'El escáner I2C no encuentra el dispositivo (i2cdetect muestra "--" en la dirección esperada).',
    causes: [
      { cause: 'Dirección I2C equivocada (el sensor usa 0x68 y buscas 0x69, o hay conflictos).', check: 'Ejecuta un escaneo de direcciones y compara con la hoja de datos; revisa pines AD0/SA0 que cambian la dirección.', fix: 'Corrige la dirección en el código y asegúrate de que dos dispositivos no compartan la misma.' },
      { cause: 'Cables SDA/SCL invertidos o sin conexión.', check: 'Mide continuidad y verifica con el esquema: SDA al pin de datos, SCL al reloj; mide ~3.3 V en reposo en ambos.', fix: 'Reconecta SDA/SCL correctamente y asegura masa común entre dispositivos.' },
      { cause: 'Falta de resistencias pull-up en SDA/SCL.', check: 'Mide la tensión en reposo: si está por debajo de ~2 V con 3.3 V de lógica, faltan pull-ups.', fix: 'Añade resistencias de 4.7 kΩ (o 2.2 kΩ para buses largos) de SDA y SCL a Vcc.' },
      { cause: 'Sensor en modo sleep o con el pin de reset activo.', check: 'Comprueba el pin de enable/reset y el registro de control según el datasheet.', fix: 'Alimenta el pin de enable, saca el dispositivo de sleep escribiendo el registro de control y espera el tiempo de arranque.' }
    ],
    prevention: 'Verifica la dirección y los pines con el datasheet antes de soldar, incluye pull-ups en el diseño y deja un pin de enable accesible paraforzar reinicio del sensor.'
  },
  {
    id: 'rob-servo-jitter',
    track: 'robotica',
    category: 'motores',
    symptom: 'El servo tiembla, vibra o hace micro-movimientos incluso sin cambios en la consigna.',
    causes: [
      { cause: 'Alimentación insuficiente o ruidosa para el servo.', check: 'Mide la tensión en el servo al moverse; las caídas por debajo de 4.8 V causan temblor.', fix: 'Alimenta el servo con una fuente dedicada de 5–6 V y capacidad de 1–2 A, con masa común y un condensador de 470 µF cerca del conector.' },
      { cause: 'Señal PWM inestable o con frecuencia incorrecta (debe ser ~50 Hz).', check: 'Mide el periodo con un osciloscopio: 20 ms, con pulso de 1–2 ms.', fix: 'Genera la señal con un timer de hardware a 50 Hz y usa pulsos estables; evita SoftwarePWM que titubea.' },
      { cause: 'Bucle de control con ganancia excesiva (PID agresivo) en servos continuos.', check: 'Reduce la ganancia proporcional y observa si desaparece la oscilación.', fix: 'Baja Kp, añade un pequeño termino derivativo y filtra la consigna.' },
      { cause: 'Juego mecánico (backlash) en los engranajes del servo.', check: 'Mueve el brazo a mano con el servo apagado: si hay holgura, el controlador compensa sin parar.', fix: 'Ajusta o sustituye el servo; usa servos con engranajes metálicos y menor backlash para cargas precisas.' }
    ],
    prevention: 'Usa fuente dedicada y bien desacoplada para servos, PWM por hardware a 50 Hz y un muerto (deadband) en la consigna para evitar micro-correcciones.'
  },
  {
    id: 'rob-stepper-lost-steps',
    track: 'robotica',
    category: 'motores',
    symptom: 'El motor paso a paso pierde pasos: la posición final no coincide con las órdenes enviadas.',
    causes: [
      { cause: 'Aceleración demasiado alta para el par disponible.', check: 'Reduce la aceleración en el driver (parámetro ACCEL) y comprueba si el error desaparece.', fix: 'Usa rampas trapezoidales/S-curve con aceleración suave y respeta el parcurva de tu motor.' },
      { cause: 'Corriente de fase insuficiente o mal configurada en el driver.', check: 'Mide la corriente con el motor en marcha y compárala con la nominal; revisa los dip-switches o el registro VREF.', fix: 'Ajusta VREF/corriente al 70–90 % del nominal del motor sin exceder la capacidad del driver.' },
      { cause: 'Frecuencia de pulsos por encima del máximo del driver o del microcontrolador.', check: 'Calcula pasos/s y compruébalo frente al tiempo mínimo de pulso del driver (p. ej. 2 µs).', fix: 'Baja la velocidad, usa un driver con optoacopladores rápidos o un timer de hardware para generar los pulsos.' },
      { cause: 'Carga mecánica o fricción superior al par de retención.', check: 'Desacopla el eje y ejecuta el mismo movimiento: si va perfecto, la carga es la culpable.', fix: 'Reduce la carga, mejora la lubricación o cambia a un motor con mayor par o reductora.' }
    ],
    prevention: 'Usa control en lazo cerrado con encoder o endstops de referencia, aplica rampas suaves y dimensiona corriente y par con margen.'
  },
  {
    id: 'rob-encoder-wrong',
    track: 'robotica',
    category: 'sensores',
    symptom: 'El encoder cuenta mal: el conteo no corresponde a la distancia o cambia de signo de forma aleatoria.',
    causes: [
      { cause: 'Ruido en las señales A/B por falta de filtrado o cables largos.', check: 'Observa las señales con un analizador lógico: ¿hay rebotes o transiciones espurias?', fix: 'Usa entradas con Schmitt trigger, resistencias pull-up y cables cortos apantallados; activa el filtro de entradas del timer.' },
      { cause: 'Frecuencia de transición demasiado alta para la ISR del microcontrolador.', check: 'Calcula pulsos/s = (rpm/60) · pulsos por vuelta y compáralo con la capacidad de interrupciones.', fix: 'Usa el modo encoder por hardware del timer o un contador dedicado (LS7366) en lugar de interrupciones por software.' },
      { cause: 'Orden de fases A/B invertido (signo incorrecto).', check: 'Gira el eje en un sentido y verifica si el conteo aumenta o disminuye.', fix: 'Intercambia los canales A y B o aplica un signo negativo al factor de conversión.' },
      { cause: 'Pulses per revolution (PPR) mal configurado en el código.', check: 'Gira exactamente una vuelta y compara el conteo con el PPR declarado (recuerda el modo x4).', fix: 'Corrige el PPR y el modo de decodificación (x1, x2, x4) en el cálculo de distancia.' }
    ],
    prevention: 'Usa decodificación por hardware, cableado corto y apantallado, y calibra el PPR con una vuelta manual documentada en el código.'
  },
  {
    id: 'rob-lipo-not-charging',
    track: 'robotica',
    category: 'alimentación',
    symptom: 'La batería LiPo no carga: el cargador marca error o el estado de carga no avanza.',
    causes: [
      { cause: 'Balanceador desconectado o conector de balanceo dañado.', check: 'Mide cada celda en el conector de balanceo: cada una debe estar entre 3.0 y 4.2 V', fix: 'Reconecta el balanceador con la polaridad correcta y sustituye el conector si algún pin no hace contacto.' },
      { cause: 'Batería por debajo del voltaje mínimo por descarga profunda.', check: 'Mide el voltaje total: si está por debajo de ~3.0 V por celda, muchos cargadores se niegan a arrancar.', fix: 'Usa el modo de recuperación del cargador o un cargador con modo "boost" muy supervisado; si no recupera, desecha la batería con seguridad.' },
      { cause: 'Cargador con corriente o perfil equivocado (Li-Ion vs LiPo, 2S vs 3S).', check: 'Revisa la configuración del cargador: número de celdas y química deben coincidir con la batería.', fix: 'Configura el número de celdas y el tipo correctos, y usa corriente de carga de 1C como máximo.' },
      { cause: 'Cables de carga o contactos sucios/oxidados.', check: 'Mide continuidad y busca óxido o mellas en los conectores XT60/XT30 y de balanceo.', fix: 'Limpia los contactos con alcohol isopropílico y sustituye los cables o conectores dañados.' }
    ],
    prevention: 'Carga siempre con balanceador, nunca dejes una LiPo descargada, guarda a ~3.8 V por celda y usa bolsa ignífuga para almacenar y cargar.'
  },
  {
    id: 'rob-solder-smoke',
    track: 'robotica',
    category: 'soldadura',
    symptom: 'Sale humo y olor acre al soldar, con aspecto de plastico fundido.',
    causes: [
      { cause: 'Temperatura del cautín demasiado alta o contacto prolongado sobre el componente.', check: 'Mide la temperatura del cautín: 320–350 °C para estaño normal, 250–280 °C para soldadura sin plomo.', fix: 'Baja la temperatura, limita el contacto a 2–3 s por pata y usa puntas adecuadas al tamaño de la soldadura.' },
      { cause: 'Quemadura de aislamiento de cable o de plástico cercano.', check: 'Inspecciona el area: ¿el cautín toca el conector de plastico o el revestimiento del cable?', fix: 'Retira el plastico derretido, recorta y rehace la conexión, y protege los conectores con cinta de kapton.' },
      { cause: 'Flujo o pasta de soldar en exceso que se quema.', check: 'Observa si el humo sale del área con pasta: demasiado flujo genera humo blanco irritante.', fix: 'Usa la mínima cantidad de flujo y limpia el residuo con alcohol isopropílico después de soldar.' },
      { cause: 'Componente equivocado (p. ej. un regulador o condensador polarizado al revés) que se sobrecalienta.', check: 'Identifica el componente humeante y verifica su orientación y valores frente al esquema.', fix: 'Desuelda de inmediato, sustituye el componente y corrige la orientación antes de volver a alimentar.' }
    ],
    prevention: 'Trabaja con extracción de humos, controla la temperatura del cautín, usa estaño con flujo adecuado y revisa polaridades antes de energizar.'
  },
  {
    id: 'rob-cold-joint',
    track: 'robotica',
    category: 'soldadura',
    symptom: 'El circuito funciona de forma intermitente: falla al mover la placa o al calentarse.',
    causes: [
      { cause: 'Unión fría por cautín insuficiente o superficie oxidada.', check: 'Inspecciona con lupa: soldadura opaca, agrietada o con forma de bola; mueve suavemente el componente con un palillo.', fix: 'Recalienta la unión con flujo hasta que brille y fluya, limpiando los restos de flujo antes.' },
      { cause: 'Pata del componente o pad oxidados.', check: 'Frota suavemente con alcohol o lija fina y observa si la soldadura moja mejor.', fix: 'Limpia pads y patas, aplica flujo y vuelve a soldar con temperatura correcta.' },
      { cause: 'Ciclos térmicos que agrietan una unión previamente buena.', check: 'Localiza la unión que falla al presionar o calentar con el cautín sin estaño.', fix: 'Refuerza la soldadura, alivia tensiones mecánicas y añade soporte para componentes pesados.' },
      { cause: 'Demasiado estaño que crea puentes o contactos falsos.', check: 'Busca puentes entre pads vecinos con lupa o continuidad.', fix: 'Retira el exceso con mecha de estaño y vuelve a soldar con la cantidad justa.' }
    ],
    prevention: 'Limpia pads y patas antes de soldar, usa flujo, controla temperatura y tiempo, e inspecciona visualmente cada unión con lupa al terminar.'
  },
  {
    id: 'rob-imu-drift',
    track: 'robotica',
    category: 'sensores',
    symptom: 'La IMU deriva: la orientación estimada gira lentamente aunque el robot esté quieto.',
    causes: [
      { cause: 'Bias del giroscopio no calibrado.', check: 'Deja la IMU inmóvil 10 s y promedia la salida del giro: si no es ~0 °/s, hay bias.', fix: 'Calibra el bias en reposo y restalo en el código (o usa la rutina de calibración del fabricante).' },
      { cause: 'Acelerómetro sin calibrar (offset y escala).', check: 'Coloca la IMU en 6 orientaciones y comprueba que la gravedad dé ~1 g en cada eje.', fix: 'Ejecuta una calibración de 6 posiciones para corregir offset y matriz de escala.' },
      { cause: 'Vibraciones mecánicas que contaminan el acelerómetro.', check: 'Compara la señal con el motor parado y en marcha; las vibraciones aparecen como ruido de alta frecuencia.', fix: 'Monta la IMU sobre espuma o almohadillas antivibratorias, bien fija y lejos de motores.' },
      { cause: 'Fusión de sensores mal sintonizada (filtro de Kalman/complementary mal ajustado).', check: 'Ajusta las covarianzas Q y R: si el modelo confía demasiado en el giro, deriva; si en el acel, tiembla.', fix: 'Sintoniza las ganancias del filtro y añade corrección de magnetómetro o de odometría cuando sea válida.' }
    ],
    prevention: 'Calibra la IMU al arranque con el robot quieto, aísla vibraciones y usa fusión de sensores con covarianzas documentadas.'
  },
  {
    id: 'rob-ultrasonic-zero',
    track: 'robotica',
    category: 'sensores',
    symptom: 'El sensor ultrasónico devuelve siempre 0 o valores congelados.',
    causes: [
      { cause: 'Trigger no enviado o timing de pulso incorrecto.', check: 'Mide con osciloscopio el pin TRIG: debe ser un pulso de ~10 µs.', fix: 'Genera un pulso de 10 µs, baja el pin y espera el eco con pulseIn con timeout adecuado.' },
      { cause: 'Timeout demasiado corto o distancia fuera de rango.', check: 'Calcula el tiempo máximo: 4 m ida y vuelta son ~23 ms; si tu timeout es menor, dará 0.', fix: 'Aumenta el timeout a al menos 30–50 ms y descarta lecturas fuera del rango útil del sensor (2–400 cm).' },
      { cause: 'Superficie demasiado blanda o inclinada que no refleja el eco.', check: 'Apunta el sensor a una pared rígida y plana a 50 cm: ¿aparece una lectura correcta?', fix: 'Coloca una superficie reflectante de prueba, orienta el sensor perpendicular y promedia varias lecturas.' },
      { cause: 'Cables TRIG/ECHO invertidos o pin ECHO sin entrada.', check: 'Verifica el cableado y mide el pin ECHO durante un disparo: ¿sube cuando vuelve el eco?', fix: 'Corrige el cableado y configura ECHO como entrada; añade un divisor de voltaje si el sensor da 5 V a un MCU de 3.3 V.' }
    ],
    prevention: 'Usa un timeout generoso, promedia lecturas con filtro mediano, añade divisor de voltaje en ECHO y coloca el sensor lejos de fuentes de ruido ultrasónico.'
  },
  {
    id: 'rob-lidar-no-scan',
    track: 'robotica',
    category: 'ROS 2',
    symptom: 'El LIDAR no publica el topic /scan o este se queda vacío.',
    causes: [
      { cause: 'Driver no iniciado o parámetros de puerto/velocidad erróneos.', check: 'Revisa los logs del nodo del driver y comprueba el puerto serie (p. ej. /dev/ttyUSB0) y el baudrate.', fix: 'Corrige el puerto y el baudrate en el launch, y da permisos al usuario (dialout) si hace falta.' },
      { cause: 'Motor del LIDAR sin girar por falta de alimentación o cableado.', check: 'Mira si el tambor gira y mide la tensión de alimentación del LIDAR.', fix: 'Alimenta correctamente el LIDAR (muchos requieren 5 V y ~1 A) y revisa los cables del motor.' },
      { cause: 'QoS incompatible entre el driver y los suscriptores.', check: 'Usa ros2 topic info -v /scan para ver el perfil de fiabilidad del publisher y del subscriber.', fix: 'Iguala los perfiles QoS (reliability/durability) o usa un relay con QoS sobreescrito.' },
      { cause: 'Frame del LIDAR no definido o transformación faltante.', check: 'Comprueba con ros2 topic echo /scan el header.frame_id y si existe en elárbol TF.', fix: 'Publica la transformación laser_frame → base_link con un static_transform_publisher o robot_state_publisher.' }
    ],
    prevention: 'Verifica puerto, permisos y alimentación del LIDAR al arrancar, documenta el frame_id y valida el topic con ros2 topic hz /scan antes de seguir.'
  },
  {
    id: 'rob-rviz-empty',
    track: 'robotica',
    category: 'ROS 2',
    symptom: 'RViz no muestra el robot: la escena está vacía o el modelo aparece en el origen deformado.',
    causes: [
      { cause: 'Fixed Frame inexistente en el árbol TF.', check: 'Mira el recuadro rojo "Fixed Frame [map] does not exist" y ejecuta ros2 run tf2_tools view_frames.', fix: 'Publica la transformación del frame fijo o cambia el Fixed Frame de RViz a uno que exista (p. ej. base_link).' },
      { cause: 'robot_state_publisher no publicando las transforms del robot.', check: 'Ejecuta ros2 run tf2_ros tf2_echo base_link <frame> y comprueba si hay transformaciones.', fix: 'Lanza robot_state_publisher con el URDF correcto y verifica que el parámetro robot_description esté cargado.' },
      { cause: 'URDF/xacro con errores o referencias a mallas (meshes) inexistentes.', check: 'Ejecuta check_urdf o abre el URDF en RViz y lee los errores de parser en la terminal.', fix: 'Corrige el XML, usa rutas package:// válidas y valida el xacro con xacro --inorder antes de lanzarlo.' },
      { cause: 'DDS descubre mal los nodos (dominio o multicast distinto).', check: 'Comprueba ROS_DOMAIN_ID y usa ros2 node list para ver si RViz ve los topics.', fix: 'Igualiza ROS_DOMAIN_ID, verifica la red multicast o usa ROS_LOCALHOST_ONLY para pruebas locales.' }
    ],
    prevention: 'Validación temprana del URDF, un launch que arranque siempre robot_state_publisher y comprobación del árbol TF antes de abrir RViz.'
  },
  {
    id: 'rob-tf-broken',
    track: 'robotica',
    category: 'ROS 2',
    symptom: 'El árbol TF está roto: faltan transformaciones, hay ciclos o los frames no conectan.',
    causes: [
      { cause: 'Static transform publisher con nombres de frame incorrectos (barra inicial o typo).', check: 'Lista los frames con ros2 run tf2_tools view_frames y compara los nombres con los del código.', fix: 'Corrige los nombres de parent/child (sin barra inicial) y vuelve a publicar la transformación estática.' },
      { cause: 'Dos nodos publican la misma transformación con valores distintos.', check: 'Usa ros2 run tf2_ros tf2_monitor para detectar productos con el mismo frame_id y timestamps dispares.', fix: 'Elimina al publicador duplicado o usa un único robot_state_publisher como fuente de verdad.' },
      { cause: 'Transformaciones con timestamps en el futuro por reloj desincronizado.', check: 'Compara la hora de las transformaciones con el reloj del sistema; buscas diferenias de segundos.', fix: 'Sincroniza el reloj (NTP/chrony) o usa /use_sim_time de forma coherente en todos los nodos.' },
      { cause: 'Ciclo en el árbol (A→B y B→A) que impide resolver transformaciones.', check: 'Revisa el grafo generado por view_frames buscando flechas en ambos sentidos.', fix: 'Rompe el ciclo eliminando una de las transformaciones y define una jerarquía única con base_link como raíz.' }
    ],
    prevention: 'Define un mapa de frames documentado, un único publicador por transformación y valida el árbol con view_frames en cada integración.'
  },
  {
    id: 'rob-no-ik',
    track: 'robotica',
    category: 'MoveIt',
    symptom: 'MoveIt responde "no IK solution" al planificar un movimiento del brazo.',
    causes: [
      { cause: 'Pose objetivo fuera del espacio de trabajo del brazo.', check: 'Mueve el objetivo más cerca del hombro y comprueba si aparece solución.', fix: 'Define objetivos alcanzables, limita la región de trabajo y usa restricciones realistas.' },
      { cause: 'Limitaciones de articulación (joint limits) mal definidas en el URDF/SRDF.', check: 'Revisa los límites inferior/superior y compara con los del robot real.', fix: 'Corrige los límites en el URDF y regenera la configuración de MoveIt.' },
      { cause: 'Semilla (seed state) del solver demasiado lejos de la solución.', check: 'Prueba con una pose inicial más cercana o con varios intentos de IK (num_attempts).', fix: 'Aumenta los intentos del solver, usa un seed razonable o usa el estado actual como punto de partida.' },
      { cause: 'Orientación del effector demasiado restrictiva para la cinemática del brazo.', check: 'Quita la restricción de orientación y comprueba si aparece solución.', fix: 'Relaja la orientación, usa position-only IK cuando sea suficiente o añade un solver de 6-DOF adecuado.' }
    ],
    prevention: 'Valida el espacio de trabajo con simulación, define límites correctos en el URDF y usa objetivos de prueba conocidos en los tests de integración.'
  },
  {
    id: 'rob-moveit-collision',
    track: 'robotica',
    category: 'MoveIt',
    symptom: 'MoveIt choca o se niega a planificar porque considera que el robot ya está en colisión.',
    causes: [
      { cause: 'Malla de colisión (collision mesh) demasiado conservadora o mal alineada.', check: 'Visualiza los objetos de colisión en RViz y compara con el visual mesh.', fix: 'Usa geometries primitives (caja/cilindro) ajustadas o simplifica la malla de colisión.' },
      { cause: 'Estado inicial del robot no coincide con la posición real (joint states desactualizados).', check: 'Compara /joint_states con la posición real del robot.', fix: 'Publica correctamente /joint_states desde los encoders y sincroniza el estado antes de planificar.' },
      { cause: 'Mesas u objetos del entorno no modelados en la escena de planificación.', check: 'Revisa la scene de MoveIt en RViz: ¿están las superficies con las que el brazo debe evitar chocar?', fix: 'Añade los objetos de colisión (collision objects) con sus dimensiones reales mediante MoveIt Planning Scene.' },
      { cause: 'Self-collision entre eslabones vecinos por URDF con geometrías solapadas.', check: 'Desactiva temporalmente la autocolisión y comprueba si el plan aparece.', fix: 'Ajusta las geometrías o el radio de padding (robot_radius) y activa la autocolisión solo con valores realistas.' }
    ],
    prevention: 'Modela la escena de trabajo con objetos reales, mantén /joint_states fiables y usa margen de colisión pequeño pero no nulo.'
  },
  {
    id: 'rob-nav2-no-plan',
    track: 'robotica',
    category: 'Nav2',
    symptom: 'Nav2 no planifica: el robot no se mueve hacia el objetivo o el planificador devuelve error.',
    causes: [
      { cause: 'Costmap lleno de obstáculos por sensor ruidoso o marcas incorrectas.', check: 'Visualiza el costmap en RViz: ¿hay celdas marcadas como ocupadas donde no hay nada?', fix: 'Ajusta los parámetros del costmap (obstacle_range, raytrace_range) y filtra lecturas erróneas del LIDAR.' },
      { cause: 'Robot fuera del footprint o goal en una celda marcada como letal.', check: 'Comprueba la posición del objetivo en el costmap y el footprint configurado.', fix: 'Coloca objetivos válidos dentro del mapa libre y revisa el footprint del robot en los parámetros.' },
      { cause: 'Transformaciones map↔odom↔base_link faltantes o desactualizadas.', check: 'Ejecuta tf2_echo map base_link y verifica que haya transformaciones continuas.', fix: 'Publica la odometría y la transformación odom→base_link, y usa AMCL o slam_toolbox para map→odom.' },
      { cause: 'Parámetros del planner (tolerancias, radii) inconsistentes con el robot.', check: 'Revisa los logs del planner server BUSINESS: ¿indica "goal is in collision" o "failed to create plan"?', fix: 'Ajusta xy_goal_tolerance, yaw_goal_tolerance y robot_radius a las dimensiones reales.' }
    ],
    prevention: 'Calibra sensores y costmaps con el robot quieto, valida el árbol TF y prueba objetivos simples antes de misiones complejas.'
  },
  {
    id: 'rob-gazebo-explodes',
    track: 'robotica',
    category: 'simulación',
    symptom: 'En Gazebo el modelo se comporta de forma errática: vuela, explota o se hunde en el suelo.',
    causes: [
      { cause: 'Masa o inercia del modelo irreales (p. ej. masa 0 o centrada mal).', check: 'Revisa los valores de <mass> y <inertia> en el URDF del modelo.', fix: 'Asigna masas e inertias realistas; usa calculos por elipsoide o herramientas como gazebo plugin de inercia.' },
      { cause: 'Colisiones solapadas entre eslabones que generan fuerzas de repulsion enormes.', check: 'Activa la vista de colisiones en Gazebo y busca eslabones que se intersectan.', fix: 'Ajusta las geometrias de colisión para que no se solapen en la posición inicial.' },
      { cause: 'Controlador aplicando esfuerzos excesivos o sin limitar (gain muy alto).', check: 'Revisa los PID del controlador en gazebo_control.yaml y los esfuerzos máximos.', fix: 'Reduce ganancias y limita los esfuerzos máximos de las articulaciones.' },
      { cause: 'Parámetros del motor de física (step size, solver iterations) inadecuados.', check: 'Revisa el world SDF: time_step y number of iterations del solver.', fix: 'Usa time_step de 0.001 s y aumenta las iteraciones del solver para mayor estabilidad.' }
    ],
    prevention: 'Valida masa e inercia de cada eslabón, evita colisiones solapadas y usa pasos de simulación pequeños con esfuerzos limitados.'
  },
  {
    id: 'rob-ros2-control-not-load',
    track: 'robotica',
    category: 'ROS 2',
    symptom: 'ros2_control no carga el controlador: el controller_manager no lo encuentra o falla al activarlo.',
    causes: [
      { cause: 'Plugin XML incorrecto o no exportado en el package.', check: 'Revisa el archivo de plugins y el <export> en package.xml; ejecuta ros2 control list_controller_types.', fix: 'Corrige el nombre del plugin y añade el export correcto; reinstala el paquete con colcon build.' },
      { cause: 'Faltan parámetros de hardware interface (joints, command/state interfaces).', check: 'Compara el <ros2_control> del URDF con los nombres de interfaces que espera el controlador.', fix: 'Declara las interfaces de estado y comando con los nombres exactos de las articulaciones.' },
      { cause: 'Nombre del controlador distinto entre el archivo de parámetros y el launch.', check: 'Ejecuta ros2 control list_controllers y compara con los nombres configurados.', fix: 'Unifica el nombre del controlador en la configuración YAML y en el comando de carga.' },
      { cause: 'Dependencias del controlador no instaladas en el entorno.', check: 'Ejecuta rosdep check o revisa si el paquete del controlador aparece en ros2 pkg list.', fix: 'Instala el paquete correspondiente (p. ej. ros-humble-diff-drive-controller) y hace source del entorno.' }
    ],
    prevention: 'Valida los nombres de interfaces con list_hardware_components, mantén un solo archivo de parámetros por robot y usa rosdep en CI.'
  },
  {
    id: 'rob-messages-not-arrive',
    track: 'robotica',
    category: 'ROS 2',
    symptom: 'Un nodo publica un topic pero el suscriptor no recibe mensajes.',
    causes: [
      { cause: 'Nombres de topic distintos por remapeo o typo.', check: 'Ejecuta ros2 topic list y ros2 topic info para comparar el nombre del publicador y del suscriptor.', fix: 'Corrige el nombre o usa remappings en el launch para unificarlos.' },
      { cause: 'QoS incompatible (fiabilidad, durabilidad o deadline).', check: 'Usa ros2 topic info -v /topic para ver los perfiles de ambos extremos.', fix: 'Iguala los perfiles QoS o usa un relay que adaptre la durabilidad (p. ej. transient_local).' },
      { cause: 'Dominio DDS distinto o redes separadas (ROS_DOMAIN_ID).', check: 'Compara echo $ROS_DOMAIN_ID en ambas máquinas y usa ros2 node list desde cada una.', fix: 'Configura el mismo ROS_DOMAIN_ID y asegura conectividad multicast o usa discovery server.' },
      { cause: 'Publicador muerto o publicando a muy baja frecuencia.', check: 'Ejecuta ros2 topic hz /topic y verifica la tasa real.', fix: 'Revisa el bucle del publicador, que no esté bloqueado, y ajusta la frecuencia esperada.' }
    ],
    prevention: 'Usa nombres de topic centralizados, documenta los perfiles QoS y comprueba ros2 topic hz + info en cada integración.'
  },
  {
    id: 'rob-timesync',
    track: 'robotica',
    category: 'ROS 2',
    symptom: 'Los mensajes llegan con timestamps incoherentes o los nodos usan relojes distintos (sim time).',
    causes: [
      { cause: 'Mezcla de reloj de sistema y /clock (use_sim_time) entre nodos.', check: 'Compara la hora de los mensajes con date +%s y revisa el parámetro use_sim_time de cada nodo.', fix: 'Activa use_sim_time de forma uniforme en todos los nodos cuando uses simulación o bag con reloj.' },
      { cause: 'Relojes de sistema desincronizados entre varias máquinas.', check: 'Compara date en cada equipo; diferencias de segundos rompen la fusión de sensores.', fix: 'Sincroniza con NTP/chrony o PTP (IEEE 1588) para sincronización de precisión.' },
      { cause: 'Publicador de /clock ausente en simulación o reproducción de bag.', check: 'Ejecuta ros2 topic hz /clock; si no hay datos, no hay fuente de tiempo simulado.', fix: 'Lanza Gazebo con el bridge de /clock o usa ros2 bag play --clock.' },
      { cause: 'Mensajes con stamps en el futuro por buffering o latencia de reloj.', check: 'Usa ros2 topic echo y compara header.stamp con el reloj local.', fix: 'Corrige la fuente del timestamp y añade tolerancia en la fusión de sensores (time tolerance).' }
    ],
    prevention: 'Decide una única fuente de tiempo por sistema, sincroniza relojes con NTP/PTP y activa use_sim_time de forma coherente.'
  },
  {
    id: 'rob-build-fail',
    track: 'robotica',
    category: 'build',
    symptom: 'El paquete ROS 2 no compila con colcon build: errores de CMake o de enlazado.',
    causes: [
      { cause: 'Dependencias no declaradas en package.xml o CMakeLists.txt.', check: 'Ejecuta rosdep check --from-paths . y revisa find_package()/ament_target_dependencies().', fix: 'Añade las dependencias faltantes en ambos archivos y ejecuta rosdep install.' },
      { cause: 'Entorno no cargado ( falta source /opt/ros/.../setup.bash).', check: 'Comprueba echo $AMENT_PREFIX_PATH: si está vacío, el entorno no está cargado.', fix: 'Haz source del setup de ROS y del workspace -> install/setup.bash antes de compilar.' },
      { cause: 'Errores de enlazado por bibliotecas no vinculadas (undefined reference).', check: 'Lee el error del linker: ¿qué símbolo falta y de qué librería viene?', fix: 'Añade target_link_libraries() con la librería correcta en CMakeLists.txt.' },
      { cause: 'Caché de compilación corrupta o cambios de firma de headers.', check: 'Borra build/ install/ log/ y recompila desde cero.', fix: 'Limpia los directorios de compilación y usa colcon build --symlink-install de nuevo.' }
    ],
    prevention: 'Declara dependencias con rosdep, usa un script de entorno consistente y compila en CI para detectar errores pronto.'
  },
  {
    id: 'rob-print-warping',
    track: 'robotica',
    category: 'impresión 3D',
    symptom: 'La impresión 3D se despega de la cama y las esquinas se levantan (warping).',
    causes: [
      { cause: 'Cama mal nivelada o superficie sucia que reduce la adherencia.', check: 'Haz un test de nivelación con una hoja de papel y limpia la cama con alcohol o agua y jabón.', fix: 'Nivela la cama, limpia la superficie y aplica adhesivo (PVA, hairspray) si hace falta.' },
      { cause: 'Temperatura de cama o de primera capa incorrecta.', check: 'Consulta la temperatura recomendada del filamento (PLA ~60 °C cama, ABS ~100 °C) y mide con termómetro.', fix: 'Ajusta la temperatura de cama y sube ligeramente la de la primera capa para mejorar la adherencia.' },
      { cause: 'Corriente de aire o temperatura ambiente baja que enfría desigual.', check: 'Cerca de una ventana o ventilador: Observa si el warp aparece siempre en el mismo lado.', fix: 'Usa enclosure o caja cerrada, evita corrientes y mantén temperatura ambiente estable.' },
      { cause: 'Primera capa demasiado fina o extrusión insuficiente.', check: 'Mide el grosor de la primera capa y revisa el valor de layer height y flow.', fix: 'Aumenta el grosor de la primera capa (p. ej. 0.28 mm) y un 5–10 % el flow inicial.' }
    ],
    prevention: 'Nivela y limpia la cama antes de imprimir, usa temperaturas recomendadas por material y controla el ambiente con una carcasa.'
  },
  {
    id: 'rob-print-fit',
    track: 'robotica',
    category: 'mecánica',
    symptom: 'Las piezas impresas no encajan: los taladros quedan pequeños o las uniones demasiado holgadas.',
    causes: [
      { cause: 'Tolerancias no consideradas en el diseño CAD.', check: 'Mide la pieza con calibre y compara con el modelo: difference típica de 0.2–0.4 mm por lado.', fix: 'Añade holgura de 0.2–0.4 mm en los ajustes deslizantes y 0.1–0.2 mm en los atornillados.' },
      { cause: 'Calibración de extrusión (flow/E-steps) incorrecta.', check: 'Imprime un cubo de pared única y mide el grosor: debe coincidir con el nozzle (p. ej. 0.4 mm).', fix: 'Calibra los E-steps y el flow: nuevo flow = flow actual × (grosor esperado / grosor medido).' },
      { cause: 'Contracción del material o warping que deforma la pieza.', check: 'Compara las dimensiones en distintas zonas: si varían, hay contracción o deformación.', fix: 'Usa material con baja contracción (PLA), aumenta temperatura y añade chaqueta/brisas para estabilizar.' },
      { cause: 'Resolución o configuración de mallas (slicer) que redondea esquinas.', check: 'Revisa los ajustes de "horizontal hole expansion" y resolution en el slicer.', fix: 'Activa compensación de taladros o ajusta el skalado de agujeros en el slicer y vuelve a cortar.' }
    ],
    prevention: 'Calibra flujo y E-steps, diseña con tolerancias explícitas e imprime una pieza de prueba de ajuste antes de la final.'
  },
  {
    id: 'rob-camera-blur',
    track: 'robotica',
    category: 'visión',
    symptom: 'La cámara produce imágenes borrosas o desenfocadas.',
    causes: [
      { cause: 'Lente sucio o con huellas dactilares.', check: 'Inspecciona el lente con luz rasante y limpia con paño de microfibra y alcohol isopropílico.', fix: 'Limpia el lente con movimientos circulares suaves y seca con un paño limpio.' },
      { cause: 'Foco mal ajustado (lente de foco manual o automático no convergido).', check: 'Mira un objeto a la distancia de trabajo y gira el anillo de foco hasta obtener nitidez.', fix: 'Ajusta el foco manualmente o espera a que el autofoco converja; bloquea el foco si la distancia es fija.' },
      { cause: 'Velocidad de obturación baja con movimiento (motion blur).', check: 'Reduce el tiempo de exposición y compara: si la imagen mejora, era movimiento.', fix: 'Aumenta la iluminación, sube el ISO o usa una exposición más corta para congelar el movimiento.' },
      { cause: 'Resolución o compresión excesiva (baja calidad de imagen).', check: 'Comprueba los parámetros de resolución y JPEG quality del nodo de la cámara.', fix: 'Usa mayor resolución y quality, o cambia a formato sin pérdida si el ancho de banda lo permite.' }
    ],
    prevention: 'Limpia el lente periódicamente, fija el foco para la distancia de trabajo y controla iluminación y exposición.'
  },
  {
    id: 'rob-calibration-fail',
    track: 'robotica',
    category: 'visión',
    symptom: 'La calibración de cámara falla: alta tasa de error o resultados inconsistentes.',
    causes: [
      { cause: 'Cartel de calibración (checkerboard/Charuco) mal impreso o doblado.', check: 'Mide los cuadros con calibre y verifica que esté plano y sobre superficie rígida.', fix: 'Reimprime el patrón a escala real, pégalo sobre una placa rígida y verifica las medidas.' },
      { cause: 'Pocas imágenes o ángulos poco diversos.', check: 'Cuenta las imágenes aceptadas y revisa que cubran toda la escena y varios ángulos.', fix: 'Captura 20–30 imágenes desde posiciones y orientaciones variadas, evitando desenfoque.' },
      { cause: 'Tamaño de cuadro (square_size) equivocado en el software.', check: 'Compara el parámetro square_size con la medida real del patrón en metros.', fix: 'Corrige square_size con el valor real en metros y vuelve a calibrar.' },
      { cause: 'Patrón siempre en el mismo plano (poca variación de profundidad).', check: 'Revisa si las imágenes tienen siempre la misma distancia: los parámetros de distorsión serán inestables.', fix: 'Varía la distancia y la inclinación del patrón para observar distorsión en diferentes zonas.' }
    ],
    prevention: 'Usa un patrón rígido y medido, captura muchas vistas variadas y verifica el error de reproyección (ideal < 0.5 px).'
  },
  {
    id: 'rob-sim2real',
    track: 'robotica',
    category: 'ML robótico',
    symptom: 'Una policy de aprendizaje funciona en simulación pero falla en el robot real.',
    causes: [
      { cause: 'Sim-to-real gap: dinámica, fricción o retardos distintos en el simulador.', check: 'Compara la respuesta del robot real y simulada ante la misma acción (paso, frenada).', fix: 'Aplica domain randomization (masa, fricción, retardo, ruido) durante el entrenamiento y ajusta los parámetros del simulador.' },
      { cause: 'Observaciones reales con ruido o latencia distintos a las de entrenamiento.', check: 'Compara histogramas de observaciones reales vs simuladas y mide la latencia sensor→acción.', fix: 'Añade ruido y retraso sintéticos al entrenamiento y filtra o alinea las observaciones reales.' },
      { cause: 'Acciones fuera del rango real (el simulador permite esfuerzos imposibles).', check: 'Verifica que las acciones estén dentro de los límites reales de los motores.', fix: 'Recorta acciones a rangos reales y respeta tasas de cambio (rate limits) de los actuadores.' },
      { cause: 'Cambio de distribución de escenas (colores, iluminación, textures) en el mundo real.', check: 'Evalúa la policy con imágenes reales etiquetadas: ¿degrada la percepción?', fix: 'Usa augmentations de color/iluminación y domain adaptation con datos reales limitados.' }
    ],
    prevention: 'Entrena con domain randomization, valida con datos reales desde el inicio y mantén un bucle de recolección y reentrenamiento continuo.'
  },
  {
    id: 'rob-demonstrations',
    track: 'robotica',
    category: 'ML robótico',
    symptom: 'Las demostraciones para aprendizaje por imitación son inconsistentes y la policy no converge.',
    causes: [
      { cause: 'Demostraciones con trayectorias muy distintas para la misma tarea.', check: 'Visualiza varias demos superpuestas y mide la varianza de las trayectorias.', fix: 'Estandariza el inicio y el objetivo, y filtra demostraciones atípicas o fallidas.' },
      { cause: 'Teleoperación con latencia que desalinea observaciones y acciones.', check: 'Comprueba los timestamps de observaciones y acciones; busca desfases de cientos de ms.', fix: 'Sincroniza relojes, alinea por timestamp y usa buffering temporal en el registro.' },
      { cause: 'Cantidad insuficiente o cobertura pobre de estados iniciales.', check: 'Cuenta demos y revisa si cubren todas las posiciones y condiciones de partida esperadas.', fix: 'Recolecta más demostraciones con diversidad controlada de estados y perturbaciones.' },
      { cause: 'Acciones registradas en marcos distintos (base vs mundo).', check: 'Verifica el frame de referencia de las acciones en todas las demos.', fix: 'Convierte todas las acciones a un marco común (p. ej. base_link) antes de entrenar.' }
    ],
    prevention: 'Define un protocolo de demostración, sincroniza sensores con relojes comunes y valida y filtra las demos antes de entrenar.'
  },
  {
    id: 'rob-stepper-noise',
    track: 'robotica',
    category: 'motores',
    symptom: 'El motor paso a paso hace un ruido chirriante pero apenas gira.',
    causes: [
      { cause: 'Secuencia de fases incorrecta en el código (orden de energizado mal).', check: 'Compara tu tabla de secuencias con la del datasheet (full-step/half-step).', fix: 'Usa una librería probada (AccelStepper) o corrige el orden de energizado de las bobinas.' },
      { cause: 'Frecuencia de pulsos en la zona de resonancia del motor.', check: 'Barré la frecuencia de paso: si el ruido aparece en un rango concreto, es resonancia.', fix: 'Usa microstepping (1/8, 1/16) y evita operar en la frecuencia de resonancia.' },
      { cause: 'Corriente de fase demasiado baja para mover la carga.', check: 'Mide la corriente y compárala con la nominal; aumenta temporalmente y observa.', fix: 'Ajusta la corriente del driver al 80 % del nominal con el motor bien refrigerado.' },
      { cause: 'Una de las bobinas desconectada (solo vibra).', check: 'Desconecta una fase a la vez: si al desconectar una no cambia nada, esa fase estaba muerta.', fix: 'Corrige el cableado de la fase desconectada y verifica continuidad del cableado del motor.' }
    ],
    prevention: 'Usa microstepping, secuencias verificadas de librería y comprueba las cuatro conexiones de fase con un multímetro antes de arrancar.'
  },
  {
    id: 'rob-pwm-servo',
    track: 'robotica',
    category: 'firmware',
    symptom: 'El servo no responde a la señal PWM o lo hace de forma errática.',
    causes: [
      { cause: 'Frecuencia PWM incorrecta (el servo espera 50 Hz, no 1 kHz).', check: 'Mide el periodo de la señal con un osciloscopio o analizador lógico.', fix: 'Configura el timer a 50 Hz con ancho de pulso de 500–2500 µs.' },
      { cause: 'Ancho de pulso fuera del rango (0–180° suele ser 500–2500 µs).', check: 'Mide el ancho en microsegundos y compáralo con el rango real de tu servo.', fix: 'Calibra los valores mínimo y máximo de tu servo y usa una funcion de mapeo grados→µs.' },
      { cause: 'Señal de 3.3 V a un servo que espera 5 V de lógica.', check: 'Mide el nivel alto de la señal y compruébalo frente a la hoja de datos del servo.', fix: 'Usa un level shifter de 3.3 V a 5 V en la línea de señal.' },
      { cause: 'Masa común ausente entre controlador y servo.', check: 'Mide continuidad entre las masas de la fuente del servo y del microcontrolador.', fix: 'Une las masas en un único punto (estrella) sin crear bucles de tierra.' }
    ],
    prevention: 'Genera PWM con timer de hardware a 50 Hz, calibra los extremos del servo y asegura masa común y nivel lógico correcto.'
  },
  {
    id: 'rob-rgb-inverted',
    track: 'robotica',
    category: 'electrónica',
    symptom: 'El LED RGB muestra colores equivocados (p. ej. el rojo se ve azul).',
    causes: [
      { cause: 'Canales conectados a pines distintos de los esperados en el código.', check: 'Sigue cada cable del LED al pin del micro y compara con el orden R/G/B del código.', fix: 'Reordena los pines en el código o rearma los cables según el mapeo real.' },
      { cause: 'LED de cátodo común tratado como ánodo común (o al revés).', check: 'Identifica el tipo: en cátodo común, el pin común va a masa y los canales se activan con HIGH.', fix: 'Invierte la lógica de activación en el código según el tipo de LED.' },
      { cause: 'Valores PWM invertidos (analogWrite(255) apaga en lugar de encender).', check: 'Prueba con un canal a 0 y a 255 y observa cuándo brilla más.', fix: 'Mapea el valor de brillo: 255 - valor si la lógica está invertida.' },
      { cause: 'Resistencias de canal desiguales que alteran el balance de color.', check: 'Compara las resistencias de R, G y B; deben estar dimensionadas para cada color.', fix: 'Usa resistencias adecuadas por canal (los LED azules suelen necesitar menor resistencia).' }
    ],
    prevention: 'Identifica el tipo de LED antes de cablear, documenta el mapeo de pines y calibra el balance de color en el código.'
  },
  {
    id: 'rob-serial-garbage',
    track: 'robotica',
    category: 'comunicaciones',
    symptom: 'El monitor serie muestra caracteres aleatorios o no muestra nada.',
    causes: [
      { cause: 'Baud rate distinto entre el dispositivo y el monitor serie.', check: 'Compara el valor de Serial.begin() con el baudrate seleccionado en el monitor.', fix: 'Iguala el baudrate (p. ej. 115200) en ambos extremos.' },
      { cause: 'Masa común ausente entre el adaptador USB-serie y la placa.', check: 'Mide continuidad entre la masa del USB-serie y la placa.', fix: 'Conecta las masas y verifica también el nivel de voltaje de la señal (3.3 V vs 5 V).' },
      { cause: 'Pines TX/RX cruzados o conectados al puerto equivocado.', check: 'Sigue TX del adaptador a RX de la placa y viceversa; comprueba que no uses el puerto de debug incorrecto.', fix: 'Corrige el cableado TX↔RX y selecciona el puerto serie correcto.' },
      { cause: 'Buffer desbordado por imprimir demasiados datos.', check: 'Reduce la frecuencia de impresión y comprueba si el texto vuelve a ser legible.', fix: 'Limitá los logs, usa formato compacto y aumenta el buffer serie si es posible.' }
    ],
    prevention: 'Documenta baudrate y pines, une masas y usa level shifting cuando mezcles 3.3 V y 5 V.'
  },
  {
    id: 'rob-bootloop',
    track: 'robotica',
    category: 'firmware',
    symptom: 'El microcontrolador entra en bootloop: se reinicia repetidamente sin reason aparente.',
    causes: [
      { cause: 'Watchdog timer (WDT) que no se refresca por un bucle bloqueante.', check: 'Revisa si hay delays largos o bucles infinitos y si el WDT está activado.', fix: 'Refresca el watchdog periódicamente o desactívalo si no es necesario; evita bloqueos largos.' },
      { cause: 'Desbordamiento de pila (stack overflow) por variables locales grandes o recursión.', check: 'Reduce el tamaño de arrays locales y revisa llamadas recursivas.', fix: 'Mueve buffers grandes a globales o heap, aumenta el stack y elimina la recursión.' },
      { cause: 'Acceso a memoria inválida o puntero nulo.', check: 'Depura con GDB o añade asserts para localizar el punto de fallo.', fix: 'Corrige el índice o puntero culprit y valida los límites antes de acceder.' },
      { cause: 'Caída de tensión intermitente por alimentación inestable.', check: 'Monitoriza Vcc con un osciloscopio y comprueba la causa de reset en el registrador del MCU.', fix: 'Estabiliza la fuente, añade desacoplo y revisa conectores.' }
    ],
    prevention: 'Usa watchdog con refresh explícito, evita recursión y buffers grandes en stack y monitoriza la causa de reset en el arranque.'
  },
  {
    id: 'rob-wifi-drop',
    track: 'robotica',
    category: 'comunicaciones',
    symptom: 'El ESP32/Wi-Fi se desconecta constantemente del access point.',
    causes: [
      { cause: 'Señal débil o interferencias en la banda de 2.4 GHz.', check: 'Mide el RSSI: por debajo de -70 dBm la conexión es inestable.', fix: 'Acerca el robot al router, cambia de canal o usa 5 GHz si el módulo lo soporta.' },
      { cause: 'Consumo de corriente pico durante transmisión que hunde la fuente.', check: 'Mide Vcc durante un envío Wi-Fi; los picos pueden superar 300 mA.', fix: 'Usa una fuente con margen y un condensador de 1000 µF cerca del módulo.' },
      { cause: 'Power management agresivo del Wi-Fi (modo sleep).', check: 'Desactiva el sleep del Wi-Fi y comprueba si mejora la estabilidad.', fix: 'Configura wifi_set_sleep_type(NONE_SLEEP_T) o el equivalente en tu framework.' },
      { cause: 'Reconexión mal gestionada en el código (sin reconectar tras pérdida).', check: 'Revisa el evento de desconexión: ¿hay lógica para reconectar y reasociar?', fix: 'Implementa una máquina de estados de reconexión con backoff exponencial.' }
    ],
    prevention: 'Asegura buena cobertura, fuente con margen para picos y una lógica de reconexión robusta con backoff.'
  },
  {
    id: 'rob-ble-connect',
    track: 'robotica',
    category: 'comunicaciones',
    symptom: 'El robot no conecta por Bluetooth Low Energy o la conexión se cae.',
    causes: [
      { cause: 'Nombre de dispositivo o UUID de servicio incorrectos en el cliente.', check: 'Escanea con una app (nRF Connect) y compara nombre y UUIDs con el código.', fix: 'Corrige los UUIDs y usa el nombre de dispositivo anunciado exacto.' },
      { cause: 'Intervalo de conexión o parámetros de publicidad inadecuados.', check: 'Revisa los parámetros de advertising y connection interval.', fix: 'Ajusta el intervalo de advertising a 100–200 ms y usa parámetros de conexión razonables.' },
      { cause: 'MTU demasiado grande para el módulo o apilamiento de paquetes.', check: 'Reduce el tamaño de los paquetes enviados y comprueba si deja de fallar.', fix: 'Negocia el MTU y fragmenta mensajes grandes en chunks pequeños.' },
      { cause: 'El dispositivo ya está conectado a otro cliente.', check: 'Desconecta otros dispositivos y vuelve a intentar.', fix: 'Implementa una sola conexión activa y gestiona el evento de desconexión del cliente anterior.' }
    ],
    prevention: 'Documenta UUIDs, usa parámetros de conexión estándar y gestiona explícitamente estados de conexión y reintentos.'
  },
  {
    id: 'rob-battery-drain',
    track: 'robotica',
    category: 'alimentación',
    symptom: 'La batería se agota mucho más rápido de lo previsto.',
    causes: [
      { cause: 'Consumo en reposo alto por periféricos sin dormir.', check: 'Mide la corriente en reposo con un multímetro en serie; compárala con el consumo esperado.', fix: 'Pon en sleep los módulos no usados, apaga LEDs y desactiva Wi-Fi/Bluetooth cuando no se usen.' },
      { cause: 'Motor o driver que consume corriente aunque esté parado.', check: 'Desconecta el motor y mide: si la corriente baja, el driver o el motor están en freno activo.', fix: 'Usa el modo coast/flotante cuando no haya movimiento o apaga el driver con su pin de enable.' },
      { cause: 'Batería envejecida con capacidad reducida.', check: 'Mide la capacidad real descargando con carga controlada y compara con la nominal.', fix: 'Sustituye la batería si ha perdido más del 20 % de su capacidad.' },
      { cause: 'Regulador lineal ineficiente que disipa demasiada potencia.', check: 'Calcula P = (Vin - Vout) · I; si es alta, se pierde energía como calor.', fix: 'Usa un regulador conmutado (buck) para diferencias de tensión grandes.' }
    ],
    prevention: 'Diseña modos de bajo consumo, usa reguladores eficientes y monitoriza la corriente y el estado de la batería en campo.'
  },
  {
    id: 'rob-regulator-hot',
    track: 'robotica',
    category: 'alimentación',
    symptom: 'El regulador de voltaje se calienta excesivamente en funcionamiento normal.',
    causes: [
      { cause: 'Caída de tensión grande con corriente alta en un regulador lineal.', check: 'Calcula la disipación (Vin - Vout) · I y compárala con la capacidad térmica del encapsulado.', fix: 'Sustituye por un regulador buck o reduce la tensión de entrada.' },
      { cause: 'Corriente de carga superior a la nominal del regulador.', check: 'Mide la corriente de salida y compárala con el límite del regulador.', fix: 'Usa un regulador con mayor capacidad o reparte la carga entre varios.' },
      { cause: 'Falta de disipador o de area de cobre en la placa.', check: 'Revisa el diseño térmico: ¿hay plan de masa/cobre bajo el regulador?', fix: 'Añade disipador, aumenta el cobre alrededor del pad térmico y mejora la ventilación.' },
      { cause: 'Condensadores de salida incorrectos que hacen inestable al regulador.', check: 'Revisa el tipo y ESR de los condensadores según el datasheet.', fix: 'Usa condensadores cerámicos de bajo ESR con los valores recomendados cerca del regulador.' }
    ],
    prevention: 'Calcula la disipación térmica en el diseño, elige reguladores conmutados cuando haga falta y respeta el layout recomendado del fabricante.'
  },
  {
    id: 'rob-loose-connector',
    track: 'robotica',
    category: 'electrónica',
    symptom: 'El robot falla de forma intermitente al vibrar o mover cables (conexión suelta).',
    causes: [
      { cause: 'Conector JST/Dupont que no encaja con firmeza.', check: 'Tira suavemente de cada cable con el robot apagado: ¿se sale o se mueve?', fix: 'Reasienta el conector, asegura la lengüeta y usa conectores con seguro (JST-SH, Molex) si vibran mucho.' },
      { cause: 'Cables con el aislamiento cortado en el punto de flexión.', check: 'Inspecciona visualmente y mide continuidad mientras mueves el cable.', fix: 'Recorta y vuelve a crimpear o soldar el cable, y añade alivio de tensión con cinta o abrazadera.' },
      { cause: 'Pines oxidados o con mala presión de contacto.', check: 'Revisa el brillo de los contactos y mide resistencia entre el pin y el cable.', fix: 'Limpia con alcohol, ajusta las hembras o sustituye el conector.' },
      { cause: 'Cableado que roza con piezas móviles y se desgasta.', check: 'Busca marcas de rozadura cerca de engranajes o ruedas.', fix: 'Reordena el cableado, fíjalo con bridas y aléjalo de piezas en movimiento.' }
    ],
    prevention: 'Usa conectores con seguro, alivio de tensión y revisiones periódicas del cableado; fija los cables lejos de zonas de movimiento.'
  },
  {
    id: 'rob-i2c-frozen',
    track: 'robotica',
    category: 'sensores',
    symptom: 'El sensor I2C responde al inicio pero luego devuelve siempre el mismo valor (congelado).',
    causes: [
      { cause: 'Bus I2C bloqueado por un dispositivo que mantiene SCL o SDA en bajo.', check: 'Mide SDA/SCL con osciloscopio: si una línea está fija en 0, hay un dispositivo colgado.', fix: 'Apaga y enciende el sensor, revisa su alimentación o añade un watchdog que reinicie el bus.' },
      { cause: 'El sensor entra en modo de bajo consumo y deja de medir.', check: 'Consulta el registro de control y comprueba si el modo sleep está activo.', fix: 'Configura el sensor en modo continuo y desactiva el sleep en la inicialización.' },
      { cause: 'Lectura de un registro sin esperar el tiempo de conversión.', check: 'Revisa el datasheet: muchos sensores necesitan varios ms entre disparo y lectura.', fix: 'Añade el retardo de conversión o consulta el bit de "data ready" antes de leer.' },
      { cause: 'Código que no actualiza la variable por una condición mal escrita.', check: 'Añade un log en la lectura: ¿se está ejecutando la llamada I2C en cada ciclo?', fix: 'Corrige la lógica de lectura y verifica que el valor se actualiza cada ciclo.' }
    ],
    prevention: 'Añade un health-check del bus I2C, configura el sensor en modo continuo y respeta los tiempos de conversión del datasheet.'
  },
  {
    id: 'rob-spi-fail',
    track: 'robotica',
    category: 'sensores',
    symptom: 'El dispositivo SPI no responde o devuelve datos incorrectos.',
    causes: [
      { cause: 'Modo SPI incorrecto (CPOL/CPHA) respecto al dispositivo.', check: 'Consulta el datasheet y compruébalo con un analizador lógico: en qué flanco se muestrea.', fix: 'Configura el modo SPI correcto (0, 1, 2 o 3) en tu biblioteca.' },
      { cause: 'Chip select (CS/SS) mal gestionado o activo en el nivel equivocado.', check: 'Mide la línea CS: debe estar en alto en reposo y en bajo durante la transacción.', fix: 'Configura CS como salida, en alto por defecto y bájalo alrededor de la transferencia.' },
      { cause: 'Frecuencia de reloj SPI demasiado alta para el dispositivo o cables largos.', check: 'Baja la frecuencia (p. ej. a 1 MHz) y comprueba si funciona.', fix: 'Reduce el reloj SPI y acorta los cables; usa resistencias serie de 22–100 Ω si hay refundidos.' },
      { cause: 'MISO/MOSI invertidos o sin masa común.', check: 'Verifica el cableado y mide continuidad y masa entre dispositivos.', fix: 'Corrige MISO↔MOSI y asegura masa común.' }
    ],
    prevention: 'Confirma modo y frecuencia SPI del datasheet, gestiona CS correctamente y valida las señales con un analizador lógico.'
  },
  {
    id: 'rob-uart-corrupt',
    track: 'robotica',
    category: 'comunicaciones',
    symptom: 'Los datos UART llegan corruptos o con caracteres perdidos.',
    causes: [
      { cause: 'Baudrate o formato de trama distinto (8N1 vs 7E2).', check: 'Compara baudrate, bits de datos, paridad y bits de parada en ambos extremos.', fix: 'Iguala la configuración serie en emisor y receptor.' },
      { cause: 'Niveles de voltaje incompatibles (5 V TX a RX de 3.3 V).', check: 'Mide el nivel alto de TX: si supera Vcc+0.3 V del receptor, hay riesgo.', fix: 'Usa un divisor de voltaje o level shifter entre TX y RX.' },
      { cause: 'Desbordamiento del buffer de recepción por datos demasiado rápidos.', check: 'Reduce la tasa de envío y comprueba si desaparecen los errores.', fix: 'Aumenta el buffer RX, usa interrupciones/DMA y implementa control de flujo (RTS/CTS) si está disponible.' },
      { cause: 'Cables largos sin masa común o con ruido.', check: 'Acorta el cable, une masas y observa si mejora.', fix: 'Usa cable apantallado, masa común en un extremo y baja el baudrate si hace falta.' }
    ],
    prevention: 'Documenta la configuración serie, adapta niveles lógicos, usa buffers y control de flujo y mantén cables cortos.'
  },
  {
    id: 'rob-buzzer-weak',
    track: 'robotica',
    category: 'electrónica',
    symptom: 'El zumbador suena muy débil o no suena.',
    causes: [
      { cause: 'Zumbador pasivo excitado con DC en lugar de una señal oscilante.', check: 'Comprueba si es pasivo (necesita frecuencia) o activo (solo DC).', fix: 'Genera una señal cuadrada a la frecuencia de resonancia (~2–4 kHz) si es pasivo.' },
      { cause: 'Corriente insuficiente desde el pin del microcontrolador.', check: 'Mide la corriente: un pin suele dar 20–40 mA, menos de lo que necesita un zumbador.', fix: 'Acciona el zumbador con un transistor o MOSFET y una resistencia en la base/compuerta.' },
      { cause: 'Polaridad invertida en zumbador activo.', check: 'Verifica la marca + del zumbador y su conexión a Vcc.', fix: 'Invierte las conexiones respetando la polaridad.' },
      { cause: 'Frecuencia fuera del rango audible o de resonancia.', check: 'Barre frecuencias de 1–5 kHz y observa dónde suena más fuerte.', fix: 'Ajusta la frecuencia a la de resonancia del zumbador.' }
    ],
    prevention: 'Identifica el tipo de zumbador, usa transistor para excitación y respeta polaridad y frecuencia de resonancia.'
  },
  {
    id: 'rob-relay-no-switch',
    track: 'robotica',
    category: 'electrónica',
    symptom: 'El relé no conmuta o lo hace de forma intermitente.',
    causes: [
      { cause: 'El pin del micro no puede aportar la corriente de la bobina.', check: 'Mide la corriente de la bobina (puede ser 70–150 mA) frente a la capacidad del pin (~20 mA).', fix: 'Usa un módulo relé con transistor y diodo flyback, o un driver ULN2003.' },
      { cause: 'Falta el diodo de protección flyback.', check: 'Revisa si hay un diodo en paralelo a la bobina (cátodo hacia Vcc).', fix: 'Añade un diodo 1N4148/1N4007 en antiparalelo para proteger el transistor de picos inductivos.' },
      { cause: 'Lógica de activación activa-baja no respetada.', check: 'Prueba escribiendo LOW y HIGH y observa cuándo conmuta.', fix: 'Ajusta el código a la lógica del módulo (muchos módulos activan con LOW).' },
      { cause: 'Alimentación insuficiente para la bobina.', check: 'Mide Vcc en la bobina al activar: si cae, la fuente no da suficiente corriente.', fix: 'Usa una fuente dedicada para el relé con masa común.' }
    ],
    prevention: 'Usa módulos con driver y diodo flyback, respeta la lógica de activación y dimensiona la fuente para la bobina.'
  },
  {
    id: 'rob-endstop',
    track: 'robotica',
    category: 'motores',
    symptom: 'El final de carrera (endstop) no detecta o dispara sin contacto.',
    causes: [
      { cause: 'Endstop cableado como NO pero configurado como NC (o al revés).', check: 'Mide continuidad en reposo y al pulsar; compara con el valor de configuración (Marlin ENDSTOP_INVERTING).', fix: 'Corrige el cableado o invierte la configuración en el firmware.' },
      { cause: 'Falta resistencia pull-up o entrada flotante.', check: 'Mide la tensión del pin en reposo: si flota entre 0 y 3.3 V, falta el pull-up.', fix: 'Activa el pull-up interno o añade una resistencia externa de 4.7–10 kΩ.' },
      { cause: 'Microinterruptor mecánico desgastado o sucio.', check: 'Mide continuidad al pulsar varias veces: ¿falla de forma intermitente?', fix: 'Limpia el microswitch o sustitúyelo por un sensor óptico/inductivo.' },
      { cause: 'Ruido eléctrico que genera falsos disparos.', check: 'Aleja el cable del motor y añade un filtro RC de 10 kΩ + 100 nF.', fix: 'Blinda el cable, aplica debounce en firmware y usa entradas con Schmitt trigger.' }
    ],
    prevention: 'Define NO/NC de forma consistente, usa pull-ups, filtra la señal y prueba el endstop antes de cada movimiento de referencia.'
  },
  {
    id: 'rob-heated-bed',
    track: 'robotica',
    category: 'impresión 3D',
    symptom: 'La cama caliente no alcanza la temperatura o no calienta.',
    causes: [
      { cause: 'Termistor desconectado o con resistencia incorrecta.', check: 'Mide la resistencia del termistor a temperatura ambiente (típicamente 100 kΩ a 25 °C).', fix: 'Reconecta o sustituye el termistor y verifica el tipo (NTC 100k, EPCOS, etc.) en el firmware.' },
      { cause: 'Fuente de alimentación insuficiente para la cama.', check: 'Mide la tensión en la cama al calentar: si cae, la fuente no da suficiente corriente.', fix: 'Usa una fuente con corriente suficiente (p. ej. 24 V 15 A) y cables gruesos.' },
      { cause: 'MOSFET de la placa quemado o sin conmutar.', check: 'Mide la señal de control del MOSFET y la salida hacia la cama.', fix: 'Sustituye el MOSFET o usa un módulo MOSFET externo con disipador.' },
      { cause: 'Configuración PID o temperatura máxima mal ajustada en el firmware.', check: 'Revisa MAX_BED_TEMP y los valores PID en Configuration.h.', fix: 'Ajusta los límites y ejecuta un PID autotune (M303) para la cama.' }
    ],
    prevention: 'Verifica termistor y fuente antes de cada uso, usa cables y conectores dimensionados y calibra el PID del firmware.'
  },
  {
    id: 'rob-extruder-click',
    track: 'robotica',
    category: 'impresión 3D',
    symptom: 'El extrusor hace clics y no deposita filamento (under-extrusión).',
    causes: [
      { cause: 'Boquilla (nozzle) parcialmente obstruida.', check: 'Calienta y haz un cold pull o pasa un alambre de 0.35 mm por la boquilla.', fix: 'Limpia la boquilla con cold pull, aguja o acetona segun material, y sustituye si no mejora.' },
      { cause: 'Tensión del extrusor demasiado baja o engranaje del motor desgastado.', check: 'Observa si el filamento resbala en el engranaje o si este está desgastado.', fix: 'Ajusta la tensión del tensor y limpia o sustituye el engranaje de accionamiento.' },
      { cause: 'Temperatura de extrusión demasiado baja para el material.', check: 'Consulta la temperatura recomendada y comprueba la real con termómetro.', fix: 'Sube la temperatura 5–10 °C gradualmente dentro del rango del filamento.' },
      { cause: 'Distancia entre boquilla y cama demasiado pequeña (cerca de la primera capa).', check: 'Observa si el clic aparece solo en la primera capa.', fix: 'Ajusta el Z-offset para dar espacio suficiente a la primera capa.' }
    ],
    prevention: 'Mantén la boquilla limpia, usa filamento seco, calibr temperatura y tensiona correctamente el extrusor.'
  },
  {
    id: 'rob-layer-shift',
    track: 'robotica',
    category: 'impresión 3D',
    symptom: 'La pieza impresa presenta desplazamiento de capas (layer shift).',
    causes: [
      { cause: 'Correas flojas o poleas sueltas en los ejes X/Y.', check: 'Con la impresora apagada, mueve el cabezal a mano: ¿hay holgura o la correa está floja?', fix: 'Tensa las correas y aprieta los tornillos de las poleas (grub screws).' },
      { cause: 'Motor paso a paso que pierde pasos por aceleración excesiva.', check: 'Reduce la aceleración en el slicer y comprueba si desaparece el desplazamiento.', fix: 'Baja la aceleración y la velocidad de viaje; ajusta la corriente de los motores.' },
      { cause: 'Colisión con una pieza o clip que bloquea el movimiento.', check: 'Revisa si el cabezal o el cableado engancha en algún punto del recorrido.', fix: 'Elimina la obstrucción y reorganiza el cableado con cadenas de arrastre.' },
      { cause: 'Cables del motor o endstop que se desconectan por vibración.', check: 'Inspecciona los conectores y el cableado en movimiento.', fix: 'Asegura conectores y fija cables con bridas o abrazaderas.' }
    ],
    prevention: 'Mantén correas tensadas, poleas fijas y cableado recogido, y usa aceleraciones conservadoras.'
  },
  {
    id: 'rob-stringing',
    track: 'robotica',
    category: 'impresión 3D',
    symptom: 'La impresión presenta filamentos finos (stringing) entre piezas o agujeros.',
    causes: [
      { cause: 'Temperatura de extrusión demasiado alta (filamento too fluido).', check: 'Baja la temperatura 5 °C y compara el resultado.', fix: 'Ajusta la temperatura al mínimo que aún dé buena adherencia entre capas.' },
      { cause: 'Retracción insuficiente o desactivada en el slicer.', check: 'Revisa los ajustes de retraction distance y speed.', fix: 'Activa retracción (p. ej. 4–6 mm a 40 mm/s para Bowden) y calibrar con un test de retracción.' },
      { cause: 'Velocidad de viaje demasiado baja o falta de Z-hop.', check: 'Aumenta la velocidad de travel y activa Z-hop en el slicer.', fix: 'Sube la velocidad de viaje y usa Z-hop de 0.2–0.4 mm para evitar arrastrar filamento.' },
      { cause: 'Filamento húmedo que genera burbujas y goteo.', check: 'Escucha si hay crujidos o burbujas al extruir y seca el filamento.', fix: 'Seca el filamento en horno/desecante y guárdalo en recipiente hermético.' }
    ],
    prevention: 'Calibra temperatura y retracción con un test específico, controla la humedad del filamento y usa Z-hop.'
  },
  {
    id: 'rob-odometry-drift',
    track: 'robotica',
    category: 'control',
    symptom: 'La odometría del robot se desvía: la posición estimada no coincide con la real tras girar.',
    causes: [
      { cause: 'Radio de rueda o distancia entre ruedas incorrectos.', check: 'Mide el radio real con carga y la distancia entre centros; compara con los parámetros del código.', fix: 'Corrige los parámetros y calibra haciendo girar el robot exactamente 360°. ' },
      { cause: 'Resolución de encoder (ticks por vuelta) mal configurada.', check: 'Cuenta los ticks de una vuelta manual de rueda y compara con el valor declarado.', fix: 'Ajusta el factor de conversión de ticks a metros en el nodo de odometría.' },
      { cause: 'Deslizamiento de ruedas por aceleración o superficie resbaladiza.', check: 'Compara la distancia estimada con la recorrida en distintas superficies.', fix: 'Reduce aceleración, usa ruedas con mejor agarre y fusiona con IMU o LIDAR.' },
      { cause: 'Ruedas de diámetros ligeramente distintos que giran a la misma velocidad.', check: 'Mide el diámetro de ambas ruedas con calibre.', fix: 'Calibra un factor de corrección por rueda o usa ruedas del mismo lote.' }
    ],
    prevention: 'Calibra la odometría con giros y distancias conocidas, mide parámetros con carga y fusiona sensores para corregir deriva.'
  },
  {
    id: 'rob-pid-oscillation',
    track: 'robotica',
    category: 'control',
    symptom: 'El lazo de control PID oscila: la variable sobrepasa el objetivo y nunca se estabiliza.',
    causes: [
      { cause: 'Ganancia proporcional (Kp) demasiado alta.', check: 'Reduce Kp a la mitad y observa si disminuyen las oscilaciones.', fix: 'Sintoniza con el método de Ziegler-Nichols o reduce Kp hasta obtener respuesta amortiguada.' },
      { cause: 'Tiempo de muestreo irregular o demasiado lento.', check: 'Mide el periodo del bucle de control: debe ser constante y suficientemente rápido.', fix: 'Usa un timer por hardware o un bucle con tiempo fijo y desacopla el control de las tareas lentas.' },
      { cause: 'Derivada amplificando ruido del sensor.', check: 'Filtra la entrada o reduce Kd y comprueba si mejora.', fix: 'Añade un filtro pasa-bajos a la medición y usa Kd moderado.' },
      { cause: 'Retardo o saturación del actuador (integral windup).', check: 'Observa si la salida está saturada mucho tiempo y el error sigue creciendo.', fix: 'Añade anti-windup (limita el término integral) y respeta los límites del actuador.' }
    ],
    prevention: 'Sintoniza PID de forma sistemática, usa muestreo constante, filtra sensores y aplica anti-windup.'
  },
  {
    id: 'rob-filter-lag',
    track: 'robotica',
    category: 'sensores',
    symptom: 'El filtrado de un sensor eliminó el ruido pero introdujo demasiado retardo (lag).',
    causes: [
      { cause: 'Ventana de media móvil o constante de tiempo demasiado grandes.', check: 'Compara la señal filtrada con la original ante un escalón: mide el retardo.', fix: 'Reduce la ventana o la constante de tiempo, o usa un filtro de Kalman que equilibre ruido y retardo.' },
      { cause: 'Filtro aplicado en cascada varias veces.', check: 'Cuenta cuántos filtros hay en la cadena de procesamiento.', fix: 'Aplica un único filtro bien sintonizado en lugar de varios encadenados.' },
      { cause: 'Frecuencia de muestreo baja que limita la respuesta del filtro.', check: 'Mide la tasa real de lectura del sensor.', fix: 'Aumenta la frecuencia de muestreo antes de filtrar y usa un filtro adaptado a esa tasa.' },
      { cause: 'Uso de media cuando un filtro mediano sería mejor para outliers.', check: 'Observa si hay picos aislados que la media arrastra durante varias muestras.', fix: 'Usa filtro mediano para eliminar outliers y un pasa-bajos suave para el ruido restante.' }
    ],
    prevention: 'Documenta el retardo introducido por cada filtro, valida con señales escalón y equilibra ruido vs respuesta.'
  },
  {
    id: 'rob-moveit-slow',
    track: 'robotica',
    category: 'MoveIt',
    symptom: 'MoveIt tarda demasiado en encontrar un plan (planning time alto).',
    causes: [
      { cause: 'Planificador con demasiadas muestras o timeout alto.', check: 'Revisa planning_time y el número de intentos del planificador.', fix: 'Reduce planning_time, ajusta el número de intentos y usa un planificador más rápido (p. ej. RRTConnect).' },
      { cause: 'Espacio de búsqueda excesivo por falta de restricciones.', check: 'Mide el tiempo con y sin restricciones de posición/orientación.', fix: 'Añade path constraints y usa un seed state cercano a la posición objetivo.' },
      { cause: 'Modelo de colisión complejo con demasiadas mallas.', check: 'Cuenta los objetos de colisión y su complejidad en la escena.', fix: 'Simplifica las mallas de colisión a primitivas y reduce el número de objetos.' },
      { cause: 'CPU saturada por otros nodos (cámara, percepción).', check: 'Monitoriza el uso de CPU con top/htop mientras planifica.', fix: 'Reparte carga entre máquinas, limita la frecuencia de percepción y prioriza el nodo de planificación.' }
    ],
    prevention: 'Usa planificadores rápidos con seed cercano, simplifica colisiones y monitoriza el tiempo de planificación en tests.'
  },
  {
    id: 'rob-nav2-stuck',
    track: 'robotica',
    category: 'Nav2',
    symptom: 'Nav2 recibe un objetivo pero el robot se queda quieto o gira sin avanzar.',
    causes: [
      { cause: 'Costmap con el robot marcado como en colisión (footprint sobre obstáculo).', check: 'Visualiza el costmap y el footprint en RViz: ¿hay celdas letales bajo el robot?', fix: 'Corrige la posición inicial con AMCL, ajusta el footprint y limpia la costmap.' },
      { cause: 'Velocidades máximas configuradas en cero o demasiado bajas.', check: 'Revisa max_vel_x, min_vel_x y max_vel_theta en los parámetros del controller.', fix: 'Asigna velocidades realistas y positivas según el robot.' },
      { cause: 'Controller (DWB/TEB) sin publicar comandos de velocidad.', check: 'Ejecuta ros2 topic hz /cmd_vel y verifica si el controller publica.', fix: 'Asegura que el controller esté activo en la lifecycle y que reciba el plan.' },
      { cause: 'Goal tolerances tan estrictas que el robot oscila cerca del objetivo.', check: 'Observa si el robot llega cerca pero nunca da el objetivo por completado.', fix: 'Aumenta xy_goal_tolerance y yaw_goal_tolerance a valores realistas.' }
    ],
    prevention: 'Verifica parámetros de velocidad y tolerancias, inicializa bien la pose y valida comandos de velocidad antes de misiones.'
  },
  {
    id: 'rob-costmap-ghost',
    track: 'robotica',
    category: 'Nav2',
    symptom: 'El costmap muestra obstáculos fantasma (zonas ocupadas donde no hay nada).',
    causes: [
      { cause: 'Reflejos del LIDAR en superficies brillantes o cristales.', check: 'Observa la nube de puntos en RViz: ¿hay puntos detrás de una superficie reflectante?', fix: 'Filtra reflejos con el filtro de rango del laser o ajusta el ángulo de montaje.' },
      { cause: 'Puntos del suelo o del propio robot interpretados como obstáculos.', check: 'Revisa si hay celdas ocupadas justo bajo el robot.', fix: 'Configura el footprint para podar puntos propios y ajusta el rango mínimo del sensor.' },
      { cause: 'Obstáculos que desaparecen pero quedan en la costmap (no se limpian).', check: 'Retira un objeto y comprueba si la celda sigue ocupada tras unos segundos.', fix: 'Ajusta obstacle_range, raytrace_range y la frecuencia de actualización de la costmap.' },
      { cause: 'Transformaciones del sensor desalineadas que proyectan puntos en el sitio equivocado.', check: 'Compara la posición de los puntos con la ubicación real del sensor.', fix: 'Corrige la transformación sensor→base_link en el URDF o el static transform.' }
    ],
    prevention: 'Calibra la posición del sensor, filtra reflejos y valida la costmap con el entorno real antes de navegar.'
  },
  {
    id: 'rob-fixed-frame',
    track: 'robotica',
    category: 'ROS 2',
    symptom: 'RViz muestra el error "Fixed Frame [map] does not exist" y no dibuja nada.',
    causes: [
      { cause: 'Ningún nodo publica la transformación del frame map.', check: 'Ejecuta ros2 run tf2_tools view_frames y busca si aparece el frame map.', fix: 'Lanza AMCL, slam_toolbox o un static transform que publique map→odom.' },
      { cause: 'El frame se llama de otra forma (mapa, world, odom).', check: 'Lista los frames disponibles con view_frames y compara con el Fixed Frame de RViz.', fix: 'Cambia el Fixed Frame en RViz al nombre correcto o renombra la transformación.' },
      { cause: 'Slice de tiempo: las transformaciones son antiguas y ya no se publican.', check: 'Usa tf2_echo map base_link y comprueba si los timestamps son recientes.', fix: 'Reinicia el nodo que publica la transformación y verifica el reloj del sistema.' },
      { cause: 'RViz conectado a otro dominio DDS donde no están los nodos.', check: 'Compara ROS_DOMAIN_ID entre RViz y los nodos.', fix: 'Igualiza el dominio o usa ROS_LOCALHOST_ONLY=1 para pruebas locales.' }
    ],
    prevention: 'Arranca siempre el productor de transformaciones antes que RViz y documenta el nombre del frame fijo del sistema.'
  },
  {
    id: 'rob-dds-discovery',
    track: 'robotica',
    category: 'ROS 2',
    symptom: 'Los nodos no se descubren entre sí: topics y servicios no aparecen en otra máquina.',
    causes: [
      { cause: 'ROS_DOMAIN_ID distinto en las máquinas.', check: 'Compara echo $ROS_DOMAIN_ID en cada equipo.', fix: 'Configura el mismo dominio en todos los equipos de la red del robot.' },
      { cause: 'Multicast bloqueado por el router o el firewall.', check: 'Haz ping multicast y revisa las reglas de firewall/iptables.', fix: 'Permite multicast en la red o usa un Discovery Server centralizado (ROS_DISCOVERY_SERVER).' },
      { cause: 'Interfaces de red múltiples (Wi-Fi + Ethernet) que confunden al DDS.', check: 'Revisa ROS_LOCALHOST_ONLY, RMW_IMPLEMENTATION y las interfaces activas.', fix: 'Configura ROS_IP/ROS_DOMAIN_ID o usa un discovery server y desactiva interfaces innecesarias.' },
      { cause: 'Distinta implementación RMW o versión de ROS entre equipos.', check: 'Compara echo $RMW_IMPLEMENTATION y la versión de ROS 2.', fix: 'Usa la misma implementación RMW y versión de ROS en todos los nodos.' }
    ],
    prevention: 'Centraliza la configuración de red y dominio en un archivo de entorno, y prueba la comunicación con ros2 doctor.'
  },
  {
    id: 'rob-params-not-applied',
    track: 'robotica',
    category: 'ROS 2',
    symptom: 'Los cambios en el archivo de parámetros no tienen efecto en el nodo.',
    causes: [
      { cause: 'El nodo lee parámetros solo al iniciar y no se ha reiniciado.', check: 'Revisa si los parámetros son read-only o si el nodo declara un parámetro con estado inmutable.', fix: 'Reinicia el nodo tras cambiar el YAML o usa parámetros dinámicos (declare_parameter con descriptor).' },
      { cause: 'Ruta del archivo de parámetros incorrecta en el launch.', check: 'Revisa la ruta passada a parameter_file y si el archivo existe.', fix: 'Corrige la ruta usando $(find-pkg-share mi_pkg)/config/params.yaml.' },
      { cause: 'Namespace del nodo distinto al del archivo YAML.', check: 'Compara el namespace del nodo con la estructura del YAML (/** o /mi_nodo).', fix: 'Ajusta el YAML al namespace real o usa comodines correctamente.' },
      { cause: 'Valor sobrescrito por un argumento del launch.', check: 'Revisa si el launch pasa el parámetro explícitamente con un valor fijo.', fix: 'Elimina la sobrescritura o usa LaunchConfiguration para leer el valor del argumento.' }
    ],
    prevention: 'Documenta qué parámetros son dinámicos, valida las rutas con ros2 param list y usa namespaces coherentes.'
  },
  {
    id: 'rob-launch-pkg-missing',
    track: 'robotica',
    category: 'ROS 2',
    symptom: 'El launch file falla: "package not found" o no encuentra el ejecutable.',
    causes: [
      { cause: 'El workspace no está sourced (install/setup.bash).', check: 'Ejecuta ros2 pkg list | grep mi_pkg; si no aparece, falta source.', fix: 'Haz source de install/setup.bash y reintenta.' },
      { cause: 'El paquete no se ha compilado o la compilación falló.', check: 'Revisa el directorio install/ y los logs de colcon para errores.', fix: 'Compila con colcon build --packages-select mi_pkg y corrige los errores.' },
      { cause: 'Nombre del paquete o del ejecutable mal escrito en el launch.', check: 'Compara el contenido del launch con package.xml y setup.py/CMakeLists.txt.', fix: 'Corrige el nombre del paquete y del nodo en el archivo launch.' },
      { cause: 'Uso de $(find ...) en lugar de $(find-pkg-share ...) en ROS 2.', check: 'Revisa la sintaxis de sustitución del launch file.', fix: 'Usa las sustituciones de launch_ros: $(find-pkg-share), $(find-pkg-prefix).' }
    ],
    prevention: 'Usa un script de entorno, compila y hace source en CI, y valida la sintaxis de los launch con ros2 launch --show-args.'
  },
  {
    id: 'rob-rosbag-missing',
    track: 'robotica',
    category: 'ROS 2',
    symptom: 'El rosbag no graba los topics esperados o el archivo queda vacío.',
    causes: [
      { cause: 'Los topics no existen o tienen nombres distintos a los del comando de grabación.', check: 'Ejecuta ros2 topic list antes de grabar y compara con la lista del rosbag.', fix: 'Corrige los nombres en el comando ros2 bag record o usa -a para grabar todos.' },
      { cause: 'QoS incompatible: el bag no puede suscribirse a un publisher transient_local/durable.', check: 'Usa ros2 topic info -v para comparar QoS; un bag con QoS volatile no recibe datos latched.', fix: 'Proporciona un archivo de configuración de QoS al bag o ajusta el publisher.' },
      { cause: 'Disco insuficiente o el bag se grabó en una partición llena.', check: 'Revisa df -h y los logs del rosbag.', fix: 'Libera espacio o cambia la ruta de almacenamiento.' },
      { cause: 'Se detuvo la grabación antes de tiempo (SIGINT no cerró el archivo).', check: 'Revisa si el directorio del bag tiene metadata.yaml y el archivo .db3 con datos.', fix: 'Detén con Ctrl+C y espera a que el bag finalize; usa ros2 bag info para verificar.' }
    ],
    prevention: 'Verifica topics y QoS antes de grabar, controla espacio en disco y valida el bag con ros2 bag info al terminar.'
  },
  {
    id: 'rob-sensor-transform',
    track: 'robotica',
    category: 'ROS 2',
    symptom: 'Los datos del sensor aparecen desplazados o girados respecto al robot en RViz.',
    causes: [
      { cause: 'Transformación estática sensor→base_link con offsets incorrectos.', check: 'Compara la posición publicada con la ubicación física real del sensor en el robot.', fix: 'Corrige los valores x/y/z y la rotación del static_transform_publisher o del URDF.' },
      { cause: 'Frame del sensor distinto entre el mensaje y la transformación.', check: 'Compara header.frame_id del topic con el frame del transform.', fix: 'Unifica el nombre del frame en el driver y en la transformación.' },
      { cause: 'Orden de rotación incorrecto (roll/pitch/yaw aplicados en otro orden).', check: 'Verifica las convenciones de ejes del sensor y del mensaje.', fix: 'Usa cuaterniones o aplica las rotaciones en el orden correcto (TF usa xyz + yaw/pitch/roll).' },
      { cause: 'Datos del sensor en un marco distinto al declarado (p. ej. cámara optical vs base).', check: 'Revisa si el driver publica en camera_optical_frame y no en camera_frame.', fix: 'Publica la transformación intermedia optical→camera con la rotación de 90° correspondiente.' }
    ],
    prevention: 'Mide físicamente la posición de cada sensor, documenta su frame y valida la nube de puntos en RViz con objetos conocidos.'
  },

  // =====================================================================
  // IA (45)
  // =====================================================================

  {
    id: 'ai-loss-not-drop',
    track: 'ai',
    category: 'entrenamiento',
    symptom: 'La pérdida de entrenamiento se queda plana o baja apenas nada tras muchas épocas.',
    causes: [
      { cause: 'Learning rate demasiado bajo (o demasiado alto, que impide convergencia).', check: 'Dibuja la curva de loss para varios learning rates con un LR range test.', fix: 'Usa un learning rate finder y prueba 1e-3 para Adam o 1e-4 para fine-tuning.' },
      { cause: 'Datos o etiquetas incorrectas (etiquetas desalineadas con las entradas).', check: 'Inspecciona 20 muestras: ¿la etiqueta corresponde realmente a la entrada?', fix: 'Corrige el pipeline de datos, verifica el orden de mapeo y vuelve a generar el dataset.' },
      { cause: 'Modelo sin capacidad suficiente o arquitectura inadecuada.', check: 'Prueba a sobreajustar un batch pequeño: si ni eso logra loss ~0, hay un bug.', fix: 'Aumenta la capacidad del modelo o revisa la arquitectura y la función de pérdida.' },
      { cause: 'Normalización o preprocesado inconsistente entre entrenamiento e inferencia.', check: 'Compara la media/desviación de los batches con las usadas en inferencia.', fix: 'Aplica la misma normalización en ambas fases y guarda los estadísticos con el modelo.' }
    ],
    prevention: 'Empieza con un sobreajuste de un batch pequeño como smoke test, registra hiperparámetros y valida el pipeline de datos antes de entrenar.'
  },
  {
    id: 'ai-val-loss-up',
    track: 'ai',
    category: 'entrenamiento',
    symptom: 'La pérdida de validaciónsube mientras la de entrenamiento sigue bajando (overfitting).',
    causes: [
      { cause: 'Modelo demasiado complejo para la cantidad de datos.', check: 'Compara el gap entre train loss y val loss: si crece sostenidamente, hay overfitting.', fix: 'Reduce la capacidad, añade regularización L2/dropout y usa early stopping.' },
      { cause: 'Poco datos de entrenamiento o distribución estrecha.', check: 'Cuenta las muestras por clase y revisa la diversidad.', fix: 'Aumenta el dataset, usa data augmentation y stratified splits.' },
      { cause: 'Fuga de datos al entrenamiento (duplicados entre train y val).', check: 'Busca muestras duplicadas o muy similares entre ambos splits.', fix: 'Deduplica antes de dividir y usa división por grupo o por tiempo cuando aplique.' },
      { cause: 'Entrenamiento demasiado prolongado sin early stopping.', check: 'Revisa en qué época empieza a subir la val loss.', fix: 'Guarda el mejor checkpoint y detén el entrenamiento con early stopping (patience 5–10).' }
    ],
    prevention: 'Usa early stopping, regularización y augmentation desde el principio, y monitoriza siempre train y val juntas.'
  },
  {
    id: 'ai-exploding-grad',
    track: 'ai',
    category: 'optimización',
    symptom: 'Los gradientes explotan: la loss salta a valores enormes o se vuelve NaN de golpe.',
    causes: [
      { cause: 'Learning rate excesivo.', check: 'Reduce el learning rate en un orden de magnitud y observa la estabilidad.', fix: 'Baja el LR o usa un scheduler con warmup.' },
      { cause: 'RNN o redes profundas sin gradient clipping.', check: 'Mide la norma de los gradientes antes del step.', fix: 'Aplica clip_by_global_norm (p. ej. norma 1.0–5.0) antes del optimizer.step().' },
      { cause: 'Datos con escalas descontroladas (features enormes).', check: 'Revisa el rango de las entradas y normaliza.', fix: 'Estandariza o normaliza los datos y usa BatchNorm/LayerNorm.' },
      { cause: 'Inicialización de pesos inadecuada.', check: 'Revisa la distribución inicial de los pesos.', fix: 'Usa inicialización Xavier/He según la activación.' }
    ],
    prevention: 'Usa gradient clipping, normalización de datos y learning rate con warmup; monitoriza la norma de gradientes en el logging.'
  },
  {
    id: 'ai-vanishing-grad',
    track: 'ai',
    category: 'optimización',
    symptom: 'Los gradientes desaparecen: las capas iniciales apenas aprenden y la loss no baja.',
    causes: [
      { cause: 'Demasiadas capas con activaciones sigmoid/tanh saturadas.', check: 'Inspecciona los gradientes por capa: ¿los primeros son ~0?', fix: 'Usa ReLU/GELU y conexiones residuales (skip connections).' },
      { cause: 'Mala inicialización que hace que las activaciones se desvanezcan.', check: 'Mide la varianza de activaciones por capa.', fix: 'Usa inicialización He con ReLU o Xavier con tanh, y BatchNorm/LayerNorm.' },
      { cause: 'Red muy profunda sin normalización entre capas.', check: 'Añade logging de normas de activación y gradiente por capa.', fix: 'Inserta LayerNorm o BatchNorm y usa arquitecturas con residual connections.' },
      { cause: 'Learning rate demasiado bajo para las primeras capas.', check: 'Prueba un LR mayor o advanced optimizers.', fix: 'Usa learning rate por grupo de parámetros (menor para capas preentrenadas, mayor para la cabeza).' }
    ],
    prevention: 'Diseña con activaciones ReLU/GELU, conexiones residuales, normalización e inicialización adecuada.'
  },
  {
    id: 'ai-nan-loss',
    track: 'ai',
    category: 'entrenamiento',
    symptom: 'La pérdida se vuelve NaN en algún punto del entrenamiento.',
    causes: [
      { cause: 'División por cero o log(0) en la función de pérdida.', check: 'Revisa la pérdida: añade un epsilon (1e-8) dentro de log o división.', fix: 'Usa implementaciones estables (p. ej. cross_entropy con logits) y clip de valores.' },
      { cause: 'Gradientes explotantes que producen pesos Inf.', check: 'Mide la norma de gradientes justo antes del NaN.', fix: 'Aplica gradient clipping y reduce el learning rate.' },
      { cause: 'Datos de entrada con NaN o Inf.', check: 'Ejecuta torch.isfinite(x).all() sobre los batches.', fix: 'Limpia o descarta muestras corruptas y valida el pipeline de datos.' },
      { cause: 'Mixed precision (fp16) sin loss scaling.', check: 'Desactiva fp16 y comprueba si el NaN desaparece.', fix: 'Usa GradScaler (AMP) o entrena en bf16/fp32.' }
    ],
    prevention: 'Añade asserts de finitud en datos y pesos, usa loss functions estables y activa AMP con loss scaling.'
  },
  {
    id: 'ai-gpu-oom',
    track: 'ai',
    category: 'entrenamiento',
    symptom: 'CUDA out of memory: el entrenamiento se detiene por falta de VRAM.',
    causes: [
      { cause: 'Batch size demasiado grande para la VRAM disponible.', check: 'Reduce el batch size a la mitad y vuelve a intentar.', fix: 'Baja el batch size o usa gradient accumulation para mantener el batch efectivo.' },
      { cause: 'Activaciones guardadas para backprop en una red muy profunda.', check: 'Mide el consumo con torch.cuda.memory_summary().', fix: 'Usa gradient checkpointing (recompute de activaciones) y secuencias más cortas.' },
      { cause: 'Memoria fragmentada o no liberada de entrenamientos previos.', check: 'Revisa nvidia-smi: ¿hay procesos fantasma ocupando VRAM?', fix: 'Libera variables con del y torch.cuda.empty_cache(), y mata procesos huérfanos.' },
      { cause: 'Secuencias de entrada muy largas (LLM) que escalan memoria al cuadrado.', check: 'Mide la longitud máxima de secuencia en el batch.', fix: 'Recorta o empaqueta secuencias, usa flash-attention y limita max_length.' }
    ],
    prevention: 'Dimensiona batch y longitud de secuencia según VRAM, usa gradient checkpointing y monitoriza memoria con nvidia-smi.'
  },
  {
    id: 'ai-slow-training',
    track: 'ai',
    category: 'entrenamiento',
    symptom: 'El entrenamiento es mucho más lento de lo esperado (baja utilización de GPU).',
    causes: [
      { cause: 'Cuello de botella en el DataLoader (CPU lenta o pocos workers).', check: 'Mide el tiempo de carga de datos vs el step: con nvidia-smi, ¿la GPU está al 20 %?', fix: 'Aumenta num_workers, usa pin_memory y almacena datos en SSD o en memoria.' },
      { cause: 'Batch size pequeño que infrautiliza la GPU.', check: 'Aumenta el batch size y mide el throughput.', fix: 'Sube el batch size hasta llenar VRAM o usa gradient accumulation.' },
      { cause: 'Operaciones costosas en CPU o transferencias frecuentes CPU↔GPU.', check: 'Busca .cpu()/.numpy() dentro del bucle de entrenamiento.', fix: 'Mantén los tensores en GPU y vectoriza las operaciones.' },
      { cause: 'Precisión innecesariamente alta (fp32 en hardware con buen bf16/fp16).', check: 'Comprueba si AMP está desactivado.', fix: 'Activa mixed precision (torch.cuda.amp) o usa bf16 en GPUs modernas.' }
    ],
    prevention: 'Perfilad el entrenamiento con torch.profiler, usad DataLoaders eficientes y mixed precision, y monitorizad la utilización de GPU.'
  },
  {
    id: 'ai-slow-inference',
    track: 'ai',
    category: 'serving',
    symptom: 'La inferencia es lenta: cada petición tarda demasiado en devolver resultado.',
    causes: [
      { cause: 'Modelo sin optimizar para inferencia (sin cuantización ni compilación).', check: 'Mide latencia y throughput con batch size 1 y compara con un modelo cuantizado.', fix: 'Usa cuantización INT8/FP8, TorchScript/ONNX o TensorRT y kernels fusionados.' },
      { cause: 'Servidor que procesa una petición a la vez sin batching.', check: 'Revisa la configuración del servidor (p. ej. max_batch_size en vLLM/TGI).', fix: 'Activa continuous batching y ajusta el tamaño máximo de batch.' },
      { cause: 'Preprocesado/postprocesado costoso en la ruta crítica.', check: 'Perfilad el tiempo total y el del modelo por separado.', fix: 'Vectoriza y mueve el preprocesado a la GPU o a un servicio separado.' },
      { cause: 'CPU o red saturadas por logging o serialización excesiva.', check: 'Monitoriza CPU, red y disco durante la carga.', fix: 'Reduce logging síncrono y usa formatos eficientes (p. ej. msgpack, gzip).' }
    ],
    prevention: 'Perfilad la inferencia de extremo a extremo, usad motores optimizados y medid latencia p50/p95/p99 en producción.'
  },
  {
    id: 'ai-ttft-high',
    track: 'ai',
    category: 'LLM',
    symptom: 'El Time To First Token (TTFT) es alto: el usuario espera demasiado a que empiece la respuesta.',
    causes: [
      { cause: 'Prompt muy largo que aumenta el coste del prefill.', check: 'Mide el número de tokens de entrada y correlaciónalo con el TTFT.', fix: 'Usa prompt caching, recorta contexto y mueve instrucciones largas a la caché del sistema.' },
      { cause: 'Cola de peticiones por falta de capacidad (continuous batching saturado).', check: 'Revisa las métricas del servidor: número de requests en espera.', fix: 'Escálalo con más réplicas o GPU, y limita la concurrencia por cliente.' },
      { cause: 'Modelo muy grande cargado en múltiples GPUs con comunicación lenta.', check: 'Mide el tiempo de prefill por capa y la interconexión entre GPUs.', fix: 'Usa tensor parallelism con NVLink y modelos más pequeños o destilados cuando sea posible.' },
      { cause: 'Streaming desactivado: el servidor espera a generar toda la respuesta.', check: 'Verifica si usas stream=True y si el gateway soporta SSE.', fix: 'Activa streaming (SSE) para enviar el primer token en cuanto esté listo.' }
    ],
    prevention: 'Usa prompt caching, streaming y capacity planning basado en TTFT p95; monitoriza la cola de peticiones.'
  },
  {
    id: 'ai-incoherent-output',
    track: 'ai',
    category: 'prompting',
    symptom: 'El modelo genera respuestas incoherentes, contradictorias o que ignoran instrucciones.',
    causes: [
      { cause: 'Prompt ambiguo o con instrucciones contradictorias.', check: 'Revisa el prompt: ¿hay requisitos opuestos o poco claros?', fix: 'Reescribe con instrucciones claras, estructuradas y ejemplos (few-shot).' },
      { cause: 'Temperatura o top_p demasiado altos.', check: 'Baja la temperatura a 0 y comprueba si mejora la coherencia.', fix: 'Usa temperatura 0–0.3 para tareas deterministas y 0.7 para creative.' },
      { cause: 'Contexto demasiado largo con información irrelevante (lost in the middle).', check: 'Reduce el contexto y coloca la instrucción clave al principio y al final.', fix: 'Recorta contexto, usa RAG con reranking y repite la instrucción crítica.' },
      { cause: 'Modelo no adecuado para la tarea o versión cambiada.', check: 'Comprueba qué modelo y versión se están usando y si hubo un cambio reciente.', fix: 'Fija la versión del modelo en producción y evalúa cambios en un entorno de staging.' }
    ],
    prevention: 'Fija prompts con few-shot, usa baja temperatura para tareas críticas, evalúa cambios de modelo y versiona los prompts.'
  },
  {
    id: 'ai-hallucination',
    track: 'ai',
    category: 'LLM',
    symptom: 'El modelo inventa hechos, citas o datos que no existen.',
    causes: [
      { cause: 'Falta de información de apoyo en el prompt (sin RAG).', check: 'Comprueba si la respuesta debería basarse en documentos que no se están pasando.', fix: 'Implementa RAG con fuentes verificables y pide citas explícitas.' },
      { cause: 'Prompt que no pide abstención cuando no sabe la respuesta.', check: 'Revisa si el prompt permite decir "no lo sé".', fix: 'Añade instrucciones: "si no tienes evidencia, responde que no lo sabes".' },
      { cause: 'Temperatura alta que favorece respuestas creativas.', check: 'Baja la temperatura y compara el mismo prompt.', fix: 'Usa temperatura baja (0–0.2) y validación con reglas o un modelo verificador.' },
      { cause: 'Documentos recuperados de baja calidad o desactualizados.', check: 'Inspecciona los fragmentos recuperados: ¿contienen la respuesta correcta?', fix: 'Mejora la calidad de la base de conocimiento y añade fechas y metadatos de validez.' }
    ],
    prevention: 'Usa RAG con citas, permite abstención, baja temperatura en tareas factuales y mide la tasa de alucinaciones con evals.'
  },
  {
    id: 'ai-rag-garbage',
    track: 'ai',
    category: 'RAG',
    symptom: 'El RAG recupera fragmentos irrelevantes y las respuestas no se basan en los documentos correctos.',
    causes: [
      { cause: 'Chunking inadecuado (trozos demasiado grandes o sin solapamiento).', check: 'Inspecciona los chunks: ¿cortan frases o mezclan secciones distintas?', fix: 'Ajusta tamaño (300–800 tokens) y solapamiento (10–20 %) y respeta límites de sección.' },
      { cause: 'Embeddings genéricos que no capturan el vocabulario del dominio.', check: 'Compara similitudes: ¿el fragmento correcto puntúa bajo?', fix: 'Usa un modelo de embeddings de dominio o fine-tunea con pares consulta-documento.' },
      { cause: 'Consulta del usuario mal reformulada para búsqueda vectorial.', check: 'Logra la query final usada para buscar y compárala con la pregunta original.', fix: 'Añade reescritura de consulta (query rewriting) o expansión con sinónimos.' },
      { cause: 'Falta de filtros metadata (fecha, categoría, permisos).', check: 'Revisa si los filtros de metadatos se aplican antes de la búsqueda.', fix: 'Añade pre-filtros por metadata y combina búsqueda vectorial con keywords (hybrid search).' }
    ],
    prevention: 'Evalúa la calidad de retrieval por separado (recall@k), usa hybrid search y revisa periódicamente los chunks.'
  },
  {
    id: 'ai-embedding-search',
    track: 'ai',
    category: 'RAG',
    symptom: 'La búsqueda por embeddings devuelve resultados poco relacionados (baja similitud incluso para coincidencias obvias).',
    causes: [
      { cause: 'Distancia métrica incorrecta (coseno vs euclídea) o vectores no normalizados.', check: 'Verifica la métrica del índice y si los vectores están normalizados a norma 1.', fix: 'Usa similitud del coseno con vectores normalizados o corrige la métrica del índice.' },
      { cause: 'Modelo de embeddings distinto entre indexación y consulta.', check: 'Compara el modelo usado al indexar con el usado al buscar (dimensiones y versión).', fix: 'Usa el mismo modelo y versión en ambos extremos y reindexa si cambias.' },
      { cause: 'Consultas y documentos de naturalezas distintas sin instrucciones de tarea.', check: 'Revisa si el modelo requiere prefijos (p. ej. "Represent this sentence for searching").', fix: 'Aplica los prefijos de consulta/documento que recomienda el modelo.' },
      { cause: 'Índice aproximado (HNSW/IVF) con parámetros demasiado agresivos.', check: 'Compara resultados con búsqueda exacta (flat) sobre un subconjunto.', fix: 'Aumenta ef_search/nprobe o usa búsqueda exacta para datasets pequeños.' }
    ],
    prevention: 'Documenta modelo y métrica de embeddings, valida con un set de consultas de prueba y monitoriza recall@k tras cambios.'
  },
  {
    id: 'ai-prompt-injection',
    track: 'ai',
    category: 'seguridad',
    symptom: 'El agente o chatbot sigue instrucciones malicious incrustadas en documentos o entradas de usuario.',
    causes: [
      { cause: 'Contenido no confiable concatenado directamente en el prompt del sistema.', check: 'Revisa si los documentos recuperados se insertan sin delimitar como datos.', fix: 'Usa delimitadores claros, etiqueta el contenido como dato y aplica instrucciones de ignore-overrides.' },
      { cause: 'El modelo no distingue entre instrucciones del sistema y contenido.', check: 'Prueba con un documento que diga "ignora las instrucciones anteriores".', fix: 'Añade un prompt de sistema reforzado y un wrapper que separe instrucciones de datos.' },
      { cause: 'Herramientas con permisos excesivos accesibles al modelo.', check: 'Revisa qué herramientas puede llamar el agente y con qué privilegios.', fix: 'Aplica principio de menor privilegio, require confirmación para acciones sensibles y valida salidas.' },
      { cause: 'Falta de filtrado de salida y validación de schemas.', check: 'Comprueba si las respuestas se validan contra un esquema esperado.', fix: 'Usa structured outputs con Pydantic y rechaza salidas fuera del esquema.' }
    ],
    prevention: 'Trata todo contenido externo como datos no confiables, usa guardrails de entrada/salida y limita los permisos de herramientas.'
  },
  {
    id: 'ai-agent-loop',
    track: 'ai',
    category: 'agentes',
    symptom: 'El agente entra en bucle: repite la misma herramienta o razonamiento indefinidamente.',
    causes: [
      { cause: 'Falta de límite de iteraciones o pasos máximos.', check: 'Cuenta los pasos del trace: ¿superan el máximo esperado?', fix: 'Establece max_iterations y devuelve una respuesta de fallo controlado al excederlo.' },
      { cause: 'La herramienta devuelve siempre el mismo error y el agente reintenta igual.', check: 'Revisa los logs de la herramienta: ¿el error es el mismo en cada intento?', fix: 'Detecta errores repetidos, cambia de estrategia o termina con un mensaje claro.' },
      { cause: 'El agente no registra lo que ya intentó (falta de memoria de estado).', check: 'Observa si repite acciones idénticas sin reconocerlas.', fix: 'Mantiene un historial de acciones y resultados y pide al modelo que no repita pasos.' },
      { cause: 'Objetivo ambiguo que nunca se puede marcar como completado.', check: 'Revisa la definición de "hecho" en el prompt del agente.', fix: 'Define criterios de terminación explícitos y una herramienta de "finalizar tarea".' }
    ],
    prevention: 'Define límites de iteraciones, criterios de terminación claros y detecta bucles por acciones repetidas.'
  },
  {
    id: 'ai-tool-calling-fail',
    track: 'ai',
    category: 'agentes',
    symptom: 'El modelo no llama a las herramientas correctamente: nombres inventados o argumentos inválidos.',
    causes: [
      { cause: 'Descripción de herramientas ambigua o esquema de parámetros incompleto.', check: 'Revisa los JSON Schema de tus tools: ¿incluyen descripciones y tipos claros?', fix: 'Define esquemas precisos con descripciones, required fields y ejemplos.' },
      { cause: 'El modelo elige la herramienta equivocada por nombres confusos.', check: 'Logra la herramienta seleccionada y compárala con la esperada.', fix: 'Usa nombres descriptivos y únicos, y añade pocas herramientas bien diferenciadas por vez.' },
      { cause: 'Falta de ejemplos few-shot de uso de herramientas.', check: 'Comprueba si el prompt incluyeejemplos de tool calls correctos.', fix: 'Añade 2–3 ejemplos de llamadas correctas en el prompt o usa fine-tuning de tool calling.' },
      { cause: 'El modelo no soporta tool calling o el proveedor cambió el formato.', check: 'Verifica la versión del modelo y el formato de tools de la API.', fix: 'Usa un modelo con soporte nativo y adaptate al formato de la API (function calling / tools).' }
    ],
    prevention: 'Diseña esquemas robustos, nombres claros y ejemplos, y valida los argumentos con un parser antes de ejecutar.'
  },
  {
    id: 'ai-rate-limits',
    track: 'ai',
    category: 'producción',
    symptom: 'La aplicación recibe errores 429 (rate limit exceeded) y fallan peticiones de usuarios.',
    causes: [
      { cause: 'Exceso de peticiones por segundo o tokens por minuto del proveedor.', check: 'Revisa los headers Retry-After y las métricas de RPM/TPM de tu cuenta.', fix: 'Implementa exponential backoff con jitter y respeta Retry-After.' },
      { cause: 'Picos de tráfico no controlados (sin cola ni limitación).', check: 'Correlaciona los 429 con picos de concurrencia.', fix: 'Añade una cola de peticiones, semáforo de concurrencia y limitación por usuario.' },
      { cause: 'Reintentos agresivos que agravan el problema.', check: 'Cuenta cuántos reintentos se hacen por petición.', fix: 'Limita los reintentos (3–5), usa backoff y circuit breaker.' },
      { cause: 'Límite de cuenta bajo para el volumen real.', check: 'Compara tu cuota contratada con el consumo pico.', fix: 'Solicita aumento de cuota o distribuye carga entre varias claves/modelos.' }
    ],
    prevention: 'Implementa backoff, colas y circuit breakers, monitoriza cuotas y dimensiona el plan según el tráfico real.'
  },
  {
    id: 'ai-cost-spike',
    track: 'ai',
    category: 'costes',
    symptom: 'La factura de la API se dispara sin un cambio evidente en el producto.',
    causes: [
      { cause: 'Aumento del número de tokens por petición (prompts o contextos más largos).', check: 'Analiza el consumo de tokens por endpoint y compáralo con la semana anterior.', fix: 'Recorta prompts, usa prompt caching y limita max_tokens.' },
      { cause: 'Bucle o bug que dispara llamadas repetidas al modelo.', check: 'Agrupa llamadas por session_id o user_id y busca patrones repetitivos.', fix: 'Corrige el bug, añade límites por usuario y detecta anomalías en tiempo real.' },
      { cause: 'Uso de un modelo más caro del previsto por un cambio de configuración.', check: 'Revisa el field model en las peticiones y los precios por millón de tokens.', fix: 'Fija el modelo en configuración, usa modelos más baratos para tareas simples y enruta por complejidad.' },
      { cause: 'Caché desactivada o con baja tasa de aciertos.', check: 'Mide el cache hit rate: si es ~0, cada petición paga el prompt completo.', fix: 'Activa prompt caching y semántico cuando aplique.' }
    ],
    prevention: 'Monitoriza coste por usuario y endpoint, configura alertas de gasto, usa caché y enruta modelos por coste.'
  },
  {
    id: 'ai-drift',
    track: 'ai',
    category: 'producción',
    symptom: 'El rendimiento del modelo en producción degrada con el tiempo sin haber cambiado el código.',
    causes: [
      { cause: 'Data drift: la distribución de entradas cambió (nuevos temas, jerga, idioma).', check: 'Compara distribuciones de embeddings o features de producción vs entrenamiento.', fix: 'Monitoriza drift, recolecta nuevos datos y reentrena o actualiza el RAG.' },
      { cause: 'Concept drift: la relationship entre entrada y salida cambió.', check: 'Mide la precisión con etiquetas frescas: ¿cae en segmentos concretos?', fix: 'Reetiqueta datos recientes y reentrena con ventanas temporales.' },
      { cause: 'Cambios en dependencias externas (API del proveedor, modelo actualizado).', check: 'Revisa changelogs y versiones de modelos usados.', fix: 'Fija versiones y evalúa cualquier cambio en staging antes de producir.' },
      { cause: 'Base de conocimiento desactualizada en un sistema RAG.', check: 'Comprueba la fecha de los documentos recuperados.', fix: 'Establece un pipeline de ingesta continua y caducidad de documentos.' }
    ],
    prevention: 'Implementa monitorización de drift y calidad, un ciclo de reentrenamiento periódico y evaluaciones en producción.'
  },
  {
    id: 'ai-misleading-metrics',
    track: 'ai',
    category: 'evaluación',
    symptom: 'Las métricas offline son excelentes pero los usuarios reportan mala calidad.',
    causes: [
      { cause: 'Dataset de evaluación no representativo del tráfico real.', check: 'Compara la distribución del eval set con la de producción.', fix: 'Construye evals a partir de interacciones reales anonimizadas y muestrea por segmento.' },
      { cause: 'Métrica incorrecta para el objetivo (p. ej. accuracy con clases desbalanceadas).', check: 'Calcula precisión, recall y F1 por clase además de la accuracy.', fix: 'Elige métricas alineadas con el negocio (F1, AUC, task success, coste).' },
      { cause: 'Overfitting al eval set por iterar demasiado en él.', check: '¿El equipo optimiza prompts contra el mismo set cada día?', fix: 'Reserva un holdout ciego y rota conjuntos de evaluación.' },
      { cause: 'Falta de evaluación de la experiencia de usuario (latencia, tono, utilidad).', check: 'Revisa si solo mides exactitud y no task completion o satisfacción.', fix: 'Añade evals de latencia, tono, safety y una métrica de éxito de tarea.' }
    ],
    prevention: 'Alinea métricas con objetivos de negocio, usa evals representativos y reserva un holdout ciego y feedback de producción.'
  },
  {
    id: 'ai-checkpoint-load',
    track: 'ai',
    category: 'MLOps',
    symptom: 'El checkpoint no carga: errores de forma, claves faltantes o incompatibilidad de versión.',
    causes: [
      { cause: 'Arquitectura del modelo distinta a la del checkpoint (claves o shapes cambiadas).', check: 'Imprime state_dict.keys() del modelo y del checkpoint y compáralos.', fix: 'Carga con strict=False si los cambios son esperados o adapta la arquitectura.' },
      { cause: 'Prefix de keys distinto (p. ej. "module." de DDP o "model." de Lightning).', check: 'Revisa las primeras claves del checkpoint: ¿empiezan con module.?,', fix: 'Elimina el prefijo con un rename de keys antes de cargar.' },
      { cause: 'Versión de la librería incompatible (torch/transformers).', check: 'Compara las versiones usadas al guardar y al cargar.', fix: 'Fija versiones en el entorno o usa formatos estándar (safetensors, ONNX).' },
      { cause: 'Archivo corrupto o descarga incompleta.', check: 'Verifica el hash del archivo y su tamaño frente al esperado.', fix: 'Vuelve a descargar o copiar el checkpoint y valida el checksum.' }
    ],
    prevention: 'Guarda metadata de versión y arquitectura con cada checkpoint, usa safetensors y valida la carga en CI.'
  },
  {
    id: 'ai-deps-broken',
    track: 'ai',
    category: 'dependencias',
    symptom: 'El entorno se rompe tras una actualización: errores de import o versiones incompatibles.',
    causes: [
      { cause: 'Actualización automática de una librería que cambió la API.', check: 'Revisa pip freeze y el changelog de la librería afectada.', fix: 'Fija versiones con un lockfile (poetry.lock, uv.lock) y revivala a la versión anterior.' },
      { cause: 'Conflicto entre versiones de CUDA, cuDNN y PyTorch.', check: 'Ejecuta torch.version.cuda y compruébalo con nvidia-smi.', fix: 'Instala la rueda de PyTorch compatible con tu versión de CUDA.' },
      { cause: 'Dependencias transitivas con requisitos contradictorios.', check: 'Ejecuta pip check para detectar conflictos.', fix: 'Usa un resolver moderno (uv, poetry) y un entorno virtual limpio.' },
      { cause: 'Entorno global contaminado por instalaciones previas.', check: 'Comprueba si estás usando un venv y cuál es el intérprete activo.', fix: 'Recrea el entorno virtual desde cero con el lockfile.' }
    ],
    prevention: 'Usa lockfiles, entornos virtuales por proyecto y contenedores reproducibles; actualiza dependencias en PR con CI.'
  },
  {
    id: 'ai-imbalanced',
    track: 'ai',
    category: 'datos',
    symptom: 'El clasificador siempre predice la clase mayoritaria y tiene recall casi cero en las minoritarias.',
    causes: [
      { cause: 'Desbalance extremo de clases en el entrenamiento.', check: 'Cuenta las muestras por clase y calcula el ratio.', fix: "Usa class_weight='balanced', oversampling (SMOTE) o undersampling." },
      { cause: 'Umbral de decisión por defecto (0.5) inadecuado.', check: 'Dibuja la curva precision-recall y busca el umbral óptimo.', fix: 'Ajusta el umbral de decisión por clase según la métrica objetivo.' },
      { cause: 'Pérdida no ponderada que ignora las clases raras.', check: 'Revisa la función de pérdida usada.', fix: 'Usa weighted cross-entropy o focal loss para dar peso a las clases difíciles.' },
      { cause: 'Evaluación con accuracy que esconde el problema.', check: 'Calcula la matriz de confusión y el recall por clase.', fix: 'Optimiza F1 macro o AUC-PR y reporta métricas por clase.' }
    ],
    prevention: 'Analiza el balance de clases antes de entrenar, usa ponderación y métricas adecuadas, y reporta resultados por clase.'
  },
  {
    id: 'ai-data-leakage',
    track: 'ai',
    category: 'datos',
    symptom: 'El modelo obtiene métricas casi perfectas offline pero falla en producción.',
    causes: [
      { cause: 'Preprocesado (normalización, imputación) ajustado sobre todo el dataset antes de dividir.', check: 'Revisa si fit() se aplica antes del train_test_split.', fix: 'Ajusta transformadores solo sobre train y aplícalos a val/test.' },
      { cause: 'Duplicados o muestras muy similares repartidos entre train y test.', check: 'Busca duplicados exactos y casi idénticas mediante hashes o embeddings.', fix: 'Deduplica antes de dividir y agrupa por entidad o tiempo.' },
      { cause: 'Features que codifican la etiqueta (target leakage).', check: 'Correlaciona cada feature con la etiqueta y busca valores imposibles en producción.', fix: 'Elimina features derivadas del objetivo y valida con ventanas temporales.' },
      { cause: 'División aleatoria cuando los datos tienen estructura temporal o por grupo.', check: '¿Hay varios registros del mismo usuario o periodo en ambos sets?', fix: 'Usa GroupKFold o división temporal (train en pasado, test en futuro).' }
    ],
    prevention: 'Diseña el split antes de cualquier preprocesado, usa pipelines de sklearn y busca fugas con tests de sentido común.'
  },
  {
    id: 'ai-forgetting',
    track: 'ai',
    category: 'fine-tuning',
    symptom: 'Tras el fine-tuning el modelo pierde capacidades generales (catastrophic forgetting).',
    causes: [
      { cause: 'Learning rate demasiado alto que destruye pesos preentrenados.', check: 'Compara el rendimiento en tareas generales antes y después.', fix: 'Baja el LR (1e-5 a 2e-5) y usa menos épocas.' },
      { cause: 'Dataset de fine-tuning demasiado estrecho o pequeño.', check: 'Revisa la diversidad de ejemplos y si cubre casos generales.', fix: 'Mezcla datos generales con los específicos o usa replay de ejemplos diversos.' },
      { cause: 'Fine-tuning de todas las capas en lugar de técnicas parametrically eficientes.', check: '¿Estás actualizando todos los pesos?', fix: 'Usa LoRA/QLoRA o congela las capas base y entrena solo la cabeza.' },
      { cause: 'Formato de entrenamiento que no coincide con el de inferencia.', check: 'Compara el template de chat usado al entrenar y al servir.', fix: 'Usa el mismo chat template y tokens especiales en ambas fases.' }
    ],
    prevention: 'Usa LoRA con LR bajo, mezcla datos generales y evalúa capacidades generales antes de desplegar.'
  },
  {
    id: 'ai-cross-model-prompt',
    track: 'ai',
    category: 'prompting',
    symptom: 'Un prompt funciona perfecto en un modelo pero falla en otro.',
    causes: [
      { cause: 'Diferencias en el chat template y tokens especiales entre modelos.', check: 'Compara el template de cada modelo y cómo inserta system/user/assistant.', fix: 'Usa el chat template propio de cada modelo (tokenizer.apply_chat_template).' },
      { cause: 'Sensibilidad distinta a instrucciones o formatos (JSON, Markdown).', check: 'Prueba el mismo contenido en distintos formatos y modelo.', fix: 'Ajusta el formato y usa structured outputs en lugar de depender del texto libre.' },
      { cause: 'Longitud de contexto o ventana efectiva distinta.', check: 'Compara max_context_length y cuánto contexto usa realmente cada modelo.', fix: 'Recorta y prioriza información según el modelo objetivo.' },
      { cause: 'Versión del modelo cambiada por el proveedor (modelo actualizado silenciosamente).', check: 'Consulta la versión exacta devuelta por la API en la respuesta.', fix: 'Fija una versión concreta y reevalúa los prompts con cada cambio.' }
    ],
    prevention: 'Versiona prompts por modelo, usa los chat templates oficiales y mantén un eval set por modelo objetivo.'
  },
  {
    id: 'ai-invalid-json',
    track: 'ai',
    category: 'LLM',
    symptom: 'El modelo no devuelve JSON válido o ignora el esquema solicitado.',
    causes: [
      { cause: 'Se pide JSON en lenguaje natural sin usar structured outputs.', check: 'Revisa si usas response_format o equivalentes del proveedor.', fix: 'Usa structured outputs / JSON mode con un schema estricto.' },
      { cause: 'El modelo añade texto explicativo o bloques Markdown alrededor del JSON.', check: 'Inspecciona la salida cruda: ¿empieza con ```json?', fix: 'Usa el modo JSON del proveedor y valida con un parser; limpia delimitadores si hace falta.' },
      { cause: 'Esquema demasiado complejo o con descripciones ambiguas.', check: 'Simplifica el esquema y comprueba si mejora el cumplimiento.', fix: 'Reduce la profundidad, usa tipos simples y añade descripciones claras.' },
      { cause: 'Temperatura alta o max_tokens bajo que corta la salida.', check: 'Revisa si la salida está truncada o es creativa en exceso.', fix: 'Baja temperatura y aumenta max_tokens con un modelo que soporte structured outputs.' }
    ],
    prevention: 'Usa structured outputs del proveedor con schema validado por Pydantic y rechaza salidas inválidas con reintento controlado.'
  },
  {
    id: 'ai-context-truncation',
    track: 'ai',
    category: 'LLM',
    symptom: 'El modelo "olvida" instrucciones o información al final de un contexto largo.',
    causes: [
      { cause: 'El prompt supera la ventana de contexto y se trunca silenciosamente.', check: 'Cuenta los tokens totales y compáralos con el límite del modelo.', fix: 'Recorta, comprime o rezuma el contexto y usa modelos con ventana mayor.' },
      { cause: 'Efecto "lost in the middle": información relevante en el centro se ignora.', check: 'Mueve la instrucción clave al principio/final y compara.', fix: 'Coloca la información crítica al inicio y al final y usa RAG con pocos fragmentos.' },
      { cause: 'Historial de conversación crecido sin resumen.', check: 'Mide los tokens del historial tras varias turnos.', fix: 'Implementa resumen de conversación o sliding window con retención de información clave.' },
      { cause: 'Documentos recuperados demasiado largos que desplazan la instrucción.', check: 'Mide cuántos tokens ocupan los fragmentos recuperados.', fix: 'Limita el número de chunks y aplica reranking para conservar solo los relevantes.' }
    ],
    prevention: 'Gestiona el presupuesto de tokens, resume el historial, coloca instrucciones clave en posiciones privilegiadas y monitoriza el uso de contexto.'
  },
  {
    id: 'ai-cache-miss',
    track: 'ai',
    category: 'producción',
    symptom: 'La caché de prompts tiene una tasa de aciertos casi nula y no reduce costes.',
    causes: [
      { cause: 'El prefijo varía entre peticiones (timestamp, ID de usuario, orden de campos).', check: 'Compara los primeros tokens de varias peticiones: ¿son idénticos?', fix: 'Coloca la parte estática (system prompt, ejemplos) al principio y los datos dinámicos al final.' },
      { cause: 'Cambio frecuente de modelo o de parámetros que invalida la caché.', check: 'Revisa si el modelo, la temperatura o los tools cambian entre peticiones.', fix: 'Agrupa peticiones por configuración idéntica y evita cambios innecesarios.' },
      { cause: 'La caché se configura con TTL muy corto o no se habilitó.', check: 'Verifica la configuración de cache_control y el TTL del proveedor.', fix: 'Activa prompt caching con TTL de 5 min o 1 h según el caso.' },
      { cause: 'Peticiones únicas sin patrones repetitivos (no hay qué cachear).', check: 'Analiza la similitud entre prompts de distintos usuarios.', fix: 'Usa caché semántica para consultas similares o acepta que el ahorro será limitado.' }
    ],
    prevention: 'Diseña prompts con prefijo estable, monitoriza el hit rate y ajusta TTL y estructura según los patrones reales.'
  },
  {
    id: 'ai-repetition',
    track: 'ai',
    category: 'LLM',
    symptom: 'El modelo repite frases o se queda en bucles de texto al generar.',
    causes: [
      { cause: 'Temperatura o top_p demasiado bajos que favorecen siempre el token más probable.', check: 'Sube ligeramente la temperatura y comprueba si desaparece.', fix: 'Usa temperatura 0.3–0.7 y top_p 0.9 para evitar bucles deterministas.' },
      { cause: 'Falta de penalización de repetición (frequency/presence penalty).', check: 'Revisa si usas repetition_penalty o frequency_penalty.', fix: 'Añade una penalización de repetición moderada (1.05–1.2).' },
      { cause: 'Prompt que contiene la misma frase varias veces.', check: 'Revisa el prompt en busca de repetición involuntaria.', fix: 'Elimina duplicados del prompt y varía los ejemplos few-shot.' },
      { cause: 'max_tokens demasiado alto sin criterio de parada.', check: 'Observa si el modelo sigue generando después de haber terminado la respuesta.', fix: 'Define stop sequences y limita max_tokens al necesario.' }
    ],
    prevention: 'Ajusta temperatura y penalizaciones, usa stop sequences y evita prompts repetitivos.'
  },
  {
    id: 'ai-domain-embeddings',
    track: 'ai',
    category: 'RAG',
    symptom: 'Los embeddings no capturan la terminología técnica del dominio (búsqueda deficiente en jerga).',
    causes: [
      { cause: 'Modelo de embeddings generalista sin vocabulario del dominio.', check: 'Prueba consultas con términos técnicos y revisa los resultados.', fix: 'Fine-tunea el modelo de embeddings con pares consulta-documento del dominio.' },
      { cause: 'Documentos con abreviaturas o códigos no explicados.', check: 'Identifica términos que nunca aparecen en el corpus de entrenamiento del modelo.', fix: 'Añade un glosario y expande abreviaturas en los documentos indexados.' },
      { cause: 'idioma distinto al del modelo de embeddings.', check: 'Verifica el idioma de documentos y consultas frente al modelo usado.', fix: 'Usa un modelo multilingüe o específico del idioma del corpus.' },
      { cause: 'Texto con mucho ruido (OCR, tablas desestructuradas).', check: 'Inspecciona los chunks indexados: ¿contienen artefacts o tablas ilegibles?', fix: 'Mejora la extracción de texto y limpia el contenido antes de indexar.' }
    ],
    prevention: 'Evalúa embeddings con consultas reales del dominio, usa modelos adecuados y limpia y enriquece el corpus indexado.'
  },
  {
    id: 'ai-reranker',
    track: 'ai',
    category: 'RAG',
    symptom: 'Añadir un reranker no mejora (o empeora) la calidad del retrieval.',
    causes: [
      { cause: 'El reranker recibe demasiados candidatos de baja calidad (el retrieve inicial es malo).', check: 'Mide recall@k antes del reranker: si el documento bueno no está, no puede recuperarlo.', fix: 'Mejora primero el retrieval (top_k mayor, hybrid search) y luego aplica reranking.' },
      { cause: 'Modelo de reranking no adecuado para el idioma o dominio.', check: 'Prueba con un par consulta-documento obvio y revisa el score.', fix: 'Usa un cross-encoder del idioma y dominio correctos.' },
      { cause: 'Overfitting del reranker a términos exactos (no semántica).', check: 'Prueba consultas parafraseadas y compara el orden.', fix: 'Entrena o ajusta el reranker con datos diversos y parafraseados.' },
      { cause: 'Latencia y coste añadidos sin beneficio medible.', check: 'Compara task success con y sin reranker en tu eval set.', fix: 'Desactívalo si no mejora o úsalo solo en consultas ambiguas.' }
    ],
    prevention: 'Mide recall@k y precisión por separado, valida el reranker con evals reales y úsalo solo cuando aporte beneficio medible.'
  },
  {
    id: 'ai-chunking',
    track: 'ai',
    category: 'RAG',
    symptom: 'Las respuestas del RAG son incompletas o pierden contexto porque los chunks rompen la información.',
    causes: [
      { cause: 'Chunks demasiado pequeños que separan una pregunta de su respuesta.', check: 'Revisa los chunks recuperados: ¿la respuesta y su contexto están en fragmentos distintos?', fix: 'Aumenta el tamaño de chunk o usa parent-document retrieval.' },
      { cause: 'Cortes que ignoran la estructura del documento (secciones, tablas).', check: 'Observa si los chunks empiezan o terminan a mitad de frase o sección.', fix: 'Usa recursive character splitting con separadores jerárquicos y respeta encabezados.' },
      { cause: 'Solapamiento insuficiente entre chunks.', check: 'Comprueba el overlap configurado (debe ser ~10–20 %).', fix: 'Aumenta el solapamiento para preservar contexto en los límites.' },
      { cause: 'Metadatos de sección no añadidos a cada chunk.', check: '¿Cada chunk sabe de qué documento y sección viene?', fix: 'Añade metadatos (título, sección, fecha) al contenido del chunk y úsalos en el prompt.' }
    ],
    prevention: 'Diseña el chunking según la estructura del documento, usa overlap y metadatos, y evalúa con preguntas que requieran contexto completo.'
  },
  {
    id: 'ai-vector-duplicates',
    track: 'ai',
    category: 'RAG',
    symptom: 'La base vectorial devuelve muchos resultados duplicados o casi idénticos.',
    causes: [
      { cause: 'Mismo documento indexado varias veces (reingesta sin deduplicación).', check: 'Cuenta los vectores por document_id y busca IDs repetidos.', fix: 'Usa IDs deterministas por chunk y operaciones upsert en lugar de insert.' },
      { cause: 'Chunks con solapamiento excesivo que generan vectores casi iguales.', check: 'Compara la similitud entre chunks vecinos.', fix: 'Reduce el overlap y elimina chunks redundantes antes de indexar.' },
      { cause: 'Falta de diversidad en el resultado (MMR desactivado).', check: 'Revisa los resultados: ¿son todos del mismo documento?', fix: 'Usa Max Marginal Relevance (MMR) o agrupa por documento y limita resultados por fuente.' },
      { cause: 'Metadatos de filtro no aplicados (versiones antiguas y nuevas conviven).', check: 'Comprueba si hay varias versiones del mismo documento activas.', fix: 'Aplica filtros por versión/fecha y elimina las obsoletas.' }
    ],
    prevention: 'Usa IDs deterministas y upserts, controla el overlap, aplica MMR y limpia versiones antiguas de forma programada.'
  },
  {
    id: 'ai-evals-production',
    track: 'ai',
    category: 'evaluación',
    symptom: 'Las evals internas no predicen la calidad que ven los usuarios en producción.',
    causes: [
      { cause: 'Evals basadas en casos ideales, no en fallos reales.', check: 'Revisa de dónde salieron los ejemplos del eval set.', fix: 'Añade casos reales de producción, especialmente donde el sistema falló.' },
      { cause: 'Evaluación con LLM-judge no calibrado con jueces humanos.', check: 'Correlaciona las puntuaciones del judge con anotaciones humanas.', fix: 'Calibra el judge con ejemplos etiquetados por humanos y revisa sus sesgos.' },
      { cause: 'Métricas promedio que esconden fallos en segmentos minoritarios.', check: 'Desglosa resultados por idioma, tipo de usuario o dominio.', fix: 'Reporta métricas por segmento y optimiza los peores.' },
      { cause: 'Falta de evaluación de atributos no funcionales (latencia, coste, safety).', check: '¿El eval mide solo corrección?', fix: 'Incluye latencia p95, coste por petición y tasas de refusal/safety.' }
    ],
    prevention: 'Construye evals con datos reales, calibra jueces con humanos, desglosa por segmentos y mide también latencia y coste.'
  },
  {
    id: 'ai-excess-refusal',
    track: 'ai',
    category: 'seguridad',
    symptom: 'El modelo se niega a responder preguntas legítimas (refusos excesivos).',
    causes: [
      { cause: 'Filtros de seguridad demasiado estrictos en el proveedor o en tu guardrail.', check: 'Prueba la misma pregunta con el modelo base y con tus guardrails.', fix: 'Ajusta umbrales de los filtros y distingue entre riesgo real y falsos positivos.' },
      { cause: 'Prompt que activa palabras sensibles por contexto mal interpretado.', check: 'Revisa el prompt en busca de términos que disparen el filtro.', fix: 'Reformula la instrucción y añade contexto que aclare el uso legítimo.' },
      { cause: 'Fine-tuning con datos de safety desbalanceados que enseñan a rechazar.', check: 'Revisa la proporción de ejemplos de rechazo en el dataset.', fix: 'Equilibra los datos de fine-tuning con respuestas útiles para preguntas seguras.' },
      { cause: 'Modelo conservador por diseño (versiones orientadas a safety).', check: 'Compara con otra versión del modelo menos restrictiva.', fix: 'Elige el modelo adecuado al caso de uso y documenta su política de safety.' }
    ],
    prevention: 'Calibra guardrails con ejemplos legítimos y riesgosos, monitoriza la tasa de refusos y ajusta con evals periódicas.'
  },
  {
    id: 'ai-bias-toxicity',
    track: 'ai',
    category: 'seguridad',
    symptom: 'El modelo produce respuestas sesgadas o tóxicas hacia ciertos grupos o temas.',
    causes: [
      { cause: 'Sesgos presentes en los datos de entrenamiento o en el corpus RAG.', check: 'Analiza la representación de grupos en tus datos y documentos.', fix: 'Equilibra y filtra los datos, y aplica revisión humana a contenido sensible.' },
      { cause: 'Prompt que induce estereotipos o suposiciones.', check: 'Revisa si el prompt da por hechas características de grupos.', fix: 'Reescribe el prompt de forma neutra y pide respuestas objetivas.' },
      { cause: 'Falta de filtros de salida y moderación.', check: 'Comprueba si las salidas se validan antes de mostrarse.', fix: 'Añade moderación de salida y un paso de revisión para contenido sensible.' },
      { cause: 'Evaluación que no incluye métricas de fairness.', check: '¿Mides sesgo de forma explícita en tus evals?', fix: 'Añade pruebas de equidad (fairness) con casos contraste y monitoriza en producción.' }
    ],
    prevention: 'Audita datos y prompts, incluye evals de fairness y safety, y mantén revisión humana en dominios sensibles.'
  },
  {
    id: 'ai-p99-spike',
    track: 'ai',
    category: 'serving',
    symptom: 'La latencia p99 se dispara intermitentemente aunque el promedio sea aceptable.',
    causes: [
      { cause: 'Cold starts al escalar nuevas réplicas o recargar modelos.', check: 'Correlaciona los picos con eventos de autoscale o despliegues.', fix: 'Mantén réplicas calientes, usa warmup requests y precarga modelos.' },
      { cause: 'Peticiones con contextos muy largos que bloquean la cola (head-of-line blocking).', check: 'Compara la longitud de entrada de las peticiones lentas.', fix: 'Separa colas por longitud o limita max_input_tokens y usa scheduling justo.' },
      { cause: 'Garbage collection o swapping en el servidor.', check: 'Monitoriza uso de memoria y swap durante los picos.', fix: 'Ajusta el heap, evita swap y dimensiona memoria suficiente.' },
      { cause: 'Dependencia externa lenta (vector DB, herramienta de agente).', check: 'Desglosa la latencia por etapa con trazas distribuidas.', fix: 'Añade timeouts, caché y reintentos con backoff en dependencias.' }
    ],
    prevention: 'Monitoriza p50/p95/p99, usa trazas distribuidas, evita cold starts y aplica timeouts y bulkheads.'
  },
  {
    id: 'ai-agent-memory',
    track: 'ai',
    category: 'agentes',
    symptom: 'La memoria o el historial del agente crece sin control y degrada el rendimiento.',
    causes: [
      { cause: 'Historial completo de mensajes acumulado sin resumen ni ventana.', check: 'Mide el número de tokens del historial tras cada iteración.', fix: 'Implementa resumen periódico o sliding window con retención de información crítica.' },
      { cause: 'Resultados de herramientas volcados completos en el contexto.', check: 'Revisa el tamaño de las salidas de herramientas insertadas.', fix: 'Recorta y resume las salidas, y guarda los detalles en almacenamiento externo.' },
      { cause: 'Estado del agente nunca se persiste ni se limpia entre sesiones.', check: 'Comprueba si el estado se reutiliza y crece entre usuarios.', fix: 'Aísla el estado por sesión y aplica TTL y limpieza periódica.' },
      { cause: 'Bucles de razonamiento que añaden mensajes infinitos.', check: 'Cuenta los mensajes generados por iteración.', fix: 'Limita iteraciones y detecta razonamientos repetidos para terminar.' }
    ],
    prevention: 'Gestiona el contexto con resúmenes y ventanas, recorta salidas de herramientas y aplica TTL al estado por sesión.'
  },
  {
    id: 'ai-hallucinated-args',
    track: 'ai',
    category: 'agentes',
    symptom: 'El agente inventa argumentos de herramientas (IDs, fechas, parámetros) que no existen.',
    causes: [
      { cause: 'El modelo no tiene la información necesaria en el contexto para rellenar los argumentos.', check: 'Revisa si el dato requerido está disponible antes de la llamada.', fix: 'Recupera o pide el dato antes de llamar a la herramienta y valida su existencia.' },
      { cause: 'Esquema de herramienta sin descripciones ni restricciones en los campos.', check: 'Revisa el JSON Schema: ¿los campos tienen tipo y descripción?', fix: 'Añade descripciones, enums y formatos (date, uri) a cada parámetro.' },
      { cause: 'El modelo rellena con valores plausibles por defecto.', check: 'Compara los argumentos generados con los valores reales disponibles.', fix: 'Valida los argumentos con Pydantic y rechaza valores no verificados con un mensaje de error al modelo.' },
      { cause: 'Falta de feedback cuando una llamada anterior falló.', check: '¿El agente recibe el error de la herramienta en el siguiente paso?', fix: 'Propaga errores claros al modelo para que corrija los argumentos.' }
    ],
    prevention: 'Valida todos los argumentos con esquemas estrictos, provee los datos en contexto y devuelve errores accionables al agente.'
  },
  {
    id: 'ai-finetune-format',
    track: 'ai',
    category: 'fine-tuning',
    symptom: 'El fine-tuning no converge o el modelo aprende formatos raros por un dataset mal formateado.',
    causes: [
      { cause: 'Formato de datos incorrecto para la API o librería (JSONL, chat messages).', check: 'Valida cada línea del dataset con el esquema esperado y cuenta mensajes.', fix: 'Convierte al formato correcto (messages con role/content) y valida con un parser.' },
      { cause: 'Tokens especiales o chat template equivocados.', check: 'Compara el template del dataset con el del modelo base.', fix: 'Usa tokenizer.apply_chat_template y añade los tokens de fin de turno correctos.' },
      { cause: 'Etiquetas (labels) calculadas sobre el prompt en lugar de solo la respuesta.', check: 'Revisa si los tokens de instrucción tienen label -100.', fix: 'Enmascara el prompt con -100 para que la loss solo cuente la respuesta.' },
      { cause: 'Ejemplos inconsistentes o con respuestas de baja calidad.', check: 'Lee 20 ejemplos aleatorios y evalúa su calidad.', fix: 'Filtra y corrige ejemplos, y estandariza el tono y formato de las respuestas.' }
    ],
    prevention: 'Valida el dataset con un schema, usa el chat template oficial, enmascara prompts y revisa ejemplos manualmente antes de entrenar.'
  },
  {
    id: 'ai-lr-oscillation',
    track: 'ai',
    category: 'optimización',
    symptom: 'La loss oscila violentamente o rebota en lugar de descender suavemente.',
    causes: [
      { cause: 'Learning rate demasiado alto para el optimizador y el batch.', check: 'Baja el LR en un orden de magnitud y compara la curva.', fix: 'Usa un LR finder y un scheduler con warmup y decaimiento.' },
      { cause: 'Batch size muy pequeño que produce gradientes ruidosos.', check: 'Aumenta el batch size o usa gradient accumulation.', fix: 'Sube el batch efectivo a 32–256 según el modelo y normaliza el LR.' },
      { cause: 'Momentum excesivo que hace sobrepasar el mínimo.', check: 'Reduce el parámetro beta1 o el momentum.', fix: 'Ajusta momentum a 0.9 y usa decaimiento de LR.' },
      { cause: 'Datos desNormalizados o con outliers que dominan el gradiente.', check: 'Inspecciona la distribución de features y pérdidas por muestra.', fix: 'Normaliza datos y usa gradient clipping para limitar outliers.' }
    ],
    prevention: 'Usa LR finder, warmup, batch sizes razonables y gradient clipping; registra la curva de LR durante el entrenamiento.'
  },
  {
    id: 'ai-grad-accum',
    track: 'ai',
    category: 'optimización',
    symptom: 'El entrenamiento con gradient accumulation no da los mismos resultados que un batch grande equivalente.',
    causes: [
      { cause: 'No dividir la pérdida por el número de pasos de acumulación.', check: 'Revisa si haces loss = loss / accumulation_steps antes de backward().', fix: 'Divide la loss por accumulation_steps para que el gradiente promedio sea equivalente.' },
      { cause: 'Optimizer.step() llamado en el momento equivocada.', check: 'Verifica que step() se llama solo al completar el ciclo de acumulación.', fix: 'Llama step() y zero_grad() únicamente cuando (i+1) % accumulation_steps == 0.' },
      { cause: 'BatchNorm con micro-batches pequeños que cambia las estadísticas.', check: 'Compara el batch real con el batch efectivo buscado.', fix: 'Usa GroupNorm/LayerNorm o sincroniza BatchNorm (SyncBatchNorm) entre GPUs.' },
      { cause: 'Scheduler avanzado por micro-batch en lugar de por step efectivo.', check: 'Cuenta cuántas veces se llama scheduler.step().', fix: 'Avanza el scheduler una vez por optimizer.step(), no por micro-batch.' }
    ],
    prevention: 'Encapsula la acumulación en una función probada, divide la loss y avanza el scheduler solo con cada step real.'
  },
  {
    id: 'ai-amp-fail',
    track: 'ai',
    category: 'optimización',
    symptom: 'El entrenamiento con mixed precision falla: errores de escala, underflow o results distintos a fp32.',
    causes: [
      { cause: 'Falta de GradScaler con fp16 (los gradientes pequeños se vuelven cero).', check: 'Comprueba si usas torch.cuda.amp.GradScaler con scale()/step().', fix: 'Envuelve la pérdida con scaler.scale() y llama scaler.step()/update().' },
      { cause: 'Operaciones realizadas en fp32 por error dentro de autocast.', check: 'Revisa si hay .float() o castings manuales dentro del bloque autocast.', fix: 'Deja que autocast decida los dtype y evita casts manuales.' },
      { cause: 'Hardware sin soporte bf16/fp16 o versión de CUDA antigua.', check: 'Consulta torch.cuda.is_bf16_supported() y la versión de CUDA.', fix: 'Usa fp16 con GradScaler o entrena en fp32 si el hardware no soporta bf16.' },
      { cause: 'Pérdida personalizada que no es segura en media precisión.', check: 'Prueba la misma pérdida en fp32 y compara.', fix: 'Fuerza fp32 dentro de la pérdida con autocast(enabled=False) para esas operaciones.' }
    ],
    prevention: 'Usa AMP con GradScaler, evita casts manuales y valida que la pérdida coincida con fp32 en un batch pequeño.'
  },
  {
    id: 'ai-silent-tool-errors',
    track: 'ai',
    category: 'agentes',
    symptom: 'El agente cree que una herramienta funcionó pero los datos no se actualizaron (errores silenciosos).',
    causes: [
      { cause: 'La herramienta devuelve éxito aunque la operación falló internamente.', check: 'Revisa el código de la herramienta: ¿todas las ramas devuelven un estado explícito?', fix: 'Devuelve un objeto con ok/error y código de estado en todas las ramas.' },
      { cause: 'Excepciones capturadas y no propagadas al modelo.', check: 'Busca try/except que traguen errores sin logging.', fix: 'Propaga el error como parte del resultado de la herramienta para que el agente reaccione.' },
      { cause: 'El agente ignora el contenido del resultado de la herramienta.', check: 'Revisa el prompt: ¿se le instruye a verificar el resultado?', fix: 'Añade instrucciones para comprobar ok=true antes de dar la tarea por completada.' },
      { cause: 'Falta de idempotencia: reintentos duplican o pierden efectos.', check: 'Comprueba si la herramienta usa claves idempotentes.', fix: 'Añade idempotency keys y verificación del estado final tras la llamada.' }
    ],
    prevention: 'Diseña herramientas con respuestas explícitas de éxito/error, propaga excepciones y verifica el efecto final de forma independiente.'
  }
];
