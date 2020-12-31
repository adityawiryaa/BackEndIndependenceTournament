const express = require('express')
const approute = express.Router()
const userRoutes = require('../routes/user')
const tournamentRoutes = require('../routes/admTournament')
const gameRoutes = require('../routes/game')
const addressRoutes = require('../routes/address')
const errorHandler = require('../helpers/errorHandlers')


approute.get('/',(req,res) => {
    res.send('hello')
})
approute.use('/user',userRoutes)
approute.use('/tournament',tournamentRoutes)
approute.use('/game',gameRoutes)
approute.use('/address',addressRoutes)

approute.use(errorHandler)

module.exports = approute