import { PlayerService } from '../player.service';
import { CreatePlayerDto } from '../dto/create-player.dto';
export declare class PlayerController {
    private readonly playerService;
    constructor(playerService: PlayerService);
    createPlayer(createPlayerDto: CreatePlayerDto): Promise<import("../player.entity").Player>;
    getPlayers(): Promise<import("../player.entity").Player[]>;
}
