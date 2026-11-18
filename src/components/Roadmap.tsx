import { type CSSProperties } from 'react';
import { tracks, allLessons } from '../data/tracks';
import { useStore } from '../state/store';
import { href } from '../router';

export function RoadmapPage() {
  const { state } = useStore();
  const catalog = allLessons();
  const doneTotal = catalog.filter(x => state.progress[x.lesson.id] === 'done').length;
  const pctTotal = Math.round(doneTotal / Math.max(1, catalog.length) * 100);

  return (
    <div className="page">
      <div className="breadcrumb"><a href={href('/')}>Inicio</a><span>/</span>Hoja de ruta</div>
      <header className="page-header">
        <div className="badge">PLAN DE ESTUDIO</div>
        <h1>Hoja de ruta</h1>
        <p>Dos caminos, un mismo método: avanza bloque a bloque, comprueba lo que aprendes y no pases de página hasta que funcione. Llevas {doneTotal} de {catalog.length} lecciones completadas ({pctTotal}%).</p>
      </header>

      {tracks.map((track, trackIndex) => {
        const lessons = track.modules.flatMap(m => m.lessons);
        const done = lessons.filter(l => state.progress[l.id] === 'done').length;
        const minutes = lessons.reduce((n, l) => n + l.minutes, 0);
        const pct = Math.round(done / Math.max(1, lessons.length) * 100);

        return (
          <section key={track.id} style={{ marginBottom: 36 }}>
            <header className="page-header" style={{ '--accent': track.accent } as CSSProperties}>
              <div className="badge">{trackIndex === 0 ? '01 / SISTEMAS FÍSICOS' : '02 / SISTEMAS COGNITIVOS'}</div>
              <h2>{track.title}</h2>
              <p>{track.tagline}</p>
              <div className="module-meta">
                <span>{track.modules.length} bloques</span>
                <span>{lessons.length} lecciones</span>
                <span>{Math.round(minutes / 60)} horas</span>
                <span>{pct}% completado</span>
              </div>
              <div className="module-bar"><div style={{ width: `${pct}%`, background: track.accent }} /></div>
            </header>

            <div
              className="module-grid"
              style={{ borderLeft: `2px solid ${track.accent}`, paddingLeft: 20, marginLeft: 8 }}
            >
              {track.modules.map((module, i) => {
                const moduleLessons = module.lessons;
                const moduleDone = moduleLessons.filter(l => state.progress[l.id] === 'done').length;
                const moduleMinutes = moduleLessons.reduce((n, l) => n + l.minutes, 0);
                const modulePct = Math.round(moduleDone / Math.max(1, moduleLessons.length) * 100);

                return (
                  <a
                    key={module.id}
                    className="module-card"
                    href={href(`/track/${track.id}/${module.id}`)}
                  >
                    <div className="module-num">{String(i + 1).padStart(2, '0')}</div>
                    <div>
                      <h3>{module.title}</h3>
                      <p>{module.subtitle}</p>
                      <div className="module-meta">
                        <span>{moduleLessons.length} lecciones</span>
                        <span>{moduleMinutes} min</span>
                        <span>{moduleDone}/{moduleLessons.length} completadas</span>
                        <span>{modulePct}%</span>
                      </div>
                      <div className="module-bar"><div style={{ width: `${modulePct}%`, background: track.accent }} /></div>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        );
      })}

      <div className="callout apunte">
        <div className="callout-title">Regla de oro</div>
        <p><strong>Nada cuenta hasta que funciona.</strong> No basta con haber leído, copiado el código o visto el vídeo: cuenta el robot que se mueve y el modelo que sabes explicar. Cada bloque de esta ruta termina donde empieza la obra: en algo que puedes tocar, medir y defender.</p>
      </div>
    </div>
  );
}
