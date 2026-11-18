# Academia de Robótica & AI Engineer

Web app interactiva y **offline-first** en español. Dos tracks independientes y un laboratorio visual:

- **🤖 Robótica desde cero** — 12 bloques, desde la ley de Ohm hasta robots que aprenden.
- **🧠 AI Engineer** — 13 bloques para desarrolladores de software que quieren pasar a IA, orquestar agentes con T3 Code y exprimir la IA con el método de Jensen Huang.
- **🔬 Laboratorio** — 17 escenarios visuales que explican una idea paso a paso, con checklist de aprendizaje.

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

La interfaz sigue una estética **sketchbook**: papel crema, tinta marrón-negra, sombras duras y tipografía monoespaciada. Las fuentes **JetBrains Mono** (pesos 400 a 800) se sirven desde `public/fonts/`, sin depender de internet, así que el aspecto se conserva también offline.

## Estructura

```
src/
├── data/
│   ├── robotics/part1.ts … part3.ts   # Bloques b0–b11
│   ├── ai/index.ts                    # Bloques a0–a10
│   ├── ai/agentic.ts                  # Bloques a11–a12 (T3 Code y método Huang)
│   ├── shared.ts                      # Recursos, proyectos, glosario, BOM, empresas
│   ├── extras/                        # Casos reales, flashcards, diagnosis, chuletas
│   ├── labs.ts                        # Escenarios del Laboratorio: nodos, aristas, pasos
│   ├── diagrams.ts                    # Registro de esquemas SVG
│   ├── helpers.ts                     # DSL de contenido
│   └── tracks.ts                      # Ensamblado de tracks y búsquedas
├── components/                        # UI, Labs.tsx, render de bloques, widgets, páginas
├── state/store.tsx                    # IndexedDB + export/import JSON
├── types.ts                           # Esquema de contenido
├── styles.css                         # Diseño sketchbook y @font-face locales
└── styles-labs.css                    # Estilos del Laboratorio
public/
└── fonts/                             # JetBrains Mono 400–800 (.woff2, offline)
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

No hace falta tocar ningún componente: la navegación, el progreso, la búsqueda y el glosario se generan automáticamente desde los datos.

## Laboratorio

El **Laboratorio** (`#/laboratorio`) reúne 17 escenarios visuales que explican una idea paso a paso: el recorrido de la corriente, una señal PWM, un lazo PID, el viaje de un prompt, un RAG, self-attention… Cada escenario dibuja un grafo de nodos y flechas y resalta qué parte se activa en cada paso, con métricas y una nota cuando hay un matiz importante.

Para usar un escenario:

- Entra desde la pestaña **Laboratorio** de la barra superior; el índice se agrupa por track (Robótica / AI Engineer).
- Recorre los pasos con **Siguiente →** y **← Atrás**, o pulsa directamente un punto numerado. También funcionan los atajos **→** y **Espacio** para avanzar y **←** para retroceder, sin usar el ratón; **Repetir** vuelve al paso 1.
- En el panel **APRENDERÁS** tienes un **checklist de aprendizaje**: marca cada objetivo cuando puedas explicarlo. El estado se guarda en IndexedDB con el resto del progreso.

Los escenarios se definen en `src/data/labs.ts` y los renderiza `src/components/Labs.tsx` con `src/styles-labs.css`. Para añadir uno, define `id`, `track`, `title`, `subtitle`, `nodes` (con `id`, `label`, `x`, `y` y `tone`), `edges` (`from` / `to`), `steps` (`title`, `desc`, `active` con los IDs de nodos que se iluminan, `note`, `metrics`) y `learn`. `npm run verify` valida que no haya aristas ni pasos que apunten a nodos inexistentes.

## Modo Práctica

El **Modo Práctica** ya está cableado a su propia vista (`PracticePage`, ruta `#/practica`) y accesible desde la pestaña **Práctica** de la barra superior y desde la sidebar. Reúne **todas las preguntas de los quizzes del libro** en un solo sitio para repasar, sin importar el track:

- **Filtros**: por track (Robótica / AI Engineer / ambos), por módulo y por modo — «Todas», «Solo falladas» o «Aleatorio» (barajado determinista por semilla).
- **Respuesta y explicación**: al elegir una opción se muestra el porqué, y el resultado queda guardado igual que en las lecciones.
- **«Me la sé»**: permite marcar una pregunta como dominada; ese check comparte el estado con el resto de la app.
- **Navegación y resumen**: avanzas con **Siguiente →** / **← Anterior** (o los atajos **← →**) y al terminar ves aciertos, falladas y porcentaje de acierto, con un botón «Repasar solo falladas».

Las lecciones siguen incluyendo además su bloque **🛠️ Práctica** con una tarea y criterios de éxito marcables («n / m criterios cumplidos»), y ese estado también se guarda localmente.

## Esquemas (galería visual)

