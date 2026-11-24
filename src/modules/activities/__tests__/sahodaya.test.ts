import { describe, it, expect } from 'vitest';
import {
  calculateDelegationReadiness,
  calculateClusterTrophySummary,
  formatAgeGroup,
  formatCategory,
  INITIAL_SAHODAYA_EVENTS,
  SahodayaEvent,
} from '../sahodaya';

describe('CBSE Sahodaya School Complex & Delegation Module', () => {
  it('correctly handles empty delegation and flags readiness as false', () => {
    const emptyEvent: SahodayaEvent = {
      id: 'test-1',
      code: 'SAH-TEST-001',
      title: 'Empty Test Event',
      clusterName: 'Delhi Central',
      hostSchool: 'Host School',
      venueAddress: 'Delhi',
      eventDate: '2026-12-01',
      reportingTime: '08:00 AM',
      category: 'debate',
      ageGroup: 'under_17',
      status: 'registration',
      transportMode: 'school_bus',
      delegates: [],
      escorts: [],
    };

    const readiness = calculateDelegationReadiness(emptyEvent);
    expect(readiness.isReady).toBe(false);
    expect(readiness.totalDelegates).toBe(0);
    expect(readiness.blockingReasons).toContain('No students assigned to delegation roster');
  });

  it('detects pending parental NOC, missing medical clearance, and missing lead escort', () => {
    const incompleteEvent: SahodayaEvent = {
      id: 'test-2',
      code: 'SAH-TEST-002',
      title: 'MUN Delegation',
      clusterName: 'South Delhi Sahodaya',
      hostSchool: 'Modern School',
      venueAddress: 'Barakhamba Road',
      eventDate: '2026-12-05',
      reportingTime: '08:00 AM',
      category: 'mun',
      ageGroup: 'under_19',
      status: 'registration',
      transportMode: 'school_van',
      delegates: [
        {
          id: 'del-1',
          studentId: 'STU-1',
          studentName: 'Alice',
          grade: 'Class 11',
          section: 'A',
          role: 'Delegate',
          parentConsentNOC: 'verified',
          medicalClearance: true,
          emergencyPhone: '98101',
          bloodGroup: 'B+',
        },
        {
          id: 'del-2',
          studentId: 'STU-2',
          studentName: 'Bob',
          grade: 'Class 11',
          section: 'B',
          role: 'Delegate',
          parentConsentNOC: 'pending',
          medicalClearance: false,
          emergencyPhone: '98102',
          bloodGroup: 'O+',
        },
      ],
      escorts: [
        {
          id: 'esc-1',
          staffId: 'STAFF-1',
          name: 'Teacher A',
          designation: 'Teacher',
          phone: '98103',
          isLeadEscort: false,
        },
      ],
    };

    const readiness = calculateDelegationReadiness(incompleteEvent);
    expect(readiness.isReady).toBe(false);
    expect(readiness.missingNOCs).toBe(1);
    expect(readiness.missingMedical).toBe(1);
    expect(readiness.hasLeadEscort).toBe(false);
    expect(readiness.blockingReasons.length).toBe(3);
  });

  it('validates a 100% compliant delegation ready for off-campus departure', () => {
    const readyEvent = INITIAL_SAHODAYA_EVENTS.find((e) => e.id === 'sah-001')!;
    const readiness = calculateDelegationReadiness(readyEvent);

    expect(readiness.isReady).toBe(true);
    expect(readiness.missingNOCs).toBe(0);
    expect(readiness.missingMedical).toBe(0);
    expect(readiness.hasLeadEscort).toBe(true);
    expect(readiness.readinessPercentage).toBe(100);
    expect(readiness.blockingReasons.length).toBe(0);
  });

  it('calculates school cluster trophy points and category breakdown', () => {
    const summary = calculateClusterTrophySummary(INITIAL_SAHODAYA_EVENTS);

    // Initial events have 2 completed events:
    // sah-003: 1st place in sports_cluster -> 10 pts
    // sah-004: 2nd place in science_robotics -> 7 pts
    // Total = 17 pts
    expect(summary.totalPoints).toBe(17);
    expect(summary.firstPlaces).toBe(1);
    expect(summary.secondPlaces).toBe(1);
    expect(summary.totalParticipations).toBe(2);
    expect(summary.categoryBreakdown.sports_cluster).toBe(10);
    expect(summary.categoryBreakdown.science_robotics).toBe(7);
    expect(summary.categoryBreakdown.debate).toBe(0);
  });

  it('formats age groups and competition categories accurately', () => {
    expect(formatAgeGroup('under_14')).toBe('Junior (Under 14)');
    expect(formatAgeGroup('under_17')).toBe('Cadet / Inter (Under 17)');
    expect(formatCategory('debate')).toBe('Parliamentary Debate & Oratory');
    expect(formatCategory('sports_cluster')).toBe('CBSE Sports Cluster Championship');
  });
});
