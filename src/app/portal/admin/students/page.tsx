import React from 'react';
import { repository } from '@/lib/database/repository';
import { getVerifiedAuthContext } from '@/lib/auth/session';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, UserPlus, Search, Download, FileText, CheckCircle2 } from 'lucide-react';
import { createStudentAction } from '@/modules/students/actions';
import { formatDate } from '@/lib/utils';

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; classId?: string }>;
}) {
  const auth = await getVerifiedAuthContext();
  const resolvedParams = await searchParams;
  const classes = await repository.getClasses(auth.tenantId);
  const sections = await repository.getSections(auth.tenantId);
  const campuses = await repository.getCampuses(auth.tenantId);
  const enrollments = await repository.getEnrollments(auth.tenantId, {
    search: resolvedParams.search,
    classId: resolvedParams.classId,
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Student Information System (SIS)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain permanent student identities, enrollments, roll numbers, and academic history.
          </p>
        </div>

        {/* Admission Form Trigger / Summary */}
        <div className="flex items-center gap-2">
          <Badge variant="success">
            {enrollments.length} Active Students
          </Badge>
        </div>
      </div>

      {/* Main Grid: Directory + Admission Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Directory Table (2 spans) */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="p-4 border-b border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by name, admission no, or roll no..."
                    defaultValue={resolvedParams.search || ''}
                    className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <Download className="h-3.5 w-3.5" /> Export CBSE CSV
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="py-2.5 px-3">Adm No</th>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">Class & Sec</th>
                      <th className="py-2.5 px-3">Roll No</th>
                      <th className="py-2.5 px-3">Gender</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {enrollments.map((enr) => (
                      <tr key={enr.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-mono font-medium text-blue-600">
                          {enr.student?.admission_number}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900">
                            {enr.student?.full_name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            DOB: {formatDate(enr.student?.dob || '')} &bull; Blood: {enr.student?.blood_group || 'N/A'}
                          </div>
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-700">
                          {enr.class_name} - {enr.section_name}
                        </td>
                        <td className="py-3 px-3 font-mono">
                          #{enr.roll_number || 'N/A'}
                        </td>
                        <td className="py-3 px-3 capitalize text-slate-600">
                          {enr.student?.gender}
                        </td>
                        <td className="py-3 px-3">
                          <Badge variant="success">Active</Badge>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px] gap-1 text-blue-600">
                            <FileText className="h-3 w-3" /> Profile
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real Student Admission Form */}
        <div>
          <Card>
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-blue-600" />
                Admit New Student
              </CardTitle>
              <p className="text-xs text-slate-500">
                Directly provisions student identity, enrollment, and fee ledger.
              </p>
            </CardHeader>
            <CardContent className="pt-4">
              <form
                action={async (formData) => {
                  'use server';
                  await createStudentAction(formData);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <Input
                    name="fullName"
                    required
                    placeholder="e.g. Yashvardhan Singhania"
                    className="text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Admission Number *
                    </label>
                    <Input
                      name="admissionNumber"
                      required
                      placeholder="DPGA/2026/1201"
                      className="text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Date of Birth *
                    </label>
                    <Input
                      name="dob"
                      type="date"
                      required
                      defaultValue="2012-05-18"
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Gender *
                    </label>
                    <select
                      name="gender"
                      required
                      className="w-full text-xs h-9 px-3 border border-slate-200 rounded-lg bg-white text-slate-900"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Campus *
                    </label>
                    <select
                      name="campusId"
                      required
                      className="w-full text-xs h-9 px-3 border border-slate-200 rounded-lg bg-white text-slate-900"
                    >
                      {campuses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.code}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Class Standard *
                    </label>
                    <select
                      name="classId"
                      required
                      className="w-full text-xs h-9 px-3 border border-slate-200 rounded-lg bg-white text-slate-900"
                    >
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Section *
                    </label>
                    <select
                      name="sectionId"
                      required
                      className="w-full text-xs h-9 px-3 border border-slate-200 rounded-lg bg-white text-slate-900"
                    >
                      {sections.map((sec) => (
                        <option key={sec.id} value={sec.id}>
                          Section {sec.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" size="sm" className="w-full gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Complete Admission</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
