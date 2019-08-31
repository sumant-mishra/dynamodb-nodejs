const mongoose = require('mongoose')


const internshipSchema = new mongoose.Schema({
    proposalId: { type: mongoose.Schema.Types.ObjectId },
    studentId: { type: mongoose.Schema.Types.ObjectId },
    status: { type: String, default: "" },
    hasAccepted: { type: Boolean, default: false },
    appliedOn: { type: Date, default: new Date() },
    resumeSubmitted: { type:Boolean, default: true },
    remark: {type: String, default: ""},
    gradeOrMarks: { type: String, default: "" }
})


module.exports = mongoose.model( 'StudentInternship', internshipSchema )