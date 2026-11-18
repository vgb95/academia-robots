# Academia de Robótica & AI Engineer

Web app interactiva y **offline-first** en español. Tres tracks independientes:

- **🤖 Robótica desde cero** — 15 bloques, de la ley de Ohm a la depuración eléctrica, el control en tiempo real y la mecatrónica.
- **🧠 AI Engineer** — 16 bloques para desarrolladores de software que quieren pasar a IA: ML, LLMs, RAG, agentes, inferencia, evals y observabilidad, con T3 Code y el método de Jensen Huang.
- **⌬ Manos con Modelo** — 6 bloques de Physical AI. Del token al torque: por qué el texto no basta, qué sienten los robots, cómo imitan demostraciones, qué son los VLA y qué significa desplegar de verdad.

En total, **37 bloques y 311 lecciones**, con 17 laboratorios, 150 preguntas de entrevista y 2 capstones. Nada de vídeos: se lee, se mide y se construye.

## Ejecutar

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (por defecto `http://localhost:5173`). Para probar la PWA:

```bash
npm run build
npm run preview
```

En iPad: abre la URL en Safari → **Compartir → Añadir a pantalla de inicio**. La app funciona sin conexión y guarda progreso, notas y marcadores en IndexedDB del dispositivo.

## Estructura

```
src/
├── data/
│   ├── robotics/part1.ts … part3.ts    # Bloques b0–b11
│   ├── robotics/advanced.ts            # Bloques b12–b14 (depuración, tiempo real, mecatrónica)
│   ├── ai/index.ts                     # Bloques a0–a10
│   ├── ai/agentic.ts                   # Bloques a11–a12 (T3 Code y método Huang)
│   ├── ai/advanced.ts                  # Bloques a14–a16 (serving, evals, observabilidad)
│   ├── physical/index.ts               # Track p0–p5 (Manos con Modelo)
│   ├── capstones.ts                    # 2 proyectos finales con métricas y rúbrica
│   ├── interviews.ts                   # 150 preguntas de entrevista
│   ├── labs.ts                         # 17 laboratorios
│   ├── shared.ts                       # 151 recursos, 72 proyectos, 243 términos, BOM, empresas
│   ├── extras/                         # Casos, flashcards, diagnóstico, chuletas y expansión
│   ├── diagrams.ts                     # Registro de 113 esquemas SVG
│   ├── practice.ts                     # Banco de práctica de todos los tracks
│   ├── interviews-ui.ts                # Adaptador y filtros del banco de entrevistas
│   ├── helpers.ts                      # DSL de contenido
│   └── tracks.ts                       # Ensamblado de tracks y búsquedas
├── components/                         # UI, render de bloques, widgets y páginas
├── state/
│   ├── store.tsx                       # IndexedDB + export/import JSON
│   └── srs.ts                          # Repetición espaciada FSRS-lite, sin dependencias
├── types.ts                            # Esquema de contenido
└── styles.css
```

## Añadir contenido

Toda la app es **data-driven**. Para añadir una lección, edita el archivo del bloque correspondiente con el helper `L({...})`:

```ts
L({
  id: 'r1-9', title: 'Mi nueva lección', min: 12, level: 'inicial',
  objectives: ['Qué se aprenderá'],
  blocks: [
    p('Explicación sencilla.'),
    apunte('Matiz técnico importante.'),
    diagrama('divisor', 'Qué muestra el esquema.'),
    codigo('python', 'print("hola")'),
    aviso('Esto puede quemar tu placa.')
  ],
  errors: [err('Síntoma', 'Causa', 'Solución')],
  practice: { task: 'Qué construir', success: ['Criterio 1', 'Criterio 2'] },
  quiz: [q('Pregunta?', ['A', 'B'], 1, 'Por qué la B')]
})
```

Helpers disponibles: `p`, `h`, `apunte`, `nota`, `aviso`, `codigo`, `diagrama`, `tabla`, `lista`, `pasos`, `formula`, `widget`, `enlace`, `err`, `q`.

Los nombres de `diagrama(...)` deben existir como clave en `D` (ver `src/data/diagrams.ts`). Los widgets disponibles son `ohm`, `divisor`, `led`, `pwm`, `bom`, `pid` y `coste-llm`.

No hace falta tocar ningún componente: la navegación, el progreso, la búsqueda, el repaso y el glosario se generan automáticamente desde los datos.

## Verificar el contenido

```bash
node scripts/verify.mjs
```

Comprueba IDs duplicados de lección, capstone y entrevista, referencias a diagramas y widgets inexistentes, aristas y pasos de los laboratorios, rúbricas de 5 criterios, respuestas de entrevista con contexto, decisión, compensación y dos followups, caracteres no españoles (incluidos CJK en los archivos nuevos), marcadores sin terminar y URLs duplicadas.

