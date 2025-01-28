import { Injectable, Logger } from '@nestjs/common';
import { PlayerService } from './player.service';
import { MatchResultDto } from './dto/match-result.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class MatchService {

  constructor(
    private readonly playerService: PlayerService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

async handleMatchResult(matchResultDto: MatchResultDto): Promise<void> {
    const { winner, loser, draw } = matchResultDto;
    let winnerPlayer = await this.playerService.getPlayerById(winner);
    let loserPlayer = await this.playerService.getPlayerById(loser);

    if (!winnerPlayer || !loserPlayer) {
      throw new Error('One or both players not found');
    }

    const K = 32; // ponderation factor

    // victory probability
    const WeWinner = 1 / (1 + Math.pow(10, (loserPlayer.rank - winnerPlayer.rank) / 400));
    const WeLoser = 1 / (1 + Math.pow(10, (winnerPlayer.rank - loserPlayer.rank) / 400));

    if (draw) {
      // draw case
      const winnerNewrank = winnerPlayer.rank + K * (0.5 - WeWinner);
      const loserNewrank = loserPlayer.rank + K * (0.5 - WeLoser);
      await this.playerService.updateRank(winner, Math.round(winnerNewrank));
      await this.playerService.updateRank(loser, Math.round(loserNewrank));
    } else {
      // win/lose case
      const winnerNewrank = winnerPlayer.rank + K * (1 - WeWinner);
      const loserNewrank = loserPlayer.rank + K * (0 - WeLoser);
      await this.playerService.updateRank(winner, Math.round(winnerNewrank));
      await this.playerService.updateRank(loser, Math.round(loserNewrank));
    }

    winnerPlayer = await this.playerService.getPlayerById(winner);
    loserPlayer = await this.playerService.getPlayerById(loser);

    // event emitter for winner
    if (winnerPlayer) {
      this.eventEmitter.emit('match.result', {
        player: {
          id : winnerPlayer.id,
          rank : winnerPlayer.rank
        }
      });
    }

    // event emitter for loser
    if (loserPlayer) {
      this.eventEmitter.emit('match.result', {
        player: {
          id: loserPlayer.id,
          rank: loserPlayer.rank
        }
      });
    }
  }
}