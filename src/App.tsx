import { Layout } from './components/Layout';
import { LessonView } from './components/LessonView';
import { HomePage, TrackPage, ModulePage, LibraryPage, ProjectsPage, GlossaryPage, KitPage, NotesPage, SearchPage, NotFound } from './components/Pages';
import { CasesPage, FlashcardsPage, TroubleshootingPage, CheatsheetsPage } from './components/ExtraPages';
import { LabsIndexPage, LabPage } from './components/Labs';
import { PracticePage } from './components/Practice';
import { DiagramGalleryPage } from './components/DiagramGallery';
import { RoadmapPage } from './components/Roadmap';
import { ShortcutsProvider } from './components/Shortcuts';
import { StudyPlanPage } from './components/StudyPlan';
import { OfflineGuidePage } from './components/OfflineGuide';
import { useRoute } from './router';
import { findLesson } from './data/tracks';

export default function App() {
  const route = useRoute();

  let content: React.ReactNode;
  switch (route.name) {
    case 'home': content = <HomePage />; break;
    case 'track': content = <TrackPage trackId={route.track} />; break;
    case 'module': content = <ModulePage trackId={route.track} moduleId={route.module} />; break;
    case 'lesson': {
      const found = findLesson(route.id);
      content = found ? <LessonView track={found.track} module={found.module} lesson={found.lesson} /> : <NotFound />;
      break;
    }
    case 'library': content = <LibraryPage />; break;
    case 'projects': content = <ProjectsPage />; break;
    case 'glossary': content = <GlossaryPage />; break;
    case 'kit': content = <KitPage />; break;
    case 'cases': content = <CasesPage />; break;
    case 'flashcards': content = <FlashcardsPage />; break;
    case 'troubleshooting': content = <TroubleshootingPage />; break;
    case 'cheatsheets': content = <CheatsheetsPage />; break;
    case 'labs': content = <LabsIndexPage />; break;
    case 'lab': content = <LabPage id={route.id} />; break;
    case 'practice': content = <PracticePage />; break;
    case 'diagrams': content = <DiagramGalleryPage />; break;
    case 'roadmap': content = <RoadmapPage />; break;
    case 'studyplan': content = <StudyPlanPage />; break;
    case 'offline': content = <OfflineGuidePage />; break;
    case 'notes': content = <NotesPage />; break;
    case 'search': content = <SearchPage q={route.q} />; break;
    default: content = <NotFound />;
  }

  return <ShortcutsProvider><Layout>{content}</Layout></ShortcutsProvider>;
}
