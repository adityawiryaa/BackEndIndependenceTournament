const express = require('express')
const dataUser = express.Router()
const userController = require('../controllers/userController')
const userAuthentication = require('../middleware/userAuthentication')

dataUser.post('/signup',userController.register)
dataUser.post('/signin',userController.login)
dataUser.get('/detail',userAuthentication,userController.detailUser)
dataUser.put('/update',userAuthentication,userController.updateUser)

module.exports = dataUser