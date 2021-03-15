const socket = io();
const msgbox = document.getElementById('msgbox');
const author = document.getElementById('author');
const scrp = document.getElementById('scrp');
const chatbox = document.getElementById('chatbox');
let load = "0";

socket.on('chat', (author, msgbox, dateout, loading, image) => {
  console.log(author+", "+msgbox+", "+dateout+", "+loading+", "+image)
  if(loading == "0" || loading != load && image == "none") {
    console.log("without")
    $("#chatbox").prepend("<div class='post'><div class='who'><span class='whoname'>"+author+" &nbsp; &nbsp;</span><span>"+dateout+"</span></div><blockquote>"+msgbox+"</blockquote></div>");
  } else if(loading == "0" || loading != load && image != "none") {
    console.log("with")
    let rando = Math.ceil(Math.random() * 50000);
    $("#chatbox").prepend("<div class='post'><div class='who'><span class='whoname'>"+author+" &nbsp; &nbsp;</span><span>"+dateout+"</span></div><blockquote>"+msgbox+"</blockquote><div class='imag' id='"+rando+"'><img src='"+image+"'></div></div>");
  }
});

socket.on('loading', loaded => {
  load = "1";
});

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
