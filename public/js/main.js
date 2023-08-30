const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
//getting username and room from the url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
// console.log(username, room)



const socket = io();

socket.emit('joinRoom', { username, room });
//get room and users info
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsersName(users);
})


// Listen for the "message" event from the server
socket.on('message', message => {
    console.log('Received message from server:', message);
    outputMessage(message);
    //scroll up
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    //emit message to server
    socket.emit('chatMessage', msg);
    //clear the input 
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

})

//output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
     ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room) {
    roomName.innerText = room;
}
function outputUsersName(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}