import { describe, it, expect } from 'vitest';
import {
  evaluatePunchPunctuality,
  calculateHaversineDistanceMeters,
  verifyCampusGeofence,
  processStaffPunch,
  compileStaffMusterRoll,
  INITIAL_STAFF_ATTENDANCE_LOGS,
  StaffAttendanceRecord,
} from '../biometric-attendance';

describe('Faculty & Staff Daily Biometric Attendance & Muster Engine', () => {
  it('correctly classifies on-time arrival within 10-minute grace period', () => {
    // Shift starts 07:45, grace until 07:55
    const punct1 = evaluatePunchPunctuality('07:40');
    expect(punct1.status).toBe('PRESENT_ON_TIME');
    expect(punct1.lateMinutes).toBe(0);
    expect(punct1.arrangementRequired).toBe(false);

    const punctGrace = evaluatePunchPunctuality('07:53');
    expect(punctGrace.status).toBe('PRESENT_ON_TIME');
    expect(punctGrace.lateMinutes).toBe(0);
  });

  it('flags late arrival between 07:56 and 08:15 AM without immediate arrangement', () => {
    const late = evaluatePunchPunctuality('08:05');
    expect(late.status).toBe('LATE_ARRIVAL');
    expect(late.lateMinutes).toBe(20);
    expect(late.arrangementRequired).toBe(false);
  });

  it('enforces half-day deduction and flags period arrangement when arriving after 08:15 AM', () => {
    const halfDay = evaluatePunchPunctuality('08:25');
    expect(halfDay.status).toBe('HALF_DAY_LATE');
    expect(halfDay.lateMinutes).toBe(40);
    expect(halfDay.arrangementRequired).toBe(true);
  });

  it('validates campus geofence proximity correctly using Haversine distance', () => {
    // Within 200m (e.g. 50m offset)
    const inside = verifyCampusGeofence(28.5702, 77.1903, 28.5700, 77.1900, 200);
    expect(inside.isWithinGeofence).toBe(true);
    expect(inside.distanceMeters).toBeLessThan(100);

    // Far away (> 1 km away)
    const outside = verifyCampusGeofence(28.5850, 77.2100, 28.5700, 77.1900, 200);
    expect(outside.isWithinGeofence).toBe(false);
    expect(outside.distanceMeters).toBeGreaterThan(1000);
  });

  it('processes punch successfully and rejects out-of-boundary mobile geofence clock-ins', () => {
    const validPunch = processStaffPunch({
      staffId: 'EMP-001',
      staffName: 'Dr. Ramesh Sharma',
      department: 'Science',
      designation: 'PGT',
      date: '2026-04-06',
      punchTime24: '07:44',
      terminalType: 'BIOMETRIC_THUMB',
    });
    expect(validPunch.status).toBe('PRESENT_ON_TIME');

    // Reject out of geofence
    expect(() =>
      processStaffPunch({
        staffId: 'EMP-002',
        staffName: 'Mrs. Sunita Kaul',
        department: 'Math',
        designation: 'TGT',
        date: '2026-04-06',
        punchTime24: '07:50',
        terminalType: 'MOBILE_GEOFENCE',
        gpsCoords: { lat: 28.6200, lng: 77.3000 }, // 10 km away
      })
    ).toThrow('Punch rejected: Location is');
  });

  it('compiles monthly muster roll and enforces 3-Late = 1 CL deduction rule', () => {
    const staffList = [{ staffId: 'EMP-002', staffName: 'Mrs. Sunita Kaul', department: 'Mathematics' }];
    const records: StaffAttendanceRecord[] = [
      {
        id: 'r1',
        staffId: 'EMP-002',
        staffName: 'Mrs. Sunita Kaul',
        department: 'Mathematics',
        designation: 'TGT',
        date: '2026-04-01',
        punchInTime: '08:05',
        terminalType: 'BIOMETRIC_THUMB',
        status: 'LATE_ARRIVAL',
        geofenceVerified: true,
        lateMinutes: 20,
        arrangementRequired: false,
      },
      {
        id: 'r2',
        staffId: 'EMP-002',
        staffName: 'Mrs. Sunita Kaul',
        department: 'Mathematics',
        designation: 'TGT',
        date: '2026-04-02',
        punchInTime: '08:03',
        terminalType: 'BIOMETRIC_THUMB',
        status: 'LATE_ARRIVAL',
        geofenceVerified: true,
        lateMinutes: 18,
        arrangementRequired: false,
      },
      {
        id: 'r3',
        staffId: 'EMP-002',
        staffName: 'Mrs. Sunita Kaul',
        department: 'Mathematics',
        designation: 'TGT',
        date: '2026-04-03',
        punchInTime: '08:08',
        terminalType: 'BIOMETRIC_THUMB',
        status: 'LATE_ARRIVAL',
        geofenceVerified: true,
        lateMinutes: 23,
        arrangementRequired: false,
      },
      {
        id: 'r4',
        staffId: 'EMP-002',
        staffName: 'Mrs. Sunita Kaul',
        department: 'Mathematics',
        designation: 'TGT',
        date: '2026-04-04',
        punchInTime: '07:44',
        terminalType: 'BIOMETRIC_THUMB',
        status: 'PRESENT_ON_TIME',
        geofenceVerified: true,
        lateMinutes: 0,
        arrangementRequired: false,
      },
    ];

    const muster = compileStaffMusterRoll(staffList, records, '2026-04', 24);
    expect(muster[0].lateArrivalsCount).toBe(3);
    // 3 late arrivals = 0.5 CL deduction
    expect(muster[0].statutoryClDeductions).toBe(0.5);
    // 3 late + 1 on-time = 4 days - 0.5 CL deduction = 3.5 net payable days
    expect(muster[0].netPayableDays).toBe(3.5);
  });
});
