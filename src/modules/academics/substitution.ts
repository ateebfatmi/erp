/**
 * Automated Teacher Period Substitution & Faculty Leave Ledger Engine
 * Implements 7th Central Pay Commission statutory faculty leave types (CL, EL, ML, OD),
 * algorithmic free-period detection, and automated timetable arrangement matrices.
 */

export type FacultyLeaveType =
  | 'CASUAL_LEAVE'
  | 'EARNED_LEAVE'
  | 'MEDICAL_LEAVE'
  | 'ON_DUTY_CBSE';

export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY';

export interface TeacherProfile {
  id: string;
  name: string;
  employeeCode: string;
  department: string;
  designation: 'PRT' | 'TGT' | 'PGT' | 'HOD';
  maxWeeklyWorkload: number;
  currentAssignedPeriods: number;
}

export interface TeacherTimetableSlot {
  teacherId: string;
  dayOfWeek: DayOfWeek;
  periodNo: number; // 1 to 8
  classGrade: number;
  section: string;
  subject: string;
}

export interface FacultyLeaveApplication {
  id: string;
  teacherId: string;
  teacherName: string;
  leaveType: FacultyLeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedAt: string;
}

export interface SubstitutionOrder {
  id: string;
  date: string;
  periodNo: number;
  absentTeacherId: string;
  absentTeacherName: string;
  substituteTeacherId: string;
  substituteTeacherName: string;
  classGrade: number;
  section: string;
  subject: string;
  notes: string;
  status: 'ASSIGNED' | 'ACKNOWLEDGED' | 'COMPLETED';
}

export const ANNUAL_LEAVE_QUOTAS: Record<FacultyLeaveType, number> = {
  CASUAL_LEAVE: 8,
  EARNED_LEAVE: 12,
  MEDICAL_LEAVE: 20,
  ON_DUTY_CBSE: 15,
};

/**
 * Calculates remaining balance across statutory faculty leave types
 */
export function calculateFacultyLeaveBalance(
  approvedLeaves: FacultyLeaveApplication[],
  quotas: Record<FacultyLeaveType, number> = ANNUAL_LEAVE_QUOTAS
): Record<FacultyLeaveType, { allocated: number; used: number; remaining: number }> {
  const result: Record<FacultyLeaveType, { allocated: number; used: number; remaining: number }> = {
    CASUAL_LEAVE: { allocated: quotas.CASUAL_LEAVE, used: 0, remaining: quotas.CASUAL_LEAVE },
    EARNED_LEAVE: { allocated: quotas.EARNED_LEAVE, used: 0, remaining: quotas.EARNED_LEAVE },
    MEDICAL_LEAVE: { allocated: quotas.MEDICAL_LEAVE, used: 0, remaining: quotas.MEDICAL_LEAVE },
    ON_DUTY_CBSE: { allocated: quotas.ON_DUTY_CBSE, used: 0, remaining: quotas.ON_DUTY_CBSE },
  };

  for (const leave of approvedLeaves) {
    if (leave.status === 'APPROVED') {
      // Calculate day duration (inclusive)
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      if (result[leave.leaveType]) {
        result[leave.leaveType].used += diffDays;
        result[leave.leaveType].remaining = Math.max(
          0,
          result[leave.leaveType].allocated - result[leave.leaveType].used
        );
      }
    }
  }

  return result;
}

/**
 * Identifies available teachers who have ZERO scheduled lectures during a specific period and day
 */
export function findFreeTeachersForPeriod(
  allTeachers: TeacherProfile[],
  masterTimetable: TeacherTimetableSlot[],
  dayOfWeek: DayOfWeek,
  periodNo: number,
  absentTeacherIds: string[]
): TeacherProfile[] {
  // 1. Get IDs of teachers who are already teaching during this exact period
  const busyTeacherIds = new Set<string>();
  for (const slot of masterTimetable) {
    if (slot.dayOfWeek === dayOfWeek && slot.periodNo === periodNo) {
      busyTeacherIds.add(slot.teacherId);
    }
  }

  // 2. Filter available teachers who are not busy and not absent
  const freeTeachers = allTeachers.filter((t) => {
    return !absentTeacherIds.includes(t.id) && !busyTeacherIds.has(t.id);
  });

  // Sort by lowest current workload to prevent faculty burnout
  return freeTeachers.sort((a, b) => a.currentAssignedPeriods - b.currentAssignedPeriods);
}

/**
 * Generates an automated Substitution Arrangement Matrix for all periods of absent teachers
 */
