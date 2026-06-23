export type EvaluationRecommendation = "favorable" | "unfavorable" | "reserve";

export interface OfferEvaluation {
  id: number;
  offer_id: number;
  evaluator_id: number;
  technical_score: number;
  financial_score: number;
  comment?: string | null;
  recommendation: EvaluationRecommendation;
  created_at: string;
}

export interface OfferEvaluationCreate {
  offer_id: number;
  comment?: string;
  recommendation: EvaluationRecommendation;
}

export type OfferEvaluationUpdate = Partial<Omit<OfferEvaluationCreate, "offer_id">> & {
  technical_score?: number;
  financial_score?: number;
};
