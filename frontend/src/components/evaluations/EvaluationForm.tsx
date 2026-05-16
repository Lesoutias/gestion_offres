import { FormEvent, useState } from "react";
import type { EvaluationRecommendation, OfferEvaluationCreate } from "../../types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

export function EvaluationForm({ offerId, onSubmit }: { offerId: number; onSubmit: (payload: OfferEvaluationCreate) => void | Promise<void> }) {
  const [form, setForm] = useState<OfferEvaluationCreate>({ offer_id: offerId, technical_score: 0, financial_score: 0, recommendation: "reserve" });
  return (
    <form onSubmit={(e: FormEvent) => { e.preventDefault(); onSubmit(form); }} className="grid gap-4">
      <Input label="Score technique" type="number" value={form.technical_score} onChange={(e) => setForm({ ...form, technical_score: Number(e.target.value) })} />
      <Input label="Score financier" type="number" value={form.financial_score} onChange={(e) => setForm({ ...form, financial_score: Number(e.target.value) })} />
      <Select label="Recommendation" value={form.recommendation} onChange={(e) => setForm({ ...form, recommendation: e.target.value as EvaluationRecommendation })} options={[{ label: "Favorable", value: "favorable" }, { label: "Defavorable", value: "unfavorable" }, { label: "Reserve", value: "reserve" }]} />
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Commentaire</span>
        <textarea className="min-h-24 w-full rounded-md border border-slate-300 p-3 text-sm" value={form.comment || ""} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
      </label>
      <Button type="submit">Enregistrer l'evaluation</Button>
    </form>
  );
}
