import { Table } from "../../components/ui/Table";
import { userService } from "../../services/userService";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function UsersPage() {
  const { data, loading, error } = useAsyncData(() => userService.getAll(), []);
  return (
    <>
      <PageTitle title="Utilisateurs" />
      <StateBlock loading={loading} error={error}>
        <Table headers={["Nom", "Email", "Role", "Statut"]}>
          {(data || []).map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-3">{user.full_name || "-"}</td>
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3">{user.role?.name || user.role_name}</td>
              <td className="px-4 py-3">{user.is_active ? "Actif" : "Inactif"}</td>
            </tr>
          ))}
        </Table>
      </StateBlock>
    </>
  );
}
