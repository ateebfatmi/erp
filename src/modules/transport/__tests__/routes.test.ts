import { describe, it, expect } from 'vitest';
import {
  calculateTransportFeeSlab,
  evaluateCapacityCompliance,
  addStopToRoute,
  INITIAL_TRANSPORT_ROUTES,
  TransportRouteRecord,
} from '../routes';

describe('School Bus Routes, Stop Schedules & Distance Fee Slabs Engine', () => {
  it('correctly maps distance to statutory transport fee slabs', () => {
    // 0-5 km: Tier 1
    const tier1 = calculateTransportFeeSlab(3.5);
    expect(tier1.monthlyFeeInr).toBe(1800);
    expect(tier1.slabTier).toContain('Tier 1');

    // 5.1-10 km: Tier 2
    const tier2 = calculateTransportFeeSlab(8.2);
    expect(tier2.monthlyFeeInr).toBe(2400);
    expect(tier2.slabTier).toContain('Tier 2');

    // 10.1-15 km: Tier 3
    const tier3 = calculateTransportFeeSlab(14.0);
    expect(tier3.monthlyFeeInr).toBe(3000);
    expect(tier3.slabTier).toContain('Tier 3');

    // > 15 km: Tier 4
    const tier4 = calculateTransportFeeSlab(19.5);
    expect(tier4.monthlyFeeInr).toBe(3600);
    expect(tier4.slabTier).toContain('Tier 4');
  });

  it('validates Supreme Court capacity guidelines and detects overloading', () => {
    const route = INITIAL_TRANSPORT_ROUTES[0]; // 36 / 40 seats
    const compliance = evaluateCapacityCompliance(route);
    expect(compliance.isCompliant).toBe(true);
    expect(compliance.seatsOccupied).toBe(36);
    expect(compliance.totalCapacity).toBe(40);
    expect(compliance.utilizationPercent).toBe(90);

    // Overloaded route: 45 students in 40-seater
    const overloadedRoute: TransportRouteRecord = {
      ...route,
      stops: [
        ...route.stops,
        {
          stopId: 'stp-extra',
          stopName: 'Extra Colony',
          landmark: 'Market',
          morningPickupTime: '07:40 AM',
          afternoonDropTime: '01:50 PM',
          distanceFromSchoolKm: 2.0,
          monthlyFeeInr: 1800,
          enrolledStudentsCount: 9, // Total becomes 36 + 9 = 45 > 40
        },
      ],
    };

    const violation = evaluateCapacityCompliance(overloadedRoute);
    expect(violation.isCompliant).toBe(false);
    expect(violation.alertMessage).toContain('Supreme Court Safety Violation');
    expect(violation.seatsOccupied).toBe(45);
  });

  it('adds a new stop and automatically calculates the fee slab and enrollment count', () => {
    const route = INITIAL_TRANSPORT_ROUTES[2]; // Rohini route with 32 students
    const updated = addStopToRoute(route, {
      stopName: 'Prashant Vihar Sector 14',
      landmark: 'Near Outer Ring Road Flyover',
      morningPickupTime: '07:15 AM',
      afternoonDropTime: '02:15 PM',
      distanceFromSchoolKm: 6.8, // Should fall into Tier 2 (₹2,400)
      enrolledStudentsCount: 5,
    });

    expect(updated.stops).toHaveLength(route.stops.length + 1);
    const addedStop = updated.stops[updated.stops.length - 1];
    expect(addedStop.monthlyFeeInr).toBe(2400);
    expect(updated.totalEnrolledStudents).toBe(37);
  });
});
