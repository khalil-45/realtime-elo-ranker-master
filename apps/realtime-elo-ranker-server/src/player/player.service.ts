import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';



@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  
  async create(createPlayerDto: CreatePlayerDto) {
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

  findAll() {
    return this.playerRepository.find({ order: { rank: 'DESC' } });
  }

  async findOne(id: string) {
    const player = await this.playerRepository.findOne({ where: { id } });
    if (!player) {
      throw new Error('Player not found');
    }
    return player;
  }

  async updatePlayerRank(id: string, newRank: number): Promise<Player> {
    const player = await this.findOne(id);
    if (!player) {
      throw new BadRequestException('Player not found');
    }
    player.rank = newRank;
    return this.playerRepository.save(player);
  }
}
