import React from 'react';
import { PortalShell } from '@/components/layout/portal-shell';

export const metadata = {
  title: 'VidyaOS Platform Super Admin',
  description: 'Global SaaS Multi-Tenant Provisioning & Management Hub',
};

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalShell
      currentRole="platform_super_admin"
      userName="Super Admin (VidyaOS HQ)"
    >
      {children}
    </PortalShell>
  );
}
