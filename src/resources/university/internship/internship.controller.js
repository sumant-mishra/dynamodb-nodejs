var ObjectId = require('mongoose').Types.ObjectId;
const InternshipProposal = require('../../../models/internshipproposal');
const InternshipApplication = require('../../../models/internshipapplication');
const Guide = require('./../../../models/guide');
const Student = require('./../../../models/student');

const userData = require("./../../../users");

const getProposalsListForUniversity = function (req, res) { 
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
    { $unwind: {"path": '$guide',
    "preserveNullAndEmptyArrays": true} },
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
              location: 1,
              stipend: 1,
              periodFrom: 1,
              periodTo: 1,
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
            companyName: { $first: "$companyName" },
            profile: { $first: "$profile" },
            stipend: { $first: "$stipend" },
            guideId: { $first: "$guideId" },
            guideName: { $first: "$guideName" },
            applications: { $sum: 1 },
            selected: { $sum: { "$cond": { if: { $eq: ["$status", "SELECTED"] }, then: 1, else: 0 } } }
          }
        }
        ])
        .exec()
        .then(docs => res.status(200)
            .json(docs))
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

const getStudentDetails = function (req, res) { 
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
              //companyLogo: "$company.logo",
              internship:1
              //internshipId: "$internship._id",
              //status: "$internship.status",
              //hasAccepted: "$internship.hasAccepted",
              //appliedOn: "$internship.appliedOn",
              //resumeSubmitted: "$internship.resumeSubmitted"
          }
        }
        ])
        .exec()
        .then(docs => res.status(200)
            .json(docs))
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

const getProposalApprovalsData = function (req, res) {
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
            profile: "$proposal.profile",
            companyId: "$proposal.companyId",
            program: "$proposal.program",
            sector: "$proposal.sector"

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
        .then(docs => res.status(200)
            .json(docs))
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

const getUniversityStudents = function (req, res) {
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
        { $unwind: '$proposal' }, {
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
                profile: "$proposal.profile",
                stipend: "$proposal.stipend",
                location: "$proposal.location",
                copanyId: "$proposal.companyId"
            }
        }, {
            $lookup:
            {
                from: 'companies',
                localField: 'copanyId',
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
        .then(docs => res.status(200)
            .json(docs))
        .catch(err => res.status(500)
            .json({
                message: 'Error finding proposals',
                error: err
            }))
}


module.exports = {
    getProposalsListForUniversity,
    assignGuide,
    getProfileNames,
    getStudentDetails,
    getGuides,
    getProposalApprovalsData,
    updateApprovalStatus,
    getUniversityStudents
}
