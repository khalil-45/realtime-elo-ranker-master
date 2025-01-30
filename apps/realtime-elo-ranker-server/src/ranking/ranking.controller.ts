import { Controller, Get, Post, Body, Patch, Param, Delete, Sse } from '@nestjs/common';
import { Observable, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { RankingService } from './ranking.service';
import { UpdateRankingDto } from './dto/update-ranking.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Player } from '../interface/player.interface';
import { PlayerService } from '../player/player.service';


@Controller('api/ranking')
export class RankingController {
  constructor(private readonly eventEmitter: EventEmitter2,
    private readonly playerService: PlayerService
  ) { }

  @Get()
  findAll() {
    return this.playerService.findAll();
  }

  @Sse('events')
  sse(): Observable<MessageEvent> {
    const playerCreated = fromEvent(this.eventEmitter, 'player.created').pipe(
      map((event: {player: Player}) => {
        return <MessageEvent>{
          data: {
            type: 'RankingUpdate',
            player: event.player,
          }
        }
      }),
    );   

    const matchResult = fromEvent(this.eventEmitter, 'match.result').pipe(
      map((event: { player: Player }) => {
      return <MessageEvent>{
        data: {
        type: 'RankingUpdate',
        player: event.player,
        }
      }
      }),
    );

    return merge(matchResult, playerCreated);
  }
}
