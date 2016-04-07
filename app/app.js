// Here is the starting point for your application code.
// All stuff below is just to show you how it works. You can delete all of it.

// Use new ES6 modules syntax for everything.
import os from 'os'; // native node.js module
import { remote } from 'electron'; // native electron module
import jetpack from 'fs-jetpack'; // module loaded from npm
import { greet } from './hello_world/hello_universe'; // code authored by you in this project
import env from './env';
var Timer = require('./node_modules/easytimer.js/dist/easytimer.min.js')
import mongoose from 'mongoose'

import Cache from './cacheTest';


var app = remote.app;
var appDir = jetpack.cwd(app.getAppPath());

// Holy crap! This is browser window with HTML and stuff, but I can read
// here files like it is node.js! Welcome to Electron world :)
//console.log('The author of this app is:', appDir.read('package.json', 'json').author);

document.addEventListener('DOMContentLoaded', function () {

});
/*var timer = new Timer();
timer.start();
timer.addEventListener('secondsUpdated', function (e) {
  document.getElementById('currentTime').innerHTML = timer.getTimeValues().toString() ;
});
timer.addEventListener('started', function (e) {
    document.getElementById('currentTime').innerHTML = timer.getTimeValues().toString() ;
});*/

let cache = new Cache();
console.log(cache.time);


setTimeout(function(){
  let cache = new Cache();
  console.log( "from app " + cache.time);
},4000);
////////////// mongoose


/*var modelTest = {
  name : "test8",
  geo  : [ 4.926208, 52.388065 ]
}
//location.create(modelTest)
location.createAsync(modelTest)
        .then(console.log("se crea"))
        .catch(console.log("detecta error"));*/
