const request = require('supertest')
const api = 'http://localhost:8000'
let token;



beforeEach((done) => {
    request(api)
      .post('/user/signin')
      .send({
        identity: "user3@gmail.com",
        password: "12345678",
      })
      .end((err, response) => {
        token = response.body.token; // save the token!
        done();
      });
  });

test('It Should be Create Address for user', async () => {
    await request(api).post('/address/')
        .set('Authorization', `Bearer ${token}`)
        .send({
            country: "indonesia",
            province: "sumatera barat",
            district: "meture",
            city: "padang",
            zip: "12343"
        })
        .expect(200)
        .then(res => {
            expect(res.body.success).toEqual(true)
        })
})