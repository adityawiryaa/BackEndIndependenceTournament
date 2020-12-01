const express = require('express')
const addressData = express.Router()
const authentication = require('../middleware/authentication')
const addressController = require('../controllers/addressContoller')

addressData.post('/',authentication.userAuth,addressController.createAdress)
addressData.get('/',authentication.userAuth,addressController.getAdress)
addressData.put('/update',authentication.userAuth,addressController.updateAdress)
addressData.delete('/',authentication.userAuth,addressController.deleteAddress)

module.exports = addressData