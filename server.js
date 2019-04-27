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

const users = new Map();

io.on('connection', socket => {
  console.log('a user connected');

  socket.on('join', nickname => {
    console.log('a user joined');
    users.set(socket.id, nickname);
    socket.broadcast.emit('system message', `${nickname} joined.`);
  });

  socket.on('chat message', message => {
    console.log(`message: ${message}`);
    const nickname = users.get(socket.id);
    io.emit('chat message', { nickname, message });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    const nickname = users.get(socket.id);
    users.delete(socket.id);
    socket.broadcast.emit('system message', `${nickname} left.`);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
