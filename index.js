var express = require("express");
var app = express();
var fs = require("fs");
//var dt = require('/utils')
var MongoClient = require('mongodb').MongoClient;
var url = require("url")
var mongo_url = 'mongodb://localhost:27017';

const COLLECTION_NAME = "customers"

var dbo = null;

MongoClient.connect(mongo_url, function(err, db) 
        {
             dbo = db.db("skyteam");

         
            if( dbo.namespace === "skyteam" )
                console.log("DB Connected!");
            else
            console.log("Service Unavailable");

           // return res.end();
        });
  //  });


app.listen(3000, () => {
 console.log("Server running on port 3000");
});

// this is the old way of setting up routes
app.get("/", (req, res, next) => 
{
    fs.readFile('index.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
      });
});

// this is the old way of setting up routes
app.get("/sayhello", (req, res, next) => 
{
    res.send("Hello World");     // no need to set content type, res.send() works out type from args passed in and sends header
    return res.end();
});

// this is the old way of setting up routes
app.get("/sayhello-with-status", (req, res, next) => 
{
    // if you uncomment the line below, you will get the error "[ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client"
    // this is because the second send() is also setting the header, so it is being set twice before the end() call
    //res.status(200).send("Selvyn says - ");
    res.status(404).send("Hello World with status");    // no need to set content type, res.send() works out type from args passed in and sends header
    return res.end();
});

// the express way of setting up routes
app.route("/users")
    .get(function(req, res, next)
    {
        res.writeHead(200, {'Content-Type': 'text/html'});  // When using res.write() you must send the header options
        process.stdout.write("Test\n");     // this writes out to the terminal where you ran the program from
        res.write("Listing all users");     // this writes back to the client browser but does send http header
        return res.end();    
    });

    // app.route("/db-connect")
    // .get(function(req, res, next)
    // {
    //     MongoClient.connect(url, function(err, db) 
    //     {
    //          dbo = db.db("skyteam");

         
    //         if( dbo.namespace == "skyteam" )
    //             res.status(200).send("DB Connected!");
    //         else
    //             res.status(503).send("Service Unavailable");

    //         return res.end();
    //     });
    // });

    app.get("/list-all-customers", (req, res, next) =>
    {
    var query = {"_id" : "1"}    
    cursor = dbo.collection(COLLECTION_NAME).find( query );

    res.writeHead(200, {'Content-Type': 'text/html'});

    cursor.each(function(err, doc)
    {
        if( doc !== null)
        {
            sent = true;
            res.write(JSON.stringify(doc) );
            console.log(doc);
            console.log("===================================================================");
        }
        else
            res.end();
    });
});


app.get("/list-customer-by/", (req, res, next) =>
    {
    var q = url.parse(req.url, true);
    

    var p_id = q.query.cid 
    var query = {"_id" : p_id}    
    cursor = dbo.collection(COLLECTION_NAME).find( query );

    res.writeHead(200, {'Content-Type': 'text/html'});

    cursor.each(function(err, doc)
    {
        if( doc !== null)
        {
            sent = true;
            res.write(JSON.stringify(doc) );
            console.log(doc);
            console.log("===================================================================");
        }
        else
            res.end();
    });
});





    



//     var MongoClient = require('mongodb').MongoClient;
// var url = 'mongodb://localhost:27017';

// MongoClient.connect(url, function(err, db) {

//     var dbo = db.db("skyteam");
//     var cursor = dbo.collection('customers').find();

//     cursor.each(function(err, doc) {

//         console.log(doc);

//     });
// }); 