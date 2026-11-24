import { Metadata } from 'next';
import { SchoolStoreManager } from '@/components/modules/inventory/school-store-manager';

export const metadata: Metadata = {
  title: 'Campus Bookstore & Uniform Kits | VidyaOS Parent Portal',
  description: 'Reserve prescribed textbook sets, uniform apparel, and lab supplies with official digital counter pickup slips.',
};

export default function ParentSchoolStorePage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <SchoolStoreManager
        viewMode="parent"
        currentStudent={{
          admissionNo: 'ADM-2024-001',
          studentName: 'Aarav Mehta',
          gradeClass: 'Class 10A',
        }}
      />
    </div>
  );
}
