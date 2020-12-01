const express = require('express')
const dataTournament = express.Router()
const admTournamentController = require('../controllers/admTournamentController')
const authentication = require('../middleware/authentication')

dataTournament.post('/',authentication.committeAuth,admTournamentController.createTournament)
dataTournament.get('/list',admTournamentController.listTournament)
dataTournament.get('/detail/:tournamentID',admTournamentController.detailTournament)
dataTournament.put('/update/:tournamentID',authentication.committeAuth,admTournamentController.updateTournament)
dataTournament.delete('/delete/:tournamentID',authentication.committeAuth,admTournamentController.deleteTournament)
dataTournament.post('/register/:tournamentID',authentication.userAuth,admTournamentController.registerTournament)
dataTournament.put('/register/accept/:tournamentID',authentication.committeAuth,admTournamentController.acceptUser)
dataTournament.put('/register/reject/:tournamentID',authentication.committeAuth,admTournamentController.rejectUser)
dataTournament.post('/start/:tournamentID',authentication.committeAuth,admTournamentController.startTournament)
dataTournament.put('/match1/:tournamentID',authentication.committeAuth,admTournamentController.match1)

module.exports = dataTournament