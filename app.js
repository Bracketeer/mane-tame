require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const multer = require('multer');
const compression = require('compression');
const spdy = require('spdy');
const fs = require('fs');
// // Connect to database
mongoose.connect(process.env.DB, { useNewUrlParser: true });

// On Database Connection
mongoose.connection.on('connected', () => {
    console.log('Connected to database ' + process.env.DB);
  });
  
// On Database Error
mongoose.connection.on('error', (err) => {
    console.log('Database Error: ' + err);
});

// Initialize app using express
const app = express();

app.use(compression());

if (process.env.ENV === 'test' || process.env.ENV === 'prod') {
  app.all('*', ensureSecure);
  
  function ensureSecure(req, res, next){
    if(req.secure){
      return next();
    };
    res.redirect('https://' + req.hostname + req.url);
  }
}

const users = require('./server/routes/users');

//Set static folder
app.use(express.static(path.join(__dirname, 'dist/ngBoilerplate')));

// app.use('/uploads', express.static(__dirname + '../uploads'));

const router = express.Router();

app.use(require('helmet')());
app.disable('x-powered-by');

// CORS Middleware
app.use(cors());

app.use('user', function(req, res, next) {
  var allowedOrigins = ['http://localhost:3000', 'http://localhost:4200'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header('Content-Type', 'application/json');

  next();
});

// Body Parser Middleware
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);

// Index Route
app.use('*', (req, res) => {
  res.sendFile(path.resolve(path.join(__dirname, 'dist/ngBoilerplate/index.html')));
});



// Start Server
if (process.env.ENV === 'prod') {
  const keycert = {
    key  : fs.readFileSync(process.env.SSLKEY),
    cert : fs.readFileSync(process.env.SSLCERT)
  };
  spdy.createServer(keycert, app).listen(process.env.PORT, () => {
    console.log('Server started on port ' + process.env.PORT);
  });
  app.listen(80, () => {
    console.log('Server Started on port ' + process.env.PORT);
  });
} else if (process.env.ENV === 'test') {
  const keycert = {
    key  : fs.readFileSync(process.env.SSLKEY),
    cert : fs.readFileSync(process.env.SSLCERT)
  };
  spdy.createServer(keycert, app).listen(process.env.PORT, () => {
    console.log('Server started on port ' + process.env.PORT);
  });
  app.listen(80, () => {
    console.log('Server Started on port ' + process.env.PORT);
  });
} else {
  app.listen(process.env.PORT, () => {
    console.log('Server Started on port ' + process.env.PORT + ', development');
  });
}

