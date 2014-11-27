var BTSP = require('bluetooth-serial-port');
var serial = new BTSP.BluetoothSerialPort();
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

  var onRoomMsg = {people: peopleCount};
  socket.emit('people-room',onRoomMsg );



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

    //setup sockets for demo.
    socket.on('some-noise', function (data) {
      console.log(data);
      io.emit('new-noise', data);
    }); 

      
   
});






app.use(router);

var router = mainRouter.initialize(io);







//This is for the demo proporses, can be delete in the future.
var controllers = {};
var fs = require('fs');

var files = fs.readdirSync('routes');
files.forEach(function(file){
  var key = file.replace(/\.\w{2,3}$/, '');
  controllers[key] = require('./routes/' + file);
});

router.get('/noise', controllers.views.noise);

//TODO: too many routes requieres Sockets...

serial.on('found', function(address, name) {
	serial.findSerialPortChannel(address, function(channel) {
		serial.connect('00:13:01:24:71:78', channel, function() {
			console.log('connected');

			serial.on('data', function(buffer) {
				if(buffer === 1){
					router.post('/people/in', function(req,res){
						io.emit('people-in', {});
						peopleCount++;
						res.json({result:'OK'});
					});
				}else if(buffer ===0){
					router.post('/people/out', function(req,res){
						io.emit('people-out', {});
						peopleCount--;
						res.json({result:'OK'});
					});
				}
			});
		}, function () {
			console.log('cannot connect');
		});

		// close the connection when you're ready
		serial.close();
	}, function() {
		console.log('found nothing');
	});
});

serial.inquire();
var peopleCount = 0;
router.post('/people/in', function(req,res){
  io.emit('people-in', {});
  peopleCount++;
  res.json({result:'OK'});
});
router.post('/people/out', function(req,res){
  io.emit('people-out', {});
  peopleCount--;
  res.json({result:'OK'});
});

app.use(router);
