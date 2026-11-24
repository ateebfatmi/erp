import React from 'react';
import { CareerCounselingManager } from '@/components/modules/academics/career-counseling-manager';

export default function AdminCareerGuidancePage() {
  return (
    <div className="space-y-6">
      <CareerCounselingManager role="admin" />
    </div>
  );
}
