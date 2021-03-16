const socket = io();
const msgbox = document.getElementById('msgbox');
const author = document.getElementById('author');
const scrp = document.getElementById('scrp');
const chatbox = document.getElementById('chatbox');
const urlParams = new URLSearchParams(window.location.search)
let loaded = "0";

socket.on('chat', (author, msgbox, dateout, loading, image) => {
  if(loading == "0" || loading != loaded) {
    if(image == "none") {
      $("#chatbox").prepend("<div class='post'><div class='who'><span class='whoname'>"+author+" &nbsp; &nbsp;</span><span>"+dateout+"</span></div><blockquote>"+msgbox+"</blockquote></div>");
    } else {
      let rando = Math.ceil(Math.random() * 50000);
      $("#chatbox").prepend("<div class='post'><div class='who'><span class='whoname'>"+author+" &nbsp; &nbsp;</span><span>"+dateout+"</span></div><blockquote>"+msgbox+"</blockquote><div class='imag' id='"+rando+"'><img src='"+image+"'></div></div>");
    }
  }
});

socket.on('loading', load => {
  loaded = "1";
});

const gotid = urlParams.get('id')
socket.emit('getboard', gotid);
document.getElementById("formid").value = gotid;

document.addEventListener('click',function(e){
    if(e.target && $(event.target).is('img')){
        let xd2 = document.getElementById(e.target.parentElement.id);
        if(xd2.offsetWidth == 200) {
          xd2.style.width = "100%";
        } else {
          xd2.style.width = "200px";
        }
     }
 });
