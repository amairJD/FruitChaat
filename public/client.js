// Amair Javaid - 10125771 - ajavaid@ucalgary.ca - SENG 513 assignment 3 
var userName;

$(function () {
  var socket = io();

  socket.on('connect', function() {
    socket.emit('what am I');
  });

  socket.on('you are born', function(name, msgLog){
    userName = name;
    $('#intro').append(userName);

    //populate messageLog
    for(x in msgLog){
      $('#messages').append($('<li>').html(msgLog[x]));
    }
  });

  socket.on('user list update', function(userLog){
    //update user list
    $('#userList').empty();
    for(x in userLog){
      $('#userList').append($('<li>').text(userLog[x]));
    }
  });

  $('form').submit(function(e){
    e.preventDefault(); // prevents page reloading
    var msgContent = $('#m').val();
    socket.emit('chat message', msgContent);
    $('#m').val('');
    return false;
  });

  socket.on('chat message', function(user, msg){
    if(user == userName){
      msg = "<i><b>" + msg + "</b></i>";
    }
    $('#messages').append($('<li>').html(msg));
    return false;
  });

  socket.on('errorMsg', function(msg){
    alert(msg);
  })

  socket.on('changeUserName', function(newName){
    userName = newName;
  })
});
