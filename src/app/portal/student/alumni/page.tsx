import React from 'react';
import { GraduationCap, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StudentAlumniMentorship } from '@/components/modules/students/student-alumni-mentorship';

export default function StudentAlumniPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-600" />
            Distinguished Alumni Mentorship & Career Guidance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Connect 1:1 with school alumni studying at premier institutes (IITs, AIIMS, SRCC, NLSIU) and leading global organizations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            Alumni Mentorship Network
          </Badge>
        </div>
      </div>

      {/* Main Student Mentorship Desk */}
      <StudentAlumniMentorship />
    </div>
  );
}
