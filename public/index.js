let myNickname;

const displayChatMessage = ({ nickname, message }) => {
  const listItem = document.createElement('li');
  listItem.textContent = `${nickname}: ${message}`;
  document.getElementById('messages').appendChild(listItem);
};

document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  socket.on('system message', message => {
    const listItem = document.createElement('li');
    listItem.style.fontStyle = 'italic';
    listItem.textContent = message;
    document.getElementById('messages').appendChild(listItem);
  });

  socket.on('chat message', ({ nickname, message }) => {
    displayChatMessage({ nickname, message });
  });

  document.getElementById('join-form').addEventListener('submit', e => {
    e.preventDefault(); // Prevents page reloading.
    const nicknameInput = document.getElementById('nickname');
    myNickname = nicknameInput.value;
    socket.emit('join', myNickname);
    nicknameInput.value = '';

    const joinDiv = document.getElementById('join');
    joinDiv.style.display = 'none';
    const chatDiv = document.getElementById('chat');
    chatDiv.style.display = 'block';
  });

  document.getElementById('chat-form').addEventListener('submit', e => {
    e.preventDefault(); // Prevents page reloading.
    const messageInput = document.getElementById('message');
    const message = messageInput.value;
    socket.emit('chat message', message);
    displayChatMessage({ myNickname, message });
    messageInput.value = '';
  });
});
