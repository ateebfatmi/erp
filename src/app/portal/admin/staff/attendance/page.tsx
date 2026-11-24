import { Metadata } from 'next';
import { StaffAttendanceManager } from '@/components/modules/staff/staff-attendance-manager';

export const metadata: Metadata = {
  title: 'Faculty Biometric Attendance & Muster Roll | VidyaOS Admin',
  description: 'Manage staff biometric clock-ins, mobile geofenced punches, late arrival audits, and monthly payroll muster rolls.',
};

export default function AdminStaffAttendancePage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <StaffAttendanceManager viewMode="admin" />
    </div>
  );
}
