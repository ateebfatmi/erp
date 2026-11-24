import {
  MOCK_TENANT,
  MOCK_CAMPUSES,
  MOCK_ACADEMIC_SESSIONS,
  MOCK_CLASSES,
  MOCK_SECTIONS,
  MOCK_ENROLLMENTS,
  MOCK_EMPLOYEES,
  MOCK_ATTENDANCE,
  MOCK_FEE_CATEGORIES,
  MOCK_FEE_ALLOCATIONS,
  MOCK_FEE_TRANSACTIONS,
  MOCK_EXAM_TERMS,
  MOCK_EXAM_SCHEDULES,
  MOCK_EXAM_MARKS,
  MOCK_TIMETABLE_SLOTS,
  MOCK_TRANSPORT_ROUTES,
  MOCK_LIBRARY_BOOKS,
} from './mock-data';
import {
  Tenant,
  Campus,
  AcademicSession,
  ClassGrade,
  Section,
  StudentEnrollment,
  Employee,
  StudentAttendance,
  StudentFeeAllocation,
  FeeTransaction,
  ExamTerm,
  ExamSchedule,
  ExamMark,
  TimetableSlot,
  TransportRoute,
  LibraryBook,
} from './types';
import { createAdminSupabase } from './supabase';

// Operational repository with live Supabase client & intelligent fallback
class ErpRepository {
  private tenants: Tenant[] = [MOCK_TENANT];
  private campuses: Campus[] = [...MOCK_CAMPUSES];
  private sessions: AcademicSession[] = [...MOCK_ACADEMIC_SESSIONS];
  private classes: ClassGrade[] = [...MOCK_CLASSES];
  private sections: Section[] = [...MOCK_SECTIONS];
  private enrollments: StudentEnrollment[] = [...MOCK_ENROLLMENTS];
  private employees: Employee[] = [...MOCK_EMPLOYEES];
  private attendance: StudentAttendance[] = [...MOCK_ATTENDANCE];
  private feeAllocations: StudentFeeAllocation[] = [...MOCK_FEE_ALLOCATIONS];
  private feeTransactions: FeeTransaction[] = [...MOCK_FEE_TRANSACTIONS];
  private examTerms: ExamTerm[] = [...MOCK_EXAM_TERMS];
  private examSchedules: ExamSchedule[] = [...MOCK_EXAM_SCHEDULES];
  private examMarks: ExamMark[] = [...MOCK_EXAM_MARKS];
  private timetableSlots: TimetableSlot[] = [...MOCK_TIMETABLE_SLOTS];
  private transportRoutes: TransportRoute[] = [...MOCK_TRANSPORT_ROUTES];
  private libraryBooks: LibraryBook[] = [...MOCK_LIBRARY_BOOKS];

  private getSupabase() {
    try {
      return createAdminSupabase();
    } catch {
      return null;
    }
  }

  // 1. Tenancy & Campus
  async getTenantBySlug(slug: string): Promise<Tenant | null> {
    const local = this.tenants.find((t) => t.slug === slug || t.id === slug);
    if (local) return local;
    if (process.env.NODE_ENV === 'test') return null;

    const supabase = this.getSupabase();
    if (supabase) {
      try {
        const { data } = await supabase
          .from('tenants')
          .select('*')
          .or(`slug.eq.${slug},id.eq.${slug}`)
          .maybeSingle();
        if (data) return data as Tenant;
      } catch {
        // Fallback to local store
      }
    }
    return null;
  }

  async getCampuses(tenantId: string): Promise<Campus[]> {
    const supabase = this.getSupabase();
    if (supabase) {
      try {
        const { data } = await supabase
          .from('campuses')
          .select('*')
          .eq('tenant_id', tenantId);
        if (data && data.length > 0) return data as Campus[];
      } catch {
        // Fallback
      }
    }
    return this.campuses.filter((c) => c.tenant_id === tenantId);
  }

  async getAcademicSessions(tenantId: string): Promise<AcademicSession[]> {
    const supabase = this.getSupabase();
    if (supabase) {
      try {
        const { data } = await supabase
          .from('academic_sessions')
          .select('*')
          .eq('tenant_id', tenantId);
        if (data && data.length > 0) return data as AcademicSession[];
      } catch {
        // Fallback
      }
    }
    return this.sessions.filter((s) => s.tenant_id === tenantId);
  }

  // 2. Classes & Academics
  async getClasses(tenantId: string): Promise<ClassGrade[]> {
    const supabase = this.getSupabase();
    if (supabase) {
      try {
        const { data } = await supabase
          .from('classes')
          .select('*')
          .eq('tenant_id', tenantId)
          .order('display_order', { ascending: true });
        if (data && data.length > 0) return data as ClassGrade[];
      } catch {
        // Fallback
      }
    }
    return this.classes.filter((c) => c.tenant_id === tenantId);
  }

  async getSections(tenantId: string, classId?: string): Promise<Section[]> {
    const supabase = this.getSupabase();
    if (supabase) {
      try {
        let query = supabase.from('sections').select('*').eq('tenant_id', tenantId);
        if (classId) query = query.eq('class_id', classId);
        const { data } = await query;
        if (data && data.length > 0) return data as Section[];
      } catch {
        // Fallback
      }
    }
    return this.sections.filter(
      (s) => s.tenant_id === tenantId && (!classId || s.class_id === classId)
    );
  }

