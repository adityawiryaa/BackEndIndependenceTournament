const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tournamentSchema = new Schema({
    name: { type: String, required: "Name Tournament Required" },
    participant: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    userNow : [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    createBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    maxuser: { type: Number, required: "Max User Required" },
    type: { type: String, required: "Type Tournament Required" },
    prize: {
        first: { type: String, required: "Prize First Required" },
        second: { type: String, required: "Prize Second Required" },
        third: { type: String, required: "Prize Third Required" }
    },
    age: { type: Number, default: 'all' },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: "Game Required" },
    start: { type: String, default: 'Date Not specified' },
    end: { type: String, default: 'Date Not specified' },
    rules: [],
    waitinglist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createAt: { type: String, default: (new Date()).toDateString() },
    stage1: [
        {
            user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
            score1: { type: String, default: null },
            user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
            score2: { type: String, default: null },
            match: { type: String, default: null }
        }
    ],
    stage2: [
        {
            user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
            score1: { type: String, default: null },
            user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
            score2: { type: String, default: null },
            match: { type: String, default: null }
        }
    ],
    stage3: [
        {
            user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
            score1: { type: String, default: null },
            user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
            score2: { type: String, default: null },
            match: { type: String, default: null }
        }
    ],
    stage4: [
        {
            user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
            score1: { type: String, default: null },
            user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
            score2: { type: String, default: null },
            match: { type: String, default: null }
        }
    ],
    stage5: [
        {
            user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
            score1: { type: String, default: null },
            user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
            score2: { type: String, default: null },
            match: { type: String, default: null }
        }
    ],
    bronzeMatch: [
        {
            user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
            score1: { type: String, default: null },
            user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
            score2: { type: String, default: null },
            match: { type: String, default: null }
        }
    ],
    winner: [
        {
            _id : false,
            first : { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
            second : { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
            third : { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        }
    ],
    status : []
})

const dataTournament = mongoose.model('Tournament', tournamentSchema)
module.exports = dataTournament