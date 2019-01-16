const crypto = require('crypto')
const jwt=require('jwt-simple')
const user = require('../models').User
var helpers = {}
require('dotenv').config()

helpers.checkLength = function (str, len = 2) {
    if (str.length < len) {
        return false
    }
    return str
}
helpers.hash = function (str, len = 2) {
    if (typeof (str) === 'string' && helpers.checkLength(str, len)) {
        var hash = crypto.createHmac('sha256', 'someSecret').update(str).digest('hex');
        return hash
    } else {
        return false
    }
}
helpers.auth = function (req, res, next) {
    const password = req.body.password;
    const userName = req.body.userName;
    const hashedPassword = helpers.hash(password)
    if (hashedPassword && userName) {
        user
            .findOne({
                where: { userName}
            })
            .then(user => {
                if(user){
                    if(user.password==hashedPassword){
                        res.locals.id=user.id
                        return next()
                    }
                    return res.status(400).send('Password does not match')
                }
                return res.status(400).send('Username does not exist')
            })
            .catch(err => { 
                res.status(500).send('Server Error') 
            })
    }
}

helpers.checkJWT=function(req,res,next){
    console.log('check jwt')
        try{
            let token=req.get('Authorization').replace('Bearer ','');
            let decoded=jwt.decode(token,process.env.JWT_SECRET)
            res.locals.userId=helpers.getIdFromToken(decoded)
            next()
        }catch(e){
            res.set('Content-Type','application/json')
            res.status(400)
            res.send('Invalid token or expired')
        }
}

helpers.getIdFromToken=function(decoded){
    var userId=decoded.sub.split(':')[1]
    return userId
}

module.exports = helpers