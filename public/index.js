<<<<<<< HEAD
const user = {};

const addChatMessageToDOM = (nickname, message) => {
=======
let myNickname;

const displayChatMessage = ({ nickname, message }) => {
>>>>>>> 72ae3e46eb934d4b58b2e25aae056f2ac75a441f
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
<<<<<<< HEAD
    addChatMessageToDOM(nickname, message);
=======
    displayChatMessage({ nickname, message });
>>>>>>> 72ae3e46eb934d4b58b2e25aae056f2ac75a441f
  });

  document.getElementById('join-form').addEventListener('submit', e => {
    e.preventDefault(); // Prevents page reloading.
    const nicknameInput = document.getElementById('nickname');
<<<<<<< HEAD
    user.nickname = nicknameInput.value;
    socket.emit('join', user.nickname);
=======
    myNickname = nicknameInput.value;
    socket.emit('join', myNickname);
>>>>>>> 72ae3e46eb934d4b58b2e25aae056f2ac75a441f
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
<<<<<<< HEAD
    addChatMessageToDOM(user.nickname, message);
=======
    displayChatMessage({ myNickname, message });
>>>>>>> 72ae3e46eb934d4b58b2e25aae056f2ac75a441f
    messageInput.value = '';
  });
});
