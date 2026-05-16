import { Button } from "../../components/ui/Button";
import { Table } from "../../components/ui/Table";
import { companyService } from "../../services/companyService";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function CompaniesPage() {
  const { data, loading, error, setData } = useAsyncData(() => companyService.getAll(), []);
  return (
    <>
      <PageTitle title="Entreprises" />
      <StateBlock loading={loading} error={error}>
        <Table headers={["Nom", "Email", "Secteur", "Verification", "Action"]}>
          {(data || []).map((company) => (
            <tr key={company.id}>
              <td className="px-4 py-3">{company.name}</td>
              <td className="px-4 py-3">{company.email}</td>
              <td className="px-4 py-3">{company.sector}</td>
              <td className="px-4 py-3">{company.is_verified ? "Verifiee" : "Non verifiee"}</td>
              <td className="px-4 py-3">{!company.is_verified && <Button onClick={async () => { await companyService.verify(company.id); setData((data || []).map((item) => item.id === company.id ? { ...item, is_verified: true } : item)); }}>Verifier</Button>}</td>
            </tr>
          ))}
        </Table>
      </StateBlock>
    </>
  );
}
