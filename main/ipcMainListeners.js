'use strict';

const { ipcMain } = require('electron')

module.exports = () => {
    ipcMain.on('app-open-files-by-id', (win, filePaths) => win.webContents.send('file:readFileSuccess', filePaths))
    ipcMain.on('app-open-folder-by-id', (win, filePaths) => win.webContents.send('file:readFolderSuccess', filePaths))
}