import React from 'react';
import { repository } from '@/lib/database/repository';
import { getVerifiedAuthContext } from '@/lib/auth/session';
import { calculateSalaryBreakdown } from '@/modules/payroll/calculator';
import { UnifiedStaffHub } from '@/components/modules/staff/unified-staff-hub';

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
    <UnifiedStaffHub
      initialTab="directory"
      employees={employees as any}
      payrollStats={payrollStats}
    />
  );
}
