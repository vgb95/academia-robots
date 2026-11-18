import { capstones } from '../data/capstones';
import { href } from '../router';
import { useStore } from '../state/store';

export function CapstonesPage() {
  const { state, toggleCheck } = useStore();
  return <div className="page">
    <div className="breadcrumb"><a href={href('/')}>Inicio</a><span>/</span>Capstones</div>
    <header className="page-header">
      <div className="page-icon">◇</div>
      <h1>Proyectos finales</h1>
      <p>Dos entregables que demuestran que puedes integrar todo lo aprendido. Cada uno tiene métricas objetivas y una rúbrica con la que puedes autoevaluarte.</p>
    </header>
    <div className="module-grid">
      {capstones.map(c => <section key={c.id} className="callout" style={{ marginBottom: 18 }}>
        <div className="callout-title">{c.track === 'robotica' ? 'ROBÓTICA' : 'AI ENGINEER'} · CAPSTONE</div>
        <h2 className="block-h" style={{ marginTop: 0 }}>{c.title}</h2>
        <p>{c.brief}</p>
        <h3 className="block-h">Entregables</h3>
        <ul className="block-list">{c.deliverables.map((d, i) => <li key={i}>{d}</li>)}</ul>
        <h3 className="block-h">Métricas</h3>
        <ul className="block-list">{c.metrics.map((m, i) => <li key={i}>{m}</li>)}</ul>
        <h3 className="block-h">Rúbrica</h3>
        <div className="table-wrap"><table>
          <thead><tr><th>Criterio</th><th>Peso</th><th>Superar si…</th></tr></thead>
          <tbody>{c.rubric.map((r, i) => <tr key={i}><td>{r.criterion}</td><td>{r.weight}</td><td>{r.passes}</td></tr>)}</tbody>
        </table></div>
        <h3 className="block-h">Esto no cuenta</h3>
        <ul className="block-list">{c.eliminates.map((e, i) => <li key={i}>{e}</li>)}</ul>
        <label className="checklist-label" style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 16 }}>
          <input type="checkbox" checked={!!state.checks[`cap-${c.id}`]} onChange={() => toggleCheck(`cap-${c.id}`)} />
          <span>{state.checks[`cap-${c.id}`] ? 'Capstone marcado como terminado' : 'Marcar capstone como terminado'}</span>
        </label>
      </section>)}
    </div>
  </div>;
}
