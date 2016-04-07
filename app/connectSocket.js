/*var socket = require('socket.io-client')('http://localhost')

var secondFlagP1_s = false;
var timerCountP1_s;
var countP1_s = 0;
var secondFlagP1_b = false;
var timerCountP1_b;
var countP1_b = 0;
var p1_s = "puerta_1_a";
var p1_b = "puerta_1_b";
var p2 = "puerta_2";
var p3 = "puerta_3";

var p1b_flag = true;
var p1a_flag = true;
var pin_a = "1";
var pin_b = "1";
socket.on('connect', function(){
  console.log("connect socket")
});

socket.on(p1_s, function(data){
  var msg = data + "";
  console.log("Se suscribe " + p1_s);
  if( msg.trim() == "0" || pin_a == "0"){
    pin_a = msg.trim();
    if(p1b_flag){
      p1a_flag = false;
      if(pin_b == "0"){
        if(pin_a == "1"){
          countP1_s ++;
          console.log(p1_s + " " + countP1_s)
          p1a_flag == true;
        }
      }
    }
  }
  if(msg.trim() == "1" && pin_b == "1"){
    p1a_flag = true;
    p1b_flag = true;
  }
});

socket.on(p1_b, function(data){
  var msg = data + "";
  console.log("Se suscribe " + p1_b);

  if( msg.trim() == "0" || pin_b == "0" ){
      pin_b = msg.trim();
      if(p1a_flag){
        p1b_flag = false;
        if(pin_a == "0"){
          if(pin_b == "1"){
            countP1_b ++;
            console.log(p1_b + " " + countP1_b)
            p1b_flag = true;
          }
        }
      }
  }
  if(msg.trim() == "1" && pin_a == "1"){
    p1a_flag = true;
    p1b_flag = true;
  }
});

function addPeopleP1_s() {
  secondFlagP1_s = true;
  timerCountP1_s = null;
}

function addPeopleP2_b() {
  secondFlagP1_b = true;
  timerCountP1_b = null;
}*/
