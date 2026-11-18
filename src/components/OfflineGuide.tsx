import { href } from '../router';
import { useStore } from '../state/store';

const installSteps = [
  {
    short: 'Safari',
    title: 'Abre la academia en Safari',
    body: 'En el iPad, entra en esta academia con Safari. Otros navegadores (Chrome, Firefox, Edge) no pueden instalarla en la pantalla de inicio como una app.'
  },
  {
    short: 'Compartir',
    title: 'Toca el botón de Compartir',
    body: 'Pulsa el icono de Compartir de Safari: un cuadrado con una flecha hacia arriba, en la barra inferior (en iPad, arriba a la derecha).'
  },
  {
    short: 'Añadir',
    title: 'Elige «Añadir a pantalla de inicio»',
    body: 'En el menú que aparece, desliza hacia abajo hasta «Añadir a pantalla de inicio». Revisa el nombre, cámbialo si quieres y toca «Añadir».'
  },
  {
    short: 'Abrir',
    title: 'Ábrela desde el icono nuevo',
    body: 'Aparecerá un icono en la pantalla de inicio. Ábrelo desde ahí: se muestra a pantalla completa, sin las barras de Safari, y funciona sin conexión.'
  }
];

export function OfflineGuidePage() {
  const { state, exportJSON, importJSON, resetAll } = useStore();

  return <div className="page">
    <div className="breadcrumb"><a href={href('/')}>Inicio</a><span>/</span>Offline y iPad</div>

    <header className="page-header">
      <h1>Offline y iPad</h1>
      <p>Esta academia está pensada para llevarse a todas partes: se instala en tu iPad, abre sin internet y guarda tu trabajo en el propio dispositivo. Aquí tienes lo que necesitas saber, paso a paso.</p>
    </header>

    <h2 className="section-title">1. Cómo instalarla en el iPad</h2>
    <p>Solo hace falta una vez, con conexión. Son tres gestos en Safari y un cuarto para abrirla ya como app.</p>

    <div className="step-track">
      {installSteps.map((s, i) => <div key={s.short}>
        <span className="step-dot">{i + 1}</span>
        <span className="step-label">{s.short}</span>
      </div>)}
    </div>

    <ol>
      {installSteps.map(s => <li key={s.short} style={{ marginBottom: 10 }}>
        <strong>{s.title}.</strong> {s.body}
      </li>)}
    </ol>

    <div className="callout apunte">
      <div className="callout-title">▸ Consejo</div>
      Usa siempre Safari para instalarla. Si el menú de Compartir no muestra «Añadir a pantalla de inicio», comprueba que estás en Safari y no dentro de una pestaña privada. El icono se comporta como una app: mantén pulsado para moverlo o renombrarlo.
    </div>

    <h2 className="section-title">2. Qué funciona sin conexión y qué necesita red</h2>
    <div className="tier-grid">
      <div className="tier-card">
        <h3>Funciona sin conexión</h3>
        <p>Ya está descargado en el iPad. Puedes seguir estudiando en un avión, en el metro o donde no haya cobertura.</p>
        <ul>
          <li>Todo el contenido: lecciones, texto, esquemas y diagramas.</li>
          <li>Tus notas y tus marcadores.</li>
          <li>El progreso: lecciones completadas, casillas marcadas y respuestas de los quizzes.</li>
          <li>Los laboratorios y sus simulaciones paso a paso.</li>
          <li>La búsqueda, el glosario, las chuletas y el resto de herramientas.</li>
        </ul>
      </div>
      <div className="tier-card">
        <h3>Necesita conexión</h3>
        <p>Solo lo que vive fuera de la academia.</p>
        <ul>
          <li>Los enlaces externos de la biblioteca: abren webs de terceros y requieren internet.</li>
          <li>La primera carga e instalación de la app.</li>
          <li>Recibir una versión nueva: el botón «Actualizar» aparece en la barra superior.</li>
        </ul>
      </div>
    </div>

    <h2 className="section-title">3. Dónde se guardan tus datos</h2>
    <div className="callout nota">
      <div className="callout-title">✎ Nota al margen</div>
      Todo se guarda en <strong>IndexedDB</strong> de este navegador, una base de datos local del dispositivo: no necesita cuenta ni servidor. Si el navegador no la admite, se usa <strong>localStorage</strong> como respaldo automático. En la práctica, tus notas y tu progreso viven en este iPad.
    </div>
    <p>Por eso conviene <strong>exportar un JSON</strong> de vez en cuando: es un archivo con todas tus notas, marcadores y progreso. Guárdalo en iCloud Drive, envíatelo por correo o cópialo a otro dispositivo. Es la única forma de llevarte el trabajo si cambias de iPad, reinstalas la app o borras los datos del navegador.</p>

    <h2 className="section-title">4. Respaldo y borrado</h2>
    <div className="backup-actions">
      <button className="btn" onClick={exportJSON}>↓ Exportar respaldo</button>
      <label className="btn btn-ghost">↑ Importar respaldo<input type="file" accept="application/json" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) void importJSON(f); }} /></label>
      <button className="btn btn-danger" onClick={resetAll}>⌫ Borrar todo</button>
    </div>
    <div className="backup-meta">Último guardado: {state.updatedAt ? new Date(state.updatedAt).toLocaleString('es') : 'nunca'} · {Object.values(state.notes).filter(v => v.trim()).length} notas · {state.bookmarks.length} marcadores</div>

    <div className="callout aviso">
      <div className="callout-title">Aviso</div>
      «Borrar todo» elimina tu progreso, notas y marcadores y te pide confirmación antes de hacerlo. No se puede deshacer. Exporta un respaldo antes de usarlo o antes de reinstalar la app desde la pantalla de inicio.
    </div>

    <h2 className="section-title">5. Actualizaciones</h2>
    <p>Cuando haya una versión nueva aparecerá en la barra superior un botón <strong>«Actualizar»</strong>. Tócalo: la academia se recarga con el contenido nuevo. Si no estás conectado, el botón esperará a que vuelva la red.</p>
    <div className="callout apunte">
      <div className="callout-title">▸ Si no ves los cambios</div>
      iOS a veces se queda con la versión guardada en caché. Cierra la app y vuelve a abrirla. Si sigue igual, elimina el icono de la pantalla de inicio y vuelve a añadirlo desde Safari (Safari → Compartir → Añadir a pantalla de inicio). Antes de hacerlo, exporta tu respaldo JSON e impórtalo después para recuperar tus notas y tu progreso.
    </div>

    <p className="muted">¿Prefieres ver tus apuntes directamente? Abre <a href={href('/notes')}>Mis notas y respaldo</a>.</p>
  </div>;
}
