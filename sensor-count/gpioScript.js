#! /usr/local/bin/node

var io = require('socket.io')(80);
var gpio = require("gpio");
var moment = require('moment');
var redis = require('redis');


var client = redis.createClient();

var i2c = require('i2c');
var device1 = new i2c(0x18, {device: '/dev/i2c-1', debug: false});
device1.setAddress(0x19);

setInterval(callArduino, 5000);

var p1_s = "puerta_1_s";
var p1_b = "puerta_1_b";
var p1_t = "puerta_1_t";

function callArduino(){
  device1.readBytes(null,100, function(err,res) {
    var dataSensor = res.toString('ascii');

    if(dataSensor.indexOf("d::") != -1 ){
      console.log("los datos son " + dataSensor);
      operateValueSensor(dataSensor)
    }else {
      /*var randomValue1 = Math.floor((Math.random() * 100) + 1);
      var randomValue2 = Math.floor((Math.random() * 100) + 1);
      var randomValue3 = Math.floor((Math.random() * 100) + 1);
      //console.log("valor " + randomValue1)
      dataSensor = "d::20160406::" + randomValue1 + "::" + randomValue2 + "::" + randomValue3 + "::end";
      console.log("valor " + dataSensor)
      operateValueSensor(dataSensor)
      //console.log("datos basura");*/
    }

  });
}

function operateValueSensor(data){
  if( data.split("::").length == 6){
    console.log("data " +  data.split("::"));
    var nameDoor = data.split("::")[0];
    var dateSensor = data.split("::")[1];
    var valueSensorUp = data.split("::")[2];
    var valueSensorDown = data.split("::")[3];
    var valueSensorTotal = data.split("::")[4];
    console.log("up " + valueSensorUp.trim());
    console.log("down " + valueSensorDown.trim());
    console.log("total " + valueSensorTotal.trim());
    var keyUp = nameDoor + "::" + "up" + "::" + dateSensor;
    var keyDown = nameDoor + "::" + "down" + "::" + dateSensor;
    var keyTotal = nameDoor + "::" + "total" + "::" + dateSensor;
    if(valueSensorUp.trim() !== "0") {
        setRedisAction(keyUp,  valueSensorUp.trim());
    }

    if(valueSensorDown.trim() !== "0") {
        setRedisAction(keyDown, valueSensorDown.trim());
    }

    if(valueSensorTotal.trim() !== "0") {
        setRedisAction(keyTotal, valueSensorTotal.trim());
    }


    io.sockets.emit(p1_s, valueSensorUp);
    io.sockets.emit(p1_b, valueSensorDown);
    io.sockets.emit(p1_t, valueSensorTotal);

  }else {
    io.sockets.emit("arduinoError", "La cantidad de elementos del array correspondiente es insuficiente");
  }

}


client.on('connect', function() {
    console.log('connected');
});


io.sockets.on("connection", function(socket) {
	console.log("Se conecta un cliente")
});

function getCurrentKey(){
  var now = moment();
  var currentYear = now.get('year');
  var currentMonth = now.get('month') + 1;
  if(parseInt(currentMonth) < 10){
    currentMonth = "0"+ (now.get('month') + 1)
  }
  var currentDay = now.get('date');
  if(parseInt(currentDay) < 10){
    currentDay = "0" + now.get('date');
  }
  var key = currentYear + "" + currentMonth + "" + currentDay
  return key;
}

function saveCountStatsOnRedis(key){
  client.incr(key, function(err, reply) {
      //console.log(reply); // 11
  });
}

function setRedisAction(key, value){
  client.set(key, value, redis.print);
}

function getRedisValue(key, fn){
  var currentValue = 0;
  client.exists(key, function(err, reply) {
    if (reply === 1) {
      client.get(key, function(err, reply) {
        if(!err){
          fn(reply);
        }
      });
    } else {
        fn(0);
    }
  });
}
