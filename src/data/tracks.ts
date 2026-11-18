import type { Track, Module, Lesson } from '../types';
import { roboticsPart1 } from './robotics/part1';
import { roboticsPart2 } from './robotics/part2';
import { roboticsPart3 } from './robotics/part3';
import { aiModules } from './ai';
import { agenticModules } from './ai/agentic';
import { advancedRoboticsModules } from './robotics/advanced';
import { advancedAiModules } from './ai/advanced';
import { physicalTrack } from './physical';

export const tracks: Track[] = [
  {
    id: 'robotica',
    title: 'Robótica desde cero',
    tagline: 'De la ley de Ohm al robot que aprende',
    description: '15 bloques para construir la base completa y luego dominar la depuración eléctrica, el control en tiempo real y la mecatrónica. Pensado para alguien que nunca ha sostenido un multímetro.',
    icon: '⌬',
    accent: '#C4471E',
    modules: [...roboticsPart1, ...roboticsPart2, ...roboticsPart3, ...advancedRoboticsModules]
  },
  {
    id: 'ai',
    title: 'AI Engineer',
    tagline: 'Para SWE que quieren pasar a IA',
    description: '16 bloques que asumen que ya sabes programar: ML, deep learning, LLMs, RAG, agentes, inferencia, evals y MLOps, orquestación con T3 Code, método Huang y fiabilidad adversaria. Lenguaje técnico claro, cero relleno.',
    icon: '◈',
    accent: '#5B3FD6',
    modules: [...aiModules, ...agenticModules, ...advancedAiModules]
  },
  physicalTrack as Track
];

export function getTrack(id: string): Track | undefined {
  return tracks.find(t => t.id === id);
}

export function allModules(): { track: Track; module: Module }[] {
  return tracks.flatMap(track => track.modules.map(module => ({ track, module })));
}

export function allLessons(): { track: Track; module: Module; lesson: Lesson }[] {
  return tracks.flatMap(track => track.modules.flatMap(module =>
    module.lessons.map(lesson => ({ track, module, lesson }))
  ));
}

export function findLesson(id: string) {
  return allLessons().find(x => x.lesson.id === id);
}

export function lessonIndex(id: string): number {
  return allLessons().findIndex(x => x.lesson.id === id);
}

export function neighborLessons(id: string) {
  const list = allLessons();
  const i = list.findIndex(x => x.lesson.id === id);
  return { prev: i > 0 ? list[i - 1] : undefined, next: i >= 0 && i < list.length - 1 ? list[i + 1] : undefined };
}

export function stats() {
  const lessons = allLessons();
  return {
    tracks: tracks.length,
    modules: new Set(lessons.map(x => x.module.id)).size,
    lessons: lessons.length,
    minutes: lessons.reduce((n, x) => n + x.lesson.minutes, 0)
  };
}
