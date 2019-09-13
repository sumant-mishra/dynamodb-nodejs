var ObjectId = require('mongoose').Types.ObjectId;
const Student = require('../../../models/student');


const userData = require("../../../users");

const getStudents = function (req, res) {

    Student.find({})
        .exec()
        .then(docs => res.status(200)
            .json(docs))
        .catch(err => res.status(500)
            .json({
                message: 'Error finding proposals',
                error: err
            }))
}

const addNewStudent = function (req, res) {
    let student = new Student(req.body)
    student.save(function (err, project) {
        if (err) {
            return res.status(400).json(err)
        }
        res.status(200).json(project)
    })
}


const updateStudent = function (req, res) {

    Student.updateOne({ _id: req.body._id }, req.body, function (err, project) {
        if (err) {
            return res.status(400).json(err)
        }
        res.status(200).json(req.body)
    })

}

const deleteStudent = function (req, res) {

    Student.deleteOne({ _id: req.params.id }, function (err, project) {
        if (err) {
            return res.status(400).json(err)
        }
        res.status(200).json({ _id: req.params.id });
    })

}


module.exports = {
    getStudents,
    addNewStudent,
    updateStudent,
    deleteStudent
}
