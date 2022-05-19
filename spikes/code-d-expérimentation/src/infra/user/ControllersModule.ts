import { Module } from '@nestjs/common';
import { UseCasesModules as UseCasesModule } from 'src/use-case/UseCasesModule';
import { CommonModule } from '../server/common/CommonModule';
import { CatEndpoint } from './cat/CatEndpoint';
import { HomeEndpoint } from './main/HomeEndpoint';
import { SpikeEndpoint } from './SpikeEndpoint';

@Module({
  imports: [UseCasesModule, CommonModule],
  controllers: [CatEndpoint, HomeEndpoint, SpikeEndpoint],
})
export class ControllersModule {}
