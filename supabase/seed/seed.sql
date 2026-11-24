-- ==============================================================================
-- VidyaOS - Seed Data: Delhi Public Global Academy (DPGA)
-- ==============================================================================

-- 1. Platform Subscription Tiers
INSERT INTO platform_subscriptions (id, name, slug, max_students, max_campuses, price_per_year, features)
VALUES 
('11111111-1111-1111-1111-111111111111', 'Growth Plan', 'growth', 2500, 3, 149999.00, '["admissions", "sis", "fees", "exams", "attendance", "payroll", "transport", "library", "reports", "portal_access"]')
ON CONFLICT (slug) DO NOTHING;

-- 2. Demo Tenant School
INSERT INTO tenants (
  id, subscription_id, name, slug, affiliation, affiliation_number, 
  primary_email, primary_phone, address, city, state, pincode, status
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Delhi Public Global Academy',
  'dpga',
  'CBSE',
  'CBSE/AFF/2130894',
  'principal@dpga.edu.in',
  '+91 11 2612 8900',
  'Sector 4, Vasant Kunj',
  'New Delhi',
  'Delhi',
  '110070',
  'active'
) ON CONFLICT (slug) DO NOTHING;

-- 3. Campuses
INSERT INTO campuses (id, tenant_id, name, code, address, phone, email, is_main)
VALUES 
('33333333-3333-3333-3333-333333333331', '22222222-2222-2222-2222-222222222222', 'Main Campus (Vasant Kunj)', 'VK-01', 'Sector 4, Vasant Kunj, New Delhi', '+91 11 2612 8900', 'main@dpga.edu.in', true),
('33333333-3333-3333-3333-333333333332', '22222222-2222-2222-2222-222222222222', 'North City Campus (Rohini)', 'RH-02', 'Sector 14, Rohini, New Delhi', '+91 11 2786 4321', 'rohini@dpga.edu.in', false)
ON CONFLICT (tenant_id, code) DO NOTHING;

-- 4. Academic Session
INSERT INTO academic_sessions (id, tenant_id, name, start_date, end_date, is_current)
VALUES 
('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', '2025-2026', '2025-04-01', '2026-03-31', true)
ON CONFLICT (tenant_id, name) DO NOTHING;

-- 5. Standard Roles
INSERT INTO roles (id, key, name, description, is_system)
VALUES 
('55555555-5555-5555-5555-555555555501', 'platform_super_admin', 'Platform Super Admin', 'Full SaaS infrastructure ownership', true),
('55555555-5555-5555-5555-555555555502', 'school_admin', 'School Administrator', 'Full school operations access', true),
('55555555-5555-5555-5555-555555555503', 'principal', 'Principal', 'Executive academic and staff authority', true),
('55555555-5555-5555-5555-555555555504', 'teacher', 'Teacher', 'Classroom, attendance, marks and homework access', true),
('55555555-5555-5555-5555-555555555505', 'accountant', 'Accountant', 'Fee collection, ledgers, and financial reports', true),
('55555555-5555-5555-5555-555555555506', 'parent', 'Parent / Guardian', 'Linked children fees, attendance and report cards', true),
('55555555-5555-5555-5555-555555555507', 'student', 'Student', 'Personal timetable, assignments and reports', true)
ON CONFLICT DO NOTHING;

-- 6. Sample Classes & Sections
INSERT INTO classes (id, tenant_id, name, display_order)
VALUES
('66666666-6666-6666-6666-666666666601', '22222222-2222-2222-2222-222222222222', 'Class 9', 9),
('66666666-6666-6666-6666-666666666602', '22222222-2222-2222-2222-222222222222', 'Class 10', 10)
ON CONFLICT (tenant_id, name) DO NOTHING;

INSERT INTO sections (id, tenant_id, class_id, name, capacity)
VALUES
('77777777-7777-7777-7777-777777777701', '22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666602', 'A', 40),
('77777777-7777-7777-7777-777777777702', '22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666602', 'B', 40)
ON CONFLICT (tenant_id, class_id, name) DO NOTHING;

-- 7. Fee Categories & Structures
INSERT INTO fee_categories (id, tenant_id, name, description)
VALUES 
('88888888-8888-8888-8888-888888888801', '22222222-2222-2222-2222-222222222222', 'Tuition Fee', 'Monthly academic tuition charges'),
('88888888-8888-8888-8888-888888888802', '22222222-2222-2222-2222-222222222222', 'Annual Development Charge', 'Annual facility maintenance and smart boards'),
('88888888-8888-8888-8888-888888888803', '22222222-2222-2222-2222-222222222222', 'Transport Fee (Zone 1)', 'Bus fleet transportation within 5 km')
ON CONFLICT (tenant_id, name) DO NOTHING;

INSERT INTO fee_structures (id, tenant_id, academic_session_id, category_id, class_id, amount, frequency, due_day)
VALUES
('99999999-9999-9999-9999-999999999901', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', '88888888-8888-8888-8888-888888888801', '66666666-6666-6666-6666-666666666602', 6500.00, 'monthly', 10),
('99999999-9999-9999-9999-999999999902', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', '88888888-8888-8888-8888-888888888802', '66666666-6666-6666-6666-666666666602', 15000.00, 'annual', 15)
ON CONFLICT (tenant_id, academic_session_id, category_id, class_id) DO NOTHING;
