const socket = io();
const urlParams = new URLSearchParams(window.location.search)
const chkremem = document.getElementById("remember");
let loaded = "0";
let userpagenum = Math.ceil(Math.random() * 20000);

socket.on('boardpost', (postid, author, msgbox, dateout, loading, image, useridback, imginfo) => { //listen to incoming data, chech if we are loading, check if image is present, add post to html (probs create ID for image)
  if (useridback == userpagenum) { //checking if we are loading correct data
    if (loading == "0" || loading != loaded) {
      let outtext = msgbox;
      let count = (msgbox.match(/\>\>/g) || []).length; //get number of tags
      if(count != 0) {
        for(i = 0; i < count; i++) { //for loop for replies
          let tst = outtext.indexOf(">>");
          let aid = outtext.slice(tst+2, tst+8);
          outtext = outtext.replace('\>\>'+aid, '');
          msgbox = msgbox.replace('\>\>'+aid, "<a href='#"+aid+"'>\>\>"+aid+"</a>");
          document.getElementById(aid).innerHTML += "<a href='#"+postid+"'> \>"+postid+"</a>"
        }
      }
      let imgext = image.split('.').pop();
      if (image == "none") {
        $("#chatbox").prepend("<div class='post'><div class='who'><span class='whoname'>" + author + " &nbsp; &nbsp;</span><span>" + dateout + " &nbsp; </span><span id="+postid+">#"+postid+" ▶ </span></div><blockquote>" + msgbox + "</blockquote></div>");
      } else if(imgext == "webm" || imgext == "mp4") {
        $("#chatbox").prepend("<div class='post'><div class='who'><span class='whoname'>" + author + " &nbsp; &nbsp;</span><span>" + dateout + " &nbsp; </span><span id="+postid+">#"+postid+" ▶ </span></div><div class='imga'><a href='/uploads/" + image + "'>"+image+" </a>"+imginfo+"<br></div><video width='320' controls><source src='/uploads/" + image + "'></video><blockquote>" + msgbox + "</blockquote></div>");
      } else {
        $("#chatbox").prepend("<div class='post'><div class='who'><span class='whoname'>" + author + " &nbsp; &nbsp;</span><span>" + dateout + " &nbsp; </span><span id="+postid+">#"+postid+" ▶ </span></div><div class='imga'><a href='/uploads/" + image + "'>"+image+" </a>"+imginfo+"<br></div><img src='/uploads/thumb/" + image + "'><blockquote>" + msgbox + "</blockquote></div>");
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

document.addEventListener('click', function(e) { //listener to add replies
  if (e.target && $(event.target).is('span') && e.target.id.length == 6) {
    document.getElementById("msg").value += ">>"+e.target.id;
  }
});

document.addEventListener('mouseover', function(e) { //too lazy to do anything other rn than change color using JS
  if (e.target && $(event.target).is('span') && e.target.id.length == 6) {
    e.target.style.color = "red";
  }
});
document.addEventListener('mouseout', function(e) { //too lazy to do anything other rn than change color using JS
  if (e.target && $(event.target).is('span') && e.target.id.length == 6) {
    e.target.style.color = "maroon";
  }
});

document.addEventListener('mouseover', function(e) { //too lazy to do anything other rn than change color using JS
  if (e.target && $(event.target).is('a') && e.target.getAttribute("href").length == 7) {
    let toid = e.target.getAttribute("href").substring(1);
    document.getElementById(toid).parentElement.parentNode.style.backgroundColor = "#f0c0b0";
  }
});
document.addEventListener('mouseout', function(e) { //too lazy to do anything other rn than change color using JS
  if (e.target && $(event.target).is('a') && e.target.getAttribute("href").length == 7) {
    let toid = e.target.getAttribute("href").substring(1);
    document.getElementById(toid).parentElement.parentNode.style.backgroundColor = "#f0e0d6";
  }
});

document.addEventListener('click', function(e) { //listener to enlarge pictures
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
