import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Company } from "../../types";
import { companyService } from "../../services/companyService";
import { Card } from "../ui/Card";
import { CompanyProfileSetupForm, isMissingCompanyProfileError } from "./CompanyProfileSetupForm";
import { StateBlock, useAsyncData } from "../../pages/PageHelpers";

export function CompanyRequiredBlock({
  children,
}: {
  children: (company: Company) => ReactNode;
}) {
  const { data, loading, error, setData } = useAsyncData(() => companyService.getMine(), []);

  if (!loading && isMissingCompanyProfileError(error)) {
    return (
      <Card title="Profil entreprise requis">
        <CompanyProfileSetupForm onCreated={setData} />
        <p className="mt-4 text-sm text-slate-600">
          Vous pouvez aussi utiliser la page{" "}
          <Link className="font-medium text-emerald-700" to="/company/profile">
            Profil
          </Link>
          .
        </p>
      </Card>
    );
  }

  return (
    <StateBlock loading={loading} error={error}>
      {data ? children(data) : null}
    </StateBlock>
  );
}
