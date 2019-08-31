const Company = require('../../models/company')

const userData = require("./../../users");

module.exports = function (router) {
    
    // GET: List of active projects
	router.get('/companies', function (req, res) { 

		Company.find({})
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
	router.post('/companies', function (req, res) {
		let company = new Company(req.body)
		company.save(function (err, project) {
			if (err) {				
				return res.status(400).json(err)
			}
			res.status(200).json(project)
		})
    })

    // PUT: Updates existing one doc...
	router.put('/companies', function (req, res) {
		
		Company.updateOne({_id:req.body._id}, req.body, function (err, project) {
			if (err) {				
				return res.status(400).json(err)
			}
			res.status(200).json(req.body)
        })
        
    })
    
    // DELETE: Deletes one doc...
	router.delete('/companies/:id', function (req, res) {
		
        Company.deleteOne({_id:req.params.id}, function (err, project) {
			if (err) {				
				return res.status(400).json(err)
			}
			res.status(200).json({_id: req.params.id});
        })
        
    })

}