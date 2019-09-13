const mongoose = require('mongoose')


const guideSchema = new mongoose.Schema({
	name: {type:String}
})


module.exports = mongoose.model( 'Guide', guideSchema )