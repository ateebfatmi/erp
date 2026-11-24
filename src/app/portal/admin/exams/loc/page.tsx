import React from 'react';
import { ShieldCheck, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BoardLOCManager } from '@/components/modules/assessment/board-loc-manager';

export default function AdminBoardLOCPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            CBSE Board List of Candidates (LOC) & Pariksha Sangam Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pre-submission audit for Class 10 & 12 Board examinations: validate UDISE+ PEN, Aadhar, mutually exclusive subjects (Math 041/241), photo date stamps, and statutory exam fee liability.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            Pariksha Sangam Ready
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <BoardLOCManager />
    </div>
  );
}
