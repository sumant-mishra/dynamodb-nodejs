// Proposal
var ObjectId = require('mongoose').Types.ObjectId; 
const mongoose = require('mongoose')


const internshipProposalSchema = new mongoose.Schema({
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
    noOfSlots: { type: Number },
    periodFrom: { type: Date },
    periodTo: { type: Date },
    minTenth: { type: Number },
    minTwelfth: { type: Number },
    minDiploma: { type: Number },
    minDegreeCGPA: { type: Number },
    minBacklogs: { type: Number },
    minBreaks: { type: Number },
    guideId: { type: mongoose.Schema.Types.ObjectId }  
})


module.exports = mongoose.model( 'InternshipProposal', internshipProposalSchema )