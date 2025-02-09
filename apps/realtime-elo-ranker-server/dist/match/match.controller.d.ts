import { MatchService } from './match.service';
import { MatchResultDto } from './dto/match-result.dto';
export declare class MatchController {
    private readonly matchService;
    constructor(matchService: MatchService);
    publishMatchResult(matchResultDto: MatchResultDto): Promise<void>;
}
