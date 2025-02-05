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
    const players = await this.playerRepository.find();
    const totalRank = players.reduce((sum, player) => sum + player.rank, 0);
    const averageRank = players.length ? totalRank / players.length : 1000;

    const newPlayer = this.playerRepository.create({
      id: createPlayerDto.id,
      rank: createPlayerDto.initialRank ?? averageRank,
    });
    const savedPlayer = await this.playerRepository.save(newPlayer);
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
