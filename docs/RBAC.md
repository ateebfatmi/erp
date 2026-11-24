# Role-Based Access Control (RBAC) Specification

## 1. Principles & Design
* **Dual-Tier Model:** Platform Administration vs. Tenant School Roles.
* **Database-Driven Authority:** Permissions are resolved and validated via server-side database queries rather than trusting mutable JWT claims or client storage.
* **Scoped Boundaries:** All permission checks enforce both `tenant_id` and optional `campus_id` validation.

## 2. Standard Roles

### 2.1 Platform Roles
* `platform_super_admin`: Total access to platform infrastructure, subscription plans, tenant provisioning, system health, and global audit logs.
* `platform_support_admin`: Read-only or impersonation access for troubleshooting customer tickets.
* `platform_finance_admin`: Subscription billing, invoice reconciliation, and revenue analytics.

### 2.2 School Tenant Roles
* `school_owner`: Root tenant owner; full administrative and billing rights.
* `school_admin`: Day-to-day operations administrator (all modules).
* `principal`: School-wide academic and operational supervision, approval of leaves, results, and TC certificates.
* `vice_principal`: Academic coordination and timetable oversight.
* `academic_coordinator`: Curriculum, syllabus, and examination management.
* `accountant`: Fee structures, fee collection, offline receipt generation, expense ledger, and financial reports.
* `admission_manager`: Public leads, enquiry tracking, document verification, application approval, and student onboarding.
* `hr_manager`: Staff directories, payroll execution, salary slips, leave balances, and biometric attendance.
* `transport_manager`: Fleet vehicles, routes, bus stops, driver licenses, and student allocations.
* `librarian`: Book catalog, barcode/ISBN search, lending checkouts, returns, and overdue fine collection.
* `teacher`: Class teacher and subject teacher functions (assigned sections, attendance, marks, homework, report card remarks).
* `parent`: Access exclusively to linked children's records (fees, attendance, report cards, notices).
* `student`: Access exclusively to own timetable, homework, online resources, and results.
* `receptionist`: Visitor check-in/out, gate passes, and front-desk phone inquiries.

## 3. Atomic Permissions Registry
Permissions are named using `<domain>:<action>` convention:
* `students:view`, `students:create`, `students:edit`, `students:delete`, `students:export`
* `admissions:manage`, `admissions:approve`, `admissions:reject`
* `academics:configure`, `academics:assign_teacher`
* `attendance:mark`, `attendance:edit`, `attendance:approve`
* `fees:view`, `fees:configure`, `fees:collect`, `fees:refund`, `fees:export`
* `exams:schedule`, `exams:enter_marks`, `exams:publish_results`
* `payroll:view`, `payroll:process`, `payroll:approve`
* `transport:manage`, `transport:allocate`
* `library:manage_catalog`, `library:issue_book`
* `inventory:manage`, `inventory:issue`
* `reports:view_academic`, `reports:view_financial`, `reports:export`
* `settings:manage_school`, `settings:manage_roles`

## 4. Evaluator API
```typescript
import { hasPermission } from '@/lib/permissions';

// Usage in Server Action or Route Handler:
const canCollectFees = await hasPermission(userId, tenantId, 'fees:collect');
if (!canCollectFees) {
  throw new UnauthorizedError('Insufficient permissions to collect fees.');
}
```