La ruta `#/esquemas` abre la **galería de diagramas**: todas las imágenes SVG de las lecciones (`src/data/diagrams.ts`) en una cuadrícula, con buscador por clave y opción «Ver grande» que abre el esquema a tamaño completo en un modal (ciérralo con **Escape**). Es la forma de repasar los diagramas sin tener que entrar en cada lección.

## Hoja de ruta

La ruta `#/ruta` (`RoadmapPage`) muestra la **hoja de ruta** completa: los bloques de ambos tracks con su numeración, lecciones, minutos y porcentaje completado, más el progreso global. Cada bloque enlaza con su página de módulo.

## Plan de estudio

La ruta `#/plan` (`StudyPlanPage`) genera un **plan de estudio de 12 semanas** a partir de los módulos reales del libro. Elige track (Robótica, IA o ambos) y ritmo (2 h/día, 1 h/día o fin de semana), pulsa «Generar plan» y la app reparte los módulos de forma equilibrada, calcula las horas por lección, recomienda un laboratorio por semana y mueve al final los módulos ya completados. El botón **«↓ Descargar Markdown»** exporta el plan a un archivo `plan-de-estudio.md`.

## Offline e iPad

La ruta `#/offline` recoge la **guía para instalar y usar la academia en un iPad**: los pasos para añadirla a la pantalla de inicio desde Safari, qué funciona sin conexión y qué necesita red, dónde se guardan los datos (IndexedDB con respaldo en localStorage), los botones de exportar/importar respaldo y borrar todo, y cómo actuar ante las actualizaciones de la PWA.

## Atajos de teclado

El proveedor de atajos (`src/components/Shortcuts.tsx`) envuelve toda la app y ofrece una ayuda flotante con el botón **?** (abre/cierra con **?** o **/ + Mayús**, y se cierra con **Escape**). Los atajos disponibles son:

- **← →** — navegar entre lecciones y pasos del laboratorio (también entre preguntas del modo Práctica).
- **Espacio** — avanzar al siguiente paso del laboratorio.
- **⌘K / Ctrl+K** — enfocar el buscador de la barra superior.
- **?** — abrir o cerrar esta ayuda; **Escape** — cerrarla.

## Ilustración del hero

La portada incluye un **arte isométrico en SVG** (`src/components/HeroArt.tsx`): dos paneles enfrentados —el trayecto **FÍSICO** de un brazo robótico y el **COGNITIVO** de una red neuronal— sobre una retícula isométrica y papel `#f4ebe0`. Se dibuja por completo con SVG (sin imágenes externas), así que se ve igual offline y comparte la paleta sketchbook del resto de la interfaz.

## Verificar el contenido

```bash
node scripts/verify.mjs
```

Comprueba IDs duplicados de lecciones y laboratorios; la integridad de los laboratorios (IDs únicos, aristas y pasos que solo apuntan a nodos existentes, al menos 4 pasos, 4 nodos y 3 objetivos, y sin caracteres CJK); referencias a diagramas/widgets inexistentes; las 5 fuentes JetBrains Mono (presentes y no vacías); caracteres extraños, marcadores sin terminar y URLs duplicadas. Al final imprime cuántas lecciones y laboratorios se han auditado.

## Herramientas de estudio

Además de los dos tracks, la app incluye:

- **Laboratorio** (`#/laboratorio`) — escenarios visuales paso a paso, con atajos de teclado y checklist de aprendizaje.
- **Práctica** (`#/practica`) — todas las preguntas de los quizzes en una vista de repaso, con filtros y modo «Solo falladas».
- **Esquemas** (`#/esquemas`) — galería de los diagramas SVG del libro, con buscador y vista a tamaño completo.
- **Hoja de ruta** (`#/ruta`) — los bloques de ambos tracks con su progreso y porcentaje completado.
- **Plan de estudio** (`#/plan`) — plan de 12 semanas según track y ritmo, descargable en Markdown.
- **Offline e iPad** (`#/offline`) — guía de instalación PWA, funcionamiento sin red y respaldos.
- **Biblioteca** — recursos verificados y filtrables.
- **Proyectos** — cosas que se mueven (o razonan), con checklist.
- **Casos reales** — 22 robots y sistemas reales desmontados capa por capa.
- **Flashcards** — repaso con tarjetas que se dan la vuelta al tocarlas.
- **Diagnóstico** — síntomas → causas → comprobaciones → arreglos.
- **Chuletas** — comandos, fórmulas y snippets de referencia rápida.
- **Glosario** — términos enlazados desde el texto de las lecciones.
- **Banco y BOM** — 4 tiers de presupuesto y dónde comprar.
- **Mis notas** — apuntes por lección y respaldo/importación JSON.

## Respaldo

La página **Mis notas** permite exportar e importar todo el estado (progreso, checks, quizzes, notas y marcadores) como un JSON. Útil para migrar entre iPad y ordenador, o tras reinstalar la PWA.

## Notas de contenido

El roadmap original está adaptado de la guía de 6 meses de Ronin (@deronin_). Aquí el contenido está reescrito en español, ampliado y organizado en dos tracks; las fuentes y recursos se enlazan y atribuyen en la biblioteca.
