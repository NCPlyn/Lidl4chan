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
  data.forEach(function(obj) {
    io.emit('chat', obj.author, obj.msgbox, obj.timestamp, "1");
  });
  io.emit('loading', "1");
    socket.on('chat',(msgbox, author) => {
      let date_ob = new Date(Date.now());
      let dateout = date_ob.getHours() + ":" + date_ob.getMinutes() + " &nbsp; " + date_ob.getFullYear() + "." + (date_ob.getMonth() + 1) + "." + date_ob.getDate();
      data.push({"author":author,"msgbox":msgbox,"timestamp":dateout});
      jsonStr = JSON.stringify(data, null, 2);
      fs.writeFile("data.json", jsonStr, err => {
        if (err) {
          console.log(`Data couldn't be saved! Error: ${err}`);
        }
      });
      io.emit('chat', author, msgbox, dateout, "0");
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, function(){
    console.log(`Server listening on port ${PORT}`);
});
