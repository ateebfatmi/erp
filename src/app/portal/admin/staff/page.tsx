import React from 'react';
import { repository } from '@/lib/database/repository';
import { getVerifiedAuthContext } from '@/lib/auth/session';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, UserPlus, Mail, Phone, Calendar, ShieldCheck } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default async function StaffPage() {
  const auth = await getVerifiedAuthContext();
  const employees = await repository.getEmployees(auth.tenantId);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-indigo-600" />
            Staff & HRIS Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Faculty employment records, designations, Indian statutory payroll, and leave allotments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">
            {employees.length} Active Employees
          </Badge>
        </div>
      </div>

      {/* Staff Table */}
      <Card>
        <CardHeader className="p-4 border-b border-slate-200 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold">
            Certified Teaching & Administrative Faculty
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-2.5 px-3">Emp Code</th>
                  <th className="py-2.5 px-3">Faculty Name</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Designation</th>
                  <th className="py-2.5 px-3">Joining Date</th>
                  <th className="py-2.5 px-3">Monthly Basic</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-blue-600">
                      {emp.employee_code}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">
                        {emp.full_name}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {emp.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {emp.phone}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">
                      {emp.department_name}
                    </td>
                    <td className="py-3 px-3 text-slate-800">
                      {emp.designation_name}
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {formatDate(emp.joining_date)}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {formatCurrency(emp.basic_salary)}
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="success">Active</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
