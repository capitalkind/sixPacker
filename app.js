var express       = require('express'),
    bodyParser    = require('body-parser'),
    cookieParser  = require('cookie-parser'),
    mongoose      = require('mongoose'),
    favicon       = require('serve-favicon');

var app           = express();

require('dotenv').load()

app.use(express.static('./client'));
app.set('views', __dirname + '/client/views')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(favicon(__dirname + '/client/public/images/favicon.ico'));

var mongoPath = process.env.MONGOLAB_URI || 'mongodb://localhost/sixpacker-01';
mongoose.connect(mongoPath);

app.get('/', function(req, res){
  res.sendFile( __dirname + '/client/views/index.html');
})

var indexRouter = require('./server/routers/index')
app.use('/', indexRouter);

var usersRouter = require('./server/routers/usersRouter');
app.use('/api/users', usersRouter);

var packsRouter = require('./server/routers/packsRouter')
app.use('/api/packs', packsRouter);


var port = process.env.PORT || 2000;
app.listen(port, function(){
  console.log('...listening on port ' + port);
})
