export interface BaseResponse {
  status: number;
  success: boolean;
  message: string;
  action?: AuthActions;
}

export interface ApiSuccess<T> extends BaseResponse {
  success: true;
  data: T;
  meta?: Record<string, any>;
}

export interface ApiError extends BaseResponse {
  success: false;
  data: null;
  message: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
