const socket = io();
const msgbox = document.getElementById('msgbox');
const author = document.getElementById('author');
const send = document.getElementById('send');
const chatbox = document.getElementById('chatbox');

send.addEventListener('click', function(e) {
    if(msgbox.value && author.value)
        socket.emit('chat', msgbox.value, author.value);
});

socket.on('chat', (msgbox, author, dateout) => {
    chatbox.innerHTML += "Timestamp: "+dateout+" Author: " + author + " Message: " + msgbox + "<br>";
});
