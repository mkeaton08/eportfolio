const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
require('dotenv').config();

// Define route variables
const indexRouter = require('./app_server/routes/index');
const usersRouter = require('./app_server/routes/users');
const travelRouter = require('./app_server/routes/travel');
const handlebars = require('hbs');
const apiRouter = require('./app_api/routes/index');

// Import custom middleware
const { requestLogger } = require('./app_api/middleware/logger');
const { errorHandler } = require('./app_api/middleware/errorHandler');

// Bring in the mongoose database
require('./app_api/models/db');

// Wire in our authentication module
require('./app_api/config/passport');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');

// Register handlebars partials
handlebars.registerPartials(__dirname + '/app_server/views/partials');

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

// Custom request logger
app.use(requestLogger);

// Enable CORS
app.use('/api', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// Wire-up routes to controllers
app.use('/api', apiRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/travel', travelRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
