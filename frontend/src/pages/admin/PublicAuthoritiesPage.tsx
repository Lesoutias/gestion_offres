import { Table } from "../../components/ui/Table";
import { publicAuthorityService } from "../../services/publicAuthorityService";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function PublicAuthoritiesPage() {
  const { data, loading, error } = useAsyncData(() => publicAuthorityService.getAll(), []);
  return (
    <>
      <PageTitle title="Autorites publiques" />
      <StateBlock loading={loading} error={error}>
        <Table headers={["Nom", "Email", "Telephone", "Budget"]}>
          {(data || []).map((authority) => (
            <tr key={authority.id}><td className="px-4 py-3">{authority.name}</td><td className="px-4 py-3">{authority.email}</td><td className="px-4 py-3">{authority.phone}</td><td className="px-4 py-3">{authority.budget}</td></tr>
          ))}
        </Table>
      </StateBlock>
    </>
  );
}
