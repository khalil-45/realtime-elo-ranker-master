import { Controller, Get, Post, Body, Put } from '@nestjs/common';
import { PlayerService } from '../../services/player.service';
import { CreatePlayerDto } from '../../dto/create-player.dto';
import { MatchResultDto } from '../../dto/match-result.dto';

@Controller('api')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post('player')
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playerService.createPlayer(createPlayerDto);
  }

  @Get('ranking')
  async getPlayers() {
    return this.playerService.getPlayers();
  }

  @Post('match')
  async handleMatchResult(@Body() matchResultDto: MatchResultDto) {
    return this.playerService.handleMatchResult(matchResultDto);
  }
}