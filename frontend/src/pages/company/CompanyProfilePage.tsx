import { Card } from "../../components/ui/Card";
import { companyService } from "../../services/companyService";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function CompanyProfilePage() {
  const { data, loading, error } = useAsyncData(() => companyService.getMine(), []);
  return (
    <>
      <PageTitle title="Profil entreprise" />
      <StateBlock loading={loading} error={error}>
        {data && <Card title={data.name}><dl className="grid gap-3 text-sm sm:grid-cols-2"><div><dt className="font-semibold">Email</dt><dd>{data.email}</dd></div><div><dt className="font-semibold">Telephone</dt><dd>{data.phone}</dd></div><div><dt className="font-semibold">RCCM</dt><dd>{data.rccm_number}</dd></div><div><dt className="font-semibold">Impot</dt><dd>{data.tax_number}</dd></div><div><dt className="font-semibold">Verification</dt><dd>{data.is_verified ? "Verifiee" : "En attente"}</dd></div></dl></Card>}
      </StateBlock>
    </>
  );
}
