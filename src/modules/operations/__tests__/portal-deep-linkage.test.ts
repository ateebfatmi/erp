import { describe, it, expect } from 'vitest';

// 1. Certificate Issuance & Request Logic
interface CertificateRequestPayload {
  studentName: string;
  admissionNo: string;
  type: string;
  purpose: string;
  urgency: 'Normal (3-5 Days)' | 'Urgent (24 Hours)';
}

function createCertificateRequest(payload: CertificateRequestPayload, seq: number): {
  requestRef: string;
  slaDays: number;
  status: string;
} {
  const requestRef = `REQ-CERT-2026-${String(seq).padStart(4, '0')}`;
  const slaDays = payload.urgency === 'Urgent (24 Hours)' ? 1 : 4;
  return {
    requestRef,
    slaDays,
    status: 'Pending Admin Review',
  };
}

// 2. Parent Homework Analytics
interface HomeworkTask {
  id: string;
  status: 'pending' | 'submitted' | 'evaluated';
  maxMarks: number;
  marksObtained?: number;
}

function calculateHomeworkKPIs(tasks: HomeworkTask[]): {
  completionRate: number;
  pendingCount: number;
  averageScorePercent: number;
} {
  const total = tasks.length;
  if (total === 0) return { completionRate: 0, pendingCount: 0, averageScorePercent: 0 };

  const submittedOrEvaluated = tasks.filter((t) => t.status === 'submitted' || t.status === 'evaluated').length;
  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const completionRate = Math.round((submittedOrEvaluated / total) * 100);

  const evaluatedTasks = tasks.filter((t) => t.status === 'evaluated' && t.marksObtained !== undefined);
  const totalObtained = evaluatedTasks.reduce((acc, t) => acc + (t.marksObtained || 0), 0);
  const totalMax = evaluatedTasks.reduce((acc, t) => acc + t.maxMarks, 0);

  const averageScorePercent = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;

  return { completionRate, pendingCount, averageScorePercent };
}

// 3. Demo Scenario Presets Validation
interface ScenarioMetric {
  label: string;
  value: string;
}

function validatePresetCompleteness(metrics: ScenarioMetric[]): boolean {
  return metrics.length >= 4 && metrics.every((m) => m.label.length > 0 && m.value.length > 0);
}

describe('Student & Parent Deep Linkage and Demo Suite', () => {
  describe('Certificate Application & Verification', () => {
    it('generates a sequential request reference and sets SLA based on urgency', () => {
      const urgentReq = createCertificateRequest(
        {
          studentName: 'Aarav Mehta',
          admissionNo: 'ADM-2022-0492',
          type: 'Bonafide Student Certificate',
          purpose: 'Passport Application',
          urgency: 'Urgent (24 Hours)',
        },
        42
      );

      expect(urgentReq.requestRef).toBe('REQ-CERT-2026-0042');
      expect(urgentReq.slaDays).toBe(1);
      expect(urgentReq.status).toBe('Pending Admin Review');

      const normalReq = createCertificateRequest(
        {
          studentName: 'Aarav Mehta',
          admissionNo: 'ADM-2022-0492',
          type: 'Character Certificate',
          purpose: 'Higher Education Admission',
          urgency: 'Normal (3-5 Days)',
        },
        43
      );

      expect(normalReq.requestRef).toBe('REQ-CERT-2026-0043');
      expect(normalReq.slaDays).toBe(4);
    });
  });

  describe('Parent Homework Tracking & Guardian KPI Analytics', () => {
    const sampleTasks: HomeworkTask[] = [
      { id: '1', status: 'evaluated', maxMarks: 25, marksObtained: 23 },
      { id: '2', status: 'evaluated', maxMarks: 20, marksObtained: 19 },
      { id: '3', status: 'submitted', maxMarks: 15 },
      { id: '4', status: 'pending', maxMarks: 30 },
    ];

    it('calculates completion rate and pending task counts accurately', () => {
      const kpis = calculateHomeworkKPIs(sampleTasks);
      expect(kpis.completionRate).toBe(75); // 3 out of 4 completed/submitted
      expect(kpis.pendingCount).toBe(1);
    });

    it('calculates average formative score percentage from evaluated tasks', () => {
      const kpis = calculateHomeworkKPIs(sampleTasks);
      // Evaluated marks: (23 + 19) / (25 + 20) = 42 / 45 = 93.3% -> 93%
      expect(kpis.averageScorePercent).toBe(93);
    });
  });

  describe('Interactive Demo Scenario Pre-Loader', () => {
    it('validates that each demo scenario has at least 4 well-formed metrics', () => {
      const metrics: ScenarioMetric[] = [
        { label: 'Active Students', value: '500' },
        { label: 'Faculty & Staff', value: '42' },
        { label: 'Fee Collection', value: '96.4%' },
        { label: 'Instruction Days', value: '224 Days' },
      ];

      expect(validatePresetCompleteness(metrics)).toBe(true);

      const invalidMetrics: ScenarioMetric[] = [
        { label: 'Students', value: '100' },
        { label: '', value: '20' },
      ];

      expect(validatePresetCompleteness(invalidMetrics)).toBe(false);
    });
  });
});
