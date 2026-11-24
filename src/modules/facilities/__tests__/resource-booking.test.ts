import { describe, it, expect } from 'vitest';
import {
  checkFacilityCollision,
  createFacilityReservation,
  INITIAL_FACILITY_BOOKINGS,
  FacilityReservation,
} from '../resource-booking';

describe('Campus Shared Facilities & Special Lab Resource Booking Engine', () => {
  it('detects period collisions when a facility is already reserved', () => {
    // fac-01 is booked on 2024-11-29 for Period 3
    const isColliding = checkFacilityCollision(
      INITIAL_FACILITY_BOOKINGS,
      'fac-01',
      '2024-11-29',
      3
    );
    expect(isColliding).toBe(true);

    // Period 4 is completely free
    const isFree = checkFacilityCollision(
      INITIAL_FACILITY_BOOKINGS,
      'fac-01',
      '2024-11-29',
      4
    );
    expect(isFree).toBe(false);
  });

  it('successfully reserves an open facility slot without collisions', () => {
    const newReservation: FacilityReservation = {
      id: 'res-new-01',
      facilityId: 'fac-03',
      facilityName: 'Senior Computer Science Lab 1',
      date: '2024-11-29',
      periodNo: 2,
      teacherId: 'tch-04',
      teacherName: 'Ms. Clara D’Souza',
      classGrade: 11,
      section: 'B',
      sessionPurpose: 'Python Pandas Data Science Hands-on',
      status: 'CONFIRMED',
    };

    const { success, updatedBookings } = createFacilityReservation(
      INITIAL_FACILITY_BOOKINGS,
      newReservation
    );

    expect(success).toBe(true);
    expect(updatedBookings.length).toBe(INITIAL_FACILITY_BOOKINGS.length + 1);
  });

  it('rejects double-booking and returns descriptive collision error message', () => {
    // Try booking fac-01 on 2024-11-29 for Period 3 (already taken by Dr. R. Ramanujan)
    const collidingReservation: FacilityReservation = {
      id: 'res-fail',
      facilityId: 'fac-01',
      facilityName: 'Atal Tinkering Lab (ATL)',
      date: '2024-11-29',
      periodNo: 3,
      teacherId: 'tch-03',
      teacherName: 'Dr. V. K. Saxena',
      classGrade: 11,
      section: 'A',
      sessionPurpose: 'Chemistry Sensor Calibration',
      status: 'CONFIRMED',
    };

    const { success, errorMessage } = createFacilityReservation(
      INITIAL_FACILITY_BOOKINGS,
      collidingReservation
    );

    expect(success).toBe(false);
    expect(errorMessage).toContain('Facility already reserved for Period 3');
  });
});
