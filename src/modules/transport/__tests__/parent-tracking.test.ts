import { describe, it, expect } from 'vitest';
import {
  estimateTimeToArrival,
  calculateRouteProgress,
  RouteStop,
  INITIAL_BUS_TELEMATICS,
} from '../parent-tracking';

describe('Parent Bus Live Telematics & ETA Engine', () => {
  it('calculates remaining ETA in minutes to student designated stop', () => {
    const afternoonStops: RouteStop[] = [
      {
        id: 'stp-1',
        name: 'Main Campus Gate 1',
        scheduledPickup: '07:55 AM',
        scheduledDrop: '02:00 PM',
        status: 'COMPLETED',
        isStudentAssignedStop: false,
      },
      {
        id: 'stp-2',
        name: 'Fortis Hospital Junction',
        scheduledPickup: '07:32 AM',
        scheduledDrop: '02:25 PM',
        status: 'CURRENT_STOP',
        isStudentAssignedStop: false,
      },
      {
        id: 'stp-3',
        name: 'Noida Sector 62 (Mother Dairy Booth)',
        scheduledPickup: '07:18 AM',
        scheduledDrop: '02:40 PM',
        status: 'UPCOMING',
        isStudentAssignedStop: true, // Target stop
      },
      {
        id: 'stp-4',
        name: 'Lajpat Nagar Central Market',
        scheduledPickup: '07:00 AM',
        scheduledDrop: '03:00 PM',
        status: 'UPCOMING',
        isStudentAssignedStop: false,
      },
    ];

    // Current stop is index 1, target is index 2 -> 1 stop away -> 1 * 6 = 6 mins
    const res = estimateTimeToArrival(afternoonStops, 6);
    expect(res.etaMinutes).toBe(6);
    expect(res.nextStopName).toBe('Fortis Hospital Junction');
    expect(res.isAlreadyReached).toBe(false);
  });

  it('detects when the student stop has already been served', () => {
    const morningStops = INITIAL_BUS_TELEMATICS.stops;
    const res = estimateTimeToArrival(morningStops);

    expect(res.isAlreadyReached).toBe(true);
    expect(res.etaMinutes).toBe(0);
  });

  it('calculates route progression percentage across stop milestones', () => {
    const progress = calculateRouteProgress(INITIAL_BUS_TELEMATICS.stops);

    expect(progress.totalCount).toBe(5);
    expect(progress.completedCount).toBe(4);
    expect(progress.progressPercentage).toBe(80);
  });
});
