var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/";
var ObjectId = require('mongoose').Types.ObjectId; 



MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("ucsconnect");
  /* dbo.collection('proposals').find({ _id: ObjectId("5d5e39d339991ec372567e44")}).toArray(function(err, res) {
    if (err) throw err;
    console.log(res);
    db.close();
  }); */
 
   /* dbo.collection('proposals').aggregate([
    { $lookup:
       {
         from: 'studentinternships',
         localField: '_id',
         foreignField: 'proposalId',
         as: 'proposals'
       }
     },
     { $unwind : "$proposals" },
     { $match : {"proposals.studentId": "5d5bfb22247023acc08e0999"}}
    ]).toArray(function(err, res) {
    if (err) throw err;
    console.log(res.length);
    db.close();
  });  */

  /* dbo.collection('studentinternships').aggregate([
    { $lookup:
       {
         from: 'students',
         localField: 'studentId',
         foreignField: '_id',
         as: 'student'
       }
     }
    ]).toArray(function(err, res) {
    if (err) throw err;
    console.log(res);
    db.close();
  }); */


/* dbo.collection('proposals').aggregate([
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
        from: 'studentinternships',
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
        companyName: "$company.name",
        companyLogo: "$company.logo",
        internshipId: "$internship._id",
        status: "$internship.status",
        hasAccepted: "$internship.hasAccepted",
        appliedOn: "$internship.appliedOn",
        resumeSubmitted: "$internship.resumeSubmitted"
    }
//url : {$addToSet : "$url"}
  }, {
    $group: {
      _id: "$_id",
      internshipId: { $first: "$internshipId" },
      companyName: { $first: "$companyName" },
      profile: { $first: "$profile" },
      stipend: { $first: "$stipend" },
      applications: { $sum: 1 },
      selected: { $sum: { "$cond": { if: { $eq: ["$status", "REJECTED"] }, then: 1, else: 0 } } }
    }
  } 
  ]) .toArray(function(err, res) {
  if (err) throw err;
  console.log(res);
  db.close();
}); */

/* dbo.collection('students').aggregate([
  
        {
          $lookup:
          {
           
              from: 'studentinternships',
              localField: '_id',
              foreignField: 'studentId',
              as: 'internship'
          
          }
      },
  { $unwind: '$internship' },{
    $project:
    {
        _id: 1,
        name: 1,
        status: "$internship.status",
        internshipId: "$internship._id",
        approvalStatus: "$internship.approvalStatus",
        proposalId: "$internship.proposalId"
    }
  },{
    $lookup:
    {
        from: 'proposals',
        localField: 'proposalId',
        foreignField: '_id',
        as: 'proposal'
    }
},
{ $unwind: '$proposal' },{
  $project:
  {
      _id: 1,
      name: 1,
      internshipId: 1,
      approvalStatus: 1,
      proposalId: 1,
      profile: "$proposal.profile",
      companyId: "$proposal.companyId"
  }
},{
  $lookup:
  {
      from: 'companies',
      localField: 'companyId',
      foreignField: '_id',
      as: 'company'
  }
},
{ $unwind: '$company' }
        ]) .toArray(function(err, res) {
  if (err) throw err;
  console.log(res);
  db.close();
}); */



  
  /* dbo.collection('proposals').aggregate([
    { $lookup:
       {
         from: 'studentinternships',
         localField: '_id',
         foreignField: 'proposalId',
         as: 'proposals'
       }
     },
     {
         "$addFields": {
             "proposals": {
                 "$arrayElemAt": [
                     {
                         "$filter": {
                             "input": "$proposals",
                             "as": "proposal",
                             "cond": {
                                 "$eq": [ "$$proposal.studentId", "5d5fd469727dd7e6b6c119d7" ]
                             }
                         }
                     }, 0
                 ]
             }
         }
     }
    ]) .toArray(function(err, res) {
    if (err) throw err;
    console.log(res);
    db.close();
  });*/

  /* dbo.collection('studentinternships').find({}).toArray(function(err, res) {
    if (err) throw err;
    console.log(res);
    db.close();
  }); */


  /* dbo.collection('proposals').aggregate([
    { $match : {"_id": ObjectId("5d5ffec2584f7be814ee7dc5")}}]) .toArray(function(err, res) {
      if (err) throw err;
      console.log(res);
      db.close();
    }); */
});