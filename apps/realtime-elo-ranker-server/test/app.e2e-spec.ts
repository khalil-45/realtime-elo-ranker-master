import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/player (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/player')
      .send({ id: 'player1', initialRank: 1200 })
      .expect(200)
      .expect({
        id: 'player1',
        rank: 1200,
      });
  });

  it('/api/ranking (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/ranking')
      .expect(200)
      .expect([]);
  });
});