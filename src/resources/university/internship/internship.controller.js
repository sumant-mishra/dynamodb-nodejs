var ObjectId = require('mongoose').Types.ObjectId;
const InternshipProposal = require('../../../models/internshipproposal');
const InternshipApplication = require('../../../models/internshipapplication');
const Guide = require('./../../../models/guide');
const Student = require('./../../../models/student');
const json2csv = require('json2csv').parse;

const userData = require("./../../../users");


const downloadCSVFromJSON = (res, docs, name) => {
    let fields = [];
    if(docs.length > 0){
        fields = Object.keys(docs[0]);
    }
    
    const csv = json2csv(docs, {fields});
    
    res.setHeader('Content-disposition', 'attachment; filename=' + name);
    res.set('Content-Type', 'text/csv');
    
    res.status(200).send(csv);
}

const processFetchProposalsListForUniversityReq = function (req, res) {
    return new Promise((resolve, reject) => {
        let objFilters = {};

        if (req.query.profile) {
            let profiles = JSON.parse(req.query.profile).map(item => {
                return ObjectId(item);
            })
            objFilters._id = { $in: profiles }
        }

        if (req.query.location) {
            objFilters.location = { $in: JSON.parse(req.query.location) }
        }

        if (req.query.company) {
            let companies = JSON.parse(req.query.company).map(item => {
                return ObjectId(item);
            })
            objFilters.companyId = { $in: companies }
        }

        if (req.query.program) {
            objFilters.program = { $in: JSON.parse(req.query.program) }
        }

        if (req.query.sector) {
            objFilters.sector = { $in: JSON.parse(req.query.sector) }
        }

        if (req.query.minstipend) {
            objFilters.stipend = { $gte: Number(req.query.minstipend), $lte: Number(req.query.maxstipend) }
        }

        if (req.query.year) {
            objFilters.yearFrom = { $gte: Number(req.query.year) };
            objFilters.yearTo = { $lte: Number(req.query.year) };
        }

        InternshipProposal.aggregate([
            {
                $lookup:
                {
                    from: 'companies',
                    localField: 'companyId',
                    foreignField: '_id',
                    as: 'company'
                }
            },
            { $unwind: '$company' },
            {
                $lookup:
                {
                    from: 'guides',
                    localField: 'guideId',
                    foreignField: '_id',
                    as: 'guide'
                }
            },
            {
                $unwind: {
                    "path": '$guide',
                    "preserveNullAndEmptyArrays": true
                }
            },
            {

                $lookup:
                {
                    from: 'internshipapplications',
                    localField: '_id',
                    foreignField: 'proposalId',
                    as: 'internship'
                }
            },
            { $unwind: '$internship' },
            {
                $project:
                {
                    _id: 1,
                    profile: 1,
                    sector: 1,
                    description: 1,
                    program: 1,
                    location: 1,
                    stipend: 1,
                    yearFrom: { $year: "$periodFrom" },
                    yearTo: { $year: "$periodTo" },
                    minTenth: 1,
                    minTwelfth: 1,
                    minDiploma: 1,
                    minDegreeCGPA: 1,
                    deadlineDate: 1,
                    companyId: 1,
                    stipend: 1,
                    guideId: "$guide._id",
                    guideName: "$guide.name",
                    companyName: "$company.name",
                    companyLogo: "$company.logo",
                    internshipId: "$internship._id",
                    status: "$internship.status",
                    hasAccepted: "$internship.hasAccepted",
                    appliedOn: "$internship.appliedOn",
                    resumeSubmitted: "$internship.resumeSubmitted"
                }
            }, {
                $group: {
                    _id: "$_id",
                    internshipId: { $first: "$internshipId" },
                    sector: { $first: "$sector" },
                    location: { $first: "$location" },
                    companyId: { $first: "$companyId" },
                    program: { $first: "$program" },
                    companyName: { $first: "$companyName" },
                    profile: { $first: "$profile" },
                    stipend: { $first: "$stipend" },
                    guideId: { $first: "$guideId" },
                    guideName: { $first: "$guideName" },
                    applications: { $sum: 1 },
                    selected: { $sum: { "$cond": { if: { $eq: ["$status", "SELECTED"] }, then: 1, else: 0 } } },
                    yearFrom: { $first: "$yearFrom" },
                    yearTo: { $first: "$yearTo" }
                }
            }, {
                $match: {
                    $and: [
                        objFilters
                    ]
                }
            }])
            .exec()
            .then(docs => {
                resolve(docs);
            })
            .catch(err => {
                reject(err);
            })
    })
}

