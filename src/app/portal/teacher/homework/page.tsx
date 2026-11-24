import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Plus, Calendar, CheckCircle2 } from 'lucide-react';

export default function TeacherHomeworkPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Classroom Homework & Assignments
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create subject tasks, attach study materials, set deadlines, and grade student submissions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="p-4 border-b border-slate-200">
              <CardTitle className="text-sm font-semibold">Active Assignments — Class 10A</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 text-xs">
                <div className="p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">
                      Chapter 4: Quadratic Equations — Exercise 4.2 Problem Set
                    </span>
                    <Badge variant="warning">Due Tomorrow (25 Nov)</Badge>
                  </div>
                  <p className="text-slate-500">
                    Solve questions 1 through 10 from NCERT Textbook. Submit handwritten scans.
                  </p>
                  <div className="text-[11px] text-emerald-600 font-semibold pt-1">
                    32 / 38 Students Submitted
                  </div>
                </div>

                <div className="p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">
                      Arithmetic Progressions Word Problems
                    </span>
                    <Badge variant="success">Graded</Badge>
                  </div>
                  <p className="text-slate-500">
                    Application of nth term in real world scenarios.
                  </p>
                  <div className="text-[11px] text-slate-500 pt-1">
                    All 38 Submissions Graded & Feedback Shared with Parents
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Plus className="h-4 w-4 text-blue-600" />
                Assign New Homework
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Subject</label>
                <Input defaultValue="Mathematics Standard" readOnly className="text-xs bg-slate-50" />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Task Title *</label>
                <Input placeholder="e.g. Circle Theorems Proofs" className="text-xs" />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Due Date *</label>
                <Input type="date" defaultValue="2026-11-28" className="text-xs" />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Instructions</label>
                <textarea rows={3} placeholder="Provide instructions..." className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white" />
              </div>

              <div className="pt-2">
                <Button size="sm" className="w-full gap-1.5 bg-blue-600">
                  <CheckCircle2 className="h-4 w-4" /> Publish to Student & Parent Portals
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
