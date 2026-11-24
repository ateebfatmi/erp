import { Metadata } from 'next';
import { AcademicCalendarManager } from '@/components/modules/academics/academic-calendar-manager';

export const metadata: Metadata = {
  title: 'Faculty Academic Calendar & Term Dates | VidyaOS Teacher',
  description: 'View CBSE gazetted holidays, term exam cycles, PTMs, and teacher CPD training days.',
};

export default function TeacherAcademicCalendarPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <AcademicCalendarManager viewMode="teacher" />
    </div>
  );
}
