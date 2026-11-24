import { describe, it, expect } from 'vitest';
import {
  dispatchTripSheet,
  concludeTripSheet,
  logFuelRefill,
  INITIAL_TRIP_SHEETS,
} from '../trip-sheets';

describe('School Bus Daily Trip Sheet & Fuel Engine', () => {
  it('should dispatch an authorized trip when breathalyzer passes and capacity is within limits', () => {
    const trip = dispatchTripSheet({
      busId: 'BUS-05',
      registrationNo: 'UP 16 BT 9901',
      routeNumber: 'Route 1',
      shift: 'MORNING_PICKUP',
      tripDate: '2024-11-25',
      driverName: 'Mohan Singh',
      conductorName: 'Ramu',
      breathalyzerTest: 'PASS',
      odometerStartKm: 25000,
      departureTime: '06:15 AM',
      studentsBoardedCount: 35,
      busCapacity: 40,
      driverFitnessVerifiedBy: 'Security Lead',
    });

    expect(trip.status).toBe('DISPATCHED_ON_ROUTE');
    expect(trip.id).toContain('TRIP-');
    expect(trip.odometerStartKm).toBe(25000);
  });

  it('should immediately hold and ground a bus if the breathalyzer test fails', () => {
    const heldTrip = dispatchTripSheet({
      busId: 'BUS-05',
      registrationNo: 'UP 16 BT 9901',
      routeNumber: 'Route 1',
      shift: 'MORNING_PICKUP',
      tripDate: '2024-11-25',
      driverName: 'Intoxicated Driver',
      conductorName: 'Ramu',
      breathalyzerTest: 'FAIL',
      odometerStartKm: 25000,
      departureTime: '06:15 AM',
      studentsBoardedCount: 35,
      busCapacity: 40,
      driverFitnessVerifiedBy: 'Security Lead',
    });

    expect(heldTrip.status).toBe('HELD_SAFETY_VIOLATION');
    expect(heldTrip.safetyViolationReason).toContain('failed mandatory pre-trip breathalyzer');
  });

  it('should bar overloading when student count exceeds seating capacity', () => {
    const overloadedTrip = dispatchTripSheet({
      busId: 'BUS-05',
      registrationNo: 'UP 16 BT 9901',
      routeNumber: 'Route 1',
      shift: 'MORNING_PICKUP',
      tripDate: '2024-11-25',
      driverName: 'Mohan Singh',
      conductorName: 'Ramu',
      breathalyzerTest: 'PASS',
      odometerStartKm: 25000,
      departureTime: '06:15 AM',
      studentsBoardedCount: 45, // Exceeds 40 capacity
      busCapacity: 40,
      driverFitnessVerifiedBy: 'Security Lead',
    });

    expect(overloadedTrip.status).toBe('HELD_SAFETY_VIOLATION');
    expect(overloadedTrip.safetyViolationReason).toContain('Overloading Violation');
  });

  it('should accurately conclude a trip and compute total distance travelled', () => {
    const activeTrip = INITIAL_TRIP_SHEETS[1]; // BUS-02, start: 38400
    const concluded = concludeTripSheet(activeTrip, 38435, '03:45 PM');

    expect(concluded.status).toBe('COMPLETED_SAFE');
    expect(concluded.odometerEndKm).toBe(38435);
    expect(concluded.totalKmTravelled).toBe(35); // 38435 - 38400 = 35 km
    expect(concluded.actualArrivalTime).toBe('03:45 PM');
  });

  it('should calculate fuel refill cost and flag abnormal low fuel mileage', () => {
    // Normal refill: 300 km on 60 litres = 5.0 km/L (Optimal)
    const normalRefill = logFuelRefill({
      busId: 'BUS-01',
      registrationNo: 'UP 16 BT 4410',
      refillDate: '2024-11-25',
      odometerKmAtRefill: 42450,
      litresFilled: 60,
      pricePerLitre: 90,
      fuelBunkBillNo: 'BILL-01',
      driverSignOff: 'Driver',
      previousOdometerKm: 42150, // 300 km
    });

    expect(normalRefill.totalFuelCost).toBe(5400); // 60 * 90
    expect(normalRefill.calculatedMileageKmPerLitre).toBe(5.0);
    expect(normalRefill.mileageHealthStatus).toBe('OPTIMAL');

    // Low efficiency refill: 150 km on 60 litres = 2.5 km/L (Low efficiency / theft flag)
    const lowRefill = logFuelRefill({
      busId: 'BUS-02',
      registrationNo: 'UP 16 BT 4412',
      refillDate: '2024-11-25',
      odometerKmAtRefill: 38550,
      litresFilled: 60,
      pricePerLitre: 90,
      fuelBunkBillNo: 'BILL-02',
      driverSignOff: 'Driver',
      previousOdometerKm: 38400, // 150 km / 60 L = 2.5 km/L
    });

    expect(lowRefill.calculatedMileageKmPerLitre).toBe(2.5);
    expect(lowRefill.mileageHealthStatus).toBe('LOW_EFFICIENCY_FLAGGED');
  });
});
