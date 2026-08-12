import { Task, Subtask, Activity } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function fetchTasks(params?: { search?: string; status?: string; priority?: string }): Promise<Task[]> {
  const query = new URLSearchParams();
  if (params?.search) query.append('search', params.search);
  if (params?.status) query.append('status', params.status);
  if (params?.priority) query.append('priority', params.priority);

  const res = await fetch(`${API_BASE_URL}/tasks?${query.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function fetchTask(id: string): Promise<Task> {
  const res = await fetch(`${API_BASE_URL}/tasks/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch task');
  return res.json();
}

export async function createTask(data: Partial<Task>): Promise<Task> {
  const res = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
}

export async function updateTask(id: string, data: Partial<Task>): Promise<Task> {
  const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
}

export async function deleteTask(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete task');
  return res.json();
}

export async function addSubtask(taskId: string, title: string, priority = 'MEDIUM', dueDate = '15 Sep 2026'): Promise<Subtask> {
  const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/subtasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, priority, dueDate, completed: false }),
  });
  if (!res.ok) throw new Error('Failed to add subtask');
  return res.json();
}

export async function updateSubtask(subtaskId: string, data: Partial<Subtask>): Promise<Subtask> {
  const res = await fetch(`${API_BASE_URL}/tasks/subtasks/${subtaskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update subtask');
  return res.json();
}

export async function deleteSubtask(subtaskId: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE_URL}/tasks/subtasks/${subtaskId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete subtask');
  return res.json();
}

export async function addComment(taskId: string, content: string, author = 'You'): Promise<Activity> {
  const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, author }),
  });
  if (!res.ok) throw new Error('Failed to add comment');
  return res.json();
}
