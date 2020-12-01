const Tournament = require('../models/TournamentData')
const User = require('../models/UserData')

class tournamenController {
    static async createTournament(req, res, next) {
        try {

            const dataTournament = await Tournament.findOne({ name: req.body.name })
            if (dataTournament) next({ name: 'TOURNAMENT_EXIST' })
            else {
                const tournament = new Tournament({
                    name: req.body.name,
                    createBy: req.userID,
                    game: req.body.game,
                    age: req.body.age,
                    type: req.body.type,
                    start: req.body.start,
                    end: req.body.end,
                    maxuser: req.body.maxuser,
                    prize: {
                        first: req.body.first,
                        second: req.body.second,
                        third: req.body.third
                    }
                })
                await tournament.save()
                if (tournament.maxuser == 4 && tournament.type == 'single elimination') {
                    const generateBracket = await Tournament.findOneAndUpdate({ name: req.body.name }, {
                        $push: {
                            stage1: {
                                $each: [{ 'match': 1 }, { 'match': 2 },]
                            },
                            stage2: {
                                $each: [{ 'match': 3 }]
                            },
                            bronzeMatch: {
                                $each: [{ 'match': null }]
                            }
                        }
                    }, { new: true })
                    res.status(200).json({ success: true, data: generateBracket })
                }
                else if (tournament.maxuser == 8 && tournament.type == 'single elimination') {
                    const generateBracket = await Tournament.findOneAndUpdate({ name: req.body.name }, {
                        $push: {
                            stage1: {
                                $each: [{ 'match': 1 }, { 'match': 2 }, { 'match': 3 }, { 'match': 4 }]
                            },
                            stage2: {
                                $each: [{ 'match': 5 }, { 'match': 6 }]
                            },
                            stage3: {
                                $each: [{ 'match': 7 }]
                            },
                            bronzeMatch: {
                                $each: [{ 'match': null }]
                            }
                        }
                    }, { new: true })
                    res.status(200).json({ success: true, data: generateBracket })
                }
                else if (tournament.maxuser == 16 && tournament.type == 'single elimination') {
                    const generateBracket = await Tournament.findOneAndUpdate({ name: req.body.name }, {
                        $push: {
                            stage1: {
                                $each: [{ 'match': 1 }, { 'match': 2 }, { 'match': 3 }, { 'match': 4 }, { 'match': 5 }, { 'match': 6 }, { 'match': 7 }, { 'match': 8 }]
                            },
                            stage2: {
                                $each: [{ 'match': 9 }, { 'match': 10 }, { 'match': 11 }, { 'match': 12 }]
                            },
                            stage3: {
                                $each: [{ 'match': 12 }, { 'match': 14 }]
                            },
                            stage4: {
                                $each: [{ 'match': 15 }]
                            },
                            bronzeMatch: {
                                $each: [{ 'match': null }]
                            }
                        }
                    }, { new: true })
                    res.status(200).json({ success: true, data: generateBracket })
                }
            }
        }
        catch { next({ name: 'REQUIRED' }) }
    }

