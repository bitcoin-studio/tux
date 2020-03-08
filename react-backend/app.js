var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var create_vault_router = require('./routes/create_vault');
var get_transactions_router = require('./routes/gettransactions');
var submit_raw_transaction_router = require('./routes/submitrawtransaction');
var create_batchpay_router= require('./routes/create_batchpay');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/create_vault', create_vault_router);
app.use('/get_transactions', get_transactions_router);
app.use('/submit_raw_transaction', submit_raw_transaction_router);
app.use('/create_batchpay', create_batchpay_router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;