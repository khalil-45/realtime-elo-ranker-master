import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../entities/player.entity';
import { CreatePlayerDto } from '../dto/create-player.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MatchResultDto } from 'src/dto/match-result.dto';

@Injectable()
export class PlayerService {
  private ranks: { [id: string]: number } = {};

  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const player = this.playerRepository.create({
      id: createPlayerDto.id,
      rank: createPlayerDto.initialRank ?? 1000,
    });
    const savedPlayer = await this.playerRepository.save(player);
    this.ranks[savedPlayer.id] = savedPlayer.rank;
    this.eventEmitter.emit('player.created', savedPlayer);
    return savedPlayer;
  }

  async updaterank(playerId: string, newrank: number): Promise<Player> {
    const player = await this.playerRepository.findOne({ where: { id: playerId } });
    if (!player) {
      throw new Error('Player not found');
    }
    player.rank = newrank;
    const updatedPlayer = await this.playerRepository.save(player);
    this.ranks[updatedPlayer.id] = updatedPlayer.rank;
    this.eventEmitter.emit('player.updated', updatedPlayer);
    return updatedPlayer;
  }

  async getPlayers(): Promise<Player[]> {
    return this.playerRepository.find();
  }

  async initializeranks() {
    const players = await this.playerRepository.find();
    players.forEach(player => {
      this.ranks[player.id] = player.rank;
    });
  }

  async handleMatchResult(matchResultDto: MatchResultDto): Promise<void> {
    const { winner, loser, draw } = matchResultDto;
    let winnerPlayer = await this.playerRepository.findOne({ where: { id: winner } });
    let loserPlayer = await this.playerRepository.findOne({ where: { id: loser } });

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
      await this.updaterank(winner, Math.round(winnerNewrank));
      await this.updaterank(loser, Math.round(loserNewrank));
    } else {
      // win/lose case
      const winnerNewrank = winnerPlayer.rank + K * (1 - WeWinner);
      const loserNewrank = loserPlayer.rank + K * (0 - WeLoser);
      await this.updaterank(winner, Math.round(winnerNewrank));
      await this.updaterank(loser, Math.round(loserNewrank));
    }

    winnerPlayer = await this.playerRepository.findOne({ where: { id: winner } });
    loserPlayer = await this.playerRepository.findOne({ where: { id: loser } });

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