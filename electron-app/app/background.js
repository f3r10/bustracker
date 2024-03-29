// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import { app, BrowserWindow, Tray, Menu } from 'electron';
import devHelper from './vendor/electron_boilerplate/dev_helper';
import windowStateKeeper from './vendor/electron_boilerplate/window_state';
const path = require('path');
// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';

var mainWindow;
var appIcon = null;
// Preserver of the window size and position between app launches.
var mainWindowState = windowStateKeeper('main', {
    width: 800,
    height: 400
});

app.on('ready', function () {
    mainWindow = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        autoHideMenuBar: true
    });

    

    if (env.name === 'test') {
        mainWindow.loadURL('file://' + __dirname + '/spec.html');
    } else {
        mainWindow.loadURL('file://' + __dirname + '/app.html');
    }

    if(env.name === 'production') {
        mainWindow.setFullScreen(true);
    }

    if (env.name !== 'production') {
        //devHelper.setDevMenu();
        mainWindow.openDevTools();
        mainWindow.setFullScreen(false);
    }

    mainWindow.on('close', function () {
        mainWindowState.saveState(mainWindow);
    });
 
});

app.on('window-all-closed', function () {
    app.quit();
});
