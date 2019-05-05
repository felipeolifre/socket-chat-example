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
    socket.join('general');
    socket.to('general').emit('system message', `${nickname} joined.`);
  });

  socket.on('typing', status => {
    console.log('a user is typing');
    const nickname = users.get(socket.id);
    socket.to('general').emit('typing', { nickname, status });
  });

  socket.on('chat message', body => {
    console.log(`message: ${body}`);
    const nickname = users.get(socket.id);
    socket.to('general').emit('typing', { nickname, status: false });
    socket.to('general').emit('chat message', { nickname, body });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    const nickname = users.get(socket.id);
    users.delete(socket.id);
    socket.to('general').emit('system message', `${nickname} left.`);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
