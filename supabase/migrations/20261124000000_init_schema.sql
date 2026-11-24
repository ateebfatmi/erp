-- ==============================================================================
-- VidyaOS Enterprise School ERP - Complete Multi-Tenant Database Migration
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- Helper functions for RLS session context
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION current_tenant_id() RETURNS uuid AS $$
BEGIN
  RETURN NULLIF(current_setting('app.current_tenant_id', true), '')::uuid;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION current_user_id() RETURNS uuid AS $$
BEGIN
  RETURN NULLIF(current_setting('app.current_user_id', true), '')::uuid;
END;
$$ LANGUAGE plpgsql STABLE;

-- ==============================================================================
-- 1. Platform & Tenancy
-- ==============================================================================

CREATE TABLE IF NOT EXISTS platform_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  max_students integer NOT NULL DEFAULT 500,
  max_campuses integer NOT NULL DEFAULT 1,
  price_per_year numeric(12, 2) NOT NULL DEFAULT 0.00,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES platform_subscriptions(id),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  affiliation text NOT NULL DEFAULT 'CBSE', -- CBSE, ICSE, State Board, IB, Cambridge
  affiliation_number text,
  custom_domain text UNIQUE,
  logo_url text,
  primary_email text NOT NULL,
  primary_phone text NOT NULL,
  address text,
  city text NOT NULL DEFAULT 'New Delhi',
  state text NOT NULL DEFAULT 'Delhi',
  pincode text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'trial', 'inactive')),
  trial_ends_at timestamptz,
  settings jsonb NOT NULL DEFAULT '{"currency": "INR", "timezone": "Asia/Kolkata"}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE IF NOT EXISTS campuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text NOT NULL,
  address text NOT NULL,
  phone text,
  email text,
  is_main boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  UNIQUE(tenant_id, code)
);

CREATE TABLE IF NOT EXISTS academic_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL, -- e.g. "2025-2026"
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_current boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, name)
);

-- ==============================================================================
-- 2. Users, IAM & Roles
-- ==============================================================================

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id text NOT NULL UNIQUE,
  email text NOT NULL,
  full_name text NOT NULL,
  phone text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE, -- NULL for platform global roles
  key text NOT NULL,
  name text NOT NULL,
  description text,
  is_system boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE, -- e.g. "students:view", "fees:collect"
  domain text NOT NULL,
  description text NOT NULL
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id uuid NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS tenant_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  campus_id uuid REFERENCES campuses(id) ON DELETE SET NULL, -- NULL means all campuses
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'invited', 'suspended')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, user_id)
);

-- ==============================================================================
-- 3. Academic Structure
-- ==============================================================================

CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL, -- e.g. "Class 10", "Grade 5"
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, name)
);

CREATE TABLE IF NOT EXISTS sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  name text NOT NULL, -- e.g. "A", "B", "Rose"
  capacity integer NOT NULL DEFAULT 40,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, class_id, name)
);

CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text NOT NULL,
  type text NOT NULL DEFAULT 'theory' CHECK (type IN ('theory', 'practical', 'both')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, code)
);

CREATE TABLE IF NOT EXISTS class_subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  is_optional boolean NOT NULL DEFAULT false,
  credits integer NOT NULL DEFAULT 1,
  UNIQUE (tenant_id, class_id, subject_id)
);

-- ==============================================================================
-- 4. Admissions & Student Information System (SIS)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS admission_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  campus_id uuid REFERENCES campuses(id) ON DELETE SET NULL,
  academic_session_id uuid NOT NULL REFERENCES academic_sessions(id),
  target_class_id uuid NOT NULL REFERENCES classes(id),
  student_name text NOT NULL,
  parent_name text NOT NULL,
  parent_email text NOT NULL,
  parent_phone text NOT NULL,
  status text NOT NULL DEFAULT 'lead' CHECK (status IN ('lead', 'applied', 'verified', 'approved', 'rejected', 'enrolled')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  admission_number text NOT NULL,
  full_name text NOT NULL,
  dob date NOT NULL,
  gender text NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  blood_group text,
  aadhaar_number text,
  religion text,
  caste_category text DEFAULT 'General',
  medical_notes text,
  avatar_url text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'graduated', 'transferred', 'withdrawn')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  UNIQUE(tenant_id, admission_number)
);

