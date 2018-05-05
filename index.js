var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Time handling
var requestTime = function (req, res, next) {
  req.requestTime = Date.now();
  next();
}
app.use(requestTime);

// GET requets
app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
});
app.get(/^\/.*/, function(req, res){
  res.sendFile(__dirname + '/client' + req.path);
});

// Socket managing
io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

// HTTP managing
http.listen(3000, function(){
  console.log('listening on *:3000');
});