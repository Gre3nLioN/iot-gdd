var express = require('express');
var path    = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');


var app = express();
var mainRouter = require('./router');
// uncomment after placing your favicon in /public

app.use(logger('dev'));
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './public')));


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



module.exports = app;
var server =http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

//io sockets would address to all the web-clients talking to this nodejs server
var io = require('socket.io')(server);

io.sockets.on('connection', function (socket) {
  console.log("new connnect"); 

  //some web-client disconnects
  socket.on('disconnect', function (socket) {
    console.log("disconnect");
  });
  
  //some web-client sents in a msg
  socket.on('client', function (data) {
    console.log(data);
  });

  //we expect to get a ping from 
  //them saying what room they want to join
  socket.on('room', function(data) {
      if(socket.room){
          socket.leave(socket.room);
      }
      socket.room = data;
      console.log('new connection to: ' + data);
      socket.join(data);
    });


     
});


var router = mainRouter.initialize(io);
app.use(router);
