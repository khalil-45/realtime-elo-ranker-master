import { Repository } from 'typeorm';
import { Player } from '../entities/player.entity';
import { CreatePlayerDto } from '../dto/create-player.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MatchResultDto } from 'src/dto/match-result.dto';
export declare class PlayerService {
    private readonly playerRepository;
    private readonly eventEmitter;
    private ranks;
    constructor(playerRepository: Repository<Player>, eventEmitter: EventEmitter2);
    createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player>;
    updaterank(playerId: string, newrank: number): Promise<Player>;
    getPlayers(): Promise<Player[]>;
    initializeranks(): Promise<void>;
    handleMatchResult(matchResultDto: MatchResultDto): Promise<void>;
}
