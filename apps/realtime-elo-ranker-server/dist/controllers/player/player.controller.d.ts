import { PlayerService } from '../../services/player.service';
import { CreatePlayerDto } from '../../dto/create-player.dto';
import { MatchResultDto } from '../../dto/match-result.dto';
export declare class PlayerController {
    private readonly playerService;
    constructor(playerService: PlayerService);
    createPlayer(createPlayerDto: CreatePlayerDto): Promise<import("../../entities/player.entity").Player>;
    getPlayers(): Promise<import("../../entities/player.entity").Player[]>;
    handleMatchResult(matchResultDto: MatchResultDto): Promise<void>;
}
