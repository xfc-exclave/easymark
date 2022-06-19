'use strict';

const { ipcMain } = require('electron')

module.exports = () => {
    ipcMain.on('app-open-files-by-id', (win, filePath) => {
        win.webContents.send('readFileSuccess', 'abc')
    })
}