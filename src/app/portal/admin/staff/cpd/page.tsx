import React from 'react';
import { TeacherCpdManager } from '@/components/modules/staff/teacher-cpd-manager';

export default function AdminStaffCpdPage() {
  return (
    <div className="space-y-6">
      <TeacherCpdManager role="admin" />
    </div>
  );
}
