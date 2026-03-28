import { HttpException, HttpStatus } from '@nestjs/common';
import { IResponse } from './enum';


export interface ResponseData {
  message: string;
  code: number;
  data: any;
}
export function appResponse({ message, code, data }: IResponse): ResponseData {
  if (!message) message = 'Successful';
  if (!code) code = HttpStatus.OK;
  return {
    message,
    code,
    data,
  };
}

export function appException(error?: any, message?: string, status?: number) {
  console.log({ error, message, status });
  let m: string = 'Internal Server error';
  let s: number;
  error && error.message
    ? (m = error.message)
    : message
      ? (m = message)
      : (m = m);
  error && error.status
    ? (s = error.status)
    : error.statusCode
      ? (s = error.statusCode)
      : status
        ? (s = status)
        : (s = 500);
  throw new HttpException(m, s);
}

