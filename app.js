
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user'),
  	news = require('./routes/news')
  , http = require('http')
  , path = require('path')
  , db = require('./db/db')
  , newsService = require('./service/news');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
app.get('/creeper', routes.getBlog);
app.get('/users', user.list);
app.post('/queryNewsList', news.queryNewsList);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

//mongoose.init();

db.start();

//抓取新闻列表
setInterval(function(){
	newsService.saveNewsList();
}, 1000*60*10);
