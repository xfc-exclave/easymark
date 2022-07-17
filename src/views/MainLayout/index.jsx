import React, { Fragment } from "react";
import { Layout, Row, Col, Dropdown, Tabs, Modal, Menu, Empty, Button } from 'antd';
import {
  SettingFilled,
  MenuOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import { nanoid } from "nanoid";
import FileTree from "../../containers/FileTree";
import EditorHeader from "../../components/EditorHeader";
import EditorFooter from "../../components/EditorFooter";
import MarkEditor from "../../containers/MarkEditor";
import MilkEditor from "../../containers/MilkEditor";
import menuTemplate from "../../components/menu"
import { generateToc } from "../../common/utils/toc";
import IconFont from "../../common/utils/iconfont";
import "./index.css";

const fs = window.require('fs')
const { dialog } = window.remote;

const { TabPane } = Tabs;
const { Content, Sider } = Layout;
const { confirm } = Modal;

export default function MainLayout(props) {

  const [collapsed, setCollapsed] = React.useState(true)
  const [nightMode, setNightMode] = React.useState(false)
  const switchToolView = () => setCollapsed(prev => !prev)
  const siderWidth = 250;
  const editors = props.data.editorReducer;
  const activeKey = props.data.activeReducer
  const { setActiveKey } = props
  const findEditorByKey = key => editors.find(o => o.key === key)
  const activeEditor = findEditorByKey(activeKey)

  const [sourceView, setSourceView] = React.useState(true)

  const [fileRecords, setFileRecords] = React.useState([])

  const [wordCount, setWordCount] = React.useState(0)
  const onContentChange = (size, curEditor) => {
    setWordCount(size)
    const treeData = generateToc(curEditor.tempContent)
    setTocData(treeData)
  }
  const switchSourceView = () => {
    if (activeKey === '0') return
    editors.forEach(editor => {
      if (editor.key === activeKey) {
        editor.content = editor.tempContent
      }
    })
    setSourceView(prev => !prev)
  }

  const moreMenu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">File</a>
          ),
          children: []
        },
        {
          key: '2',
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">Edit</a>
          ),
          children: []
        },
        {
          key: '3',
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">Paragraph</a>
          ),
          children: [
            {
              key: '3-1',
              label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">Paragraph</a>
              ),
            }
          ]
        },
      ]}
    />
  );

  const setEditors = items => props.saveEditors(items);
  const addEditor = item => props.addEditor(item);

  const findEditorByPath = pathname => editors.find(o => pathname !== '' && o.pathname === pathname)

  const [currentFolderPath, setCurrentFolderPath] = React.useState(null)

  React.useEffect(() => {
    window.ipcRenderer.on('file:readFileSuccess', (_, filePaths) => filePaths.forEach(pathname => readMarkdown(pathname)))
    window.ipcRenderer.on('file:readFolderSuccess', (_, paths) => setCurrentFolderPath(paths[0]))
    window.ipcRenderer.on('editor:createNewEditorTab', () => createEditorWindow())
    window.ipcRenderer.on('editor:switchSiderBarDisplay', () => switchToolView())
    // window.ipcRenderer.on('editor:closeCurrentEditorTab', () => closeEditor(activeKey))
    // window.ipcRenderer.on('editor:switchSourceCodeView', () => switchSourceView(activeKey))
  }, [])

  React.useEffect(() => {
    window.ipcRenderer.on('editor:closeCurrentEditorTab', () => closeEditor(activeKey))
    window.ipcRenderer.on('editor:switchSourceCodeView', () => switchSourceView())
  }, [activeKey])

  const [tocData, setTocData] = React.useState([])
  const readMarkdown = async pathname => {
    pathname = pathname.replaceAll('\\', '/')
    let title = pathname.substring(pathname.lastIndexOf('/') + 1)
    if (window.platform === 'darwin') {
      title = title.substring(title.lastIndexOf('/') + 1)
    }
    await fs.readFile(pathname, { encoding: 'utf-8' }, (err, dirent) => {
      if (err) {
        console.log(err)
      }
      const content = dirent.toString()
      const openedFile = findEditorByPath(pathname)
      if (openedFile != null) {
        setActiveKey(openedFile.key);
      } else {
        let curEditor = findEditorByKey(activeKey)
        const item = { title, content, status: 'saved', pathname }
        if (curEditor != null && curEditor.status === 'initialized') {
          editors.forEach(editor => {
            if (editor.key === curEditor.key) {
              Object.assign(editor, item)
              item.key = editor.key
            }
          })
        } else {
          item.key = nanoid()
          createEditorWindow(item, pathname)
        }

        let recordExist = false
        fileRecords.forEach(record => {
          if (record.key === item.key) {
            record = { pathname, key: item.key }
            recordExist = true
          }
        })
        if (!recordExist) {
          setFileRecords([...fileRecords, {pathname, key: item.key}])
        }
      }
    })
  }

  const newTabIndex = React.useRef(1);
  const onChange = key => setActiveKey(key)

  const createEditorWindow = (item = null, path = '') => {
    const index = newTabIndex.current++
    item = item == null ? {
      title: 'untitled-' + index + '.md',
      content: '',
      key: nanoid(),
      status: 'initialized',
      pathname: path
    } : item
    addEditor(item)
    setActiveKey(item.key);
    return item
  };
  const closeEditor = key => {
    if (key === '0') return
    let tempKey = key
    if (editors.length) {
      tempKey = editors[editors.length - 1].key
      if (tempKey === key && editors.length > 1) {
        tempKey = editors[editors.length - 2].key
      }
    }
    let newEditors = editors.filter(editor => editor.key !== key)
    if (newEditors.length === 0) {
      newEditors = []
      setActiveKey('0')
      newTabIndex.current = 1
    } else {
      setActiveKey(tempKey)
    }
    setEditors(newEditors);
  };

  const openEditors = () => setEditors([createEditorWindow()])

  const openLocalFile = async () => {
    const { filePaths } = await dialog.showOpenDialog({
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
      const webContents = window.webContents.getFocusedWebContents()
      webContents.send('file:readFileSuccess', filePaths)
    }
  }

  const tabsHandler = (key, action) => {
    if (action === 'add') {
      createEditorWindow()
    } else {
      const editor = findEditorByKey(key)
      if (['saved', 'initialized'].indexOf(editor.status) > -1) {
        closeEditor(key)
      } else {
        confirm({
          title: 'Please confirm that...',
          icon: <ExclamationCircleOutlined />,
          content: 'Are you sure you want to leave with modifications not be saved?',
          okText: 'Save and Close',
          closable: true,
          cancelText: 'Dont\'t save',
          cancelButtonProps: {
            danger: true
          },
          onOk: () => closeEditor(key),
          onCancel: () => closeEditor(key),
        });
      }
    }
  };

  const showMenu = () => {
    const menu = window.remote.Menu.buildFromTemplate(menuTemplate)
    menu.popup({ window: window.remote.getCurrentWindow(), x: 20, y: 20 })
  }

  return (
    <Layout style={{minHeight: '100vh'}}>
      <Sider collapsible collapsed={collapsed} trigger={null} collapsedWidth={0} width={siderWidth}
        style={{
          overflow: 'hidden',
          position: 'fixed',
          padding: '30px 0',
          left: 0,
          top: 0,
          bottom: 0,
          background: '#2e3034'
        }}>
        { window.platform === 'darwin' ? <Fragment /> :
        <div style={{position: 'absolute', top: 0, left: 0, width: siderWidth, color: 'gray', height: 30, padding: '2px 10px'}}>
          <Row wrap={false}>
            <Col flex="none">
              <MenuOutlined style={{cursor: 'pointer', fontSize: '16px', paddingTop: '5px'}} onClick={showMenu} />
            </Col>
            <Col flex="auto" className="window-dragable">
              <span style={{ fontSize: '12px', cursor: 'default', userSelect: 'none', fontWeight: 'bold', marginLeft: '15px' }}>EasyMark - Take it easy!</span>
            </Col>
            <Col flex="none">
              <IconFont type="icon-icon_duoyun" />
            </Col>
          </Row>
        </div> }
        <FileTree siderWidth={siderWidth} recordList={fileRecords} folderPath={currentFolderPath} createEditor={readMarkdown} tocData={tocData} />
        <div style={{position: 'fixed', bottom: 0, left: 0, width: siderWidth, color: 'gray', height: 30, padding: '2px 10px', display: collapsed ? 'none' : 'block'}}>
          <Row wrap={false}>
            <Col flex="none">
              <Dropdown overlay={moreMenu} placement="topLeft" trigger={['click']}>
                <SettingFilled style={{cursor: 'pointer', fontSize: '18px', paddingTop: '2px'}} />
              </Dropdown>
            </Col>
            <Col flex="auto"></Col>
          </Row>
        </div>
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: collapsed ? 0 : siderWidth, height: '100vh', background: nightMode ? '#232427' : 'unset' }}>
        <EditorHeader emptyPage={activeKey === '0'} collapsed={collapsed} siderWidth={siderWidth} editor={activeEditor} />
          <Content id="main-content-box" style={{overflowY: sourceView ? 'unset' : 'scroll'}}>
          { activeKey !== '0' ? <Tabs type="editable-card" onChange={onChange} activeKey={activeKey} onEdit={tabsHandler} size="small" style={{height: '100%'}}>
            { editors.map(editor =>(
              <TabPane tab={editor.title} key={editor.key} style={{height: '100%'}}>
                <div style={{display: !sourceView ? '' : 'none', height: '100%'}}>
                  <MarkEditor editorId={editor.key} setWordCount={count => onContentChange(count, editor)} />
                </div>
                <div style={{display: sourceView ? '' : 'none', height: '100%'}}>
                  <MilkEditor editorId={editor.key} setWordCount={count => onContentChange(count, editor)} />
                </div>
              </TabPane>
            )) }
          </Tabs>
          :
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Empty image="no_editor_banner.png" style={{ textAlign: 'center'}}
              imageStyle={{ width: '180px', height: '180px', margin: '0 auto' }}
              description={false}>
              <div style={{ textAlign: 'left', color: '#9f9f9f' }}>
                <p style={{ marginBottom: '5px' }}>There were no files..., you can:</p>
                <p style={{ marginBottom: '5px' }}>1. <a onClick={openEditors}>Create File</a>: <span style={{ padding: '0 5px', background: '#d2d2d2', borderRadius: '5px', color: '#f0f2f5', fontWeight: 'bold' }}>Ctrl + N</span>.</p>
                <p style={{ marginBottom: '5px' }}>2. <a onClick={openLocalFile}>Open File</a>: <span style={{ padding: '0 5px', background: '#d2d2d2', borderRadius: '5px', color: '#f0f2f5', fontWeight: 'bold' }}>Ctrl + O</span>.</p>
              </div>
            </Empty>
          </div> }
        </Content>
        <EditorFooter emptyPage={activeKey === '0'} collapsed={collapsed} siderWidth={siderWidth} collapseHandler={switchToolView} switchSourceView={switchSourceView} wordCount={wordCount} />
      </Layout>
    </Layout>
  );
}
