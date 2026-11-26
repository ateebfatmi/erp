import { Metadata } from 'next';
import { UnifiedStaffHub } from '@/components/modules/staff/unified-staff-hub';

export const metadata: Metadata = {
  title: 'Faculty Biometric Attendance & Muster Roll | VidyaOS Admin',
  description: 'Manage staff biometric clock-ins, mobile geofenced punches, late arrival audits, and monthly payroll muster rolls.',
};

export default function AdminStaffAttendancePage() {
  return <UnifiedStaffHub initialTab="attendance" />;
}
