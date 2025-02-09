import { Test, TestingModule } from '@nestjs/testing';
import { MatchService } from './match.service';
import { PlayerService } from '../player/player.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from '../player/entities/player.entity';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MatchResultDto } from './dto/match-result.dto';

describe('MatchService', () => {
  let service: MatchService;
  let playerService: PlayerService;
  let repository: Repository<Player>;

  beforeEach((done) => {
    Test.createTestingModule({
      providers: [
        MatchService,
        PlayerService,
        {
          provide: getRepositoryToken(Player),
          useClass: Repository,
        },
        EventEmitter2,
      ],
    }).compile().then((module: TestingModule) => {
      service = module.get<MatchService>(MatchService);
      playerService = module.get<PlayerService>(PlayerService);
      repository = module.get<Repository<Player>>(getRepositoryToken(Player));
      done();
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});