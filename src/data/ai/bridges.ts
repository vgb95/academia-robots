import type { LessonBridge } from '../../types';

/**
 * Puentes de continuidad para el track AI.
 * Cubre las 136 lecciones reales (a0-a12 y a14-a16; no existe módulo a13).
 * Cada entrada explica por qué existe el tema, de dónde viene y qué pregunta
 * deja abierta para la siguiente lección, con nombres reales de lección.
 */
export const aiBridges: Record<string, LessonBridge> = {

  // ==================== a0: EL ROL DE AI ENGINEER ====================
  'a0-1': {
    why: "Este módulo arranca separando cuatro roles que el mercado mezcla constantemente porque el nombre del puesto decide qué se te exige en la entrevista y qué se te mide el primer día. Sin esa distinción, un SWE que viene a IA se pone a leer papers de arquitecturas cuando lo que le van a pedir es un RAG con evals. En producción, el AI Engineer es el dueño del sistema alrededor del modelo: calidad, latencia, coste y seguridad.",
    from: "Es la entrada al track: no hay lección previa, pero asume que ya sabes programar y desplegar software.",
    to: "¿Y qué capas forman ese sistema que hay que construir? La respuesta llega en 'El stack del AI Engineer', que convierte el rol en seis capas con interfaces estables.",
    analogy: "Es como elegir especialidad médica antes de entrar a la residencia: todos estudian el mismo tronco, pero el cirujano y el radiólogo se miden con escalas distintas."
  },
  'a0-2': {
    why: "Un recién llegado cambia de framework cada semana y no termina nada porque aprende herramientas sin entender el terreno. Pensar en capas —modelo, orquestación, retrieval, serving, evals y plataforma— permite sustituir una pieza sin reescribir todo el sistema. En producción la regla es invertir en lo que cambia despacio: interfaces, esquemas y pruebas, no en la librería de moda.",
    from: "Continúa 'AI Engineer vs ML Engineer vs Research vs MLOps': sabes qué optimizas; ahora ves dónde vive ese trabajo en la arquitectura.",
    to: "¿Cómo se conectan esas capas en una request real? 'Anatomía de un producto con LLM' recorre el pipeline entero y le pone un presupuesto de latencia a cada etapa.",
    analogy: "Es como el plano de un edificio: los tabiques cambian, pero fontanería, electricidad y cimientos son interfaces que no conviene mover cada mes."
  },
  'a0-3': {
    why: "La frase 'un prompt en un botón' es la causa de la mayoría de los incidentes de IA en producción: nadie validó la entrada, nadie puso guardrails y nadie midió tokens. Ver el producto como un pipeline con etapas y telemetría convierte una demo en un servicio con presupuesto medible. Un asistente solo se siente bien por debajo de ~1 s de TTFT y ~40 tokens/s, y eso se escribe como requisito el día 1.",
    from: "Retoma 'El stack del AI Engineer' y baja esas seis capas al recorrido concreto de una petición: input, retrieve, prompt, inferencia, postprocesado y observación.",
    to: "Vale, ya sabes qué construir, pero ¿qué de lo que ya sabes sirve y qué te falta? 'Migración desde SWE' traduce tus habilidades de software a criterio probabilístico.",
    analogy: "Es como la cadena de montaje de una cocina: entrada de pedido, preparación, cocción, emplatado y revisión; si falla la revisión, el plato no sale aunque esté bueno.",
    extraBlocks: [
      { type: "formula", expr: "Presupuesto total p95 = embedding+búsqueda (30-120 ms) + TTFT (200-800 ms) + generación (n_tokens / tok_s) + postprocesado (<50 ms)", explain: "Reparte el objetivo de 1 s entre etapas; si la generación de 300 tokens a 40 tok/s ya son 7,5 s, el presupuesto interactivo es imposible sin streaming o modelo más rápido." },
      { type: "tabla", headers: ["Etapa", "Sin medir", "Con medición en producción"], rows: [["Retrieval", "¿Trajo algo?", "Recall@k y latencia p95 por consulta"], ["Inferencia", "¿Respondió?", "TTFT, TPOT, tokens in/out"], ["Postprocesado", "¿Parseó?", "Tasa de fallo de esquema y coste"]] },
      { type: "apunte", title: "Matiz:", text: "La validación de salida va ANTES de responder, nunca después. Un esquema Pydantic roto es un error de negocio controlado; si se te escapa, es un 5xx y una respuesta inválida en el log." }
    ]
  },
  'a0-4': {
    why: "La mentalidad determinista es el lastre más caro de un SWE que llega a IA: espera que un test pase o falle y duda de una mejora del 3% por ruido. Necesitas tamaños de muestra, intervalos y comparaciones apareadas para decidir si un prompt es mejor. LinkedIn no lo dice, pero el primer objetivo técnico real es un harness de evals que corra en CI sobre un dataset congelado.",
    from: "Nace de 'Anatomía de un producto con LLM': ya conoces el pipeline; ahora cambias la unidad de medida de booleano a distribución.",
    to: "¿Y cómo se demuestra todo eso a un entrevistador? 'Cómo se entrevista un AI Engineer' describe las cuatro rondas y el formato de respuesta basado en evidencia.",
    analogy: "Es pasar de medir con un termómetro digital a leer una media móvil con banda de error: el número sigue existiendo, pero ahora va acompañado de incertidumbre."
  },
  'a0-5': {
    why: "El deep-dive de proyecto es la ronda donde más se improvisa y la que más pesa, porque obliga a defender decisiones bajo restricciones. Recitar la arquitectura del Transformer no demuestra criterio; explicar qué descartaste, qué métrica usaste y qué falló sí. En producción esa misma habilidad es la que te permite explicar un incidente sin buscar culpables.",
    from: "Cierra la idea de 'Migración desde SWE': la evals son la moneda; aquí aprendes a gastarla en una entrevista.",
    to: "Las entrevistas evalúan decisiones, y ésas dependen de elegir bien qué medir. 'Métricas de negocio vs métricas de modelo' separa el proxy del resultado real.",
    analogy: "Es como la defensa de un proyecto de fin de carrera: el tribunal no quiere la lista de librerías, quiere el porqué de cada decisión y el número que la respalda."
  },
  'a0-6': {
    why: "Un F1 que sube del 91% al 93% no significa nada si el coste por resolución se dispara: las métricas de modelo son proxies y el negocio quiere tickets resueltos y coste contenido. El trabajo del AI Engineer es construir la cadena modelo → sistema → negocio con una métrica puente calculable. Si optimizas solo ROUGE, el modelo aprende a copiar frases; ley de Goodhart aplicada a IA.",
    from: "Continúa 'Cómo se entrevista un AI Engineer': allí aprendiste a defender decisiones; aquí aprendes a elegir el número que las justifica ante el negocio.",
    to: "Pero decidir qué métrica importa exige saber distinguir evidencia de ruido. 'Cómo leer papers y documentación técnica' te da el método para extraer decisiones de diseño sin perderte en el método.",
    analogy: "Es como un panel de coche: el tacómetro es la métrica de modelo, el consumo real por kilómetro es la de negocio; mirar solo el primero te deja sin gasolina."
  },
  'a0-7': {
    why: "La mayoría de los papers se pueden descartar en diez minutos y los que importan se leen por una decisión concreta, no para memorizarlos. Leer abstract, figuras, tablas y limitaciones en ese orden evita semanas de study sin aplicación. En producción, una idea nueva es una hipótesis hasta que un eval diga que cambia tu sistema.",
    from: "Sigue a 'Métricas de negocio vs métricas de modelo': necesitas criterio para filtrar qué novedad merece entrar en tu dashboard.",
    to: "Ya tienes criterio y fuentes; falta cerrar el ciclo con algo desplegado. 'Tu primer sistema: del prompt al deployment' convierte todo lo anterior en siete días de trabajo concreto.",
    analogy: "Es como hojear un catálogo de recambios: miras la foto y la ficha técnica antes de desmontar el motor; el manual completo solo si la pieza encaja."
  },
  'a0-8': {
    why: "Cinco demos y ningún despliegue es el síntoma clásico de falta de criterio de terminado. Un proyecto pequeño pero completo —pregunta, flujo, métrica y despliegue— obliga a sentir todo el ciclo: dataset congelado, prompt versionado, API, trazas y README con números. La sección 'qué se rompió' es la única parte del portafolio que no se puede falsificar.",
    from: "Recoge 'Cómo leer papers y documentación técnica' y toda la sección anterior: por fin aplicas el filtro construyendo en vez de leyendo.",
    to: "El módulo se cierra, pero el sistema ya desplegado plantea la pregunta de fondo: ¿qué matemáticas sostienen esos números? 'Álgebra lineal: vectores y matrices' abre el bloque de fundamentos.",
    analogy: "Es como aprender a cocinar cerrando un menú completo y sirviéndolo, en lugar de coleccionar recetas que nunca ejecutaste.",
    extraBlocks: [
      { type: "pasos", items: [{ title: "Día 3 con número", text: "30 casos congelados, exactitud baseline 0.73; escribe el umbral 0.80 ANTES de tocar el prompt." }, { title: "Día 4 con número", text: "Añade retrieval y vuelve a medir: recall@5 0.88, exactitud 0.81; el gate se abre." }, { title: "Día 7", text: "README con p95 640 ms, coste 0.42 USD / 1M y tres fallos documentados." }] },
      { type: "nota", text: "Definir 'terminado' por adelantado es lo que evita el infinito 'ya casi está': sin umbral numérico, cualquier demo parece suficiente y ninguna es defendible." },
      { type: "formula", expr: "Criterio de terminado = despliegue ∧ dataset congelado ≥ 30 ∧ métrica medida ∧ README con números", explain: "Si falta alguno de los cuatro términos, el proyecto no está terminado aunque funcione una vez en local." }
    ]
  },

  // ==================== a1: MATEMÁTICAS QUE SÍ SE USAN ====================
  'a1-1': {
    why: "En ML todo es un arreglo y saber la forma de cada tensor es el 80% de depurar un modelo. Una observación es un vector, un lote es una matriz y un embedding es un vector de cientos de dimensiones. Los errores de eje son silenciosos: dan forma válida y resultado equivocado, justo el fallo que revienta un serving semanas después.",
    from: "Arranca el bloque de fundamentos después de 'Tu primer sistema: del prompt al deployment': ya tienes un sistema, ahora entiendes los arreglos que lo recorren.",
    to: "Con vectores y matrices ya puedes alinear dos cosas; pero ¿cuánto se parecen? 'Producto punto, similitud coseno y producto de matrices' convierte la geometría en ranking.",
    analogy: "Es como leer una tabla de Excel sabiendo siempre cuántas filas y columnas tiene: confundir filas por columnas no da error, da un informe plausible y falso."
  },
  'a1-2': {
    why: "La búsqueda vectorial de un RAG es exactamente esto: normalizar query y documentos, hacer un producto de matrices y quedarse con los k mayores. La similitud coseno ignora la magnitud y mide solo dirección, por eso es el estándar para embeddings de distinta norma. Entenderlo te permite depurar recuperación sin magia y recalibrar umbrales al cambiar de modelo.",
    from: "Viene de 'Álgebra lineal: vectores y matrices': aplicas el producto punto que ya sabes calcular a comparar un query contra N documentos.",
    to: "La similitud dice cuánto se parecen, pero no revela las direcciones de varianza de los datos. 'Autovalores, autovectores, SVD y PCA' abre esa geometría.",
    analogy: "Es comparar dos flechas por el ángulo que forman, no por su longitud: un puntero corto y uno largo pueden apuntar al mismo norte.",
    extraBlocks: [
      { type: "formula", expr: "cos(u,v) = (u·v) / (||u||·||v||) = û·v̂", explain: "Normalizar primero convierte N comparaciones en una sola multiplicación Dn @ qn y devuelve un valor en [-1,1]." },
      { type: "tabla", headers: ["Operación", "Coste con d=768", "Cuándo"], rows: [["1 query × 10k docs", "10k·768 ≈ 7.7M mult", "CPU en milisegundos"], ["1 query × 10M docs", "7.7 mil M mult", "Requiere HNSW/IVF"], ["Atención n=4096", "n²·d ≈ 12.9 mil M", "De ahí el coste de contexto largo"]] },
      { type: "apunte", title: "Matiz:", text: "Los umbrales de similitud no se transfieren entre modelos de embeddings: cambiar de proveedor reordena el espacio. Recalibra con 100 pares etiquetados antes de fijar 0.8 como corte." }
    ]
  },
  'a1-3': {
    why: "PCA y SVD aparecen cada vez que necesitas comprimir features, visualizar embeddings en 2D o entender colinealidad antes de entrenar. Un autovalor grande indica una dirección con mucha varianza; sin estandarizar, la feature con mayor magnitud domina los primeros componentes y el análisis miente. Es la base de LSA y de muchas inicializaciones eficientes de LoRA.",
    from: "Viene de 'Producto punto, similitud coseno y producto de matrices': la misma geometría de vectores se usa ahora para encontrar direcciones, no solo distancias.",
    to: "Las direcciones explican la forma de los datos, pero no cómo cambia una pérdida al mover un peso. 'Cálculo: derivadas, gradiente y regla de la cadena' introduce la sensibilidad.",
    analogy: "Es como estirar una manguera en distintos ángulos para ver por dónde se alarga más: el autovector es la dirección, el autovalor cuánto se estira."
  },
  'a1-4': {
    why: "El gradiente apunta a dónde crece la función y el entrenamiento va en dirección contraria; la regla de la cadena es literalmente backpropagation. Saber qué es ∂L/∂W te permite interpretar gradientes que explotan, se desvanecen o son cero por una activación saturada. Si implementas una capa propia, el gradient checking con diferencias finitas es su prueba unitaria.",
    from: "Continúa 'Autovalores, autovectores, SVD y PCA': pasas de analizar la forma de los datos a medir cómo responde una función ante cambios mínimos.",
    to: "El gradiente es una derivada, pero un clasificador devuelve confianza, no certeza. 'Probabilidad: condicional, Bayes y distribuciones' explica qué significa esa confianza.",
    analogy: "Es bajar una montaña con niebla sintiendo la pendiente bajo los pies: la derivada te dice hacia dónde cuesta menos, no dónde está el valle."
  },
  'a1-5': {
    why: "Un clasificador no devuelve 'gato', devuelve una distribución; entender probabilidad condicional es entender por qué esa confianza puede estar mal calibrada. El ejemplo de la prueba con 99% de sensibilidad sobre una prevalencia del 0.1% da solo ~1.9% de probabilidad de enfermedad: la tasa base domina. Bayes es la lente para leer falsos positivos y para entender RLHF en clave de prior, likelihood y posterior.",
    from: "Viene de 'Cálculo: derivadas, gradiente y regla de la cadena': la sensibilidad local se convierte ahora en incertidumbre sobre etiquetas.",
    to: "Bayes da la creencia de un caso, pero ¿cuánto fiarte de un promedio de 100 casos? 'Estadística: muestreo, varianza e inferencia' pone intervalos a esa confianza.",
    analogy: "Es un detector de incendios muy preciso en un almacén con apenas una llama: casi todas las alarmas serán falsas porque los sensores de humo son mayoría.",
    extraBlocks: [
      { type: "formula", expr: "P(enfermo | +) = sens·prev / (sens·prev + (1-esp)·(1-prev))", explain: "Con sens=0.99, esp=0.95, prev=0.001: 0.00099 / (0.00099 + 0.04995) ≈ 0.0187." },
      { type: "tabla", headers: ["Distribución", "Parámetro", "Aparece en"], rows: [["Bernoulli", "p", "Softmax binaria"], ["Normal", "μ, σ", "Inicialización de pesos"], ["Poisson", "λ", "Conteo de eventos raros"], ["Categorical", "vector p", "Softmax multiclase"]] },
      { type: "nota", text: "Matiz: la probabilidad que devuelve un LLM no está calibrada por defecto. Una temperatura de muestreo cambia la distribución de salida, no la confianza semántica; no las confundas en un eval." }
    ]
  },
  'a1-6': {
    why: "Un promedio sin incertidumbre no es información: 9/10 y 900/1000 dan la misma tasa con confianza muy distinta. Bootstrap y tests A/B son herramientas de trabajo diarias en evaluación de modelos. El error estándar cae con raíz de n, así que para reducirlo a la mitad necesitas cuatro veces más datos, y una mejora del 3% puede ser puro ruido.",
    from: "Viene de 'Probabilidad: condicional, Bayes y distribuciones': la creencia sobre un caso se convierte en inferencia sobre una muestra de casos.",
    to: "Saber medir incertidumbre es inútil si no puedes mover los parámetros. 'Optimización: descenso de gradiente y variantes' cierra el ciclo con la regla de actualización.",
    analogy: "Es pesar una moneda diez veces o mil: el promedio puede ser el mismo, pero con mil pesadas sabes si es trucada."
  },
  'a1-7': {
    why: "Toda la complejidad del entrenamiento —momento, lr adaptativo, warmup— es una forma de hacer estable el paso θ ← θ − η∇L. El learning rate es el hiperparámetro más importante: demasiado alto diverge y aparece NaN, demasiado bajo no converge. AdamW separa la regularización del gradiente adaptativo y es el default en transformers.",
    from: "Sigue a 'Estadística: muestreo, varianza e inferencia': ya sabes medir el error; ahora hay un algoritmo para reducirlo.",
    to: "El optimizador minimiza una pérdida, pero aún no has elegido qué pérdida minimizar. 'Teoría de la información: entropía, cross-entropy y KL' justifica la función de pérdida estándar.",
    analogy: "Es ajustar el paso al bajar una escalera: dar zancadas enormes te tiras al suelo; dar milímetros nunca llegas; el momento es inercia para no frenar en cada peldaño."
  },
  'a1-8': {
    why: "La cross-entropy es la pérdida estándar porque mide el coste de codificar la verdad con la distribución del modelo: −log de la probabilidad asignada a la clase correcta. Por eso un LLM entrena a minimizar la cross-entropy por token y la perplejidad es exp(CE). log_softmax evita el underflow numérico que tendrías calculando log(softmax(x)) directamente.",
    from: "Viene de 'Optimización: descenso de gradiente y variantes': ya tienes el motor; aquí defines la señal que el motor minimiza.",
    to: "Las fórmulas son correctas, pero ejecutarlas en un millón de elementos con bucles Python es inviable. 'NumPy avanzado: broadcasting, einsum y vectorización' cierra el módulo con rendimiento.",
    analogy: "Es como pagar una apuesta: si apostaste mucho a la respuesta correcta pagas poco; si le diste poquísima probabilidad, la penalización crece como el logaritmo de tu error."
  },
  'a1-9': {
    why: "Un bucle Python sobre un millón de elementos es órdenes de magnitud más lento que la misma operación vectorizada en C sobre memoria contigua. einsum permite escribir la atención escalada en una línea y la máscara causal con triu, que es exactamente lo que harás en PyTorch. Pero una atención de n=8192 con 32 heads guarda ~2 GB de scores en FP32: vectorizar sin medir memoria te lleva al OOM.",
    from: "Cierra 'Teoría de la información: entropía, cross-entropy y KL': conviertes la cross-entropy y la atención en operaciones de arreglos eficientes.",
    to: "Ya dominas las matemáticas y su ejecución; el siguiente paso es decidir qué señal de supervisión tiene sentido. 'Paradigmas de aprendizaje y el pipeline de ML' abre el bloque de ML.",
    analogy: "Es pasar de contar monedas una a una a pasarlas por una máquina contadora: misma operación, pero delegada a código nativo optimizado."
  },

  // ==================== a2: FUNDAMENTOS DE ML ====================
  'a2-1': {
    why: "Antes de elegir modelo hay que decidir qué señal de supervisión tienes: etiquetas por ejemplo, solo datos, o etiqueta derivada del propio dato. Los modelos clásicos siguen ganando en tabular y son el banco de pruebas de todo lo demás. Y el pipeline es el modelo: si el escalado vive fuera del objeto que despliegas, tus métricas de validación son optimistas y el servicio hará trampas sin querer.",
    from: "Viene de 'NumPy avanzado: broadcasting, einsum y vectorización': ya sabes ejecutar operaciones; ahora eliges qué problema aprender y con qué señal.",
    to: "Con el pipeline montado, la pregunta es qué consideramos equivocación. 'Funciones de pérdida y sesgo-varianza' elige el objetivo y diagnostica si el modelo sub- o sobre-ajusta.",
    analogy: "Es elegir el tipo de examen antes de dar clase: con respuestas marcadas es supervisado; sin ellas, el alumno se agrupa por afinidad; escondiendo palabras, se corrige solo."
  },
  'a2-2': {
    why: "La pérdida codifica qué cuenta como error: MSE castiga mucho los grandes errores, Huber es robusta a outliers y cross-entropy trabaja con probabilidades. Elegir mal la loss es elegir mal el objetivo, y ningún optimizador te salva de eso. La curva de validación, no la de entrenamiento, te dice si estás en sesgo alto o varianza alta.",
    from: "Continúa 'Paradigmas de aprendizaje y el pipeline de ML': ya hay datos y pipeline; falta definir la función que el entrenamiento minimizará.",
    to: "Definida la pérdida, ¿cómo se recorre realmente el dataset para minimizarla? 'Descenso de gradiente en la práctica' introduce mini-batches y la lectura de la curva de pérdida.",
    analogy: "Es elegir la regla del juego antes de jugar: si penalizas igual una falta de 1 cm que de 1 m, tu jugador aprenderá a cometer faltas grandes.",
    extraBlocks: [
      { type: "formula", expr: "MSE = (1/n)Σ(y−ŷ)²   |   Huber = ½e² si |e|<δ, δ|e|−½δ² si no", explain: "Con δ=1 y un outlier de e=10, MSE aporta 100 mientras Huber aporta 9.5: por eso Huber no se deja arrastrar por un solo dato corrupto." },
      { type: "tabla", headers: ["Situación", "Pérdida", "Diagnóstico"], rows: [["Train 72% / val 70%", "MSE", "Sesgo alto: sube complejidad"], ["Train 99% / val 78%", "MSE", "Varianza alta: regulariza"], ["Clases 1% positivas", "BCE + pesos", "La exactitud sería engañosa"]] },
      { type: "apunte", title: "Matiz:", text: "La pérdida y la métrica de negocio no son la misma cosa. Minimizar MSE optimiza el promedio de errores cuadrados; si tu coste real es asimétrico (falsos negativos carísimos), codifica esa asimetría en la loss o en el umbral de decisión." }
    ]
  },
  'a2-3': {
    why: "El gradiente exacto sobre todo el dataset es caro y SGD de un ejemplo es ruidoso; el mini-batch es el punto medio y es lo que se usa siempre. Olvidar zero_grad es el bug más común en bucles escritos a mano: PyTorch acumula gradientes por diseño y el modelo explota. En deep learning se razona en pasos, no en épocas, porque el paso es la unidad reproducible.",
    from: "Viene de 'Funciones de pérdida y sesgo-varianza': ya sabes qué minimizar; aquí eliges con cuántos ejemplos por paso lo minimizas.",
    to: "Un mini-batch ruidoso puede memorizar el entrenamiento. 'Regularización: controlar la varianza' presenta las herramientas para frenar ese sobre-ajuste.",
    analogy: "Es corregir un examen de 100 alumnos: mirar uno por uno es lento y errático, mirar los 100 de golpe es pesado; corregir en tandas de 32 es el equilibrio."
  },
  'a2-4': {
    why: "Regularizar es añadir una restricción que impide memorizar: L2 penaliza pesos grandes, L1 induce esparsidad, dropout inyecta ruido y early stopping corta antes del overfitting. Elegir la regularización correcta importa más que cambiar de arquitectura en datos tabulares. AdamW aplica weight decay como penalización separada; usar Adam con L2 acoplado puede degradar el modelo.",
    from: "Sigue a 'Descenso de gradiente en la práctica': el bucle ya actualiza pesos; ahora evitas que esos pesos se especialicen demasiado en el entrenamiento.",
    to: "Incluso con regularización, un esquema de validación mal diseñado produce números preciosos y un modelo que falla. 'Validación, cross-validation y data leakage' ataca ese fallo silencioso.",
    analogy: "Es entrenar con peso en los tobillos: corres un poco más lento, pero llegas al final con mejor técnica en lugar de quemarte en el primer sprint."
  },
  'a2-5': {
    why: "La validación estima rendimiento futuro y casi todos sus fallos son fugas de datos: normalizar con todo el dataset antes de dividir, o dejar el mismo documento en train y test. El scaler va dentro del Pipeline para que se ajuste solo con el fold de entrenamiento. Si el modelo supera con holgura lo que un humano podría hacer, o el score cae al cambiar la semilla, sospecha de leakage.",
    from: "Viene de 'Regularización: controlar la varianza': ya frenas el sobre-ajuste; ahora compruebas que tu forma de medirlo no esté contaminada.",
    to: "Con una validación limpia puedes por fin elegir métricas honestas. 'Métricas más allá de la exactitud' distingue precisión, recall y PR-AUC según el coste de cada error.",
    analogy: "Es dejar que el alumno vea el examen del año pasado antes de corregir el de hoy: la nota sube, pero no por saber más, sino por haber filtrado las respuestas."
  },
  'a2-6': {
    why: "Con el 1% de correos como spam, clasificar todo como no spam da 99% de exactitud y cero utilidad. Precisión, recall, F1, ROC-AUC y PR-AUC separan los tipos de error que importan según el negocio. El umbral de decisión es una decisión de negocio, no un valor por defecto: se ajusta en validación según el coste relativo de falsos positivos y falsos negativos.",
    from: "Continúa 'Validación, cross-validation y data leakage': con el esquema limpio, la métrica que elijas por fin significa lo que dice.",
    to: "Pero los modelos clásicos no aprenden representaciones: hay que darles buenas features. 'Feature engineering y preprocesado' es el mayor ganador en datos tabulares.",
    analogy: "Es un detector de humo: preferir pocas alarmas falsas (precisión) o no perderte ningún incendio (recall) cambia por completo dónde pones el sensor.",
    extraBlocks: [
      { type: "formula", expr: "F1 = 2·P·R/(P+R)   |   PR-AUC ≈ área bajo precisión-recall", explain: "Con 100 positivos, un modelo con TP=80, FP=20, FN=20 da P=0.80, R=0.80, F1=0.80; con FP=200 cae P a 0.29 y F1 a 0.43 aunque el recall siga siendo 0.80." },
      { type: "tabla", headers: ["Coste dominante", "Métrica", "Umbral típico"], rows: [["Falso positivo caro", "Precisión", "Alto (0.8)"], ["Falso negativo caro", "Recall", "Bajo (0.2)"], ["Clase rara", "PR-AUC", "Calibrado en val"]] },
      { type: "nota", text: "Matiz: ROC-AUC puede ser optimista con clases muy desbalanceadas porque el FPR se diluye en una inmensa clase negativa. En fraude o enfermedad rara, PR-AUC refleja mejor el rendimiento real." }
    ]
  },
  'a2-7': {
    why: "Los modelos clásicos no aprenden representaciones complejas: escalado, codificación categórica, imputación de nulos y features derivadas siguen siendo el mayor ganador en tabular. El ColumnTransformer mantiene cada transformación dentro del pipeline y evita fugas. Para texto e imágenes, el feature engineering moderno es un modelo preentrenado: usas embeddings y entrenas un clasificador encima.",
    from: "Viene de 'Métricas más allá de la exactitud': sabes qué medir; ahora construyes las entradas que harán que esa métrica suba de verdad.",
    to: "Con features listas, ¿qué modelo elegir? 'Árboles, Random Forest y XGBoost' presenta el rey indiscutible de los datos tabulares.",
    analogy: "Es afilar el cuchillo antes de cortar: un buen filete con un cuchillo malo y un mal filete con un cuchillo bueno dan resultados distintos; aquí el filo son las features."
  },
  'a2-8': {
    why: "Los árboles dividen el espacio en regiones, son no lineales y casi no necesitan escalado; el boosting combina árboles débiles de forma secuencial y sigue siendo SOTA en tabular. La ganancia de un split es la reducción de impureza, y la profundidad moderada con early stopping evita memorizar. feature_importances_ está sesgada hacia features de alta cardinalidad: para explicaciones fiables usa SHAP.",
    from: "Sigue a 'Feature engineering y preprocesado': ya tienes ColumnTransformer; ahora le pones encima un modelo que aproveche esas features sin escalarlas.",
    to: "El boosting supone que hay etiquetas. ¿Y cuando no las hay? 'SVM, clustering y PCA no supervisado' cierra el módulo explorando estructura sin supervisión.",
    analogy: "Es un árbol de decisiones de un juego de veinte preguntas: cada nodo divide a los sospechosos en dos grupos, y cada hoja da la respuesta final.",
    extraBlocks: [
      { type: "formula", expr: "Ganancia = impureza(padre) − [p_izq·impureza(izq) + p_der·impureza(der)]", explain: "Si el padre tiene Gini 0.50 y dos hijos de Gini 0.20 con pesos 0.6 y 0.4, la ganancia es 0.50 − (0.12+0.08) = 0.30." },
      { type: "tabla", headers: ["Modelo", "Fortaleza", "Debilidad"], rows: [["Decision Tree", "Interpretable", "Inestable"], ["Random Forest", "Robusto y paralelo", "Menos preciso"], ["XGBoost / LightGBM", "SOTA tabular", "Más hiperparámetros"]] },
      { type: "apunte", title: "Matiz:", text: "max_depth=20 con 500 árboles no es 'más potente': es memorizar. Empieza con depth 5, lr 0.05 y early_stopping_rounds=30; deja que la validación decida cuándo parar." }
    ]
  },
  'a2-9': {
    why: "No todo problema tiene etiquetas: el clustering agrupa por similitud, PCA revela estructura de baja dimensión y SVM encuentra un hiperplano de margen máximo. KMeans asume grupos esféricos y de tamaño similar; con densidades irregulares, DBSCAN o HDBSCAN hacen mejor trabajo. Sin etiquetas la validación es contextual: ¿los grupos son útiles para una decisión, no 'la verdad'?",
    from: "Cierra 'Árboles, Random Forest y XGBoost': cuando no hay etiquetas que el boosting pueda aprender, cambias de paradigma y buscas estructura por distancia.",
    to: "Hasta ahora las capas son lineales o de árbol. 'Perceptrón, MLP y activaciones' abre el deep learning apilando no linealidades aprendidas.",
    analogy: "Es ordenar una caja de tuercas sin catálogo: las agrupas por forma y tamaño, y solo después decides si esos montones sirven para armar algo."
  },

  // ==================== a3: DEEP LEARNING ====================
  'a3-1': {
    why: "Una neurona calcula z = w·x + b y aplica una no linealidad; apilar capas permite aproximar funciones complejas. Sin activación no lineal, un MLP de 100 capas sería equivalente a una sola regresión lineal: la composición de lineales es lineal. ReLU muere si recibe siempre entradas negativas; GELU y SwiGLU son el default en Transformers modernos.",
    from: "Viene de 'SVM, clustering y PCA no supervisado': dejas de elegir el kernel a mano y dejas que la red aprenda su propia representación no lineal.",
    to: "Apilar capas solo sirve si sabes mover los pesos: 'Backpropagation y grafo computacional' explica cómo fluyen los gradientes hacia atrás.",
    analogy: "Es soldar eslabones: si todos son varillas rectas, por muchos que pongas sigues teniendo una varilla recta; necesitas codos para dar forma."
  },
  'a3-2': {
    why: "Backpropagation aplica la regla de la cadena desde la pérdida hacia atrás reutilizando derivadas intermedias; PyTorch construye un grafo dinámico en el forward y lo recorre en el backward. Como los gradientes se suman en .grad, hay que limpiarlos con zero_grad en cada paso, y esa acumulación es útil a propósito para gradient accumulation. Entender el grafo es la diferencia entre entrenar y copiar un snippet.",
    from: "Sigue a 'Perceptrón, MLP y activaciones': ya tienes la arquitectura; ahora conectas cada capa con la señal que la ajusta.",
    to: "Con gradientes fluyendo, una mala inicialización los hace explotar o desvanecerse. 'Inicialización y normalización' estabiliza la señal a través de la profundidad.",
    analogy: "Es el juego del teléfono roto al revés: el error vuelve de boca en boca hacia el principio, y cada eslabón multiplica la sensibilidad que recibe."
  },
  'a3-3': {
    why: "Una mala inicialización hace que las activaciones crezcan o se contraigan exponencialmente con la profundidad; Xavier y He escalan la varianza según el número de entradas. Los Transformers usan LayerNorm porque es independiente del batch y determinista en inferencia, y RMSNorm es la variante barata estándar en LLaMA y Mistral. Inicializar todos los pesos a cero rompe la simetría y todas las neuronas aprenden lo mismo.",
    from: "Viene de 'Backpropagation y grafo computacional': el gradiente ya fluye; ahora evitas que se desvanezca o explote por la escala inicial de los pesos.",
    to: "Estabilizada la señal, queda decidir cómo de grande es el paso de actualización. 'Optimizadores y scheduling' configura AdamW, warmup y decay.",
    analogy: "Es arrancar un coche en cuarta marcha: el motor está bien, pero el primer impulso es tan brusco que se cala; la inicialización es la marcha correcta."
  },
  'a3-4': {
    why: "AdamW es el optimizador por defecto en transformers y el learning rate casi nunca es constante: se calienta para estabilizar los primeros pasos y decae para afinar la convergencia. Para fine-tuning de LLM, 1e-5 a 2e-4 con warmup del 3% de los pasos es un buen default. Si no sabes por dónde empezar, copiar esa receta y medir la loss es mejor que improvisar.",
    from: "Continúa 'Inicialización y normalización': con la señal estable, ahora regulas el tamaño del paso y su evolución en el tiempo.",
    to: "El optimizador funciona sobre cualquier arquitectura; pero ¿qué arquitectura conviene para imagen o para secuencia? 'CNN: convolución, pooling y arquitecturas' abre el recorrido por dominios.",
    analogy: "Es el acelerador de un coche en una salida: arrancas suave (warmup), pisas a fondo en la recta (lr alto) y sueltas antes de la curva (decay)."
  },
  'a3-5': {
    why: "Una convolución desliza un kernel pequeño compartiendo pesos en cada posición: eso da equivarianza translacional y mucha menos parametrización que una capa densa. De píxeles a bordes, texturas, partes y objetos, las CNN dominaron visión hasta que ViT y los modelos multimodales las desplazaron. Siguen en backbones eficientes y en edge por su coste computacional.",
    from: "Viene de 'Optimizadores y scheduling': ya sabes entrenar; ahora eliges la estructura inductive bias adecuada para datos con geometría espacial.",
    to: "Las CNN comparten pesos en el espacio, pero no mantienen memoria de pasos. 'RNN, LSTM y GRU' introduce el estado recurrente para secuencias.",
    analogy: "Es pasar una lupa pequeña por un mural: la misma lupa detecta el mismo borde en cualquier esquina, sin necesidad de una lupa distinta por cada punto."
  },
  'a3-6': {
    why: "Una RNN mantiene un estado oculto h paso a paso, pero en secuencias largas los gradientes se desvanecen y la red olvida el principio. Las LSTM añaden compuertas de forget, input y output que crean un camino de gradiente casi lineal. Son secuenciales y se paralelizan mal en GPU; sobreviven en edge y series temporales pequeñas.",
    from: "Sigue a 'CNN: convolución, pooling y arquitecturas': pasas de compartir pesos en el espacio a compartirlos en el tiempo.",
    to: "El estado de una RNN se reescribe en cada paso y pierde información. 'Embeddings: de tokens a vectores' introduce la representación que luego la atención sabrá consultar sin olvidar.",
    analogy: "Es leer un libro subrayando solo la última página: recuerdas el final, pero el argumento del primer capítulo se te escapó; las compuertas son notas al margen que conservas."
  },
  'a3-7': {
    why: "Un embedding es una tabla de búsqueda: a cada id de token le corresponde un vector entrenable, y es la forma en que un modelo discretiza el lenguaje en un espacio continuo con geometría con significado. Sin embeddings de posición, el modelo no sabe el orden. El vocabulario grande domina la memoria: 50k tokens × 4096 dims son ~200M parámetros solo en la tabla.",
    from: "Viene de 'RNN, LSTM y GRU': sustituyes ese estado frágil por vectores que el modelo puede consultar y posicionar.",
    to: "Con tokens ya vectorizados, falta que cada uno mire a los demás: 'Attention y el bloque Transformer' es el corazón del módulo y del track entero.",
    analogy: "Es un diccionario donde cada palabra no define otra palabra, sino un punto en un mapa: las palabras cercanas en el mapa significan cosas parecidas."
  },
  'a3-8': {
    why: "La atención permite que cada token mire a todos los demás y decida cuánto peso darles: es paralela y escala mejor que la RNN, con coste cuadrático en la longitud del contexto. Attention(Q,K,V) = softmax(QKᵀ/√d)V, donde √d evita que el softmax sature con gradientes casi nulos. La máscara causal garantiza que un token no atienda al futuro, y el FFN concentra ~2/3 de los parámetros.",
    from: "Viene de 'Embeddings: de tokens a vectores': los vectores ya existen; aquí defines cómo se miran entre sí dentro de un bloque.",
    to: "El bloque Transformer funciona en papel, pero entrenarlo o servirlo exige gestionar memoria y GPU. 'Entrenamiento eficiente en GPU' cierra el módulo con mixed precision y gradient accumulation.",
    analogy: "Es una reunión donde cada asistente puede preguntar a todos los demás antes de hablar: el peso de la atención decide a quién escucha más para formar su respuesta.",
    extraBlocks: [
      { type: "formula", expr: "Attention(Q,K,V) = softmax(QKᵀ / √d_k) V", explain: "Con d_k=64 y scores sin escalar con varianza ~64, el softmax se satura: dividir por 8 mantiene la entropía y el gradiente vivo." },
      { type: "tabla", headers: ["Componente", "Parámetros típicos", "Función"], rows: [["Multi-head", "8-32 heads", "Relaciones distintas en paralelo"], ["Masked", "triu(1)", "Bloquea tokens futuros"], ["Residual + Norm", "RMSNorm", "Estabiliza 32-80 capas"], ["FFN", "~2/3 del modelo", "MLP por token con SwiGLU"]] },
      { type: "apunte", title: "Matiz:", text: "Coste O(T²): duplicar el contexto de 4k a 8k cuadruplica la matriz de scores. Por eso la ventana de contexto es una decisión de producto con impacto directo en latencia y VRAM, no solo un número del config." }
    ]
  },
  'a3-9': {
    why: "Entrenar en GPU no es mover tensores a .cuda(): el cuello puede ser el data loader, la memoria o el ancho de banda, y saber medirlo es parte del trabajo. BF16 tiene el mismo rango que FP32 con menos precisión y evita el underflow de FP16 en GPUs Ampere+. Regla rápida: 2 bytes por parámetro en BF16, un modelo de 7B son ~14 GB solo en pesos y 60-80 GB para entrenarlo entero.",
    from: "Cierra 'Attention y el bloque Transformer': el bloque ya está definido; ahora lo haces entrenable en hardware real sin OOM ni GPU al 30%.",
    to: "Con la GPU dominada, el modelo aún recibe texto como caracteres. 'Tokenización: el contrato entre texto y modelo' abre el bloque de LLMs por la primera milla del pipeline.",
    analogy: "Es optimizar una línea de producción: comprar una máquina más rápida no sirve si quien le pasa las piezas va a la velocidad de un caracol."
  },

  // ==================== a4: LLMs ====================
  'a4-1': {
    why: "El modelo no ve caracteres ni palabras, ve ids de tokens, y BPE fusiona secuencias frecuentes de caracteres en subpalabras. El tokenizador define la unidad con la que facturan, miden contexto y se traducen idiomas: en español una palabra suele ser 1-3 tokens. Cambiar de tokenizador puede encarecer un texto 30% aunque parezca idéntico, y 128k tokens no son 128k palabras.",
    from: "Viene de 'Entrenamiento eficiente en GPU': ya sabes mover tensores; ahora conviertes el texto de entrada en los ids que esos tensores esperan.",
    to: "Con los ids definidos, la pregunta es qué arquitectura los procesa y con qué objetivo. 'Arquitectura y pretraining' describe el decoder-only y el language modeling autorregresivo.",
    analogy: "Es el tamaño de las piezas de un puzzle: el mismo dibujo tiene 100 piezas grandes o 1000 pequeñas; el coste de montarlo depende de esa decisión, no del dibujo.",
    extraBlocks: [
      { type: "tabla", headers: ["Modelo", "Vocabulario", "Consecuencia"], rows: [["GPT-2", "50k", "Más tokens en español"], ["LLaMA 3", "128k", "Mejor compresión multilingüe"], ["GPT-4o", "~200k", "Menos tokens por texto"]] },
      { type: "formula", expr: "coste ≈ tokens(texto, tokenizador exacto) · precio_por_token", explain: "Un texto de 1000 palabras puede ser 1400 tokens en un tokenizador y 1900 en otro: la diferencia del 35% se paga cada request y se repite en el historial de chat." },
      { type: "apunte", title: "Matiz:", text: "El context window se mide en tokens, no en caracteres. Cuenta siempre con el tokenizador exacto del modelo que vas a servir; una estimación por caracteres es la causa clásica del error 'prompt cabe pero excede contexto'." }
    ]
  },
  'a4-2': {
    why: "La mayoría de LLMs modernos son Transformers decoder-only: apilan atención enmascarada y FFN con pre-norm RMSNorm, posiciones RoPE y activación SwiGLU. El objetivo es predecir el siguiente token, sin etiquetas humanas: cada token supervisa al anterior. Pretraining desde cero cuesta millones, así que un equipo de producto gasta su presupuesto en SFT y evals, no en replicar un modelo base.",
    from: "Viene de 'Tokenización: el contrato entre texto y modelo': los ids ya existen; aquí se apilan los bloques que los consumen y se define la pérdida de language modeling.",
    to: "El modelo base continúa texto, pero no sigue instrucciones. 'Supervised Fine-Tuning (SFT)' lo convierte en un asistente con formato de chat.",
    analogy: "Es un niño que ha leído toda la biblioteca y sabe continuar cualquier frase: sabe mucho, pero aún no entiende que le estás pidiendo un resumen en dos líneas."
  },
  'a4-3': {
    why: "El SFT convierte un modelo que continúa texto en un asistente que sigue instrucciones, entrenando con pares instrucción-respuesta y enmascarando la pérdida del prompt. Mil ejemplos bien curados superan a cien mil mediocres: inconsistencias de formato y respuestas ambiguas se aprenden igual de bien que las correctas. El formato de chat con tokens especiales es parte del contrato; cambiarlo sin reentrenar rompe el modelo.",
    from: "Viene de 'Arquitectura y pretraining': el modelo base ya existe; ahora le enseñas el formato de interacción que tu producto necesita.",
    to: "El SFT completo actualiza todos los pesos y no cabe en una GPU modesta. 'LoRA y QLoRA: ajuste eficiente' entrena menos del 0.1% de los parámetros con casi la misma calidad.",
    analogy: "Es enseñar modales a alguien que ya sabe el tema: no le cambias lo que sabe, le cambias la forma de responder cuando le haces una pregunta."
  },
  'a4-4': {
    why: "LoRA congela los pesos y entrena dos matrices pequeñas A y B cuyo producto BA se suma a cada capa: con rango 16 se entrena menos del 0.1% de los parámetros. QLoRA añade NF4 en 4 bits y doble cuantización para meter un 70B en ~48 GB. Guardas solo adaptadores de cientos de MB en vez de cientos de GB, y eso cambia por completo la economía del fine-tuning.",
    from: "Viene de 'Supervised Fine-Tuning (SFT)': misma señal de entrenamiento, pero ahora congelas el modelo base y entrenas solo la corrección de bajo rango.",
    to: "SFT enseña formato, pero no preferencias: el modelo puede ser correcto y aún así sonar mal o ser poco útil. 'RLHF y DPO: alineación' ataca esa capa.",
    analogy: "Es ponerle gafas graduadas a un modelo en lugar de operarlo: no cambias su cerebro, cambias una capa delgada que corrige cómo ve.",
    extraBlocks: [
      { type: "formula", expr: "W' = W + (α/r)·B·A,  A ∈ R^(r×k), B ∈ R^(d×r), r ≪ d", explain: "En un 70B con d=k=4096 y r=16, cada adaptador tiene 16·4096·2 ≈ 131k parámetros; en 7 capas y 4 proyecciones son ~37M, el 0.05% del total." },
      { type: "tabla", headers: ["Método", "Memoria 70B", "Trainable", "Uso"], rows: [["Full fine-tune", ">500 GB", "100%", "Laboratorios"], ["LoRA BF16", "~160 GB", "<0.1%", "Servidor único"], ["QLoRA NF4", "~48 GB", "<0.1%", "GPU consumidor"]] },
      { type: "apunte", title: "Matiz:", text: "NF4 es para ENTRENAR con QLoRA; AWQ o GPTQ son para SERVIR. Mezclarlos es el error frecuente: la cuantización de entrenamiento y la de inferencia persiguen objetivos distintos y no son intercambiables." }
    ]
  },
  'a4-5': {
    why: "SFT enseña formato; la alineación enseña preferencias. RLHF entrena un reward model con comparaciones humanas y optimiza con PPO, mientras DPO salta el reward model y optimiza directamente sobre pares chosen y rejected. El cuello de botella no es el algoritmo sino el dataset de preferencias: qué se considera mejor y por qué. Sin monitorizar la KL, DPO puede degradar la calidad general.",
    from: "Viene de 'LoRA y QLoRA: ajuste eficiente': cuando el formato ya está resuelto, el siguiente salto de calidad es comportamental, no de parámetros.",
    to: "Alineado el modelo, queda la interfaz con el usuario. 'Prompting y structured output' convierte instrucciones y esquemas en algo que tu código puede consumir sin parsear texto a mano.",
    analogy: "Es la diferencia entre enseñar a alguien a rellar un formulario y enseñarle a elegir la respuesta que un cliente preferiría leer; la segunda necesita comparaciones, no ejemplos correctos."
  },
  'a4-6': {
    why: "El prompt es código: se versiona, se testea y se despliega, porque un cambio de una palabra altera el comportamiento y hay que poder compararlo y hacer rollback. Un buen prompt define rol, contexto, formato, ejemplos y restricciones, y deja poco a la interpretación. Los structured outputs restringen la decodificación a un esquema JSON válido y eliminan el parseo manual de texto.",
    from: "Viene de 'RLHF y DPO: alineación': el modelo ya quiere agradar; ahora le dices exactamente en qué forma y con qué restricciones debe hacerlo.",
    to: "Con salidas validadas, aún falta conocimiento que el modelo no tiene en sus pesos. 'RAG completo: de la pregunta a la respuesta citada' separa conocimiento de razonamiento.",
    analogy: "Es la diferencia entre decir 'escribe algo sobre esto' y entregar una plantilla con los campos, el máximo de palabras y qué hacer si falta información: la segunda no admite interpretación libre."
  },
  'a4-7': {
    why: "RAG separa conocimiento (en tus documentos) de razonamiento (en el modelo): ingieres, divides en trozos, indexas como vectores y recuperas los más relevantes para responder con citas. Si falla la respuesta, primero miras si el trozo correcto fue recuperado; si no está, es problema de embedding o chunking, y si está, es problema de prompt. Subir k por si acaso mete ruido y distrae al modelo: mide recall@k y elige el k mínimo.",
    from: "Viene de 'Prompting y structured output': ya sabes construir la instrucción y validar la salida; ahora le das al modelo información que no está en sus pesos.",
    to: "El pipeline funciona, pero la capa de recuperación aún es una caja negra. 'Embeddings, vector DBs y reranking' abre esa caja y decide qué ve exactamente el modelo.",
    analogy: "Es un abogado que no memoriza el código: consulta los tomos relevantes antes de responder, y la cita al pie es la prueba de que no se inventó el articulado.",
    extraBlocks: [
      { type: "tabla", headers: ["Métrica", "Pregunta", "Dónde falla"], rows: [["Recall@5", "¿Está el trozo bueno arriba?", "Chunking / embedding"], ["MRR / nDCG", "¿Está bien ordenado?", "Ranking"], ["Faithfulness", "¿Se apoya en el contexto?", "Prompt / modelo"]] },
      { type: "formula", expr: "chunk_size ≈ 600 tokens, overlap ≈ 10-20%", explain: "Con 600 tokens y solape de 100, un documento de 3000 tokens genera ≈ 6 trozos: suficiente contexto local sin diluir la señal en 128k de ruido." },
      { type: "apunte", title: "Matiz:", text: "Depura por capas, nunca de golpe. Si el trozo correcto no aparece, cambiar el prompt no sirve de nada; mide recuperación primero y generación después. Mezclar ambas capas es la causa más común de semanas perdidas en un RAG." }
    ]
  },
  'a4-8': {
    why: "La capa de recuperación decide qué ve el modelo: la búsqueda densa aporta semántica y BM25 aporta precisiones exactas de nombres y códigos. Un cross-encoder de reranking reordena el top-50 a top-5 con más precisión, aunque sea más lento. Cambiar de modelo de embeddings obliga a reindexar TODO el corpus y recalibrar umbrales, así que conviene elegir uno y quedarse.",
    from: "Viene de 'RAG completo: de la pregunta a la respuesta citada': el pipeline ya existe; aquí afinas el retrieval que antes tratabas como una caja negra.",
    to: "Recuperar texto aún no es actuar sobre el mundo. 'Tool calling, MCP y context engineering' conecta al modelo con funciones reales y trata la ventana como memoria escasa.",
    analogy: "Es buscar en una biblioteca: primero el índice por tema (densa), luego el catálogo por título exacto (léxica) y al final leer de verdad los cinco libros finalistas (rerank)."
  },
  'a4-9': {
    why: "Un agente es un modelo que puede llamar funciones: defines herramientas con esquemas, el modelo decide cuándo invocarlas y tu código ejecuta la llamada con permisos y validación. MCP estandariza esa conexión entre aplicaciones y sistemas externos. El context engineering trata la ventana como RAM escasa: carga solo lo relevante y usa prompt caching para la parte inmutable.",
    from: "Cierra 'Embeddings, vector DBs y reranking': el modelo ya sabe leer información externa; ahora le das manos para modificar el mundo.",
    to: "Con herramientas disponibles, el siguiente paso es el bucle de generación: 'Generación autorregresiva y muestreo' explica cómo se produce token a token cada respuesta y cada llamada.",
    analogy: "Es pasar de un consejero que solo puede hablar a un operador con un panel de botones: los botones son tools, y quién puede pulsarlos es la política de permisos.",
    extraBlocks: [
      { type: "tabla", headers: ["Concepto", "Qué es", "Riesgo"], rows: [["Tool calling", "El modelo emite una llamada con args", "Argumentos inválidos"], ["MCP", "Protocolo estándar de herramientas", "Server malicioso"], ["Context engineering", "Decidir qué entra en la ventana", "Ruido y coste"]] },
      { type: "formula", expr: "coste por tarea ≈ (tokens_contexto + tokens_salida) · precio · turnos", explain: "Un system prompt de 1500 tokens repetido en 20 turnos son 30k tokens de entrada: moverlo al prefijo cacheable reduce hasta un 90% ese coste." },
      { type: "nota", text: "Matiz: prompt caching exige que el prefijo sea byte-idéntico. Un timestamp o un id aleatorio al principio del system prompt invalida todos los bloques posteriores y el ahorro desaparece." }
    ]
  },

  // ==================== a5: INFERENCIA Y SERVING ====================
  'a5-1': {
    why: "Generar es repetir: el modelo produce logits, se muestrea, se añade el token al contexto y se vuelve a ejecutar. La temperatura escala los logits antes del softmax: T bajo afila la distribución para tareas factuales y T alto la aplana para redacción. Greedy no siempre es mejor: produce texto seguro pero plano y a veces repetitivo.",
    from: "Viene de 'Tool calling, MCP y context engineering': cada turno del agente, cada tool call y cada respuesta se generan con este bucle.",
    to: "Ese bucle recalcula todo el historial en cada token, lo que sería O(n²). 'KV cache: el truco que hace viable el chat' evita recalcular claves y valores anteriores.",
    analogy: "Es escribir una carta letra por letra releyéndola entera cada vez: funciona para diez letras, pero se vuelve imposible al llegar a la página tres."
  },
  'a5-2': {
    why: "Las claves y valores de tokens anteriores no cambian al generar uno nuevo; guardarlos convierte O(n²) en O(n) por token y es lo que hace viable el chat. La KV cache crece con contexto y concurrencia, y suele agotar la VRAM antes que los pesos. En Llama-3-8B BF16 son ~128 KB por token: 8192 tokens son ~2 GB por secuencia y 100 secuencias ~160 GB.",
    from: "Viene de 'Generación autorregresiva y muestreo': eliminas el recálculo que el bucle autorregresivo hacía en cada paso.",
    to: "Con la KV cache identificada como cuello de botella, dos palancas la atacan: menos bits por peso y menos recálculo. 'Cuantización: FP16, INT8 e INT4' es la primera.",
    analogy: "Es tomar apuntes en clase en vez de volver a escuchar el audio desde el principio antes de cada nueva pregunta: el cuaderno es la caché y ocupa espacio en la mesa.",
    extraBlocks: [
      { type: "formula", expr: "Memoria KV = 2 · capas · tokens · heads_kv · d_head · bytes", explain: "Llama-3-8B: 2·32·8192·8·128·2 bytes ≈ 1.07 GB por secuencia a 8k; con GQA los 8 KV heads (frente a 32 de atención) son los que hacen el número asumible." },
      { type: "tabla", headers: ["Contexto", "KV (8B BF16)", "Implicación"], rows: [["2k tokens", "0.5 GB", "Barato"], ["8k tokens", "2 GB", "Normal"], ["128k tokens", "32 GB", "Una sola secuencia gigante"]] },
      { type: "apunte", title: "Matiz:", text: "La KV cache es VRAM, no RAM. Un modelo puede anunciar 128k de contexto en su config y ser inviable en tu hardware por la caché aunque los pesos quepan con holgura." }
    ]
  },
  'a5-3': {
    why: "Cuantizar reduce los bits por peso: FP16 son 2 bytes, INT8 1 byte e INT4 0.5 bytes. Menos memoria permite modelos más grandes en menos GPU y más ancho de banda para generar tokens más rápido. Lo habitual es W4A16 —pesos en 4 bits, activaciones y KV cache en 16—; cuantizar también activaciones exige calibración y soporte de hardware.",
    from: "Viene de 'KV cache: el truco que hace viable el chat': liberas VRAM reduciendo el tamaño de los pesos para dejar más sitio a la caché.",
    to: "Otra forma de no desperdiciar pasadas de GPU es proponer varios tokens y verificarlos a la vez. 'Speculative decoding' ataca la velocidad sin tocar la precisión.",
    analogy: "Es comprimir el equipaje: metes la misma ropa en maletas más pequeñas, con un poco de arrugado aceptable, y te cabe todo en el coche."
  },
  'a5-4': {
    why: "El decoding especulativo usa un modelo pequeño para proponer 4-8 tokens y el grande para verificarlos en una sola pasada: si acierta, ahorra pasadas costosas; si no, descarta desde el primer rechazo. Es lossless, la salida sigue la distribución del modelo grande. Con aceptación α=0.7 y k=5 se salta ~2.8 tokens por pasada, un 2-3x; con T>1 la aceptación cae y el speedup se desvanece.",
    from: "Viene de 'Cuantización: FP16, INT8 e INT4': aunque los pesos sean más baratos de leer, seguimos haciendo una pasada por token; esto reduce el número de pasadas.",
    to: "Incluso con menos pasadas, una GPU ociosa entre requests desperdicia capacidad. 'Batching y scheduling de inferencia' decide qué secuencias entran y salen en cada paso.",
    analogy: "Es un ayudante que adelanta el trabajo escribiendo los párrafos probables y el jefe revisándolos de un vistazo: si acierta, se ahorra escribirlos todos; si falla, se tira desde la primera línea mala.",
    extraBlocks: [
      { type: "formula", expr: "E[tokens por pasada] = (1 − α^(k+1)) / (1 − α)", explain: "Con α=0.7 y k=5: (1−0.7^6)/0.3 ≈ (1−0.1176)/0.3 ≈ 2.94 tokens por pasada; con α=0.5 solo ~1.97." },
      { type: "tabla", headers: ["Aceptación", "Tokens/pasada (k=5)", "Speedup"], rows: [["0.5", "~1.97", "1.4-1.7x"], ["0.7", "~2.94", "2.0-2.4x"], ["0.9", "~4.69", "3.0-3.5x"]] },
      { type: "nota", text: "Matiz: con temperatura alta cae la aceptación porque el draft acierta menos. En resumen con T=0 se llega a 3x; en texto creativo puede quedarse en 1.2x e incluso ser más lento por el overhead." }
    ]
  },
  'a5-5': {
    why: "Agrupar requests aumenta el throughput porque las GPUs son más eficientes con matrices grandes, pero el static batching espera a la secuencia más larga y penaliza a las cortas. El continuous batching reasigna slots en cada paso de decodificación. TTFT y TPOT compiten: optimizar uno puede empeorar el otro, y un batch demasiado grande llena la KV cache y dispara el p99 por preemptions.",
    from: "Viene de 'Speculative decoding': has reducido el trabajo por token; ahora llenas la GPU con más peticiones simultáneas sin arruinar la latencia.",
    to: "Estas decisiones de scheduling no se tocan a mano: las implementa un motor. 'Motores de serving: vLLM, TGI y llama.cpp' elige quién las ejecuta por ti.",
    analogy: "Es un restaurante que no espera a que la mesa más lenta termine para servir a las demás: en cuanto un plato sale, ese hueco se ocupa con el siguiente pedido."
  },
  'a5-6': {
    why: "El motor de serving separa el modelo de tu aplicación: gestiona tokenización, KV cache, batching, cuantización y protocolo HTTP. Elegirlo bien puede multiplicar el throughput por 5 sin cambiar el checkpoint. vLLM destaca con PagedAttention, continuous batching y API compatible con OpenAI, lo que permite cambiar backend sin tocar el cliente.",
    from: "Viene de 'Batching y scheduling de inferencia': ahora encapsulas esas políticas en un motor en lugar de reimplementarlas en tu servicio.",
    to: "Con el motor elegido, aún hay que responder una pregunta económica: ¿cuánto cuesta cada token servido? 'Latencia, throughput y coste por token' cierra el círculo.",
    analogy: "Es contratar a un camarero profesional en vez de que cada cocinero sirva su propio plato: el mismo menú, pero el servicio va mucho más rápido y nadie se pisa."
  },
  'a5-7': {
    why: "Servir LLMs es un problema económico: cada token cuesta GPU-tiempo y el precio por millón depende del modelo, hardware, utilización y batching. Regla rápida: con una GPU al 20% de ocupación, el coste por token se multiplica por cinco. El streaming no reduce el coste total, solo mejora la latencia percibida; no lo confundas con optimización de throughput.",
    from: "Viene de 'Motores de serving: vLLM, TGI y llama.cpp': ya tienes el motor; ahora pones precio a cada token que produce.",
    to: "El coste depende del hardware disponible y de dónde corra el modelo. 'GPU, memoria y despliegue en edge' cierra el módulo llevando inferencia al dispositivo.",
    analogy: "Es alquilar una furgoneta por hora: si va media vacía, cada paquete que llevas cuesta el doble; llenarla es la palanca, no negociar el precio por hora."
  },
  'a5-8': {
    why: "No toda la inferencia ocurre en un clúster: modelos pequeños y cuantizados corren en CPUs, NPUs y navegadores. La decisión depende de privacidad, latencia, coste y conectividad: los datos no salen, no hay viaje de red y el coste marginal por request es cero. A cambio pierdes capacidad de razonamiento y tienes que gestionar actualizaciones del modelo en cada dispositivo.",
    from: "Cierra 'Latencia, throughput y coste por token': si el coste o la privacidad mandan, te llevas el modelo al dispositivo en vez de al clúster.",
    to: "El sistema ya sirve respuestas, pero nadie ha demostrado todavía que sean correctas. 'Diseño de evals: datasets y métricas' abre el bloque de calidad con la misma disciplina de medición.",
    analogy: "Es tener una calculadora en el bolsillo en vez de llamar a una oficina por teléfono: respondes al instante y sin contar tu número a nadie, pero no puedes consultar una enciclopedia entera."
  },

  // ==================== a6: EVALUACIÓN, SEGURIDAD Y CONFIABILIDAD ====================
  'a6-1': {
    why: "Sin evals, mejorar un prompt es adivinar. Un eval es un conjunto de casos con criterios de éxito que se ejecuta de forma repetible, con datos reales, casos difíciles y bordes, congelado y versionado. Un promedio del 95% puede esconder un 40% en español o en preguntas numéricas: reporta por categoría y el peor caso. Separa el eval de componente del end-to-end para saber dónde está el fallo.",
    from: "Viene de 'GPU, memoria y despliegue en edge': ya tienes un sistema desplegado en algún sitio; ahora demuestras que funciona antes de fiarte de él.",
    to: "Cuando la respuesta correcta no es única —resúmenes, tono, utilidad— hace falta un juez. 'LLM-as-judge y benchmarks' escala la evaluación y advierte de sus sesgos.",
    analogy: "Es un banco de pruebas con muestras congeladas: cambias el motor, lo vuelves a pasar por el banco y comparas; sin muestras fijas solo tienes opiniones.",
    extraBlocks: [
      { type: "formula", expr: "SE ≈ s/√n   →   para halvar el error estándar hacen falta 4× casos", explain: "Pasar de 100 a 400 casos reduce el SE a la mitad: por eso una mejora del 3% sobre 50 preguntas no es evidencia, es ruido." },
      { type: "tabla", headers: ["Nivel", "Pregunta", "Cuándo te avisa"], rows: [["Componente", "¿Trajo el trozo correcto?", "Antes de culpar al prompt"], ["End-to-end", "¿Fue correcta la respuesta?", "Antes de publicar"]] },
      { type: "apunte", title: "Matiz:", text: "Reporta por segmento. Un 95% global puede esconder un 40% en español o en preguntas numéricas; estratifica por idioma, dificultad y categoría desde el primer dataset." }
    ]
  },
  'a6-2': {
    why: "Cuando no existe una única respuesta correcta se usa otro LLM con una rúbrica: es barato y escalable, pero prefiere respuestas largas, su propio estilo y la opción que aparece primero. Antes de fiarte, compara 100 juicios con anotación humana y mide acuerdo con kappa. Los benchmarks públicos se contaminan porque los modelos se entrenan con ellos: úsalos como señal burda, nunca como prueba de tu caso de uso.",
    from: "Sigue a 'Diseño de evals: datasets y métricas': el dataset congelado ya existe; aquí automatizas la puntuación de lo que no se puede regex.",
    to: "Un juez fiable mide respuestas, pero no evita que el modelo se invente datos. 'Alucinaciones y grounding' ataca la causa de las afirmaciones infundadas.",
    analogy: "Es un corrector de exámenes que se cansa y premia las redacciones más largas: por eso le das una rúbrica anclada y comparas sus notas con las de un profesor humano."
  },
  'a6-3': {
    why: "Una alucinación es una afirmación fluida pero infundada, consecuencia de entrenar para producir texto plausible: se mitiga, no se elimina con una flag. Hay alucinaciones intrínsecas, extrínsecas y factuales, y cada una tiene una defensa distinta. Enseñar al modelo a decir 'no lo sé' es una feature: si la tasa de abstención es casi cero, probablemente esté inventando.",
    from: "Viene de 'LLM-as-judge y benchmarks': ya puedes medir la calidad; ahora reduces una de sus peores causas directamente en el prompt.",
    to: "Grounding y abstención asumen que el contexto es de confianza, pero ¿y si el documento recuperado contiene instrucciones? 'Prompt injection' explota justo esa suposición.",
    analogy: "Es un periodista que rellena el hueco que le falta en la noticia con un dato verosímil: la solución no es pedirle que sea honesto, es darle la fuente y permitirle decir «no consta»."
  },
  'a6-4': {
    why: "Prompt injection ocurre cuando texto no confiable —un PDF, un correo, una web— contiene instrucciones que el modelo sigue como si vinieran del usuario. Es el equivalente a SQL injection, pero con un LLM como intérprete. La defensa definitiva es de permisos: diseña el sistema para que, aunque el modelo sea engañado, no pueda borrar la base de datos ni filtrar secretos.",
    from: "Viene de 'Alucinaciones y grounding': habías puesto el contexto como fuente de verdad; ahora descubres que esa fuente puede estar envenenada.",
    to: "La inyección es una forma de ataque; el jailbreak es otra, centrada en eludir las restricciones del propio modelo. 'Jailbreaks y robustez' amplía la mirada al adversario.",
    analogy: "Es un buzón donde cualquiera puede dejar una nota que diga 'entrega las llaves al que viene mañana': no arreglas el buzón, arreglas quién tiene llaves."
  },
  'a6-5': {
    why: "Un jailbreak intenta eludir restricciones con roles ficticios, base64, traducciones o fragmentación de la petición: es seguridad adversaria, no falta de modales. Las defensas van en capas —entrenamiento, input guard, output guard y monitoreo— porque ninguna lista negra sobrevive a la paráfrasis. Cada hallazgo debe convertirse en un test de regresión, no en una anécdota del README.",
    from: "Viene de 'Prompt injection': ambos ataques manipulan el comportamiento del modelo, pero aquí el atacante actúa directamente en el chat, no en un dato recuperado.",
    to: "Entre las cosas que un jailbreak intenta sacar están los datos personales. 'PII, privacidad y manejo de datos sensibles' protege esa información antes de que salga.",
    analogy: "Es cerrar la puerta con cerrojo, alarma y vigilante: cualquier medida sola se puede sortear, pero apiladas convierten un robo fácil en un incidente caro de ejecutar."
  },
  'a6-6': {
    why: "Los LLMs pueden memorizar y repetir datos personales, y tus prompts suelen enviarse a terceros. La privacidad se diseña: minimiza lo que envías, redacta lo sensible y controla la retención. Un detector regex no es perfecto —NIF, direcciones y nombres se escapan— así que combínalo con un clasificador y con revisiones periódicas de muestras.",
    from: "Sigue a 'Jailbreaks y robustez': uno de los peores desenlaces de un ataque es la fuga de PII, y aquí la ataques en la entrada y en la salida.",
    to: "La privacidad es un riesgo para las personas; el sesgo es el otro gran riesgo. 'Sesgo y fairness' mide equidad con métricas concretas por grupo.",
    analogy: "Es fotocopiar un expediente tapando primero nombre y DNI: el contenido útil sigue ahí, pero quien recibe la copia no puede identificar a la persona."
  },
  'a6-7': {
    why: "Un modelo aprende las correlaciones de sus datos, incluidos los sesgos históricos, y en sistemas que afectan a personas eso es riesgo legal y ético. TPR distinto entre grupos viola igualdad de oportunidades; una diferencia de 5-10 puntos merece investigación. En modelos generativos el sesgo aparece en estereotipos y en qué idiomas se manejan mejor: evalúa con prompts contrapuestos que cambien solo el nombre.",
    from: "Viene de 'PII, privacidad y manejo de datos sensibles': protegiste la identidad; ahora proteges la equidad de las decisiones que afectan a esas personas.",
    to: "Para corregir un sesgo antes necesitas ver qué hace el modelo y el sistema. 'Interpretabilidad y observabilidad' cierra el módulo haciendo auditable cada decisión.",
    analogy: "Es revisar la báscula de un supermercado con varios pesos patrón: si siempre da de más con un tipo de producto, no es el cliente, es la calibración."
  },
  'a6-8': {
    why: "Si no puedes explicar por qué el modelo hizo algo, no puedes arreglarlo ni auditarlo. La interpretabilidad entiende el modelo y la observabilidad entiende el sistema, y son complementarias. Sin registrar versión de modelo y prompt, tokens, coste, latencia y documentos recuperados, un incidente es imposible de reconstruir. Las attention maps son pistas de depuración, no explicaciones causales.",
    from: "Cierra 'Sesgo y fairness' y todo el bloque de seguridad: la auditoría necesita trazas, y las trazas son la base del MLOps que viene.",
    to: "Esas trazas hay que producirlas, versionarlas y automatizarlas. 'Experiment tracking' abre el bloque de MLOps con la corrida como unidad de evidencia.",
    analogy: "Es la caja negra de un avión: no evita el incidente, pero sin ella nunca sabrás si falló el motor, el piloto o el combustible.",
    extraBlocks: [
      { type: "tabla", headers: ["Técnica", "Nivel", "Aporta"], rows: [["SHAP / LIME", "Modelos clásicos", "Contribución por feature"], ["Logprobs", "LLM", "Confianza por token"], ["Trazas", "Sistema", "Prompt, retrieval, tools, coste"]] },
      { type: "formula", expr: "traza completa = modelo + prompt_version + tokens_in/out + coste + latencia_por_etapa + docs_recuperados", explain: "Si falta prompt_version, el mismo modelo con otro prompt es un sistema distinto y la regresión no se puede reconstruir." },
      { type: "nota", text: "Matiz: las attention maps no son explicaciones causales. Que un token reciba atención no prueba que causara la salida; úsalas como pista de depuración, no como verdad." }
    ]
  },

  // ==================== a7: MLOPS Y PLATAFORMA ====================
  'a7-1': {
    why: "Un experimento no es un archivo final_v3_real.py: es una corrida con parámetros, métricas, artefactos y código versionados. Sin tracking no puedes responder qué modelo estaba en producción el martes. Asocia cada run al hash de Git y al hash del dataset; parámetros sin código no son reproducibles, y registrar cientos de métricas por step solo dificulta comparar.",
    from: "Viene de 'Interpretabilidad y observabilidad': la traza en producción tiene su equivalente en entrenamiento: la corrida de experimento.",
    to: "La corrida referencia un dataset y un checkpoint; si son archivos de 200 GB, Git no los guarda. 'Versionado de datos y modelos' resuelve ese problema con punteros y registros.",
    analogy: "Es el cuaderno de laboratorio: no basta con el resultado, hace falta la fecha, los reactivos exactos y la receta para repetirlo dentro de seis meses."
  },
  'a7-2': {
    why: "Git versiona código, pero no un dataset de 200 GB ni un checkpoint de 140 GB. DVC guarda punteros y hashes en Git y el contenido en almacenamiento externo; el registro de modelos gestiona estados y aprobaciones. Versionar el dataset no es guardar el archivo: faltan esquema, semilla de división y transformaciones, y la misma versión produce features distintas.",
    from: "Viene de 'Experiment tracking': ya registras qué corriste; ahora haces que los datos y el artefacto sean identificables de forma inequívoca.",
    to: "Con datos y modelos versionados, falta que las features se calculen igual en entrenamiento y en request. 'Feature stores' ataca el training-serving skew.",
    analogy: "Es un archivo con fichas de préstamo en vez de libros gigantes en la mesa: la ficha dice dónde está el libro y qué edición es, sin copiar la enciclopedia."
  },
  'a7-3': {
    why: "Un feature store centraliza cálculo y servicio de features para que la misma definición se use en entrenamiento e inferencia. El skew aparece cuando la feature se calcula distinto en el batch y en el request en línea, y se agrava con fugas temporales: usar datos del futuro respecto al evento que predices. No hace falta si tus features ya viven en tu base y no hay skew; añade complejidad sin beneficio.",
    from: "Viene de 'Versionado de datos y modelos': la versión del dataset ya es estable; ahora garantizas que la definición de cada feature también lo sea.",
    to: "Con datos, features y modelos bajo control, el siguiente paso es automatizar el recorrido completo. 'Pipelines y CI/CD para IA' convierte el ciclo en un flujo con puertas.",
    analogy: "Es una receta maestra en la cocina: la misma bacteria para el plato de prueba y para el servicio, en vez de que cada cocinero mida 'un puñado' distinto."
  },
  'a7-4': {
    why: "Un pipeline de ML conecta ingesta, validación, entrenamiento, evaluación, registro y despliegue, con una puerta adicional: el artefacto solo se promueve si pasa evals y umbrales. El artefacto que se prueba es el que se despliega, así que se empaqueta en una imagen con modelo y código dentro. Separa CI rápido de CD de modelos: no entrenes en cada push.",
    from: "Viene de 'Feature stores': ya hay definiciones consistentes; ahora automatizas el flujo que las consume y decides cuándo promover un modelo.",
    to: "Promover no es publicar a todos de golpe. 'Estrategias de deployment' decide cómo exponer la nueva versión sin degradar a los usuarios.",
    analogy: "Es una línea de montaje con un inspector antes de la salida: si el producto no pasa el control de calidad, no sale de la fábrica, por mucho que el equipo quiera enviarlo.",
    extraBlocks: [
      { type: "codigo", lang: "yaml", code: "- name: Evals de regresión\n  run: python -m evals.run --dataset evals/v1.json --baseline main\n- name: Puerta de calidad\n  run: python evals/gate.py --min-accuracy 0.84 --max-p95-ms 900", title: "Gate en CI" },
      { type: "tabla", headers: ["Etapa", "Frecuencia", "Coste"], rows: [["CI rápido", "Cada push", "Bajo: lint y evals unitarios"], ["CD de modelo", "Programado / manual", "Alto: entrenamiento completo"]] },
      { type: "apunte", title: "Matiz:", text: "El artefacto que se prueba es el que se despliega: genera una imagen Docker con modelo y código dentro. Reconstruir 'lo mismo' con pip install sin pins es receta para incidentes." }
    ]
  },
  'a7-5': {
    why: "Desplegar un modelo es cambiar un componente probabilístico: una mala versión puede degradar respuestas sin lanzar ninguna excepción. Por eso importan las estrategias graduales —blue-green, canary, shadow y A/B— y un rollback que sea cambiar una etiqueta o un peso, no reconstruir nada. En sistemas con memoria o caché semántica, un cambio de modelo puede invalidar datos cacheados: versiona la caché por modelo.",
    from: "Viene de 'Pipelines y CI/CD para IA': el gate ya filtró; ahora decides a cuántos usuarios expones la versión que pasó.",
    to: "Esa exposición gradual necesita infraestructura real. 'Kubernetes y Docker para IA' empaqueta el servicio y gestiona recursos, sondas y escalado.",
    analogy: "Es estrenar un nuevo sabor en 20 tiendas antes que en toda la cadena: si las quejas suben, retiras el sabor sin haber afectado a todo el país."
  },
  'a7-6': {
    why: "Entrenamiento e inferencia tienen perfiles distintos: uno es batch y tolera interrupciones; el otro es en línea y necesita disponibilidad. En Kubernetes, requests y limits reservan GPU y RAM, readinessProbe decide cuándo el modelo ya cargó y livenessProbe reinicia si está colgado. Fija siempre la versión de la imagen: :latest con imagePullPolicy Always puede hacer que pods distintos corran modelos distintos.",
    from: "Viene de 'Estrategias de deployment': el canary y el blue-green necesitan pods que arranquen de forma predecible y con la versión correcta.",
    to: "Con el servicio corriendo, queda detectar cuándo el mundo cambia. 'Monitoreo, drift y alertas' vigila que el modelo siga siendo válido con el tiempo.",
    analogy: "Es mudarse a un piso con contrato de suministros claros: sabes cuánta luz tienes contratada y cuándo el ascensor está listo, en vez de descubrirlo en el primer día."
  },
  'a7-7': {
    why: "El mundo cambia y el modelo no: el data drift cambia la distribución de entradas y el concept drift cambia la relación entrada-salida. KS o PSI por feature detectan el primero; una caída de exactitud, el segundo. Cuando la verdad llega tarde o nunca, usa señales proxy —abstenciones, reintentos, correcciones del usuario— como indicadores tempranos calibrados contra episodios reales.",
    from: "Viene de 'Kubernetes y Docker para IA': la plataforma ya observa el servicio; ahora vigila que su comportamiento siga siendo correcto meses después.",
    to: "Monitorear cuesta dinero y la factura de IA crece rápido. 'Costes, FinOps y gobierno' cierra el bloque haciendo visible y atribuible cada gasto.",
    analogy: "Es pesar a un perro cada semana: un cambio brusco de peso no dice la causa, pero te avisa de que algo pasó antes de que el veterinario lo vea.",
    extraBlocks: [
      { type: "formula", expr: "KS = max_x |F_ref(x) − F_prod(x)|   |   p-valor < 0.01 ⇒ alerta", explain: "Con 1000 muestras de referencia y 1000 de producción, un KS de 0.08 ya suele ser significativo: mide distancia entre distribuciones, no diferencia de medias." },
      { type: "tabla", headers: ["Señal", "Detecta", "Acción"], rows: [["KS / PSI por feature", "Data drift", "Inspeccionar causa"], ["Caída de exactitud", "Concept drift", "Reentrenar"], ["Subida de p99", "Saturación", "Escalar"]] },
      { type: "apunte", title: "Matiz:", text: "Sin etiquetas inmediatas usa proxies —abstenciones, reintentos, correcciones, tiempo hasta resolver— y calíbralos contra episodios reales. Alertar por cada desviación genera fatiga y acaba ignorándose." }
    ]
  },
  'a7-8': {
    why: "La factura de IA crece con GPU, tokens de API, storage vectorial y trazas. FinOps hace visible el coste, lo atribuye por equipo y lo optimiza sin matar la experimentación. El mayor ahorro suele ser elegir bien el modelo —enrutador de SLM y frontier— y el más olvidado es la ocupación real del servidor. Gobierno también es documentación: model card, usos previstos y limitaciones.",
    from: "Cierra 'Monitoreo, drift y alertas': monitorizas calidad y latencia; ahora monitorizas el dinero que esa calidad cuesta.",
    to: "El bloque de plataforma termina, pero el track se abre a capacidades nuevas. 'Modelos visión-lenguaje (VLM)' introduce la multimodalidad conectando píxeles con tokens.",
    analogy: "Es la factura de la luz desglosada por habitación: hasta que ves quién gasta, cualquier intento de ahorrar es solo apagar luces al azar."
  },

  // ==================== a8: TEMAS AVANZADOS Y MULTIMODALES ====================
  'a8-1': {
    why: "Un VLM codifica imágenes en tokens y los concatena con los de texto mediante una capa de proyección que alinea ambos espacios de embeddings. Esa proyección es la pieza crítica: sin ella el LLM no tiene idea de qué significan los features visuales. Los VLM alucinan objetos en imágenes borrosas o con texto pequeño, así que en tareas críticas conviene combinarlos con un detector clásico y validar con IoU.",
    from: "Viene de 'Costes, FinOps y gobierno': el track ya sabe medir y desplegar texto; ahora amplías la entrada a píxeles sin perder ese rigor.",
    to: "Los VLM entienden imágenes, pero no las generan. 'Modelos de difusión' cambia de dirección: del análisis a la creación de contenido visual.",
    analogy: "Es un intérprete que traduce las sensaciones de una cámara al idioma que el LLM entiende: la imagen no habla, pero la proyección le da voz."
  },
  'a8-2': {
    why: "Un modelo de difusión aprende a revertir un proceso que añade ruido: entrena prediciendo el ruido ε y genera partiendo de ruido puro. Difundir en píxeles sería carísimo, así que Stable Diffusion lo hace en el espacio latente de un VAE, de 64×64 en vez de 512×512. Es decenas de pasos por imagen, mucho más lento que un forward de clasificación: en producción se destila a menos pasos.",
    from: "Viene de 'Modelos visión-lenguaje (VLM)': pasas de interpretar imágenes a sintetizarlas con la misma idea de representación comprimida.",
    to: "La imagen es un canal; el audio es otro y suele ir en tiempo real. 'ASR y TTS: voz en el pipeline' añade habla y escucha con presupuesto de latencia propio.",
    analogy: "Es restaurar una foto borrosa capa a capa: en cada paso quitas un poco de grano, y después de treinta pasos aparece la imagen nítida."
  },
  'a8-3': {
    why: "ASR convierte voz en texto y TTS convierte texto en voz, con un LLM en medio que decide qué decir. En un asistente de voz el objetivo es menos de 500 ms de respuesta percibida, así que se encadena VAD, ASR streaming, LLM streaming y TTS streaming y se empieza a hablar antes de tener la frase completa. WER empeora con acentos y ruido: evalúa con audio real de usuarios, no de estudio.",
    from: "Viene de 'Modelos de difusión': añades otro modal, el audio, con la diferencia de que aquí el reloj corre en tiempo real.",
    to: "La voz es una forma de entrada; otra forma de usar modelos es decidir qué mostrar a cada usuario. 'Sistemas recomendadores' introduce el ranking y la retroalimentación.",
    analogy: "Es una cadena de traducción simultánea: escuchas unas palabras, empiezas a traducir antes de que terminen y hablas mientras el siguiente traductor escucha."
  },
  'a8-4': {
    why: "Un recomendador predice qué le gustará a alguien con una arquitectura de dos etapas: recuperación barata de candidatos y ranking preciso sobre unos pocos. Los LLMs aportan semántica del contenido, y el cold-start de usuarios o ítems nuevos se resuelve con features de contenido e embeddings, el mismo problema que el retrieval de un RAG. Optimizar solo CTR lleva a contenido sensacionalista: añade diversidad y satisfacción a largo plazo.",
    from: "Viene de 'ASR y TTS: voz en el pipeline': otra interfaz con el usuario, ahora centrada en qué contenido elegir para él.",
    to: "Los recomendadores optimizan una recompensa observable (clics). 'Reinforcement learning' generaliza esa idea de optimizar una señal actuando en un entorno.",
    analogy: "Es un camarero que recuerda lo que pediste antes, te ofrece tres opciones por el nombre y luego elige la que mejor pinta; sin historial, se guía por la descripción del plato."
  },
  'a8-5': {
    why: "RL entrena un agente para maximizar recompensa en un MDP: estados, acciones, transiciones, recompensas y descuento γ. En LLMs aparece como RLHF, que ya viste en a4. PPO domina porque limita el tamaño de cada actualización de la política con clipping y es estable con minibatches reutilizados. Es sample-ineficiente y muy sensible a la recompensa: si puedes resolver con supervisión, hazlo.",
    from: "Viene de 'Sistemas recomendadores': la recompensa pasa de ser un clic a ser una señal de consecuencias de actuar, y se formaliza como MDP.",
    to: "RL entrena políticas; otra forma de obtener un modelo pequeño y capaz es transferir lo que ya sabe uno grande. 'Destilación de modelos' cierra esa idea.",
    analogy: "Es entrenar a un perro con premios: no le dices el camino exacto, solo le das un hueso cuando se acerca; el problema es que se ingeniará cualquier atajo para conseguirlo.",
    extraBlocks: [
      { type: "formula", expr: "Q(s,a) = E[r + γ·max_a' Q(s',a')]", explain: "Con γ=0.9, una recompensa de 1 dentro de 10 pasos vale 0.9^10 ≈ 0.35 hoy; con γ=0.5 vale 0.001: el descuento decide si el agente es paciente o miope." },
      { type: "tabla", headers: ["Algoritmo", "Tipo", "Uso"], rows: [["Q-learning", "Value-based", "Acciones discretas"], ["DQN", "Deep value", "Atari, control"], ["REINFORCE", "Policy gradient", "Base de PPO"], ["PPO", "Policy gradient estable", "RLHF, robótica"]] },
      { type: "apunte", title: "Matiz:", text: "La recompensa dispersa es el enemigo: si el único +1 llega al final de 100 pasos, el agente no aprende nada durante horas. Usa reward shaping o pasa a PPO con ventaja; RL es la última opción, no la primera." }
    ]
  },
  'a8-6': {
    why: "Destilar entrena un modelo pequeño para imitar a uno grande, y la señal más rica son los logits suaves: no solo cuál es la clase correcta, sino cuánta probabilidad reparte el teacher entre las alternativas. La temperatura suaviza la distribución y revela esa estructura. Hoy, destilar en LLMs significa generar datos con el teacher y hacer SFT sobre ellos, a veces con preferencias para DPO.",
    from: "Viene de 'Reinforcement learning': ya sabes optimizar una señal de recompensa; aquí la señal es la propia distribución del modelo grande.",
    to: "El resultado de destilar suelen ser modelos pequeños. 'Small Language Models (SLM)' decide cuándo esa capacidad es suficiente y cuándo no.",
    analogy: "Es un aprendiz que no copia las respuestas del maestro, sino que estudia cuánto dudaba el maestro entre cada opción: esa duda contiene más información que el acierto."
  },
  'a8-7': {
    why: "Los SLM de 1B a 8B parámetros manejan tareas acotadas —clasificación, extracción, resumen corto, tool calling simple— por una fracción del coste y en hardware modesto. Un enrutador decide por dificultad: clasificación corta al modelo barato y razonamiento largo al frontier. La decisión es coste-beneficio validada con evals por nivel; un router mal calibrado ahorra dinero pero rompe la experiencia.",
    from: "Viene de 'Destilación de modelos': la destilación produce SLMs competitivos; aquí decides en qué casos son la elección correcta.",
    to: "Si además quieres que corran sin servidor ni red, el siguiente paso es llevarlos al dispositivo. 'IA en el navegador y on-device' cierra el módulo.",
    analogy: "Es elegir entre ir en bici o en coche: para el pan de la esquina la bici es más rápida y gratis; para cruzar el país necesitas el coche."
  },
  'a8-8': {
    why: "La inferencia en el navegador ya es real: WebGPU da acceso a la GPU, WebAssembly ejecuta kernels y ONNX Runtime Web o Transformers.js cargan modelos cuantizados. Privacidad, latencia y coste de servidor cero a cambio de capacidad limitada. Cargar un modelo de 7B es posible pero la descarga y la RAM suelen ser prohibitivos; versiona el artefacto porque el caché del navegador puede actualizarse sin control.",
    from: "Viene de 'Small Language Models (SLM)': reduce el modelo hasta que cabe en un cliente, y ahora lo ejecutas sin depender de la red.",
    to: "El track ya cubre muchas capacidades; ahora vuelve a lo práctico: orquestarlas en bucles que actúan. 'ReAct: razonar y actuar en bucle' abre el bloque de agentes.",
    analogy: "Es llevar la calculadora, el diccionario y la receta en el bolsillo: no consultas a nadie y respondes al instante, pero no puedes cargar toda la biblioteca."
  },

  // ==================== a9: SISTEMAS DE AGENTES EN PRODUCCIÓN ====================
  'a9-1': {
    why: "ReAct alterna razonamiento en lenguaje natural con llamadas a herramientas: piensa, actúa, observa y decide el siguiente paso. Es el patrón base de casi todos los agentes, pero consume muchos tokens y necesita un max_iterations porque sin límite puede entrar en bucle y quemar presupuesto indefinidamente. Para tareas deterministas, una cadena fija es más barata y predecible: usa agente solo cuando el camino no se conoce de antemano.",
    from: "Viene de 'IA en el navegador y on-device': las herramientas ya existen en todas partes; ahora automatizamos cuándo usarlas sin supervisión paso a paso.",
    to: "ReAct reevalúa el plan en cada acción, lo que es caro en tareas largas. 'Plan-and-execute' separa planificar de ejecutar para ahorrar llamadas.",
    analogy: "Es un mecánico que dice en voz alta qué va a mirar, mira, comenta el resultado y decide: transparente y flexible, pero si no le pones un límite se queda hurgando media vida.",
    extraBlocks: [
      { type: "tabla", headers: ["Elemento", "Papel", "Fallo típico"], rows: [["Thought", "Plan del siguiente paso", "Razonamiento circular"], ["Action", "Llamada a herramienta", "Argumentos inválidos"], ["Observation", "Resultado devuelto", "Salida demasiado larga"], ["Stop", "Condición de término", "Nunca termina"]] },
      { type: "formula", expr: "coste por tarea ≈ (tokens_pensamiento + tokens_observación) · precio · iteraciones", explain: "Con 8 iteraciones y 1200 tokens por vuelta son 9600 tokens: un agente que repite la misma observación cinco veces quintuplica la factura sin añadir información." },
      { type: "apunte", title: "Matiz:", text: "max_iterations no es una opción de rendimiento, es un cortocircuito de seguridad. Añade también detección de acciones repetidas y un fallback elegante; un agente en bucle no falla con excepción, falla gastando dinero." }
    ]
  },
  'a9-2': {
    why: "En plan-and-execute un planner descompone el objetivo y un executor ejecuta los pasos; es más eficiente que ReAct en tareas largas porque no reevalúa el plan en cada acción. Los planes rígidos fallan en entornos cambiantes, así que hace falta replanificación desde el estado actual y un presupuesto máximo de pasos. Compensa con más de cinco pasos y dependencias claras.",
    from: "Viene de 'ReAct: razonar y actuar en bucle': eliminas la reevaluación constante separando dos roles con responsabilidades distintas.",
    to: "Planificar y ejecutar mejora la eficiencia, pero el resultado final puede ser mejorable sin cambiar el plan. 'Reflection y self-critique' añade un bucle de revisión.",
    analogy: "Es la diferencia entre improvisar la ruta mirando el mapa en cada esquina y trazar el itinerario en casa: si cortan una calle, solo recalculas esa parte."
  },
  'a9-3': {
    why: "Reflection pide al modelo que critique su salida y luego la mejore, y funciona bien en escritura, código y planes, pero el modelo es complaciente: preguntar '¿está bien?' casi siempre da 'sí'. Necesita una rúbrica externa o evidencia verificable —¿compila?, ¿cumple el esquema?, ¿cita una fuente existente?—. Cada vuelta multiplica tokens y latencia: mide si la calidad mejora de verdad en tu eval.",
    from: "Viene de 'Plan-and-execute': una vez ejecutado el plan, sometes el resultado a crítica antes de darlo por bueno.",
    to: "La crítica necesita contexto de intentos anteriores para no repetir errores. 'Memoria de agentes' introduce lo que el agente recuerda entre turnos y sesiones.",
    analogy: "Es revisar un código pidiendo '¿hay bugs?': te dirán que no; pidiendo '¿compila y pasa los tests?' obtienes una respuesta que se puede comprobar.",
    extraBlocks: [
      { type: "tabla", headers: ["Variante", "Idea", "Riesgo"], rows: [["Self-refine", "Criticar y reescribir", "Auto-complacencia"], ["Critic externo", "Otro modelo o reglas", "Coste doble"], ["Verificación con tools", "Compilar y ejecutar tests", "No siempre disponible"]] },
      { type: "formula", expr: "coste reflexión ≈ salida · (1 + 2 · intentos)", explain: "Dos vueltas de crítica y reescritura triplican los tokens: si la calidad no sube en el eval, un solo paso con buena rúbrica es la decisión correcta." },
      { type: "apunte", title: "Matiz:", text: "La crítica necesita anclaje verificable. Pregunta ¿compila?, ¿cumple el esquema?, ¿cita una fuente existente? La evidencia vence a la opinión del propio modelo." }
    ]
  },
  'a9-4': {
    why: "Un agente necesita memoria de la sesión, hechos duraderos y episodios pasados; mal gestionada contamina el contexto y perpetúa errores. No guardes cada mensaje como recuerdo: extrae hechos estables, verifícalos y guarda la fuente, porque un recuerdo erróneo repetido en cada sesión es un sesgo permanente. La memoria es además un vector de ataque: filtra lo que se escribe y deja al usuario inspeccionar y borrar.",
    from: "Viene de 'Reflection y self-critique': para que la crítica sirva, el agente debe recordar qué se corrigió y por qué.",
    to: "Un agente con memoria ya es sofisticado, pero aún es uno solo. 'Sistemas multi-agente' reparte trabajo entre especialistas con costes y ruido propios.",
    analogy: "Es un diario de trabajo: si anotas cada ocurrencia como si fuera un hecho, acabas creyéndote tu propio error de hace tres semanas."
  },
  'a9-5': {
    why: "Un sistema multi-agente reparte trabajo entre investigador, planificador, codificador y revisor coordinados por un orquestador. Es útil con tareas heterogéneas y paralelizables, pero cada agente duplica contexto y llamadas: un sistema de cinco puede costar 5-10x uno solo. Muchos problemas que parecen pedir multi-agente se resuelven con un agente y buenas herramientas: añade especialistas solo si puedes medir la ganancia.",
    from: "Viene de 'Memoria de agentes': la memoria ya es compartible; ahora decides quién la escribe y quién la lee en un equipo de agentes.",
    to: "Coordinar especialistas exige algo más rígido que un bucle while. 'Orquestación con estado y grafos' modela nodos, aristas y checkpoints explícitos.",
    analogy: "Es pasar de un fontanero todo terreno a un equipo con electricista y albañil: útil en una reforma grande, absurdo para cambiar un grifo."
  },
  'a9-6': {
    why: "En producción un agente es una máquina de estados, no un bucle while: los grafos hacen explícitos nodos, aristas, condiciones y estado persistente, lo que permite depurar y reanudar. Con checkpoints puedes inspeccionar dónde falló, repetir un nodo y auditar la decisión. Los bucles necesitan contador de pasos y condición de salida comprobable o acabarás quemando tokens.",
    from: "Viene de 'Sistemas multi-agente': el orquestador informal se convierte en un grafo con estado tipado y persistencia.",
    to: "El grafo ya puede pausar en un nodo; la pregunta es quién decide ahí. 'Human-in-the-loop' inserta una aprobación humana en los puntos sensibles.",
    analogy: "Es una línea de ensamblaje con puestos numerados y un registro de por dónde pasó cada pieza: si algo sale mal, sabes exactamente en qué puesto y con qué estado.",
    extraBlocks: [
      { type: "tabla", headers: ["Concepto", "Por qué importa", "Ejemplo"], rows: [["Estado tipado", "Contrato entre nodos", "TypedDict / Pydantic"], ["Checkpoints", "Reanudar tras fallo", "SQLite / Redis"], ["Conditional edges", "Branching explícito", "Enrutamiento"], ["Interrupt", "Pausa para humano", "Aprobación"]] },
      { type: "codigo", lang: "python", code: "g.add_conditional_edges(\"clasificar\", ruta,\n    {\"simple\": \"responder\", \"complejo\": \"escalar\"})\napp = g.compile(checkpointer=mem)\n# hilo = {\"configurable\": {\"thread_id\": \"user-42\"}}", title: "Grafo con reanudación" },
      { type: "nota", text: "Matiz: la persistencia es una feature, no un detalle. Sin checkpointer, un fallo en el paso 7 te obliga a repetir desde el principio, con el coste y los efectos laterales ya ejecutados." }
    ]
  },
  'a9-7': {
    why: "Algunas acciones no deben automatizarse del todo: borrar datos, enviar correos o ejecutar pagos. Human-in-the-loop inserta una pausa donde una persona revisa con contexto suficiente —propuesta, fuentes y motivo—; un botón de aprobar sin contexto lleva a aprobaciones automáticas. Define también quién responde si nadie aprueba: un timeout con escalado o un fallback seguro, porque un agente bloqueado es un incidente.",
    from: "Viene de 'Orquestación con estado y grafos': el interrupt del grafo es el punto exacto donde el humano toma el relevo.",
    to: "Incluso con aprobaciones, proveedores y herramientas fallan. 'Fiabilidad: timeouts, fallbacks y degradación' cierra el módulo diseñando para el fallo.",
    analogy: "Es el botón de emergencia del tren: no se usa cada día, pero si nadie sabe dónde está ni cuándo pulsarlo, el viaje se convierte en un problema."
  },
  'a9-8': {
    why: "En producción el proveedor falla, la herramienta devuelve basura y el agente se queda sin pasos. Un sistema fiable define timeouts, reintentos con backoff y jitter, circuit breakers y una salida degradada honesta. Lo inaceptable es que el fallback invente datos; la recuperación parcial debe comunicarse. Los reintentos amplifican picos y coste: limita el número total por request, incluidos los de herramientas.",
    from: "Cierra 'Human-in-the-loop': la aprobación humana no sirve si el sistema se cuelga antes de pedirla o si el proveedor no responde.",
    to: "El bloque de agentes termina, pero toda esa experiencia debe demostrarse. 'Ocho proyectos senior (I): fundamentos' convierte lo aprendido en portfolio defendible.",
    analogy: "Es un ascensor con luz de emergencia, generador y aviso por megafonía: lo normal es que no pase nada, pero cuando falla la luz, alguien debe saber qué está pasando."
  },

  // ==================== a10: CARRERA Y PORTAFOLIO ====================
  'a10-1': {
    why: "Un proyecto senior no se mide por la novedad del modelo sino por las decisiones de sistema: restricciones, métricas, fallos y coste. Cuatro proyectos —RAG evaluado, clasificador tabular, fine-tuning con LoRA y serving propio— cubren los fundamentos que cualquier entrevistador espera ver. Cuatro variantes del mismo chatbot de PDF no demuestran nada; la variedad de problemas sí.",
    from: "Viene de 'Fiabilidad: timeouts, fallbacks y degradación': ya sabes construir sistemas que aguantan; ahora los conviertes en evidencia de nivel senior.",
    to: "Los fundamentos están cubiertos, pero faltan los sistemas complejos. 'Ocho proyectos senior (II): sistemas' añade agentes, seguridad, evals y MLOps de extremo a extremo.",
    analogy: "Es un cocinero que presenta cuatro platos con receta, tiempo y coste medidos, en vez de diez fotos de tortillas iguales."
  },
  'a10-2': {
    why: "La segunda mitad del portfolio demuestra que sabes construir sistemas, no modelos aislados: agente con HITL, red team, plataforma de evals y MLOps end-to-end. Tres proyectos profundos y defendibles en veinte minutos valen más que diez shallow. Si muestras un 'mejoró 40%' sin dataset ni comando para repetirlo, se lee como marketing.",
    from: "Viene de 'Ocho proyectos senior (I): fundamentos': completas la colección con proyectos que demuestran criterio de sistema, no solo de modelo.",
    to: "Con proyectos que respaldan tu criterio, la entrevista de diseño es el siguiente escalón. 'System design de sistemas de IA' estructura la respuesta bajo restricciones.",
    analogy: "Es llevar a la entrevista un maletín con tres informes técnicos que puedes defender línea a línea, en vez de una carpeta llena de capturas de pantalla."
  },
  'a10-3': {
    why: "La entrevista de system design evalúa decisiones bajo restricciones: no hay una respuesta correcta, hay un proceso. Aclarar requisitos, estimar volumen, elegir arquitectura y justificar compromisos pesa más que cualquier lista de tecnologías. Haz números en voz alta —1M peticiones × 2k tokens × $2/1M son ~$4/día solo de entrada— y empieza por un modelo pequeño con eval congelado.",
    from: "Viene de 'Ocho proyectos senior (II): sistemas': ya tienes evidencia; ahora la despliegas en una conversación con restricciones que tú no eliges.",
    to: "El diseño es solo una round; también hay código y fundamentos. 'Entrevistas: código y fundamentos' prepara la ronda técnica con sabor a datos.",
    analogy: "Es presupuestar una boda: primero preguntas cuántos invitados y cuánto hay, y solo después hablas de catering; llegar con el caterer contratado es arbitrario."
  },
  'a10-4': {
    why: "La ronda de código de un AI Engineer es de nivel SWE con sabor a datos: estructuras, complejidad y manipulación de arreglos. La de fundamentos premia entender el porqué, no recitar definiciones. Conecta cada concepto con una decisión: la temperatura controla variabilidad y en extracción la pones a cero. Piensa en voz alta, da una solución simple y luego optimiza.",
    from: "Viene de 'System design de sistemas de IA': cerrada la arquitectura, bajas al detalle ejecutable y a los fundamentos que la sostienen.",
    to: "Código y fundamentos no bastan si no sabes contar tu trabajo. 'Entrevistas: comportamiento y comunicación' da estructura a tus historias.",
    analogy: "Es explicar cómo cambias una rueda mientras lo haces: el entrevistador no quiere el manual memorizado, quiere ver que sabes dónde está la tuerca y por qué aflojas esa primero."
  },
  'a10-5': {
    why: "La mayoría de la gente pierde entrevistas no por falta de conocimiento sino por no saber contar su trabajo. El formato STAR-L exige situación, tarea, acción con lo que descartaste, resultado medido y aprendizaje. Las decisiones descartadas valen oro: 'consideré fine-tunear pero el eval mostró que retrieval daba el 92% a 1/20 del coste' demuestra más criterio que cualquier lista de librerías.",
    from: "Viene de 'Entrevistas: código y fundamentos': ya sabes resolver y explicar; ahora sabes narrar el impacto y el error con honestidad.",
    to: "Una narrativa convincente necesita una trayectoria visible en público. 'Open source y presencia técnica' convierte tu trabajo en señal verificable.",
    analogy: "Es contar un partido: no basta con decir 'ganamos', hay que explicar el marcador, el gol que invalidaron y qué cambiarías en el próximo."
  },
  'a10-6': {
    why: "Contribuir a open source es la forma más barata de que alguien revise tu código y tu criterio, y no hace falta ser maintainer de un framework enorme: un issue bien documentado y un fix pequeño son oro. Elige una herramienta que ya uses y contribuye donde entiendas el dolor. Un post con números y código explicando por qué fallaba tu RAG vale más que veinte hilos de tips.",
    from: "Viene de 'Entrevistas: comportamiento y comunicación': las historias que contabas ahora se pueden verificar en un repositorio público.",
    to: "Presencia técnica exige seguir aprendiendo sin ahogarse. 'Mantenerse al día sin ahogarse' construye un sistema de aprendizaje sostenible.",
    analogy: "Es participar en el club de lectura de la herramienta que usas: señalas un error tipográfico, luego una nota al margen y al final escribes tu propio ensayo."
  },
  'a10-7': {
    why: "El campo cambia cada semana y seguirlo todo produce ansiedad y conocimiento superficial. Necesitas pocas fuentes, una cola de lectura y una regla clara de adopción: eval que compare, medición de coste y latencia, y plan de rollback. El síndrome del tutorial es real: pasar de curso en curso da la ilusión de avanzar. Mide el aprendizaje en artefactos, no en horas de vídeo.",
    from: "Viene de 'Open source y presencia técnica': para mantener esa señal necesitas un flujo de entrada de conocimiento que no te consuma.",
    to: "El bloque de carrera se cierra con la pregunta más personal: cómo posicionarte. 'Tu narrativa de carrera y el primer año' aterriza todo en los próximos doce meses.",
    analogy: "Es una dieta de información: no comer todo lo que ves, elegir pocos alimentos frescos y probar una receta nueva al mes con un plato medido."
  },
  'a10-8': {
    why: "Tu valor no es 'sé usar LangChain': es la combinación de criterio de ingeniería, capacidad de medir y experiencia con sistemas probabilísticos. Esa es la historia que hay que contar. El plan de doce meses cierra dos proyectos profundos, publica y postula, y luego consolida buscando problemas de negocio no solo modelos. Si puedes explicar por qué elegiste algo y qué descartaste, la narrativa es sólida.",
    from: "Cierra 'Mantenerse al día sin ahogarse' y el bloque de carrera: convierte la rutina de aprendizaje en una posición concreta en el mercado.",
    to: "El track AI hasta aquí asume que tú escribes el código. Ahora entra un cambio de nivel: 'Harness vs modelo: qué es un agent harness' separa al que usa un agente del que construye el sistema alrededor.",
    analogy: "Es la diferencia entre decir 'sé conducir' y decir 'sé elegir ruta, presupuestar combustible y explicar por qué no cogí la autopista': la segunda es la que contratan."
  },

  // ==================== a11: AGENTIC CODING Y T3 CODE ====================
  'a11-1': {
    why: "Un modelo es un predictor de tokens; un agent harness es el programa que lo rodea y convierte esa capacidad en trabajo: conversación, tools, filesystem, permisos y contexto. El modelo piensa, pero el harness decide qué puede ver, hacer y recordar. Cuando un agente se porta mal, el 80% de las veces el fallo está en el harness: herramienta equivocada, permiso mal puesto o contexto recortado.",
    from: "Viene de 'Tu narrativa de carrera y el primer año': dejas de ser quien escribe el código para convertirte en quien diseña el sistema que lo escribe.",
    to: "Si el harness es tu sistema, necesitas una capa que orqueste varios harness a la vez. 'Qué es T3 Code' presenta ese control plane.",
    analogy: "Es la diferencia entre el cocinero y la cocina: el cocinero piensa el plato, pero la cocina decide qué ingredientes hay, qué cuchillos están permitidos y a qué hora se sirve.",
    extraBlocks: [
      { type: "tabla", headers: ["Componente", "Si falla", "Capacidad de arreglo"], rows: [["Conversación", "Repite trabajo", "Historial del hilo"], ["Tools", "Solo opina", "Registrar herramientas"], ["Filesystem", "Dos agentes se pisan", "Worktree por hilo"], ["Permisos", "Comando destructivo", "Política del harness"], ["Contexto", "Alucina por falta de datos", "Selección de fragmentos"]] },
      { type: "formula", expr: "calidad del resultado ≈ razonamiento(modelo) × alcance(harness) × permisos(harness)", explain: "Si el permiso es 0 (no puede escribir) o el alcance es 0 (no ve el archivo), el producto es 0 por muy bueno que sea el modelo." },
      { type: "apunte", title: "Matiz:", text: "El modelo es intercambiable; el harness es tu sistema. Cambiar de proveedor altera el razonamiento, pero no cambia quién decide los permisos ni cómo se revisa un diff: invierte en esa capa." }
    ]
  },
  'a11-2': {
    why: "T3 Code es un control plane open source bajo licencia MIT creado por Theo Browne en Ping Labs: no es modelo, no es IDE y no factura tokens. Organiza agentes, workspaces, permisos y diffs desde una sola interfaz, reutilizando las suscripciones que ya pagas. Su incentivo es ayudarte a usar menos tokens, no más: el ahorro es una feature del producto.",
    from: "Viene de 'Harness vs modelo: qué es un agent harness': T3 Code está un nivel por encima, gestionando varios harness en lugar de sustituir a uno.",
    to: "El concepto está claro; falta arrancarlo. 'Instalación y primeros pasos' deja el servidor local, los CLIs autenticados y un primer hilo supervisado.",
    analogy: "Es el director de una oficina de alquiler: no es el fontanero ni el electricista, pero es quien reparte las llaves, los horarios y las hojas de ruta."
  },
  'a11-3': {
    why: "Antes de orquestar, el entorno debe estar limpio: binarios de cada proveedor en el PATH, autenticados y un proyecto añadido. El orden importa porque T3 Code no sustituye a los CLIs, los invoca; un CLI sin sesión aparece como no disponible y da errores 401. Empieza en Supervised no por desconfianza sino para calibrar qué comandos propone el agente y cuánto tarda.",
    from: "Viene de 'Qué es T3 Code': ya sabes qué es el control plane; aquí lo pones en marcha con proveedores reales.",
    to: "Con el servidor vivo, la pregunta natural es qué proveedores puedes usar y si puedes cambiar de modelo sin perder el trabajo. 'Proveedores soportados y cambio de modelo en mitad del hilo' lo responde.",
    analogy: "Es preparar el taller antes de que lleguen los operarios: cada herramienta en su sitio, cada llave probada y la primera tarea con alguien mirando por encima."
  },
  'a11-4': {
    why: "T3 Code no te ata a un proveedor: puedes empezar con un agente barato y cambiar a otro más capaz cuando la tarea se complica, conservando conversación y workspace. El cambio se aplica al siguiente turno, no recrea el hilo. Compara coste por tarea terminada, no precio por token: uno resuelve en tres turnos y otro en doce.",
    from: "Viene de 'Instalación y primeros pasos': ya hay proveedores autenticados; ahora aprendes a mezclarlos dentro de un mismo hilo.",
    to: "Cambiar de modelo conserva la conversación, pero varios agentes editando el mismo checkout se pisan. 'Threads, worktrees y ramas' introduce el aislamiento de archivos.",
    analogy: "Es cambiar de mecánico a mitad de reparación sin bajar el coche al suelo: el historial y las piezas ya desmontadas siguen ahí, solo cambia quien continúa."
  },
  'a11-5': {
    why: "Un agente editando archivos en el mismo checkout que otro produce conflictos silenciosos: uno sobrescribe al otro y los diffs dejan de ser interpretables. La regla es un hilo, un worktree, una rama. Los worktrees son baratos porque comparten el almacenamiento de objetos de Git, así que no hay excusa para no usar uno por hilo.",
    from: "Viene de 'Proveedores soportados y cambio de modelo en mitad del hilo': el modelo ya es intercambiable; ahora aíslas el filesystem para que el paralelismo sea seguro.",
    to: "Con worktrees separados, falta decidir cuánta autonomía tiene cada agente dentro del suyo. 'Modos de permiso: Supervised, Auto-accept edits, Auto, Full access' clasifica los frenos.",
    analogy: "Es dar a cada ocupante su propio cuarto con llave en vez de una habitación compartida: nadie mueve las cosas del otro y cada uno puede cerrar al salir.",
    extraBlocks: [
      { type: "tabla", headers: ["Nivel", "Regla", "Si se rompe"], rows: [["Hilo", "Un objetivo por hilo", "Diff mezclado"], ["Worktree", "Un hilo por worktree", "Archivos sobrescritos"], ["Rama", "Un worktree por rama", "Rama ya ocupada"], ["Proyecto", "Apunta a un worktree", "Hilo sin checkout"]] },
      { type: "codigo", lang: "bash", code: "git worktree add ../t3-feature-login -b feature/login\ngit worktree add ../t3-fix-cli -b fix/cli-timeout\ngit worktree list", title: "Dos worktrees en paralelo" },
      { type: "apunte", title: "Matiz:", text: "El paralelismo solo es gratis si las tareas tocan archivos distintos. Si dos agentes editan el mismo módulo, secuéncialos en un hilo: el coste de resolver el conflicto supera el ahorro de tiempo." }
    ]
  },
  'a11-6': {
    why: "El modo de permiso es el freno del sistema: T3 Code separa Supervised, Auto-accept edits, Auto y Full access para decidir cuánta autonomía das. Auto-accept edits no es Full access: aceptar diffs no autoriza ejecutar un rm, instalar dependencias arbitrarias ni hacer push. Sube de modo cuando el agente haya acertado 5-10 turnos seguidos y baja en cuanto aparezca un comando que no entiendes.",
    from: "Viene de 'Threads, worktrees y ramas': el workspace ya está aislado; ahora gradúas qué puede hacer dentro de él.",
    to: "Incluso con el modo elegido necesitas leer qué cambió y volver atrás. 'Diffs, checkpoints y revert' convierte la supervisión en algo real.",
    analogy: "Es el freno de un coche en carretera: en la autoescola lo pisas a cada momento; con diez mil kilómetros lo dosificas, pero sigue estando ahí.",
    extraBlocks: [
      { type: "tabla", headers: ["Modo", "Autoriza", "Coste de error"], rows: [["Supervised", "Todo con aprobación", "Bajo: frenas a tiempo"], ["Auto-accept edits", "Cambios de archivo", "Medio: comandos siguen frenados"], ["Auto", "Edits y comandos habituales", "Alto"], ["Full access", "Shell, red y git sin preguntar", "Muy alto: entorno desechable"]] },
      { type: "formula", expr: "modo_correcto = mínimo que permita terminar la tarea con tests que avisen", explain: "Si un error cuesta diez minutos, Auto está bien; si cuesta un incidente con datos de clientes, quédate en Supervised aunque sea más lento." },
      { type: "nota", text: "Matiz: cambia el modo por hilo, no para todo el equipo ni para siempre. La autonomía es una propiedad de la tarea y de la confianza acumulada, no una preferencia personal." }
    ]
  },
  'a11-7': {
    why: "La supervisión solo es real si puedes leer qué cambió y volver atrás. T3 Code organiza el trabajo en turnos con su diff y guarda checkpoints que agrupan archivos y conversación: revertir solo los archivos deja al agente recordando decisiones que ya no existen en el disco. Un comentario en la línea concreta del diff es más eficaz que un párrafo genérico al final del hilo.",
    from: "Viene de 'Modos de permiso': aprobas o deniegas; aquí ves exactamente qué estás aprobando y cómo deshacerlo.",
    to: "Revisado el diff, queda publicarlo. 'Git en un clic: commit, push y PR' delega el último tramo sin perder la responsabilidad.",
    analogy: "Es un editor de texto con deshacer que guarda también lo que estabas pensando: vuelves al punto bueno y el agente no sigue defendiendo un código que ya no existe."
  },
  'a11-8': {
    why: "Una vez revisado el diff, commit, push y PR también se delegan, pero la responsabilidad de lo publicado sigue siendo tuya. El agente genera el mensaje a partir del hilo y puede incluir frases optimistas: léelo como si lo hubiera escrito un compañero nuevo. Antes del primer push confirma que .gitignore cubre .env, credenciales y artefactos generados.",
    from: "Viene de 'Diffs, checkpoints y revert': ya sabes qué cambió y cómo volver; ahora decides qué se publica y cómo se describe.",
    to: "Publicar en local no es suficiente cuando trabajas fuera de casa o en equipo. 'Remoto y móvil: LAN, Tailscale, T3 Connect y policy.json' amplía el acceso con criterio.",
    analogy: "Es firmar una carta redactada por un asistente: la firma es tuya, así que relees el texto y corriges las afirmaciones que no puedes respaldar."
  },
  'a11-9': {
    why: "El servidor corre en tu máquina pero la interfaz puede estar en otro dispositivo, lo que permite aprobar un diff desde el móvil. Cada vía de acceso amplía la superficie de ataque: LAN, Tailscale, T3 Connect y cliente móvil no son equivalentes. policy.json convierte las reglas del equipo en un archivo versionado y verificable con t3 policy check, y nunca conviene exponer el panel sin autenticación.",
    from: "Viene de 'Git en un clic: commit, push y PR': ahora apruebas esos mismos cambios desde cualquier sitio y con una política compartida.",
    to: "Con acceso remoto resuelto, el salto final es separar roles: 'Orquestación real: un agente implementa, otro revisa' convierte el control plane en una herramienta de equipo.",
    analogy: "Es dar llaves de tu casa al portero, a un amigo y a tu móvil: todos pueden entrar, pero prefieres un timbre con identificación antes que dejar la puerta abierta a la calle.",
    extraBlocks: [
      { type: "tabla", headers: ["Vía", "Alcance", "Cuándo"], rows: [["LAN", "Misma red", "Equipos de confianza"], ["Tailscale", "Red privada mesh", "Equipos distribuidos"], ["T3 Connect", "Puente oficial", "Acceso rápido fuera de casa"], ["Móvil", "iOS / Android", "Aprobar en movimiento"]] },
      { type: "codigo", lang: "json", code: "{\n  \"version\": 1,\n  \"defaultMode\": \"supervised\",\n  \"requireApprovalFor\": [\"edit\", \"shell\", \"push\"],\n  \"maxParallelThreads\": 3\n}", title: "Política orientativa" },
      { type: "apunte", title: "Matiz:", text: "Aprobar desde el móvil es HITL, no piloto automático: si no puedes leer un diff de 500 líneas con criterio, recházalo y revísalo en pantalla grande." }
    ]
  },
  'a11-10': {
    why: "El salto de un agente en una terminal a un control plane ocurre cuando separas roles: uno implementa en su worktree y otro, con contexto limpio, revisa el diff sin haberlo escrito. El revisor no es un duplicado, es una opinión independiente que detecta supuestos dados por buenos. Sin criterio de aceptación, dos agentes paralelos solo producen dos veces el mismo error.",
    from: "Viene de 'Remoto y móvil: LAN, Tailscale, T3 Connect y policy.json': la política ya define quién puede hacer qué; ahora defines quién implementa y quién cuestiona.",
    to: "La orquestación poderosa exige saber cuándo no usarla. 'Reglas de seguridad y cuándo NO usar T3 Code' cierra el módulo con el criterio de no automatizar.",
    analogy: "Es un taller con un operario y un inspector: el inspector no ha soldado la pieza, por eso ve la grieta que el operario ya no ve por costumbre."
  },
  'a11-11': {
    why: "La herramienta más potente es la que sabes no usar: T3 Code brilla con tareas aisladas, tests que avisan y una persona dispuesta a revisar. Fuera de ese contexto añade superficie de ataque y ruido sin valor. Un repo sin tests no es un problema que el agente deba cubrir, es un prerrequisito: primero escribes la prueba que falla y después dejas que la haga pasar.",
    from: "Cierra 'Orquestación real: un agente implementa, otro revisa': tras aprender a delegar, aprendes a decidir qué no se delega.",
    to: "El módulo de herramientas termina, pero la ventaja no está en la herramienta sino en el método. 'La idea central: quién explota mejor la tecnología' abre el bloque Jensen Huang.",
    analogy: "Es un cirujano que decide no operar: no es falta de habilidad, es saber que sin diagnóstico y sin quirófano preparado la intervención hace más daño que bien."
  },

  // ==================== a12: MÉTODO JENSEN HUANG ====================
  'a12-1': {
    why: "La tesis incómoda es que la carrera no es quién inventa la tecnología sino quién la explota mejor, y la tecnología ya está al alcance de casi todos. Usar IA para entender un tema produce comprensión acumulable; usarla para no entenderlo produce dependencia de la suscripción. Es una decisión de diseño de tu flujo de trabajo, no un consejo motivacional.",
    from: "Viene de 'Reglas de seguridad y cuándo NO usar T3 Code': esa disciplina de decidir es exactamente la ventaja que aquí se vuelve método.",
    to: "Si la ventaja está en el uso, el primer paso del uso es formular bien la pregunta. 'Si no sabes preguntar, pregúntale cómo preguntar' invierte el flujo habitual.",
    analogy: "Es darle a alguien una bicicleta: quien aprende a mantenerla y elegir ruta llega lejos; quien la alquila cada día depende de que la tienda siga abierta."
  },
  'a12-2': {
    why: "La calidad de la respuesta está limitada por la calidad de la pregunta, así que pedir primero alternativas de formulación revela supuestos ocultos. Hay que revisar la pregunta resultante: al elegirla estás decidiendo qué importa y no conviene delegar ese paso. La IA tiende a formular preguntas cómodas para ella; pide explícitamente una que pueda contradecir tu hipótesis.",
    from: "Viene de 'La idea central: quién explota mejor la tecnología': explotar mejor empieza por preguntar mejor, no por pedir más respuestas.",
    to: "Tener una buena pregunta aún no es entender: 'El bucle de aprendizaje recursivo' convierte la confusión concreta en el combustible de la siguiente.",
    analogy: "Es ir al médico: 'me duele' produce un diagnóstico genérico; 'me duele al respirar desde hace tres días y empeora por la noche' produce una pregunta clínica útil."
  },
  'a12-3': {
    why: "Aprender con IA no es una consulta sino una recursión: explicación sencilla, detectas el hueco exacto, esa confusión se convierte en la siguiente pregunta y se cierra explicando tú sin mirar. Un 'no lo entiendo' genérico produce otra explicación genérica. La sensación de entender es una ilusión producida por la fluidez del texto si no haces el último paso.",
    from: "Viene de 'Si no sabes preguntar, pregúntale cómo preguntar': la pregunta ya es buena; ahora se refina iterando sobre lo que aún no encaja.",
    to: "El bucle produce una explicación convincente, pero convincente no es fiable. 'Pide una crítica, compara respuestas y vuelve a la fuente' somete esa hipótesis a fricción.",
    analogy: "Es aprender a andar en bici con alguien que te sostiene: mientras no sueltas y pedaleas tú solo, no sabes si realmente sabes.",
    extraBlocks: [
      { type: "pasos", items: [{ title: "1. Explicación simple", text: "Un ejemplo concreto y sin jerga; pide que señale qué suele confundir." }, { title: "2. Hueco concreto", text: "Marca la frase exacta que no encaja, no un 'no lo entiendo'." }, { title: "3. Reexplicar", text: "Solo esa parte, conectándola con lo anterior." }, { title: "4. Cerrar tú", text: "Explica el tema completo sin mirar la pantalla." }] },
      { type: "nota", text: "Señal de que el bucle terminó: puedes explicar el concepto, aplicarlo a un caso nuevo y decir dónde deja de ser válido." },
      { type: "formula", expr: "comprensión = explicar + aplicar a caso nuevo + saber el límite", explain: "Si falta el tercer término, repites la definición pero no posees el concepto: el bucle aún no está cerrado." }
    ]
  },
  'a12-4': {
    why: "Una sola respuesta es una hipótesis: el siguiente paso es pedir a otra IA una crítica escéptica, comparar dos versiones y verificar fechas y cifras en la fuente original. Cuando dos respuestas difieren, la discrepancia casi nunca está en el estilo sino en qué dieron por bueno. La IA acelera el camino hasta la fuente, pero no sustituye la visita a la fuente.",
    from: "Viene de 'El bucle de aprendizaje recursivo': cerraste el bucle explicando; ahora compruebas que lo que explicas es verdad.",
    to: "Verificar implica comunicar con precisión. 'Language is the programming language of AI now' convierte la claridad al escribir en una habilidad técnica.",
    analogy: "Es contrastar dos presupuestos de talleres: si uno incluye la ITV y otro no, la diferencia no es el precio, es un supuesto que habías dado por hecho."
  },
  'a12-5': {
    why: "El lenguaje es el lenguaje de programación de la IA: las instrucciones en natural tienen tanta precisión —o ambigüedad— como el código que sustituyen. Una instrucción buena define entradas, salidas, restricciones y criterio de aceptación, igual que una función. Si dos personas la interpretan distinto, el modelo también. Más largo no significa más preciso.",
    from: "Viene de 'Pide una crítica, compara respuestas y vuelve a la fuente': dejar de delegar el criterio exige escribir instrucciones que no lo diluyan.",
    to: "Instrucciones precisas no garantizan obediencia: 'Controlabilidad > exactitud' argumenta que es mejor un agente guiable que uno supuestamente perfecto.",
    analogy: "Es pasar de 'arregla el grifo' a 'en cocina, el grifo de agua caliente gotea; cambia la junta, no toques el de frío y pasa el test de estanqueidad': misma tarea, cero interpretación libre."
  },
  'a12-6': {
    why: "Para muchas tareas un agente no necesita acertar siempre: necesita obedecer cuando lo corriges y fallar de forma detectable. La controlabilidad es una propiedad del sistema y la exactitud es una métrica del momento. Cambiar una palabra de un plan —espera por ESPERA explícita— puede cambiar el comportamiento. Pide aprobación en puntos de decisión, no en cada token.",
    from: "Viene de 'Language is the programming language of AI now': toda esa precisión al escribir se usa para hacer al agente guiable, no solo más elocuente.",
    to: "La controlabilidad se demuestra con evidencia. 'Aplicarlo al trabajo: una tarea, una métrica, dos herramientas' define mejor antes de probar y mide el resultado.",
    analogy: "Es un perro que obedece la orden de quedarse aunque haya un gato delante: preferible a uno que hoy caza perfecto pero ignore tu voz cuando lo llamas."
  },
  'a12-7': {
    why: "El método solo cuenta si produce un resultado medible: una tarea repetitiva, definir qué significa mejor ANTES, probar dos herramientas sobre los mismos casos y revisar tú la salida. El ahorro neto incluye tu tiempo de corrección: una herramienta que ahorra cinco minutos pero añade diez de revisión no mejora nada. Cabe en una tarde; si no, la tarea es demasiado grande para empezar.",
    from: "Viene de 'Controlabilidad > exactitud': ya sabes intervenir; aquí cuantificas si esa intervención compensa en tiempo real.",
    to: "Medir el ahorro no basta si publicas sin comprobar. 'Verificación como parte del workflow' convierte la checklist en una tarea repetible del pipeline.",
    analogy: "Es cronometrar el lavado de coches a mano y con la máquina, contando también el tiempo que pasas repasando el cristal: el ahorro real sale de ahí."
  },
  'a12-8': {
    why: "La verificación no es el paso final que se añade si queda tiempo: es parte del workflow con una checklist ejecutable —datos, fuentes, cálculos, PII, audiencia y regresiones—. Evaluar no es lo mismo que testear: el eval mide una distribución sobre casos congelados y el test verifica un contrato determinista. Si una comprobación es importante, conviértela en una tarea repetible en CI.",
    from: "Viene de 'Aplicarlo al trabajo: una tarea, una métrica, dos herramientas': la métrica ya existe; ahora la proteges antes y después de publicar.",
    to: "El ciclo se cierra con la disciplina que evita perderlo. 'Antipatrones y la ventaja durable' cierra el módulo y el track.",
    analogy: "Es la lista de chequeo del piloto antes de despegar: no se lee por costumbre, se lee porque los viernes a las siete la memoria falla."
  },
  'a12-9': {
    why: "El método se pierde de formas concretas: delegar el pensamiento, acumular prompts sin saber cuál funciona y no medir. Cada antipatrón produce la misma ilusión de mucha actividad y poca ventaja. Un moat no es secreto sino práctica sostenida: cualquiera copia tu prompt, casi nadie copia tu disciplina de verificación y medición.",
    from: "Cierra 'Verificación como parte del workflow': llevas la checklist al hábito y detectas lo que la rompe.",
    to: "Último salto del track: dejar de medir para empezar a servir de verdad. 'PagedAttention y vLLM' lleva todo lo aprendido a la VRAM de una GPU.",
    analogy: "Es un gimnasio: nadie se pone fuerte por tener cien vídeos de ejercicios guardados; se pone fuerte quien entrena y registra las cargas cada semana."
  },

  // ==================== a14: SERVING Y ECONOMÍA DE INFERENCIA ====================
  'a14-1': {
    why: "Servir un LLM es gestionar memoria: cada token necesita las claves y valores de toda la secuencia anterior y esa KV cache agota la VRAM antes que los pesos. vLLM ataca ahí con PagedAttention, que pagina la caché en bloques como un sistema operativo con memoria virtual. El desperdicio cae de ~70% a menos del 4% y el throughput se multiplica por 2-4 con el mismo hardware.",
    from: "Viene de 'Antipatrones y la ventaja durable': todo el rigor del track se concreta ahora en la capa donde el modelo se vuelve un servicio medible.",
    to: "PagedAttention resuelve la fragmentación, pero aún queda decidir qué secuencias comparten GPU en cada paso. 'Continuous batching' ataca la utilización.",
    analogy: "Es la memoria virtual de un ordenador: en vez de reservar un bloque enorme por documento, usas páginas pequeñas donde haya hueco y una tabla que dice dónde está cada una.",
    extraBlocks: [
      { type: "formula", expr: "Bytes KV por token = 2 · capas · heads_kv · dim_head · bytes_por_valor", explain: "Llama 3 8B: 2·32·8·128·2 = 131072 bytes ≈ 128 KB por token; 8192 tokens son ≈ 1 GB por secuencia antes de margen." },
      { type: "tabla", headers: ["Enfoque clásico", "Consecuencia", "PagedAttention"], rows: [["Reserva contigua 2048", "60-80% desperdiciado", "Bloques de 16 bajo demanda"], ["Bloques contiguos", "Fragmentación externa", "Tabla de páginas por secuencia"], ["Copia al crecer", "Coste O(n)", "Añadir bloque sin copiar"]] },
      { type: "apunte", title: "Matiz:", text: "vLLM necesita GPU NVIDIA con CUDA 12.x. En una RTX 4090 de 24 GB un 8B en FP16 cabe justo: para contexto largo o más concurrencia hay que cuantizar o usar tensor parallel." }
    ]
  },
  'a14-2': {
    why: "En static batching una secuencia de 2000 tokens bloquea a nueve de 50: no se devuelve nada hasta que termina la más larga. Continuous batching decide en cada paso de decodificación qué secuencias entran, salen o se pausan, y mantiene la GPU casi siempre ocupada con 2-4x de throughput. Buscar el punto donde el p95 de TTFT rompe tu presupuesto es parte del trabajo.",
    from: "Viene de 'PagedAttention y vLLM': los bloques ya son eficientes; ahora llenas con más secuencias los huecos que esa eficiencia liberó.",
    to: "Muchas de esas secuencias comparten el mismo system prompt. 'Prefix caching y KV caching compartido' evita recalcularlo en cada una.",
    analogy: "Es un restaurante que no espera a que el más lento termine de comer para sentar al siguiente: cada sitio libre se ocupa en cuanto se levanta alguien."
  },
  'a14-3': {
    why: "Muchas peticiones comparten los primeros tokens: system prompt, formato, ejemplos few-shot y documentos de un RAG. Recalcular su KV cache es trabajo tirado, y el prefix caching guarda esos bloques y los reutiliza si el prefijo es byte-idéntico. Un solo carácter distinto al principio invalida todos los bloques posteriores, así que el prefijo debe ir de lo estable a lo variable.",
    from: "Viene de 'Continuous batching': con varias secuencias vivas, detectar prefijos comunes multiplica el ahorro de cada una.",
    to: "Ahorrar prefill es solo media batalla; la otra es hacer que cada peso ocupe menos bits. 'Cuantización AWQ e INT8' reduce la huella de los pesos.",
    analogy: "Es imprimir solo una vez las instrucciones comunes de un examen y añadir la pregunta concreta al final, en vez de reimprimirlas para cada alumno."
  },
  'a14-4': {
    why: "Pasar de FP16 a INT8 reduce los pesos a la mitad y a INT4 a una cuarta parte, con un coste de calidad que hay que medir. AWQ identifica los canales de activación más importantes y los protege con escalado; GPTQ minimiza el error de reconstrucción capa por capa. Un INT4 puede perder cinco puntos en razonamiento matemático aunque parezca igual en chat: corre tus evals siempre.",
    from: "Viene de 'Prefix caching y KV caching compartido': tras ahorrar cómputo de prefill, ahorras VRAM en los propios pesos para caber en la misma GPU.",
    to: "Con menos bytes que leer, queda atacar el número de pasadas. 'Speculative decoding' propone varios tokens y los verifica en una sola.",
    analogy: "Es comprimir los libros de una biblioteca: caben más ejemplares en el mismo estante, aunque algunas letras pequeñas se lean peor; por eso se revisan los libros de matemáticas antes de prestarlos."
  },
  'a14-5': {
    why: "Speculative decoding propone varios tokens con un draft pequeño y los verifica el grande en una pasada: si acierta, ahorra pasadas; si no, descarta desde el primer rechazo. Es lossless porque el modelo grande confirma la distribución final. Con α=0.7 y k=5 se saltan ~2.8 tokens por pasada; con temperatura alta la tasa de aceptación cae y el speedup se esfuma.",
    from: "Viene de 'Cuantización AWQ e INT8': los pesos ya son baratos de leer; ahora reduces cuántas veces hay que leerlos.",
    to: "Menos pasadas por token no sirven si la GPU está ociosa entre requests. 'GPU y presupuesto de memoria' convierte concurrencia en decisión de hardware.",
    analogy: "Es un escribiente que adelanta las palabras probables y el jefe las revisa de un vistazo: si acierta, se ahorra escribirlas dos veces; con texto creativo acierta menos."
  },
  'a14-6': {
    why: "Dimensionar serving es repartir una VRAM fija entre pesos, KV cache, activaciones y overhead; si calculas solo los pesos te quedas corto bajo carga. En inferencia con batch pequeño el cuello es el ancho de banda de memoria: una H100 es ~3x más rápida que una A100 con el mismo modelo aunque ambas tengan 80 GB. No satures la GPU al 100%: necesitas margen para picos.",
    from: "Viene de 'Speculative decoding: velocidad sin perder calidad': el ahorro en pasadas se traduce en cuántas conversaciones caben y a qué velocidad.",
    to: "El hardware elegido hay que verificarlo con carga real. 'Benchmarks con Locust: medir como en producción' pone números a TTFT y saturación.",
    analogy: "Es repartir el maletero del coche: maletas, provisiones y una caja de herramientas; si lo llenas todo de maletas, no queda sitio para la rueda de repuesto cuando la necesitas."
  },
  'a14-7': {
    why: "Un benchmark que no mide percentiles no sirve: TTFT es lo que el usuario percibe, E2E y TPOT completan la imagen, y hace falta ver cómo evolucionan al subir concurrencia. La rodilla de la curva —donde el p95 crece mucho más rápido que la carga— es tu capacidad real. Corre desde otra máquina con prompts reales y streaming: medir en el mismo servidor distorsiona los percentiles.",
    from: "Viene de 'GPU y presupuesto de memoria': la teoría de la VRAM se valida con usuarios simulados y métricas de cola.",
    to: "Todas las optimizaciones anteriores convergen en una cifra final. 'Coste por token y economía de inferencia' cierra el módulo con el impacto económico.",
    analogy: "Es probar un puente con 8, 16, 24 y 32 camiones hasta que el tablero empieza a quejarse: ese es el límite, no el que dice la placa teórica."
  },
  'a14-8': {
    why: "Toda decisión de serving acaba en cuánto cuesta un millón de tokens, y los ingredientes —throughput real, precio de GPU y ocupación— se estiman mal. Un servidor al 20% multiplica el coste por token por cinco. PagedAttention, continuous batching, cuantización y speculative no son solo velocidad: aumentan tokens por hora y por tanto bajan el coste. Optimizar latencia y optimizar coste es el mismo trabajo.",
    from: "Cierra 'Benchmarks con Locust': los tokens/s medidos son el denominador de la fórmula de coste.",
    to: "El módulo de serving termina con números, pero esos números solo valen si la calidad no cayó. 'Datasets congelados y versionados' abre el bloque de evals como disciplina de CI.",
    analogy: "Es calcular el coste del kilómetro de un taxi: coche más rápido y más horas lleno reducen el precio por viaje; dejarlo parado en la parada lo encarece todo."
  },

  // ==================== a15: EVALS COMO DISCIPLINA DE CI ====================
  'a15-1': {
    why: "Un eval sin dataset congelado es una opinión: si cambias las preguntas cada vez que el modelo falla, optimizas contra un target móvil. El dataset es un contrato con hash, versión y fecha de congelación. Separa dev, validación y aceptación: el de aceptación se toca una vez por trimestre, y generar etiquetas con el mismo modelo evaluado mide autoconfirmación, no calidad.",
    from: "Viene de 'Coste por token y economía de inferencia': bajar el coste solo vale si no degradaste la calidad, y eso requiere un target fijo.",
    to: "Con el dataset congelado, el siguiente paso es medir un RAG por capas. 'RAGAS y faithfulness mayor o igual a 0,90' separa recuperación de generación.",
    analogy: "Es un examen con el temario cerrado y el enunciado sellado: solo así puedes comparar la nota de este año con la del pasado.",
    extraBlocks: [
      { type: "tabla", headers: ["Set", "Tamaño", "Regla"], rows: [["Dev", "30-100", "Se mira a diario"], ["Validación", "200-500", "No se usa para escribir el prompt"], ["Aceptación", "300-1000", "Una vez por trimestre"]] },
      { type: "formula", expr: "hash = sha256(json(casos, sort_keys=True, ensure_ascii=False))[:12]", explain: "Ese hash viaja en la traza y en el gate: si dos ejecuciones tienen hashes distintos, sus métricas no son comparables y cualquier diferencia es ruido." },
      { type: "apunte", title: "Matiz:", text: "Estratifica. Un dataset con 90% de preguntas fáciles da 95% de exactitud y esconde un 40% en el 10% difícil, que es justo lo que enfada a los usuarios." }
    ]
  },
  'a15-2': {
    why: "En RAG la calidad no es una cifra: RAGAS separa si el contexto recuperado era relevante y si la respuesta se apoya en él. Esa separación dice dónde meterte: ¿mejoras el índice o el prompt? Faithfulness ≥ 0.90, answer relevancy ≥ 0.85 y context recall ≥ 0.85 son objetivos prácticos. Una respuesta fiel pero incompleta puede tener faithfulness alto y seguir siendo inútil.",
    from: "Viene de 'Datasets congelados y versionados': los casos ya son estables; ahora defines qué medir en cada capa del RAG.",
    to: "RAGAS usa un juez internamente, y ese juez hay que calibrarlo. 'LLM-as-judge calibrado con 50 anotaciones humanas' mide la métrica de la métrica.",
    analogy: "Es un informe médico con dos apartados: ¿le dieron al especialista las analíticas correctas? y ¿diagnosticó apoyándose en ellas? Un error distinto en cada apartado exige una solución distinta.",
    extraBlocks: [
      { type: "formula", expr: "Faithfulness ≈ afirmaciones verificables por el contexto / total afirmaciones", explain: "Tres frases de las cuales una inventa un dato dan ~0.67: por debajo del objetivo 0.90, así que ese caso bloquea." },
      { type: "tabla", headers: ["Matriz 2x2", "Faithfulness alto", "Faithfulness bajo"], rows: [["Recall alto", "Caso ideal", "Falla prompt / modelo"], ["Recall bajo", "No inventa pero falta info", "Falla retrieval y generación"]] },
      { type: "nota", text: "Si el RAG cita fuentes, añade una aserción determinista de que el id citado existe y el trozo apoya la afirmación: el juez no detecta citas falsas por sí solo." }
    ]
  },
  'a15-3': {
    why: "Un LLM juez es barato y escalable pero no neutro: prefiere respuestas largas y la primera opción. Antes de fiarte, anota 50 respuestas a mano y mide acuerdo con kappa de Cohen: por encima de 0.80 úsalo en gates, por debajo de 0.60 reescribe la rúbrica. Usa un modelo juez distinto del evaluado cuando sea posible, porque compartir sesgos infla el acuerdo.",
    from: "Viene de 'RAGAS y faithfulness mayor o igual a 0,90': el juez que ya usabas necesita calibración antes de convertirlo en puerta de CI.",
    to: "El juez calibrado aún vive en un script. 'promptfoo: evals declarativos en YAML' lo lleva al repo donde puede revisarse como código.",
    analogy: "Es calibrar un termómetro con hielo y agua hirviendo antes de fiarte de él: si marca mal los extremos, leer la fiebre no sirve de nada."
  },
  'a15-4': {
    why: "promptfoo convierte las evals en archivos de configuración que viven en el repo, así que el eval deja de ser un script que solo entiende su autor y pasa a ser revisable en un pull request. Una suite sana tiene mayoría de aserciones deterministas —equals, contains, schema— y unas pocas de juez. Si todo depende de un LLM, tu gate es tan volátil como el modelo que mides.",
    from: "Viene de 'LLM-as-judge calibrado con 50 anotaciones humanas': ya sabes cuándo fiarte del juez; aquí decides cuándo no necesitas usarlo.",
    to: "El eval en YAML corre en local; falta ver qué pasa en producción. 'Langfuse y OpenTelemetry: trazas de extremo a extremo' instrumenta el sistema real.",
    analogy: "Es pasar de una hoja de cálculo en el portátil de un compañero a un contrato de pruebas en el repositorio: cualquiera puede verlo, criticarlo y repetirlo."
  },
  'a15-5': {
    why: "Una eval offline responde si el sistema funciona en un dataset cerrado; la observabilidad responde qué pasa ahora mismo en producción. OpenTelemetry define trace, span y atributos, y Langfuse los especializa para LLMs con coste, prompt y feedback. Sin versión de prompt en la traza no puedes explicar una regresión: el mismo modelo con otro prompt es otro sistema.",
    from: "Viene de 'promptfoo: evals declarativas en YAML': los casos del repo se complementan con trazas del tráfico real.",
    to: "Las trazas producen evidencia, pero alguien debe actuar sobre ella. 'Gates en GitHub Actions' convierte la métrica en una regla que bloquea el merge.",
    analogy: "Es la diferencia entre el banco de pruebas y la telemetría del coche: uno te dice si el motor está bien en el taller, el otro te avisa cuando se calienta en la autopista."
  },
  'a15-6': {
    why: "Un eval que nadie mira es decoración: el gate convierte la métrica en una regla y desplaza la discusión de opiniones a evidencia. Comprueba el hash del dataset ANTES que la métrica, porque si el dataset cambió el resultado no es comparable. Publica el informe con if: always() para tener evidencia incluso cuando la métrica bloquea, y no corras la suite completa en cada push de documentación.",
    from: "Viene de 'Langfuse y OpenTelemetry: trazas de extremo a extremo': la evidencia ya se recoge; ahora se convierte en condición de promoción.",
    to: "Un gate con un número puntual todavía puede engañarte por ruido. 'Análisis de regresión con intervalo de confianza del 95%' decide con incertidumbre.",
    analogy: "Es un detector de humo conectado a la puerta cortafuegos: no basta con que mida humo, tiene que cerrar la puerta cuando lo detecta."
  },
  'a15-7': {
    why: "Una subida de 0.4 puntos no es una mejora, es ruido: comparar medias sin incertidumbre es el error más caro en sistemas probabilísticos. El bootstrap apareado sobre las MISMAS preguntas da un intervalo para la diferencia; si incluye cero, no hay evidencia. Y si comparas veinte prompts y te quedas con el mejor intervalo, haces comparaciones múltiples: ajusta con Bonferroni o reserva un set de confirmación.",
    from: "Viene de 'Gates en GitHub Actions': el gate ya bloquea; aquí evitas que bloquee por una diferencia que no existe.",
    to: "Todas las piezas —hash, aserciones, juez e intervalo— deben caber en un presupuesto de tiempo. 'Suite completa: menos de 5 minutos que bloquean el deploy' las compone.",
    analogy: "Es pesar a dos personas descalzas y con abrigo en balanzas distintas: el pareado las pone en la misma báscula para que la diferencia sea real."
  },
  'a15-8': {
    why: "El objetivo del módulo es una suite que corra en menos de cinco minutos y bloquee el deploy: no es magia, es un presupuesto repartido entre comprobaciones baratas y juicios caros limitados. Con fail-fast, lo barato y bloqueante va primero. El resultado no es un certificado de calidad, es evidencia de que sobre ese dataset congelado esta versión no es peor que la anterior.",
    from: "Cierra 'Análisis de regresión con intervalo de confianza del 95%': une hash, aserciones, juez y delta en una sola política de release con tres números.",
    to: "La calidad ya está asegurada en CI, pero un sistema todavía puede caer por errores y ataques. 'Timeouts y presupuestos de latencia' abre el bloque final de fiabilidad adversaria.",
    analogy: "Es un chequeo médico exprés: primero tensión y peso, después el análisis solo si hace falta; con cinco minutos no puedes hacer todo, pero sí lo que puede fallar y arreglarse rápido.",
    extraBlocks: [
      { type: "tabla", headers: ["Etapa", "Tiempo", "Bloquea"], rows: [["Check de hash", "< 5 s", "Sí"], ["Aserciones deterministas", "~40 s", "Sí"], ["RAGAS / juez", "~3 min", "Sí"], ["Regresión con IC", "< 20 s", "Sí"], ["Informe", "< 10 s", "No"]] },
      { type: "formula", expr: "puede_desplegar = accuracy ≥ 0.90 ∧ faithfulness ≥ 0.90 ∧ delta_ic_inferior ≥ −0.01", explain: "Tres umbrales con razón documentada son auditables en una review; una política con adjetivos no lo es." },
      { type: "nota", text: "Matiz: 200 juicios en tres minutos exige concurrencia. Controla los rate limits del proveedor o la suite fallará por 429, no por calidad." }
    ]
  },

  // ==================== a16: FIABILIDAD ADVERSARIA ====================
  'a16-1': {
    why: "Sin timeout, una llamada lenta convierte tu servicio en un embudo: hilos bloqueados, cola creciente y 502 para todos. El timeout total —por ejemplo con asyncio.wait_for— es el que libera el worker y acota la cola. Los timeouts van en cascada decreciente: herramienta 5 s < generación 20 s < petición 30 s. Regístralos como métrica propia: son la señal más temprana de degradación.",
    from: "Viene de 'Suite completa: menos de 5 minutos que bloquean el deploy': el deploy ya está controlado; ahora controlas lo que pasa cuando el proveedor no responde.",
    to: "Un timeout evita el cuelgue, pero reintentar contra un proveedor caído solo añade presión. 'Circuit breaker: fallar rápido y recuperarse' corta el paso.",
    analogy: "Es el limitador de tiempo de una lavadora: si el tambor se atasca, se para y avisa en vez de quemar el motor durante una hora."
  },
  'a16-2': {
    why: "Cuando un proveedor falla, reintentar no arregla nada: añade presión sobre un sistema caído y llena tu cola. El circuit breaker cuenta fallos en una ventana y deja de llamar durante un cooldown, devolviendo fallback. Con half-open y tres llamadas de prueba evitas el thundering herd al recuperar. Un 429 por rate limit no debe abrir el breaker igual que un 500.",
    from: "Viene de 'Timeouts y presupuestos de latencia': el timeout detecta el problema; el breaker decide dejar de insistir.",
    to: "El breaker elige cuándo no llamar al primario; pero hace falta a quién llamar en su lugar. 'Fallback multi-proveedor' diseña la cadena de sustitución.",
    analogy: "Es el disyuntor de casa: cuando hay corte, corta el paso para que no se incendie el cableado; pruebas unas luces antes de volver a dar corriente."
  },
  'a16-3': {
    why: "Un fallback no es dos APIs en un if: es una decisión sobre qué promesas se mantienen al cambiar de modelo. Lo que debe ser idéntico es el contrato —structured output con el mismo Pydantic, mismos errores y métricas—. Registra siempre qué proveedor respondió y vigila la tasa: un 10% sostenido significa que el primario está roto, no que tu arquitectura sea robusta. Objetivo: menos del 2%.",
    from: "Viene de 'Circuit breaker: fallar rápido y recuperarse': el breaker dispara; el router elige el siguiente proveedor de la cadena.",
    to: "Para que el cambio sea invisible, la salida debe cumplir siempre el mismo esquema. 'Structured output con Pydantic' convierte esa promesa en código.",
    analogy: "Es cambio de piloto en un vuelo: el avión y los mandos son los mismos; si el segundo piloto hiciera aterrizar otro modelo de avión, el pasaje se enteraría."
  },
  'a16-4': {
    why: "El texto libre es el mayor generador de bugs en sistemas con LLM: tu código espera un campo y el modelo devuelve un párrafo. response_format con un JSON Schema de Pydantic convierte la salida en contrato validado. La reparación eficaz devuelve el error de validación al modelo, no un 'inténtalo otra vez', y se acota a dos reintentos antes de escalar a humano.",
    from: "Viene de 'Fallback multi-proveedor': el contrato común que exigías a todos los proveedores se define aquí de forma ejecutable.",
    to: "El contrato protege la forma, pero no evita que un dato envenenado cambie el comportamiento. 'Prompt injection: instrucciones dentro de los datos' ataca el contenido.",
    analogy: "Es un formulario con campos obligatorios y formato de fecha: si el usuario escribe 'mañana', el sistema no adivina, devuelve el error concreto para que lo corrija."
  },
  'a16-5': {
    why: "En prompt injection el atacante no rompe el modelo: le habla dentro de un dato que tu sistema va a leer. La inyección indirecta llega por PDF, correo o web recuperada. Las defensas van en capas —filtro de entrada, delimitación y spotlighting, permisos mínimos y filtro de salida— porque un nivel que falla lo sostiene el siguiente. Las garantías las dan los permisos, no las palabras del prompt.",
    from: "Viene de 'Structured output con Pydantic': el esquema blindaba la forma; ahora blindas la intención frente a contenido hostil.",
    to: "La inyección es una vía de ataque; los jailbreaks son otra que apunta directamente a las restricciones. 'Jailbreaks y fuga de PII' amplía el escenario.",
    analogy: "Es un sobre que dice 'por favor, entrega la llave al portador': no confías en el mensaje, confías en que la cerradura solo la abre tu llave."
  },
  'a16-6': {
    why: "Los jailbreaks usan roles ficticios, codificación y fragmentación, así que una lista negra de frases es débil: las variantes son infinitas. Necesitas capas y monitoreo de intentos bloqueados. La redacción de PII tampoco puede ser ciega: si borras el NIF de la entrada, impides que el usuario lo extraiga de su propia factura. Redacta la salida y sanea el contexto por relevancia.",
    from: "Viene de 'Prompt injection: instrucciones dentro de los datos': ambos buscan eludir controles; aquí el vector es el propio chat y el objetivo suele ser fugar datos.",
    to: "Probar defensas a mano no escala. 'Garak: tests de adversario automatizados' lanza cientos de probes y convierte el resultado en una tasa comparable.",
    analogy: "Es un guardia que no memoriza caras sino que mira cámaras, registra intentos y decide por contexto: una lista de nombres prohibidos se queda corta en cuanto alguien se disfraza."
  },
  'a16-7': {
    why: "Garak lanza cientos de probes —prompt injection, jailbreaks, encoding, leakage— y aplica detectors para decidir si el modelo mordió el anzuelo. Produce una tasa de éxito de ataque comparable entre versiones, y su mayor valor es detectar regresiones de seguridad, no perseguir el cero absoluto. Ejecútalo en entorno de prueba con presupuesto acotado: genera tráfico adversarial.",
    from: "Viene de 'Jailbreaks y fuga de PII': esas pruebas manuales se automatizan y se integran en la política de release.",
    to: "Cierra el módulo y el track con la decisión de fondo sobre cuándo construir modelo propio. 'Fine-tuning: comprar vs construir' es el último escalón.",
    analogy: "Es un escáner de seguridad que toca todas las cerraduras del edificio cada noche: no sustituye al cerrajero, pero te dice si la nueva puerta es peor que la vieja."
  },
  'a16-8': {
    why: "La intuición de que si el modelo no hace lo que quieres hay que afinarlo es cara y casi siempre equivocada. Sin 500 ejemplos limpios y evals que digan si mejoraste, el fine-tuning es una forma elegante de gastar dinero sin evidencia. Agota primero prompt, retrieval y few-shot con tres iteraciones cada uno. Prompt, retrieval y evals aguantan el 80% de los casos; el fine-tuning es la herramienta del 20% restante.",
    from: "Cierra 'Garak: tests de adversario automatizados' y todo el track: la seguridad, el coste y la calidad convergen en cuándo merece la pena entrenar.",
    to: "Última pregunta abierta del track: con todo lo anterior resuelto, ¿sigue justificado construir tu propio modelo? Esta lección lo decide con números y cierra el círculo.",
    analogy: "Es reformar la cocina: antes de tirar los muros, pruebas a mover los muebles, cambiar la luz y reordenar los armarios; casi siempre el problema era el orden, no la pared."
  }
};
