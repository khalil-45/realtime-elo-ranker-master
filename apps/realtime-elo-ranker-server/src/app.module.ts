import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Player } from './entities/player.entity';
import { PlayerService } from './services/player.service';
import { PlayerController } from './controllers/player/player.controller';
import { SseController } from './controllers/sse/sse.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Player],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Player]),
    EventEmitterModule.forRoot(),
  ],
  controllers: [PlayerController, SseController],
  providers: [PlayerService],
})
export class AppModule {}