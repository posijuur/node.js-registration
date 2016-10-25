var express = require('express');
var app = express();

var Sync = require('sync');

var registrate = require('./models/tasks');

var path = require('path');

// parses request cookies to req.cookies
var cookieParser = require('cookie-parser');
app.use(cookieParser());

// parses json, x-www-form-urlencoded, and multipart/form-data
var bodyParser = require('body-parser');
app.use(bodyParser());

// use req.session as data store
var session = require('cookie-session');
app.use(session({keys: ['secret']}));

var templates = require('consolidate');
app.engine('hbs', templates.handlebars);
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, '/views')));

// authentication middleware
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

var userNameLocal = null;
var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
	function(username, password, done) {
		console.log('local');
		var searchUser = null;	
		var searchUserPassword = null;
		registrate.searchUser(username, function(err, result) {
			if (err) {
				console.log('searchUser');
				connection.release();
				throw err;
			}
			console.log('result '+ result);
			searchUser = result[0].login;

			if (username == searchUser) {
				registrate.searchUserPassword(password, function(err, result) {

					if (err) {
						console.log('searchUserPassword');
						connection.release();
						throw err;
					}
					console.log('resultppp '+ result);
					searchUserPassword = result[0].password;

					if (password == searchUserPassword){ 
						userNameLocal = searchUser;
						return done(null, {username: 'admin'}); 
					} else {
						
						return done(null, false, {message: 'Неверный пароль'});
					}
				})
			} else {
				return done(null, false, {message: 'Неверный логин'});
			}
		});
	}
));

passport.serializeUser(function(user, done) {
	setTimeout(function() {
	console.log('username: '+userNameLocal);
	// registrate.searchUser(username, function(err, result) {
	// 	console.log('searchUser!!!!');
	// 	if (err) {
	// 		console.log('searchUser');
	// 		connection.release();
	// 		throw err;
	// 	}
	// 	console.log(result);
	// 	console.log(result.RowDataPacket);
	// 	// console.log(result.RowDataPacket.login);
	// 	console.log(result[0]);
	// 	console.log(result[0].login);
	// 	console.log('result111: ' + result);
	// 	console.log('result! '+ result.login);
		
	// done(null, result[0].login);
	// });
	done(null, userNameLocal);
}, 2000);
});

passport.deserializeUser(function(id, done) {
	console.log('deserial '+ id);
	done(null, {user: id});
});

var auth = passport.authenticate(
	'local', {
		successRedirect: '/user',
		failureRedirect: '/login'
	}
);

app.get('/login', function(req, res) {
	console.log(req.session);
	req.session = null;
	res.render('form');
});

app.get('/register', function(req, res) {
	console.log(req.body);
	res.render('registrate');
});

app.get('/', auth);

app.post('/login',auth);
app.post('/register', function(req, res) {
	registrate.createTable(req.body.username);
	console.log('req.body' + req.body);
	console.log('req.body.username '+ req.body.username);
	registrate.addUserInfo(req.body.username, req.body.password);
	userNameLocal = req.body.username;
	req.logIn(req.body.username, function(err) {
        if (err) { throw err; }
		return res.redirect('/user');
    });
});

var mustBeAuthenticated = function (req, res, next) {
	req.isAuthenticated() ? next() : res.redirect('/');
};

app.all('/user', mustBeAuthenticated);
app.all('/user/*', mustBeAuthenticated);

app.get('/user', function(req, res) {
	
		console.log(req.session.passport.user);
		console.log('list');
		console.log("req.session" + req.session);
		registrate.listDateUser(req.session.passport.user, function(err, tasks) {
			if (err) 
				console.log('fffffffffff:' + err);;
			res.render(
				'tasks.hbs', 
				{tasks: tasks},
				function(err, html) {
					if (err) 
						throw err;
					console.log('html :'+ html);
					res.render('layout.hbs', {
						content: html
					});
				}
			)
		});
	
	
});

app.post('/user', function(req, res) {
	var redirectSait = res.redirect('/user');
	if (req.body.submit == 'Готово') {
		if (req.body.delete) {
			registrate.deleteTask(req.body.delete, userNameLocal);
			redirectSait;
		} else {
			registrate.changeTask(req.body.change, req.body.text, userNameLocal);
			redirectSait;
		}
	} else {
		console.log(1);
		console.log(req.body.task);
		registrate.addTask(req.body.task, userNameLocal);
		redirectSait;
	};
});

app.get('/user/settings', function(req, res) {
	res.send(200, 'Secret place');
});

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

app.listen(8080);
console.log('Express started on port %d', 8080);
