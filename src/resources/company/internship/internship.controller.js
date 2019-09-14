var ObjectId = require('mongoose').Types.ObjectId;
const InternshipProposal = require('../../../models/internshipproposal');
const InternshipApplication = require('../../../models/internshipapplication');
const Company = require('./../../../models/company')

const userData = require("./../../../users");

const getInternshipProposals = function (req, res) { 
    let dt = new Date();

    let objFilters = {}
    objFilters.companyId = userData.user._id;
    if(req.query.filtertype){
        if(req.query.filtertype == "upcoming"){
            objFilters.periodFrom =  { $gt: dt}
        }
        if(req.query.filtertype == "completed"){
            objFilters.periodTo =  { $lt: dt}
        }

        if(req.query.filtertype == "ongoing"){
            objFilters.periodTo =  { $gt: dt}
            objFilters.periodFrom =  { $lt: dt}
        }
        //objFilters.profile = {$eq: req.query.profile}
    }
    

    //const queryFilter = (userData.role=="company") ? { companyId: userData.user._id} : {};
    
    InternshipProposal.find(objFilters)
        .exec()
        .then(docs => res.status(200)
            .json(docs))
        .catch(err => res.status(500)
            .json({
                message: 'Error finding proposals',
                error: err
            }))
}

const saveNewInternshipProposal = function(req, res){
    let proposal = new InternshipProposal(req.body)
    proposal.companyId = userData.user._id;
    proposal.save(function (err, project) {
        if (err) {				
            return res.status(400).json(err)
        }
        res.status(200).json(project)
    })
}
const updateInternshipProposal = function (req, res) {
		
    InternshipProposal.updateOne({_id:req.params.id}, req.body, function (err, project) {
        if (err) {				
            return res.status(400).json(err)
        }
        res.status(200).json(req.body)
    })
    
}
const deleteInternshipProposals = function (req, res) {
    let ids = JSON.parse(decodeURI(req.params.ids));
    console.log('ids: ', ids);
    InternshipProposal.deleteMany({_id:{$in: ids}}, function (err, project) {
        if (err) {
            return res.status(400).json(err)
        }
        res.status(200).json(req.params.ids);
    })
    
}

const getInternshipStatusData = function (req, res) { 

    let objFilters = {}
    if(req.query.profile){
        objFilters.profile = {$eq: req.query.profile}
    }
    if(req.query.college){
        objFilters.college = {$in: JSON.parse(req.query.college)}
    }
    if(req.query.program){
        objFilters.program = {$eq: req.query.program}
    }
    if(req.query.department){
        objFilters.sector = {$eq: req.query.sector}
    }
    if(req.query.mincgpa){
        objFilters.minDegreeCGPA =  { $gte: Number(req.query.mincgpa)  , $lte: Number(req.query.maxcgpa) }
    }
    if(req.query.minpercentile){
        //objFilters.minDegreeCGPA = { $and: [ { $gte: [ "$minDegreeCGPA", req.query.mincgpa ] }, { $lte: [ "$minDegreeCGPA", req.query.maxcgpa ] } ] 
    }
    let selectedYear = new Date().getFullYear();
    if(req.query.year){
        selectedYear = req.query.year;
    }

    objFilters.yearFrom = { $gte: Number(selectedYear) }
    objFilters.yearTo = { $lte: Number(selectedYear) }

    let objYearFilter =  {};//{$or: [{ $eq: [{ "$year": "$periodFrom" }, selectedYear]}, { $eq: [{ "$year": "$periodTo" }, selectedYear]}]}
    objYearFilter.periodFrom =  { $eq: [{ $year: "$periodFrom" }, 2019] }
    //console.log("caling");
    InternshipProposal.aggregate([
         
        {
            
            $lookup:
            {
                from: 'internshipapplications',
                localField: '_id',
                foreignField: 'proposalId',
                as: 'internship'
            }

        },
        { $unwind: {path: '$internship'} } ,
        {
            
            $lookup:
            {
                from: 'students',
                localField: 'internship.studentId',
                foreignField: '_id',
                as: 'student'
            }

        },
        { $unwind: {path: '$student'} } ,
        {
            $project:
            {
                _id: 1,
                profile: 1,
                sector: 1,
                program: 1,
                //description: 1,
                //location: 1,
                //stipend: 1,
                yearFrom: {$year: "$periodFrom"},
                yearTo: {$year: "$periodTo"},
                minTenth: 1,
                minTwelfth: 1,
                minDiploma: 1,
                minDegreeCGPA: 1,
                //deadlineDate: 1,
                //companyId: 1,
                college: 1,
                sector: 1,
                //companyName: "$company.name",
                //companyLogo: "$company.logo",
                internshipId: "$internship._id",
                //studentId: "$internship.studentId",
                status: "$internship.status",
                hasAccepted: "$internship.hasAccepted",
                //appliedOn: "$internship.appliedOn",
                //resumeSubmitted: "$internship.resumeSubmitted",
                studentName: "$student.name"
            }

        },{
          $match: {
              $and: [
                  objFilters
              ]
          }  
        } ])
        .exec()
        .then(docs => res.status(200)
            .json(docs))
        .catch(err => res.status(500)
            .json({
                message: 'Error finding proposals',
                error: err
    }))
}

