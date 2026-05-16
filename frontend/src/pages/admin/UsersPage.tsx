import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Table } from "../../components/ui/Table";
import { roleService } from "../../services/roleService";
import { userService } from "../../services/userService";
import type { Role, User, UserCreate, UserRole, UserUpdate } from "../../types";
import { PageTitle, StateBlock } from "../PageHelpers";

type UserFormState = {
  id?: number;
  email: string;
  full_name: string;
  password: string;
  role_name: UserRole | string;
  is_active: boolean;
};

const emptyForm: UserFormState = {
  email: "",
  full_name: "",
  password: "",
  role_name: "autorite_publique",
  is_active: true,
};

function getRoleName(user: User): string {
  return user.role?.name || user.role_name || "";
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const editing = form.id !== undefined;
  const roleOptions = useMemo(() => roles.map((role) => role.name), [roles]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [loadedUsers, loadedRoles] = await Promise.all([userService.getAll(), roleService.getAll()]);
      setUsers(loadedUsers);
      setRoles(loadedRoles);
      setForm((current) => ({
        ...current,
        role_name: current.role_name || loadedRoles[0]?.name || "autorite_publique",
      }));
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setForm({ ...emptyForm, role_name: roleOptions[0] || emptyForm.role_name });
    setMessage(null);
  };

  const editUser = (user: User) => {
    setMessage(null);
    setForm({
      id: user.id,
      email: user.email,
      full_name: user.full_name || "",
      password: "",
      role_name: getRoleName(user),
      is_active: user.is_active,
    });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      if (editing && form.id) {
        const payload: UserUpdate = {
          full_name: form.full_name || undefined,
          role_name: form.role_name as UserRole,
          is_active: form.is_active,
        };
        await userService.update(form.id, payload);
        setMessage("Utilisateur modifie avec succes.");
      } else {
        const payload: UserCreate = {
          email: form.email,
          full_name: form.full_name || undefined,
          password: form.password,
          role_name: form.role_name as UserRole,
        };
        await userService.create(payload);
        setMessage("Utilisateur cree avec succes.");
      }
      resetForm();
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Enregistrement impossible");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (user: User) => {
    setError(null);
    setMessage(null);
    try {
      if (user.is_active) {
        await userService.deactivate(user.id);
        setMessage("Utilisateur desactive.");
      } else {
        await userService.activate(user.id);
        setMessage("Utilisateur active.");
      }
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Changement de statut impossible");
    }
  };

  return (
    <>
      <PageTitle title="Utilisateurs" description="Creer, modifier et gerer les comptes par role." />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <StateBlock loading={loading} error={error && users.length === 0 ? error : null}>
          <Table headers={["Nom", "Email", "Role", "Permissions", "Statut", "Actions"]}>
            {users.map((user) => {
              const roleName = getRoleName(user);
              const permissions = user.role?.permissions || roles.find((role) => role.name === roleName)?.permissions || [];
              return (
                <tr key={user.id}>
                  <td className="px-4 py-3">{user.full_name || "-"}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{roleName || "-"}</td>
                  <td className="px-4 py-3">
                    <span className={permissions.length ? "text-slate-700" : "text-red-700"}>
                      {permissions.length ? `${permissions.length} permission(s)` : "Aucune permission"}
                    </span>
                  </td>
                  <td className="px-4 py-3">{user.is_active ? "Actif" : "Inactif"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="ghost" onClick={() => editUser(user)}>
                        Modifier
                      </Button>
                      <Button type="button" variant={user.is_active ? "danger" : "secondary"} onClick={() => toggleActive(user)}>
                        {user.is_active ? "Desactiver" : "Activer"}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </Table>
        </StateBlock>

        <Card title={editing ? "Modifier l'utilisateur" : "Nouvel utilisateur"}>
          <form className="space-y-4" onSubmit={submit}>
            <Input
              label="Nom complet"
              value={form.full_name}
              onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))}
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              disabled={editing}
              required
            />
            {!editing && (
              <Input
                label="Mot de passe"
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                required
              />
            )}
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Role</span>
              <select
                className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                value={form.role_name}
                onChange={(event) => setForm((current) => ({ ...current, role_name: event.target.value }))}
                required
              >
                {roleOptions.map((roleName) => (
                  <option key={roleName} value={roleName}>
                    {roleName}
                  </option>
                ))}
              </select>
            </label>
            {editing && (
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.checked }))}
                />
                Compte actif
              </label>
            )}
            {error && users.length > 0 && <p className="text-sm text-red-700">{error}</p>}
            {message && <p className="text-sm text-emerald-700">{message}</p>}
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Enregistrement..." : editing ? "Enregistrer" : "Creer"}
              </Button>
              {editing && (
                <Button type="button" variant="ghost" onClick={resetForm}>
                  Annuler
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
