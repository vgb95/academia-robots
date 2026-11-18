import type { ContentBlock, Lesson, Level, Module, Question, CommonError } from '../types';

export const p = (text: string): ContentBlock => ({ type: 'p', text });
export const h = (text: string): ContentBlock => ({ type: 'h', text });
export const apunte = (text: string, title = 'Apunte'): ContentBlock => ({ type: 'apunte', title, text });
export const nota = (text: string): ContentBlock => ({ type: 'nota', text });
export const aviso = (text: string): ContentBlock => ({ type: 'advertencia', text });
export const codigo = (lang: string, code: string, title?: string): ContentBlock => ({ type: 'codigo', lang, code, title });
export const diagrama = (name: string, caption: string): ContentBlock => ({ type: 'diagrama', name, caption });
export const tabla = (headers: string[], rows: string[][]): ContentBlock => ({ type: 'tabla', headers, rows });
export const lista = (items: string[], ordered = false): ContentBlock => ({ type: 'lista', items, ordered });
export const pasos = (items: { title: string; text: string }[]): ContentBlock => ({ type: 'pasos', items });
export const formula = (expr: string, explain?: string): ContentBlock => ({ type: 'formula', expr, explain });
export const widget = (id: string): ContentBlock => ({ type: 'widget', id });
export const enlace = (url: string, label: string, desc?: string): ContentBlock => ({ type: 'enlace', url, label, desc });

type LessonInput = {
  id: string;
  title: string;
  min?: number;
  level?: Level;
  objectives: string[];
  blocks: ContentBlock[];
  errors?: CommonError[];
  practice?: { task: string; success: string[] };
  quiz?: Question[];
  tags?: string[];
};

export const leccion = (l: LessonInput): Lesson => ({
  id: l.id,
  title: l.title,
  minutes: l.min ?? 12,
  level: l.level ?? 'inicial',
  objectives: l.objectives,
  blocks: l.blocks,
  errors: l.errors,
  practice: l.practice,
  quiz: l.quiz,
  tags: l.tags
});

export const modulo = (id: string, title: string, subtitle: string, lessons: Lesson[]): Module => ({ id, title, subtitle, lessons });

export const err = (symptom: string, cause: string, fix: string): CommonError => ({ symptom, cause, fix });
export const q = (pregunta: string, opciones: string[], respuesta: number, porQue: string): Question => ({
  q: pregunta, options: opciones, answer: respuesta, why: porQue
});
