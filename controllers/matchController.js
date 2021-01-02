const Tournament = require('../models/TournamentData')
const User = require('../models/UserData')
const Address = require('../models/AdressData')

class matchController {
    static async match1(req, res, next) {
        const { user1, user2, score1, score2, matchID } = req.body
        const { urlID } = req.params
        const tournament = await Tournament.findOne({ url: urlID })
        const seStage2 = await Tournament.findOne({ url: urlID }, {}, { autopopulate: false })
        const stage2User1 = seStage2.stage2.find(element => element.user1 == user1 || element.user2 == user1);
        const stage2User2 = seStage2.stage2.find(element => element.user1 == user2 || element.user2 == user2);
        const stage2Null = await seStage2.stage2.find(element => element.user1 == null || element.user2 == null)
        const bronze = await seStage2.bronzeMatch.find(element => element)
        try {
            if (tournament.createBy == req.userID) {
                if (!stage2User1 && !stage2User2) {
                    const updateSore = await Tournament.findOneAndUpdate({ 'stage1._id': matchID, url: urlID },
                        { $set: { 'stage1.$.score1': score1, 'stage1.$.score2': score2 } },
                        { new: true })
                    const match = await updateSore.stage1.find(element => element._id == matchID)
                    if (match.score1 > match.score2) {
                        if (tournament.stage1.length == 2 && tournament.stage1.length == 4) {
                            if (bronze.user1 == null) {
                                await Tournament.findOneAndUpdate({ url: urlID, 'bronzeMatch.user1': null },
                                    { $set: { 'bronzeMatch.$.user1': user2 } },
                                    { new: true })
                            }
                            else if (bronze.user2 == null) {
                                await Tournament.findOneAndUpdate({ url: urlID, 'bronzeMatch.user2': null },
                                    { $set: { 'bronzeMatch.$.user2': user2 } },
                                    { new: true })
                            }
                        }
                        if (stage2Null.user1 == null) {
                            const result = await Tournament.findOneAndUpdate({ url: urlID, 'stage2.user1': null },
                                { $set: { 'stage2.$.user1': user1 } }, { new: true })
                            res.status(200).json({ success: true, data: result })
                        }
                        else if (stage2Null.user2 == null) {
                            const result = await Tournament.findOneAndUpdate({ url: urlID, 'stage2.user2': null },
                                { $set: { 'stage2.$.user2': user1 } }, { new: true })
                            res.status(200).json({ success: true, data: result })
                        }
                        else next({ name: 'MATCH_FAILED' })
                    }
                    else if (match.score1 < match.score2) {
                        if (tournament.stage1.length == 2 && tournament.stage1.length == 4) {
                            if (bronze.user1 == null) {
                                await Tournament.findOneAndUpdate({ url: urlID, 'bronzeMatch.user1': null },
                                    { $set: { 'bronzeMatch.$.user1': user1 } },
                                    { new: true })
                            }
                            else if (bronze.user2 == null) {
                                await Tournament.findOneAndUpdate({ url: urlID, 'bronzeMatch.user2': null },
                                    { $set: { 'bronzeMatch.$.user2': user1 } }
                                    , { new: true })
                            }
                        }
                        if (stage2Null.user1 == null) {
                            const result = await Tournament.findOneAndUpdate({ url: urlID, 'stage2.user1': null },
                                { $set: { 'stage2.$.user1': user2 } }, { new: true })
                            res.status(200).json({ success: true, data: result })
                        }
                        else if (stage2Null.user2 == null) {
                            const result = await Tournament.findOneAndUpdate({ url: urlID, 'stage2.user2': null },
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
        const { urlID } = req.params
        const tournament = await Tournament.findOne({ url: urlID })
        const seStage3 = await Tournament.findOne({ url: urlID }, {}, { autopopulate: false })
        const stage3User1 = seStage3.stage3.find(element => element.user1 == user1 || element.user2 == user1);
        const stage3User2 = seStage3.stage3.find(element => element.user1 == user2 || element.user2 == user2);
        const stage3Null = await seStage3.stage3.find(element => element.user1 == null || element.user2 == null)
        const bronze = await seStage3.bronzeMatch.find(element => element)
        const champion = await seStage3.winner.find(element => element)

        try {
            if (champion == undefined || champion.first == null && champion.second == null) {
                if (tournament.createBy == req.userID) {
                    if (!stage3User1 && !stage3User2) {
                        const updateSore = await Tournament.findOneAndUpdate({ url: urlID, 'stage2._id': matchID },
                            { $set: { 'stage2.$.score1': score1, 'stage2.$.score2': score2 } },
                            { new: true })
                        const match = await updateSore.stage2.find(element => element._id == matchID)
                        if (match.score1 > match.score2) {
                            if (tournament.stage2.length == 1) {
                                await Tournament.findOneAndUpdate({ url: urlID }, { $set: { status: 'complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ url: urlID, 'winner.first': null, 'winner.second': null },
                                    { $set: { "winner.$.first": user1, "winner.$.second": user2, } }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            }
                            else {
                                if (tournament.stage2.length == 2) {
                                    if (bronze.user1 == null) {
                                        await Tournament.findOneAndUpdate({ url: urlID, 'bronzeMatch.user1': null },
                                            { $set: { 'bronzeMatch.$.user1': user2 } },
                                            { new: true })
                                    }
                                    else if (bronze.user2 == null) {
                                        await Tournament.findOneAndUpdate({ url: urlID, 'bronzeMatch.user2': null },
                                            { $set: { 'bronzeMatch.$.user2': user2 } },
                                            { new: true })
                                    }
                                }
                                if (stage3Null.user1 == null) {
                                    const result = await Tournament.findOneAndUpdate({ url: urlID, 'stage3.user1': null },
                                        { $set: { 'stage3.$.user1': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: result })
                                }
                                else if (stage3Null.user2 == null) {
                                    const result = await Tournament.findOneAndUpdate({ url: urlID, 'stage3.user2': null },
                                        { $set: { 'stage3.$.user2': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: result })
                                }
                                else next({ name: 'MATCH_FAILED' })

                            }
                        }
                        else if (match.score1 < match.score2) {
                            if (tournament.stage2.length == 1) {
                                await Tournament.findOneAndUpdate({ url: urlID }, { $set: { status: 'complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ url: urlID, 'winner.first': null, 'winner.second': null },
                                    { $set: { "winner.$.first": user2, "winner.$.second": user1, } }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            }
                            else {
                                if (tournament.stage2.length == 2) {
                                    if (bronze.user1 == null) {
                                        await Tournament.findOneAndUpdate({ url: urlID, 'bronzeMatch.user1': null },
                                            { $set: { 'bronzeMatch.$.user1': user1 } },
                                            { new: true })
                                    }
                                    else if (bronze.user2 == null) {
                                        await Tournament.findOneAndUpdate({ url: urlID, 'bronzeMatch.user2': null },
                                            { $set: { 'bronzeMatch.$.user2': user1 } }
                                            , { new: true })
                                    }
                                }
                                if (stage3Null.user1 == null) {
                                    const result = await Tournament.findOneAndUpdate({ url: urlID, 'stage3.user1': null },
                                        { $set: { 'stage3.$.user1': user2 } }, { new: true })
                                    res.status(200).json({ success: true, data: result })
                                }
                                else if (stage3Null.user2 == null) {
                                    const result = await Tournament.findOneAndUpdate({ url: urlID, 'stage3.user2': null },
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
        const { urlID } = req.params
        const tournament = await Tournament.findOne({ url: urlID })

        const seStage4 = await Tournament.findOne({ url: urlID }, {}, { autopopulate: false })
        const stage4User1 = seStage4.stage4.find(element => element.user1 == user1 || element.user2 == user1);
        const stage4User2 = seStage4.stage4.find(element => element.user1 == user2 || element.user2 == user2);
        const stage4Null = await seStage4.stage4.find(element => element.user1 == null || element.user2 == null)
        const bronze = await seStage4.bronzeMatch.find(element => element)
        const champion = seStage4.winner.find(element => element);

        try {
            if (champion == undefined || champion.first == null && champion.second == null) {
                if (tournament.createBy == req.userID) {
                    if (!stage4User1 && !stage4User2) {
                        const updateSore = await Tournament.findOneAndUpdate({ 'stage3._id': matchID, url: urlID },
                            { $set: { 'stage3.$.score1': score1, 'stage3.$.score2': score2 } },
                            { new: true })
                        const match = await updateSore.stage3.find(element => element._id == matchID)
                        if (match.score1 > match.score2) {
                            if (tournament.stage3.length == 1) {
                                await Tournament.findOneAndUpdate({ url: urlID }, { $set: { status: 'complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ url: urlID, 'winner.first': null, 'winner.second': null },
                                    { $set: { "winner.$.first": user1, "winner.$.second": user2, }, }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            }
                            else {
                                if (tournament.stage3.length == 2) {
                                    if (bronze.user1 == null) {
                                        await Tournament.findOneAndUpdate({ url: urlID, 'bronzeMatch.user1': null },
                                            { $set: { 'bronzeMatch.$.user1': user2 } },
                                            { new: true })
                                    }
                                    else if (bronze.user2 == null) {
                                        await Tournament.findOneAndUpdate({ url: urlID, 'bronzeMatch.user2': null },
                                            { $set: { 'bronzeMatch.$.user2': user2 } },
                                            { new: true })
                                    }
                                }
                                if (stage4Null.user1 == null) {
                                    const result = await Tournament.findOneAndUpdate({ url: urlID, 'stage4.user1': null },
                                        { $set: { 'stage4.$.user1': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: result })
                                }
                                else if (stage4Null.user2 == null) {
                                    const result = await Tournament.findOneAndUpdate({ url: urlID, 'stage4.user2': null },
                                        { $set: { 'stage4.$.user2': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: result })
                                }
                                else next({ name: 'MATCH_FAILED' })
                            }
                        }
                        else if (match.score1 < match.score2) {
                            if (tournament.stage3.length == 1) {
                                await Tournament.findOneAndUpdate({ url: urlID }, { $set: { status: 'complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ url: urlID, 'winner.first': null, 'winner.second': null },
                                    { $set: { "winner.$.first": user2, "winner.$.second": user1, }, }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            }
                            else {
                                if (tournament.stage3.length == 2) {
                                    if (bronze.user1 == null) {
                                        await Tournament.findOneAndUpdate({ url: urlID, 'bronzeMatch.user1': null },
                                            { $set: { 'bronzeMatch.$.user1': user1 } },
                                            { new: true })
                                    }
                                    else if (bronze.user2 == null) {
                                        await Tournament.findOneAndUpdate({ url: urlID, 'bronzeMatch.user2': null },
                                            { $set: { 'bronzeMatch.$.user2': user1 } }
                                            , { new: true })
                                    }
                                }
                                if (stage4Null.user1 == null) {
                                    const result = await Tournament.findOneAndUpdate({ url: urlID, 'stage4.user1': null },
                                        { $set: { 'stage4.$.user1': user2 } }, { new: true })
                                    res.status(200).json({ success: true, data: result })
                                }
                                else if (stage4Null.user2 == null) {
                                    const result = await Tournament.findOneAndUpdate({ url: urlID, 'stage4.user2': null },
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
        const { urlID } = req.params
        const tournament = await Tournament.findOne({ url: urlID })
        const seStage5 = await Tournament.findOne({ url: urlID }, {}, { autopopulate: false })
        const stage5User1 = seStage5.stage5.find(element => element.user1 == user1 || element.user2 == user1);
        const stage5User2 = seStage5.stage5.find(element => element.user1 == user2 || element.user2 == user2);
        const stage5Null = await seStage5.stage5.find(element => element.user1 == null || element.user2 == null)
        const bronze = await seStage5.bronzeMatch.find(element => element)
        const champion = seStage5.winner.find(element => element);

        try {
            if (champion == undefined || champion.first == null && champion.second == null) {
                if (tournament.createBy == req.userID) {
                    if (!stage5User1 && !stage5User2) {
                        const updateSore = await Tournament.findOneAndUpdate({ 'stage4._id': matchID, url: urlID },
                            { $set: { 'stage4.$.score1': score1, 'stage4.$.score2': score2 } },
                            { new: true })
                        const match = await updateSore.stage4.find(element => element._id == matchID)
                        if (match.score1 > match.score2) {
                            if (tournament.stage4.length == 1) {
                                await Tournament.findOneAndUpdate({ url: urlID }, { $set: { status: 'complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ url: urlID, 'winner.first': null, 'winner.second': null },
                                    { $set: { "winner.$.first": user1, "winner.$.second": user2, }, }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            }
                            else {
                                if (tournament.stage4.length == 2) {
                                    if (bronze.user1 == null) {
                                        await Tournament.findOneAndUpdate({ url: urlID, 'bronzeMatch.user1': null },
                                            { $set: { 'bronzeMatch.$.user1': user2 } },
                                            { new: true })
                                    }
                                    else if (bronze.user2 == null) {
                                        await Tournament.findOneAndUpdate({ url: urlID, 'bronzeMatch.user2': null },
                                            { $set: { 'bronzeMatch.$.user2': user2 } },
                                            { new: true })
                                    }
                                }
                                if (stage5Null.user1 == null) {
                                    const result = await Tournament.findOneAndUpdate({ url: urlID, 'stage5.user1': null },
                                        { $set: { 'stage5.$.user1': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: result })
                                }
                                else if (stage5Null.user2 == null) {
                                    const result = await Tournament.findOneAndUpdate({ url: urlID, 'stage5.user2': null },
                                        { $set: { 'stage5.$.user2': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: result })
                                }
                                else next({ name: 'MATCH_FAILED' })

                            }
                        }
                        else if (match.score1 < match.score2) {
                            if (tournament.stage4.length == 1) {
                                await Tournament.findOneAndUpdate({ url: urlID }, { $set: { status: 'complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ url: urlID, 'winner.first': null, 'winner.second': null },
                                    { $set: { "winner.$.first": user2, "winner.$.second": user1, }, }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            }
                            else {
                                if (tournament.stage4.length == 2) {
                                    if (bronze.user1 == null) {
                                        await Tournament.findOneAndUpdate({ url: urlID, 'bronzeMatch.user1': null },
                                            { $set: { 'bronzeMatch.$.user1': user1 } },
                                            { new: true })
                                    }
                                    else if (bronze.user2 == null) {
                                        await Tournament.findOneAndUpdate({ url: urlID, 'bronzeMatch.user2': null },
                                            { $set: { 'bronzeMatch.$.user2': user1 } }
                                            , { new: true })
                                    }
                                }
                                if (stage5Null.user1 == null) {
                                    const result = await Tournament.findOneAndUpdate({ url: urlID, 'stage5.user1': null },
                                        { $set: { 'stage5.$.user1': user2 } }, { new: true })
                                    res.status(200).json({ success: true, data: result })
                                }
                                else if (stage5Null.user2 == null) {
                                    const result = await Tournament.findOneAndUpdate({ url: urlID, 'stage5.user2': null },
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
    static async match5(req, res, next) {
        const { user1, user2, score1, score2, matchID } = req.body
        const { urlID } = req.params
        const tournament = await Tournament.findOne({ url: urlID })
        const seStage6 = await Tournament.findOne({ url: urlID }, {}, { autopopulate: false })
        const stage6User1 = seStage6.stage6.find(element => element.user1 == user1 || element.user2 == user1);
        const stage6User2 = seStage6.stage6.find(element => element.user1 == user2 || element.user2 == user2);
        const stage6Null = await seStage6.stage6.find(element => element.user1 == null || element.user2 == null)
        const bronze = await seStage6.bronzeMatch.find(element => element)
        const champion = seStage6.winner.find(element => element);

        try {
            if (champion == undefined || champion.first == null && champion.second == null) {
                if (tournament.createBy == req.userID) {
                    if (!stage6User1 && !stage6User2) {
                        const updateSore = await Tournament.findOneAndUpdate({ 'stage5._id': matchID, url: urlID },
                            { $set: { 'stage5.$.score1': score1, 'stage5.$.score2': score2 } },
                            { new: true })
                        const match = await updateSore.stage5.find(element => element._id == matchID)
                        if (match.score1 > match.score2) {
                            if (tournament.stage5.length == 1) {
                                await Tournament.findOneAndUpdate({ url: urlID }, { $set: { status: 'complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ url: urlID, 'winner.first': null, 'winner.second': null },
                                    { $set: { "winner.$.first": user1, "winner.$.second": user2, }, }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            }
                            else {
                                if (tournament.stage5.length == 2) {
                                    if (bronze.user1 == null) {
                                        await Tournament.findOneAndUpdate({ url: urlID, 'bronzeMatch.user1': null },
                                            { $set: { 'bronzeMatch.$.user1': user2 } },
                                            { new: true })
                                    }
                                    else if (bronze.user2 == null) {
                                        await Tournament.findOneAndUpdate({ url: urlID, 'bronzeMatch.user2': null },
                                            { $set: { 'bronzeMatch.$.user2': user2 } },
                                            { new: true })
                                    }
                                }
                                if (stage6Null.user1 == null) {
                                    const result = await Tournament.findOneAndUpdate({ url: urlID, 'stage6.user1': null },
                                        { $set: { 'stage6.$.user1': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: result })
                                }
                                else if (stage6Null.user2 == null) {
                                    const result = await Tournament.findOneAndUpdate({ url: urlID, 'stage6.user2': null },
                                        { $set: { 'stage6.$.user2': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: result })
                                }
                                else next({ name: 'MATCH_FAILED' })

                            }
                        }
                        else if (match.score1 < match.score2) {
                            if (tournament.stage5.length == 1) {
                                await Tournament.findOneAndUpdate({ url: urlID }, { $set: { status: 'complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ url: urlID, 'winner.first': null, 'winner.second': null },
                                    { $set: { "winner.$.first": user2, "winner.$.second": user1, }, }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            }
                            else {
                                if (tournament.stage5.length == 2) {
                                    if (bronze.user1 == null) {
                                        await Tournament.findOneAndUpdate({ url: urlID, 'bronzeMatch.user1': null },
                                            { $set: { 'bronzeMatch.$.user1': user1 } },
                                            { new: true })
                                    }
                                    else if (bronze.user2 == null) {
                                        await Tournament.findOneAndUpdate({ url: urlID, 'bronzeMatch.user2': null },
                                            { $set: { 'bronzeMatch.$.user2': user1 } }
                                            , { new: true })
                                    }
                                }
                                if (stage6Null.user1 == null) {
                                    const result = await Tournament.findOneAndUpdate({ url: urlID, 'stage6.user1': null },
                                        { $set: { 'stage6.$.user1': user2 } }, { new: true })
                                    res.status(200).json({ success: true, data: result })
                                }
                                else if (stage6Null.user2 == null) {
                                    const result = await Tournament.findOneAndUpdate({ url: urlID, 'stage6.user2': null },
                                        { $set: { 'stage6.$.user2': user2 } }, { new: true })
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
    static async match6(req, res, next) {
        const { user1, user2, score1, score2, matchID } = req.body
        const { urlID } = req.params
        const tournament = await Tournament.findOne({ url: urlID })
        const seStage7 = await Tournament.findOne({ url: urlID }, {}, { autopopulate: false })
        const stage7User1 = seStage7.stage7.find(element => element.user1 == user1 || element.user2 == user1);
        const stage7User2 = seStage7.stage7.find(element => element.user1 == user2 || element.user2 == user2);
        const stage7Null = await seStage7.stage7.find(element => element.user1 == null || element.user2 == null)
        const bronze = await seStage7.bronzeMatch.find(element => element)
        const champion = seStage7.winner.find(element => element);

        try {
            if (champion == undefined || champion.first == null && champion.second == null) {
                if (tournament.createBy == req.userID) {
                    if (!stage7User1 && !stage7User2) {
                        const updateSore = await Tournament.findOneAndUpdate({ 'stage6._id': matchID, url: urlID },
                            { $set: { 'stage6.$.score1': score1, 'stage6.$.score2': score2 } },
                            { new: true })
                        const match = await updateSore.stage6.find(element => element._id == matchID)
                        if (match.score1 > match.score2) {
                            if (tournament.stage6.length == 1) {
                                await Tournament.findOneAndUpdate({ url: urlID }, { $set: { status: 'complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ url: urlID, 'winner.first': null, 'winner.second': null },
                                    { $set: { "winner.$.first": user1, "winner.$.second": user2, }, }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            }
                            else {
                                if (tournament.stage6.length == 2) {
                                    if (bronze.user1 == null) {
                                        await Tournament.findOneAndUpdate({ url: urlID, 'bronzeMatch.user1': null },
                                            { $set: { 'bronzeMatch.$.user1': user2 } },
                                            { new: true })
                                    }
                                    else if (bronze.user2 == null) {
                                        await Tournament.findOneAndUpdate({ url: urlID, 'bronzeMatch.user2': null },
                                            { $set: { 'bronzeMatch.$.user2': user2 } },
                                            { new: true })
                                    }
                                }
                                if (stage7Null.user1 == null) {
                                    const result = await Tournament.findOneAndUpdate({ url: urlID, 'stage7.user1': null },
                                        { $set: { 'stage7.$.user1': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: result })
                                }
                                else if (stage7Null.user2 == null) {
                                    const result = await Tournament.findOneAndUpdate({ url: urlID, 'stage7.user2': null },
                                        { $set: { 'stage7.$.user2': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: result })
                                }
                                else next({ name: 'MATCH_FAILED' })

                            }
                        }
                        else if (match.score1 < match.score2) {
                            if (tournament.stage6.length == 1) {
                                await Tournament.findOneAndUpdate({ url: urlID }, { $set: { status: 'complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ url: urlID, 'winner.first': null, 'winner.second': null },
                                    { $set: { "winner.$.first": user2, "winner.$.second": user1, }, }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            }
                            else {
                                if (tournament.stage6.length == 2) {
                                    if (bronze.user1 == null) {
                                        await Tournament.findOneAndUpdate({ url: urlID, 'bronzeMatch.user1': null },
                                            { $set: { 'bronzeMatch.$.user1': user1 } },
                                            { new: true })
                                    }
                                    else if (bronze.user2 == null) {
                                        await Tournament.findOneAndUpdate({ url: urlID, 'bronzeMatch.user2': null },
                                            { $set: { 'bronzeMatch.$.user2': user1 } }
                                            , { new: true })
                                    }
                                }
                                if (stage7Null.user1 == null) {
                                    const result = await Tournament.findOneAndUpdate({ url: urlID, 'stage7.user1': null },
                                        { $set: { 'stage7.$.user1': user2 } }, { new: true })
                                    res.status(200).json({ success: true, data: result })
                                }
                                else if (stage7Null.user2 == null) {
                                    const result = await Tournament.findOneAndUpdate({ url: urlID, 'stage7.user2': null },
                                        { $set: { 'stage7.$.user2': user2 } }, { new: true })
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
    static async match7(req, res, next) {

        const { user1, user2, score1, score2, matchID } = req.body
        const { urlID } = req.params
        const tournament = await Tournament.findOne({ url: urlID })
        const seStage8 = await Tournament.findOne({ url: urlID }, {}, { autopopulate: false })
        const stage8User1 = seStage8.stage8.find(element => element.user1 == user1 || element.user2 == user1);
        const stage8User2 = seStage8.stage8.find(element => element.user1 == user2 || element.user2 == user2);
        const stage8Null = await seStage8.stage8.find(element => element.user1 == null || element.user2 == null)
        const bronze = await seStage8.bronzeMatch.find(element => element)
        const champion = seStage8.winner.find(element => element);

        try {
            if (champion == undefined || champion.first == null && champion.second == null) {
                if (tournament.createBy == req.userID) {
                    if (!stage8User1 && !stage8User2) {
                        const updateSore = await Tournament.findOneAndUpdate({ 'stage7._id': matchID, url: urlID },
                            { $set: { 'stage7.$.score1': score1, 'stage7.$.score2': score2 } },
                            { new: true })
                        const match = await updateSore.stage7.find(element => element._id == matchID)
                        if (match.score1 > match.score2) {
                            if (tournament.stage7.length == 1) {
                                await Tournament.findOneAndUpdate({ url: urlID }, { $set: { status: 'complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ url: urlID, 'winner.first': null, 'winner.second': null },
                                    { $set: { "winner.$.first": user1, "winner.$.second": user2, }, }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            }
                            else {
                                if (tournament.stage7.length == 2) {
                                    if (bronze.user1 == null) {
                                        await Tournament.findOneAndUpdate({ url: urlID, 'bronzeMatch.user1': null },
                                            { $set: { 'bronzeMatch.$.user1': user2 } },
                                            { new: true })
                                    }
                                    else if (bronze.user2 == null) {
                                        await Tournament.findOneAndUpdate({ url: urlID, 'bronzeMatch.user2': null },
                                            { $set: { 'bronzeMatch.$.user2': user2 } },
                                            { new: true })
                                    }
                                }
                                if (stage8Null.user1 == null) {
                                    const result = await Tournament.findOneAndUpdate({ url: urlID, 'stage8.user1': null },
                                        { $set: { 'stage8.$.user1': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: result })
                                }
                                else if (stage8Null.user2 == null) {
                                    const result = await Tournament.findOneAndUpdate({ url: urlID, 'stage8.user2': null },
                                        { $set: { 'stage8.$.user2': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: result })
                                }
                                else next({ name: 'MATCH_FAILED' })

                            }
                        }
                        else if (match.score1 < match.score2) {
                            if (tournament.stage7.length == 1) {
                                await Tournament.findOneAndUpdate({ url: urlID }, { $set: { status: 'complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ url: urlID, 'winner.first': null, 'winner.second': null },
                                    { $set: { "winner.$.first": user2, "winner.$.second": user1, }, }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            }
                            else {
                                if (tournament.stage7.length == 2) {
                                    if (bronze.user1 == null) {
                                        await Tournament.findOneAndUpdate({ url: urlID, 'bronzeMatch.user1': null },
                                            { $set: { 'bronzeMatch.$.user1': user1 } },
                                            { new: true })
                                    }
                                    else if (bronze.user2 == null) {
                                        await Tournament.findOneAndUpdate({ url: urlID, 'bronzeMatch.user2': null },
                                            { $set: { 'bronzeMatch.$.user2': user1 } }
                                            , { new: true })
                                    }
                                }
                                if (stage8Null.user1 == null) {
                                    const result = await Tournament.findOneAndUpdate({ url: urlID, 'stage8.user1': null },
                                        { $set: { 'stage8.$.user1': user2 } }, { new: true })
                                    res.status(200).json({ success: true, data: result })
                                }
                                else if (stage8Null.user2 == null) {
                                    const result = await Tournament.findOneAndUpdate({ url: urlID, 'stage8.user2': null },
                                        { $set: { 'stage8.$.user2': user2 } }, { new: true })
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
        const { urlID } = req.params
        const tournament = await Tournament.findOne({ url: urlID })
        const nonPopulate = await Tournament.findOne({ url: urlID }, {}, { autopopulate: false })
        const champion = nonPopulate.winner.find(element => element);
        const match = nonPopulate.bronzeMatch.find(element => element._id == matchID)
        try {
            if (match) {
                if (champion == undefined || champion.third == null) {
                    if (tournament.createBy == req.userID) {
                        if (match.user1._id == user1 && match.user2._id == user2) {
                            const updateSore = await Tournament.findOneAndUpdate({ 'bronzeMatch._id': matchID, url: urlID },
                                { $set: { 'bronzeMatch.$.score1': score1, 'bronzeMatch.$.score2': score2 } },
                                { new: true })
                            const winner = updateSore.bronzeMatch.find(element => element._id == matchID)
                            if (winner.score1 > winner.score2) {
                                const final = await Tournament.findOneAndUpdate({ url: urlID, 'winner.third': null },
                                    { $set: { "winner.$.third": user1 } }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            }
                            else if (winner.score1 < winner.score2) {
                                const final = await Tournament.findOneAndUpdate({ url: urlID, 'winner.third': null },
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
    static async ffaMatch1(req, res, next) {
        const { winner, matchID } = req.body
        const { urlID } = req.params
        const tournament = await Tournament.findOne({ url: urlID })
        const ffaStage2 = await Tournament.findOne({ url: urlID }, {}, { autopopulate: false })
        const user1Null = await Tournament.findOne({ url: urlID, 'ffaStage2.user1': null })
        const user2Null = await Tournament.findOne({ url: urlID, 'ffaStage2.user2': null })
        const user3Null = await Tournament.findOne({ url: urlID, 'ffaStage2.user3': null })
        const user4Null = await Tournament.findOne({ url: urlID, 'ffaStage2.user4': null })
        const user5Null = await Tournament.findOne({ url: urlID, 'ffaStage2.user5': null })
        const user6Null = await Tournament.findOne({ url: urlID, 'ffaStage2.user6': null })
        const user7Null = await Tournament.findOne({ url: urlID, 'ffaStage2.user7': null })
        const user8Null = await Tournament.findOne({ url: urlID, 'ffaStage2.user8': null })
        const user9Null = await Tournament.findOne({ url: urlID, 'ffaStage2.user9': null })
        const user10Null = await Tournament.findOne({ url: urlID, 'ffaStage2.user10': null })
        if (tournament.createBy == req.userID) {
            const match = tournament.ffaStage1.find(el => el._id == matchID)
            const ffa2 = ffaStage2.ffaStage2.find(el => el.user1 == winner || el.user2 == winner || el.user3 == winner || el.user4 == winner || el.user5 == winner || el.user6 == winner || el.user7 == winner || el.user8 == winner || el.user9 == winner || el.user10 == winner)
            if (ffa2) next({ name: 'USER_WINNER' })
            else {
                if (match) {
                    if (user1Null) {
                        const update = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage2.user1': null }, {
                            $set: { 'ffaStage2.$.user1': winner }
                        }, { new: true })
                        res.status(200).json({ success: true, data: update })
                    }
                    else if (user2Null) {
                        const update = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage2.user2': null }, {
                            $set: { 'ffaStage2.$.user2': winner }
                        }, { new: true })
                        res.status(200).json({ success: true, data: update })
                    }
                    else if (user3Null) {
                        const update = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage2.user3': null }, {
                            $set: { 'ffaStage2.$.user3': winner }
                        }, { new: true })
                        res.status(200).json({ success: true, data: update })
                    }
                    else if (user4Null) {
                        const update = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage2.user4': null }, {
                            $set: { 'ffaStage2.$.user4': winner }
                        }, { new: true })
                        res.status(200).json({ success: true, data: update })
                    }
                    else if (user5Null) {
                        const update = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage2.user5': null }, {
                            $set: { 'ffaStage2.$.user5': winner }
                        }, { new: true })
                        res.status(200).json({ success: true, data: update })
                    }
                    else if (user6Null) {
                        const update = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage2.user6': null }, {
                            $set: { 'ffaStage2.$.user6': winner }
                        }, { new: true })
                        res.status(200).json({ success: true, data: update })
                    }
                    else if (user7Null) {
                        const update = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage2.user7': null }, {
                            $set: { 'ffaStage2.$.user7': winner }
                        }, { new: true })
                        res.status(200).json({ success: true, data: update })
                    }
                    else if (user8Null) {
                        const update = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage2.user8': null }, {
                            $set: { 'ffaStage2.$.user8': winner }
                        }, { new: true })
                        res.status(200).json({ success: true, data: update })
                    }
                    else if (user9Null) {
                        const update = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage2.user9': null }, {
                            $set: { 'ffaStage2.$.user9': winner }
                        }, { new: true })
                        res.status(200).json({ success: true, data: update })
                    }
                    else if (user10Null) {
                        const update = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage2.user10': null }, {
                            $set: { 'ffaStage2.$.user10': winner }
                        }, { new: true })
                        res.status(200).json({ success: true, data: update })
                    }
                    else next({ name: 'MATCH_FAILED' })
                }
                else next({ name: 'MATCH_FAILED' })
            }
        }
        else next({ name: 'NOT_ACCESS' })
    }
    static async ffaMatch2(req, res, next) {
        const { winner, matchID } = req.body
        const { urlID } = req.params

        const tournament = await Tournament.findOne({ url: urlID })
        const ffaStage3 = await Tournament.findOne({ url: urlID }, {}, { autopopulate: false })
        const user1Null = await Tournament.findOne({ url: urlID, 'ffaStage3.user1': null })
        const user2Null = await Tournament.findOne({ url: urlID, 'ffaStage3.user2': null })
        const user3Null = await Tournament.findOne({ url: urlID, 'ffaStage3.user3': null })
        const user4Null = await Tournament.findOne({ url: urlID, 'ffaStage3.user4': null })
        const user5Null = await Tournament.findOne({ url: urlID, 'ffaStage3.user5': null })
        const user6Null = await Tournament.findOne({ url: urlID, 'ffaStage3.user6': null })
        const user7Null = await Tournament.findOne({ url: urlID, 'ffaStage3.user7': null })
        const user8Null = await Tournament.findOne({ url: urlID, 'ffaStage3.user8': null })
        const user9Null = await Tournament.findOne({ url: urlID, 'ffaStage3.user9': null })
        const user10Null = await Tournament.findOne({ url: urlID, 'ffaStage3.user10': null })
        if (tournament.createBy == req.userID) {
            const match = tournament.ffaStage2.find(el => el._id == matchID)
            const champion = ffaStage3.winner.find(element => element.first == null);
            const ffa3 = ffaStage3.ffaStage3.find(el => el.user1 == winner || el.user2 == winner || el.user3 == winner || el.user4 == winner || el.user5 == winner || el.user6 == winner || el.user7 == winner || el.user8 == winner || el.user9 == winner || el.user10 == winner)
            if (ffa3 || !champion) next({ name: 'USER_WINNER' })
            else {
                if (match) {
                    if (tournament.ffaStage2.length == 1) {
                                await Tournament.findOneAndUpdate({ url: urlID }, { $set: { status: 'complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ url: urlID, 'winner.first': null},
                                    { $set: { "winner.$.first": winner} }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                    }
                    else {
                        if (user1Null) {
                            const update = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage3.user1': null }, {
                                $set: { 'ffaStage3.$.user1': winner }
                            }, { new: true })
                            res.status(200).json({ success: true, data: update })
                        }
                        else if (user2Null) {
                            const update = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage3.user2': null }, {
                                $set: { 'ffaStage3.$.user2': winner }
                            }, { new: true })
                            res.status(200).json({ success: true, data: update })
                        }
                        else if (user3Null) {
                            const update = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage3.user3': null }, {
                                $set: { 'ffaStage3.$.user3': winner }
                            }, { new: true })
                            res.status(200).json({ success: true, data: update })
                        }
                        else if (user4Null) {
                            const update = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage3.user4': null }, {
                                $set: { 'ffaStage3.$.user4': winner }
                            }, { new: true })
                            res.status(200).json({ success: true, data: update })
                        }
                        else if (user5Null) {
                            const update = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage3.user5': null }, {
                                $set: { 'ffaStage3.$.user5': winner }
                            }, { new: true })
                            res.status(200).json({ success: true, data: update })
                        }
                        else if (user6Null) {
                            const update = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage3.user6': null }, {
                                $set: { 'ffaStage3.$.user6': winner }
                            }, { new: true })
                            res.status(200).json({ success: true, data: update })
                        }
                        else if (user7Null) {
                            const update = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage3.user7': null }, {
                                $set: { 'ffaStage3.$.user7': winner }
                            }, { new: true })
                            res.status(200).json({ success: true, data: update })
                        }
                        else if (user8Null) {
                            const update = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage3.user8': null }, {
                                $set: { 'ffaStage3.$.user8': winner }
                            }, { new: true })
                            res.status(200).json({ success: true, data: update })
                        }
                        else if (user9Null) {
                            const update = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage3.user9': null }, {
                                $set: { 'ffaStage3.$.user9': winner }
                            }, { new: true })
                            res.status(200).json({ success: true, data: update })
                        }
                        else if (user10Null) {
                            const update = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage3.user10': null }, {
                                $set: { 'ffaStage3.$.user10': winner }
                            }, { new: true })
                            res.status(200).json({ success: true, data: update })
                        }
                        else next({ name: 'MATCH_FAILED' })
                    }
                }
                else next({ name: 'MATCH_FAILED' })
            }
        }
        else next({ name: 'NOT_ACCESS' })
    }
    static async ffaMatch3(req, res, next) {
        const { winner, matchID } = req.body
        const { urlID } = req.params
        
        const tournament = await Tournament.findOne({ url: urlID })
        const ffaStage4 = await Tournament.findOne({ url: urlID }, {}, { autopopulate: false })
        const user1Null = await Tournament.findOne({ url: urlID, 'ffaStage4.user1': null })
        const user2Null = await Tournament.findOne({ url: urlID, 'ffaStage4.user2': null })
        const user3Null = await Tournament.findOne({ url: urlID, 'ffaStage4.user3': null })
        const user4Null = await Tournament.findOne({ url: urlID, 'ffaStage4.user4': null })
        const user5Null = await Tournament.findOne({ url: urlID, 'ffaStage4.user5': null })
        const user6Null = await Tournament.findOne({ url: urlID, 'ffaStage4.user6': null })
        const user7Null = await Tournament.findOne({ url: urlID, 'ffaStage4.user7': null })
        const user8Null = await Tournament.findOne({ url: urlID, 'ffaStage4.user8': null })
        const user9Null = await Tournament.findOne({ url: urlID, 'ffaStage4.user9': null })
        const user10Null = await Tournament.findOne({ url: urlID, 'ffaStage4.user10': null })
        if (tournament.createBy == req.userID) {
            const match = tournament.ffaStage3.find(el => el._id == matchID)
            const champion = ffaStage4.winner.find(element => element.first == null);
            const ffa3 = ffaStage4.ffaStage4.find(el => el.user1 == winner || el.user2 == winner || el.user3 == winner || el.user4 == winner || el.user5 == winner || el.user6 == winner || el.user7 == winner || el.user8 == winner || el.user9 == winner || el.user10 == winner)
            if (ffa3 || !champion) next({ name: 'USER_WINNER' })
            else {
                if (match) {
                    if (tournament.ffaStage3.length == 1) {
                                await Tournament.findOneAndUpdate({ url: urlID }, { $set: { status: 'complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ url: urlID, 'winner.first': null},
                                    { $set: { "winner.$.first": winner} }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                    }
                    else {
                        if (user1Null) {
                            const update = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage4.user1': null }, {
                                $set: { 'ffaStage4.$.user1': winner }
                            }, { new: true })
                            res.status(200).json({ success: true, data: update })
                        }
                        else if (user2Null) {
                            const update = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage4.user2': null }, {
                                $set: { 'ffaStage4.$.user2': winner }
                            }, { new: true })
                            res.status(200).json({ success: true, data: update })
                        }
                        else if (user3Null) {
                            const update = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage4.user3': null }, {
                                $set: { 'ffaStage4.$.user3': winner }
                            }, { new: true })
                            res.status(200).json({ success: true, data: update })
                        }
                        else if (user4Null) {
                            const update = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage4.user4': null }, {
                                $set: { 'ffaStage4.$.user4': winner }
                            }, { new: true })
                            res.status(200).json({ success: true, data: update })
                        }
                        else if (user5Null) {
                            const update = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage4.user5': null }, {
                                $set: { 'ffaStage4.$.user5': winner }
                            }, { new: true })
                            res.status(200).json({ success: true, data: update })
                        }
                        else if (user6Null) {
                            const update = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage4.user6': null }, {
                                $set: { 'ffaStage4.$.user6': winner }
                            }, { new: true })
                            res.status(200).json({ success: true, data: update })
                        }
                        else if (user7Null) {
                            const update = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage4.user7': null }, {
                                $set: { 'ffaStage4.$.user7': winner }
                            }, { new: true })
                            res.status(200).json({ success: true, data: update })
                        }
                        else if (user8Null) {
                            const update = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage4.user8': null }, {
                                $set: { 'ffaStage4.$.user8': winner }
                            }, { new: true })
                            res.status(200).json({ success: true, data: update })
                        }
                        else if (user9Null) {
                            const update = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage4.user9': null }, {
                                $set: { 'ffaStage4.$.user9': winner }
                            }, { new: true })
                            res.status(200).json({ success: true, data: update })
                        }
                        else if (user10Null) {
                            const update = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage4.user10': null }, {
                                $set: { 'ffaStage4.$.user10': winner }
                            }, { new: true })
                            res.status(200).json({ success: true, data: update })
                        }
                        else next({ name: 'MATCH_FAILED' })
                    }
                }
                else next({ name: 'MATCH_FAILED' })
            }
        }
        else next({ name: 'NOT_ACCESS' })
    }
}

module.exports = matchController