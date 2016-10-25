var express = require('express');
var app = express();

// parses json, x-www-form-urlencoded, and multipart/form-data
var bodyParser = require('body-parser');
app.use(bodyParser());

// parses request cookies to req.cookies
var cookieParser = require('cookie-parser');

app.get('/', function(req, res){ 
	if (req.cookies.remember) {
		res.send('Запомнили :) Кликните чтобы <a href="/forget">забыть</a>!');
	} else {
		res.send('<form method="post">'
			+ '<label><input type="checkbox" name="remember"/> запомнить меня</label> '
			+ '<input type="submit" value="Отправить"/></form>');
	}
});

app.post('/', function(req, res){
	if (req.body.remember) 
		res.cookie('remember', 'dom', {maxAge: 60 * 1000});
	res.redirect('back');
});

app.get('/forget', function(req, res){
	res.clearCookie('remember');
	res.redirect('back');
});

app.listen(8080);
console.log('Express started on port %d', 8080);