    static async listTournament(req, res, next) {
        try {
            const tournament = await Tournament.find()
            res.status(200).json({ success: true, data: tournament })
        }
        catch { next({ name: 'TOURNAMENT_FAILED' }) }
    }
    static async detailTournament(req, res, next) {
        const { tournamentID } = req.params
        try {
            const tournament = await Tournament.findById(tournamentID)
            console.log(tournament.stage1.length)
            res.status(200).json({ success: true, data: tournament })
        }
        catch { next({ name: 'TOURNAMENT_FAILED' }) }
    }
    static async updateTournament(req, res, next) {
        const { tournamentID } = req.params
        const dataTournament = Tournament.findOne({ createBy: req.userID, _id: tournamentID })
        try {
            if (dataTournament) {
                const tournament = await Tournament.findByIdAndUpdate(tournamentID,
                    { $push: { rules: req.body.rules } },
                    { new: true })
                res.status(200).json({ success: true, data: tournament })
            }
            else next({ name: 'NOT_ACCESS' })
        }
        catch { next({ name: 'TOURNAMENT_FAILED' }) }
    }
    static async deleteTournament(req, res, next) {
        const { tournamentID } = req.params
        try {
            const tournament = await Tournament.findOneAndDelete({ createBy: req.userID, _id: tournamentID })
            res.status(200).json({ success: true, message: 'Delete tournament success' })
        }
        catch { next({ name: 'TOURNAMENT_FAILED' }) }
    }
    static async registerTournament(req, res, next) {
        const { tournamentID } = req.params
        const user = await User.findById(req.userID)
        const tournament = await Tournament.findById(tournamentID)
        const userTournamentExist = await Tournament.findOne({ participant: req.userID })
        const userTournamentWaiting = await Tournament.findOne({ waitinglist: req.userID })
        const totalWaiting = tournament.participant.length + tournament.waitinglist.length
        if (totalWaiting != tournament.maxuser && tournament.participant.length != tournament.maxuser) {
            if (user.role == 'user') {
                if (userTournamentExist || userTournamentWaiting) next({ name: 'USER_EXIST' })
                else {
                    const dataTournament = await Tournament.findOneAndUpdate({ _id: tournamentID },
                        { $push: { waitinglist: req.userID } }, { new: true })
                    res.status(200).json({ success: true, data: dataTournament })
                }
            }
            else next({ name: 'ONLY_USER' })
        }
        else next({ name: 'TOURNAMENT_FULL' })
    }
    static async acceptUser(req, res, next) {
        const { tournamentID } = req.params
        const tournament = await Tournament.findById(tournamentID)
        const user = await User.findById(req.body.user)
        const found = tournament.waitinglist.find(element => element == req.body.user);
        const userAlready = tournament.stage1.find(element => element.user == req.body.user);
        if (tournament.createBy == req.userID && tournament.participant.length != tournament.maxuser) {
            if (found && !userAlready) {
                const user1Update = await Tournament.findOne({ 'stage1.user1': null})
                const user2Update = await Tournament.findOne({  'stage1.user2' : null})
                if(user1Update) {
                    await Tournament.findOneAndUpdate({ 'stage1.user1': null},
                        {
                            $set: { "stage1.$.user1": req.body.user }
                        }, { new: true })
                }
                else if (user2Update){
                    await Tournament.findOneAndUpdate({ 'stage1.user2': null},
                        {
                            $set: { "stage1.$.user2": req.body.user }
                        }, { new: true })
                    
                }
                const dataTournament = await Tournament.findByIdAndUpdate(tournamentID,
                    { $pull: { waitinglist: req.body.user }, $push: { participant: req.body.user } },
                    { new: true }
                )
                await User.findOneAndUpdate({ _id: req.body.user },
                    {
                        $push: {
                            notification: {
                                $each: [{ 'notif': `You was accept in tournament ${tournament.name} ,Good Luck!`, "time": new Date().toLocaleString() }]
                            }
                        }
                    },
                    { new: true }
                )
                if (user.notification.length >= 5) {
                    await User.findOneAndUpdate({ _id: req.body.user },
                        { $pop: { notification: -1 } },
                        { new: true }
                    )
                }
                res.status(200).json({ success: true, data: dataTournament })
            }
            else next({ name: 'USER_NOT_FOUND' })
        }
        else next({ name: 'NOT_ACCESS' })
    }
    static async rejectUser(req, res, next) {
        const { tournamentID } = req.params
        const tournament = await Tournament.findById(tournamentID)
        const user = await User.findById(req.body.user)
        const found = tournament.waitinglist.find(element => element == req.body.user);
        if (tournament.createBy == req.userID) {
            if (found) {
                const dataTournament = await Tournament.findByIdAndUpdate(tournamentID,
                    { $pull: { waitinglist: req.body.user } },
                    { new: true }
                )
                await User.findOneAndUpdate({ _id: req.body.user },
                    {
                        $push: {
                            notification: {
                                $each: [{ 'notif': `You was Reject in tournament ${tournament.name} ,Sorry`, "time": new Date().toLocaleString() }]
                            }
                        }
                    },
                    { new: true }
                )
                if (user.notification.length >= 5) {
                    await User.findOneAndUpdate({ _id: req.body.user },
                        { $pop: { notification: -1 } },
                        { new: true }
                    )
                }
                res.status(200).json({ success: true, data: dataTournament })
            }
            else next({ name: 'USER_NOT_FOUND' })
        }
        else next({ name: 'NOT_ACCESS' })
    }
    static async startTournament(req, res, next) {
        const { tournamentID } = req.params
        const dataTournament = await Tournament.findById(tournamentID)
        let random = dataTournament.stage1
            .map((a) => ({ sort: Math.random(), value: a }))
            .sort((a, b) => a.sort - b.sort)
            .map((a) => a.value)
        const randomUser = await Tournament.findByIdAndUpdate(tournamentID,
            { $set: { stage1: random } },
            { new: true }
        )
        res.status(200).json({ success: true, data: randomUser })
    }
    static async match1(req, res, next) {
        const { matchID } = req.body
        const { user1, user2, score1, score2 } = req.body
        const tournament = await Tournament.findById(tournamentID)
        let firstUser = tournament.stage1.find(element => element.user == user1);
        let secondUser = tournament.stage1.find(element => element.user == user2);
        let stage2User1 = tournament.stage2.find(element => element.user == user1);
        let stage2User2 = tournament.stage2.find(element => element.user == user2);
        if (!stage2User1 && !stage2User2) console.log('hei');
        else console.log('sum');
        // if (tournament.createBy == req.userID) {
        //     if (firstUser && secondUser) {
        //         await Tournament.findOneAndUpdate({ "stage1.user": user1 },
        //             { $set: { "stage1.$.score": score1 } }, { new: true }
        //         )
        //         const updateScore = await Tournament.findOneAndUpdate({ "stage1.user": user2 },
        //             { $set: { "stage1.$.score": score2 } }, { new: true }
        //         )
        //         firstUser = updateScore.stage1.find(element => element.user == user1);
        //         secondUser = updateScore.stage1.find(element => element.user == user2);
        //         if (firstUser.score > secondUser.score) {
        //             const updateTournament = await Tournament.findByIdAndUpdate(tournamentID,
        //                 { $addToSet: { stage2: { user: user1 } } }, { new: true }
        //             )
        //             res.status(200).json({ success: true, data: updateTournament })
        //         }
        //         else {
        //             const updateTournament = await Tournament.findByIdAndUpdate(tournamentID,
        //                 { $addToSet: { stage2: { user: user2 } } }, { new: true }
        //             )
        //             res.status(200).json({ success: true, data: updateTournament })
        //         }
        //     }
        //     else next({ name: 'USER_NOT_FOUND' })
        // }
        // else next({ name: 'NOT_ACCESS' })


    }
}

module.exports = tournamenController