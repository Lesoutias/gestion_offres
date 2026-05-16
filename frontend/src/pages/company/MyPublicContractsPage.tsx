import { PublicContractCard } from "../../components/contracts/PublicContractCard";
import { publicContractService } from "../../services/publicContractService";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function MyPublicContractsPage() {
  const { data, loading, error } = useAsyncData(() => publicContractService.getMine(), []);
  return <><PageTitle title="Mes marches gagnes" /><StateBlock loading={loading} error={error}><div className="grid gap-4">{(data || []).map((contract) => <PublicContractCard key={contract.id} contract={contract} />)}</div></StateBlock></>;
}
