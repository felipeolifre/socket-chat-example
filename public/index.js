const user = {};

const addMessageToDOM = ({ body, nickname, type }) => {
  const listItem = document.createElement('li');
  if (type == 'chat') {
    listItem.textContent = `${nickname}: ${body}`;
  } else if (type == 'system') {
    listItem.textContent = body;
    listItem.style.fontStyle = 'italic';
  }
  document.getElementById('messages').appendChild(listItem);
};

document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  socket.on('system message', body => {
    const message = {
      type: 'system',
      body,
    };
    addMessageToDOM(message);
  });

  socket.on('chat message', ({ nickname, body }) => {
    const message = {
      type: 'chat',
      nickname,
      body,
    };
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

    const message = {
      type: 'chat',
      nickname: user.nickname,
      body: messageBody,
    };
    addMessageToDOM(message);

    messageInput.value = '';
  });
});
