import { describe, it, expect } from 'vitest';
import {
  calculateFacultyLeaveBalance,
  findFreeTeachersForPeriod,
  generateAutomatedSubstitutions,
  FACULTY_ROSTER,
  MOCK_TIMETABLE_SLOTS,
  FacultyLeaveApplication,
} from '../substitution';

describe('Faculty Leave Ledger & Automated Period Substitution Engine', () => {
  it('calculates remaining faculty leave balances across 7th CPC statutory quotas', () => {
    const approvedLeaves: FacultyLeaveApplication[] = [
      {
        id: 'lv-01',
        teacherId: 'tch-01',
        teacherName: 'Smt. Ananya Sen',
        leaveType: 'CASUAL_LEAVE',
        startDate: '2024-11-20',
        endDate: '2024-11-21', // 2 days
        reason: 'Family wedding function',
        status: 'APPROVED',
        appliedAt: '2024-11-15',
      },
      {
        id: 'lv-02',
        teacherId: 'tch-01',
        teacherName: 'Smt. Ananya Sen',
        leaveType: 'MEDICAL_LEAVE',
        startDate: '2024-10-01',
        endDate: '2024-10-03', // 3 days
        reason: 'Viral fever and bronchitis',
        status: 'APPROVED',
        appliedAt: '2024-09-30',
      },
      {
        id: 'lv-03',
        teacherId: 'tch-01',
        teacherName: 'Smt. Ananya Sen',
        leaveType: 'CASUAL_LEAVE',
        startDate: '2024-11-28',
        endDate: '2024-11-28',
        reason: 'Personal work',
        status: 'REJECTED', // Rejected leave should not deduct balance
        appliedAt: '2024-11-25',
      },
    ];

    const balances = calculateFacultyLeaveBalance(approvedLeaves);

    // Casual Leave: 8 allocated - 2 used = 6 remaining
    expect(balances.CASUAL_LEAVE.allocated).toBe(8);
    expect(balances.CASUAL_LEAVE.used).toBe(2);
    expect(balances.CASUAL_LEAVE.remaining).toBe(6);

    // Medical Leave: 20 allocated - 3 used = 17 remaining
    expect(balances.MEDICAL_LEAVE.allocated).toBe(20);
    expect(balances.MEDICAL_LEAVE.used).toBe(3);
    expect(balances.MEDICAL_LEAVE.remaining).toBe(17);

    // Earned Leave: 0 used = 12 remaining
    expect(balances.EARNED_LEAVE.used).toBe(0);
    expect(balances.EARNED_LEAVE.remaining).toBe(12);
  });

  it('detects completely free teachers during a target lecture period', () => {
    // Period 1 on MONDAY:
    // Smt. Ananya Sen (tch-01) is teaching Math in 10-A
    // Dr. V. K. Saxena (tch-03) is teaching Chem in 12-A
    // Free teachers: Dr. R. Ramanujan (tch-02), Ms. Clara D’Souza (tch-04), Shri Vikram Rathore (tch-05), Smt. Kavita Sharma (tch-06)
    const freeTeachers = findFreeTeachersForPeriod(
      FACULTY_ROSTER,
      MOCK_TIMETABLE_SLOTS,
      'MONDAY',
      1,
      ['tch-01'] // absent teacher
    );

    const freeIds = freeTeachers.map((t) => t.id);
    expect(freeIds).not.toContain('tch-01'); // absent
    expect(freeIds).not.toContain('tch-03'); // busy teaching Chemistry in 12-A
    expect(freeIds).toContain('tch-02'); // free Physics teacher
    expect(freeIds).toContain('tch-06'); // free Maths teacher
  });

  it('generates automated substitution arrangements with subject prioritization', () => {
    // Smt. Ananya Sen (Maths teacher, tch-01) is absent on MONDAY
    // Scheduled periods: Period 1, Period 3, Period 5
    const absent = [{ id: 'tch-01', name: 'Smt. Ananya Sen' }];

    const orders = generateAutomatedSubstitutions(
      absent,
      '2024-11-25',
      'MONDAY',
      MOCK_TIMETABLE_SLOTS,
      FACULTY_ROSTER
    );

    expect(orders.length).toBe(3); // 3 periods substituted

    // Verify all 3 periods were addressed
    const periods = orders.map((o) => o.periodNo);
    expect(periods).toContain(1);
    expect(periods).toContain(3);
    expect(periods).toContain(5);

    // For Period 1: Smt. Kavita Sharma (tch-06, Maths TGT) is free and teaches Maths!
    const period1Order = orders.find((o) => o.periodNo === 1);
    expect(period1Order).toBeDefined();
    expect(period1Order?.substituteTeacherId).toBe('tch-06');
    expect(period1Order?.notes).toContain('Subject Specialist');
  });
});
