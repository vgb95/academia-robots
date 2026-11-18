import type { Question } from '../types';
import { allLessons } from './tracks';

/**
 * Una pregunta del modo práctica. Conserva las claves que ya usa la academia
 * para que el progreso sea compartido con la lección correspondiente.
 */
export type PracticeQuestion = Question & {
  /** Misma clave que LessonView: `${lesson.id}-q${i}` */
  key: string;
  /** Clave para el marcador «Me la sé»: `practice-${lesson.id}-${i}` */
  checkKey: string;
  trackId: 'robotica' | 'ai';
  trackTitle: string;
  moduleId: string;
  moduleTitle: string;
  lessonId: string;
  lessonTitle: string;
  /** Posición de la pregunta dentro de su lección (base 0). */
  index: number;
};

/** Recoge los quizzes de TODAS las lecciones de todos los tracks. */
export function collectPracticeQuestions(): PracticeQuestion[] {
  return allLessons().flatMap(({ track, module, lesson }) =>
    (lesson.quiz ?? []).map((qq, i) => ({
      key: `${lesson.id}-q${i}`,
      checkKey: `practice-${lesson.id}-${i}`,
      q: qq.q,
      options: qq.options,
      answer: qq.answer,
      why: qq.why,
      trackId: track.id,
      trackTitle: track.title,
      moduleId: module.id,
      moduleTitle: module.title,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      index: i
    }))
  );
}
