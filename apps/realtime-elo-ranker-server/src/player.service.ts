import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const player = this.playerRepository.create({
      id: createPlayerDto.id,
      rank: createPlayerDto.initialRank ?? 1000, // Default ranking
    });
    const savedPlayer = await this.playerRepository.save(player);
    const playerCreated = await this.playerRepository.findOne({ where: { id: createPlayerDto.id } });
    if (playerCreated) {
    this.eventEmitter.emit('player.created', {
      player: {
        id: playerCreated.id,
        rank: playerCreated.rank,
      },
    });
    }
    return savedPlayer;
  }

  async updateRank(playerId: string, newRanking: number): Promise<Player> {
    const player = await this.getPlayerById(playerId);
    player.rank = newRanking;
    const updatedPlayer = await this.playerRepository.save(player);
    this.eventEmitter.emit('player.updated', updatedPlayer);
    return updatedPlayer;
  }

  async getPlayers(): Promise<Player[]> {
    return this.playerRepository.find();
  }

  async getPlayerById(id: string): Promise<Player> {
    const player = await this.playerRepository.findOne({ where: { id } });
    if (!player) {
      throw new Error('Player not found');
    }
    return player;
  }
}