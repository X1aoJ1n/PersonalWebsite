// BaseResponse.ts

export interface BaseResponse<T> {
  code: number;
  message: string;
  data: T;
}

export class Response {
  // 成功响应
  static success<T>(data: T, message = 'success'): BaseResponse<T> {
    return {
      code: 200,
      message,
      data,
    };
  }

  // 失败响应
  static error<T = null>(message: string, code = 500, data?: T): BaseResponse<T> {
    return {
      code,
      message,
      data: data as T,
    };
  }
}
