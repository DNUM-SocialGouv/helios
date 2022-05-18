import { Module } from '@nestjs/common';
import { InMemoryCatLoader } from './InMemoryCatLoader';

@Module({
  providers: [
    {
      provide: 'CatLoader',
      useClass: InMemoryCatLoader,
    },
  ],
  exports: ['CatLoader'],
})
export class LoadersModule {}
