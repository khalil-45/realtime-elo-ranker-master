import { Controller, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, merge, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('api/ranking')
export class SseController {
  constructor(private readonly eventEmitter: EventEmitter2) { }

  @Sse('events')
  sse(): Observable<MessageEvent> {
    const playerCreated = fromEvent(this.eventEmitter, 'player.created').pipe(
      map((player: any) => { // TODO : changer le any en une structure de données correcte
        return <MessageEvent>{
          data: {
            type: 'RankingUpdate',
            player: player,
          }
        }
      }),
    );

    const matchResult = fromEvent(this.eventEmitter, 'match.result').pipe(
      map((player: any) => { // TODO : changer le any en une structure de données correcte
        return <MessageEvent>{
          data: {
            type: 'RankingUpdate',
            player: {
              id: player.id,
              rank: player.rank,
            },
          }
        }
      }),
    );

    return merge(matchResult, playerCreated);
  }
}