export function generateAutomatedSubstitutions(
  absentTeachers: { id: string; name: string }[],
  date: string,
  dayOfWeek: DayOfWeek,
  masterTimetable: TeacherTimetableSlot[],
  allTeachers: TeacherProfile[]
): SubstitutionOrder[] {
  const absentTeacherIds = absentTeachers.map((t) => t.id);
  const substitutionOrders: SubstitutionOrder[] = [];

  // Track extra periods assigned during this session to balance allocation
  const temporaryWorkload: Record<string, number> = {};
  for (const t of allTeachers) {
    temporaryWorkload[t.id] = t.currentAssignedPeriods;
  }

  for (const absent of absentTeachers) {
    // Find all periods taught by the absent teacher on this day
    const affectedSlots = masterTimetable.filter(
      (s) => s.teacherId === absent.id && s.dayOfWeek === dayOfWeek
    );

    for (const slot of affectedSlots) {
      // Find eligible free teachers for this period
      const freeCandidates = findFreeTeachersForPeriod(
        allTeachers,
        masterTimetable,
        dayOfWeek,
        slot.periodNo,
        absentTeacherIds
      );

      // Prioritize same subject/department if possible, otherwise candidate with lowest workload
      const sameDeptCandidate = freeCandidates.find((c) =>
        masterTimetable.some((s) => s.teacherId === c.id && s.subject === slot.subject)
      );

      const chosen = sameDeptCandidate || freeCandidates[0];

      if (chosen) {
        temporaryWorkload[chosen.id] = (temporaryWorkload[chosen.id] || 0) + 1;

        substitutionOrders.push({
          id: `sub-${date}-p${slot.periodNo}-${absent.id}-${chosen.id}`,
          date,
          periodNo: slot.periodNo,
          absentTeacherId: absent.id,
          absentTeacherName: absent.name,
          substituteTeacherId: chosen.id,
          substituteTeacherName: chosen.name,
          classGrade: slot.classGrade,
          section: slot.section,
          subject: slot.subject,
          notes: sameDeptCandidate
            ? `Subject Specialist Arrangement (${slot.subject})`
            : `Classroom Supervision & Self-Study Arrangement`,
          status: 'ASSIGNED',
        });
      }
    }
  }

  return substitutionOrders;
}

/**
 * Curated Faculty Profiles for Institutional Mock Data
 */
export const FACULTY_ROSTER: TeacherProfile[] = [
  {
    id: 'tch-01',
    name: 'Smt. Ananya Sen',
    employeeCode: 'FAC-MATH-01',
    department: 'Mathematics',
    designation: 'PGT',
    maxWeeklyWorkload: 28,
    currentAssignedPeriods: 22,
  },
  {
    id: 'tch-02',
    name: 'Dr. R. Ramanujan',
    employeeCode: 'FAC-PHY-02',
    department: 'Physics',
    designation: 'PGT',
    maxWeeklyWorkload: 28,
    currentAssignedPeriods: 20,
  },
  {
    id: 'tch-03',
    name: 'Dr. V. K. Saxena',
    employeeCode: 'FAC-CHEM-03',
    department: 'Chemistry',
    designation: 'PGT',
    maxWeeklyWorkload: 28,
    currentAssignedPeriods: 24,
  },
  {
    id: 'tch-04',
    name: 'Ms. Clara D’Souza',
    employeeCode: 'FAC-ENG-04',
    department: 'English',
    designation: 'TGT',
    maxWeeklyWorkload: 30,
    currentAssignedPeriods: 18,
  },
  {
    id: 'tch-05',
    name: 'Shri Vikram Rathore',
    employeeCode: 'FAC-PED-05',
    department: 'Physical Education',
    designation: 'PRT',
    maxWeeklyWorkload: 25,
    currentAssignedPeriods: 14,
  },
  {
    id: 'tch-06',
    name: 'Smt. Kavita Sharma',
    employeeCode: 'FAC-MATH-06',
    department: 'Mathematics',
    designation: 'TGT',
    maxWeeklyWorkload: 30,
    currentAssignedPeriods: 19,
  },
];

/**
 * Sample Master Timetable Slots (Monday Schedule)
 */
export const MOCK_TIMETABLE_SLOTS: TeacherTimetableSlot[] = [
  // Smt. Ananya Sen (Maths)
  { teacherId: 'tch-01', dayOfWeek: 'MONDAY', periodNo: 1, classGrade: 10, section: 'A', subject: 'Mathematics' },
  { teacherId: 'tch-01', dayOfWeek: 'MONDAY', periodNo: 3, classGrade: 12, section: 'A', subject: 'Mathematics' },
  { teacherId: 'tch-01', dayOfWeek: 'MONDAY', periodNo: 5, classGrade: 11, section: 'B', subject: 'Mathematics' },

  // Dr. R. Ramanujan (Physics)
  { teacherId: 'tch-02', dayOfWeek: 'MONDAY', periodNo: 2, classGrade: 12, section: 'A', subject: 'Physics' },
  { teacherId: 'tch-02', dayOfWeek: 'MONDAY', periodNo: 4, classGrade: 11, section: 'A', subject: 'Physics' },

  // Dr. V. K. Saxena (Chemistry)
  { teacherId: 'tch-03', dayOfWeek: 'MONDAY', periodNo: 1, classGrade: 12, section: 'A', subject: 'Chemistry' },
  { teacherId: 'tch-03', dayOfWeek: 'MONDAY', periodNo: 3, classGrade: 11, section: 'A', subject: 'Chemistry' },

  // Ms. Clara D’Souza (English)
  { teacherId: 'tch-04', dayOfWeek: 'MONDAY', periodNo: 4, classGrade: 10, section: 'A', subject: 'English' },
  { teacherId: 'tch-04', dayOfWeek: 'MONDAY', periodNo: 6, classGrade: 12, section: 'A', subject: 'English' },

  // Smt. Kavita Sharma (Maths TGT) - free during period 1, 3, 5
  { teacherId: 'tch-06', dayOfWeek: 'MONDAY', periodNo: 2, classGrade: 9, section: 'A', subject: 'Mathematics' },
  { teacherId: 'tch-06', dayOfWeek: 'MONDAY', periodNo: 4, classGrade: 9, section: 'B', subject: 'Mathematics' },
];
