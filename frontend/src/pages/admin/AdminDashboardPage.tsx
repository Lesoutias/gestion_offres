import { dashboardService } from "../../services/dashboardService";
import { PageTitle, StateBlock, StatGrid, useAsyncData } from "../PageHelpers";

export default function AdminDashboardPage() {
  const { data, loading, error } = useAsyncData(() => dashboardService.getAdminStats(), []);
  return (
    <>
      <PageTitle title="Dashboard administrateur" description="Vue globale de la plateforme." />
      <StateBlock loading={loading} error={error}>
        {data && <StatGrid items={[
          { label: "Utilisateurs", value: data.total_users },
          { label: "Entreprises", value: data.total_companies },
          { label: "Appels d'offres", value: data.total_tender_calls },
          { label: "Offres soumises", value: data.submitted_offers },
          { label: "Marches attribues", value: data.awarded_public_contracts },
          { label: "Contrats signes", value: data.signed_contracts },
          { label: "Projets en execution", value: data.projects_in_execution },
          { label: "Montant attribue", value: data.total_awarded_amount.toLocaleString() },
        ]} />}
      </StateBlock>
    </>
  );
}
