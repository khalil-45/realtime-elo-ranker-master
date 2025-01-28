import { Controller, Post, Body } from '@nestjs/common';
import { MatchService } from '../match.service';
import { MatchResultDto } from '../dto/match-result.dto';

@Controller('api/match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  async handleMatchResult(@Body() matchResultDto: MatchResultDto) {
    return this.matchService.handleMatchResult(matchResultDto);
  }
}