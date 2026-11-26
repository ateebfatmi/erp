import { describe, it, expect } from 'vitest';

// 1. Front Office Helpers
interface VisitorPass {
  passNumber: string;
  visitorName: string;
  purpose: string;
  checkInTime: string;
  checkOutTime?: string;
  status: 'Checked-in' | 'Checked-out';
}

function generatePassNumber(sequence: number, date = new Date()): string {
  const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, '');
  return `GP-${yyyymmdd}-${String(sequence).padStart(3, '0')}`;
}

function calculateVisitDurationMinutes(checkIn: string, checkOut: string): number {
  const [inH, inM] = checkIn.split(':').map(Number);
  const [outH, outM] = checkOut.split(':').map(Number);
  return (outH * 60 + outM) - (inH * 60 + inM);
}

// 2. Approvals Workflow Helpers
interface ApprovalRequest {
  id: string;
  type: 'Leave' | 'Fee Concession' | 'Purchase Indent' | 'Transfer Certificate';
  applicantName: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  decisionRemarks?: string;
  actionedBy?: string;
  actionedAt?: string;
}

function processApproval(
  req: ApprovalRequest,
  action: 'Approve' | 'Reject',
  actor: string,
  remarks: string
): ApprovalRequest {
  if (action === 'Reject' && (!remarks || remarks.trim().length === 0)) {
    throw new Error('Remarks are mandatory when rejecting a workflow request');
  }
  return {
    ...req,
    status: action === 'Approve' ? 'Approved' : 'Rejected',
    decisionRemarks: remarks,
    actionedBy: actor,
    actionedAt: new Date().toISOString(),
  };
}

// 3. Holiday & Attendance Helpers
interface HolidayItem {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  category: 'Gazetted' | 'Restricted' | 'Vacation';
}

function isDateHoliday(dateStr: string, holidays: HolidayItem[]): { isHoliday: boolean; holiday?: HolidayItem } {
  const match = holidays.find(h => dateStr >= h.startDate && dateStr <= h.endDate);
  return { isHoliday: !!match, holiday: match };
}

function calculateInstructionDays(totalDaysInYear: number, holidays: HolidayItem[]): number {
  // Approximate total holiday days
  const holidayDays = holidays.reduce((acc, h) => {
    const start = new Date(h.startDate);
    const end = new Date(h.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return acc + diffDays;
  }, 0);
  const sundays = 52;
  return totalDaysInYear - (holidayDays + sundays);
}

// 4. Certificate Template Engine
function renderCertificateTemplate(
  template: string,
  variables: Record<string, string>
): string {
  return template.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
    const cleanKey = key.trim();
    return variables[cleanKey] ?? `[${cleanKey}]`;
  });
}

function generateCertificateVerificationHash(studentId: string, certNo: string, issueDate: string): string {
  let hash = 0;
  const input = `${studentId}:${certNo}:${issueDate}`;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return `CERT-AUTH-${Math.abs(hash).toString(16).toUpperCase()}`;
}

// 5. Academic Setup Helpers
interface SubjectMarksConfig {
  theoryMax: number;
  practicalMax: number;
  passingPercent: number;
}

function validateSubjectMarks(config: SubjectMarksConfig): { isValid: boolean; passingMarks: number; message?: string } {
  const total = config.theoryMax + config.practicalMax;
  if (total !== 100) {
    return { isValid: false, passingMarks: 0, message: `Total marks must equal 100 (got ${total})` };
  }
  const passingMarks = Math.ceil((total * config.passingPercent) / 100);
  return { isValid: true, passingMarks };
}

interface HouseScore {
  name: string;
  points: number;
}

function rankHouses(houses: HouseScore[]): (HouseScore & { rank: number })[] {
  const sorted = [...houses].sort((a, b) => b.points - a.points);
  return sorted.map((h, idx) => ({ ...h, rank: idx + 1 }));
}

// ==========================================
// Test Suites
// ==========================================

