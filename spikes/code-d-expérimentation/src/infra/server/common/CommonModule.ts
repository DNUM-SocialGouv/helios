import { Module } from '@nestjs/common'
import { ConsoleLogger } from './logger/ConsoleLogger'

@Module({
  providers: [{ provide: 'Logger', useClass: ConsoleLogger }],
  exports: ['Logger'],
})
export class CommonModule {}
