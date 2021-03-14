const socket = io();
const msgbox = document.getElementById('msgbox');
const author = document.getElementById('author');
const send = document.getElementById('send');
const chatbox = document.getElementById('chatbox');
let load = "0";

socket.on('chat', (author, msgbox, dateout, loading, image) => {
  if(loading == "0" || loading != load && image == "none") {
    $("#chatbox").prepend("<div class='post'><div class='who'><span class='whoname'>"+author+" &nbsp; &nbsp;</span><span>"+dateout+"</span></div><blockquote>"+msgbox+"</blockquote></div>");
  }
  if(loading == "0" || loading != load && image != "none") {
    $("#chatbox").prepend("<div class='post'><div class='who'><span class='whoname'>"+author+" &nbsp; &nbsp;</span><span>"+dateout+"</span></div><blockquote>"+msgbox+"</blockquote><image src='"+image+"'></div>");
  }
});

socket.on('loading', loaded => {
  load = loaded;
});
