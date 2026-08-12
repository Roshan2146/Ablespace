'use client';

import React, { useState } from 'react';
import { Task, Subtask } from '@/types';
import { PriorityBadge } from './PriorityBadge';
import { DatePickerPopover } from './DatePickerPopover';
import {
  X,
  Plus,
  Calendar,
  UserPlus,
  Tag,
  CheckCircle2,
  Send,
  MoreHorizontal,
  ChevronDown,
  Paperclip,
  Trash2,
} from 'lucide-react';
import { addSubtask, updateSubtask, deleteSubtask, addComment, updateTask, deleteTask } from '@/lib/api';

interface TaskDetailDrawerProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdated: () => void;
}

export function TaskDetailDrawer({
  task,
  isOpen,
  onClose,
  onTaskUpdated,
}: TaskDetailDrawerProps) {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [showAddSubtask, setShowAddSubtask] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [priorityPopoverOpen, setPriorityPopoverOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  if (!isOpen || !task) return null;

  const handleToggleSubtask = async (subtask: Subtask) => {
    try {
      await updateSubtask(subtask.id, { completed: !subtask.completed });
      onTaskUpdated();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddSubtaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    try {
      await addSubtask(task.id, newSubtaskTitle.trim());
      setNewSubtaskTitle('');
      setShowAddSubtask(false);
      onTaskUpdated();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSubtask = async (id: string) => {
    try {
      await deleteSubtask(id);
      onTaskUpdated();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      await addComment(task.id, commentContent.trim(), 'You');
      setCommentContent('');
      onTaskUpdated();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    try {
      await updateTask(task.id, { status });
      onTaskUpdated();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdatePriority = async (priority: string) => {
    try {
      await updateTask(task.id, { priority });
      setPriorityPopoverOpen(false);
      onTaskUpdated();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectDate = async (dateStr: string) => {
    try {
      await updateTask(task.id, { dueDate: dateStr });
      onTaskUpdated();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTask = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(task.id);
        onTaskUpdated();
        onClose();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex justify-end">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Top Header */}
        <div className="h-14 px-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Tasks</span>
            <span>/</span>
            <span className="font-semibold text-gray-900 dark:text-white truncate">{task.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDeleteTask}
              className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/40 text-red-500 transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Left Content */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {/* Title & Description */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{task.title}</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {task.description || 'Create clear and detailed documentation for team features.'}
              </p>
            </div>

            {/* Properties Badges */}
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center gap-4">
                <span className="w-20 text-gray-500 font-medium">Properties:</span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                    👤 Designer
                  </span>
                  <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-medium">
                    📅 {task.dueDate || '31 Jul'}
                  </span>
                </div>
              </div>

              {/* Labels */}
              <div className="flex items-start gap-4">
                <span className="w-20 text-gray-500 font-medium pt-1">Labels:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(task.labels && task.labels.length > 0
                    ? task.labels
                    : ['Research', 'Design', 'Development', 'Testing', 'Deployment']
                  ).map((label, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium"
                    >
                      🏷️ {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div className="flex items-center gap-4">
                <span className="w-20 text-gray-500 font-medium">Resources:</span>
                <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Add document or link...</span>
                </button>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-4" />

            {/* Subtasks Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">
                  <span>▼ Subtasks</span>
                </h3>
              </div>

              {/* Subtasks Table */}
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-gray-500 font-medium">
                    <tr>
                      <th className="py-2 px-3 w-8"></th>
                      <th className="py-2 px-3">Task</th>
                      <th className="py-2 px-3">Priority</th>
                      <th className="py-2 px-3">Members</th>
                      <th className="py-2 px-3">Due Date</th>
                      <th className="py-2 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {task.subtasks && task.subtasks.length > 0 ? (
                      task.subtasks.map((st) => (
                        <tr key={st.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                          <td className="py-2 px-3">
                            <input
                              type="checkbox"
                              checked={st.completed}
                              onChange={() => handleToggleSubtask(st)}
                              className="rounded border-gray-300 dark:border-gray-700 text-blue-600 w-3.5 h-3.5 cursor-pointer"
                            />
                          </td>
                          <td className={`py-2 px-3 font-medium ${st.completed ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                            {st.title}
                          </td>
                          <td className="py-2 px-3">
                            <PriorityBadge priority={st.priority} showText={true} />
                          </td>
                          <td className="py-2 px-3">
                            <div className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">
                              AD
                            </div>
                          </td>
                          <td className="py-2 px-3 text-gray-500">{st.dueDate || '12 Sep 2026'}</td>
                          <td className="py-2 px-3 text-right">
                            <button
                              onClick={() => handleDeleteSubtask(st.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-3 text-center text-gray-400">
                          No subtasks added yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Add Subtask Form */}
              {showAddSubtask ? (
                <form onSubmit={handleAddSubtaskSubmit} className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Subtask title..."
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    className="flex-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md px-3 py-1.5 text-xs text-gray-900 dark:text-white outline-none focus:border-blue-500"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-semibold"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddSubtask(false)}
                    className="text-gray-500 hover:text-gray-700 text-xs px-2"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowAddSubtask(true)}
                  className="mt-3 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Subtasks</span>
                </button>
              )}
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-4" />

            {/* Updates / Activity Feed */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Updates</h3>

              <div className="space-y-4">
                {task.activities && task.activities.length > 0 ? (
                  task.activities.map((act) => (
                    <div key={act.id} className="flex gap-3 text-xs">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center font-bold text-xs">
                        {act.author[0]}
                      </div>
                      <div className="flex-1 bg-gray-50 dark:bg-gray-800/60 rounded-lg p-3 border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900 dark:text-white">{act.author}</span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(act.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">{act.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-gray-400 italic">No activity yet.</div>
                )}
              </div>

              {/* Comment Input Box */}
              <form onSubmit={handleAddCommentSubmit} className="mt-4 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  Y
                </div>
                <input
                  type="text"
                  placeholder="Leave a reply..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  className="flex-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  title="Send reply"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Details Sidebar */}
          <div className="w-64 border-l border-gray-200 dark:border-gray-800 p-4 bg-gray-50/50 dark:bg-gray-900/50 text-xs space-y-5">
            <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">Details</h4>

            {/* Status Selector */}
            <div className="space-y-1">
              <label className="text-gray-500 font-medium">Status</label>
              <select
                value={task.status}
                onChange={(e) => handleUpdateStatus(e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 rounded-md px-2.5 py-1.5 text-xs text-gray-900 dark:text-white font-medium outline-none"
              >
                <option value="TODO">Backlog / To Do</option>
                <option value="IN_PROGRESS">Doing / In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            {/* Priority Selector Popover */}
            <div className="space-y-1 relative">
              <label className="text-gray-500 font-medium">Priority</label>
              <button
                onClick={() => setPriorityPopoverOpen(!priorityPopoverOpen)}
                className="w-full flex items-center justify-between border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 rounded-md px-2.5 py-1.5 text-xs"
              >
                <PriorityBadge priority={task.priority} showText={true} />
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {priorityPopoverOpen && (
                <div className="absolute top-14 left-0 w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl py-1 z-50">
                  {['NO_PRIORITY', 'URGENT', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
                    <button
                      key={p}
                      onClick={() => handleUpdatePriority(p)}
                      className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <PriorityBadge priority={p} showText={true} />
                      {task.priority === p && '✓'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Members */}
            <div className="space-y-1">
              <label className="text-gray-500 font-medium">Members</label>
              <div className="flex items-center gap-1.5">
                {(task.members && task.members.length > 0 ? task.members : ['Ankit Dutta']).map((m, i) => (
                  <span
                    key={i}
                    className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-[10px]"
                  >
                    {m[0]}
                  </span>
                ))}
                <button className="w-6 h-6 rounded-full border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:border-gray-500">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Due Date Calendar Popover */}
            <div className="space-y-1 relative">
              <label className="text-gray-500 font-medium">Dates</label>
              <button
                onClick={() => setDatePickerOpen(!datePickerOpen)}
                className="w-full flex items-center gap-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 rounded-md px-2.5 py-1.5 text-xs text-gray-900 dark:text-white"
              >
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>{task.dueDate || '12 Sep 2026'}</span>
              </button>

              <DatePickerPopover
                isOpen={datePickerOpen}
                onClose={() => setDatePickerOpen(false)}
                onSelectDate={handleSelectDate}
                selectedDate={task.dueDate}
              />
            </div>

            {/* Reporter */}
            <div className="space-y-1">
              <label className="text-gray-500 font-medium">Reporter</label>
              <div className="text-gray-900 dark:text-white font-medium">{task.reporter || 'Ankit Dutta'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
