const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  let data = JSON.parse(fs.readFileSync("data.json", 'utf8'));
  data.forEach(function(obj) { io.emit('chat', obj.author, obj.msgbox, obj.timestamp); });
    socket.on('chat',(msgbox, author) => {
      let ts = Date.now();
      let date_ob = new Date(ts);
      let date = date_ob.getDate();
      let month = date_ob.getMonth() + 1;
      let year = date_ob.getFullYear();
      let hours = date_ob.getHours();
      let minutes = date_ob.getMinutes();
      let dateout = hours + ":" + minutes + " " + year + "." + month + "." + date;
      io.emit('chat', author, msgbox, dateout);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, function(){
    console.log(`Server listening on port ${PORT}`);
});
