import PageHeader from '@/components/PageHeader';

export default function BillsPage() {
  return (
    <div>
      <PageHeader 
        title="Bills & Due Dates" 
        subtitle="Track your bills and important deadlines"
      />
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-gray-600">Bills & Due Dates coming soon...</p>
      </div>
    </div>
  );
}

