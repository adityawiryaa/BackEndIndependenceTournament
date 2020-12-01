const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email : { 
        type : String,
        required : true,
        unique : true,match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password : {
        type : String,
        required : true,
        minlength: 6,
    },
    username : {
        type : String,
        required : true,
        minLength : 3
    },
    phone : {
        type : String,
        required : true,
        unique : true,
        validate : [/^(^\+62\s?|^0)(\d{3,4}-?){2}\d{3,4}$/, 'please fill valid phone']
    },
    role : {
        type : String,
        default : 'user'
    },
    createBy : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    age : {
        type : Number,
        required : true
    },
    fullname : {
        type : String,
        default : null
    },
    notification : [
        {
            _id : false,
            notif : String,
            time : String
        }
    ]

})

const DataUser = mongoose.model('User',userSchema)
module.exports = DataUser