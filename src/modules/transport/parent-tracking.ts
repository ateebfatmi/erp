/**
 * Parent Real-Time School Bus GPS Telematics & Route ETA Engine
 * Monitors live AIS-140 GPS pings, student RFID scan boarding verification,
 * dynamic stop ETAs, and emergency driver communication.
 */

export interface RouteStop {
  id: string;
  name: string;
  scheduledPickup: string; // HH:MM AM/PM
  scheduledDrop: string; // HH:MM AM/PM
  status: 'COMPLETED' | 'CURRENT_STOP' | 'UPCOMING';
  isStudentAssignedStop: boolean;
}

export interface StudentTransitRecord {
  studentId: string;
  studentName: string;
  rollNo: string;
  classSection: string;
  rfidCardUid: string;
  morningSwipeTime: string; // e.g. "07:14 AM (Boarded Bus)"
  schoolArrivalSwipeTime: string; // e.g. "07:55 AM (Entered Campus Gate)"
  afternoonSwipeTime?: string;
  status: 'ON_BOARD' | 'SAFELY_IN_SCHOOL' | 'TRANSIT_HOME' | 'REACHED_HOME';
}

export interface LiveBusTelematics {
  busId: string;
  busNumber: string;
  routeId: string;
  routeName: string;
  driverName: string;
  driverPhone: string;
  attendantName: string;
  attendantPhone: string;
  currentSpeedKmh: number;
  ignitionStatus: 'ON' | 'OFF';
  currentLocationName: string;
  gpsTimestamp: string;
  sosTriggered: boolean;
  stops: RouteStop[];
  studentTransit: StudentTransitRecord;
}

/**
 * Calculates remaining estimated arrival time to the student's designated bus stop
 */
export function estimateTimeToArrival(
  stops: RouteStop[],
  averageMinutesBetweenStops = 6
): { etaMinutes: number; nextStopName: string; isAlreadyReached: boolean } {
  const studentStopIndex = stops.findIndex((s) => s.isStudentAssignedStop);
  if (studentStopIndex === -1) {
    return { etaMinutes: 0, nextStopName: 'Unknown', isAlreadyReached: false };
  }

  const currentStopIndex = stops.findIndex((s) => s.status === 'CURRENT_STOP');

  // If already completed or currently at the student's stop
  if (currentStopIndex === -1 && stops[studentStopIndex].status === 'COMPLETED') {
    return {
      etaMinutes: 0,
      nextStopName: stops[studentStopIndex].name,
      isAlreadyReached: true,
    };
  }

  const effectiveCurrent = currentStopIndex !== -1 ? currentStopIndex : 0;
  const stopsRemaining = Math.max(0, studentStopIndex - effectiveCurrent);
  const etaMinutes = stopsRemaining * averageMinutesBetweenStops;

  const nextStop = stops.find((s) => s.status === 'CURRENT_STOP') || stops[effectiveCurrent];

  return {
    etaMinutes,
    nextStopName: nextStop ? nextStop.name : 'En Route',
    isAlreadyReached: stops[studentStopIndex].status === 'COMPLETED',
  };
}

/**
 * Calculates percentage completion along the active transport route
 */
export function calculateRouteProgress(stops: RouteStop[]): {
  completedCount: number;
  totalCount: number;
  progressPercentage: number;
} {
  if (!stops || stops.length === 0) {
    return { completedCount: 0, totalCount: 0, progressPercentage: 0 };
  }

  const completedCount = stops.filter((s) => s.status === 'COMPLETED').length;
  const progressPercentage = Math.round((completedCount / stops.length) * 100);

  return {
    completedCount,
    totalCount: stops.length,
    progressPercentage,
  };
}

/**
 * Curated Live Telematics Data for Route 12 (Aarav Mehta - Class 12-A)
 */
export const INITIAL_BUS_TELEMATICS: LiveBusTelematics = {
  busId: 'bus-12',
  busNumber: 'DL-01-GB-8842',
  routeId: 'ROUTE-12',
  routeName: 'Route 12: South Extension • Lajpat Nagar • Noida Sec 62',
  driverName: 'Sardar Gurpreet Singh',
  driverPhone: '+91 98112 43521',
  attendantName: 'Rameshwar Yadav',
  attendantPhone: '+91 98710 99412',
  currentSpeedKmh: 42,
  ignitionStatus: 'ON',
  currentLocationName: 'Approaching Noida Expressway Flyover (Near Mahamaya Balika Vidyalaya)',
  gpsTimestamp: 'Just now (Live GPS 5s latency)',
  sosTriggered: false,
  studentTransit: {
    studentId: 'std-101',
    studentName: 'Aarav Mehta',
    rollNo: '24',
    classSection: '12-A',
    rfidCardUid: 'RFID-9941-MEHTA',
    morningSwipeTime: '07:18 AM (Boarded at Sec 62 Mother Dairy)',
    schoolArrivalSwipeTime: '07:54 AM (Arrived at Campus Gate 1)',
    status: 'SAFELY_IN_SCHOOL',
  },
  stops: [
    {
      id: 'stp-1',
      name: 'South Extension Part II Market',
      scheduledPickup: '06:45 AM',
      scheduledDrop: '03:15 PM',
      status: 'COMPLETED',
      isStudentAssignedStop: false,
    },
    {
      id: 'stp-2',
      name: 'Lajpat Nagar Central Market Metro',
      scheduledPickup: '07:00 AM',
      scheduledDrop: '03:00 PM',
      status: 'COMPLETED',
      isStudentAssignedStop: false,
    },
    {
      id: 'stp-3',
      name: 'Noida Sector 62 (Mother Dairy Booth)',
      scheduledPickup: '07:18 AM',
      scheduledDrop: '02:40 PM',
      status: 'COMPLETED',
      isStudentAssignedStop: true, // Aarav's stop
    },
    {
      id: 'stp-4',
      name: 'Noida Sector 63 (Fortis Hospital Junction)',
      scheduledPickup: '07:32 AM',
      scheduledDrop: '02:25 PM',
      status: 'COMPLETED',
      isStudentAssignedStop: false,
    },
    {
      id: 'stp-5',
      name: 'Main Campus (Vidya Mandir Gate 1)',
      scheduledPickup: '07:55 AM',
      scheduledDrop: '02:00 PM',
      status: 'CURRENT_STOP',
      isStudentAssignedStop: false,
    },
  ],
};
