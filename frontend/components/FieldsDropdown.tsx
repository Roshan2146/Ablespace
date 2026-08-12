'use client';

import React from 'react';
import { useTheme } from '@/lib/theme';
import { VisibleFields } from '@/types';

interface FieldsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FieldsDropdown({ isOpen, onClose }: FieldsDropdownProps) {
  const { visibleFields, toggleField } = useTheme();

  if (!isOpen) return null;

  const fields: { key: keyof VisibleFields; label: string }[] = [
    { key: 'priority', label: 'Priority' },
    { key: 'members', label: 'Members' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'labels', label: 'Labels' },
    { key: 'status', label: 'Status' },
    { key: 'reporter', label: 'Reporter' },
  ];

  return (
    <div className="absolute right-0 top-11 w-48 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl py-2 z-50 text-sm">
      <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Visible Fields</div>
      <div className="mt-1 space-y-1">
        {fields.map((field) => (
          <label
            key={field.key}
            className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-700 dark:text-gray-300 text-xs select-none"
          >
            <input
              type="checkbox"
              checked={visibleFields[field.key]}
              onChange={() => toggleField(field.key)}
              className="rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
            />
            <span>{field.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