CREATE TABLE IF NOT EXISTS guardians (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  relationship text NOT NULL, -- Father, Mother, Legal Guardian
  phone text NOT NULL,
  email text,
  occupation text,
  annual_income numeric(12, 2),
  address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS student_guardians (
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  guardian_id uuid NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
  is_primary boolean NOT NULL DEFAULT false,
  is_emergency boolean NOT NULL DEFAULT true,
  PRIMARY KEY (student_id, guardian_id)
);

CREATE TABLE IF NOT EXISTS student_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  campus_id uuid NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  academic_session_id uuid NOT NULL REFERENCES academic_sessions(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE RESTRICT,
  section_id uuid NOT NULL REFERENCES sections(id) ON DELETE RESTRICT,
  roll_number integer,
  enrollment_date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'promoted', 'detained', 'transferred')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, academic_session_id, student_id),
  UNIQUE (tenant_id, academic_session_id, section_id, roll_number)
);

-- ==============================================================================
-- 5. Staff & HRIS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  UNIQUE(tenant_id, name)
);

CREATE TABLE IF NOT EXISTS designations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  UNIQUE(tenant_id, name)
);

CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  campus_id uuid REFERENCES campuses(id) ON DELETE SET NULL,
  employee_code text NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  dob date,
  gender text,
  joining_date date NOT NULL,
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  designation_id uuid REFERENCES designations(id) ON DELETE SET NULL,
  basic_salary numeric(12, 2) NOT NULL DEFAULT 0.00,
  bank_account_no text,
  bank_ifsc text,
  pan_number text,
  epf_number text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resigned', 'terminated', 'on_leave')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  UNIQUE(tenant_id, employee_code)
);

CREATE TABLE IF NOT EXISTS teacher_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  academic_session_id uuid NOT NULL REFERENCES academic_sessions(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  section_id uuid NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE, -- NULL if class teacher
  is_class_teacher boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, academic_session_id, section_id, subject_id)
);

-- ==============================================================================
-- 6. Attendance Management
-- ==============================================================================

CREATE TABLE IF NOT EXISTS student_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  enrollment_id uuid NOT NULL REFERENCES student_enrollments(id) ON DELETE CASCADE,
  attendance_date date NOT NULL,
  status text NOT NULL CHECK (status IN ('present', 'absent', 'late', 'half_day', 'excused')),
  remarks text,
  recorded_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, enrollment_id, attendance_date)
);

CREATE TABLE IF NOT EXISTS staff_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  attendance_date date NOT NULL,
  check_in_time timestamptz,
  check_out_time timestamptz,
  status text NOT NULL CHECK (status IN ('present', 'absent', 'half_day', 'on_leave', 'holiday')),
  remarks text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, employee_id, attendance_date)
);

-- ==============================================================================
-- 7. Fee Management & Payments
-- ==============================================================================

CREATE TABLE IF NOT EXISTS fee_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL, -- e.g. "Tuition Fee", "Transport Fee", "Annual Examination"
  description text,
  UNIQUE (tenant_id, name)
);

CREATE TABLE IF NOT EXISTS fee_structures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  academic_session_id uuid NOT NULL REFERENCES academic_sessions(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES fee_categories(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  amount numeric(12, 2) NOT NULL,
  frequency text NOT NULL DEFAULT 'monthly' CHECK (frequency IN ('one_time', 'monthly', 'quarterly', 'half_yearly', 'annual')),
  due_day integer NOT NULL DEFAULT 10,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, academic_session_id, category_id, class_id)
);

