import { Metadata } from 'next';
import { AcademicCalendarManager } from '@/components/modules/academics/academic-calendar-manager';

export const metadata: Metadata = {
  title: 'School Academic Calendar & Holidays | VidyaOS Parent',
  description: 'Track school holidays, vacation breaks, term examinations, and PTM slots with .ics calendar export.',
};

export default function ParentAcademicCalendarPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <AcademicCalendarManager viewMode="parent" />
    </div>
  );
}
