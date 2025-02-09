import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('PlayerService', () => {
  let service: PlayerService;
  let repository: Repository<Player>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        {
          provide: getRepositoryToken(Player),
          useClass: Repository,
        },
        EventEmitter2,
      ],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
    repository = module.get<Repository<Player>>(getRepositoryToken(Player));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a player', async () => {
    const createPlayerDto = { id: 'player1', initialRank: 1200 };
    const player = { id: 'player1', rank: 1200 } as Player;
    jest.spyOn(repository, 'find').mockResolvedValue([]);
    jest.spyOn(repository, 'save').mockResolvedValue(player);
    jest.spyOn(repository, 'create').mockReturnValue(player);
    jest.spyOn(repository, 'findOne').mockResolvedValue(player);

    const result = await service.create(createPlayerDto);
    expect(result).toEqual(player);
  });

  it('should find all players', async () => {
    const players = [{ id: 'player1', rank: 1200 }] as Player[];
    jest.spyOn(repository, 'find').mockResolvedValue(players);

    const result = await service.findAll();
    expect(result).toEqual(players);
  });

  it('should find one player', async () => {
    const player = { id: 'player1', rank: 1200 } as Player;
    jest.spyOn(repository, 'findOne').mockResolvedValue(player);

    const result = await service.findOne('player1');
    expect(result).toEqual(player);
  });

  it('should throw error if player not found', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    await expect(service.findOne('player1')).rejects.toThrow('Player not found');
  });

  it('should update player rank', async () => {
    const player = { id: 'player1', rank: 1200 } as Player;
    jest.spyOn(repository, 'findOne').mockResolvedValue(player);
    jest.spyOn(repository, 'save').mockResolvedValue(player);

    const result = await service.updatePlayerRank('player1', 1300);
    expect(result.rank).toEqual(1300);
  });
});