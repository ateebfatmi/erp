/**
 * Faculty & Staff Daily Biometric Attendance, Geofenced Clock-in & Muster Engine
 * Implements standard Indian institutional service and CBSE staff rules:
 * - Reporting shift: 07:45 AM - 02:15 PM
 * - Grace period: 10 minutes (up to 07:55 AM on-time)
 * - Late arrival: 07:56 AM - 08:15 AM (Flagged for 3-Late = 1 CL deduction)
 * - Beyond 08:15 AM: Half-day penalty and instant duty arrangement alert
 * - Geofence validation (within 200m of campus perimeter)
 */

export type PunchType = 'IN' | 'OUT';
export type TerminalType = 'BIOMETRIC_THUMB' | 'FACIAL_RECOGNITION' | 'MOBILE_GEOFENCE' | 'MANUAL_ADMIN';
export type AttendanceStatus =
  | 'PRESENT_ON_TIME'
  | 'LATE_ARRIVAL'
  | 'HALF_DAY_LATE'
  | 'ON_DUTY_OD'
  | 'CASUAL_LEAVE'
  | 'MEDICAL_LEAVE'
  | 'ABSENT';

export interface StaffAttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  designation: string;
  date: string; // YYYY-MM-DD
  punchInTime?: string; // HH:MM AM/PM
  punchOutTime?: string; // HH:MM AM/PM
  terminalType: TerminalType;
  status: AttendanceStatus;
  geofenceVerified: boolean;
  distanceMetersFromCampus?: number;
  lateMinutes: number;
  arrangementRequired: boolean;
  remarks?: string;
}

export interface StaffMusterSummary {
  staffId: string;
  staffName: string;
  department: string;
  month: string;
  totalWorkingDays: number;
  presentDays: number;
  lateArrivalsCount: number;
  halfDaysCount: number;
  approvedLeavesCount: number;
  absentDaysCount: number;
  statutoryClDeductions: number;
  netPayableDays: number;
}

/**
 * Calculates distance in meters between two lat/lng coordinates using the Haversine formula
 */
export function calculateHaversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Validates geofence coordinates against institutional campus coordinates
 */
export function verifyCampusGeofence(
  staffLat: number,
  staffLng: number,
  campusLat = 28.5700,
  campusLng = 77.1900,
  maxRadiusMeters = 200
): { isWithinGeofence: boolean; distanceMeters: number } {
  const distanceMeters = calculateHaversineDistanceMeters(staffLat, staffLng, campusLat, campusLng);
  return {
    isWithinGeofence: distanceMeters <= maxRadiusMeters,
    distanceMeters,
  };
}

/**
 * Evaluates shift punctuality and determines late status or half-day deduction
 */
export function evaluatePunchPunctuality(
  punchInTime24: string, // e.g. "07:50", "08:05", "08:30"
  shiftStartTime24 = '07:45',
  graceMinutes = 10,
  halfDayCutoff24 = '08:15'
): { status: AttendanceStatus; lateMinutes: number; arrangementRequired: boolean } {
  const [inH, inM] = punchInTime24.split(':').map(Number);
  const [shiftH, shiftM] = shiftStartTime24.split(':').map(Number);
  const [cutoffH, cutoffM] = halfDayCutoff24.split(':').map(Number);

  const punchMinutes = inH * 60 + inM;
  const shiftMinutes = shiftH * 60 + shiftM;
  const cutoffMinutes = cutoffH * 60 + cutoffM;
  const graceThreshold = shiftMinutes + graceMinutes;

  if (punchMinutes <= graceThreshold) {
    return {
      status: 'PRESENT_ON_TIME',
      lateMinutes: 0,
      arrangementRequired: false,
    };
  } else if (punchMinutes <= cutoffMinutes) {
    return {
      status: 'LATE_ARRIVAL',
      lateMinutes: punchMinutes - shiftMinutes,
      arrangementRequired: false,
    };
  } else {
    return {
      status: 'HALF_DAY_LATE',
      lateMinutes: punchMinutes - shiftMinutes,
      arrangementRequired: true, // Needs immediate substitute teacher dispatch
    };
  }
}

/**
 * Processes a staff clock-in punch and records verification
 */
export function processStaffPunch(params: {
  staffId: string;
  staffName: string;
  department: string;
  designation: string;
  date: string;
  punchTime24: string;
  terminalType: TerminalType;
  gpsCoords?: { lat: number; lng: number };
}): StaffAttendanceRecord {
  let geofenceVerified = true;
  let distanceMeters: number | undefined;

  if (params.terminalType === 'MOBILE_GEOFENCE') {
    if (!params.gpsCoords) {
      throw new Error('GPS coordinates required for mobile geofence punch');
    }
    const geo = verifyCampusGeofence(params.gpsCoords.lat, params.gpsCoords.lng);
    geofenceVerified = geo.isWithinGeofence;
    distanceMeters = geo.distanceMeters;

    if (!geofenceVerified) {
      throw new Error(
        `Punch rejected: Location is ${distanceMeters}m away from school campus (Max permitted: 200m)`
      );
    }
  }

  const { status, lateMinutes, arrangementRequired } = evaluatePunchPunctuality(
    params.punchTime24
  );

  return {
    id: `ATT-STF-${Date.now().toString().slice(-6)}`,
    staffId: params.staffId,
    staffName: params.staffName,
    department: params.department,
    designation: params.designation,
    date: params.date,
    punchInTime: params.punchTime24,
    terminalType: params.terminalType,
    status,
    geofenceVerified,
    distanceMetersFromCampus: distanceMeters,
    lateMinutes,
    arrangementRequired,
    remarks:
      status === 'HALF_DAY_LATE'
        ? 'Late arrival past 08:15 AM - Half-day deduction and period substitution triggered'
        : status === 'LATE_ARRIVAL'
        ? `Late arrival by ${lateMinutes} minutes`
        : 'Punctual morning arrival',
  };
}

