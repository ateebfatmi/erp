import React from 'react';
import { AdmitCardManager } from '@/components/modules/assessment/admit-card-manager';

export default function StudentAdmitCardPage() {
  return (
    <div className="space-y-6">
      <AdmitCardManager role="student" />
    </div>
  );
}
