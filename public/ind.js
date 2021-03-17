const socket = io();
const boardsbox = document.getElementById('boardsbox');
const createform = document.getElementById('createform');
const showform = document.getElementById('showform');
let loaded = "0";
createform.style.display = "none";

socket.on('mainload', (boardid, name, desc, image, loading) => {
  if(loading == "0" || loading != loaded) {
    boardsbox.innerHTML += "<div class='col-lg-3'><div class='card'><img class='card-img-top' src='"+image+"'><div class='card-body'><a class='card-title text-center' href=boards.html?id="+boardid+">"+name+"</a><p class='card-text'>"+desc+"</p></div></div></div>"
  }
});

socket.on('mainloading', load => {
  loaded = "1";
});

socket.emit('getmain', "uwu");

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

showform.addEventListener('click',function(e){
  if(createform.style.display === "none") {
    createform.style.display = "block";
  } else {
    createform.style.display = "none";
  }
});
