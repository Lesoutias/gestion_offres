import { Link } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { companyService } from "../../services/companyService";
import { dashboardService } from "../../services/dashboardService";
import { PageTitle, StateBlock, StatGrid, useAsyncData } from "../PageHelpers";
import { isMissingCompanyProfileError } from "../../components/companies/CompanyProfileSetupForm";

export default function CompanyDashboardPage() {
  const stats = useAsyncData(() => dashboardService.getCompanyStats(), []);
  const company = useAsyncData(() => companyService.getMine(), []);
  const needsProfile = isMissingCompanyProfileError(company.error);

  return (
    <>
      <PageTitle title="Dashboard entreprise" />
      {needsProfile && !company.loading && (
        <Card>
          <p className="text-sm text-slate-700">
            Votre profil entreprise n'est pas encore configure.{" "}
            <Link className="font-medium text-emerald-700" to="/company/profile">
              Completez votre profil
            </Link>{" "}
            pour soumettre des offres.
          </p>
        </Card>
      )}
      <div className={needsProfile ? "mt-4" : undefined}>
        <StateBlock loading={stats.loading} error={stats.error}>
          {stats.data && (
            <StatGrid
              items={[
                { label: "Offres soumises", value: stats.data.submitted_offers },
                { label: "Offres acceptees", value: stats.data.accepted_offers },
                { label: "Offres rejetees", value: stats.data.rejected_offers },
                { label: "Marches gagnes", value: stats.data.won_public_contracts },
                { label: "Contrats signes", value: stats.data.signed_contracts },
                { label: "Projets en execution", value: stats.data.projects_in_execution },
              ]}
            />
          )}
        </StateBlock>
      </div>
    </>
  );
}
