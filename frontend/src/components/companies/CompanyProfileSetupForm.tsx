import { FormEvent, useState } from "react";
import type { Company, CompanyCreate } from "../../types";
import { companyService } from "../../services/companyService";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function CompanyProfileSetupForm({
  onCreated,
}: {
  onCreated: (company: Company) => void;
}) {
  const [form, setForm] = useState<CompanyCreate>({ name: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError(null);
      const company = await companyService.create(form);
      onCreated(company);
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Impossible de creer le profil entreprise");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <p className="sm:col-span-2 text-sm text-slate-600">
        Votre compte existe mais aucun profil entreprise n'est lie. Completez ces informations pour
        consulter les appels d'offres et soumettre des offres.
      </p>
      <Input label="Nom de l'entreprise" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <Input label="Email" type="email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <Input label="Telephone" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <Input label="RCCM" value={form.rccm_number || ""} onChange={(e) => setForm({ ...form, rccm_number: e.target.value })} />
      <Input label="Numero impot" value={form.tax_number || ""} onChange={(e) => setForm({ ...form, tax_number: e.target.value })} />
      <Input label="Secteur" value={form.sector || ""} onChange={(e) => setForm({ ...form, sector: e.target.value })} />
      <Input label="Adresse" value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      {error && <p className="sm:col-span-2 text-sm text-red-700">{error}</p>}
      <div className="sm:col-span-2">
        <Button type="submit" disabled={saving}>{saving ? "Enregistrement..." : "Creer mon profil entreprise"}</Button>
      </div>
    </form>
  );
}

export function isMissingCompanyProfileError(error: string | null | undefined): boolean {
  if (!error) return false;
  const normalized = error.toLowerCase();
  return normalized.includes("profil entreprise") || normalized.includes("entreprise introuvable");
}
