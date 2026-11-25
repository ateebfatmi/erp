import { describe, it, expect } from 'vitest';
import {
  evaluateAtlLabHealth,
  updateProjectStage,
  INITIAL_ATL_INVENTORY,
  INITIAL_ATL_PROJECTS,
  INITIAL_MOC_SESSIONS,
  AtlEquipmentItem,
  AtlProject,
} from '../atal-tinkering-lab';

describe('NITI Aayog Atal Tinkering Lab (ATL) Engine', () => {
  it('evaluates lab health, AIM benchmarks, and composite tier', () => {
    const report = evaluateAtlLabHealth(
      INITIAL_ATL_INVENTORY,
      INITIAL_ATL_PROJECTS,
      INITIAL_MOC_SESSIONS,
      280, // >= 250
      72   // >= 60
    );

    expect(report.aimBenchmarkMonthlyHoursMet).toBe(true);
    expect(report.aimBenchmarkStudentReachMet).toBe(true);
    expect(report.equipmentFunctionalRatio).toBeGreaterThanOrEqual(90);
    expect(report.totalActiveProjects).toBe(3);
    expect(report.marathonSubmissionsCount).toBe(2);
    expect(report.overallLabHealthScore).toBeGreaterThanOrEqual(85);
    expect(report.healthTier).toBe('PLATINUM_INNOVATION_HUB');
    expect(report.complianceAlerts.length).toBe(0);
  });

  it('triggers compliance alerts when monthly tinkering hours and student reach fall below benchmark', () => {
    const report = evaluateAtlLabHealth(
      INITIAL_ATL_INVENTORY,
      INITIAL_ATL_PROJECTS,
      INITIAL_MOC_SESSIONS,
      120, // Below 250 threshold
      35   // Below 60 hour threshold
    );

    expect(report.aimBenchmarkMonthlyHoursMet).toBe(false);
    expect(report.aimBenchmarkStudentReachMet).toBe(false);
    expect(report.complianceAlerts.some((a) => a.includes('60-hour benchmark'))).toBe(true);
    expect(report.complianceAlerts.some((a) => a.includes('250-student threshold'))).toBe(true);
    expect(report.healthTier).toBe('GOLD_COMPLIANT');
  });

  it('updates project prototype lifecycle stage and mentor guidance', () => {
    const updated = updateProjectStage(
      INITIAL_ATL_PROJECTS,
      'PROJ-ATL-03',
      'FUNCTIONAL_PROTOTYPE',
      'PCB fabricated and sensor response verified.'
    );

    const project = updated.find((p) => p.id === 'PROJ-ATL-03');
    expect(project).toBeDefined();
    expect(project?.stage).toBe('FUNCTIONAL_PROTOTYPE');
    expect(project?.mentorFeedback).toContain('PCB fabricated');
  });
});
