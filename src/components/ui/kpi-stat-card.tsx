'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface KpiStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ElementType;
  iconColorClass?: string;
  iconBgClass?: string;
  badge?: string;
  badgeVariant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function KpiStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColorClass = 'text-blue-600',
  iconBgClass = 'bg-blue-50',
  badge,
  badgeVariant = 'default',
  className,
}: KpiStatCardProps) {
  const getBadgeClass = () => {
    switch (badgeVariant) {
      case 'success':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'warning':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'danger':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <Card className={cn('border-slate-200 shadow-xs hover:border-slate-300 transition-all', className)}>
      <CardContent className="p-4 flex items-center gap-3.5">
        {Icon && (
          <div
            className={cn(
              'h-11 w-11 rounded-xl flex items-center justify-center shrink-0 shadow-2xs',
              iconBgClass,
              iconColorClass
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">
            {title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight truncate">
              {value}
            </h3>
            {badge && (
              <Badge className={cn('text-[10px] px-1.5 py-0.2 shrink-0', getBadgeClass())}>
                {badge}
              </Badge>
            )}
          </div>
          {subtitle && (
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
