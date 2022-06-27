'use strict';

const { ipcMain, Tray, Menu } = require('electron')

module.exports = (mainWindow) => {
    ipcMain.on('app-open-files-by-id', (win, filePaths) => win.webContents.send('file:readFileSuccess', filePaths))
    ipcMain.on('app-open-folder-by-id', (win, filePaths) => win.webContents.send('file:readFolderSuccess', filePaths))
    ipcMain.on('create-new-editor-tab', (win, _) => win.webContents.send('editor:createNewEditorTab'))
    ipcMain.on('editor-text-shortcut-key', (win, command, params) => win.webContents.send('editor:parseShortcutKeyCommand', command, params))
    ipcMain.on('close-current-editor-tab', win => win.webContents.send('editor:closeCurrentEditorTab'))
    
    ipcMain.on('window:global:display', (e, command) => {
        if (command === 'minimize') {
            mainWindow.minimize()
            e.returnValue = mainWindow.isMinimized()
        } else if (command === 'maximize') {
            mainWindow.maximize()
            e.returnValue = mainWindow.isMaximized()
        } else if (command === 'unmaximize') {
            mainWindow.unmaximize()
            e.returnValue = !mainWindow.isMaximized() && !mainWindow.isMinimized()
        } else if (command === 'to-tray') {
            const contextMenu = Menu.buildFromTemplate([
                {
                    label: '退出',
                    click: () => mainWindow.quit()
                }
            ]);
            const appTray = new Tray('../public/favicon.ico');
            appTray.setToolTip('never forget');
            appTray.setContextMenu(contextMenu);
            appTray.on('click', () => {
                mainWindow.show()
                appTray.destroy()
            })
            mainWindow.hide()
            e.returnValue = true
        }
    })
}