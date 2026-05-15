export interface ApiError {
  detail: string | { msg: string; loc: string[] }[];
  status?: number;
  error?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode?: number,
    public details?: ApiError,
  ) {
    super(message);
    this.name = "AppError";
  }
}
