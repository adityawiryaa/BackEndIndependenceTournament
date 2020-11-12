const express = require('express')
const approute = express.Router()
const userRoutes = require('../routes/user')
const errorHandler = require('../helpers/errorHandlers')

approute.use('/user',userRoutes)
approute.use(errorHandler)

module.exports = approute