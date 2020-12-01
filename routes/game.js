const express = require('express')
const dataGame = express.Router()
const gameController = require('../controllers/gameController')
const authentication = require('../middleware/authentication')

dataGame.post('',authentication.adminAuth,gameController.createGame)
dataGame.get('/list',gameController.listGame)
dataGame.get('/detail/:gameID',gameController.detailGame)
dataGame.put('/update/:gameID',gameController.updateGame)
dataGame.delete('/:gameID',authentication.adminAuth,gameController.createGame)

module.exports = dataGame