const updateInternshipStatuses = function (req, res) {
        
    let internshipStatusItems = req.body;
    
    let results = [];
    for(let i = 0; i < internshipStatusItems.length; i++)
    {
        ((internshipStatusItem) => {InternshipApplication.updateOne({_id:internshipStatusItem._id}, { $set: internshipStatusItem}, 
        function (err, project) {
            
            if (err) {				
                //return res.status(400).json(err)
            }
            results.push(internshipStatusItem);
            //res.status(200).json(results)
            if(results.length == internshipStatusItems.length){
                res.status(200).json(results)
            }
        })})(internshipStatusItems[i])
    }
    
}

const updateInternshipRemark = function (req, res) {
    //console.log('calling remark: ', req.body);
    let internshipAssessmentItem = req.body;
    InternshipApplication.updateOne({_id:req.params.id}, { $set: internshipAssessmentItem}, 
        function (err, project) {
            if (err) {				
                //return res.status(400).json(err)
            }
            
            res.status(200).json(req.body)
        })
    
}

const getInternshipAssessmentData = function (req, res) { 

    let objFilters = {}
    //objFilters.companyId = userData.user._id;
    console.log(req.query);
    if(req.query.profile){
        objFilters.profile = {$eq: req.query.profile}
    }
    if(req.query.college){
        objFilters.college = {$eq: req.query.college}
    }
    InternshipProposal.aggregate([
        {
            
            $lookup:
            {
                from: 'internshipapplications',
                localField: '_id',
                foreignField: 'proposalId',
                as: 'internship'
            }

        },
        { $unwind: {path: '$internship'} },
        {
            
            $lookup:
            {
                from: 'students',
                localField: 'internship.studentId',
                foreignField: '_id',
                as: 'student'
            }

        },
        { $unwind: {path: '$student'} } ,
        {
            $project:
            {
                _id: 1,
                profile: 1,
                //sector: 1,
                program: 1,
                //description: 1,
                //location: 1,
                //stipend: 1,
                //periodFrom: 1,
                //periodTo: 1,
                //minTenth: 1,
                //minTwelfth: 1,
                //minDiploma: 1,
                //minDegreeCGPA: 1,
                //deadlineDate: 1,
                //companyId: 1,
                college: 1,
                //sector: 1,
                //companyName: "$company.name",
                //companyLogo: "$company.logo",
                internshipId: "$internship._id",
                //studentId: "$internship.studentId",
                //status: "$internship.status",
                //hasAccepted: "$internship.hasAccepted",
                gradeOrMarks: "$internship.gradeOrMarks",
                remark: "$internship.remark",
                //appliedOn: "$internship.appliedOn",
                //resumeSubmitted: "$internship.resumeSubmitted",
                studentName: "$student.name"
            }

        },{
            $match:{
                $and: [
                    objFilters
                ]
            }
        }])
        .exec()
        .then(docs => res.status(200)
            .json(docs))
        .catch(err => res.status(500)
            .json({
                message: 'Error finding proposals',
                error: err
    }))
}

const updateGradeOrMark = function (req, res) {
    let internshipAssessmentItem = req.body;
    InternshipApplication.updateOne({_id:req.params.id}, { $set: internshipAssessmentItem}, 
        function (err, project) {
            if (err) {				
                //return res.status(400).json(err)
            }
            
            res.status(200).json(req.body)
        })
    
}

