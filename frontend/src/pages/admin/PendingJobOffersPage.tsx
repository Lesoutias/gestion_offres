import { DashboardLayout } from "../../components/layout/DashboardLayout";

export function PendingJobOffersPage(): JSX.Element {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Offres en attente de validation
        </h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Aucune offre en attente.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
