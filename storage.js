"use strict"

var mongo = require("mongodb");
var mongoUrl = require("./credential.js").mongoUrl;
var ObjectID = require('mongodb').ObjectID;

//given an url returns ashorter version
function mongoInsert(url, callBack){
    
  //open the database
  mongo.connect(mongoUrl, function (err, db){
    if (err) throw err;
      
    //open the collection
    var collection = db.collection("shorturl")
    
    //search the url in the database
    collection.find({
      url : url
    }).toArray(function(err, documents){
      if (err) throw err;
      console.log(documents);
      // if the url is new, create a new entry
      if (documents.length == 0){
        var doc = {
          url : url
        }
        collection.insert(doc, function(err, data){
          if (err) throw err;
          var result = {
            url : data.ops[0].url,
            shortUrl : "https://mhl-shorturl.glitch.me/" + data.ops[0]._id
          }
          callBack(result)
          db.close()
        })
      } else {
        // if the url is already in the database, return it
        var result = {
          url : documents[0].url,
          shortUrl : "https://mhl-shorturl.glitch.me/" + documents[0]._id
        }
        callBack(result);
        db.close();
      }
      
    })

})
}//end mongoInsert

//given a short url redirect to the original one
function mongoOriginal(shortUrl, callBack){
  console.log("checkgin for " + shortUrl);
  //open the database
  mongo.connect(mongoUrl, function (err, db){
    if (err) throw err;
      
    //open the collection
    var collection = db.collection("shorturl")
  
    //search for the url
    collection.find({
      "_id": ObjectID(shortUrl)
    }).toArray(function(err, documents){
      console.log(documents);
      if (err) throw err
      if (documents.length == 0){
        console.log("not a valid url");
        db.close();
      } else {
        var result = documents[0].url;
        callBack(result);
        db.close();
      }
    })    
  })
                }

module.exports = {
  mongoInsert : mongoInsert,
  mongoOriginal : mongoOriginal
}