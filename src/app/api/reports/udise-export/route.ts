import { NextRequest, NextResponse } from 'next/server';
import { repository } from '@/lib/database/repository';
import { MOCK_TENANT } from '@/lib/database/mock-data';
import { generateUdiseCensusMetrics, serializeUdiseToCsv } from '@/modules/reports/udise-generator';

export async function GET(req: NextRequest) {
  const tenant = (await repository.getTenantBySlug(MOCK_TENANT.id)) || MOCK_TENANT;
  const enrollments = await repository.getEnrollments(tenant.id);
  const employees = await repository.getEmployees(tenant.id);

  const metrics = generateUdiseCensusMetrics(tenant, enrollments, employees);
  const csvContent = serializeUdiseToCsv(metrics);

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="udise_census_${metrics.academicYear.replace('-', '_')}.csv"`,
    },
  });
}
