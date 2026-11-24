import { describe, it, expect } from 'vitest';
import {
  fileSafetyIncident,
  updateIncidentStatus,
  evaluateCampusSafetyScore,
  INITIAL_SAFETY_INCIDENTS,
  INITIAL_SAFETY_CHECKLIST,
} from '../pocso-safety';

describe('CBSE POCSO Child Protection & Safety Engine', () => {
  it('should validate and file a confidential safety incident with statutory 24-hr deadline', () => {
    const report = fileSafetyIncident({
      incidentType: 'BULLYING_AND_HARASSMENT',
      severity: 'HIGH',
      isAnonymous: true,
      incidentDate: '2024-11-20',
      incidentLocation: 'Senior Wing Chemistry Corridor',
      narrativeDescription: 'Observed peer bullying and aggressive intimidation near the locker area.',
    });

    expect(report.id).toContain('CPC-');
    expect(report.isAnonymous).toBe(true);
    expect(report.complainantName).toBe('Confidential / Anonymous');
    expect(report.status).toBe('REPORTED');
    expect(report.statutory24HrDeadline).toBeDefined();

    // Check minimum length validation
    expect(() =>
      fileSafetyIncident({
        incidentType: 'POCSO_INAPPROPRIATE_TOUCH_OR_BEHAVIOR',
        severity: 'CRITICAL_MANDATORY_REPORTING',
        incidentDate: '2024-11-20',
        incidentLocation: 'Bus Stop',
        narrativeDescription: 'Too short', // < 20 chars
      })
    ).toThrowError(/minimum 20 characters/);
  });

  it('should update incident investigation status and attach committee action notes', () => {
    const updated = updateIncidentStatus(
      INITIAL_SAFETY_INCIDENTS,
      'CPC-2024-0012',
      'ACTION_TAKEN_RESOLVED',
      'Matter resolved post parental conference and student counseling.'
    );

    const record = updated.find((r) => r.id === 'CPC-2024-0012');
    expect(record?.status).toBe('ACTION_TAKEN_RESOLVED');
    expect(record?.committeeActionNotes).toContain('parental conference');
    expect(record?.resolutionDate).toBeDefined();
  });

  it('should compute statutory campus safety audit compliance scores and flag gaps', () => {
    const perfectScore = evaluateCampusSafetyScore(INITIAL_SAFETY_CHECKLIST);
    expect(perfectScore.totalChecks).toBe(5);
    expect(perfectScore.compliantChecks).toBe(5);
    expect(perfectScore.scorePercentage).toBe(100);
    expect(perfectScore.isStatutorilyApproved).toBe(true);
    expect(perfectScore.criticalGaps.length).toBe(0);

    // Test with gap
    const checklistWithGap = [
      ...INITIAL_SAFETY_CHECKLIST,
      {
        id: 'chk-fail',
        category: 'CCTV_SURVEILLANCE' as const,
        checkTitle: 'Playground Camera Offline',
        mandatoryStandard: 'Zero blind spots',
        isCompliant: false,
        lastAuditedDate: '2024-11-20',
        auditorNotes: 'Camera 14 disconnected',
      },
    ];

    const gapScore = evaluateCampusSafetyScore(checklistWithGap);
    expect(gapScore.isStatutorilyApproved).toBe(false);
    expect(gapScore.criticalGaps.length).toBe(1);
    expect(gapScore.criticalGaps[0].checkTitle).toBe('Playground Camera Offline');
  });
});
