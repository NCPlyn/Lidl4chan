const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');
const fs = require("fs");
const multer = require('multer');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const storage = multer.diskStorage({ //names for uploads
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, 'image-' + Date.now() + path.extname(file.originalname));
  }
});

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  socket.on('getmain', yes => { //signal to send boards from json file
    let data = JSON.parse(fs.readFileSync("boards.json", 'utf8'));
    data.forEach(function(obj) {
      io.emit('mainload', obj.boardid, obj.name, obj.desc, obj.image, "1");
    });
    io.emit('mainloading', "1");
  });
  socket.on('getboard', gotid => { //signal to send post from specific board, load from json
    let boardtoget = "boards/" + gotid + ".json";
    if (fs.existsSync(boardtoget)) {
      let data = JSON.parse(fs.readFileSync(boardtoget, 'utf8'));
      data.forEach(function(obj) {
        io.emit('boardpost', obj.author, obj.msgbox, obj.timestamp, "1", obj.image);
      });
      io.emit('loading', "1");
    } else {
      io.emit('boardpost', "System", "Wrong board ID", "", "1", "none");
      io.emit('loading', "1");
    }
  });
});

app.post('/boards.html', (req, res) => {
  console.log(req.connection.remoteAddress);
  let upload = multer({storage: storage, limits: {fileSize: 8 * 1024 * 1024}, fileFilter: imageFilter}).single('ffile');
  upload(req, res, function(err) {
    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    } else if (err instanceof multer.MulterError) {
      if (err.code == 'LIMIT_FILE_SIZE') {
        return res.send("File Size is too large. Allowed file size is 8MB");
      }
      return res.send(err);
    } else if (err) {
      return res.send(err);
    } else if (!req.body.author) {
      return res.send("Fill out Author name");
    }

    let jsonfile = "boards/" + req.body.boardid + ".json"
    if (fs.existsSync(jsonfile)) {
      let data = JSON.parse(fs.readFileSync(jsonfile, 'utf8'));
      let date_ob = new Date(Date.now());
      let dateout = date_ob.getHours() + ":" + date_ob.getMinutes() + " &nbsp; " + date_ob.getFullYear() + "." + (date_ob.getMonth() + 1) + "." + date_ob.getDate();

      let outmsg = req.body.msgbox.replace(/\r\n/g, "<br>");

      if (!req.file) {
        data.push({"author": req.body.author,"msgbox": outmsg,"timestamp": dateout,"image": "none"});
        io.emit('boardpost', req.body.author, outmsg, dateout, "0", "none");
      } else {
        let str = "/uploads/" + req.file.path.substring(15);
        data.push({"author": req.body.author,"msgbox": outmsg,"timestamp": dateout,"image": str});
        io.emit('boardpost', req.body.author, outmsg, dateout, "0", str);
      }

      jsonStr = JSON.stringify(data, null, 2);
      fs.writeFile(jsonfile, jsonStr, err => {
        if (err) {
          console.log(`Data couldn't be saved! Error: ${err}`);
        }
      });

      res.redirect('/boards.html?id=' + req.body.boardid);
    } else {
      return res.send("The board you are trying to post doesnt exist!");
    }
  });
});

app.post('/', (req, res) => {
  console.log(req.connection.remoteAddress);
  let upload = multer({storage: storage, limits: {fileSize: 8 * 1024 * 1024}, fileFilter: imageFilter}).single('ffile');
  upload(req, res, function(err) {
    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    } else if (err instanceof multer.MulterError) {
      if (err.code == 'LIMIT_FILE_SIZE') {
        return res.send("File Size is too large. Allowed file size is 8MB");
      }
      return res.send(err);
    } else if (err) {
      return res.send(err);
    } else if (!req.body.name || !req.body.desc || !req.file) {
      return res.send("Fill out all information! Even image!");
    }

    let data = JSON.parse(fs.readFileSync("boards.json", 'utf8'));

    let outmsg = req.body.desc.replace(/\r\n/g, "<br>");

    let rando = Math.ceil(Math.random() * 90000);
    let str = "/uploads/" + req.file.path.substring(15);

    data.push({"boardid": rando,"name": req.body.name,"desc": outmsg,"image": str});
    io.emit("mainload", rando, req.body.name, outmsg, str);

    jsonStr = JSON.stringify(data, null, 2);
    fs.writeFile("boards.json", jsonStr, err => {
      if (err) {
        console.log(`Data couldn't be saved! Error: ${err}`);
      }
    });

    let date_ob = new Date(Date.now());
    let dateout = date_ob.getHours() + ":" + date_ob.getMinutes() + " &nbsp; " + date_ob.getFullYear() + "." + (date_ob.getMonth() + 1) + "." + date_ob.getDate();
    let newjson = [];
    newjson.push({"author": "System","msgbox": "New board created","timestamp": dateout,"image": "none"});
    let jsonStr2 = JSON.stringify(newjson, null, 2);
    fs.writeFile("boards/" + rando + ".json", jsonStr2, err => {
      if (err) {
        console.log(`Data couldn't be saved! Error: ${err}`);
      }
    });

    res.redirect('/');
  });
});

const imageFilter = function(req, file, cb) { // accept images only (!!!!need to check filesize too)
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const PORT = process.env.PORT || 5000;
server.listen(PORT, function() {
  console.log(`Server listening on port ${PORT}`);
});
