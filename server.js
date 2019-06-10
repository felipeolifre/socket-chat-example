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
    socket.to('general').emit('message', {
      type: 'system',
      nickname,
      body: 'has joined.',
      timestamp: Date.now(),
    });
    io.emit('online-users', [...users]);
  });

  socket.on('typing', status => {
    console.log('a user is typing');
    const nickname = users.get(socket.id);
    socket.to('general').emit('typing', { nickname, status });
  });

  socket.on('message', messageBody => {
    console.log(`message: ${messageBody}`);
    const nickname = users.get(socket.id);
    socket.to('general').emit('typing', { nickname, status: false });
    socket.to('general').emit('message', {
      type: 'chat',
      nickname,
      body: messageBody,
      timestamp: Date.now(),
    });
  });

  socket.on('disconnect', () => {
    const nickname = users.get(socket.id);
    socket.to('general').emit('message', {
      type: 'system',
      nickname,
      body: 'has left.',
      timestamp: Date.now(),
    });
    users.delete(socket.id);
    socket.broadcast.emit('online-users', [...users]);
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
