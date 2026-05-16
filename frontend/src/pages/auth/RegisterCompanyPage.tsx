import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import type { RegisterCompanyRequest } from "../../types";

export default function RegisterCompanyPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterCompanyRequest>({ email: "", password: "", company_name: "" });
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await authService.registerCompany(form);
      navigate("/login");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Inscription impossible");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <form onSubmit={submit} className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">Inscription entreprise</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Mot de passe" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Input label="Nom du responsable" value={form.full_name || ""} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          <Input label="Nom de l'entreprise" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} required />
          <Input label="Telephone" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Site web" value={form.website || ""} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          <Input label="RCCM" value={form.rccm_number || ""} onChange={(e) => setForm({ ...form, rccm_number: e.target.value })} />
          <Input label="Numero impot" value={form.tax_number || ""} onChange={(e) => setForm({ ...form, tax_number: e.target.value })} />
          <Input label="Secteur" value={form.sector || ""} onChange={(e) => setForm({ ...form, sector: e.target.value })} />
          <Input label="Adresse" value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
        <div className="mt-6 flex items-center gap-3">
          <Button type="submit">Creer le compte</Button>
          <Link className="text-sm font-medium text-slate-600" to="/login">Deja inscrit</Link>
        </div>
      </form>
    </main>
  );
}
