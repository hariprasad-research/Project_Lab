import { createBrowserRouter } from 'react-router-dom';
import { Lightbulb, StickyNote, FlaskConical, Target, CalendarDays, Activity } from 'lucide-react';
import { MobileShell } from '../layouts/MobileShell';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { ProjectsListPage } from '../pages/Projects/ProjectsListPage';
import { ProjectDetailPage } from '../pages/Projects/ProjectDetailPage';
import { TasksListPage } from '../pages/Tasks/TasksListPage';
import { SearchPage } from '../pages/Search/SearchPage';
import { SettingsPage } from '../pages/Settings/SettingsPage';
import { ComingSoonPage } from '../pages/ComingSoonPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MobileShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'projects', element: <ProjectsListPage /> },
      { path: 'projects/:id', element: <ProjectDetailPage /> },
      { path: 'tasks', element: <TasksListPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'settings', element: <SettingsPage /> },
      {
        path: 'ideas',
        element: (
          <ComingSoonPage
            title="Ideas"
            icon={Lightbulb}
            description="The Idea Vault — capture, explore, and convert ideas into projects — lands in the next build phase."
          />
        ),
      },
      {
        path: 'notes',
        element: (
          <ComingSoonPage
            title="Notes"
            icon={StickyNote}
            description="A dedicated note-taking space with pinning, tags, and project links is coming next."
          />
        ),
      },
      {
        path: 'research',
        element: (
          <ComingSoonPage
            title="Research"
            icon={FlaskConical}
            description="A structured research workspace — question, method, results, conclusion — is planned for an upcoming phase."
          />
        ),
      },
      {
        path: 'goals',
        element: (
          <ComingSoonPage
            title="Goals"
            icon={Target}
            description="Track longer-term goals across projects and milestones — coming soon."
          />
        ),
      },
      {
        path: 'calendar',
        element: (
          <ComingSoonPage
            title="Calendar"
            icon={CalendarDays}
            description="A day/week/month/timeline view of tasks, deadlines, and milestones is planned next."
          />
        ),
      },
      {
        path: 'activity',
        element: (
          <ComingSoonPage
            title="Activity"
            icon={Activity}
            description="A full history of everything you've created, completed, and changed is coming soon."
          />
        ),
      },
      { path: '*', element: <DashboardPage /> },
    ],
  },
]);
