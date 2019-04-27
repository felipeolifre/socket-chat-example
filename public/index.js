document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  socket.on('user connection', message => {
    const listItem = document.createElement('li');
    listItem.style.fontStyle = 'italic';
    listItem.textContent = message;
    document.getElementById('messages').appendChild(listItem);
  });

  socket.on('chat message', message => {
    const listItem = document.createElement('li');
    listItem.textContent = message;
    document.getElementById('messages').appendChild(listItem);
  });

  document.getElementById('form').addEventListener('submit', e => {
    e.preventDefault(); // Prevents page reloading.
    const messageInput = document.getElementById('message');
    socket.emit('chat message', messageInput.value);
    messageInput.value = '';
  });
});
