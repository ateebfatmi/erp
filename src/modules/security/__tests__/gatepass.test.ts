import { describe, it, expect } from 'vitest';
import {
  createVisitorPass,
  issueStudentEarlyGatepass,
  confirmStudentExit,
} from '../gatepass';

describe('VidyaOS Campus Security & Gatepass Engine', () => {
  it('creates and validates a visitor entry pass', () => {
    const pass = createVisitorPass({
      visitorName: 'Rajesh Kulkarni',
      visitorPhone: '+91 98110 99887',
      visitorType: 'PARENT',
      purpose: 'Meeting Class Teacher regarding Olympiad preparation',
      hostName: 'Ms. Priya Sen',
      hostDepartment: 'Mathematics Department',
      vehicleNumber: 'DL-3C-AS-4012',
    });

    expect(pass.status).toBe('CHECKED_IN');
    expect(pass.badgeNumber).toMatch(/^VIS-/);
    expect(pass.vehicleNumber).toBe('DL-3C-AS-4012');
  });

  it('rejects visitor passes with invalid phone numbers or names', () => {
    expect(() =>
      createVisitorPass({
        visitorName: 'A',
        visitorPhone: '123',
        visitorType: 'GUEST',
        purpose: 'Hi',
        hostName: 'Teacher',
        hostDepartment: 'Admin',
      })
    ).toThrow();
  });

  it('issues student early gatepass and validates security perimeter exit', () => {
    const gatepass = issueStudentEarlyGatepass({
      studentId: 'std-101',
      studentName: 'Aarav Mehta',
      gradeSection: 'Grade 10-A',
      admissionNo: 'DPS-2024-0412',
      reason: 'DOCTOR_APPOINTMENT',
      detailedCause: 'Pre-scheduled dental orthodontic appointment',
      guardianName: 'Sanjay Mehta',
      guardianRelation: 'Father',
      guardianPhone: '+91 98110 12345',
      authorizedByTeacher: 'Ms. Priya Sen',
      authorizedByPrincipal: true,
    });

    expect(gatepass.status).toBe('ISSUED_PENDING_EXIT');
    expect(gatepass.authorizedByPrincipal).toBe(true);

    const exited = confirmStudentExit(gatepass);
    expect(exited.status).toBe('EXITED_CAMPUS');
    expect(exited.actualExitTime).toBeDefined();

    // Cannot exit again
    expect(() => confirmStudentExit(exited)).toThrow();
  });
});
