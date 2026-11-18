import { useState } from 'react';
import { tracks } from '../data/tracks';
import { labs, type Lab } from '../data/labs';
import { href } from '../router';
import { useStore, type Progress } from '../state/store';

type TrackFilter = 'robotica' | 'ai' | 'ambos';
type Ritmo = '2h' | '1h' | 'fin-de-semana';

type PlanLesson = { id: string; title: string; minutes: number; done: boolean };
type PlanModule = {
  id: string;
  title: string;
  track: 'robotica' | 'ai' | 'fisica';
  lessons: PlanLesson[];
  minutes: number;
  done: boolean;
};
type PlanWeek = {
  number: number;
  modules: PlanModule[];
  lessons: number;
  minutes: number;
  lab: Lab;
  overBudget: boolean;
};

const WEEKS = 12;

const TRACK_LABEL: Record<TrackFilter, string> = {
  robotica: 'Robótica desde cero',
  ai: 'AI Engineer',
  ambos: 'Robótica + IA'
};

const RITMOS: Record<Ritmo, { label: string; hours: number; detail: string }> = {
  '2h': { label: '2 h/día', hours: 14, detail: '7 días × 2 h' },
  '1h': { label: '1 h/día', hours: 7, detail: '7 días × 1 h' },
  'fin-de-semana': { label: 'Fin de semana', hours: 6, detail: '3 h el sábado + 3 h el domingo' }
};

function hours(minutes: number): string {
  const h = minutes / 60;
  return Number.isInteger(h) ? String(h) : h.toFixed(1);
}

/** Módulos en el orden original del track; los ya completados se empujan al final. */
function buildModules(track: TrackFilter, progress: Record<string, Progress>): PlanModule[] {
  const selected = track === 'ambos' ? tracks : tracks.filter(t => t.id === track);
  const modules = selected.flatMap(t => t.modules.map(m => {
    const lessons: PlanLesson[] = m.lessons.map(l => ({
      id: l.id,
      title: l.title,
      minutes: l.minutes,
      done: progress[l.id] === 'done'
    }));
    return {
      id: m.id,
      title: m.title,
      track: t.id,
      lessons,
      minutes: lessons.reduce((n, l) => n + l.minutes, 0),
      done: lessons.length > 0 && lessons.every(l => l.done)
    };
  }));
  // sort es estable: dentro de cada grupo se conserva el orden del libro.
  return modules.sort((a, b) => Number(a.done) - Number(b.done));
}

function buildPlan(track: TrackFilter, ritmo: Ritmo, progress: Record<string, Progress>): PlanWeek[] {
  const modules = buildModules(track, progress);
  const totalMinutes = modules.reduce((n, m) => n + m.minutes, 0);
  const target = totalMinutes / WEEKS;
  const budget = RITMOS[ritmo].hours * 60;

  // Reparto equilibrado en 12 semanas: se añade un módulo a la semana actual
  // mientras eso acerque su carga al objetivo; si se aleja, se abre la siguiente.
  const groups: PlanModule[][] = Array.from({ length: WEEKS }, () => []);
  let week = 0;
  let acc = 0;
  for (const module of modules) {
    const addsDistance = Math.abs(acc + module.minutes - target);
    const keepsDistance = Math.abs(acc - target);
    if (acc > 0 && addsDistance > keepsDistance && week < WEEKS - 1) {
      week += 1;
      acc = 0;
    }
    groups[week].push(module);
    acc += module.minutes;
  }

  // Un laboratorio por semana, rotando dentro del track de la semana.
  const labCursor: Record<'robotica' | 'ai' | 'fisica', number> = { robotica: 0, ai: 0, fisica: 0 };
  return groups.map((assigned, i) => {
    const weekTrack = assigned[0]?.track ?? 'robotica';
    const sameTrack = labs.filter(l => l.track === weekTrack);
    const pool = sameTrack.length > 0 ? sameTrack : labs;
    const lab = pool[labCursor[weekTrack] % pool.length];
    labCursor[weekTrack] += 1;
    const minutes = assigned.reduce((n, m) => n + m.minutes, 0);
    return {
      number: i + 1,
      modules: assigned,
      lessons: assigned.reduce((n, m) => n + m.lessons.length, 0),
      minutes,
      lab,
      overBudget: minutes > budget
    };
  });
}

function toMarkdown(
  plan: PlanWeek[],
  track: TrackFilter,
  ritmo: Ritmo,
  summary: { modules: number; lessons: number; minutes: number; done: number }
): string {
  const lines: string[] = [];
  lines.push('# Plan de estudio — Academia Robots');
  lines.push('');
  lines.push(`- Track: ${TRACK_LABEL[track]}`);
  lines.push(`- Ritmo: ${RITMOS[ritmo].label} (${RITMOS[ritmo].hours} h/semana · ${RITMOS[ritmo].detail})`);
  lines.push(`- Duración: ${WEEKS} semanas`);
  lines.push('');
  lines.push('## Resumen');
  lines.push('');
  lines.push(`- Módulos: ${summary.modules} (${summary.done} ya completados, al final del plan)`);
  lines.push(`- Lecciones: ${summary.lessons}`);
  lines.push(`- Horas totales de contenido: ${hours(summary.minutes)} h`);
  lines.push(`- Horas semanales necesarias: ${hours(summary.minutes / WEEKS)} h`);
  lines.push('');
  for (const week of plan) {
    lines.push(`## Semana ${week.number}`);
    lines.push('');
    lines.push(`- Horas estimadas: ${hours(week.minutes)} h${week.overBudget ? ' (por encima del ritmo elegido)' : ''}`);
    lines.push(`- Lecciones: ${week.lessons}`);
    lines.push('');
    lines.push('| Módulo | Track | Lecciones | Horas |');
    lines.push('| --- | --- | --- | --- |');
    for (const m of week.modules) {
      lines.push(`| ${m.title}${m.done ? ' ✓ completado' : ''} | ${m.track === 'robotica' ? 'Robótica' : 'IA'} | ${m.lessons.length} | ${hours(m.minutes)} h |`);
    }
    lines.push('');
    lines.push(`**Laboratorio recomendado:** ${week.lab.title} — ${week.lab.subtitle} (${week.lab.level}, ${week.lab.minutes} min).`);
    lines.push('');
  }
  return lines.join('\n');
}

