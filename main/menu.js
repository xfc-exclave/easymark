const { dialog, app, ipcMain, Menu } = require("electron")

const menuTemplate = [
  {
      label: '文件(F)',
      submenu: [
          {
              label: '新建',
              accelerator: 'CmdOrCtrl+N',
              click: (_, win) => ipcMain.emit('create-new-editor-tab', win)
          },
          {
              label: '新建窗口',
              accelerator: 'CmdOrCtrl+Shift+N'
          },
          {
              type: 'separator'
          },
          {
              label: '打开...',
              accelerator: 'CmdOrCtrl+O',
              click: async (_, win) => {
                  const { filePaths } = await dialog.showOpenDialog(win, {
                      title: "打开",
                      buttonLabel: "打开(O)",
                      properties: ['openFile', 'multiSelections'],
                      filters: [
                          {
                              name: 'Markdown File',
                              extensions: ['md', 'markdown', 'text', 'txt', 'mmd', 'mdwn', 'mdown', '']
                          },
                      ]
                  })
                  if (Array.isArray(filePaths) && filePaths.length > 0) {
                    ipcMain.emit('app-open-files-by-id', win, filePaths)
                  }
              }
          },
          {
              label: '打开文件夹...',
              click: (_, win) => {
                  dialog.showOpenDialog(win, {
                      title: "选择文件夹",
                      buttonLabel: "选择文件夹",
                      properties: ['openDirectory'],
                  }).then(result => {
                      if (!result.canceled) {
                          ipcMain.emit('app-open-folder-by-id', win, result.filePaths)
                      }
                  }).catch(err => {
                      console.log(err)
                  })
              }
          },
          {
              type: 'separator'
          },
          {
              label: '快速打开...',
              accelerator: 'CmdOrCtrl+P',
          },
          {
              label: '打开最近文件...',
              submenu: [
                  {
                      label: '重新打开关闭的文件',
                      accelerator: 'CmdOrCtrl+Shift+T',
                  },
                  {
                      type: 'separator'
                  },
                  {
                      label: '清除最近文件',
                  },
              ]
          },
          {
              label: '选择编码重新打开',
              submenu: [
                  {
                      label: '自动',
                  },
                  {
                      type: 'separator'
                  },
                  {
                      label: 'UTF-8',
                  },
                  {
                      label: 'UTF-16 LE',
                  },
                  {
                      label: 'UTF-16 BE',
                  },
                  {
                      type: 'separator'
                  },
                  {
                      label: 'Western (windows-1252)',
                  },
                  {
                      label: 'Cyrillic (windows-1252)',
                  },
                  {
                      label: 'Cyrillic (ISO-8859-1)',
                  },
                  {
                      label: 'Cyrillic (IBM886)',
                  },
                  {
                      label: 'Cyrillic (IBM855)',
                  },
                  {
                      label: 'Cyrillic (KOI8-R)',
                  },
                  {
                      label: 'Cyrillic (MacCyrillic)',
                  },
                  {
                      label: 'Central European (windows-1250)',
                  },
                  {
                      label: 'Central European (ISO-8859-2)',
                  },
                  {
                      label: 'Geek (windows-1253)',
                  },
                  {
                      label: 'Geek (ISO-8859-7)',
                  },
                  {
                      label: 'Hebrew (windows-1255)',
                  },
                  {
                      label: 'Hebrew (ISO-8859-8)',
                  },
                  {
                      label: 'Chinese Simplified (GB2312)',
                  },
                  {
                      label: 'Chinese Simplified (GB18030)',
                  },
                  {
                      label: 'Chinese Traditional (Big5)',
                  },
                  {
                      label: 'Japanese (SHIFT JIS)',
                  },
                  {
                      label: 'Japanese (EUC-JP)',
                  },
                  {
                      label: 'Korean (EUC-KR)',
                  },
                  {
                      label: 'Thai (TIS-620)',
                  },
              ]
          },
          {
              type: 'separator'
          },
          {
              label: '保存',
              accelerator: 'CmdOrCtrl+S',
              click: () => {
              }
          },
          {
              label: '保存为...',
              accelerator: 'CmdOrCtrl+Shift+S',
              click: () => {
                  dialog.showSaveDialogSync({
                      title: '保存为...'
                  }).then(result => {
                      console.log(result)
                  }).catch(err => {
                      console.log(err)
                  })
              }
          },
          {
              label: '保存全部打开的文件',
          },
          {
              type: 'separator'
          },
          {
              label: '打开文件位置...',
          },
          {
              label: '在侧边栏中显示',
          },
          {
              label: '属性',
          },
          {
              type: 'separator'
          },
          {
              label: '导入...',
          },
          {
              label: '导出',
              submenu: [
                  {
                      label: 'PDF',
                  },
                  {
                      label: 'HTML',
                  },
                  {
                      label: 'HTML (without styles)',
                  },
                  {
                      type: 'separator'
                  },
                  {
                      label: 'Word (.docx)',
                  },
                  {
                      label: 'OpenOffice',
                  },
                  {
                      label: 'RTF',
                  },
                  {
                      label: 'Epub',
                  },
                  {
                      label: 'LaTeX',
                  },
                  {
                      label: 'Media Wiki',
                  },
                  {
                      label: 'reStructuredText',
                  },
                  {
                      label: 'Textile',
                  },
                  {
                      label: 'OPML',
                  },
                  {
                      type: 'separator'
                  },
                  {
                      label: '图像',
                  },
              ]
          },
          {
              label: '打印...',
          },
          {
              type: 'separator'
          },
          {
              label: '偏好设置...',
              accelerator: 'CmdOrCtrl+,',
          },
          {
              type: 'separator'
          },
          {
              label: '刷新',
              accelerator: 'F5',
              click: (_, win) => win.loadURL('http://localhost:3000/')
          },
          {
              label: '关闭',
              accelerator: 'CmdOrCtrl+W',
              click: (_, win) => ipcMain.emit('close-current-editor-tab', win)
          },
          {
              label: '结束进程',
              accelerator: 'CmdOrCtrl+Q',
              click: () => app.quit()
          },
      ]
  },
  {
      label: '编辑(E)',
      submenu: [
          {
              label: '撤销',
              accelerator: 'CmdOrCtrl+Z',
              enabled: false
          },
          {
              label: '重做',
              accelerator: 'CmdOrCtrl+Y',
              enabled: false
          },
          {
              type: 'separator'
          },
          {
              label: '剪切',
              accelerator: 'CmdOrCtrl+X',
          },
          {
              label: '复制',
              accelerator: 'CmdOrCtrl+C',
          },
          {
              label: '粘贴',
              accelerator: 'CmdOrCtrl+V',
          },
          {
              type: 'separator'
          },
          {
              label: '复制为纯文本',
          },
          {
              label: '复制为 Markdown',
              accelerator: 'CmdOrCtrl+Shift+C',
          },
          {
              label: '复制为 HTML 代码',
          },
          {
              label: '复制内容并简化格式',
          },
          {
              type: 'separator'
          },
          {
              label: '粘贴为纯文本',
              accelerator: 'CmdOrCtrl+Shift+V',
          },
          {
              type: 'separator'
          },
          {
              label: '选择',
              submenu: [
                  {
                      label: '全选',
                      accelerator: 'CmdOrCtrl+A',
                  },
                  {
                      label: '选中当前行 / 句',
                      accelerator: 'CmdOrCtrl+L',
                  },
                  {
                      label: '选中当前格式文本',
                      accelerator: 'CmdOrCtrl+E',
                  },
                  {
                      label: '选中当前词',
                      accelerator: 'CmdOrCtrl+D',
                  },
                  {
                      type: 'separator'
                  },
                  {
                      label: '跳转到文首',
                      accelerator: 'CmdOrCtrl+Home',
                  },
                  {
                      label: '跳转到所选内容',
                      accelerator: 'CmdOrCtrl+J',
                  },
                  {
                      label: '跳转到文末',
                      accelerator: 'CmdOrCtrl+End',
                  },
              ]
          },
          {
              type: 'separator'
          },
          {
              label: '删除',
          },
          {
              label: '删除范围',
              submenu: [
                  {
                      label: '删除当前词',
                      accelerator: 'CmdOrCtrl+Shift+D',
                  },
                  {
                      label: '删除当前格式文本',
                  },
                  {
                      label: '删除当前行 / 句',
                  },
                  {
                      label: '删除块',
                  },
              ]
          },
          {
              type: 'separator'
          },
          {
              label: '数学工具',
              submenu: [
                  {
                      label: '刷新所有数学公式',
                  },
              ]
          },
          {
              type: 'separator'
          },
          {
              label: '智能标点',
              submenu: [
                  {
                      label: '输入时转换',
                      type: 'checkbox',
                      checked: true
                  },
                  {
                      label: '渲染时转换',
                  },
                  {
                      type: 'separator'
                  },
                  {
                      label: '智能引号',
                  },
                  {
                      label: '智能破折号',
                  },
                  {
                      type: 'separator'
                  },
                  {
                      label: '解析 Markdown 时允许并转化 Unicode 标点',
                  },
                  {
                      type: 'separator'
                  },
                  {
                      label: '更多选项...',
                  },
              ]
          },
          {
              label: '换行符',
              submenu: [
                  {
                      label: 'Windows 换行符(CRLF)',
                      type: 'checkbox',
                      checked: true
                  },
                  {
                      label: 'Unix 换行符(LF)',
                  },
              ]
          },
          {
              label: '空格与换行',
              submenu: [
                  {
                      label: '首行缩进',
                  },
                  {
                      type: 'separator'
                  },
                  {
                      label: '显示 <br/>',
                      type: 'checkbox',
                      checked: true
                  },
                  {
                      label: '保留单换行符',
                      type: 'checkbox',
                      checked: true
                  },
                  {
                      type: 'separator'
                  },
                  {
                      label: '了解更多...',
                  },
              ]
          },
          {
              label: '拼写检查...',
          },
          {
              type: 'separator'
          },
          {
              label: '查找和替换',
              submenu: [
                  {
                      label: '保留单换行符',
                      accelerator: 'CmdOrCtrl+F',
                  },
                  {
                      label: '查找下一个',
                      accelerator: 'F3',
                  },
                  {
                      label: '查找上一个',
                      accelerator: 'Shift+F3',
                  },
                  {
                      type: 'separator'
                  },
                  {
                      label: '替换',
                      accelerator: 'CmdOrCtrl+H',
                  },
              ]
          },
      ]
  },
  {
      label: '段落(P)',
      submenu: [
          {
              label: '一级标题',
              accelerator: 'CmdOrCtrl+1',
              click: (_, win) => ipcMain.emit('editor-text-shortcut-key', win, 'CTRL-1')
          },
          {
              label: '二级标题',
              accelerator: 'CmdOrCtrl+2',
              click: (_, win) => ipcMain.emit('editor-text-shortcut-key', win, 'CTRL-2')
          },
          {
              label: '三级标题',
              accelerator: 'CmdOrCtrl+3',
              click: (_, win) => ipcMain.emit('editor-text-shortcut-key', win, 'CTRL-3')
          },
          {
              label: '四级标题',
              accelerator: 'CmdOrCtrl+4',
              click: (_, win) => ipcMain.emit('editor-text-shortcut-key', win, 'CTRL-4')
          },
          {
              label: '五级标题',
              accelerator: 'CmdOrCtrl+5',
              click: (_, win) => ipcMain.emit('editor-text-shortcut-key', win, 'CTRL-5')
          },
          {
              label: '六级标题',
              accelerator: 'CmdOrCtrl+6',
              click: (_, win) => ipcMain.emit('editor-text-shortcut-key', win, 'CTRL-6')
          },
          {
              type: 'separator'
          },
          {
              label: '段落',
              accelerator: 'CmdOrCtrl+0',
              type: 'checkbox',
              checked: true
          },
          {
              type: 'separator'
          },
          {
              label: '提升标题级别',
              accelerator: 'CmdOrCtrl+=',
          },
          {
              label: '降低标题级别',
              accelerator: 'CmdOrCtrl+-',
          },
          {
              type: 'separator'
          },
          {
              label: '表格',
              submenu: [
                  {
                      label: '插入表格',
                      accelerator: 'CmdOrCtrl+T',
                  },
                  {
                      type: 'separator'
                  },
                  {
                      label: '上方插入表格',
                      enabled: false,
                  },
                  {
                      label: '下方插入表格',
                      accelerator: 'CmdOrCtrl+Enter',
                      enabled: false,
                  },
                  {
                      type: 'separator'
                  },
                  {
                      label: '左侧插入表格',
                      enabled: false,
                  },
                  {
                      label: '右侧插入表格',
                      enabled: false,
                  },
                  {
                      type: 'separator'
                  },
                  {
                      label: '上移该行',
                      accelerator: 'CmdOrCtrl+Up',
                      enabled: false,
                  },
                  {
                      label: '下移该行',
                      accelerator: 'CmdOrCtrl+Down',
                      enabled: false,
                  },
                  {
                      label: '左移该行',
                      accelerator: 'CmdOrCtrl+Left',
                      enabled: false,
                  },
                  {
                      label: '右移该行',
                      accelerator: 'CmdOrCtrl+Right',
                      enabled: false,
                  },
                  {
                      type: 'separator'
                  },
                  {
                      label: '删除行',
                      accelerator: 'CmdOrCtrl+Shift+Backspace',
                      enabled: false,
                  },
                  {
                      label: '删除列',
                      enabled: false,
                  },
                  {
                      type: 'separator'
                  },
                  {
                      label: '复制表格',
                      enabled: false,
                  },
                  {
                      label: '格式化表格源码',
                      enabled: false,
                  },
                  {
                      type: 'separator'
                  },
                  {
                      label: '删除表格',
                      enabled: false,
                  },
              ]
          },
          {
              label: '代码块',
              accelerator: 'CmdOrCtrl+Shift+K',
          },
          {
              label: '公式块',
              accelerator: 'CmdOrCtrl+Shift+M',
          },
          {
              type: 'separator'
          },
          {
              label: '引用',
              accelerator: 'CmdOrCtrl+Shift+Q',
          },
          {
              type: 'separator'
          },
          {
              label: '有序列表',
              accelerator: 'CmdOrCtrl+Shift+[',
              type: 'checkbox',
          },
          {
              label: '无序列表',
              accelerator: 'CmdOrCtrl+Shift+]',
              type: 'checkbox',
              checked: true
          },
          {
              label: '任务列表',
          },
          {
              label: '任务状态',
              enabled: false,
              submenu: [
                  {
                      label: '切换任务状态',
                  },
                  {
                      type: 'separator'
                  },
                  {
                      label: '标记为已完成',
                  },
                  {
                      label: '标记为未完成',
                  },
              ]
          },
          {
              label: '列表缩进',
              submenu: [
                  {
                      label: '增加缩进',
                      accelerator: 'CmdOrCtrl+]',
                  },
                  {
                      label: '减少缩进',
                      accelerator: 'CmdOrCtrl+[',
                  },
              ]
          },
          {
              type: 'separator'
          },
          {
              label: '链接引用',
          },
          {
              label: '脚注',
          },
          {
              type: 'separator'
          },
          {
              label: '水平分割线',
          },
          {
              label: '内容目录',
          },
          {
              label: 'YAML Front Matter',
          },
      ]
  },
  {
      label: '格式(O)',
      submenu: [
          {
              label: '加粗',
              accelerator: 'CmdOrCtrl+B',
          },
          {
              label: '斜体',
              accelerator: 'CmdOrCtrl+I',
          },
          {
              label: '下划线',
              accelerator: 'CmdOrCtrl+U',
          },
          {
              label: '代码',
              accelerator: 'CmdOrCtrl+Shift+`',
          },
          {
              type: 'separator'
          },
          {
              label: '删除线',
              accelerator: 'CmdOrCtrl+Shift+S',
          },
          {
              label: '注释',
          },
          {
              type: 'separator'
          },
          {
              label: '超链接',
              accelerator: 'CmdOrCtrl+K',
          },
          {
              label: '图像',
              submenu: [
                  {
                      label: '插入图片',
                      accelerator: 'CmdOrCtrl+Shift+I',
                  },
                  {
                      label: '插入本地图片...',
                  },
                  {
                      type: 'separator'
                  },
                  {
                      label: '打开图片位置...',
                      enabled: false,
                  },
                  {
                      label: '复制图片到...',
                      enabled: false,
                  },
                  {
                      label: '上传图片',
                      enabled: false,
                  },
                  {
                      label: '缩放图片',
                      enabled: false,
                      submenu: [
                          {
                              label: '25%',
                          },
                          {
                              label: '33%',
                          },
                          {
                              label: '50%',
                          },
                          {
                              label: '67%',
                          },
                          {
                              label: '80%',
                          },
                          {
                              type: 'separator'
                          },
                          {
                              label: '100%',
                          },
                          {
                              type: 'separator'
                          },
                          {
                              label: '150%',
                          },
                          {
                              label: '200%',
                          },
                      ]
                  },
                  {
                      type: 'separator'
                  },
                  {
                      label: '上传所有本地图片',
                  },
                  {
                      label: '当插入本地图片时',
                      submenu: [
                          {
                              label: '复制图片到文件夹...',
                          },
                          {
                              label: '上传图片',
                          },
                      ]
                  },
                  {
                      label: '设置图片根目录...',
                  },
                  {
                      type: 'separator'
                  },
                  {
                      label: '全局图像设置...',
                  },
              ],
          },
          {
              type: 'separator'
          },
          {
              label: '清除样式',
              accelerator: 'CmdOrCtrl+\\',
          },
      ]
  },
  {
      label: '视图(V)',
      submenu: [
          {
              label: '显示 / 隐藏侧边栏',
              accelerator: 'CmdOrCtrl+Shift+L',
          },
          {
              label: '大纲',
              accelerator: 'CmdOrCtrl+Shift+1',
              type: 'checkbox',
          },
          {
              label: '文档列表',
              accelerator: 'CmdOrCtrl+Shift+2',
              type: 'checkbox',
          },
          {
              label: '文件树',
              accelerator: 'CmdOrCtrl+Shift+3',
              type: 'checkbox',
              checked: true
          },
          {
              label: '搜索',
              accelerator: 'CmdOrCtrl+Shift+F',
          },
          {
              type: 'separator'
          },
          {
              label: '源代码模式',
              accelerator: 'CmdOrCtrl+/',
              type: 'checkbox',
          },
          {
              type: 'separator'
          },
          {
              label: '专注模式',
              accelerator: 'F8',
          },
          {
              label: '打字机模式',
              accelerator: 'F9',
          },
          {
              type: 'separator'
          },
          {
              label: '显示状态栏',
              type: 'checkbox',
              checked: true
          },
          {
              type: 'separator'
          },
          {
              label: '切换全屏',
              accelerator: 'F11',
              click: (_, win) => win.isMaximized() ? win.maximize() : win.unmaximize()
          },
          {
              label: '保持窗口在最前端',
          },
          {
              type: 'separator'
          },
          {
              label: '实际大小',
              accelerator: 'CmdOrCtrl+Shift+9',
              type: 'checkbox',
              checked: true
          },
          {
              label: '放大',
              accelerator: 'CmdOrCtrl+Shift+=',
          },
          {
              label: '缩小',
              accelerator: 'CmdOrCtrl+Shift+-',
          },
          {
              type: 'separator'
          },
          {
              label: '应用内窗口切换',
              accelerator: 'CmdOrCtrl+Tab',
          },
          {
              type: 'separator'
          },
          {
              label: '开发者工具',
              accelerator: 'Shift+F12',
              click: (_, win) => win.webContents.toggleDevTools()
          },
      ]
  },
  {
      label: '主题(T)',
      submenu: [
          {
              label: 'Github',
              type: 'checkbox',
              checked: true
          },
          {
              label: 'Newsprint',
              type: 'checkbox'
          },
          {
              label: 'Night',
              type: 'checkbox'
          },
          {
              label: 'Pixyll',
              type: 'checkbox'
          },
          {
              label: 'Whitey',
              type: 'checkbox'
          },
      ]
  },
  {
      label: '帮助(H)',
      submenu: [
          {
              label: 'Quick Start',
          },
          {
              label: 'Markdown Reference',
          },
          {
              label: 'Install and Use Pandoc',
          },
          {
              label: 'Custom Themes',
          },
          {
              label: 'Use Images in EasyMark',
          },
          {
              label: '更多主题...',
          },
          {
              type: 'separator'
          },
          {
              label: '鸣谢',
          },
          {
              label: '更新日志',
          },
          {
              label: '隐私条款',
          },
          {
              label: '网站',
          },
          {
              label: '反馈',
          },
          {
              type: 'separator'
          },
          {
              label: '检查更新',
          },
          {
              label: '关于',
              click: async () => {
                  const { shell } = require('electron')
                  await shell.openExternal('https://www.chinmoku.cc')
              }
          },
      ]
  }
]

const appMenu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(appMenu);