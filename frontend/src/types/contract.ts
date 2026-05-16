export type ContractStatus = "draft" | "signed" | "cancelled";

export interface Contract {
  id: number;
  public_contract_id: number;
  reference: string;
  date_signature?: string | null;
  garanties?: string | null;
  obligations?: string | null;
  contract_file_url?: string | null;
  statut: ContractStatus;
  created_at: string;
  updated_at: string;
}

export interface ContractCreate {
  public_contract_id: number;
  reference: string;
  garanties?: string;
  obligations?: string;
  contract_file_url?: string;
}

export type ContractUpdate = Partial<ContractCreate> & {
  date_signature?: string;
  statut?: ContractStatus;
};
