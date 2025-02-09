import { Injectable } from '@nestjs/common';
import { PlayerService } from '../player/player.service';
import { MatchResultDto } from './dto/match-result.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Player } from 'src/player/entities/player.entity';

@Injectable()
export class MatchService {
  constructor(
    private readonly playerService: PlayerService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  handleMatchResult(matchResultDto: MatchResultDto): Promise<void> {
    const { winner, loser, draw } = matchResultDto;
    let winnerPlayer: Player | null;
    let loserPlayer: Player | null;

    return this.playerService.findOne(winner)
      .then(player => {
        winnerPlayer = player;
        return this.playerService.findOne(loser);
      })
      .then(player => {
        loserPlayer = player;

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
          return Promise.all([
            this.playerService.updatePlayerRank(winner, Math.round(winnerNewrank)),
            this.playerService.updatePlayerRank(loser, Math.round(loserNewrank))
          ]);
        } else {
          // win/lose case
          const winnerNewrank = winnerPlayer.rank + K * (1 - WeWinner);
          const loserNewrank = loserPlayer.rank + K * (0 - WeLoser);
          return Promise.all([
            this.playerService.updatePlayerRank(winner, Math.round(winnerNewrank)),
            this.playerService.updatePlayerRank(loser, Math.round(loserNewrank))
          ]);
        }
      })
      .then(() => this.playerService.findOne(winner))
      .then(player => {
        winnerPlayer = player;
        return this.playerService.findOne(loser);
      })
      .then(player => {
        loserPlayer = player;

        if (!winnerPlayer || !loserPlayer) {
          throw new Error('One or both players not found');
        }

        // event emitter for winner
        this.eventEmitter.emit('match.result', {
          player: {
            id: winnerPlayer.id,
            rank: winnerPlayer.rank,
          },
        });

        // event emitter for loser
        this.eventEmitter.emit('match.result', {
          player: {
            id: loserPlayer.id,
            rank: loserPlayer.rank,
          },
        });
      });
  }
}