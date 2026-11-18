import { leccion as L, modulo as M, err, q, p, h, apunte, nota, aviso, codigo, diagrama, tabla, lista, pasos, formula, widget, enlace } from '../helpers';
import type { Module } from '../../types';

export const agenticModules: Module[] = [

  // ==================== a11: AGENTIC CODING Y T3 CODE ====================
  M('a11', 'Agentic coding y T3 Code', 'Orquestar agentes de código como un control plane, no como terminales sueltas', [
    L({
      id: 'a11-1', title: 'Harness vs modelo: qué es un agent harness', min: 15, level: 'intermedio',
      objectives: [
        'Separar el modelo del harness que lo rodea y nombrar sus cinco componentes',
        'Explicar por qué T3 Code opera un nivel por encima del harness',
        'Identificar qué capa del sistema controlas tú cuando un agente falla'
      ],
      blocks: [
        p('Un modelo es un predictor de tokens: recibe una secuencia y devuelve la siguiente. Un agent harness es el programa que lo rodea y convierte esa capacidad en trabajo: gestiona la conversación, expone herramientas, monta un filesystem, decide permisos y acota el contexto. El modelo piensa; el harness decide qué puede ver, hacer y recordar.'),
        diagrama('agentes', 'El modelo es una pieza dentro del harness; el harness es lo que ejecuta, valida y limita.'),
        h('Las cinco piezas del harness'),
        tabla(['Componente', 'Qué hace', 'Si falla'], [
          ['Conversación', 'Acumula mensajes y turnos en un hilo', 'El agente pierde el hilo y repite trabajo'],
          ['Tools', 'Expone shell, lectura/escritura, búsqueda, MCP', 'El agente no puede actuar, solo opinar'],
          ['Filesystem', 'Aísla un workspace con archivos reales', 'Dos agentes se pisan los cambios'],
          ['Permisos', 'Aprueba o deniega cada acción sensible', 'Un comando destructivo se ejecuta sin control'],
          ['Contexto', 'Decide qué entra en la ventana del modelo', 'Alucinación por falta de información o ruido']
        ]),
        pasos([
          { title: '1. Conversación', text: 'Cada turno añade mensajes; el historial es el estado del agente, no el modelo.' },
          { title: '2. Tools', text: 'El modelo pide llamar una herramienta; el harness la ejecuta y devuelve el resultado.' },
          { title: '3. Filesystem', text: 'Las herramientas operan sobre un directorio concreto, con ramas y worktrees.' },
          { title: '4. Permisos', text: 'Antes de ejecutar, el harness aplica la política: permitir, pedir aprobación o bloquear.' },
          { title: '5. Contexto', text: 'Se selecciona qué fragmentos del historial y del repo caben en la ventana.' }
        ]),
        apunte('El modelo es intercambiable; el harness es tu sistema', 'Cambiar de Claude a Codex o a OpenCode cambia el razonamiento, pero no cambia quién decide los permisos, qué archivos se tocan ni cómo se revisa un diff. Todo lo que construyas en esa capa se conserva entre modelos.'),
        diagrama('memoria', 'La memoria del agente es historia de conversación más archivos, no pesos del modelo.'),
        p('T3 Code está un nivel arriba: no es otro harness, es un control plane que crea, aísla, supervisa y orquesta varios harness a la vez. Tú dejas de hablar con un terminal y pasas a gestionar hilos, worktrees, aprobaciones y diffs desde una sola interfaz.'),
        aviso('Cuando un agente "se porta mal", no culpes al modelo de entrada. Pregunta primero: ¿tenía la herramienta correcta, el permisos adecuado y el contexto necesario? El 80% de los fallos están en el harness.'),
        nota('Regla de diagnóstico: fallo de razonamiento es del modelo; fallo de alcance, permiso, archivo o memoria es del harness. Esa distinción determina qué puedes arreglar hoy.'),
      ],
      errors: [
        err('Cambias de modelo esperando que desaparezca un bug de permisos', 'Confundes razonamiento con configuración del harness', 'Revisa la política de permisos y el workspace antes de cambiar de proveedor'),
        err('El agente olvida decisiones tomadas hace unos turnos', 'El contexto se recorta y la decisión no quedó escrita', 'Guarda la decisión en un archivo del repo o en un checkpoint del hilo')
      ],
      practice: {
        task: 'Toma un agente que usas hoy y etiqueta cada una de sus cinco piezas; señala cuál controlas tú personalmente.',
        success: ['Identificas conversación, tools, filesystem, permisos y contexto', 'Señalas al menos una pieza que puedes cambiar sin cambiar de modelo', 'Explicas un fallo real asignándolo a la capa correcta']
      },
      quiz: [
        q('¿Qué diferencia principal hay entre un modelo y un agent harness?', ['El modelo ejecuta comandos y el harness solo genera texto', 'El modelo predice tokens; el harness gestiona herramientas, permisos, archivos y contexto', 'El harness es un modelo más grande', 'No hay diferencia, son sinónimos'], 1, 'El modelo razona; el harness es el sistema que lo conecta con el mundo y lo limita.'),
        q('¿Qué es T3 Code respecto a un harness individual?', ['Otro harness más potente', 'Un control plane que orquesta varios hilos y harness', 'Un modelo local', 'Un editor de texto'], 1, 'T3 Code se sitúa un nivel por encima: gestiona varios agentes, no sustituye a uno.')
      ]
    }),
    L({
      id: 'a11-2', title: 'Qué es T3 Code', min: 13, level: 'inicial',
      objectives: [
        'Describir T3 Code como control plane open source bajo licencia MIT, creado por Theo Browne / Ping Labs',
        'Explicar por qué no vende tokens y usa tus suscripciones existentes',
        'Conocer las plataformas soportadas y el modelo de servidor local'
      ],
      blocks: [
        p('T3 Code es un control plane open source para agentes de código. No es un modelo, no es un IDE y no es un servicio que facture tokens: es la capa que organiza tus agentes, sus workspaces, sus permisos y sus diffs. Lo crea Theo Browne (Ping Labs) y se distribuye bajo licencia MIT.'),
        enlace('https://t3.codes/', 'Sitio oficial de T3 Code', 'Punto de entrada para descargas, documentación y novedades del proyecto.'),
        enlace('https://github.com/pingdotgg/t3code', 'pingdotgg/t3code en GitHub', 'Repositorio público: código, issues, licencia MIT y hoja de ruta.'),
        diagrama('t3_arquitectura', 'Un servidor local expone una UI que conecta con varios agentes y sus worktrees.'),
        tabla(['Característica', 'Qué significa en la práctica'], [
          ['Open source (MIT)', 'Puedes leer, modificar y auto-hospedar el control plane'],
          ['No vende tokens', 'No hay markup: usas las suscripciones que ya pagas a cada proveedor'],
          ['Multiplataforma', 'Desktop, web e iOS/Android apuntan al mismo servidor'],
          ['Servidor local', 'Los repos y las credenciales viven en tu máquina, no en la nube del producto'],
          ['Multi-proveedor', 'Un mismo hilo puede cambiar de agente sin recrear el workspace']
        ]),
        apunte('Por qué importa el modelo de negocio', 'Si el control plane no vende tokens, su incentivo es ayudarte a usar MENOS tokens y a elegir mejor proveedor, no a consumir más. Eso alinea la herramienta contigo: el ahorro es una feature, no un coste de oportunidad.'),
        codigo('bash', `gh repo fork pingdotgg/t3code
# Trabaja sobre tu fork: código abierto, licencia MIT
git clone git@github.com:<tu-usuario>/t3code.git
cd t3code`, 'Primer contacto con el repositorio: forkear antes de clonar te permite contribuir y seguir el upstream.'),
        aviso('"Usa tus suscripciones" no significa "gratis": sigues pagando Claude, Codex, Cursor u otros. T3 Code evita el recargo, no la factura del proveedor.'),
        nota('La unidad de trabajo no es la terminal, es el hilo. Un hilo agrupa conversación, workspace, permisos y diffs; el control plane es quien los coordina.'),
      ],
      errors: [
        err('Esperas que T3 Code incluya un modelo propio', 'Lo confundes con un producto de IA que factura tokens', 'Entiende que es una capa de orquestación sobre proveedores que ya pagas'),
        err('Dudas de que sea seguro por ser "una web"', 'No distingues UI remota de servidor local', 'Comprueba que el servidor corre en tu máquina y que las credenciales no salen de ella')
      ],
      practice: {
        task: 'Abre el repositorio oficial y verifica tres hechos: licencia, organización autora y que no hay facturación de tokens.',
        success: ['Confirmas la licencia MIT', 'Identificas a Ping Labs / Theo Browne', 'Explicas con tus palabras el modelo de "usa tus suscripciones"']
      },
      quiz: [
        q('¿Qué es T3 Code?', ['Un modelo de lenguaje entrenado por Ping Labs', 'Un control plane open source que orquesta agentes de código', 'Un IDE propietario', 'Una API que vende tokens'], 1, 'Es una capa de orquestación; los modelos y las suscripciones siguen siendo de cada proveedor.'),
        q('¿Qué implica que T3 Code no venda tokens?', ['Que la IA es gratuita', 'Que usas tus suscripciones existentes sin recargo del control plane', 'Que no necesita credenciales', 'Que solo funciona con modelos locales'], 1, 'El producto no añade markup: pagas a los proveedores, no a la capa de orquestación.')
      ]
    }),
    L({
      id: 'a11-3', title: 'Instalación y primeros pasos', min: 14, level: 'inicial',
      objectives: [
        'Preparar los CLIs de los proveedores y su autenticación',
        'Arrancar el servidor local, añadir un proyecto y empezar en modo Supervised'
      ],
      blocks: [
        p('Antes de orquestar agentes, el entorno debe estar limpio: los binarios de cada proveedor en el PATH, cada uno autenticado y un proyecto añadido al control plane. El orden importa porque T3 Code no sustituye a los CLIs, los invoca.'),
        diagrama('diseno_ia', 'Vista general: CLIs autenticados, servidor local, UI y workspaces del proyecto.'),
        pasos([
          { title: '1. Instala el binario t3', text: 'Sigue las instrucciones de t3.codes para tu plataforma y comprueba que t3 está en el PATH.' },
          { title: '2. Instala los CLIs', text: 'Instala claude, codex y opencode (u otros) y verifica que responden con --version.' },
          { title: '3. Autentica cada proveedor', text: 'Ejecuta el login de cada CLI con tu cuenta; T3 Code reutiliza esas sesiones.' },
          { title: '4. Arranca el servidor', text: 'Ejecuta t3 y deja el proceso corriendo en local.' },
          { title: '5. Añade el proyecto y entra en Supervised', text: 'Selecciona el repo, crea el primer hilo y mantén las aprobaciones manuales al principio.' }
        ]),
        codigo('bash', `command -v t3 && t3 --version
command -v claude && claude --version
command -v codex && codex --version
command -v opencode && opencode --version

claude auth login
codex login

t3   # arranca el servidor local`, 'Comprobación de PATH y login. Un CLI sin autenticar aparecerá como no disponible en la UI.'),
        tabla(['Comprobación', 'Señal de éxito', 'Síntoma de fallo'], [
          ['t3 en PATH', 't3 --version imprime versión', 'command not found'],
          ['CLI instalado', '--version responde', 'El proveedor no aparece en la UI'],
          ['Login', 'Sesión activa en el CLI', 'Errores 401 al iniciar un hilo'],
          ['Servidor', 'UI accesible en local', 'Puerto ocupado o proceso caído'],
          ['Proyecto', 'Repo listado y con worktree', 'No se puede crear un hilo']
        ]),
        apunte('Empieza en Supervised', 'El primer día supervisas cada llamada a herramienta. No es desconfianza: es calibración. Necesitas ver qué comandos propone el agente y cuánto tarda, antes de subir el nivel de autonomía.'),
        aviso('Da permisos de escritura solo sobre el directorio del proyecto. Un agente con acceso a todo tu home puede borrar o filtrar archivos que nada tienen que ver con la tarea.'),
        nota('El servidor local es la frontera de confianza: repos, tokens y diffs están en tu máquina. Si abres acceso remoto, esa frontera se mueve; lo veremos en la lección 9.'),
      ],
      errors: [
        err('El proveedor no aparece en la interfaz', 'El CLI no está instalado o no inició sesión', 'Ejecuta command -v y el login correspondiente, y reinicia t3'),
        err('El primer hilo falla al escribir archivos', 'Permisos de filesystem insuficientes o directorio equivocado', 'Añade el proyecto con la ruta correcta y limita los permisos a ese árbol')
      ],
      practice: {
        task: 'Deja funcionando un servidor t3 local con dos proveedores autenticados y un proyecto añadido en modo Supervised.',
        success: ['t3 responde --version', 'Dos CLIs tienen sesión activa', 'Creas un hilo y apruebas manualmente la primera acción']
      },
      quiz: [
        q('¿Por qué hay que autenticar cada CLI por separado?', ['Porque T3 Code no usa las sesiones de los proveedores', 'Porque T3 Code invoca esos CLIs y reutiliza sus credenciales', 'Porque el servidor local no tiene red', 'Porque los tokens caducan al instante'], 1, 'Cada proveedor mantiene su propia sesión; el control plane la aprovecha, no la reemplaza.'),
        q('¿Cuál es el primer modo de permiso recomendable?', ['Full access', 'Auto', 'Supervised', 'Sin permisos'], 2, 'Supervised te permite calibrar qué hace el agente antes de dar más autonomía.')
      ]
    }),
    L({
      id: 'a11-4', title: 'Proveedores soportados y cambio de modelo en mitad del hilo', min: 14, level: 'intermedio',
      objectives: [
        'Listar los proveedores soportados y sus implicaciones prácticas',
        'Cambiar de modelo a mitad de un hilo sin perder el workspace ni la conversación',
        'Razonar sobre el coste cuando cambias de proveedor'
      ],
      blocks: [
        p('T3 Code no te ata a un proveedor. Puedes empezar un hilo con un agente rápido y barato, y cambiar a otro más capaz cuando la tarea se complica. El hilo conserva la conversación y el workspace; solo cambia quien razona el siguiente turno.'),
        tabla(['Proveedor', 'Tipo', 'Uso típico'], [
          ['Claude Code', 'CLI de Anthropic', 'Refactorización y razonamiento largo'],
          ['Codex', 'CLI de OpenAI', 'Implementación y tests'],
          ['Cursor', 'IDE/agente', 'Edición asistida en el editor'],
          ['OpenCode', 'CLI open source', 'Alternativa flexible y multi-modelo'],
          ['Grok Build', 'Agente de xAI', 'Tareas con foco en código reciente'],
          ['Antigravity', 'Agente de Google', 'Experimentos con Gemini'],
          ['Pi', 'Agente ligero', 'Iteraciones rápidas y baratas'],
          ['Kiro', 'Agente con specs', 'Trabajo dirigido por especificaciones'],
          ['Muse Code', 'Agente emergente', 'Pruebas y comparativas'],
          ['fx', 'Agente de nicho', 'Flujos concretos de terminal'],
          ['ACP', 'Protocolo, no modelo', 'Puente para conectar agentes compatibles']
        ]),
        codigo('text', `1. Abre el hilo existente (no crees uno nuevo).
2. Selecciona "cambiar modelo/agente" para el siguiente turno.
3. Elige el proveedor destino y confirma.
4. El agente continúa con el mismo historial y el mismo worktree.`, 'El cambio se aplica al siguiente turno: el contexto y los archivos no se reinician.'),
        apunte('El contexto viaja con el hilo, no con el modelo', 'Como la conversación y el workspace son del hilo, meter un modelo nuevo no te obliga a reexplicar el problema. Eso permite estrategias tipo "Pi explora, Claude implementa, Codex reviewa" sobre el mismo estado.'),
        formula('coste por tarea = (tokens_in × precio_in + tokens_out × precio_out) × número de turnos', 'Cambiar de modelo cambia los precios por token; cambiar de agente cambia también cuántos turnos necesita.'),
        widget('coste-llm'),
        aviso('No compares costes entre proveedores usando solo el precio por token: uno resuelve en 3 turnos y otro en 12. Mide coste por tarea terminada, no coste por mil tokens.'),
        nota('ACP es un protocolo de conexión de agentes, no un modelo ni una suscripción. úsalo como pegamento, no como proveedor de inteligencia.'),
      ],
      errors: [
        err('Al cambiar de modelo el agente "empieza de cero"', 'Creaste un hilo nuevo en vez de cambiar el proveedor del actual', 'Cambia el agente dentro del hilo para conservar historial y workspace'),
        err('El coste se dispara tras cambiar a un modelo caro', 'El modelo nuevo necesita más turnos para la misma tarea', 'Mide coste por tarea y vuelve al modelo anterior si no mejora')
      ],
      practice: {
        task: 'En un hilo real, resuelve la mitad de una tarea con un agente barato y cámbialo para la segunda mitad; mide turnos y coste.',
        success: ['El workspace es el mismo en ambos tramos', 'La conversación no se reinicia', 'Comparas coste por tarea, no solo precio por token']
      },
      quiz: [
        q('¿Qué ocurre al cambiar de modelo dentro de un hilo?', ['Se borra la conversación', 'Se cambia de repositorio', 'Se conservan conversación y workspace y cambia quien razona el siguiente turno', 'Se pierden los permisos'], 2, 'El hilo es la unidad de estado; el modelo es solo el motor del siguiente turno.'),
        q('¿Cuál es la mejor métrica para comparar dos proveedores?', ['Precio por millón de tokens', 'Coste por tarea terminada', 'Número de modelos disponibles', 'Tamaño de la ventana de contexto'], 1, 'El precio por token ignora cuántos turnos necesita cada agente para terminar.')
      ]
    }),
    L({
      id: 'a11-5', title: 'Threads, worktrees y ramas', min: 15, level: 'intermedio',
      objectives: [
        'Explicar por qué cada hilo necesita su propio workspace aislado',
        'Crear worktrees de Git para paralelizar sin colisiones'
      ],
      blocks: [
        p('Un agente editando archivos en el mismo checkout que otro es una receta para conflictos silenciosos: uno sobrescribe lo del otro y los diffs dejan de ser interpretables. La solución es una correspondencia estricta: un hilo, un worktree, una rama.'),
        diagrama('t3_thread', 'Cada hilo apunta a su propio worktree; ningún agente comparte archivos con otro.'),
        codigo('bash', `git worktree add ../t3-feature-login -b feature/login
git worktree add ../t3-fix-cli -b fix/cli-timeout
git worktree list
# Añade cada worktree como proyecto distinto en T3 Code`, 'Dos ramas, dos directorios, dos agentes trabajando en paralelo sin pisarse.'),
        tabla(['Nivel', 'Qué es', 'Regla'], [
          ['Hilo', 'Conversación + permisos + diffs', 'Un objetivo por hilo'],
          ['Worktree', 'Checkout independiente del mismo repo', 'Un hilo por worktree'],
          ['Rama', 'Línea de historia de Git', 'Un worktree por rama'],
          ['Proyecto', 'Entrada en el control plane', 'Apunta a un worktree concreto']
        ]),
        apunte('Aislamiento antes que velocidad', 'El paralelismo solo es gratis si los worktrees son independientes. Si dos tareas tocan los mismos archivos, secuéncialas en un mismo hilo; el coste de resolver conflictos supera el ahorro de tiempo.'),
        pasos([
          { title: '1. Crea la rama', text: 'Parte de main con un nombre descriptivo y acotado.' },
          { title: '2. Crea el worktree', text: 'git worktree add ../t3-<tarea> -b <rama>.' },
          { title: '3. Añade el proyecto', text: 'En T3 Code, apunta al directorio del worktree, no al repo original.' },
          { title: '4. Lanza el hilo', text: 'Describe el objetivo y mantén el modo Supervised hasta revisar el primer diff.' },
          { title: '5. Limpia', text: 'git worktree remove ../t3-<tarea> tras fusionar o descartar la rama.' }
        ]),
        aviso('No edites a mano un archivo de un worktree mientras el agente está trabajando en él. Tu cambio y el suyo se mezclarán en el mismo diff y perderás la trazabilidad de quién hizo qué.'),
        nota('Los worktrees son baratos: comparten el almacenamiento de objetos de Git. No hay excusa para no usar uno por hilo.'),
      ],
      errors: [
        err('Dos agentes sobrescriben el mismo archivo', 'Compartían checkout', 'Un hilo por worktree y un worktree por rama'),
        err('git worktree add falla: la rama ya está usada', 'La rama está checkout en otro worktree', 'Crea una rama nueva o elimina el worktree que la ocupa')
      ],
      practice: {
        task: 'Crea dos worktrees para dos tareas independientes y lanza un hilo en cada uno.',
        success: ['git worktree list muestra dos rutas', 'Cada hilo apunta a un worktree distinto', 'Los diffs no se solapan']
      },
      quiz: [
        q('¿Por qué un hilo necesita su propio worktree?', ['Porque el modelo es más rápido así', 'Para aislar archivos y evitar que dos agentes se sobrescriban', 'Porque Git no permite varias ramas', 'Porque T3 Code solo admite un proyecto'], 1, 'El aislamiento de filesystem es lo que hace seguro el paralelismo.'),
        q('¿Qué relación debe haber entre hilo, worktree y rama?', ['Muchos hilos por worktree', 'Una correspondencia uno a uno', 'Una rama para todos los hilos', 'Un worktree para todas las ramas'], 1, 'Uno a uno: es la regla que mantiene los diffs interpretables.')
      ]
    }),
    L({
      id: 'a11-6', title: 'Modos de permiso: Supervised, Auto-accept edits, Auto, Full access', min: 14, level: 'intermedio',
      objectives: [
        'Distinguir los cuatro modos de permiso y qué autoriza cada uno',
        'Elegir el modo según la tarea, el repo y la confianza acumulada'
      ],
      blocks: [
        p('El modo de permiso es el freno del sistema. T3 Code separa cuatro niveles para que decidas cuánta autonomía das en cada momento: desde aprobarlo todo hasta dejar que el agente edite, ejecute y haga push sin preguntar.'),
        diagrama('t3_permisos', 'Cuatro niveles de autonomía: de la aprobación manual al acceso completo.'),
        tabla(['Modo', 'Qué permite', 'Cuándo usarlo'], [
          ['Supervised', 'Todo requiere aprobación explícita', 'Primer hilo, repo desconocido, tareas sensibles'],
          ['Auto-accept edits', 'Acepta cambios de archivos automáticamente; comandos siguen pidiendo permiso', 'Tareas de edición acotadas con tests rápidos'],
          ['Auto', 'Edita y ejecuta comandos habituales sin preguntar', 'Flujos repetidos ya validados, con red y push controlados'],
          ['Full access', 'Acceso completo a shell, red y git sin aprobación', 'Entornos desechables donde el riesgo es aceptable']
        ]),
        codigo('bash', `t3 --mode supervised          # punto de partida
# La UI permite cambiar de modo por hilo en caliente
# t3 policy check policy.json   # verifica la política del equipo`, 'Los nombres de flags pueden variar entre versiones; el concepto es un modo por hilo, no global.'),
        apunte('Auto-accept edits no es Full access', 'Aceptar diffs automáticamente no autoriza ejecutar un rm, instalar dependencias arbitrarias ni hacer push. Son niveles distintos: uno relaja la revisión de archivos, el otro elimina la supervisión de ejecución.'),
        aviso('Full access en un repo con secretos o datos de clientes es una apuesta que no puedes deshacer con un revert. Úsalo solo en entornos que puedas tirar y recrear.'),
        lista([
          'Sube de modo cuando el agente haya acertado 5–10 turnos seguidos en tareas parecidas.',
          'Baja de modo en cuanto aparezca un comando que no entiendes.',
          'Nunca subas el modo por pereza: sube porque hay evidencia y tests que te avisan.',
          'Cambia el modo por hilo, no para todo el equipo.'
        ], true),
        nota('Regla práctica: el modo debe ser proporcional al coste de equivocarse. Si un error cuesta diez minutos, Auto está bien; si cuesta un incidente, quédate en Supervised.'),
      ],
      errors: [
        err('El agente ejecutó un comando que no aprobaste', 'Estabas en Auto o Full access sin querer', 'Vuelve a Supervised y revisa el modo del hilo antes de continuar'),
        err('Auto-accept edits no aceptó un cambio de archivo', 'El cambio implicaba una acción fuera de ese nivel, como un comando', 'Revisa el tipo de acción: edits y comandos se aprueban por separado')
      ],
      practice: {
        task: 'Clasifica tres tareas reales en los cuatro modos y justifica el nivel elegido por el coste de equivocarse.',
        success: ['Asignas las tres tareas', 'Justificas con riesgo y evidencia', 'Identificas cuál se queda en Supervised']
      },
      quiz: [
        q('¿Qué distingue a Auto-accept edits de Full access?', ['Son idénticos', 'Auto-accept edits solo automatica cambios de archivos; Full access elimina la aprobación de comandos y red', 'Full access es más restrictivo', 'Auto-accept edits prohíbe editar'], 1, 'La diferencia está en qué tipo de acción se autoriza sin aprobación.'),
        q('¿Cuándo conviene usar Supervised?', ['Cuando ya hay mucha confianza y tests', 'En el primer hilo o en tareas sensibles', 'Siempre, para todo', 'Solo en producción'], 1, 'Es el modo de calibración inicial y de tareas con alto coste de error.')
      ]
    }),
    L({
      id: 'a11-7', title: 'Diffs, checkpoints y revert', min: 13, level: 'intermedio',
      objectives: [
        'Revisar los cambios turno a turno en el visor de diffs',
        'Revertir archivos y conversación de forma coordinada y dejar comentarios en línea'
      ],
      blocks: [
        p('La supervisión solo es real si puedes leer qué cambió y volver atrás. T3 Code organiza el trabajo en turnos, cada uno con su diff, y guarda checkpoints que agrupan estado de archivos y conversación.'),
        pasos([
          { title: '1. Revisa el diff del turno', text: 'Lee los archivos tocados antes de aceptar; busca cambios fuera del alcance pedido.' },
          { title: '2. Comenta en línea', text: 'Señala la línea concreta y escribe la corrección como si fuera un code review.' },
          { title: '3. Deja que el agente responda', text: 'El comentario vuelve al hilo como una nueva instrucción contextualizada.' },
          { title: '4. Usa un checkpoint', text: 'Marca el punto bueno antes de un cambio arriesgado.' },
          { title: '5. Revierte si hace falta', text: 'Vuelve al checkpoint: archivos y conversación se revierten juntos.' }
        ]),
        tabla(['Acción', 'Alcance', 'Reversibilidad'], [
          ['Comentario en línea', 'Una línea del diff', 'Alta: es una instrucción, no un cambio'],
          ['Aceptar diff', 'Archivos del turno', 'Media: hay checkpoint anterior'],
          ['Checkpoint', 'Archivos + conversación', 'Es el punto de retorno'],
          ['Revert', 'Hasta el checkpoint elegido', 'Alta si no hay commits de por medio']
        ]),
        codigo('text', `# Comentario en línea sobre este fragmento del diff:
- const result: any = await fetchData();
+ const result: Result = await fetchData();
  // "Usa el tipo Result del dominio, no any. Sin any en esta capa."`, 'Un comentario concreto en la línea correcta es más eficaz que un párrafo genérico al final del hilo.'),
        apunte('Checkpoint = archivos + conversación', 'Revertir solo los archivos deja al agente recordando decisiones que ya no existen en el disco. El checkpoint coordinado evita esa esquizofrenia: vuelve el código y vuelve el razonamiento que lo produjo.'),
        aviso('Si ya hiciste commit y push, un revert local no deshace el historial remoto. En ese caso, revierte con un commit nuevo o revierte la PR; no reescribas historial compartido sin acuerdo.'),
        nota('Trata cada turno como un commit de revisión: pequeño, legible y con un mensaje claro. Los diffs gigantes son imposibles de supervisar.'),
      ],
      errors: [
        err('Tras revertir, el agente sigue defendiendo un código que ya no está', 'Revertiste archivos sin la conversación', 'Usa el checkpoint para revertir ambos a la vez'),
        err('El comentario no surtió efecto', 'Escribiste una crítica vaga en vez de una instrucción sobre la línea', 'Comenta la línea exacta con el cambio esperado')
      ],
      practice: {
        task: 'En un hilo, provoca un cambio incorrecto, comenta la línea y revierte al checkpoint anterior.',
        success: ['El diff se revisó por turno', 'El comentario apunta a una línea concreta', 'Tras el revert, archivos y conversación coinciden']
      },
      quiz: [
        q('¿Qué ventaja tiene un checkpoint sobre un git checkout puntual?', ['Es más rápido', 'Incluye también la conversación, no solo los archivos', 'Borra el historial', 'Hace push automático'], 1, 'El checkpoint captura código y razonamiento juntos.'),
        q('¿Dónde debe ir un comentario útil al agente?', ['En un documento externo', 'En la línea concreta del diff', 'En el título de la PR', 'En un chat distinto'], 1, 'El comentario en línea llega con el contexto exacto del cambio.')
      ]
    }),
    L({
      id: 'a11-8', title: 'Git en un clic: commit, push y PR', min: 13, level: 'intermedio',
      objectives: [
        'Crear commits, push y pull requests desde el control plane',
        'Generar título y cuerpo de PR con criterio y usar draft y stack PRs'
      ],
      blocks: [
        p('Una vez revisado el diff, el último tramo —commit, push y PR— también se delega. T3 Code puede generar el mensaje y el cuerpo de la PR a partir del hilo, pero la responsabilidad de lo que se publica sigue siendo tuya.'),
        pasos([
          { title: '1. Revisa el diff final', text: 'Confirma que solo están los cambios acordados y que los tests pasan.' },
          { title: '2. Genera el commit', text: 'Deja que el agente proponga mensaje; ajústalo si no describe el porqué.' },
          { title: '3. Push', text: 'Publica la rama del worktree asociado al hilo.' },
          { title: '4. Abre la PR', text: 'Revisa título, cuerpo, checklist y cambios antes de marcarla lista.' },
          { title: '5. Decide draft o final', text: 'Usa draft si aún falta revisión o si la PR depende de otra.' }
        ]),
        codigo('bash', `git status --short
git diff --stat
git add -A && git commit -m "fix: evita timeout en el CLI de t3"
git push -u origin fix/cli-timeout
gh pr create --draft --title "fix: timeout del CLI" --body "Contexto y pasos de verificación"`, 'Secuencia equivalente a la que automatiza la UI: conviene saberla ejecutar a mano.'),
        tabla(['Acción', 'Qué genera el agente', 'Qué revisas tú'], [
          ['Commit', 'Mensaje a partir del diff', 'Que explique el porqué, no solo el qué'],
          ['Push', 'Rama remota', 'Que sea la rama correcta del worktree'],
          ['PR', 'Título y cuerpo', 'Alcance, tests y riesgo'],
          ['Draft/stack', 'Estado y dependencias', 'Orden y base de cada PR']
        ]),
        apunte('PR generado no es PR revisado', 'El cuerpo sale del hilo y puede incluir frases optimistas del agente. Léelo como si lo hubiera escrito un compañero nuevo: corrige afirmaciones sin evidencia y añade los comandos que tú ejecutaste de verdad.'),
        aviso('No hagas push de secretos ni de archivos de entorno. Antes del primer push, confirma que .gitignore cubre .env, credenciales y artefactos generados.'),
        nota('Los stack PRs dividen un cambio grande en PRs encadenadas: cada una se apoya en la anterior. Son útiles para que un agente trabaje por capas sin entregar un diff imposible de revisar.'),
      ],
      errors: [
        err('La PR incluye archivos que nadie pidió', 'El hilo acumuló cambios de otra tarea', 'Vuelve al checkpoint y separa la tarea en otro worktree'),
        err('El título de la PR es una frase genérica', 'Se aceptó el texto generado sin revisar', 'Reescribe el título con el cambio y el efecto medible')
      ],
      practice: {
        task: 'Lleva un hilo desde el diff final hasta una PR en draft con título y cuerpo revisados por ti.',
        success: ['La rama corresponde al worktree', 'El mensaje explica el porqué', 'La PR está en draft y el cuerpo incluye verificación real']
      },
      quiz: [
        q('¿Qué debes revisar antes de dar una PR por buena?', ['Solo que el título suene bien', 'Alcance, tests ejecutados y ausencia de secretos', 'El número de archivos', 'Que la haya generado el agente'], 1, 'La responsabilidad sigue siendo tuya: contenido, verificación y seguridad.'),
        q('¿Para qué sirve una PR en draft dentro de un stack?', ['Para publicar código terminado', 'Para marcar dependencias y señalar que aún falta revisión', 'Para evitar tests', 'Para borrar el historial'], 1, 'El draft señala trabajo en curso y permite encadenar PRs.')
      ]
    }),
    L({
      id: 'a11-9', title: 'Remoto y móvil: LAN, Tailscale, T3 Connect y policy.json', min: 14, level: 'avanzado',
      objectives: [
        'Acceder al control plane desde la LAN, Tailscale o T3 Connect y aprobar acciones desde el móvil',
        'Aplicar una política gestionada con policy.json y verificarla con t3 policy check'
      ],
      blocks: [
        p('El servidor corre en tu máquina, pero la interfaz puede estar en otro dispositivo. Eso permite aprobar un diff desde el móvil mientras el agente sigue trabajando. Cada forma de acceso amplía la superficie de ataque, así que conviene elegirla con criterio.'),
        tabla(['Vía', 'Alcance', 'Cuándo usarla'], [
          ['LAN', 'Misma red local', 'Equipos de confianza en casa u oficina'],
          ['Tailscale', 'Red privada mesh', 'Equipos distribuidos sin exponer puertos'],
          ['T3 Connect', 'Puente gestionado del producto', 'Acceso rápido fuera de casa con la configuración oficial'],
          ['Móvil', 'Cliente iOS/Android', 'Aprobar diffs y comandos en movimiento']
        ]),
        apunte('Aprobar desde el móvil es HITL, no piloto automático', 'El teléfono sirve para dar o negar una aprobación, no para revisar un diff de 500 líneas a toda prisa. Si no puedes leer el cambio con criterio, recházalo y revísalo en pantalla grande.'),
        codigo('json', `{
  "version": 1,
  "defaultMode": "supervised",
  "allowedProviders": ["claude-code", "codex", "opencode"],
  "requireApprovalFor": ["edit", "shell", "push", "pr_create"],
  "deniedTools": ["shell:rm -rf", "network:unknown-host"],
  "maxParallelThreads": 3
}`, 'Ejemplo orientativo de policy.json: consulta el esquema real del repositorio antes de usarlo en un equipo.'),
        codigo('bash', `t3 policy check policy.json
# Valida la política antes de desplegarla al equipo`, 'Una política que no se valida en CI es una política que nadie cumple.'),
        aviso('Nunca expongas el servidor directamente a Internet sin autenticación. Un panel de control de agentes con acceso a tu filesystem es un objetivo muy atractivo.'),
        lista([
          'La política del equipo fija el modo por defecto y las acciones que siempre requieren aprobación.',
          'Los límites de hilos paralelos evitan que decenas de agentes agoten las cuotas de los proveedores.',
          'La lista de proveedores permitidos impide que un hilo use una cuenta personal no autorizada.',
          'Revisa la política en el mismo PR que la introduce: es código, no documentación.'
        ]),
        nota('Para equipos, la política es la interfaz: convierte decisiones de seguridad en un archivo versionado y verificable.'),
      ],
      errors: [
        err('El móvil ve el servidor en casa pero no fuera', 'Estás usando LAN sin Tailscale ni T3 Connect', 'Configura una red privada o el puente oficial en vez de abrir puertos'),
        err('t3 policy check falla en CI pero funciona en local', 'El archivo validado no es el mismo que se despliega', 'Versiona policy.json y ejecuta el check sobre la ruta exacta del pipeline')
      ],
      practice: {
        task: 'Escribe una policy.json para tu equipo y haz que pase t3 policy check en local y en CI.',
        success: ['El modo por defecto es Supervised', 'Las acciones sensibles requieren aprobación', 'El check se ejecuta en el pipeline']
      },
      quiz: [
        q('¿Qué es lo más seguro para acceder al servidor fuera de casa?', ['Abrir el puerto en el router', 'Tailscale o el mecanismo oficial de T3 Connect', 'Compartir la contraseña por chat', 'Desactivar la autenticación'], 1, 'Una red privada o el puente gestionado evita exponer el panel de control.'),
        q('¿Qué aporta policy.json a un equipo?', ['Documentación informal', 'Una política versionada y verificable con t3 policy check', 'Un modelo local', 'Un respaldo automático'], 1, 'Convierte las reglas de seguridad en código revisable.')
      ]
    }),
    L({
      id: 'a11-10', title: 'Orquestación real: un agente implementa, otro revisa', min: 16, level: 'avanzado',
      objectives: [
        'Dividir una tarea entre un agente implementador y otro revisor independiente',
        'Decidir qué delegar y qué no, y conocer los límites de la herramienta'
      ],
      blocks: [
        p('El salto de "un agente en una terminal" a "control plane" ocurre cuando separas roles. Un agente implementa en su worktree; otro, con contexto limpio, revisa el diff sin haber escrito el código. El revisor no es un duplicado: es una opinión independiente.'),
        diagrama('orquestacion_trabajo', 'Dividir, implementar en paralelo, revisar con contexto limpio y fusionar.'),
        diagrama('multiagente', 'Varios agentes con roles distintos coordinados por el control plane.'),
        diagrama('mcp', 'Las herramientas se exponen por MCP: el mismo agente puede usarlas con distinto proveedor.'),
        tabla(['Delegar', 'No delegar'], [
          ['Implementación acotada con tests', 'Decidir prioridades de producto'],
          ['Revisión de un diff con criterios explícitos', 'Aprobar cambios sin leerlos'],
          ['Generar documentación a partir de código', 'Escribir credenciales o secretos en un prompt'],
          ['Explorar un repo y resumir hallazgos', 'Tareas sensibles sin supervisión'],
          ['Refactorizaciones con cobertura de tests', 'Fusionar un cambio que no entiendes']
        ]),
        apunte('El revisor independiente', 'Un agente que escribió el código tiende a defenderlo. Un segundo agente que solo ve el diff y los requisitos detecta supuestos que el primero dio por buenos. Pídele que cite la línea y el criterio, no que opine en general.'),
        pasos([
          { title: '1. Divide', text: 'Separa la tarea en unidades con un solo criterio de aceptación cada una.' },
          { title: '2. Aísla', text: 'Un worktree y un hilo por unidad; define quién implementa y quién revisa.' },
          { title: '3. Instruye', text: 'Escribe el criterio de aceptación y lo que está fuera de alcance.' },
          { title: '4. Revisa', text: 'El segundo agente lee el diff, ejecuta tests y deja comentarios en línea.' },
          { title: '5. Fusiona', text: 'Tú decides qué se mergea; el agente no cierra su propia revisión.' }
        ]),
        aviso('Límites reales: T3 Code no soporta modelos locales, y existe un bug conocido de rate limits de 5 horas con Claude. Si tu flujo depende de una cuenta Claude, prevé pausas y no apiles hilos infinitos contra la misma cuota.'),
        nota('La orquestación no es más agentes: es más claridad sobre quién hace qué y quién decide. Sin criterio de aceptación, dos agentes paralelos solo producen dos veces el mismo error.'),
      ],
      errors: [
        err('Dos agentes producen soluciones incompatibles', 'No había criterio de aceptación ni límites de alcance', 'Escribe la definición de "terminado" antes de lanzar los hilos'),
        err('Los hilos se paran por rate limit', 'Varios agentes comparten la misma cuota de Claude de 5 horas', 'Reduce hilos paralelos, rota proveedor y respeta las pausas')
      ],
      practice: {
        task: 'Orquesta una tarea pequeña con dos hilos: uno implementa y otro revisa con un criterio explícito. Documenta lo que no delegaste.',
        success: ['Hay dos worktrees aislados', 'El revisor no es el autor', 'Listas al menos dos decisiones que conservaste tú']
      },
      quiz: [
        q('¿Qué hace valioso a un agente revisor?', ['Que escriba código más rápido', 'Que tenga contexto limpio y pueda cuestionar supuestos', 'Que use el mismo modelo siempre', 'Que apruebe automáticamente'], 1, 'La independencia es el valor: no defenderá lo que no escribió.'),
        q('¿Cuál es un límite real de T3 Code?', ['Solo funciona en terminal', 'No soporta modelos locales y tiene un bug conocido de rate limits de 5 h con Claude', 'No puede hacer PRs', 'No tiene interfaz móvil'], 1, 'Son restricciones documentadas que debes planificar.')
      ]
    }),
    L({
      id: 'a11-11', title: 'Reglas de seguridad y cuándo NO usar T3 Code', min: 14, level: 'intermedio',
      objectives: [
        'Aplicar una checklist de seguridad antes de ampliar permisos',
        'Reconocer los escenarios en los que un solo agente —o ninguno— es mejor opción'
      ],
      blocks: [
        p('La herramienta más potente es la que sabes no usar. T3 Code brilla cuando hay varias tareas aisladas, tests que avisan y una persona dispuesta a revisar. Fuera de ese contexto, añade superficie de ataque y ruido sin producir valor.'),
        h('Cuándo NO orquestar varios agentes'),
        lista([
          'Una sola tarea pequeña: abrir tres hilos para cambiar una función es peor que usar un agente.',
          'Tareas sensibles: secretos, datos de clientes, pagos o decisiones legales requieren criterio humano y trazabilidad.',
          'Repo sin tests: sin una red de seguridad, no puedes saber si un cambio es correcto ni revertir con confianza.',
          'Cambios que no entiendes: si no puedes explicar el diff, no puedes aprobarlo.',
          'Equipos sin política: permisos individuales inconsistentes producen incidentes y cuotas descontroladas.'
        ]),
        tabla(['Riesgo', 'Mitigación concreta'], [
          ['Ejecución destructiva', 'Supervised y denegar shell:rm -rf en la política'],
          ['Fuga de secretos', '.gitignore, escaneo antes del push y prompts sin credenciales'],
          ['Conflictos entre agentes', 'Un hilo por worktree y una rama por trabajo'],
          ['Cuotas agotadas', 'Límite de hilos paralelos y rotación de proveedores'],
          ['Cambios no detectados', 'Tests en CI y revisión obligatoria del diff']
        ]),
        codigo('bash', `npm test && npm run typecheck || exit 1
# Solo cuando la red de seguridad está verde, deja que el agente continúe`, 'La verificación es la condición de entrada para dar más autonomía, no un trámite posterior.'),
        apunte('El criterio de "no usar" es una habilidad', 'Decir "esto lo hago yo solo" no es falta de ambición: es conocer el coste de equivocarse. Un ingeniero senior se reconoce por cuándo desactiva la automatización.'),
        aviso('Un repo sin tests no es un problema que el agente deba cubrir: es un prerrequisito. Primero escribe la prueba que falla; después deja que el agente la haga pasar.'),
        p('Cierre del módulo: la práctica no es lanzar más agentes, sino diseñar el sistema alrededor de ellos —workspace aislado, permisos proporcionales, diffs revisables, política versionada y un humano que decide. Eso es orquestar un control plane, no coleccionar terminales.'),
        nota('Resumen: un hilo por tarea, un worktree por hilo, el modo mínimo que funcione, un checkpoint antes de arriesgar y un revisor que no sea el autor.'),
      ],
      errors: [
        err('Activaste Full access en un repo sin tests', 'No había red de seguridad ni criterio de reversión', 'Añade tests y vuelve a Supervised antes de seguir'),
        err('El equipo tiene cuotas agotadas y hilos colgados', 'Demasiados agentes paralelos sobre la misma suscripción', 'Limita maxParallelThreads y rota proveedores')
      ],
      practice: {
        task: 'Practica el criterio de "no usar": elige un cambio real, decide si merece T3 Code y escribe las tres razones por las que sí o no.',
        success: ['Evalúas tests, sensibilidad y número de tareas', 'Justificas el modo de permiso elegido', 'Si decides no usar la herramienta, explicas qué harías en su lugar']
      },
      quiz: [
        q('¿Cuál es una razón válida para NO usar T3 Code?', ['Que el repo tenga muchos archivos', 'Que sea una sola tarea pequeña en un repo sin tests', 'Que uses Git', 'Que el equipo trabaje en remoto'], 1, 'Sin red de seguridad y con una sola tarea, la orquestación añade coste sin valor.'),
        q('¿Qué es lo primero que debe haber antes de dar autonomía a un agente?', ['Un prompt largo', 'Tests y un modo de permiso proporcional al riesgo', 'Más agentes', 'Acceso root'], 1, 'La verificación y el freno son los prerrequisitos de la autonomía.')
      ]
    })
  ]),

  // ==================== a12: MÉTODO JENSEN HUANG ====================
  M('a12', 'Exprimir la IA al máximo: el método Jensen Huang', 'Aprender con IA hasta entenderla, y convertirlo en ventaja profesional', [
    L({
      id: 'a12-1', title: 'La idea central: quién explota mejor la tecnología', min: 12, level: 'inicial',
      objectives: [
        'Entender la tesis de que la carrera es quién explota mejor la tecnología',
        'Usar la IA como herramienta de aprendizaje, no como sustituto del criterio'
      ],
      blocks: [
        p('En una entrevista del All-In Podcast de septiembre de 2026, Jensen Huang resume la competencia actual con una frase incómoda: la carrera no es quién inventa la tecnología, sino quién consigue explotarla mejor. La tecnología ya está disponible para casi todos; la ventaja está en el uso que le das.'),
        h('La tesis en una frase'),
        enlace('https://www.allinpodcast.co/', 'All-In Podcast', 'Fuente de la intervención de septiembre de 2026 sobre cómo explotar la tecnología.'),
        tabla(['Explotar la IA', 'Delegar en la IA'], [
          ['La usas para entender un tema más rápido', 'La usas para no tener que entenderlo'],
          ['Tú formulas y evalúas las preguntas', 'Aceptas la primera respuesta'],
          ['El output entra en tu criterio', 'El output sustituye tu criterio'],
          ['Construyes ventaja durable', 'Construyes dependencia']
        ]),
        apunte('Aprender es el uso de mayor rendimiento', 'Un modelo puede darte una respuesta en segundos, pero el valor está en que, al terminar, tú sepas por qué esa respuesta es correcta. Mañana el modelo cambiará; tu comprensión no caduca.'),
        p('Esto no es un consejo motivacional. Es una decisión de diseño sobre tu flujo de trabajo: cada vez que abres una IA, puedes pedirle el resultado o pedirle que te enseñe a obtenerlo. La segunda opción es más lenta hoy y mucho más rápida dentro de un año.'),
        aviso('Si tu uso de IA termina siempre en copiar y pegar, no estás explotando la tecnología: estás alquilando una respuesta. La alquilas mientras la suscripción esté activa.'),
        nota('Marco para el módulo: preguntar mejor, verificar más y medir el resultado. Todo lo demás es ruido.'),
      ],
      errors: [
        err('Usas IA a diario pero no puedes explicar un tema que "resolvió"', 'Delegaste el entendimiento junto con la tarea', 'Pide una explicación hasta que puedas reconstruirla sin ayuda'),
        err('Cambias de herramienta y tu resultado no mejora', 'La ventaja está en el método, no en el modelo', 'Trabaja el bucle de preguntas y la verificación')
      ],
      practice: {
        task: 'Elige un tema que creas entender y explícalo sin IA; después pide a la IA que encuentre los huecos de tu explicación.',
        success: ['Escribes la explicación antes de consultar', 'Identificas al menos un hueco real', 'Puedes reformular el tema con tus palabras']
      },
      quiz: [
        q('¿Dónde está la ventaja competitiva hoy según la tesis de Huang?', ['En tener el modelo más grande', 'En quién explota mejor la tecnología disponible', 'En pagar más suscripciones', 'En evitar la IA'], 1, 'La tecnología es accesible; el diferencial está en el uso.'),
        q('¿Qué distingue a alguien que explota la IA de alguien que delega en ella?', ['Usar modelos más caros', 'Aprender hasta entender y mantener el criterio', 'Copiar más respuestas', 'Escribir menos'], 1, 'La comprensión y el juicio son los que se acumulan.')
      ]
    }),
    L({
      id: 'a12-2', title: 'Si no sabes preguntar, pregúntale cómo preguntar', min: 12, level: 'inicial',
      objectives: [
        'Pedir a la IA que formule la pregunta correcta antes de responder',
        'Revisar la pregunta resultante para no delegar tus prioridades'
      ],
      blocks: [
        p('En una entrevista de julio de 2025 en Fareed Zakaria GPS de CNN, Huang describe un hábito simple: si no sabes qué preguntar, le pides a la IA que te ayude a formular la pregunta. La idea es poderosa porque la calidad de la respuesta está limitada por la calidad de la pregunta.'),
        codigo('text', `No respondas todavía a mi duda sobre [tema].
Primero ayúdame a formular la pregunta: dime qué información
falta, qué supuestos debo hacer y qué alternativas de pregunta
existirían según lo que quiero conseguir.`, 'Pedir la pregunta antes que la respuesta invierte el flujo habitual y revela supuestos ocultos.'),
        pasos([
          { title: '1. Di qué quieres conseguir', text: 'No describas el tema: describe el objetivo y la decisión que tomarás.' },
          { title: '2. Pide opciones de pregunta', text: 'Que la IA proponga varias formulaciones, no una sola.' },
          { title: '3. Revisa los supuestos', text: 'Señala qué da por bueno y si coincide con tu realidad.' },
          { title: '4. Elige y reformula', text: 'La pregunta final la escribes tú, con tus prioridades.' }
        ]),
        apunte('La pregunta es una decisión de prioridades', 'Dos preguntas razonables sobre el mismo tema pueden llevar a respuestas distintas. Al elegir la pregunta estás decidiendo qué importa. Por eso no conviene delegar ese paso por completo.'),
        tabla(['Pregunta débil', 'Pregunta fuerte'], [
          ['¿Qué me recomiendas para mejorar?', '¿Qué cambio en mi pipeline de RAG reduce más la latencia p95 con menos de 20 dólares al mes?'],
          ['Explícame IA', 'Explícame atención de Transformers a alguien que sabe álgebra lineal pero no redes'],
          ['¿Es buena esta idea?', '¿Qué supuestos de esta idea fallarían primero y cómo los comprobaría?']
        ]),
        aviso('La IA tiende a formular preguntas cómodas para ella, no difíciles para ti. Si todas las opciones que propone se pueden responder en un párrafo, pídele explícitamente una pregunta que pueda contradecir tu hipótesis.'),
        nota('Esta técnica es barata y sube el techo de todo lo que viene después: mejores preguntas producen mejores respuestas y mejor aprendizaje.'),
      ],
      errors: [
        err('La respuesta es correcta pero inútil', 'La pregunta era demasiado genérica', 'Primero pide alternativas de pregunta y elige según tu objetivo'),
        err('Aceptaste la pregunta que propuso la IA sin revisarla', 'Delegaste tus prioridades', 'Contrasta los supuestos de la pregunta con tu contexto real')
      ],
      practice: {
        task: 'Toma una duda real tuya y usa el prompt de esta lección para generar tres preguntas; elige una y justifica por qué.',
        success: ['Tienes tres formulaciones', 'Identificas los supuestos', 'La pregunta elegida incluye una restricción concreta']
      },
      quiz: [
        q('¿Cuál es el riesgo de delegar también la formulación de la pregunta?', ['Que la respuesta sea muy larga', 'Que adoptes prioridades y supuestos que no son tuyos', 'Que la IA se niegue', 'Que falte contexto técnico'], 1, 'La pregunta codifica objetivos: quien la elige decide qué importa.'),
        q('¿Qué deberías pedirle a la IA antes de una respuesta importante?', ['Que adivine tu intención', 'Varias formulaciones de la pregunta y sus supuestos', 'Que responda lo más corto posible', 'Que use otro modelo'], 1, 'Comparar preguntas revela qué supuesto está haciendo el trabajo.')
      ]
    }),
    L({
      id: 'a12-3', title: 'El bucle de aprendizaje recursivo', min: 13, level: 'inicial',
      objectives: [
        'Aplicar el bucle explicación simple → confusión → siguiente pregunta',
        'Convertir una confusión vaga en una pregunta concreta y respondible'
      ],
      blocks: [
        p('Aprender con IA no es una consulta, es un bucle. Huang lo describe como una recursión: pides una explicación sencilla, identificas exactamente qué no entendiste, y esa confusión se convierte en la siguiente pregunta. Repites hasta poder explicarlo tú.'),
        diagrama('huang_loop', 'Explicar, detectar el hueco, preguntar de nuevo y volver a explicar.'),
        pasos([
          { title: '1. Explicación simple', text: 'Pide la versión más sencilla, con un ejemplo concreto y sin jerga.' },
          { title: '2. Señala el hueco', text: 'Di qué frase exacta no encaja; evita "no lo entiendo" sin más.' },
          { title: '3. Siguiente pregunta', text: 'Reformula el hueco como una pregunta con contexto.' },
          { title: '4. Vuelve a explicar', text: 'Pide que reexplique solo esa parte, conectándola con lo anterior.' },
          { title: '5. Cierra tú', text: 'Explica el tema completo con tus palabras y sin mirar la pantalla.' }
        ]),
        codigo('text', `Explícame [concepto] como si tuviera 15 años y usa un ejemplo
de cocina. Después dime qué partes suelen confundir a quien
aprende esto por primera vez. Yo te indicaré cuál no me
queda clara y reexplicarás solo esa parte.`, 'El prompt establece el bucle desde el principio: explicar, diagnosticar la confusión y reexplicar.'),
        apunte('La confusión es el combustible', 'Un "no lo entiendo" genérico produce otra explicación genérica. Un "no entiendo por qué el gradiente apunta al descenso si la pérdida es positiva" produce una explicación precisa. Cuanto más concreto el hueco, mejor la iteración.'),
        lista([
          'Frase puente: "Hasta aquí lo sigo; me pierdo en…"',
          'Frase puente: "¿Por qué no funciona igual si cambio…?"',
          'Frase puente: "Dame un caso donde esta regla falle."',
          'Cierre: "Ahora explícamelo yo a ti y corrígeme."'
        ]),
        aviso('El bucle se rompe si solo lees las respuestas. Sin el paso final de explicar tú, la sensación de entender es una ilusión producida por la fluidez del texto.'),
        nota('Señal de que el bucle terminó: puedes explicar el concepto, aplicarlo a un caso nuevo y decir dónde deja de ser válido.'),
      ],
      errors: [
        err('La IA reexplica lo mismo una y otra vez', 'Dijiste "no lo entiendo" sin señalar la frase concreta', 'Marca la frase exacta y pide que explique solo esa parte'),
        err('Al día siguiente no recuerdas nada', 'Falta el cierre: explicar tú sin mirar', 'Cierra cada bucle con una explicación propia de dos minutos')
      ],
      practice: {
        task: 'Elige un concepto técnico y completa tres iteraciones del bucle; termina explicándolo tú en un párrafo.',
        success: ['Tres iteraciones con huecos concretos', 'El párrafo final es sin mirar la IA', 'Identificas un caso donde el concepto no aplica']
      },
      quiz: [
        q('¿Qué convierte una consulta en un bucle de aprendizaje?', ['Repetir la misma pregunta', 'Usar la confusión concreta como siguiente pregunta y cerrar explicando tú', 'Cambiar de modelo cada vez', 'Leer más rápido'], 1, 'La recursión sobre el hueco es lo que produce comprensión.'),
        q('¿Cuál es el mejor cierre del bucle?', ['Guardar el chat', 'Pedir un resumen', 'Explicar el tema tú y detectar dónde falla', 'Hacer otra pregunta genérica'], 2, 'Explicar sin ayuda revela lo que realmente sabes.')
      ]
    }),
    L({
      id: 'a12-4', title: 'Pide una crítica, compara respuestas y vuelve a la fuente', min: 13, level: 'intermedio',
      objectives: [
        'Pedir a otra IA una crítica escéptica y comparar dos respuestas',
        'Verificar fechas y cifras en la fuente primaria antes de aceptarlas'
      ],
      blocks: [
        p('Una sola respuesta es una hipótesis. El siguiente paso del método es someterla a fricción: pedir a otra IA que la critique, comparar dos versiones y, para cualquier fecha o cifra, ir a la fuente original. La IA es buena generando texto plausible; la verificación es tuya.'),
        codigo('text', `Actúa como revisor escéptico. Aquí tienes una respuesta:
[pegar respuesta]
No la reformules: identifica afirmaciones sin evidencia, supuestos
ocultos y datos que podrían estar desactualizados. Para cada uno,
dime qué fuente primaria lo confirmaría o lo refutaría.`, 'Pedir crítica, no resumen: el objetivo es encontrar fallos, no pulir el estilo.'),
        tabla(['Señal', 'Respuesta A', 'Respuesta B', 'Fuente primaria'], [
          ['Fecha del evento', 'la da sin citar', 'la contradice', 'la confirmas en el original'],
          ['Cifra clave', 'redondeada', 'distinta', 'la verifies en el documento'],
          ['Supuesto', 'implícito', 'explicitado', 'solo tú decides si es válido']
        ]),
        apunte('Comparar dos respuestas revela los supuestos', 'Cuando dos respuestas difieren, la discrepancia casi nunca está en el estilo: está en qué dieron por bueno. Esa es la información valiosa; la puedes convertir en tu siguiente pregunta.'),
        aviso('Una IA puede citar con convicción un paper, un artículo o una fecha que no existen. Si la afirmación importa —fecha, cifra, cita legal— ábrela en la fuente original. Sin fuente verificable, trátala como rumor.'),
        lista([
          '¿Existe la fuente que cita y puedo abrirla?',
          '¿La fecha y la cifra aparecen literalmente en el original?',
          '¿Estoy usando la versión más reciente del documento?',
          '¿La cita dice realmente lo que la respuesta afirma?'
        ]),
        nota('Regla: la IA acelera el camino hasta la fuente, no sustituye la visita a la fuente.'),
      ],
      errors: [
        err('Repetiste una cifra que sonaba bien', 'No la verificaste en la fuente primaria', 'Abre el documento original y coteja fecha y valor literal'),
        err('La crítica fue un resumen elogioso', 'Pediste "opinión" en vez de "revisor escéptico"', 'Pide fallos concretos y la fuente que los confirmaría')
      ],
      practice: {
        task: 'Genera dos respuestas a una pregunta factual, pide una crítica cruzada y verifica una cifra en su fuente original.',
        success: ['Comparas las diferencias', 'Identificas un supuesto distinto', 'Cotejas la cifra en la fuente primaria']
      },
      quiz: [
        q('¿Qué harías con una cifra importante que aparece solo en la respuesta de la IA?', ['Darla por buena', 'Buscarla en la fuente primaria antes de usarla', 'Redondearla', 'Preguntar al mismo modelo otra vez'], 1, 'La fuente original es la única confirmación fiable.'),
        q('¿Qué aporta pedir una crítica a otra IA?', ['Un texto más bonito', 'Detección de supuestos y afirmaciones sin evidencia', 'Más velocidad', 'Que desaparezcan los errores'], 1, 'La fricción entre respuestas expone lo que estaba asumido.')
      ]
    }),
    L({
      id: 'a12-5', title: 'Language is the programming language of AI now', min: 12, level: 'intermedio',
      objectives: [
        'Entender la claridad al comunicar como una habilidad técnica',
        'Escribir instrucciones precisas, acotadas y verificables'
      ],
      blocks: [
        p('En el All-In Podcast de marzo de 2026, Huang afirma que el lenguaje es ahora el lenguaje de programación de la IA. No es una metáfora: lo que antes se expressaba con código, hoy se expresa con instrucciones en lenguaje natural, y esas instrucciones tienen tanta precisión —o tanta ambigüedad— como el código que sustituyen.'),
        tabla(['Instrucción vaga', 'Instrucción precisa'], [
          ['Hazlo mejor', 'Reduce el p95 de /ask por debajo de 1,2 s sin subir el coste por request'],
          ['No sea tan largo', 'Máximo 120 palabras, sin ejemplos repetidos'],
          ['Usa buenas prácticas', 'Usa Pydantic para validar la salida y devuelve solo el esquema indicado'],
          ['Explícame esto', 'Explica el paso 3 para alguien que sabe Python pero no sabe álgebra lineal']
        ]),
        codigo('text', `ANTES: "Arregla el bug del login."
DESPUÉS: "En auth/login.py, cuando el token caduca, la API devuelve
500 en vez de 401. Haz que devuelva 401 con el cuerpo
{"error": "token_expired"}. No cambies otras rutas. Añade un test
que cubra el caso y ejecuta pytest -q.",`, 'La versión precisa define archivo, comportamiento, contrato, alcance y verificación.'),
        apunte('Especificar es programar', 'Una instrucción buena tiene entradas, salidas, restricciones y criterio de aceptación, igual que una función. Si no puedes decir cómo comprobarás que se cumplió, aún no has escrito una especificación.'),
        p('Esto cambia qué estudias. Saber redactar, delimitar y nombrar conceptos deja de ser una habilidad "blanda": es la interfaz con un sistema que ejecuta tus palabras. Un ingeniero que escribe mal sus instrucciones produce código mal especificado, igual que si escribiera un mal contrato de API.'),
        aviso('Más largo no significa más preciso. Añade contexto solo cuando cambia la decisión del modelo; el resto es ruido que consume ventana y dinero.'),
        nota('Prueba rápida: si dos personas interpretan tu instrucción de forma distinta, el modelo también lo hará.'),
      ],
      errors: [
        err('El agente hizo algo "razonable" pero no lo que querías', 'La instrucción dejaba un hueco de interpretación', 'Añade criterio de aceptación y restricciones explícitas'),
        err('El prompt es enorme y el resultado no mejora', 'Demasiado contexto irrelevante', 'Recorta a lo que cambia la decisión')
      ],
      practice: {
        task: 'Reescribe una instrucción que uses a menudo añadiendo entradas, salida, restricciones y verificación.',
        success: ['Incluye un criterio comprobable', 'Delimita qué no debe cambiar', 'Es más corta o igual que la original']
      },
      quiz: [
        q('¿Qué hace que una instrucción sea "código" en el sentido de Huang?', ['Que use términos técnicos', 'Que defina entradas, salidas, restricciones y forma de verificarla', 'Que sea muy larga', 'Que esté en inglés'], 1, 'La precisión y la verificabilidad son las que la vuelven ejecutable.'),
        q('¿Cuál es el principal problema de un prompt ambiguo?', ['Consuma menos tokens', 'Dos lectores —humano o modelo— pueden interpretarlo distinto', 'Sea más rápido', 'Nunca falle'], 1, 'La ambigüedad se traslada directamente al resultado.')
      ]
    }),
    L({
      id: 'a12-6', title: 'Controlabilidad > exactitud', min: 12, level: 'intermedio',
      objectives: [
        'Preferir un agente guiable sobre un agente supuestamente perfecto',
        'Probar el efecto de cambiar una sola palabra de un plan'
      ],
      blocks: [
        p('En la Startup School de Y Combinator de 2026 se resume una idea contraintuitiva: para muchas tareas, un agente no necesita ser 100% exacto si puedes guiarlo y corregirlo. La propiedad valiosa no es "acierta siempre", sino "obedece cuando lo corriges y su error es detectable".'),
        tabla(['Exactitud alta, baja controlabilidad', 'Controlabilidad alta'], [
          ['Da la respuesta correcta pero ignora tus correcciones', 'Acepta el ajuste y lo aplica en el siguiente turno'],
          ['Falla de forma silenciosa', 'Falla de forma visible y explicable'],
          ['Difícil de auditar', 'Cada paso es revisable'],
          ['No mejora con tu feedback', 'Mejora con el feedback']
        ]),
        codigo('text', `PLAN A: "Implementa el endpoint."
PLAN B: "Implementa el endpoint. Antes de escribir código,
muestra el contrato de entrada/salida y espera mi aprobación."
PLAN C: "Implementa el endpoint. Antes de escribir código,
muestra el contrato de entrada/salida y ESPERA mi aprobación
explícita; no avances sin ella.",`, 'Cambiar una palabra —"espera" por "ESPERA explícita"— cambia el comportamiento del agente.'),
        apunte('Si puedes guiarlo, puedes corregirlo', 'Un sistema controlable convierte tus correcciones en mejoras acumulativas. Un sistema que "sabe mejor" que tú descarta tu feedback y te deja sin mecanismo de aprendizaje.'),
        p('Esto explica por qué los buenos flujos de agentes insisten en checkpoints, diffs y aprobaciones: no desconfían del modelo, confían en la posibilidad de intervenir. La exactitud es una métrica del momento; la controlabilidad es una propiedad del sistema.'),
        aviso('No confundas controlabilidad con lentitud. Pedir aprobación en cada paso es caro; pedirla en los puntos de decisión es barato y captura casi todo el valor.'),
        nota('Experimento mínimo: toma un plan que ya usas, cambia una palabra por una más precisa y compara los dos resultados en la misma tarea.'),
      ],
      errors: [
        err('El agente ignoró tu corrección', 'El plan no establecía que debía esperar tu aprobación', 'Haz explícita la espera y el punto exacto en que se detiene'),
        err('Pediste aprobación en todo y el flujo se volvió insoportable', 'Controlabilidad mal calibrada', 'Solicita aprobación solo en puntos de decisión')
      ],
      practice: {
        task: 'Escribe dos versiones de un plan que difieran en una palabra y ejecútalas sobre la misma tarea.',
        success: ['La diferencia es una sola palabra', 'Observas un cambio de comportamiento', 'Identificas el punto de decisión donde conviene intervenir']
      },
      quiz: [
        q('¿Qué propiedad se prefiere según la idea de controlabilidad > exactitud?', ['Que el modelo acierte siempre', 'Que puedas guiarlo y corregirlo', 'Que sea el más grande', 'Que responda sin explicaciones'], 1, 'La posibilidad de intervenir es lo que hace que el sistema mejore contigo.'),
        q('¿Dónde conviene pedir aprobación?', ['En cada token generado', 'En los puntos de decisión', 'Nunca', 'Solo al final del proyecto'], 1, 'Los puntos de decisión capturan el valor con poco coste.')
      ]
    }),
    L({
      id: 'a12-7', title: 'Aplicarlo al trabajo: una tarea, una métrica, dos herramientas', min: 14, level: 'intermedio',
      objectives: [
        'Elegir una tarea repetitiva y acotada y definir "mejor" antes de empezar',
        'Probar dos herramientas, medir el tiempo ahorrado y revisar el resultado'
      ],
      blocks: [
        p('El método solo cuenta si produce un resultado medible en tu trabajo. La receta es deliberadamente aburrida: elige UNA tarea repetitiva y acotada, define qué significa "mejor" antes de tocar nada, prueba dos herramientas, mide y revisa tú la salida.'),
        pasos([
          { title: '1. Elige la tarea', text: 'Repetitiva, acotada y con un resultado verificable: resumir tickets, extraer campos, redactar un informe.' },
          { title: '2. Define "mejor" ANTES', text: 'Velocidad, precisión, claridad o coste. Elige una métrica principal y una de guardarraíl.' },
          { title: '3. Prueba dos herramientas', text: 'Mismo conjunto de casos, mismas instrucciones; cambia solo la herramienta.' },
          { title: '4. Mide', text: 'Tiempo dedicado, tiempo ahorrado y calidad frente a tu línea base.' },
          { title: '5. Revisa tú el output', text: 'Nada se da por bueno sin tu revisión sobre casos reales.' }
        ]),
        tabla(['Criterio de "mejor"', 'Cómo medirlo', 'Guardarraíl'], [
          ['Velocidad', 'Minutos por tarea', 'Que no suba el tiempo de revisión'],
          ['Precisión', 'Campos correctos sobre 30 casos', 'Que no haya falsos positivos críticos'],
          ['Claridad', 'Escala 1–5 de un lector real', 'Que no invente datos'],
          ['Coste', 'Coste por tarea terminada', 'Que no crezca más que el ahorro']
        ]),
        formula('ahorro neto = (tiempo_base − tiempo_con_IA − tiempo_de_revisión) × frecuencia mensual', 'El tiempo de revisión es parte del coste: ignorarlo es la forma más común de autoengañarse.'),
        apunte('Define "mejor" antes de probar', 'Si decides la métrica después de ver los resultados, elegirás la que favorezca a la herramienta que te gustó. Escribe la definición en un archivo antes de ejecutar.'),
        aviso('Una herramienta que ahorra 5 minutos pero añade 10 de corrección no mejora nada. Mide el tiempo total incluida tu revisión.'),
        nota('Este experimento cabe en una tarde. Si no puedes terminarlo en una tarde, la tarea es demasiado grande para ser el primero.'),
      ],
      errors: [
        err('La herramienta parece rápida pero no ahorras tiempo', 'No contaste la revisión', 'Mide tiempo base, tiempo con IA y tiempo de corrección por separado'),
        err('No sabes cuál de las dos ganó', 'Cambiaste herramienta e instrucciones a la vez', 'Mantén el prompt fijo y varía solo una variable')
      ],
      practice: {
        task: 'Elige una tarea repetitiva, escribe la métrica antes de empezar, prueba dos herramientas sobre 10 casos y reporta el ahorro neto.',
        success: ['La métrica está escrita antes de probar', 'Usas los mismos 10 casos en ambas', 'El ahorro incluye el tiempo de revisión']
      },
      quiz: [
        q('¿Qué debe decidirse antes de probar dos herramientas?', ['Qué herramienta te gusta más', 'Qué significa "mejor" y cómo se mide', 'El color de la interfaz', 'El modelo más reciente'], 1, 'Definir la métrica después sesga la comparación.'),
        q('¿Qué incluye el ahorro neto de tiempo?', ['Solo el tiempo de generación', 'Tiempo base menos tiempo con IA y menos tu revisión', 'Solo la frecuencia', 'El coste de la suscripción'], 1, 'La revisión es trabajo real y debe contarse.')
      ]
    }),
    L({
      id: 'a12-8', title: 'Verificación como parte del workflow', min: 14, level: 'avanzado',
      objectives: [
        'Aplicar una checklist de datos, fuentes, cálculos, PII y audiencia',
        'Integrar evaluación y regresiones antes de publicar, y monitorear después'
      ],
      blocks: [
        p('Huang describe el ciclo de trabajo con IA como una secuencia: iterar internamente, evaluar, testear, publicar y monitorear. La verificación no es un paso final que se añade cuando hay tiempo: es parte del workflow, con una checklist que se ejecuta igual que un test.'),
        lista([
          'Datos: ¿los ejemplos son reales y están actualizados?',
          'Fuentes: ¿existen y respaldan literalmente las afirmaciones?',
          'Cálculos: ¿puedo reproducir la cifra con mis propias manos?',
          'PII: ¿hay nombres, correos, tokens o datos de clientes en el output?',
          'Audiencia: ¿el tono y el nivel son los correctos para quien lo leerá?',
          'Regresiones: ¿los casos que ya funcionaban siguen funcionando?'
        ]),
        codigo('bash', `npm test
npm run typecheck
npm run eval
npm run deploy
npm run monitor   # métricas y feedback tras publicar`, 'La verificación se automatiza como cualquier otra parte del pipeline: si no está en CI, no existe.'),
        tabla(['Etapa', 'Qué verificas', 'Quién decide'], [
          ['Iterar', 'Que el bucle de preguntas esté cerrado', 'Tú'],
          ['Evaluar', 'Métrica sobre casos congelados', 'Eval automático + tú'],
          ['Testear', 'Regresiones y segurança', 'CI'],
          ['Publicar', 'Audiencia, PII y tono', 'Tú'],
          ['Monitorear', 'Deriva, coste y feedback', 'Dashboard + tú']
        ]),
        apunte('Evaluar no es lo mismo que testear', 'El test comprueba un comportamiento determinista; el eval mide una distribución sobre casos congelados. Necesitas ambos: el eval detecta que la calidad bajó y el test detecta que el contrato se rompió.'),
        aviso('La fuga de PII no se detecta leyendo por encima. Usa un escáner automático antes de publicar cualquier texto generado que pueda contener datos de personas o credenciales.'),
        nota('Regla de oro: si una comprobación es importante, conviértela en una tarea repetible. Las checklist mentales fallan los viernes a las 19 h.'),
      ],
      errors: [
        err('Publicaste un output con un dato personal', 'No había escáner de PII en el pipeline', 'Añade un escáner y revisión automática antes del publish'),
        err('Una mejora rompió casos antiguos', 'No había suite de regresiones', 'Congela casos y ejecútalos en cada cambio')
      ],
      practice: {
        task: 'Convierte la checklist de esta lección en una tarea repetible para tu proyecto y ejecútala antes de un cambio real.',
        success: ['La checklist es ejecutable, no solo un documento', 'Incluye PII y regresiones', 'El monitoreo queda definido tras publicar']
      },
      quiz: [
        q('¿Qué etapa del ciclo de Huang ocurre después de publicar?', ['Iterar', 'Monitorear', 'Evaluar', 'Congelar datos'], 1, 'Publicar sin monitorear deja la deriva sin detectar.'),
        q('¿Por qué un eval no sustituye a un test?', ['Porque el eval es más lento', 'Porque el eval mide una distribución y el test verifica un contrato determinista', 'Porque los tests son opcionales', 'Porque ambos son iguales'], 1, 'Se complementan: calidad estadística y contrato exacto.')
      ]
    }),
    L({
      id: 'a12-9', title: 'Antipatrones y la ventaja durable', min: 13, level: 'intermedio',
      objectives: [
        'Detectar los antipatrones: delegar el pensamiento, acumular prompts sin criterio y no medir',
        'Convertir el método en una ventaja profesional difícil de copiar'
      ],
      blocks: [
        p('El método se pierde de formas muy concretas: dejar que la IA piense por ti, guardar cientos de prompts sin saber cuál funciona ni por qué, y nunca medir. Cada antipatrón produce la misma ilusión: mucha actividad, poca ventaja.'),
        diagrama('explotar_ia', 'Delegar produce dependencia; aprender produces comprensión acumulable.'),
        tabla(['Antipatrón', 'Consecuencia', 'Correctivo'], [
          ['Delegar el pensamiento', 'No puedes explicar ni defender el resultado', 'Cierra cada tarea explicándola tú'],
          ['Acumular prompts sin criterio', 'No sabes qué funciona ni cuándo', 'Versiona pocos prompts con su métrica'],
          ['No medir', 'No sabes si mejoraste', 'Define "mejor" antes y regístralo'],
          ['Copiar el output sin verificar', 'Errores y fuentes falsas se filtran', 'Checklist de fuentes, cifras y PII']
        ]),
        apunte('La ventaja durable es tuya, no del modelo', 'Los modelos se abaratan y se igualan; lo que se acumula es tu capacidad de formular mejores preguntas, detectar fallos y decidir con criterio. Eso es lo que un empleador o un cliente no puede descargar de internet.'),
        lista([
          'Cierra cada sesión con una explicación propia y una decisión registrada.',
          'Mantén una biblioteca pequeña de prompts con métricas, no una carpeta de cientos.',
          'Mide antes y después; guarda el número, no la impresión.',
          'Revisa siempre la fuente primaria de las cifras que usarás.',
          'Enseña lo que aprendes: explicar a otros es la prueba más dura de comprensión.'
        ]),
        aviso('Un moat no es secreto, es práctica sostenida. Cualquiera puede copiar tu prompt; casi nadie copia tu disciplina de verificación y medición.'),
        nota('Cierre del track: la IA no sustituye tu criterio, lo amplifica. Si tu criterio es débil, la amplificación solo hace el error más grande.'),
      ],
      errors: [
        err('Tienes 200 prompts guardados y no sabes cuál usar', 'Coleccionaste texto sin métricas ni criterio', 'Conserva pocos prompts con su resultado medido'),
        err('No puedes explicar una decisión que tomaste con IA', 'Delegaste el pensamiento', 'Reconstruye el razonamiento y escríbelo con tus palabras')
      ],
      practice: {
        task: 'Audita tu uso de IA de la última semana: identifica un antipatrón, corrígelo y escribe qué ventaja acumulas ahora.',
        success: ['Identificas un antipatrón concreto', 'Propones un correctivo aplicable', 'Defines una ventaja que no depende del modelo']
      },
      quiz: [
        q('¿Cuál es la ventaja más durable que construye este método?', ['Acceso a los modelos más caros', 'Tu capacidad de preguntar, verificar y decidir con criterio', 'Una carpeta enorme de prompts', 'Usar IA muchas horas'], 1, 'El criterio y la disciplina se acumulan; los modelos se igualan.'),
        q('¿Qué antipatrón se corrige definiendo "mejor" antes de probar?', ['Delegar el pensamiento', 'No medir', 'Copiar outputs', 'Cambiar de modelo'], 1, 'Sin una definición previa no hay medición posible.')
      ]
    })
  ])

];
