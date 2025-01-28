import { Module } from '@nestjs/common';
import { PlayerModule } from './player.module';
import { MatchService } from './match.service';
import { MatchController } from './match/match.controller';

@Module({
  imports: [PlayerModule],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}