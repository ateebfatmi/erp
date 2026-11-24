import React from 'react';
import { Library, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StudentLibraryManager } from '@/components/modules/library/student-library-manager';

export default function StudentLibraryPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Library className="h-5 w-5 text-indigo-600" />
            Digital Library & Reading Shelf
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track your borrowed books, manage 7-day renewals, and browse rack shelf locations across the central school catalog.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
            Automated Renewal & Fine Tracking
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <StudentLibraryManager />
    </div>
  );
}
