import React from 'react';
import { repository } from '@/lib/database/repository';
import { getVerifiedAuthContext } from '@/lib/auth/session';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, UserPlus, Mail, Phone, Calendar, ShieldCheck, FileText, Download, Landmark, DollarSign, Wallet } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { calculateSalaryBreakdown } from '@/modules/payroll/calculator';

export default async function StaffPage() {
  const auth = await getVerifiedAuthContext();
  const employees = await repository.getEmployees(auth.tenantId);

  // Compute aggregate payroll statistics
  const payrollStats = employees.reduce(
    (acc, emp) => {
      const b = calculateSalaryBreakdown(emp.basic_salary);
      return {
        gross: acc.gross + b.grossSalary,
        deductions: acc.deductions + b.totalDeductions,
        net: acc.net + b.netSalary,
      };
    },
    { gross: 0, deductions: 0, net: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-indigo-600" />
            Staff & HRIS Directory — Payroll Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Faculty employment records, designations, Indian statutory payroll (EPF, ESI, TDS), and payslip generation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">
            {employees.length} Certified Faculty Members
          </Badge>
          <Badge variant="outline">EPFO / ESIC Compliant</Badge>
        </div>
      </div>

      {/* Monthly Payroll Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Landmark className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Gross Monthly Payroll</p>
              <p className="text-lg font-bold text-slate-900 mt-0.5">{formatCurrency(payrollStats.gross)}</p>
              <p className="text-[10px] text-slate-400">Basic + HRA + DA + Allowances</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Statutory Deductions</p>
              <p className="text-lg font-bold text-slate-900 mt-0.5">{formatCurrency(payrollStats.deductions)}</p>
              <p className="text-[10px] text-slate-400">EPF (12%) + ESI + PT + TDS</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Net Monthly Disbursed</p>
              <p className="text-lg font-bold text-emerald-700 mt-0.5">{formatCurrency(payrollStats.net)}</p>
              <p className="text-[10px] text-slate-400">Direct Bank ACH Deposit</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Table */}
      <Card>
        <CardHeader className="p-4 border-b border-slate-200 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold">
            Certified Teaching & Administrative Faculty Payroll
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
                  <th className="py-2.5 px-3">Basic Pay</th>
                  <th className="py-2.5 px-3">Gross Salary</th>
                  <th className="py-2.5 px-3">Net Take-Home</th>
                  <th className="py-2.5 px-3 text-right">Payslip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp) => {
                  const b = calculateSalaryBreakdown(emp.basic_salary);
                  return (
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
                      <td className="py-3 px-3 font-medium text-slate-700">
                        {formatCurrency(emp.basic_salary)}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        {formatCurrency(b.grossSalary)}
                      </td>
                      <td className="py-3 px-3 font-bold text-emerald-700">
                        {formatCurrency(b.netSalary)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <a href={`/api/documents/salary-slip/${emp.id}`} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="h-7 px-2 text-[11px] gap-1 text-slate-700 hover:text-indigo-600 hover:border-indigo-300">
                            <Download className="h-3 w-3 text-indigo-600" /> Payslip PDF
                          </Button>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
