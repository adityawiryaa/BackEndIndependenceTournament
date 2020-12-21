const mongoose = require('mongoose');
const Schema = mongoose.Schema
const addressSchema = new Schema ({
    user : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    country : {type : String},
    province : {type: String},
    city : {type : String},
    district: {type : String},
    zip : {type : String},
})

module.exports = mongoose.model('AdressUser',addressSchema)