var express = require('express');
var app = express();

// parses request cookies to req.cookies
var cookieParser = require('cookie-parser');
//шифруем куки
app.use(cookieParser('l10boe slovo'));

// use req.session as data store
var session = require('cookie-session')
app.use(session({keys: ['secret']}));

app.use(function (req, res, next) {
	var n = req.session.views || 0;
	req.session.views = ++n;
	//устанавливаем кукик signed: true --шифровка
console.log(item);
	res.cookie('name', 'mounik', { signed: true, maxAge: 60 * 1000});
	res.end(n + ' views');
});

app.listen(8080);
console.log('Express started on port %d', 8080);
