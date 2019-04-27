const http = require('http');

const Server = require('socket.io');
const express = require('express');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

io.on('connection', socket => {
  console.log('a user connected');
  socket.broadcast.emit('user connection', 'Someone connected.');

  socket.on('chat message', message => {
    console.log(`message: ${message}`);
    io.emit('chat message', message);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    socket.broadcast.emit('user connection', 'Someone disconnected.');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