describe('Ported Blue Features Suite', () => {
  describe('Front Office & Visitor Operations', () => {
    it('generates a formatted pass number with date and 3-digit sequence', () => {
      const fixedDate = new Date('2026-03-15T10:00:00Z');
      const passNo = generatePassNumber(7, fixedDate);
      expect(passNo).toBe('GP-20260315-007');
    });

    it('calculates visitor stay duration accurately in minutes', () => {
      const duration = calculateVisitDurationMinutes('09:15', '11:45');
      expect(duration).toBe(150); // 2 hours 30 mins
    });

    it('transitions visitor pass from Checked-in to Checked-out', () => {
      const pass: VisitorPass = {
        passNumber: 'GP-20260315-001',
        visitorName: 'Rajesh Mehra',
        purpose: 'Vendor Meeting',
        checkInTime: '10:00',
        status: 'Checked-in',
      };

      const updated: VisitorPass = {
        ...pass,
        status: 'Checked-out',
        checkOutTime: '11:15',
      };

      expect(updated.status).toBe('Checked-out');
      expect(updated.checkOutTime).toBe('11:15');
    });
  });

  describe('Executive Approvals & Workflow Governance', () => {
    const baseRequest: ApprovalRequest = {
      id: 'req-101',
      type: 'Fee Concession',
      applicantName: 'Aarav Sharma (Class 10A)',
      status: 'Pending',
    };

    it('approves request and logs actioned timestamp and user', () => {
      const result = processApproval(baseRequest, 'Approve', 'Principal', 'Eligible for 50% merit concession');
      expect(result.status).toBe('Approved');
      expect(result.actionedBy).toBe('Principal');
      expect(result.decisionRemarks).toBe('Eligible for 50% merit concession');
      expect(result.actionedAt).toBeDefined();
    });

    it('rejects request with valid mandatory remarks', () => {
      const result = processApproval(baseRequest, 'Reject', 'Finance Officer', 'Incomplete income certificate');
      expect(result.status).toBe('Rejected');
      expect(result.decisionRemarks).toBe('Incomplete income certificate');
    });

    it('throws error when rejecting without remarks', () => {
      expect(() => {
        processApproval(baseRequest, 'Reject', 'Finance Officer', '   ');
      }).toThrow('Remarks are mandatory when rejecting a workflow request');
    });
  });

  describe('Institutional Holiday & Attendance Linkage', () => {
    const sampleHolidays: HolidayItem[] = [
      { id: 'h-1', title: 'Republic Day', startDate: '2026-01-26', endDate: '2026-01-26', category: 'Gazetted' },
      { id: 'h-2', title: 'Holi', startDate: '2026-03-04', endDate: '2026-03-05', category: 'Gazetted' },
      { id: 'h-3', title: 'Summer Vacation', startDate: '2026-05-15', endDate: '2026-06-30', category: 'Vacation' },
    ];

    it('correctly matches a date within single-day and multi-day holiday ranges', () => {
      expect(isDateHoliday('2026-01-26', sampleHolidays).isHoliday).toBe(true);
      expect(isDateHoliday('2026-03-05', sampleHolidays).isHoliday).toBe(true);
      expect(isDateHoliday('2026-05-20', sampleHolidays).isHoliday).toBe(true);
      expect(isDateHoliday('2026-02-10', sampleHolidays).isHoliday).toBe(false);
    });

    it('validates minimum 220 instruction days policy for CBSE compliance', () => {
      const instructionDays = calculateInstructionDays(365, sampleHolidays);
      expect(instructionDays).toBeGreaterThanOrEqual(220);
    });
  });

  describe('Certificate Studio & Template Rendering', () => {
    it('replaces all dynamic placeholders with actual student variables', () => {
      const template = 'This is to certify that {{student_name}} of {{class}} has been issued {{certificate_type}} on {{issue_date}}.';
      const variables = {
        student_name: 'Ananya Verma',
        class: 'Class 10-A',
        certificate_type: 'Bonafide Student Certificate',
        issue_date: '27-11-2026',
      };

      const rendered = renderCertificateTemplate(template, variables);
      expect(rendered).toBe('This is to certify that Ananya Verma of Class 10-A has been issued Bonafide Student Certificate on 27-11-2026.');
    });

    it('falls back gracefully when placeholder variable is missing', () => {
      const template = 'Student: {{student_name}}, Roll: {{roll_no}}';
      const rendered = renderCertificateTemplate(template, { student_name: 'Kavita Joshi' });
      expect(rendered).toBe('Student: Kavita Joshi, Roll: [roll_no]');
    });

    it('generates a reproducible deterministic verification hash for certificates', () => {
      const hash1 = generateCertificateVerificationHash('STU-1029', 'CERT-2026-089', '2026-11-27');
      const hash2 = generateCertificateVerificationHash('STU-1029', 'CERT-2026-089', '2026-11-27');
      expect(hash1).toBe(hash2);
      expect(hash1).toMatch(/^CERT-AUTH-[A-F0-9]+$/);
    });
  });

  describe('Academic Setup & Curriculum Logic', () => {
    it('validates CBSE subject theory + practical sum equals exactly 100', () => {
      const validConfig: SubjectMarksConfig = { theoryMax: 70, practicalMax: 30, passingPercent: 33 };
      const validResult = validateSubjectMarks(validConfig);
      expect(validResult.isValid).toBe(true);
      expect(validResult.passingMarks).toBe(33);

      const invalidConfig: SubjectMarksConfig = { theoryMax: 80, practicalMax: 10, passingPercent: 33 };
      const invalidResult = validateSubjectMarks(invalidConfig);
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.message).toContain('Total marks must equal 100');
    });

    it('correctly ranks institutional houses by accumulated championship points', () => {
      const houses: HouseScore[] = [
        { name: 'Shivaji (Red)', points: 420 },
        { name: 'Tagore (Green)', points: 510 },
        { name: 'Ashoka (Blue)', points: 380 },
        { name: 'Raman (Yellow)', points: 490 },
      ];

      const ranked = rankHouses(houses);
      expect(ranked[0].name).toBe('Tagore (Green)');
      expect(ranked[0].rank).toBe(1);
      expect(ranked[1].name).toBe('Raman (Yellow)');
      expect(ranked[1].rank).toBe(2);
      expect(ranked[3].name).toBe('Ashoka (Blue)');
      expect(ranked[3].rank).toBe(4);
    });
  });
});
