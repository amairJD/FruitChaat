// Amair Javaid - 10125771 - ajavaid@ucalgary.ca - SENG 513 assignment 3

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var prePreName = [
  "The",
  "Ze",
  "Le",
  "Big",
  "Mr",
  "Ms",
  "Dr"
]

var preName = [
  "Snoop",
  "Anon",
  "Chicken",
  "Dino",
  "Trash",
  "King",
  "Danger"
]

var postName = [
  "Swami",
  "Boii",
  "Licker",
  "Dumper",
  "Muncher",
  "Man",
  "Lady",
  "Lover"
]

var defaultUserColor = "#7aadff";
var messageLog = [];
var users = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/client.html');
});

app.get('/styles.css', function(req, res) {
  res.sendFile(__dirname + "/public/styles.css");
});

app.get('/client.js', function(req, res) {
  res.sendFile(__dirname + "/public/client.js");
});

io.on('connect', function(socket){

})

io.on('connection', function(socket){
  console.log('A user is connect');
  socket.on('what am I', function() {
    var userName = generateUniqueName();
    users.push(userName);
    socket.userName = userName;
    socket.userColor = defaultUserColor;
    socket.emit('you are born', userName, messageLog);
    io.emit('user list update', users);
  });


  socket.on('chat message', function(msg){
    var msgContents = msg.split(" ");
    // If desire is to change your nickname
    if (msgContents[0] == "/nick"){
      if (msgContents.length < 2) {
        socket.emit("errorMsg", "You... didn't enter anything...");
      }
      else {
        var newUserName = msgContents[1];
        if (users.includes(newUserName)){
          socket.emit("errorMsg", "That nickname's already taken, bub.");
        }
        else {
          var currIndex = users.indexOf(socket.userName);
          users[currIndex] = newUserName;
          socket.userName = newUserName;
          socket.emit('changeUserName', newUserName);
          io.emit('user list update', users);
        }
      }
    }
    // else if desire is to change the nickname color
    else if (msgContents[0] == "/nickcolor"){
      if (msgContents.length < 2) {
        socket.emit("errorMsg", "You must enter a hex value like #aabbcc to change color.");
      }
      else {
        var isOk  = /^#[0-9A-F]{6}$/i.test(msgContents[1]);
        if (isOk) {
          socket.userColor = msgContents[1];
        }
        else {
          socket.emit("errorMsg", "Format like a hex value: #aabbcc");
        }
      }
    }
    // else simple message
    else {
      var timeStamp = new Date().toString().split(' ')[4];  // Improve formatting of timestamp
      msg = timeStamp + "<font color=" + socket.userColor + "> " + socket.userName + ": </font>" + msg;
      io.emit('chat message', socket.userName, msg);
      messageLog.push(msg);
    }
  });
  socket.on('disconnect', function(){
    var index = users.indexOf(socket.userName);
    if (index > -1){
      users.splice(index, 1);
    }
    io.emit('user list update', users);
    console.log(socket.userName + ' is disconnect');
  });
});

http.listen(3000, function() {
  console.log('un listen on *:3000');
});


function generateUniqueName() {
  var userName;
  do {
    var ind1 = Math.floor(Math.random() * preName.length);
    var ind2 = Math.floor(Math.random() * postName.length);
    userName = preName[ind1] + postName[ind2];
    if (users.includes(userName)){
      var ind0 = Math.floor(Math.random() * prePreName.length);
      userName = prePreName[ind0] + userName;
    }
  } while (users.includes(userName));
  return userName;
}
