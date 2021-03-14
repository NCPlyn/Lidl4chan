const socket = io();
const msgbox = document.getElementById('msgbox');
const author = document.getElementById('author');
const send = document.getElementById('send');
const chatbox = document.getElementById('chatbox');
let load = "0";

send.addEventListener('click', function(e) {
    if(msgbox.value && author.value)
        socket.emit('chat', msgbox.value, author.value);
});

socket.on('chat', (author, msgbox, dateout, loading) => {
  if(loading == "0" || loading != load) {
    chatbox.innerHTML += "Timestamp: "+dateout+" Author: " + author + " Message: " + msgbox + "<br>";
  }
});

socket.on('loading', loaded => {
  load = loaded;
});
