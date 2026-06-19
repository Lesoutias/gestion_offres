import type { OfferEvaluation } from "../../types";
import { Table } from "../ui/Table";

const recommendationLabels: Record<string, string> = {
  favorable: "Conforme (positive)",
  unfavorable: "Non conforme (negative)",
  reserve: "Conforme avec reserves",
};

export function EvaluationTable({ evaluations }: { evaluations: OfferEvaluation[] }) {
  return (
    <Table headers={["Offre", "Technique", "Financier", "Avis", "Commentaire"]}>
      {evaluations.map((evaluation) => (
        <tr key={evaluation.id}>
          <td className="px-4 py-3">#{evaluation.offer_id}</td>
          <td className="px-4 py-3">{evaluation.technical_score}</td>
          <td className="px-4 py-3">{evaluation.financial_score}</td>
          <td className="px-4 py-3">{recommendationLabels[evaluation.recommendation] || evaluation.recommendation}</td>
          <td className="px-4 py-3">{evaluation.comment || "-"}</td>
        </tr>
      ))}
    </Table>
  );
}
