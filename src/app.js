
const express = require('express')
const app = express();
import {router} from './routes/router';
//const api = require('../api')

const bodyParser = require('body-parser')
const cors = require('cors');
const userData = require("./users");
//const cookieParser = require('cookie-parser'); 
//app.use(cookieParser());   

app.set('port', (process.env.PORT || 8085))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors())

app.use('/api', router)
app.use(express.static('static'))

//app.use(morgan('dev'))

app.use(function (req, res) {
	const err = new Error('Not Found')
	err.status = 404
	res.json(err)
})

/* app.use(function(req, res, next){
	//console.log(userData);
	//console.log(res.cookie())
	res.cookie('user', "calling");
	//res.locals.user = userData
	next();
}) */

//  MongoDB connection 
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/ucsconnect', { useNewUrlParser: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
	console.log('Connected to MongoDB')

	app.listen(app.get('port'), function () {
		console.log('API Server Listening on port ' + app.get('port') + '!')
	})
})
