const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes');
const bodyParser = require('body-parser');
//const cron = require('node-cron');
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100 // limit each IP to 100 requests per windowMs
});

var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(limiter);

app.use('/', indexRouter);
console.log('process env:', process.env.ACCESS_TOKEN_SECRET);

//cron.schedule("* * * * *", function() {
//    console.log("running a task every minute");
//  });

module.exports = app;
