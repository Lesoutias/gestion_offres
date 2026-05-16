import { FormEvent, useState } from "react";
import type { ContractCreate } from "../../types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function ContractForm({ publicContractId, onSubmit }: { publicContractId: number; onSubmit: (payload: ContractCreate) => void | Promise<void> }) {
  const [form, setForm] = useState<ContractCreate>({ public_contract_id: publicContractId, reference: "" });
  return (
    <form onSubmit={(e: FormEvent) => { e.preventDefault(); onSubmit(form); }} className="grid gap-4">
      <Input label="Reference du contrat" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} required />
      <Input label="Garanties" value={form.garanties || ""} onChange={(e) => setForm({ ...form, garanties: e.target.value })} />
      <Input label="Obligations" value={form.obligations || ""} onChange={(e) => setForm({ ...form, obligations: e.target.value })} />
      <Button type="submit">Enregistrer le contrat</Button>
    </form>
  );
}
