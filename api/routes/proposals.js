const Proposal = require('../../models/proposal')

const userData = require("./../../users");

module.exports = function (router) {
    
    // GET: List of active projects
	router.get('/internship/proposals', function (req, res) { 
		console.log(req.query);
		/* college: [],
                profile: [],
                program: [],
                department: [],
                cgpaRange: [0,100],
                percentileRange: [0,100] */
		//{ _id: { $in: [ 5, ObjectId("507c35dd8fada716c89d0013") ] }
		let dt = new Date();

		let objFilters = {}
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
		/* if(req.query.college){
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
		} */

		const queryFilter = (userData.role=="company") ? { companyId: userData.user._id} : {};
		
		Proposal.find(objFilters)
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
	router.post('/internship/proposals', function (req, res) {
		let proposal = new Proposal(req.body)
		console.log(req.body);
		proposal.save(function (err, project) {
			if (err) {				
				return res.status(400).json(err)
			}
			res.status(200).json(project)
		})
    })

    // PUT: Updates existing one doc...
	router.put('/internship/proposals', function (req, res) {
		
		Proposal.updateOne({_id:req.body._id}, req.body, function (err, project) {
			if (err) {				
				return res.status(400).json(err)
			}
			res.status(200).json(req.body)
        })
        
    })
    
    // DELETE: Deletes one doc...
	/* router.delete('/proposal/:id', function (req, res) {
		//console.log(typeof(JSON.parse(req.params.id)));
		//console.log(Array.isArray(Array(req.params.id)));
		console.log("proposal: ", req.params.id);
		
        Proposal.deleteOne({_id:req.params.id}, function (err, project) {
			if (err) {				
				return res.status(400).json(err)
			}
			res.status(200).json({_id: req.params.id});
        })
        
    }) */
    
    // DELETE: Deletes one doc...
	router.delete('/internship/proposal/:ids', function (req, res) {
		//console.log(typeof(req.params.ids), req.params.ids);
		
		let ids = JSON.parse(req.params.ids);

		console.log(ids)
		//console.log("deleteproposals: ", ids);
        Proposal.deleteMany({_id:{$in: ids}}, function (err, project) {
			if (err) {
				return res.status(400).json(err)
			}
			res.status(200).json(req.params.ids);
		})
		
	})


}