var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/* Add Mongoose for using Mongo as Database */

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/schoolApp',  { useMongoClient: true })
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));
  var db = mongoose.connection;

//use sessions for tracking logins
app.use(session({
  secret: 'Math.random()',
  resave: true,
  saveUninitialized: false,
  cookie:{maxAge:6000000},
  store: new MongoStore({
    mongooseConnection: db
  })
}));

//set express to use Static resources
app.use(express.static('public'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/views', express.static(__dirname + '/views'));

// include routes
var routes = require('./routes/router');
app.use('/', routes);

app.listen(3000, function(){
   console.log("First API running on Port 3000 !"); 
});