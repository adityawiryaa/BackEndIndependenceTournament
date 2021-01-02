const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tournamentSchema = new Schema({
    name: { type: String, required: "Name Tournament Required" },
    participant: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    ],
    team: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    ],
    url : {type : String,required :  "Url Tournament Required" },
    format : {type : String, required : 'Format Required'},
    district : {type : String},
    createBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    headman : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    maxuser: { type: Number, required: "Max User Required" },
    type: { type: String, required: "Type Tournament Required" },
    prize: {
        first: { type: String, required: "Prize First Required" },
        second: { type: String },
        third: { type: String}
    },
    age: { type: Number, default: 'all' },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: "Game Required"},
    start: { type: String, default: 'Date Not specified' },
    end: { type: String, default: 'Date Not specified' },
    rules: [],  
    waitinglist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createAt: { type: String, default: (new Date()).toDateString() },
    stage1: [
        {
            user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, autopopulate: true },
            score1: { type: Number, default: null },
            user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, autopopulate: true },
            score2: { type: Number, default: null },
            match: { type: String, default: null },
        }
    ],
    stage2: [
        {
            user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, autopopulate: true },
            score1: { type: Number, default: null },
            user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, autopopulate: true },
            score2: { type: Number, default: null },
            match: { type: String, default: null }
        }
    ],
    stage3: [
        {
            user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, autopopulate: true },
            score1: { type: Number, default: null },
            user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, autopopulate: true },
            score2: { type: Number, default: null },
            match: { type: String, default: null }
        }
    ],
    stage4: [
        {
            user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, autopopulate: true },
            score1: { type: Number, default: null },
            user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, autopopulate: true },
            score2: { type: Number, default: null },
            match: { type: String, default: null }
        }
    ],
    stage5: [
        {
            user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, autopopulate: true },
            score1: { type: Number, default: null },
            user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, autopopulate: true },
            score2: { type: Number, default: null },
            match: { type: String, default: null }
        }
    ],
    stage6: [
        {
            user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, autopopulate: true },
            score1: { type: Number, default: null },
            user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, autopopulate: true },
            score2: { type: Number, default: null },
            match: { type: String, default: null }
        }
    ],
    stage7: [
        {
            user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, autopopulate: true },
            score1: { type: Number, default: null },
            user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, autopopulate: true },
            score2: { type: Number, default: null },
            match: { type: String, default: null }
        }
    ],
    stage8: [
        {
            user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, autopopulate: true },
            score1: { type: Number, default: null },
            user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, autopopulate: true },
            score2: { type: Number, default: null },
            match: { type: String, default: null }
        }
    ],
    bronzeMatch: [
        {
            user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, autopopulate: true },
            score1: { type: Number, default: null },
            user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, autopopulate: true },
            score2: { type: Number, default: null },
            match: { type: String, default: null }
        }
    ],
    winner: [
        {
            _id: false,
            first: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
            second: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
            third: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        }
    ],
    ffaStage1: [
        {
        user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true},
        user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User',autopopulate: true },
        user3: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true},
        user4: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true },
        user5: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true},
        user6: { type: mongoose.Schema.Types.ObjectId, ref: 'User',autopopulate: true },
        user7: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true},
        user8: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true },
        user9: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true},
        user10: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true },
        }
    ],
    ffaStage2: [{
        user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true},
        user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User',autopopulate: true },
        user3: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true},
        user4: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true },
        user5: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true},
        user6: { type: mongoose.Schema.Types.ObjectId, ref: 'User',autopopulate: true },
        user7: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true},
        user8: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true },
        user9: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true},
        user10: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true },
    }],
    ffaStage3: [{
        user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true},
        user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User',autopopulate: true },
        user3: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true},
        user4: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true },
        user5: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true},
        user6: { type: mongoose.Schema.Types.ObjectId, ref: 'User',autopopulate: true },
        user7: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true},
        user8: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true },
        user9: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true},
        user10: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true },
    }],

    status: String
})

tournamentSchema.plugin(require('mongoose-autopopulate'));
const dataTournament = mongoose.model('Tournament', tournamentSchema)
module.exports = dataTournament