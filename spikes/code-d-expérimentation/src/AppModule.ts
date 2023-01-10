import { Module } from '@nestjs/common'
import { CommonModule } from './infra/server/common/CommonModule'
import { LoadersModule } from './infra/server/loaders/LoadersModule'
import { ControllersModule } from './infra/user/ControllersModule'
import { UseCasesModules } from './use-case/UseCasesModule'

@Module({
  imports: [UseCasesModules, CommonModule, ControllersModule, LoadersModule],
})
export class AppModule {}
