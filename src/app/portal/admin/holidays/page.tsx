import React from 'react';
import { Metadata } from 'next';
import { UnifiedHolidayHub } from '@/components/modules/holidays/unified-holiday-hub';

export const metadata: Metadata = {
  title: 'Institutional Academic Holiday & Attendance Linkage Hub | VidyaOS Admin',
  description: 'Manage CBSE and National gazetted holidays, religious festival leaves, and automated attendance muster roll linkages.',
};

export default function AdminHolidaysPage() {
  return <UnifiedHolidayHub initialTab="calendar" />;
}
