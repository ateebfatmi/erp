# Database Architecture & Schema Specification

## 1. Overview
The persistence layer utilizes PostgreSQL hosted on Supabase. Relational integrity is enforced using foreign keys with cascading rules, unique composite constraints, check constraints, and B-Tree/GIN indexes. Every operational table is explicitly scoped to a `tenant_id` (representing the school organization) and optional `campus_id` for multi-campus deployments.

## 2. Logical Domains & Tables

### 2.1 Platform & Tenancy
* `platform_subscriptions`: Global SaaS tiers, quotas (max students, storage), and billing metadata.
* `tenants`: Core school organization entities with slug, custom domain, affiliation, and status.
* `campuses`: Physical branches belonging to a tenant.
* `academic_sessions`: Academic years (e.g., 2025-2026) with active status flags and date ranges.

### 2.2 Identity & Access Management (IAM)
* `users`: Application profile matching Clerk user identity (`clerk_user_id`).
* `tenant_memberships`: Join table between `users` and `tenants`, carrying default role and active campus assignments.
* `roles`: Standard system roles and tenant-defined custom roles.
* `permissions`: Atomic actions (e.g., `students:create`, `fees:collect`, `payroll:approve`).
* `role_permissions`: Mapping of roles to granular permissions.

### 2.3 Academic Structures
* `classes`: Standards/grades (e.g., Nursery to Grade 12).
* `sections`: Sub-divisions (e.g., Section A, B, C).
* `subjects`: Curricular subjects (Mathematics, English, Physics, Hindi).
* `class_subjects`: Mapping of subjects to classes, including credit hours and marks weightage.

### 2.4 Student Information System (SIS)
* `students`: Permanent demographic identity (Admission No, Name, DOB, Blood Group, Medical Info, Gender).
* `guardians`: Parents and primary contacts with national ID, phone, email, and occupation.
* `student_guardians`: Relationship mapping (Father, Mother, Local Guardian) with emergency contact priority.
* `student_enrollments`: Session-specific placement tying a student to an `academic_session`, `class_id`, `section_id`, and `roll_number`.
* `student_documents`: Birth certificates, transfer certificates, immunization records stored in private buckets.

### 2.5 Staff & HRIS
* `employees`: Teacher and administrative staff records (Emp Code, Designation, Department, PAN, Aadhaar).
* `teacher_allocations`: Mapping teachers as Class Teachers or Subject Teachers to specific sections.
* `staff_leave_balances`: Annual allowances (Casual, Sick, Maternity).
* `staff_leave_applications`: Request and multi-tier approval trail.

### 2.6 Attendance
* `student_attendance`: Daily or period-level marks (`present`, `absent`, `late`, `half_day`, `excused`) with composite unique constraint `(tenant_id, enrollment_id, attendance_date)`.
* `staff_attendance`: Biometric check-in/out timestamps, overtime, and late arrivals.

### 2.7 Fee & Financial Architecture
* `fee_categories`: Groupings (Tuition, Transport, Admission, Laboratory).
* `fee_structures`: Base rate definitions mapped to class and academic session.
* `student_fee_allocations`: Assigned ledger dues with due dates and discounts applied.
* `fee_discounts`: Scholarships, sibling concessions, staff waivers with authorized approval.
* `fee_transactions`: Immutable payment records (Razorpay, Cash, Cheque, UPI, DD).
* `fee_transaction_allocations`: Breakdown of a transaction across specific fee dues.

### 2.8 Examinations & Grading
* `exam_terms`: Term assessments (Periodic Assessment 1, Mid-Term, Annual Final).
* `exam_schedules`: Timetable of exams per class, subject, date, and max/pass marks.
* `exam_marks`: Recorded theory and practical marks with audit trails.

### 2.9 Communication, Transport, Library, Inventory
* `notifications`: Multi-channel message logs (Email, SMS, WhatsApp, In-App).
* `transport_routes`: Bus routes, stops, and assigned vehicles.
* `library_books`: Catalog, ISBN, copy inventory, and check-out logs.
* `inventory_items`: Assets, stock movements, and consumable tracking.

## 3. Data Integrity & Financial Immutability
* All `fee_transactions` are append-only. Any reversal or adjustment requires an offsetting credit note or refund record.
* Hard deletes are strictly prohibited on operational data. Soft deletion via `deleted_at` timestamp is enforced.
