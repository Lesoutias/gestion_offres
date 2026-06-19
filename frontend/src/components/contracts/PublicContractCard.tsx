import type { PublicContract } from "../../types";
import { formatAmount } from "../../utils/formatCurrency";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

export function PublicContractCard({ contract }: { contract: PublicContract }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">Marche public #{contract.id}</h3>
          <p className="text-sm text-slate-600">Montant: {formatAmount(contract.montant, contract.devise)}</p>
        </div>
        <Badge tone={contract.statut === "completed" ? "green" : "blue"}>{contract.statut}</Badge>
      </div>
    </Card>
  );
}
