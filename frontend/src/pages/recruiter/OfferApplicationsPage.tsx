import { DashboardLayout } from "../../components/layout/DashboardLayout";

export function OfferApplicationsPage(): JSX.Element {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Candidatures pour cette offre
        </h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Aucune candidature reçue.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
