const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email : { 
        type : String,
        required : 'email required',
        unique : true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password : {
        type : String,
        required : 'Password Required',
        minlength: [6, 'Password must be atLeast 6 character long'],
    },
    username : {
        type : String,
        required : "Username required",
        minLength : [3, 'Username must be atLeast 3 character long']
    },
    phone : {
        type : String,
        unique :  true,
        required : "phone number required",
        validate : [/^(^\+62\s?|^0)(\d{3,4}-?){2}\d{3,4}$/, 'please fill valid phone']
    },
    role : {
        type : String,
        default : 'user'
    },
    createBy : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    age : {
        type : Number,
        required : "age required"
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