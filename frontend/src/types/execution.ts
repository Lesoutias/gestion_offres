export type ExecutionStatus = "not_started" | "in_progress" | "delayed" | "completed" | "cancelled";

export interface Execution {
  id: number;
  public_contract_id: number;
  avancement: number;
  date_debut?: string | null;
  date_fin_prevue?: string | null;
  date_fin_reelle?: string | null;
  statut: ExecutionStatus;
  observations?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExecutionCreate {
  public_contract_id: number;
  avancement?: number;
  date_debut?: string;
  date_fin_prevue?: string;
  date_fin_reelle?: string;
  observations?: string;
}

export type ExecutionUpdate = Partial<ExecutionCreate> & {
  statut?: ExecutionStatus;
};

export interface ExecutionReport {
  id: number;
  execution_id: number;
  title: string;
  description?: string | null;
  progress_percentage: number;
  report_file_url?: string | null;
  created_by_id: number;
  created_at: string;
}

export interface ExecutionReportCreate {
  execution_id: number;
  title: string;
  description?: string;
  progress_percentage: number;
  report_file_url?: string;
}
