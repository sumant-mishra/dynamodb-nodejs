var ObjectId = require('mongoose').Types.ObjectId;
const University = require('../../../models/university');


const userData = require("../../../users");

const getUniversities = function (req, res) {

    University.find({})
        .exec()
        .then(docs => res.status(200)
            .json(docs))
        .catch(err => res.status(500)
            .json({
                message: 'Error finding proposals',
                error: err
            }))
}

const addNewUniversity = function (req, res) {
    let university = new University(req.body)
    university.save(function (err, project) {
        if (err) {
            return res.status(400).json(err)
        }
        res.status(200).json(project)
    })
}


const updateUniversity = function (req, res) {

    University.updateOne({ _id: req.body._id }, req.body, function (err, project) {
        if (err) {
            return res.status(400).json(err)
        }
        res.status(200).json(req.body)
    })

}

const deleteUniversity = function (req, res) {

    University.deleteOne({ _id: req.params.id }, function (err, project) {
        if (err) {
            return res.status(400).json(err)
        }
        res.status(200).json({ _id: req.params.id });
    })

}


module.exports = {
    getUniversities,
    addNewUniversity,
    updateUniversity,
    deleteUniversity
}
