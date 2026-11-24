/**
 * VidyaOS - School Bus Routes, Stop Schedules & Distance Fee Slabs Engine
 * Implements RTO transport fare tiers, Supreme Court seating capacity compliance, and stop timelines.
 */

export interface RouteStopSchedule {
  stopId: string;
  stopName: string;
  landmark: string;
  morningPickupTime: string; // e.g. "06:45 AM"
  afternoonDropTime: string; // e.g. "02:40 PM"
  distanceFromSchoolKm: number;
  monthlyFeeInr: number;
  enrolledStudentsCount: number;
}

export interface TransportRouteRecord {
  routeId: string;
  routeName: string;
  vehicleNumber: string;
  busCapacity: number;
  driverName: string;
  driverPhone: string;
  attendantName: string;
  attendantPhone: string;
  startPoint: string;
  endPoint: string;
  stops: RouteStopSchedule[];
  totalDistanceKm: number;
  totalEnrolledStudents: number;
  status: 'ACTIVE' | 'MAINTENANCE_STANDBY';
}

/**
 * Calculates distance-based monthly transport fee slabs per institutional RTO policies.
 */
export function calculateTransportFeeSlab(distanceKm: number): {
  monthlyFeeInr: number;
  slabTier: string;
} {
  const dist = Math.max(0, distanceKm);

  if (dist <= 5.0) {
    return {
      monthlyFeeInr: 1800,
      slabTier: 'Tier 1 (Local Neighborhood: 0-5 km)',
    };
  } else if (dist <= 10.0) {
    return {
      monthlyFeeInr: 2400,
      slabTier: 'Tier 2 (Mid-Range Suburb: 5.1-10 km)',
    };
  } else if (dist <= 15.0) {
    return {
      monthlyFeeInr: 3000,
      slabTier: 'Tier 3 (Outer Ring: 10.1-15 km)',
    };
  } else {
    return {
      monthlyFeeInr: 3600,
      slabTier: 'Tier 4 (Extended Metropolitan: > 15 km)',
    };
  }
}

/**
 * Validates Supreme Court school bus seating safety guidelines:
 * - Strictly bans student overloading (seats occupied must not exceed registered bus capacity)
 * - Highlights capacity utilization percentage
 */
export function evaluateCapacityCompliance(route: TransportRouteRecord): {
  isCompliant: boolean;
  seatsOccupied: number;
  totalCapacity: number;
  utilizationPercent: number;
  alertMessage?: string;
} {
  const seatsOccupied = route.stops.reduce((sum, s) => sum + s.enrolledStudentsCount, 0);
  const totalCapacity = route.busCapacity;
  const utilizationPercent = Math.round((seatsOccupied / totalCapacity) * 100);

  if (seatsOccupied > totalCapacity) {
    return {
      isCompliant: false,
      seatsOccupied,
      totalCapacity,
      utilizationPercent,
      alertMessage: `Supreme Court Safety Violation: Route ${route.routeName} is OVERLOADED (${seatsOccupied}/${totalCapacity} students). Standees are strictly prohibited under the Motor Vehicles Act.`,
    };
  }

  return {
    isCompliant: true,
    seatsOccupied,
    totalCapacity,
    utilizationPercent,
  };
}

/**
 * Adds or inserts a new stop into an existing bus route, updating fee slabs and student counts.
 */
