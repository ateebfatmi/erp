import React from 'react';
import { PortalShell } from '@/components/layout/portal-shell';
import { getVerifiedAuthContext } from '@/lib/auth/session';

export const metadata = {
  title: 'VidyaOS Enterprise ERP Portal',
  description: 'Enterprise School Operating System and ERP SaaS',
};

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getVerifiedAuthContext();

  return (
    <PortalShell currentRole={auth.roleKey} userName={auth.fullName}>
      {children}
    </PortalShell>
  );
}
