const Favs = require('../models').Favs;
const helpers = require('../helpers')

module.exports = {
    create(req, res) {
        return Favs
            .create({
                tickerSymbol: req.body.tickerSymbol,
                userId: res.locals.userId
            })
            .then(fav => res.status(201).send(fav))
            .catch(error => res.status(400).send(error))
    },
    delete(req,res){
       
        const tickerSymbol=req.params.tickerSymbol.toUpperCase();
        const userId= res.locals.userId
        return Favs
            .destroy({where:{
                tickerSymbol,userId
            }})
            .then((deleted)=>{
                if(deleted==1){
                    return res.status(200).send('Fav deleted')
                }
                return res.status(400).send('not deleted')
            })
            .catch((error)=>{
                res.status(500).send('server error')
            })
    }
}