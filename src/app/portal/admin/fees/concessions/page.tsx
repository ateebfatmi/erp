import { Metadata } from 'next';
import { FeeConcessionsManager } from '@/components/modules/fees/fee-concessions-manager';

export const metadata: Metadata = {
  title: 'Fee Concessions & Merit Scholarships Desk | VidyaOS Admin',
  description: 'Manage statutory single girl child waivers (CBSE Udaan), sibling discounts, staff ward concessions, and merit scholarships.',
};

export default function AdminFeeConcessionsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <FeeConcessionsManager viewMode="admin" />
    </div>
  );
}
