# Multi-Tenancy Architecture & Isolation Specification

## 1. Multi-Tenant Tenancy Model
VidyaOS uses a **Shared-Database, Shared-Schema (Partitioned)** multi-tenancy model with PostgreSQL Row Level Security (RLS). Every tenant (school or educational trust) is allocated a unique UUID `tenant_id`.

## 2. Tenant Resolution Flow
1. **Subdomain Resolution:** Incoming requests (`<school-slug>.platformdomain.com`) are parsed in Next.js middleware.
2. **Custom Domain Resolution:** Custom domains (`portal.dpsdelhi.edu.in`) are resolved against the `tenants.custom_domain` index.
3. **Fallback & Development Context:** For local development or cross-subdomain apps, headers or session cookie metadata are resolved, but **always validated** against database membership.
4. **Zero-Trust Rule:** No client-supplied `tenant_id` is accepted without verifying the authenticated user's `tenant_memberships` record.

## 3. PostgreSQL Row Level Security (RLS) Policies
Each table has RLS enabled with policies verifying that the executing user's tenant matches `tenant_id`:
```sql
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON students
  FOR ALL
  USING (
    tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
  );
```

## 4. Multi-Campus Hierarchy
Within a single school trust tenant, multiple physical branches/campuses exist:
```
           [Trust Tenant: Delhi Public Education Society]
                               |
       +-----------------------+-----------------------+
       |                                               |
[Campus 1: Main Campus]                     [Campus 2: City Branch]
- Classes 1 to 12                          - Preschool to Class 5
- Separate Transport Routes                 - Separate Local Staff
```
Users can be assigned to all campuses (e.g. Trust Director) or constrained to a single campus (e.g. Branch Principal, Teacher).

## 5. Automated Cross-Tenant Penetration Defense
Automated test suites systematically attempt:
1. Fetching Student ID from Tenant B using Tenant A authentication context -> Expect `403 Forbidden` / Empty Record.
2. Generating Fee Transaction for Student in Tenant B while signed into Tenant A -> Expect `403 Forbidden`.
3. Downloading student document storage bucket URL from another tenant -> Signed URL validation rejection.
