'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Download,
  GraduationCap,
  Sparkles,
  UserCheck,
  TrendingUp,
  FileText,
  Star,
} from 'lucide-react';
import {
  StudentReportSummary,
  calculateCumulativeCGPA,
} from '@/modules/assessment/cbse-grading';

interface Props {
  role?: 'parent' | 'student';
}

export function CbseReportCardView({ role = 'student' }: Props) {
  const [activeTerm, setActiveTerm] = useState<'ANNUAL' | 'TERM_1'>('ANNUAL');

  const scholasticResults = [
    { code: '184', subject: 'English Language & Literature', pt: 4.5, ma: 4.5, pf: 4.5, se: 4.5, ia: 18, theory: 72, total: 90, grade: 'A2', gp: 9.0 },
    { code: '002', subject: 'Hindi Course-A', pt: 4.0, ma: 4.5, pf: 4.5, se: 5.0, ia: 18, theory: 70, total: 88, grade: 'A2', gp: 9.0 },
    { code: '041', subject: 'Mathematics Standard', pt: 5.0, ma: 5.0, pf: 5.0, se: 5.0, ia: 20, theory: 75, total: 95, grade: 'A1', gp: 10.0 },
    { code: '086', subject: 'Science (Theory & Practical)', pt: 4.0, ma: 4.0, pf: 4.0, se: 4.0, ia: 16, theory: 65, total: 81, grade: 'A2', gp: 9.0 },
    { code: '087', subject: 'Social Science', pt: 4.5, ma: 4.5, pf: 4.5, se: 4.5, ia: 18, theory: 68, total: 86, grade: 'A2', gp: 9.0 },
    { code: '402', subject: 'Information Technology (Skill Subject)', pt: 5.0, ma: 5.0, pf: 5.0, se: 5.0, ia: 20, theory: 76, total: 96, grade: 'A1', gp: 10.0 },
  ];

  const coScholastic = [
    { area: 'Work Education (Pre-Vocational)', grade: 'A', descriptor: 'Outstanding initiative in mechanical craft & computational design' },
    { area: 'Art Education (Visual & Performing)', grade: 'A', descriptor: 'Expressive creativity in Indian classical music and sketching' },
    { area: 'Health & Physical Education (Sports)', grade: 'A', descriptor: 'Active team participation in inter-school basketball and athletics' },
    { area: 'Discipline & General Conduct', grade: 'A', descriptor: 'Exemplary punctuality, values, and respectful classroom demeanor' },
  ];

  // CGPA calculation on top 5 main academic subjects
  const top5 = scholasticResults.slice(0, 5);
  const totalGP = top5.reduce((sum, s) => sum + s.gp, 0);
  const cgpa = (totalGP / 5).toFixed(2);
  const indicativePct = (parseFloat(cgpa) * 9.5).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-700 rounded-xl">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Aarav Mehta</h2>
              <Badge variant="success" className="text-[10px]">
                Promoted to Grade 11
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Roll No: <span className="font-semibold text-slate-800">14</span> &bull; Adm No: <span className="font-mono text-slate-800">DPS-2024-0412</span> &bull; CBSE Affiliation: <span className="font-mono text-slate-800">2130842</span>
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Class & Section: <span className="font-bold text-slate-900">Grade 10-A</span> &bull; Academic Session: <span className="font-semibold text-slate-800">2024-2025</span> &bull; Attendance: <span className="font-bold text-emerald-700">94.1%</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a href="/api/documents/report-card/aarav" target="_blank" rel="noreferrer">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-9 gap-2 shadow-xs cursor-pointer">
              <Download className="h-4 w-4" />
              <span>Download Official CBSE Report Card (PDF)</span>
            </Button>
          </a>
        </div>
      </div>

      {/* Cumulative Score Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-indigo-200 bg-indigo-50/20 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-lg">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Cumulative GPA (CGPA)</p>
              <p className="text-2xl font-black text-indigo-950">{cgpa} / 10.0</p>
              <p className="text-[10px] text-indigo-700 font-semibold">Grade Point Average</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Indicative Percentage</p>
              <p className="text-2xl font-bold text-slate-900">{indicativePct}%</p>
              <p className="text-[10px] text-slate-500">Official CBSE Formula (CGPA × 9.5)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Class Standing</p>
              <p className="text-2xl font-bold text-slate-900">Rank #3</p>
              <p className="text-[10px] text-slate-500">Top 5th Percentile in Section 10-A</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Qualifying Status</p>
              <p className="text-lg font-bold text-emerald-600">Passed with Distinction</p>
              <p className="text-[10px] text-slate-500">All 6 Subjects Cleared (No Compartment)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Part 1: Scholastic Areas */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-indigo-600" />
              Part 1: Scholastic Performance (CBSE 9-Point Scale)
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Evaluation incorporates Internal Assessment (20 Marks) and Annual Board Examination (80 Marks).
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            Class 10 Board Standards
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="py-2.5 px-3">Subject Code & Name</th>
                  <th className="py-2.5 px-3 text-center">PT (5)</th>
                  <th className="py-2.5 px-3 text-center">MA (5)</th>
                  <th className="py-2.5 px-3 text-center">Port (5)</th>
                  <th className="py-2.5 px-3 text-center">SE (5)</th>
                  <th className="py-2.5 px-3 text-center font-bold text-blue-900 bg-blue-50/50">IA (/20)</th>
                  <th className="py-2.5 px-3 text-center">Theory (/80)</th>
                  <th className="py-2.5 px-3 text-center font-bold text-slate-900">Total (/100)</th>
                  <th className="py-2.5 px-3 text-center">Grade</th>
                  <th className="py-2.5 px-3 text-center">Grade Point</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {scholasticResults.map((s) => (
                  <tr key={s.code} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-900">{s.subject}</span>
                      <span className="text-[10px] font-mono text-slate-400 block">Code: {s.code}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-600">{s.pt}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-600">{s.ma}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-600">{s.pf}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-600">{s.se}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-blue-700 bg-blue-50/30">{s.ia}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-800">{s.theory}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-900 text-sm">{s.total}</td>
                    <td className="py-3 px-3 text-center">
                      <Badge variant="success" className="font-mono text-[10px]">
                        {s.grade}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-indigo-700">
                      {s.gp.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Part 2: Co-Scholastic Activities */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="p-4 border-b border-slate-100">
          <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" />
            Part 2: Co-Scholastic & Life Skills Evaluation (5-Point Scale A-E)
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Holistic assessment covering vocational arts, health, physical education, and moral discipline.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="py-2.5 px-3">Evaluation Area</th>
                  <th className="py-2.5 px-3">Descriptive Indicator / Teacher Observation</th>
                  <th className="py-2.5 px-3 text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {coScholastic.map((item) => (
                  <tr key={item.area} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900">{item.area}</td>
                    <td className="py-3 px-3 text-slate-600">{item.descriptor}</td>
                    <td className="py-3 px-3 text-center">
                      <Badge variant="outline" className="font-bold text-amber-800 bg-amber-50 border-amber-200">
                        {item.grade} (Outstanding)
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Teacher & Principal Remarks */}
      <Card className="border-slate-200 shadow-xs bg-slate-50/50">
        <CardContent className="p-4 flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-1">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Class Teacher&apos;s Remarks</p>
            <p className="text-xs text-slate-800 italic">
              &ldquo;Aarav has shown commendable intellectual discipline throughout the session. His critical reasoning in Mathematics and exemplary performance in laboratory science distinguish his academic profile.&rdquo;
            </p>
            <p className="text-[11px] text-slate-500 font-semibold pt-1">— Ms. Priya Sen (M.Sc., B.Ed.)</p>
          </div>
          <div className="flex-1 space-y-1 border-t md:border-t-0 md:border-l border-slate-200 md:pl-6 pt-3 md:pt-0">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Principal&apos;s Endorsement</p>
            <p className="text-xs text-slate-800 italic">
              &ldquo;Promoted to Senior Secondary Grade 11 with Science stream honors. Keep nurturing the spirit of inquiry and excellence.&rdquo;
            </p>
            <p className="text-[11px] text-slate-500 font-semibold pt-1">— Dr. Rajeshwar Sharma (Principal)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
