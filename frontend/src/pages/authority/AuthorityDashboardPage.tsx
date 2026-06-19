import { dashboardService } from "../../services/dashboardService";
import { formatAmount } from "../../utils/formatCurrency";
import { PageTitle, StateBlock, StatGrid, useAsyncData } from "../PageHelpers";

export default function AuthorityDashboardPage() {
  const { data, loading, error } = useAsyncData(() => dashboardService.getAuthorityStats(), []);
  return (
    <>
      <PageTitle title="Dashboard Mairie de Goma" description="Vue d'ensemble des appels d'offres et marches publics." />
      <StateBlock loading={loading} error={error}>
        {data && <StatGrid items={[
          { label: "Appels d'offres", value: data.total_tender_calls },
          { label: "Publies", value: data.published_tender_calls },
          { label: "En evaluation", value: data.evaluation_tender_calls },
          { label: "Offres recues", value: data.submitted_offers },
          { label: "Marches", value: data.public_contracts },
          { label: "Contrats signes", value: data.signed_contracts },
          { label: "Executions", value: data.projects_in_execution },
          { label: "Montant attribue (USD)", value: formatAmount(data.total_awarded_amount_usd, "USD") },
          { label: "Montant attribue (CDF)", value: formatAmount(data.total_awarded_amount_cdf, "CDF") },
        ]} />}
      </StateBlock>
    </>
  );
}
