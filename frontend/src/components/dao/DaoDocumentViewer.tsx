import type { DaoDocument } from "../../types";
import { Card } from "../ui/Card";

export function DaoDocumentViewer({ dao }: { dao?: DaoDocument | null }) {
  if (!dao) return <Card>Aucun dossier DAO disponible.</Card>;
  const items = [
    ["Cahier des charges", dao.cahier_des_charges],
    ["Criteres de selection", dao.criteres_selection],
    ["Conditions de participation", dao.conditions_participation],
    ["Pieces exigees", dao.pieces_exigees],
  ];
  return (
    <Card title="Dossier DAO">
      <div className="space-y-4">
        {items.map(([label, value]) => (
          <section key={label}>
            <h3 className="text-sm font-semibold text-slate-800">{label}</h3>
            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{value || "Non renseigne."}</p>
          </section>
        ))}
        {dao.document_url && <a className="text-sm font-medium text-emerald-700" href={dao.document_url}>Telecharger le fichier DAO</a>}
      </div>
    </Card>
  );
}
