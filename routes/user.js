const express = require('express')
const dataUser = express.Router()
const userController = require('../controllers/userController')
const authentication = require('../middleware/authentication')

dataUser.post('/signup',userController.register)
dataUser.post('/signin',userController.login)
dataUser.post('/create/headman',authentication.adminAuth,userController.createHeadMan)
dataUser.post('/create/committe',authentication.headManAuth,userController.createCommitte)
dataUser.put('/forget/password',userController.forgetPassword)
dataUser.get('/detail',authentication.userAuth,userController.detailUser)
dataUser.put('/update/password',authentication.userAuth,userController.updatePassword)
dataUser.put('/update/data',authentication.userAuth,userController.updateUser)
dataUser.get('/committe/list',authentication.headManAuth,userController.listCommitte)
dataUser.delete('delete/committe/:committeID',authentication.headManAuth,userController.deleteCommitte)

module.exports = dataUser