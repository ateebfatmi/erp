/**
 * Commercial-Grade Communication Engine: Circulars & Academic Calendar
 * Manages statutory school circulars, CBSE/State notifications, gazetted holidays,
 * examination windows, and real-time parent acknowledgement receipts.
 */

export type NoticeCategory =
  | 'ACADEMIC'
  | 'EXAM_SCHEDULE'
  | 'HOLIDAY'
  | 'SPORTS_EVENT'
  | 'FEE_REMINDER'
  | 'EMERGENCY'
  | 'REGULATORY';

export type TargetAudience =
  | 'ALL_SCHOOL'
  | 'PRIMARY'
  | 'SECONDARY'
  | 'SENIOR_SECONDARY'
  | 'BOARD_CLASSES'
  | 'TRANSPORT_USERS'
  | 'FACULTY';

export interface SchoolNotice {
  id: string;
  circularNo: string;
  title: string;
  category: NoticeCategory;
  targetAudience: TargetAudience;
  publishDate: string; // YYYY-MM-DD
  summary: string;
  content: string;
  pdfAttachmentUrl?: string;
  signedBy: string;
  isPinned: boolean;
  acknowledgementRequired: boolean;
  readReceiptCount: number;
}

export type CalendarEventType =
  | 'GAZETTED_HOLIDAY'
  | 'RESTRICTED_HOLIDAY'
  | 'EXAMINATION'
  | 'PTM'
  | 'SPORTS_CULTURAL'
  | 'VACATION'
  | 'ACADEMIC';

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  eventType: CalendarEventType;
  affectsAttendance: boolean; // School closed
  description: string;
}

/**
 * Filter notices accessible to a given role and cohort
 */
export function filterNoticesForAudience(
  notices: SchoolNotice[],
  audienceRole: 'admin' | 'teacher' | 'parent' | 'student',
  studentClassGrade?: number
): SchoolNotice[] {
  if (audienceRole === 'admin') {
    return notices;
  }

  return notices.filter((notice) => {
    if (notice.targetAudience === 'ALL_SCHOOL') return true;

    if (audienceRole === 'teacher') {
      return notice.targetAudience === 'FACULTY';
    }

    // For Parents and Students
    if (notice.targetAudience === 'FACULTY') {
      return false; // Faculty-only memos hidden from parents/students
    }

    if (studentClassGrade !== undefined) {
      if (notice.targetAudience === 'PRIMARY' && studentClassGrade <= 5) return true;
      if (notice.targetAudience === 'SECONDARY' && studentClassGrade >= 6 && studentClassGrade <= 10) return true;
      if (notice.targetAudience === 'SENIOR_SECONDARY' && studentClassGrade >= 11) return true;
      if (notice.targetAudience === 'BOARD_CLASSES' && (studentClassGrade === 10 || studentClassGrade === 12)) return true;
      if (notice.targetAudience === 'TRANSPORT_USERS') return true;
      return false;
    }

    return true;
  });
}

/**
 * Filter calendar events for a specific calendar month (1-indexed, 1 = January, 12 = December)
 */
export function getCalendarEventsForMonth(
  events: CalendarEvent[],
  year: number,
  month: number
): CalendarEvent[] {
  const monthStr = month < 10 ? `0${month}` : `${month}`;
  const targetPrefix = `${year}-${monthStr}`;

  return events.filter((event) => {
    return event.startDate.startsWith(targetPrefix) || event.endDate.startsWith(targetPrefix);
  });
}

/**
 * Search notices by title, circular number, summary, or category
 */
export function searchNotices(
  notices: SchoolNotice[],
  query: string,
  categoryFilter?: NoticeCategory | 'ALL'
): SchoolNotice[] {
  const q = query.trim().toLowerCase();

  return notices.filter((notice) => {
    const matchesCategory =
      !categoryFilter || categoryFilter === 'ALL' || notice.category === categoryFilter;

    if (!matchesCategory) return false;
    if (!q) return true;

    return (
      notice.title.toLowerCase().includes(q) ||
      notice.circularNo.toLowerCase().includes(q) ||
      notice.summary.toLowerCase().includes(q) ||
      notice.category.toLowerCase().includes(q)
    );
  });
}

/**
 * Record parent/guardian acknowledgement for mandatory circulars
 */
export function recordNoticeAcknowledgement(
  notice: SchoolNotice,
  parentId: string
): { success: boolean; updatedNotice: SchoolNotice } {
  if (!notice.acknowledgementRequired) {
    return { success: true, updatedNotice: notice };
  }

  return {
    success: true,
    updatedNotice: {
      ...notice,
      readReceiptCount: notice.readReceiptCount + 1,
    },
  };
}

/**
 * Curated Standard Academic Calendar & Indian Gazetted Holidays
 */
