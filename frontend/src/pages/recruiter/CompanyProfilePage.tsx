import { DashboardLayout } from "../../components/layout/DashboardLayout";

export function CompanyProfilePage(): JSX.Element {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Profil de l'entreprise
        </h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Gérez le profil de votre entreprise.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
