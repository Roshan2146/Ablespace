# AbleSpace Technical Assessment — Full-Stack App & Product Understanding

This repository contains the complete submission for the **AbleSpace Technical Assessment**, divided into two primary parts:
1. **Part 1 (Full Stack)**: Task Management System (Next.js Frontend + NestJS & Prisma Backend).
2. **Part 2 (Product Understanding)**: Analysis and UX/UI evaluation of the AbleSpace *Take Data (Caseload)* workflow.

---

## 📁 Repository Structure

```
AbleSpace Project
│
├── frontend/             # Next.js 15, React 19, TypeScript, Tailwind CSS, Lucide Icons
├── backend/              # NestJS REST API, Prisma ORM, SQLite database
├── README.md             # Complete project and assessment documentation
└── Part-2/
    └── AbleSpace_Part2_Product_Understanding.pdf  # PDF document analyzing Take Data workflow
```

---

## 🚀 Part 1: Full-Stack Task Management System

A production-grade, highly aesthetic Task Management application designed to closely match the provided Figma specifications.

### 🎨 Key Features & Design Alignment

- **Guest Authentication Screen (`/login`)**:
  - Centered auth card with app icon, welcome messaging (*"Let's get back on track!"*), primary pill button (*"Continue as Guest"*), Google sign-in option, and legal footer.
- **Header & Collapsible Sidebar**:
  - Workspace switcher (`Dexter`), navigation links (`Tasks`, `Projects`), and a toggle button (`[|]`).
  - User profile menu popover featuring **Theme Switcher** flyout submenus:
    - **Mode**: Light & Dark mode support.
    - **Color Themes**: 6 accent themes (Amber, Blue, Violet, Rose, Emerald, Slate).
- **Dashboard Views**:
  - **List View**: Grouped by status (`To Do`, `Doing`, `Completed`) with collapsible section headers, inline quick-add task rows, and column toggles via `Fields` menu.
  - **Board (Kanban) View**: Status columns with task count pills, priority signal bar badges, member avatars, due dates, and tag pills (`Research`, `Design`, `Development`, `Testing`, `Deployment`).
- **Task Detail Drawer / Slide-over**:
  - Slide-over panel with title, description, subtasks checklist, activity feed timeline, comment input, and properties panel (Status, Priority, Members, Due Date, Reporter).
- **Full CRUD & Subtasks**:
  - Complete task creation, editing, subtask completion, status updates, and deletion.

### 🛠️ Tech Stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Lucide Icons, React Context API.
- **Backend**: NestJS, TypeScript, REST API, DTOs with `class-validator`.
- **Database**: Prisma ORM with SQLite (instant zero-config local setup) / PostgreSQL support.

### ⚡ Quickstart Instructions

#### 1. Backend Setup (NestJS + Prisma)

```bash
cd backend

# Install dependencies
npm install

# Push database schema & seed initial demo data
npx prisma db push
npx prisma db seed

# Start the NestJS dev server (runs on http://localhost:3001)
npm run start:dev
```
The REST API will be active at `http://localhost:3001/api`.

#### 2. Frontend Setup (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Start the Next.js dev server (runs on http://localhost:3000)
npm run dev
```
Visit `http://localhost:3000` in your browser.

### 📡 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/tasks` | Fetch all tasks (supports query search & filters) |
| `GET` | `/api/tasks/:id` | Fetch task details by ID (with subtasks & activities) |
| `POST` | `/api/tasks` | Create a new task |
| `PATCH` | `/api/tasks/:id` | Update task properties |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `POST` | `/api/tasks/:id/subtasks` | Add a subtask |
| `PATCH` | `/api/tasks/subtasks/:subtaskId` | Update subtask status |
| `DELETE` | `/api/tasks/subtasks/:subtaskId` | Delete a subtask |
| `POST` | `/api/tasks/:id/comments` | Add a comment/activity entry |

---

## 📊 Part 2: Product Understanding — Take Data Workflow

**Candidate**: Roshan Kumar  
**Focus Area**: `Caseload → Student → Take Data`  
**Document**: [`Part-2/AbleSpace_Part2_Product_Understanding.pdf`](file:///c:/Users/rosha/Downloads/Task_management/Part-2/AbleSpace_Part2_Product_Understanding.pdf)

### 📌 Summary of Product Analysis

1. **User Journey Evaluation**:
   - Analyzed the end-to-end workflow from role selection dialog to caseload management, student profile navigation, and trial-level data collection in the *Take Data* workspace.
2. **Key UX Strength Highlights**:
   - Clear starting point in Caseload for student lookup.
   - Strong continuity of context: student identity, session context, and active goal remain visible while recording data.
   - Large, accessible `+` capture control and immediate Undo affordance for active trial recording.
3. **Proposed UX/UI Improvements**:
   - **Data Meaning & Legend**: Introduce compact legend/labels describing numeric trial scales to eliminate user ambiguity.
   - **Input Recovery**: Enhanced visual feedback and confirmation indicators for high-frequency entry.
   - **Task Hierarchy**: Streamline visual hierarchy between persistent student/session headers and secondary action controls.
   - **Responsive Stacked Layouts**: Optimize stacked views and touch targets for tablet and mobile devices.

---
