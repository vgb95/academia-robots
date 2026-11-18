export type Level = 'inicial' | 'intermedio' | 'avanzado';

export type ContentBlock =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'apunte'; title?: string; text: string }
  | { type: 'nota'; text: string }
  | { type: 'advertencia'; text: string }
  | { type: 'codigo'; lang: string; title?: string; code: string }
  | { type: 'diagrama'; name: string; caption: string }
  | { type: 'tabla'; headers: string[]; rows: string[][] }
  | { type: 'lista'; items: string[]; ordered?: boolean }
  | { type: 'pasos'; items: { title: string; text: string }[] }
  | { type: 'formula'; expr: string; explain?: string }
  | { type: 'widget'; id: string }
  | { type: 'enlace'; url: string; label: string; desc?: string };

export type Question = { q: string; options: string[]; answer: number; why: string };

export type CommonError = { symptom: string; cause: string; fix: string };

export type Lesson = {
  id: string;
  title: string;
  minutes: number;
  level: Level;
  objectives: string[];
  blocks: ContentBlock[];
  errors?: CommonError[];
  practice?: { task: string; success: string[] };
  quiz?: Question[];
  tags?: string[];
  objectiveIds?: string[];      // para el grafo de dominio
  prereqs?: string[];           // IDs de lección de las que depende
};

export type Module = {
  id: string;
  title: string;
  subtitle: string;
  lessons: Lesson[];
};

export type Track = {
  id: 'robotica' | 'ai' | 'fisica';
  title: string;
  tagline: string;
  description: string;
  icon: string;
  accent: string;
  modules: Module[];
};

export type Resource = {
  id: string;
  track: 'robotica' | 'ai' | 'fisica' | 'ambos';
  module: string;
  title: string;
  url: string;
  desc: string;
  type: 'curso' | 'docs' | 'libro' | 'video' | 'herramienta' | 'hardware';
  free: boolean;
};

export type Project = {
  id: string;
  track: 'robotica' | 'ai' | 'fisica';
  module: string;
  title: string;
  desc: string;
  effort: string;
};

export type GlossaryEntry = { term: string; short: string; long: string; track?: 'robotica' | 'ai' | 'fisica' | 'ambos' };

export type InterviewQuestion = {
  id: string;
  track: 'robotica' | 'ai';
  category: string;
  q: string;
  rubric: string[];
  answer: { context: string; decision: string; tradeoff: string };
  followups: string[];
  signal: string;
};

export type Capstone = {
  id: string;
  track: 'robotica' | 'ai';
  title: string;
  brief: string;
  deliverables: string[];
  metrics: string[];
  rubric: { criterion: string; weight: number; passes: string }[];
  eliminates: string[];
};
