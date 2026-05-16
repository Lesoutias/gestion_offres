export type TenderStatus = "draft" | "published" | "closed" | "evaluation" | "awarded" | "cancelled";

export interface TenderCall {
  id: number;
  reference: string;
  objet: string;
  description?: string | null;
  date_publication?: string | null;
  date_limite: string;
  statut: TenderStatus;
  budget_previsionnel?: number | null;
  type_marche?: string | null;
  lieu_execution?: string | null;
  authority_id: number;
  published_by_id?: number | null;
  created_at: string;
  updated_at: string;
}

export interface TenderCallCreate {
  reference: string;
  objet: string;
  description?: string;
  date_limite: string;
  budget_previsionnel?: number;
  type_marche?: string;
  lieu_execution?: string;
  authority_id: number;
  published_by_id?: number;
}

export type TenderCallUpdate = Partial<Omit<TenderCallCreate, "authority_id" | "published_by_id">> & {
  statut?: TenderStatus;
};
