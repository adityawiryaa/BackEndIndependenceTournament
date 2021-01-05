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
                    format: req.body.format,
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
                    status: 'open'
                })
                if (req.body.maxuser >= 4 && req.body.maxuser <= 100 && req.body.type == 'single elimination') {
                    const s1 = []
                    const s2 = []
                    const s3 = []
                    const s4 = []
                    const s5 = []
                    const s6 = []
                    const sisa = []
                    if (req.body.maxuser > 4 && req.body.maxuser < 8) {
                        for (let z = 1; z <= req.body.maxuser % 4; z++) {
                            sisa.push({ match: z })
                        }
                        for (let a = 2; a <= 4; a = a + 2) {
                            s1.push({ match: a })
                        }
                        for (let b = 4; b <= 4; b = b + 4) {
                            s2.push({ match: b })
                        }
                    }
                    else if (req.body.maxuser > 8 && req.body.maxuser < 16) {
                        for (let z = 1; z <= req.body.maxuser % 8; z++) {
                            sisa.push({ match: z })
                        }
                        for (let a = 2; a <= 8; a = a + 2) {
                            s1.push({ match: a })
                        }
                        for (let b = 4; b <= 8; b = b + 4) {
                            s2.push({ match: b })
                        }
                        for (let c = 8; c <= 8; c = c + 8) {
                            s3.push({ match: c })
                        }
                    }
                    else if (req.body.maxuser > 16 && req.body.maxuser < 32) {
                        for (let z = 1; z <= req.body.maxuser % 16; z++) {
                            sisa.push({ match: z })
                        }
                        for (let a = 2; a <= 16; a = a + 2) {
                            s1.push({ match: a })
                        }
                        for (let b = 4; b <= 16; b = b + 4) {
                            s2.push({ match: b })
                        }
                        for (let c = 8; c <= 16; c = c + 8) {
                            s3.push({ match: c })
                        }
                        for (let d = 16; d <= 16; d = d + 16) {
                            s4.push({ match: d })
                        }
                    }
                    else if (req.body.maxuser > 32 && req.body.maxuser < 64) {
                        for (let z = 1; z <= req.body.maxuser % 32; z++) {
                            sisa.push({ match: z })
                        }
                        for (let a = 2; a <= 32; a = a + 2) {
                            s1.push({ match: a })
                        }
                        for (let b = 4; b <= 32; b = b + 4) {
                            s2.push({ match: b })
                        }
                        for (let c = 8; c <= 32; c = c + 8) {
                            s3.push({ match: c })
                        }
                        for (let d = 16; d <= 32; d = d + 16) {
                            s4.push({ match: d })
                        }
                        for (let e = 32; e <= 32; e = e + 32) {
                            s5.push({ match: e })
                        }
                    }
                    else if (req.body.maxuser > 64 && req.body.maxuser < 101) {
                        for (let z = 1; z <= req.body.maxuser % 64; z++) {
                            sisa.push({ match: z })
                        }
                        for (let a = 2; a <= 64; a = a + 2) {
                            s1.push({ match: a })
                        }
                        for (let b = 4; b <= 64; b = b + 4) {
                            s2.push({ match: b })
                        }
                        for (let c = 8; c <= 64; c = c + 8) {
                            s3.push({ match: c })
                        }
                        for (let d = 16; d <= 64; d = d + 16) {
                            s4.push({ match: d })
                        }
                        for (let e = 32; e <= 64; e = e + 32) {
                            s5.push({ match: e })
                        }
                        for (let f = 64; f <= 64; f = f + 64) {
                            s6.push({ match: f })
                        }
                    }
                    if (req.body.maxuser == 4 || req.body.maxuser == 8 || req.body.maxuser == 16 || req.body.maxuser == 32 || req.body.maxuser == 64) {
                        await tournament.save()
                        if (req.body.maxuser == 4) {
                            for (let a = 2; a <= 4; a = a + 2) {
                                s1.push({ match: a })
                            }
                            for (let b = 4; b <= 4; b = b + 4) {
                                s2.push({ match: b })
                            }
                        }
                        else if (req.body.maxuser == 8) {
                            for (let a = 2; a <= 8; a = a + 2) {
                                s1.push({ match: a })
                            }
                            for (let b = 4; b <= 8; b = b + 4) {
                                s2.push({ match: b })
                            }
                            for (let c = 8; c <= 8; c = c + 8) {
                                s3.push({ match: c })
                            }
                        }
                        else if (req.body.maxuser == 16) {
                            for (let a = 2; a <= 16; a = a + 2) {
                                s1.push({ match: a })
                            }
                            for (let b = 4; b <= 16; b = b + 4) {
                                s2.push({ match: b })
                            }
                            for (let c = 8; c <= 16; c = c + 8) {
                                s3.push({ match: c })
                            }
                            for (let d = 16; d <= 16; d = d + 16) {
                                s4.push({ match: d })
                            }
                        }
                        else if (req.body.maxuser == 32) {
                            for (let a = 2; a <= 32; a = a + 2) {
                                s1.push({ match: a })
                            }
                            for (let b = 4; b <= 32; b = b + 4) {
                                s2.push({ match: b })
                            }
                            for (let c = 8; c <= 32; c = c + 8) {
                                s3.push({ match: c })
                            }
                            for (let d = 16; d <= 32; d = d + 16) {
                                s4.push({ match: d })
                            }
                            for (let e = 32; e <= 32; e = e + 32) {
                                s5.push({ match: e })
                            }
                        }
                        else if (req.body.maxuser == 64) {
                            for (let a = 2; a <= 64; a = a + 2) {
                                s1.push({ match: a })
                            }
                            for (let b = 4; b <= 64; b = b + 4) {
                                s2.push({ match: b })
                            }
                            for (let c = 8; c <= 64; c = c + 8) {
                                s3.push({ match: c })
                            }
                            for (let d = 16; d <= 64; d = d + 16) {
                                s4.push({ match: d })
                            }
                            for (let e = 32; e <= 64; e = e + 32) {
                                s5.push({ match: e })
                            }
                            for (let f = 64; f <= 64; f = f + 64) {
                                s6.push({ match: f })
                            }
                        }
                        const generateBracket = await Tournament.findOneAndUpdate({ name: req.body.name }, {
                            $push: {
                                stage1: s1,
                                stage2: s2,
                                stage3: s3,
                                stage4: s4,
                                stage5: s5,
                                stage6: s6,
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
                    else {
                        await tournament.save()
                        const generateBracket = await Tournament.findOneAndUpdate({ name: req.body.name }, {
                            $push: {
                                stage1: sisa,
                                stage2: s1,
                                stage3: s2,
                                stage4: s3,
                                stage5: s4,
                                stage6: s5,
                                stage7: s6,
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

                }
                else if (req.body.maxuser >= 4 && req.body.maxuser <= 100 && req.body.type == 'free for all') {
                    if (req.body.group == null || req.body.group == '' || req.body.group > 10) next({ name: 'GROUP_REQUIRED' })
                    else {
                        await tournament.save()
                        const userByGroup = {}
                        const ffa1 = []
                        const ffa2 = []
                        const ffa3 = []
                        const sisa1 = {}
                        const sisa2 = {}
                        for (let i = 1; i <= req.body.group; i++) {
                            userByGroup['user' + i] = null;
                        }
                        if (req.body.maxuser % req.body.group == 0) {
                            for (let a = 1; a <= req.body.maxuser / req.body.group; a++) {
                                ffa1.push(userByGroup)
                            }
                        }
                        else {
                            for (let a = 1; a <= req.body.maxuser % req.body.group; a++) {
                                sisa1['user' + a] = null
                            }
                            for (let a = 1; a <= req.body.maxuser / req.body.group; a++) {
                                ffa1.push(userByGroup)
                            }
                            ffa1.push(sisa1)
                        }
                        // s2
                        if (ffa1.length % req.body.group == 0) {
                            if (ffa1.length == req.body.group) {
                                ffa2.push(userByGroup)
                            }
                            else {
                                for (let b = 1; b <= ffa1.length / req.body.group; b++) {
                                    ffa2.push(userByGroup)
                                }
                            }
                        }
                        else {
                            if (ffa1.length % req.body.group != 0) {
                                for (let x = 1; x <= ffa1.length % req.body.group; x++) {
                                    sisa2['user' + x] = null
                                }
                                for (let b = 1; b <= ffa1.length / req.body.group; b++) {
                                    ffa2.push(userByGroup)
                                }
                                ffa2.push(sisa2)
                            }
                        }
                        // s3
                        if (ffa2.length >= 2) {
                            ffa3.push(userByGroup)
                        }
                        const generateBracket = await Tournament.findOneAndUpdate({ name: req.body.name }, {
                            $push: {
                                ffaStage1: ffa1,
                                ffaStage2: ffa2,
                                ffaStage3: ffa3,
                                winner: {
                                    $each: [{}]
                                }
                            }
                        }, { new: true })
                        res.status(201).json({ success: true, data: generateBracket })
                    }
                }
                else next({ name: 'TOURNAMENT_INCORRECT' })
            }
        }
        catch { next({ name: 'REQUIRED' }) }
    }
    static async tournamentBaseOnHeadman(req, res, next) {
        try {
            const tournament = await Tournament.find({ headman: req.userID },{},{ autopopulate: false })
            res.status(200).json({ success: true, data: tournament })
        }
        catch { next({ name: "TOURNAMENT_FAILED" }) }
    }
    static async tournamentByCommitte(req, res, next) {
        try {
            const tournament = await Tournament.find({ createBy: req.userID },{},{ autopopulate: false })
            res.status(200).json({ success: true, data: tournament })
        }
        catch { next({ name: "TOURNAMENT_FAILED" }) }
    }
    static async myTournament(req, res, next) {
        try {
            const tournament = await Tournament.find({ $or: [{ participant: req.userID }, { team: req.userID }] },{},{ autopopulate: false })
            res.status(200).json({ success: true, data: tournament })
        }
        catch { next({ name: "TOURNAMENT_FAILED" }) }
    }
    static async listTournament(req, res, next) {
        try {
            const tournament = await Tournament.find({}, {}, { autopopulate: false })
                .populate('game')
            res.status(200).json({ success: true, data: tournament })
        }
        catch { next({ name: 'TOURNAMENT_FAILED' }) }
    }
    static async detailTournament(req, res, next) {
        const { urlID } = req.params
        try {
            const tournament = await Tournament.findOne({ url: urlID })
                .populate('participant').populate('waitinglist').populate('winner.first').populate('winner.second').populate('winner.third').populate('game').populate('team')
            res.status(200).json({ success: true, data: tournament })
        }
        catch { next({ name: 'TOURNAMENT_FAILED' }) }
    }
    static async updateTournament(req, res, next) {
        const { urlID } = req.params
        const dataTournament = Tournament.findOne({ createBy: req.userID, url: urlID },{},{autopopulate : false})
        try {
            if (dataTournament) {
                const tournament = await Tournament.findOneAndUpdate({ url: urlID },
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
        const tournament = await Tournament.findOne({ url: urlID },{},{autopopulate : false})
        const idCommitte = tournament.createBy
        const committeData = await User.findById(idCommitte)
        const userTournamentExist = await Tournament.findOne({ $or: [{ team: req.userID }, { participant: req.userID }, { waitinglist: req.userID }] },{},{autopopulate : false})
        const totalWaiting = tournament.participant.length + tournament.waitinglist.length
        try {
            if (user.age >= tournament.age || tournament.age == '' || tournament.age == null || tournament.age == 0) {
                if (totalWaiting != tournament.maxuser && tournament.participant.length != tournament.maxuser) {
                    if (user.role == 'user') {
                        if (userTournamentExist) next({ name: 'USER_EXIST' })
                        else {
                            await User.findOneAndUpdate({ _id: idCommitte },
                                {
                                    $push: {
                                        notification: {
                                            $each: [{ 'notif': `${user.username} was register in tournament ${tournament.url}`, "time": new Date().toLocaleString(), }]
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
        const tournament = await Tournament.findOne({ url: urlID },{},{autopopulate : false})
        const idCommitte = tournament.createBy
        const committeData = await User.findById(idCommitte)
        const userTournamentExist = await Tournament.findOne({ $or: [{ team: req.userID }, { participant: req.userID }, { waitinglist: req.userID }] },{},{autopopulate : false})
        const totalWaiting = tournament.participant.length + tournament.waitinglist.length
        try {
            if (user.age >= tournament.age || tournament.age == '' || tournament.age == null || tournament.age == 0) {
                if (totalWaiting != tournament.maxuser && tournament.participant.length != tournament.maxuser) {
                    if (user.role == 'user') {
                        if (userTournamentExist) next({ name: 'USER_EXIST' })
                        else {
                            if (user.team.name == null) {
                                await User.findByIdAndUpdate(req.userID,
                                    { $set: { 'team.name': name, 'team.phone': phone, 'team.member1': member1, 'team.member2': member2} },
                                    { new: true })
                                await User.findOneAndUpdate({ _id: idCommitte },
                                    {
                                        $push: {
                                            notification: {
                                                $each: [{ 'notif': `${name} was register in tournament ${tournament.url}`, "time": new Date().toLocaleString(), }]
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
                                await User.findOneAndUpdate({ _id: idCommitte },
                                    {
                                        $push: {
                                            notification: {
                                                $each: [{ 'notif': `${user.team.name} was register in tournament ${tournament.url}`, "time": new Date().toLocaleString(), }]
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
                    const s2User1 = await Tournament.findOne({ url: urlID, 'stage2.user1': null })
                    const s2User2 = await Tournament.findOne({ url: urlID, 'stage2.user2': null })
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
                    else {
                        if (s2User1) {
                            await Tournament.findOneAndUpdate({ url: urlID, 'stage2.user1': null },
                                {
                                    $set: { "stage2.$.user1": req.body.user }
                                }, { new: true })
                        }
                        else if (s2User2) {
                            await Tournament.findOneAndUpdate({ url: urlID, 'stage2.user2': null },
                                {
                                    $set: { "stage2.$.user1": req.body.user }
                                }, { new: true })
                        }
                    }
                    await User.findOneAndUpdate({ _id: req.body.user },
                        {
                            $push: {
                                notification: {
                                    $each: [{ 'notif': `You was accept in tournament ${tournament.name} ,Good Luck!`, "time": new Date().toLocaleString(), }]
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

                    if (tournament.format == 'team') {
                        const dataTournament = await Tournament.findOneAndUpdate({ url: urlID },
                            { $pull: { waitinglist: req.body.user }, $addToSet: { team: req.body.user } },
                            { new: true }
                        )
                        res.status(200).json({ success: true, data: dataTournament })
                    }
                    else if (tournament.format == 'individual') {
                        const dataTournament = await Tournament.findOneAndUpdate({ url: urlID },
                            { $pull: { waitinglist: req.body.user }, $addToSet: { participant: req.body.user } },
                            { new: true }
                        )
                        res.status(200).json({ success: true, data: dataTournament })
                    }
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
                    const user6Update = await Tournament.findOne({ url: urlID, 'ffaStage1.user6': null })
                    const user7Update = await Tournament.findOne({ url: urlID, 'ffaStage1.user7': null })
                    const user8Update = await Tournament.findOne({ url: urlID, 'ffaStage1.user8': null })
                    const user9Update = await Tournament.findOne({ url: urlID, 'ffaStage1.user9': null })
                    const user10Update = await Tournament.findOne({ url: urlID, 'ffaStage1.user10': null })
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
                    else if (user6Update) {
                        await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage1.user6': null },
                            {
                                $set: { "ffaStage1.$.user6": req.body.user }
                            }, { new: true })
                    }
                    else if (user7Update) {
                        await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage1.user7': null },
                            {
                                $set: { "ffaStage1.$.user7": req.body.user }
                            }, { new: true })
                    }
                    else if (user8Update) {
                        await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage1.user8': null },
                            {
                                $set: { "ffaStage1.$.user8": req.body.user }
                            }, { new: true })
                    }
                    else if (user9Update) {
                        await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage1.user9': null },
                            {
                                $set: { "ffaStage1.$.user9": req.body.user }
                            }, { new: true })
                    }
                    else if (user10Update) {
                        await Tournament.findOneAndUpdate({ url: urlID, 'ffaStage1.user10': null },
                            {
                                $set: { "ffaStage1.$.user10": req.body.user }
                            }, { new: true })
                    }
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
                    if (tournament.format == 'team') {
                        const dataTournament = await Tournament.findOneAndUpdate({ url: urlID },
                            { $pull: { waitinglist: req.body.user }, $addToSet: { team: req.body.user } },
                            { new: true }
                        )
                        res.status(200).json({ success: true, data: dataTournament })
                    }
                    else if (tournament.format == 'individual') {
                        const dataTournament = await Tournament.findOneAndUpdate({ url: urlID },
                            { $pull: { waitinglist: req.body.user }, $addToSet: { participant: req.body.user } },
                            { new: true }
                        )
                        res.status(200).json({ success: true, data: dataTournament })
                    }
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
                const matchStage5 = tournament.stage5.find(elem => elem._id == matchID)
                const matchStage6 = tournament.stage6.find(elem => elem._id == matchID)
                const matchStage7 = tournament.stage7.find(elem => elem._id == matchID)
                const bronzeMatch = tournament.bronzeMatch.find(elem => elem._id == matchID)
                if (matchStage1) res.status(200).json({ success: true, data: matchStage1 })
                else if (matchStage2) res.status(200).json({ success: true, data: matchStage2 })
                else if (matchStage3) res.status(200).json({ success: true, data: matchStage3 })
                else if (matchStage4) res.status(200).json({ success: true, data: matchStage4 })
                else if (matchStage5) res.status(200).json({ success: true, data: matchStage5 })
                else if (matchStage6) res.status(200).json({ success: true, data: matchStage6 })
                else if (matchStage7) res.status(200).json({ success: true, data: matchStage7 })
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