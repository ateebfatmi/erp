import { describe, it, expect } from 'vitest';
import {
  calculateSlaRemainingHours,
  escalateTicketToPrincipal,
  resolveGrievanceTicket,
  filterGrievanceTickets,
  INITIAL_GRIEVANCE_TICKETS,
} from '../grievance';

describe('Statutory Parent Grievance Redressal & Helpdesk Engine', () => {
  it('calculates remaining SLA hours and detects breached response deadlines', () => {
    // Deadline: 2024-11-26 12:00, Current: 2024-11-25 12:00 -> 24 hours left
    const valid = calculateSlaRemainingHours('2024-11-26T12:00:00Z', '2024-11-25T12:00:00Z');
    expect(valid.hoursRemaining).toBe(24);
    expect(valid.isBreached).toBe(false);

    // Current is past deadline -> Breached
    const breached = calculateSlaRemainingHours('2024-11-24T12:00:00Z', '2024-11-25T12:00:00Z');
    expect(breached.isBreached).toBe(true);
    expect(breached.hoursRemaining).toBe(0);
  });

  it('escalates unresolved grievance ticket directly to the Principal', () => {
    const ticket = INITIAL_GRIEVANCE_TICKETS[0];
    const escalated = escalateTicketToPrincipal(ticket, 'SLA exceeded without field resolution');

    expect(escalated.status).toBe('ESCALATED_TO_PRINCIPAL');
    expect(escalated.assignedOfficer).toContain('Principal');
    expect(escalated.messages.some((m) => m.messageText.includes('Escalated to Principal'))).toBe(true);
  });

  it('resolves grievance ticket and appends official resolution remarks', () => {
    const ticket = INITIAL_GRIEVANCE_TICKETS[0];
    const resolved = resolveGrievanceTicket(
      ticket,
      'Temporary bus stop relocation approved and active.',
      'Shri K. Sharma'
    );

    expect(resolved.status).toBe('RESOLVED');
    expect(resolved.resolutionNotes).toContain('relocation approved');
  });

  it('filters tickets by category and status', () => {
    const transportTickets = filterGrievanceTickets(INITIAL_GRIEVANCE_TICKETS, 'TRANSPORT_ROUTE');
    expect(transportTickets.length).toBe(1);
    expect(transportTickets[0].category).toBe('TRANSPORT_ROUTE');

    const resolvedTickets = filterGrievanceTickets(INITIAL_GRIEVANCE_TICKETS, 'ALL', 'RESOLVED');
    expect(resolvedTickets.length).toBe(1);
    expect(resolvedTickets[0].status).toBe('RESOLVED');
  });
});
