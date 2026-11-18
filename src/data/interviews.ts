import type { InterviewQuestion } from '../types';

export const interviewQuestions: InterviewQuestion[] = [
  // ---------- ROBÓTICA: Fundamentos / cinemática (20) ----------
  {
    id: 'int-r-001', track: 'robotica', category: 'Fundamentos/kinemática',
    q: 'Un robot diferencial con ruedas de radio r separadas una distancia L recibe velocidades lineales de rueda. Cómo obtienes la velocidad lineal y angular del cuerpo y qué supuestos haces?',
    rubric: [
      'Escribe v = r/2·(ω_d + ω_i) y ω = r/L·(ω_d − ω_i) sin confusionar radio con diámetro.',
      'Explicitación del supuesto de rodadura sin deslizamiento y superficie plana.',
      'Menciona que el modelo es local y que ignora inercia, fricción y deriva.',
      'Sabe que el centro instantáneo de rotación se desplaza con la velocidad lineal.',
    ],
    answer: {
      context: 'El modelo cinemático diferencial relaciona el giro de cada rueda con el movimiento del chasis en el plano. Es la base de la odometría y del control, y su precisión depende de que las ruedas no patinen. Los parámetros r y L deben calibrarse porque errores del uno por ciento se acumulan en metros recorridos.',
      decision: 'Promediar las velocidades de rueda para la componente lineal y restarlas para la angular, expresando el resultado en el marco del robot. Verificar el signo con una prueba de giro in situ antes de integrar. Documentar r y L medidos físicamente y usarlos como constantes calibradas en el código.',
      tradeoff: 'El modelo ideal es simple y determinista, pero asume rodadura perfecta y ejes perfectamente alineados. En suelo resbaladizo o con neumáticos blandos conviene corregir con IMU o con factores de escala estimados. Tambien limita la aceleración para no romper el supuesto de no deslizamiento en arranques bruscos.',
    },
    followups: [
      'Qué ocurre en el modelo si una rueda se bloquea y cómo lo detectarías con los encoders?',
      'Cómo cambia la expresión si el robot tiene ruedas mecanum en lugar de diferencial?',
    ],
    signal: 'Que el candidato construya el modelo desde la geometría y conozca sus límites físicos, no que recite una fórmula.',
  },
  {
    id: 'int-r-002', track: 'robotica', category: 'Fundamentos/kinemática',
    q: 'Para seguir una velocidad lineal v y angular ω dadas, cómo calculas las revoluciones por minuto de cada rueda y qué validación harías antes de enviarlas al motor?',
    rubric: [
      'Despeja ω_d = (v + ω·L/2)/r y ω_i = (v − ω·L/2)/r.',
      'Convierte unidades de rad/s a revoluciones por minuto con el factor 60/(2π).',
      'Aplica saturación a la velocidad máxima del motor y al par disponible.',
      'Comprueba límites de aceleración y que el signo de giro coincida con la convención.',
    ],
    answer: {
      context: 'La cinemática inversa transforma la orden del controlador en consignas de velocidad para cada actuador. Es el último paso antes de la electrónica y donde un error de unidades provoca comportamientos catastróficos. El convertedor de motor suele trabajar en revoluciones por minuto, no en radianes.',
      decision: 'Sustituir v y ω en las ecuaciones inversas y convertir a rpm con el factor de conversión correcto. Recortar cada consigna al rango del motor y limitar el cambio respecto al ciclo anterior según la aceleración máxima. Verificar con un giro de prueba que ω positiva gira en la dirección esperada.',
      tradeoff: 'Saturar de forma independiente puede deformar la trayectoria cuando una rueda llega al límite antes que la otra. Una alternativa es escalar ambas velocidades conservando la relación v/ω. Limitar la aceleración suaviza el movimiento pero incrementa el error de seguimiento en curvas cerradas.',
    },
    followups: [
      'Si una rueda satura, cómo reescalas la orden para mantener la curvatura?',
      'Dónde colocarías el limitador de aceleración: antes o después del PID de velocidad?',
    ],
    signal: 'Que el candidato respete unidades, signos y límites físicos, señal de experiencia real con motores.',
  },
  {
    id: 'int-r-003', track: 'robotica', category: 'Fundamentos/kinemática',
    q: 'Tu robot acumula 30 cm de error de posición tras recorrer 10 m usando solo encoders. Cuál es la causa y cómo la mitigarías sin añadir sensores caros?',
    rubric: [
      'Atribuye la deriva a errores sistemáticos de r, L y deslizamiento, integrados en el tiempo.',
      'Propone calibrar parámetros con una rutina de medición de giro y distancia.',
      'Propone corregir con una referencia absoluta ocasional, por ejemplo marcas o IMU.',
      'Distingue error sistemático, que se corrige, de error aleatorio, que se promedia.',
    ],
    answer: {
      context: 'La odometría integra velocidades en el tiempo, por lo que cualquier sesgo pequeño se convierte en un error creciente. Un tres por ciento de error en el radio de la rueda produce aproximadamente 30 cm en 10 m. El deslizamiento en giros y el juego mecánico agravan el efecto de forma no lineal.',
      decision: 'Medir el radio efectivo recorriendo una distancia conocida y ajustar L girando sobre el sitio varias vueltas. Corregir el modelo con un factor de escala derivado de esas mediciones. Añadir una corrección periódica con una referencia absoluta disponible, aunque sea una señal de baja frecuencia.',
      tradeoff: 'Calibrar en una superficie distinta a la de operación traslada el sesgo en lugar de eliminarlo. Una IMU ayuda en giros pero deriva en la orientación si no se fusiona con cuidado. Añadir referencias externas mejora la precisión pero incrementa la complejidad y el coste del sistema.',
    },
    followups: [
      'Cómo separarías el error de radio del error de separación de ruedas con una sola prueba?',
      'Por qué la odometría nunca debe usarse como medida de verdad para evaluar SLAM?',
    ],
    signal: 'Que entienda la deriva como integración de sesgo y proponga calibración antes que comprar sensores.',
  },
  {
    id: 'int-r-004', track: 'robotica', category: 'Fundamentos/kinemática',
    q: 'Diferencia el modelo de bicicleta del modelo diferencial y explica cuándo conviene cada uno.',
    rubric: [
      'Identifica la restricción de no deslizamiento lateral de la bicicleta.',
      'Señala que el diferencial puede girar in situ y la bicicleta no.',
      'Menciona el radio de giro mínimo finito en la bicicleta.',
      'Relaciona el modelo con el tipo de dirección y de ruedas del robot.',
    ],
    answer: {
      context: 'Ambos son modelos de robots móviles en el plano, pero representan arquitecturas distintas. La bicicleta aproxima un vehículo con dirección adelantada y dos ejes, con restricción lateral. El diferencial describe dos ruedas motrices independientes con capacidad de giro sobre el sitio.',
      decision: 'Usar el modelo diferencial cuando el robot tenga dos ruedas motorizadas y rueda loca, como en interiores compactos. Usar la bicicleta para vehículos tipo coche, donde la curvatura está limitada por el ángulo de dirección. Elegir el modelo que coincida con las restricciones reales del chasis.',
      tradeoff: 'La bicicleta es más eficiente a alta velocidad y más estable en trayectorias largas. El diferencial maniobra mejor en espacios reducidos pero consume más energía en giros. Aproximar un diferencial con una bicicleta puede dar órdenes imposibles cuando se pide radio de giro cero.',
    },
    followups: [
      'Cómo modificarías el modelo de bicicleta para un tráiler articulado?',
      'Qué ventaja tiene el diferencial para el problema de regreso al origen en una habitación?',
    ],
    signal: 'Que asocie la abstracción matemática con la mechanical real y sus limitaciones.',
  },
  {
    id: 'int-r-005', track: 'robotica', category: 'Fundamentos/kinemática',
    q: 'Para qué sirve una matriz de transformación homogénea y por qué es más práctica que una rotación más una traslación separadas?',
    rubric: [
      'La describe como una matriz 4×4 que engloba rotación y traslación.',
      'Menciona la composición de transformaciones por multiplicación de matrices.',
      'Reconoce el uso de coordenadas homogéneas para representar puntos con una única operación.',
      'Sabe que el orden de multiplicación importa y depende del marco de destino.',
    ],
    answer: {
      context: 'Una transformación homogénea describe la pose relativa entre dos marcos de referencia en una sola matriz. Permite tratar rotaciones y traslaciones con la misma álgebra y componer cadenas de marcos mediante productos. Es la representación estándar en bibliotecas como TF2 o KDL.',
      decision: 'Usar una matriz 4×4 para representar cada eslabón y multiplicarlas en el orden de la cadena cinemática. Mantener una convención clara de si se pre o postmultiplica según se exprese en marco local o global. Normalizar las filas de rotación de vez en cuando para evitar deriva numérica.',
      tradeoff: 'La matriz es más costosa en memoria que un quaternion más un vector, y puede perder ortogonalidad tras muchas multiplicaciones. Es menos intuitiva de leer que una traslación y un ángulo. Para composiciones largas, los quaternions son más estables, aunque las matrices siguen siendo cómodas para transformar puntos.',
    },
    followups: [
      'Cómo invertirías eficientemente una transformación homogénea sin invertir la matriz completa?',
      'Dónde aparece el orden de multiplicación equivocado en un árbol de marcos mal construido?',
    ],
    signal: 'Que maneje marcos con soltura y sepa que la convención de orden es una fuente frecuente de errores.',
  },
  {
    id: 'int-r-006', track: 'robotica', category: 'Fundamentos/kinemática',
    q: 'Por qué evitar ángulos de Euler en una cadena de orientaciones y qué alternativa usarías?',
    rubric: [
      'Nombra el bloqueo de cardán y la pérdida de un grado de libertad.',
      'Propone quaternions unitarios como representación interna.',
      'Menciona la continuidad y la ausencia de singularidades de los quaternions.',
      'Recuerda normalizar el quaternion tras integraciones o interpolaciones.',
    ],
    answer: {
      context: 'Los ángulos de Euler describen una orientación con tres rotaciones sucesivas alrededor de ejes definidos. Cuando dos ejes se alinean se produce bloqueo de cardán y se pierde un grado de libertad. Además, la misma orientación puede tener varias representaciones, lo que complica interpolaciones.',
      decision: 'Representar orientaciones internamente con quaternions unitarios y convertir a Euler solo para presentación o entrada humana. Interpolar con SLERP cuando importe la trayectoria angular. Normalizar el quaternion después de cada integración con giroscopio para corregir deriva numérica.',
      tradeoff: 'Los quaternions son más robustos pero menos interpretables y tienen ambigüedad de signo, q y menos q representan lo mismo. Integrarlos exige cuidado con el paso de tiempo y con la normalización. Para robots que solo giran alrededor del eje vertical, un único ángulo sigue siendo suficiente y más simple.',
    },
    followups: [
      'Cómo resolverías la interpolación entre dos quaternions con signos opuestos?',
      'Qué señal alerta de que un filtro está introduciendo un quaternion no unitario?',
    ],
    signal: 'Que conozca la causa del bloqueo de cardán y no solo el nombre del fenómeno.',
  },
  {
    id: 'int-r-007', track: 'robotica', category: 'Fundamentos/kinemática',
    q: 'Qué es el jacobiano de un manipulador y cómo detectas una singularidad con él?',
    rubric: [
      'Lo define como la matriz que relaciona velocidades articulares y velocidades del efector.',
      'Menciona la pérdida de rango como criterio de singularidad.',
      'Cita el determinante o el valor de condicionamiento como indicadores.',
      'Relaciona la singularidad con velocidades articulares infinitas o no alcanzables.',
    ],
    answer: {
      context: 'El jacobiano mapea velocidades en el espacio articular a velocidades en el espacio cartesiano, y su inversa permite controlar el efector. Una singularidad aparece cuando la matriz pierde rango, es decir, cuando hay direcciones cartesianas que no se pueden generar. En esas configuraciones el acondicionamiento numérico se degrada.',
      decision: 'Calcular el jacobiano en cada paso y vigilar el determinante o el menor valor singular. Evitar acercarse a configuraciones donde el índice de condicionamiento supere un umbral. Si es inevitable usar la seudoinversa amortiguada, que limita las velocidades articulares cerca de la singularidad.',
      tradeoff: 'La seudoinversa amortiguada evita picos de velocidad pero no puede alcanzar exactamente la velocidad deseada cerca de la singularidad. Vigilar solo el determinante puede jugando engaño en brazos con escalas distintas. La planificación de trayectorias puede sortear singularidades, pero añade coste computacional.',
    },
    followups: [
      'Qué diferencia hay entre una singularidad de borde y una interior?',
      'Cómo usarías el gradiente de una función de manipulabilidad para evitarla?',
    ],
    signal: 'Que entienda la singularidad como pérdida de rango y no como un simple error de cálculo.',
  },
  {
    id: 'int-r-008', track: 'robotica', category: 'Fundamentos/kinemática',
    q: 'Qué grados de libertad tiene un robot móvil diferencial en el plano y por qué no puede desplazarse lateralmente de forma instantánea?',
    rubric: [
      'Identifica tres grados de libertad en el plano: x, y y orientación.',
      'Señala que solo dos están directamente accionados por las ruedas.',
      'Invoca la restricción de rodadura sin deslizamiento lateral.',
      'Reconoce que el movimiento lateral exige una secuencia de giros y avances.',
    ],
    answer: {
      context: 'Un robot diferencial tiene tres grados de libertad en el plano, pero solo dos entradas de control independientes. La restricción cinemática impide velocidad lateral instantánea porque las ruedas no pueden deslizar sideways sin patinar. Esto lo clasifica como un sistema no holónomo.',
      decision: 'Planificar movimientos laterales como una combinación de rotación y traslación, por ejemplo en forma de S. Expresar las restricciones como ecuaciones de no deslizamiento y respetarlas en el controlador. Aceptar que la trayectoria alcanzable es un subconjunto de la configuración instantánea.',
      tradeoff: 'La no holonomía simplifica el modelo pero obliga a maniobrar en espacios estrechos. Las ruedas mecanum eliminan la restricción a cambio de menor eficiencia y más desgaste. Un controlador que ignore la restricción generará órdenes que el robot no puede cumplir y acumulará error lateral.',
    },
    followups: [
      'Cómo se llama y qué implica la propiedad de no holonomía para la planificación?',
      'Qué cambia si añades una rueda loca giratoria en la parte trasera?',
    ],
    signal: 'Que distinga grados de libertad de entradas controlables y conozca la restricción física.',
  },
  {
    id: 'int-r-009', track: 'robotica', category: 'Fundamentos/kinemática',
    q: 'Un brazo de 6 ejes necesita alcanzar una pose concreta. Cuándo usarías cinemática inversa analítica y cuándo numérica?',
    rubric: [
      'La analítica es rápida y exacta pero depende de geometrías favorables.',
      'La numérica es general pero iterativa y depende de la semilla inicial.',
      'Cita criterios geométricos como ejes concurrentes o muñeca esférica.',
      'Menciona el coste computacional y la necesidad de semilla cercana.',
    ],
    answer: {
      context: 'La cinemática inversa resuelve los ángulos articulares que producen una pose deseada del efector. La solución analítica existe solo para ciertas geometrías, como brazos con muñeca esférica o ejes que se cortan. En robots industriales de 6 ejes es habitual poder despejarla en forma cerrada.',
      decision: 'Usar cinemática inversa analítica si el robot cumple los requisitos geométricos y necesitas ciclos de milisegundos. Recurrir a métodos numéricos, por ejemplo Newton-Raphson con el jacobiano, para geometrías generales. Sembrar el método numérico con la configuración anterior para mejorar convergencia.',
      tradeoff: 'La solución analítica puede tener varias ramas y hay que elegir entre codo arriba o abajo. La numérica puede caer en mínimos locales o singularidades si la semilla es mala. Una opción intermedia es una tabla de búsqueda inicial seguida de unas pocas iteraciones de refinamiento.',
    },
    followups: [
      'Cómo elegirías entre las múltiples soluciones analíticas disponibles?',
      'Qué pasa si la pose pedida está fuera del espacio de trabajo?',
    ],
    signal: 'Que sepa que la existencia de solución analítica es una propiedad de la geometría, no una elección arbitraria.',
  },
  {
    id: 'int-r-010', track: 'robotica', category: 'Fundamentos/kinemática',
    q: 'Describe la cinemática de un robot con ruedas mecanum y cómo lograr un desplazamiento lateral sin girar.',
    rubric: [
      'Reconoce que cada rueda tiene rodillos a 45 grados.',
      'Expresa la velocidad de cada rueda como combinación de v_x, v_y y ω.',
      'Explica que el desplazamiento lateral surge de sumar contribuciones de los rodillos.',
      'Menciona pérdida de tracción y sensibilidad al suelo.',
    ],
    answer: {
      context: 'Las ruedas mecanum tienen rodillos inclinados que convierten parte del giro en fuerza lateral. Con cuatro ruedas orientadas adecuadamente se pueden generar tres velocidades independientes en el plano. La matriz de transformación depende de la disposición de los rodillos y del sentido de giro de cada motor.',
      decision: 'Escribir la matriz que mapea v_x, v_y y ω a las cuatro velocidades de rueda según la geometría del chasis. Para ir lateralmente sin girar,dar consignas alternadas de signo que sumen componentes laterales y cancelen la rotación. Calibrar la matriz con pruebas de desplazamiento puro en cada eje.',
      tradeoff: 'La omnidireccionalidad se paga con menor eficiencia y tracción, especialmente en suelos irregulares. Los rodillos generan vibración y desgaste, y el control de odometría es más delicado. En alfombras o suelos muy lisos el comportamiento real se aleja bastante del modelo ideal.',
    },
    followups: [
      'Por qué la odometría mecanum es menos fiable que la diferencial?',
      'Cómo detectarías que una rueda mecanum está patinando?',
    ],
    signal: 'Que entienda la contribución vectorial de los rodillos en lugar de memorizar una tabla de signos.',
  },
  {
    id: 'int-r-011', track: 'robotica', category: 'Fundamentos/kinemática',
    q: 'Cómo calibrarías el diámetro efectivo de una rueda y la separación entre ruedas usando solo los encoders y una regla?',
    rubric: [
      'Propone recorrer una distancia recta larga y comparar con el avance medido.',
      'Propone girar sobre el sitio varias vueltas y comparar con un ángulo conocido.',
      'Promediar varias repeticiones en ambos sentidos para cancelar errores.',
      'Ajustar los parámetros minimizando el error en ambas pruebas a la vez.',
    ],
    answer: {
      context: 'Los parámetros geométricos del modelo nominal suelen diferir de los reales por tolerancias de fabricación y compresión del neumático. Una calibración sencilla consiste en excitar el robot con movimientos puros y comparar la odometría con una medida externa. La recta larga amplifica el error de radio y las vueltas amplifican el error de separación.',
      decision: 'Hacer varias pasadas rectas de al menos dos metros y ajustar el radio hasta que la distancia estimada coincida con la regla. Girar sobre el sitio un número known de vueltas y ajustar la separación hasta que el ángulo integrado coincida. Repetir en ambos sentidos y promediar para reducir sesgos de deslizamiento.',
      tradeoff: 'La corrección del radio obtenida en recta puede no ser válida en giros, donde la carga lateral cambia la huella de contacto. La calibración con regla tiene error humano que se propagará al modelo. Un método más preciso usa captura de movimiento, pero encarece y ralentiza el proceso.',
    },
    followups: [
      'Cómo afecta la presión del neumático al radio efectivo medido?',
      'Por qué calibrar en ambos sentidos reduce el error sistemático?',
    ],
    signal: 'Que proponga un procedimiento experimental, no solo cambiar constantes hasta que "parezca bien".',
  },
  {
    id: 'int-r-012', track: 'robotica', category: 'Fundamentos/kinemática',
    q: 'Qué es el deslizamiento de las ruedas y cómo lo detectarías comparando encoders con otra fuente de movimiento?',
    rubric: [
      'Define el deslizamiento como diferencia entre velocidad teórica y real del cuerpo.',
      'Propone comparar odometría con flujo óptico, LiDAR o IMU.',
      'Menciona el uso del residuo del filtro como indicador de patinaje.',
      'Distingue patinajebreve de error de calibración permanente.',
    ],
    answer: {
      context: 'El deslizamiento aparece cuando la rueda gira sin que el chasis se desplace lo que el modelo predice. Puede deberse a aceleración excesiva, suelo resbaladizo o ruedas levantadas. Es una de las principales causas de error en odometría y muy difícil de corregir solo con los encoders.',
      decision: 'Comparar la velocidad derivada de la odometría con una estimación independiente, por ejemplo flujo óptico o desplazamiento entre nubes de puntos. Monitorizar el residuo entre ambas fuentes y disparar una alerta cuando supere un umbral. Reducir la aceleración o el par cuando se detecte patinaje sostenido.',
      tradeoff: 'Una fuente óptica puede fallar en ausencia de textura o con poca luz, dando falsos positivos. Reducir la aceleración protege la odometría pero hace al robot más lento. El residuo del filtro mezcla deslizamiento con errores de calibración y requiere ventanas temporales para interpretarse.',
    },
    followups: [
      'Cómo distinguirías un patinaje real de un error en el radio de la rueda?',
      'Qué harías si el robot patina solo al girar sobre el sitio?',
    ],
    signal: 'Que entienda que los encoders no pueden detectar su propio deslizamiento sin una referencia externa.',
  },
  {
    id: 'int-r-013', track: 'robotica', category: 'Fundamentos/kinemática',
    q: 'Qué relación hay entre la curvatura de una trayectoria y las velocidades de las ruedas en un diferencial?',
    rubric: [
      'Define la curvatura como ω/v cuando la velocidad lineal no es cero.',
      'Relaciona la diferencia de velocidades de rueda con la curvatura.',
      'Reconoce que curvatura infinita corresponde a giro in situ.',
      'Menciona el radio de giro como inverso de la curvatura.',
    ],
    answer: {
      context: 'La curvatura mide cuánto gira la trayectoria por unidad de distancia recorrida. En un diferencial se controla directamente mediante la diferencia entre las velocidades de las ruedas. Es una magnitud cómoda porque permite expresar la orden como velocidad lineal más forma de la curva.',
      decision: 'Calcular la curvatura como la relación entre velocidad angular y lineal y derivar de ella las consignas de rueda. Fijar la curvatura a cero para avanzar recto y a un valor muy alto para girar sin desplazamiento. Limitar la curvatura máxima según la distancia entre ruedas y la estabilidad del robot.',
      tradeoff: 'La curvatura es indefinida cuando la velocidad lineal es cero, aunque el robot sí pueda girar. Un valor elevado con velocidad lineal alta provoca fuerzas laterales y deslizamiento. Controlar en términos de curvatura es intuitivo pero requiere convertir de vuelta a velocidades de rueda.',
    },
    followups: [
      'Cómo evitarías la división por cero al calcular la curvatura en un giro in situ?',
      'Qué curvatura máxima recomendarías para una habitación de tres metros?',
    ],
    signal: 'Que maneje la curvatura como concepto de control y no solo como cálculo geométrico.',
  },
  {
    id: 'int-r-014', track: 'robotica', category: 'Fundamentos/kinemática',
    q: 'Diferencia un camino libre de colisiones de una trayectoria temporalmente parametrizada.',
    rubric: [
      'El camino es una secuencia de configuraciones geométricas.',
      'La trayectoria añade tiempo, velocidades y aceleraciones.',
      'Menciona restricciones de aceleración y tirón.',
      'Relaciona la parametrización con el seguimiento por el controlador.',
    ],
    answer: {
      context: 'Un planificador de caminos produce una secuencia de poses que evita obstáculos, pero no dice cuándo alcanzar cada una. La trayectoria asigna una ley temporal a ese camino, respetando límites de velocidad y aceleración del robot. Esta distinción es clave porque un camino válido puede ser imposible de seguir.',
      decision: 'Generar primero un camino geométrico y después parametrizarlo con un perfil trapezoidal de velocidad o una curva spline. Comprobar que la aceleración requerida no supera la que los motores pueden entregar. Pasar la trayectoria al controlador como referencia con marcas de tiempo.',
      tradeoff: 'Un perfil trapezoidal es simple pero produce cambios bruscos de aceleración. Los splines suavizan el movimiento pero pueden acercarse a obstáculos entre puntos de control. Parametrizar de forma agresiva mejora el tiempo de ciclo pero aumenta el riesgo de deslizamiento y error de seguimiento.',
    },
    followups: [
      'Qué es el tiempo de llegada óptimo bajo restricciones de aceleración?',
      'Cómo reaccionarías si el seguimiento de trayectoria acumula error en una curva?',
    ],
    signal: 'Que separe geometría de dinámica y entienda por qué un camino no basta para mover el robot.',
  },
  {
    id: 'int-r-015', track: 'robotica', category: 'Fundamentos/kinemática',
    q: 'Cuándo elegirías interpolación lineal, circular o spline para mover un brazo entre dos puntos?',
    rubric: [
      'La lineal es simple pero puede tener cambios bruscos de dirección.',
      'La circular mantiene distancia a un centro y es útil en arcos.',
      'El spline suaviza continuidad de aceleración.',
      'Todas deben respetar límites articulares y evitar singularidades.',
    ],
    answer: {
      context: 'La interpolación define cómo se recorren los puntos intermedios entre dos configuraciones. En el espacio cartesiano, una línea recta puede cruzar obstáculos o pasar cerca de singularidades. Los splines y los arcos ofrecen trayectorias más suaves pero requieren más puntos de control.',
      decision: 'Usar interpolación lineal en tareas de precisión donde la forma del recorrido no importe. Emplear arcos circulares cuando el movimiento deba mantener una distancia, como contornos de piezas. Recurrir a splines cuando la suavidad importe, por ejemplo para transportar un objeto frágil.',
      tradeoff: 'La interpolación lineal en el espacio cartesiano puede generar velocidades articulares muy altas cerca de singularidades. Los splines pueden sobrepasar los puntos de control y acercarse a zonas prohibidas. Interpolar en el espacio articular es más seguro para los motores pero la forma resultante no es predecible.',
    },
    followups: [
      'Qué problema aparece al interpolar ángulos de Euler entre 179 y menos 179 grados?',
      'Cómo comprobarías que un spline no sale de la zona libre?',
    ],
    signal: 'Que relacione el tipo de interpolación con restricciones físicas y no con preferencias estéticas.',
  },
  {
    id: 'int-r-016', track: 'robotica', category: 'Fundamentos/kinemática',
    q: 'Para qué sirve un árbol de marcos de referencia y qué error es frecuente al publicar transformaciones en ROS?',
    rubric: [
      'Describe el árbol como relaciones entre marcos con un padre cada uno.',
      'Menciona que debe ser un árbol sin ciclos.',
      'Cita el error de publicar transformaciones con marcas de tiempo inconsistentes o en el sentido equivocado.',
      'Reconoce la necesidad de un marco mundo fijo y un marco base ligado al robot.',
    ],
    answer: {
      context: 'El árbol de transformaciones organiza las relaciones espaciales entre sensores, chasis y mundo. Cada marco tiene un padre y las transformaciones se componen hasta el marco común. Un árbol mal construido produce datos que parecen correctos pero están desplazados o desorientados.',
      decision: 'Diseñar el árbol con un marco mundo fijo, un marco base del robot y marcos hijos para cada sensor. Publicar las transformaciones estáticas una vez y las dinámicas con la marca de tiempo correcta. Usar la herramienta de visualización para comprobar que no hay ciclos ni marcos huérfanos.',
      tradeoff: 'AñadirMany marcos intermedios facilita el mantenimiento pero incrementa la latencia de consulta y la dificultad de depuración. Publicar transformaciones a demasiada frecuencia satura el bus. Usar marcos con nombres ambiguos genera errores silenciosos que aparecen solo en ciertas configuraciones.',
    },
    followups: [
      'Qué ocurre si publicas la transformación del sensor en el sentido inverso?',
      'Cómo resolverías la falta de sincronía entre dos sensores con marcas de tiempo distintas?',
    ],
    signal: 'Que entienda el árbol como una estructura de datos con invariantes y no como una lista de nombres.',
  },
  {
    id: 'int-r-017', track: 'robotica', category: 'Fundamentos/kinemática',
    q: 'Qué es el espacio de trabajo de un manipulador y cómo lo usarías al planificar una tarea de pick and place?',
    rubric: [
      'Lo define como el conjunto de posiciones alcanzables por el efector.',
      'Distingue espacio alcanzable total y espacio útil con orientación.',
      'Menciona la influencia de obstáculos y del propio robot.',
      'Propone verificar los puntos de la tarea antes de ejecutar.',
    ],
    answer: {
      context: 'El espacio de trabajo depende de la longitud de los eslabones y de los límites articulares, y se reduce cuando se exige una orientación concreta. En pick and place no basta con que el punto sea alcanzable, también debe serlo con la pinza en el ángulo adecuado. Los obstáculos reducen aún más la región utilizable.',
      decision: 'Calcular o muestrear el espacio de trabajo con la orientación requerida antes de diseñar la celda. Comprobar que los puntos de recogida y depósito estén dentro con margen. Colocar los objetos y el robot de forma que las configuraciones resultantes estén lejos de singularidades.',
      tradeoff: 'Un espacio de trabajo grande suele implicar un brazo más grande y caro. Trabajar cerca del borde da más flexibilidad de colocación pero reduce la rigidez y aumenta la sensibilidad al error. Muestrear el espacio es robusto pero costoso, mientras que el cálculo analítico es rápido pero depende del modelo.',
    },
    followups: [
      'Cómo afecta una pinza más larga al espacio de trabajo efectivo?',
      'Qué harías si el punto de depósito queda justo en el límite?',
    ],
    signal: 'Que conecte la geometría del robot con la viabilidad real de la tarea.',
  },
  {
    id: 'int-r-018', track: 'robotica', category: 'Fundamentos/kinemática',
    q: 'Por qué un robot con inercia alta no puede seguir consignas de aceleración arbitrarias y cómo lo modelarías?',
    rubric: [
      'Invoca la relación par igual a inercia por aceleración angular.',
      'Menciona límites de par y de corriente de los motores.',
      'Cita la dinámica con términos de Coriolis y gravedad en brazos.',
      'Propone incluir restricciones en el planificador o en el controlador.',
    ],
    answer: {
      context: 'La cinemática describe el movimiento sin considerar las fuerzas que lo producen. La dinámica añade masa, inercia, fricción y gravedad, que determinan qué aceleraciones son realmente alcanzables. Ignorar estos efectos genera seguimiento Deficiente y sobrecorriente en los motores.',
      decision: 'Identificar la inercia equivalente en cada eje y el par máximo disponible. Calcular la aceleración máxima compatible con ese par e imponerla como límite en la trayectoria. En brazos, incluir los términos de Coriolis y gravedad en el modelo de control por dinámica inversa.',
      tradeoff: 'Un modelo dinámico completo es preciso pero exige identificar muchos parámetros. Limitar la aceleración de forma conservadora es seguro pero reduce la productividad. La alimentación de los motores también impone límites que cambian con la temperatura y el estado de la batería.',
    },
    followups: [
      'Cómo identificarías experimentalmente la inercia de un eje?',
      'Por qué un brazo consume más corriente con el brazo extendido?',
    ],
    signal: 'Que sepa pasar de la geometría a la física cuando la precisión o la seguridad lo exigen.',
  },
  {
    id: 'int-r-019', track: 'robotica', category: 'Fundamentos/kinemática',
    q: 'Diferencia sensores de posición relativos y absolutos y explica cómo combinarlos para regresar al origen.',
    rubric: [
      'Encoders y giroscopio son relativos y acumulan deriva.',
      'Marcas, código de barras o GPS son absolutos y no acumulan error.',
      'Propone fusionarlos con un filtro que confíe más en lo absoluto cuando esté disponible.',
      'Menciona la disponibilidad intermitente de las referencias absolutas.',
    ],
    answer: {
      context: 'Los sensores relativos miden cambios y son precisos a corto plazo pero derivan con el tiempo. Los absolutos dan una referencia directa, aunque suelen tener menor frecuencia o estar disponibles solo en ciertos lugares. La navegación práctica combina ambos para obtener continuidad y corrección.',
      decision: 'Usar encoders e IMU para estimar la pose entre correcciones absolutas. Detectar marcas o Señales conocidas y reiniciar la posición estimada con una ganancia limitada. Ajustar la ganancia según la calidad observada de la medida absoluta para evitar saltos bruscos.',
      tradeoff: 'Confiar demasiado en la referencia absoluta introduce saltos si la detección es errónea. Confiar demasiado en la relativa deja crecer la deriva. Un filtro con covarianza variable permite ponderar cada fuente, pero requiere modelar bien la incertidumbre de cada sensor.',
    },
    followups: [
      'Qué harías si la marca de referencia se detecta en el lugar equivocado?',
      'Cómo usarías una baliza para corregir solo la posición y no la orientación?',
    ],
    signal: 'Que entienda la complementariedad y sepa que una fusión ingenua puede empeorar la estimación.',
  },
  {
    id: 'int-r-020', track: 'robotica', category: 'Fundamentos/kinemática',
    q: 'Cómo fusionarías odometría de ruedas y una IMU para estimar la orientación del robot?',
    rubric: [
      'Describe un filtro complementario o de Kalman con dos fuentes.',
      'La IMU aporta respuesta rápida pero deriva en el giro.',
      'La odometría es estable a largo plazo pero puede patinar.',
      'Menciona el ajuste de la ganancia según la frecuencia y la confianza.',
    ],
    answer: {
      context: 'El giroscopio mide velocidad angular con gran respuesta pero integra error de sesgo, mientras que la odometría deriva de las ruedas ofrece una orientación más estable a largo plazo si no hay deslizamiento. Un filtro complementario combina ambas según su comportamiento en frecuencia. Los filtros de Kalman hacen lo mismo con covarianzas explícitas.',
      decision: 'Implementar un filtro complementario donde el giroscopio aporte la alta frecuencia y la odometría corrija la baja frecuencia. Ajustar la constante de tiempo según la deriva observada del giroscopio. Monitorizar la diferencia entre ambas fuentes para detectar patinaje o sesgo del sensor.',
      tradeoff: 'Una corrección demasiado rápida transmite a la estimación los errores de la odometría, por ejemplo en suelo resbaladizo. Una corrección demasiado lenta deja crecer el sesgo del giroscopio. El filtro de Kalman es más flexible pero exige caracterizar el ruido de cada sensor, algo que no siempre es trivial.',
    },
    followups: [
      'Cómo estimarías el sesgo del giroscopio cuando el robot está detenido?',
      'Qué cambia si añades un magnetómetro close a estructuras metálicas?',
    ],
    signal: 'Que justifique la fusión por las características dinámicas de cada sensor, no por moda.',
  },

  // ---------- ROBÓTICA: Percepción y visión (10) ----------
  {
    id: 'int-r-021', track: 'robotica', category: 'Percepción y visión',
    q: 'Qué parámetros obtienes al calibrar una cámara y por qué importan para un robot que estima distancias?',
    rubric: [
      'Intrínsecos: distancia focal, centro óptico y coeficientes de distorsión.',
      'Extrínsecos: rotación y traslación respecto al marco del robot.',
      'Sin calibración, las medidas de posición en la imagen no son métricas.',
      'Menciona el uso de un patrón de calibración y la reproyección del error.',
    ],
    answer: {
      context: 'La calibración determina cómo se proyectan los puntos del mundo en la imagen y dónde está la cámara respecto al robot. Los parámetros intrínsecos describen la lente y el sensor, y los extrínsecos describen la pose de la cámara. Sin ellos, un píxel no se puede convertir en una dirección fiable.',
      decision: 'Capturar múltiples vistas de un patrón conocido y resolver los parámetros minimizando el error de reproyección. Guardar la matriz de calibración junto con el número de serie de la cámara. Verificar la calibración con una escena de prueba antes de desplegarla en el robot.',
      tradeoff: 'Una calibración hecha con pocas vistas puede sobreajustar el ruido de la imagen. Cambiar el enfoque o la temperatura puede alterar los parámetros y exigir recalibrar. Los modelos de distorsión complejos corrigen mejor pero son más costosos de evaluar en cada fotograma.',
    },
    followups: [
      'Cómo detectarías que la calibración quedó invalida tras un golpe en la cámara?',
      'Qué error comete quien usa una distancia focal nominal del fabricante sin medirla?',
    ],
    signal: 'Que distinga intrínsecos de extrínsecos y sepa que la calidad se mide por reproyección.',
  },
  {
    id: 'int-r-022', track: 'robotica', category: 'Percepción y visión',
    q: 'Qué es la distorsión de una lente y por qué hay que corregirla antes de estimar la pose de un objeto?',
    rubric: [
      'Describe distorsión radial y tangencial y su efecto en las líneas rectas.',
      'Explica que desplaza píxeles de forma dependiente de la posición en la imagen.',
      'Propone aplicar el modelo de corrección con los coeficientes calibrados.',
      'Menciona el coste computacional y la pérdida de campo de visión al recortar.',
    ],
    answer: {
      context: 'Las lentes reales no cumplen el modelo de cámara ideal y desvían los rayos, especialmente en los bordes de la imagen. La distorsión radial desplaza puntos respecto al centro y la tangencial aparece por desalineación de la lente. Este efecto sesga cualquier medición geométrica hecha directamente sobre los píxeles.',
      decision: 'Aplicar la corrección con los coeficientes obtenidos en la calibración antes de detectar o medir. Usar una implementación vectorizada o en GPU si la cámara va a alta frecuencia. Comprobar que las líneas rectas de una escena de prueba lo siguen siendo tras la corrección.',
      tradeoff: 'Corregir la imagen completa es costoso y descarta píxeles en los bordes. Alternativamente se pueden corregir solo los puntos de interés, ahorrando cómputo. En lentes gran angular el modelo estándar puede ser insuficiente y hacer falta un modelo de ojo de pez.',
    },
    followups: [
      'Qué modelo usarías para una cámara fisheye de 180 grados?',
      'Por qué la corrección puede introducir interpolación y ruido en los bordes?',
    ],
    signal: 'Que entienda la corrección como una transformación geométrica con coste y efectos secundarios.',
  },
  {
    id: 'int-r-023', track: 'robotica', category: 'Percepción y visión',
    q: 'Cuándo preferirías una cámara gran angular o fisheye frente a una cámara pinhole convencional en un robot móvil?',
    rubric: [
      'El gran angular amplía el campo de visión y reduce puntos ciegos.',
      'La fisheye introduce distorsión extrema que exige un modelo específico.',
      'La pinhole ofrece mayor resolución angular a igualdad de sensor.',
      'La elección depende de la tarea, por ejemplo evasión frente a lectura de etiquetas.',
    ],
    answer: {
      context: 'El campo de visión determina cuánto entorno observa el robot en cada instante. Una cámara amplia ayuda a detectar obstáculos que entran lateralmente, pero reparte los píxeles en un ángulo mayor. Una cámara estrecha ve menos pero resuelve mejor detalles a distancia.',
      decision: 'Elegir gran angular para tareas de navegación y detección de obstáculos cercanos. Reservar la cámara estrecha para lectura de códigos, inspección o medidas precisas. Si usas fisheye, adoptar un modelo de proyección adecuado desde el principio en todo el pipeline.',
      tradeoff: 'Más campo de visión implica menos resolución por grado y más distorsión que corregir. Las lentes amplias son más sensibles a reflexiones y a la luz directa. Combinar dos cámaras con campos distintos mejora la cobertura pero aumenta coste, sincronización y carga de procesamiento.',
    },
    followups: [
      'Cómo sincronizarías dos cámaras con exposiciones automáticas distintas?',
      'Qué ventaja tiene un modelo de proyección unificado para SLAM?',
    ],
    signal: 'Que piense en el sentido de la compensación entre cobertura, resolución y corrección.',
  },
  {
    id: 'int-r-024', track: 'robotica', category: 'Percepción y visión',
    q: 'Diferencia detección, segmentación y seguimiento de objetos en un pipeline de visión para robótica.',
    rubric: [
      'Detección devuelve cajas y clases.',
      'Segmentación asigna una etiqueta a cada píxel o instancia.',
      'Seguimiento mantiene la identidad a lo largo del tiempo.',
      'Cada una responde a una necesidad distinta del robot.',
    ],
    answer: {
      context: 'Estas tres tareas responden a preguntas distintas. La detección dice qué hay y dónde, la segmentación delimita la forma exacta y el seguimiento mantiene la identidad entre fotogramas. En robótica la elección depende de si el robot necesita una caja, un contorno o una trayectoria.',
      decision: 'Usar detección para localizar obstáculos y contar objetos. Pasar a segmentación cuando el robot deba calcular el contorno libre o agarrar una pieza. Añadir seguimiento cuando la identidad importe, por ejemplo para no perder la pieza que se está manipulando.',
      tradeoff: 'La segmentación es más costosa y exige más etiquetado que la detección. El seguimiento depende de que la detección sea estable y puede propagar errores si se pierde el objeto. Un detector rápido con un buen seguidor suele ser más eficiente que un segmentador pesado en cada fotograma.',
    },
    followups: [
      'Qué señal indica que un seguidor ha perdido la identidad del objeto?',
      'Cómo usarías la segmentación para calcular el punto libre de agarre?',
    ],
    signal: 'Que asocie cada técnica con una necesidad real del robot y no con una lista de modas.',
  },
  {
    id: 'int-r-025', track: 'robotica', category: 'Percepción y visión',
    q: ' Qué ventajas y limitaciones tiene una cámara RGB-D frente a un LiDAR para navegación en interiores?',
    rubric: [
      'RGB-D entrega color y profundidad densa a bajo coste.',
      'Su alcance es limitado y sufre con luz solar y superficies absorbentes.',
      'LiDAR ofrece mayor alcance y precisión geométrica pero menos color.',
      'La fusión de ambos es habitual en robots robustos.',
    ],
    answer: {
      context: 'Las cámaras RGB-D proporcionan una nube de puntos densa y color en un rango típico de unos metros, con un coste moderado. El LiDAR entrega medidas más precisas y de mayor alcance, aunque no aporta apariencia y suele ser más caro. Ambas tecnologías fallan de formas distintas según la escena.',
      decision: 'Elegir RGB-D para interiores pequeños, tareas de manipulación y cuando el color ayude a reconocer objetos. Elegir LiDAR cuando importe el alcance, la precisión geométrica o trabajar con luz ambiental variable. Si el presupuesto lo permite, combinar ambos y dejar que cada uno opere en su régimen fiable.',
      tradeoff: 'La profundidad RGB-D se degrada con superficies negras, transparentes y luz solar intensa. El LiDAR puede fallar con vidrio o lluvia y tiene menor resolución vertical. La fusión mejora la robustez pero añade complejidad de sincronización y calibración extrínseca.',
    },
    followups: [
      'Cómo detectarías que la cámara de profundidad está entregando valores invalidos?',
      'Por qué un LiDAR de 2 dimensiones no basta para detectar una barra suspendida?',
    ],
    signal: 'Que conozca los modos de fallo de cada sensor y no solo sus especificaciones.',
  },
  {
    id: 'int-r-026', track: 'robotica', category: 'Percepción y visión',
    q: 'Explica la diferencia entre SLAM visual y SLAM con LiDAR y qué factores inclinan la balanza.',
    rubric: [
      'El SLAM visual usa correspondencias entre imágenes y estima profundidad por triangulación.',
      'El LiDAR SLAM usa geometría de nubes de puntos y suele ser más preciso.',
      'La luz, la textura y el coste son factores decisivos.',
      'Ambos requieren detección de cierre de bucle para limitar deriva.',
    ],
    answer: {
      context: 'SLAM construye un mapa mientras estima la pose del robot. La versión visual depende de encontrar puntos distintivos entre imágenes y de triangular su posición, por lo que sufre en escenas sin textura o con poca luz. La versión LiDAR se apoya en medidas de distancia directas y suele ser más estable geométricamente.',
      decision: 'Usar SLAM visual cuando el coste y el peso sean críticos, como en drones, o cuando el color aporte semántica. Usar LiDAR cuando se requiera precisión y operación en condiciones de iluminación variables. En ambos casos incluir cierre de bucle y verificación de consistencia global.',
      tradeoff: 'La cámara es barata y rica en información pero su estimación de escala puede ser ambigua si no hay otra fuente. El LiDAR es más costoso y entrega menos información semántica. Los sistemas visuales pueden fallar por completo con movimiento rápido o desenfoque, mientras que el LiDAR suele degradarse más suavemente.',
    },
    followups: [
      'Cómo se resuelve la ambigüedad de escala en SLAM visual monocular?',
      'Qué es una nube de puntos desestructurada y por qué complica la odometría?',
    ],
    signal: 'Que sepa que la elección depende del entorno y del presupuesto, y que ninguna opción es universal.',
  },
  {
    id: 'int-r-027', track: 'robotica', category: 'Percepción y visión',
    q: 'Qué es el cierre de bucle en SLAM y por qué es imprescindible para volver al origen con precisión?',
    rubric: [
      'Detecta que el robot vuelve a un lugar ya visitado.',
      'Añade una restricción global que reduce la deriva acumulada.',
      'Se integra como un factor en la optimización de poses.',
      'Requiere rechazar falsos positivos con verificación geométrica.',
    ],
    answer: {
      context: 'La odometría y el SLAM local acumulan error porque cada estimación se apoya en la anterior. El cierre de bucle detecta que una observación actual corresponde a una pasada anterior y añade una restricción entre dos poses lejanas. Esa restricción permite a la optimización redistribuir el error por todo el recorrido.',
      decision: 'Buscar candidatos de cierre con descriptores de apariencia o geometría y verificarlos con una comprobación espacial. Añadir la restricción al grafo de poses con una covarianza acorde a la confianza. Volver a optimizar el mapa y actualizar la pose corregida del robot.',
      tradeoff: 'Un falso cierre de bucle puede deformarcatastróficamente el mapa, por lo que la verificación es obligatoria. Optimizar cada cierre es costoso y requiere estrategias de ventanas deslizantes. En habitaciones pequeñas y repetitivas, la apariencia puede ser insuficiente y conviene apoyarse en geometría o marcas artificiales.',
    },
    followups: [
      'Cómo rechazarías un cierre de bucle en un pasillo con todas las paredes iguales?',
      'Qué diferencia hay entre optimización local y global en el grafo de poses?',
    ],
    signal: 'Que entienda el cierre de bucle como una restricción global con riesgo de falso positivo.',
  },
  {
    id: 'int-r-028', track: 'robotica', category: 'Percepción y visión',
    q: 'Para detectar una línea negra en el suelo con una cámara, por qué no basta con un umbral fijo de brillo?',
    rubric: [
      'La iluminación cambia y desplaza la distribución de intensidades.',
      'Un umbral fijo falla con sombras y reflexiones.',
      'Propone umbral adaptativo o normalización del histograma.',
      'Menciona el uso de espacio de color y de regiones de interés.',
    ],
    answer: {
      context: 'Un umbral global asume que la línea y el fondo tienen intensidades constantes, algo que no ocurre cuando cambia la luz ambiental. Las sombras, los reflejos y la exposición automática desplazan los valores de los píxeles. Como resultado, el mismo umbral que funciona por la mañana falla por la tarde.',
      decision: 'Usar un umbral adaptativo calculado sobre una vecindad local onormalizar el histograma de la región de interés. Trabajar en un espacio de color que separe mejor el objeto del fondo, por ejemplo Lab en lugar de RGB. Validar la detección con varias condiciones de iluminación antes de darla por buena.',
      tradeoff: 'El umbral adaptativo es más robusto pero puede realzar ruido en zonas uniformes. La normalización de histograma es costosa y puede amplificar artefactos de compresión. Un enfoque basado en aprendizaje es más flexible pero exige datos de entrenamiento y cómputo adicional.',
    },
    followups: [
      'Cómo afecta el desenfoque de movimiento a la detección de la línea?',
      'Por qué limitar la región de interés mejora la robustez y la velocidad?',
    ],
    signal: 'Que identifique la iluminación como variable y proponga una solución adaptativa con validación.',
  },
  {
    id: 'int-r-029', track: 'robotica', category: 'Percepción y visión',
    q: 'Qué son los descriptores locales y cómo se usan para estimar el movimiento de una cámara entre dos imágenes?',
    rubric: [
      'Detectan puntos distintivos y los describen de forma invariante.',
      'SIFT, ORB o FAST son ejemplos habituales.',
      'Las correspondencias alimentan la matriz fundamental o el problema PnP.',
      'Requieren rechazo de outliers con RANSAC.',
    ],
    answer: {
      context: 'Los descriptores locales codifican la apariencia alrededor de puntos detectados para poder reconocerlos en otra imagen. Deben ser resistentes a cambios de escala, rotación e iluminación. Una vez emparejados, esos puntos permiten estimar la geometría epipolar o la pose de la cámara.',
      decision: 'Detectar puntos con un operador como ORB y emparejar sus descriptores con una métrica adecuada. Filtrar los pares ambiguos con una prueba de distancia relativa. Alimentar las correspondencias a un algoritmo robusto como RANSAC para estimar la transformación entre imágenes.',
      tradeoff: 'Los descriptores muy invariantes son más costosos y pueden ser menos discriminatorios. En escenas sin textura no hay puntos suficientes y el método falla. El flujo óptico directo puede ser más rápido en secuencias cortas, pero es sensible a cambios grandes de iluminación o movimiento.',
    },
    followups: [
      'Qué ocurre si el robot se mueve demasiado rápido entre dos fotogramas?',
      'Cómo elegirías entre emparejar descriptores y seguir puntos con flujo óptico?',
    ],
    signal: 'Que conozca la cadena completa detección, emparejamiento, estimación robusta.',
  },
  {
    id: 'int-r-030', track: 'robotica', category: 'Percepción y visión',
    q: 'Cómo afecta la latencia de la percepción al control de un robot rápido y cómo la mitigarías?',
    rubric: [
      'Relaciona latencia con error de fase en el lazo de control.',
      'Menciona el retardo variable como fuente de inestabilidad.',
      'Propone marcas de tiempo y predicción del estado futuro.',
      'Cita la sincronización de sensores y el procesamiento en el borde.',
    ],
    answer: {
      context: 'Una percepción que llega tarde describe un pasado del robot, y el controlador actúa sobre una imagen desactualizada. A velocidades altas, un retardo de décimas de segundo se traduce en un desplazamiento considerable. Si el retardo varía, el controlador recibe información inconsistente y puede oscilar.',
      decision: 'Etiquetar cada dato con su marca de tiempo y estimar la pose en el instante de decisión mediante predicción. Reducir el camino de procesamiento ejecutando la inferencia cerca del sensor. Medir la distribución de latencias y diseñar el controlador con un margen de fase suficiente.',
      tradeoff: 'Predecir el estado futuro amplifica el ruido y falla ante maniobras inesperadas. Procesar en el borde consume potencia y limita la complejidad del modelo. Esperar a tener todos los sensores incrementa la coherencia pero añade retardo, así que conviene fijar una ventana de espera acotada.',
    },
    followups: [
      'Cómo detectarías en tiempo real que la latencia está creciendo?',
      'Qué señal de un controlador indica que el retardo está causando oscilaciones?',
    ],
    signal: 'Que entienda la percepción como parte del lazo de control y no como un módulo aislado.',
  },

  // ---------- ROBÓTICA: Control y RL (10) ----------
  {
    id: 'int-r-031', track: 'robotica', category: 'Control y RL',
    q: 'Cómo estructurarías un controlador PID para la velocidad de una rueda y qué harías con el término integral?',
    rubric: [
      'El error es la diferencia entre velocidad deseada y medida por encoder.',
      'El término proporcional reacciona y el derivado amortigua.',
      'El integral elimina error estacionario pero puede saturarse.',
      'Menciona anti wind-up y filtrado de la derivada.',
    ],
    answer: {
      context: 'El lazo de velocidad de rueda suele ser el más interno del control de un móvil. La medida viene del encoder y la acción es una consigna de corriente o de ciclo de trabajo al motor. El error estacionario aparece por fricción y carga, y el término integral es el encargado de eliminarlo.',
      decision: 'Sintonizar primero proporcional y derivado, y después añadir el integral con ganancia moderada. Filtrar la derivada para no amplificar el ruido del encoder. Implementar anti wind-up congelando o limitando el acumulador cuando la salida sature.',
      tradeoff: 'Un integral agresivo elimina el error rápido pero genera sobreoscilación y retardos al cambiar de consigna. Una derivada sin filtrar puede volver loco el actuador con ruido de cuantización. Un lazo de velocidad bien sintonizado no garantiza que la trayectoria del robot sea precisa si la cinemática está mal calibrada.',
    },
    followups: [
      'Qué síntomas indican que el integral está causing wind-up?',
      'Cómo cambiaría la sintonización al pasar de alfombra a suelo liso?',
    ],
    signal: 'Que muida experiencia práctica con los efectos de cada término y la saturación.',
  },
  {
    id: 'int-r-032', track: 'robotica', category: 'Control y RL',
    q: 'Cómo sintonizarías un PID en un robot real sin un modelo preciso?',
    rubric: [
      'Propone un método empírico como Ziegler-Nichols o pruebas de escalón.',
      'Empieza con ganancias conservadoras y aumenta progresivamente.',
      'Observa sobreoscilación, tiempo de respuesta y error estacionario.',
      'Valida con diferentes cargas y superficies.',
    ],
    answer: {
      context: 'En muchos robots el modelo de la planta es incierto porque cambia la carga, la fricción y la batería. La sintonización empírica observa la respuesta a consignas de prueba y ajusta las ganancias según sobreoscilación y tiempo de establecimiento. Los métodos clásicos ofrecen un punto de partida que luego se refina.',
      decision: 'Aplicar un escalón de velocidad y medir la respuesta con el encoder. Aumentar la ganancia proporcional hasta observar oscilación sostenida y aplicar una regla empírica como punto inicial. Ajustar después derivado e integral y validar con carga y superficies distintas.',
      tradeoff: 'Los métodos empíricos pueden llevar el robot a oscilaciones violentas si se aplican sin límites. La respuesta obtenida en un punto de operación no es válida en otro, por ejemplo con batería baja. Programar ganancias dependientes de la operación mejora el resultado pero complica el mantenimiento.',
    },
    followups: [
      'Por qué Ziegler-Nichols suele dar respuestas demasiado agresivas en robótica?',
      'Cómo automatizarías la sintonización sin arriesgar el robot?',
    ],
    signal: 'Que combine método con cautela experimental, no que recite una tabla de constantes.',
  },
  {
    id: 'int-r-033', track: 'robotica', category: 'Control y RL',
    q: 'Explica el control pure pursuit para seguir un camino y qué parámetro controla su agresividad.',
    rubric: [
      'Busca un punto objetivo a una distancia de mirada hacia delante.',
      'Calcula la curvatura que lleva al robot hasta ese punto.',
      'La distancia de mirada regula suavidad frente a precisión.',
      'Requiere convertir la curvatura en velocidades de rueda.',
    ],
    answer: {
      context: 'Pure pursuit es un controlador geométrico que elige un punto del camino a una distancia fija por delante del robot y calcula el arco de circunferencia que lo alcanza. Es muy usado por su simplicidad y robustez en robots diferenciales. No modela la dinámica, por lo que supone que el robot sigue bien la curvatura ordenada.',
      decision: 'Seleccionar el punto más cercano del camino y avanzar una distancia de mirada a lo largo de él. Calcular la curvatura como dos veces el desplazamiento lateral dividido por el cuadrado de esa distancia. Convertir la curvatura en velocidades de rueda y limitar la velocidad según la curvatura.',
      tradeoff: 'Una mirada corta sigue el camino con precisión pero produce movimientos nerviosos y oscilaciones. Una mirada larga suaviza pero corta esquinas y puede fallar en curvas cerradas. Hacer la mirada proporcional a la velocidad es una solución habitual, aunque no elimina todos los problemas.',
    },
    followups: [
      'Qué hacerse si el punto objetivo queda detrás del robot?',
      'Cómo modificarías pure pursuit para respetar límites de aceleración?',
    ],
    signal: 'Que entienda el efecto de la distancia de mirada y sepa que es un control geométrico.',
  },
  {
    id: 'int-r-034', track: 'robotica', category: 'Control y RL',
    q: 'Qué es el control predictivo basado en modelo y por qué es útil con restricciones?',
    rubric: [
      'Predice el futuro usando un modelo del sistema en un horizonte.',
      'Resuelve una optimización respetando restricciones de estado y entrada.',
      'Aplica solo la primera acción y vuelve a optimizar en cada paso.',
      'El coste computacional es su principal desventaja.',
    ],
    answer: {
      context: 'El control predictivo optimiza una secuencia de acciones futuras usando un modelo del sistema y un horizonte de predicción. A diferencia de un PID, puede incluir restricciones explícitas en velocidad, aceleración y distancia a obstáculos. En cada ciclo aplica solo la primera acción y repite la optimización con la nueva medida.',
      decision: 'Definir un modelo simple del robot y una función de coste que penalice error de trayectoria y esfuerzo de control. Incluir restricciones duras para los límites del actuador y la distancia mínima a obstáculos. Elegir un horizonte y un periodo de muestreo compatibles con el presupuesto computacional.',
      tradeoff: 'La calidad depende de que el modelo sea razonablemente fiel, y un modelo pobre degrada el resultado. La optimización en línea puede ser demasiado costosa para una placa pequeña. Un horizonte largo mejora la visión anticipada pero aumenta el tiempo de cálculo y la sensibilidad a errores del modelo.',
    },
    followups: [
      'Cómo reducirías el coste computacional para una placa embebida?',
      'Qué ventaja tiene sobre un PID para evitar obstáculos dinámicos?',
    ],
    signal: 'Que relacione MPC con restricciones explícitas y reconozca su coste.',
  },
  {
    id: 'int-r-035', track: 'robotica', category: 'Control y RL',
    q: 'Qué es un controlador LQR y qué supone sobre el sistema y la función de coste?',
    rubric: [
      'Supone dinámica lineal y coste cuadrático en estados y entradas.',
      'Calcula una ley de realimentación lineal mediante la ecuación de Riccati.',
      'Las matrices Q y R ponderan error frente a esfuerzo.',
      'No maneja restricciones duras directamente.',
    ],
    answer: {
      context: 'LQR diseña una ley de control óptima para un sistema lineal con un coste cuadrático que penaliza desviación del estado y esfuerzo de control. Resuelve la ecuación de Riccati para obtener una matriz de ganancia constante. Es un enfoque elegantey computacionalmente barato en ejecución.',
      decision: 'Linealizar el modelo alrededor del punto de operación y escribirlo en forma de espacio de estados. Elegir las matrices Q y R según la importancia relativa de seguir la referencia y ahorrar energía. Calcular la ganancia offline y aplicar la ley de realimentación en tiempo real.',
      tradeoff: 'La linealización limita la validez a una vecindad del punto elegido. LQR no respeta restricciones duras, por lo que hace falta saturar la salida y aceptar pérdida de optimalidad. Ajustar Q y R suele ser más intuitivo que sintonizar un PID, pero requiere interpretar bien las unidades.',
    },
    followups: [
      'Cómo extenderías la idea a un sistema no lineal?',
      'Qué consecuencia tiene saturar la señal de control de un LQR?',
    ],
    signal: 'Que sepa qué supuestos se están haciendo y dónde dejan de ser válidos.',
  },
  {
    id: 'int-r-036', track: 'robotica', category: 'Control y RL',
    q: 'En aprendizaje por refuerzo, qué diferencia hay entre recompensa densa y dispersa y qué efecto tiene en el entrenamiento?',
    rubric: [
      'La densa da señal en casi cada paso y acelera el aprendizaje.',
      'La dispersa solo premia al completar la tarea y es más difícil de optimizar.',
      'La densa puede introducir sesgos y explotación de atajos.',
      'El diseño de recompensa determina el comportamiento aprendido.',
    ],
    answer: {
      context: 'La recompensa define qué considera bueno el agente. Una recompensa dispersa, como recibir un premio solo al llegar al destino, es honesta pero ofrece poca guía. Una recompensa densa proporciona señal continua, por ejemplo penalizar la distancia al objetivo en cada paso.',
      decision: 'Empezar con una recompensa densa que guíe al agente y verificar que el comportamiento resultante sea el deseado. Añadir términos de penalización suaves para colisiones y consumo de energía. Comprobar en evaluación que el agente no esté explotando un atajo de la función de recompensa.',
      tradeoff: 'Una recompensa densa mal diseñada puede enseñar al robot a quedarse quieto o a girar en círculos. Una recompensa dispersa es más fiel a la tarea pero puede requerir mucho más muestreo. El formato de la recompensa es una forma de especificar requisitos que conviene documentar y probar.',
    },
    followups: [
      'Cómo detectarías que el agente encontró un atajo en la recompensa?',
      'Qué papel juega el potential-based shaping para no alterar la política óptima?',
    ],
    signal: 'Que entienda que la recompensa es una especificación y que puede ser engañosa.',
  },
  {
    id: 'int-r-037', track: 'robotica', category: 'Control y RL',
    q: 'Qué es el sim-to-real gap y cómo usarías la aleatorización de dominio para reducirlo?',
    rubric: [
      'Es la diferencia entre la simulación y la física real.',
      'Afecta a fricción, masa, retardos y ruido de sensores.',
      'La aleatorización entrena sobreMany variaciones de esos parámetros.',
      'El ajuste fino con datos reales suele ser necesario.',
    ],
    answer: {
      context: 'Una política entrenada en simulación puede funcionar mal en el robot real porque el simulador no captura toda la física. Fricción, juego mecánico, retardos y ruido de sensores suelen estar modelados de forma incompleta. Esa discrepancia se llama brecha entre simulación y realidad.',
      decision: 'Aleatorizar durante el entrenamiento parámetros como fricción, masa, retardo de actuación y ruido de observación. Mantener distribuciones amplias pero plausibles para obligar a la política a ser robusta. Validar en el robot real con pruebas graduales y recoger datos para un ajuste fino.',
      tradeoff: 'Demasiada aleatorización produce políticas conservadoras que rinden poco. Una aleatorización insuficiente no cubre las condiciones reales. El ajuste fino mejora el resultado pero consume tiempo de robot y puede sobreajustar a una sola superficie o sesión.',
    },
    followups: [
      'Qué parámetros aleatorizarías primero para un robot diferencial?',
      'Cómo mitigar que la política explote artefactos del simulador?',
    ],
    signal: 'Que identifique fuentes concretas de discrepancia y no solo repita el término.',
  },
  {
    id: 'int-r-038', track: 'robotica', category: 'Control y RL',
    q: 'Diferencia métodos on-policy y off-policy en aprendizaje por refuerzo y da un ejemplo de cada uno.',
    rubric: [
      'On-policy aprende de datos generados por la política actual.',
      'Off-policy puede aprender de un búfer de experiencias de otras políticas.',
      'PPO es on-policy y DQN o SAC son off-policy.',
      'La reutilización de datos mejora la eficiencia de muestreo.',
    ],
    answer: {
      context: 'La distinción está en si los datos de entrenamiento provienen de la política que se está mejorando. Los métodos on-policy, como PPO, descartan las muestras después de unas pocas actualizaciones. Los off-policy, como DQN o SAC, guardan transiciones en un búfer y las reutilizan.',
      decision: 'Elegir un método on-policy cuando la estabilidad y la simplicidad de implementación importen más que la eficiencia. Elegir off-policy cuando recoger datos en el robot sea caro y quieras aprovechar experiencias pasadas. Tener cuidado con el sesgo introducido por un búfer desactualizado.',
      tradeoff: 'Los métodos off-policy son más eficientes en muestreo pero pueden ser inestables si la distribución del búfer cambia. Los on-policy son más robustos pero consumen muchas interacciones, algo costoso en robótica física. El entrenamiento en simulación reduce el coste de muestreo para ambos enfoques.',
    },
    followups: [
      'Por qué PPO limita el tamaño de la actualización de la política?',
      'Qué problemas trae un búfer de repetición con políticas muy antiguas?',
    ],
    signal: 'Que asocie la elección del algoritmo con el coste de recoger datos en el mundo real.',
  },
  {
    id: 'int-r-039', track: 'robotica', category: 'Control y RL',
    q: 'Cuándo usarías DQN y cuándo PPO para entrenar un controlador de navegación?',
    rubric: [
      'DQN funciona con acciones discretas y aprende el valor de la acción.',
      'PPO admite acciones continuas y actualiza la política directamente.',
      'PPO suele ser más estable y fácil de paralelizar.',
      'La elección depende del espacio de acción y del presupuesto de muestreo.',
    ],
    answer: {
      context: 'DQN aproxima el valor de cada acción discreta y selecciona la de mayor valor, usando un búfer de repetición y una red objetivo. PPO optimiza la política directamente con Actualizaciones recortadas que limitan el cambio. Son families distintas con compromisos distintos en estabilidad y eficiencia.',
      decision: 'Usar DQN si el robot elige entre un conjunto pequeño de acciones discretas, como adelante, girar izquierda o girar derecha. Usar PPO si controlas velocidad lineal y angular de forma continua. Considerar SAC si necesitas eficiencia de muestreo con acciones continuas y exploración automática.',
      tradeoff: 'DQN discretiza el control y puede dar movimientos bruscos, además de sobreestimar valores sin las debidas precauciones. PPO requiere muchas muestras pero es estable y paralelizable en simulación. La elección del algoritmo importa menos que un buen diseño de observaciones y recompensas.',
    },
    followups: [
      'Cómo discretizarías una acción continua sin perder precisión?',
      'Qué es la sobreestimación en DQN y cómo se corrige con variantes como Double DQN?',
    ],
    signal: 'Que relacione el algoritmo con el espacio de acción y no con una preferencia de moda.',
  },
  {
    id: 'int-r-040', track: 'robotica', category: 'Control y RL',
    q: 'Cómo garantizarías seguridad cuando un controlador aprendido puede proponer acciones peligrosas?',
    rubric: [
      'Propone una capa de seguridad que sobrescriba acciones inseguras.',
      'Menciona restricciones de velocidad y distancia mínima a obstáculos.',
      'Cita el uso de un controlador clásico como respaldo.',
      'Propone monitorizar violaciones y registrarlas para evaluación.',
    ],
    answer: {
      context: 'Una política aprendida puede explorar o fallar de forma imprevisible y proponer velocidades que dañen el robot o a personas. En robótica física la seguridad no puede dejarse al azar del entrenamiento. Por eso se emplea una capa supervisora que tiene la última palabra sobre las acciones.',
      decision: 'Interponer un filtro de seguridad que recorte velocidades y distance a obstáculos antes de los motores. Mantener un controlador clásico que tome el control cuando la política salga de su dominio de validez. Registrar cada vez que la capa intervenga para analizar y mejorar la política.',
      tradeoff: 'Una capa demasiado restrictiva impide a la política aprovechar maniobras útiles y degrada el rendimiento. Demasiado laxa deja riesgos reales. El respaldo clásico añade complejidad y puede entrar en conflicto con la política si no hay una transición suave entre ambos.',
    },
    followups: [
      'Cómo diseñarías un escudo de seguridad que sea formalmente correcto?',
      'Qué harías si la capa de seguridad interviene en el ochenta por ciento de los pasos?',
    ],
    signal: 'Que trate la seguridad como una restricción del sistema, no como una esperanza de entrenamiento.',
  },

  // ---------- ROBÓTICA: Embedded / ROS (10) ----------
  {
    id: 'int-r-041', track: 'robotica', category: 'Embedded/ROS',
    q: 'Cuándo usarías un topic, un service y una action en ROS 2?',
    rubric: [
      'Topic para flujo continuo de datos sin respuesta inmediata.',
      'Service para peticiones breves y síncronas.',
      'Action para tareas largas con feedback y cancelación.',
      'Menciona el acoplamiento temporal entre productor y consumidor.',
    ],
    answer: {
      context: 'ROS 2 ofrece tres patrones de comunicación con semánticas distintas. Los topics son un flujo de datos publicados, los services son una llamada de request y respuesta, y las actions combinan objetivo, retroalimentación y resultado. Elegir mal el patrón produce sistemas difíciles de depurar.',
      decision: 'Usar topics para sensores y estados que se publican de forma continua. Usar services para consultas puntuales como pedir la calibración actual. Usar actions para maniobras que tardan segundos y pueden cancelarse, como navegar a un punto.',
      tradeoff: 'Los topics desacoplan a emisor y receptor pero no garantizan que alguien reciba el dato. Los services son síncronos y pueden bloquear al cliente si el servidor tarda. Las actions añaden complejidad de estados y servidores, pero son la única opción razonable para tareas largas y cancelables.',
    },
    followups: [
      'Qué ocurre si un servicio tarda más que el tiempo de espera del cliente?',
      'Cómo cancelarías una action cuando el robot detecta un obstáculo?',
    ],
    signal: 'Que elija el patrón por la semántica temporal de la tarea, no por costumbre.',
  },
  {
    id: 'int-r-042', track: 'robotica', category: 'Embedded/ROS',
    q: 'Para qué sirve TF2 y qué problema resuelve la interpolación de transformaciones en el tiempo?',
    rubric: [
      'Mantiene y consulta transformaciones entre marcos con marcas de tiempo.',
      'Permite obtener la pose de un sensor en otro marco en un instante dado.',
      'La interpolación evita errores cuando las frecuencias de publicación no coinciden.',
      'Requiere marcas de tiempo sincronizadas y amortiguación de datos.',
    ],
    answer: {
      context: 'Los sensores publican datos a frecuencias distintas y con pequeños desfases. TF2 guarda un historial de transformaciones y permite consultar la relación entre dos marcos en un instante concreto, interpolando entre las muestras disponibles. Sin esto, un punto medido en un instante se transformaría con una pose de otro.',
      decision: 'Publicar transformaciones con marcas de tiempo coherentes con los datos que describen. Consultar la transformación con la marca de tiempo del dato, no con la hora actual. Ajustar el búfer de TF2 para cubrir el retardo máximo esperado sin crecer sin límite.',
      tradeoff: 'Un búfer corto produce fallos de transformación cuando hay retardos, mientras que uno largo consume memoria. La extrapolación más allá del último dato es peligrosa y conviene evitarla. Relojes desincronizados entre equipos generan errores que parecen problemas de calibración.',
    },
    followups: [
      'Qué es el uso de extraplication en TF2 y por qué desaconsejarse?',
      'Cómo sincronizarías relojes entre una placa embebida y un PC?',
    ],
    signal: 'Que entienda que la transformación correcta es la del instante del dato, no la actual.',
  },
  {
    id: 'int-r-043', track: 'robotica', category: 'Embedded/ROS',
    q: 'Qué son las políticas QoS en ROS 2 y cómo afectan a un robot con ancho de banda limitado?',
    rubric: [
      'Controlan fiabilidad, durabilidad, historia y deadlines de la comunicación.',
      'Best effort reduce overhead pero puede perder mensajes.',
      'Reliable garantiza entrega pero consume más recursos.',
      'La profundidad de la cola afecta a latencia y uso de memoria.',
    ],
    answer: {
      context: 'DDS, la capa de comunicación de ROS 2, permite configurar la calidad de servicio de cada publicación y suscripción. Fiabilidad, durabilidad, profundidad de cola y plazos determinan cuántos recursos se consumen y qué garantías se ofrecen. Un mal ajuste puede congestionar la red o perder datos críticos.',
      decision: 'Usar best effort y cola corta para flujos de alta frecuencia donde el dato antiguo no sirve, como imágenes. Usar reliable para comandos de control o estados críticos. Ajustar la durabilidad transiente local cuando un suscriptor tardío necesite el último valor publicado.',
      tradeoff: 'Reliable con colas grandes puede acumular mensajes obsoletos y aumentar la latencia. Best effort puede perder justo el mensaje importante. Perfiles QoS incompatibles entre publicador y suscriptor hacen que no se conecten, un fallo que a menudo se confunde con un error de código.',
    },
    followups: [
      'Por qué una imagen suele publicarse con best effort y cola pequeña?',
      'Cómo diagnosticarías que dos nodos no conectan por QoS incompatible?',
    ],
    signal: 'Que sepa que la comunicación tiene parámetros negociables y consecuencias medibles.',
  },
  {
    id: 'int-r-044', track: 'robotica', category: 'Embedded/ROS',
    q: 'Cómo implementarías un bucle de control a 200 Hz en una placa embebida sin que se desvíe el periodo?',
    rubric: [
      'Usar interrupciones por temporizador en lugar de retardos bloqueantes.',
      'Medir el tiempo de ejecución del bucle y mantener margen.',
      'Evitar asignaciones dinámicas y operaciones bloqueantes en el bucle.',
      'Priorizar el bucle frente a tareas de comunicación o logging.',
    ],
    answer: {
      context: 'Un bucle de control requiere periodos regulares porque el controlador asume un paso de tiempo conocido. Usar retardos software acumula desviación y jitter, sobre todo si otras tareas compiten por la CPU. En una placa embebida conviene apoyarse en un temporizador de hardware y un RTOS o planificador de prioridades.',
      decision: 'Disparar el bucle con una interrupción de temporizador y desplazar el trabajo pesado a tareas de menor prioridad. Medir el peor tiempo de ejecución y asegurarse de que quede holgura hasta el periodo. Preasignar buffers y evitar comunicaciones bloqueantes dentro del bucle.',
      tradeoff: 'Un periodo muy ajustado deja poco margen y provoca sobrecarga cuando aumenta la carga. Priorizar demasiado el control puede starvation a la comunicación y dejar el robot sin telemetría. Registrar dentro del bucle añade jitter, así que es mejor copiar datos a un buffer y dejar el registro para otra tarea.',
    },
    followups: [
      'Qué es el jitter y por qué perjudica más que un retardo constante?',
      'Cómo detectarías que una tarea de logging está rompiendo la temporalidad?',
    ],
    signal: 'Que piense en tiempo real y en peores casos, no solo en velocidad media.',
  },
  {
    id: 'int-r-045', track: 'robotica', category: 'Embedded/ROS',
    q: 'Qué problema resuelve un RTOS frente a un bucle superloop en el firmware de un robot?',
    rubric: [
      'El RTOS ofrece planificación por prioridades y latencias acotadas.',
      'Permite separar tareas con requisitos temporales distintos.',
      'El superloop es simple pero una tarea larga bloquea a las demás.',
      'Añade complejidad, consumo de memoria y necesidad de sincronización.',
    ],
    answer: {
      context: 'En un superloop todas las tareas se ejecutan secuencialmente y el tiempo de respuesta depende de lo que tarden las anteriores. Un RTOS proporciona hilos con prioridades, semáforos y temporizadores, de modo que la tarea crítica puede preemptar a las demás. Es útil cuando conviven control en tiempo real, comunicación y registro.',
      decision: 'Usar un RTOS cuando existan tareas con periodos y plazos incompatibles, por ejemplo control a 200 Hz y telemetría a 10 Hz. Asignar prioridades según criticidad temporal y proteger los recursos compartidos. Medir latencias y uso de pila de cada tarea antes de dar el sistema por bueno.',
      tradeoff: 'El RTOS consume memoria y añade puntos de fallo por errores de sincronización, como inversiones de prioridad o interbloqueos. Un superloop bien acotado puede ser suficiente y más fácil de verificar en sistemas pequeños. La_depuración de sistemas concurrentes es notablemente más difícil.',
    },
    followups: [
      'Qué es la inversión de prioridad y cómo se evita?',
      'Por qué una tarea de alta prioridad no debe esperar un mutex de larga duración?',
    ],
    signal: 'Que justifique la complexidad añadida con requisitos temporales concretos.',
  },
  {
    id: 'int-r-046', track: 'robotica', category: 'Embedded/ROS',
    q: 'Cómo elegirías entre I2C, SPI y CAN para conectar sensores y actuadores en un robot?',
    rubric: [
      'I2C usa dos hilos y permite varios dispositivos en el mismo bus.',
      'SPI es más rápido pero requiere más líneas y selección de esclavo.',
      'CAN es robusto a ruido y con mensajes priorizados, pensado para largas distancias.',
      'La elección depende de velocidad, distancia, ruido y número de dispositivos.',
    ],
    answer: {
      context: 'Cada bus tiene un compromiso distinto entre velocidad, número de hilos, inmunidad a ruido y complejidad. I2C es cómodo para sensores lentos en la misma placa, SPI para dispositivos que requieren ancho de banda como pantallas o memorias, y CAN para cableados largos con ruido electromagnético. Cada uno impone además limitaciones distintas de cableado y de direccionamiento.',
      decision: 'Usar I2C para sensores de baja frecuencia dentro de la placa y con pocos dispositivos por dirección. Usar SPI para sensores inerciales rápidos o pantallas. Usar CAN para conectar controladores de motor o módulos separados por un cableado largo y ruidoso.',
      tradeoff: 'I2C es susceptible a capacitancia y a direcciones duplicadas, y su velocidad es limitada. SPI consume más pines y no tiene direccionamiento nativo. CAN requiere transceptores y una capa de protocolo, pero ofrece detección de errores y priorización de mensajes que los otros no tienen.',
    },
    followups: [
      'Qué pasa cuando dos dispositivos I2C comparten dirección?',
      'Por qué CAN es más adecuado que I2C para un cable de dos metros junto a motores?',
    ],
    signal: 'Que relacione el bus con restricciones físicas reales del robot.',
  },
  {
    id: 'int-r-047', track: 'robotica', category: 'Embedded/ROS',
    q: 'Tu placa tiene poca RAM pero necesitas filtrar y almacenar datos de sensores. Qué decisiones tomarías?',
    rubric: [
      'Usar buffers fijos y reutilización en lugar de asignaciones dinámicas.',
      'Reducir la precisión de los datos almacenados cuando sea aceptable.',
      'Procesar en streaming en vez de acumular muestras.',
      'Priorizar qué datos se descartan y documentar la política.',
    ],
    answer: {
      context: 'En microcontroladores la memoria es escasa y la fragmentación por asignaciones dinámicas puede fallar tras horas de funcionamiento. Un filtro necesita un historial corto y unas pocas variables de estado, pero un registrador de telemetría puede crecer sin control. Conviene dimensionar cada buffer desde el diseño.',
      decision: 'Declarar buffers estáticos con tamaño máximo conocido y reutilizarlos. Reducir el numero de muestras guardadas y comprimir o cuantizar los valores cuando el análisis lo permita. Descartar muestras antiguas de forma determinista y priorizar los periodos cercanos a eventos importantes.',
      tradeoff: 'Un buffer pequeño puede perder justo el evento que querías analizar. Cuantizar reduce la resolución y puede enmascarar fallos sutiles. Procesar en streaming ahorra memoria pero impide reanalizar con otros parámetros después, algo que en campo puede ser decisivo.',
    },
    followups: [
      'Cómo detectarías una fuga de memoria en un firmware que corre días?',
      'Qué datos conservarías sí o sí para diagnosticar una colisión?',
    ],
    signal: 'Que piense en peores casos de memoria y en qué información es realmente valiosa.',
  },
  {
    id: 'int-r-048', track: 'robotica', category: 'Embedded/ROS',
    q: 'Para qué sirve un watchdog en un robot autónomo y cómo evitar que dispare falsos positivos?',
    rubric: [
      'Reinicia el sistema si el software deja de dar señal de vida.',
      'Protege frente a bucles infinitos o bloqueos de comunicación.',
      'Requiere alimentarlo desde una tarea independiente y saludable.',
      'Debe distinguir fallo real de tareas legítimamente lentas.',
    ],
    answer: {
      context: 'Un watchdog es un temporizador de hardware que reinicia el procesador si no se refresca a tiempo. Es la última línea de defensa cuando el software se cuelga y nadie puede intervenir. En un robot autónomo evita que quede inmóvil o girando sin control durante minutos.',
      decision: 'Alimentar el watchdog desde una tarea supervisora que verifique que los bucles críticos siguen activos. Fijar el periodo con margen respecto al peor tiempo de ejecución esperado. Registrar el motivo del reinicio en memoria no volátil para analizarlo después.',
      tradeoff: 'Un periodo demasiado corto reinicia el robot por cargas puntuales legítimas. Uno demasiado largo deja al robot fuera de control demasiado tiempo. Alimentarlo desde el mismo bucle que puede colgarse anula su utilidad, así que la supervisión debe ser independiente.',
    },
    followups: [
      'Qué harías después de un reinicio por watchdog en mitad de una misión?',
      'Cómo evitar que un reinicio deje los motores en estado arbitrario?',
    ],
    signal: 'Que entienda el watchdog como mecanismo de seguridad con lógica de supervisión.',
  },
  {
    id: 'int-r-049', track: 'robotica', category: 'Embedded/ROS',
    q: 'Qué es DDS en ROS 2 y qué ventaja ofrece frente al middleware de ROS 1?',
    rubric: [
      'Es el estándar de comunicación basado en publicación y suscripción.',
      'Permite configurar QoS y descubrimiento automático.',
      'Elimina el maestro centralizado de ROS 1.',
      'Añade complejidad de configuración y perfiles de red.',
    ],
    answer: {
      context: 'ROS 2 se apoya en DDS, un estándar de comunicación en tiempo real con descubrimiento automático y políticas de calidad de servicio. A diferencia de ROS 1, no depende de un maestro central que se convierte en punto único de fallo. Esto facilita despliegues distribuidos y robots con varios equipos a bordo.',
      decision: 'Aprovechar el descubrimiento automático para que los nodos se encuentren sin configuración manual. Definir perfiles QoS explícitos en lugar de depender de los valores por defecto. Planificar la red, incluyendo dominios y multidifusión, cuando convivan varios robots.',
      tradeoff: 'DDS es más potente pero también más complejo de diagnosticar que el middleware de ROS 1. El descubrimiento por multidifusión puede fallar en redes mal configuradas. Los perfiles QoS por defecto no siempre encajan con las necesidades de un robot y conviene revisarlos.',
    },
    followups: [
      'Qué problema resuelve el uso de dominios DDS con varios robots?',
      'Cómo afecta la red inalámbrica al descubrimiento y a la QoS?',
    ],
    signal: 'Que conozca las consecuencias prácticas del cambio de middleware, no solo la definición.',
  },
  {
    id: 'int-r-050', track: 'robotica', category: 'Embedded/ROS',
    q: 'Cómo diseñarías la telemetría de un robot para diagnosticar fallos en campo sin estar presente?',
    rubric: [
      'Registrar marcas de tiempo, pose, consignas y medidas de sensores.',
      'Incluir eventos discretos como colisiones o reinicios.',
      'Usar un formato simple y parseable, por ejemplo CSV.',
      'Equilibrar frecuencia de muestreo, tamaño y batería.',
    ],
    answer: {
      context: 'La telemetría es la única forma de reconstruir qué pasó cuando el robot falla lejos del puesto de trabajo. Debe capturar suficiente contexto para distinguir un fallo de percepción de uno de control o de comunicación. Un archivo CSV bien estructurado suele ser más útil que un vídeo difícil de alinear.',
      decision: 'Definir un esquema con tiempo, pose estimada, velocidades de rueda, consignas, lecturas de sensores y estado de los subsistemas. Añadir filas de evento para colisiones, cambios de modo y reinicios. Validar que el archivo permita responder preguntas concretas antes de ampliar el conjunto de columnas.',
      tradeoff: 'Registrar demasiadas columnas consume almacenamiento y energía, y dificulta el análisis. Registrar demasiado poco deja sin pistas justo donde aparece el fallo. Muestrear a alta frecuencia mejora la resolución temporal pero puede llenar la memoria en misiones largas.',
    },
    followups: [
      'Cómo alinearías la telemetría con un vídeo de la ejecución?',
      'Qué señal te diría que la estimación de pose se ha vuelto no fiable?',
    ],
    signal: 'Que diseñe la telemetría pensando en preguntas de diagnóstico concretas.',
  },

  // ---------- IA: Fundamentos ML (20) ----------
  {
    id: 'int-a-001', track: 'ai', category: 'Fundamentos ML',
    q: 'Explica el compromiso sesgo-varianza y cómo decidirías si tu modelo necesita más capacidad o más regularización.',
    rubric: [
      'Define sesgo como error por supuestos demasiado simples y varianza como sensibilidad a los datos de entrenamiento.',
      'Usa curvas de aprendizaje para distinguir ambos regímenes.',
      'Propone más capacidad o mejores features si falla tanto en entrenamiento como en validación.',
      'Propone regularización o más datos si el error de validación crece mientras el de entrenamiento baja.',
    ],
    answer: {
      context: 'El error de generalización se descompone en sesgo, varianza y ruido irreducible. Un modelo con alto sesgo no captura la estructura de los datos y falla incluso en entrenamiento, mientras que uno con alta varianza memoriza particularidades y se degrada en validación. Las curvas de aprendizaje permiten ver cuál de los dos domina.',
      decision: 'Comparar el error en entrenamiento y validación a distintos tamaños de muestra. Si ambos errores son altos y cercanos, aumentar la capacidad o mejorar las variables de entrada. Si el error de entrenamiento es bajo y el de validación alto, añadir regularización, más datos o reducir complejidad.',
      tradeoff: 'Aumentar la capacidad reduce sesgo pero puede disparar la varianza si los datos son escasos. La regularización controla la varianza pero puede dejar sesgo si es demasiado fuerte. El ruido irreducible pone un suelo que ningún modelo puede superar, y conviene reconocerlo antes de invertir más esfuerzo.',
    },
    followups: [
      'Qué forma tienen las curvas de aprendizaje de un modelo con alta varianza?',
      'Cómo cambiaría el diagnóstico si los datos de validación vinieran de otra distribución?',
    ],
    signal: 'Que diagnose con evidencia de curvas y no con la intuición de que "más complejo es mejor".',
  },
  {
    id: 'int-a-002', track: 'ai', category: 'Fundamentos ML',
    q: 'Tu modelo tiene 0,99 de accuracy en entrenamiento y 0,72 en test. Qué hipótesis barajas y cómo las ordenas?',
    rubric: [
      'Identifica overfitting como hipótesis principal.',
      'Descarta primero fugas de información y particiones duplicadas.',
      'Revisa si el conjunto de test refleja la distribución real de producción.',
      'Propone validación cruzada y regularización como siguientes pasos.',
    ],
    answer: {
      context: 'Una diferencia tan grande entre entrenamiento y test es el síntoma clásico de overfitting, pero no la única explicación. Una fuga de datos o filas duplicadas entre particiones puede inflar el resultado de entrenamiento. Tambien puede ocurrir que el conjunto de test sea mucho más difícil o simplemente distinto.',
      decision: 'Verificar primero que no haya filas repetidas ni variables que codifiquen la etiqueta. Comparar la distribución decaracterística y de la variable objetivo entre entrenamiento y test. Si todo es correcto, aplicar validación cruzada y ajustar regularización, complejidad o cantidad de datos.',
      tradeoff: 'Corregir una fuga puede hacer que el rendimiento baje mucho, pero ese es el número real. Aumentar la regularización sin revisar la partición puede ocultar el problema original. Un test representativo pero ruidoso puede mostrar peores métricas y no indicar que el modelo sea malo.',
    },
    followups: [
      ' Qué variable delatía una fuga de forma inequívoca en un problema de contratos?',
      'Cómo diseñarías la partición si los datos llegaran ordenados por fecha?',
    ],
    signal: 'Que descarte errores de metodología antes de culpar a la complejidad del modelo.',
  },
  {
    id: 'int-a-003', track: 'ai', category: 'Fundamentos ML',
    q: 'Por qué usar validación cruzada estratificada y cuándo no sería suficiente?',
    rubric: [
      'Mantiene la proporción de clases en cada pliegue.',
      'Reduce la varianza de la estimación del rendimiento.',
      'Cada muestra se usa para entrenar y validar.',
      'No basta con datos temporales o grupos correlacionados si se particiona al azar.',
    ],
    answer: {
      context: 'La validación cruzada divide los datos en varios pliegues y rota cuál se usa para validar, obteniendo una estimación más estable que una sola división. La versión estratificada conserva la proporción de clases en cada pliegue, algo crucial cuando hay clases minoritarias. Así se evita que un pliegue no contenga ningún ejemplo de la clase rara.',
      decision: 'Usar validación cruzada estratificada con datos etiquetados y suficientes por clase. Fijar la semilla para que los resultados sean reproducibles. Cambiar a una división por grupos o por tiempo cuando exista dependencia entre muestras.',
      tradeoff: 'La validación cruzada multiplica el coste de entrenamiento por el número de pliegues. Con clases extremadamente raras puede seguir habiendo pliegues con pocos ejemplos. Si las muestras están correlacionadas, por ejemplo varias filas del mismo contrato, la estratificación no evita la fuga entre pliegues.',
    },
    followups: [
      'Cómo harías la validación con series temporales?',
      'Qué es GroupKFold y cuándo es obligatorio?',
    ],
    signal: 'Que entienda que el esquema de validación debe imitar cómo se usar el modelo en producción.',
  },
  {
    id: 'int-a-004', track: 'ai', category: 'Fundamentos ML',
    q: 'Cuándo preferirías F1 sobre precisión y recall por separado en un clasificador de soporte?',
    rubric: [
      'Precision mide cuántas predicciones positivas son correctas.',
      'Recall mide cuántos positivos reales se detectan.',
      'F1 es la media armónica y penaliza desequilibrios extremos.',
      'La elección depende del coste relativo de falsos positivos y falsos negativos.',
    ],
    answer: {
      context: 'Precisión y recall responden a preguntas distintas y pueden moverse en direcciones opuestas al cambiar el umbral. La precisión importa cuando un falso positivo es caro, y el recall cuando lo es un falso negativo. La media armónica F1 ofrece un único número que castiga cualquiera de los dos extremos.',
      decision: 'Elegir la métrica según el coste de errores en el negocio, no por costumbre. Si el asistente escala a un humano cada falsa alerta, priorizar precisión. Si perderse una consulta urgente es grave, priorizar recall y usar F1 como resumen equilibrado.',
      tradeoff: 'F1 ignora los verdaderos negativos y puede ser engañosa con clases muy desbalanceadas. Un único número facilita la comparación pero oculta el compromiso entre precisión y recall. Fijar el umbral de decisión con base en el coste real suele ser mejor que optimizar F1 de forma ciega.',
    },
    followups: [
      'Cómo elegirías el umbral de clasificación con costs asimétricos?',
      'Qué métrica usarías si solo el uno por ciento de los casos son positivos?',
    ],
    signal: 'Que relacione la métrica con el coste de negocio y sepa que F1 es un resumen, no una verdad.',
  },
  {
    id: 'int-a-005', track: 'ai', category: 'Fundamentos ML',
    q: 'Con un uno por ciento de positivos, por qué ROC-AUC puede ser optimista y qué alternativa usarías?',
    rubric: [
      'ROC incluye los verdaderos negativos, que dominan con desbalanceo extremo.',
      'PR-AUC se centra en la clase positiva y es más informativa.',
      'Un buen ROC-AUC puede acompañar de precisión miserable.',
      'La línea base de PR-AUC es la prevalencia de la clase positiva.',
    ],
    answer: {
      context: 'La curva ROC grafica tasa de verdaderos positivos frente a tasa de falsos positivos sobre todos los negativos. Cuando los negativos son abrumadoramente mayoritarios, un gran aumento de falsos positivos apenas mueve la curva. La curva de precisión y recall, en cambio, se enfoca en qué tan buenas son las predicciones positivas.',
      decision: 'Usar PR-AUC como métrica principal con clases raras y compararla contra la línea base igual a la prevalencia. Mantener ROC-AUC como diagnóstico secundario. Ajustar el umbral a partir de la curva de precisión y recall según el coste de escalar casos.',
      tradeoff: 'PR-AUC puede ser más inestable con pocos positivos y requiere suficientes ejemplos de la clase minoritaria. ROC-AUC sigue siendo útil para comparar ordenación de ranking independientemente del umbral. Ninguna de las dos sustituye evaluar el coste real de los errores en el sistema desplegado.',
    },
    followups: [
      'Qué valor de PR-AUC sería apenas azar con un uno por ciento de positivos?',
      'Cómo se vería un modelo con ROC-AUC alto y precisión baja en producción?',
    ],
    signal: 'Que entienda el efecto de la prevalencia en la interpretación de las métricas.',
  },
  {
    id: 'int-a-006', track: 'ai', category: 'Fundamentos ML',
    q: 'Qué es data leakage y da tres ejemplos concretos que hayas visto o evitarías en un proyecto de contratos.',
    rubric: [
      'Es usar información no disponible en el momento de la predicción.',
      'Ejemplos: normalizar con todas los datos, duplicados entre particiones, variable que contiene la etiqueta.',
      'En contratos, una fecha de resolución puede filtrar el resultado.',
      'La fuga suele detectarse con una caída brusca en producción.',
    ],
    answer: {
      context: 'Una fuga de datos ocurre cuando el entrenamiento recibe información que en producción no estaría disponible. Puede aparecer en el preprocesamiento, en la partición o en variables derivadas del resultado. El efecto es un rendimiento de validación inflado que luego desaparece en el mundo real.',
      decision: 'Ajustar escaladores y codificadores solo con el conjunto de entrenamiento dentro de cada pliegue. Agrupar filas que pertenecen al mismo contrato para que no se separen entre particiones. Revisar columnas como fechas de cierre o códigos de resolución que solo existen después del evento.',
      tradeoff: 'Eliminar variables sospechosas puede reducir el rendimiento de validación, pero ese es el rendimiento honesto. Detectar fugas requiere conocer el proceso de generación de datos, algo que no siempre está documentado. Una fuga sutil puede permanecer oculta hasta que el modelo se despliega y falla.',
    },
    followups: [
      'Por qué normalizar antes de dividir los datos ya es una fuga?',
      'Cómo revisarías un pipeline para detectar variables calculadas con el futuro?',
    ],
    signal: 'Que piense en el momento de la inferencia y no solo en correlaciones estadísticas.',
  },
  {
    id: 'int-a-007', track: 'ai', category: 'Fundamentos ML',
    q: 'Qué papel juega la tasa de aprendizaje y qué síntomas indican que está mal elegida?',
    rubric: [
      'Controla el tamaño del paso en la dirección del gradiente.',
      'Demasiado alta provoca oscilación o divergencia de la pérdida.',
      'Demasiado baja produce convergencia lenta o estancamiento.',
      'Propone programar la tasa o usar búsqueda de la tasa óptima.',
    ],
    answer: {
      context: 'El descenso de gradiente actualiza los parámetros restando la tasa de aprendizaje multiplicada por el gradiente. Es probablemente el hiperparámetro más influyente y su valor adecuado depende de la escala de los datos y de la arquitectura. Una mala elección se manifiesta en la curva de pérdida.',
      decision: 'Observar la pérdida durante las primeras iteraciones y ajustar si oscila o no baja. Empezar con una búsqueda de tasa en un rango amplio y elegir un valor algo por debajo del punto de divergencia. Usar una programación que reduzca la tasa al avanzar el entrenamiento.',
      tradeoff: 'Una tasa alta acelera al principio pero puede impedir convergir a un mínimo fino. Una tasa baja necesita más épocas y puede quedarse en mínimos locales o mesetas. Los optimizadores adaptativos reducen la sensibilidad pero no eliminan la necesidad de elegir un valor inicial razonable.',
    },
    followups: [
      'Qué patrones en la curva de pérdida indican divergencia?',
      'Cómo interactúan la tasa de aprendizaje y el tamaño del lote?',
    ],
    signal: 'Que lea las curvas de entrenamiento en lugar de copiar un valor por defecto.',
  },
  {
    id: 'int-a-008', track: 'ai', category: 'Fundamentos ML',
    q: 'Diferencia descenso de gradiente por lotes, estocástico y de minilotes, y por qué el de minilotes es el estándar.',
    rubric: [
      'Por lotes usa todos los datos en cada paso y es costoso.',
      'Estocástico usa una muestra y es ruidoso pero rápido.',
      'El de minilotes equilibra coste y estabilidad del gradiente.',
      'El tamaño del lote afecta a la generalizes y al número de pasos por época.',
    ],
    answer: {
      context: 'La diferencia está en cuántas muestras se usan para estimar el gradiente en cada actualización. Usar todos los datos da una dirección precisa pero impide entrenar con datasets grandes. Usar una sola muestra es rápido y ruidoso, y los minilotes son un punto medio ampliamente adoptado.',
      decision: 'Elegir un tamaño de lote que quepa en memoria y permita suficientes actualizaciones por época. Ajustar la tasa de aprendizaje al cambiar el tamaño del lote, ya que el ruido del gradiente cambia. Batchear los datos de forma aleatoria para evitar sesgos de orden.',
      tradeoff: 'Lotes grandes aprovechan mejor el hardware pero dan menos actualizaciones y pueden generalizar peor. Lotes pequeños añaden ruido que puede actuar como regularizador pero hacen el entrenamiento más inestable. El tamaño óptimo depende del modelo, del optimizador y del presupuesto computacional.',
    },
    followups: [
      'Por qué aumentar el tamaño del lote a veces exige aumentar la tasa de aprendizaje?',
      'Cómo afecta un lote desbalanceado al gradiente de una clase rara?',
    ],
    signal: 'Que entienda el tamaño de lote como una decisión con consecuencias de optimización.',
  },
  {
    id: 'int-a-009', track: 'ai', category: 'Fundamentos ML',
    q: 'Cuándo normalizar y cuándo estandarizar variables, y por qué importa en modelos regularizados?',
    rubric: [
      'Normalizar escala al rango cero uno y estandarizar a media cero y desviación uno.',
      'La estandarización es menos sensible a valores atípicos extremos.',
      'Modelos con penalización y descenso de gradiente son sensibles a la escala.',
      'Árboles de decisión no necesitan este escalado.',
    ],
    answer: {
      context: 'Escalar variables evita que una con magnitud grande domine la función de pérdida o la penalización. La normalización comprime al rango entre cero y uno, mientras que la estandarización centra y divide por la desviación. La elección depende de la distribución y de la presencia de valores atípicos.',
      decision: 'Estandarizar por defecto en modelos lineales, redes neuronales y métodos con regularización. Usar normalización cuando se conozca un rango acotado y no haya outliers. Ajustar los parámetros de escalado solo con entrenamiento y aplicarlos después a validación y test.',
      tradeoff: 'La normalización se deforma mucho si aparece un valor atípico en test. La estandarización no acota la variable y puede dar valores lejanos al rango visto. Los modelos basados en árboles son invariantes a escalas monótonas, así que escalar no mejora su rendimiento.',
    },
    followups: [
      'Qué ocurre si aplicas la media y desviación calculadas sobre todo el dataset?',
      'Cómo manejar un outlier que solo aparece en producción?',
    ],
    signal: 'Que sepa que el escalado es parte del pipeline y debe ajustarse sin mirar el test.',
  },
  {
    id: 'int-a-010', track: 'ai', category: 'Fundamentos ML',
    q: 'Cómo codificarías variables categóricas de alta cardinalidad, como el identificador de proveedor en contratos?',
    rubric: [
      'One-hot explode la dimensión con alta cardinalidad.',
      'Target encoding puede ayudar pero exige evitar fuga con validación anidada.',
      'Embeddings aprendidos son una opción con suficientes datos.',
      'Agrupar categorías raras en un valor otro es una línea base sensata.',
    ],
    answer: {
      context: 'Las variables categóricas con cientos de valores distintos plantean un problema de dimensionalidad y de escasez de ejemplos por categoría. One-hot es simple pero produce matrices dispersas enormes. Existen alternativas como codificación por objetivo o embeddings que aprenden representaciones compactas.',
      decision: 'Empezar agrupando las categorías muy raras en una categoría genérica y probar one-hot si el número es manejable. Si la cardinalidad es alta, usar codificación por objetivo con validación anidada para no filtrar la etiqueta. Con datos suficientes y un modelo neuronales, probar embeddings aprendidos.',
      tradeoff: 'Agrupar categorías pierde información que puede ser predictor. La codificación por objetivo es propensa a fugas y a sobreajustar categorías con pocas muestras. Los embeddings necesitan muchos datos y añaden parámetros, además de dificultar la interpretación.',
    },
    followups: [
      'Cómo implementarías target encoding sin filtrar la etiqueta?',
      'Qué harías con una categoría nueva que no apareció en entrenamiento?',
    ],
    signal: 'Que conozca el riesgo de fuga y proponga una línea base antes de soluciones complejas.',
  },
  {
    id: 'int-a-011', track: 'ai', category: 'Fundamentos ML',
    q: 'Cuándo elegirías un modelo lineal regularizado frente a un árbol potenciado para un problema tabular?',
    rubric: [
      'Los modelos lineales son rápidos, interpretables y buenos con pocos datos.',
      'Los árboles potenciados capturan interacciones no lineales.',
      'El número de muestras y de características inclina la decisión.',
      'La necesidad de explicación puede dominar sobre el rendimiento.',
    ],
    answer: {
      context: 'Los modelos lineales con regularización son eficientes y fáciles de explicar, pero asumen una relación aditiva entre variables. Los árboles potenciados capturan interacciones y no linealidades con menos ingeniería de variables. En datos tabulares suelen ser muy competitivos cuando hay muestras suficientes.',
      decision: 'Empezar con una regresión logística o lineal regularizada como línea base interpretable. Pasar a gradient boosting si quedan patrones no lineales y hay datos para capturarlos. Comparar siempre con validación cruzada y elegir según rendimiento y requisitos de explicabilidad.',
      tradeoff: 'Un modelo lineal puede ser insuficiente en problemas con interacciones fuertes. El boosting es más sensible a hiperparámetros y puede sobreajustar con datos escasos. La interpretabilidad de un modelo lineal no es automática si las variables están correlacionadas o se han transformado mucho.',
    },
    followups: [
      'Cómo detectarías que un modelo lineal está dejando interacciones sin capturar?',
      'Qué ventaja tiene una línea base simple en un proyecto con plazos cortos?',
    ],
    signal: 'Que valore la línea base y justifique la complejidad adicional con evidencia.',
  },
  {
    id: 'int-a-012', track: 'ai', category: 'Fundamentos ML',
    q: 'Explica la diferencia entre bagging y boosting y qué problema resuelve cada uno.',
    rubric: [
      'Bagging entrena modelos en paralelo con muestras remuestreadas y promedia.',
      'Boosting entrena secuencialmente, centrándose en los errores anteriores.',
      'Bagging reduce varianza y boosting reduce sesgo.',
      'Random forest y AdaBoost o gradient boosting son ejemplos típicos.',
    ],
    answer: {
      context: 'Ambos son métodos de ensamblado, pero atacan errores distintos. El bagging entrena varios modelos sobre subconjuntos bootstrap y combina sus predicciones, lo que reduce la varianza. El boosting entrena modelos débiles de forma secuencial, dando más peso a los ejemplos mal clasificados, y reduce el sesgo.',
      decision: 'Usar bagging con modelos inestables de alta varianza, como árboles profundos. Usar boosting con modelos débiles de alto sesgo cuando busques precisión y tengas datos limpios. Ajustar la tasa de aprendizaje y el número de estimadores en boosting para controlar el sobreajuste.',
      tradeoff: 'El boosting es más sensible a etiquetas ruidosas porque insiste en los errores, que pueden ser ruido. El bagging es fácil de paralelizar y robusto, pero puede no reducir el sesgo de modelos demasiado simples. Los ensambles son más costosos de entrenar y de explicar que un modelo único.',
    },
    followups: [
      'Por qué el boosting puede sobreajustar datos con etiquetas incorrectas?',
      'Cómo se reparte el trabajo entre modelos en random forest?',
    ],
    signal: 'Que asocie cada técnica con sesgo o varianza y conozca ejemplos concretos.',
  },
  {
    id: 'int-a-013', track: 'ai', category: 'Fundamentos ML',
    q: 'Qué hiperparámetros de un gradient boosting ajustarías primero y en qué orden?',
    rubric: [
      'Número de árboles y tasa de aprendizaje son los primeros candidatos.',
      'Profundidad y número mínimo de muestras por hoja controlan complejidad.',
      'Regularización y muestreo de columnas ayudan con sobreajuste.',
      'La búsqueda debe ser aleatoria o bayesiana antes que exhaustiva.',
    ],
    answer: {
      context: 'Los árboles potenciados tienen muchos hiperparámetros que interactúan, y ajustarlos uno por uno es ineficiente. La tasa de aprendizaje y el número de estimadores determinan cuánto se avanza y cuándo parar. La profundidad y el mínimo por hoja controlan la complejidad de cada árbol.',
      decision: 'Fijar una tasa de aprendizaje moderada y buscar el número óptimo de árboles con parada temprana. Ajustar después profundidad y muestras mínimas por hoja. Probar por último regularización y fracciones de muestreo, usando búsqueda aleatoria o bayesiana con validación cruzada.',
      tradeoff: 'Una tasa muy baja exige muchos árboles y alarga el entrenamiento. Árboles muy profundos capturan interacciones pero sobreajustan y son lentos. Una búsqueda exhaustiva consume mucho tiempo y rara vez compensa frente a una búsqueda aleatoria bien acotada.',
    },
    followups: [
      'Qué es la parada temprana y qué métrica usarías para activarla?',
      'Cómo evitar que la búsqueda de hiperparámetros filtre información del test?',
    ],
    signal: 'Que proponga un orden justificado y una estrategia de búsqueda eficiente.',
  },
  {
    id: 'int-a-014', track: 'ai', category: 'Fundamentos ML',
    q: 'Qué es un SVM con kernel y cuándo elegirías un kernel lineal frente a uno radial?',
    rubric: [
      'Busca un hiperplano que maximice el margen entre clases.',
      'El kernel permite trabajar en un espacio de características implícito de mayor dimensión.',
      'El lineal es rápido y suficiente si los datos son separables en el espacio original.',
      'El radial añade flexibilidad pero requiere ajustar gamma y regularización.',
    ],
    answer: {
      context: 'Un SVM maximiza la distancia entre el hiperplano de decisión y las muestras más cercanas, llamadas vectores de soporte. Cuando las clases no son separables linealmente, un kernel proyecta implícitamente los datos a un espacio de mayor dimensión. El kernel radial es flexible y muy usado, pero más costoso.',
      decision: 'Probar primero un kernel lineal, especialmente con muchas características o texto. Pasar al radial si la validación muestra que faltan no linealidades. Ajustar la regularización y el parámetro gamma con validación cruzada, escalando antes las variables.',
      tradeoff: 'El kernel radial puede sobreajustar si gamma es grande y es lento con muchos datos. El lineal es rápido e interpretable pero incapaz de capturar fronteras complejas. Los SVM no entregan probabilidades calibradas sin un paso adicional de calibración.',
    },
    followups: [
      'Qué efecto tiene un gamma muy alto en un SVM radial?',
      'Cómo obtendrías probabilidades calibradas de un SVM?',
    ],
    signal: 'Que entienda el margen y el papel del kernel, no solo el nombre de los parámetros.',
  },
  {
    id: 'int-a-015', track: 'ai', category: 'Fundamentos ML',
    q: 'Cómo elegirías el número de clústeres en k-means y qué limitaciones tiene el método?',
    rubric: [
      'El codo de la inercia y la silueta son criterios habituales.',
      'La inercia siempre baja al aumentar k, así que hay que buscar punto de rendimiento decreciente.',
      'K-means asume clústeres aproximadamente esféricos y de tamaño similar.',
      'Es sensible a la inicialización y a valores atípicos.',
    ],
    answer: {
      context: 'K-means minimiza la suma de distancias al centroide de cada clúster, pero esa cantidad mejora monotonamente al aumentar el número de clústeres. Por eso se usan diagnósticos como el codo de la inercia o el coeficiente de silueta. El método también impone supuestos geométricos fuertes sobre la forma de los grupos.',
      decision: 'Evaluar varios valores de k con el codo y la silueta, y elegir uno que además tenga sentido para el negocio. Ejecutar múltiples inicializaciones y quedarse con la mejor inercia. Escalar las variables y revisar la influencia de outliers antes de clustering.',
      tradeoff: 'La silueta favorece clústeres convexos y puede ser engañosa con formas alargadas. Elegir k solo por una métrica puede dar grupos que no signifiquen nada para el usuario. K-means no maneja bien variables categóricas ni densidades muy desiguales.',
    },
    followups: [
      'Qué alternativa usarías para clústeres de forma irregular?',
      'Cómo interpretarías un valor de silueta bajo para todos los k?',
    ],
    signal: 'Que combine diagnóstico cuantitativo con criterio de dominio.',
  },
  {
    id: 'int-a-016', track: 'ai', category: 'Fundamentos ML',
    q: 'Para qué sirve PCA y qué precauciones tomarías al usarlo antes de un modelo supervisado?',
    rubric: [
      'Reduce dimensionalidad proyectando en direcciones de máxima varianza.',
      'Las componentes son combinaciones lineales y podem ser difíciles de interpretar.',
      'Debe ajustarse solo con entrenamiento para evitar fuga.',
      'La varianza no garantiza que las componentes sean útiles para la etiqueta.',
    ],
    answer: {
      context: 'PCA encuentra direcciones ortogonales que capturan la mayor varianza de los datos y permite representarlos con menos dimensiones. Es útil para comprimir, visualizar o reducir ruido y coste computacional. Sin embargo, maximizar varianza no es lo mismo que maximizar información sobre la variable objetivo.',
      decision: 'Estandarizar las variables y ajustar PCA solo sobre el conjunto de entrenamiento. Elegir el número de componentes con validación cruzada o con un criterio de varianza explicada. Verificar que la reducción no empeore el rendimiento del modelo supervisor.',
      tradeoff: 'PCA es lineal y puede perder estructura importante en datos no lineales. Las componentes resultantes dificultan la explicación de predicciones. En datos con escalas muy distintas, no estandarizar antes hace que la variable de mayor magnitud domine la proyección.',
    },
    followups: [
      'Qué diferencia hay entre PCA y una autoencoder para reducción de dimensionalidad?',
      'Por qué la componente de mayor varianza puede ser inútil para clasificar?',
    ],
    signal: 'Que sepa que la reducción debe validarse con la tarea final, no por sí misma.',
  },
  {
    id: 'int-a-017', track: 'ai', category: 'Fundamentos ML',
    q: 'En qué se basa Naive Bayes y por qué funciona aunque su supuesto de independencia sea falso?',
    rubric: [
      'Aplica el teorema de Bayes suponiendo independencia condicional entre características.',
      'Es muy rápido y necesita pocos datos.',
      'Suele dar buenas clasificaciones aunque las probabilidades estén mal calibradas.',
      'Es sensible a categorías no vistas, mitigable con suavizado.',
    ],
    answer: {
      context: 'Naive Bayes calcula la probabilidad de cada clase multiplicando las probabilidades individuales de las características dado el supuesto de independencia. Ese supuesto casi nunca se cumple, especialmente en texto donde las palabras están correlacionadas. Aun así, suele acertar la clase con mayor probabilidad porque el orden de las clases es relativamente robusto.',
      decision: 'Usarlo como línea base rápida en clasificación de texto o cuando haya pocos datos. Aplicar suavizado Laplace para que una palabra nunca vista no anule toda la probabilidad. Comprobar la calibración si las probabilidades se van a usar para tomar decisiones con umbrales.',
      tradeoff: 'Las probabilidades suelen estar sobreconfiadas y no son fiables como tales. Las caracteristicas correlacionadas pueden contar dos veces la misma evidencia. Es un modelo difícil de mejorar con más datos, porque su forma está muy restringida por el supuesto de independencia.',
    },
    followups: [
      'Qué es el suavizado Laplace y qué problema resuelve?',
      'Por qué es habitual en filtrado de spam pese a su simplicidad?',
    ],
    signal: 'Que distinga buen ranking de buenas probabilidades, una distinción importante.',
  },
  {
    id: 'int-a-018', track: 'ai', category: 'Fundamentos ML',
    q: 'Cómo diseñarías una búsqueda de hiperparámetros con presupuesto computacional limitado?',
    rubric: [
      'La búsqueda aleatoria suele ser más eficiente que la exhaustiva.',
      'La búsqueda bayesiana usa resultados previos para elegir el siguiente punto.',
      'La parada temprana descarta configuraciones pobres rápidamente.',
      'Hay que reservar un conjunto de test intacto para la evaluación final.',
    ],
    answer: {
      context: 'Probar todas las combinaciones de hiperparámetros crece exponencialmente y desperdicia esfuerzo en regiones malas. La búsqueda aleatoria explora mejor con el mismo número de intentos, y los métodos bayesianos concentran esfuerzo donde hay más promesa. La parada temprana permite abandonar configuraciones que van mal.',
      decision: 'Definir rangos amplios pero razonables y ejecutar búsqueda aleatoria o bayesiana con un presupuesto fijo de intentos. Usar validación cruzada y parada temprana para reducir el coste por configuración. No tocar el conjunto de test hasta seleccionar la configuración final.',
      tradeoff: 'La búsqueda bayesiana añade complejidad y puede explorar poco al principio si el modelo auxiliar es malo. La parada temprana puede descartar configuraciones que mejoran tarde. Repetir la búsqueda en distintas semillas aumenta la robustez pero multiplica el coste.',
    },
    followups: [
      'Cómo evitar que la búsqueda sobreajuste el conjunto de validación?',
      'Qué ventaja ofrece Hyperband frente a una búsqueda plana?',
    ],
    signal: 'Que respete el presupuesto y mantenga el test intacto, señal de disciplina experimental.',
  },
  {
    id: 'int-a-019', track: 'ai', category: 'Fundamentos ML',
    q: 'Cómo abordarías un problema de clasificación con diez clases y un modelo que solo produce salida binaria?',
    rubric: [
      'One-versus-rest entrena un clasificador por clase.',
      'One-versus-one entrena un clasificador por par de clases.',
      'Muchos modelos ya soportan multiclase con softmax de forma nativa.',
      'El desbalanceo y la calibración entre clasificadores afectan a la decisión final.',
    ],
    answer: {
      context: 'Cuando el modelo base es binario hay que descomponer el problema multiclase. La estrategia uno contra todos entrena un clasificador por clase contra el resto, mientras que uno contra uno entrena para cada par. Muchas librerías lo hacen automáticamente, pero conviene saber qué está ocurriendo.',
      decision: 'Preferir la salida softmax nativa cuando el modelo la ofrezca. Si no, usar uno contra todos con diez clasificadores y elegir la clase con mayor puntuación. Verificar que las puntuaciones sean comparables entre clasificadores antes de fiarse del argmax.',
      tradeoff: 'Uno contra todos entrena pocos modelos pero puede sufrir desbalanceo severo, porque cada clase es minoritaria. Uno contra uno entrena muchos modelos y la votación puede empatar. Las puntuaciones de clasificadores distintos no siempre están calibradas entre sí, lo que sesga la decisión final.',
    },
    followups: [
      'Cuál estrategia es mejor con clases muy desbalanceadas?',
      'Cómo convertirías las puntuaciones en probabilidades comparables?',
    ],
    signal: 'Que conozca la mecánica y el problema de calibración entre clasificadores.',
  },
  {
    id: 'int-a-020', track: 'ai', category: 'Fundamentos ML',
    q: 'Un stakeholders pregunta por qué el modelo denegó un contrato. Cómo darías una explicación honesta y útil?',
    rubric: [
      'Diferenciar explicabilidad global de explicación local de una predicción.',
      'Usar importance o valores SHAP como aproximación, no como verdad causal.',
      'Advertir que la correlación no implica causalidad.',
      'Ofrecer una explicación comprensible y qué variables se pueden cambiar.',
    ],
    answer: {
      context: 'Una explicación de una decisión individual debe identificar qué variables empujaron la predicción en un sentido, pero las técnicas habituales son aproximaciones del comportamiento del modelo. Los valores SHAP o la importancia de características muestran asociación, no causalidad. Es importante no presentarlos como una justificación definitiva.',
      decision: 'Combinar una explicación local de la instancia con una descripción global del modelo. Indicar las variables que más influyeron y en qué dirección, usando lenguaje comprensible. Añadir la advertencia de que son correlaciones y señalar qué datos podría revisar el afectado.',
      tradeoff: 'Una explicación fiel pero técnica puede ser inútil para quien la recibe. Una explicación simplificada puede dar una falsa sensación de certeza. Las técnicas post hoc pueden ser engañosas si el modelo tiene interacciones complejas o si las variables están correlacionadas.',
    },
    followups: [
      'Por qué SHAP no establece causalidad?',
      'Cómo cambiaría la respuesta si el modelo fuera un árbol simple y interpretable?',
    ],
    signal: 'Que sea honesto sobre las limitaciones de la interpretabilidad post hoc.',
  },

  // ---------- IA: Deep learning (15) ----------
  {
    id: 'int-a-021', track: 'ai', category: 'Deep learning',
    q: 'Describe intuitivamente cómo funciona la retropropagación y qué problema resuelve.',
    rubric: [
      'Propaga la pérdida hacia atrás usando la regla de la cadena.',
      'Calcula el gradiente de la pérdida respecto a cada parámetro.',
      'Reutiliza resultados intermedios para evitar recalcular derivadas.',
      'Los gradientes alimentan al optimizador para actualizar pesos.',
    ],
    answer: {
      context: 'La red compute una salida a partir de los parámetros y una función de pérdida mide el error. La retropropagación aplica la regla de la cadena capa por capa, desde la salida hacia atrás, para obtener cuánto contribuye cada parámetro al error. Es la forma eficiente de calcular todos esos gradientes a la vez.',
      decision: 'Interpretar la retropropagación como el cálculo de gradientes y separarla conceptualmente del optimizador, que decide cómo usarlos. Al depurar, revisar primero que la pérdida baje en un lote pequeño. Verificar los gradientes numéricamente cuando escribas una capa nueva.',
      tradeoff: 'La retropropagación supone operaciones diferenciables y puede fallar con operaciones no suaves. Los gradientes pueden desvanecerse o explotar en redes profundas. El costeMemory de guardar activaciones intermedias crece con el tamaño del modelo.',
    },
    followups: [
      'Qué es la comprobación de gradientes y cuándo usarla?',
      'Por qué hay que guardar las activaciones forward durante la retropropagación?',
    ],
    signal: 'Que entienda la regla de la cadena y la separación entre calcular gradientes y actualizar.',
  },
  {
    id: 'int-a-022', track: 'ai', category: 'Deep learning',
    q: 'Por qué ReLU desplazó a sigmoid en capas ocultas y qué problema introduce?',
    rubric: [
      'ReLU es barata y no satura en valores positivos.',
      'Sigmoid satura y puede hacer que los gradientes desaparezcan.',
      'ReLU produce neuronas muertas con entrada negativa sostenida.',
      'Existen variantes como Leaky ReLU o GELU para mitigar el problema.',
    ],
    answer: {
      context: 'La función sigmoid comprime cualquier entrada a un rango estrecho y satura en los extremos, donde el gradiente es casi cero. ReLU es lineal para valores positivos y se anula para negativos, lo que acelera el entrenamiento y evita parte de la saturación. Se convirtió en la elección por defecto en redes profundas.',
      decision: 'Usar ReLU o sus variantes en capas ocultas y reservar sigmoid para probabilidades binarias en la salida. Si observas muchas neuronas inactivas, probar Leaky ReLU o GELU. Mantener una inicialización adecuada para evitar que muchas unidades queden en la región negativa desde el inicio.',
      tradeoff: 'Una neurona ReLU muerta deja de contribuir y no se recupera con el gradiente. Las variantes suavizan esto pero pueden rendir peor en ciertas tareas. En la capa de salida, ReLU no es adecuada si necesitas probabilidades acotadas.',
    },
    followups: [
      'Cómo detectarías neuronas muertas en una capa ReLU?',
      'Qué función de activación usarías en la salida para regresión de valores positivos?',
    ],
    signal: 'Que conozca la razón histórica y el efecto secundario, no solo el nombre.',
  },
  {
    id: 'int-a-023', track: 'ai', category: 'Deep learning',
    q: 'Por qué importa la inicialización de los pesos en una red profunda?',
    rubric: [
      'Una inicialización pobre puede hacer que las activaciones o los gradientes desaparezcan o exploten.',
      'Xavier es adecuada para sigmoid o tanh y He para ReLU.',
      'Inicializar todo a cero rompe la simetría entre neuronas.',
      'Permite entrenar mas rápido y con mayor estabilidad.',
    ],
    answer: {
      context: 'Si los pesos son demasiado pequeños, las señales se reducen capa tras capa y los gradientes se desvanecen. Si son demasiado grandes, las activaciones crecen y los gradientes explotan. Inicializar todas las neuronas igual además impide que aprendan cosas distintas.',
      decision: 'Elegir una inicialización acorde a la activación, como Xavier para tanh y He para ReLU. Mantener la varianza de las activaciones aproximadamente constante entre capas. Verificar las distribuciones de activaciones y gradientes al comenzar el entrenamiento.',
      tradeoff: 'Una inicialización teóricamente correcta no garantiza que el optimizador funcione con cualquier tasa de aprendizaje. En redes residuales y con normalización, la sensibilidad a la inicialización es menor. Inicializar desde un checkpoint preentrenado suele ser mejor que cualquier esquema desde cero.',
    },
    followups: [
      'Qué síntomas delatan una inicialización con gradientes explosivos?',
      'Por qué es malo inicializar todos los pesos a cero?',
    ],
    signal: 'Que relacione inicialización con estabilidad del entrenamiento.',
  },
  {
    id: 'int-a-024', track: 'ai', category: 'Deep learning',
    q: 'Diferencia batch normalization y layer normalization y cuándo usar cada una.',
    rubric: [
      'Batch norm normaliza sobre el lote y usa estadísticas que se acumulan en inferencia.',
      'Layer norm normaliza sobre las características de cada muestra.',
      'Batch norm depende del tamaño de lote y es problemática en lotes pequeños.',
      'Layer norm es habitual en transformers y en modelos secuenciales.',
    ],
    answer: {
      context: 'Ambas normalizan activaciones para estabilizar el entrenamiento, pero lo hacen sobre ejes distintos. Batch normalization calcula media y varianza sobre el lote y mantiene estadísticas móviles para inferencia. Layer normalization lo hace por muestra, por lo que no depende de cuántas muestras haya en el lote.',
      decision: 'Usar batch normalization en redes convolucionales con lotes grandes y relativamente homogéneos. Usar layer normalization en transformers o cuando el tamaño de lote sea pequeño o variable. Tener cuidado con la fuga de información entre muestras si el lote está mal construido.',
      tradeoff: 'Batch normalization puede rendir mal con lotes pequeños o distribuciones cambiantes, y complica la inferencia en streaming. Layer normalization es más predecible pero no tiene el efecto regularizador del ruido del lote. En modelos grandes, la elección también está limitada por la implementación eficiente disponible.',
    },
    followups: [
      'Por qué batch normalization se comporta distinto en entrenamiento y en inferencia?',
      'Qué problema aparece al usar batch normalization con lotes de una sola muestra?',
    ],
    signal: 'Que entienda que el eje de normalización determina el comportamiento.',
  },
  {
    id: 'int-a-025', track: 'ai', category: 'Deep learning',
    q: 'Cómo funciona dropout y por qué suele desactivarse durante la inferencia?',
    rubric: [
      'Desactiva neuronas aleatoriamente durante el entrenamiento.',
      'Fuerza a la red a no depender de unidades concretas.',
      'En inferencia se usan todas las unidades y se ajusta la escala.',
      'Es una forma de regularización que reduce sobreajuste.',
    ],
    answer: {
      context: 'Dropout elimina aleatoriamente unidades durante cada paso de entrenamiento, de modo que la red no puede confiar en neuronas específicas. Esto actúa como una forma de ensamblado implícito y reduce la coadaptación. During la inferencia se usan todas las unidades para no introducir ruido en la predicción.',
      decision: 'Aplicar dropout solo en capas donde se haya observado sobreajuste y con una tasa moderada. Asegurarse de que el framework escale correctamente las activaciones en inferencia. No usarlo en la capa de salida ni en modelos pequeños donde pueda dañar más de lo que ayuda.',
      tradeoff: 'Una tasa alta de dropout subentrena el modelo y alarga la convergencia. Con lotes pequeños o tareas delicadas puede añadir demasiado ruido. Las redes con normalización y mucho datos a veces no se benefician apenas de dropout.',
    },
    followups: [
      'Qué es inverted dropout y por qué se usa en las implementaciones modernas?',
      'Cómo afecta dropout a la calibración de las probabilidades?',
    ],
    signal: 'Que sepa que es regularización y que entrenamiento e inferencia difieren.',
  },
  {
    id: 'int-a-026', track: 'ai', category: 'Deep learning',
    q: 'Qué parámetros tiene una capa convolucional y cómo afectan padding y stride al tamaño de salida?',
    rubric: [
      'Los parámetros son los pesos del kernel más un sesgo por filtro.',
      'El número de parámetros no depende del tamaño de la imagen de entrada.',
      'Padding conserva dimensiones espaciales y stride las reduce.',
      'La profundidad de salida es el número de filtros.',
    ],
    answer: {
      context: 'Una convolución aplica un pequeño kernel que se desliza sobre la imagen y comparte pesos en todas las posiciones. Por eso el número de parámetros depende del tamaño del kernel y del número de filtros, no de la resolución de entrada. El padding añade ceros en los bordes y el stride controla el paso del kernel.',
      decision: 'Calcular la salida con la fórmula que incluye padding y stride para dimensionar la red. Usar padding para no perder resolución en las primeras capas. Aumentar el stride o añadir pooling para reducir el tamaño y el costeComputacional.',
      tradeoff: 'El padding introduce valores artificiales en los bordes que pueden crear artefactos. Un stride grande pierde información espacial con poco coste de cómputo. Compartir pesos reduce muchísimo los parámetros pero limita la capacidad de modelar posiciones absolutas.',
    },
    followups: [
      'Cómo calcular el campo receptivo de una capa profunda?',
      'Qué ventaja tiene la convolución sobre una capa fully connected en imágenes?',
    ],
    signal: 'Que entienda el uso compartido de pesos y sepa calcular dimensiones.',
  },
  {
    id: 'int-a-027', track: 'ai', category: 'Deep learning',
    q: 'Para qué sirve el pooling en una CNN y qué alternativas has visto para reemplazarlo?',
    rubric: [
      'Reduce dimensiones espaciales y coste computacional.',
      'Aporta invarianza local a pequeños desplazamientos.',
      'Max pooling descarta información de posición y puede perder detalles finos.',
      'Convoluciones con stride o atención son alternativas habituales.',
    ],
    answer: {
      context: 'El pooling agrega regiones locales en un único valor, reduciendo el tamaño de los mapas de características. Ayuda a controlar el cómputo y a obtener cierta invarianza a traslaciones pequeñas. Max pooling es rápido pero descarta información que en algunas tareas puede ser relevante.',
      decision: 'Usar pooling cuando necesites reducir resolución y la información fina no sea crítica. Probar convoluciones con stride como alternativa aprendible. En tareas de detección o segmentación, revisar si el pooling elimina detalles necesarios para localizar objetos pequeños.',
      tradeoff: 'El pooling es fijo y no aprende qué información conservar. Puede destruir información posicional importante para tareas de localización. Las alternativas aprendibles son más flexibles pero aumentan parámetros y coste.',
    },
    followups: [
      'Por qué average pooling puede ser mejor que max pooling en algunas tareas?',
      'Cómo afecta el pooling a la precisión de la segmentación de bordes?',
    ],
    signal: 'Que vea el pooling como una decisión de arquitectura con coste de información.',
  },
  {
    id: 'int-a-028', track: 'ai', category: 'Deep learning',
    q: 'Qué problema resuelve una LSTM frente a una RNN simple y qué limitaciones le quedan?',
    rubric: [
      'Las RNN simples sufren desvanecimiento de gradientes en secuencias largas.',
      'La LSTM usa compuertas para controlar qué información se recuerda y se olvida.',
      'Mantiene un estado de memoria separado de la salida.',
      'Sigue siendo secuencial y difícil de paralelizar, y fue superada por transformers.',
    ],
    answer: {
      context: 'Una RNN simple propaga un estado oculto paso a paso y tiene dificultades para retener información lejana porque los gradientes se desvanecen. La LSTM introduce compuertas de olvido, entrada y salida que regulan el flujo de información. Esto permite mantener dependencias mucho más largas.',
      decision: 'Usar LSTM o GRU cuando trabajes con secuencias moderadas y no puedas costear un transformer. Elegir GRU si quieres menos parámetros y entrenamiento más rápido. Para secuencias muy largas o mucho datos, considerar arquitecturas basadas en atención.',
      tradeoff: 'Las LSTM son secuenciales y no aprovechan bien el paralelismo de las GPUs. Siguen teniendo dificultades con dependencias muy largas y con datos masivos. Los transformers las han desplazado en muchas tareas, aunque las recurrente siguen siendo útiles en contextos con recursos limitados.',
    },
    followups: [
      'Qué diferencia hay entre una LSTM y una GRU?',
      'Por qué son difíciles de paralelizar las RNN?',
    ],
    signal: 'Que conozca el problema del gradiente y la solución con compuertas.',
  },
  {
    id: 'int-a-029', track: 'ai', category: 'Deep learning',
    q: 'Explica intuitivamente el mecanismo de atención y qué ventaja aporta sobre una RNN.',
    rubric: [
      'Calcula pesos de relevancia entre elementos de la secuencia.',
      'Permite que cada posición acceda directamente a cualquier otra posición.',
      'Evita comprimir toda la información en un único estado oculto.',
      'El coste crece cuadráticamente con la longitud de la secuencia.',
    ],
    answer: {
      context: 'La atención calcula, para cada elemento de una secuencia, cuánto debe fijarse en cada uno de los demás. En lugar de comprimir todo el pasado en un estado único, la red puede acceder directamente a la información relevante. Esto acorta los caminos de gradiente y facilita dependencias largas.',
      decision: 'Usar atención cuando la relación entre posiciones lejanas sea importante, como en traducción o resumen. Interpretar los pesos como una ayuda diagnóstica, no como una explicación definitiva. Tener en cuenta el coste cuadrático al trabajar con secuencias muy largas.',
      tradeoff: 'La atención completa es costosa en memoria y cómputo cuando la secuencia crece. Los pesos de atención no siempre corresponden a causalidad o importancia real. Existen variantes eficientes que reducen el coste pero pueden perder parte de la expresividad.',
    },
    followups: [
      'Qué es la atención causal y dónde es obligatoria?',
      'Cómo reduce el coste la atención de ventana deslizante?',
    ],
    signal: 'Que entienda el acceso directo a cualquier posición y su coste.',
  },
  {
    id: 'int-a-030', track: 'ai', category: 'Deep learning',
    q: 'Por qué el transformer escala mal con contextos muy largos y qué soluciones conoces?',
    rubric: [
      'La atención completa calcula una matriz de tamaño n por n.',
      'El coste de memoria y cómputo crece cuadráticamente con la longitud.',
      'El caché de clave y valor también crece con la longitud generada.',
      'Soluciones: atención dispersa, ventana deslizante, RoPE y compresión de contexto.',
    ],
    answer: {
      context: 'En la atención estándar cada token se compara con todos los demás, lo que produce una matriz de tamaño cuadrado respecto a la longitud del contexto. Además, durante la generación se mantiene un caché de claves y valores que crece con cada token producido. Esto limita la longitud práctica y encarece la inferencia.',
      decision: 'Medir el coste real de memoria antes de ampliar la ventana de contexto. Usar variantes de atención eficiente o ventanas deslizantes cuando la tarea lo permita. Comprimir o recuperar solo el contexto relevante en lugar de cargar documents completos.',
      tradeoff: 'La atención eficiente reduce coste pero puede perder capacidad de modelar relaciones arbitrarias a larga distancia. Ampliar el contexto mejora la cobertura pero aumenta latencia y precio por petición. La recuperación externa es más barata pero depende de que el indexado encuentre el fragmento correcto.',
    },
    followups: [
      'Cómo afecta el caché de clave y valor al coste de generar tokens?',
      'Qué es FlashAttention y qué problema resuelve?',
    ],
    signal: 'Que sepa que el cuello de botella es cuadrático y que existen alternativas con compensaciones.',
  },
  {
    id: 'int-a-031', track: 'ai', category: 'Deep learning',
    q: 'Diferencia SGD con momento y Adam, y cuándo elegirías uno sobre otro.',
    rubric: [
      'El momento acelera SGD en direcciones consistentes y amortigua oscilaciones.',
      'Adam adapta la tasa de aprendizaje por parámetro usando momentos de primer y segundo orden.',
      'Adam suele converger más rápido y necesitar menos ajuste.',
      'SGD con momento puede generalizar mejor y es más predecible en algunos problemas.',
    ],
    answer: {
      context: 'SGD con momento acumula una fracción de las actualizaciones anteriores, lo que ayuda a avanzar en direcciones constantes y a suavizar el ruido. Adam mantiene estimaciones del primer y segundo momento del gradiente por parámetro, ajustando el paso de forma individual. Es por eso que suele funcionar bien con poco ajuste.',
      decision: 'Usar Adam como primera opción en modelos complejos o cuando quieras convergencia rápida. Probar SGD con momento si observas sobreajuste o si necesitas un comportamiento de optimización más controlado. Ajustar la tasa de aprendizaje según el optimizador elegido.',
      tradeoff: 'Adam puede generalizar peor que SGD enciertos tareas y sus momentos consumen memoria adicional. SGD con momento es más sensible a la tasa de aprendizaje y a la programación. Existen variantes como AdamW que corrigen la interacción entre adaptación y regularización de peso.',
    },
    followups: [
      'Qué problema corrige AdamW respecto a Adam?',
      'Por qué el momento ayuda en valles estrechos de la función de pérdida?',
    ],
    signal: 'Que entienda la adaptación por parámetro y sus costes.',
  },
  {
    id: 'int-a-032', track: 'ai', category: 'Deep learning',
    q: 'Qué función de pérdida usarías para regresión con valores atípicos y por qué no simplemente error cuadrático?',
    rubric: [
      'El error cuadrático penaliza desproporcionadamente los outliers.',
      'MAE o Huber son más robustas a valores atípicos.',
      'Huber combina cuadrática cerca de cero y lineal lejos.',
      'La elección depende de si los outliers son ruido o eventos importantes.',
    ],
    answer: {
      context: 'El error cuadrático medio eleva al cuadrado cada desviación, por lo que unos pocos valores atípicos dominan la pérdida. Si esos valores son ruido de medición, el modelo se deforma para ajustarlos. La pérdida absoluta media o Huber reducen esa influencia.',
      decision: 'Usar error cuadrático si los grandes errores son realmente costosos y los datos son limpios. Cambiar a Huber o MAE cuando haya outliers que no deban dominar. Verificar la distribución de residuos antes de elegir la pérdida definitiva.',
      tradeoff: 'MAE tiene gradiente constante y puede ser menos estable al final del entrenamiento. Huber requiere elegir un umbral que determine cuándo se considera outlier. Si los valores extremos son eventos relevantes, una pérdida robusta los ignorará y empeorará la predicción en esos casos.',
    },
    followups: [
      'Qué efecto tiene Huber con un delta muy pequeño?',
      'Cómo decidir si un outlier es ruido o una señal importante?',
    ],
    signal: 'Que relacione la pérdida con el tipo de ruido en los datos.',
  },
  {
    id: 'int-a-033', track: 'ai', category: 'Deep learning',
    q: 'Qué es el transfer learning y cómo decidirías cuántas capas congelar?',
    rubric: [
      'Reutilizar representaciones aprendidas en una tarea o dataset grande.',
      'Congelar capas iniciales conserva características genéricas.',
      'Cuánto congelar depende del tamaño del dataset nuevo y su similitud.',
      'Descongelar gradualmente y con tasas de aprendizaje pequeñas es una práctica habitual.',
    ],
    answer: {
      context: 'El transfer learning aprovecha que las primeras capas de una red entrenada con muchos datos suelen aprender rasgos generales como bordes o texturas. En tareas nuevas con pocos datos, reutilizarlas reduce mucho la necesidad de entrenamiento. Las capas finales, en cambio, suelen ser específicas de la tarea original.',
      decision: 'Si el dataset nuevo es pequeño y parecido al original, congelar casi toda la red y entrenar solo la cabezal. Si es grande o muy distinto, descongelar más capas. Usar tasas de aprendizaje menores para las capas preentrenadas que para las nuevas.',
      tradeoff: 'Congelar demasiado limita la adaptación a dominios muy distintos. Descongelar todo con datos escasos puede destruir las representaciones útiles y sobreajustar. El ajuste fino consume más memoria y tiempo que un clasificador lineal sobre características fijas.',
    },
    followups: [
      'Qué harías si el dominio nuevo es muy distinto al de preentrenamiento?',
      'Por qué usar una tasa de aprendizaje menor en las capas preentrenadas?',
    ],
    signal: 'Que adapte la decisión al tamaño de datos y a la similitud de dominio.',
  },
  {
    id: 'int-a-034', track: 'ai', category: 'Deep learning',
    q: 'Qué es el entrenamiento en precisión mixta y qué precauciones exige?',
    rubric: [
      'Usa float16 o bfloat16 para parte del cómputo y float32 para operaciones sensibles.',
      'Reduce memoria y acelera el entrenamiento en hardware compatible.',
      'Las pérdidas en float16 pueden desbordarse o perder precisión.',
      'Suele combinarse con escalado de la pérdida para evitar underflow.',
    ],
    answer: {
      context: 'La precisión mixta almacena y multiplica con tipos de menor precisión donde es seguro, manteniendo acumulaciones y variables críticas en float32. Esto reduce el consumo de memoria y aprovecha los núcleos tensoriales de las GPUs. El ahorro permite lotes más grandes o modelos más grandes.',
      decision: 'Delegar la gestión en el framework con un escalador automático de pérdida cuando uses float16. Mantener en float32 las reducciones sensibles como la pérdida y las estadísticas de normalización. Verificar que la pérdida no se vuelva infinita o no aparezcan NaN.',
      tradeoff: 'Float16 tiene un rango limitado y puede sufrir underflow en gradientes pequeños, de ahí el escalado. Bfloat16 tiene más rango pero menos precisión. La precisión mixta no siempre acelera en hardware antiguo y puede complicar la depuración numérica.',
    },
    followups: [
      'Qué es el escalado de pérdida y qué problema evita?',
      'Por qué bfloat16 es más tolerante que float16 para entrenamiento?',
    ],
    signal: 'Que conozca los beneficios y los riesgos numéricos, no solo el ahorro de memoria.',
  },
  {
    id: 'int-a-035', track: 'ai', category: 'Deep learning',
    q: 'Cómo decidirías entre weight decay, dropout y parada temprana paracontrolar el sobreajuste?',
    rubric: [
      'Weight decay penaliza pesos grandes y es parte de la regularización del optimizador.',
      'Dropout randomiza la arquitectura durante el entrenamiento.',
      'Parada temprana usa la curva de validación para detener el entrenamiento.',
      'Se pueden combinar, pero conviene medir el efecto de cada una.',
    ],
    answer: {
      context: 'Las tres técnicas reducen el sobreajuste por mecanismos distintos. Weight decay desincentiva pesos grandes, dropout impide depender de unidades concretas y la parada temprana evita seguir entrenando después de que la validación empeore. No son intercambiables y sus efectos se acumulan.',
      decision: 'Empezar con parada temprana y weight decay como configuración base. Añadir dropout solo si la brecha entre entrenamiento y validación sigue siendo grande. Monitorizar ambas curvas y ajustar una técnica a la vez para entender su efecto.',
      tradeoff: 'Aplicar demasiadas regularizaciones a la vez puede subentrenar el modelo y dificultar el diagnóstico. La parada temprana depende de una métrica de validación fiable. Weight decay con optimizadores adaptativos requiere usar la variante correcta para que funcione como se espera.',
    },
    followups: [
      'Por qué AdamW es preferible a Adam con weight decay clásico?',
      'Qué patrón en las curvas indicaría que la regularización es excesiva?',
    ],
    signal: 'Que combine técnicas con criterio y sepa que demasiada regularización también falla.',
  },

  // ---------- IA: LLMs / RAG / Agentes (30) ----------
  {
    id: 'int-a-036', track: 'ai', category: 'LLMs/RAG/Agentes',
    q: 'Por qué la tokenización afecta directamente al coste y a la ventana de contexto de un LLM?',
    rubric: [
      'El modelo procesa tokens, no caracteres ni palabras.',
      'Distintos idiomas y dominios se tokenizan con distinta eficiencia.',
      'La facturación y el límite de contexto se miden en tokens.',
      'Conviene medir tokens reales con el tokenizador del modelo elegido.',
    ],
    answer: {
      context: 'Los modelos de lenguaje operan sobre tokens, que pueden ser palabras completas, fragmentos o caracteres. El español y el inglés pueden requerir números distintos de tokens para el mismo contenido, y un dominio con términos técnicos puede ser especialmente costoso. Como la facturación y el límite de contexto se cuentan en tokens, estimar malthis cantidad distorsiona el presupuesto.',
      decision: 'Medir el número de tokens con el tokenizador real del modelo antes de estimar costes. Contar tanto la entrada como la salida esperada, incluyendo el historial de la conversación. Vigilar términos técnicos y textos repetitivos que puedan inflar el recuento.',
      tradeoff: 'Un tokenizer eficiente reduce coste pero no siempre coincide con el mejor modelo para la tarea. Acortar prompts ahorra tokens pero puede quitar contexto necesario. El recuento exacto depende de la versión del modelo y puede cambiar tras una actualización.',
    },
    followups: [
      'Cómo afecta el historial de una conversación larga al coste por turno?',
      'Por qué un mismo texto en español y en inglés puede costar distinto?',
    ],
    signal: 'Que trate los tokens como la unidad real de coste y de capacidad.',
  },
  {
    id: 'int-a-037', track: 'ai', category: 'LLMs/RAG/Agentes',
    q: 'Cómo afectan temperatura y top-p a la salida de un modelo y qué configuración usarías en un asistente de soporte?',
    rubric: [
      'Temperatura modifica la distribución de probabilidades antes de muestrear.',
      'Top-p corta la cola de la distribución conservando masa probabilística.',
      'Valores altos aumentan variedad y riesgo de inventar.',
      'En soporte conviene baja temperatura y salida determinista cuando sea posible.',
    ],
    answer: {
      context: 'La temperatura escala los logits antes de aplicar softmax, de modo que valores altos aplanan la distribución y hacen más probables opciones inesperadas. El muestreo por núcleo limita las opciones a las que acumulan una cierta masa de probabilidad. Ambos parámetros controlan el equilibrio entre creatividad y repetibilidad.',
      decision: 'Usar temperatura baja o cero en respuestas de soporte donde la fidelidad importe más que la variedad. reservar valores más altos para tareas creativas. Fijar la semilla cuando el proveedor lo permita y documentar la configuración usada en evaluación.',
      tradeoff: 'Temperatura cero no garantiza resultados idénticos entre versiones del modelo o cambios de infraestructura. Una temperatura demasiado baja puede producir respuestas rígidas o repetitivas. Top-p y temperatura interactúan, así que conviene ajustar uno a la vez.',
    },
    followups: [
      'Qué efecto tiene temperatura cero en la reproducibilidad entre proveedores?',
      'Cómo afecta la aleatoriedad a los tests de regresión de un asistente?',
    ],
    signal: 'Que entienda el impacto en fiabilidad y no solo el efecto creativo.',
  },
  {
    id: 'int-a-038', track: 'ai', category: 'LLMs/RAG/Agentes',
    q: 'Cuándo usarías few-shot prompting y cuándo preferirías un system prompt claro con instrucciones?',
    rubric: [
      'System prompt define rol, formato y restricciones globales.',
      'Few-shot provide ejemplos que muestran el patrón deseado.',
      'Los ejemplos consumen tokens y pueden sesgar hacia casos concretos.',
      'Ambos se complementan y deben evaluarse con un conjunto de pruebas.',
    ],
    answer: {
      context: 'El mensaje de sistema establece las reglas generales de comportamiento, mientras que los ejemplos few-shot muestran qué se espera en la práctica. Unos pocos ejemplos bien elegidos pueden mejorar mucho el formato y el tono. Sin embargo, los ejemplos ocupan espacio en el contexto y pueden hacer que el modelo copie peculiaridades indeseadas.',
      decision: 'Empezar con un system prompt explícito que defina rol, idioma y formato de salida. Añadir entre dos y cinco ejemplos solo cuando la instrucción sola no estabilice el resultado. Probar variantes con un conjunto de evaluación fijo antes de decidir.',
      tradeoff: 'Más ejemplos no siempre mejoran y pueden desplazar información relevante del contexto. Los ejemplos sesgan al modelo hacia sus estilos y casos concretos. Un prompt muy largo encarece cada petición y aumenta la superficie de inyección.',
    },
    followups: [
      'Cómo elegirías los ejemplos de un prompt few-shot?',
      'Qué riesgo tiene repetir siempre el mismo ejemplo en producción?',
    ],
    signal: 'Que trate el prompt como algo a evaluar empíricamente, no como arte intuitivo.',
  },
  {
    id: 'int-a-039', track: 'ai', category: 'LLMs/RAG/Agentes',
    q: 'Describe el flujo básico de RAG y por qué es preferible a meter todos los contratos en el prompt.',
    rubric: [
      'Ingesta, chunking, embeddings e indexado en base vectorial.',
      'Recuperación defragmentos relevantes y construcción del contexto.',
      'Generación condicionada al contexto recuperado.',
      'RAG reduce coste, mejora frescura y permite citar fuentes.',
    ],
    answer: {
      context: 'RAG separa el conocimiento de los parámetros del modelo. Los documentos se procesan, se dividen en fragmentos y se indexan como vectores, y en cada pregunta se recuperan los fragmentos más relevantes. El modelo genera la respuesta apoyándose en ese contexto, en lugar de depender de lo que recuerde de su entrenamiento.',
      decision: 'Construir un pipeline de ingesta con metadatos, un índice vectorial y una etapa de generación que reciba solo los fragmentos necesarios. Guardar los identificadores de los fragmentos para poder citarlos. Evaluar recuperación y generación por separado para localizar fallos.',
      tradeoff: 'RAG añade complejidad operativa y depende de la calidad del indexado. Si la recuperación falla, el modelo no tiene con qué responder y puede inventar. Meter todo en el prompt es imposible con diez mil contratos y encarecería cada petición de forma absurda.',
    },
    followups: [
      'Cómo sabrías si el fallo está en la recuperación o en la generación?',
      'Qué metadatos guardarías para cada fragmento de contrato?',
    ],
    signal: 'Que entienda la separación de responsabilidades y la trazabilidad que aporta.',
  },
  {
    id: 'int-a-040', track: 'ai', category: 'LLMs/RAG/Agentes',
    q: 'Cómo dividirías 10.000 contratos en fragmentos para un sistema RAG y qué variables afectan al resultado?',
    rubric: [
      'El tamaño del chunk equilibra contexto suficiente y precisión de recuperación.',
      'El solape evita cortar ideas a mitad.',
      'Conviene respetar estructura del documento y metadatos como fecha o cliente.',
      'Los fragmentos deben caber junto con la pregunta en la ventana del modelo.',
    ],
    answer: {
      context: 'El chunking determina qué unidad de texto se recupera y se entrega al modelo. Fragmentos demasiado pequeños pierden contexto y demasiado grandes diluyen la relevancia y consumen tokens. En contratos, cortar a mitad una cláusula puede destruir justo la información que se busca.',
      decision: 'Empezar con fragmentos de unos cientos de tokens con solape moderado y respetando límites de sección o cláusula. Guardar metadatos de documento, fecha y tipo de cláusula para filtrar. Evaluar varias configuraciones con preguntas reales y medir recuperación y fidelidad.',
      tradeoff: 'Más solape mejora la continuidad pero duplica contenido e incrementa el índice. Fragmentos grandes reducen el número de vectores pero pueden incluir ruido que confunde al reranker. Un chunking puramente por longitud ignora la semántica del contrato.',
    },
    followups: [
      'Cómo manejarías un contrato con tablas extensas?',
      'Por qué guardar el identificador del documento en cada fragmento?',
    ],
    signal: 'Que trate el chunking como un hiperparámetro a evaluar, no como un valor fijo.',
  },
  {
    id: 'int-a-041', track: 'ai', category: 'LLMs/RAG/Agentes',
    q: 'Qué es un embedding y por qué se suele usar similitud del coseno con vectores normalizados?',
    rubric: [
      'Es una representación vectorial que captura significado semántico.',
      'Textos con significado parecido quedan cerca en el espacio vectorial.',
      'El coseno mide ángulo, no magnitud, y es invariante a escala.',
      'Normalizar permite usar producto punto como coseno de forma eficiente.',
    ],
    answer: {
      context: 'Un embedding convierte un texto en un vector de numeros que codifica aspects de su significado. La distancia o similitud entre vectores sirve para encontrar fragmentos semánticamente cercanos, aunque no compartan palabras. La similitud del coseno compara direcciones e ignora la magnitud.',
      decision: 'Usar modelos de embedding con dimensiones y dominio adecuados y normalizar los vectores al indexar. Consultar con el mismo modelo de embedding usado en la ingesta para que los espacios sean comparables. Verificar con ejemplos conocidos que la similitud refleje lo que esperas.',
      tradeoff: 'Un embedding genérico puede fallar con jerga legal o nombres de producto propios. Cambiar de modelo de embedding obliga a reindexar todo el corpus. El coseno ignora la magnitud, que en algunos modelos podría contener información útil de confianza.',
    },
    followups: [
      'Qué ocurre si indexas con un modelo y consultas con otro distinto?',
      'Cuándo sería mejor usar distancia euclidiana en lugar del coseno?',
    ],
    signal: 'Que sepa que la similitud depende de que embedding y métrica estén alineados.',
  },
  {
    id: 'int-a-042', track: 'ai', category: 'LLMs/RAG/Agentes',
    q: 'Qué es HNSW y qué parámetros afectan a la relación entre precisión y velocidad?',
    rubric: [
      'Es un grafo de vecinos más cercanos con niveles jerárquicos.',
      'M y efConstruction afectan a la calidad de la construcción.',
      'efSearch controla cuánto se explora en la consulta.',
      'Más exploración da más precisión pero más latencia.',
    ],
    answer: {
      context: 'HNSW construye un grafo multinivel donde cada nodo apunta a vecinos cercanos, lo que permite saltar rápido a la zona relevante del espacio. Es un índice aproximado, por lo que no garantiza encontrar los vecinos exactos. Sus parámetros permiten ajustar el compromiso entre coste de construcción, memoria y calidad de búsqueda.',
      decision: 'Fijar M y efConstruction según el tamaño del corpus y el presupuesto de memoria. Ajustar efSearch en consulta hasta alcanzar la precisión deseada con latencia aceptable. Comparar contra búsqueda exacta en una muestra para medir el recall real del índice.',
      tradeoff: 'Valores altos de M y efConstruction mejoran la calidad pero aumentan memoria y tiempo de indexado. Un efSearch bajo acelera la consulta pero pierde vecinos relevantes. En corpus pequeños, la búsqueda exacta puede ser más simple y suficientemente rápida.',
    },
    followups: [
      'Cómo medirías el recall de un índice aproximado?',
      'Qué efecto tiene un filtro por metadatos en HNSW?',
    ],
    signal: 'Que sepa que es un índice aproximado y que sus parámetros se calibran con datos.',
  },
  {
    id: 'int-a-043', track: 'ai', category: 'LLMs/RAG/Agentes',
    q: 'Cuándo usarías un índice plano, IVF o HNSW en pgvector?',
    rubric: [
      'Plano da exactitud pero coste lineal con el número de vectores.',
      'IVF particiona el espacio y reduce candidatos, con parámetros de listas y probes.',
      'HNSW ofrece buen equilibrio para búsquedas por similitud en línea.',
      'La elección depende de tamaño, latencia y frecuencia de actualización.',
    ],
    answer: {
      context: 'La búsqueda plana compara contra todos los vectores y es exacta pero se vuelve lenta al crecer el corpus. IVF agrupa vectores en clusteres y solo explora algunos, lo que acelera pero puede perder vecinos. HNSW mantiene un grafo y suele dar mejor latencia y recall con actualizaciones frecuentes.',
      decision: 'Usar índice plano para corpus pequeños o como referencia de exactitud. Probar HNSW como opción por defecto en búsquedas en línea con diez mil vectores o más. Considerar IVF si la memoria es muy limitada o si el patrón de consultas se beneficia de particionado.',
      tradeoff: 'IVF requiere entrenar los centroides y su calidad depende de la distribución de los datos. HNSW consume más memoria por los enlaces del grafo. Los índices aproximados necesitan medir recall, porque una latencia baja con mala recuperación no sirve.',
    },
    followups: [
      'Cómo afecta el número de probes en IVF a precisión y latencia?',
      'Por qué la búsqueda plana es útil como línea base de evaluación?',
    ],
    signal: 'Que elija índice según restricciones y sepa que debe medir recall.',
  },
  {
    id: 'int-a-044', track: 'ai', category: 'LLMs/RAG/Agentes',
    q: 'Qué aporta un reranker de tipo cross-encoder después de la recuperación vectorial?',
    rubric: [
      'Evalúa la relevancia conjunta de pregunta y fragmento, no vectores independientes.',
      'Suele ser más preciso que la similitud de embeddings.',
      'Es más lento y solo se aplica a unos pocos candidatos.',
      'Permite reducir el número de fragmentos enviados al LLM.',
    ],
    answer: {
      context: 'La recuperación vectorial compara embeddings calculados por separado, lo que pierde interacciones finas entre pregunta y documento. Un cross-encoder procesa la pregunta y cada candidato juntos y produce una puntuación de relevancia mucho más precisa. Su coste impide aplicarlo a todo el corpus.',
      decision: 'Recuperar un número amplio de candidatos con el índice vectorial y reordenarlos con el reranker. Conservar solo los mejores fragmentos para construir el prompt. Medir si la mejora en faithfulness compensa la latencia adicional.',
      tradeoff: 'El reranker añade latencia, especialmente en CPU, y puede convertirse en el cuello de botella. Un buen reranker no salva una recuperación que no incluye el fragmento correcto entre sus candidatos. Los modelos multilingües deben evaluarse en ambos idiomas.',
    },
    followups: [
      'Cuántos candidatos enviarías al reranker y cómo lo decidirías?',
      'Cómo detectar que el fragmento correcto no está entre los recuperados?',
    ],
    signal: 'Que entienda la arquitectura de dos etapas y su coste.',
  },
  {
    id: 'int-a-045', track: 'ai', category: 'LLMs/RAG/Agentes',
    q: 'Qué es la búsqueda híbrida y cómo combinarías resultados densos y léxicos?',
    rubric: [
      'Densa captura significado y léxica captura términos exactos.',
      'BM25 es el método léxico clásico.',
      'RRF fusiona rankings sin needing calibrar puntuaciones.',
      'La fusión ponderada exige normalizar escalas de puntuación.',
    ],
    answer: {
      context: 'La búsqueda densa encuentra texto semánticamente parecido pero puede fallar con identificadores, nombres propios o cláusulas citadas textualmente. La búsqueda léxica, como BM25, destaca en coincidencias exactas. Combinar ambas suele mejorar la cobertura de consultas muy distintas.',
      decision: 'Ejecutar ambas recuperaciones y fusionar con reciprocidad de rangos para no depender de escalas de puntuación incompatibles. Ajustar los pesos con un conjunto de consultas etiquetadas. Pasar los resultados fusionados al reranker para afinar el orden final.',
      tradeoff: 'La fusión ponderada es sensible a cómo se normalicen las puntuaciones. RRF ignora la magnitud de las diferencias y puede perder señales fuertes. Mantener dos índices duplica el trabajo de ingesta y de mantenimiento.',
    },
    followups: [
      'Por qué RRF evita el problema de escalas distintas?',
      'Qué tipo de consulta favorece claramente a BM25 sobre embeddings?',
    ],
    signal: 'Que sepa que densa y léxica son complementarias y cómo fusionarlas sin trampas.',
  },
  {
    id: 'int-a-046', track: 'ai', category: 'LLMs/RAG/Agentes',
    q: 'Cómo implementarías un caché semántico en Redis y qué riesgos tiene?',
    rubric: [
      'Consulta por similitud de embeddings antes de llamar al modelo.',
      'Requiere umbral de similitud y política de expiración.',
      'Debe considerar el contexto relevante, no solo la pregunta literal.',
      'Riesgo de servir respuestas obsoletas o de mezclar usuarios.',
    ],
    answer: {
      context: 'Un caché semántico guarda la respuesta de una pregunta y la reutiliza cuando llega otra semánticamente equivalente. Puede reducir mucho latencia y coste cuando las consultas se repiten. Su riesgo principal es devolver una respuesta que parece válida pero no corresponde al contexto actual.',
      decision: 'Calcular el embedding de la consulta y buscar respuestas cached por similitud por encima de un umbral estricto. Incluir en la clave el idioma, el tenant y la versión del corpus para evitar mezclas. Definir expiración e invalidación cuando se actualicen los contratos.',
      tradeoff: 'Un umbral bajo genera falsos aciertos con preguntas parecidas pero distintas. Un umbral alto deja pasar muchas llamadas al modelo y reduce el ahorro. El caché añade otra superficie de seguridad y debe aislar bien los datos de clientes distintos.',
    },
    followups: [
      'Cómo invalidarías el caché cuando se actualiza un contrato?',
      'Qué pasaría si dos clientes hacen la misma pregunta con permisos distintos?',
    ],
    signal: 'Que vea el caché como un componente con correctitud y seguridad, no solopor ejemplo optimization.',
  },
  {
    id: 'int-a-047', track: 'ai', category: 'LLMs/RAG/Agentes',
    q: 'Cómo garantizar que un LLM devuelve JSON válido y conforme a un esquema?',
    rubric: [
      'Definir un JSON Schema y validar la salida en el servidor.',
      'Usar modo estructurado del proveedor cuando esté disponible.',
      'Reintentar con el error de validación como feedback.',
      'Ningún mecanismo elimina la necesidad de validación del lado servidor.',
    ],
    answer: {
      context: 'La salida estructurada reduce el riesgo de que el modelo devuelva texto libre o campos faltantes. Los proveedores ofrecen modos que restringen la generación a un esquema, pero no son infalibles. La validación en el servidor sigue siendo obligatoria antes de usar la respuesta.',
      decision: 'Definir un esquema estricto con tipos y campos requeridos y pedir salida estructurada al modelo. Validar la respuesta recibida y, si falla, reintentar pasando el error de validación como contexto. Rechazar y registrar los casos que sigan fallando tras un número acotado de intentos.',
      tradeoff: 'Los esquemas muy complejos aumentan la latencia y la tasa de fallo. Reintentar añade coste y puede empeorar la experiencia si el error es persistente. Un esquema estricto puede obligar al modelo a inventar valores para campos que no sabe.',
    },
    followups: [
      'Cómo manejarías un campo opcional que el modelo no puede completar?',
      'Qué señal indica que el esquema es demasiado complejo para el modelo?',
    ],
    signal: 'Que no confíe ciegamente en el modo estructurado y mantenga validación servidora.',
  },
  {
    id: 'int-a-048', track: 'ai', category: 'LLMs/RAG/Agentes',
    q: 'Qué buenas prácticas seguirías al definir herramientas para un agente que consulta contratos?',
    rubric: [
      'Descripciones claras y parametrizada con tipos y límites.',
      'Herramientas pequeñas y con responsabilidad única.',
      'Validar argumentos y aplicar permisos en el servidor.',
      'Devolver errores estructurados que el agente pueda interpretar.',
    ],
    answer: {
      context: 'Las herramientas son la interfaz entre el modelo y los sistemas reales, y su definición determina si el agente las usa bien. Un tool con demasiadas opciones o descripción ambigua genera llamadas incorrectas. Además, el modelo no debe ser la única barrera de seguridad.',
      decision: 'Diseñar herramientas con nombres descriptivos, parámetros tipados y descripciones que expliquen cuándo usarlas. Validar y autorizar cada llamada en el servidor con la identidad del usuario. Devolver mensajes de error concretos para que el agente pueda corregir la llamada.',
      tradeoff: 'Demasiadas herramientas compiten por la atención del modelo y aumentan errores de selección. Herramientas muy granulares obligan al agente amuchos pasos y elevan latencia y coste. Las descripciones largas consumen tokens en cada petición.',
    },
    followups: [
      'Cómo evitar que el agente llame a una herramienta con permisos insuficientes?',
      'Qué harías si el agente inventa argumentos para una herramienta?',
    ],
    signal: 'Que trate las herramientas como una API con contratos y seguridad, no como prompts.',
  },
  {
    id: 'int-a-049', track: 'ai', category: 'LLMs/RAG/Agentes',
    q: 'Cómo evitas que un agente entre en un bucle infinito de razonamiento y herramientas?',
    rubric: [
      'Limitar número de pasos y presupuesto de tokens por ejecución.',
      'Detectar repetición de acciones o estados sin progreso.',
      'Definir condición de terminación y una respuesta por defecto.',
      'Registrar la traza completa para depurar los bucles.',
    ],
    answer: {
      context: 'Un agente que piensa, llama a una herramienta y vuelve a pensar puede repetirse indefinidamente si no progresa. Esto consume presupuesto y deja al usuario esperando. Los bucles suelen aparecer cuando la herramienta devuelve un error que el agente no sabe interpretar.',
      decision: 'Fijar un máximo de iteraciones y un límite de gasto por conversación. Detectar cuando la misma acción se repite sin cambios en el estado y forzar una salida. Devolver una respuesta honesta indicando que no se pudo completar la tarea.',
      tradeoff: 'Un límite demasiado bajo corta tareas legítimamente largas. Demasiado alto permite gastos desbocados. La detección de repetición puede dar falsos positivos en tareas que requieren repetir una acción con argumentos distintos.',
    },
    followups: [
      'Cómo distinguir repetición dañina de reintentos legítimos?',
      'Qué información de la traza te ayudaría a entender el bucle?',
    ],
    signal: 'Que diseñe límites y degradación controlada, no solo confíe en el modelo.',
  },
  {
    id: 'int-a-050', track: 'ai', category: 'LLMs/RAG/Agentes',
    q: 'Cuándo merece la pena que un agente descomponga una tarea en subtareas y cuándo es mejor una sola llamada?',
    rubric: [
      'La descomposición ayuda con tareas con dependencias o múltiples pasos.',
      'Permite usar herramientas distintas y verificar cada etapa.',
      'Cada paso añade latencia, coste y oportunidades de error.',
      'Una sola llamada es mejor si la tarea es acotada y verificable.',
    ],
    answer: {
      context: 'Los agentes descomponen tareas para poder usar herramientas y razonar por partes, pero cada paso implica una nueva llamada al modelo. En tareas simples, esa sobrecarga no aporta valor y aumenta la latencia. La descomposición brilla cuando hay dependencias o cuando conviene verificar resultados intermedios.',
      decision: 'Usar una sola llamada con RAG cuando la pregunta se responde recuperando y sintetizando información. Pasar a un flujo con pasos cuando haya que consultar varias fuentes, validar datos o ejecutar acciones. Medir coste y tasa de éxito de ambos enfoques con casos reales.',
      tradeoff: 'Más pasos permiten inspeccionar y corregir pero multiplican el coste y la superficie de fallo. El error de un paso se propaga a los siguientes. Los planificadores pueden equivocarse al descomponer y generar subtareas innecesarias.',
    },
    followups: [
      'Cómo evitar que un error temprano se propague por todo el plan?',
      'Qué señal indica que la descomposición no está aportando valor?',
    ],
    signal: 'Que evalúe la arquitectura agéntica con coste y fiabilidad, no por sofisticación.',
  },
  {
    id: 'int-a-051', track: 'ai', category: 'LLMs/RAG/Agentes',
    q: 'Qué diferencia hay entre memoria a corto y largo plazo en un agente conversacional?',
    rubric: [
      'Corto plazo es el contexto de la conversación actual.',
      'Largo plazo persiste entre sesiones, por ejemplo preferencias del usuario.',
      'El contexto creciente encarece y puede desplazar información relevante.',
      'La memoria persistente exige control de privacidad y borrado.',
    ],
    answer: {
      context: 'La memoria a corto plazo es simplemente el historial de turnos que cabe en la ventana del modelo. Crece con cada mensaje y puede desplazar instrucciones o información importante. La memoria a largo plazo guarda hechos y preferencias entre sesiones, normalmente en un almacén externo.',
      decision: 'Mantener el historial reciente en el contexto y resumir o descartar turnos antiguos. Guardar en memoria persistente solo hechos útiles y con consentimiento. Recuperar de forma selectiva los recuerdos relevantes para la conversación actual.',
      tradeoff: 'Resumir pierde detalles que luego pueden hacer falta. Recordar demasiado sobre el usuario plantea riesgos de privacidad y de sesgos. Recuperar recuerdos mal elegidos puede introducir información irrelevante o contradictoria en la respuesta.',
    },
    followups: [
      'Cómo manejarías una corrección del usuario sobre un recuerdo almacenado?',
      'Qué datos nunca deberían guardarse en memoria persistente?',
    ],
    signal: 'Que relacione memoria con coste, privacidad y calidad de recuperación.',
  },
  {
    id: 'int-a-052', track: 'ai', category: 'LLMs/RAG/Agentes',
    q: 'Cómo medirías y reducirías la alucinación en un asistente que responde sobre contratos?',
    rubric: [
      'Definir faithfulness como grado en que la respuesta se apoya en las fuentes.',
      'Pedir citas a fragmentos y verificar que existan y digan lo afirmado.',
      'Usar un modelo verificador o reglas sobre las citas.',
      'Reducir temperatura y mejorar recuperación ayuda.',
    ],
    answer: {
      context: 'La alucinación aparece cuando el modelo afirma hechos que no están en el contexto recuperado. En un asistente legal es especialmente grave porque una cláusula inventada puede cambiar el sentido de una respuesta. Medirla requiere un conjunto de evaluación con respuestas y fuentes etiquetadas.',
      decision: 'Exigir que cada afirmación relevante vaya acompañada de una cita a un fragmento. Verificar automáticamente que los identificadores citados existen y que el texto respalda la afirmación. Corregir la recuperación antes de culpar solo al modelo generativo.',
      tradeoff: 'Exigir citasaumentar latencia y puede hacer que el modelo se niegue a responder cuando la información está implícita. La verificación automática con otro modelo añade coste y puede fallar. Un contexto insuficiente sigue siendo la causa más común, aunque parezca un fallo del modelo.',
    },
    followups: [
      'Cómo puntuarías faithfulness en un conjunto de evaluación?',
      'Qué harías si la respuesta es correcta pero cita el fragmento equivocado?',
    ],
    signal: 'Que ataque el problema con medición y trazabilidad, no con adjetivos.',
  },
  {
    id: 'int-a-053', track: 'ai', category: 'LLMs/RAG/Agentes',
    q: 'Qué métricas usarías para evaluar un sistema RAG y cómo separarías fallos de recuperación y generación?',
    rubric: [
      'Recuperación: recall y precisión de los fragmentos relevantes.',
      'Generación: faithfulness, relevancia y task success.',
      'Trazas por consulta para ver qué fragmentos se recuperaron y qué se respondió.',
      'Evaluación humana en una muestra para validar las métricas automáticas.',
    ],
    answer: {
      context: 'Un sistema RAG puede fallar en dos puntos muy distintos: puede no recuperar el fragmento que responde la pregunta, o puede recuperarlo y responder mal. Evaluar solo la respuesta final mezcla ambos problemas. Por eso conviene instrumentar cada etapa y medirla por separado.',
      decision: 'Construir un conjunto de preguntas con fragmentos relevantes etiquetados y medir recall de recuperación. Evaluar la generación con faithfulness y éxito de la tarea, usando las citas como evidencia. Revisar manualmente una muestra para detectar errores que las métricas automáticas no ven.',
      tradeoff: 'Etiquetar fragmentos relevantes requiere tiempo y criterio experto. Las métricas automáticas basadas en modelos pueden tener sus propios sesgos. Un buen recall de recuperación no garantiza que el modelo use correctamente el contexto.',
    },
    followups: [
      'Cómo construirías el conjunto de evaluación sin sesgarlo a casos fáciles?',
      'Qué harías si faithfulness es alto pero task success bajo?',
    ],
    signal: 'Que instrumente por etapas y no se conforme con una única métrica agregada.',
  },
  {
    id: 'int-a-054', track: 'ai', category: 'LLMs/RAG/Agentes',
    q: 'Cuándo elegirías fine-tuning, RAG o simply improve the prompt para un asistente de soporte?',
    rubric: [
      'Prompt y RAG son la primera opción por coste y flexibilidad.',
      'Fine-tuning conviene para comportamiento, tono o formato consistente.',
      'RAG es mejor para conocimiento que cambia o debe citarse.',
      'Fine-tuning no sustituye a la recuperación de hechos actualizables.',
    ],
    answer: {
      context: 'Estas tres estrategias resuelven problemas distintos. El prompt y RAG son rápidos de cambiar y permiten citar fuentes, mientras que el fine-tuning modifica los pesos y es útil para fijar comportamiento y estilo. El conocimiento que cambia con frecuencia rara vez debe grabarse en los pesos.',
      decision: 'Empezar con prompt y RAG, y medir. Recurrir a fine-tuning cuando el modelo no siga el formato o el tono incluso con buenas instrucciones y ejemplos. Mantener RAG para los hechos de los contratos aunque también hagas fine-tuning del comportamiento.',
      tradeoff: 'El fine-tuning requiere datos etiquetados, infraestructura y mantenimiento tras cada versión del modelo. Puede mejorar el estilo pero no garantiza conocimiento correcto ni actualizado. RAG añade latencia y depende de la calidad del índice.',
    },
    followups: [
      'Qué datos necesitarías paraafinar un modelo de soporte?',
      'Por qué el fine-tuning no es una forma de almacenar contratos?',
    ],
    signal: 'Que elija la técnica por el problema concreto y no por prestige tecnológico.',
  },
  {
    id: 'int-a-055', track: 'ai', category: 'LLMs/RAG/Agentes',
    q: 'Qué es LoRA y por qué permite ajustar modelos grandes con pocos recursos?',
    rubric: [
      'Congela los pesos base y entrena matrices de bajo rango añadidas.',
      'Reduce drásticamente el número de parámetros entrenables.',
      'Los adaptadores son pequeños y se pueden intercambiar.',
      'Puede combinar con cuantización para reducir memoria.',
    ],
    answer: {
      context: 'LoRA congela la matriz de pesos original y aprende una actualización de bajo rango que se suma a ella. En lugar de entrenar millones de parámetros, entrena dos matrices mucho más pequeñas. Eso reduce memoria de optimizador y permite guardar muchos adaptadores para distintas tareas.',
      decision: 'Usar LoRA cuando necesites adaptar un modelo grande sin recursos para entrenarlo completo. Elegir el rango según la complejidad de la tarea y validar con un conjunto de evaluación. Combinar con cuantización del modelo base si la memoria es el límite principal.',
      tradeoff: 'LoRA no alcanza siempre el rendimiento de un ajuste completo, especialmente con dominios muy alejados. El rango y qué capas adaptar son hiperparámetros que requieren prueba. Los adaptadores dependen de una versión concreta del modelo base.',
    },
    followups: [
      'Qué efecto tiene aumentar el rango de LoRA?',
      'Cómo desplegarías varios adaptadores para distintos clientes?',
    ],
    signal: 'Que entienda qué se entrena realmente y cuáles son sus límites.',
  },
  {
    id: 'int-a-056', track: 'ai', category: 'LLMs/RAG/Agentes',
    q: 'Diferencia RLHF y DPO en la alineación de modelos de lenguaje.',
    rubric: [
      'RLHF entrena un modelo de recompensa y optimiza la política con RL.',
      'DPO optimiza directamente sobre pares de respuestas preferidas.',
      'DPO es más simple y estable, sin bucle de RL explícito.',
      'Ambos dependen de la calidad de las preferencias humanas.',
    ],
    answer: {
      context: 'RLHF recoge preferencias humanas, entrena un modelo de recompensa y después optimiza el modelo de lenguaje con aprendizaje por refuerzo. DPO evita ese modelo intermedio y ajusta la política directamente para que prefiera las respuestas elegidas. Es más simple pero igual de dependiente de los datos de preferencia.',
      decision: 'Elegir DPO cuando busques simplicidad y no tengas infraestructura de RL. Considerar RLHF cuando necesites una señal de recompensa rica y controlada. Invertir esfuerzo en la calidad y diversidad de las preferencias antes que en el algoritmo.',
      tradeoff: 'DPO puede ser sensible a distribuciones de datos estrechas y a respuestas fuera de dominio. RLHF es más costoso e inestable pero ofrece más control sobre la optimización. Ambos pueden producir modelos que parecen útiles pero que son propensos a halagar al usuario.',
    },
    followups: [
      'Qué sesgos pueden entrar con las preferencias humanas?',
      'Por qué DPO necesita pares de respuestas elegida y rechazada?',
    ],
    signal: 'Que sepa que la alineación depende de los datos de preferencia, no solo del algoritmo.',
  },
  {
    id: 'int-a-057', track: 'ai', category: 'LLMs/RAG/Agentes',
    q: 'Qué es una arquitectura de mezcla de expertos y cómo funciona un router de modelos como Haiku o Sonnet?',
    rubric: [
      'MoE activa solo algunos expertos por token, reduciendo coste de inferencia.',
      'El router decide qué experto o modelo atiende cada petición.',
      'En un router de modelos, la decisión suele basarse en dificultad y coste.',
      'Un mal router puede pagar de más o degradar la calidad.',
    ],
    answer: {
      context: 'En una mezcla de expertos, la red tiene varios submodelos y un mecanismo elige cuáles se activan para cada entrada, manteniendo la calidad con menos cómputo. En un sistema con varios modelos, el router decide si una consulta va a un modelo barato o a uno más capaz. La decisión debe apoyarse en señales de dificultad y en el coste disponible.',
      decision: 'Enviar las consultas sencillas al modelo más económico y escalar a uno más potente cuando fallen validaciones o la tarea sea compleja. Medir la tasa de escalado y la calidad por ruta. Ajustar el router con datos reales y no solo con una heurística escrita a mano.',
      tradeoff: 'Un router conservador paga más de lo necesario, uno agresivo degrada la experiencia. Escalar tarde añade latencia porque se desperdicia el primer intento. Las decisiones opacas dificultan explicar por qué una petición costó más.',
    },
    followups: [
      'Qué señales usarías para decidir el escalado a un modelo más caro?',
      'Cómo evitas que el router favorezca siempre al modelo barato?',
    ],
    signal: 'Que trate el routing como un problema de optimización medible.',
  },
  {
    id: 'int-a-058', track: 'ai', category: 'LLMs/RAG/Agentes',
    q: 'Qué es el time to first token y qué partes del pipeline lo afectan en un asistente con RAG?',
    rubric: [
      'TTFT es el tiempo hasta que aparece el primer token de la respuesta.',
      'Incluye recuperación, reranking y construcción del prompt.',
      'También depende del proveedor y del tamaño del contexto enviado.',
      'Streaming mejora percepción de latencia pero no reduce el trabajo previo.',
    ],
    answer: {
      context: 'El tiempo hasta el primer token mide cuánto tarda el usuario en ver algo, e incluye todas las etapas previas a la generación. En un sistema RAG, la búsqueda vectorial, el reranking y el envío de un prompt largo pueden dominar ese tiempo. Es una métrica distinta del tiempo total de respuesta.',
      decision: 'Instrumentar cada etapa para localizar dónde se gasta el TTFT. Reducir candidatos y tamaño del contexto, y usar streaming para mostrar progreso antes. Medir p95 y no solo la media,porque las colas afectan a los percentiles altos.',
      tradeoff: 'Reducir contexto puede quitar información necesaria y empeorar la respuesta. El streaming mejora la percepción pero no acelera la recuperación. Un caché semántico ayuda mucho en preguntas repetidas pero no en consultas nuevas.',
    },
    followups: [
      'Cómo separarías la latencia del proveedor de la tuya propia?',
      'Qué efecto tiene un reranker en el TTFT p95?',
    ],
    signal: 'Que descomponga la latencia en etapas en lugar de mirar un número global.',
  },
  {
    id: 'int-a-059', track: 'ai', category: 'LLMs/RAG/Agentes',
    q: 'Qué guardrails pondrías a la entrada y a la salida de un asistente que consulta contratos sensibles?',
    rubric: [
      'Entrada: detectar inyección, limitar longitud y validar idioma y permisos.',
      'Salida: validar esquema, detectar datos sensibles y revisar citas.',
      'Bloquear o escalar cuando se supere un umbral de riesgo.',
      'Registrar losevento para auditoría sin filtrar secretos en logs.',
    ],
    answer: {
      context: 'Los guardrails son verificaciones que se ejecutan fuera del modelo, antes y después de la generación. A la entrada conviene limitar tamaño, detectar intentos de inyección y comprobar permisos. A la salida hay que validar formato, revisar citas y evitar que se filtren datos sensibles.',
      decision: 'Implementar una cadena de validaciones con respuestas claras cuando se bloquea algo. Usar clasificadores o reglas según el riesgo y registrar cada decisión para auditoría. Escalar a revisión humana los casos dudosos en lugar de inventar una respuesta.',
      tradeoff: 'Guardrails demasiado estrictos bloquean preguntas legítimas y frustran al usuario. Los clasificadores pueden fallar con lenguaje indirecto o en otro idioma. Cada verificación añade latencia y coste, así que conviene priorizar las de mayor riesgo.',
    },
    followups: [
      'Cómo evitar que los logs de guardrails contengan datos confidenciales?',
      'Qué harías si un guardrail bloquea sistemáticamente consultas válidas en inglés?',
    ],
    signal: 'Que diseñe defensa en profundidad y mida falsos positivos.',
  },
  {
    id: 'int-a-060', track: 'ai', category: 'LLMs/RAG/Agentes',
    q: 'Cuándo tiene sentido usar varios agentes y cuándo es un error de diseño?',
    rubric: [
      'Varios agentes ayudan cuando hay roles o herramientas claramente separadas.',
      'Permiten paralelizar y aislar contextos.',
      'Multiplican coste, latencia y dificultad de depuración.',
      'Un solo agente bien instrumentado suele bastar para tareas acotadas.',
    ],
    answer: {
      context: 'Los sistemas multiagente dividen el trabajo entre varios modelos con roles distintos, lo que puede ayudar cuando hay tareas paralelas o contextos que conviene aislar. Sin embargo, cada agente añade llamadas, mensajes y puntos de fallo. Muchas veces un único agente con buenas herramientas es suficiente.',
      decision: 'Usar varios agentes solo cuando exista una separación real de responsabilidades y beneficios medibles. Definir contratos claros entre ellos y una autoridad que decida el resultado final. Medir coste y tasa de éxito frente a una versión de un solo agente.',
      tradeoff: 'La comunicación entre agentes consume tokens y puede malinterpretarse. Los errores se propagan y son difíciles de localizar sin trazas detalladas. El aparente paralelismo puede desaparecer si los agentes dependen unos de otros.',
    },
    followups: [
      'Qué señal indicaría que un agente debería dividirse en dos?',
      'Cómo asignarías la responsabilidad final de la respuesta?',
    ],
    signal: 'Que sea escéptico de la complejidad y exija evidencia de beneficio.',
  },
  {
    id: 'int-a-061', track: 'ai', category: 'LLMs/RAG/Agentes',
    q: 'Con contextos de un millón de tokens, sigue teniendo sentido RAG? Justifica.',
    rubric: [
      'El contexto largo no elimina el coste ni la latencia de procesarlo.',
      'RAG aporta selección, frescura y citas verificables.',
      'En tareas de aguja en pajal el contexto completo puede perder detalles.',
      'La decisión depende de coste, precisión y frecuencia de actualización.',
    ],
    answer: {
      context: 'Una ventana de contexto enorme permite incluir más texto, pero procesarlo sigue costando tiempo y dinero y no garantiza que el modelo atienda todo por igual. RAG aporta selección de información, actualización sencilla y la posibilidad de citar fragmentos concretos. Son herramientas complementarias.',
      decision: 'Usar RAG para knowledge que cambia y para controlar coste, y el contexto completo solo cuando la tarea exige razonar sobre un documento entero. Medir faithfulnes y coste en ambos enfoques con las mismas preguntas. Mantener las citas aunque el documento quepa entero.',
      tradeoff: 'Cargar todo el contexto puede latir detalles intermedios y encarecer cada petición. RAG puede perder el fragmento correcto si la recuperación falla. Los modelos con contexto largo pueden ser menos precisos que uno con contexto corto y bien seleccionado.',
    },
    followups: [
      'Por qué un modelo puede ignorar información relevante en un contexto muy largo?',
      'Cómo combinarías RAG con un contexto largo para una auditoría de contrato?',
    ],
    signal: 'Que no asuma que más contexto equivale a más precisión.',
  },
  {
    id: 'int-a-062', track: 'ai', category: 'LLMs/RAG/Agentes',
    q: 'Cómo controlarías el coste de un asistente a 50 peticiones por segundo con un presupuesto de 300 $ al mes?',
    rubric: [
      'Desglosar coste por token de entrada y salida y por componente.',
      'Caché semántico y router de modelos para reducir llamadas caras.',
      'Limitar longitud del contexto y del historial.',
      'Alertas y presupuesto por tenant para detectar desvíos.',
    ],
    answer: {
      context: 'El coste de un asistente se reparte entre recuperación, modelos, reranker y observabilidad. Sin desglose es imposible saber qué optimizar. Con un presupuesto mensual hay que convertirlo en un coste máximo por resolución y vigilarlo con alertas.',
      decision: 'Calcular el coste medio por petición y compararlo con el objetivo de 0,015 $ por resolución. Introducir caché para consultas repetidas y enrutar a modelos económicos cuando sea seguro. Limitar tokens de contexto e implementar topes por cliente.',
      tradeoff: 'Ahorrar en modelos puede reducir la tasa de éxito y aumentar el escalado humano, que también cuesta. Un caché agresivo puede servir respuestasinadecuado. Las alertas llegan tarde si el tráfico crece muy rápido, así que conviene limitar también la tasa de peticiones.',
    },
    followups: [
      'Cómo calcularías el coste máximo por resolución a partir del presupuesto mensual?',
      'Qué harías si el tráfico se duplica de forma inesperada?',
    ],
    signal: 'Que haga cuentas y trate el coste como un requisito no funcional medible.',
  },
  {
    id: 'int-a-063', track: 'ai', category: 'LLMs/RAG/Agentes',
    q: 'Qué información debería contener una traza de una petición en Langfuse para poder depurarla?',
    rubric: [
      'Prompt, respuesta, tokens, modelo y latencia por etapa.',
      'Fragmentos recuperados y puntuaciones del reranker.',
      'Decisiones del router, caché hits y escalado a otro modelo.',
      'Identificador de sesión sin exponer datos sensibles.',
    ],
    answer: {
      context: 'Una traza permite reconstruir qué ocurrió en una petición concreta: qué se recuperó, qué prompt se envió y qué respuesta se devolvió. Sin ese detalle, un fallo de calidad o de coste es imposible de diagnosticar. La observabilidad debe cubrir todas las etapas, no solo la llamada al modelo.',
      decision: 'Instrumentar recuperación, reranking, caché, generación y validación como etapas separadas con tiempos y resultados. Registrar modelo, tokens y coste estimado por petición. Seudonimizar los datos sensibles y definir políticas de retención.',
      tradeoff: 'Registrar prompts y respuestas completos puede almacenar información confidencial. Muchas trazas incrementan coste de almacenamiento y ralentizan la búsqueda. Demasiados datos sin un esquema claro no ayudan a depurar.',
    },
    followups: [
      'Cómo protegerías los datos personales en las trazas?',
      'Qué consultas a las trazas resolverían un pico de coste?',
    ],
    signal: 'Que entienda la trazabilidad como una herramienta de depuración y control de coste.',
  },
  {
    id: 'int-a-064', track: 'ai', category: 'LLMs/RAG/Agentes',
    q: 'Cómo asegurarías que las citas de un asistente apoyan realmente lo que afirma la respuesta?',
    rubric: [
      'Generar citas como identificadores de fragmentos recuperados.',
      'Verificar que el fragmento existe y contiene los términos clave.',
      'Usar un verificador o reglas de entailment antes de enviar la respuesta.',
      'Rechazar o regenerar respuestas con citas inválidas.',
    ],
    answer: {
      context: 'Una cita puede ser correcta como identificador pero no respaldar la afirmación, o puede corresponder a un fragmento que no existe. En un asistente de contratos eso es un fallo grave. La atribución debe validarse de forma automática antes de entregar la respuesta.',
      decision: 'Pedir al modelo que incluya solo identificadores de los fragmentos que recibió en el contexto. Comprobar que cada identificador existe y que el texto citado contiene los conceptos afirmados. Regenerar o marcar como no verificada la respuesta cuando la validación falle.',
      tradeoff: 'Un verificador estricto puede rechazar respuestas correctas que parafrasean. Añadir verificación incrementa latencia y coste. El modelo puede citar el fragmento correcto pero malinterpretar su alcance, algo difícil de detectar con reglas simples.',
    },
    followups: [
      'Cómo distinguir una paráfrasis válida de una afirmación inventada?',
      'Qué mostrarías al usuario cuando no puedas verificar una cita?',
    ],
    signal: 'Que trate la cita como una evidencia a validar, no como un adorno de la respuesta.',
  },
  {
    id: 'int-a-065', track: 'ai', category: 'LLMs/RAG/Agentes',
    q: 'Qué estrategia de fallback implementarías cuando falla la recuperación o el modelo principal?',
    rubric: [
      'Reintentos acotados con backoff y senza duplicar coste.',
      'Cambiar a otro modelo o a búsqueda léxica si falla la densa.',
      'Respuesta honesta y escalado a humano como último recurso.',
      'Registrar el motivo del fallback y medir su tasa.',
    ],
    answer: {
      context: 'Los fallos son normales: el índice puede no devolver resultados, el proveedor puede limitar peticiones o el modelo puede rechazar responder. Sin una estrategia clara, el usuario recibe un error opaco. El fallback debe degradar la experiencia de forma controlada y medible.',
      decision: 'Definir rutas alternativas para cada etapa crítica, por ejemplo búsqueda léxica si falla la vectorial y modelo de respaldo si falla el principal. Limitar reintentos y aplicar backoff. Si no se puede responder con garantías, decirlo y ofrecer escalado a una persona.',
      tradeoff: 'Demasiados fallbacks encarecen y ralentizan, y pueden ocultar un problema persistente. Un modelo de respaldo más débil puede dar respuestas peores que una negativa honesta. La tasa de fallback debe ser baja y monitorizarse, no aceptarse como normal.',
    },
    followups: [
      'Cómo distinguir un fallo transitorio de uno estructural?',
      'Por qué una tasa de fallback del diez por ciento debería alarmarte?',
    ],
    signal: 'Que diseñe degradación elegante y mida la tasa de fallback como métrica.',
  },

  // ---------- IA: System design IA (15) ----------
  {
    id: 'int-a-066', track: 'ai', category: 'System design IA',
    q: 'Cómo dimensionarías el número de réplicas de un servicio de inferencia que debe sostener 50 RPS con p95 menor a 2 segundos?',
    rubric: [
      'Medirlatencia real por petición y derivar capacidad por réplica.',
      'Usar la relación entre concurrencia, latencia y throughput.',
      'Dejar margen para picos y para fallos de una réplica.',
      'Validar con prueba de carga sostenida, no con picos breves.',
    ],
    answer: {
      context: 'El dimensionamiento parte de medir cuántas peticiones por segundo puede atender una réplica con la latencia requerida. La relación entre concurrencia y latencia permite estimar el throughput útil antes de que la cola crezca. Sin esa medición, cualquier cálculo de réplicas es una conjetura.',
      decision: 'Medir throughput y latencia de una réplica con perfiles de carga representativos. Calcular las réplicas necesarias para 50 RPS con margen, por ejemplo veinte o treinta por ciento. Verificar con una prueba sostenida que el p95 se mantenga y que no aparezca acumulación de cola.',
      tradeoff: 'Sobredimensionar aumenta el coste mensual y puede agotar el presupuesto. Quedarse corto degrada la latencia justo cuando sube el tráfico. La relación no es lineal: añadir réplicas no reduce la latencia de una petición individual.',
    },
    followups: [
      'Qué ocurre con el p95 cuando el sistema supera su capacidad?',
      'Cómo cambiaría el cálculo si la latencia del proveedor de LLM varía?',
    ],
    signal: 'Que mida primero y dimensione después, dejando margen explícito.',
  },
  {
    id: 'int-a-067', track: 'ai', category: 'System design IA',
    q: 'Cómo repartirías un presupuesto de 2 segundos de p95 entre las etapas de un asistente con RAG?',
    rubric: [
      'Descomponer en recuperación, reranking, generación y validación.',
      'Asignar márgenes según variabilidad de cada etapa.',
      'La generación suele ser la mayor fuente de varianza.',
      'Medir y ajustar el presupuesto con datos reales.',
    ],
    answer: {
      context: 'Un objetivo global de latencia solo es útil si se traduce en objetivos por etapa. La recuperación y el reranking suelen ser relativamente estables, mientras que la generación depende del proveedor y de la carga. Repartir el tiempo obliga a identificar qué etapa puede ceder.',
      decision: 'Asignar un presupuesto a cada etapa, por ejemplo unos cientos de milisegundos a recuperación y el resto a generación y validación. Instrumentar cada etapa y comparar p50 y p95. Reducir candidatos del reranker o tamaño del contexto si una etapa se sale de su margen.',
      tradeoff: 'Un presupuesto estricto en la recuperación puede obligar a un índice menos preciso. Recortar generación puede truncar respuestas y reducir calidad. La suma de presupuestos individuales no garantiza el global porque hay solapamiento y variabilidad.',
    },
    followups: [
      'Qué etapa tiene más probabilidad de causar un p95 alto y por qué?',
      'Cómo afecta el streaming a la medición de latencia total?',
    ],
    signal: 'Que convierta un objetivo global en presupuestos medibles por componente.',
  },
  {
    id: 'int-a-068', track: 'ai', category: 'System design IA',
    q: 'Qué es el dynamic batching en un servidor de inferencia y qué efecto tiene en latencia y throughput?',
    rubric: [
      'Agrupa peticiones que llegan cerca en el tiempo para usar mejor la GPU.',
      'Aumenta throughput pero puede añadir espera hasta completar el lote.',
      'Requiere una ventana de espera máxima y tamaño máximo de lote.',
      'Las secuencias de distinta longitud complican el empaquetado.',
    ],
    answer: {
      context: 'Los modelos en GPU aprovechan mejor el hardware cuando procesan varias peticiones a la vez. El batching dinámico agrupa las que llegan en una ventana corta, mejorando el uso del acelerador. El coste es una pequeña espera y la dificultad de agrupar secuencias de longitudes distintas.',
      decision: 'Configurar una ventana de espera corta y un tamaño máximo de lote según la latencia objetivo. Medir throughput y p95 con y sin batching con tráfico realista. Agrupar por longitud similar o usar relleno eficiente para no desperdiciar cómputo.',
      tradeoff: 'Una ventana larga mejora throughput pero castiga el TTFT. Con tráfico disperso, el batching apenas ayuda y solo añade retardo. Los lotes grandes pueden agotar memoria de la GPU y provocar errores.',
    },
    followups: [
      'Por qué el batching mejora el throughput pero no la latencia individual?',
      'Cómo manejarías peticiones con contextos de longitud muy distinta?',
    ],
    signal: 'Que entienda el compromiso entre aprovechamiento y espera.',
  },
  {
    id: 'int-a-069', track: 'ai', category: 'System design IA',
    q: 'Cómo decidirías entre servir un modelo en GPU, en CPU o cuantizado para 50 RPS?',
    rubric: [
      'La GPU ofrece paralelismo y es adecuada para modelos grandes.',
      'La CPU puede ser suficiente para modelos pequeños o tareas ligeras.',
      'La cuantización reduce memoria y coste con posible pérdida de calidad.',
      'La decisión se valida con pruebas de carga y evaluación de calidad.',
    ],
    answer: {
      context: 'La elección de hardware depende del tamaño del modelo, del volumen de peticiones y de la latencia objetivo. Las GPUs destacan en inferencia paralela pero encarecen el despliegue. La cuantización reduce el tamaño de los pesos y puede permitir servir en hardware más barato.',
      decision: 'Probar una configuración base en GPU y medir latencia y coste por petición. Evaluar una versión cuantizada con el conjunto de evaluación para comprobar pérdida de calidad. Si la calidad se mantiene, considerar CPU o instancias más pequeñas.',
      tradeoff: 'Cuantizar puede degradar respuestas en tareas sensibles y debe validarse en ambos idiomas. La CPU puede ser más económica pero no cumplir el p95. Las GPUs infrautilizadas son caras, así que conviene ajustar el número de réplicas al patrón real de tráfico.',
    },
    followups: [
      'Cómo medirías la pérdida de calidad introducida por cuantización?',
      'Qué señal indica que estás pagando por GPU infrautilizada?',
    ],
    signal: 'Que valide hardware y optimizaciones con datos de carga y de calidad.',
  },
  {
    id: 'int-a-070', track: 'ai', category: 'System design IA',
    q: 'Qué problemas trae el autoscaling de modelos grandes y cómo mitigar los arranques en frío?',
    rubric: [
      'Cargar un modelo en memoria puede tardar segundos o minutos.',
      'Un arranque en frío dispara la latencia during un pico.',
      'Las métricas de CPU solas son mal indicador para inferencia.',
      'Se mitigar con réplicas mínimas,precalentamiento y escalado predictivo.',
    ],
    answer: {
      context: 'Escalar una réplica de un modelo grande no es instantáneo porque hay que descargar pesos y cargarlos en memoria. Durante ese tiempo las peticiones se acumulan y el p95 empeora. Además, el uso de CPU no refleja bien cuándo un servidor de inferencia está saturado.',
      decision: 'Mantener un número mínimo de réplicas calientes y escalar basándote en longitud de cola o latencia. Precargar el modelo en la imagen o en un volumen cercano para reducir el arranque. Usar escalado predictivo si el tráfico tiene patrones regulares.',
      tradeoff: 'Mantener réplicas calientes 24 horas encarece el sistema. Escalar en base a cola puede reaccionar tarde si la carga sube muy rápido. El escalado predictivo falla ante eventos inesperados y necesita datos históricos.',
    },
    followups: [
      'Por qué la CPU es una mala métrica de escalado para inferencia?',
      'Cómo afecta un arranque en frío al SLO de latencia?',
    ],
    signal: 'Que conozca el coste real de arrancar modelos y elija métricas de escalado adecuadas.',
  },
  {
    id: 'int-a-071', track: 'ai', category: 'System design IA',
    q: 'Cómo comportarse bajo una avalancha de peticiones que supera la capacidad del sistema?',
    rubric: [
      'Limitar tasa de entrada y tamaño de colas.',
      'Aplicar backpressure y rechazar con respuesta clara.',
      'Priorizar peticiones interactivas frente a trabajo en lote.',
      'Degradar funciones opcionales antes que derribar el servicio.',
    ],
    answer: {
      context: 'Cuando la llegada supera la capacidad, una cola sin límite crece hasta agotar memoria o convertir la latencia en inaceptable. Es preferible rechazar algunas peticiones de forma controlada que dejar que todo el sistema colapse. El objetivo es degradar de forma predecible.',
      decision: 'Implementar limitación de tasa y colas acotadas con timeouts explícitos. Aplicar backpressure a los productores y priorizar el tráfico interactivo. Desactivar temporalmente etapas opcionales como el reranker para mantener la respuesta básica.',
      tradeoff: 'Rechazar peticiones afecta a usuarios, pero menos que un apagón total. Priorizar ciertos tráficos puede perjudicar a clientes de menor prioridad. Limitar la tasa requiere conocer la capacidad real, que cambia con el modelo y el hardware.',
    },
    followups: [
      'Por qué una cola infinita es peor que rechazar peticiones?',
      'Qué degradarías primero en un asistente con RAG?',
    ],
    signal: 'Que diseñe para sobrecarga en lugar de asumir que nunca ocurrirá.',
  },
  {
    id: 'int-a-072', track: 'ai', category: 'System design IA',
    q: 'Cómo mantener la coherencia del caché y de los índices cuando se actualizan los contratos?',
    rubric: [
      'Invalidar entradas afectadas por el documento cambiado.',
      'Usar versiones del corpus en la clave de caché y en los metadatos.',
      'Actualización incremental del índice frente a reconstrucción completa.',
      'Ventana de inconsistencia aceptable y monitorización.',
    ],
    answer: {
      context: 'Cuando cambia un contrato, el índice vectorial y el caché pueden quedarse desactualizados ydevolver respuestas basadas en texto antiguo. Una estrategia de versiónado permite saber qué versión del corpus se usó en cada respuesta. La actualización puede ser incremental o requerir reconstruir parte del índice.',
      decision: 'Asociar cada fragmento con la versión del documento e invalidar el caché de las claves relacionadas. Aplicar actualizaciones incrementales cuando sea posible y reprocesar en lote cuando cambie el modelo de embeddings. Definir una ventana máxima de inconsistencia y medirla.',
      tradeoff: 'Invalidar de forma agresiva reduce el ahorro del caché. La actualización incremental es rápida pero puede acumular fragmentos huérfanos. Reconstruir el índice garantiza coherencia pero interrumpe el servicio o exige un despliegue azul verde.',
    },
    followups: [
      'Cómo detectarías una respuesta servida con una versión obsoleta?',
      'Qué harías si cambias el modelo de embeddings?',
    ],
    signal: 'Que trate la frescura como un requisito con política explícita.',
  },
  {
    id: 'int-a-073', track: 'ai', category: 'System design IA',
    q: 'Cómo aislarías a Several clientes distintos en un asistente sobre contratos multi-tenant?',
    rubric: [
      'Filtrar por identificador de tenant en cada consulta al índice.',
      'Verificar permisos en el servidor, nunca solo en el prompt.',
      'Separar claves de caché y espacios de índice si hace falta.',
      'Trazas y logs con identificadores seudonimizados.',
    ],
    answer: {
      context: 'En un sistema multi-tenant, el riesgo principal es que un cliente vea contratos de otro. El filtro debe aplicarse en la capa de datos, porque un prompt que diga "no muestres otros clientes" no es una garantía. También afecta al caché y a los logs.',
      decision: 'Incluir el identificador de tenant como filtro obligatorio en la búsqueda y validarlo en cada herramienta. Usar claves de caché que incluyan el tenant o índices separados cuando el riesgo lo justifique. Añadir pruebas automáticas que intenten acceder a datos de otro cliente.',
      tradeoff: 'Índices separados simplifican el aislamiento pero multiplican coste y mantenimiento. Filtrar por metadatos es barato pero un bug en el filtro expone datos. El caché compartido sin clave de tenant es una de las fugas más comunes.',
    },
    followups: [
      'Qué prueba automática detectaría una fuga entre tenants?',
      'Cómo se vería la fuga en las trazas?',
    ],
    signal: 'Que entienda que el aislamiento se aplica en datos y permisos, no en instrucciones.',
  },
  {
    id: 'int-a-074', track: 'ai', category: 'System design IA',
    q: 'Cómo ejecutarías un experimento A/B para comparar dos versiones de un asistente sin contaminar la evaluación?',
    rubric: [
      'Asignación consistente de usuarios a variantes.',
      'Métricas de negocio y de calidad definidas antes de empezar.',
      'Mismo conjunto de evaluación offline como complemento.',
      'Periodo y tamaño de muestra suficientes para concluir.',
    ],
    answer: {
      context: 'Un experimento A/B solo es útil si la asignación es estable y las métricas están definidas antes de mirar los resultados. Con asistentes, una misma sesión debe ver siempre la misma variante o la experiencia será confusa. La evaluación offline complementa pero no sustituye al tráfico real.',
      decision: 'Asignar variantes por identificador de sesión de forma determinista. Definir métricas primarias como task success y secondary como coste y latencia. Calcular el tamaño de muestra necesario y ejecutar el experimento durante un periodo representativo.',
      tradeoff: 'Métricas de calidad basadas en juicios humanos son lentas y costosas de obtener. Un experimento corto puede capturar solo certain horas del día. Si las variantes comparten caché o índice, pueden contaminarse entre sí.',
    },
    followups: [
      'Qué harías si una variante mejora task success pero duplica el coste?',
      'Por qué no mirar los resultados a diario y parar cuando se vean bien?',
    ],
    signal: 'Que aplique rigor experimental y no solo compare impresiones.',
  },
  {
    id: 'int-a-075', track: 'ai', category: 'System design IA',
    q: 'Qué señales monitorizarías en producción para detectar que la calidad del asistente se está degradando?',
    rubric: [
      'Distribución de consultas y de fragmentos recuperados.',
      'Tasa de fallback, de citas inválidas y de rechazos del guardrail.',
      'Feedback explícito y sustitutos como reiteración de preguntas.',
      'Latencia y coste por petición como señales de cambio de comportamiento.',
    ],
    answer: {
      context: 'La calidad puede caer sin que aparezca un error técnico: los usuarios simplemente obtienen respuestas menos útiles. Por eso hay que monitorizar señales indirectas como repetición de preguntas, uso del fallback o cambios en la distribución de temas. Un cambio de versión del modelo también puede alterar el coste medio.',
      decision: 'Definir un panel con tasa de fallback, citas inválidas, feedback y distribución de consultas. Configurar alertas cuando una métrica se desvíe de su rango habitual. Revisar muestras de trazas cuando salte una alerta antes de atribuir la causa.',
      tradeoff: 'Muchas señales son ambiguas: más reiteraciones pueden significar respuestas peores o preguntas más difíciles. Las alertas sensibles generan ruido y fatiga. Sin feedback explícito, la evaluación depende de proxies que pueden engañar.',
    },
    followups: [
      'Cómo distinguir un cambio en los usuarios de un fallo del sistema?',
      'Qué harías si sube la tasa de fallback tras una actualización?',
    ],
    signal: 'Que combine métricas técnicas y de experiencia de usuario.',
  },
  {
    id: 'int-a-076', track: 'ai', category: 'System design IA',
    q: 'Qué SLO y error budget definirías para un asistente de soporte y qué hacer al agotar el presupuesto?',
    rubric: [
      'SLO de latencia p95 y de disponibilidad medidos desde el usuario.',
      'SLO de calidad como task success o tasa de citas válidas.',
      'El error budget cuantifica cuánto fallo es aceptable.',
      'Al agotarlo, priorizar fiabilidad sobre nuevas funcionalidades.',
    ],
    answer: {
      context: 'Un SLO define el nivel de servicio esperado desde el punto de vista del usuario, no desde los servidores. El error budget convierte ese objetivo en una cantidad concrete de fallos permitidos. Cuando se agota, la señal es que el sistema debe estabilizarse antes de seguir añadiendo features.',
      decision: 'Definir SLO de latencia p95, disponibilidad y una métrica de calidad. Medirlos con datos reales y establecer alertas basadas en el consumo del presupuesto. Al agotarlo, congelar cambios riesgosos y dedicar esfuerzo a corregir la causa.',
      tradeoff: 'SLO demasiado estrictos frenan el desarrollo y encarecen la infraestructura. SLO laxos no protegen al usuario. Medir calidad en tiempo real es difícil y suele requerir muestreo y evaluación asíncrona.',
    },
    followups: [
      'Por qué un SLO de disponibilidad del cien por ciento no es realista?',
      'Cómo convertirías un SLO de calidad en una alerta accionable?',
    ],
    signal: 'Que entienda los SLO como una herramienta de decisión, no como decoración.',
  },
  {
    id: 'int-a-077', track: 'ai', category: 'System design IA',
    q: 'Qué implicaciones tiene desplegar el asistente en varias regiones y cómo manejarías el tráfico y los datos?',
    rubric: [
      'La proximidad reduce latencia pero replica infraestructura.',
      'Los datos de contratos pueden tener restricciones de residencia.',
      'El enrutamiento debe considerar salud y carga de cada región.',
      'La consistencia entre réplicas debe definirse explícitamente.',
    ],
    answer: {
      context: 'Varias regiones acercan el servicio a los usuarios y mejoran la disponibilidad ante fallos locales. Pero replicar modelos, índices y datos incrementa coste y complejidad. Las normativas de protección de datos pueden prohibir que contratos de una región se procesen en otra.',
      decision: 'Identificar primero las restricciones legales de residencia de datos. Desplegar réplicas de inferencia donde aporten latencia y congestionar el tráfico según salud y carga. Definir qué datos se replican y con qué retardo aceptable.',
      tradeoff: 'Más regiones multiplican coste y superficie de operación. La consistencia eventual puede dar respuestas distintas según la región. El tráfico global puede enviar una petición a una región sin permiso para esos datos si no se valida.',
    },
    followups: [
      'Cómo evitar que una petición se procese en una región no autorizada?',
      'Qué ahorrarías desplegando una sola región?',
    ],
    signal: 'Que considere latencia, legalidad y coste, no solo disponibilidad.',
  },
  {
    id: 'int-a-078', track: 'ai', category: 'System design IA',
    q: 'Cómo diseñarías la ingesta de 10.000 contratos que se actualizan periódicamente sin interrumpir el servicio?',
    rubric: [
      'Procesamiento por lotes con idempotencia y reintentos.',
      'Publicación de nueva versión del índice y cambio atómico.',
      'Control de calidad del texto extraído y de los metadatos.',
      'Trazabilidad de qué versión del corpus está activa.',
    ],
    answer: {
      context: 'La ingesta convierte archivos en fragmentos indexables y debe poder repetirse sin duplicar datos. Si se actualiza el índice en caliente, los lectores pueden ver estados parciales. Publicar una nueva versión completa y cambiar de puntero de forma atómica evita ese problema.',
      decision: 'Construir el índice nuevo en un espacio separado y validarlo con consultas de prueba. Cambiar el puntero activo solo cuando la versión esté lista. Registrar la versión activa y permitir volver atrás si aparece un problema.',
      tradeoff: 'Mantener dos índices duplica almacenamiento temporalmente. La validación automática puede no detectar errores semánticos sutiles en la extracción. La ingesta por lotes retrasa la disponibilidad de cambios urgentes.',
    },
    followups: [
      'Cómo garantizar que reprocesar un contrato no duplica sus fragmentos?',
      'Qué validación mínima harías antes de activar un índice nuevo?',
    ],
    signal: 'Que piense en idempotencia y despliegue atómico, no solo en scripting de ingesta.',
  },
  {
    id: 'int-a-079', track: 'ai', category: 'System design IA',
    q: 'Qué operaciones de una base de datos vectorial vigilarías en producción con 10.000 contratos y 50 RPS?',
    rubric: [
      'Latencia de consulta y recall frente a búsqueda exacta.',
      'Uso de memoria y crecimiento del índice.',
      'Tasa de inserts y de reindexado durante actualizaciones.',
      'Contención y conexiones bajo carga concurrente.',
    ],
    answer: {
      context: 'Una base vectorial puede responder rápido y devolver resultados pobres si el índice se ha degradado o los parámetros son inadecuados. También puede convertirse en un cuello de botella por memoria o por contención de conexiones. Monitorizar solo latencia es insuficiente.',
      decision: 'Registrar latencia p95 de consulta y medir recall periódicamente contra búsqueda exacta. Vigilar memoria, tamaño del índice y duración de las operaciones de actualización. Dimensionar el pool de conexiones según la concurrencia real del servicio.',
      tradeoff: 'Medir recall en producción requiere ejecutar búsquedas exactas adicionales y consume recursos. Un índice optimizado para escritura puede consultar peor. Demasiadas conexiones agotan memoria del servidor de base de datos.',
    },
    followups: [
      'Cómo detectarías que el recall ha caído sin cambiar el código?',
      'Qué efecto tiene un pico de reindexado en la latencia de consulta?',
    ],
    signal: 'Que vigile calidad de recuperación además de rendimiento.',
  },
  {
    id: 'int-a-080', track: 'ai', category: 'System design IA',
    q: 'Cuándo procesarías datos en tiempo real y cuándo en lote en un sistema que actualiza contratos y métricas?',
    rubric: [
      'Tiempo real conviene cuando la frescura afecta a la respuesta.',
      'Lote es más eficiente para reindexados y agregaciones costosas.',
      'Muchos sistemas combinan ambos con una capa de serving.',
      'La elección depende del coste de la obsolescencia.',
    ],
    answer: {
      context: 'El procesamiento en tiempo real reduce la ventana entre que cambia un contrato y el sistema lo refleja, pero es más caro y complejo. El procesamiento por lotes agrupa trabajo y aprovecha mejor los recursos, aunque introduce retardo. La decisión depende de cuánto importe ese retardo.',
      decision: 'Procesar en tiempo real los cambios que deben afectar de inmediato a las respuestas. Dejar para lotes nocturnos el reindexado completo, las métricas agregadas y la recalibración. Documentar la frescura esperada de cada dato.',
      tradeoff: 'El streaming añade infraestructura y dificultad de depuración. El lote puede dejar el sistema desactualizado durante horas. Una arquitectura mixta es poderosa pero duplica parte de la lógica de procesamiento.',
    },
    followups: [
      'Qué coste tiene para el negocio una hora de desactualización?',
      'Cómo evitar duplicar lógica entre el camino real y el lote?',
    ],
    signal: 'Que justifique la arquitectura por el valor de la frescura.',
  },

  // ---------- IA: MLOps (10) ----------
  {
    id: 'int-a-081', track: 'ai', category: 'MLOps',
    q: 'Qué pruebas incluirías en el pipeline de CI de un servicio con LLM y RAG?',
    rubric: [
      'Tests unitarios de chunking, filtros y validación de esquemas.',
      'Tests de integración con recuperación sobre un corpus pequeño fijo.',
      'Evaluación de regresión con un conjunto dorado de preguntas.',
      'Pruebas de seguridad y de límites de coste y latencia.',
    ],
    answer: {
      context: 'En sistemas con LLM no basta con que el código compile, porque los fallos suelen ser de comportamiento. Los tests unitarios cubren transformaciones deterministas, mientras que un conjunto dorado de preguntas detecta regresiones de calidad. También conviene verificar que cambios en prompts no disparen coste o latencia.',
      decision: 'Incluir tests rápidos de las piezas deterministas en cada commit. Ejecutar el conjunto de evaluación en pull requests y comparar contra la versión anterior. Añadir pruebas de inyección y de esquemas antes de desplegar.',
      tradeoff: 'La evaluación con modelos puede ser lenta y costosa en cada commit. Los umbrales estrictos generan falsas alarmas por variabilidad del modelo. Un corpus de prueba pequeño puede no representar los casos difíciles de producción.',
    },
    followups: [
      'Cómo evitar que la evaluación sea lenta en cada pull request?',
      'Qué harías si una métrica baja dos puntos por variabilidad del proveedor?',
    ],
    signal: 'Que trate el comportamiento del modelo como algo testeable, no como magia.',
  },
  {
    id: 'int-a-082', track: 'ai', category: 'MLOps',
    q: 'Por qué versionar los datos además del código y qué herramientas o prácticas usarías?',
    rubric: [
      'Los cambios en datos pueden alterar el modelo tanto como el código.',
      'DVC o snapshots inmutables permiten reproducir un entrenamiento.',
      'Registrar la versión del corpus usada en cada evaluación.',
      'El versionado debe incluir esquemas y reglas de limpieza.',
    ],
    answer: {
      context: 'Un modelo entrenado con otra versión del corpus no es reproducible aunque el código sea idéntico. Versionar datos permite responder qué entradas produjeron un resultado y repetir un experimento. También es la base para investigar regresiones de calidad.',
      decision: 'Guardar snapshots inmutables o punteros con checksum de los datos usados en cada entrenamiento. Registrar la versión del corpus en el experimento y en el modelo publicado. Versionar también las reglas de extracción y limpieza.',
      tradeoff: 'Almacenar múltiples versiones de un corpus grande consume espacio. Sin una política de retención, el repositorio de datos crece sin control. Un checksum detecta cambios pero no explica por qué cambiaron los datos.',
    },
    followups: [
      'Cómo reproducirías un experimento de hace seis meses?',
      'Qué señal indica que un cambio de datos causó una regresión?',
    ],
    signal: 'Que entienda la reproducibilidad como una propiedad de todo el pipeline.',
  },
  {
    id: 'int-a-083', track: 'ai', category: 'MLOps',
    q: 'Para qué sirve un registro de modelos y qué información debería contener cada entrada?',
    rubric: [
      'Centraliza versiones, metadatos y estado de promoción.',
      'Debe registrar métricas, datos de entrenamiento y configuración.',
      'Permite aprobar y revertir versiones con trazabilidad.',
      'Conecta el modelo con el despliegue y con sus evaluaciones.',
    ],
    answer: {
      context: 'Un registro de modelos es la fuente de verdad sobre qué versiones existen, cómo se entrenaron y cuáles están aprobadas. Sin él, los equipos despliegan artefactos sin saber qué datos o hyperparámetros los generaron. Es especialmente útil para auditorías y para recuperarse de fallos.',
      decision: 'Registrar cada versión con métricas de evaluación, versión de datos, configuración y autor. Definir etapas claras como desarrollo, validación y producción. Exigir que el despliegue consulte el registro en lugar de usar rutas arbitrarias.',
      tradeoff: 'Un registro mal mantenido da falsa sensación de control. Añadir metadatos manualmente es propenso a olvidos, así que conviene automatizarlo. La promoción sin criterios objetivos convierte el registro en una burocracia.',
    },
    followups: [
      'Qué criterios automaticarías para promover un modelo a producción?',
      'Cómo revertirías una versión defectuosa ya desplegada?',
    ],
    signal: 'Que vea el registro como parte de la gobernanza y la recuperación.',
  },
  {
    id: 'int-a-084', track: 'ai', category: 'MLOps',
    q: 'Diferencia despliegue canary y shadow en el contexto de un cambio de modelo o prompt.',
    rubric: [
      'Canary envía un pequeño porcentaje de tráfico real a la nueva versión.',
      'Shadow ejecuta la nueva versión en paralelo sin afectar al usuario.',
      'Canary expone a usuarios y shadow solo compara resultados.',
      'Ambos permiten detectar regresiones antes de un despliegue total.',
    ],
    answer: {
      context: 'Un despliegue canary introduce la versión nueva ante una fracción pequeña de usuarios y observa métricas reales. El despliegue shadow envía copias del tráfico a la nueva versión sin que sus respuestas lleguen al usuario. La primera prueba impacto real, la segunda compara comportamiento sin riesgo.',
      decision: 'Usar shadow primero para comparar calidad y coste frente a la versión actual. Si los resultados son aceptables, pasar a canary con un porcentaje bajo y aumentarlo gradualmente. Definir criterios de aborto antes de empezar.',
      tradeoff: 'Shadow no detecta problemas de integración con el usuario, como insatisfacción o confusión. Canary puede afectar a clientes reales si la regresión es grave. Ambos requieren suficiente tráfico para que la comparación sea significativa.',
    },
    followups: [
      'Qué métricas compararías en un despliegue shadow?',
      'Cómo elegir el porcentaje inicial de un canary?',
    ],
    signal: 'Que sepa que son estrategias distintas con distinto nivel de riesgo.',
  },
  {
    id: 'int-a-085', track: 'ai', category: 'MLOps',
    q: 'Qué elementos de un experimento registrarías para poder reproducirlo y compararlo con otros?',
    rubric: [
      'Código, versión de datos hiperparámetros y semilla.',
      'Métricas de evaluación y artefactos como prompts y modelos.',
      'Entorno y dependencias con versiones fijadas.',
      'Notas sobre decisiones y resultados inesperados.',
    ],
    answer: {
      context: 'Un experimento reproducible necesita saber exactamente qué código, datos y parámetros produjeron un resultado. Sin semilla y sin versiones fijadas, dos ejecuciones pueden divergir. Registrar las decisiones también ayuda a entender por qué se descartó una opción.',
      decision: 'Usar una herramienta de seguimiento de experimentos que guarde parámetros, métricas y artefactos de forma automática. Fijar semillas y versionar prompts y configuración. Escribir una breve conclusión con cada experimento relevante.',
      tradeoff: 'Registrar demasiado genera ruido y dificulta encontrar lo importante. Las herramientas de tracking añaden dependencia y coste. La reproducibilidad estricta es difícil cuando el proveedor del modelo cambia su comportamiento.',
    },
    followups: [
      'Cómo compararías experimentos con proveedores de LLM que cambian de versión?',
      'Por qué la semilla no basta para reproducir una llamada a una API?',
    ],
    signal: 'Que entienda que la reproducibilidad incluye datos, entorno y decisiones.',
  },
  {
    id: 'int-a-086', track: 'ai', category: 'MLOps',
    q: 'Cómo detectarías data drift y concept drift en un asistente que responde sobre contratos?',
    rubric: [
      'Data drift: cambia la distribución de entradas o de documentos.',
      'Concept drift: cambia la relación entre entrada y respuesta esperada.',
      'Monitorizar distribución de embeddings y de temas de consultas.',
      'Usar feedback y evaluación periódica para detectar el cambio de concepto.',
    ],
    answer: {
      context: 'El data drift significa que las entradas o los documentos ya no se parecen a los vistos en entrenamiento o evaluación. El concept drift es más sutil: las entradas parecen iguales pero lo correcto ha cambiado, por ejemplo por una nueva política legal. El segundo no se detecta solo mirando distribuciones.',
      decision: 'Monitorizar la distribución de consultas y de embeddings recuperados, y compararla con una referencia. Mantener un conjunto de evaluación actualizado con criterio experto. Revisar periódicamente muestras de respuestas con feedback para detectar cambios de concepto.',
      tradeoff: 'La detección estadística de drift da falsas alarmas con estacionalidad legítima. El concept drift requiere etiquetas frescas, que son costosas. Un cambio en el producto o en la política de la empresa puede parecer ruido antes de reconocerse.',
    },
    followups: [
      'Qué señal distinguiría estacionalidad de drift dañino?',
      'Por qué el concept drift es más peligroso que el data drift?',
    ],
    signal: 'Que sepa que mirar distribuciones no detecta todo tipo de cambio.',
  },
  {
    id: 'int-a-087', track: 'ai', category: 'MLOps',
    q: 'Qué ventajas aporta la infraestructura como código en el despliegue de un sistema de IA?',
    rubric: [
      'Hace reproducible el entorno y reduce configuraciones manuales.',
      'Permite revisiones y trazabilidad de cambios de infraestructura.',
      'Facilita recrear entornos y recuperarse de fallos.',
      'Requiere disciplina y gestión de secretos adecuada.',
    ],
    answer: {
      context: 'Un sistema de IA incluye bases de datos, índices, colas, servicios y permisos que difíciles de recrear a mano. La infraestructura como código describe esos recursos en archivos versionables. Eso permite revisar cambios, repetir despliegues y recuperar entornos.',
      decision: 'Definir todos los recursos con herramientas declarativas y revisar sus cambios como se revisa el código. Mantener los secretos fuera del repositorio en un gestor dedicado. Probar los cambios primero en un entorno aislado.',
      tradeoff: 'La curva de aprendizaje y el mantenimiento inicial son costosos. Una plantilla mal parametrizada puede propagar errores a todos los entornos. La infraestructura como código no sustituye la monitorización ni la operación del sistema.',
    },
    followups: [
      'Cómo manejarías secretos en un pipeline de infraestructura?',
      'Qué riesgo tiene un cambio de infraestructura sin revisión?',
    ],
    signal: 'Que valore la reproducibilidad operativa, no solo la del modelo.',
  },
  {
    id: 'int-a-088', track: 'ai', category: 'MLOps',
    q: 'Cómo diseñarías la recuperación ante el despliegue de una versión que degrada la calidad?',
    rubric: [
      'Detección temprana con métricas y canary.',
      'Posibilidad de revertir rápido a la versión anterior.',
      'Rollback de índice y caché además del código.',
      'Postmortem sin culpas y registro de la lección aprendida.',
    ],
    answer: {
      context: 'Una versión puede pasar todos los tests y fallar con tráfico real, así que hace falta poder dar marcha atrás con rapidez. El rollback debe incluir no solo el servicio, sino también la versión del índice y del caché si cambiaron. Sin eso, volver al código anterior no restaura el comportamiento.',
      decision: 'Definir de antemano qué métrica dispara la reversión y quién puede ejecutarla. Mantener la versión anterior desplegada y lista para recibir tráfico. Practicar el procedimiento periódicamente y documentar el postmortem.',
      tradeoff: 'Mantener dos versiones vivas aumenta coste temporal. Revertir el código sin revertir datos puede empeorar el estado.Una reversión frecuente puede indicar que la evaluación previa es insuficiente.',
    },
    followups: [
      'Qué indicaría que no basta con revertir el código?',
      'Cómo evitar que el pánico lleve a una reversión equivocada?',
    ],
    signal: 'Que planifique la recuperación antes de necesitarla.',
  },
  {
    id: 'int-a-089', track: 'ai', category: 'MLOps',
    q: 'Qué problema resuelve un feature store y cuándo sería excesivo en un proyecto de IA?',
    rubric: [
      'Centraliza definiciones y valores de características para entrenamiento y serving.',
      'Evita discrepancias entre cómo se calcula una feature en offline y online.',
      'Aporta puntos en el tiempo para evitar fugas.',
      'Es excesivo si hay pocas características o un solo modelo.',
    ],
    answer: {
      context: 'Un feature store garantiza que la misma característica se calcule igual al entrenar y al servir, uno de los errores más comunes en producción. También permite reutilizar características entre modelos y acceder a valores históricos sin fugas. Su coste operativo es elevado.',
      decision: 'Introducirlo cuando haya plusieurs modelos compartiendo características o cuando la consistencia offline y online sea un problema real. Definir transformaciones en un único lugar y usar almacenamiento con marcas de tiempo. Empezar con una implementación sencilla si el proyecto es pequeño.',
      tradeoff: 'Mantener un feature store consume tiempo de ingeniería y puede ralentizar entregas. En un sistema basado principalmente en RAG, gran parte de su valor no se aplica. Una solución casera puede ser suficiente mientras el número de características sea bajo.',
    },
    followups: [
      'Qué es el skew entre entrenamiento y serving y cómo se manifiesta?',
      'Por qué los puntos en el tiempo evitan fugas en características históricas?',
    ],
    signal: 'Que adopte la herramienta solo cuando el problema existe.',
  },
  {
    id: 'int-a-090', track: 'ai', category: 'MLOps',
    q: 'Cómo versionarías y gobernarías los prompts de un sistema en producción?',
    rubric: [
      'Prompts en repositorio con versiones y revisiones.',
      'Evaluación automática antes de promover un cambio.',
      'Trazas que registren qué versión de prompt se usó.',
      'Control de acceso y registro de quién aprobó el cambio.',
    ],
    answer: {
      context: 'Un prompt es código en el sentido de que un pequeño cambio puede alterar radicalmente el comportamiento. Guardarlo solo en una Base de datos sin control de versiones dificulta saber qué se desplegó. Las trazas deben indicar qué versión se usó en cada respuesta.',
      decision: 'Almacenar prompts en el repositorio o en un sistema con versionado explícito. Exigir evaluación y revisión antes de promoverlos. Incluir el identificador de versión en la traza de cada petición y permitir revertir.',
      tradeoff: 'Un prompt editable en caliente desde una interfaz es cómodo pero peligroso sin control. Versionar demasiado detalles genera ruido. Los cambios de prompt pueden interactuar con cambios de modelo y dificultar atribuir la causa de una regresión.',
    },
    followups: [
      'Cómo atribuirías una regresión a un prompt o a un cambio de modelo?',
      'Qué riesgo tiene editar un prompt directamente en producción?',
    ],
    signal: 'Que trate los prompts como artefactos gobernados, no como texto informal.',
  },

  // ---------- IA: Seguridad (10) ----------
  {
    id: 'int-a-091', track: 'ai', category: 'Seguridad',
    q: 'Diferencia inyección de prompt directa e indirecta y por qué la segunda es más peligrosa en RAG.',
    rubric: [
      'Directa: el usuario escribe instrucciones maliciosas en su mensaje.',
      'Indirecta: las instrucciones llegan en un documento recuperado.',
      'La indirecta puede actuar sin que el usuario sospeche.',
      'El modelo debe tratar el contenido recuperado como datos, no como órdenes.',
    ],
    answer: {
      context: 'En la inyección directa, el atacante es el propio usuario y escribe algo como ignora tus instrucciones. En la indirecta, el atacante inserta instrucciones en un contrato o página que el sistema recuperará. Esta última es más sigilosa porque el usuario legítimo no ve el contenido malicioso.',
      decision: 'Delimitar claramente las secciones del prompt y declarar que el texto recuperado es dato, no instrucción. Validar y filtrar el contenido de los documentos en la ingesta. Mantener herramientas y permisos fuera del alcance del contenido recuperado.',
      tradeoff: 'Los delimitadores no son una garantía y modelos distintos los respetan de forma distinta. Filtrar texto puede eliminar contenido legítimo, por ejemplo cláusulas que mencionan ignorar condiciones. La defensa real está en limitar qué puede hacer el modelo aunque sea engañado.',
    },
    followups: [
      'Cómo reducirías el daño si el modelo llega a seguir una instrucción incrustada?',
      'Por qué un system prompt no basta como defensa?',
    ],
    signal: 'Que entienda que la seguridad depende de permisos, no solo de instrucciones.',
  },
  {
    id: 'int-a-092', track: 'ai', category: 'Seguridad',
    q: 'Cómo podría un atacante exfiltrar información sensible a través de las respuestas de un asistente?',
    rubric: [
      'Inyección que obliga a incluir secretos del contexto en la salida.',
      'Uso de herramientas para enviar datos a destinos externos.',
      'Codificación de la información en formato oculto o Markdown.',
      'Mitigación con salida restringida, DLP y permisos mínimos.',
    ],
    answer: {
      context: 'Un atacante puede conseguir que el modelo repita fragmentos confidenciales del contexto o que use una herramienta para enviarlos a una URL. Tambien puede disfrazar la información en formatos que parecen inofensivos. El riesgo aumenta si el asistente tiene acceso a muchas herramientas.',
      decision: 'Limitar el contexto a lo estrictamente necesario y aplicar controles de salida que detecten patrones sensibles. Restringir las herramientas a destinos permitidos y registrar sus usos. Aplicar el principio de menor privilegio a cada rol del sistema.',
      tradeoff: 'Los controles de salida pueden bloquear datos legítimos y generar falsos positivos. Restringir demasiado las herramientas reduce la utilidad del asistente. Un atacante paciente puede probar muchas variantes hasta encontrar una que pase.',
    },
    followups: [
      'Qué herramientas serían especialmente peligrosas en manos de un agente?',
      'Cómo detectarías una exfiltración distribuida en muchas respuestas pequeñas?',
    ],
    signal: 'Que piense en el modelo como un canal que puede ser abusado.',
  },
  {
    id: 'int-a-093', track: 'ai', category: 'Seguridad',
    q: 'Qué precauciones tomarías con datos personales en contratos que se envían a un proveedor de LLM?',
    rubric: [
      'Clasificar y minimizar los datos antes de enviarlos.',
      'Anonimizar o seudonimizar cuando sea posible.',
      'Revisar contrato de procesamiento y retención del proveedor.',
      'Evitar que los datos sensibles acaben en trazas o logs.',
    ],
    answer: {
      context: 'Enviar contratos a un proveedor externo puede implicar transferencia de datos personales y confidenciales. Incluso si el proveedor no entrena con ellos, la retención y el acceso interno importan. La minimización reduce tanto el riesgo legal como el coste.',
      decision: 'Identificar qué campos son personales y eliminarlos o sustituirlos por identificadores antes de construir el prompt. Revisar las condiciones de retención del proveedor y elegir opciones sin retención si existen. Asegurar que las trazas no guarden el contenido original.',
      tradeoff: 'Anonimizar puede quitar contexto necesario para responder correctamente. Los proveedores sin retención pueden ser más caros o tener menor disponibilidad. La seudonimización no elimina el riesgo si existe un mapa reversible accesible.',
    },
    followups: [
      'Qué campos de un contrato considerarías sensibles por defecto?',
      'Cómo responder si el usuario necesita citar un dato personizado?',
    ],
    signal: 'Que aplique privacidad por diseño y no como trámite legal.',
  },
  {
    id: 'int-a-094', track: 'ai', category: 'Seguridad',
    q: 'Qué son ejemplos adversarios y por qué son una preocupación en modelos que procesan texto y visión?',
    rubric: [
      'Son entradas modificadas mínimamente para inducir un error.',
      'En texto incluyen cambios sutiles o caracteres invisibles.',
      'En visión incluyen perturbaciones imperceptibles para humanos.',
      'La defensa incluye entrenamiento adversario y validación de entradas.',
    ],
    answer: {
      context: 'Un ejemplo adversario es una entrada diseñada para que el modelo cometa un error concreto con cambios que pasan desapercibidos. En texto pueden ser palabras alteradas o caracteres ocultos, y en visión perturbaciones en píxeles. Es un riesgo porque el modelo puede fallar con alta confianza.',
      decision: 'Normalizar y validar entradas para eliminar caracteres invisibles o formatos extraños. Incluir casos adversarios en el conjunto de evaluación. Considerar entrenamiento adversario o filtros específicos cuando el riesgo sea alto.',
      tradeoff: 'La normalización excesiva puede dañar texto legítimo en otros idiomas. El entrenamiento adversario mejora robustez pero puede reducir precisión en casos normales. Existen defensas que parecen funcionar hasta que aparece un ataque adaptado.',
    },
    followups: [
      'Por qué los caracteres invisibles son problemáticos en prompts?',
      'Cómo incluirías casos adversarios en la evaluación?',
    ],
    signal: 'Que conozca el problema y sea escéptico de defensas absolutas.',
  },
  {
    id: 'int-a-095', track: 'ai', category: 'Seguridad',
    q: 'Qué es un ataque de inferencia de pertenencia y cómo se mitiga?',
    rubric: [
      'Determina si una muestra concreta estuvo en los datos de entrenamiento.',
      'Explota diferencias de confianza del modelo ante muestras vistas.',
      'Es relevante cuando los datos de entrenamiento son sensibles.',
      'Se mitiga con regularización, recorte de confianza y ruido controlado.',
    ],
    answer: {
      context: 'En un ataque de inferencia de pertenencia, el adversario consulta el modelo e intenta decidir si cierto registro se usó al entrenar. Si el modelo responde con más confianza a esos datos, se filtra información sobre el conjunto original. Es grave cuando los datos son personales o confidenciales.',
      decision: 'Reducir la sobreconfianza mediante regularización y calibración. Evitar devolver probabilidades detalladas cuando no sean necesarias. Evaluar la vulnerabilidad con pruebas específicas antes de entrenar con datos sensibles.',
      tradeoff: 'Recortar o difuminar probabilidades puede perder información útil para el usuario. La mitigación no elimina el riesgo por completo. En sistemas RAG, la filtración suele venir del contexto recuperado más que de los parámetros del modelo.',
    },
    followups: [
      'Por qué la sobreconfianza facilita este ataque?',
      'Cómo cambia el riesgo al usar RAG con contratos originales?',
    ],
    signal: 'Que entienda qué información se filtra y por qué, no solo el nombre del ataque.',
  },
  {
    id: 'int-a-096', track: 'ai', category: 'Seguridad',
    q: 'Cómo protegerías un modelo valioso frente a extracciónmediante la API de inferencia?',
    rubric: [
      'Limitar tasa de peticiones y detectar patrones de consulta sistemáticos.',
      'Restringir longitud y detalle de las salidas.',
      'Monitorizar usos anómalos y aplicar autenticación fuerte.',
      'Aceptar que la protección es parcial y combinar medidas legales y técnicas.',
    ],
    answer: {
      context: 'Un atacante puede enviar muchas consultas para reconstruir un modelo o copiar su comportamiento, especially si obtiene probabilidades detalladas. Esto es cuando el modelo es un activo competitivo. No existe una defensa perfecta, pero sí medidas que elevan el coste del ataque.',
      decision: 'Limitar la tasa por credencial y detectar patrones secuenciales sospechosos. Devolver solo la información necesaria, sin logits completos. Registrar y alertar sobre volúmenes inusuales y combinar con términos de uso.',
      tradeoff: 'Limitar demasiado la tasa perjudica a clientes legítimos con cargas altas. Reducir la salida puede romper integraciones que dependen de ella. Un atacante distribuido entre cuentas puede evadir controles simples.',
    },
    followups: [
      'Qué patrón de consultas sugeriría un intento de extracción?',
      'Por qué devolver probabilidades completas aumenta el riesgo?',
    ],
    signal: 'Que entienda que es reducción de riesgo, no eliminación.',
  },
  {
    id: 'int-a-097', track: 'ai', category: 'Seguridad',
    q: 'Qué riesgos de cadena de suministro existen al usar modelos y librerías de terceros?',
    rubric: [
      'Pesos o datasets modificados con puertas traseras.',
      'Dependencias con vulnerabilidades o mantenimiento abandonado.',
      'Falta de procedencia y de verificación de integridad.',
      'Mitigación con hashes, revisiones y lista de materiales de software.',
    ],
    answer: {
      context: 'Un sistema de IA depende de modelos preentrenados, datasets y muchas librerías. Cualquiera de esos artefactos puede contener código malicioso o comportamientos inducidos. La procedencia y la verificación de integridad son tan importantes como en cualquier otro software.',
      decision: 'Descargar modelos y librerías de fuentes confiables y verificar hashes. Mantener una lista de dependencias y revisar alertas de seguridad. Congelar versiones y revisar cambios antes de actualizar.',
      tradeoff: 'Verificar y revisar cada actualización ralentiza el desarrollo. Una dependencia abandonada puede seguir siendo necesaria y obligar a mantener parches propios. Las puertas traseras en modelos son difíciles de detectar con inspección superficial.',
    },
    followups: [
      'Cómo detectarías una puerta trasera en un modelo preentrenado?',
      'Qué información debería contener la lista de materiales de tu sistema?',
    ],
    signal: 'Que aplique disciplina de seguridad de software al ecosistema de IA.',
  },
  {
    id: 'int-a-098', track: 'ai', category: 'Seguridad',
    q: 'Cómo aplicarías control de acceso al momento de que un agente usa herramientas con privilegios?',
    rubric: [
      'Autorizar cada acción con la identidad del usuario, no con la del agente.',
      'Separar permisos de lectura y escritura.',
      'Validar argumentos y limitar el alcance de cada herramienta.',
      'Registrar cada acción para auditoría.',
    ],
    answer: {
      context: 'Un agente que actúa en nombre de un usuario no debe heredar privilegiosglobales. Si todos comparten la misma credencial, un error o un ataque puede afectar a datos de otros. La autorización debe ocurrir en el servidor en cada llamada a una herramienta.',
      decision: 'Propagar la identidad del usuario hasta la capa de herramientas y verificar permisos antes de ejecutar. Usar tokens de corta duración y alcance limitado. Distinguir claramente entre herramientas de solo lectura y herramientas que modifican datos.',
      tradeoff: 'Propagar identidad añade complejidad a la arquitectura. Verificar permisos en cada llamada incrementa latencia. Los tokens de corta duración pueden expirar durante una tarea larga y exigir renovación.',
    },
    followups: [
      'Qué pasaría si el agente usara una credencial de servicio compartida?',
      'Cómo registrarías una acción privilegiada sin exponer datos sensibles?',
    ],
    signal: 'Que no confíe en que el modelo respete permisos por sí mismo.',
  },
  {
    id: 'int-a-099', track: 'ai', category: 'Seguridad',
    q: 'Cómo organizarías un ejercicio de red teaming para un asistente con RAG y herramientas?',
    rubric: [
      'Definir amenazas y activos antes de atacar.',
      'Incluir inyección directa e indirecta, exfiltración y abuso de herramientas.',
      'Participación de perfiles técnicos y de dominio.',
      'Documentar hallazgos y verificar las correcciones con nuevas pruebas.',
    ],
    answer: {
      context: 'El red teaming busca explotar el sistema como lo haría un adversario, no solo ejecutar un checklist. En un asistente con RAG hay que probar tanto instrucciones maliciosas del usuario como contenido envenenado en documentos. También importa el abuso de herramientas con privilegios.',
      decision: 'Definir primero qué se protege y qué actores se consideran. Diseñar escenarios que combinen inyección, recuperación y llamadas a herramientas. Registrar cada hallazgo con reproducibilidad y volver a probarlo tras la corrección.',
      tradeoff: 'Un ejercicio mal enfocado encuentra problemas triviales y deja los importantes. Probar contra un modelo en evolución hace que los resultados envejezcan rápido. El red teaming sin voluntad de corregir hallazgos se convierte en un informe decorativo.',
    },
    followups: [
      'Cómo priorizarías los hallazgos por impacto y probabilidad?',
      'Qué escenario combinado sería más peligroso que cada ataque por separado?',
    ],
    signal: 'Que aborde la seguridad como un proceso continuo y no como una prueba única.',
  },
  {
    id: 'int-a-100', track: 'ai', category: 'Seguridad',
    q: 'Dibuja el modelo de amenazas de un asistente multi-tenant sobre contratos y explica dónde pondrías los controles.',
    rubric: [
      'Identifica activos: contratos, credenciales, trazas y reputación.',
      'Enumera actores: usuario legítimo, atacante externo, insider y proveedor.',
      'Señala fronteras: entrada, recuperación, modelo, herramientas y salida.',
      'Asocia controles concretos a cada frontera y verifica su efectividad.',
    ],
    answer: {
      context: 'Un modelo de amenazas parte de qué activos proteger y quién podría quererlos. En este sistema están los contratos de varios clientes, las credenciales de herramientas y las trazas. Las fronteras incluyen la entrada del usuario, los documentos recuperados, el modelo y las acciones que puede ejecutar.',
      decision: 'Documentar activos, actores y fronteras en un mapa simple. Colocar controles en cada punto: validación de entrada, filtro por tenant en recuperación, permisos en herramientas y validación de salida. Probar que un fallo en una capa no expone todo el sistema.',
      tradeoff: 'Un modelo de amenazas muy detallado puede quedar obsoleto y nadie lo lee. Demasiados controles añaden latencia y fricción. El riesgo residual siempre existe, así que hay que decidir explícitamente cuál se acepta.',
    },
    followups: [
      'Qué control evitaría que un fallo de recuperación exponga otro tenant?',
      'Cómo justificarías el riesgo residual que decides aceptar?',
    ],
    signal: 'Que piense en defensa en profundidad y en riesgo aceptado de forma consciente.',
  },
];
