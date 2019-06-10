const me = {};

const addMessageToDOM = ({ type, nickname, body, timestamp }) => {
  const listItem = document.createElement('li');
  const article = document.createElement('article');
  const header = document.createElement('header');
  const heading = document.createElement('h1');
  const time = document.createElement('time');
  const paragraph = document.createElement('p');

  article.classList.add('list-item');
  article.classList.add('message');
  if (type === 'chat') {
    article.classList.add('chat');
  } else if (type === 'system') {
    article.classList.add('system');
  }

  heading.textContent = nickname;

  const datetime = new Date(timestamp);
  time.setAttribute('datetime', datetime.toISOString());
  time.textContent = datetime.toLocaleTimeString('default', {
    hour: 'numeric',
    minute: '2-digit',
  });

  paragraph.textContent = body;

  header.appendChild(heading);
  header.appendChild(time);
  article.appendChild(header);
  article.appendChild(paragraph);
  listItem.appendChild(article);
  document.getElementById('messages').appendChild(listItem);
};

const createUserListItem = (nickname, currentUser) => {
  const listItem = document.createElement('li');
  const article = document.createElement('article');
  const paragraph = document.createElement('p');

  article.classList.add('list-item');
  article.classList.add('user');

  paragraph.textContent = nickname;
  if (currentUser) {
    const span = document.createElement('span');
    span.textContent = '(you)';
    paragraph.appendChild(span);
  }

  article.appendChild(paragraph);
  listItem.appendChild(article);

  return listItem;
};

const addOnlineUsersToDOM = (me, onlineUsersButMe) => {
  const userList = document.getElementById('users');
  userList.innerHTML = '';

  userList.appendChild(createUserListItem(me.nickname, true));

  onlineUsersButMe
    .map(({ nickname }) => nickname)
    .sort()
    .forEach(nickname => {
      userList.appendChild(createUserListItem(nickname, false));
    });
};

const setTypingStatus = nickname => {
  const typingStatus = document.getElementById('typing-status');

  if (typingStatus.textContent !== '') {
    return;
  }

  const nicknameEl = document.createElement('strong');
  const blankSpace = '\u00a0';
  const isTypingText = document.createTextNode(`${blankSpace}is typing...`);

  nicknameEl.textContent = nickname;

  typingStatus.appendChild(nicknameEl);
  typingStatus.appendChild(isTypingText);
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

const enableJoinButton = () => {
  const joinButton = document.getElementById('join-button');
  joinButton.removeAttribute('disabled');
};

const disableJoinButton = () => {
  const joinButton = document.getElementById('join-button');
  joinButton.setAttribute('disabled', '');
};

const clearMessageInput = () => {
  const messageInput = document.getElementById('message-input');
  messageInput.value = '';
};

const focusMessageInput = () => {
  const messageInput = document.getElementById('message-input');
  messageInput.focus();
};

document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  // Socket listeners.

  socket.on('connect', () => {
    me.id = socket.id;
  });

  socket.on('online-users', onlineUsers => {
    const onlineUsersButMe = onlineUsers
      .filter(([id]) => id !== me.id)
      .map(([id, nickname]) => ({ id, nickname }));
    addOnlineUsersToDOM(me, onlineUsersButMe);
  });

  socket.on('message', message => {
    addMessageToDOM(message);
  });

  socket.on('typing', ({ nickname, status }) => {
    if (status) {
      setTypingStatus(nickname);
    } else {
      resetTypingStatus();
    }
  });

  // DOM listeners.

  document.getElementById('nickname-input').addEventListener('input', event => {
    if (event.target.value.trim() === '') {
      disableJoinButton();
    } else {
      enableJoinButton();
    }
  });

  document.getElementById('join-form').addEventListener('submit', event => {
    event.preventDefault(); // Prevents page reloading.

    const nicknameInput = document.getElementById('nickname-input');
    me.nickname = nicknameInput.value;
    socket.emit('join', me.nickname);

    nicknameInput.value = '';
    const joinDiv = document.getElementById('join');
    joinDiv.style.display = 'none';
    disableJoinButton();

    const chatDiv = document.getElementById('chat');
    chatDiv.style.display = 'flex';
    focusMessageInput();
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
    socket.emit('message', messageBody);

    const message = {
      type: 'chat',
      nickname: me.nickname,
      body: messageBody,
      timestamp: Date.now(),
    };
    addMessageToDOM(message);

    disableSendButton();
    clearMessageInput();
  });
});
