import { describe, it, expect } from 'vitest';
import {
  calculateLeaveDays,
  validateLeaveRequest,
  processLeaveDecision,
  checkExamEligibility,
  LeaveRequest,
} from '../leave';

describe('VidyaOS Leave & Attendance Workflow Engine', () => {
  it('calculates working leave days excluding Sundays', () => {
    // 2024-11-18 is Monday, 2024-11-23 is Saturday (6 days)
    const daysMonToSat = calculateLeaveDays('2024-11-18', '2024-11-23');
    expect(daysMonToSat).toBe(6);

    // Monday through following Monday (8 calendar days, 1 Sunday) = 7 days
    const daysMonToNextMon = calculateLeaveDays('2024-11-18', '2024-11-25');
    expect(daysMonToNextMon).toBe(7);

    // Half-day check
    const halfDay = calculateLeaveDays('2024-11-18', '2024-11-18', true);
    expect(halfDay).toBe(0.5);
  });

  it('validates leave application payload properly', () => {
    const invalidDates = validateLeaveRequest({
      startDate: '2024-11-20',
      endDate: '2024-11-15', // End before start
      leaveType: 'CASUAL',
      reason: 'Attending family wedding ceremony',
    });
    expect(invalidDates.valid).toBe(false);
    expect(invalidDates.errors).toContain('Start date cannot be after end date');

    const shortReason = validateLeaveRequest({
      startDate: '2024-11-20',
      endDate: '2024-11-21',
      leaveType: 'CASUAL',
      reason: 'Hi', // Too short
    });
    expect(shortReason.valid).toBe(false);

    const validApp = validateLeaveRequest({
      startDate: '2024-11-20',
      endDate: '2024-11-22',
      leaveType: 'MEDICAL',
      reason: 'Suffering from viral fever and throat infection',
    });
    expect(validApp.valid).toBe(true);
  });

  it('handles teacher approval and rejection transitions', () => {
    const initialRequest: LeaveRequest = {
      id: 'lv-01',
      studentId: 'std-101',
      studentName: 'Aarav Sharma',
      gradeSection: 'Grade 10-A',
      rollNo: '14',
      leaveType: 'MEDICAL',
      startDate: '2024-11-20',
      endDate: '2024-11-22',
      isHalfDay: false,
      totalDays: 3,
      reason: 'High fever and viral infection',
      parentContact: '+91 98110 00000',
      status: 'PENDING',
      appliedAt: '2024-11-19T08:00:00Z',
    };

    const approved = processLeaveDecision(initialRequest, 'APPROVE', 'Granted with rest recommendation');
    expect(approved.status).toBe('APPROVED');
    expect(approved.teacherRemarks).toBe('Granted with rest recommendation');
    expect(approved.decidedAt).toBeDefined();

    const rejected = processLeaveDecision(initialRequest, 'REJECT', 'Exam revision test scheduled');
    expect(rejected.status).toBe('REJECTED');
    expect(rejected.teacherRemarks).toBe('Exam revision test scheduled');
  });

  it('enforces CBSE Rule 13 (75% compulsory attendance)', () => {
    // 160 present out of 200 days = 80% (Eligible)
    const eligibleResult = checkExamEligibility(200, 160);
    expect(eligibleResult.effectiveAttendancePercent).toBe(80);
    expect(eligibleResult.isEligibleForCbseExams).toBe(true);
    expect(eligibleResult.shortfallDays).toBe(0);

    // 140 present out of 200 days = 70% (< 75% -> Ineligible without medical condonation)
    const borderlineResult = checkExamEligibility(200, 140, 10, false);
    expect(borderlineResult.effectiveAttendancePercent).toBe(70);
    expect(borderlineResult.isEligibleForCbseExams).toBe(false);
    expect(borderlineResult.shortfallDays).toBe(10); // Needs 150 (75%) -> shortfall = 10 days

    // With medical certificate condonation (minimum drops to 60%)
    const condonedResult = checkExamEligibility(200, 140, 10, true);
    expect(condonedResult.isEligibleForCbseExams).toBe(true);
  });
});
