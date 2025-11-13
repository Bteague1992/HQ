import PageHeader from '@/components/PageHeader';

export default function DashboardPage() {
  return (
    <div>
      <PageHeader 
        title="Dashboard" 
        subtitle="Welcome to your personal command center"
      />
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-gray-600">Dashboard coming soon...</p>
      </div>
    </div>
  );
}

