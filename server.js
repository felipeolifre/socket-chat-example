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

  socket.on('chat message', messageBody => {
    console.log(`message: ${messageBody}`);
    const nickname = users.get(socket.id);
    socket.to('general').emit('chat message', { nickname, messageBody });
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
