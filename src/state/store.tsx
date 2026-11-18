import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { openDB, type IDBPDatabase } from 'idb';

export type Progress = 'todo' | 'doing' | 'done';

export type AppState = {
  progress: Record<string, Progress>;
  checks: Record<string, boolean>;
  quiz: Record<string, number>;
  notes: Record<string, string>;
  bookmarks: string[];
  lastLesson: string | null;
  updatedAt: number;
};

const EMPTY: AppState = {
  progress: {}, checks: {}, quiz: {}, notes: {}, bookmarks: [], lastLesson: null, updatedAt: 0
};

const DB_NAME = 'academia-robots';
const STORE = 'kv';
const KEY = 'state';

async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, 1, {
    upgrade(db) { if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE); }
  });
}

async function load(): Promise<AppState> {
  try {
    const db = await getDB();
    const raw = await db.get(STORE, KEY);
    if (raw) return { ...EMPTY, ...(raw as AppState) };
  } catch { /* IndexedDB no disponible: memoria */ }
  try {
    const raw = localStorage.getItem('academia-robots-fallback');
    if (raw) return { ...EMPTY, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { ...EMPTY };
}

type Ctx = {
  state: AppState;
  ready: boolean;
  setProgress: (id: string, value: Progress) => void;
  toggleCheck: (id: string) => void;
  answerQuiz: (id: string, answer: number) => void;
  setNote: (id: string, note: string) => void;
  toggleBookmark: (id: string) => void;
  setLastLesson: (id: string) => void;
  exportJSON: () => void;
  importJSON: (file: File) => Promise<void>;
  resetAll: () => void;
};

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(EMPTY);
  const [ready, setReady] = useState(false);
  const firstRun = useRef(true);

  useEffect(() => {
    let alive = true;
    load().then(s => { if (alive) { setState(s); setReady(true); } });
    return () => { alive = false; };
  }, []);

  // Persistencia automática: IndexedDB con fallback a localStorage.
  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    if (!ready) return;
    const t = window.setTimeout(async () => {
      const withTime = { ...state, updatedAt: Date.now() };
      try {
        const db = await getDB();
        await db.put(STORE, withTime, KEY);
      } catch {
        try { localStorage.setItem('academia-robots-fallback', JSON.stringify(withTime)); } catch { /* ignore */ }
      }
    }, 250);
    return () => window.clearTimeout(t);
  }, [state, ready]);

  const setProgress = useCallback((id: string, value: Progress) => {
    setState(s => ({ ...s, progress: { ...s.progress, [id]: value } }));
  }, []);
  const toggleCheck = useCallback((id: string) => {
    setState(s => ({ ...s, checks: { ...s.checks, [id]: !s.checks[id] } }));
  }, []);
  const answerQuiz = useCallback((id: string, answer: number) => {
    setState(s => ({ ...s, quiz: { ...s.quiz, [id]: answer } }));
  }, []);
  const setNote = useCallback((id: string, note: string) => {
    setState(s => ({ ...s, notes: { ...s.notes, [id]: note } }));
  }, []);
  const toggleBookmark = useCallback((id: string) => {
    setState(s => {
      const has = s.bookmarks.includes(id);
      return { ...s, bookmarks: has ? s.bookmarks.filter(b => b !== id) : [...s.bookmarks, id] };
    });
  }, []);
  const setLastLesson = useCallback((id: string) => {
    setState(s => s.lastLesson === id ? s : { ...s, lastLesson: id });
  }, []);

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `academia-robots-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [state]);

  const importJSON = useCallback(async (file: File) => {
    try {
      const raw = JSON.parse(await file.text());
      setState({ ...EMPTY, ...raw });
    } catch {
      alert('No se pudo importar el archivo. Comprueba que sea un respaldo válido de la academia.');
    }
  }, []);

  const resetAll = useCallback(() => {
    if (!confirm('¿Borrar TODO tu progreso, notas y marcadores? Esta acción no se puede deshacer.')) return;
    setState({ ...EMPTY });
  }, []);

  const value = useMemo<Ctx>(() => ({
    state, ready, setProgress, toggleCheck, answerQuiz, setNote,
    toggleBookmark, setLastLesson, exportJSON, importJSON, resetAll
  }), [state, ready, setProgress, toggleCheck, answerQuiz, setNote, toggleBookmark, setLastLesson, exportJSON, importJSON, resetAll]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Ctx {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore fuera de StoreProvider');
  return ctx;
}
