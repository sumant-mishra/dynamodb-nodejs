const Student = require('../../models/student')

const userData = require("./../../users");

module.exports = function (router) {
    
    // GET: List of active projects
	router.get('/students', function (req, res) { 

		Student.find({})
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
	router.post('/students', function (req, res) {
		let student = new Student(req.body)
		student.save(function (err, project) {
			if (err) {				
				return res.status(400).json(err)
			}
			res.status(200).json(project)
		})
    })

    // PUT: Updates existing one doc...
	router.put('/students', function (req, res) {
		
		Student.updateOne({_id:req.body._id}, req.body, function (err, project) {
			if (err) {				
				return res.status(400).json(err)
			}
			res.status(200).json(req.body)
        })
        
    })
    
    // DELETE: Deletes one doc...
	router.delete('/students/:id', function (req, res) {
		
        Student.deleteOne({_id:req.params.id}, function (err, project) {
			if (err) {				
				return res.status(400).json(err)
			}
			res.status(200).json({_id: req.params.id});
        })
        
    })

}