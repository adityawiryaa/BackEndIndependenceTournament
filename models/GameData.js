const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gameSchema = new Schema ({
    name : {type : String, required : "Name Game Required"},
    image : {type : String, required: "Image Required"}
})
module.exports = mongoose.model('Game',gameSchema)