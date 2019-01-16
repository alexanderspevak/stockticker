const User = require('../models').User;
const Favs=require('../models').Favs
const helpers = require('../helpers')

module.exports = {
    get(req,res,next){
       const id=res.locals.userId
       User.findById(id,{include:[
           {model:Favs,
            as:'Favs'}
       ]})
       .then(user=>{
           res.status(200).send(user)
       })
       .catch(error=>res.status(500).send('server error'))
    },
    create(req, res) {
        var hashedPassword = helpers.hash(req.body.password, 5)
        if (!hashedPassword) {
            res.writeHead(400, { 'Content-Type': 'text/html' })
            res.end('Password too short')
        }
        return User
            .create({
                userName: req.body.userName,
                password: hashedPassword
            })
            .then(user => res.status(201).send(user))
            .catch(error => res.status(400).send('User already in use'))
    }
}