const getProposalsListForUniversity = function (req, res) { 

    processFetchProposalsListForUniversityReq(req, res)
        .then(docs => res.status(200)
            .json(docs))
        .catch(err => res.status(500)
            .json({
                message: 'Error finding proposals',
                error: err
    }))
}

const downloadProposalsListForUniversity = function (req, res) { 

    processFetchProposalsListForUniversityReq(req, res)
        .then(docs => {
            downloadCSVFromJSON(res, docs, "company.csv");
        })
        .catch(err => res.status(500)
            .json({
                message: 'Error finding proposals',
                error: err
    }))
}

const assignGuide = function (req, res) {
    let dataItems = req.body;
    
    let results = [];
    for(let i = 0; i < dataItems.length; i++)
    {
        ((dataItem) => {InternshipProposal.updateOne({_id:dataItem._id}, { $set: dataItem}, 
        function (err, project) {
            
            if (err) {				
                //return res.status(400).json(err)
            }
            results.push(dataItem);
            //res.status(200).json(results)
            if(results.length == dataItems.length){
                res.status(200).json(results)
            }
        })})(dataItems[i])
    }
    
}

const getProfileNames = function (req, res) { 
		
    InternshipProposal.find({companyId: userData.user._id}, {_id: 1, profile: 1})
        .exec()
        .then(docs => res.status(200)
            .json(docs))
        .catch(err => res.status(500)
            .json({
                message: 'Error finding proposals',
                error: err
            }))
}

const processStudentDetails = function (req, res) {
    return new Promise((resolve, reject) => {
        InternshipProposal.aggregate([
            { $match : { _id : ObjectId(req.params.id) } },
            {
              $lookup:
              {
                  from: 'companies',
                  localField: 'companyId',
                  foreignField: '_id',
                  as: 'company'
              }
          },
          { $unwind: '$company' },
          {
            $lookup:
            {
                from: 'guides',
                localField: 'guideId',
                foreignField: '_id',
                as: 'guide'
            }
        },
        { $unwind: '$guide' },
          {
              
              $lookup:
              {
                  from: 'internshipapplications',
                  localField: '_id',
                  foreignField: 'proposalId',
                  as: 'internship'
              }
          },
          { $unwind: '$internship' },
          {
              
              $lookup:
              {
                  from: 'students',
                  localField: 'internship.studentId',
                  foreignField: '_id',
                  as: 'student'
              }
          },
          { $unwind: '$student' },
          {
              $project:
              {
                  _id: 1,
                  profile: 1,
                  sector: 1,
                  description: 1,
                  location: 1,
                  stipend: 1,
                  periodFrom: 1,
                  periodTo: 1,
                  minTenth: 1,
                  minTwelfth: 1,
                  minDiploma: 1,
                  minDegreeCGPA: 1,
                  deadlineDate: 1,
                  //companyId: 1,
                  stipend: 1,
                  //guideId: "$guide._id",
                  guideName: "$guide.name",
                  companyName: "$company.name",
                  internship:{
                      _id: "$internship._id",
                      appliedOn: "$internship.appliedOn",
                      approvalStatus: "$internship.approvalStatus",
                      gradeOrMarks: "$internship.gradeOrMarks",
                      proposalId: "$internship.proposalId",
                      remark: "$internship.remark",
                      resumeSubmitted: "$internship.resumeSubmitted",
                      status: "$internship.status",
                      studentId: "$internship.studentId",
                      studentName: "$student.name"
                  }
                  //student: 1
                  //internship.studentName: "$student.name"
              }
            },{
                $group:
                {
                    _id: "$_id",
                    //name: { $first: "$name" },
                    profile: { $first: "$profile" },
                  sector: { $first: "$sector" },
                  description: { $first: "$description" },
                  location: { $first: "$location" },
                  stipend: { $first: "$stipend" },
                  periodFrom: { $first: "$periodFrom" },
                  periodTo: { $first: "$periodTo" },
                  minTenth: { $first: "$minTenth" },
                  minTwelfth: { $first: "$minTwelfth" },
                  minDiploma: { $first: "$minDiploma" },
                  minDegreeCGPA: { $first: "$minDegreeCGPA" },
                  deadlineDate: { $first: "$deadlineDate" },
                  //companyId: 1,
                  stipend: { $first: "$stipend" },
                  //guideId: "$guide._id",
                  guideName: { $first: "$guideName" },
                  companyName: { $first: "$companyName" },
                    internship: { $push: "$internship" }
                }
            } 
            ])
            .exec()
            .then(docs => {
                resolve(docs);
            })
            .catch(err => {
                reject(err);
            })
    })
}

