const request = require('supertest')
const api = 'http://localhost:8000'
let tokenAdmin;
let idGame;

beforeEach((done) => {
    request(api)
      .post('/user/signin')
      .send({
        identity: "admin@gmail.com",
        password: "12345678",
      })
      .end((err, response) => {
        tokenAdmin = response.body.token;
        done();
      });
  });

  test('It Should be create Game for tournament', async () => {
    await request(api).post('/game')
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({
      name: "testGame",
      image: "testImage",
    })
    .expect(201)
    .then((res) => {
        idGame = res.body.data._id
        expect(res.body.success).toEqual(true)
    })
  })
  test('It Should be get List Game',async () => {
      await request(api).get('/game/list')
    .expect(200)
    .then((res) => {
        expect(res.body.success).toEqual(true)
    })
  })
  

  test('It Should be Get Detail Game',async () => {
    await request(api).get(`/game/detail/${idGame}`)
    .expect(200)
    .then((res) => {
        expect(res.body.success).toEqual(true)
    })
})

test('It Should be Update data Game', async () => {
    await request(api).put(`/game/update/${idGame}`)
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({
      name: "testGame",
      image: "testImage",
    })
    .expect(200)
    .then((res) => {
        expect(res.body.success).toEqual(true)
    })
  })
  test('It Should be delete Game By Admin',async () => {
      await request(api).delete(`/game/delete/${idGame}`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .expect(200)
      .then((res) => {
          expect(res.body.success).toEqual(true)
      })
  })