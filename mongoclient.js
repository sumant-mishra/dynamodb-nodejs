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

  dbo.collection('studentinternships').aggregate([
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
  });

  
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