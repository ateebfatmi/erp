import { describe, it, expect } from 'vitest';
import {
  calculateHollandCode,
  evaluateEntranceExamReadiness,
  validateUniversityDossier,
  computeCounselingCellMetrics,
  INITIAL_COUNSELING_STUDENTS,
  EntranceMockScore,
  UniversityApplication,
} from '../career-counseling';

describe('CBSE Career Guidance & RIASEC Assessment Engine', () => {
  it('correctly calculates 3-letter Holland code and career clusters', () => {
    const scores = {
      Realistic: 42,
      Investigative: 48,
      Artistic: 18,
      Social: 24,
      Enterprising: 32,
      Conventional: 26,
    };

    const result = calculateHollandCode(scores);
    expect(result.primary).toBe('Investigative');
    expect(result.secondary).toBe('Realistic');
    expect(result.tertiary).toBe('Enterprising');
    expect(result.fullCode).toBe('IRE');
    expect(result.recommendedDisciplines.length).toBeGreaterThan(0);
    expect(result.careerClusters.length).toBeGreaterThan(0);
    expect(result.traitSummary).toContain('research');
  });

  it('evaluates entrance examination readiness and classifies tiers', () => {
    const mocks: EntranceMockScore[] = [
      {
        id: 'MOCK-1',
        studentId: 'STU-1',
        examCode: 'JEE_MAIN',
        testDate: '2026-10-01',
        scoreObtained: 210,
        maximumScore: 300,
        percentile: 88.5,
        weakTopics: ['Rotational Dynamics'],
        strongTopics: ['Calculus'],
      },
      {
        id: 'MOCK-2',
        studentId: 'STU-1',
        examCode: 'JEE_MAIN',
        testDate: '2026-11-01',
        scoreObtained: 245,
        maximumScore: 300,
        percentile: 95.2,
        weakTopics: ['Rotational Dynamics', 'Ionic Equilibrium'],
        strongTopics: ['Modern Physics', 'Optics'],
      },
    ];

    const evaluation = evaluateEntranceExamReadiness(mocks);
    expect(evaluation.examCode).toBe('JEE_MAIN');
    expect(evaluation.attemptCount).toBe(2);
    expect(evaluation.latestPercentile).toBe(95.2);
    expect(evaluation.readinessTier).toBe('High');
    expect(evaluation.commonWeakTopics).toContain('Rotational Dynamics');
  });

  it('validates university application dossiers and identifies missing requirements', () => {
    const partialApp: UniversityApplication = {
      id: 'APP-TEST',
      studentId: 'STU-1',
      universityName: 'Delhi University',
      courseTitle: 'B.Com (Hons)',
      country: 'India',
      applicationPortal: 'https://ugadmission.uod.ac.in',
      deadlineDate: '2026-06-30',
      sopDrafted: true,
      lorRequested: true,
      lorReceived: false, // LOR pending
      entranceScoreUploaded: false, // Score pending
      applicationFeePaid: true,
      submissionStatus: 'Drafting',
    };

    const result = validateUniversityDossier(partialApp);
    expect(result.isReadyForSubmission).toBe(false);
    expect(result.completionPercentage).toBe(50);
    expect(result.pendingItems.length).toBe(2);

    // Now complete all items
    const completeApp: UniversityApplication = {
      ...partialApp,
      lorReceived: true,
      entranceScoreUploaded: true,
    };
    const completeResult = validateUniversityDossier(completeApp);
    expect(completeResult.isReadyForSubmission).toBe(true);
    expect(completeResult.completionPercentage).toBe(100);
    expect(completeResult.pendingItems.length).toBe(0);
  });

  it('computes institutional counseling cell metrics across student cohort', () => {
    const metrics = computeCounselingCellMetrics(INITIAL_COUNSELING_STUDENTS);

    expect(metrics.totalStudentsMonitored).toBe(3);
    expect(metrics.riasecAssessedCount).toBe(3);
    expect(metrics.riasecAssessmentCoverageRate).toBe(100);
    expect(metrics.counselingSessionsConducted).toBe(3);
    expect(metrics.activeUniversityApplications).toBe(3);
    expect(metrics.studentsInHighReadinessTier).toBeGreaterThanOrEqual(1);
    expect(metrics.topTargetExams.length).toBeGreaterThan(0);
  });
});
