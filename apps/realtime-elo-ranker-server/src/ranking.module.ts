import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RankingService } from './ranking.service';
import { SseController } from './sse/sse.controller';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [SseController],
  providers: [RankingService],
})
export class RankingModule {}