const User = require('../models/UserData')
const Address = require('../models/AdressData')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = class userController {

    static async register(req, res, next) {
        const { email, password, username, role, phone, age } = req.body
        const user = await User.findOne({ email: email })
        const userPhone = await User.findOne({ phone: phone })
        const userUsername = await User.findOne({ username: username })
        try {
            if (user) next({ name: 'ALREADY_EXIST' })
            else if (userPhone) next({ name: 'PHONE_EXIST' })
            else if (userUsername) next({ name: 'USERNAME_EXIST' })
            else {
                const userData = new User({ email, password, username, role, phone, age })
                const salt = bcrypt.genSaltSync(10)
                userData.password = bcrypt.hashSync(userData.password, salt)
                await userData.save()
                res.status(201).json({ success: true, data: userData })
            }
        }
        catch { next({ name: 'REQUIRED' }) }
    }
    static async createHeadMan(req, res, next) {
        const { email, password, username, role, phone, age } = req.body
        const user = await User.findOne({ email: email })
        const userPhone = await User.findOne({ phone: phone })
        const userUsername = await User.findOne({ username: username })
        try {
            if (user) next({ name: 'ALREADY_EXIST' })
            else if (userPhone) next({ name: 'PHONE_EXIST' })
            else if (userUsername) next({ name: 'USERNAME_EXIST' })
            else {
                const userData = new User({ email, password, username, role: 'headman', phone, age })
                const salt = bcrypt.genSaltSync(10)
                userData.password = bcrypt.hashSync(userData.password, salt)
                await userData.save()
                res.status(201).json({ success: true, data: userData })
            }
        }
        catch { next({ name: 'REQUIRED' }) }
    }
    static async createCommitte(req, res, next) {
        const { email, password, username, role, phone, age } = req.body
        const user = await User.findOne({ email: email })
        const userPhone = await User.findOne({ phone: phone })
        const addressData = await Address.findOne({ user: req.userID })
        const userUsername = await User.findOne({ username: username })
        try {
            if (user) next({ name: 'ALREADY_EXIST' })
            else if (userPhone) next({ name: 'PHONE_EXIST' })
            else if (userUsername) next({ name: 'USERNAME_EXIST' })
            if (addressData) {
                const userData = new User({ email, password, username, role: 'committe', phone, age, createBy: req.userID })
                const salt = bcrypt.genSaltSync(10)
                userData.password = bcrypt.hashSync(userData.password, salt)
                await userData.save()
                const address = await new Address({ district: addressData.district, user: userData._id })
                await address.save()
                res.status(201).json({ success: true, data: userData })
            }
            else if (!addressData) next({ name: 'ADDRESS_REQUIRED' })
        }
        catch { next({ name: 'REQUIRED' }) }
    }
    static async login(req, res, next) {
        const { password } = req.body
        const user = await User.findOne({ $or: [{ email: req.body.identity }, { phone: req.body.identity }] })
        try {
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = jwt.sign({ _id: user._id, role: user.role }, 'GROUP_2', { expiresIn: '24h' })
                res.status(200).send({ success: true, data: user, token })
            }
            else if (user && !bcrypt.compareSync(password, user.password)) next({ name: 'INCORRECT_LOGIN' })
            else next({ name: 'USER_NOT_FOUND' })
        }
        catch { next({ name: 'REQUIRED' }) }
    }
    static async forgetPassword(req, res, next) {
        const { email, password, phone } = req.body
        const user = await User.findOne({ email: email, phone: phone })
        if (user) {
            const salt = bcrypt.genSaltSync(10)
            const newData = { password }
            newData.password = bcrypt.hashSync(newData.password, salt)
            const updateUser = await User.findOneAndUpdate({ email: email }, newData, { new: true })
            res.status(200).json({ success: true, data: updateUser })
        }
        else next({ name: 'USER_NOT_FOUND' })
    }
    static async detailUser(req, res, next) {
        try {
            const user = await User.findById(req.userID)
                .populate('createBy')
            res.status(200).json({ success: true, data: user })
        }
        catch { next({ name: 'USER_NOT_FOUND' }) }
    }
    static async updatePassword(req, res, next) {
        const { oldpassword, newpassword } = req.body
        const user = await User.findById(req.userID)
        try {
            if (bcrypt.compareSync(oldpassword, user.password)) {
                if (newpassword.length <= 6) next({ name: 'PASSWORD_LESS' })
                else {
                    const salt = bcrypt.genSaltSync(10)
                    const newData = { newpassword }
                    newData.newpassword = bcrypt.hashSync(newData.newpassword, salt)
                    const updateUser = await User.findByIdAndUpdate(req.userID, { $set: { password: newData.newpassword } }, { new: true })
                    res.status(200).json({ success: true, data: updateUser })
                }
            }
            else next({ name: 'OLDPASSWORD_WRONG' })
        }
        catch { next({ name: 'USER_NOT_FOUND' }) }
    }
    static async updateUser(req, res, next) {
        try {
            const newAdress = { fullname : req.body.fullname }
            for (let key in newAdress) if (!newAdress[key]) delete newAdress[key]
            const update = await User.findByIdAndUpdate(req.userID,newAdress, { new: true })
            res.status(200).json({ success: true, data: update })
        }
        catch { next({ name: 'USER_NOT_FOUND' }) }
    }
    static async listCommitte(req, res, next) {
        try {
            const committe = await User.find({ createBy: req.userID })
            res.status(200).json({ success: true, data: committe })
        }
        catch { next({ name: 'USER_NOT_FOUND' }) }
    }
    static async deleteCommitte(req,res,next) {
        const {committeID} = req.params
        try {
            const committe = await User.findOneAndDelete({createBy : req.userID, _id : committeID})
            if(committe){
            await Address.findByIdAndDelete(committeID)
            res.status(200).json({success : true, msg : 'success delete committe'})
            }
        }
        catch { next({ name: 'USER_NOT_FOUND' }) }
    }
}