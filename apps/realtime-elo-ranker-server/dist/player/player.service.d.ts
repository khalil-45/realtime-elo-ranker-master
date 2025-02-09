import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class PlayerService {
    private readonly playerRepository;
    private readonly eventEmitter;
    constructor(playerRepository: Repository<Player>, eventEmitter: EventEmitter2);
    create(createPlayerDto: CreatePlayerDto): Promise<Player>;
    findAll(): Promise<Player[]>;
    findOne(id: string): Promise<Player | null>;
    updatePlayerRank(id: string, newRank: number): Promise<Player>;
}
