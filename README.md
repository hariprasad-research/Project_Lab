# Project Lab — PocketLab

A local-first personal workspace for projects, tasks, ideas, notes, and research.

**Capture an idea → organize it → work on it → track progress → preserve knowledge**

Everything is stored on your device. No account or network connection is required.

---

## 📱 About the Project

**PocketLab** is a **mobile-first web app** designed to run in Spck or any Node.js environment during development.

Once the web app is stable, it can be packaged as an Android APK using **Capacitor**.

---

## 🚧 Status

**Phase 2 of the build plan**

This phase delivers a fully working vertical slice rather than a mockup. The available screens are connected to a real local database.

### Dashboard

- Greeting
- Live statistics
- Today's focus list
- Tap-to-complete tasks
- Active projects
- Project progress bars
- Quick actions

### Projects

- Full CRUD operations
- Status and priority
- Progress automatically calculated from task completion
- Archive / soft-delete
- Permanent delete
- Linked-item count before deletion
- Confirmation dialogs
- Tabbed detail view: Overview / Tasks

### Tasks

Available views:

- Today
- Upcoming
- Overdue
- Completed
- All

Features:

- Complete / reopen tasks
- Delete tasks
- Priority badges
- Due-date labels

### Search

Live keyword search across:

- Projects
- Tasks
- Ideas
- Notes
- Research

### Settings

- Light / Dark / System theme
- Persisted theme preference
- Export backup as JSON
- Import backup
- Backup preview
- Merge or Replace import options
- Clear all data
- Confirmation dialogs for destructive actions

### Quick Capture

A floating `+` button opens a bottom sheet for quickly creating:

- Tasks
- Projects

### Upcoming Features

The following sections are already reachable from navigation and currently show a clear placeholder:

- Ideas
- Notes
- Research
- Goals
- Calendar
- Activity

These will be implemented in upcoming phases.

---

## 💾 Offline-First Architecture

PocketLab is designed to work completely offline.

```text
IndexedDB
    ↓
Dexie
```

Data survives page refreshes, browser restarts, and offline usage.

---

## 🛠️ Tech Stack

```text
React 19
TypeScript
Vite
Tailwind CSS v4
Zustand
Dexie (IndexedDB)
Zod
React Router
Framer Motion
Lucide Icons
Vitest
```

---

## 🚀 Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the production version:

```bash
npm run build
```

Run tests:

```bash
npm run test
```

Preview the production build:

```bash
npm run preview
```

The current test suite contains **20 tests** covering the database layer, project/task services, and backup/restore functionality.

---

## 📂 Project Structure

```text
src/
├── app/            # Root App component + router
├── layouts/        # MobileShell (bottom nav + FAB wrapper)
├── pages/          # One folder per route
├── features/       # Domain logic grouped by area
├── components/     # Generic design-system and shared UI
│   ├── ui/
│   ├── feedback/
│   └── layout/
├── db/             # Dexie database instance and schema
├── services/       # Business logic — only layer that touches Dexie
├── store/          # Zustand — UI state only
├── schemas/        # Zod validation
├── types/          # Domain TypeScript types
├── constants/      # Status/priority enums and labels
└── utils/          # ID generation and date helpers
```

See `PocketLab_Architecture_Plan.md` for the full architectural rationale, database schema, and phase plan.

---

## 🏗️ Architecture Principles

### Service Layer

```text
UI
 ↓
Features / Pages
 ↓
Services
 ↓
Dexie
 ↓
IndexedDB
```

The service layer is the only layer that directly communicates with Dexie.

### State Management

Zustand is used for **UI state only**, including:

- Theme
- Toasts
- Modals

Domain data lives in Dexie.

### Validation

Zod schemas are shared between forms, service writes, and backup imports.

---

## 🔐 Data Safety

### Validated Writes

Every write is validated with **Zod** before reaching the database.

### Project Deletion

Deleting a project does **not** automatically delete its tasks or notes.

```text
Delete Project
      ↓
Linked tasks / notes become unlinked
      ↓
Records remain available
```

The application shows the linked-item count before confirmation.

### Backup Import

Imported backups are:

1. Validated
2. Previewed
3. Shown with record counts
4. Confirmed by the user
5. Applied using the selected strategy

#### Merge

```text
Existing data + Backup data
          ↓
Newest edit wins per record
```

#### Replace

```text
Existing data
      ↓
Wipe
      ↓
Install backup
```

Nothing is silently overwritten.

---

## 🔬 Development Approach

PocketLab is being developed as a practical vertical slice rather than a static UI mockup.

```text
Plan
 ↓
Design
 ↓
Build
 ↓
Connect to database
 ↓
Validate
 ↓
Test
 ↓
Improve
```

---

## 📈 Phase Progress

### Phase 1

Foundation and architecture.

### Phase 2 — Current

Core vertical slice:

- Dashboard
- Projects
- Tasks
- Search
- Settings
- Quick Capture
- Local database
- Backup / restore
- Testing

### Next Phases

```text
Ideas
  ↓
Convert Idea to Project
  ↓
Notes
  ↓
Research Workspace
  ↓
Goals + Milestones
  ↓
Richer Dashboard Aggregation
  ↓
Calendar / Timeline
  ↓
Tag Management UI
  ↓
Activity Feed
  ↓
PWA / Offline Polish
  ↓
Accessibility
  ↓
Performance Improvements
```

---

## 🎯 Project Goal

PocketLab aims to create a reliable personal workspace where information moves through a simple lifecycle:

```text
Capture
   ↓
Organize
   ↓
Work
   ↓
Track
   ↓
Learn
   ↓
Preserve
```

The application focuses on local ownership of personal data, simplicity, reliability, and offline availability.

---

## 📦 Future Android App

Once the web application is stable:

```text
PocketLab Web App
       ↓
Capacitor
       ↓
Android APK
```

---

## 👨‍💻 Project Lab

| Property | Details |
|---|---|
| Project | PocketLab |
| Type | Mobile-first local-first productivity workspace |
| Current Phase | Phase 2 |
| Platform | Web → Android |
| Database | IndexedDB via Dexie |
| Validation | Zod |
| Testing | Vitest |

---

## 📌 Project Status

> **Phase 2 — Core vertical slice completed and ready for the next development phase.**
