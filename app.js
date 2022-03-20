const path = require('path');
const cors = require('cors');
const express = require('express');
const app = express();
const fs = require("fs");
const sfetch = require('sync-fetch')
const request = require("request");

let color = {};
let image = ""

function download(uri, filename, callback) {
  request.head(uri, function () {
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
}

function getImageData(id) {
  let res = sfetch("https://api.figma.com/v1/images/lAicTCttoqPqzAFODR7tkx?format=png&ids=" + id, {
    headers: {
      "X-Figma-Token": '166351-7aac409c-54bc-4425-90c8-eb1a8585d613'
    }
  }).json();
  if (res.err === null) {
    console.log(res)
    return res.images[id];
  } else {
    return ""
  }
}

app.use(cors({
  origin: '*'
}));

function _base64ToArrayBuffer(base64) {
  // var binary_string = window.atob(base64);
  var len = base64.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = base64.charCodeAt(i);
  }
  console.log(bytes)
  return bytes;
}

// fs.readFile('1.png', function(err, data) {
//   if (err) throw err;
//
//   // Encode to base64
//   var encodedImage = new Buffer(data, 'binary').toString('base64');
//   let tmp = _base64ToArrayBuffer(encodedImage)
//   image = encodedImage
//
// });
function saveImage(id, name){
  var data = getImageData(id);
  let absoluteImgName = "C:\\servDesignGen\\public\\"+name;
  download(data, absoluteImgName, function () {
    console.log('done');
  });
}
app.use('/static', express.static(path.join(__dirname, 'public')))

// app.get('/', (req, res) => {
//   color = JSON.parse(req.query.color)
//   color.image = JSON.stringify(image)
//   color = JSON.stringify(color);
//   setTimeout(function (){
//     saveImage("2:17", "1.png")
//     saveImage("2:20", "2.png")
//     saveImage("2:19", "3.png")
//     saveImage("2:21", "4.png")
//   }, 10000)
// });

app.get('/color', (req, res) => {
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
  res.send(color);
});

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.post('/', function(request, response){
  console.log(typeof request.body);      // your JSON
  color = request.body
  color = JSON.stringify(color);
  response.send(request.body);    // echo the result back
  setTimeout(function (){
    saveImage("2:17", "1.png")
    saveImage("2:20", "2.png")
    saveImage("2:19", "3.png")
    saveImage("2:21", "4.png")
  }, 30000)
});

app.listen(3000, () => {
  console.log('Application listening on port 3333!');
});