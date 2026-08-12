export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';

export type TaskPriority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NO_PRIORITY';

export type ColorTheme = 'amber' | 'blue' | 'violet' | 'rose' | 'emerald' | 'slate';

export type ThemeMode = 'light' | 'dark';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  priority: TaskPriority | string;
  dueDate?: string;
  taskId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Activity {
  id: string;
  author: string;
  content: string;
  type: 'COMMENT' | 'UPDATE';
  taskId: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus | string;
  priority: TaskPriority | string;
  dueDate?: string;
  labels: string[];
  members: string[];
  reporter?: string;
  subtasks?: Subtask[];
  activities?: Activity[];
  createdAt?: string;
  updatedAt?: string;
}

export interface VisibleFields {
  priority: boolean;
  members: boolean;
  dueDate: boolean;
  labels: boolean;
  status: boolean;
  reporter: boolean;
}
