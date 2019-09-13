var ObjectId = require('mongoose').Types.ObjectId;
const Company = require('../../../models/company');


const userData = require("../../../users");

const getCompanies = function (req, res) {

    Company.find({})
        .exec()
        .then(docs => res.status(200)
            .json(docs))
        .catch(err => res.status(500)
            .json({
                message: 'Error finding proposals',
                error: err
            }))
}

const addNewCompany = function (req, res) {
    let company = new Company(req.body)
    company.save(function (err, project) {
        if (err) {
            return res.status(400).json(err)
        }
        res.status(200).json(project)
    })
}


const updateCompany = function (req, res) {

    Company.updateOne({ _id: req.body._id }, req.body, function (err, project) {
        if (err) {
            return res.status(400).json(err)
        }
        res.status(200).json(req.body)
    })

}

const deleteCompany = function (req, res) {

    Company.deleteOne({ _id: req.params.id }, function (err, project) {
        if (err) {
            return res.status(400).json(err)
        }
        res.status(200).json({ _id: req.params.id });
    })

}


module.exports = {
    getCompanies,
    addNewCompany,
    updateCompany,
    deleteCompany
}
