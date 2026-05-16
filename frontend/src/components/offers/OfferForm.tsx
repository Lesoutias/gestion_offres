import { FormEvent, useState } from "react";
import type { OfferCreate } from "../../types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function OfferForm({ tenderCallId, companyId, onSubmit }: { tenderCallId: number; companyId: number; onSubmit: (payload: OfferCreate) => void | Promise<void> }) {
  const [form, setForm] = useState<OfferCreate>({ tender_call_id: tenderCallId, company_id: companyId, montant: 0 });
  return (
    <form onSubmit={(e: FormEvent) => { e.preventDefault(); onSubmit(form); }} className="grid gap-4">
      <Input label="Montant propose" type="number" value={form.montant} onChange={(e) => setForm({ ...form, montant: Number(e.target.value) })} required />
      <Input label="Delai d'execution" value={form.delai_execution || ""} onChange={(e) => setForm({ ...form, delai_execution: e.target.value })} />
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Proposition technique</span>
        <textarea className="min-h-28 w-full rounded-md border border-slate-300 p-3 text-sm" value={form.proposition_technique || ""} onChange={(e) => setForm({ ...form, proposition_technique: e.target.value })} />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Proposition financiere</span>
        <textarea className="min-h-28 w-full rounded-md border border-slate-300 p-3 text-sm" value={form.proposition_financiere || ""} onChange={(e) => setForm({ ...form, proposition_financiere: e.target.value })} />
      </label>
      <Button type="submit">Soumettre l'offre</Button>
    </form>
  );
}
