const user = {};

const addMessageToDOM = ({ body, nickname, type }) => {
  const listItem = document.createElement('li');
  if (type === 'chat') {
    listItem.textContent = `${nickname}: ${body}`;
  } else if (type === 'system') {
    listItem.textContent = body;
    listItem.style.fontStyle = 'italic';
  }
  document.getElementById('messages').appendChild(listItem);
};

const setTypingStatus = nickname => {
  const typingStatus = document.getElementById('typing-status');
  typingStatus.textContent = `${nickname} is typing...`;
};

const resetTypingStatus = () => {
  const typingStatus = document.getElementById('typing-status');
  typingStatus.textContent = '';
};

const enableSendButton = () => {
  const sendButton = document.getElementById('send-button');
  sendButton.removeAttribute('disabled');
};

const disableSendButton = () => {
  const sendButton = document.getElementById('send-button');
  sendButton.setAttribute('disabled', '');
};

const clearMessageInput = () => {
  const messageInput = document.getElementById('message-input');
  messageInput.value = '';
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

  socket.on('typing', ({ nickname, status }) => {
    if (status) {
      setTypingStatus(nickname);
    } else {
      resetTypingStatus();
    }
  });

  socket.on('chat message', ({ nickname, body }) => {
    const message = {
      type: 'chat',
      nickname,
      body,
    };
    addMessageToDOM(message);
  });

  document.getElementById('join-form').addEventListener('submit', event => {
    event.preventDefault(); // Prevents page reloading.
    const nicknameInput = document.getElementById('nickname');
    user.nickname = nicknameInput.value;
    socket.emit('join', user.nickname);
    nicknameInput.value = '';

    const joinDiv = document.getElementById('join');
    joinDiv.style.display = 'none';
    const chatDiv = document.getElementById('chat');
    chatDiv.style.display = 'block';
  });

  let typingTimerId;
  document.getElementById('message-input').addEventListener(
    'input',
    throttle(() => {
      socket.emit('typing', true);

      if (typingTimerId) {
        clearTimeout(typingTimerId);
      }

      typingTimerId = setTimeout(() => {
        socket.emit('typing', false);
        typingTimerId = null;
      }, 1000);
    }, 100),
  );

  document.getElementById('message-input').addEventListener('input', event => {
    if (event.target.value.trim() === '') {
      disableSendButton();
    } else {
      enableSendButton();
    }
  });

  document.getElementById('chat-form').addEventListener('submit', event => {
    event.preventDefault(); // Prevents page reloading.
    const messageInput = document.getElementById('message-input');
    const messageBody = messageInput.value;
    socket.emit('chat message', messageBody);

    const message = {
      type: 'chat',
      nickname: user.nickname,
      body: messageBody,
    };
    addMessageToDOM(message);

    disableSendButton();
    clearMessageInput();
  });
});
