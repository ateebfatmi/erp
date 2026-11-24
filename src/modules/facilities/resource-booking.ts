/**
 * Campus Shared Facilities & Special Lab Resource Booking Engine
 * Manages institutional high-demand assets (Atal Tinkering Lab, AV Auditorium,
 * Computer Labs, Robotics Studio, Indoor Sports Complex) with strict period collision protection.
 */

export interface CampusFacility {
  id: string;
  name: string;
  category: 'STEM_LAB' | 'COMPUTER_LAB' | 'AUDITORIUM' | 'SPORTS_ARENA';
  location: string;
  studentCapacity: number;
  equipmentHighlights: string[];
  inChargeOfficer: string;
}

export interface FacilityReservation {
  id: string;
  facilityId: string;
  facilityName: string;
  date: string; // YYYY-MM-DD
  periodNo: number; // 1 to 8
  teacherId: string;
  teacherName: string;
  classGrade: number;
  section: string;
  sessionPurpose: string;
  status: 'CONFIRMED' | 'CANCELLED';
}

/**
 * Validates whether a target facility is already reserved during a specific date and period
 */
export function checkFacilityCollision(
  bookings: FacilityReservation[],
  facilityId: string,
  date: string,
  periodNo: number
): boolean {
  return bookings.some(
    (b) =>
      b.facilityId === facilityId &&
      b.date === date &&
      b.periodNo === periodNo &&
      b.status === 'CONFIRMED'
  );
}

/**
 * Reserves a facility slot with strict anti-double-booking collision check
 */
export function createFacilityReservation(
  bookings: FacilityReservation[],
  newReservation: FacilityReservation
): {
  success: boolean;
  updatedBookings: FacilityReservation[];
  errorMessage?: string;
} {
  const isColliding = checkFacilityCollision(
    bookings,
    newReservation.facilityId,
    newReservation.date,
    newReservation.periodNo
  );

  if (isColliding) {
    const existing = bookings.find(
      (b) =>
        b.facilityId === newReservation.facilityId &&
        b.date === newReservation.date &&
        b.periodNo === newReservation.periodNo &&
        b.status === 'CONFIRMED'
    );
    return {
      success: false,
      updatedBookings: bookings,
      errorMessage: `Facility already reserved for Period ${newReservation.periodNo} by ${existing?.teacherName} (${existing?.classGrade}-${existing?.section}).`,
    };
  }

  return {
    success: true,
    updatedBookings: [newReservation, ...bookings],
  };
}

/**
 * Curated Pre-seeded Campus Facilities
 */
export const INITIAL_CAMPUS_FACILITIES: CampusFacility[] = [
  {
    id: 'fac-01',
    name: 'Atal Tinkering Lab (ATL)',
    category: 'STEM_LAB',
    location: 'Raman Block • 2nd Floor (Room 204)',
    studentCapacity: 45,
    equipmentHighlights: ['Creality 3D Printers', 'Arduino Uno & ESP32 Kits', 'Drone Aerodynamics Rig', 'Laser Cutter'],
    inChargeOfficer: 'Dr. V. K. Saxena (Science Dean)',
  },
  {
    id: 'fac-02',
    name: 'Vivekananda Audio-Visual Auditorium',
    category: 'AUDITORIUM',
    location: 'Administrative Wing • Ground Floor',
    studentCapacity: 350,
    equipmentHighlights: ['4K Laser Projection Screen', 'Bose Surround Array', 'Wireless Collar Mics', 'Stage Spotlights'],
    inChargeOfficer: 'Shri K. Sharma (Events Coordinator)',
  },
  {
    id: 'fac-03',
    name: 'Senior Computer Science Lab 1',
    category: 'COMPUTER_LAB',
    location: 'Aryabhata Block • 1st Floor',
    studentCapacity: 40,
    equipmentHighlights: ['40x Core i7 Workstations', 'Gigabit Fiber LAN', 'Python & AI SDK Environment', 'UPS Battery Bank'],
    inChargeOfficer: 'Ms. Clara D’Souza',
  },
  {
    id: 'fac-04',
    name: 'Indoor Synthetic Badminton Arena',
    category: 'SPORTS_ARENA',
    location: 'Major Dhyan Chand Sports Complex',
    studentCapacity: 60,
    equipmentHighlights: ['3x Yonex BWF Certified Synthetic Courts', 'LED Floodlights', 'Electronic Scoreboard'],
    inChargeOfficer: 'Shri Vikram Rathore (Director PE)',
  },
];

/**
 * Curated Active Facility Bookings (for Friday 2024-11-29)
 */
export const INITIAL_FACILITY_BOOKINGS: FacilityReservation[] = [
  {
    id: 'res-01',
    facilityId: 'fac-01',
    facilityName: 'Atal Tinkering Lab (ATL)',
    date: '2024-11-29',
    periodNo: 3,
    teacherId: 'tch-02',
    teacherName: 'Dr. R. Ramanujan',
    classGrade: 12,
    section: 'A',
    sessionPurpose: 'Robotics Microcontroller Prototyping & Sensor Calibration',
    status: 'CONFIRMED',
  },
  {
    id: 'res-02',
    facilityId: 'fac-02',
    facilityName: 'Vivekananda Audio-Visual Auditorium',
    date: '2024-11-29',
    periodNo: 5,
    teacherId: 'tch-01',
    teacherName: 'Smt. Ananya Sen',
    classGrade: 10,
    section: 'A',
    sessionPurpose: 'Interactive 3D Geometry & Parabola Projection Seminar',
    status: 'CONFIRMED',
  },
];
