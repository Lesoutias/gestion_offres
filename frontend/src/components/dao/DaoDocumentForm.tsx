import { FormEvent, useEffect, useState } from "react";
import type { DaoDocument, DaoDocumentCreate, OfferDocumentType } from "../../types";
import { OFFER_DOCUMENT_TYPE_OPTIONS } from "../../utils/offerDocumentTypes";
import { Button } from "../ui/Button";

type DaoFormState = Omit<DaoDocumentCreate, "tender_call_id">;

export function DaoDocumentForm({
  tenderCallId,
  initial,
  onSubmit,
}: {
  tenderCallId: number;
  initial?: DaoDocument | null;
  onSubmit: (payload: DaoDocumentCreate) => void | Promise<void>;
}) {
  const [form, setForm] = useState<DaoFormState>({
    required_document_types: [],
  });

  useEffect(() => {
    if (initial) {
      setForm({
        cahier_des_charges: initial.cahier_des_charges ?? undefined,
        criteres_selection: initial.criteres_selection ?? undefined,
        conditions_participation: initial.conditions_participation ?? undefined,
        pieces_exigees: initial.pieces_exigees ?? undefined,
        required_document_types: initial.required_document_types ?? [],
        document_url: initial.document_url ?? undefined,
      });
    }
  }, [initial]);

  const toggleRequiredType = (type: OfferDocumentType) => {
    setForm((current) => {
      const selected = current.required_document_types ?? [];
      const next = selected.includes(type)
        ? selected.filter((item) => item !== type)
        : [...selected, type];
      return { ...current, required_document_types: next };
    });
  };

  const field = (key: keyof DaoFormState, label: string) => (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <textarea
        className="min-h-24 w-full rounded-md border border-slate-300 p-3 text-sm"
        value={(form[key] as string) || ""}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
    </label>
  );

  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        onSubmit({ tender_call_id: tenderCallId, ...form });
      }}
      className="grid gap-4"
    >
      {field("cahier_des_charges", "Cahier des charges")}
      {field("criteres_selection", "Criteres de selection")}
      {field("conditions_participation", "Conditions de participation")}
      {field("pieces_exigees", "Pieces exigees (description complementaire)")}
      <fieldset className="rounded-md border border-slate-200 p-4">
        <legend className="px-1 text-sm font-medium text-slate-700">Pieces obligatoires a fournir</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {OFFER_DOCUMENT_TYPE_OPTIONS.map((option) => (
            <label key={option.value} className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={(form.required_document_types ?? []).includes(option.value)}
                onChange={() => toggleRequiredType(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>
      <Button type="submit">{initial ? "Mettre a jour le DAO" : "Enregistrer le DAO"}</Button>
    </form>
  );
}
