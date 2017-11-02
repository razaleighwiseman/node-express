var mongoose = require('mongoose'),
    pg = require('pg'),
    express = require('express'),
    morgan  = require('morgan'),
    cors = require('cors'),
    config = require('./config/database'),
    passport = require('passport'),
    routes = require('./routes/routes'),
    pgroutes = require('./routes/pgroutes'),
    mysqlroutes = require('./routes/mysqlroutes'),
    bodyParser = require('body-parser'); 

//express https
    var fs = require('fs'),
    https = require('https');

// connect to mongo
mongoose.connect(config.database);
mongoose.connection.on('open', function () {
 
    console.error('mongo is open');
    var app = express();
    app.use(cors());
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
// Serve static files
    app.use(express.static(__dirname + '/public'));
    app.use(routes);
    app.use(pgroutes);
    app.use(mysqlroutes);
    app.use(passport.initialize());
    require('./config/passport')(passport);
 
    app.listen(4444, function (err) {
       console.log('Server is running')
            });
    https.createServer({
      key: fs.readFileSync('../../key.pem'),
      cert: fs.readFileSync('../../cert.pem'),
      secure: true
    }, app).listen(3333);
 
        });
