export type AtomicPermission =
  // Tenant & System
  | 'platform:admin'
  | 'tenant:manage'
  | 'campus:manage'
  | 'sessions:manage'
  // Students & Admissions
  | 'admissions:view'
  | 'admissions:create'
  | 'admissions:approve'
  | 'admissions:reject'
  | 'students:view'
  | 'students:create'
  | 'students:edit'
  | 'students:delete'
  | 'students:export'
  | 'students:promote'
  | 'certificates:generate'
  // Academics
  | 'classes:manage'
  | 'subjects:manage'
  | 'timetable:manage'
  | 'timetable:view'
  // Attendance
  | 'attendance:view'
  | 'attendance:mark'
  | 'attendance:approve'
  | 'attendance:export'
  // Fees & Finance
  | 'fees:view'
  | 'fees:configure'
  | 'fees:collect'
  | 'fees:refund'
  | 'fees:export'
  // Examinations
  | 'exams:schedule'
  | 'exams:enter_marks'
  | 'exams:publish'
  | 'exams:view_results'
  // Staff & HR
  | 'employees:view'
  | 'employees:create'
  | 'employees:edit'
  | 'payroll:view'
  | 'payroll:process'
  | 'payroll:approve'
  | 'leaves:apply'
  | 'leaves:approve'
  // Homework & LMS
  | 'homework:create'
  | 'homework:grade'
  | 'homework:submit'
  // Facilities
  | 'transport:manage'
  | 'library:manage'
  | 'library:issue'
  | 'inventory:manage'
  | 'visitors:manage'
  // Communication & Reports
  | 'announcements:broadcast'
  | 'reports:academic'
  | 'reports:financial'
  | 'audit_logs:view';

export const ROLE_PERMISSIONS_MAP: Record<string, AtomicPermission[]> = {
  platform_super_admin: [
    'platform:admin',
    'tenant:manage',
    'campus:manage',
    'reports:academic',
    'reports:financial',
    'audit_logs:view',
  ],

  school_admin: [
    'tenant:manage',
    'campus:manage',
    'sessions:manage',
    'admissions:view',
    'admissions:create',
    'admissions:approve',
    'admissions:reject',
    'students:view',
    'students:create',
    'students:edit',
    'students:delete',
    'students:export',
    'students:promote',
    'certificates:generate',
    'classes:manage',
    'subjects:manage',
    'timetable:manage',
    'timetable:view',
    'attendance:view',
    'attendance:mark',
    'attendance:approve',
    'attendance:export',
    'fees:view',
    'fees:configure',
    'fees:collect',
    'fees:refund',
    'fees:export',
    'exams:schedule',
    'exams:enter_marks',
    'exams:publish',
    'exams:view_results',
    'employees:view',
    'employees:create',
    'employees:edit',
    'payroll:view',
    'payroll:process',
    'payroll:approve',
    'leaves:approve',
    'transport:manage',
    'library:manage',
    'inventory:manage',
    'visitors:manage',
    'announcements:broadcast',
    'reports:academic',
    'reports:financial',
    'audit_logs:view',
  ],

  principal: [
    'students:view',
    'students:export',
    'students:promote',
    'certificates:generate',
    'admissions:view',
    'admissions:approve',
    'attendance:view',
    'attendance:approve',
    'timetable:view',
    'exams:schedule',
    'exams:publish',
    'exams:view_results',
    'employees:view',
    'leaves:approve',
    'payroll:view',
    'fees:view',
    'reports:academic',
    'reports:financial',
    'announcements:broadcast',
  ],

  accountant: [
    'students:view',
    'fees:view',
    'fees:configure',
    'fees:collect',
    'fees:refund',
    'fees:export',
    'payroll:view',
    'payroll:process',
    'reports:financial',
  ],

  teacher: [
    'students:view',
    'timetable:view',
    'attendance:view',
    'attendance:mark',
    'exams:enter_marks',
    'exams:view_results',
    'homework:create',
    'homework:grade',
    'leaves:apply',
    'announcements:broadcast',
  ],

  parent: [
    'students:view',
    'attendance:view',
    'fees:view',
    'exams:view_results',
    'timetable:view',
    'leaves:apply',
  ],

  student: [
    'students:view',
    'attendance:view',
    'timetable:view',
    'exams:view_results',
    'homework:submit',
  ],
};
