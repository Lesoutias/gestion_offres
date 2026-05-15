import { DashboardLayout } from "../../components/layout/DashboardLayout";

export function AllApplicationsPage(): JSX.Element {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Toutes les candidatures
        </h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Aucune candidature à afficher.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
