import { Metadata } from 'next';
import { StaffAttendanceManager } from '@/components/modules/staff/staff-attendance-manager';

export const metadata: Metadata = {
  title: 'My Daily Punch & Geofenced Clock-In | VidyaOS Teacher',
  description: 'View daily biometric punch timestamps, campus geofence status, late arrival marks, and monthly muster roll.',
};

export default function TeacherMyAttendancePage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <StaffAttendanceManager
        viewMode="teacher"
        currentTeacher={{
          staffId: 'EMP-001',
          staffName: 'Dr. Ramesh Sharma',
          department: 'Science (Physics)',
          designation: 'PGT Senior Teacher',
        }}
      />
    </div>
  );
}
