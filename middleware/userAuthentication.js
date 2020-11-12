const jwt = require('jsonwebtoken')

module.exports = (req,res,next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']
    if (token.startsWith('Bearer')) token = token.slice(7, token.length);
    if(token) {
        jwt.verify(token,'GROUP_2',(err,decoded) => {
            if(err) next({name : 'INCORRECT_TOKEN'})
            else {
                req.userID = decoded._id;
                next()
            }
        })
    }else next({name : 'MISSING_TOKEN'})
}