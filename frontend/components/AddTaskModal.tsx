'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createTask } from '@/lib/api';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
}

export function AddTaskModal({ isOpen, onClose, onTaskCreated }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('TODO');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState('12 Sep 2026');
  const [selectedLabels, setSelectedLabels] = useState<string[]>(['Design']);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const availableLabels = ['Research', 'Design', 'Development', 'Testing', 'Deployment'];

  const toggleLabel = (label: string) => {
    if (selectedLabels.includes(label)) {
      setSelectedLabels(selectedLabels.filter((l) => l !== label));
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await createTask({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        dueDate,
        labels: selectedLabels,
        members: ['Dexter'],
        reporter: 'Dexter',
      });
      setTitle('');
      setDescription('');
      onTaskCreated();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Create New Task</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Build User Dashboard"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Add details about this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Status & Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">Doing / In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="NO_PRIORITY">No Priority</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
            <input
              type="text"
              placeholder="e.g. 15 Sep 2026"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Labels */}
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Labels</label>
            <div className="flex flex-wrap gap-1.5">
              {availableLabels.map((lbl) => {
                const isSelected = selectedLabels.includes(lbl);
                return (
                  <button
                    type="button"
                    key={lbl}
                    onClick={() => toggleLabel(lbl)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                      isSelected
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {lbl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 flex items-center justify-end gap-2 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 shadow-xs transition-colors"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
