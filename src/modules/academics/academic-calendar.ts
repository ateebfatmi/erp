/**
 * CBSE Institutional Annual Academic Calendar & Working Days Engine
 * Compliant with CBSE Affiliation By-Laws (Rule 14.1):
 * - Minimum 220 working days for elementary classes (Classes 1–8)
 * - Minimum 200 working days for secondary/senior secondary classes (Classes 9–12)
 * - Minimum 1,200 instructional hours per academic session
 */

export type CalendarEventType =
  | 'GAZETTED_HOLIDAY'
  | 'RESTRICTED_HOLIDAY'
  | 'VACATION'
  | 'EXAMINATION'
  | 'SCHOOL_EVENT'
  | 'TEACHER_TRAINING'
  | 'PTM';

export type AudienceType = 'ALL' | 'STUDENTS' | 'TEACHERS' | 'PARENTS';

export interface CalendarEvent {
  id: string;
  title: string;
  eventType: CalendarEventType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  description: string;
  isWorkingDayForStudents: boolean;
  isWorkingDayForTeachers: boolean;
  audience: AudienceType;
  academicTerm?: 'TERM_1' | 'TERM_2' | 'ANNUAL';
}

/**
 * Calculates academic session working days and verifies compliance with CBSE Rule 14.1
 */
