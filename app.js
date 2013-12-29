
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var item = require('./routes/item');
var http = require('http');
var path = require('path');
var mongo = require('mongodb');
var monk = require('monk'); 
var nodemailer = require('nodemailer'); 

var app = express();
var db = monk('localhost:27017/items'); 
var smtp = nodemailer.createTransport("SMTP", { 
	service: "Gmail", 
	auth: { 
		user: "", 
		pass: ""
	}
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// app.get('/', routes.index);
app.get('/', routes.itemlist(db));
app.get('/itemlist', routes.itemlist(db)); 
app.get('/newitem', routes.newitem);
app.post('/additem', routes.additem(db));
app.post('/wantitem', routes.wantitem(db));
app.post('/notifyseller', routes.notifyseller(db, smtp));
// app.get('/users', user.list);
// app.post('/search', routes.search(db));
// need to be able to delete an item  -- clear after certain number of days? 


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
