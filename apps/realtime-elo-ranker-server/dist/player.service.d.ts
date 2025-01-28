import { Repository } from 'typeorm';
import { Player } from './player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class PlayerService {
    private readonly playerRepository;
    private readonly eventEmitter;
    constructor(playerRepository: Repository<Player>, eventEmitter: EventEmitter2);
    createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player>;
    updateRank(playerId: string, newRanking: number): Promise<Player>;
    getPlayers(): Promise<Player[]>;
    getPlayerById(id: string): Promise<Player>;
}