  // 3. Students & Enrollments
  async getEnrollments(
    tenantId: string,
    filters?: { classId?: string; sectionId?: string; search?: string }
  ): Promise<StudentEnrollment[]> {
    return this.enrollments.filter((e) => {
      if (e.tenant_id !== tenantId) return false;
      if (filters?.classId && e.class_id !== filters.classId) return false;
      if (filters?.sectionId && e.section_id !== filters.sectionId) return false;
      if (filters?.search) {
        const query = filters.search.toLowerCase();
        const nameMatch = e.student?.full_name.toLowerCase().includes(query);
        const admMatch = e.student?.admission_number.toLowerCase().includes(query);
        if (!nameMatch && !admMatch) return false;
      }
      return true;
    });
  }

  async getEnrollmentById(tenantId: string, enrollmentId: string): Promise<StudentEnrollment | null> {
    const item = this.enrollments.find((e) => e.tenant_id === tenantId && e.id === enrollmentId);
    return item || null;
  }

  async createStudentEnrollment(
    tenantId: string,
    payload: {
      fullName: string;
      admissionNumber: string;
      dob: string;
      gender: 'male' | 'female' | 'other';
      classId: string;
      sectionId: string;
      campusId: string;
    }
  ): Promise<StudentEnrollment> {
    const classObj = this.classes.find((c) => c.id === payload.classId);
    const secObj = this.sections.find((s) => s.id === payload.sectionId);
    const campusObj = this.campuses.find((c) => c.id === payload.campusId);

    const newStudentId = `stu-${Date.now()}`;
    const newEnrollmentId = `enr-${Date.now()}`;

    const newEnrollment: StudentEnrollment = {
      id: newEnrollmentId,
      tenant_id: tenantId,
      campus_id: payload.campusId,
      student_id: newStudentId,
      academic_session_id: 'session-2025-2026',
      class_id: payload.classId,
      section_id: payload.sectionId,
      roll_number: this.enrollments.length + 1,
      status: 'active',
      class_name: classObj?.name || 'Class',
      section_name: secObj?.name || 'A',
      campus_name: campusObj?.name || 'Main Campus',
      student: {
        id: newStudentId,
        tenant_id: tenantId,
        admission_number: payload.admissionNumber,
        full_name: payload.fullName,
        dob: payload.dob,
        gender: payload.gender,
        status: 'active',
        created_at: new Date().toISOString(),
      },
    };

    this.enrollments.push(newEnrollment);

    // Auto-create initial quarterly fee allocation
    const feeAlloc: StudentFeeAllocation = {
      id: `alloc-${Date.now()}`,
      tenant_id: tenantId,
      enrollment_id: newEnrollmentId,
      structure_id: 'struct-10-q4',
      title: 'Term Admission & Tuition Dues',
      due_date: '2027-01-15',
      due_amount: 19500,
      discount_amount: 0,
      paid_amount: 0,
      status: 'unpaid',
    };
    this.feeAllocations.push(feeAlloc);

    // Also attempt live Supabase insertion if connected
    const supabase = this.getSupabase();
    if (supabase) {
      try {
        await supabase.from('students').insert({
          id: newStudentId,
          tenant_id: tenantId,
          admission_number: payload.admissionNumber,
          full_name: payload.fullName,
          dob: payload.dob,
          gender: payload.gender,
          status: 'active',
        });
      } catch {
        // Fallback
      }
    }

    return newEnrollment;
  }

  // 4. Staff & Teachers
  async getEmployees(tenantId: string): Promise<Employee[]> {
    return this.employees.filter((emp) => emp.tenant_id === tenantId);
  }

  // 5. Attendance
  async getAttendanceByDate(
    tenantId: string,
    attendanceDate: string,
    sectionId?: string
  ): Promise<StudentAttendance[]> {
    return this.attendance.filter((a) => {
      if (a.tenant_id !== tenantId) return false;
      if (a.attendance_date !== attendanceDate) return false;
      if (sectionId) {
        const enr = this.enrollments.find((e) => e.id === a.enrollment_id);
        if (enr?.section_id !== sectionId) return false;
      }
      return true;
    });
  }

  async markAttendance(
    tenantId: string,
    records: Array<{
      enrollmentId: string;
      attendanceDate: string;
      status: 'present' | 'absent' | 'late' | 'half_day' | 'excused';
      remarks?: string;
    }>
  ): Promise<{ recordedCount: number }> {
    for (const r of records) {
      const idx = this.attendance.findIndex(
        (a) =>
          a.tenant_id === tenantId &&
          a.enrollment_id === r.enrollmentId &&
          a.attendance_date === r.attendanceDate
      );
      if (idx >= 0) {
        this.attendance[idx].status = r.status;
        this.attendance[idx].remarks = r.remarks;
      } else {
        this.attendance.push({
          id: `att-${Date.now()}-${Math.random()}`,
          tenant_id: tenantId,
          enrollment_id: r.enrollmentId,
          attendance_date: r.attendanceDate,
          status: r.status,
          remarks: r.remarks,
        });
      }
    }
    return { recordedCount: records.length };
  }

