import React from 'react';
import { Metadata } from 'next';
import { UnifiedFrontOfficeHub } from '@/components/modules/front-office/unified-front-office-hub';

export const metadata: Metadata = {
  title: 'Front Desk, Visitor Pass & Communications | VidyaOS Admin',
  description: 'Manage campus visitor gate passes, telephony call logs, postal dispatches, and admission CRM inquiries.',
};

export default function AdminFrontOfficePage() {
  return <UnifiedFrontOfficeHub initialTab="visitors" />;
}
