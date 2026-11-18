// Repetición espaciada FSRS-lite, sin dependencias y completamente offline.
export type Grade = 0 | 1 | 2 | 3; // 0 = olvidado, 1 = difícil, 2 = bien, 3 = fácil

export type SrsRecord = {
  id: string;
  stability: number;   // días hasta el próximo repaso con ~90% de acierto
  difficulty: number;  // 1..10
  due: number;         // timestamp
  reps: number;
  lapses: number;
  lastGrade: Grade;
  lastReviewed: number;
};

const DAY = 86400000;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export function makeRecord(id: string, now = Date.now()): SrsRecord {
  return { id, stability: 0.4, difficulty: 5, due: now, reps: 0, lapses: 0, lastGrade: 2, lastReviewed: 0 };
}

// Intervalos base en días por grado, ajustados por dificultad y estabilidad.
export function schedule(prev: SrsRecord | undefined, grade: Grade, now = Date.now()): SrsRecord {
  const base = prev ?? makeRecord('', now);
  const d = clamp(base.difficulty + (2 - grade) * 0.9 + (grade === 0 ? 1.2 : 0), 1, 10);
  let s: number;
  if (grade === 0) s = 0.35;
  else if (base.reps === 0) s = grade === 1 ? 0.7 : grade === 2 ? 1.2 : 2.2;
  else {
    const growth = 1.7 + (grade === 3 ? 0.5 : 0) - (grade === 1 ? 0.25 : 0);
    s = clamp(base.stability * growth * (11 - d) / 8, 0.4, 365);
  }
  if (grade < 2) s = Math.max(0.25, s);
  return {
    id: base.id,
    stability: Math.round(s * 100) / 100,
    difficulty: Math.round(d * 10) / 10,
    due: now + Math.round(s * DAY),
    reps: base.reps + 1,
    lapses: base.lapses + (grade === 0 ? 1 : 0),
    lastGrade: grade,
    lastReviewed: now
  };
}

export function isDue(rec: SrsRecord | undefined, now = Date.now()): boolean {
  return !rec || rec.due <= now;
}

export function formatInterval(rec: SrsRecord): string {
  const days = Math.max(0, (rec.due - rec.lastReviewed) / DAY);
  if (days < 1) return `${Math.max(1, Math.round(days * 24))} h`;
  if (days < 30) return `${Math.round(days)} d`;
  return `${Math.round(days / 30)} mes`;
}

// Misma clave que usa LessonView/Practice: así el repaso y la lección comparten estado.
export const qid = (lessonId: string, index: number) => `${lessonId}-q${index}`;
export const fid = (flashcardId: string) => `fc:${flashcardId}`;
// Día local (no UTC) para que rachas y calendario coincidan en el iPad.
export const dayKey = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
