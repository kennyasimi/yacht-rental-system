import { Module } from '@nestjs/common';
import { BoatsController } from './boats.controller';
import { boatsService } from './boats.service';

@Module({
  controllers: [BoatsController],
  providers: [boatsService]
})
export class BoatsModule {}
