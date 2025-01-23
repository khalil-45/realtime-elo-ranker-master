import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../entities/player.entity';
import { CreatePlayerDto } from '../dto/create-player.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MatchResultDto } from 'src/dto/match-result.dto';

@Injectable()
export class PlayerService {
  private rankings: { [id: string]: number } = {};

  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const player = this.playerRepository.create({
      id: createPlayerDto.id,
      ranking: createPlayerDto.initialRanking ?? 1000, // Default ranking
    });
    const savedPlayer = await this.playerRepository.save(player);
    this.rankings[savedPlayer.id] = savedPlayer.ranking;
    this.eventEmitter.emit('player.created', savedPlayer);
    return savedPlayer;
  }

  async updateRanking(playerId: string, newRanking: number): Promise<Player> {
    const player = await this.playerRepository.findOne({ where: { id: playerId } });
    if (!player) {
      throw new Error('Player not found');
    }
    player.ranking = newRanking;
    const updatedPlayer = await this.playerRepository.save(player);
    this.rankings[updatedPlayer.id] = updatedPlayer.ranking;
    this.eventEmitter.emit('player.updated', updatedPlayer);
    return updatedPlayer;
  }

  async getPlayers(): Promise<Player[]> {
    return this.playerRepository.find();
  }

  getRankings(): { [id: string]: number } {
    return this.rankings;
  }

  async initializeRankings() {
    const players = await this.playerRepository.find();
    players.forEach(player => {
      this.rankings[player.id] = player.ranking;
    });
  }

  async handleMatchResult(matchResultDto: MatchResultDto): Promise<void> {
    const { winner, loser, draw } = matchResultDto;
    const winnerPlayer = await this.playerRepository.findOne({ where: { id: winner } });
    const loserPlayer = await this.playerRepository.findOne({ where: { id: loser } });

    if (!winnerPlayer || !loserPlayer) {
      throw new Error('One or both players not found');
    }

    const K = 32; // ponderation factor

    // victory probability
    const WeWinner = 1 / (1 + Math.pow(10, (loserPlayer.ranking - winnerPlayer.ranking) / 400));
    const WeLoser = 1 / (1 + Math.pow(10, (winnerPlayer.ranking - loserPlayer.ranking) / 400));

    if (draw) {
      // draw case
      const winnerNewRanking = winnerPlayer.ranking + K * (0.5 - WeWinner);
      const loserNewRanking = loserPlayer.ranking + K * (0.5 - WeLoser);
      await this.updateRanking(winner, Math.round(winnerNewRanking));
      await this.updateRanking(loser, Math.round(loserNewRanking));
    } else {
      // win/lose case
      const winnerNewRanking = winnerPlayer.ranking + K * (1 - WeWinner);
      const loserNewRanking = loserPlayer.ranking + K * (0 - WeLoser);
      await this.updateRanking(winner, Math.round(winnerNewRanking));
      await this.updateRanking(loser, Math.round(loserNewRanking));
    }

    // event emitter
    this.eventEmitter.emit('player.updated', winnerPlayer);
    this.eventEmitter.emit('player.updated', loserPlayer);
  }
}