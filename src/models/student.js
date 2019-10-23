// Proposal

const mongoose = require('mongoose')


const studentSchema = new mongoose.Schema({
	name: {type:String},
	college: {type:String}
})


module.exports = mongoose.model( 'Student', studentSchema )