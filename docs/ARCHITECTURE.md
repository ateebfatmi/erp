# System Architecture & Technical Specifications

## 1. High-Level Modular Monolithic Architecture

The platform is architected as an enterprise-grade modular monolith built on Next.js 16 (App Router, Server Components, React Compiler) backed by Supabase PostgreSQL and Clerk Authentication.

```
                           +--------------------------------+
                           |     Client Applications        |
                           | (Web App / Mobile Responsive)  |
                           +---------------+----------------+
                                           | HTTPS / WSS
                                           v
             +-----------------------------------------------------------+
             |                 Next.js 16 App Layer                      |
             |                                                           |
             |  [Middleware: Subdomain Tenant Resolution & Clerk Auth]   |
             |                                                           |
             |  +--------------------+   +----------------------------+  |
             |  | Server Components  |   | Server Actions & Route API |  |
             |  | (Zero-bundle Read) |   | (Mutations, Payments, I/O) |  |
             |  +---------+----------+   +--------------+-------------+  |
             |            |                             |                |
             |  +---------v-----------------------------v-------------+  |
             |  |         Application & Domain Services Layer         |  |
             |  | (Auth, RBAC, Fees, Academics, Payroll, Transports)  |  |
             |  +-----------------------+-----------------------------+  |
             +--------------------------|--------------------------------+
                                        |
                 +----------------------+----------------------+
                 |                                             |
                 v                                             v
+---------------------------------+           +---------------------------------+
|      Supabase PostgreSQL        |           |       External Services         |
|  - Multi-Tenant Schema          |           |  - Clerk (Auth Identity)        |
|  - Row Level Security (RLS)     |           |  - Razorpay (Payments/Refunds)  |
|  - Realtime Changefeed          |           |  - Resend & WhatsApp Cloud API  |
|  - Storage Buckets (Docs/PDFs)  |           |  - Inngest (Async Workflows)    |
+---------------------------------+           +---------------------------------+
```

## 2. Layered Responsibilities
1. **Presentation Layer (`src/app`, `src/components`):**
   * Role-partitioned route groups: `(marketing)`, `(platform)`, `(school)`, `(teacher)`, `(parent)`, `(student)`.
   * Reusable design system built on Tailwind CSS 4, Radix UI, Lucide React, and TanStack Table.
2. **Authorization & Tenant Context Layer (`src/lib/auth`, `src/lib/permissions`):**
   * Tenant resolution via subdomain/custom domain or verified session headers.
   * Cryptographic verification of user membership against tenant database records before query execution.
   * Granular permission evaluator (`can(user, 'fees:collect')`).
3. **Domain Business Logic (`src/modules/*`):**
   * Encapsulated domain logic: Schemas, Types, Services, Actions, and View Components.
   * Strictly decoupled from database connection details.
4. **Data Access & Storage Layer (`src/lib/database`, `supabase/`):**
   * Connection pool management via Supabase client / direct connection.
   * PostgreSQL RLS enforcement with tenant context parameterization (`set_config('app.current_tenant_id', ...)`).
5. **Background & Async Processing Layer (`src/lib/jobs`):**
   * Idempotent scheduled jobs for fee reminders, attendance digests, and end-of-term roll-overs.
