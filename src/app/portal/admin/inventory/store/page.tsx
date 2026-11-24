import { Metadata } from 'next';
import { SchoolStoreManager } from '@/components/modules/inventory/school-store-manager';

export const metadata: Metadata = {
  title: 'Campus Bookstore & Uniform Inventory Desk | VidyaOS Admin',
  description: 'Manage NCERT textbook packages, uniform sets, laboratory kits and track student counter distributions.',
};

export default function AdminSchoolStorePage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <SchoolStoreManager viewMode="admin" />
    </div>
  );
}
