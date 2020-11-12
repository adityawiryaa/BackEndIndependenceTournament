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
    phone : {
        type : Number,
        required: true,
        minlength:10
    }
})

userSchema.pre('save', function (next) {
    DataUser.findOne({ email: this.email})
        .then( async user => {
            const phone = await DataUser.findOne({phone : this.phone})
            if (user || phone) next({name: 'ALREADY_EXIST' })
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