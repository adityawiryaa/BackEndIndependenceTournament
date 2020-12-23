const Tournament = require('../models/TournamentData')
const User = require('../models/UserData')
const Address = require('../models/AdressData')

class tournamenController {
    static async createTournament(req, res, next) {
        try {
            const dataTournament = await Tournament.findOne({ name: req.body.name })
            const urlData = await Tournament.findOne({ url: req.body.url })
            const game = await Tournament.findOne({ createBy: req.userID, game: req.body.game })
            const address = await Address.findOne({ user: req.userID })
            const committe = await User.findOne({ _id: req.userID })
            if (dataTournament) next({ name: 'TOURNAMENT_EXIST' })
            else if (urlData) next({ name: 'URL_EXIST' })
            else if (game) next({ name: 'ONLY_ONE_GAME' })
            else {
                const tournament = new Tournament({
                    name: req.body.name,
                    url: req.body.url,
                    createBy: req.userID,
                    district: address.district,
                    headman: committe.createBy,
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
                    },
                    status : 'open'
                })
                if (req.body.maxuser == 4 && req.body.type == 'single elimination') {
                    await tournament.save()
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
                            },
                            winner: {
                                $each: [{}]
                            }
                        }
                    }, { new: true })
                    res.status(201).json({ success: true, data: generateBracket })
                }
                else if (req.body.maxuser == 8 && req.body.type == 'single elimination') {
                    await tournament.save()
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
                            },
                            winner: {
                                $each: [{}]
                            }
                        }
                    }, { new: true })
                    res.status(201).json({ success: true, data: generateBracket })
                }
                else if (req.body.maxuser == 16 && req.body.type == 'single elimination') {
                    await tournament.save()
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
                            },
                            winner: {
                                $each: [{}]
                            }
                        }
                    }, { new: true })
                    res.status(201).json({ success: true, data: generateBracket })
                }
                else if (req.body.maxuser == 20 && req.body.type == 'free for all') {
                    await tournament.save()
                    const generateBracket = await Tournament.findOneAndUpdate({ name: req.body.name }, {
                        $push: {
                            ffaStage1: {
                                $each: [{ 'match': 1 }, { 'match': 2 }, { 'match': 3 }, { 'match': 4 }]
                            },
                            ffaStage2: {
                                $each: [{ 'match': 5 }]
                            },
                            winner: {
                                $each: [{}]
                            }
                        }
                    }, { new: true })
                    res.status(201).json({ success: true, data: generateBracket })
                }
                else if (req.body.maxuser == 40 && req.body.type == 'free for all') {
                    await tournament.save()
                    const generateBracket = await Tournament.findOneAndUpdate({ name: req.body.name }, {
                        $push: {
                            ffaStage1: {
                                $each: [{ 'match': 1 }, { 'match': 2 }, { 'match': 3 }, { 'match': 4 }, { 'match': 5 }, { 'match': 6 }, { 'match': 7 }, { 'match': 8 }]
                            },
                            ffaStage2: {
                                $each: [{ 'match': 9 }, { 'match': 10 }]
                            },
                            ffaStage3: {
                                $each: [{ 'match': 11 }]
                            },
                            winner: {
                                $each: [{}]
                            }
                        }
                    }, { new: true })
                    res.status(201).json({ success: true, data: generateBracket })
                }
                else if (req.body.type == 'free for all' && req.body.maxuser != 20 || req.body.type == 'free for all' && req.body.maxuser != 40) next({ name: 'FFA_NOT_VALID' })
                else if (req.body.type == 'single elimination' && req.body.maxuser != 4 || req.body.type == 'single elimination' && req.body.maxuser != 8 || req.body.type == 'single elimination' && req.body.maxuser != 16) next({ name: 'SE_NOT_VALID' })
                else next({ name: 'REQUIRED' })
            }
        }
        catch { next({ name: 'REQUIRED' }) }
    }
    static async tournamentBaseOnHeadman(req, res, next) {
        try {
            const tournament = await Tournament.find({ headman: req.userID })
            res.status(200).json({ success: true, data: tournament })
        }
        catch { next({ name: "TOURNAMENT_FAILED" }) }
    }
    static async tournamentByCommitte(req, res, next) {
        try {
            const tournament = await Tournament.find({ createBy: req.userID })
            res.status(200).json({ success: true, data: tournament })
        }
        catch { next({ name: "TOURNAMENT_FAILED" }) }
    }
    static async myTournament(req, res, next) {
        try {
            const tournament = await Tournament.find({ participant: req.userID })
            res.status(200).json({ success: true, data: tournament })
        }
        catch { next({ name: "TOURNAMENT_FAILED" }) }
    }
    static async listTournament(req, res, next) {
        try {
            const tournament = await Tournament.find({},{},{autopopulate :false})
                .populate('game')
            res.status(200).json({ success: true, data: tournament })
        }
        catch { next({ name: 'TOURNAMENT_FAILED' }) }
    }
    static async detailTournament(req, res, next) {
        const { urlID } = req.params
        try {
            const tournament = await Tournament.findOne({ url: urlID })
                    .populate('participant').populate('waitingList').populate('winner.first').populate('winner.second').populate('winner.third').populate('game')
                res.status(200).json({ success: true, data: tournament })
        }
        catch { next({ name: 'TOURNAMENT_FAILED' }) }
    }
    static async updateTournament(req, res, next) {
        const { urlID } = req.params
        const dataTournament = Tournament.findOne({ createBy: req.userID, url: urlID })
        try {
            if (dataTournament) {
                const tournament = await Tournament.findOne({ url: urlID },
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
        const { urlID } = req.params
        const user = await User.findById(req.userID)
        const tournament = await Tournament.findOne({ url: urlID })
        const idCommitte = tournament.createBy
        const committeData = await User.findById(idCommitte)
        const userTournamentExist = await Tournament.findOne({ userNow: req.userID })
        const userTournamentWaiting = await Tournament.findOne({ waitinglist: req.userID })
        const totalWaiting = tournament.participant.length + tournament.waitinglist.length
        try {
            if (user.age <= tournament.age || tournament.age == '' || tournament.age == null) {
                if (totalWaiting != tournament.maxuser && tournament.participant.length != tournament.maxuser) {
                    if (user.role == 'user') {
                        if (userTournamentExist || userTournamentWaiting) next({ name: 'USER_EXIST' })
                        else {
                            await User.findByIdAndUpdate(req.userID, {$set : {'team.tournament' : null}}, {new : true})
                            await User.findOneAndUpdate({ _id: idCommitte },
                                {
                                    $push: {
                                        notification: {
                                            $each: [{ 'notif': `${user.username} was register in tournament ${tournament.name}`, "time": new Date().toLocaleString(), "tournament": urlID }]
                                        }
                                    }
                                }, { new: true })
                            if (committeData.notification.length >= 5 || committeData.notification.length == 5) {
                                await User.findByIdAndUpdate(idCommitte,
                                    { $pop: { notification: -1 } },
                                    { new: true }
                                )
                            }
                            const dataTournament = await Tournament.findOneAndUpdate({ url: urlID },
                                { $push: { waitinglist: req.userID } }, { new: true })
                            res.status(200).json({ success: true, data: dataTournament })
                        }
                    }
                    else next({ name: 'ONLY_USER' })
                }
                else next({ name: 'TOURNAMENT_FULL' })
            }
            else next({ name: 'AGE_LESS' })
        }
        catch { next({ name: 'TOURNAMENT_FAILED' }) }
    }
    static async teamRegister(req, res, next) {
        const { urlID } = req.params
        const { name, phone, member1, member2 } = req.body
        const user = await User.findById(req.userID)
        const tournament = await Tournament.findOne({ url: urlID })
        const idCommitte = tournament.createBy
        const committeData = await User.findById(idCommitte)
        const userTournamentExist = await Tournament.findOne({ userNow: req.userID })
        const userTournamentWaiting = await Tournament.findOne({ waitinglist: req.userID })
        const totalWaiting = tournament.participant.length + tournament.waitinglist.length
        try {
            if (user.age <= tournament.age || tournament.age == '' || tournament.age == null) {
                if (totalWaiting != tournament.maxuser && tournament.participant.length != tournament.maxuser) {
                    if (user.role == 'user') {
                        if (userTournamentExist || userTournamentWaiting) next({ name: 'USER_EXIST' })
                        else {
                            if (user.team.name == null) {
                                await User.findByIdAndUpdate(req.userID,
                                    { $set: { 'team.name': name, 'team.phone': phone, 'team.member1': member1, 'team.member2': member2, 'team.tournament': tournament.url } },
                                    { new: true })
                                await User.findOneAndUpdate({ _id: idCommitte },
                                    {
                                        $push: {
                                            notification: {
                                                $each: [{ 'notif': `${user.team.name} was register in tournament ${tournament.name}`, "time": new Date().toLocaleString(), "tournament": urlID }]
                                            }
                                        }
                                    }, { new: true })
                                if (committeData.notification.length >= 5 || committeData.notification.length == 5) {
                                    await User.findByIdAndUpdate(idCommitte,
                                        { $pop: { notification: -1 } },
                                        { new: true }
                                    )
                                }
                                const dataTournament = await Tournament.findOneAndUpdate({ url: urlID },
                                    { $push: { waitinglist: req.userID } }, { new: true })
                                res.status(200).json({ success: true, data: dataTournament })
                            }
                            else if (user.team.name != null) {
                                await User.findOneAndUpdate({ _id: req.userID }, { $set: { 'team.tournament': tournament.url } }, { new: true })
                                await User.findOneAndUpdate({ _id: idCommitte },
                                    {
                                        $push: {
                                            notification: {
                                                $each: [{ 'notif': `${user.team.name} was register in tournament ${tournament.name}`, "time": new Date().toLocaleString(), "tournament": urlID }]
                                            }
                                        }
                                    }, { new: true })
                                if (committeData.notification.length >= 5 || committeData.notification.length == 5) {
                                    await User.findByIdAndUpdate(idCommitte,
                                        { $pop: { notification: -1 } },
                                        { new: true }
                                    )
                                }
                                const dataTournament = await Tournament.findOneAndUpdate({ url: urlID },
                                    { $push: { waitinglist: req.userID } }, { new: true })
                                res.status(200).json({ success: true, data: dataTournament })
                            }
                        }
                    }
                    else next({ name: 'ONLY_USER' })
                }
                else next({ name: 'TOURNAMENT_FULL' })
            }
            else next({ name: 'AGE_LESS' })
        }
        catch { next({ name: 'TOURNAMENT_FAILED' }) }
    }
    static async acceptUser(req, res, next) {
        const { urlID } = req.params
        const tournament = await Tournament.findOne({ url: urlID })
        const user = await User.findById(req.body.user)
        const found = tournament.waitinglist.find(element => element._id == req.body.user);
        try {
            if (tournament.createBy == req.userID && tournament.participant.length != tournament.maxuser && tournament.type == 'single elimination') {
                if (found) {
                    const user1Update = await Tournament.findOne({ url: urlID, 'stage1.user1': null })
                    const user2Update = await Tournament.findOne({ url: urlID, 'stage1.user2': null })
                    if (user1Update) {
                        await Tournament.findOneAndUpdate({ url: urlID, 'stage1.user1': null },
                            {
                                $set: { "stage1.$.user1": req.body.user }
                            }, { new: true })
                    }
                    else if (user2Update) {
                        await Tournament.findOneAndUpdate({ url: urlID, 'stage1.user2': null },
                            {
                                $set: { "stage1.$.user2": req.body.user }
                            }, { new: true })
                    }
                    const dataTournament = await Tournament.findOneAndUpdate({ url: urlID },
                        { $pull: { waitinglist: req.body.user }, $addToSet: { participant: req.body.user, userNow: req.body.user } },
                        { new: true }
                    )
                    if (user.team.tournament == tournament.url) {
                        await User.findOneAndUpdate({ _id: req.body.user },
                            {
                                $addToSet: {
                                    listTournamentTeam: {
                                        $each: [{ 'tournament': tournament._id }]
                                    }
                                }
                            },
                            { new: true }
                        )
                    }
                    await User.findOneAndUpdate({ _id: req.body.user },
                        {
                            $push: {
                                notification: {
                                    $each: [{ 'notif': `You was accept in tournament ${tournament.name} ,Good Luck!`, "time": new Date().toLocaleString(), "tournament": urlID }]
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
            else if (tournament.createBy == req.userID && tournament.participant.length != tournament.maxuser && tournament.type == 'free for all') {
                if (found) {
                    const user1Update = await Tournament.findOne({ url: urlID, 'ffaStage1.user1': null })
                    const user2Update = await Tournament.findOne({ url: urlID, 'ffaStage1.user2': null })
                    const user3Update = await Tournament.findOne({ url: urlID, 'ffaStage1.user3': null })
                    const user4Update = await Tournament.findOne({ url: urlID, 'ffaStage1.user4': null })
                    const user5Update = await Tournament.findOne({ url: urlID, 'ffaStage1.user5': null })
                    if (user1Update) {
                        await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage1.user1': null },
                            {
                                $set: { "ffaStage1.$.user1": req.body.user }
                            }, { new: true })
                    }
                    else if (user2Update) {
                        await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage1.user2': null },
                            {
                                $set: { "ffaStage1.$.user2": req.body.user }
                            }, { new: true })
                    }
                    else if (user3Update) {
                        await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage1.user3': null },
                            {
                                $set: { "ffaStage1.$.user3": req.body.user }
                            }, { new: true })
                    }
                    else if (user4Update) {
                        await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage1.user4': null },
                            {
                                $set: { "ffaStage1.$.user4": req.body.user }
                            }, { new: true })
                    }
                    else if (user5Update) {
                        await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage1.user5': null },
                            {
                                $set: { "ffaStage1.$.user5": req.body.user }
                            }, { new: true })
                    }
                    if (user.team.tournament == tournament.url) {
                        await User.findOneAndUpdate({ _id: req.body.user },
                            {
                                $addToSet: {
                                    listTournamentTeam: {
                                        $each: [{ 'tournament': tournament._id }]
                                    }
                                }
                            },
                            { new: true }
                        )
                    }
                    const dataTournament = await Tournament.findOneAndUpdate({ url: urlID },
                        { $pull: { waitinglist: req.body.user }, $addToSet: { participant: req.body.user, userNow: req.body.user } },
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
        catch { next({ name: 'TOURNAMENT_FAILED' }) }
    }
    static async rejectUser(req, res, next) {
        const { urlID } = req.params
        const tournament = await Tournament.findOne({ url: urlID })
        const user = await User.findById(req.body.user)
        const found = tournament.waitinglist.find(element => element == req.body.user);
        try {
            if (tournament.createBy == req.userID) {
                if (found) {
                    const dataTournament = await Tournament.findOneAndUpdate({ url: urlID },
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
        catch { next({ name: 'TOURNAMENT_FAILED' }) }
    }
    static async startTournament(req, res, next) {
        try {
            const { urlID } = req.params
            await Tournament.findOneAndUpdate({ url: urlID }, { $set: { status: 'ongoing' } }, { new: true })
            const dataTournament = await Tournament.findOne({ url: urlID })
            if (dataTournament.type == 'single elimination' && dataTournament.createBy == req.userID) {
                let random = dataTournament.stage1
                    .map((a) => ({ sort: Math.random(), value: a }))
                    .sort((a, b) => a.sort - b.sort)
                    .map((a) => a.value)
                const randomUser = await Tournament.findOneAndUpdate({ url: urlID },
                    { $set: { stage1: random } },
                    { new: true }
                )
                res.status(200).json({ success: true, data: randomUser })
            }
            else if (dataTournament.type == 'free for all' && dataTournament.createBy == req.userID) {
                let random = dataTournament.ffaStage1
                    .map((a) => ({ sort: Math.random(), value: a }))
                    .sort((a, b) => a.sort - b.sort)
                    .map((a) => a.value)
                const randomUser = await Tournament.findOneAndUpdate({ url: urlID },
                    { $set: { ffaStage1: random } },
                    { new: true }
                )
                res.status(200).json({ success: true, data: randomUser })
            }
            else next({ name: 'NOT_ACCESS' })
        }
        catch { next({ name: 'TOURNAMENT_FAILED' }) }
    }
    static async detailMatch(req, res, next) {
        const { urlID } = req.params
        const { matchID } = req.body
        const tournament = await Tournament.findOne({ url: urlID })
        try {
            if (tournament.type == 'single elimination') {
                const matchStage1 = tournament.stage1.find(elem => elem._id == matchID)
                const matchStage2 = tournament.stage2.find(elem => elem._id == matchID)
                const matchStage3 = tournament.stage3.find(elem => elem._id == matchID)
                const matchStage4 = tournament.stage4.find(elem => elem._id == matchID)
                const bronzeMatch = tournament.bronzeMatch.find(elem => elem._id == matchID)
                if (matchStage1) res.status(200).json({ success: true, data: matchStage1 })
                else if (matchStage2) res.status(200).json({ success: true, data: matchStage2 })
                else if (matchStage3) res.status(200).json({ success: true, data: matchStage3 })
                else if (matchStage4) res.status(200).json({ success: true, data: matchStage4 })
                else if (bronzeMatch) res.status(200).json({ success: true, data: bronzeMatch })
                else next({ name: 'MATCH_FAILED' })
            }
            else if (tournament.type == 'free for all') {
                const ffaStage1 = tournament.ffaStage1.find(elem => elem._id == matchID)
                const ffaStage2 = tournament.ffaStage2.find(elem => elem._id == matchID)
                const ffaStage3 = tournament.ffaStage3.find(elem => elem._id == matchID)
                const bronzeMatch = tournament.bronzeMatch.find(elem => elem._id == matchID)
                if (ffaStage1) res.status(200).json({ success: true, data: ffaStage1 })
                else if (ffaStage2) res.status(200).json({ success: true, data: ffaStage2 })
                else if (ffaStage3) res.status(200).json({ success: true, data: ffaStage3 })
                else if (bronzeMatch) res.status(200).json({ success: true, data: bronzeMatch })
                else next({ name: 'MATCH_FAILED' })
            }
            else next({ name: 'TOURNAMENT_FAILED' })
        }
        catch { next({ name: 'TOURNAMENT_FAILED' }) }
    }
}

module.exports = tournamenController