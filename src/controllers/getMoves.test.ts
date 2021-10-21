import request from 'supertest';
import { app } from '../app';

describe('Test getMoves', () => {
  it('Request /games/0', async () => {
    const result = await request(app).get('/games/0').send();

    expect(result.status).toBe(200);
    console.log(result)
  });
});