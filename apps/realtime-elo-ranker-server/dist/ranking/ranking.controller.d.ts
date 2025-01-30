import { Observable } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PlayerService } from '../player/player.service';
export declare class RankingController {
    private readonly eventEmitter;
    private readonly playerService;
    constructor(eventEmitter: EventEmitter2, playerService: PlayerService);
    findAll(): Promise<import("../player/entities/player.entity").Player[]>;
    sse(): Observable<MessageEvent>;
}
