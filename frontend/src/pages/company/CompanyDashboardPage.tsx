import { dashboardService } from "../../services/dashboardService";
import { PageTitle, StateBlock, StatGrid, useAsyncData } from "../PageHelpers";

export default function CompanyDashboardPage() {
  const { data, loading, error } = useAsyncData(() => dashboardService.getCompanyStats(), []);
  return (
    <>
      <PageTitle title="Dashboard entreprise" />
      <StateBlock loading={loading} error={error}>
        {data && <StatGrid items={[
          { label: "Offres soumises", value: data.submitted_offers },
          { label: "Offres acceptees", value: data.accepted_offers },
          { label: "Offres rejetees", value: data.rejected_offers },
          { label: "Marches gagnes", value: data.won_public_contracts },
          { label: "Contrats signes", value: data.signed_contracts },
          { label: "Projets en execution", value: data.projects_in_execution },
        ]} />}
      </StateBlock>
    </>
  );
}