  // 6. Fees & Transactions
  async getFeeAllocations(tenantId: string, enrollmentId?: string): Promise<StudentFeeAllocation[]> {
    return this.feeAllocations.filter(
      (a) => a.tenant_id === tenantId && (!enrollmentId || a.enrollment_id === enrollmentId)
    );
  }

  async getFeeTransactions(tenantId: string): Promise<FeeTransaction[]> {
    return this.feeTransactions.filter((tx) => tx.tenant_id === tenantId);
  }

  async recordPayment(
    tenantId: string,
    payload: {
      enrollmentId: string;
      allocationIds: string[];
      amount: number;
      paymentMethod: 'razorpay' | 'upi' | 'cash' | 'cheque' | 'bank_transfer' | 'dd';
      referenceNumber?: string;
      razorpayPaymentId?: string;
    }
  ): Promise<FeeTransaction> {
    const enr = this.enrollments.find((e) => e.id === payload.enrollmentId);
    const receiptNum = `REC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newTx: FeeTransaction = {
      id: `tx-${Date.now()}`,
      tenant_id: tenantId,
      receipt_number: receiptNum,
      enrollment_id: payload.enrollmentId,
      total_amount: payload.amount,
      payment_method: payload.paymentMethod,
      razorpay_payment_id: payload.razorpayPaymentId,
      reference_number: payload.referenceNumber,
      status: 'successful',
      recorded_at: new Date().toISOString(),
      student_name: enr?.student?.full_name || 'Student',
      admission_number: enr?.student?.admission_number || 'N/A',
    };

    this.feeTransactions.unshift(newTx);

    // Update allocations
    let remainingAmount = payload.amount;
    for (const allocId of payload.allocationIds) {
      const alloc = this.feeAllocations.find((a) => a.id === allocId);
      if (alloc && remainingAmount > 0) {
        const needed = alloc.due_amount - alloc.discount_amount - alloc.paid_amount;
        const settle = Math.min(needed, remainingAmount);
        alloc.paid_amount += settle;
        if (alloc.paid_amount >= alloc.due_amount - alloc.discount_amount) {
          alloc.status = 'paid';
        } else {
          alloc.status = 'partially_paid';
        }
        remainingAmount -= settle;
      }
    }

    return newTx;
  }

  // 7. Exams & Marks
  async getExamTerms(tenantId: string): Promise<ExamTerm[]> {
    return this.examTerms.filter((t) => t.tenant_id === tenantId);
  }

  async getExamMarksByEnrollment(tenantId: string, enrollmentId: string): Promise<ExamMark[]> {
    return this.examMarks.filter(
      (m) => m.tenant_id === tenantId && m.enrollment_id === enrollmentId
    );
  }

  // 8. Timetable
  async getTimetableSlots(tenantId: string, sectionId?: string): Promise<TimetableSlot[]> {
    return this.timetableSlots.filter(
      (s) => s.tenant_id === tenantId && (!sectionId || s.section_id === sectionId)
    );
  }

  // 9. Facilities
  async getTransportRoutes(tenantId: string): Promise<TransportRoute[]> {
    return this.transportRoutes.filter((r) => r.tenant_id === tenantId);
  }

  async getLibraryBooks(tenantId: string): Promise<LibraryBook[]> {
    return this.libraryBooks.filter((b) => b.tenant_id === tenantId);
  }

  // 10. Dashboard Analytics
  async getDashboardAnalytics(tenantId: string) {
    const totalStudents = this.enrollments.filter((e) => e.tenant_id === tenantId).length;
    const totalEmployees = this.employees.filter((emp) => emp.tenant_id === tenantId).length;
    const totalCampuses = this.campuses.filter((c) => c.tenant_id === tenantId).length;

    const todayStr = '2026-11-24';
    const todayAttendance = this.attendance.filter(
      (a) => a.tenant_id === tenantId && a.attendance_date === todayStr
    );
    const presentCount = todayAttendance.filter((a) => a.status === 'present').length;
    const attendanceRate = todayAttendance.length > 0 
      ? Math.round((presentCount / todayAttendance.length) * 100) 
      : 95;

    const allTx = this.feeTransactions.filter((tx) => tx.tenant_id === tenantId && tx.status === 'successful');
    const totalCollected = allTx.reduce((acc, curr) => acc + curr.total_amount, 0);

    const allAlloc = this.feeAllocations.filter((a) => a.tenant_id === tenantId);
    const totalDue = allAlloc.reduce((acc, curr) => acc + (curr.due_amount - curr.discount_amount - curr.paid_amount), 0);

    return {
      totalStudents,
      totalEmployees,
      totalCampuses,
      todayAttendanceRate: attendanceRate,
      feeCollectionTotal: totalCollected,
      feePendingTotal: totalDue,
      recentTransactions: allTx.slice(0, 5),
    };
  }
}

export const repository = new ErpRepository();
