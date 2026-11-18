import { Fragment, type ReactNode } from 'react';
import type { ContentBlock } from '../types';
import { getDiagram } from '../data/diagrams';
import { glossary } from '../data/shared';
import { Widget } from './Widgets';
import { href } from '../router';

const terms = [...glossary].sort((a, b) => b.term.length - a.term.length).slice(0, 200);
const escaped = terms.map(t => t.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const termRe = escaped.length ? new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi') : null;
const termMap = new Map(terms.map(t => [t.term.toLowerCase(), t]));

// Resaltado de términos del glosario, sin HTML inseguro.
function highlightTerms(text: string): ReactNode {
  if (!termRe) return <>{text}</>;
  const parts = text.split(termRe);
  return <>{parts.map((part, i) => {
    const entry = termMap.get(part.toLowerCase());
    if (!entry) return <Fragment key={i}>{part}</Fragment>;
    return <abbr className="gloss-term" key={i} title={`${entry.short}\n\n${entry.long}`}>{part}</abbr>;
  })}</>;
}

// Negrita / cursiva / código en línea con Markdown mínimo.
const inlineRe = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
export function RichText({ text }: { text: string }): ReactNode {
  return <>{text.split(inlineRe).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4)
      return <strong key={i}>{highlightTerms(part.slice(2, -2))}</strong>;
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2)
      return <em key={i}>{highlightTerms(part.slice(1, -1))}</em>;
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2)
      return <code className="inline-code" key={i}>{part.slice(1, -1)}</code>;
    return <Fragment key={i}>{highlightTerms(part)}</Fragment>;
  })}</>;
}

function Diagram({ name, caption }: { name: string; caption: string }) {
  const svg = getDiagram(name);
  return <figure className="diagram">
    <div className="diagram-frame" dangerouslySetInnerHTML={{ __html: svg ?? '' }} />
    <figcaption>{caption}</figcaption>
  </figure>;
}

export function BlockRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return <div className="blocks">
    {blocks.map((b, i) => {
      switch (b.type) {
        case 'h': return <h3 key={i} className="block-h"><RichText text={b.text} /></h3>;
        case 'p': return <p key={i}><RichText text={b.text} /></p>;
        case 'apunte': return <aside key={i} className="callout apunte">
          <div className="callout-title">📌 {b.title}</div><RichText text={b.text} />
        </aside>;
        case 'nota': return <aside key={i} className="callout nota">
          <div className="callout-title">✍️ Nota al margen</div><RichText text={b.text} />
        </aside>;
        case 'advertencia': return <aside key={i} className="callout aviso">
          <div className="callout-title">⚠️ Aviso</div><RichText text={b.text} />
        </aside>;
        case 'codigo': return <div key={i} className="code-wrap">
          {b.title && <div className="code-title">{b.title}</div>}
          <div className="code-lang">{b.lang}</div>
          <pre><code>{b.code}</code></pre>
        </div>;
        case 'diagrama': return <Diagram key={i} name={b.name} caption={b.caption} />;
        case 'tabla': return <div key={i} className="table-wrap"><table>
          <thead><tr>{b.headers.map((hd, j) => <th key={j}>{hd}</th>)}</tr></thead>
          <tbody>{b.rows.map((row, j) => <tr key={j}>{row.map((cell, k) => <td key={k}><RichText text={cell} /></td>)}</tr>)}</tbody>
        </table></div>;
        case 'lista': return b.ordered
          ? <ol key={i} className="block-list">{b.items.map((it, j) => <li key={j}><RichText text={it} /></li>)}</ol>
          : <ul key={i} className="block-list">{b.items.map((it, j) => <li key={j}><RichText text={it} /></li>)}</ul>;
        case 'pasos': return <ol key={i} className="steps">{b.items.map((s, j) => <li key={j}><strong>{s.title}</strong><span><RichText text={s.text} /></span></li>)}</ol>;
        case 'formula': return <div key={i} className="formula-block">
          <div className="formula-expr">{b.expr}</div>{b.explain && <div className="formula-explain"><RichText text={b.explain} /></div>}
        </div>;
        case 'widget': return <Widget key={i} id={b.id} />;
        case 'enlace': return <a key={i} className="resource-inline" href={b.url} target="_blank" rel="noreferrer">
          <span className="resource-inline-label">🔗 {b.label} ↗</span>{b.desc && <span className="resource-inline-desc">{b.desc}</span>}
        </a>;
        default: return null;
      }
    })}
  </div>;
}

export function QuickLinks({ trackId, moduleId }: { trackId: string; moduleId: string }) {
  return <div className="quick-links">
    <a href={href(`/track/${trackId}/${moduleId}`)}>← Volver al módulo</a>
    <a href={href('/library')}>📚 Biblioteca de recursos</a>
    <a href={href('/projects')}>🛠️ Proyectos</a>
  </div>;
}
