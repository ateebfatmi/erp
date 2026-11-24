import { Metadata } from 'next';
import { RteQuotaManager } from '@/components/modules/admissions/rte-quota-manager';

export const metadata: Metadata = {
  title: 'RTE Act Section 12(1)(c) 25% Quota Desk | VidyaOS Admin',
  description: 'Manage 25% EWS and Disadvantaged Group admissions, income verification, lottery draw of lots, and state fee reimbursement claims.',
};

export default function AdminRteQuotaPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <RteQuotaManager />
    </div>
  );
}
