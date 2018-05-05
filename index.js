var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = {};

const names = [
  'Jean-Marc',              'Jean-Michel',            'Jean-Jean',
  'Jean-Eudes',             'Jean-Pierre',            'Jean-Jacques',
  'Jean-Marie',             'Jean-Benoît',            'Jean-Bernard',
  'Jean-Kévin',             'Jean-Baptiste',          'Jean-Christophe',
  'Jean-François',          'Jean-Louis',             'Jean-Paul',
  'Jean-Phillipe',          'Jean-Sébastien',         'Jean-Yves',
  'Jean-Luc',               'Jean-Loup',              'Jean-Bon',
  'Jean-Moi-même',          'Jean-Patrick',           'Jean-Claude',
  'Jean-Noël',              'Jean-Aimé',              'Pierre-Jean (surprenant !)'
];

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
  // Log in
  // When a user log in, a random nickname is given to him.
  console.log('login : ' + socket.id);
  users[socket.id] = names[Math.floor(Math.random() * names.length)];
  socket.broadcast.emit('user logged', {id: socket.id, name: users[socket.id]});
  console.log(users);
  socket.emit('users here', users);

  // Log out
  socket.on('disconnect', function(){
    console.log('logout : ' + socket.id);
    io.emit('user unlogged', {id: socket.id, name: users[socket.id]});
    delete users[socket.id];
  });

  // Message sent
  socket.on('chat message', function(data){
    console.log('message from ' + socket.id + ': ' + data.content);
    io.emit('chat message', {
      user: {id: socket.id, name: users[socket.id]},
      date: data.date,
      content: data.content
    });
  });

  // User rename
  socket.on('user rename', function(name){
    console.log('user ' + socket.id + ' renamed ' + name);
    users[socket.io] = name;
    io.emit('user renamed', {id: socket.id, name: name});
  });
});

// HTTP managing
http.listen(3000, function(){
  console.log('listening on *:3000');
});