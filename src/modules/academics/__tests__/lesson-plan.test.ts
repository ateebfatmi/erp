import { describe, it, expect } from 'vitest';
import {
  calculateNEPComplianceScore,
  filterLessonPlans,
  reviewLessonPlan,
  formatBloomLevel,
  formatPedagogy,
  INITIAL_LESSON_PLANS,
  LessonPlan,
} from '../lesson-plan';

describe('NEP 2020 Pedagogical Lesson Planner & Micro-Plan Desk', () => {
  it('correctly calculates high NEP compliance score for comprehensive lesson plan', () => {
    const physicsPlan = INITIAL_LESSON_PLANS.find((lp) => lp.id === 'lp-001')!;
    const compliance = calculateNEPComplianceScore(physicsPlan);

    expect(compliance.isCompliant).toBe(true);
    expect(compliance.score).toBe(100);
    expect(compliance.missingElements.length).toBe(0);
    expect(compliance.strengths).toContain('3 measurable NCERT Learning Outcomes defined');
    expect(compliance.strengths).toContain("Maps to Higher Order Thinking Skills (Bloom's HOTS L3-L6)");
  });

  it('flags missing Art/Sports integration, experiential activity, and CWSN accommodations', () => {
    const deficientPlan = INITIAL_LESSON_PLANS.find((lp) => lp.id === 'lp-004')!;
    const compliance = calculateNEPComplianceScore(deficientPlan);

    expect(compliance.isCompliant).toBe(false);
    expect(compliance.score).toBeLessThan(75);
    expect(compliance.missingElements).toContain(
      "Lacks Higher Order Thinking Skills; only relies on Recall/Understanding"
    );
    expect(compliance.missingElements).toContain(
      'Requires explicit Art or Sports integrated activity details (CBSE Circular)'
    );
    expect(compliance.missingElements).toContain(
      'Hands-on experiential discovery activity description missing or incomplete'
    );
    expect(compliance.missingElements).toContain(
      'Missing differentiated instruction notes for slow/gifted/CWSN learners'
    );
  });

  it('filters lesson plans by subject, grade, and approval status', () => {
    const mathPlans = filterLessonPlans(INITIAL_LESSON_PLANS, { subject: 'Mathematics' });
    expect(mathPlans.length).toBe(1);
    expect(mathPlans[0].chapterName).toContain('Trigonometry');

    const approvedPlans = filterLessonPlans(INITIAL_LESSON_PLANS, { status: 'approved' });
    expect(approvedPlans.length).toBe(1);
    expect(approvedPlans[0].id).toBe('lp-001');

    const grade10Plans = filterLessonPlans(INITIAL_LESSON_PLANS, { grade: 'Class 10' });
    expect(grade10Plans.length).toBe(2);
  });

  it('updates review status and attaches supervisor feedback', () => {
    const submittedPlan = INITIAL_LESSON_PLANS.find((lp) => lp.id === 'lp-002')!;
    const approved = reviewLessonPlan(
      submittedPlan,
      'approved',
      'Dr. Meenakshi Sundaram',
      'Excellent real-world outdoor clinometer surveying activity.'
    );

    expect(approved.status).toBe('approved');
    expect(approved.reviewerName).toBe('Dr. Meenakshi Sundaram');
    expect(approved.reviewerRemarks).toBe(
      'Excellent real-world outdoor clinometer surveying activity.'
    );
    expect(approved.reviewDate).toBeDefined();
  });

  it('formats Bloom levels and pedagogy labels accurately', () => {
    expect(formatBloomLevel('evaluating')).toBe('L5: Evaluating (Justify)');
    expect(formatBloomLevel('creating')).toBe('L6: Creating (Design)');
    expect(formatPedagogy('art_integrated')).toBe('Art-Integrated Learning (CBSE)');
    expect(formatPedagogy('experiential')).toBe('Experiential & Lab Inquiry');
  });
});
