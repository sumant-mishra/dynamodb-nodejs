const json2csv = require('json2csv').parse;
const StudentInternship = require('../../models/internship');
const Proposal = require('../../models/proposal');
var ObjectId = require('mongoose').Types.ObjectId; 
var fs = require('fs');

const userData = require("./../../users");

module.exports = function (router) {
    
    // GET: List of active projects
	router.get('/internship/applications/student', function (req, res) { 
        Proposal.aggregate([
            {
                $lookup:
                {
                    from: 'companies',
                    localField: 'companyId',
                    foreignField: '_id',
                    as: 'company'
                }
            },
            { $unwind: '$company' }, {
                /* $lookup: {
                    from: "studentinternships",
                    pipeline: [
                       { $match: {"studentId": userData.user._id} },
                       { $match: {"studentId": userData.user._id} }

                    ],
                    as: "studentinternship"
                  } } */
                $lookup:
                {
                    from: 'studentinternships',
                    localField: '_id',
                    foreignField: 'proposalId',
                    as: 'internship'
                }
            },
            {
                "$addFields": {
                    "internship": {
                        "$arrayElemAt": [
                            {
                                "$filter": {
                                    "input": "$internship",
                                    "as": "internship",
                                    "cond": {
                                        "$eq": ["$$internship.studentId", ObjectId(userData.user._id)]
                                    }
                                }
                            }, 0
                        ]
                    }
                }
            },
                /* , 
                {$unwind: {"path": '$internship',
                "preserveNullAndEmptyArrays": true}} */{
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
                    companyName: "$company.name",
                    companyLogo: "$company.logo",
                    internshipId: "$internship._id",
                    status: "$internship.status",
                    hasAccepted: "$internship.hasAccepted",
                    appliedOn: "$internship.appliedOn",
                    resumeSubmitted: "$internship.resumeSubmitted"
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
    })


    // GET: List of active projects
	router.get('/internship/applications/company/status', function (req, res) { 

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
        
        Proposal.aggregate([
            /* {
                $lookup:
                {
                    from: 'companies',
                    localField: 'companyId',
                    foreignField: '_id',
                    as: 'company'
                }
            },
            { $unwind: '$company' }, */ 
            {
                
                $lookup:
                {
                    from: 'studentinternships',
                    localField: '_id',
                    foreignField: 'proposalId',
                    as: 'internship'
                }

            },
            {
                "$addFields": {
                    "internship": {
                        "$arrayElemAt": [
                            {
                                "$filter": {
                                    "input": "$internship",
                                    "as": "internship",
                                    "cond": {
                                        "$eq": ["$$internship.studentId", ObjectId(userData.user._id)]
                                    }
                                }
                            }, 0
                        ]
                    }
                }
            },
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
                    //periodFrom: 1,
                    //periodTo: 1,
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
            }/*,
            {
                
                $lookup:
                {
                    from: 'students',
                    localField: 'studentId',
                    foreignField: '_id',
                    as: 'student'
                }

            },
            { $unwind: '$student' }  */])
			.exec()
			.then(docs => res.status(200)
				.json(docs))
			.catch(err => res.status(500)
				.json({
					message: 'Error finding proposals',
					error: err
		}))
    })


    // GET: List of active projects
	router.get('/internship/applications/company/assessment', function (req, res) { 
        Proposal.aggregate([
            /* {
                $lookup:
                {
                    from: 'companies',
                    localField: 'companyId',
                    foreignField: '_id',
                    as: 'company'
                }
            },
            { $unwind: '$company' }, */ 
            {
                
                $lookup:
                {
                    from: 'studentinternships',
                    localField: '_id',
                    foreignField: 'proposalId',
                    as: 'internship'
                }

            },
            {
                "$addFields": {
                    "internship": {
                        "$arrayElemAt": [
                            {
                                "$filter": {
                                    "input": "$internship",
                                    "as": "internship",
                                    "cond": {
                                        "$eq": ["$$internship.studentId", ObjectId(userData.user._id)]
                                    }
                                }
                            }, 0
                        ]
                    }
                }
            },
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

            }/*,
            {
                
                $lookup:
                {
                    from: 'students',
                    localField: 'studentId',
                    foreignField: '_id',
                    as: 'student'
                }

            },
            { $unwind: '$student' }  */])
			.exec()
			.then(docs => res.status(200)
				.json(docs))
			.catch(err => res.status(500)
				.json({
					message: 'Error finding proposals',
					error: err
		}))
    })
  
    // POST: Create new project...
	router.post('/internship/applications/student', function (req, res) {
        
		let studentInternship = new StudentInternship(req.body)
		studentInternship.save(function (err, project) {

			if (err) {				
				return res.status(400).json(err)
            }
            let internshipData =  {};//project);
            internshipData.internshipId =  project._id;
            internshipData.status = project.status;
            internshipData.hasAccepted = project.hasAccepted;
            internshipData.appliedOn = project.appliedOn;
            internshipData.resumeSubmitted = project.resumeSubmitted;
            internshipData.proposalId = project.proposalId;
			res.status(200).json(internshipData)
		})
    })

    // PUT: Updates existing one doc...
	router.put('/internships/:id', function (req, res) {
		
		StudentInternship.updateOne({_id:req.params.id}, req.body, function (err, project) {
			if (err) {				
				return res.status(400).json(err)
			}
			res.status(200).json(req.body)
        })
        
    })
    // PUT: Updates existing one doc...
	router.post('/internship/applications/company/status', function (req, res) {
        
        let internshipStatusItems = req.body;
        
        let results = [];
        for(let i = 0; i < internshipStatusItems.length; i++)
        {
            ((internshipStatusItem) => {StudentInternship.updateOne({_id:internshipStatusItem._id}, { $set: internshipStatusItem}, 
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
        
    })

    // PUT: Updates existing one doc...
	router.post('/internship/applications/company/assessment/remark', function (req, res) {
        console.log('calling remark: ', req.body);
        let internshipAssessmentItem = req.body;
        StudentInternship.updateOne({_id:internshipAssessmentItem._id}, { $set: internshipAssessmentItem}, 
            function (err, project) {
                if (err) {				
                    //return res.status(400).json(err)
                }
                
                res.status(200).json(req.body)
            })
        
    })

    // PUT: Updates existing one doc...
	router.post('/internship/applications/company/assessment/gradeormarks', function (req, res) {
        let internshipAssessmentItem = req.body;
        StudentInternship.updateOne({_id:internshipAssessmentItem._id}, { $set: internshipAssessmentItem}, 
            function (err, project) {
                if (err) {				
                    //return res.status(400).json(err)
                }
                
                res.status(200).json(req.body)
            })
        
    })

    // PUT: Updates existing one doc...
	router.post('/internships/status/download', function (req, res) {
        //console.log(req.body);
        //let internshipStatusItems = req.body;
        //console.log(req.body);

        const fields = ['_id', 'profile', 'sector', 'college', 'program', 'internshipId', 'status', 'hasAccepted', 'studentName'];
        const opts = { fields };

        try {
        const csv = json2csv(req.body, opts);
        console.log(csv);
        //res.setHeader('Content-disposition', 'attachment; filename=data.csv');
            //res.set('Content-Type', 'text/csv');
            //console.log(csv);
            //res.status(200).send(csv);
            /* const writeFile = require('fs').writeFile;
            writeFile('./test-data.csv', csvData, (err) => {
                if(err) {
                    console.log(err); // Do something to handle the error or just throw it
                    throw new Error(err);
                }
                console.log('Success!');
            }); */

            /* res.setHeader('Content-disposition', 'attachment; filename=data.csv');
            res.setHeader('Content-Type', 'text/csv');
            res.charset = 'UTF-8';
            res.write(csv);
            res.end(); */

            fs.writeFile('cars.csv', csv, function(err) {
                if (err) throw err;
                //console.log('cars file saved');
                res.redirect('cars.csv');
              });
        } catch (err) {
        console.error(err);
        } 

        /* json2csv({ data: req.body, fields: fields }, function(err, csv) {
            if(err){
                console.log(err);
            }
            res.setHeader('Content-disposition', 'attachment; filename=data.csv');
            res.set('Content-Type', 'text/csv');
            console.log(csv);
            res.status(200).send(csv);
        }); */
        //let results = [];
        /* for(let i = 0; i < internshipStatusItems.length; i++)
        {
            ((internshipStatusItem) => {StudentInternship.updateOne({_id:internshipStatusItem._id}, { $set: internshipStatusItem}, 
            function (err, project) {
                console.log('calling: ', project)
                if (err) {				
                    return res.status(400).json(err)
                }
                results.push(internshipStatusItem);
                res.status(200).json(results)
            })})(internshipStatusItems[i])
        } */

        
        
    })
    
    // DELETE: Deletes one doc...
	router.delete('/internships/:id', function (req, res) {
		//console.log(typeof(JSON.parse(req.params.id)));
		//console.log(Array.isArray(Array(req.params.id)));
		console.log("proposal: ", req.params.id);
		
        StudentInternship.deleteOne({_id:req.params.id}, function (err, project) {
			if (err) {				
				return res.status(400).json(err)
			}
			res.status(200).json({_id: req.params.id});
        })
        
    })
    
    // DELETE: Deletes one doc...
	router.delete('/internship/applications/:ids', function (req, res) {
		//console.log(typeof(req.params.ids), req.params.ids);
		let ids = JSON.parse(req.params.ids);
		//console.log("deleteproposals: ", ids);
        StudentInternship.deleteMany({_id:{$in: ids}}, function (err, project) {
			if (err) {
				return res.status(400).json(err)
			}
			res.status(200).json(JSON.parse(req.params.ids));
		})
		
	})


}