'use client';

import React, { useState } from 'react';
import { Search, SlidersHorizontal, List, LayoutGrid, Plus, X } from 'lucide-react';
import { FieldsDropdown } from './FieldsDropdown';

interface HeaderProps {
  viewMode: 'list' | 'board';
  onViewModeChange: (mode: 'list' | 'board') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAddTask: () => void;
}

export function Header({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  onOpenAddTask,
}: HeaderProps) {
  const [fieldsOpen, setFieldsOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  return (
    <header className="h-14 px-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 flex items-center justify-between z-10">
      {/* Title */}
      <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Tasks</h1>

      {/* Right Controls */}
      <div className="flex items-center gap-3 relative">
        {/* Search */}
        {showSearchInput ? (
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-md px-2 py-1 text-xs">
            <Search className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
            <input
              type="text"
              placeholder="Filter tasks..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 w-36 sm:w-48 text-xs"
              autoFocus
            />
            {searchQuery && (
              <button onClick={() => onSearchChange('')} className="text-gray-400 hover:text-gray-600">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowSearchInput(true)}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
            title="Search tasks"
          >
            <Search className="w-4 h-4" />
          </button>
        )}

        {/* Fields Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setFieldsOpen(!fieldsOpen)}
            className="flex items-center gap-1.5 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
            <span>Fields</span>
          </button>

          <FieldsDropdown isOpen={fieldsOpen} onClose={() => setFieldsOpen(false)} />
        </div>

        {/* List vs Board Toggle */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-0.5 rounded-md text-xs">
          <button
            onClick={() => onViewModeChange('list')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
              viewMode === 'list'
                ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-xs font-medium'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
          <button
            onClick={() => onViewModeChange('board')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
              viewMode === 'board'
                ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-xs font-medium'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Board</span>
          </button>
        </div>

        {/* + Add Task Button */}
        <button
          onClick={onOpenAddTask}
          className="flex items-center gap-1 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-semibold px-3 py-1.5 rounded-md text-xs shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      </div>
    </header>
  );
}
