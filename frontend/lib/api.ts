import { Task, Subtask, Activity } from '@/types';

export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    return '/api';
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api`;
  }
  return 'http://localhost:3001/api';
}

const DEMO_FALLBACK_TASKS: Task[] = [
  {
    id: 'demo-1',
    title: 'Write API Documentation',
    description: 'Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively.',
    status: 'TODO',
    priority: 'HIGH',
    dueDate: '12 Sep 2026',
    labels: ['Research', 'Design', 'Development', 'Testing', 'Deployment'],
    members: ['Ankit Dutta', 'Abhishek Yadav'],
    reporter: 'Ankit Dutta',
    subtasks: [
      { id: 'st-1', title: 'Subtask 1', priority: 'HIGH', dueDate: '12 Sep 2026', completed: false, taskId: 'demo-1' },
      { id: 'st-2', title: 'Subtask 2', priority: 'LOW', dueDate: '15 Sep 2026', completed: true, taskId: 'demo-1' },
      { id: 'st-3', title: 'Subtask 3', priority: 'MEDIUM', dueDate: '18 Sep 2026', completed: false, taskId: 'demo-1' },
    ],
    activities: [
      { id: 'act-1', author: 'Ankit Dutta', content: 'changed priority from No priority to High', type: 'UPDATE', taskId: 'demo-1', createdAt: new Date().toISOString() },
    ],
  },
  {
    id: 'demo-2',
    title: 'Design Homepage',
    description: 'Redesign the primary marketing landing page for desktop and mobile devices.',
    status: 'TODO',
    priority: 'HIGH',
    dueDate: '12 Sep 2026',
    labels: ['Design', 'Research'],
    members: ['Ankit Sharma'],
    reporter: 'Dexter',
    subtasks: [],
    activities: [],
  },
  {
    id: 'demo-3',
    title: 'Develop Login Feature',
    description: 'Implement Google SSO and Guest user authentication state in frontend.',
    status: 'IN_PROGRESS',
    priority: 'LOW',
    dueDate: '15 Sep 2026',
    labels: ['Development', 'Testing'],
    members: ['Dexter'],
    reporter: 'Ankit Dutta',
    subtasks: [],
    activities: [],
  },
  {
    id: 'demo-4',
    title: 'Test Payment Gateway',
    description: 'Run end-to-end integration tests for Stripe sandbox checkout flow.',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    dueDate: '18 Sep 2026',
    labels: ['Testing', 'Deployment'],
    members: ['Abhishek Yadav'],
    reporter: 'Dexter',
    subtasks: [],
    activities: [],
  },
  {
    id: 'demo-5',
    title: 'Feature Testing Process',
    description: 'Execute automated regression test suite on staging environment.',
    status: 'COMPLETED',
    priority: 'HIGH',
    dueDate: '10 Sep 2026',
    labels: ['Testing'],
    members: ['Ankit Dutta'],
    reporter: 'Ankit Dutta',
    subtasks: [],
    activities: [],
  },
];

export async function fetchTasks(params?: { search?: string; status?: string; priority?: string }): Promise<Task[]> {
  const baseUrl = getApiBaseUrl();
  const query = new URLSearchParams();
  if (params?.search) query.append('search', params.search);
  if (params?.status) query.append('status', params.status);
  if (params?.priority) query.append('priority', params.priority);

  try {
    const res = await fetch(`${baseUrl}/tasks?${query.toString()}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('API fetch failed, utilizing demo fallback dataset:', err);
  }

  // Filter fallback tasks if search parameter is provided
  if (params?.search) {
    const q = params.search.toLowerCase();
    return DEMO_FALLBACK_TASKS.filter(t => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
  }

  return DEMO_FALLBACK_TASKS;
}

export async function fetchTask(id: string): Promise<Task> {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/tasks/${id}`, { cache: 'no-store' });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('fetchTask API error:', err);
  }
  const fallback = DEMO_FALLBACK_TASKS.find((t) => t.id === id) || DEMO_FALLBACK_TASKS[0];
  return fallback;
}

export async function createTask(data: Partial<Task>): Promise<Task> {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('createTask API error:', err);
  }
  const newTask: Task = {
    id: `task-${Date.now()}`,
    title: data.title || 'Untitled Task',
    description: data.description || '',
    status: data.status || 'TODO',
    priority: data.priority || 'MEDIUM',
    dueDate: data.dueDate || '15 Sep 2026',
    labels: data.labels || ['Development'],
    members: data.members || ['Dexter'],
    reporter: data.reporter || 'Dexter',
    subtasks: [],
    activities: [],
  };
  DEMO_FALLBACK_TASKS.unshift(newTask);
  return newTask;
}

export async function updateTask(id: string, data: Partial<Task>): Promise<Task> {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('updateTask API error:', err);
  }
  const idx = DEMO_FALLBACK_TASKS.findIndex((t) => t.id === id);
  if (idx !== -1) {
    DEMO_FALLBACK_TASKS[idx] = { ...DEMO_FALLBACK_TASKS[idx], ...data };
    return DEMO_FALLBACK_TASKS[idx];
  }
  return { id, title: 'Updated Task', status: 'TODO', priority: 'MEDIUM', labels: [], members: [] };
}

export async function deleteTask(id: string): Promise<{ success: boolean }> {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/tasks/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('deleteTask API error:', err);
  }
  const idx = DEMO_FALLBACK_TASKS.findIndex((t) => t.id === id);
  if (idx !== -1) DEMO_FALLBACK_TASKS.splice(idx, 1);
  return { success: true };
}

export async function addSubtask(taskId: string, title: string, priority = 'MEDIUM', dueDate = '15 Sep 2026'): Promise<Subtask> {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/tasks/${taskId}/subtasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, priority, dueDate, completed: false }),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('addSubtask API error:', err);
  }
  const newSubtask: Subtask = {
    id: `subtask-${Date.now()}`,
    title,
    priority,
    dueDate,
    completed: false,
    taskId,
  };
  const parent = DEMO_FALLBACK_TASKS.find((t) => t.id === taskId);
  if (parent) {
    if (!parent.subtasks) parent.subtasks = [];
    parent.subtasks.push(newSubtask);
  }
  return newSubtask;
}

export async function updateSubtask(subtaskId: string, data: Partial<Subtask>): Promise<Subtask> {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/tasks/subtasks/${subtaskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('updateSubtask API error:', err);
  }
  return { id: subtaskId, title: data.title || 'Subtask', completed: data.completed || false, priority: 'MEDIUM', taskId: '' };
}

export async function deleteSubtask(subtaskId: string): Promise<{ success: boolean }> {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/tasks/subtasks/${subtaskId}`, {
      method: 'DELETE',
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('deleteSubtask API error:', err);
  }
  return { success: true };
}

export async function addComment(taskId: string, content: string, author = 'You'): Promise<Activity> {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/tasks/${taskId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, author }),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('addComment API error:', err);
  }
  const newActivity: Activity = {
    id: `act-${Date.now()}`,
    author,
    content,
    type: 'COMMENT',
    taskId,
    createdAt: new Date().toISOString(),
  };
  const parent = DEMO_FALLBACK_TASKS.find((t) => t.id === taskId);
  if (parent) {
    if (!parent.activities) parent.activities = [];
    parent.activities.push(newActivity);
  }
  return newActivity;
}
