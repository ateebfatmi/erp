import { describe, it, expect } from 'vitest';
import {
  generateCbseAdmitCard,
  verifyAdmitCardRelease,
  SAMPLE_CLASS_10_SUBJECTS,
  INITIAL_ADMIT_CARD,
} from '../admit-card';

describe('CBSE Board Examination Admit Card Engine', () => {
  it('should compile an authorized Admit Card when attendance >= 75% and no dues cleared', () => {
    const card = generateCbseAdmitCard({
      rollNumber: '21309841',
      locRegistrationNumber: 'A/1/25/70842/0142',
      candidateName: 'Aarav Mehta',
      motherName: 'Sunita Mehta',
      fatherName: 'Rajesh Mehta',
      gender: 'MALE',
      gradeClass: 'Class 10',
      attendancePercentage: 88.5,
      noDuesCleared: true,
      subjects: SAMPLE_CLASS_10_SUBJECTS,
    });

    expect(card.status).toBe('GENERATED_VERIFIED');
    expect(card.isAttendanceQualified).toBe(true);
    expect(card.admitCardSerial).toContain('CBSE-AC/2025/21309841');
    expect(card.subjects.length).toBe(5);

    const check = verifyAdmitCardRelease(card);
    expect(check.canDownload).toBe(true);
  });

  it('should hold the admit card when student attendance is below 75% per CBSE Rule 13', () => {
    const heldCard = generateCbseAdmitCard({
      rollNumber: '21309999',
      locRegistrationNumber: 'A/1/25/70842/0999',
      candidateName: 'Shortage Student',
      motherName: 'Mother',
      fatherName: 'Father',
      gender: 'MALE',
      gradeClass: 'Class 12',
      attendancePercentage: 68.2, // Below 75%
      noDuesCleared: true,
      subjects: SAMPLE_CLASS_10_SUBJECTS,
    });

    expect(heldCard.status).toBe('HELD_ATTENDANCE_SHORTAGE');
    expect(heldCard.isAttendanceQualified).toBe(false);

    const check = verifyAdmitCardRelease(heldCard);
    expect(check.canDownload).toBe(false);
    expect(check.blockingReason).toContain('CBSE Rule 13 Attendance Shortage');
  });

  it('should hold the admit card when fee dues are outstanding', () => {
    const feeHeldCard = generateCbseAdmitCard({
      rollNumber: '21308888',
      locRegistrationNumber: 'A/1/25/70842/0888',
      candidateName: 'Fee Due Student',
      motherName: 'Mother',
      fatherName: 'Father',
      gender: 'FEMALE',
      gradeClass: 'Class 10',
      attendancePercentage: 82.0,
      noDuesCleared: false, // Dues unpaid
      subjects: SAMPLE_CLASS_10_SUBJECTS,
    });

    expect(feeHeldCard.status).toBe('HELD_FEE_DUES');
    const check = verifyAdmitCardRelease(feeHeldCard);
    expect(check.canDownload).toBe(false);
    expect(check.blockingReason).toContain('Outstanding Fee Dues');
  });
});
