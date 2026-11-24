import React from 'react';
import { HeartPulse } from 'lucide-react';
import { InfirmaryManager } from '@/components/modules/health/infirmary-manager';

export default function AdminHealthPage() {
  return (
    <div className="space-y-6">
      <InfirmaryManager />
    </div>
  );
}
