const express = require('express');
const cors = require('cors');
const https = require('https')
const bodyParser = require('body-parser')
const user = require('./controlers/users')
const favs = require('./controlers/favs')
const jwt = require('jwt-simple');
const helpers = require('./helpers')
require('dotenv').config()

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
var corsOptions = {
    origin: process.env.CLIENT,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

var listener = app.listen(8080, function () {
    console.log('server is listening on port ' + listener.address().port)
})

app.get('/user',helpers.checkJWT, (req, res) => {
    user.get(req,res)
})

app.get('/symbolsticker/:symbol', helpers.checkJWT, (req, res, next) => {
    const symbol = req.params.symbol;
    const query = `https://api.iextrading.com/1.0/stock/${symbol.toLowerCase()}/quote`;
    try{
        https.get(query, response => {
            let data = ""
            response
            .on('readable', function () {
                let d
                while (d = this.read()) {
                    data += d.toString()
                }
            })
            .on('end', function () {
                if (res.locals.userId) {
                    res.setHeader('userId', helpers.hash(res.locals.userId, 1))
                    return res.end(data)
                }
                res.writeHead(400)
                res.end('login before you continue')
            })
     
        })
    }catch(e){
        res.status(500).send(e)
    }

})

app.post('/createuser', (req, res, next) => {
    if (req.body.password && req.body.userName) {
        user.create(req, res)
    } else {
        res.status(400).send('userName or password missing')
    }
})

app.post('/createfav', helpers.checkJWT, (req, res, next) => {
    if (res.locals.userId && req.body.tickerSymbol) {
        favs.create(req, res)
    } else {
        res.status(400).send('tickerSymbol or userId missing')
    }
})

app.delete('/deletefav/:tickerSymbol', helpers.checkJWT, (req, res, next) => {
    if (res.locals.userId && req.params.tickerSymbol) {
        favs.delete(req, res)
    } else {
        res.status(400).send('tickerSymbol or user logged out ')
    }
})

app.post('/login', helpers.auth, (req, res, next) => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    const plus7Days = nowSeconds + 60 * 60 * 24 * 7
    let token = jwt.encode({
        "sub": `tickerid:${res.locals.id}`,
        "iat": nowSeconds,
        "exp": plus7Days,
    }, process.env.JWT_SECRET)
    res.status(200).send({ token })
})

