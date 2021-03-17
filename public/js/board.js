const socket = io();
const urlParams = new URLSearchParams(window.location.search)
const chkremem = document.getElementById("remember");
let loaded = "0";
let userpagenum = Math.ceil(Math.random() * 20000);

socket.on('boardpost', (author, msgbox, dateout, loading, image, useridback) => { //listen to incoming data, chech if we are loading, check if image is present, add post to html (probs create ID for image)
  if (useridback == userpagenum) { //checking if we are loading correct data
    if (loading == "0" || loading != loaded) {
      if (image == "none") {
        $("#chatbox").prepend("<div class='post'><div class='who'><span class='whoname'>" + author + " &nbsp; &nbsp;</span><span>" + dateout + "</span></div><blockquote>" + msgbox + "</blockquote></div>");
      } else {
        $("#chatbox").prepend("<div class='post'><div class='who'><span class='whoname'>" + author + " &nbsp; &nbsp;</span><span>" + dateout + "</span></div><blockquote>" + msgbox + "</blockquote><img src='/uploads/thumb/" + image + "'></div>");
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
    let sourc = event.target.getAttribute("src")
    if(sourc.includes("thumb")) {
      event.target.src = "/uploads/" + sourc.substring(15);
    } else {
      event.target.src = "/uploads/thumb/" + sourc.substring(9);
    }
  }
});

chkremem.addEventListener('change', (event) => { //if remember is checked, create cookie, otherwise delete it
  if (event.currentTarget.checked) {
    var d = new Date();
    d.setTime(d.getTime() + (30*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = "name=" + document.getElementById("name").value + ";" + expires + ";path=/";
  } else {
    document.cookie = "name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
});

function getCookie(cname) { //funciton to get local cookie
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

let username = getCookie("name");
if (username != "") {
  document.getElementById("name").value = username;
  chkremem.checked = true;
}
