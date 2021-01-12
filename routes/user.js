const express = require('express')
const dataUser = express.Router()
const userController = require('../controllers/userController')
const authentication = require('../middleware/authentication')
let bouncer = require ("express-bouncer")(600000,600000,10);

bouncer.whitelist.push ("127.0.0.1");
bouncer.blocked = function (req, res, next, remaining)
{
    res.status(429).json({status : 429, message : "Too many requests have been made, " +
        "please wait " + (remaining  / (1000 * 60) ).toFixed(1) + " minute"});
};

dataUser.post('/signup',userController.register)
// dataUser.post('/signin',userController.login)
dataUser.post('/signin',bouncer.block,userController.login)
bouncer.addresses = { };
dataUser.post('/create/headman',authentication.adminAuth,userController.createHeadMan)
dataUser.post('/create/committe',authentication.headManAuth,userController.createCommitte)
dataUser.put('/forget/password',userController.forgetPassword)
dataUser.get('/detail',authentication.userAuth,userController.detailUser)
dataUser.put('/update/password',authentication.userAuth,userController.updatePassword)
dataUser.put('/update/data',authentication.userAuth,userController.updateUser)
dataUser.get('/committe/list',authentication.headManAuth,userController.listCommitte)
dataUser.delete('/delete/committe/:committeID',authentication.headManAuth,userController.deleteCommitte)
dataUser.delete('/delete',authentication.userAuth,userController.deleteAccount)
dataUser.get('/csv',authentication.headManAuth,userController.csvDownload)
module.exports = dataUser