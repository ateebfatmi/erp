import { Metadata } from 'next';
import { AcademicCalendarManager } from '@/components/modules/academics/academic-calendar-manager';

export const metadata: Metadata = {
  title: 'Institutional Academic Calendar | VidyaOS Admin',
  description: 'Manage annual gazetted holidays, term exam windows, and CBSE Rule 14.1 220-day working compliance.',
};

export default function AdminAcademicCalendarPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <AcademicCalendarManager viewMode="admin" />
    </div>
  );
}
