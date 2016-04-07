import MqttClient from './connectMQTT';
import listener from './connectGPS';
const notifier = require('node-notifier');
const path = require('path');
var moment = require('moment');
var redis = require('redis');

var socket = require('socket.io-client')('http://localhost')
var shell = require('shelljs');
var parseString = require('xml2js').parseString;
import env from './env';

var Timer = require('./easytimer.js/dist/easytimer.min.js')
var client = redis.createClient();

var allData;
var interval;




/*
timer variables
*/
var timer = new Timer();
timer.start();
/*
end timer variables
*/

/*
Socket varables
*/
var secondFlagP1_s = false;
var timerCountP1_s;

var secondFlagP1_b = false;
var timerCountP1_b;

var p1_s = "puerta_1_s";
var p1_b = "puerta_1_b";
var p1_t = "puerta_1_t";
var p2_s = "puerta_2_s";
var p2_b = "puerta_2_b";
var p3_s = "puerta_3_s";
var p3_b = "puerta_3_b";
var p2 = "puerta_2";
var p3 = "puerta_3";

var p1b_flag = true;
var p1a_flag = true;
var pin1_a = "1";
var pin1_b = "1";
var countP1_s = 0;
var countP1_b = 0;
var detectFirst = 0;

var p2b_flag = true;
var p2a_flag = true;
var pin2_a = "1";
var pin2_b = "1";
var countP2_s = 0;
var countP2_b = 0;

var p3b_flag = true;
var p3a_flag = true;
var pin3_a = "1";
var pin3_b = "1";
var countP3_s = 0;
var countP3_b = 0;

client.on('connect', function() {
    console.log('connected');
});
/*
/*
/*
end Socket varables
*/
//let mqtt = new MqttClient();

/*
GPS action
*/
/*listener.connect(function() {
    console.log('Connected');
});
listener.watch({class: 'WATCH', json:true,  nmea: false});*/

//console.log('Loaded environment variables:', env);
initSendPosition();
function stopSendPosition() {
  if(listener.isConnected()){
    listener.disconnect(function() {
      console.log('Disconnected');
    });
  }
  if(interval){
    clearInterval(interval);
    interval = null;
  }
}

function initSendPosition() {
  if(!listener.isConnected()){
    listener.connect(function() {
      console.log('Connected');
      listener.on('TPV', function(data) {
        allData = data;
      });
    });
    listener.watch({class: 'WATCH', json:true,  nmea: false});
  }
  if(!interval){
    interval = setInterval(getDataListener, 8000);
  }
}

function getDataListener(){
  //console.log("Me iniciaron :)");
  sendDeviceInfo(JSON.stringify(allData),allData)
}


/*
end GPS action
*/

/*
mqtt action
*/

/*MqttClient.mqttClientApplication.on('connect', () => {
  console.log("se conecto clientApp ");

})*/
MqttClient.mqttClientDevice.subscribe('iot-2/cmd/cmi/fmt/string');
MqttClient.mqttClientDevice.on('connect', () => {
  console.log("se conecto mqtt");
  notifier.notify({
    title: 'My awesome title',
    message: 'Hello from node, Mr. User!',
    icon: path.join(__dirname, 'logo.png'), // Absolute path (doesn't work on balloons)
    sound: false, // Only Notification Center or Windows Toasters
    wait: false // Wait with callback, until user action is taken against notification
  });
  //MqttClient.mqttClientDevice.publish('iot-2/evt/location/fmt/json', '{"d":{"myName":"raspberry", "temperature":989}}')

})

MqttClient.mqttClientDevice.on('message', (topic, message) => {
  console.log("El mensaje es " + message);
  console.log("El topico es " + topic);
  var action = message + "";
  if(action.trim() == "send"){
    initSendPosition();
  }
  if (action.trim() == "stop") {
    stopSendPosition();
  }
  if(action.trim() == "bandwidth") {
    sendBandwidthTrafic();
  }

  if(action.trim() === "entry:llegada"){
    console.log("entry:llegada");
    stopTimer();
  }

  if(action.trim() === "entry:salida"){
    console.log("entry:salida");
    stopTimer();
  }

  if(action.trim() === "exit:salida"){
    console.log("exit:salida");
    startTimer();
  }

  if(action.trim() === "exit:llegada"){
    console.log("exit:salida");
    startTimer();
  }

  if(action.trim() === "exit:control"){
    console.log("exit:salida");
    var msg = {
      report : "Lllega el reporte de salida del punto de control"
    }
    reportActionControlPoints(msg);
  }
  if(action.trim() === "entry:control"){
    console.log("entry:salida");
    var msg = {
      report : "Lllega el reporte de entrada al punto de control"
    }
    reportActionControlPoints(msg);
  }
})

/*mqttClient.mqttClientDevice.on('message', (topic, message) => {
  console.log("El mensaje es " + message);
  console.log("El topico es " + topic);
  var action = message + "";
  if(action.trim() == "send"){
    initSendPosition();
  } else if (action.trim() == "stop") {
    stopSendPosition();
  } else {
    console.log("No compara");
  }
})*/

