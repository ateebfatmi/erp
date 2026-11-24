import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/features',
  '/pricing',
  '/about',
  '/contact',
  '/demo',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/health',
  '/api/webhooks(.*)',
  '/api/admissions/inquiry',
]);

const handler = clerkMiddleware(async (auth, request) => {
  const hostname = request.headers.get('host') || '';

  // Extract subdomain for multi-tenancy (e.g. dpga.platformdomain.com -> dpga)
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'platformdomain.com';
  let tenantSlug = 'dpga'; // default tenant

  if (hostname.includes(`.${appDomain}`)) {
    tenantSlug = hostname.replace(`.${appDomain}`, '').split(':')[0];
  }

  // Clone headers and inject tenant slug for downstream Server Components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-tenant-slug', tenantSlug);

  if (!isPublicRoute(request)) {
    // Optionally enforce auth for protected routes
    // await auth.protect();
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export default handler;
export const proxy = handler;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
