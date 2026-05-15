import { DashboardLayout } from "../../components/layout/DashboardLayout";

export function CandidateProfilePage(): JSX.Element {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Mon profil</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">
            Complétez votre profil pour augmenter vos chances d'être retenu.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
