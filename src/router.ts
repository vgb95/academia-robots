import { useEffect, useState } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'track'; track: string }
  | { name: 'module'; track: string; module: string }
  | { name: 'lesson'; id: string }
  | { name: 'library' }
  | { name: 'projects' }
  | { name: 'glossary' }
  | { name: 'notes' }
  | { name: 'kit' }
  | { name: 'cases' }
  | { name: 'flashcards' }
  | { name: 'troubleshooting' }
  | { name: 'cheatsheets' }
  | { name: 'search'; q: string }
  | { name: '404' };

function parse(hash: string): Route {
  const clean = hash.replace(/^#\/?/, '');
  const parts = clean.split('/').filter(Boolean).map(decodeURIComponent);
  if (parts.length === 0) return { name: 'home' };
  switch (parts[0]) {
    case 'track':
      if (parts[1] && parts[2]) return { name: 'module', track: parts[1], module: parts[2] };
      return { name: 'track', track: parts[1] ?? '' };
    case 'lesson': return { name: 'lesson', id: parts[1] ?? '' };
    case 'library': return { name: 'library' };
    case 'projects': return { name: 'projects' };
    case 'glossary': return { name: 'glossary' };
    case 'notes': return { name: 'notes' };
    case 'kit': return { name: 'kit' };
    case 'casos': case 'cases': return { name: 'cases' };
    case 'flashcards': return { name: 'flashcards' };
    case 'troubleshooting': return { name: 'troubleshooting' };
    case 'cheatsheets': return { name: 'cheatsheets' };
    case 'search': return { name: 'search', q: parts[1] ?? '' };
    default: return { name: '404' };
  }
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parse(window.location.hash));
  useEffect(() => {
    const onChange = () => {
      setRoute(parse(window.location.hash));
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export function go(path: string) {
  window.location.hash = path.startsWith('/') ? path : '/' + path;
}

export const href = (path: string) => '#' + (path.startsWith('/') ? path : '/' + path);
