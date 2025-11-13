import PageHeader from '@/components/PageHeader';

export default function TodosPage() {
  return (
    <div>
      <PageHeader 
        title="Todos" 
        subtitle="Manage your tasks and projects"
      />
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-gray-600">Todos coming soon...</p>
      </div>
    </div>
  );
}