## Herramientas de estudio

Además de los tres tracks, la app incluye:

- **Biblioteca** — 151 recursos verificados y filtrables.
- **Proyectos** — 72 cosas que se mueven (o razonan), con checklist.
- **Casos reales** — 22 robots y sistemas reales desmontados capa por capa.
- **Flashcards** — 310 tarjetas que se dan la vuelta al tocarlas.
- **Diagnóstico** — 110 entradas de síntomas → causas → comprobaciones → arreglos.
- **Chuletas** — comandos, fórmulas y snippets de referencia rápida.
- **Glosario** — 243 términos enlazados desde el texto de las lecciones.
- **Banco y BOM** — 4 tiers de presupuesto y dónde comprar.
- **Mis notas** — apuntes por lección y respaldo/importación JSON.

## Secciones y navegación

Además de los tracks y las herramientas anteriores, la app incluye estas vistas accesibles desde la barra lateral:

- **Repaso (⌘/SRS)** (`#/repaso`) — cola diaria de tarjetas y preguntas debidas, con calificación de olvidado a fácil. El intervalo lo calcula un FSRS-lite local que vive en `src/state/srs.ts`: sin red, sin cuentas y sin sincronización.
- **Dominio** (`#/dominio`) — porcentaje por módulo (0,4 lecciones + 0,4 quizzes + 0,2 SRS estable), grafo de proximidad de objetivos y mapa de calor de las últimas 8 semanas.
- **Examen** (`#/examen/:modulo`) — 25 minutos cronometrados, hasta 20 preguntas del módulo y una última vista solo con las falladas. La nota llega con intervalo de confianza de Wilson, no con una cifra redonda.
- **Portfolio** (`#/portfolio`) — lecciones, quizzes, proyectos, capstones y entrevistas en una sola hoja de evidencia, con filtros por rol y por track.
- **Entrevistas** (`#/entrevistas`) — 150 preguntas técnicas (50 de robótica, 100 de IA). Cada una trae una respuesta en tres partes —contexto, decisión y compensación—, dos followups y una señal de lo que se está evaluando. Se filtran por categoría y dificultad.
- **Capstones** (`#/proyectos-finales`) — 2 entregables de integración: un robot diferencial autónomo y un asistente de soporte sobre 10.000 contratos. Cada uno define entregables, métricas objetivas, rúbrica de 5 criterios y una sección de «esto no cuenta».
- **Laboratorio** (`#/laboratorio`) — 17 escenarios paso a paso que explican una idea dibujando nodos y flechas, resaltando qué se activa en cada paso, con checklist de aprendizaje.
- **Circuitos** (`#/circuito`) — herramienta 01: coloca cuatro elementos en orden para cerrar un lazo en serie. Si te equivocas, el trazo titubea y aparece la condición que falta.
- **Osciloscopio** (`#/osciloscopio`) — herramienta 02: dos perillas para frecuencia y ancho de pulso, con trazo sobre rejilla y conmutación entre PWM e I²C.
- **Brazo** (`#/brazo`) — herramienta 03: arrastra el extremo de un brazo planar de 2 grados de libertad; la cinemática inversa calcula los ángulos en tiempo real y señala la singularidad.
- **Antes/después** (`#/comparar`) — herramienta 04: un deslizador revela el mismo divisor de voltaje con y sin carga, y muestra cómo cae la lectura del nodo.
- **Práctica** (`#/practica`) — todas las preguntas de los quizzes en una vista de repaso, con filtros y modo «Solo falladas».
- **Hoja de ruta** (`#/ruta`) — los bloques de los tres tracks con su progreso y porcentaje completado.
- **Plan de estudio** (`#/plan`) — plan de 12 semanas según track y ritmo, descargable en Markdown.
- **Esquemas** (`#/esquemas`) — galería de los 113 diagramas SVG del libro, con buscador y vista a tamaño completo.
- **Offline e iPad** (`#/offline`) — guía de instalación PWA, funcionamiento sin red y respaldos.

Atajos de teclado: **?** abre la ayuda flotante, **⌘K / Ctrl+K** enfoca el buscador, **← →** navegan entre lecciones, pasos y preguntas, y **Espacio** avanza al siguiente paso del laboratorio.

## Respaldo

La página **Mis notas** permite exportar e importar todo el estado (progreso, checks, quizzes, notas y marcadores) como un JSON. Útil para migrar entre iPad y ordenador, o tras reinstalar la PWA.

## Notas de contenido

El roadmap original está adaptado de la guía de 6 meses de Ronin (@deronin_). Aquí el contenido está reescrito en español, ampliado y organizado en tres tracks; las fuentes y recursos se enlazan y atribuyen en la biblioteca.
