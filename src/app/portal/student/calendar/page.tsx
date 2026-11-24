import { Metadata } from 'next';
import { AcademicCalendarManager } from '@/components/modules/academics/academic-calendar-manager';

export const metadata: Metadata = {
  title: 'My Academic Calendar & Events | VidyaOS Student',
  description: 'View exam dates, sports day, vacation breaks, and gazetted national holidays.',
};

export default function StudentAcademicCalendarPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <AcademicCalendarManager viewMode="student" />
    </div>
  );
}
