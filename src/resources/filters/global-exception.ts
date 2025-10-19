import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private adapterHost: HttpAdapterHost) {}
  catch(exception: unknown, host: ArgumentsHost) {
    console.error(exception, '--- Exception Caught by HttpExceptionFilter ---');
    const { httpAdapter } = this.adapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, body } =
      exception instanceof HttpException
        ? {
            status: exception.getStatus(),
            body: exception.getResponse(),
          }
        : {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              timestamp: new Date().toISOString(),
              path: httpAdapter.getRequestUrl(request),
            },
          };

    httpAdapter.reply(response, body, status);
  }
}
