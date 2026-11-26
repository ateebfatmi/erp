'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  Clock,
  Sparkles,
  GraduationCap,
  Landmark,
  DollarSign,
  Wallet,
  Mail,
  Phone,
  Download,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { SubTabBar, SubTabItem } from '@/components/ui/sub-tab-bar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, DataTableColumn } from '@/components/ui/data-table';
import { formatCurrency } from '@/lib/utils';
import { calculateSalaryBreakdown } from '@/modules/payroll/calculator';
import { StaffAttendanceManager } from '@/components/modules/staff/staff-attendance-manager';
import { SubstitutionManager } from '@/components/modules/academics/substitution-manager';
import { TeacherCpdManager } from '@/components/modules/staff/teacher-cpd-manager';

export type StaffTabId = 'directory' | 'attendance' | 'substitution' | 'cpd';

export interface EmployeeRecord {
  id: string;
  employee_code: string;
  full_name: string;
  email: string;
  phone: string;
  department_name: string;
  designation_name: string;
  basic_salary: number;
}

interface UnifiedStaffHubProps {
  initialTab?: StaffTabId;
  employees?: EmployeeRecord[];
  payrollStats?: {
    gross: number;
    deductions: number;
    net: number;
  };
}

export function UnifiedStaffHub({
  initialTab = 'directory',
  employees = [
    {
      id: 'emp-101',
      employee_code: 'EMP-001',
      full_name: 'Dr. Ramesh Sharma',
      email: 'r.sharma@vidyaos.edu.in',
      phone: '+91 98765 43210',
      department_name: 'Science & Robotics',
      designation_name: 'Head of Department / PGT Physics',
      basic_salary: 65000,
    },
    {
      id: 'emp-102',
      employee_code: 'EMP-002',
      full_name: 'Sunita Rao',
      email: 's.rao@vidyaos.edu.in',
      phone: '+91 98765 43211',
      department_name: 'Mathematics',
      designation_name: 'TGT Mathematics',
      basic_salary: 48000,
    },
    {
      id: 'emp-103',
      employee_code: 'EMP-003',
      full_name: 'Vikramaditya Singh',
      email: 'v.singh@vidyaos.edu.in',
      phone: '+91 98765 43212',
      department_name: 'Social Sciences',
      designation_name: 'PGT History & Civics',
      basic_salary: 52000,
    },
  ],
  payrollStats: initialPayrollStats,
}: UnifiedStaffHubProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Compute aggregate stats if not provided
  const computedPayrollStats = React.useMemo(() => {
    if (initialPayrollStats) return initialPayrollStats;
    return employees.reduce(
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
  }, [employees, initialPayrollStats]);

  const tabs: SubTabItem[] = [
    {
      id: 'directory',
      label: 'Faculty Directory & Payroll',
      icon: Briefcase,
      badge: `${employees.length} Staff`,
    },
    {
      id: 'attendance',
      label: 'Biometric Muster Roll',
      icon: Clock,
      badge: 'Muster',
    },
    {
      id: 'substitution',
      label: 'Daily Arrangement & Substitution',
      icon: Sparkles,
      badge: 'Auto Resolver',
    },
    {
      id: 'cpd',
      label: '50-Hr Teacher CPD Tracker',
      icon: GraduationCap,
      badge: 'CBSE Mandate',
    },
  ];

  // DataTable columns for faculty directory
  const directoryColumns: DataTableColumn<EmployeeRecord>[] = [
    {
      key: 'employee_code',
      header: 'Emp Code',
      sortable: true,
      render: (row) => (
        <span className="font-mono font-bold text-indigo-600 text-xs">{row.employee_code}</span>
      ),
    },
    {
      key: 'full_name',
      header: 'Faculty Member',
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-900">{row.full_name}</div>
          <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3 text-slate-400" /> {row.email}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3 text-slate-400" /> {row.phone}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'department_name',
      header: 'Department',
      sortable: true,
      render: (row) => <span className="font-medium text-slate-700">{row.department_name}</span>,
    },
    {
      key: 'designation_name',
      header: 'Designation',
      sortable: true,
      render: (row) => <span className="text-slate-800 text-xs">{row.designation_name}</span>,
    },
    {
      key: 'basic_salary',
      header: 'Basic Pay',
      align: 'right',
      sortable: true,
      sortValue: (row) => row.basic_salary,
      render: (row) => (
        <span className="font-mono font-medium text-slate-700">
          {formatCurrency(row.basic_salary)}
        </span>
      ),
    },
    {
      key: 'gross_salary',
      header: 'Gross Salary',
      align: 'right',
      sortable: true,
      sortValue: (row) => calculateSalaryBreakdown(row.basic_salary).grossSalary,
      render: (row) => {
        const b = calculateSalaryBreakdown(row.basic_salary);
        return (
          <span className="font-mono font-semibold text-slate-900">
            {formatCurrency(b.grossSalary)}
          </span>
        );
      },
    },
    {
      key: 'net_salary',
      header: 'Net Disbursed',
      align: 'right',
      sortable: true,
      sortValue: (row) => calculateSalaryBreakdown(row.basic_salary).netSalary,
      render: (row) => {
        const b = calculateSalaryBreakdown(row.basic_salary);
        return (
          <span className="font-mono font-bold text-emerald-700">
            {formatCurrency(b.netSalary)}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      sortable: false,
      render: (row) => (
        <a href={`/api/documents/salary-slip/${row.id}`} target="_blank" rel="noopener noreferrer">
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2.5 text-[11px] gap-1 text-slate-700 hover:text-indigo-600 hover:border-indigo-300"
          >
            <Download className="h-3 w-3 text-indigo-600" />
            Payslip PDF
          </Button>
        </a>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="h-6 w-6 text-indigo-600" />
              Faculty HRIS & Academic Staff Management Suite
            </h1>
            <Badge variant="success" className="text-[11px]">
              {employees.length} Certified Faculty Members
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            Integrated staff operations: manage employment records, statutory Indian payroll (EPFO, ESIC, TDS),
            biometric punch muster rolls, automated daily period substitutions, and CBSE 50-hour teacher CPD compliance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs bg-slate-50 border-slate-300 text-slate-700">
            <ShieldCheck className="h-3.5 w-3.5 mr-1 text-emerald-600" />
            EPFO / ESIC Compliant
          </Badge>
        </div>
      </div>

      {/* Unified Tab Strip */}
      <SubTabBar
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
        className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm"
      />

      {/* Tab 1: Faculty Directory & Payroll */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          {/* Monthly Payroll Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Landmark className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                    Gross Monthly Payroll
                  </p>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">
                    {formatCurrency(computedPayrollStats.gross)}
                  </p>
                  <p className="text-[10px] text-slate-400">Basic + HRA + DA + Allowances</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                    Statutory Deductions
                  </p>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">
                    {formatCurrency(computedPayrollStats.deductions)}
                  </p>
                  <p className="text-[10px] text-slate-400">EPF (12%) + ESI + PT + TDS</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Wallet className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                    Net Monthly Disbursed
                  </p>
                  <p className="text-lg font-bold text-emerald-700 mt-0.5">
                    {formatCurrency(computedPayrollStats.net)}
                  </p>
                  <p className="text-[10px] text-slate-400">Direct Bank ACH / NEFT Deposit</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interactive DataTable */}
          <DataTable
            data={employees}
            columns={directoryColumns}
            rowKey="id"
            searchPlaceholder="Search by faculty name, employee code, department, or designation..."
            exportCsvFilename="faculty_payroll_register"
            paginated={true}
            pageSize={10}
            selectable={false}
          />
        </div>
      )}

      {/* Tab 2: Biometric Muster Roll */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl text-xs text-indigo-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-600 shrink-0" />
              <span>
                <strong>Biometric Attendance Terminal & Muster Roll:</strong> Real-time hardware punch capture, geofenced mobile verification, and monthly pay-muster generation.
              </span>
            </div>
            <Badge className="bg-indigo-600 text-white text-[10px]">Real-Time Sync</Badge>
          </div>
          <StaffAttendanceManager viewMode="admin" />
        </div>
      )}

      {/* Tab 3: Daily Arrangement & Substitution */}
      {activeTab === 'substitution' && (
        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl text-xs text-purple-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600 shrink-0" />
              <span>
                <strong>Period Arrangement Resolver:</strong> Algorithmic workload balancer detecting teacher leave and auto-assigning free subject teachers.
              </span>
            </div>
            <Badge className="bg-purple-600 text-white text-[10px]">Conflict-Free</Badge>
          </div>
          <SubstitutionManager role="admin" />
        </div>
      )}

      {/* Tab 4: 50-Hr Teacher CPD Tracker */}
      {activeTab === 'cpd' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                <strong>NEP 2020 Clause 5.15 Compliance:</strong> Mandatory 50 hours of Continuous Professional Development per academic calendar year.
              </span>
            </div>
            <Badge className="bg-emerald-600 text-white text-[10px]">Statutory Audit</Badge>
          </div>
          <TeacherCpdManager role="admin" />
        </div>
      )}
    </div>
  );
}
