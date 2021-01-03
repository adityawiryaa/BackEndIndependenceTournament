const request = require('supertest')
const api = 'http://localhost:8000'
let token;
let tokenAdmin;
let tokenLurah;
let idPanitia;

const user1 = {
    email: 'testUser@gmail.com',
    password: '12345678',
    age: 14,
    username: 'testUser',
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
            password: user1.password
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
test('It Should be forget password and change new password for User', async () => {
    await request(api).put('/user/forget/password')
    .send({
        email: user1.email,
        phone: user1.phone,
        password: user1.password
    })
    .expect(200)
    .then(res => {
        expect(res.body.success).toEqual(true)
    })
})
test('It Should be Update new password by check old password', async () => {
    await request(api).put('/user/update/password')
    .set('Authorization', `Bearer ${token}`)
    .send({
        oldpassword: user1.password,
        newpassword: "12345678910"
    })
    .expect(200)
    .then(res => {
        expect(res.body.success).toEqual(true)
    })
})

test('It Should be Update Data User', async () => {
    await request(api).put('/user/update/data')
    .set('Authorization', `Bearer ${token}`)
    .send({
        fullname: "test 1 user",
    })
    .expect(200)
    .then(res => {
        expect(res.body.success).toEqual(true)
    })
})

test('It Should delete user', async () => {
    await request(api).delete('/user/delete')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(res => {
            expect(res.body.success).toEqual(true)
        })
})





test('It Should be create Admin', async () => {
    await request(api).post('/user/signup')
        .send({
            email: "admin99@gmail.com",
            password: "12345678",
            age: 10,
            role: "admin",
            username: "admin99",
            phone: "08125142514",
        })
        .expect(201)
        .then((res) => {
            expect(res.body.success).toEqual(true)
        })
})
test('It Should be Login as Admin', async () => {
    await request(api).post('/user/signin')
        .send({
            identity: 'admin99@gmail.com',
            password: '12345678'
        })
        .expect(200)
        .then((res) => {
            tokenAdmin = res.body.token;
            expect(res.body.success).toEqual(true)
        })
})
test('It Should be create Lurah', async () => {
    await request(api).post('/user/create/headman')
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send({
            email: "headman99@gmail.com",
            password: "12345678",
            age: 10,
            role: "headman",
            username: "headman99",
            phone: "081251425324",
            district: 'monte'
        })
        .expect(201)
        .then((res) => {
            expect(res.body.success).toEqual(true)
        })
})
test('It Should be Login as Lurah', async () => {
    await request(api).post('/user/signin')
        .send({
            identity: 'headman99@gmail.com',
            password: '12345678'
        })
        .expect(200)
        .then((res) => {
            tokenLurah = res.body.token;
            expect(res.body.success).toEqual(true)
        })
})
test('It Should be Get List Panitia by Lurah',async () => {
    await request(api).get('/user/committe/list')
    .set('Authorization', `Bearer ${tokenLurah}`).expect(200)
    .then((res) => {
        expect(res.body.success).toEqual(true)
    })
})
test('It Should be get Report Data Tournament user get Winner',async () => {
    await request(api).get('/user/csv')
    .set('Authorization', `Bearer ${tokenLurah}`)
    .expect(200)
    .then((res) => {
        expect(res.body.success).toEqual(true)
    })
})
test('It Should be create Panitia', async () => {
    await request(api).post('/user/create/committe')
        .set('Authorization', `Bearer ${tokenLurah}`)
        .send({
            email: "committe99@gmail.com",
            password: "12345678",
            age: 10,
            role: "committe",
            username: "committe99",
            phone: "081251422234",
        })
        .expect(201)
        .then((res) => {
            idPanitia = res.body.data._id
            expect(res.body.success).toEqual(true)
        })
})
test('It Should be Login as Panitia', async () => {
    await request(api).post('/user/signin')
        .send({
            identity: 'committe99@gmail.com',
            password: '12345678'
        })
        .expect(200)
        .then((res) => {
            
            tokenPanitia = res.body.token;
            expect(res.body.success).toEqual(true)
        })
})
test('It Should delete Admin', async () => {
    await request(api).delete('/user/delete')
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(200)
        .then(res => {
            expect(res.body.success).toEqual(true)
        })
})
test('It Should delete Panitia by Lurah', async () => {
    await request(api).delete('/user/delete/committe/' + idPanitia)
        .set('Authorization', `Bearer ${tokenLurah}`)
        .expect(200)
        .then(res => {
            expect(res.body.success).toEqual(true)
        })
})
test('It Should delete Lurah', async () => {
    await request(api).delete('/user/delete')
        .set('Authorization', `Bearer ${tokenLurah}`)
        .expect(200)
        .then(res => {
            expect(res.body.success).toEqual(true)
        })
})