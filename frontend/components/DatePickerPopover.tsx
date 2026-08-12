'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (dateStr: string) => void;
  selectedDate?: string;
}

export function DatePickerPopover({
  isOpen,
  onClose,
  onSelectDate,
  selectedDate,
}: DatePickerPopoverProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 15)); // Default Jan 2026 matching Figma

  if (!isOpen) return null;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Generate days for grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const handleSelectDay = (day: number) => {
    const formattedMonth = monthNames[month].substring(0, 3);
    const dateString = `${day} ${formattedMonth} ${year}`;
    onSelectDate(dateString);
    onClose();
  };

  return (
    <div className="absolute right-0 top-10 w-64 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl p-4 z-50 text-xs">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="font-semibold text-gray-900 dark:text-white">
          {monthNames[month]} {year}
        </div>
        <button onClick={nextMonth} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 text-center font-medium text-gray-400 mb-2">
        <span>Su</span>
        <span>Mo</span>
        <span>Tu</span>
        <span>We</span>
        <span>Th</span>
        <span>Fr</span>
        <span>Sa</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} />;
          }

          const isSelected = selectedDate?.includes(day.toString()) && selectedDate?.includes(monthNames[month].substring(0, 3));

          return (
            <button
              key={`day-${day}`}
              onClick={() => handleSelectDay(day)}
              className={`h-7 w-7 rounded-full flex items-center justify-center transition-colors text-xs font-medium ${
                isSelected
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-bold'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
