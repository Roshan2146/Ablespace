'use client';

import React, { useState } from 'react';
import { useTheme } from '@/lib/theme';
import { ColorTheme, ThemeMode } from '@/types';
import {
  CheckSquare,
  Folder,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  Moon,
  Sun,
  Palette,
  Settings,
  LogOut,
  UserCheck,
} from 'lucide-react';

interface SidebarProps {
  currentView: 'tasks' | 'projects';
  onNavigate: (view: 'tasks' | 'projects') => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ currentView, onNavigate, collapsed, onToggleCollapse }: SidebarProps) {
  const { themeMode, colorTheme, setThemeMode, setColorTheme, guestUser, logoutGuest, loginAsGuest } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<'none' | 'theme' | 'color'>('none');

  const themes: { id: ColorTheme; label: string; bg: string }[] = [
    { id: 'amber', label: 'Amber', bg: 'bg-amber-500' },
    { id: 'blue', label: 'Blue', bg: 'bg-blue-500' },
    { id: 'violet', label: 'Violet', bg: 'bg-purple-500' },
    { id: 'rose', label: 'Rose', bg: 'bg-rose-500' },
    { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-500' },
    { id: 'slate', label: 'Slate', bg: 'bg-slate-600' },
  ];

  return (
    <aside
      className={`h-screen border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 transition-all duration-300 flex flex-col z-20 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Workspace Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        {!collapsed && (
          <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white text-sm">
            <div className="w-6 h-6 rounded bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
              D
            </div>
            <span>Dexter</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav Items */}
      <div className="flex-1 py-4 px-2 space-y-1">
        <button
          onClick={() => onNavigate('tasks')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            currentView === 'tasks'
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <CheckSquare className="w-4 h-4 text-gray-500" />
          {!collapsed && <span>Tasks</span>}
        </button>

        <button
          onClick={() => onNavigate('projects')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            currentView === 'projects'
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <Folder className="w-4 h-4 text-gray-500" />
          {!collapsed && <span>Projects</span>}
        </button>
      </div>

      {/* User Profile Footer & Popovers */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800 relative">
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
            {guestUser?.name?.[0] || 'D'}
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <div className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                {guestUser?.name || 'Guest User'}
              </div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                {guestUser?.email || 'dexter@gmail.com'}
              </div>
            </div>
          )}
        </button>

        {/* User Settings Popover Dropdown matching Figma design */}
        {userMenuOpen && (
          <div className="absolute bottom-16 left-3 w-56 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl py-2 z-50 text-sm">
            <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                D
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">{guestUser?.name || 'Dexter'}</div>
                <div className="text-xs text-gray-500 truncate">{guestUser?.email || 'dexter@gmail.com'}</div>
              </div>
            </div>

            {/* Change Theme Option */}
            <div className="relative">
              <button
                onClick={() => setActiveSubMenu(activeSubMenu === 'theme' ? 'none' : 'theme')}
                className="w-full px-3 py-2 flex items-center justify-between text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <span className="flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  Change Theme
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              {activeSubMenu === 'theme' && (
                <div className="absolute left-full top-0 ml-1 w-36 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl py-1 z-50">
                  <div className="px-3 py-1 text-xs font-semibold text-gray-400">Theme Mode</div>
                  <button
                    onClick={() => setThemeMode('light')}
                    className={`w-full px-3 py-1.5 flex items-center justify-between text-xs ${
                      themeMode === 'light' ? 'bg-gray-100 dark:bg-gray-800 font-semibold text-blue-600' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>Light</span>
                    {themeMode === 'light' && '✓'}
                  </button>
                  <button
                    onClick={() => setThemeMode('dark')}
                    className={`w-full px-3 py-1.5 flex items-center justify-between text-xs ${
                      themeMode === 'dark' ? 'bg-gray-100 dark:bg-gray-800 font-semibold text-blue-600' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>Dark</span>
                    {themeMode === 'dark' && '✓'}
                  </button>
                </div>
              )}
            </div>

            {/* Color Mode Option */}
            <div className="relative">
              <button
                onClick={() => setActiveSubMenu(activeSubMenu === 'color' ? 'none' : 'color')}
                className="w-full px-3 py-2 flex items-center justify-between text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <span className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Color Mode
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              {activeSubMenu === 'color' && (
                <div className="absolute left-full top-0 ml-1 w-40 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl py-1 z-50">
                  <div className="px-3 py-1 text-xs font-semibold text-gray-400">Color Theme</div>
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setColorTheme(t.id)}
                      className={`w-full px-3 py-1.5 flex items-center justify-between text-xs hover:bg-gray-100 dark:hover:bg-gray-800 ${
                        colorTheme === t.id ? 'font-semibold text-blue-600' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded ${t.bg}`} />
                        {t.label}
                      </span>
                      {colorTheme === t.id && '✓'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="w-full px-3 py-2 flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Settings className="w-4 h-4" />
              Settings
            </button>

            <div className="border-t border-gray-100 dark:border-gray-800 my-1" />

            <button
              onClick={logoutGuest}
              className="w-full px-3 py-2 flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
