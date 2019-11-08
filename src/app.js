
const express = require('express')
const app = express();
import {router} from './routes/router';
const bodyParser = require('body-parser')
const cors = require('cors');


app.set('port', (process.env.PORT || 8085))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors())

app.use('/api', router)
app.use(express.static('static'))


app.use(function (req, res) {
	const err = new Error('Not Found')
	err.status = 404
	res.json(err)
})


app.listen(app.get('port'), function () {
	console.log('API Server Listening on port ' + app.get('port') + '!')
})

