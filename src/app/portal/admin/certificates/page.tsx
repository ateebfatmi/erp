import React from 'react';
import { Metadata } from 'next';
import { UnifiedCertificatesHub } from '@/components/modules/certificates/unified-certificates-hub';

export const metadata: Metadata = {
  title: 'Institutional Certificate Studio & Template Designer | VidyaOS Admin',
  description: 'Issue verifiable Bonafide, Character, Sports, and Merit certificates with dynamic templates and digital authorization stamps.',
};

export default function AdminCertificatesPage() {
  return <UnifiedCertificatesHub initialTab="issued" />;
}