CREATE TABLE IF NOT EXISTS student_fee_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  enrollment_id uuid NOT NULL REFERENCES student_enrollments(id) ON DELETE CASCADE,
  structure_id uuid NOT NULL REFERENCES fee_structures(id) ON DELETE RESTRICT,
  title text NOT NULL,
  due_date date NOT NULL,
  due_amount numeric(12, 2) NOT NULL,
  discount_amount numeric(12, 2) NOT NULL DEFAULT 0.00,
  paid_amount numeric(12, 2) NOT NULL DEFAULT 0.00,
  status text NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'partially_paid', 'paid', 'waived')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fee_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  receipt_number text NOT NULL,
  enrollment_id uuid NOT NULL REFERENCES student_enrollments(id) ON DELETE RESTRICT,
  total_amount numeric(12, 2) NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('razorpay', 'upi', 'cash', 'cheque', 'bank_transfer', 'dd')),
  razorpay_order_id text,
  razorpay_payment_id text,
  reference_number text,
  status text NOT NULL DEFAULT 'successful' CHECK (status IN ('pending', 'successful', 'failed', 'refunded')),
  collected_by uuid REFERENCES users(id),
  recorded_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, receipt_number)
);

CREATE TABLE IF NOT EXISTS fee_transaction_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL REFERENCES fee_transactions(id) ON DELETE CASCADE,
  allocation_id uuid NOT NULL REFERENCES student_fee_allocations(id) ON DELETE RESTRICT,
  allocated_amount numeric(12, 2) NOT NULL
);

-- ==============================================================================
-- 8. Examinations & Results
-- ==============================================================================

CREATE TABLE IF NOT EXISTS exam_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  academic_session_id uuid NOT NULL REFERENCES academic_sessions(id) ON DELETE CASCADE,
  name text NOT NULL, -- e.g. "Periodic Test 1", "Mid-Term", "Final Board Exam"
  weightage_percent numeric(5, 2) NOT NULL DEFAULT 100.00,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, academic_session_id, name)
);

CREATE TABLE IF NOT EXISTS exam_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  term_id uuid NOT NULL REFERENCES exam_terms(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  exam_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  max_marks numeric(6, 2) NOT NULL DEFAULT 100.00,
  pass_marks numeric(6, 2) NOT NULL DEFAULT 33.00,
  UNIQUE (tenant_id, term_id, class_id, subject_id)
);

CREATE TABLE IF NOT EXISTS exam_marks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  schedule_id uuid NOT NULL REFERENCES exam_schedules(id) ON DELETE CASCADE,
  enrollment_id uuid NOT NULL REFERENCES student_enrollments(id) ON DELETE CASCADE,
  marks_obtained numeric(6, 2) NOT NULL,
  is_absent boolean NOT NULL DEFAULT false,
  remarks text,
  evaluated_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, schedule_id, enrollment_id)
);

-- ==============================================================================
-- 9. Timetable & Periods
-- ==============================================================================

CREATE TABLE IF NOT EXISTS timetable_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  period_number integer NOT NULL,
  name text NOT NULL, -- "Period 1", "Lunch Break"
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_break boolean NOT NULL DEFAULT false,
  UNIQUE(tenant_id, period_number)
);

CREATE TABLE IF NOT EXISTS timetable_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  academic_session_id uuid NOT NULL REFERENCES academic_sessions(id) ON DELETE CASCADE,
  section_id uuid NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  period_id uuid NOT NULL REFERENCES timetable_periods(id) ON DELETE CASCADE,
  day_of_week text NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday')),
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  room_number text,
  UNIQUE (tenant_id, academic_session_id, section_id, period_id, day_of_week),
  UNIQUE (tenant_id, academic_session_id, teacher_id, period_id, day_of_week) -- Conflict prevention: Teacher can only be in one class at a time
);

-- ==============================================================================
-- 10. Homework & Assignments
-- ==============================================================================

CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  section_id uuid NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  due_date date NOT NULL,
  attachment_url text,
  max_marks numeric(5, 2),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assignment_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  enrollment_id uuid NOT NULL REFERENCES student_enrollments(id) ON DELETE CASCADE,
  submission_text text,
  attachment_url text,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  marks_awarded numeric(5, 2),
  feedback text,
  status text NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'late', 'resubmit')),
  UNIQUE (assignment_id, enrollment_id)
);

-- ==============================================================================
-- 11. Facilities: Transport, Library, Inventory, Visitors
-- ==============================================================================

CREATE TABLE IF NOT EXISTS transport_routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  campus_id uuid REFERENCES campuses(id) ON DELETE SET NULL,
  route_name text NOT NULL,
  vehicle_number text NOT NULL,
  driver_name text NOT NULL,
  driver_phone text NOT NULL,
  capacity integer NOT NULL DEFAULT 40,
  monthly_fee numeric(10, 2) NOT NULL DEFAULT 0.00,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transport_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  route_id uuid NOT NULL REFERENCES transport_routes(id) ON DELETE CASCADE,
  enrollment_id uuid NOT NULL REFERENCES student_enrollments(id) ON DELETE CASCADE,
  pickup_point text NOT NULL,
  UNIQUE(tenant_id, enrollment_id)
);

CREATE TABLE IF NOT EXISTS library_books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  isbn text,
  title text NOT NULL,
  author text NOT NULL,
  publisher text,
  category text NOT NULL DEFAULT 'General',
  total_copies integer NOT NULL DEFAULT 1,
  available_copies integer NOT NULL DEFAULT 1,
  shelf_location text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS library_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  book_id uuid NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
  borrower_type text NOT NULL CHECK (borrower_type IN ('student', 'employee')),
  enrollment_id uuid REFERENCES student_enrollments(id) ON DELETE SET NULL,
  employee_id uuid REFERENCES employees(id) ON DELETE SET NULL,
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date NOT NULL,
  return_date date,
  fine_amount numeric(8, 2) NOT NULL DEFAULT 0.00,
  status text NOT NULL DEFAULT 'borrowed' CHECK (status IN ('borrowed', 'returned', 'overdue', 'lost'))
);

CREATE TABLE IF NOT EXISTS inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL,
  quantity_in_stock integer NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT 'pcs',
  unit_price numeric(10, 2) NOT NULL DEFAULT 0.00,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  campus_id uuid REFERENCES campuses(id) ON DELETE SET NULL,
  visitor_name text NOT NULL,
  phone text NOT NULL,
  purpose text NOT NULL,
  person_to_meet text NOT NULL,
  check_in timestamptz NOT NULL DEFAULT now(),
  check_out timestamptz,
  pass_number text NOT NULL
);

-- ==============================================================================
-- 12. Communication & Audit Logs
-- ==============================================================================

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  recipient_user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  channel text NOT NULL CHECK (channel IN ('in_app', 'email', 'whatsapp', 'sms')),
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb,
  sent_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL, -- e.g. "fee:collected", "student:promoted"
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  ip_address text,
  payload jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ==============================================================================
-- Row-Level Security (RLS) Enablement & Tenant Policies
-- ==============================================================================

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE admission_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE designations ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_fee_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Standard tenant isolation policy macro
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
    AND tablename NOT IN ('tenants', 'users', 'platform_subscriptions', 'roles', 'permissions', 'role_permissions', 'student_guardians', 'fee_transaction_allocations', 'assignment_submissions')
  LOOP
    EXECUTE format('
      DROP POLICY IF EXISTS tenant_isolation_%I ON %I;
      CREATE POLICY tenant_isolation_%I ON %I
        FOR ALL
        USING (tenant_id = current_tenant_id());
    ', tbl, tbl, tbl, tbl);
  END LOOP;
END;
$$;

DROP POLICY IF EXISTS tenant_isolation_tenants ON tenants;
CREATE POLICY tenant_isolation_tenants ON tenants
  FOR ALL
  USING (id = current_tenant_id());
