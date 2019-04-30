const user = {};

const addMessageToDOM = message => {
  const listItem = document.createElement('li');
  if (message.type == 'chat') {
    listItem.textContent = `${message.nickname}: ${message.body}`;
  } else if (message.type == 'system') {
    listItem.textContent = message.body;
    listItem.style.fontStyle = 'italic';
  }
  document.getElementById('messages').appendChild(listItem);
};

document.addEventListener('DOMContentLoaded', () => {
  const socket = io();
  let message = {};

  socket.on('system message', messageBody => {
    message.type = 'system';
    message.body = messageBody;
    addMessageToDOM(message);
  });

  socket.on('chat message', ({ nickname, messageBody }) => {
    message.type = 'chat';
    message.nickname = nickname;
    message.body = messageBody;
    addMessageToDOM(message);
  });

  document.getElementById('join-form').addEventListener('submit', e => {
    e.preventDefault(); // Prevents page reloading.
    const nicknameInput = document.getElementById('nickname');
    user.nickname = nicknameInput.value;
    socket.emit('join', user.nickname);
    nicknameInput.value = '';

    const joinDiv = document.getElementById('join');
    joinDiv.style.display = 'none';
    const chatDiv = document.getElementById('chat');
    chatDiv.style.display = 'block';
  });

  document.getElementById('chat-form').addEventListener('submit', e => {
    e.preventDefault(); // Prevents page reloading.
    const messageInput = document.getElementById('message');
    const messageBody = messageInput.value;
    socket.emit('chat message', messageBody);

    message.type = 'chat';
    message.nickname = user.nickname;
    message.body = messageBody;
    addMessageToDOM(message);

    messageInput.value = '';
  });
});
