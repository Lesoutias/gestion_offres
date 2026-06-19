import { FormEvent, useState } from "react";
import type { TenderCallCreate } from "../../types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function TenderCallForm({ onSubmit }: { onSubmit: (payload: TenderCallCreate) => Promise<void> | void }) {
  const [form, setForm] = useState<Omit<TenderCallCreate, "reference">>({
    objet: "",
    description: "",
    date_limite: "",
    authority_id: 1,
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit({ ...form, date_limite: new Date(form.date_limite).toISOString() });
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      <p className="text-sm text-slate-600">
        La reference sera generee automatiquement (ex. AO-2026-0001).
      </p>
      <Input label="Objet" value={form.objet} onChange={(e) => setForm({ ...form, objet: e.target.value })} required />
      <Input label="Date limite" type="datetime-local" value={form.date_limite} onChange={(e) => setForm({ ...form, date_limite: e.target.value })} required />
      <Input label="Budget previsionnel" type="number" value={form.budget_previsionnel ?? ""} onChange={(e) => setForm({ ...form, budget_previsionnel: Number(e.target.value) })} />
      <Input label="Type de marche" value={form.type_marche ?? ""} onChange={(e) => setForm({ ...form, type_marche: e.target.value })} />
      <Input label="Lieu d'execution" value={form.lieu_execution ?? ""} onChange={(e) => setForm({ ...form, lieu_execution: e.target.value })} />
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Description</span>
        <textarea className="min-h-28 w-full rounded-md border border-slate-300 p-3 text-sm" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </label>
      <Button type="submit">Enregistrer</Button>
    </form>
  );
}
