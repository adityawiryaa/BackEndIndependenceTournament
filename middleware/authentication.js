const jwt = require('jsonwebtoken')

class authentication {
    static adminAuth(req, res, next) {
        let token = req.headers['x-access-token'] || req.headers['authorization']
        if (token.startsWith('Bearer')) {
            token = token.slice(7, token.length);
        }
        if (token) {
            jwt.verify(token, 'GROUP_2', (err, decoded) => {
                if (err || decoded.role == 'user') next({ name: 'NOT_ACCESS' })
                else {
                    req.userID = decoded._id;
                    next()
                }
            })
        } else next({ name: 'MISSING_TOKEN' })
    }

    static headManAuth(req,res,next) {
        let token = req.headers['x-access-token'] || req.headers['authorization']
        if(token.startsWith('Bearer')) token = token.slice(7,token.length)
        if(token) {
            jwt.verify(token,'GROUP_2', (err,decoded) => {
                if(decoded.role == 'headman') {
                    req.userID = decoded._id;
                    next()
                }
                else next({ name: 'NOT_ACCESS' })
            })
        }
    }
    static committeAuth(req,res,next) {
        let token = req.headers['x-access-token'] || req.headers['authorization']
        if(token.startsWith('Bearer')) token = token.slice(7,token.length)
        if(token) {
            jwt.verify(token,'GROUP_2', (err,decoded) => {
                if(decoded.role == 'committe') {
                    req.userID = decoded._id;
                    next()
                }
                else next({ name: 'NOT_ACCESS' })
            })
        }
    }

    static userAuth(req, res, next) {
        let token = req.headers['x-access-token'] || req.headers['authorization']
        if (token.startsWith('Bearer')) token = token.slice(7, token.length);
        if (token) {
            jwt.verify(token, 'GROUP_2', (err, decoded) => {
                if (err) next({ name: 'INCORRECT_TOKEN' })
                else {
                    req.userID = decoded._id;
                    next()
                }
            })
        } else next({ name: 'MISSING_TOKEN' })

    }

}
module.exports = authentication