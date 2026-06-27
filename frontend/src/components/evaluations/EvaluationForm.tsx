import { FormEvent, useState } from "react";
import type { EvaluationRecommendation, OfferEvaluationCreate } from "../../types";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";

export function EvaluationForm({
  offerId,
  onSubmit,
}: {
  offerId: number;
  onSubmit: (payload: OfferEvaluationCreate) => void | Promise<void>;
}) {
  const [form, setForm] = useState<OfferEvaluationCreate>({
    offer_id: offerId,
    recommendation: "reserve",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await onSubmit(form);
      const outcome =
        form.recommendation === "favorable"
          ? "L'offre est marquee comme conforme (evaluation positive)."
          : form.recommendation === "unfavorable"
            ? "L'offre est marquee comme non conforme (evaluation negative)."
            : "L'offre reste en analyse (conforme avec reserves).";
      setMessage(outcome);
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(detail || "Enregistrement impossible");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Select
        label="Conformite aux conditions du DAO"
        value={form.recommendation}
        onChange={(e) => setForm({ ...form, recommendation: e.target.value as EvaluationRecommendation })}
        options={[
          { label: "Conforme (evaluation positive)", value: "favorable" },
          { label: "Non conforme (evaluation negative)", value: "unfavorable" },
          { label: "Conforme avec reserves", value: "reserve" },
        ]}
      />
      <p className="text-xs text-slate-500">
        Impact sur le score : favorable = 100, avec reserves = 50, defavorable = 0. L'avis compte pour 20 % du total.
      </p>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Rapport / commentaire</span>
        <textarea className="min-h-24 w-full rounded-md border border-slate-300 p-3 text-sm" value={form.comment || ""} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
      </label>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {message && <p className="text-sm text-emerald-700">{message}</p>}
      <Button type="submit" disabled={saving}>{saving ? "Enregistrement..." : "Enregistrer l'evaluation"}</Button>
    </form>
  );
}
