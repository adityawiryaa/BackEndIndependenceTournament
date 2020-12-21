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
                        if (tournament.stage1.length == 2) {
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
                        if (tournament.stage1.length == 2) {
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
                                await Tournament.findOneAndUpdate({ url: urlID }, { $addToSet: { status: 'Complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ url: urlID, 'winner.first': null, 'winner.second': null },
                                    { $set: { "winner.$.first": user1, "winner.$.second": user2, userNow: [] } }
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
                                await Tournament.findOneAndUpdate({ url: urlID }, { $addToSet: { status: 'Complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ url: urlID, 'winner.first': null, 'winner.second': null },
                                    { $set: { "winner.$.first": user2, "winner.$.second": user1, userNow: [] } }
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
                                await Tournament.findOneAndUpdate({ url: urlID }, { $addToSet: { status: 'Complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ url: urlID, 'winner.first': null, 'winner.second': null },
                                    { $set: { "winner.$.first": user1, "winner.$.second": user2, userNow: [] }, }
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
                                await Tournament.findOneAndUpdate({ url: urlID }, { $addToSet: { status: 'Complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ url: urlID, 'winner.first': null, 'winner.second': null },
                                    { $set: { "winner.$.first": user2, "winner.$.second": user1, userNow: [] }, }
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
                                await Tournament.findOneAndUpdate({ url: urlID }, { $addToSet: { status: 'Complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ url: urlID, 'winner.first': null, 'winner.second': null },
                                    { $set: { "winner.$.first": user1, "winner.$.second": user2, userNow: [] }, }
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
                                await Tournament.findOneAndUpdate({ url: urlID }, { $addToSet: { status: 'Complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ url: urlID, 'winner.first': null, 'winner.second': null },
                                    { $set: { "winner.$.first": user2, "winner.$.second": user1, userNow: [] }, }
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
    static async match1Ffa(req, res, next) {
        const { user1, user2, user3, user4, user5, score1, score2, score3, score4, score5, matchID } = req.body
        const { urlID } = req.params
        const tournament = await Tournament.findOne({ url: urlID })
        const stage1Match = await tournament.ffaStage1.find(element => element._id == matchID)
        const stage2User1 = await tournament.ffaStage2.find(element => element.user1)
        const stage2User2 = await tournament.ffaStage2.find(element => element.user2)
        const stage2User3 = await tournament.ffaStage2.find(element => element.user3)
        const stage2User4 = await tournament.ffaStage2.find(element => element.user4)
        try {
            if (tournament.createBy == req.userID) {
                if (!stage2User1 || !stage2User2 || !stage2User3 || !stage2User4) {
                    if (stage1Match) {
                        const updateMatch = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage1._id': matchID }, { $set: { 'ffaStage1.$.score1': score1, 'ffaStage1.$.score2': score2, 'ffaStage1.$.score3': score3, 'ffaStage1.$.score4': score4, 'ffaStage1.$.score5': score5 } }, { new: true })
                        const updateScore = await updateMatch.ffaStage1.find(element => element._id == matchID)
                        const user1Null = await Tournament.findOne({ url: urlID, 'ffaStage2.user1': null })
                        const user2Null = await Tournament.findOne({ url: urlID, 'ffaStage2.user2': null })
                        const user3Null = await Tournament.findOne({ url: urlID, 'ffaStage2.user3': null })
                        const user4Null = await Tournament.findOne({ url: urlID, 'ffaStage2.user4': null })
                        if (updateScore.score1 > updateScore.score2 && updateScore.score1 > updateScore.score3 && updateScore.score1 > updateScore.score4 && updateScore.score1 > updateScore.score5) {
                            if (user1Null) {
                                const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage2.user1': null }, { $set: { 'ffaStage2.$.user1': user1 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else if (user2Null) {
                                const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage2.user2': null }, { $set: { 'ffaStage2.$.user2': user1 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else if (user3Null) {
                                const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage2.user3': null }, { $set: { 'ffaStage2.$.user3': user1 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else if (user4Null) {
                                const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage2.user4': null }, { $set: { 'ffaStage2.$.user4': user1 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else next({ name: 'TOURNAMENT_FAILED' })
                        }
                        else if (updateScore.score2 > updateScore.score1 && updateScore.score2 > updateScore.score3 && updateScore.score2 > updateScore.score4 && updateScore.score2 > updateScore.score5) {
                            if (user1Null) {
                                const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage2.user1': null }, { $set: { 'ffaStage2.$.user1': user2 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else if (user2Null) {
                                const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage2.user2': null }, { $set: { 'ffaStage2.$.user2': user2 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else if (user3Null) {
                                const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage2.user3': null }, { $set: { 'ffaStage2.$.user3': user2 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else if (user4Null) {
                                const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage2.user4': null }, { $set: { 'ffaStage2.$.user4': user2 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else next({ name: 'TOURNAMENT_FAILED' })
                        }
                        else if (updateScore.score3 > updateScore.score1 && updateScore.score3 > updateScore.score2 && updateScore.score3 > updateScore.score4 && updateScore.score3 > updateScore.score5) {
                            if (user1Null) {
                                const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage2.user1': null }, { $set: { 'ffaStage2.$.user1': user3 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else if (user2Null) {
                                const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage2.user2': null }, { $set: { 'ffaStage2.$.user2': user3 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else if (user3Null) {
                                const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage2.user3': null }, { $set: { 'ffaStage2.$.user3': user3 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else if (user4Null) {
                                const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage2.user4': null }, { $set: { 'ffaStage2.$.user4': user3 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else next({ name: 'TOURNAMENT_FAILED' })

                        }
                        else if (updateScore.score4 > updateScore.score1 && updateScore.score4 > updateScore.score2 && updateScore.score4 > updateScore.score3 && updateScore.score4 > updateScore.score5) {
                            if (user1Null) {
                                const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage2.user1': null }, { $set: { 'ffaStage2.$.user1': user4 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else if (user2Null) {
                                const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage2.user2': null }, { $set: { 'ffaStage2.$.user2': user4 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else if (user3Null) {
                                const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage2.user3': null }, { $set: { 'ffaStage2.$.user3': user4 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else if (user4Null) {
                                const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage2.user4': null }, { $set: { 'ffaStage2.$.user4': user4 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else next({ name: 'TOURNAMENT_FAILED' })
                        }
                        else if (updateScore.score5 > updateScore.score1 && updateScore.score5 > updateScore.score2 && updateScore.score5 > updateScore.score3 && updateScore.score5 > updateScore.score4) {
                            if (user1Null) {
                                const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage2.user1': null }, { $set: { 'ffaStage2.$.user1': user5 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else if (user2Null) {
                                const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage2.user2': null }, { $set: { 'ffaStage2.$.user2': user5 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else if (user3Null) {
                                const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage2.user3': null }, { $set: { 'ffaStage2.$.user3': user5 } }, { new: true })
                                res.status(200).json({ success: true, data: bracket })
                            }
                            else if (user4Null) {
                                const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage2.user4': null }, { $set: { 'ffaStage2.$.user4': user5 } }, { new: true })
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
        const { urlID } = req.params
        const tournament = await Tournament.findOne({ url: urlID })
        const champion = await tournament.winner.find(element => element)
        const stage2Match = await tournament.ffaStage2.find(element => element._id == matchID)
        const stage3User1 = await tournament.ffaStage3.find(element => element.user1)
        const stage3User2 = await tournament.ffaStage3.find(element => element.user2)
        const stage3User3 = await tournament.ffaStage3.find(element => element.user3)
        const stage3User4 = await tournament.ffaStage3.find(element => element.user4)
        try {
            if (tournament.createBy == req.userID) {
                if (!stage3User1 && !stage3User2 && !stage3User3 && !stage3User4 && champion.first == null) {
                    if (stage2Match) {
                        const updateMatch = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage2._id': matchID }, { $set: { 'ffaStage2.$.score1': score1, 'ffaStage2.$.score2': score2, 'ffaStage2.$.score3': score3, 'ffaStage2.$.score4': score4 } }, { new: true })
                        const updateScore = await updateMatch.ffaStage2.find(element => element._id == matchID)
                        if (updateMatch.ffaStage2.length == 1) {
                            if (updateScore.score1 > updateScore.score2 && updateScore.score1 > updateScore.score3 && updateScore.score1 > updateScore.score4 && updateScore.score1) {
                                await Tournament.findOneAndUpdate({ url: urlID }, { $addToSet: { status: 'Complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ url: urlID, 'winner.first': null },
                                    { $set: { "winner.$.first": user1, userNow: [] }, }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            } else if (updateScore.score2 > updateScore.score1 && updateScore.score2 > updateScore.score3 && updateScore.score2 > updateScore.score4 && updateScore.score2) {
                                await Tournament.findOneAndUpdate({ url: urlID }, { $addToSet: { status: 'Complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ url: urlID, 'winner.first': null },
                                    { $set: { "winner.$.first": user2, userNow: [] }, }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            } else if (updateScore.score3 > updateScore.score1 && updateScore.score3 > updateScore.score2 && updateScore.score3 > updateScore.score4 && updateScore.score3) {
                                await Tournament.findOneAndUpdate({ url: urlID }, { $addToSet: { status: 'Complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ url: urlID, 'winner.first': null },
                                    { $set: { "winner.$.first": user3, userNow: [] }, }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            }
                            else if (updateScore.score4 > updateScore.score1 && updateScore.score4 > updateScore.score2 && updateScore.score4 > updateScore.score3 && updateScore.score4) {
                                await Tournament.findOneAndUpdate({ url: urlID }, { $addToSet: { status: 'Complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ url: urlID, 'winner.first': null },
                                    { $set: { "winner.$.first": user4, userNow: [] }, }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            }
                            else next({ name: 'MATCH_FAILED' })
                        }
                        else {
                            const user1Null = await Tournament.findOne({ url: urlID, 'ffaStage3.user1': null })
                            const user2Null = await Tournament.findOne({ url: urlID, 'ffaStage3.user2': null })
                            const user3Null = await Tournament.findOne({ url: urlID, 'ffaStage3.user3': null })
                            const user4Null = await Tournament.findOne({ url: urlID, 'ffaStage3.user4': null })
                            if (updateScore.score1 > updateScore.score2 && updateScore.score1 > updateScore.score3 && updateScore.score1 > updateScore.score4 && updateScore.score1) {
                                if (user1Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage3.user1': null }, { $set: { 'ffaStage3.$.user1': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user2Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage3.user2': null }, { $set: { 'ffaStage3.$.user2': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user3Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage3.user3': null }, { $set: { 'ffaStage3.$.user3': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user4Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage3.user4': null }, { $set: { 'ffaStage3.$.user4': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else next({ name: 'TOURNAMENT_FAILED' })
                            }
                            else if (updateScore.score2 > updateScore.score1 && updateScore.score2 > updateScore.score3 && updateScore.score2 > updateScore.score4 && updateScore.score2) {
                                if (user1Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage3.user1': null }, { $set: { 'ffaStage3.$.user1': user2 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user2Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage3.user2': null }, { $set: { 'ffaStage3.$.user2': user2 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user3Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage3.user3': null }, { $set: { 'ffaStage3.$.user3': user2 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user4Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage3.user4': null }, { $set: { 'ffaStage3.$.user4': user2 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else next({ name: 'TOURNAMENT_FAILED' })
                            }
                            else if (updateScore.score3 > updateScore.score1 && updateScore.score3 > updateScore.score2 && updateScore.score3 > updateScore.score4 && updateScore.score3) {
                                if (user1Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage3.user1': null }, { $set: { 'ffaStage3.$.user1': user3 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user2Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage3.user2': null }, { $set: { 'ffaStage3.$.user2': user3 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user3Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage3.user3': null }, { $set: { 'ffaStage3.$.user3': user3 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user4Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage3.user4': null }, { $set: { 'ffaStage3.$.user4': user3 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else next({ name: 'TOURNAMENT_FAILED' })

                            }
                            else if (updateScore.score4 > updateScore.score1 && updateScore.score4 > updateScore.score2 && updateScore.score4 > updateScore.score3 && updateScore.score4) {
                                if (user1Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage3.user1': null }, { $set: { 'ffaStage3.$.user1': user4 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user2Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage3.user2': null }, { $set: { 'ffaStage3.$.user2': user4 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user3Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage3.user3': null }, { $set: { 'ffaStage3.$.user3': user4 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user4Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage3.user4': null }, { $set: { 'ffaStage3.$.user4': user4 } }, { new: true })
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
        const { urlID } = req.params
        const tournament = await Tournament.findOne({ url: urlID })
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
                        const updateMatch = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage3._id': matchID }, { $set: { 'ffaStage3.$.score1': score1, 'ffaStage3.$.score2': score2, 'ffaStage3.$.score3': score3, 'ffaStage3.$.score4': score4 } }, { new: true })
                        const updateScore = await updateMatch.ffaStage2.find(element => element._id == matchID)
                        if (updateMatch.ffaStage3.length == 1) {
                            if (updateScore.score1 > updateScore.score2 && updateScore.score1 > updateScore.score3 && updateScore.score1 > updateScore.score4 && updateScore.score1) {
                                await Tournament.findOneAndUpdate({ url: urlID }, { $addToSet: { status: 'Complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ url: urlID, 'winner.first': null },
                                    { $set: { "winner.$.first": user1, userNow: [] }, }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            } else if (updateScore.score2 > updateScore.score1 && updateScore.score2 > updateScore.score3 && updateScore.score2 > updateScore.score4 && updateScore.score2) {
                                await Tournament.findOneAndUpdate({ url: urlID }, { $addToSet: { status: 'Complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ url: urlID, 'winner.first': null },
                                    { $set: { "winner.$.first": user2, userNow: [] }, }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            } else if (updateScore.score3 > updateScore.score1 && updateScore.score3 > updateScore.score2 && updateScore.score3 > updateScore.score4 && updateScore.score3) {
                                await Tournament.findOneAndUpdate({ url: urlID }, { $addToSet: { status: 'Complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ url: urlID, 'winner.first': null },
                                    { $set: { "winner.$.first": user3, userNow: [] }, }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            }
                            else if (updateScore.score4 > updateScore.score1 && updateScore.score4 > updateScore.score2 && updateScore.score4 > updateScore.score3 && updateScore.score4) {
                                await Tournament.findOneAndUpdate({ url: urlID }, { $addToSet: { status: 'Complete' } }, { new: true })
                                const final = await Tournament.findOneAndUpdate({ url: urlID, 'winner.first': null },
                                    { $set: { "winner.$.first": user4, userNow: [] }, }
                                    , { new: true })
                                res.status(200).json({ success: true, data: final })
                            }
                            else next({ name: 'MATCH_FAILED' })
                        }
                        else {
                            const user1Null = await Tournament.findOne({ url: urlID, 'ffaStage4.user1': null })
                            const user2Null = await Tournament.findOne({ url: urlID, 'ffaStage4.user2': null })
                            const user3Null = await Tournament.findOne({ url: urlID, 'ffaStage4.user3': null })
                            const user4Null = await Tournament.findOne({ url: urlID, 'ffaStage4.user4': null })
                            if (updateScore.score1 > updateScore.score2 && updateScore.score1 > updateScore.score3 && updateScore.score1 > updateScore.score4 && updateScore.score1) {
                                if (user1Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage4.user1': null }, { $set: { 'ffaStage4.$.user1': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user2Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage4.user2': null }, { $set: { 'ffaStage4.$.user2': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user3Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage4.user3': null }, { $set: { 'ffaStage4.$.user3': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user4Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage4.user4': null }, { $set: { 'ffaStage4.$.user4': user1 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else next({ name: 'TOURNAMENT_FAILED' })
                            }
                            else if (updateScore.score2 > updateScore.score1 && updateScore.score2 > updateScore.score3 && updateScore.score2 > updateScore.score4 && updateScore.score2) {
                                if (user1Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage4.user1': null }, { $set: { 'ffaStage4.$.user1': user2 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user2Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage4.user2': null }, { $set: { 'ffaStage4.$.user2': user2 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user3Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage4.user3': null }, { $set: { 'ffaStage4.$.user3': user2 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user4Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage4.user4': null }, { $set: { 'ffaStage4.$.user4': user2 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else next({ name: 'TOURNAMENT_FAILED' })
                            }
                            else if (updateScore.score3 > updateScore.score1 && updateScore.score3 > updateScore.score2 && updateScore.score3 > updateScore.score4 && updateScore.score3) {
                                if (user1Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage4.user1': null }, { $set: { 'ffaStage4.$.user1': user3 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user2Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage4.user2': null }, { $set: { 'ffaStage4.$.user2': user3 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user3Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage4.user3': null }, { $set: { 'ffaStage4.$.user3': user3 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user4Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage4.user4': null }, { $set: { 'ffaStage4.$.user4': user3 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else next({ name: 'TOURNAMENT_FAILED' })

                            }
                            else if (updateScore.score4 > updateScore.score1 && updateScore.score4 > updateScore.score2 && updateScore.score4 > updateScore.score3 && updateScore.score4) {
                                if (user1Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage4.user1': null }, { $set: { 'ffaStage4.$.user1': user4 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user2Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage4.user2': null }, { $set: { 'ffaStage4.$.user2': user4 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user3Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage4.user3': null }, { $set: { 'ffaStage4.$.user3': user4 } }, { new: true })
                                    res.status(200).json({ success: true, data: bracket })
                                }
                                else if (user4Null) {
                                    const bracket = await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage4.user4': null }, { $set: { 'ffaStage4.$.user4': user4 } }, { new: true })
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

module.exports = matchController