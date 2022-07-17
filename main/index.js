const { app, nativeImage, BrowserWindow } = require("electron")
const path = require('path')

require('./menu')
const registerIpcListeners = require('./ipcMainListeners')
const isDevelopment = !app.isPackaged;

if (isDevelopment) {
    require('electron-reload')(path.join(__dirname, "src"));
}

function createWindow() {
    let mainWindow = new BrowserWindow({
        width: 1300,
        minWidth: 800,
        height: 800,
        minHeight: 400,
        frame: false,
        title: "EasyMark", // 窗口标题,如果由loadURL()加载的HTML文件中含有标签<title>，该属性可忽略
        icon: nativeImage.createFromPath('public/favicon.png'), // "string" || nativeImage.createFromPath('src/image/icons/256x256.ico')从位于 path 的文件创建新的 NativeImage 实例
        webPreferences: { // 网页功能设置
            nodeIntegration: true, // 是否启用node集成 渲染进程的内容有访问node的能力
            webviewTag: true, // 是否使用<webview>标签 在一个独立的 frame 和进程里显示外部 web 内容
            webSecurity: false, // 禁用同源策略
            contextIsolation: false,
            enableRemoteModule: true,
            nodeIntegrationInSubFrames: true, // 是否允许在子页面(iframe)或子窗口(child window)中集成Node.js
            preload: path.join(__dirname, 'preload.js')
        }
    });
    require('@electron/remote/main').initialize()
    require('@electron/remote/main').enable(mainWindow.webContents)

    // 加载应用 --打包react应用后，__dirname为当前文件路径
    // mainWindow.loadURL(url.format({
    //   pathname: path.join(__dirname, '../build/index.html'),
    //   protocol: 'file:',
    //   slashes: true
    // }));

    // 加载应用 --开发阶段  需要运行 npm run start
    mainWindow.loadURL('http://localhost:3000/');

    // 解决应用启动白屏问题
    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
        mainWindow.focus();
    });

    // 当窗口关闭时发出。在你收到这个事件后，你应该删除对窗口的引用，并避免再使用它。
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    return mainWindow
}

app.whenReady().then(() => {
    const mainWindow = createWindow()

    registerIpcListeners(mainWindow);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
});

app.on('window-all-closed', () => {
    app.clearRecentDocuments()
    if (process.platform !== 'darwin') app.quit()
});

try {
	require('electron-reloader')(module, {});
} catch (_) {}