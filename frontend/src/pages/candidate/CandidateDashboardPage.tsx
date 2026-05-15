import { DashboardLayout } from "../../components/layout/DashboardLayout";

export function CandidateDashboardPage(): JSX.Element {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Tableau de bord candidat
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-semibold">
              Offres consultées
            </h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-semibold">
              Candidatures
            </h3>
            <p className="text-3xl font-bold text-green-600 mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-semibold">
              Profil complété
            </h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">0%</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
