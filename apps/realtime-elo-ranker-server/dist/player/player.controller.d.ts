import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
export declare class PlayerController {
    private readonly playerService;
    constructor(playerService: PlayerService);
    create(createPlayerDto: CreatePlayerDto): Promise<import("./entities/player.entity").Player>;
}
