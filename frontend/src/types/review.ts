export interface JobOfferReview {
  id: number;
  job_offer_id: number;
  user_id: number;
  rating: number; // 1-5
  comment: string;
  is_report: boolean;
  created_at: string;
  updated_at?: string;
}

export interface JobOfferReviewCreate {
  job_offer_id: number;
  rating: number;
  comment: string;
  is_report?: boolean;
}

export interface JobOfferReviewUpdate {
  rating?: number;
  comment?: string;
  is_report?: boolean;
}

export interface ReviewResponse {
  id: number;
  job_offer_id: number;
  user: {
    id: number;
    full_name: string;
  };
  rating: number;
  comment: string;
  is_report: boolean;
  created_at: string;
}
