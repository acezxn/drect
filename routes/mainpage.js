const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017/db";
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db('db');
  dbo.createCollection("urls", function(err, res) {
    // if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});
router.get('/', (req, res, next) => {
  res.status(200).json({
    results: 'the mainpage'
  });

});
router.get('/:attb', (req, res, next) => {
  const id = req.params.attb;
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
  // if (err) throw err;
  var dbo = db.db("db");
  dbo.collection("urls").find({"name": id}).toArray( function(err, result) {
    if (result.length == 0) {
      res.status(200).json({
        error: "not found"
      });
    } else {
      res.redirect(301, result[0].url)
    }
    // res.status(200).json({
    //   results: result[0].url
    // });
    db.close();
  });
});
});

router.put('/', (req, res, next) => {
  console.log(req.body);
  if (req.body.user == "Daniel" && req.body.passwd == "Daniel") {
    const product = {
      name: req.body.name,
      number: req.body.number
    };

    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("db");
    var myobj = { name: req.body.name, url: req.body.url };
    dbo.collection("urls").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });

    res.status(200).json({
      message: 'put',
      prod: product
    });
  } else {
    res.status(200).json({
      error: 'Authorization failed'
    });
  }

});

module.exports = router;
