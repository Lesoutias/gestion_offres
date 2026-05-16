import { Card } from "../../components/ui/Card";
import { Table } from "../../components/ui/Table";
import { permissionService } from "../../services/permissionService";
import { roleService } from "../../services/roleService";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function RolesPermissionsPage() {
  const roles = useAsyncData(() => roleService.getAll(), []);
  const permissions = useAsyncData(() => permissionService.getAll(), []);
  return (
    <>
      <PageTitle title="Roles et permissions" />
      <div className="grid gap-6 lg:grid-cols-2">
        <StateBlock loading={roles.loading} error={roles.error}>
          <Card title="Roles">
            <div className="space-y-3">
              {(roles.data || []).map((role) => <div key={role.id} className="rounded-md bg-slate-50 p-3 text-sm"><strong>{role.name}</strong><p>{role.description}</p></div>)}
            </div>
          </Card>
        </StateBlock>
        <StateBlock loading={permissions.loading} error={permissions.error}>
          <Table headers={["Permission", "Description"]}>
            {(permissions.data || []).map((permission) => (
              <tr key={permission.id}><td className="px-4 py-3">{permission.name}</td><td className="px-4 py-3">{permission.description}</td></tr>
            ))}
          </Table>
        </StateBlock>
      </div>
    </>
  );
}
