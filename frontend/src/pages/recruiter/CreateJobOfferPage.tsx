import { DashboardLayout } from "../../components/layout/DashboardLayout";

export function CreateJobOfferPage(): JSX.Element {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Créer une offre d'emploi
        </h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">
            Formulaire de création d'offre d'emploi.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