const getStudentDetails = function (req, res) { 
    processStudentDetails(req, res)
        .then(docs => res.status(200)
            .json(docs))
        .catch(err => res.status(500)
            .json({
                message: 'Error finding proposals',
                error: err
    }))
}


const downloadStudentDetails = function (req, res) { 
    processStudentDetails(req, res)
        .then(docs => {
            downloadCSVFromJSON(res, docs, "proposalstudents.csv");
        })
        .catch(err => res.status(500)
            .json({
                message: 'Error finding proposals',
                error: err
    }))
}


const getGuides = function (req, res) { 

    Guide.find({})
        .exec()
        .then(docs => res.status(200)
            .json(docs))
        .catch(err => res.status(500)
            .json({
                message: 'Error finding proposals',
                error: err
        }))
}

const processUniversityApprovalsReq = function(req, res){
    return new Promise((resolve, reject) => {

        let objFilters = {};
        
        if (req.query.profile) {
            let profiles = JSON.parse(req.query.profile).map(item => {
                return ObjectId(item);
            })
            objFilters.profileId = { $in: profiles }
        }

        if (req.query.company) {
            let companies = JSON.parse(req.query.company).map(item => {
                return ObjectId(item);
            })
            objFilters.companyId = { $in: companies }
        }

        if (req.query.program) {
            objFilters.program = { $in: JSON.parse(req.query.program) }
        }

        if (req.query.sector) {
            objFilters.sector = { $in: JSON.parse(req.query.sector) }
        }


        Student.aggregate([{
            $lookup:
            {
    
                from: 'internshipapplications',
                localField: '_id',
                foreignField: 'studentId',
                as: 'internship'
    
            }
        },
        { $unwind: '$internship' }, {
            $project:
            {
                _id: 1,
                name: 1,
                status: "$internship.status",
                internshipId: "$internship._id",
                approvalStatus: "$internship.approvalStatus",
                proposalId: "$internship.proposalId"
            }
        }, {
            $lookup:
            {
                from: 'internshipproposals',
                localField: 'proposalId',
                foreignField: '_id',
                as: 'proposal'
            }
        },
        { $unwind: '$proposal' }, {
            $project:
            {
                _id: 1,
                name: 1,
                internshipId: 1,
                approvalStatus: 1,
                proposalId: 1,
                profileId: "$proposal._id",
                profile: "$proposal.profile",
                companyId: "$proposal.companyId",
                program: "$proposal.program",
                sector: "$proposal.sector"
    
            }
        }, {
            $match: {
                $and: [
                    objFilters
                ]
            }
        }, {
            $lookup:
            {
                from: 'companies',
                localField: 'companyId',
                foreignField: '_id',
                as: 'company'
            }
        },
        { $unwind: '$company' }])
            .exec()
            .then(docs => {
                resolve(docs);
            })
            .catch(err => {
                reject(err);
            })
    })
}

const getProposalApprovalsData = function (req, res) {
    processUniversityApprovalsReq(req,res)
        .then(docs => res.status(200)
            .json(docs))
        .catch(err => res.status(500)
            .json({
                message: 'Error finding proposals',
                error: err
            }))
}

const downloadProposalApprovalsData = function (req, res) { 

    processUniversityApprovalsReq(req, res)
        .then(docs => {

            downloadCSVFromJSON(res, docs, "approval.csv");
        })
        .catch(err => res.status(500)
            .json({
                message: 'Error finding proposals',
                error: err
    }))
}

const updateApprovalStatus = function (req, res) {
        
    let applicationItems = req.body;
    
    let results = [];
    for(let i = 0; i < applicationItems.length; i++)
    {
        ((applicationItem) => {InternshipApplication.updateOne({_id:applicationItem._id}, { $set: applicationItem}, 
        function (err, project) {
            
            if (err) {				
                //return res.status(400).json(err)
            }
            results.push(applicationItem);
            //res.status(200).json(results)
            if(results.length == applicationItems.length){
                res.status(200).json(results)
            }
        })})(applicationItems[i])
    }
    
}

