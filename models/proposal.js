// Proposal

const mongoose = require('mongoose')


const proposalSchema = new mongoose.Schema({
	companyId: {type: mongoose.Schema.Types.ObjectId},
    profile: { type: String },
    docsRequired: { type: String },
    sector: { type: String },
    description: { type: String },
    position: { type: String },
    location: { type: String },
    stipend: { type: Number },
    deadlineDate: { type: Date },
    college: { type: String },
    program: { type: String },
    percentileOrCGPA: { type: String },
    periodFrom: { type: Date },
    periodTo: { type: Date },
    minTenth: { type: Number },
    minTwelfth: { type: Number },
    minDiploma: { type: Number },
    minDegreeCGPA: { type: Number },
    minBacklogs: { type: Number },
    minBreaks: { type: Number },
    
})


module.exports = mongoose.model( 'Proposal', proposalSchema )