const Tournament = require('../models/TournamentData')
const User = require('../models/UserData')
const Address = require('../models/AdressData')

class matchController {
    static async match1(req, res, next) {
        const { user1, user2, score1, score2, matchID } = req.body
        const { urlID } = req.params
        const tournament = await Tournament.findOne({ url: urlID })
        const stage2User1 = tournament.stage2.find(element => element.user1 == user1 || element.user2 == user1);
        const stage2User2 = tournament.stage2.find(element => element.user1 == user2 || element.user2 == user2);
        const stage2Null = await tournament.stage2.find(element => element.user1 == null || element.user2 == null)
        const bronze = await tournament.bronzeMatch.find(element => element)
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
        const stage3User1 = tournament.stage3.find(element => element.user1 == user1 || element.user2 == user1);
        const stage3User2 = tournament.stage3.find(element => element.user1 == user2 || element.user2 == user2);
        const stage3Null = await tournament.stage3.find(element => element.user1 == null || element.user2 == null)
        const bronze = await tournament.bronzeMatch.find(element => element)
        const champion = await tournament.winner.find(element => element)

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
                                    { $set: { "winner.$.first": user1, "winner.$.second": user2,  } }
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
                                    { $set: { "winner.$.first": user2, "winner.$.second": user1,  } }
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
        const stage4User1 = tournament.stage4.find(element => element.user1 == user1 || element.user2 == user1);
        const stage4User2 = tournament.stage4.find(element => element.user1 == user2 || element.user2 == user2);
        const stage4Null = await tournament.stage4.find(element => element.user1 == null || element.user2 == null)
        const bronze = await tournament.bronzeMatch.find(element => element)
        const champion = tournament.winner.find(element => element);

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
                                    { $set: { "winner.$.first": user1, "winner.$.second": user2,  }, }
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
                                    { $set: { "winner.$.first": user2, "winner.$.second": user1,  }, }
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
        const stage5User1 = tournament.stage5.find(element => element.user1 == user1 || element.user2 == user1);
        const stage5User2 = tournament.stage5.find(element => element.user1 == user2 || element.user2 == user2);
        const stage5Null = await tournament.stage5.find(element => element.user1 == null || element.user2 == null)
        const bronze = await tournament.bronzeMatch.find(element => element)
        const champion = tournament.winner.find(element => element);

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
                                    { $set: { "winner.$.first": user1, "winner.$.second": user2,  }, }
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
                                    { $set: { "winner.$.first": user2, "winner.$.second": user1,  }, }
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
    static async match5(req,res,next){
        const { user1, user2, score1, score2, matchID } = req.body
        const { urlID } = req.params
        const tournament = await Tournament.findOne({ url: urlID })
        const stage6User1 = tournament.stage6.find(element => element.user1 == user1 || element.user2 == user1);
        const stage6User2 = tournament.stage6.find(element => element.user1 == user2 || element.user2 == user2);
        const stage6Null = await tournament.stage6.find(element => element.user1 == null || element.user2 == null)
        const bronze = await tournament.bronzeMatch.find(element => element)
        const champion = tournament.winner.find(element => element);

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
                                    { $set: { "winner.$.first": user1, "winner.$.second": user2,  }, }
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
                                    { $set: { "winner.$.first": user2, "winner.$.second": user1,  }, }
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
    static async match6(req,res,next){
        const { user1, user2, score1, score2, matchID } = req.body
        const { urlID } = req.params
        const tournament = await Tournament.findOne({ url: urlID })
        const stage7User1 = tournament.stage7.find(element => element.user1 == user1 || element.user2 == user1);
        const stage7User2 = tournament.stage7.find(element => element.user1 == user2 || element.user2 == user2);
        const stage7Null = await tournament.stage7.find(element => element.user1 == null || element.user2 == null)
        const bronze = await tournament.bronzeMatch.find(element => element)
        const champion = tournament.winner.find(element => element);

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
                                    { $set: { "winner.$.first": user1, "winner.$.second": user2,  }, }
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
                                    { $set: { "winner.$.first": user2, "winner.$.second": user1,  }, }
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
    static async match7(req,res,next){
        
        const { user1, user2, score1, score2, matchID } = req.body
        const { urlID } = req.params
        const tournament = await Tournament.findOne({ url: urlID })
        const stage8User1 = tournament.stage8.find(element => element.user1 == user1 || element.user2 == user1);
        const stage8User2 = tournament.stage8.find(element => element.user1 == user2 || element.user2 == user2);
        const stage8Null = await tournament.stage8.find(element => element.user1 == null || element.user2 == null)
        const bronze = await tournament.bronzeMatch.find(element => element)
        const champion = tournament.winner.find(element => element);

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
                                    { $set: { "winner.$.first": user1, "winner.$.second": user2,  }, }
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
                                    { $set: { "winner.$.first": user2, "winner.$.second": user1,  }, }
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
        const champion = tournament.winner.find(element => element);
        const match = tournament.bronzeMatch.find(element => element._id == matchID)
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
}

module.exports = matchController