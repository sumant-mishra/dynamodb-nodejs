const mongoose = require('mongoose')


const companySchema = new mongoose.Schema({
    name: { type:String },
    logo: { type: String }
})


module.exports = mongoose.model( 'Company', companySchema )