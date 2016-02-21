/**
 * Module dependencies.
 */

// mongoose setup
require( './db' );

var express        = require( 'express' );
var http           = require( 'http' );
var path           = require( 'path' );
var mongoose       = require( 'mongoose' );
var passport       = require( 'passport' );
var flash          = require( 'connect-flash' );
var engine         = require( 'ejs-locals' );
var favicon        = require( 'serve-favicon' );
var cookieParser   = require( 'cookie-parser' );
var bodyParser     = require( 'body-parser' );
var methodOverride = require( 'method-override' );
var logger         = require( 'morgan' );
var errorHandler   = require( 'errorhandler' );
var session        = require( 'express-session' );
var static         = require( 'serve-static' );
var geohash        = require("geohash").GeoHash;
var LocalStrategy  = require('passport-local').Strategy;

var app    = express();
var routes = require( './routes' );

var port   = 8080;

// set up our express application
app.use(logger('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // if user is in the session, carry on
  if (req.session && req.session.authorized)
      return next();
  // if they aren't redirect them to the login page
  res.redirect('/login');
}

// Routes
app.get('/', isLoggedIn, routes.index);
app.get('/login', routes.login);
app.post('/login', routes.loginPost);
app.get('/signup', routes.signup);
app.post('/signup', routes.signupPost);
app.get('/logout', isLoggedIn, routes.logout);
app.get('/todo/create', isLoggedIn, routes.todoCreate);
app.post('/todo/add', isLoggedIn, routes.todoPost);
app.get('/todo/edit/:todoId', isLoggedIn, routes.todoEdit);
app.post('/todo/update/:todoId', isLoggedIn, routes.todoUpdate);


app.use( static( path.join( __dirname, 'public' )));

// development only
if( 'development' == app.get( 'env' )){
  app.use( errorHandler());
}

app.all('*', function(req, res){
  res.status(404).send();
})

http.createServer( app ).listen( port, function (){
  console.log( 'Express server listening on port ' + port);
});
