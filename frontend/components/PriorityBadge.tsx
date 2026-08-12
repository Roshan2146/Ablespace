import React from 'react';
import { TaskPriority } from '@/types';

interface PriorityBadgeProps {
  priority: TaskPriority | string;
  showText?: boolean;
  size?: 'sm' | 'md';
}

export function PriorityBadge({ priority, showText = true, size = 'sm' }: PriorityBadgeProps) {
  const p = (priority || 'NO_PRIORITY').toUpperCase();

  const getBadgeStyle = () => {
    switch (p) {
      case 'URGENT':
        return {
          text: 'Urgent',
          textColor: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-950/40',
          bars: 4,
          barColor: 'bg-red-500',
        };
      case 'HIGH':
        return {
          text: 'High',
          textColor: 'text-red-500 dark:text-red-400',
          bgColor: 'bg-red-50/50 dark:bg-red-950/30',
          bars: 3,
          barColor: 'bg-red-500',
        };
      case 'MEDIUM':
        return {
          text: 'Medium',
          textColor: 'text-amber-600 dark:text-amber-400',
          bgColor: 'bg-amber-50/50 dark:bg-amber-950/30',
          bars: 2,
          barColor: 'bg-amber-500',
        };
      case 'LOW':
        return {
          text: 'Low',
          textColor: 'text-gray-500 dark:text-gray-400',
          bgColor: 'bg-gray-50 dark:bg-gray-800',
          bars: 1,
          barColor: 'bg-gray-400',
        };
      default:
        return {
          text: 'No Priority',
          textColor: 'text-gray-400 dark:text-gray-500',
          bgColor: 'bg-transparent',
          bars: 0,
          barColor: 'bg-gray-300',
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${style.bgColor} ${style.textColor}`}>
      <span className="flex items-end gap-0.5 h-3">
        {[1, 2, 3, 4].map((bar) => (
          <span
            key={bar}
            className={`w-0.5 rounded-full ${
              bar <= style.bars ? style.barColor : 'bg-gray-200 dark:bg-gray-700'
            }`}
            style={{ height: `${bar * 25}%` }}
          />
        ))}
      </span>
      {showText && <span>{style.text}</span>}
    </div>
  );
}
