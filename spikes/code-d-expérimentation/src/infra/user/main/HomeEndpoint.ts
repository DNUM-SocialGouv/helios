import { Controller, Get, Render, UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor } from 'src/infra/server/common/interceptors/LoggingInterceptor';

@Controller('/')
@UseInterceptors(LoggingInterceptor)
export class HomeEndpoint {
  @Get()
  @Render('index')
  home() {
    return { name: 'Bob' };
  }
}