var errorMsg ={
  error : "gps is not detected"
}
function sendDeviceInfo(locationData, allDataMy) {
  var keyDoorUp = "d::"+"up::"+ getCurrentKey();
  var keyDoorDown = "d::"+"down::"+ getCurrentKey();
  var keyDoorTotal = "d::"+"total::"+ getCurrentKey();
  //var keyDoor2Up = "door2::"+"up::"+ getCurrentKey();
  //var keyDoor2Down = "door2::"+"down::"+ getCurrentKey();
  //var keyDoor3Up = "door3::"+"up::"+ getCurrentKey();
  //var keyDoor3Down = "door3::"+"down::"+ getCurrentKey();
  var listKeys = [keyDoorUp, keyDoorDown, keyDoorTotal];

  if(allDataMy){
    if(allDataMy.lat && allDataMy.lon){
      client.mget(listKeys, function(err, reply){
         if(!err){
           var completeLocation =  buildCompleteDataLocation(allDataMy, listKeys, reply)
           MqttClient.mqttClientDevice.publish('iot-2/evt/telemetry/fmt/json',JSON.stringify(completeLocation));
         }
       })
      //MqttClient.mqttClientApplication.publish('iot-2/type/bus-ecuatoriana/id/987654321/evt/telemetry/fmt/json',JSON.stringify(dataLocation));

    }else {
      client.mget(listKeys, function(err, reply){
         if(!err){
           var parcialLocation = buildParcialDataLocation(listKeys, reply);
           MqttClient.mqttClientDevice.publish('iot-2/evt/telemetry/fmt/json',JSON.stringify(parcialLocation));
         }
       });
      if(env.name === 'production'){
          MqttClient.mqttClientDevice.publish('iot-2/evt/error/fmt/json',JSON.stringify(errorMsg));
      }

    }
  }else {
    client.mget(listKeys, function(err, reply){
       if(!err){
         var parcialLocation = buildParcialDataLocation(listKeys, reply);
         MqttClient.mqttClientDevice.publish('iot-2/evt/telemetry/fmt/json',JSON.stringify(parcialLocation));
       }
     });
    if(env.name === 'production'){
        MqttClient.mqttClientDevice.publish('iot-2/evt/error/fmt/json',JSON.stringify(errorMsg));
    }
  }


}

function buildCompleteDataLocation(allDataMy, listKeys ,values){
  var sensorCount = {};
  values.forEach(function (key, pos){
    if(key){
      sensorCount[listKeys[pos]] = key;
    }else{
      sensorCount[listKeys[pos]] = 0;
    }
  });

  var dataLocation = {
    id : env.idBus,
    name : "Ecuatoriana",
    lng : allDataMy.lon,
    lat : allDataMy.lat,
    sensorCount: sensorCount,
    created_at : moment().valueOf()
  };

  return dataLocation;
}

function buildParcialDataLocation(listKeys, values){
  var sensorCount = {};
  values.forEach(function (key, pos){
    if(key){
      sensorCount[listKeys[pos]] = key;
    }else{
      sensorCount[listKeys[pos]] = 0;
    }
  });
  var dataLocation = {
    id : env.idBus,
    name : "Ecuatoriana",
    lng : 0.0,
    lat : 0.0,
    sensorCount: sensorCount,
    created_at : moment().valueOf()
  };
  console.log(sensorCount[listKeys[0]]);
  console.log(sensorCount[listKeys[1]]);
  return dataLocation;
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

function sendMqttStatistics(data){
  MqttClient.mqttClientDevice.publish('iot-2/evt/statistics/fmt/json',data);
}

function reportActionControlPoints(data){
  MqttClient.mqttClientDevice.publish('iot-2/evt/report/fmt/json',data);
}

/*
end mqtt action
*/

/*
Statistics
*/
function sendBandwidthTrafic() {
  console.log("enviar bandwidht");
  var child = shell.exec('vnstat -i wlan0 -d --xml', {async:true});
  child.stdout.on('data', function(data) {
    parseString(data, function (err, result) {
      //console.log(JSON.stringify(result));
      sendMqttStatistics(JSON.stringify(result));
    });
  });
}




/*
Sockets doors
*/

//FIXME Please, be more KISS and DRY :(
socket.on('connect', function(){
  console.log("connect socket")
});

socket.on(p1_s, function(data) {
  document.getElementById('countPersonUpDoor1').innerHTML = data;
});
socket.on(p1_b, function(data) {
  document.getElementById('countPersonDownDoor1').innerHTML = data;
});

socket.on(p1_t, function(data) {
  document.getElementById('countPersonTotalDoor1').innerHTML = data;
});

socket.on(p2_s, function(data) {
  document.getElementById('countPersonUpDoor2').innerHTML = data;
});
socket.on(p2_b, function(data) {
  document.getElementById('countPersonDownDoor2').innerHTML = data;
});

socket.on(p3_s, function(data) {
  document.getElementById('countPersonUpDoor3').innerHTML = data;
});
socket.on(p3_b, function(data) {
  document.getElementById('countPersonDownDoor3').innerHTML = data;
});
socket.on("arduinoError", function(data) {
  //document.getElementById('countPersonDownDoor3').innerHTML = data;
  MqttClient.mqttClientDevice.publish('iot-2/evt/arduino/fmt/string',data);
});



/*
timer action
*/
timer.addEventListener('secondsUpdated', function (e) {
  document.getElementById('currentTime').innerHTML = timer.getTimeValues().toString() ;
});
timer.addEventListener('started', function (e) {
    document.getElementById('currentTime').innerHTML = timer.getTimeValues().toString() ;
});

function stopTimer(){
  timer.stop();
}

function startTimer(){
  timer.start();
}

function pauseTimer(){
  timer.pause();
}

/*
end timer action
*/
