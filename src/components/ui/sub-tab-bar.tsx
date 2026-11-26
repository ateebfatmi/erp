'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SubTabItem {
  id: string;
  label: string;
  icon?: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
}

interface SubTabBarProps {
  tabs: SubTabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: 'underline' | 'pills';
}

export function SubTabBar({
  tabs,
  activeTab,
  onChange,
  className,
  variant = 'underline',
}: SubTabBarProps) {
  if (variant === 'pills') {
    return (
      <div
        className={cn(
          'flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl overflow-x-auto select-none border border-slate-200/60 scrollbar-none',
          className
        )}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer',
                isActive
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              )}
            >
              {Icon && (
                <Icon
                  className={cn(
                    'h-3.5 w-3.5 shrink-0 transition-colors',
                    isActive ? 'text-blue-600' : 'text-slate-400'
                  )}
                />
              )}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none',
                    tab.badgeColor ||
                      (isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-200 text-slate-600')
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Default 'underline' variant with horizontal border
  return (
    <div
      className={cn(
        'flex items-center gap-2 border-b border-slate-200 overflow-x-auto select-none scrollbar-none',
        className
      )}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 pb-2.5 pt-1 px-3 text-xs font-semibold border-b-2 transition-all shrink-0 cursor-pointer',
              isActive
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            )}
          >
            {Icon && (
              <Icon
                className={cn(
                  'h-3.5 w-3.5 shrink-0 transition-colors',
                  isActive ? 'text-blue-600' : 'text-slate-400'
                )}
              />
            )}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none',
                  tab.badgeColor ||
                    (isActive
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-600')
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
