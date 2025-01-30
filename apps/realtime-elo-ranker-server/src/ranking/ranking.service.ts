import { Injectable } from '@nestjs/common';
import { UpdateRankingDto } from './dto/update-ranking.dto';
import { PlayerService } from '../player/player.service';


@Injectable()
export class RankingService {
  constructor(private playerService : PlayerService) {}

  async findAllPlayers() {
    return this.playerService.findAll();
  }
}