/**
 * Compiles monthly muster roll and calculates statutory 3-Late = 1 CL leave deduction
 */
export function compileStaffMusterRoll(
  staffList: Array<{ staffId: string; staffName: string; department: string }>,
  records: StaffAttendanceRecord[],
  month = '2026-04',
  totalWorkingDays = 24
): StaffMusterSummary[] {
  return staffList.map((staff) => {
    const staffRecords = records.filter(
      (r) => r.staffId === staff.staffId && r.date.startsWith(month)
    );

    let onTimeCount = 0;
    let lateCount = 0;
    let halfDayCount = 0;
    let leaveCount = 0;
    let absentCount = 0;

    for (const r of staffRecords) {
      if (r.status === 'PRESENT_ON_TIME') onTimeCount++;
      else if (r.status === 'LATE_ARRIVAL') lateCount++;
      else if (r.status === 'HALF_DAY_LATE') halfDayCount++;
      else if (r.status === 'CASUAL_LEAVE' || r.status === 'MEDICAL_LEAVE' || r.status === 'ON_DUTY_OD') leaveCount++;
      else if (r.status === 'ABSENT') absentCount++;
    }

    const presentDays = onTimeCount + lateCount + halfDayCount * 0.5;

    // Rule: Every 3 late marks = 0.5 day Casual Leave forfeiture
    const statutoryClDeductions = Math.floor(lateCount / 3) * 0.5;

    // Net payable days
    const netPayableDays = Math.max(
      0,
      presentDays + leaveCount - statutoryClDeductions
    );

    return {
      staffId: staff.staffId,
      staffName: staff.staffName,
      department: staff.department,
      month,
      totalWorkingDays,
      presentDays,
      lateArrivalsCount: lateCount,
      halfDaysCount: halfDayCount,
      approvedLeavesCount: leaveCount,
      absentDaysCount: absentCount,
      statutoryClDeductions,
      netPayableDays,
    };
  });
}

/**
 * Pre-seeded Daily Staff Biometric Attendance Records
 */
export const INITIAL_STAFF_ATTENDANCE_LOGS: StaffAttendanceRecord[] = [
  {
    id: 'ATT-STF-001',
    staffId: 'EMP-001',
    staffName: 'Dr. Ramesh Sharma',
    department: 'Science (Physics)',
    designation: 'PGT Senior Teacher',
    date: '2026-04-06',
    punchInTime: '07:42',
    terminalType: 'BIOMETRIC_THUMB',
    status: 'PRESENT_ON_TIME',
    geofenceVerified: true,
    lateMinutes: 0,
    arrangementRequired: false,
    remarks: 'Punctual morning arrival',
  },
  {
    id: 'ATT-STF-002',
    staffId: 'EMP-002',
    staffName: 'Mrs. Sunita Kaul',
    department: 'Mathematics',
    designation: 'TGT Mathematics',
    date: '2026-04-06',
    punchInTime: '08:04',
    terminalType: 'MOBILE_GEOFENCE',
    status: 'LATE_ARRIVAL',
    geofenceVerified: true,
    distanceMetersFromCampus: 45,
    lateMinutes: 19,
    arrangementRequired: false,
    remarks: 'Late arrival by 19 minutes (Outer Ring Road traffic)',
  },
  {
    id: 'ATT-STF-003',
    staffId: 'EMP-003',
    staffName: 'Mr. Arvind Saxena',
    department: 'Social Science',
    designation: 'TGT History',
    date: '2026-04-06',
    punchInTime: '08:28',
    terminalType: 'FACIAL_RECOGNITION',
    status: 'HALF_DAY_LATE',
    geofenceVerified: true,
    lateMinutes: 43,
    arrangementRequired: true,
    remarks: 'Arrived after 08:15 AM - Half-day deduction & Class 9B History substitution alerted',
  },
  {
    id: 'ATT-STF-004',
    staffId: 'EMP-004',
    staffName: 'Ms. Pooja Bhatia',
    department: 'Computer Science',
    designation: 'PGT Informatics',
    date: '2026-04-06',
    terminalType: 'MANUAL_ADMIN',
    status: 'CASUAL_LEAVE',
    geofenceVerified: false,
    lateMinutes: 0,
    arrangementRequired: true,
    remarks: 'Sanctioned Casual Leave (CL) for personal urgent work',
  },
];
