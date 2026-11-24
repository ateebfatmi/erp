# Deployment, Staging & Infrastructure Guide

## 1. Hosting Environment
* **Platform:** Vercel (Edge Network + Serverless Functions).
* **Database:** Supabase Managed PostgreSQL with PgBouncer connection pooling.
* **Storage:** Supabase Storage S3-compatible buckets.
* **Authentication:** Clerk Production Instance with Custom Subdomain DNS.

## 2. Environment Variables Checklist
Ensure production values are configured in Vercel Project Settings:
* `NEXT_PUBLIC_APP_URL`
* `NEXT_PUBLIC_APP_DOMAIN`
* `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY`
* `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
* `DATABASE_URL` & `DIRECT_URL`
* `NEXT_PUBLIC_RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET` & `RAZORPAY_WEBHOOK_SECRET`
* `RESEND_API_KEY` & `EMAIL_FROM`
* `WHATSAPP_API_TOKEN` & `WHATSAPP_PHONE_NUMBER_ID`

## 3. Database Migration Deployment
```bash
# Push migrations to Supabase
npx supabase db push

# Verify status
npx supabase migration list
```

## 4. Production Domain & Wildcard SSL
* Add wildcard domain `*.platformdomain.com` in Vercel to dynamically route all tenant school subdomains (`dps.platformdomain.com`, `ryan.platformdomain.com`).
* Configure CNAME records for schools using their own white-label domains (`portal.schoolname.org`).
