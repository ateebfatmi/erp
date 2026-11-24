import { describe, it, expect } from 'vitest';
import {
  initiateNoDuesApplication,
  updateDepartmentClearance,
  verifyTcEligibility,
} from '../no-dues';

describe('VidyaOS No Dues Clearance & TC Lock Engine', () => {
  it('initializes a 4-way multi-department clearance record in pending status', () => {
    const record = initiateNoDuesApplication({
      studentId: 'std-101',
      studentName: 'Aarav Mehta',
      admissionNo: 'DPS-2024-0412',
      gradeSection: 'Grade 10-A',
      fatherName: 'Sanjay Mehta',
      withdrawalReason: 'Parent transfer to Bengaluru',
    });

    expect(record.overallStatus).toBe('ACTION_REQUIRED_DUES_PENDING');
    expect(record.authorizedForTcGeneration).toBe(false);
    expect(record.departments.LIBRARY.status).toBe('PENDING_REVIEW');
    expect(record.departments.ACCOUNTS_FEES.status).toBe('PENDING_REVIEW');
  });

  it('blocks TC generation if any department reports dues or unreturned books', () => {
    let record = initiateNoDuesApplication({
      studentId: 'std-101',
      studentName: 'Aarav Mehta',
      admissionNo: 'DPS-2024-0412',
      gradeSection: 'Grade 10-A',
      fatherName: 'Sanjay Mehta',
      withdrawalReason: 'Parent transfer to Bengaluru',
    });

    // Library clear
    record = updateDepartmentClearance(record, 'LIBRARY', 'APPROVED_CLEAR');
    // Accounts blocked with unpaid Q4 tuition
    record = updateDepartmentClearance(record, 'ACCOUNTS_FEES', 'BLOCKED_WITH_DUES', 14500, [], 'Quarter 4 fee due');

    const eligibility = verifyTcEligibility(record);
    expect(eligibility.eligible).toBe(false);
    expect(eligibility.blockingReasons.some((r) => r.includes('Accounts & Fee Bursar'))).toBe(true);
    expect(record.authorizedForTcGeneration).toBe(false);
  });

  it('unlocks TC generation when all 4 departments approve clearance', () => {
    let record = initiateNoDuesApplication({
      studentId: 'std-101',
      studentName: 'Aarav Mehta',
      admissionNo: 'DPS-2024-0412',
      gradeSection: 'Grade 10-A',
      fatherName: 'Sanjay Mehta',
      withdrawalReason: 'Parent transfer to Bengaluru',
    });

    record = updateDepartmentClearance(record, 'LIBRARY', 'APPROVED_CLEAR');
    record = updateDepartmentClearance(record, 'ACCOUNTS_FEES', 'APPROVED_CLEAR');
    record = updateDepartmentClearance(record, 'LABORATORIES', 'APPROVED_CLEAR');
    record = updateDepartmentClearance(record, 'SPORTS_HOSTEL', 'APPROVED_CLEAR');

    const eligibility = verifyTcEligibility(record);
    expect(eligibility.eligible).toBe(true);
    expect(eligibility.blockingReasons).toHaveLength(0);
    expect(record.overallStatus).toBe('CLEARED_READY_FOR_TC');
    expect(record.authorizedForTcGeneration).toBe(true);
    expect(record.tcCertificateNumber).toMatch(/^TC-CBSE-/);
  });
});
