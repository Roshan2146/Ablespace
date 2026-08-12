'use client';

import React from 'react';
import { Task } from '@/types';
import { PriorityBadge } from './PriorityBadge';
import { Plus, Calendar, Tag, MoreHorizontal } from 'lucide-react';

interface TaskBoardProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onOpenAddTask: () => void;
}

export function TaskBoard({ tasks, onSelectTask, onOpenAddTask }: TaskBoardProps) {
  const columns = [
    { id: 'TODO', title: 'To Do' },
    { id: 'IN_PROGRESS', title: 'In Progress' },
    { id: 'COMPLETED', title: 'Completed' },
  ];

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => (t.status || 'TODO') === col.id);

        return (
          <div key={col.id} className="bg-gray-50/70 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 rounded-xl p-4 space-y-3">
            {/* Column Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-gray-900 dark:text-white">{col.title}</span>
                <span className="px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-800 text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                  {colTasks.length}
                </span>
              </div>

              <button
                onClick={onOpenAddTask}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 transition-colors"
                title="Add task to column"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Column Cards Container */}
            <div className="space-y-3">
              {colTasks.length > 0 ? (
                colTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
                  >
                    {/* Header: Title & Priority */}
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-xs text-gray-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {task.title}
                      </h4>
                      <PriorityBadge priority={task.priority} showText={true} />
                    </div>

                    {/* Description preview */}
                    {task.description && (
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    {/* Category Label Tags */}
                    {task.labels && task.labels.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {task.labels.map((lbl, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-[10px] font-medium text-gray-600 dark:text-gray-300"
                          >
                            {lbl}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer: Member Avatar & Due Date */}
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-[10px] font-bold">
                          {(task.members?.[0] || 'D')[0]}
                        </div>
                        <span className="text-gray-600 dark:text-gray-300 font-medium">
                          {task.members?.[0] || 'Dexter'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span>{task.dueDate || '12 Sep 2026'}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-400">
                  No tasks in {col.title}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
