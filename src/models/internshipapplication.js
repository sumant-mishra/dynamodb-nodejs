const mongoose = require('mongoose')


const applictionSchema = new mongoose.Schema({
    proposalId: { type: mongoose.Schema.Types.ObjectId },
    studentId: { type: mongoose.Schema.Types.ObjectId },
    status: { type: String, default: "" },
    approvalStatus: { type: String, default: "" },
    appliedOn: { type: Date, default: new Date() },
    resumeSubmitted: { type:Boolean, default: true },
    remark: {type: String, default: ""},
    gradeOrMarks: { type: String, default: "" }
})


module.exports = mongoose.model( 'InternshipApplication', applictionSchema )