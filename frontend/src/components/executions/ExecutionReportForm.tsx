import { FormEvent, useState } from "react";
import type { ExecutionReportCreate } from "../../types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function ExecutionReportForm({ executionId, onSubmit }: { executionId: number; onSubmit: (payload: ExecutionReportCreate) => void | Promise<void> }) {
  const [form, setForm] = useState<ExecutionReportCreate>({ execution_id: executionId, title: "", progress_percentage: 0 });
  return (
    <form onSubmit={(e: FormEvent) => { e.preventDefault(); onSubmit(form); }} className="grid gap-4">
      <Input label="Titre" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      <Input label="Pourcentage" type="number" value={form.progress_percentage} onChange={(e) => setForm({ ...form, progress_percentage: Number(e.target.value) })} />
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Description</span>
        <textarea className="min-h-24 w-full rounded-md border border-slate-300 p-3 text-sm" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </label>
      <Button type="submit">Ajouter le rapport</Button>
    </form>
  );
}
