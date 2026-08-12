'use client';

import React, { useState } from 'react';
import { Task } from '@/types';
import { PriorityBadge } from './PriorityBadge';
import { useTheme } from '@/lib/theme';
import { ChevronDown, ChevronRight, Plus, MoreHorizontal, Check } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onQuickAddTask: (status: string, title: string) => void;
  onUpdateStatus: (taskId: string, status: string) => void;
}

export function TaskList({
  tasks,
  onSelectTask,
  onQuickAddTask,
  onUpdateStatus,
}: TaskListProps) {
  const { visibleFields } = useTheme();
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [quickInputGroup, setQuickInputGroup] = useState<string | null>(null);
  const [quickTitle, setQuickTitle] = useState('');

  const groups = [
    { id: 'TODO', label: 'To Do' },
    { id: 'IN_PROGRESS', label: 'Doing' },
    { id: 'COMPLETED', label: 'Completed' },
  ];

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const handleQuickSubmit = (groupId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    onQuickAddTask(groupId, quickTitle.trim());
    setQuickTitle('');
    setQuickInputGroup(null);
  };

  return (
    <div className="p-6 space-y-6">
      {groups.map((group) => {
        const groupTasks = tasks.filter((t) => (t.status || 'TODO') === group.id);
        const isCollapsed = collapsedGroups[group.id];

        return (
          <div key={group.id} className="border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
            {/* Group Header */}
            <div
              onClick={() => toggleGroup(group.id)}
              className="px-4 py-3 bg-gray-50/70 dark:bg-gray-800/50 flex items-center justify-between cursor-pointer select-none border-b border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center gap-2 font-semibold text-xs text-gray-900 dark:text-white">
                {isCollapsed ? <ChevronRight className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                <span>{group.label}</span>
                <span className="text-gray-400 font-normal ml-1">({groupTasks.length})</span>
              </div>
            </div>

            {/* Table Content */}
            {!isCollapsed && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-gray-800 text-gray-400 font-medium">
                    <tr>
                      <th className="py-2.5 px-4 w-8"></th>
                      <th className="py-2.5 px-4">Task</th>
                      {visibleFields.priority && <th className="py-2.5 px-4 w-32">Priority</th>}
                      {visibleFields.members && <th className="py-2.5 px-4 w-32">Members</th>}
                      {visibleFields.dueDate && <th className="py-2.5 px-4 w-32">Due Date</th>}
                      <th className="py-2.5 px-4 w-16 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                    {groupTasks.map((task) => (
                      <tr
                        key={task.id}
                        className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors group cursor-pointer"
                        onClick={() => onSelectTask(task)}
                      >
                        {/* Checkbox */}
                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={task.status === 'COMPLETED'}
                            onChange={(e) => {
                              onUpdateStatus(task.id, e.target.checked ? 'COMPLETED' : 'TODO');
                            }}
                            className="rounded border-gray-300 dark:border-gray-700 text-blue-600 w-3.5 h-3.5 cursor-pointer"
                          />
                        </td>

                        {/* Title & Description preview */}
                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                          <span className={task.status === 'COMPLETED' ? 'line-through text-gray-400' : ''}>
                            {task.title}
                          </span>
                        </td>

                        {/* Priority */}
                        {visibleFields.priority && (
                          <td className="py-3 px-4">
                            <PriorityBadge priority={task.priority} showText={true} />
                          </td>
                        )}

                        {/* Members */}
                        {visibleFields.members && (
                          <td className="py-3 px-4">
                            <div className="flex items-center -space-x-1">
                              {(task.members && task.members.length > 0 ? task.members : ['Dexter']).map((m, idx) => (
                                <span
                                  key={idx}
                                  className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white dark:ring-slate-900"
                                >
                                  {m[0]}
                                </span>
                              ))}
                            </div>
                          </td>
                        )}

                        {/* Due Date */}
                        {visibleFields.dueDate && (
                          <td className="py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">
                            {task.dueDate || '12 Sep 2026'}
                          </td>
                        )}

                        {/* Actions */}
                        <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onSelectTask(task)}
                            className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {/* Inline Quick Add Task Row */}
                    <tr>
                      <td colSpan={6} className="py-2 px-4">
                        {quickInputGroup === group.id ? (
                          <form onSubmit={(e) => handleQuickSubmit(group.id, e)} className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Type task title and press Enter..."
                              value={quickTitle}
                              onChange={(e) => setQuickTitle(e.target.value)}
                              className="flex-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded px-2.5 py-1 text-xs outline-none focus:border-blue-500"
                              autoFocus
                            />
                            <button type="submit" className="text-xs bg-blue-600 text-white px-2.5 py-1 rounded font-semibold">
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={() => setQuickInputGroup(null)}
                              className="text-xs text-gray-400 hover:text-gray-600 px-1"
                            >
                              Cancel
                            </button>
                          </form>
                        ) : (
                          <button
                            onClick={() => {
                              setQuickInputGroup(group.id);
                              setQuickTitle('');
                            }}
                            className="text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center gap-1 font-medium"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Task</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
