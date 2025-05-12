export interface APIResponse<T> {
    code: number;
    result: T;
    message: string;
  }