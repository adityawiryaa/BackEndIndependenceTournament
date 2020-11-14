const User = require('../models/UserData')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = class userController {

    static register(req, res, next) {
        const { email, password,username,role } = req.body
        User.create({ email, password,username,role })
            .then(data => {
                res.status(200).json({ success: true, data })
            })
            .catch(next)
    }
    static async login(req, res, next) {
        const { email, password} = req.body
        const user = await User.findOne({ email })
        try {
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = jwt.sign({ _id: user._id, role: user.role }, 'GROUP_2', { expiresIn: '24h' })
                res.status(200).send({ success: true, data: user, token })
            }
            else if (!user) next({ name: 'USER_NOT_FOUND' })
            else next({ name: 'INCORRECT_LOGIN' })
        }
        catch { next({ name: 'USER_NOT_FOUND' }) }
    }
    static async detailUser(req, res, next) {
        try {
            const user = await User.findById(req.userID)
            res.status(200).json({ success: true, data: user })
        }
        catch { next({ name: 'USER_NOT_FOUND' }) }
    }
    static async updateUser(req, res, next) {
        const { password } = req.body
        const salt = bcrypt.genSaltSync(10)
        try {
            const newData = { password }
            if (password) newData.password = await bcrypt.hashSync(newData.password, salt)
            for (let key in newData) if (!newData[key]) delete newData[key]
            const updateUser = await User.findByIdAndUpdate(req.userID, newData, { new: true })
            res.status(200).json({ success: true, data: updateUser })
        }
        catch { next({ name: 'USER_NOT_FOUND' }) }
    }
}