const deleteInternshipApplications = function (req, res) {
    //console.log(typeof(req.params.ids), req.params.ids);
    let ids = JSON.parse(req.params.ids);
    //console.log("deleteproposals: ", ids);
    InternshipApplication.deleteMany({_id:{$in: ids}}, function (err, project) {
        if (err) {
            return res.status(400).json(err)
        }
        res.status(200).json(JSON.parse(req.params.ids));
    })
    
}


const getCompanyFiltersData = function(req, res){
    let dt = new Date();

    let objFilters = {}
    objFilters.companyId = userData.user._id;
    
    let filtersData = {};
    let filterOptions = [];
    let responseCounter = 0;
    if(req.query.filtertypes){
        filterOptions = JSON.parse(decodeURI(req.query.filtertypes));
        for(var i = 0; i < filterOptions.length; i++){
            switch(filterOptions[i]){
                case "profile":
                        InternshipProposal.aggregate([
                            {
                                $match: {
                                    companyId: {
                                        $eq: ObjectId(userData.user._id)
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: "$_id",
                                    profile: { $first: "$profile" }
                                }
                            }
                        ]).exec((err, result) => {
                            if(err){
                                console.log(err);
                            }
                            filtersData.profiles = result;
                            responseCounter++;
                            //console.log(filtersData);
                            if(responseCounter == filterOptions.length){
                                res.json(filtersData);
                            }
                        })
                    break;

                case "location":
                    InternshipProposal.aggregate([
                        {
                            $match: {
                                companyId: {
                                    $eq: ObjectId(userData.user._id)
                                }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                location: { $first: "$location" }
                            }
                        }
                    ]).exec((err, result) => {
                        if(err){
                            console.log(err);
                        }
                        filtersData.locations = result;
                        responseCounter++;
                        //console.log(filtersData);
                        if(responseCounter == filterOptions.length){
                            res.json(filtersData);
                        }
                    })
                break;

            case "program":
                InternshipProposal.aggregate([
                    {
                        $match: {
                            companyId: {
                                $eq: ObjectId(userData.user._id)
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            program: { $first: "$program" }
                        }
                    }
                ]).exec((err, result) => {
                    if(err){
                        console.log(err);
                    }
                    filtersData.programs = result;
                    responseCounter++;
                    //console.log(filtersData);
                    if(responseCounter == filterOptions.length){
                        res.json(filtersData);
                    }
                })
            break;

            case "sector":
                InternshipProposal.aggregate([
                    {
                        $match: {
                            companyId: {
                                $eq: ObjectId(userData.user._id)
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            sector: { $first: "$sector" }
                        }
                    }
                ]).exec((err, result) => {
                    if(err){
                        console.log(err);
                    }
                    filtersData.sectors = result;
                    responseCounter++;
                    //console.log(filtersData);
                    if(responseCounter == filterOptions.length){
                        res.json(filtersData);
                    }
                })
            break;

            case "college":
                InternshipProposal.aggregate([
                    {
                        $match: {
                            companyId: {
                                $eq: ObjectId(userData.user._id)
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            college: { $first: "$college" }
                        }
                    }
                ]).exec((err, result) => {
                    if(err){
                        console.log(err);
                    }
                    filtersData.colleges = result;
                    responseCounter++;
                    //console.log(filtersData);
                    if(responseCounter == filterOptions.length){
                        res.json(filtersData);
                    }
                })
            break;

            case "company":
                Company.aggregate([
                    {
                        $group: {
                            _id: "$_id",
                            company: { $first: "$name" }
                        }
                    }
                ]).exec((err, result) => {
                    if(err){
                        console.log(err);
                    }
                    filtersData.companies = result;
                    responseCounter++;
                    //console.log(filtersData);
                    if(responseCounter == filterOptions.length){
                        res.json(filtersData);
                    }
                })
            break;
            }
        }
    }
    /* InternshipProposal.find(objFilters).distinct("_id", function (err, docs) {
        //console.log(docs);
    }); */

    


    /* InternshipProposal.find(objFilters)
        .exec()
        .then(docs => res.status(200)
            .json(docs))
        .catch(err => res.status(500)
            .json({
                message: 'Error finding proposals',
                error: err
            })) */
}



module.exports = {
    getInternshipProposals,
    saveNewInternshipProposal,
    updateInternshipProposal,
    deleteInternshipProposals,
    getInternshipStatusData,
    updateInternshipStatuses,
    updateInternshipRemark,
    getInternshipAssessmentData,
    updateGradeOrMark,
    deleteInternshipApplications,
    getCompanyFiltersData
}
