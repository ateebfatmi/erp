import { describe, it, expect } from 'vitest';
import {
  evaluatePunctuality,
  processGatePunch,
  computeCampusMusterRoll,
  HardwarePunchEvent,
} from '../rfid-gate';

describe('Biometric RFID Turnstile & Gate Telemetry Engine', () => {
  it('correctly classifies punctuality based on school opening bell (08:00 AM)', () => {
    // 07:45 AM = On Time
    expect(evaluatePunctuality('2026-11-24T07:45:00', 'IN')).toBe('ON_TIME');

    // 08:00 AM = On Time
    expect(evaluatePunctuality('2026-11-24T08:00:00', 'IN')).toBe('ON_TIME');

    // 08:15 AM = Late
    expect(evaluatePunctuality('2026-11-24T08:15:00', 'IN')).toBe('LATE');

    // 08:45 AM = Very Late
    expect(evaluatePunctuality('2026-11-24T08:45:00', 'IN')).toBe('VERY_LATE');

    // Exit is always EXITED
    expect(evaluatePunctuality('2026-11-24T14:30:00', 'OUT')).toBe('EXITED');
  });

  it('rejects duplicate card taps within anti-passback window (3 minutes)', () => {
    const person = {
      id: 'stu-01',
      name: 'Aarav Mehta',
      type: 'student' as const,
      roleOrClass: 'Class 10A',
    };

    const firstTime = '2026-11-24T07:50:00.000Z';
    const firstPunch = processGatePunch(
      'GATE-01',
      'E2:80:68:5A',
      person,
      'IN',
      firstTime,
      []
    );

    expect(firstPunch.accepted).toBe(true);
    expect(firstPunch.event.isDuplicatePassback).toBe(false);

    // Second punch only 1 minute later with same badge
    const secondTime = '2026-11-24T07:51:00.000Z';
    const secondPunch = processGatePunch(
      'GATE-01',
      'E2:80:68:5A',
      person,
      'IN',
      secondTime,
      [firstPunch.event]
    );

    expect(secondPunch.accepted).toBe(false);
    expect(secondPunch.event.isDuplicatePassback).toBe(true);
    expect(secondPunch.rejectReason).toContain('Anti-Passback Block');
  });

  it('accurately computes live campus muster roll and evacuation headcount', () => {
    const samplePunches: HardwarePunchEvent[] = [
      // Student 1 entered
      {
        id: '1',
        machineId: 'G1',
        badgeUid: 'UID1',
        personId: 'stu-1',
        personName: 'Aarav',
        personType: 'student',
        roleOrClass: '10A',
        direction: 'IN',
        timestamp: '2026-11-24T07:45:00',
        punctualityStatus: 'ON_TIME',
        isDuplicatePassback: false,
      },
      // Student 2 entered
      {
        id: '2',
        machineId: 'G1',
        badgeUid: 'UID2',
        personId: 'stu-2',
        personName: 'Diya',
        personType: 'student',
        roleOrClass: '10B',
        direction: 'IN',
        timestamp: '2026-11-24T07:50:00',
        punctualityStatus: 'ON_TIME',
        isDuplicatePassback: false,
      },
      // Staff 1 entered
      {
        id: '3',
        machineId: 'G1',
        badgeUid: 'UID3',
        personId: 'emp-1',
        personName: 'Dr. Sharma',
        personType: 'staff',
        roleOrClass: 'Physics',
        direction: 'IN',
        timestamp: '2026-11-24T07:30:00',
        punctualityStatus: 'ON_TIME',
        isDuplicatePassback: false,
      },
      // Student 1 exited for medical appointment
      {
        id: '4',
        machineId: 'G1',
        badgeUid: 'UID1',
        personId: 'stu-1',
        personName: 'Aarav',
        personType: 'student',
        roleOrClass: '10A',
        direction: 'OUT',
        timestamp: '2026-11-24T11:00:00',
        punctualityStatus: 'EXITED',
        isDuplicatePassback: false,
      },
    ];

    const muster = computeCampusMusterRoll(samplePunches);
    // Student 2 inside, Staff 1 inside. Student 1 is OUT.
    expect(muster.studentsInside).toBe(1);
    expect(muster.staffInside).toBe(1);
    expect(muster.totalInside).toBe(2);
  });
});
