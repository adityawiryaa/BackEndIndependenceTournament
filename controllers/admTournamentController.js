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
            .populate('game')
            res.status(200).json({ success: true, data: tournament })
        }
        catch { next({ name: 'TOURNAMENT_FAILED' }) }
    }
    static async detailTournament(req, res, next) {
        const { tournamentID } = req.params
        try {
            const tournament = await Tournament.findById(tournamentID)
            .populate('game')
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
            if (tournament.createBy == req.userID && tournament.participant.length != tournament.maxuser) {
                if (found && !userAlready) {
                    const user1Update = await Tournament.findOne({ 'stage1.user1': null })
                    const user2Update = await Tournament.findOne({ 'stage1.user2': null })
                    if (user1Update) {
                        await Tournament.findOneAndUpdate({ 'stage1.user1': null },
                            {
                                $set: { "stage1.$.user1": req.body.user }
                            }, { new: true })
                    }
                    else if (user2Update) {
                        await Tournament.findOneAndUpdate({ 'stage1.user2': null },
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
        catch { next({ name: 'TOURNAMENT_FAILED' }) }
    }
    static async detailMatch(req, res, next) {
        const { tournamentID } = req.params
        const { matchID } = req.body
        const tournament = await Tournament.findById(tournamentID)
        const matchStage1 = tournament.stage1.find(elem => elem._id == matchID)
        const matchStage2 = tournament.stage2.find(elem => elem._id == matchID)
        const matchStage3 = tournament.stage3.find(elem => elem._id == matchID)
        const matchStage4 = tournament.stage4.find(elem => elem._id == matchID)
        const bronzeMatch = tournament.bronzeMatch.find(elem => elem._id == matchID)
        try {
            if (matchStage1) res.status(200).json({ success: true, data: matchStage1 })
            else if (matchStage2) res.status(200).json({ success: true, data: matchStage2 })
            else if (matchStage3) res.status(200).json({ success: true, data: matchStage3 })
            else if (matchStage4) res.status(200).json({ success: true, data: matchStage4 })
            else if (bronzeMatch) res.status(200).json({ success: true, data: bronzeMatch })
            else next({ name: 'TOURNAMENT_FAILED' })
        }
        catch { next({ name: 'TOURNAMENT_FAILED' }) }
    }
    static async match1(req, res, next) {
        const { user1, user2, score1, score2, matchID } = req.body
        const { tournamentID } = req.params
        const tournament = await Tournament.findById(tournamentID)
        const stage2User1 = tournament.stage2.find(element => element.user1 == user1 || element.user2 == user2);
        const stage2User2 = tournament.stage2.find(element => element.user1 == user2 || element.user2 == user1);
        const stage2Null = await tournament.stage2.find(element => element.user1 == null || element.user2 == null)
        const bronze = await tournament.bronzeMatch.find(element => element)
        if (tournament.createBy == req.userID) {
            if (!stage2User1 && !stage2User2) {
                const updateSore = await Tournament.findOneAndUpdate({ 'stage1._id': matchID, _id: tournamentID },
                    { $set: { 'stage1.$.score1': score1, 'stage1.$.score2': score2 } },
                    { new: true })
                const match = await updateSore.stage1.find(element => element._id == matchID)
                if (match.score1 > match.score2 && match.user1 == user1 && match.user2 == user2) {
                    if (tournament.stage1.length == 2) {
                        if (bronze.user1 == null) {
                            await Tournament.findOneAndUpdate({ 'bronzeMatch.user1': null },
                                { $set: { 'bronzeMatch.$.user1': user2 } },
                                { new: true })
                        }
                        else if (bronze.user2 == null) {
                            await Tournament.findOneAndUpdate({ 'bronzeMatch.user2': null },
                                { $set: { 'bronzeMatch.$.user2': user2 } },
                                { new: true })
                        }
                    }
                    if (stage2Null.user1 == null) {
                        const result = await Tournament.findOneAndUpdate({ 'stage2.user1': null },
                            { $set: { 'stage2.$.user1': user1 } }, { new: true })
                        res.status(200).json({ success: true, data: result })
                    }
                    else if (stage2Null.user2 == null) {
                        const result = await Tournament.findOneAndUpdate({ 'stage2.user2': null },
                            { $set: { 'stage2.$.user2': user1 } }, { new: true })
                        res.status(200).json({ success: true, data: result })
                    }
                    else next({ name: 'MATCH_FAILED' })
                }
                else if (match.score1 < match.score2 && match.user1 == user1 && match.user2 == user2) {
                    if (tournament.stage1.length == 2) {
                        if (bronze.user1 == null) {
                            await Tournament.findOneAndUpdate({ 'bronzeMatch.user1': null },
                                { $set: { 'bronzeMatch.$.user1': user1 } },
                                { new: true })
                        }
                        else if (bronze.user2 == null) {
                            await Tournament.findOneAndUpdate({ 'bronzeMatch.user2': null },
                                { $set: { 'bronzeMatch.$.user2': user1 } }
                                , { new: true })
                        }
                    }
                    if (stage2Null.user1 == null) {
                        const result = await Tournament.findOneAndUpdate({ 'stage2.user1': null },
                            { $set: { 'stage2.$.user1': user2 } }, { new: true })
                        res.status(200).json({ success: true, data: result })
                    }
                    else if (stage2Null.user2 == null) {
                        const result = await Tournament.findOneAndUpdate({ 'stage2.user2': null },
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
    static async match2(req, res, next) {
        const { user1, user2, score1, score2, matchID } = req.body
        const { tournamentID } = req.params
        const tournament = await Tournament.findById(tournamentID)
        const stage2User1 = tournament.stage3.find(element => element.user1 == user1 || element.user2 == user2);
        const stage2User2 = tournament.stage3.find(element => element.user1 == user2 || element.user2 == user1);
        const stage3Null = await tournament.stage3.find(element => element.user1 == null || element.user2 == null)
        const bronze = await tournament.bronzeMatch.find(element => element)
        const champion = await tournament.winner.find(element => element)

        if (champion == undefined) {
            if (tournament.createBy == req.userID) {
                if (!stage2User1 && !stage2User2) {
                    const updateSore = await Tournament.findOneAndUpdate({ 'stage2._id': matchID, _id: tournamentID },
                        { $set: { 'stage2.$.score1': score1, 'stage2.$.score2': score2 } },
                        { new: true })
                    const match = await updateSore.stage2.find(element => element._id == matchID)
                    if (match.score1 > match.score2 && match.user1 == user1 && match.user2 == user2) {
                        if (tournament.stage2.length == 1) {
                            await Tournament.findByIdAndUpdate(tournamentID, { $addToSet: { status: 'Complete' } }, { new: true })
                            const final = await Tournament.findOneAndUpdate({ _id: tournamentID },
                                { $set: { winner: { 'first': user1, 'second': user2 }, } }
                                , { new: true })
                            res.status(200).json({ success: true, data: final })
                        }
                        else {
                            if (tournament.stage2.length == 2) {
                                if (bronze.user1 == null) {
                                    await Tournament.findOneAndUpdate({ 'bronzeMatch.user1': null },
                                        { $set: { 'bronzeMatch.$.user1': user2 } },
                                        { new: true })
                                }
                                else if (bronze.user2 == null) {
                                    await Tournament.findOneAndUpdate({ 'bronzeMatch.user2': null },
                                        { $set: { 'bronzeMatch.$.user2': user2 } },
                                        { new: true })
                                }
                            }
                            if (stage3Null.user1 == null) {
                                const result = await Tournament.findOneAndUpdate({ 'stage3.user1': null },
                                    { $set: { 'stage3.$.user1': user1 } }, { new: true })
                                res.status(200).json({ success: true, data: result })
                            }
                            else if (stage3Null.user2 == null) {
                                const result = await Tournament.findOneAndUpdate({ 'stage3.user2': null },
                                    { $set: { 'stage3.$.user2': user1 } }, { new: true })
                                res.status(200).json({ success: true, data: result })
                            }
                            else next({ name: 'MATCH_FAILED' })

                        }
                    }
                    else if (match.score1 < match.score2 && match.user1 == user1 && match.user2 == user2) {
                        if (tournament.stage2.length == 1) {
                            await Tournament.findByIdAndUpdate(tournamentID, { $addToSet: { status: 'Complete' } }, { new: true })
                            const final = await Tournament.findOneAndUpdate({ _id: tournamentID },
                                { $set: { winner: { 'first': user2, 'second': user1 }, } }
                                , { new: true })
                            res.status(200).json({ success: true, data: final })
                        }
                        else {
                            if (tournament.stage2.length == 2) {
                                if (bronze.user1 == null) {
                                    await Tournament.findOneAndUpdate({ 'bronzeMatch.user1': null },
                                        { $set: { 'bronzeMatch.$.user1': user1 } },
                                        { new: true })
                                }
                                else if (bronze.user2 == null) {
                                    await Tournament.findOneAndUpdate({ 'bronzeMatch.user2': null },
                                        { $set: { 'bronzeMatch.$.user2': user1 } }
                                        , { new: true })
                                }
                            }
                            if (stage3Null.user1 == null) {
                                const result = await Tournament.findOneAndUpdate({ 'stage3.user1': null },
                                    { $set: { 'stage3.$.user1': user2 } }, { new: true })
                                res.status(200).json({ success: true, data: result })
                            }
                            else if (stage3Null.user2 == null) {
                                const result = await Tournament.findOneAndUpdate({ 'stage3.user2': null },
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
    static async match3(req, res, next) {
        const { user1, user2, score1, score2, matchID } = req.body
        const { tournamentID } = req.params
        const tournament = await Tournament.findById(tournamentID)
        const stage4User1 = tournament.stage4.find(element => element.user1 == user1 || element.user2 == user2);
        const stage4User2 = tournament.stage4.find(element => element.user1 == user2 || element.user2 == user1);
        const stage4Null = await tournament.stage4.find(element => element.user1 == null || element.user2 == null)
        const bronze = await tournament.bronzeMatch.find(element => element)
        const champion = tournament.winner.find(element => element);

        if (champion == undefined) {
            if (tournament.createBy == req.userID) {
                if (!stage4User1 && !stage4User2) {
                    const updateSore = await Tournament.findOneAndUpdate({ 'stage3._id': matchID, _id: tournamentID },
                        { $set: { 'stage3.$.score1': score1, 'stage3.$.score2': score2 } },
                        { new: true })
                    const match = await updateSore.stage3.find(element => element._id == matchID)
                    if (match.score1 > match.score2 && match.user1 == user1 && match.user2 == user2) {
                        if (tournament.stage3.length == 1) {
                            await Tournament.findByIdAndUpdate(tournamentID, { $addToSet: { status: 'Complete' } }, { new: true })
                            const final = await Tournament.findOneAndUpdate({ _id: tournamentID },
                                { $set: { winner: { 'first': user1, 'second': user2 }, } }
                                , { new: true })
                            res.status(200).json({ success: true, data: final })
                        }
                        else {
                            if (tournament.stage3.length == 2) {
                                if (bronze.user1 == null) {
                                    await Tournament.findOneAndUpdate({ 'bronzeMatch.user1': null },
                                        { $set: { 'bronzeMatch.$.user1': user2 } },
                                        { new: true })
                                }
                                else if (bronze.user2 == null) {
                                    await Tournament.findOneAndUpdate({ 'bronzeMatch.user2': null },
                                        { $set: { 'bronzeMatch.$.user2': user2 } },
                                        { new: true })
                                }
                            }
                            if (stage4Null.user1 == null) {
                                const result = await Tournament.findOneAndUpdate({ 'stage4.user1': null },
                                    { $set: { 'stage4.$.user1': user1 } }, { new: true })
                                res.status(200).json({ success: true, data: result })
                            }
                            else if (stage4Null.user2 == null) {
                                const result = await Tournament.findOneAndUpdate({ 'stage4.user2': null },
                                    { $set: { 'stage4.$.user2': user1 } }, { new: true })
                                res.status(200).json({ success: true, data: result })
                            }
                            else next({ name: 'MATCH_FAILED' })

                        }
                    }
                    else if (match.score1 < match.score2 && match.user1 == user1 && match.user2 == user2) {
                        if (tournament.stage3.length == 1) {
                            await Tournament.findByIdAndUpdate(tournamentID, { $addToSet: { status: 'Complete' } }, { new: true })
                            const final = await Tournament.findOneAndUpdate({ _id: tournamentID },
                                { $set: { winner: { 'first': user2, 'second': user1 }, } }
                                , { new: true })
                            res.status(200).json({ success: true, data: final })
                        }
                        else {
                            if (tournament.stage3.length == 2) {
                                if (bronze.user1 == null) {
                                    await Tournament.findOneAndUpdate({ 'bronzeMatch.user1': null },
                                        { $set: { 'bronzeMatch.$.user1': user1 } },
                                        { new: true })
                                }
                                else if (bronze.user2 == null) {
                                    await Tournament.findOneAndUpdate({ 'bronzeMatch.user2': null },
                                        { $set: { 'bronzeMatch.$.user2': user1 } }
                                        , { new: true })
                                }
                            }
                            if (stage4Null.user1 == null) {
                                const result = await Tournament.findOneAndUpdate({ 'stage4.user1': null },
                                    { $set: { 'stage4.$.user1': user2 } }, { new: true })
                                res.status(200).json({ success: true, data: result })
                            }
                            else if (stage4Null.user2 == null) {
                                const result = await Tournament.findOneAndUpdate({ 'stage4.user2': null },
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
    static async match4(req, res, next) {
        const { user1, user2, score1, score2, matchID } = req.body
        const { tournamentID } = req.params
        const tournament = await Tournament.findById(tournamentID)
        const stage5User1 = tournament.stage5.find(element => element.user1 == user1 || element.user2 == user2);
        const stage5User2 = tournament.stage5.find(element => element.user1 == user2 || element.user2 == user1);
        const stage5Null = await tournament.stage5.find(element => element.user1 == null || element.user2 == null)
        const bronze = await tournament.bronzeMatch.find(element => element)
        const champion = tournament.winner.find(element => element);

        if (champion == undefined || champion.first == null && champion.second == null) {
            if (tournament.createBy == req.userID) {
                if (!stage5User1 && !stage5User2) {
                    const updateSore = await Tournament.findOneAndUpdate({ 'stage4._id': matchID, _id: tournamentID },
                        { $set: { 'stage4.$.score1': score1, 'stage4.$.score2': score2 } },
                        { new: true })
                    const match = await updateSore.stage4.find(element => element._id == matchID)
                    if (match.score1 > match.score2 && match.user1 == user1 && match.user2 == user2) {
                        if (tournament.stage3.length == 1) {
                            await Tournament.findByIdAndUpdate(tournamentID, { $addToSet: { status: 'Complete' } }, { new: true })
                            const final = await Tournament.findOneAndUpdate({ _id: tournamentID },
                                { $set: { winner: { 'first': user1, 'second': user2 }, } }
                                , { new: true })
                            res.status(200).json({ success: true, data: final })
                        }
                        else {
                            if (tournament.stage4.length == 2) {
                                if (bronze.user1 == null) {
                                    await Tournament.findOneAndUpdate({ 'bronzeMatch.user1': null },
                                        { $set: { 'bronzeMatch.$.user1': user2 } },
                                        { new: true })
                                }
                                else if (bronze.user2 == null) {
                                    await Tournament.findOneAndUpdate({ 'bronzeMatch.user2': null },
                                        { $set: { 'bronzeMatch.$.user2': user2 } },
                                        { new: true })
                                }
                            }
                            if (stage5Null.user1 == null) {
                                const result = await Tournament.findOneAndUpdate({ 'stage5.user1': null },
                                    { $set: { 'stage5.$.user1': user1 } }, { new: true })
                                res.status(200).json({ success: true, data: result })
                            }
                            else if (stage5Null.user2 == null) {
                                const result = await Tournament.findOneAndUpdate({ 'stage5.user2': null },
                                    { $set: { 'stage5.$.user2': user1 } }, { new: true })
                                res.status(200).json({ success: true, data: result })
                            }
                            else next({ name: 'MATCH_FAILED' })

                        }
                    }
                    else if (match.score1 < match.score2 && match.user1 == user1 && match.user2 == user2) {
                        if (tournament.stage4.length == 1) {
                            await Tournament.findByIdAndUpdate(tournamentID, { $addToSet: { status: 'Complete' } }, { new: true })
                            const final = await Tournament.findOneAndUpdate({ _id: tournamentID },
                                { $set: { winner: { 'first': user2, 'second': user1 }, } }
                                , { new: true })
                            res.status(200).json({ success: true, data: final })
                        }
                        else {
                            if (tournament.stage4.length == 2) {
                                if (bronze.user1 == null) {
                                    await Tournament.findOneAndUpdate({ 'bronzeMatch.user1': null },
                                        { $set: { 'bronzeMatch.$.user1': user1 } },
                                        { new: true })
                                }
                                else if (bronze.user2 == null) {
                                    await Tournament.findOneAndUpdate({ 'bronzeMatch.user2': null },
                                        { $set: { 'bronzeMatch.$.user2': user1 } }
                                        , { new: true })
                                }
                            }
                            if (stage5Null.user1 == null) {
                                const result = await Tournament.findOneAndUpdate({ 'stage5.user1': null },
                                    { $set: { 'stage5.$.user1': user2 } }, { new: true })
                                res.status(200).json({ success: true, data: result })
                            }
                            else if (stage5Null.user2 == null) {
                                const result = await Tournament.findOneAndUpdate({ 'stage5.user2': null },
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
    static async bronzeMatch(req, res, next) {
        const { user1, user2, score1, score2, matchID } = req.body
        const { tournamentID } = req.params
        const tournament = await Tournament.findById(tournamentID)
        const champion = tournament.winner.find(element => element);
        const match = tournament.bronzeMatch.find(element => element._id == matchID)
        if (match) {
            if (champion == undefined || champion.third == null) {
                if (tournament.createBy == req.userID) {
                    if (match.user1 == user1 && match.user2 == user2) {
                        const updateSore = await Tournament.findOneAndUpdate({ 'bronzeMatch._id': matchID, _id: tournamentID },
                            { $set: { 'bronzeMatch.$.score1': score1, 'bronzeMatch.$.score2': score2 } },
                            { new: true })
                        const winner = updateSore.bronzeMatch.find(element => element._id == matchID)
                        if (winner.score1 > winner.score2) {
                            const final = await Tournament.findOneAndUpdate({ 'winner.third' : null },
                                { $set: { "winner.$.third" : user1} }
                                , { new: true })
                            res.status(200).json({ success: true, data: final })
                        }
                        else if (winner.score1 < winner.score2) {
                            const final = await Tournament.findOneAndUpdate({ 'winner.third' : null },
                                { $set: {  "winner.$.third" : user2 },  }
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
        else  next({ name: 'MATCH_FAILED' })

    }
}

module.exports = tournamenController