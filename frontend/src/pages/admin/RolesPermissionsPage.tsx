import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Table } from "../../components/ui/Table";
import { permissionService } from "../../services/permissionService";
import { roleService } from "../../services/roleService";
import type { Permission, Role } from "../../types";
import { PageTitle, StateBlock } from "../PageHelpers";

export default function RolesPermissionsPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const selectedRole = useMemo(
    () => roles.find((role) => role.id === selectedRoleId) || null,
    [roles, selectedRoleId],
  );

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [loadedRoles, loadedPermissions] = await Promise.all([roleService.getAll(), permissionService.getAll()]);
      setRoles(loadedRoles);
      setPermissions(loadedPermissions);
      const nextRole = loadedRoles.find((role) => role.id === selectedRoleId) || loadedRoles[0] || null;
      setSelectedRoleId(nextRole?.id || null);
      setSelectedPermissionIds((nextRole?.permissions || []).map((permission) => permission.id));
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const chooseRole = (role: Role) => {
    setSelectedRoleId(role.id);
    setSelectedPermissionIds(role.permissions.map((permission) => permission.id));
    setMessage(null);
  };

  const togglePermission = (permissionId: number) => {
    setSelectedPermissionIds((current) =>
      current.includes(permissionId)
        ? current.filter((id) => id !== permissionId)
        : [...current, permissionId],
    );
  };

  const savePermissions = async () => {
    if (!selectedRole) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const updatedRole = await roleService.assignPermissions(selectedRole.id, {
        permission_ids: selectedPermissionIds,
      });
      setRoles((current) => current.map((role) => (role.id === updatedRole.id ? updatedRole : role)));
      setSelectedPermissionIds(updatedRole.permissions.map((permission) => permission.id));
      setMessage("Permissions du role mises a jour.");
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Mise a jour impossible");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageTitle title="Roles et permissions" description="Verifier et associer les permissions de chaque role." />
      <StateBlock loading={loading} error={error && roles.length === 0 ? error : null}>
        <div className="grid gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
          <Card title="Roles">
            <div className="space-y-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  className={`w-full rounded-md border px-3 py-3 text-left text-sm transition ${
                    role.id === selectedRoleId
                      ? "border-emerald-700 bg-emerald-50 text-emerald-950"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                  onClick={() => chooseRole(role)}
                >
                  <span className="block font-semibold">{role.name}</span>
                  <span className="mt-1 block text-xs text-slate-500">
                    {role.permissions.length} permission(s)
                  </span>
                  {role.description && <span className="mt-1 block text-xs text-slate-500">{role.description}</span>}
                </button>
              ))}
            </div>
          </Card>

          <Card title={selectedRole ? `Permissions: ${selectedRole.name}` : "Permissions"}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-600">
                {selectedPermissionIds.length} permission(s) associee(s) sur {permissions.length}.
              </p>
              <Button type="button" onClick={savePermissions} disabled={!selectedRole || saving}>
                {saving ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
            {error && roles.length > 0 && <p className="mb-3 text-sm text-red-700">{error}</p>}
            {message && <p className="mb-3 text-sm text-emerald-700">{message}</p>}
            <Table headers={["Associer", "Permission", "Description"]}>
              {permissions.map((permission) => (
                <tr key={permission.id}>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedPermissionIds.includes(permission.id)}
                      onChange={() => togglePermission(permission.id)}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">{permission.name}</td>
                  <td className="px-4 py-3 text-slate-600">{permission.description || "-"}</td>
                </tr>
              ))}
            </Table>
          </Card>
        </div>
      </StateBlock>
    </>
  );
}
