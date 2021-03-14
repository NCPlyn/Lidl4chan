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
      let ts = Date.now();
      let date_ob = new Date(ts);
      let date = date_ob.getDate();
      let month = date_ob.getMonth() + 1;
      let year = date_ob.getFullYear();
      let hours = date_ob.getHours();
      let minutes = date_ob.getMinutes();
      let dateout = hours + ":" + minutes + " " + year + "." + month + "." + date;
      data.push({"author":author,"msgbox":msgbox,"timestamp":dateout});
      jsonStr = JSON.stringify(data, null, 2);
      fs.writeFile("data.json", jsonStr, err => {
        if (err) {
          console.log(`Data couldn't be saved! Error: ${err}`);
        } else {
          console.log(`Data was saved successfully`);
        }
      });
      io.emit('chat', author, msgbox, dateout, "0");
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, function(){
    console.log(`Server listening on port ${PORT}`);
});
