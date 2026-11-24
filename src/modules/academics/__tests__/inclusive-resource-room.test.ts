import { describe, it, expect } from 'vitest';
import {
  evaluateResourceRoomCompliance,
  toggleEquipmentAssignment,
  INITIAL_SPECIALISTS,
  INITIAL_EQUIPMENT,
  INITIAL_THERAPY_SESSIONS,
  AlliedSpecialist,
  SensoryEquipment,
} from '../inclusive-resource-room';

describe('CBSE Multi-Disciplinary Resource Room Engine', () => {
  it('evaluates resource room statutory compliance score and grade', () => {
    const report = evaluateResourceRoomCompliance(
      INITIAL_SPECIALISTS,
      INITIAL_EQUIPMENT,
      INITIAL_THERAPY_SESSIONS
    );

    expect(report.rciSpecialistStaffed).toBe(true);
    expect(report.accessibleInfrastructureVerified).toBe(true);
    expect(report.sensoryEquipmentAvailabilityRate).toBe(100);
    expect(report.overallComplianceScore).toBeGreaterThanOrEqual(80);
    expect(['A_EXEMPLARY', 'B_COMPLIANT']).toContain(report.complianceGrade);
  });

  it('detects statutory non-compliance if RCI registered educator is missing', () => {
    const nonRciStaff: AlliedSpecialist[] = [
      {
        id: 'SPEC-X',
        name: 'Tutor Only',
        role: 'REMEDIAL_ACADEMIC_TUTOR',
        qualification: 'B.A.',
        contactEmail: 'tutor@test.com',
        availableDays: ['Mon'],
        maxDailyCaseload: 5,
        currentCaseload: 2,
        isFullTime: false,
      },
    ];

    const report = evaluateResourceRoomCompliance(nonRciStaff, [], []);
    expect(report.rciSpecialistStaffed).toBe(false);
    expect(report.statutoryGaps.some((g) => g.includes('RCI-certified'))).toBe(true);
    expect(report.complianceGrade).toBe('C_DEFICIT');
  });

  it('toggles equipment checkout and checkin with sanitization log update', () => {
    const initialList: SensoryEquipment[] = [
      {
        id: 'EQ-TEST',
        name: 'Weighted Lap Pad',
        category: 'SENSORY_REGULATION',
        serialNumber: 'SN-001',
        storageLocation: 'Shelf 1',
        status: 'AVAILABLE',
        lastSanitizedAt: '2026-11-01',
        targetAccommodations: ['Focus'],
      },
    ];

    // Check out to student
    const checkedOut = toggleEquipmentAssignment(
      initialList,
      'EQ-TEST',
      'STU-101',
      'Kabir Mehta'
    );
    expect(checkedOut[0].status).toBe('IN_USE');
    expect(checkedOut[0].assignedStudentId).toBe('STU-101');
    expect(checkedOut[0].assignedStudentName).toBe('Kabir Mehta');

    // Check back in
    const returned = toggleEquipmentAssignment(checkedOut, 'EQ-TEST');
    expect(returned[0].status).toBe('AVAILABLE');
    expect(returned[0].assignedStudentId).toBeUndefined();
    expect(returned[0].assignedStudentName).toBeUndefined();
  });
});
