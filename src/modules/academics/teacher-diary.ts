/**
 * Teacher Weekly Digital Logbook & Classroom Teaching Diary Engine
 * Implements CBSE statutory teaching logbooks, daily period-wise lesson execution records,
 * homework assignment tracking, remedial support documentation, and Principal weekly verification.
 */

export interface TeacherDiaryEntry {
  id: string;
  teacherId: string;
  teacherName: string;
  weekNumber: number;
  date: string; // YYYY-MM-DD
  periodNo: number;
  classGrade: number;
  section: string;
  subject: string;
  topicTaught: string;
  pedagogicalAid: string;
  homeworkAssigned: string;
  remedialNotes: string;
  supervisorStatus: 'DRAFT' | 'SUBMITTED' | 'PRINCIPAL_VERIFIED';
  supervisorRemarks?: string;
}

/**
 * Filter diary entries by teacher ID, academic week number, or subject
 */
export function filterDiaryEntries(
  entries: TeacherDiaryEntry[],
  teacherId?: string,
  weekNumber?: number | 'ALL',
  subject?: string | 'ALL'
): TeacherDiaryEntry[] {
  return entries.filter((e) => {
    const matchesTeacher = !teacherId || e.teacherId === teacherId;
    const matchesWeek = !weekNumber || weekNumber === 'ALL' || e.weekNumber === weekNumber;
    const matchesSubject = !subject || subject === 'ALL' || e.subject === subject;
    return matchesTeacher && matchesWeek && matchesSubject;
  });
}

/**
 * Weekly principal / coordinator digital sign-off and pedagogical remarks
 */
export function verifyWeeklyDiaryBatch(
  entries: TeacherDiaryEntry[],
  supervisorRemarks: string
): TeacherDiaryEntry[] {
  return entries.map((e) => ({
    ...e,
    supervisorStatus: 'PRINCIPAL_VERIFIED',
    supervisorRemarks,
  }));
}

/**
 * Pre-seeded Teaching Diary Records for Smt. Ananya Sen (PGT Math)
 */
export const INITIAL_DIARY_ENTRIES: TeacherDiaryEntry[] = [
  {
    id: 'dry-01',
    teacherId: 'tch-01',
    teacherName: 'Smt. Ananya Sen',
    weekNumber: 32,
    date: '2024-11-25',
    periodNo: 1,
    classGrade: 10,
    section: 'A',
    subject: 'Mathematics',
    topicTaught: 'Quadratic Equations: Derivation of Quadratic Formula by Completing the Square',
    pedagogicalAid: 'Smartboard interactive graphing calculator & NCERT Exemplar proofs',
    homeworkAssigned: 'Exercise 4.3 Questions 1 through 6 in class notebook',
    remedialNotes: 'Clarified algebraic factor grouping doubt for 4 students during peer work',
    supervisorStatus: 'PRINCIPAL_VERIFIED',
    supervisorRemarks: 'Well structured concept sequencing. Good emphasis on mathematical reasoning.',
  },
  {
    id: 'dry-02',
    teacherId: 'tch-01',
    teacherName: 'Smt. Ananya Sen',
    weekNumber: 32,
    date: '2024-11-25',
    periodNo: 3,
    classGrade: 12,
    section: 'A',
    subject: 'Mathematics',
    topicTaught: 'Applications of Derivatives: Tangents, Normals & Rate of Change',
    pedagogicalAid: '3D geometric curves visualization on classroom projector',
    homeworkAssigned: 'NCERT Textbook Exercise 6.3 Problems 5 to 12',
    remedialNotes: 'Special remedial worksheet handed to students scoring below 60% in unit diagnostic',
    supervisorStatus: 'PRINCIPAL_VERIFIED',
    supervisorRemarks: 'Excellent integration of visualization tools.',
  },
  {
    id: 'dry-03',
    teacherId: 'tch-01',
    teacherName: 'Smt. Ananya Sen',
    weekNumber: 32,
    date: '2024-11-26',
    periodNo: 1,
    classGrade: 10,
    section: 'A',
    subject: 'Mathematics',
    topicTaught: 'Nature of Roots: Discriminant Analysis (D > 0, D = 0, D < 0)',
    pedagogicalAid: 'Hands-on parabola cutting activity on graph sheets',
    homeworkAssigned: 'Exercise 4.4 Questions 1 and 2',
    remedialNotes: 'Addressed real vs imaginary roots queries',
    supervisorStatus: 'SUBMITTED',
  },
];
