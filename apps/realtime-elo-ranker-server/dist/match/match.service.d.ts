import { PlayerService } from '../player/player.service';
import { MatchResultDto } from './dto/match-result.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class MatchService {
    private readonly playerService;
    private readonly eventEmitter;
    constructor(playerService: PlayerService, eventEmitter: EventEmitter2);
    handleMatchResult(matchResultDto: MatchResultDto): Promise<void>;
}
