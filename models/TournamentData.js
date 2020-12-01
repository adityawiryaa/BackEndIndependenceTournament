const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tournamentSchema = new Schema({
    name: { type: String, required: true },
    participant: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    createBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    maxuser: { type: Number, required: true },
    type: { type: String, required: true },
    prize: {
        first: { type: String, required: true },
        second: { type: String, required: true },
        third: { type: String, required: true }
    },
    age: { type: Number , default : 'all' },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
    start: { type: String, default: 'Date Not specified' },
    end: { type: String, default: 'Date Not specified' },
    rules: [],
    waitinglist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createAt: { type: String, default: (new Date()).toDateString() },
    stage1: [
        {
            _id: false,
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            score: { type: String, default: null }
        }
    ],
    stage2: [
        {
            _id: false,
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            score: { type: String, default: null }
        }
    ],
    stage3: [
        {
            _id: false,
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            score: { type: String, default: null }
        }
    ],
    stage4: [
        {
            _id: false,
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            score: { type: String, default: null }
        }
    ],
    stage5: [
        {
            _id: false,
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            score: { type: String, default: null }
        }
    ]
})

const dataTournament = mongoose.model('Tournament', tournamentSchema)
module.exports = dataTournament