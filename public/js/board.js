const socket = io();
const urlParams = new URLSearchParams(window.location.search)
let loaded = "0";
let userpagenum = Math.ceil(Math.random() * 20000);

socket.on('boardpost', (author, msgbox, dateout, loading, image, useridback) => { //listen to incoming data, chech if we are loading, check if image is present, add post to html (probs create ID for image)
  if (useridback == userpagenum) { //checking if we are loading correct data
    if (loading == "0" || loading != loaded) {
      if (image == "none") {
        $("#chatbox").prepend("<div class='post'><div class='who'><span class='whoname'>" + author + " &nbsp; &nbsp;</span><span>" + dateout + "</span></div><blockquote>" + msgbox + "</blockquote></div>");
      } else {
        let rando = Math.ceil(Math.random() * 50000);
        $("#chatbox").prepend("<div class='post'><div class='who'><span class='whoname'>" + author + " &nbsp; &nbsp;</span><span>" + dateout + "</span></div><blockquote>" + msgbox + "</blockquote><div class='imag' id='" + rando + "'><img src='" + image + "'></div></div>");
      }
    }
  }
});

socket.on('loading', useridback => { //get loaded signal
  if (useridback == userpagenum) { //checking if we are loading correct data
    loaded = "1";
  }
});


const gotid = urlParams.get('id') //get ID from url and ask nodejs to send data
socket.emit('getboard', gotid, userpagenum);
document.getElementById("formid").value = gotid;

document.addEventListener('click', function(e) { //listener to enlarge pictures, in future only change picture src to low res
  if (e.target && $(event.target).is('img')) {
    let xd2 = document.getElementById(e.target.parentElement.id);
    if (xd2.offsetWidth == 200) {
      xd2.style.width = "100%";
    } else {
      xd2.style.width = "200px";
    }
  }
});
