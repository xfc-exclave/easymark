const { BrowserWindow } = require('@electron/remote')

global.electron = require('electron');
window.ipcRenderer = require('electron').ipcRenderer;
window.BrowserWindow = BrowserWindow