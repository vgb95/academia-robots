import { useMemo, useState } from 'react';
import { capstones } from '../data/capstones';
import { projects } from '../data/shared';
import { allLessons, findLesson, tracks } from '../data/tracks';
import {
  categoryOptions,
  difficultyLabels,
  difficultyOf,
  interviewBank,
  interviewCheckId,
  matchesSearch,
  trackOptions,
  type Difficulty
} from '../data/interviews-ui';
import { href } from '../router';
import { useStore, type AppState } from '../state/store';
import type { Capstone, InterviewQuestion, Project } from '../types';

type Role = 'ambos' | 'robotica' | 'ai';
type TrackFilter = 'all' | InterviewQuestion['track'];
type CategoryFilter = 'all' | string;
type DifficultyFilter = 'all' | Difficulty;

const roleLabel: Record<Role, string> = {
  ambos: 'Robótica e IA',
  robotica: 'Robótica',
  ai: 'AI Engineer'
};

const trackLabel: Record<InterviewQuestion['track'], string> = {
  robotica: 'Robótica',
  ai: 'AI Engineer'
};

type Resume = {
  lessonsDone: number;
  lessonsTotal: number;
  lessonsDoing: number;
  criteriaDone: number;
  quizAnswered: number;
  quizCorrect: number;
  projectsDone: number;
  capstonesDone: number;
  interviewsDone: number;
  notesCount: number;
};

type CoverageRow = {
  track: string;
  moduleId: string;
  title: string;
  done: number;
  total: number;
  pct: number;
};

type Snippet = { id: string; title: string; moduleId: string; note: string };

type PortfolioData = {
  role: Role;
  resume: Resume;
  selectedCapstones: Capstone[];
  selectedProjects: Project[];
  snippets: Snippet[];
  coverage: CoverageRow[];
};

function roleMatches(track: Project['track'] | Capstone['track'], role: Role): boolean {
  return role === 'ambos' || track === role;
}

/** Un capstone puede marcarse desde distintas vistas; aceptamos las claves usadas. */
function capstoneDone(capstone: Capstone, checks: AppState['checks']): boolean {
  return !!(checks[capstone.id] || checks[`capstone-${capstone.id}`] || checks[`cap-${capstone.id}`]);
}

function quote(text: string): string {
  return text.split('\n').map(line => `> ${line}`).join('\n');
}

function buildMarkdown(data: PortfolioData): string {
  const { resume, selectedCapstones, selectedProjects, snippets, coverage } = data;
  const date = new Date().toISOString().slice(0, 10);
  const lines: string[] = [];

  lines.push('# Portafolio — Robótica & IA', '');
  lines.push(`> Generado el ${date} a partir del progreso real registrado en la academia.`, '');
  lines.push(`> Foco: ${roleLabel[data.role]}. Ninguna cifra se ha escrito a mano.`, '');

  lines.push('## Resultados', '');
  lines.push('| Logro medible | Valor |', '| --- | --- |');
  lines.push(`| Lecciones completadas | ${resume.lessonsDone} de ${resume.lessonsTotal} |`);
  lines.push(`| Lecciones en curso | ${resume.lessonsDoing} |`);
  lines.push(`| Criterios de práctica verificados | ${resume.criteriaDone} |`);
  lines.push(`| Preguntas de quiz respondidas | ${resume.quizAnswered} (${resume.quizCorrect} correctas) |`);
  lines.push(`| Proyectos documentados | ${resume.projectsDone} |`);
  lines.push(`| Capstones marcados | ${resume.capstonesDone} |`);
  lines.push(`| Entrevistas respondidas | ${resume.interviewsDone} |`);
  lines.push(`| Apuntes sustantivos | ${resume.notesCount} |`, '');

  lines.push('## Demo', '');
  lines.push('Checkpoint de entrega: **demo < 90 s**, toma continua, sin edición que oculte fallos.', '');
  selectedCapstones.forEach((capstone, i) => {
    lines.push(`### ${i + 1}. ${capstone.title}`, '');
    lines.push(capstone.brief, '');
    lines.push('**Entregables**', '');
    capstone.deliverables.forEach(item => lines.push(`- ${item}`));
    lines.push('', '**Métricas verificables**', '');
    capstone.metrics.forEach(item => lines.push(`- ${item}`));
    lines.push('');
  });
  if (selectedCapstones.length === 0) lines.push('_Sin capstones marcados para este rol._', '');

  lines.push('## Código', '');
  if (selectedProjects.length === 0) {
    lines.push('_Sin proyectos completados para este rol. Marca los proyectos terminados en la academia para que aparezcan aquí._', '');
  } else {
    selectedProjects.forEach(project => {
      lines.push(`- **${project.title}** (${project.module}, ${project.effort}) — ${project.desc}`);
    });
    lines.push('');
  }

  lines.push('## Proceso', '');
  if (snippets.length === 0) {
    lines.push('_Aún no hay apuntes. Escribe en cada lección qué decidiste, qué mediste y qué ajustaste._', '');
  } else {
    snippets.forEach(snippet => {
      lines.push(`### ${snippet.title} · ${snippet.moduleId}`, '');
      lines.push(quote(snippet.note), '');
    });
  }

  lines.push('## Qué se rompió y cómo lo arreglé', '');
  const failures = snippets.filter(s => /romp|fall|error|arregl|correg|bug|atasc|dificult|deriva|reset/i.test(s.note));
  if (failures.length === 0) {
    lines.push('_Pendiente: esta sección es obligatoria. Describe un fallo concreto, la medida que reveló la causa y la corrección, con el antes y el después._', '');
  } else {
    failures.forEach(snippet => {
      lines.push(`### ${snippet.title}`, '');
      lines.push(quote(snippet.note), '');
    });
  }

  lines.push('## Cobertura por módulo', '');
  lines.push('| Módulo | Completadas | Cobertura |', '| --- | --- | --- |');
  coverage.forEach(row => {
    lines.push(`| ${row.track} · ${row.moduleId} ${row.title} | ${row.done}/${row.total} | ${row.pct}% |`);
  });
  lines.push('', '---', '', '_README generado desde datos reales del progreso, no desde una plantilla._');

  return lines.join('\n');
}

