var ObjectId = require('mongoose').Types.ObjectId;
const Guide = require('../../../models/guide');


const userData = require("../../../users");

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

const addNewGuide = function (req, res) {
    let guide = new Guide(req.body)
    guide.save(function (err, project) {
        if (err) {
            return res.status(400).json(err)
        }
        res.status(200).json(project)
    })
}


const updateGuide = function (req, res) {

    Guide.updateOne({ _id: req.body._id }, req.body, function (err, project) {
        if (err) {
            return res.status(400).json(err)
        }
        res.status(200).json(req.body)
    })

}

const deleteGuide = function (req, res) {

    Guide.deleteOne({ _id: req.params.id }, function (err, project) {
        if (err) {
            return res.status(400).json(err)
        }
        res.status(200).json({ _id: req.params.id });
    })

}


module.exports = {
    getGuides,
    addNewGuide,
    updateGuide,
    deleteGuide
}
