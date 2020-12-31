const request = require('supertest')
const api = 'http://localhost:8000'
let token;

const user1 = {
    email: 'user1@gmail.com',
    password: '12345678',
    age: 14,
    username: 'user1',
    phone: '08121524144'
}
test('It Should sign up for a user', async () => {
    await request(api).post('/user/signup')
        .send({
            email: user1.email,
            password: user1.password,
            age: user1.age,
            username: user1.username,
            phone: user1.phone
        })
        .expect(201)
        .then((res) => {
            expect(res.body.success).toEqual(true)
        })
})
test('It Should Login for User', async () => {
    await request(api).post('/user/signin')
    .send({
        identity: user1.email,
        password : user1.password
    })
    .expect(200)
    .then((res) => {
        token = res.body.token;
        expect(res.body.success).toEqual(true)  
    })
})
test('It Should get data user', async () => {
    await request(api).get('/user/detail')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .then(res => {
        expect(res.body.success).toEqual(true)  
    })
})
test('It Should delete user',async () => {
    await request(api).delete('/user/delete')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .then(res => {
        expect(res.body.success).toEqual(true)  
    })
})