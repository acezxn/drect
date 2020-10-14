const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
var mongo = require('mongodb');
const fs = require('fs');

var MongoClient = mongo.MongoClient;
// var url = "mongodb://localhost:27017/db";
var user_url = "mongodb+srv://user:Daniel@cluster0.2k6zl.mongodb.net/db?retryWrites=true&w=majority"
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());
MongoClient.connect(user_url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db('db');
  dbo.createCollection("urls", function(err, res) {
    // if (err) throw err;
    console.log("Collection created!");

    // db.close();
  });
  router.get('/', (req, res, next) => {
    res.writeHead(200, {
          'Content-Type': 'text/html'
    });
    fs.readFile('./index.html', null, function (error, data) {
          if (error) {
              res.writeHead(404);
              res.write('Whoops! File not found!');
          } else {
              res.write(data);
          }
          // res.end();
      });
    dbo.collection("urls").find({}).toArray( function(err, result) {
      res.write('<table style="background-color:#101010">');
      res.write("<tr>");
      res.write("<th>Parameter</th>");
      res.write("<th>URL</th>");
      res.write("</tr>");

      for (var i = 0; i < result.length;i++) {
        console.log(result[i]);
        res.write("<tr>");
        res.write("<td>" + result[i].name + "</td>");
        res.write("<td>" + result[i].url + "</td>");
        res.write("</tr>");
      }
      res.write("</table>");
      res.write("</body></html>");
      res.end();
    });

  });
});

router.get('/:attb', (req, res, next) => {
  const id = req.params.attb;
  MongoClient.connect(user_url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
  // if (err) throw err;
  console.log(db);
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
  var url = "mongodb+srv://" + req.body.user +":" + req.body.passwd + "@cluster0.2k6zl.mongodb.net/db?retryWrites=true&w=majority"
  console.log(url);

    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
    if (err) {
      console.log("error");

      res.status(500).json({
        error: "Auth failed"
      });
      return;
    }
    var dbo = db.db("db");
    dbo.collection("urls").find({"name": req.body.name}).toArray( function(err, result) {
      if (result.length == 0) {
        var myobj = { name: req.body.name, url: req.body.url };
        dbo.collection("urls").insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
        res.status(200).json({
          message: 'put',
          name: req.body.name,
          url: req.body.url
        });
      } else {
        res.status(500).json({
          error: "name used"
        });
      }
    });

  });


  // } else {
  //   res.status(200).json({
  //     error: 'Authorization failed'
  //   });
  // }

});

module.exports = router;
