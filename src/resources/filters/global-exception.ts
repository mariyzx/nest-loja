import {
  ArgumentsHost,
  Catch,
  ConsoleLogger,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';
import type { UserPayload } from '../../modules/auth/auth.service';

interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private adapterHost: HttpAdapterHost,
    private loggerNative: ConsoleLogger,
  ) {}
  catch(exception: unknown, host: ArgumentsHost) {
    this.loggerNative.error(
      exception,
      '--- Exception Caught by HttpExceptionFilter ---',
    );
    const { httpAdapter } = this.adapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const request = ctx.getRequest<Request>();

    try {
      const method = request.method;
      const url = String(httpAdapter.getRequestUrl(request));
      const uaHeader = request.headers['user-agent'];
      const userAgent = Array.isArray(uaHeader) ? uaHeader.join(',') : uaHeader;
      const ip = (request.headers['x-forwarded-for'] as string) || request.ip;
      this.loggerNative.log(
        `Request: ${method} ${url} | UA: ${userAgent} | IP: ${ip}`,
      );
    } catch (e) {
      this.loggerNative.warn('Falha ao coletar metadados da requisição', e);
    }

    const reqAuth = request as AuthenticatedRequest;
    if (reqAuth?.user) {
      this.loggerNative.log(`User Info: ${JSON.stringify(reqAuth.user.sub)}`);
    }

    if (!reqAuth.user && process.env.NODE_ENV !== 'production') {
      const authHeader = request.headers?.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payloadB64 = parts[1];
            const payloadJson = Buffer.from(payloadB64, 'base64').toString(
              'utf8',
            );
            const payloadUnknown: unknown = JSON.parse(payloadJson);
            if (
              payloadUnknown &&
              typeof payloadUnknown === 'object' &&
              'sub' in payloadUnknown
            ) {
              const sub = (payloadUnknown as { sub?: unknown }).sub;
              const subText =
                typeof sub === 'string' || typeof sub === 'number'
                  ? String(sub)
                  : 'desconhecido';
              this.loggerNative.log(`JWT (não verificado) sub: ${subText}`);
            } else {
              this.loggerNative.warn(
                'Payload de JWT (não verificado) sem campo sub',
              );
            }
          } else {
            this.loggerNative.warn('Formato de JWT inválido para depuração');
          }
        } catch (e) {
          this.loggerNative.warn(
            'Não foi possível decodificar o JWT para depuração',
            e,
          );
        }
      } else {
        this.loggerNative.log('Sem header Authorization ou formato não-Bearer');
      }
    }
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
              path: String(httpAdapter.getRequestUrl(request)),
            },
          };

    httpAdapter.reply(response, body, status);
  }
}