export function StudyPlanPage() {
  const { state } = useStore();
  const [track, setTrack] = useState<TrackFilter>('ambos');
  const [ritmo, setRitmo] = useState<Ritmo>('1h');
  const [plan, setPlan] = useState<PlanWeek[]>(() => buildPlan('ambos', '1h', state.progress));

  const generate = () => setPlan(buildPlan(track, ritmo, state.progress));

  const summary = {
    modules: plan.reduce((n, w) => n + w.modules.length, 0),
    lessons: plan.reduce((n, w) => n + w.lessons, 0),
    minutes: plan.reduce((n, w) => n + w.minutes, 0),
    done: plan.reduce((n, w) => n + w.modules.filter(m => m.done).length, 0)
  };
  const capacityMinutes = RITMOS[ritmo].hours * WEEKS * 60;
  const required = summary.minutes / WEEKS;

  const download = () => {
    const md = toMarkdown(plan, track, ritmo, summary);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plan-de-estudio.md';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return <div className="page">
    <div className="breadcrumb"><a href={href('/')}>Inicio</a><span>/</span>Plan de estudio</div>
    <header className="page-header">
      <h1>🗓 Plan de estudio en 12 semanas</h1>
      <p>Elige un track y un ritmo. El plan reparte los módulos reales del libro entre 12 semanas, calcula las horas a partir de la duración de cada lección y te recomienda un laboratorio por semana. Los módulos que ya has completado se marcan y se colocan al final.</p>
    </header>

    <div className="callout apunte">
      <div className="callout-title">Cómo se calcula</div>
      <p>Las horas salen de sumar los minutos de las lecciones de cada módulo, sin redondeos al alza. El reparto equilibrado busca que todas las semanas carguen parecido; el ritmo fija el presupuesto semanal y se usa para señalar las semanas que se pasan de él. Pulsa <strong>Generar plan</strong> para recalcular con tu progreso actual.</p>
    </div>

    <div className="filters">
      <select value={track} onChange={e => setTrack(e.target.value as TrackFilter)}>
        <option value="ambos">Ambos tracks</option>
        <option value="robotica">Robótica desde cero</option>
        <option value="ai">AI Engineer</option>
      </select>
      <select value={ritmo} onChange={e => setRitmo(e.target.value as Ritmo)}>
        {Object.entries(RITMOS).map(([key, value]) => <option key={key} value={key}>{value.label} · {value.hours} h/semana</option>)}
      </select>
      <button className="btn" onClick={generate}>Generar plan</button>
      <button className="btn btn-ghost" onClick={download}>↓ Descargar Markdown</button>
    </div>

    <div className="callout">
      <div className="callout-title">Resumen del plan · {TRACK_LABEL[track]} · {RITMOS[ritmo].label}</div>
      <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
        <div><strong>{summary.modules}</strong><div className="muted">módulos</div></div>
        <div><strong>{summary.lessons}</strong><div className="muted">lecciones</div></div>
        <div><strong>{hours(summary.minutes)} h</strong><div className="muted">contenido total</div></div>
        <div><strong>{hours(required)} h</strong><div className="muted">necesarias por semana</div></div>
        <div><strong>{RITMOS[ritmo].hours} h</strong><div className="muted">disponibles por semana</div></div>
        <div><strong>{summary.done}</strong><div className="muted">ya completados</div></div>
      </div>
      <p className="muted" style={{ marginTop: 12 }}>
        {summary.minutes <= capacityMinutes
          ? `El contenido cabe en el ritmo elegido: ${hours(capacityMinutes - summary.minutes)} h de margen en las ${WEEKS} semanas.`
          : `A este ritmo reunirías ${hours(capacityMinutes)} h en ${WEEKS} semanas y faltarían ${hours(summary.minutes - capacityMinutes)} h: sube el ritmo o amplía el plazo.`}
      </p>
    </div>

    {plan.map(week => <section className="callout" key={week.number}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
        <div className="callout-title" style={{ marginBottom: 0 }}>Semana {week.number}</div>
        <div className="muted">
          {week.lessons} lecciones · {hours(week.minutes)} h estimadas
          {week.overBudget && <span className="badge paid" style={{ marginLeft: 8 }}>por encima del ritmo</span>}
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Módulo</th><th>Track</th><th>Lecciones</th><th>Horas</th></tr></thead>
          <tbody>
            {week.modules.map(m => <tr key={m.id}>
              <td>
                <strong>{m.title}</strong>{' '}
                {m.done && <span className="badge free">✓ completado</span>}
                <div className="muted">{m.lessons.map(l => l.title).join(' · ')}</div>
              </td>
              <td>{m.track === 'robotica' ? 'Robótica' : 'IA'}</td>
              <td>{m.lessons.length}</td>
              <td>{hours(m.minutes)} h</td>
            </tr>)}
          </tbody>
        </table>
      </div>
      <p style={{ marginBottom: 0 }}>
        <strong>▸ Laboratorio recomendado:</strong> {week.lab.title} — {week.lab.subtitle}{' '}
        <span className="muted">({week.lab.level}, {week.lab.minutes} min)</span>
      </p>
    </section>)}
  </div>;
}
