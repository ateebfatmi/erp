import React from 'react';
import { TeacherCpdManager } from '@/components/modules/staff/teacher-cpd-manager';

export default function TeacherCpdPage() {
  return (
    <div className="space-y-6">
      <TeacherCpdManager
        role="teacher"
        currentTeacherId="tch-01"
        currentTeacherName="Smt. Ananya Sen"
      />
    </div>
  );
}
