import { Module } from '@nestjs/common'
import { LoadersModule } from 'src/infra/server/loaders/LoadersModule'
import { GetAllCatsUseCase } from './GetAllCatsUseCase'

@Module({
  imports: [LoadersModule],
  providers: [GetAllCatsUseCase],
  exports: [GetAllCatsUseCase],
})
export class UseCasesModules {}
