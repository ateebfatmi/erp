export type BoardAffiliation = 'CBSE' | 'ICSE' | 'State Board' | 'IB' | 'Cambridge';

export type TenantStatus = 'active' | 'suspended' | 'trial' | 'inactive';

export interface Tenant {
  id: string;
  subscription_id?: string;
  name: string;
  slug: string;
  affiliation: BoardAffiliation;
  affiliation_number?: string;
  custom_domain?: string;
  logo_url?: string;
  primary_email: string;
  primary_phone: string;
  address?: string;
  city: string;
  state: string;
  pincode?: string;
  status: TenantStatus;
  trial_ends_at?: string;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Campus {
  id: string;
  tenant_id: string;
  name: string;
  code: string;
  address: string;
  phone?: string;
  email?: string;
  is_main: boolean;
  created_at: string;
}

export interface AcademicSession {
  id: string;
  tenant_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
}

export interface UserProfile {
  id: string;
  clerk_user_id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
}

export type SystemRoleKey = 
  | 'platform_super_admin'
  | 'school_admin'
  | 'principal'
  | 'vice_principal'
  | 'teacher'
  | 'accountant'
  | 'admission_manager'
  | 'parent'
  | 'student';

export interface TenantMembership {
  id: string;
  tenant_id: string;
  user_id: string;
  campus_id?: string;
  role_key: SystemRoleKey | string;
  status: 'active' | 'invited' | 'suspended';
}

export interface ClassGrade {
  id: string;
  tenant_id: string;
  name: string;
  display_order: number;
}

export interface Section {
  id: string;
  tenant_id: string;
  class_id: string;
  name: string;
  capacity: number;
}

export interface Subject {
  id: string;
  tenant_id: string;
  name: string;
  code: string;
  type: 'theory' | 'practical' | 'both';
}

export interface Student {
  id: string;
  tenant_id: string;
  admission_number: string;
  full_name: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  blood_group?: string;
  aadhaar_number?: string;
  medical_notes?: string;
  status: 'active' | 'graduated' | 'transferred' | 'withdrawn';
  created_at: string;
}

export interface StudentEnrollment {
  id: string;
  tenant_id: string;
  campus_id: string;
  student_id: string;
  academic_session_id: string;
  class_id: string;
  section_id: string;
  roll_number?: number;
  status: 'active' | 'promoted' | 'detained';
  // Joined fields
  student?: Student;
  class_name?: string;
  section_name?: string;
  campus_name?: string;
}

export interface Guardian {
  id: string;
  tenant_id: string;
  user_id?: string;
  full_name: string;
  relationship: string;
  phone: string;
  email?: string;
  occupation?: string;
  address?: string;
}

export interface Employee {
  id: string;
  tenant_id: string;
  user_id?: string;
  campus_id?: string;
  employee_code: string;
  full_name: string;
  email: string;
  phone: string;
  joining_date: string;
  department_name: string;
  designation_name: string;
  basic_salary: number;
  status: 'active' | 'resigned' | 'terminated' | 'on_leave';
}

export interface StudentAttendance {
  id: string;
  tenant_id: string;
  enrollment_id: string;
  attendance_date: string;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'excused';
  remarks?: string;
}

export interface FeeCategory {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
}

export interface FeeStructure {
  id: string;
  tenant_id: string;
  academic_session_id: string;
  category_id: string;
  class_id: string;
  amount: number;
  frequency: 'one_time' | 'monthly' | 'quarterly' | 'half_yearly' | 'annual';
  due_day: number;
}

export interface StudentFeeAllocation {
  id: string;
  tenant_id: string;
  enrollment_id: string;
  structure_id: string;
  title: string;
  due_date: string;
  due_amount: number;
  discount_amount: number;
  paid_amount: number;
  status: 'unpaid' | 'partially_paid' | 'paid' | 'waived';
}

export interface FeeTransaction {
  id: string;
  tenant_id: string;
  receipt_number: string;
  enrollment_id: string;
  total_amount: number;
  payment_method: 'razorpay' | 'upi' | 'cash' | 'cheque' | 'bank_transfer' | 'dd';
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  reference_number?: string;
  status: 'pending' | 'successful' | 'failed' | 'refunded';
  recorded_at: string;
  student_name?: string;
  admission_number?: string;
}

export interface ExamTerm {
  id: string;
  tenant_id: string;
  academic_session_id: string;
  name: string;
  weightage_percent: number;
  is_published: boolean;
}

export interface ExamSchedule {
  id: string;
  tenant_id: string;
  term_id: string;
  class_id: string;
  subject_id: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  max_marks: number;
  pass_marks: number;
  subject_name?: string;
}

export interface ExamMark {
  id: string;
  tenant_id: string;
  schedule_id: string;
  enrollment_id: string;
  marks_obtained: number;
  is_absent: boolean;
  remarks?: string;
  subject_name?: string;
  max_marks?: number;
}

export interface TimetableSlot {
  id: string;
  tenant_id: string;
  academic_session_id: string;
  section_id: string;
  period_number: number;
  period_name: string;
  start_time: string;
  end_time: string;
  day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  subject_name: string;
  teacher_name: string;
  room_number: string;
}

export interface TransportRoute {
  id: string;
  tenant_id: string;
  route_name: string;
  vehicle_number: string;
  driver_name: string;
  driver_phone: string;
  capacity: number;
  monthly_fee: number;
}

export interface LibraryBook {
  id: string;
  tenant_id: string;
  isbn?: string;
  title: string;
  author: string;
  publisher?: string;
  category: string;
  total_copies: number;
  available_copies: number;
  shelf_location?: string;
}
