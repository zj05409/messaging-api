import supertest from 'supertest';

import { app } from '@test/bootstrap';

describe('Testing reservation controller/entrypoint', () => {
  class TokenMap {
    admin: string;

    employee: string;

    guest: string;
  }
  const tokenMap = new TokenMap();
  beforeAll(async () => {
    const usernames = ['admin', 'employee', 'guest'];
    const [adminToken, employeeToken, guestToken] = await Promise.all(
      usernames.map(async username => {
        const response: any = await supertest(app.getServer()).post('/api/auth/login').send({
          username,
          password: 'hilton'
        });
        return response.body.accessToken;
      })
    );
    tokenMap.admin = adminToken;
    tokenMap.employee = employeeToken;
    tokenMap.guest = guestToken;

    // console.log(JSON.stringify(tokenMap));
  });

  let request: any;
  beforeEach(async () => {
    request = supertest.agent(app.getServer()).set('Authorization', tokenMap.guest);
  });

  // beforeAll(async () => {
  //
  //   // await app.stop();
  //
  //   // await new Promise(resolve => {
  //   //   setTimeout(resolve, 8000);
  //   // })
  //   // await pool.end();
  // }, 20000);
  describe('[POST] /api/reservation', () => {
    it('should return 200 OK', async () => {
      const resp = request.post('/api/reservation').send({
        // userId: '1',
        name: 'Jacob',
        contactInfo: { tel: '13988866666', email: 'jacob@sunmail.com' },
        expectedArriveTime: '2022-10-01T06:00:00.000Z',
        table: {
          personCount: 4,
          babyCount: 2,
          position: 'Lobby'
        }
      });
      // const result = await resp;
      // console.log(JSON.stringify(result.body.errors));
      const { body } = await resp.expect(200);
      expect(body).toHaveProperty('_id');
    }, 300_000);
  });
});
