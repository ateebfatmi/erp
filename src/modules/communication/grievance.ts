/**
 * Statutory Parent Grievance Redressal & Helpdesk Ticketing Engine
 * Implements CBSE Affiliation Bye-Laws mandatory parental grievance redressal protocols,
 * SLA resolution countdowns (24h/48h), escalation to Principal, and two-way ticket audit threads.
 */

export type GrievanceCategory =
  | 'TRANSPORT_ROUTE'
  | 'ACADEMIC_PROGRESS'
  | 'ACCOUNTS_FEE'
  | 'HEALTH_SAFETY'
  | 'FACILITY_CANTEEN';

export type GrievancePriority = 'NORMAL' | 'HIGH' | 'URGENT';

export type GrievanceStatus =
  | 'OPEN'
  | 'IN_INVESTIGATION'
  | 'ESCALATED_TO_PRINCIPAL'
  | 'RESOLVED';

export interface GrievanceMessage {
  id: string;
  senderRole: 'PARENT' | 'SCHOOL_ADMIN' | 'PRINCIPAL';
  senderName: string;
  messageText: string;
  timestamp: string;
}

export interface GrievanceTicket {
  id: string;
  ticketNo: string;
  studentId: string;
  studentName: string;
  parentName: string;
  parentPhone: string;
  category: GrievanceCategory;
  priority: GrievancePriority;
  subject: string;
  description: string;
  createdAt: string;
  slaDeadline: string; // ISO or YYYY-MM-DD HH:MM
  status: GrievanceStatus;
  assignedOfficer: string;
  resolutionNotes?: string;
  messages: GrievanceMessage[];
}

/**
 * Calculates remaining SLA hours until mandatory statutory response deadline
 */
export function calculateSlaRemainingHours(
  slaDeadlineIso: string,
  currentDateIso: string
): {
  hoursRemaining: number;
  isBreached: boolean;
} {
  const deadlineMs = new Date(slaDeadlineIso).getTime();
  const currentMs = new Date(currentDateIso).getTime();
  const diffHours = (deadlineMs - currentMs) / (1000 * 60 * 60);

  const isBreached = diffHours < 0;
  const hoursRemaining = Math.max(0, Math.round(diffHours));

  return { hoursRemaining, isBreached };
}

/**
 * Escalates an unresolved grievance ticket directly to the Principal's high-priority docket
 */
export function escalateTicketToPrincipal(
  ticket: GrievanceTicket,
  escalationReason: string
): GrievanceTicket {
  const now = new Date();
  const timestamp = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const escalationMsg: GrievanceMessage = {
    id: `msg-${Date.now()}`,
    senderRole: 'SCHOOL_ADMIN',
    senderName: 'System SLA Escalation Bot',
    messageText: `Escalated to Principal: ${escalationReason}`,
    timestamp,
  };

  return {
    ...ticket,
    status: 'ESCALATED_TO_PRINCIPAL',
    assignedOfficer: 'Dr. Radhakrishnan (Principal)',
    messages: [...ticket.messages, escalationMsg],
  };
}

/**
 * Resolves a ticket and records statutory resolution audit notes
 */
export function resolveGrievanceTicket(
  ticket: GrievanceTicket,
  resolutionNotes: string,
  officerName: string
): GrievanceTicket {
  const now = new Date();
  const timestamp = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const resolutionMsg: GrievanceMessage = {
    id: `msg-${Date.now()}`,
    senderRole: 'SCHOOL_ADMIN',
    senderName: officerName,
    messageText: `Ticket Resolved: ${resolutionNotes}`,
    timestamp,
  };

  return {
    ...ticket,
    status: 'RESOLVED',
    resolutionNotes,
    messages: [...ticket.messages, resolutionMsg],
  };
}

/**
 * Filters tickets by category, status, and query
 */
export function filterGrievanceTickets(
  tickets: GrievanceTicket[],
  categoryFilter?: GrievanceCategory | 'ALL',
  statusFilter?: GrievanceStatus | 'ALL',
  query = ''
): GrievanceTicket[] {
  const q = query.trim().toLowerCase();

  return tickets.filter((t) => {
    const matchesCategory = !categoryFilter || categoryFilter === 'ALL' || t.category === categoryFilter;
    const matchesStatus = !statusFilter || statusFilter === 'ALL' || t.status === statusFilter;

    if (!matchesCategory || !matchesStatus) return false;
    if (!q) return true;

    return (
      t.ticketNo.toLowerCase().includes(q) ||
      t.studentName.toLowerCase().includes(q) ||
      t.parentName.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  });
}

/**
 * Curated Pre-seeded Institutional Grievance Tickets
 */
export const INITIAL_GRIEVANCE_TICKETS: GrievanceTicket[] = [
  {
    id: 'grv-01',
    ticketNo: 'GRV-2024-089',
    studentId: 'std-101',
    studentName: 'Aarav Mehta',
    parentName: 'Sanjay Mehta',
    parentPhone: '+91 98112 00412',
    category: 'TRANSPORT_ROUTE',
    priority: 'HIGH',
    subject: 'Request for Morning Bus Stop Relocation due to Road Construction',
    description: 'Noida Sector 62 Mother Dairy booth is currently under drainage digging. Requesting pickup 200m ahead at Sector 62 Metro Gate 2.',
    createdAt: '2024-11-24 09:30',
    slaDeadline: '2024-11-26 09:30', // 48-hour SLA
    status: 'IN_INVESTIGATION',
    assignedOfficer: 'Transport In-charge (Shri K. Sharma)',
    messages: [
      {
        id: 'msg-01',
        senderRole: 'PARENT',
        senderName: 'Sanjay Mehta',
        messageText: 'Road is completely barricaded by municipal corporation. Morning bus had difficulty stopping.',
        timestamp: '2024-11-24 09:30',
      },
      {
        id: 'msg-02',
        senderRole: 'SCHOOL_ADMIN',
        senderName: 'Shri K. Sharma (Transport Officer)',
        messageText: 'Inspected site today afternoon with Route 12 driver. Arranging temporary boarding at Metro Gate 2 from tomorrow morning.',
        timestamp: '2024-11-24 15:45',
      },
    ],
  },
  {
    id: 'grv-02',
    ticketNo: 'GRV-2024-074',
    studentId: 'std-102',
    studentName: 'Ananya Deshmukh',
    parentName: 'Dr. Sunita Deshmukh',
    parentPhone: '+91 98201 55431',
    category: 'ACCOUNTS_FEE',
    priority: 'NORMAL',
    subject: 'Double Deduction Clarification on Term-2 Computer Lab Fee Receipt',
    description: 'Bank account was debited twice during netbanking checkout on 15th November. Requesting ledger reconciliation.',
    createdAt: '2024-11-18 11:20',
    slaDeadline: '2024-11-20 11:20',
    status: 'RESOLVED',
    assignedOfficer: 'Accounts Officer (Smt. Rama Devi)',
    resolutionNotes: 'Verified with payment gateway bank settlement file. Duplicate amount of ₹3,400 credited back to source account. Ref #UTR98412.',
    messages: [
      {
        id: 'msg-03',
        senderRole: 'PARENT',
        senderName: 'Dr. Sunita Deshmukh',
        messageText: 'Attached dual debit bank statement screenshot.',
        timestamp: '2024-11-18 11:20',
      },
      {
        id: 'msg-04',
        senderRole: 'SCHOOL_ADMIN',
        senderName: 'Smt. Rama Devi',
        messageText: 'Reconciled ledger. Refund processed successfully. Updated fee receipt generated.',
        timestamp: '2024-11-19 14:10',
      },
    ],
  },
];
