const socket = io();
const boardsbox = document.getElementById('boardsbox');
const createform = document.getElementById('createform');
const showform = document.getElementById('showform');
let loaded = "0";
createform.style.display = "none";
let userpagenum = Math.ceil(Math.random() * 20000);

socket.on('mainload', (boardid, name, desc, image, loading, useridback) => { //gets data from node.js and adds it to html, checks if we are loading or not
  if (useridback == userpagenum) {
    if (loading == "0" || loading != loaded) {
      boardsbox.innerHTML += "<div class='col-lg-3 col-sm-6 '><div class='card'><img class='card-img-top' src='" + image + "'><div class='card-body'><a class='card-title text-center' href=boards.html?id=" + boardid + ">" + name + "</a><p class='card-text'>" + desc + "</p></div></div></div>"
    }
  }
});

socket.on('mainloading', useridback => { //get loaded signal (!!!!!!should compare userID from cookies to make sure we are not responding to other loader)
  if (useridback == userpagenum) {
    loaded = "1";
  }
});

socket.emit('getmain', userpagenum); //send signal that we want to load boards

showform.addEventListener('click', function(e) { //listener to show/hide form
  if (createform.style.display === "none") {
    createform.style.display = "block";
  } else {
    createform.style.display = "none";
  }
});
