import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ConfigService } from '@nestjs/config';

// must implement canActivate Interface
// must define canActivate method, the method must return a boolean
// must return a response that is sync or async i.e a Promise or an Observable
@Injectable()
export class ApiKeyGuard implements CanActivate { // objective, ensure API key is present in all request that are not public
  constructor(
    private readonly reflector: Reflector,// helps get metadata within a context
    private readonly configService: ConfigService
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    if(isPublic){
      return true
    }
    // we assume the caller is passing the API key as Authorization header
    // gives us access to request/response object
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    // const response = ctx.getResponse<Response>();

    const authHeader = request.header('Authorization');
    return authHeader === this.configService.get('API_KEY');
    // return authHeader === process.env.API_KEY;
  }
}