export function addStopToRoute(
  route: TransportRouteRecord,
  stopData: Omit<RouteStopSchedule, 'stopId' | 'monthlyFeeInr'>
): TransportRouteRecord {
  const feeInfo = calculateTransportFeeSlab(stopData.distanceFromSchoolKm);
  const newStop: RouteStopSchedule = {
    ...stopData,
    stopId: `stop-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    monthlyFeeInr: feeInfo.monthlyFeeInr,
  };

  const updatedStops = [...route.stops, newStop];
  const totalEnrolledStudents = updatedStops.reduce((sum, s) => sum + s.enrolledStudentsCount, 0);
  const maxDistance = Math.max(...updatedStops.map((s) => s.distanceFromSchoolKm));

  return {
    ...route,
    stops: updatedStops,
    totalEnrolledStudents,
    totalDistanceKm: maxDistance,
  };
}

export const INITIAL_TRANSPORT_ROUTES: TransportRouteRecord[] = [
  {
    routeId: 'rt-01',
    routeName: 'Route 01: Vasant Kunj - Saket Express',
    vehicleNumber: 'DL-1PB-4012',
    busCapacity: 40,
    driverName: 'Suresh Kumar',
    driverPhone: '+91 98101 22334',
    attendantName: 'Sunita Devi',
    attendantPhone: '+91 98102 33445',
    startPoint: 'Pocket C, Vasant Kunj',
    endPoint: 'DPGA Campus Gate 2',
    totalDistanceKm: 14.2,
    totalEnrolledStudents: 36,
    status: 'ACTIVE',
    stops: [
      {
        stopId: 'stp-101',
        stopName: 'Vasant Kunj Pocket C Gate 3',
        landmark: 'Near Fortis Hospital',
        morningPickupTime: '06:45 AM',
        afternoonDropTime: '02:45 PM',
        distanceFromSchoolKm: 14.2,
        monthlyFeeInr: 3000,
        enrolledStudentsCount: 10,
      },
      {
        stopId: 'stp-102',
        stopName: 'Munirka DDA Flats',
        landmark: 'Opposite Community Center',
        morningPickupTime: '07:00 AM',
        afternoonDropTime: '02:30 PM',
        distanceFromSchoolKm: 11.5,
        monthlyFeeInr: 3000,
        enrolledStudentsCount: 8,
      },
      {
        stopId: 'stp-103',
        stopName: 'Saket J-Block Roundabout',
        landmark: 'Near Max Hospital',
        morningPickupTime: '07:15 AM',
        afternoonDropTime: '02:15 PM',
        distanceFromSchoolKm: 7.8,
        monthlyFeeInr: 2400,
        enrolledStudentsCount: 12,
      },
      {
        stopId: 'stp-104',
        stopName: 'Hauz Khas Metro Station Gate 2',
        landmark: 'Aurobindo Marg',
        morningPickupTime: '07:30 AM',
        afternoonDropTime: '02:00 PM',
        distanceFromSchoolKm: 4.2,
        monthlyFeeInr: 1800,
        enrolledStudentsCount: 6,
      },
    ],
  },
  {
    routeId: 'rt-02',
    routeName: 'Route 02: Dwarka Sectors 1-22 Circle',
    vehicleNumber: 'DL-1PC-7789',
    busCapacity: 45,
    driverName: 'Ramesh Singh',
    driverPhone: '+91 98200 55667',
    attendantName: 'Kamla Bai',
    attendantPhone: '+91 98201 66778',
    startPoint: 'Dwarka Sector 22 Market',
    endPoint: 'DPGA Campus Gate 2',
    totalDistanceKm: 18.5,
    totalEnrolledStudents: 41,
    status: 'ACTIVE',
    stops: [
      {
        stopId: 'stp-201',
        stopName: 'Dwarka Sector 22 Supreme Enclave',
        landmark: 'Near CNG Station',
        morningPickupTime: '06:30 AM',
        afternoonDropTime: '03:00 PM',
        distanceFromSchoolKm: 18.5,
        monthlyFeeInr: 3600,
        enrolledStudentsCount: 14,
      },
      {
        stopId: 'stp-202',
        stopName: 'Dwarka Sector 12 City Centre',
        landmark: 'Sector 12 Metro Station Gate 1',
        morningPickupTime: '06:50 AM',
        afternoonDropTime: '02:40 PM',
        distanceFromSchoolKm: 13.0,
        monthlyFeeInr: 3000,
        enrolledStudentsCount: 15,
      },
      {
        stopId: 'stp-203',
        stopName: 'Dwarka Sector 6 Central Park',
        landmark: 'Near DAV Public School',
        morningPickupTime: '07:10 AM',
        afternoonDropTime: '02:20 PM',
        distanceFromSchoolKm: 9.5,
        monthlyFeeInr: 2400,
        enrolledStudentsCount: 12,
      },
    ],
  },
  {
    routeId: 'rt-03',
    routeName: 'Route 03: Rohini - Pitampura Corridor',
    vehicleNumber: 'DL-1PD-3321',
    busCapacity: 42,
    driverName: 'Mahesh Chander',
    driverPhone: '+91 98300 77889',
    attendantName: 'Geeta Rani',
    attendantPhone: '+91 98301 88990',
    startPoint: 'Rohini Sector 14',
    endPoint: 'DPGA Campus Gate 2',
    totalDistanceKm: 8.8,
    totalEnrolledStudents: 32,
    status: 'ACTIVE',
    stops: [
      {
        stopId: 'stp-301',
        stopName: 'Rohini Sector 14 Pocket 2',
        landmark: 'Near Balaji Temple',
        morningPickupTime: '07:05 AM',
        afternoonDropTime: '02:25 PM',
        distanceFromSchoolKm: 8.8,
        monthlyFeeInr: 2400,
        enrolledStudentsCount: 16,
      },
      {
        stopId: 'stp-302',
        stopName: 'Pitampura Kapil Vihar',
        landmark: 'Opposite TV Tower',
        morningPickupTime: '07:25 AM',
        afternoonDropTime: '02:05 PM',
        distanceFromSchoolKm: 4.5,
        monthlyFeeInr: 1800,
        enrolledStudentsCount: 16,
      },
    ],
  },
];
