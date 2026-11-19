import type { LessonBridge } from '../../types';
import { electronicsLessonDeep as academic } from './electronics/academic';
import { electronicsLessonDeep as professor } from './electronics/professor';
import { electronicsLessonDeep as r11 } from './electronics/r1-1';
import { electronicsLessonDeep as r12 } from './electronics/r1-2';
import { electronicsLessonDeep as r13 } from './electronics/r1-3';
import { electronicsLessonDeep as r14 } from './electronics/r1-4';
import { electronicsLessonDeep as r15 } from './electronics/r1-5';
import { electronicsLessonDeep as r16 } from './electronics/r1-6';
import { electronicsLessonDeep as r17 } from './electronics/r1-7';
import { electronicsLessonDeep as r18 } from './electronics/r1-8-9';

// Un solo dueño por lección: se concatenan los bloques de las diez fuentes en orden.
const sources = [academic, professor, r11, r12, r13, r14, r15, r16, r17, r18];

export const electronicsDeep: Record<string, LessonBridge> = (() => {
  const out: Record<string, LessonBridge> = {};
  for (const source of sources) {
    for (const [id, bridge] of Object.entries(source)) {
      const prev = out[id];
      out[id] = prev
        ? { ...prev, extraBlocks: [...(prev.extraBlocks ?? []), ...(bridge.extraBlocks ?? [])] }
        : { ...bridge };
    }
  }
  return out;
})();