export const STATUTORY_ACADEMIC_CALENDAR: CalendarEvent[] = [
  {
    id: 'evt-001',
    title: 'Gandhi Jayanti',
    startDate: '2024-10-02',
    endDate: '2024-10-02',
    eventType: 'GAZETTED_HOLIDAY',
    affectsAttendance: true,
    description: 'National Gazetted Holiday celebrating Mahatma Gandhi Jayanti.',
  },
  {
    id: 'evt-002',
    title: 'Diwali & Chhath Puja Break',
    startDate: '2024-10-31',
    endDate: '2024-11-04',
    eventType: 'VACATION',
    affectsAttendance: true,
    description: 'Festival holidays for Diwali, Govardhan Puja, and Bhai Dooj.',
  },
  {
    id: 'evt-003',
    title: 'Term-1 Pre-Board Examinations (X & XII)',
    startDate: '2024-11-18',
    endDate: '2024-11-28',
    eventType: 'EXAMINATION',
    affectsAttendance: false,
    description: 'Mandatory CBSE format mock pre-board theoretical examinations.',
  },
  {
    id: 'evt-004',
    title: 'Term-1 Parent-Teacher Meeting (PTM)',
    startDate: '2024-11-30',
    endDate: '2024-11-30',
    eventType: 'PTM',
    affectsAttendance: false,
    description: 'One-on-one progress discussion and evaluation card distribution.',
  },
  {
    id: 'evt-005',
    title: 'Annual Sports & Athletic Championship Meet',
    startDate: '2024-12-14',
    endDate: '2024-12-15',
    eventType: 'SPORTS_CULTURAL',
    affectsAttendance: false,
    description: 'Inter-house athletic track & field events and drill displays.',
  },
  {
    id: 'evt-006',
    title: 'Winter Vacation & Christmas Break',
    startDate: '2024-12-24',
    endDate: '2025-01-02',
    eventType: 'VACATION',
    affectsAttendance: true,
    description: 'School closed for winter recess. Administrative offices operate 10 AM - 2 PM.',
  },
  {
    id: 'evt-007',
    title: 'Republic Day Celebration',
    startDate: '2025-01-26',
    endDate: '2025-01-26',
    eventType: 'GAZETTED_HOLIDAY',
    affectsAttendance: false,
    description: 'Flag hoisting ceremony and patriotic cultural assemblies (Attendance required).',
  },
  {
    id: 'evt-008',
    title: 'CBSE AISSE & AISSCE Final Board Exams',
    startDate: '2025-02-15',
    endDate: '2025-03-25',
    eventType: 'EXAMINATION',
    affectsAttendance: false,
    description: 'Central Board of Secondary Education Class 10 & 12 Board Examinations.',
  },
];

/**
 * Pre-seeded Official School Circulars
 */
export const INITIAL_SCHOOL_CIRCULARS: SchoolNotice[] = [
  {
    id: 'cir-001',
    circularNo: 'VK/CIR/2024-25/084',
    title: 'Advisory on Mandatory Winter School Timings & Uniform Compliance',
    category: 'ACADEMIC',
    targetAudience: 'ALL_SCHOOL',
    publishDate: '2024-11-15',
    summary: 'Revision of school morning assembly time to 08:15 AM due to dense winter fog conditions across Delhi-NCR.',
    content: 'In compliance with District Administration directives regarding morning winter fog and sub-10 degree temperatures, school gates will open at 08:00 AM and morning assembly will commence at 08:20 AM. All students must wear the official navy blue blazer and woollen tie.',
    signedBy: 'Dr. Radhakrishnan, Principal',
    isPinned: true,
    acknowledgementRequired: true,
    readReceiptCount: 412,
  },
  {
    id: 'cir-002',
    circularNo: 'VK/CIR/2024-25/082',
    title: 'CBSE Class 10 & 12 Board Examination LOC Verification Deadline',
    category: 'REGULATORY',
    targetAudience: 'BOARD_CLASSES',
    publishDate: '2024-11-10',
    summary: 'Final check of student spelling, Aadhaar number, and subject choices in List of Candidates (LOC).',
    content: 'Parents and candidates of Classes X & XII must review the demographic credentials uploaded to the CBSE Pariksha Sangam portal. Any corrections in spelling of student or parents name must be signed at the Administrative Block before 30th November.',
    signedBy: 'Controller of Examinations',
    isPinned: true,
    acknowledgementRequired: true,
    readReceiptCount: 198,
  },
  {
    id: 'cir-003',
    circularNo: 'VK/CIR/2024-25/079',
    title: 'Schedule for Pre-Board Examination & Practical Viva Voce',
    category: 'EXAM_SCHEDULE',
    targetAudience: 'SENIOR_SECONDARY',
    publishDate: '2024-11-05',
    summary: 'Datesheet for Physics, Chemistry, Biology, and Computer Science practical assessments.',
    content: 'Practical portfolios, project reports, and laboratory logbooks must be authenticated by the respective subject mentor. External assessors will conduct viva between 2nd Dec and 8th Dec 2024.',
    signedBy: 'Vice Principal (Academics)',
    isPinned: false,
    acknowledgementRequired: false,
    readReceiptCount: 165,
  },
  {
    id: 'cir-004',
    circularNo: 'VK/CIR/2024-25/076',
    title: 'Annual Inter-House Athletics Meet & Torch Relay Trials',
    category: 'SPORTS_EVENT',
    targetAudience: 'ALL_SCHOOL',
    publishDate: '2024-10-28',
    summary: 'Trials for 100m, 400m relay, long jump, and shot put across Ashoka, Tagore, Shivaji, and Raman Houses.',
    content: 'House captains must submit finalized relay team rosters to the Physical Education Department by Friday 3:00 PM.',
    signedBy: 'Director of Physical Education',
    isPinned: false,
    acknowledgementRequired: false,
    readReceiptCount: 310,
  },
  {
    id: 'cir-005',
    circularNo: 'VK/CIR/2024-25/071',
    title: 'Faculty Workshop: Implementation of NEP 2020 Experiential Pedagogy',
    category: 'ACADEMIC',
    targetAudience: 'FACULTY',
    publishDate: '2024-10-20',
    summary: 'Mandatory professional development workshop for all PGT and TGT teachers on Saturday.',
    content: 'Focus session on competency-based lesson planning and rubric construction led by CBSE empanelled master trainers.',
    signedBy: 'Academic Coordinator',
    isPinned: false,
    acknowledgementRequired: true,
    readReceiptCount: 45,
  },
];
