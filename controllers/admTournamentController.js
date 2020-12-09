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
                                $each: [{ 'match': 1 }, { 'match': 2 }, { 'match': 3 }, { 'match': 4 },{ 'match': 5 }, { 'match': 6 }, { 'match': 7 }, { 'match': 8 }]
                            },
                            ffaStage2: {
                                $each: [{ 'match': 9 },{ 'match': 10 }]
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
                else next({ name: 'REQUIRED' })
            }
        }
        catch { next({ name: 'REQUIRED' }) }
    }
    static async listTournament(req, res, next) {
        try {
            const tournament = await Tournament.find()
                .populate('game')
            res.status(200).json({ success: true, data: tournament })
        }
        catch { next({ name: 'TOURNAMENT_FAILED' }) }
    }
    static async detailTournament(req, res, next) {
        const { tournamentID } = req.params
        try {
            const tournament = await Tournament.findById(tournamentID)
            // .populate('game')
            // .populate('participant')
            // .populate('waitinglist')
            // .populate('winner')
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
        const userTournamentExist = await Tournament.findOne({ userNow: req.userID })
        const userTournamentWaiting = await Tournament.findOne({ waitinglist: req.userID })
        const totalWaiting = tournament.participant.length + tournament.waitinglist.length
        try {
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
        catch { next({ name: 'TOURNAMENT_FAILED' }) }
    }
    static async acceptUser(req, res, next) {
        const { tournamentID } = req.params
        const tournament = await Tournament.findById(tournamentID)
        const user = await User.findById(req.body.user)
        const found = tournament.waitinglist.find(element => element == req.body.user);
        const userAlready = tournament.stage1.find(element => element.user == req.body.user);
        try {
            if (tournament.createBy == req.userID && tournament.participant.length != tournament.maxuser && tournament.type == 'single elimination') {
                if (found && !userAlready) {
                    const user1Update = await Tournament.findOne({ _id: tournamentID, 'stage1.user1': null })
                    const user2Update = await Tournament.findOne({ _id: tournamentID, 'stage1.user2': null })
                    if (user1Update) {
                        await Tournament.findOneAndUpdate({ _id: tournamentID, 'stage1.user1': null },
                            {
                                $set: { "stage1.$.user1": req.body.user }
                            }, { new: true })
                    }
                    else if (user2Update) {
                        await Tournament.findOneAndUpdate({ _id: tournamentID, 'stage1.user2': null },
                            {
                                $set: { "stage1.$.user2": req.body.user }
                            }, { new: true })
                    }
                    const dataTournament = await Tournament.findByIdAndUpdate(tournamentID,
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
            else if (tournament.createBy == req.userID && tournament.participant.length != tournament.maxuser && tournament.type == 'free for all') {
                if (found && !userAlready) {
                    const user1Update = await Tournament.findOne({ _id: tournamentID, 'ffaStage1.user1': null })
                    const user2Update = await Tournament.findOne({ _id: tournamentID, 'ffaStage1.user2': null })
                    const user3Update = await Tournament.findOne({ _id: tournamentID, 'ffaStage1.user3': null })
                    const user4Update = await Tournament.findOne({ _id: tournamentID, 'ffaStage1.user4': null })
                    const user5Update = await Tournament.findOne({ _id: tournamentID, 'ffaStage1.user5': null })
                    if (user1Update) {
                        await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage1.user1': null },
                            {
                                $set: { "ffaStage1.$.user1": req.body.user }
                            }, { new: true })
                    }
                    else if (user2Update) {
                        await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage1.user2': null },
                            {
                                $set: { "ffaStage1.$.user2": req.body.user }
                            }, { new: true })
                    }
                    else if (user3Update) {
                        await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage1.user3': null },
                            {
                                $set: { "ffaStage1.$.user3": req.body.user }
                            }, { new: true })
                    }
                    else if (user4Update) {
                        await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage1.user4': null },
                            {
                                $set: { "ffaStage1.$.user4": req.body.user }
                            }, { new: true })
                    }
                    else if (user5Update) {
                        await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage1.user5': null },
                            {
                                $set: { "ffaStage1.$.user5": req.body.user }
                            }, { new: true })
                    }
                    const dataTournament = await Tournament.findByIdAndUpdate(tournamentID,
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
        const { tournamentID } = req.params
        const tournament = await Tournament.findById(tournamentID)
        const user = await User.findById(req.body.user)
        const found = tournament.waitinglist.find(element => element == req.body.user);
        try {
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
        catch { next({ name: 'TOURNAMENT_FAILED' }) }
    }
    static async startTournament(req, res, next) {
        try {
            const { tournamentID } = req.params
            await Tournament.findByIdAndUpdate(tournamentID, { $addToSet: { status: 'Ongoing' } }, { new: true })
            const dataTournament = await Tournament.findById(tournamentID)
            if (dataTournament.type == 'single elimination' && dataTournament.createBy == req.userID) {
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
            else if (dataTournament.type == 'free for all' && dataTournament.createBy == req.userID) {
                let random = dataTournament.ffaStage1
                    .map((a) => ({ sort: Math.random(), value: a }))
                    .sort((a, b) => a.sort - b.sort)
                    .map((a) => a.value)
                const randomUser = await Tournament.findByIdAndUpdate(tournamentID,
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
        const { tournamentID } = req.params
        const { matchID } = req.body
        const tournament = await Tournament.findById(tournamentID)

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
                const bronzeMatch = tournament.bronzeMatch.find(elem => elem._id == matchID)
                if (ffaStage1) res.status(200).json({ success: true, data: ffaStage1 })
                else if (ffaStage2) res.status(200).json({ success: true, data: ffaStage2 })
                else if (bronzeMatch) res.status(200).json({ success: true, data: bronzeMatch })
                else next({ name: 'MATCH_FAILED' })
            }
            else next({ name: 'TOURNAMENT_FAILED' })
        }
        catch { next({ name: 'TOURNAMENT_FAILED' }) }
    }
    static async match1(req, res, next) {
        const { user1, user2, score1, score2, matchID } = req.body
        const { tournamentID } = req.params
        const tournament = await Tournament.findById(tournamentID)
        const stage2User1 = tournament.stage2.find(element => element.user1 == user1 || element.user2 == user1);
        const stage2User2 = tournament.stage2.find(element => element.user1 == user2 || element.user2 == user2);
        const stage2Null = await tournament.stage2.find(element => element.user1 == null || element.user2 == null)
        const bronze = await tournament.bronzeMatch.find(element => element)
        try {
            if (tournament.createBy == req.userID) {
                if (!stage2User1 && !stage2User2) {
                    const updateSore = await Tournament.findOneAndUpdate({ 'stage1._id': matchID, _id: tournamentID },
                        { $set: { 'stage1.$.score1': score1, 'stage1.$.score2': score2 } },
                        { new: true })
                    const match = await updateSore.stage1.find(element => element._id == matchID)
                    if (match.score1 > match.score2 ) {
                        if (tournament.stage1.length == 2) {
                            if (bronze.user1 == null) {
                                await Tournament.findOneAndUpdate({ _id: tournamentID, 'bronzeMatch.user1': null },
                                    { $set: { 'bronzeMatch.$.user1': user2 } },
                                    { new: true })
                            }
                            else if (bronze.user2 == null) {
                                await Tournament.findOneAndUpdate({ _id: tournamentID, 'bronzeMatch.user2': null },
                                    { $set: { 'bronzeMatch.$.user2': user2 } },
                                    { new: true })
                            }
                        }
                        if (stage2Null.user1 == null) {
                            const result = await Tournament.findOneAndUpdate({ _id: tournamentID, 'stage2.user1': null },
                                { $set: { 'stage2.$.user1': user1 } }, { new: true })
                            res.status(200).json({ success: true, data: result })
                        }
                        else if (stage2Null.user2 == null) {
                            const result = await Tournament.findOneAndUpdate({ _id: tournamentID, 'stage2.user2': null },
                                { $set: { 'stage2.$.user2': user1 } }, { new: true })
                            res.status(200).json({ success: true, data: result })
                        }
                        else next({ name: 'MATCH_FAILED' })
                    }
                    else if (match.score1 < match.score2 ) {
                        if (tournament.stage1.length == 2) {
                            if (bronze.user1 == null) {
                                await Tournament.findOneAndUpdate({ _id: tournamentID, 'bronzeMatch.user1': null },
                                    { $set: { 'bronzeMatch.$.user1': user1 } },
                                    { new: true })
                            }
                            else if (bronze.user2 == null) {
                                await Tournament.findOneAndUpdate({ _id: tournamentID, 'bronzeMatch.user2': null },
                                    { $set: { 'bronzeMatch.$.user2': user1 } }
                                    , { new: true })
                            }
                        }
                        if (stage2Null.user1 == null) {
                            const result = await Tournament.findOneAndUpdate({ _id: tournamentID, 'stage2.user1': null },
                                { $set: { 'stage2.$.user1': user2 } }, { new: true })
                            res.status(200).json({ success: true, data: result })
                        }
                        else if (stage2Null.user2 == null) {
                            const result = await Tournament.findOneAndUpdate({ _id: tournamentID, 'stage2.user2': null },
                                { $set: { 'stage2.$.user2': user2 } }, { new: true })
                            res.status(200).json({ success: true, data: result })
                        }
                        else next({ name: 'MATCH_FAILED' })
                    }
                    else next({ name: 'MATCH_FAILED' })
                }
                else next({ name: 'USER_WINNER' })
            }
            else next({ name: 'NOT_ACCESS' })
        }
        catch { next({ name: 'MATCH_FAILED' }) }
    }
    static async match2(req, res, next) {
        const { user1, user2, score1, score2, matchID } = req.body
        const { tournamentID } = req.params
        const tournament = await Tournament.findById(tournamentID)
        const stage3User1 = tournament.stage3.find(element => element.user1 == user1 || element.user2 == user1);
        const stage3User2 = tournament.stage3.find(element => element.user1 == user2 || element.user2 == user2);
        const stage3Null = await tournament.stage3.find(element => element.user1 == null || element.user2 == null)
        const bronze = await tournament.bronzeMatch.find(element => element)
        const champion = await tournament.winner.find(element => element)

        try {
            if (champion == undefined || champion.first == null && champion.second == null) {
                if (tournament.createBy == req.userID) {
                    if (!stage3User1 && !stage3User2) {
                        const updateSore = await Tournament.findOneAndUpdate({ _id: tournamentID, 'stage2._id': matchID, _id: tournamentID },
                            { $set: { 'stage2.$.score1': score1, 'stage2.$.score2': score2 } },
                            { new: true })
                        const match = await updateSore.stage2.find(element => element._id == matchID)
                        if (match.score1 > match.score2 ) {
                            if (tournament.stage2.length == 1) {
                                await Tournament.findByIdAndUpdate(tournamentID, { $addToSet: { status: 'Complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ _id: tournamentID, 'winner.first': null, 'winner.second': null },
                                    { $set: { "winner.$.first": user1, "winner.$.second": user2, userNow: [] } }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            }
                            else {
                                if (tournament.stage2.length == 2) {
                                    if (bronze.user1 == null) {
                                        await Tournament.findOneAndUpdate({ _id: tournamentID, 'bronzeMatch.user1': null },
                                            { $set: { 'bronzeMatch.$.user1': user2 } },
                                            { new: true })
                                    }
                                    else if (bronze.user2 == null) {
                                        await Tournament.findOneAndUpdate({ _id: tournamentID, 'bronzeMatch.user2': null },
                                            { $set: { 'bronzeMatch.$.user2': user2 } },
                                            { new: true })
                                    }
                                }
                                if (stage3Null.user1 == null) {
                                    const result = await Tournament.findOneAndUpdate({ _id: tournamentID, 'stage3.user1': null },
                                        { $set: { 'stage3.$.user1': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: result })
                                }
                                else if (stage3Null.user2 == null) {
                                    const result = await Tournament.findOneAndUpdate({ _id: tournamentID, 'stage3.user2': null },
                                        { $set: { 'stage3.$.user2': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: result })
                                }
                                else next({ name: 'MATCH_FAILED' })

                            }
                        }
                        else if (match.score1 < match.score2 ) {
                            if (tournament.stage2.length == 1) {
                                await Tournament.findByIdAndUpdate(tournamentID, { $addToSet: { status: 'Complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ _id: tournamentID, 'winner.first': null, 'winner.second': null },
                                    { $set: { "winner.$.first": user2, "winner.$.second": user1, userNow: [] } }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            }
                            else {
                                if (tournament.stage2.length == 2) {
                                    if (bronze.user1 == null) {
                                        await Tournament.findOneAndUpdate({ _id: tournamentID, 'bronzeMatch.user1': null },
                                            { $set: { 'bronzeMatch.$.user1': user1 } },
                                            { new: true })
                                    }
                                    else if (bronze.user2 == null) {
                                        await Tournament.findOneAndUpdate({ _id: tournamentID, 'bronzeMatch.user2': null },
                                            { $set: { 'bronzeMatch.$.user2': user1 } }
                                            , { new: true })
                                    }
                                }
                                if (stage3Null.user1 == null) {
                                    const result = await Tournament.findOneAndUpdate({ _id: tournamentID, 'stage3.user1': null },
                                        { $set: { 'stage3.$.user1': user2 } }, { new: true })
                                    res.status(200).json({ success: true, data: result })
                                }
                                else if (stage3Null.user2 == null) {
                                    const result = await Tournament.findOneAndUpdate({ _id: tournamentID, 'stage3.user2': null },
                                        { $set: { 'stage3.$.user2': user2 } }, { new: true })
                                    res.status(200).json({ success: true, data: result })
                                }
                                else next({ name: 'MATCH_FAILED' })
                            }
                        }
                        else next({ name: 'MATCH_FAILED' })
                    }
                    else next({ name: 'USER_WINNER' })
                }
                else next({ name: 'NOT_ACCESS' })
            }
            else next({ name: 'TOURNAMENT_FINISH' })
        }
        catch { next({ name: 'MATCH_FAILED' }) }

    }
    static async match3(req, res, next) {
        const { user1, user2, score1, score2, matchID } = req.body
        const { tournamentID } = req.params
        const tournament = await Tournament.findById(tournamentID)
        const stage4User1 = tournament.stage4.find(element => element.user1 == user1 || element.user2 == user1);
        const stage4User2 = tournament.stage4.find(element => element.user1 == user2 || element.user2 == user2);
        const stage4Null = await tournament.stage4.find(element => element.user1 == null || element.user2 == null)
        const bronze = await tournament.bronzeMatch.find(element => element)
        const champion = tournament.winner.find(element => element);

        try {

            if (champion == undefined || champion.first == null && champion.second == null) {
                if (tournament.createBy == req.userID) {
                    if (!stage4User1 && !stage4User2) {
                        const updateSore = await Tournament.findOneAndUpdate({ 'stage3._id': matchID, _id: tournamentID },
                            { $set: { 'stage3.$.score1': score1, 'stage3.$.score2': score2 } },
                            { new: true })
                        const match = await updateSore.stage3.find(element => element._id == matchID)
                        if (match.score1 > match.score2 ) {
                            if (tournament.stage3.length == 1) {
                                await Tournament.findByIdAndUpdate(tournamentID, { $addToSet: { status: 'Complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ _id: tournamentID, 'winner.first': null, 'winner.second': null },
                                    { $set: { "winner.$.first": user1, "winner.$.second": user2, userNow: [] }, }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            }
                            else {
                                if (tournament.stage3.length == 2) {
                                    if (bronze.user1 == null) {
                                        await Tournament.findOneAndUpdate({ _id: tournamentID, 'bronzeMatch.user1': null },
                                            { $set: { 'bronzeMatch.$.user1': user2 } },
                                            { new: true })
                                    }
                                    else if (bronze.user2 == null) {
                                        await Tournament.findOneAndUpdate({ _id: tournamentID, 'bronzeMatch.user2': null },
                                            { $set: { 'bronzeMatch.$.user2': user2 } },
                                            { new: true })
                                    }
                                }
                                if (stage4Null.user1 == null) {
                                    const result = await Tournament.findOneAndUpdate({ _id: tournamentID, 'stage4.user1': null },
                                        { $set: { 'stage4.$.user1': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: result })
                                }
                                else if (stage4Null.user2 == null) {
                                    const result = await Tournament.findOneAndUpdate({ _id: tournamentID, 'stage4.user2': null },
                                        { $set: { 'stage4.$.user2': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: result })
                                }
                                else next({ name: 'MATCH_FAILED' })

                            }
                        }
                        else if (match.score1 < match.score2 ) {
                            if (tournament.stage3.length == 1) {
                                await Tournament.findByIdAndUpdate(tournamentID, { $addToSet: { status: 'Complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ _id: tournamentID, 'winner.first': null, 'winner.second': null },
                                    { $set: { "winner.$.first": user2, "winner.$.second": user1, userNow: [] }, }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            }
                            else {
                                if (tournament.stage3.length == 2) {
                                    if (bronze.user1 == null) {
                                        await Tournament.findOneAndUpdate({ _id: tournamentID, 'bronzeMatch.user1': null },
                                            { $set: { 'bronzeMatch.$.user1': user1 } },
                                            { new: true })
                                    }
                                    else if (bronze.user2 == null) {
                                        await Tournament.findOneAndUpdate({ _id: tournamentID, 'bronzeMatch.user2': null },
                                            { $set: { 'bronzeMatch.$.user2': user1 } }
                                            , { new: true })
                                    }
                                }
                                if (stage4Null.user1 == null) {
                                    const result = await Tournament.findOneAndUpdate({ _id: tournamentID, 'stage4.user1': null },
                                        { $set: { 'stage4.$.user1': user2 } }, { new: true })
                                    res.status(200).json({ success: true, data: result })
                                }
                                else if (stage4Null.user2 == null) {
                                    const result = await Tournament.findOneAndUpdate({ _id: tournamentID, 'stage4.user2': null },
                                        { $set: { 'stage4.$.user2': user2 } }, { new: true })
                                    res.status(200).json({ success: true, data: result })
                                }
                                else next({ name: 'MATCH_FAILED' })
                            }
                        }
                        else next({ name: 'MATCH_FAILED' })
                    }
                    else next({ name: 'USER_WINNER' })
                }
                else next({ name: 'NOT_ACCESS' })
            }
            else next({ name: 'TOURNAMENT_FINISH' })
        }
        catch { next({ name: 'MATCH_FAILED' }) }

    }
    static async match4(req, res, next) {
        const { user1, user2, score1, score2, matchID } = req.body
        const { tournamentID } = req.params
        const tournament = await Tournament.findById(tournamentID)
        const stage5User1 = tournament.stage5.find(element => element.user1 == user1 || element.user2 == user1);
        const stage5User2 = tournament.stage5.find(element => element.user1 == user2 || element.user2 == user2);
        const stage5Null = await tournament.stage5.find(element => element.user1 == null || element.user2 == null)
        const bronze = await tournament.bronzeMatch.find(element => element)
        const champion = tournament.winner.find(element => element);

        try {

            if (champion == undefined || champion.first == null && champion.second == null) {
                if (tournament.createBy == req.userID) {
                    if (!stage5User1 && !stage5User2) {
                        const updateSore = await Tournament.findOneAndUpdate({ 'stage4._id': matchID, _id: tournamentID },
                            { $set: { 'stage4.$.score1': score1, 'stage4.$.score2': score2 } },
                            { new: true })
                        const match = await updateSore.stage4.find(element => element._id == matchID)
                        if (match.score1 > match.score2 ) {
                            if (tournament.stage4.length == 1) {
                                await Tournament.findByIdAndUpdate(tournamentID, { $addToSet: { status: 'Complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ _id: tournamentID, 'winner.first': null, 'winner.second': null },
                                    { $set: { "winner.$.first": user1, "winner.$.second": user2, userNow: [] }, }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            }
                            else {
                                if (tournament.stage4.length == 2) {
                                    if (bronze.user1 == null) {
                                        await Tournament.findOneAndUpdate({ _id: tournamentID, 'bronzeMatch.user1': null },
                                            { $set: { 'bronzeMatch.$.user1': user2 } },
                                            { new: true })
                                    }
                                    else if (bronze.user2 == null) {
                                        await Tournament.findOneAndUpdate({ _id: tournamentID, 'bronzeMatch.user2': null },
                                            { $set: { 'bronzeMatch.$.user2': user2 } },
                                            { new: true })
                                    }
                                }
                                if (stage5Null.user1 == null) {
                                    const result = await Tournament.findOneAndUpdate({ _id: tournamentID, 'stage5.user1': null },
                                        { $set: { 'stage5.$.user1': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: result })
                                }
                                else if (stage5Null.user2 == null) {
                                    const result = await Tournament.findOneAndUpdate({ _id: tournamentID, 'stage5.user2': null },
                                        { $set: { 'stage5.$.user2': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: result })
                                }
                                else next({ name: 'MATCH_FAILED' })

                            }
                        }
                        else if (match.score1 < match.score2 ) {
                            if (tournament.stage4.length == 1) {
                                await Tournament.findByIdAndUpdate(tournamentID, { $addToSet: { status: 'Complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ _id: tournamentID, 'winner.first': null, 'winner.second': null },
                                    { $set: { "winner.$.first": user2, "winner.$.second": user1, userNow: [] }, }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            }
                            else {
                                if (tournament.stage4.length == 2) {
                                    if (bronze.user1 == null) {
                                        await Tournament.findOneAndUpdate({ _id: tournamentID, 'bronzeMatch.user1': null },
                                            { $set: { 'bronzeMatch.$.user1': user1 } },
                                            { new: true })
                                    }
                                    else if (bronze.user2 == null) {
                                        await Tournament.findOneAndUpdate({ _id: tournamentID, 'bronzeMatch.user2': null },
                                            { $set: { 'bronzeMatch.$.user2': user1 } }
                                            , { new: true })
                                    }
                                }
                                if (stage5Null.user1 == null) {
                                    const result = await Tournament.findOneAndUpdate({ _id: tournamentID, 'stage5.user1': null },
                                        { $set: { 'stage5.$.user1': user2 } }, { new: true })
                                    res.status(200).json({ success: true, data: result })
                                }
                                else if (stage5Null.user2 == null) {
                                    const result = await Tournament.findOneAndUpdate({ _id: tournamentID, 'stage5.user2': null },
                                        { $set: { 'stage5.$.user2': user2 } }, { new: true })
                                    res.status(200).json({ success: true, data: result })
                                }
                                else next({ name: 'MATCH_FAILED' })
                            }
                        }
                        else next({ name: 'MATCH_FAILED' })
                    }
                    else next({ name: 'USER_WINNER' })
                }
                else next({ name: 'NOT_ACCESS' })
            }
            else next({ name: 'TOURNAMENT_FINISH' })
        }
        catch { next({ name: 'MATCH_FAILED' }) }

    }
    static async bronzeMatch(req, res, next) {
        const { user1, user2, score1, score2, matchID } = req.body
        const { tournamentID } = req.params
        const tournament = await Tournament.findById(tournamentID)
        const champion = tournament.winner.find(element => element);
        const match = tournament.bronzeMatch.find(element => element._id == matchID)
        try {
            if (match) {
                if (champion == undefined || champion.third == null) {
                    if (tournament.createBy == req.userID) {
                        if (match.user1._id == user1 && match.user2._id == user2) {
                            const updateSore = await Tournament.findOneAndUpdate({ 'bronzeMatch._id': matchID, _id: tournamentID },
                                { $set: { 'bronzeMatch.$.score1': score1, 'bronzeMatch.$.score2': score2 } },
                                { new: true })
                            const winner = updateSore.bronzeMatch.find(element => element._id == matchID)
                            if (winner.score1 > winner.score2) {
                                const final = await Tournament.findOneAndUpdate({ _id: tournamentID, 'winner.third': null },
                                    { $set: { "winner.$.third": user1 } }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            }
                            else if (winner.score1 < winner.score2) {
                                const final = await Tournament.findOneAndUpdate({ _id: tournamentID, 'winner.third': null },
                                    { $set: { "winner.$.third": user2 }, }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            }
                        }
                        else next({ name: 'MATCH_FAILED' })
                    }
                    else next({ name: 'NOT_ACCESS' })

                }
                else next({ name: 'TOURNAMENT_FINISH' })
            }
            else next({ name: 'MATCH_FAILED' })
        }
        catch { next({ name: 'MATCH_FAILED' }) }

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
            res, status(200).json({ success: true, data: tournament })
        }
        catch { next({ name: "TOURNAMENT_FAILED" }) }
    }
    static async match1Ffa(req, res, next) {
        const { user1, user2, user3, user4, user5, score1, score2, score3, score4, score5, matchID } = req.body
        const { tournamentID } = req.params
        const tournament = await Tournament.findById(tournamentID)
        const stage1Match = await tournament.ffaStage1.find(element => element._id == matchID)
        const stage2User1 = await tournament.ffaStage2.find(element => element.user1 == user1 || element.user2 == user1 || element.user3 == user1 || element.user4 == user1)
        const stage2User2 = await tournament.ffaStage2.find(element => element.user1 == user2 || element.user2 == user2 || element.user3 == user2 || element.user4 == user2)
        const stage2User3 = await tournament.ffaStage2.find(element => element.user1 == user3 || element.user2 == user3 || element.user3 == user3 || element.user4 == user3)
        const stage2User4 = await tournament.ffaStage2.find(element => element.user1 == user4 || element.user2 == user4 || element.user3 == user4 || element.user4 == user4)
        const stage2User5 = await tournament.ffaStage2.find(element => element.user1 == user5 || element.user2 == user5 || element.user3 == user5 || element.user4 == user5)
        try {
            if (tournament.createBy == req.userID) {
                if (!stage2User1 && !stage2User2 && !stage2User3 && !stage2User4 && !stage2User5) {
                    if (stage1Match) {
                        const updateMatch = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage1._id': matchID }, { $set: { 'ffaStage1.$.score1': score1, 'ffaStage1.$.score2': score2, 'ffaStage1.$.score3': score3, 'ffaStage1.$.score4': score4, 'ffaStage1.$.score5': score5 } }, { new: true })
                        const updateScore = await updateMatch.ffaStage1.find(element => element._id == matchID)
                        const user1Null = await Tournament.findOne({ _id: tournamentID, 'ffaStage2.user1': null })
                        const user2Null = await Tournament.findOne({ _id: tournamentID, 'ffaStage2.user2': null })
                        const user3Null = await Tournament.findOne({ _id: tournamentID, 'ffaStage2.user3': null })
                        const user4Null = await Tournament.findOne({ _id: tournamentID, 'ffaStage2.user4': null })
                        if (updateScore.score1 > updateScore.score2 && updateScore.score1 > updateScore.score3 && updateScore.score1 > updateScore.score4 && updateScore.score1 > updateScore.score5) {
                            if (user1Null) {
                                const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage2.user1': null }, { $set: { 'ffaStage2.$.user1': user1 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else if (user2Null) {
                                const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage2.user2': null }, { $set: { 'ffaStage2.$.user2': user1 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else if (user3Null) {
                                const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage2.user3': null }, { $set: { 'ffaStage2.$.user3': user1 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else if (user4Null) {
                                const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage2.user4': null }, { $set: { 'ffaStage2.$.user4': user1 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else next({ name: 'TOURNAMENT_FAILED' })
                        }
                        else if (updateScore.score2 > updateScore.score1 && updateScore.score2 > updateScore.score3 && updateScore.score2 > updateScore.score4 && updateScore.score2 > updateScore.score5) {
                            if (user1Null) {
                                const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage2.user1': null }, { $set: { 'ffaStage2.$.user1': user2 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else if (user2Null) {
                                const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage2.user2': null }, { $set: { 'ffaStage2.$.user2': user2 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else if (user3Null) {
                                const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage2.user3': null }, { $set: { 'ffaStage2.$.user3': user2 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else if (user4Null) {
                                const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage2.user4': null }, { $set: { 'ffaStage2.$.user4': user2 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else next({ name: 'TOURNAMENT_FAILED' })
                        }
                        else if (updateScore.score3 > updateScore.score1 && updateScore.score3 > updateScore.score2 && updateScore.score3 > updateScore.score4 && updateScore.score3 > updateScore.score5) {
                            if (user1Null) {
                                const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage2.user1': null }, { $set: { 'ffaStage2.$.user1': user3 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else if (user2Null) {
                                const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage2.user2': null }, { $set: { 'ffaStage2.$.user2': user3 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else if (user3Null) {
                                const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage2.user3': null }, { $set: { 'ffaStage2.$.user3': user3 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else if (user4Null) {
                                const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage2.user4': null }, { $set: { 'ffaStage2.$.user4': user3 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else next({ name: 'TOURNAMENT_FAILED' })

                        }
                        else if (updateScore.score4 > updateScore.score1 && updateScore.score4 > updateScore.score2 && updateScore.score4 > updateScore.score3 && updateScore.score4 > updateScore.score5) {
                            if (user1Null) {
                                const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage2.user1': null }, { $set: { 'ffaStage2.$.user1': user4 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else if (user2Null) {
                                const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage2.user2': null }, { $set: { 'ffaStage2.$.user2': user4 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else if (user3Null) {
                                const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage2.user3': null }, { $set: { 'ffaStage2.$.user3': user4 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else if (user4Null) {
                                const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage2.user4': null }, { $set: { 'ffaStage2.$.user4': user4 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else next({ name: 'TOURNAMENT_FAILED' })
                        }
                        else if (updateScore.score5 > updateScore.score1 && updateScore.score5 > updateScore.score2 && updateScore.score5 > updateScore.score4 && updateScore.score5 > updateScore.score4) {
                            if (user1Null) {
                                const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage2.user1': null }, { $set: { 'ffaStage2.$.user1': user5 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else if (user2Null) {
                                const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage2.user2': null }, { $set: { 'ffaStage2.$.user2': user5 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else if (user3Null) {
                                const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage2.user3': null }, { $set: { 'ffaStage2.$.user3': user5 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else if (user4Null) {
                                const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage2.user4': null }, { $set: { 'ffaStage2.$.user4': user5 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else next({ name: 'TOURNAMENT_FAILED' })
                        }
                        else next({ name: 'MATCH_FAILED' })
                    }
                    else next({ name: 'MATCH_FAILED' })
                }
                else next({ name: 'USER_WINNER' })
            }
            else next({ name: 'NOT_ACCESS' })
        }
        catch { next({ name: 'TOURNAMENT_FAILED' }) }
    }
    static async match2Ffa(req, res, next) {
        const { user1, user2, user3, user4, score1, score2, score3, score4, matchID } = req.body
        const { tournamentID } = req.params
        const tournament = await Tournament.findById(tournamentID)
        const champion = await tournament.winner.find(element => element)
        const stage2Match = await tournament.ffaStage2.find(element => element._id == matchID)
        const stage3User1 = await tournament.ffaStage3.find(element => element.user1 == user1 || element.user2 == user1 || element.user3 == user1 || element.user4 == user1)
        const stage3User2 = await tournament.ffaStage3.find(element => element.user1 == user2 || element.user2 == user2 || element.user3 == user2 || element.user4 == user2)
        const stage3User3 = await tournament.ffaStage3.find(element => element.user1 == user3 || element.user2 == user3 || element.user3 == user3 || element.user4 == user3)
        const stage3User4 = await tournament.ffaStage3.find(element => element.user1 == user4 || element.user2 == user4 || element.user3 == user4 || element.user4 == user4)
        try {
            console.log(req.userID)
            console.log(tournament.createBy)
            if (tournament.createBy == req.userID) {
                console.log('hei')
                if (!stage3User1 && !stage3User2 && !stage3User3 && !stage3User4 && champion.first == null) {
                    if (stage2Match) {
                        const updateMatch = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage2._id': matchID }, { $set: { 'ffaStage2.$.score1': score1, 'ffaStage2.$.score2': score2, 'ffaStage2.$.score3': score3, 'ffaStage2.$.score4': score4 } }, { new: true })
                        const updateScore = await updateMatch.ffaStage2.find(element => element._id == matchID)
                        if (updateMatch.ffaStage2.length == 1) {
                            if (updateScore.score1 > updateScore.score2 && updateScore.score1 > updateScore.score3 && updateScore.score1 > updateScore.score4 && updateScore.score1) {
                                await Tournament.findByIdAndUpdate(tournamentID, { $addToSet: { status: 'Complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ _id: tournamentID, 'winner.first': null },
                                    { $set: { "winner.$.first": user1, userNow: [] }, }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            } else if (updateScore.score2 > updateScore.score1 && updateScore.score2 > updateScore.score3 && updateScore.score2 > updateScore.score4 && updateScore.score2) {
                                await Tournament.findByIdAndUpdate(tournamentID, { $addToSet: { status: 'Complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ _id: tournamentID, 'winner.first': null },
                                    { $set: { "winner.$.first": user2, userNow: [] }, }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            } else if (updateScore.score3 > updateScore.score1 && updateScore.score3 > updateScore.score2 && updateScore.score3 > updateScore.score4 && updateScore.score3) {
                                await Tournament.findByIdAndUpdate(tournamentID, { $addToSet: { status: 'Complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ _id: tournamentID, 'winner.first': null },
                                    { $set: { "winner.$.first": user3, userNow: [] }, }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            }
                            else if (updateScore.score4 > updateScore.score1 && updateScore.score4 > updateScore.score2 && updateScore.score4 > updateScore.score3 && updateScore.score4) {
                                await Tournament.findByIdAndUpdate(tournamentID, { $addToSet: { status: 'Complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ _id: tournamentID, 'winner.first': null },
                                    { $set: { "winner.$.first": user4, userNow: [] }, }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            }
                            else next({ name: 'MATCH_FAILED' })
                        }
                        else {
                            const user1Null = await Tournament.findOne({ _id: tournamentID, 'ffaStage3.user1': null })
                            const user2Null = await Tournament.findOne({ _id: tournamentID, 'ffaStage3.user2': null })
                            const user3Null = await Tournament.findOne({ _id: tournamentID, 'ffaStage3.user3': null })
                            const user4Null = await Tournament.findOne({ _id: tournamentID, 'ffaStage3.user4': null })
                            if (updateScore.score1 > updateScore.score2 && updateScore.score1 > updateScore.score3 && updateScore.score1 > updateScore.score4 && updateScore.score1) {
                                if (user1Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage3.user1': null }, { $set: { 'ffaStage3.$.user1': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user2Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage3.user2': null }, { $set: { 'ffaStage3.$.user2': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user3Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage3.user3': null }, { $set: { 'ffaStage3.$.user3': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user4Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage3.user4': null }, { $set: { 'ffaStage3.$.user4': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else next({ name: 'TOURNAMENT_FAILED' })
                            }
                            else if (updateScore.score2 > updateScore.score1 && updateScore.score2 > updateScore.score3 && updateScore.score2 > updateScore.score4 && updateScore.score2) {
                                if (user1Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage3.user1': null }, { $set: { 'ffaStage3.$.user1': user2 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user2Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage3.user2': null }, { $set: { 'ffaStage3.$.user2': user2 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user3Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage3.user3': null }, { $set: { 'ffaStage3.$.user3': user2 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user4Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage3.user4': null }, { $set: { 'ffaStage3.$.user4': user2 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else next({ name: 'TOURNAMENT_FAILED' })
                            }
                            else if (updateScore.score3 > updateScore.score1 && updateScore.score3 > updateScore.score2 && updateScore.score3 > updateScore.score4 && updateScore.score3) {
                                if (user1Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage3.user1': null }, { $set: { 'ffaStage3.$.user1': user3 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user2Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage3.user2': null }, { $set: { 'ffaStage3.$.user2': user3 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user3Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage3.user3': null }, { $set: { 'ffaStage3.$.user3': user3 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user4Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage3.user4': null }, { $set: { 'ffaStage3.$.user4': user3 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else next({ name: 'TOURNAMENT_FAILED' })

                            }
                            else if (updateScore.score4 > updateScore.score1 && updateScore.score4 > updateScore.score2 && updateScore.score4 > updateScore.score3 && updateScore.score4) {
                                if (user1Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage3.user1': null }, { $set: { 'ffaStage3.$.user1': user4 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user2Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage3.user2': null }, { $set: { 'ffaStage3.$.user2': user4 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user3Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage3.user3': null }, { $set: { 'ffaStage3.$.user3': user4 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user4Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage3.user4': null }, { $set: { 'ffaStage3.$.user4': user4 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else next({ name: 'TOURNAMENT_FAILED' })
                            }
                            else next({ name: 'MATCH_FAILED' })
                        }
                    }
                    else next({ name: 'MATCH_FAILED' })
                }
                else next({ name: 'USER_WINNER' })
            }
            else next({ name: 'NOT_ACCESS' })
        }
        catch { next({ name: 'TOURNAMENT_FAILED' }) }
    }
    static async match3Ffa(req, res, next) {
        const { user1, user2, user3, user4, score1, score2, score3, score4, matchID } = req.body
        const { tournamentID } = req.params
        const tournament = await Tournament.findById(tournamentID)
        const stage3Match = await tournament.ffaStage3.find(element => element._id == matchID)
        const champion = await tournament.winner.find(element => element)
        const stage4User1 = await tournament.ffaStage4.find(element => element.user1 == user1 || element.user2 == user1 || element.user3 == user1 || element.user4 == user1)
        const stage4User2 = await tournament.ffaStage4.find(element => element.user1 == user2 || element.user2 == user2 || element.user3 == user2 || element.user4 == user2)
        const stage4User3 = await tournament.ffaStage4.find(element => element.user1 == user3 || element.user2 == user3 || element.user3 == user3 || element.user4 == user3)
        const stage4User4 = await tournament.ffaStage4.find(element => element.user1 == user4 || element.user2 == user4 || element.user3 == user4 || element.user4 == user4)
        try {
            if (tournament.createBy == req.userID) {
                if (!stage4User1 && !stage4User2 && !stage4User3 && !stage4User4 && champion.first == null) {
                    if (stage3Match) {
                        const updateMatch = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage3._id': matchID }, { $set: { 'ffaStage3.$.score1': score1, 'ffaStage3.$.score2': score2, 'ffaStage3.$.score3': score3, 'ffaStage3.$.score4': score4 } }, { new: true })
                        const updateScore = await updateMatch.ffaStage2.find(element => element._id == matchID)
                        if (updateMatch.ffaStage3.length == 1) {
                            if (updateScore.score1 > updateScore.score2 && updateScore.score1 > updateScore.score3 && updateScore.score1 > updateScore.score4 && updateScore.score1) {
                                await Tournament.findByIdAndUpdate(tournamentID, { $addToSet: { status: 'Complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ _id: tournamentID, 'winner.first': null },
                                    { $set: { "winner.$.first": user1, userNow: [] }, }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            } else if (updateScore.score2 > updateScore.score1 && updateScore.score2 > updateScore.score3 && updateScore.score2 > updateScore.score4 && updateScore.score2) {
                                await Tournament.findByIdAndUpdate(tournamentID, { $addToSet: { status: 'Complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ _id: tournamentID, 'winner.first': null },
                                    { $set: { "winner.$.first": user2, userNow: [] }, }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            } else if (updateScore.score3 > updateScore.score1 && updateScore.score3 > updateScore.score2 && updateScore.score3 > updateScore.score4 && updateScore.score3) {
                                await Tournament.findByIdAndUpdate(tournamentID, { $addToSet: { status: 'Complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ _id: tournamentID, 'winner.first': null },
                                    { $set: { "winner.$.first": user3, userNow: [] }, }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            }
                            else if (updateScore.score4 > updateScore.score1 && updateScore.score4 > updateScore.score2 && updateScore.score4 > updateScore.score3 && updateScore.score4) {
                                await Tournament.findByIdAndUpdate(tournamentID, { $addToSet: { status: 'Complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ _id: tournamentID, 'winner.first': null },
                                    { $set: { "winner.$.first": user4, userNow: [] }, }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            }
                            else next({ name: 'MATCH_FAILED' })
                        }
                        else {
                            const user1Null = await Tournament.findOne({ _id: tournamentID, 'ffaStage4.user1': null })
                            const user2Null = await Tournament.findOne({ _id: tournamentID, 'ffaStage4.user2': null })
                            const user3Null = await Tournament.findOne({ _id: tournamentID, 'ffaStage4.user3': null })
                            const user4Null = await Tournament.findOne({ _id: tournamentID, 'ffaStage4.user4': null })
                            if (updateScore.score1 > updateScore.score2 && updateScore.score1 > updateScore.score3 && updateScore.score1 > updateScore.score4 && updateScore.score1) {
                                if (user1Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage4.user1': null }, { $set: { 'ffaStage4.$.user1': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user2Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage4.user2': null }, { $set: { 'ffaStage4.$.user2': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user3Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage4.user3': null }, { $set: { 'ffaStage4.$.user3': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user4Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage4.user4': null }, { $set: { 'ffaStage4.$.user4': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else next({ name: 'TOURNAMENT_FAILED' })
                            }
                            else if (updateScore.score2 > updateScore.score1 && updateScore.score2 > updateScore.score3 && updateScore.score2 > updateScore.score4 && updateScore.score2) {
                                if (user1Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage4.user1': null }, { $set: { 'ffaStage4.$.user1': user2 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user2Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage4.user2': null }, { $set: { 'ffaStage4.$.user2': user2 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user3Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage4.user3': null }, { $set: { 'ffaStage4.$.user3': user2 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user4Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage4.user4': null }, { $set: { 'ffaStage4.$.user4': user2 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else next({ name: 'TOURNAMENT_FAILED' })
                            }
                            else if (updateScore.score3 > updateScore.score1 && updateScore.score3 > updateScore.score2 && updateScore.score3 > updateScore.score4 && updateScore.score3) {
                                if (user1Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage4.user1': null }, { $set: { 'ffaStage4.$.user1': user3 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user2Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage4.user2': null }, { $set: { 'ffaStage4.$.user2': user3 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user3Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage4.user3': null }, { $set: { 'ffaStage4.$.user3': user3 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user4Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage4.user4': null }, { $set: { 'ffaStage4.$.user4': user3 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else next({ name: 'TOURNAMENT_FAILED' })

                            }
                            else if (updateScore.score4 > updateScore.score1 && updateScore.score4 > updateScore.score2 && updateScore.score4 > updateScore.score3 && updateScore.score4) {
                                if (user1Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage4.user1': null }, { $set: { 'ffaStage4.$.user1': user4 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user2Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage4.user2': null }, { $set: { 'ffaStage4.$.user2': user4 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user3Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage4.user3': null }, { $set: { 'ffaStage4.$.user3': user4 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user4Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ _id: tournamentID, 'ffaStage4.user4': null }, { $set: { 'ffaStage4.$.user4': user4 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else next({ name: 'TOURNAMENT_FAILED' })
                            }
                            else next({ name: 'MATCH_FAILED' })
                        }
                    }
                    else next({ name: 'MATCH_FAILED' })
                }
                else next({ name: 'USER_WINNER' })
            }
            else next({ name: 'NOT_ACCESS' })
        }
        catch { next({ name: 'TOURNAMENT_FAILED' }) }
    }
}

module.exports = tournamenController