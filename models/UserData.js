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
        minlength: 6,maxlength : 20
    },
    username : {
        type : String,
        required : true
    },
    phone : {
        type : Number,
        minlength:10,
        default : 0
    },
    role : {
        type : String,
        default : 'user'
    }

})

userSchema.pre('save', function (next) {
    DataUser.findOne({ email: this.email})
        .then(user => {
            if (user) next({name: 'ALREADY_EXIST' })
            else {
                const salt = bcrypt.genSaltSync(10)
                this.password = bcrypt.hashSync(this.password, salt)
                next()
            }
        })
        .catch(next)
})
const DataUser = mongoose.model('User',userSchema)
module.exports = DataUser