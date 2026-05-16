import { FormEvent, useState } from "react";
import type { DaoDocumentCreate } from "../../types";
import { Button } from "../ui/Button";

export function DaoDocumentForm({ tenderCallId, onSubmit }: { tenderCallId: number; onSubmit: (payload: DaoDocumentCreate) => void | Promise<void> }) {
  const [form, setForm] = useState<DaoDocumentCreate>({ tender_call_id: tenderCallId });
  const field = (key: keyof DaoDocumentCreate, label: string) => (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <textarea className="min-h-24 w-full rounded-md border border-slate-300 p-3 text-sm" value={(form[key] as string) || ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
    </label>
  );
  return (
    <form onSubmit={(e: FormEvent) => { e.preventDefault(); onSubmit(form); }} className="grid gap-4">
      {field("cahier_des_charges", "Cahier des charges")}
      {field("criteres_selection", "Criteres de selection")}
      {field("conditions_participation", "Conditions de participation")}
      {field("pieces_exigees", "Pieces exigees")}
      <Button type="submit">Enregistrer le DAO</Button>
    </form>
  );
}
