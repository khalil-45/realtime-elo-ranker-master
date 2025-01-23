import { Controller, Get, Sse } from '@nestjs/common';
import { Observable, interval, map } from 'rxjs';

@Controller('api/ranking')
export class SseController {
  @Sse('events')
  sse(): Observable<MessageEvent> {
    return interval(1000).pipe(
      map(() => ({ data: { message: 'Ranking updated' } } as MessageEvent)),
    );
  }
}