const processUniversityStudentsReq = function(req, res){
    return new Promise((resolve, reject) => {

        let objFilters = {};
        
        if (req.query.profile) {
            let profiles = JSON.parse(req.query.profile).map(item => {
                return ObjectId(item);
            })
            objFilters.profileId = { $in: profiles }
        }

        if (req.query.location) {
            objFilters.location = { $in: JSON.parse(req.query.location) }
        }

        if (req.query.company) {
            let companies = JSON.parse(req.query.company).map(item => {
                return ObjectId(item);
            })
            objFilters.companyId = { $in: companies }
        }

        if (req.query.program) {
            objFilters.program = { $in: JSON.parse(req.query.program) }
        }

        if (req.query.status) {
            objFilters.status = { $in: JSON.parse(req.query.status) }
        }

        if (req.query.sector) {
            objFilters.sector = { $in: JSON.parse(req.query.sector) }
        }

        if (req.query.minstipend) {
            objFilters.stipend = { $gte: Number(req.query.minstipend), $lte: Number(req.query.maxstipend) }
        }

        if (req.query.year) {
            objFilters.yearFrom = { $gte: Number(req.query.year) };
            objFilters.yearTo = { $lte: Number(req.query.year) };
        }

        Student.aggregate([
            {
                $lookup:
                {

                    from: 'internshipapplications',
                    localField: '_id',
                    foreignField: 'studentId',
                    as: 'internship'

                }
            },
            { $unwind: '$internship' }, {
                $project:
                {
                    _id: 1,
                    name: 1,
                    status: "$internship.status",
                    hasAccepted: "$internship.hasAccepted",
                    appliedOn: "$internship.appliedOn",
                    resumeSubmitted: "$internship.resumeSubmitted",
                    remark: "$internship.remark",
                    gradeOrMarks: "$internship.gradeOrMarks",
                    proposalId: "$internship.proposalId"
                }
            }, {
                $lookup:
                {
                    from: 'internshipproposals',
                    localField: 'proposalId',
                    foreignField: '_id',
                    as: 'proposal'
                }
            },
            { $unwind: '$proposal' }, 
            {
                $project:
                {
                    _id: 1,
                    name: 1,
                    status: 1,
                    hasAccepted: 1,
                    appliedOn: 1,
                    resumeSubmitted: 1,
                    remark: 1,
                    gradeOrMarks: 1,
                    proposalId: 1,
                    profileId: "$proposal._id",
                    profile: "$proposal.profile",
                    stipend: "$proposal.stipend",
                    location: "$proposal.location",
                    companyId: "$proposal.companyId",
                    program: "$proposal.program",
                    sector: "$proposal.sector",
                    yearFrom: {$year: "$proposal.periodFrom"},
                    yearTo: {$year: "$proposal.periodTo"}
                }
            }, {
                $match: {
                    $and: [
                        objFilters
                    ]
                }
            }, {
                $lookup:
                {
                    from: 'companies',
                    localField: 'companyId',
                    foreignField: '_id',
                    as: 'company'
                }
            },
            { $unwind: '$company' }, {
                $group:
                {
                    _id: "$_id",
                    name: { $first: "$name" },
                    proposals: { $push: { profile: "$profile", company: "$company", status: "$status", stipend: "$stipend", location: "$location" } }
                }
            }
        ])
            .exec()
            .then(docs => {
                resolve(docs);
            })
            .catch(err => {
                reject(err);
            })
    })
}

const getUniversityStudents = function (req, res) {
    processUniversityStudentsReq(req, res)
        .then(docs => res.status(200)
            .json(docs))
        .catch(err => res.status(500)
            .json({
                message: 'Error finding proposals',
                error: err
            }))
}

const downloadUniversityStudents = function (req, res) { 

    processUniversityStudentsReq(req, res)
        .then(docs => {
            downloadCSVFromJSON(res, docs, "students.csv");
        })
        .catch(err => res.status(500)
            .json({
                message: 'Error finding proposals',
                error: err
    }))
}


module.exports = {
    getProposalsListForUniversity,
    downloadProposalsListForUniversity,
    assignGuide,
    getProfileNames,
    getStudentDetails,
    downloadStudentDetails,
    getGuides,
    getProposalApprovalsData, 
    downloadProposalApprovalsData,
    updateApprovalStatus,
    getUniversityStudents,
    downloadUniversityStudents
}
