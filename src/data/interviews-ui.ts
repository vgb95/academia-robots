import type { InterviewQuestion } from '../types';
import * as interviewData from './interviews';

/*
 * Adaptador y utilidades de presentación para el banco de entrevistas.
 * El banco lo genera otro módulo; aquí solo normalizamos la exportación y
 * derivamos los filtros para que la página no dependa del orden de los datos.
 */
type BankModule = {
  interviews?: InterviewQuestion[];
  interviewQuestions?: InterviewQuestion[];
  interviewBank?: InterviewQuestion[];
  default?: InterviewQuestion[];
};

const mod = interviewData as unknown as BankModule;

export const interviewBank: InterviewQuestion[] =
  mod.interviews ?? mod.interviewQuestions ?? mod.interviewBank ?? mod.default ?? [];

export type Difficulty = 'base' | 'intermedia' | 'avanzada';

export const difficultyLabels: Record<Difficulty, string> = {
  base: 'Base',
  intermedia: 'Intermedia',
  avanzada: 'Avanzada'
};

/** La dificultad se deriva del número de preguntas de seguimiento. */
export function difficultyOf(q: InterviewQuestion): Difficulty {
  const n = Array.isArray(q.followups) ? q.followups.length : 0;
  if (n >= 3) return 'avanzada';
  if (n === 2) return 'intermedia';
  return 'base';
}

export function categoryOptions(items: InterviewQuestion[]): string[] {
  return [...new Set(items.map(q => q.category))].sort((a, b) => a.localeCompare(b, 'es'));
}

export function trackOptions(items: InterviewQuestion[]): Array<'robotica' | 'ai'> {
  const found = new Set(items.map(q => q.track));
  return (['robotica', 'ai'] as const).filter(t => found.has(t));
}

function normalize(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

/** Búsqueda tolerante a acentos sobre pregunta, señal, rúbrica y respuesta. */
export function matchesSearch(q: InterviewQuestion, search: string): boolean {
  const query = normalize(search.trim());
  if (!query) return true;
  const haystack = [
    q.q,
    q.category,
    q.track,
    q.signal,
    ...q.rubric,
    ...q.followups,
    q.answer.context,
    q.answer.decision,
    q.answer.tradeoff
  ].map(normalize).join(' ');
  return haystack.includes(query);
}

export function interviewCheckId(id: string): string {
  return `int-${id}`;
}
