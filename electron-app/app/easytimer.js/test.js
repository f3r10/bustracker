var timerjs = require('./src/timer.js');

var myTimer = timerjs.getTimer();
myTimer.start({callback: function (e) { console.log('timer1',e)}});
myTimer.addEventListener('secondsUpdated', function () {console.log('timer1', myTimer.getSeconds(), myTimer.getTotalSeconds(), myTimer.getTotalMinutes())});
myTimer.addEventListener('minutesUpdated', function () {console.log('timer1', myTimer.getMinutes())});