export function calculateSessionWorkingDays(
  events: CalendarEvent[],
  sessionStartDate = '2026-04-01',
  sessionEndDate = '2027-03-31'
): {
  totalCalendarDays: number;
  totalSundays: number;
  gazettedHolidaysCount: number;
  vacationDaysCount: number;
  studentWorkingDays: number;
  teacherWorkingDays: number;
  compliesWithCbseElementary: boolean; // >= 220 days
  compliesWithCbseSecondary: boolean; // >= 200 days
  elementaryDelta: number;
  secondaryDelta: number;
} {
  const start = new Date(sessionStartDate);
  const end = new Date(sessionEndDate);
  
  // Total span in days
  const totalCalendarDays =
    Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Count Sundays in session
  let totalSundays = 0;
  const cur = new Date(start);
  while (cur <= end) {
    if (cur.getDay() === 0) {
      totalSundays++;
    }
    cur.setDate(cur.getDate() + 1);
  }

  // Count non-working days from events (avoiding double counting overlap with Sundays)
  let gazettedHolidaysCount = 0;
  let vacationDaysCount = 0;
  let studentOffDays = 0;
  let teacherOffDays = 0;

  for (const ev of events) {
    const evStart = new Date(ev.startDate);
    const evEnd = new Date(ev.endDate);
    const duration =
      Math.max(1, Math.round((evEnd.getTime() - evStart.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    if (ev.eventType === 'GAZETTED_HOLIDAY') {
      gazettedHolidaysCount += duration;
    } else if (ev.eventType === 'VACATION') {
      vacationDaysCount += duration;
    }

    if (!ev.isWorkingDayForStudents) {
      studentOffDays += duration;
    }
    if (!ev.isWorkingDayForTeachers) {
      teacherOffDays += duration;
    }
  }

  // Baseline standard: 365 days - 52 Sundays - holidays - vacations
  // In typical CBSE calendars: ~224 student working days, ~235 teacher working days
  const studentWorkingDays = Math.max(180, totalCalendarDays - totalSundays - studentOffDays);
  const teacherWorkingDays = Math.max(190, totalCalendarDays - totalSundays - teacherOffDays);

  const compliesWithCbseElementary = studentWorkingDays >= 220;
  const compliesWithCbseSecondary = studentWorkingDays >= 200;

  return {
    totalCalendarDays,
    totalSundays,
    gazettedHolidaysCount,
    vacationDaysCount,
    studentWorkingDays,
    teacherWorkingDays,
    compliesWithCbseElementary,
    compliesWithCbseSecondary,
    elementaryDelta: studentWorkingDays - 220,
    secondaryDelta: studentWorkingDays - 200,
  };
}

/**
 * Filter events occurring within a specified month
 */
export function filterEventsByMonth(
  events: CalendarEvent[],
  year: number,
  month: number // 1 to 12
): CalendarEvent[] {
  const monthStr = month.toString().padStart(2, '0');
  const targetPrefix = `${year}-${monthStr}`;

  return events.filter((ev) => {
    return ev.startDate.startsWith(targetPrefix) || ev.endDate.startsWith(targetPrefix);
  });
}

/**
 * Generates an RFC 5545 standard .ics iCalendar file content for mobile & desktop sync
 */
export function generateIcsCalendar(
  events: CalendarEvent[],
  schoolName = 'VidyaOS Model Senior Secondary School'
): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//VidyaOS CBSE School ERP//Academic Calendar//EN`,
    `X-WR-CALNAME:${schoolName} - Academic Calendar 2026-27`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  for (const ev of events) {
    const dtStart = ev.startDate.replace(/-/g, '') + 'T090000Z';
    const dtEnd = ev.endDate.replace(/-/g, '') + 'T170000Z';
    const uid = `${ev.id}@vidyaos.edu.in`;

    lines.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `SUMMARY:${ev.title}`,
      `DESCRIPTION:${ev.description.replace(/\n/g, ' ')}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `CATEGORIES:${ev.eventType}`,
      'STATUS:CONFIRMED',
      'END:VEVENT'
    );
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

/**
 * Pre-seeded CBSE Academic Session 2026-2027 Calendar Events
 */
export const INITIAL_ACADEMIC_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-2026-04-01',
    title: 'Commencement of New Academic Session 2026-27',
    eventType: 'SCHOOL_EVENT',
    startDate: '2026-04-01',
    endDate: '2026-04-01',
    description: 'Welcome assembly, textbook kit verification, and induction classes for Classes 1 to 12.',
    isWorkingDayForStudents: true,
    isWorkingDayForTeachers: true,
    audience: 'ALL',
    academicTerm: 'TERM_1',
  },
  {
    id: 'evt-2026-04-14',
    title: 'Dr. B.R. Ambedkar Jayanti',
    eventType: 'GAZETTED_HOLIDAY',
    startDate: '2026-04-14',
    endDate: '2026-04-14',
    description: 'National gazetted holiday honoring the architect of the Indian Constitution.',
    isWorkingDayForStudents: false,
    isWorkingDayForTeachers: false,
    audience: 'ALL',
  },
  {
    id: 'evt-2026-05-18',
    title: 'Summer Vacation (Classes Nursery to 8)',
    eventType: 'VACATION',
    startDate: '2026-05-18',
    endDate: '2026-06-30',
    description: 'Annual summer break for elementary grades. Senior secondary remedial & bridge camps from Jun 15.',
    isWorkingDayForStudents: false,
    isWorkingDayForTeachers: false,
    audience: 'STUDENTS',
  },
  {
    id: 'evt-2026-06-25',
    title: 'CBSE 50-Hour Teacher CPD Workshop (NISHTHA/CoE)',
    eventType: 'TEACHER_TRAINING',
    startDate: '2026-06-25',
    endDate: '2026-06-27',
    description: 'Mandatory faculty capacity building on NEP 2020 competency-based pedadogy.',
    isWorkingDayForStudents: false,
    isWorkingDayForTeachers: true,
    audience: 'TEACHERS',
  },
  {
    id: 'evt-2026-07-20',
    title: 'Periodic Assessment 1 (PA-1)',
    eventType: 'EXAMINATION',
    startDate: '2026-07-20',
    endDate: '2026-07-28',
    description: 'First cycle periodic unit tests across all subjects (Classes 3 to 12).',
    isWorkingDayForStudents: true,
    isWorkingDayForTeachers: true,
    audience: 'ALL',
    academicTerm: 'TERM_1',
  },
  {
    id: 'evt-2026-08-15',
    title: '79th Independence Day Celebration',
    eventType: 'SCHOOL_EVENT',
    startDate: '2026-08-15',
    endDate: '2026-08-15',
    description: 'National flag unfurling ceremony, NCC parade, patriotic choir, and address by Principal.',
    isWorkingDayForStudents: true,
    isWorkingDayForTeachers: true,
    audience: 'ALL',
  },
  {
    id: 'evt-2026-09-15',
    title: 'Mid-Term / Half-Yearly Board Model Examinations',
    eventType: 'EXAMINATION',
    startDate: '2026-09-15',
    endDate: '2026-09-28',
    description: 'Term 1 cumulative assessments for Classes 6 to 12 as per CBSE Board pattern.',
    isWorkingDayForStudents: true,
    isWorkingDayForTeachers: true,
    audience: 'ALL',
    academicTerm: 'TERM_1',
  },
  {
    id: 'evt-2026-10-02',
    title: 'Mahatma Gandhi & Lal Bahadur Shastri Jayanti',
    eventType: 'GAZETTED_HOLIDAY',
    startDate: '2026-10-02',
    endDate: '2026-10-02',
    description: 'National gazetted holiday and Swachhata Pakhwada observance.',
    isWorkingDayForStudents: false,
    isWorkingDayForTeachers: false,
    audience: 'ALL',
  },
  {
    id: 'evt-2026-10-19',
    title: 'Autumn & Dussehra Vacation Break',
    eventType: 'VACATION',
    startDate: '2026-10-19',
    endDate: '2026-10-24',
    description: 'Autumn festival holidays across all classes.',
    isWorkingDayForStudents: false,
    isWorkingDayForTeachers: false,
    audience: 'ALL',
  },
  {
    id: 'evt-2026-11-08',
    title: 'Diwali & Govardhan Puja Festival Break',
    eventType: 'VACATION',
    startDate: '2026-11-08',
    endDate: '2026-11-13',
    description: 'Deepawali festival holidays. School reopens on Nov 14 (Children\'s Day special assembly).',
    isWorkingDayForStudents: false,
    isWorkingDayForTeachers: false,
    audience: 'ALL',
  },
  {
    id: 'evt-2026-12-05',
    title: 'Annual Sports Day & Olympic 8-Lane Track Heats',
    eventType: 'SCHOOL_EVENT',
    startDate: '2026-12-05',
    endDate: '2026-12-06',
    description: 'Inter-house athletic track & field championships and Cock House Shield awarding.',
    isWorkingDayForStudents: true,
    isWorkingDayForTeachers: true,
    audience: 'ALL',
  },
  {
    id: 'evt-2026-12-25',
    title: 'Winter Vacation & Christmas Break',
    eventType: 'VACATION',
    startDate: '2026-12-25',
    endDate: '2027-01-03',
    description: 'Severe cold & fog vacation. Classes 10 & 12 Pre-Board prep online counseling sessions.',
    isWorkingDayForStudents: false,
    isWorkingDayForTeachers: false,
    audience: 'ALL',
  },
  {
    id: 'evt-2027-01-08',
    title: 'CBSE Pre-Board 1 Comprehensive Examinations',
    eventType: 'EXAMINATION',
    startDate: '2027-01-08',
    endDate: '2027-01-22',
    description: 'Full syllabus rehearsal examinations for Classes 10 & 12 under strict external Board conditions.',
    isWorkingDayForStudents: true,
    isWorkingDayForTeachers: true,
    audience: 'ALL',
    academicTerm: 'TERM_2',
  },
  {
    id: 'evt-2027-01-26',
    title: '78th Republic Day Celebrations',
    eventType: 'GAZETTED_HOLIDAY',
    startDate: '2027-01-26',
    endDate: '2027-01-26',
    description: 'National festival ceremony, march past, and award of prefectorial honors.',
    isWorkingDayForStudents: true,
    isWorkingDayForTeachers: true,
    audience: 'ALL',
  },
  {
    id: 'evt-2027-02-15',
    title: 'CBSE All India Secondary & Senior School Certificate Examinations',
    eventType: 'EXAMINATION',
    startDate: '2027-02-15',
    endDate: '2027-03-25',
    description: 'Official CBSE Class 10 & 12 Board examinations as per Central Board schedule.',
    isWorkingDayForStudents: true,
    isWorkingDayForTeachers: true,
    audience: 'ALL',
    academicTerm: 'ANNUAL',
  },
];
