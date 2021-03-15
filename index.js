const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');
const fs = require("fs");
const multer = require('multer');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, 'image-' + Date.now() + path.extname(file.originalname));
    }
});

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  let data = JSON.parse(fs.readFileSync("data.json", 'utf8'));
  data.forEach(function(obj) {
    io.emit('chat', obj.author, obj.msgbox, obj.timestamp, "1", obj.image);
  });
  io.emit('loading', "1");
});

app.post('/', (req, res) => {
    let upload = multer({ storage: storage, fileFilter: imageFilter}).single('ffile');
    upload(req, res, function(err) {
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }
        else if (!req.body.author) {
          return res.send("Fill out Author name");
        }

        let data = JSON.parse(fs.readFileSync("data.json", 'utf8'));
        let date_ob = new Date(Date.now());
        let dateout = date_ob.getHours() + ":" + date_ob.getMinutes() + " &nbsp; " + date_ob.getFullYear() + "." + (date_ob.getMonth() + 1) + "." + date_ob.getDate();

        let outmsg = req.body.msgbox.replace(/\r\n/g, "<br>");

        if (!req.file) {
          data.push({"author":req.body.author,"msgbox":outmsg,"timestamp":dateout,"image":"none"});
          io.emit('chat', req.body.author, outmsg, dateout, "0", "none");
        } else {
          let str = "/uploads/"+req.file.path.substring(15);
          data.push({"author":req.body.author,"msgbox":outmsg,"timestamp":dateout,"image":str});
          io.emit('chat', req.body.author, outmsg, dateout, "0", str);
        }

        jsonStr = JSON.stringify(data, null, 2);
        fs.writeFile("data.json", jsonStr, err => {
          if (err) {
            console.log(`Data couldn't be saved! Error: ${err}`);
          }
        });

        res.redirect('/');
    });
});

const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
exports.imageFilter = imageFilter;

const PORT = process.env.PORT || 5000;
server.listen(PORT, function(){
    console.log(`Server listening on port ${PORT}`);
});
