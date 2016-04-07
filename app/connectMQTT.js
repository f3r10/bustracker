import mqtt from 'mqtt';
import env from './env';

var baseIdDevice = 'd:61paat:bus-ecuatoriana:';
var deviceId;
var productionDevice = '987654321';
var developmentDevice = 'dev-rpi-1';
var username = 'use-token-auth';
var password;


if (env.name === 'production') {
  deviceId = baseIdDevice + productionDevice;
  password = 'OmeWF7-n4!ctDeNsWd';
}

if(env.name === 'development'){
  deviceId = baseIdDevice + developmentDevice;
  password = 's&buvviVDvV5OruoT7';
}

let mqttClientDevice = mqtt.connect("mqtt://61paat.messaging.internetofthings.ibmcloud.com", {port:1883, username: username, password: password, clientId:deviceId});
//let mqttClientApplication = mqtt.connect("mqtt://61paat.messaging.internetofthings.ibmcloud.com", {port:1883, username: 'a-61paat-jphqublxfi', password: 'Y(sT0whXQ2rpf132jx', clientId:'a:61paat:bus-ecuatoriana:client'});

let mqttClient = {
  mqttClientDevice: mqttClientDevice
}
export default mqttClient;

let instance = null;

/*export default class {
    constructor() {
        if(!instance){
              instance = this;
        }

        // to test whether we have singleton or not
        this.clientDevice = mqttClientDevice;
        this.clientApplication = mqttClientApplication;

        return instance;
      }
}*/
