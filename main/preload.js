const { BrowserWindow } = require('@electron/remote')

global.electron = require('electron');
window.app = require('electron').app;
window.ipcRenderer = require('electron').ipcRenderer;
window.remote = require('@electron/remote');
window.BrowserWindow = BrowserWindow;