
var express=require('express');
var session = require('express-session');
const bodyParser = require('body-parser');
var ejs = require('ejs');
const sqlite3 = require('sqlite3');
const db =  new sqlite3.Database('asset1/ehd.db');


var app=express();
const port = process.env.PORT ||  5020;


app.set('port', process.env.port || port); // set express to use this port
//app.set('views', __dirname + '\\vws'); // set express to look in this folder to render our view

app.set('views',__dirname + '/vws');

app.use(session({secret: 'secret',resave: true,saveUninitialized: true}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client

app.use(express.static(__dirname, + '/public')); // configure express to use public folder

app.set('view engine', 'ejs');

var pageinfo = {title: 'My page', info:'',
                'word' : '', 'tf' : 'Meaning', 'meaning' : '', 'field' : false}


app.get('/', function(req, res) {
  //response.sendFile(path.join(__dirname + '/login.html'));
  res.render('mydictpages/tindex.ejs' , {spinfo: pageinfo});
  pageinfo.tf = "Take another";
  
});



app.post('/redmysubmit', function(req, res){
    //redirword = req.body.word; 
    pageinfo.title = "My meaning"
    //return res.render('/redirmean.html', ''); 

    res.render('mydictpages/redirmean', {spinfo: pageinfo,});

    
  });

  app.post('/backto', function(req, res){
    //redirword = req.body.word; 
    pageinfo.title = "My Dictionary"
    pageinfo.tf = "Take another";
    //return res.render('/redirmean.html', ''); 

    res.render('mydictpages/tindex', {spinfo: pageinfo,});

    
  });



  app.post('/wordsave', function(req, res){
    var redirword = req.body; 
    pageinfo.title = "My Dictionary"
    pageinfo.tf = "Updated Successfully !!!";

    //console.log(req);
    var finalmean = req.body.savemeaning
      //res.render('mydictpages/tindex', {spinfo: pageinfo,});
    //return res.render('/redirmean.html', ''); 

    ////////////////////////////////////////////
   
    db.all('INSERT INTO dict (word, meaning) VALUES ("'+pageinfo.word+'","'+finalmean+'")', function (error, rows){
      res.end(JSON.stringify(rows));
    })
    ///////////////////////////////////////////

    res.render('mydictpages/tindex', {spinfo: pageinfo,});

    
  });






app.get('/mykeyupsubmit', function(req, res){
    var rlword = req.query.word; 
    pageinfo.word = rlword;
    db.all('SELECT meaning FROM dict WHERE word LIKE "'+rlword+'%" LIMIT 15', function (error, rows){
    res.end(JSON.stringify(rows));
    })
    
});
var server=app.listen(port,function(){});

module.exports = app;