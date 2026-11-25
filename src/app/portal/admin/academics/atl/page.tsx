import React from 'react';
import { AtalTinkeringLabManager } from '@/components/modules/academics/atal-tinkering-lab-manager';

export default function AdminAtlPage() {
  return (
    <div className="space-y-6">
      <AtalTinkeringLabManager role="admin" />
    </div>
  );
}
