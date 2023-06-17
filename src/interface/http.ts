export interface ResponseData<T = any> {
  code: number;
  isSuccess: boolean;
  message: string;
  data: T;
  requestId: string;
}
