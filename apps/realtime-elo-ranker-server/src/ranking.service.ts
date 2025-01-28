import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class RankingService {
  constructor(private readonly eventEmitter: EventEmitter2) {}
}