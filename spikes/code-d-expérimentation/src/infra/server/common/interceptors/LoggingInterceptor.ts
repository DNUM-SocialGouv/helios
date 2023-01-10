import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { ILogger } from 'src/domain/logger/ILogger'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(@Inject('Logger') private readonly logger: ILogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.logger.log('Before...')

    const now = Date.now()
    return next.handle().pipe(tap(() => this.logger.log(`After... ${Date.now() - now}ms`)))
  }
}
