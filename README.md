# VidyaOS — Enterprise Multi-Tenant School ERP SaaS

A commercial-grade, multi-tenant School Operating System and ERP SaaS platform designed for CBSE, ICSE, State Boards, and International educational institutions.

## Key Capabilities
* **True Multi-Tenancy:** Isolated tenant domains (`school-slug.platformdomain.com`) with PostgreSQL Row Level Security (RLS) and multi-campus support.
* **5 Stakeholder Experiences:**
  1. **Platform Super Admin:** Global tenant provisioning, subscription billing, and telemetry.
  2. **School Administrator:** Complete academic, financial, HR, and operational hub.
  3. **Teacher Portal:** Period attendance, marks grading, syllabus progress, and assignments.
  4. **Parent Portal:** Multi-child switcher, instant Razorpay/UPI fee payment, attendance records, and report cards.
  5. **Student Portal:** Timetable, homework submission, study materials, and academic transcripts.
* **Comprehensive ERP Engine:** Admissions, Student Information System (SIS), Staff HRIS, Timetable, Exams & Grading, Indian Statutory Payroll (EPF/ESI/TDS), Library, Transport, and Inventory.
* **Financial Integrity:** Double-entry ledger, automated fee allocations, Razorpay checkout with webhook HMAC verification, and PDF receipts.
* **Indian Regulatory Compliance:** CBSE/ICSE grading schemes, Transfer Certificates (TC), Bonafide certificates, and DPDP Act compliance.

## Technology Stack
* **Framework:** Next.js 16 (App Router, Server Components, Server Actions)
* **Language & Runtime:** TypeScript, Node.js >= 22
* **Database & Storage:** Supabase Managed PostgreSQL with RLS, Supabase Storage
* **Authentication:** Clerk (`@clerk/nextjs`) with database-backed RBAC
* **Styling & UI:** Tailwind CSS 4, Radix UI primitives, Lucide Icons, Recharts
* **Payments:** Razorpay API & Webhooks
* **Testing:** Vitest

## Getting Started

### 1. Environment Setup
Copy the environment template and fill in your credentials:
```bash
cp .env.example .env.local
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Running Automated Tests
```bash
npm run test
```

## Documentation
* [Architecture & System Design](file:///Users/ateebfatmi/Desktop/ERP/docs/ARCHITECTURE.md)
* [Database Schema & Models](file:///Users/ateebfatmi/Desktop/ERP/docs/DATABASE.md)
* [Entity Relationship Diagrams](file:///Users/ateebfatmi/Desktop/ERP/docs/ER_DIAGRAM.md)
* [Multi-Tenancy & Isolation](file:///Users/ateebfatmi/Desktop/ERP/docs/MULTI_TENANCY.md)
* [RBAC & Permissions](file:///Users/ateebfatmi/Desktop/ERP/docs/RBAC.md)
* [Security & DPDP Compliance](file:///Users/ateebfatmi/Desktop/ERP/docs/SECURITY.md)
* [API & Integration Specification](file:///Users/ateebfatmi/Desktop/ERP/docs/API_SPECIFICATION.md)
* [Testing Guide](file:///Users/ateebfatmi/Desktop/ERP/docs/TESTING.md)
* [Deployment Guide](file:///Users/ateebfatmi/Desktop/ERP/docs/DEPLOYMENT.md)
* [Implementation Status](file:///Users/ateebfatmi/Desktop/ERP/docs/IMPLEMENTATION_STATUS.md)
