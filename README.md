# Academia de Robótica & AI Engineer

Web app interactiva y **offline-first** en español. Dos tracks independientes:

- **🤖 Robótica desde cero** — 12 bloques, desde la ley de Ohm hasta robots que aprenden.
- **🧠 AI Engineer** — 13 bloques para desarrolladores de software que quieren pasar a IA, orquestar agentes con T3 Code y exprimir la IA con el método de Jensen Huang.

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
│   ├── robotics/part1.ts … part3.ts   # Bloques b0–b11
│   ├── ai/index.ts                    # Bloques a0–a10
│   ├── ai/agentic.ts                  # Bloques a11–a12 (T3 Code y método Huang)
│   ├── shared.ts                      # Recursos, proyectos, glosario, BOM, empresas
│   ├── extras/                        # Casos reales, flashcards, diagnosis, chuletas
│   ├── diagrams.ts                    # Registro de esquemas SVG
│   ├── helpers.ts                     # DSL de contenido
│   └── tracks.ts                      # Ensamblado de tracks y búsquedas
├── components/                        # UI, render de bloques, widgets, páginas
├── state/store.tsx                    # IndexedDB + export/import JSON
├── types.ts                           # Esquema de contenido
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

No hace falta tocar ningún componente: la navegación, el progreso, la búsqueda y el glosario se generan automáticamente desde los datos.

## Verificar el contenido

```bash
node scripts/verify.mjs
```

Comprueba IDs duplicados, referencias a diagramas/widgets inexistentes, caracteres extraños, marcadores sin terminar y URLs duplicadas.

## Herramientas de estudio

Además de los dos tracks, la app incluye:

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