function buildSummary(data: PortfolioData): string {
  const { resume, selectedCapstones, selectedProjects } = data;
  return [
    `Portafolio · ${roleLabel[data.role]} · ${new Date().toISOString().slice(0, 10)}`,
    `${resume.lessonsDone}/${resume.lessonsTotal} lecciones · ${resume.quizCorrect} quiz correctas · ${resume.criteriaDone} criterios · ${resume.projectsDone} proyectos · ${resume.capstonesDone} capstones`,
    `Demos (< 90 s): ${selectedCapstones.map(c => c.title).join(' | ') || 'sin capstones marcados'}`,
    `Código: ${selectedProjects.map(p => p.title).join(' | ') || 'sin proyectos completados'}`
  ].join('\n');
}

export function PortfolioPage() {
  const { state, toggleCheck } = useStore();
  const [role, setRole] = useState<Role>('ambos');
  const [copied, setCopied] = useState(false);
  const lessons = useMemo(() => allLessons(), []);

  const resume = useMemo<Resume>(() => {
    const { progress, checks, quiz, notes } = state;
    let quizCorrect = 0;
    lessons.forEach(({ lesson }) => {
      (lesson.quiz ?? []).forEach((question, i) => {
        if (quiz[`${lesson.id}-q${i}`] === question.answer) quizCorrect += 1;
      });
    });
    return {
      lessonsDone: lessons.filter(x => progress[x.lesson.id] === 'done').length,
      lessonsTotal: lessons.length,
      lessonsDoing: lessons.filter(x => progress[x.lesson.id] === 'doing').length,
      criteriaDone: Object.entries(checks).filter(([key, value]) => value && /-c\d+$/.test(key)).length,
      quizAnswered: Object.values(quiz).filter(value => value !== undefined).length,
      quizCorrect,
      projectsDone: projects.filter(p => !!checks[`proj-${p.id}`]).length,
      capstonesDone: capstones.filter(c => capstoneDone(c, checks)).length,
      interviewsDone: Object.entries(checks).filter(([key, value]) => value && key.startsWith('int-')).length,
      notesCount: Object.values(notes).filter(text => text.trim().length > 0).length
    };
  }, [lessons, state]);

  const selectedCapstones = useMemo(
    () => capstones.filter(c => roleMatches(c.track, role)),
    [role]
  );

  const selectedProjects = useMemo(
    () => projects.filter(p => roleMatches(p.track, role) && !!state.checks[`proj-${p.id}`]).slice(0, 6),
    [role, state.checks]
  );

  const snippets = useMemo<Snippet[]>(() => Object.entries(state.notes)
    .filter(([, text]) => text.trim().length > 0)
    .map(([id, text]) => {
      const found = findLesson(id);
      return { id, title: found?.lesson.title ?? id, moduleId: found?.module.id ?? 'general', note: text.trim() };
    })
    .slice(0, 8), [state.notes]);

  const coverage = useMemo<CoverageRow[]>(() => tracks
    .filter(track => role === 'ambos' || track.id === role)
    .flatMap(track => track.modules.map(module => {
      const total = module.lessons.length;
      const done = module.lessons.filter(lesson => state.progress[lesson.id] === 'done').length;
      return {
        track: track.id,
        moduleId: module.id,
        title: module.title,
        done,
        total,
        pct: total === 0 ? 0 : Math.round((done / total) * 100)
      };
    })), [role, state.progress]);

  const portfolio = useMemo<PortfolioData>(
    () => ({ role, resume, selectedCapstones, selectedProjects, snippets, coverage }),
    [role, resume, selectedCapstones, selectedProjects, snippets, coverage]
  );
  const markdown = useMemo(() => buildMarkdown(portfolio), [portfolio]);
  const summary = useMemo(() => buildSummary(portfolio), [portfolio]);

  const download = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `portafolio-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const copySummary = () => {
    if (!navigator.clipboard?.writeText) return;
    void navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }).catch(() => { /* sin avisos: el portapapeles puede estar bloqueado */ });
  };

  const achievements: Array<[string, string, string]> = [
    ['Lecciones completadas', `${resume.lessonsDone} / ${resume.lessonsTotal}`, 'Estado «done» del progreso real'],
    ['Lecciones en curso', String(resume.lessonsDoing), 'Estado «doing» del progreso real'],
    ['Criterios de práctica verificados', String(resume.criteriaDone), 'Checklists de práctica marcados'],
    ['Quiz respondidas', String(resume.quizAnswered), `${resume.quizCorrect} respuestas correctas sobre el total de respuestas`],
    ['Proyectos documentados', String(resume.projectsDone), 'Proyectos marcados como hechos'],
    ['Capstones marcados', String(resume.capstonesDone), `De ${capstones.length} capstones del plan`],
    ['Entrevistas respondidas', String(resume.interviewsDone), 'Preguntas marcadas en el banco'],
    ['Apuntes sustantivos', String(resume.notesCount), 'Notas con contenido escrito']
  ];

  return <div className="page">
    <div className="breadcrumb"><a href={href('/')}>Inicio</a><span>/</span>Portafolio</div>

    <header className="page-header">
      <div className="hero-eyebrow">PORTAFOLIO</div>
      <h1>Lo que has construido, en números</h1>
      <p>Este portafolio se genera del progreso real: lecciones terminadas, checklists verificadas, quiz, proyectos marcados y capstones entregados. No hay texto de muestra: si algo no aparece, todavía no está en tus datos.</p>
    </header>

    <div className="filters">
      <label className="count" htmlFor="portfolio-role">Rol</label>
      <select id="portfolio-role" value={role} onChange={e => setRole(e.target.value as Role)}>
        <option value="ambos">Robótica e IA</option>
        <option value="robotica">Robótica</option>
        <option value="ai">AI Engineer</option>
      </select>
      <span className="count">{selectedCapstones.length} capstones · {selectedProjects.length} proyectos · {coverage.length} módulos</span>
    </div>

    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
      <button className="btn" onClick={download}>Descargar portfolio Markdown</button>
      <button className="btn btn-ghost" onClick={copySummary}>{copied ? 'Resumen copiado' : 'Copiar resumen'}</button>
    </div>

    <section>
      <h2 className="section-title">1 · Índice de logros medibles</h2>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Logro</th><th>Valor</th><th>Procedencia</th></tr></thead>
          <tbody>{achievements.map(([label, value, detail]) => (
            <tr key={label}><td><strong>{label}</strong></td><td>{value}</td><td className="muted">{detail}</td></tr>
          ))}</tbody>
        </table>
      </div>
    </section>

    <section>
      <h2 className="section-title">2 · Demos con checkpoint «demo &lt; 90 s»</h2>
      <div className="resource-grid">{selectedCapstones.map(capstone => {
        const done = capstoneDone(capstone, state.checks);
        return <div className="resource-card" key={capstone.id}>
          <div className="resource-top">
            <span className="badge">{roleLabel[capstone.track]}</span>
            <span className="badge">{done ? 'marcado' : 'pendiente'}</span>
          </div>
          <h3>{capstone.title}</h3>
          <p>{capstone.brief}</p>
          <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="badge">demo &lt; 90 s</span>
            <button className="btn btn-ghost" style={{ minHeight: 34, padding: '4px 10px' }} onClick={() => toggleCheck(capstone.id)}>
              {done ? 'Desmarcar entrega' : 'Marcar como entregado'}
            </button>
          </div>
          <ul style={{ paddingLeft: 18, margin: '12px 0 0', fontSize: 12, color: 'var(--muted)' }}>
            {capstone.metrics.slice(0, 3).map(metric => <li key={metric}>{metric}</li>)}
          </ul>
        </div>;
      })}</div>
    </section>

    <section>
      <h2 className="section-title">3 · Proyectos completados</h2>
      {selectedProjects.length === 0
        ? <div className="callout nota"><div className="callout-title">Sin proyectos marcados</div>Marca proyectos como hechos en la sección de proyectos: el portafolio solo publica los que figuren como completados en tus datos.</div>
        : <div className="resource-grid">{selectedProjects.map(project => <div className="resource-card" key={project.id}>
          <div className="resource-top"><span className="badge">{project.module}</span><span className="badge">{project.effort}</span></div>
          <h3>{project.title}</h3>
          <p>{project.desc}</p>
        </div>)}</div>}
      {selectedProjects.length > 0 && selectedProjects.length < 4 && <p className="muted">Hay {selectedProjects.length} proyectos completados para este rol. Marca al menos cuatro para dar más cuerpo a esta sección.</p>}
    </section>

    <section>
      <h2 className="section-title">4 · Snippets anotados</h2>
      {snippets.length === 0
        ? <div className="callout nota"><div className="callout-title">Sin apuntes todavía</div>Las notas que escribas en cada lección se convierten aquí en fragmentos anotados y alimentan la sección «Qué se rompió y cómo lo arreglé» del README.</div>
        : snippets.map(snippet => <div className="quiz-card" key={snippet.id}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className="badge">{snippet.moduleId}</span>
            <span className="badge">{snippet.title}</span>
          </div>
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)', fontSize: 12.5, background: 'var(--paper)', padding: 12, borderRadius: 4, margin: '12px 0 0' }}>{snippet.note}</pre>
        </div>)}
    </section>

    <section>
      <h2 className="section-title">5 · Mapa de cobertura por módulo</h2>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Track</th><th>Módulo</th><th>Lecciones</th><th>Cobertura</th></tr></thead>
          <tbody>{coverage.map(row => <tr key={`${row.track}-${row.moduleId}`}>
            <td>{row.track}</td>
            <td><strong>{row.moduleId}</strong> {row.title}</td>
            <td>{row.done} / {row.total}</td>
            <td style={{ minWidth: 140 }}>
              <span className="count">{row.pct}%</span>
              <div className="bar"><div style={{ width: `${row.pct}%` }} /></div>
            </td>
          </tr>)}</tbody>
        </table>
      </div>
    </section>

    <div className="callout apunte"><div className="callout-title">Antes de publicar</div>
      El README exportado sigue el orden resultados → demo → código → proceso e incluye siempre la sección obligatoria <strong>«Qué se rompió y cómo lo arreglé»</strong>. Complétala con tus propias notas: es lo que distingue un portafolio de un tutorial repetido.
    </div>
  </div>;
}
export function InterviewPage() {
  const { state, toggleCheck } = useStore();
  const [track, setTrack] = useState<TrackFilter>('all');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all');
  const [search, setSearch] = useState('');
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set());

  const tracks = useMemo(() => trackOptions(interviewBank), []);
  const categories = useMemo(() => categoryOptions(interviewBank), []);

  const answeredIds = useMemo(
    () => interviewBank.filter(q => !!state.checks[interviewCheckId(q.id)]).map(q => q.id),
    [state.checks]
  );
  const answered = answeredIds.length;
  const progress = interviewBank.length === 0 ? 0 : Math.round((answered / interviewBank.length) * 100);

  const list = useMemo(() => interviewBank.filter(q =>
    (track === 'all' || q.track === track) &&
    (category === 'all' || q.category === category) &&
    (difficulty === 'all' || difficultyOf(q) === difficulty) &&
    matchesSearch(q, search)
  ), [track, category, difficulty, search]);

  const toggleReveal = (id: string) => {
    setRevealed(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return <div className="page">
    <div className="breadcrumb"><a href={href('/')}>Inicio</a><span>/</span>Entrevistas</div>

    <header className="page-header">
      <div className="hero-eyebrow">BANCO DE ENTREVISTAS</div>
      <h1>Preguntas que resisten una reprobación</h1>
      <p>Cada respuesta se construye en tres tiempos —contexto, decisión y trade-off— y termina con la señal que busca quien entrevista y dos preguntas de seguimiento. Practica en voz alta antes de marcarla como respondida.</p>
    </header>

    <div className="filters">
      <input className="search-input" placeholder="Buscar pregunta, señal o respuesta…" value={search} onChange={e => setSearch(e.target.value)} />
      <select value={track} onChange={e => { setTrack(e.target.value as TrackFilter); setCategory('all'); }}>
        <option value="all">Todos los tracks</option>
        {tracks.map(t => <option key={t} value={t}>{trackLabel[t]}</option>)}
      </select>
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="all">Todas las categorías</option>
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select value={difficulty} onChange={e => setDifficulty(e.target.value as DifficultyFilter)}>
        <option value="all">Todas las dificultades</option>
        {(['base', 'intermedia', 'avanzada'] as Difficulty[]).map(d => <option key={d} value={d}>{difficultyLabels[d]}</option>)}
      </select>
      <span className="count">{list.length} preguntas</span>
    </div>

    <div className="callout apunte">
      <div className="callout-title">Progreso</div>
      <div><strong>{answered}</strong> de {interviewBank.length} preguntas respondidas · <span className="count">{progress}%</span></div>
      <div className="bar"><div style={{ width: `${progress}%` }} /></div>
    </div>

    {interviewBank.length === 0
      ? <div className="callout nota"><div className="callout-title">Banco vacío</div>No hay preguntas disponibles en este momento. Vuelve cuando el banco de entrevistas esté cargado.</div>
      : list.length === 0
        ? <div className="callout nota"><div className="callout-title">Sin coincidencias</div>Prueba con otra categoría, otra dificultad o un término más breve en el buscador.</div>
        : <div style={{ display: 'grid', gap: 14 }}>{list.map(q => {
          const isRevealed = revealed.has(q.id);
          const isAnswered = !!state.checks[interviewCheckId(q.id)];
          const level = difficultyOf(q);
          return <article className="quiz-card" key={q.id}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="badge">{trackLabel[q.track]}</span>
              <span className="badge">{q.category}</span>
              <span className="badge">{difficultyLabels[level]}</span>
              {isAnswered && <span className="badge">respondida</span>}
            </div>

            <div className="quiz-q" style={{ marginTop: 12 }}>{q.q}</div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn btn-ghost" onClick={() => toggleReveal(q.id)}>{isRevealed ? 'Ocultar respuesta' : 'Ver respuesta'}</button>
              <button className={`btn ${isAnswered ? 'btn-done' : ''}`} onClick={() => toggleCheck(interviewCheckId(q.id))}>
                {isAnswered ? 'Respondida · desmarcar' : 'Marcar respondida'}
              </button>
            </div>

            {isRevealed && <div style={{ marginTop: 16, display: 'grid', gap: 14 }}>
              <div style={{ display: 'grid', gap: 4 }}>
                <span className="badge">1 · Contexto</span>
                <p style={{ margin: 0, fontSize: 14 }}>{q.answer.context}</p>
              </div>
              <div style={{ display: 'grid', gap: 4 }}>
                <span className="badge">2 · Decisión</span>
                <p style={{ margin: 0, fontSize: 14 }}>{q.answer.decision}</p>
              </div>
              <div style={{ display: 'grid', gap: 4 }}>
                <span className="badge">3 · Trade-off</span>
                <p style={{ margin: 0, fontSize: 14 }}>{q.answer.tradeoff}</p>
              </div>
              <div className="quiz-why ok"><strong>Señal que busca:</strong> {q.signal}</div>
              <div style={{ display: 'grid', gap: 6 }}>
                <span className="badge">Followups</span>
                <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13.5 }}>
                  {q.followups.map((followup, i) => <li key={`${q.id}-f${i}`}>{followup}</li>)}
                </ol>
              </div>
              {q.rubric.length > 0 && <div className="muted"><strong>Rúbrica:</strong> {q.rubric.join(' · ')}</div>}
            </div>}
          </article>;
        })}</div>}
  </div>;
}
