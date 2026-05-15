import { DashboardLayout } from "../../components/layout/DashboardLayout";

export function AdminDashboardPage(): JSX.Element {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Tableau de bord administrateur
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-semibold">
              Total utilisateurs
            </h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-semibold">
              Offres publiées
            </h3>
            <p className="text-3xl font-bold text-green-600 mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-semibold">
              Offres en attente
            </h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-semibold">
              Signalements
            </h3>
            <p className="text-3xl font-bold text-red-600 mt-2">0</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
