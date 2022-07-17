'use strict';

const { ipcMain, Tray, Menu, nativeImage } = require('electron')
const path = require('path')

module.exports = (mainWindow) => {

    const appTray = new Tray(nativeImage.createFromPath(path.join(__dirname, '../public/favicon.png')));
    appTray.setToolTip('EasyMark - 轻松开启您的写作之旅');
    appTray.setContextMenu(Menu.buildFromTemplate([
        {
            label: '打开主窗口',
            click: () => mainWindow.show()
        },
        {
            label: 'EasyMark Cloud'
        },
        {
            type: 'separator'
        },
        {
            label: '设置'
        },
        {
            label: '运行日志'
        },
        {
            label: '完全退出',
            click: () => mainWindow.quit()
        },
    ]));

    ipcMain.on('app-open-files-by-id', (win, filePaths) => win.webContents.send('file:readFileSuccess', filePaths))
    ipcMain.on('app-open-folder-by-id', (win, filePaths) => win.webContents.send('file:readFolderSuccess', filePaths))
    ipcMain.on('switch-sider-bar-display', win => win.webContents.send('editor:switchSiderBarDisplay'))
    ipcMain.on('switch-source-code-view', win => win.webContents.send('editor:switchSourceCodeView'))
    ipcMain.on('create-new-editor-tab', (win, _) => win.webContents.send('editor:createNewEditorTab'))
    ipcMain.on('close-current-editor-tab', win => win.webContents.send('editor:closeCurrentEditorTab'))
    
    ipcMain.on('window:global:display', (e, command) => {
        if (command === 'minimize') {
            mainWindow.minimize()
            e.returnValue = mainWindow.isMinimized()
        } else if (command === 'fullscreen') {
            console.log('full')
            mainWindow.setFullScreen(true)
            e.returnValue = true
        } else if (command === 'normalscreen') {
            console.log('normal')
            mainWindow.setFullScreen(false)
            e.returnValue = false
        } else if (command === 'to-tray') {
            appTray.on('click', () => mainWindow.show())
            mainWindow.hide()
            e.returnValue = true
        }
    })
}