'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { TaskList } from '@/components/TaskList';
import { TaskBoard } from '@/components/TaskBoard';
import { TaskDetailDrawer } from '@/components/TaskDetailDrawer';
import { AddTaskModal } from '@/components/AddTaskModal';
import { Task } from '@/types';
import { fetchTasks, createTask, updateTask } from '@/lib/api';
import { AlertCircle, RefreshCw, Folder } from 'lucide-react';

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState<'tasks' | 'projects'>('tasks');
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTasks({ search: searchQuery });
      setTasks(data);
    } catch (err: any) {
      setError('Could not connect to backend API server. Please check your backend connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleOpenTask = (task: Task) => {
    setSelectedTask(task);
    setDrawerOpen(true);
  };

  const handleQuickAddTask = async (status: string, title: string) => {
    try {
      await createTask({
        title,
        status,
        priority: 'MEDIUM',
        dueDate: '12 Sep 2026',
        members: ['Dexter'],
        reporter: 'Dexter',
      });
      loadTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (taskId: string, status: string) => {
    try {
      await updateTask(taskId, { status });
      loadTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={(v) => setCurrentView(v)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header */}
        <Header
          viewMode={viewMode}
          onViewModeChange={(m) => setViewMode(m)}
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
          onOpenAddTask={() => setAddTaskModalOpen(true)}
        />

        {/* View Switcher: Tasks vs Projects */}
        <div className="flex-1 overflow-y-auto">
          {currentView === 'projects' ? (
            <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
                <Folder className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Projects Workspace</h2>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Manage your software engineering roadmap, milestones, and cross-team dependencies.
              </p>
            </div>
          ) : (
            <>
              {/* Error Banner */}
              {error && (
                <div className="m-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl flex items-center justify-between text-xs text-red-600 dark:text-red-400">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                  <button
                    onClick={loadTasks}
                    className="flex items-center gap-1 bg-red-600 text-white px-2.5 py-1 rounded font-semibold hover:bg-red-700 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Retry
                  </button>
                </div>
              )}

              {/* Loading Skeleton */}
              {loading ? (
                <div className="p-6 space-y-4 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                  ))}
                </div>
              ) : (
                <>
                  {viewMode === 'list' ? (
                    <TaskList
                      tasks={tasks}
                      onSelectTask={handleOpenTask}
                      onQuickAddTask={handleQuickAddTask}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  ) : (
                    <TaskBoard
                      tasks={tasks}
                      onSelectTask={handleOpenTask}
                      onOpenAddTask={() => setAddTaskModalOpen(true)}
                    />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>

      {/* Task Detail Drawer Slide-over */}
      <TaskDetailDrawer
        task={selectedTask}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onTaskUpdated={loadTasks}
      />

      {/* Add Task Modal Form */}
      <AddTaskModal
        isOpen={addTaskModalOpen}
        onClose={() => setAddTaskModalOpen(false)}
        onTaskCreated={loadTasks}
      />
    </div>
  );
}
