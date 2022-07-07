import React from "react";
import { Layout, Row, Col, Dropdown, Tabs, Modal, Menu } from 'antd';
import {
  SettingFilled,
  MenuOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import { nanoid } from "nanoid";
import FileTree from "../../components/FileTree";
import EditorHeader from "../../components/EditorHeader";
import EditorFooter from "../../components/EditorFooter";
import MarkEditor from "../../containers/MarkEditor";
import MilkEditor from "../../containers/MilkEditor";
import menuTemplate from "../../components/menu"
import "./index.css";
const fs = window.require('fs')

const { TabPane } = Tabs;
const { Content, Sider } = Layout;
const { confirm } = Modal;

export default function MainLayout(props) {

  const [collapsed, setCollapsed] = React.useState(false)
  const switchToolView = () => setCollapsed(!collapsed)
  const siderWidth = 250;

  const [sourceView, setSourceView] = React.useState(true)

  const [fileRecords, setFileRecords] = React.useState([])

  const [wordCount, setWordCount] = React.useState(0)
  const switchSourceView = () => {
    editors.forEach(editor => {
      if (editor.key === activeKey) {
        editor.content = editor.tempContent
        console.log(editor)
      }
    })
    setSourceView(!sourceView)
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

  const editors = props.data.editorReducer;
  const setEditors = (items) => props.saveEditors(items);
  const addEditor = item => props.addEditor(item);

  const findEditorByKey = key => editors.find(o => o.key === key)
  const findEditorByPath = pathname => editors.find(o => pathname !== '' && o.pathname === pathname)

  const [currentFolderPath, setCurrentFolderPath] = React.useState(null)

  React.useEffect(() => {
    return () => {
      window.ipcRenderer.on('file:readFileSuccess', (_, filePaths) => filePaths.forEach(pathname => readMarkdown(pathname)))
      window.ipcRenderer.on('file:readFolderSuccess', (_, paths) => setCurrentFolderPath(paths[0]))
      window.ipcRenderer.on('editor:createNewEditorTab', () => createEditorWindow())
      window.ipcRenderer.on('editor:closeCurrentEditorTab', () => closeEditor(activeKey))
    }
  }, [])

  const [activeKey, setActiveKey] = React.useState(editors[0].key);
  const readMarkdown = async pathname => {
    let title = pathname.substring(pathname.lastIndexOf('\\') + 1)
    title = title.substring(title.lastIndexOf('/') + 1)
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
          createEditorWindow(item)
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

  const createEditorWindow = (item = null, _path) => {
    const index = newTabIndex.current++
    item = item == null ? {
      title: 'untitled-' + index + '.md',
      content: '',
      key: nanoid(),
      status: 'initialized',
      pathname: ''
    } : item
    addEditor(item);
    setActiveKey(item.key);
    return item
  };
  const closeEditor = key => {
    let tempKey = key
    if (editors.length) {
      tempKey = editors[editors.length - 1].key
      if (tempKey === key && editors.length > 1) {
        tempKey = editors[editors.length - 2].key
      }
    }
    let newEditors = editors.filter(editor => editor.key !== key)
    if (newEditors.length === 0) {
      newEditors = [createEditorWindow()]
    } else {
      setActiveKey(tempKey)
    }
    setEditors(newEditors);
  };

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
          overflow: 'auto',
          position: 'fixed',
          padding: '70px 0 30px',
          left: 0,
          top: 0,
          bottom: 0,
          background: '#464b50'
        }}>
        <div style={{position: 'absolute', top: 0, left: 0, width: siderWidth, color: 'gray', height: 30, padding: '2px 10px'}}>
          <Row wrap={false}>
            <Col flex="none">
              <MenuOutlined style={{cursor: 'pointer', fontSize: '16px', paddingTop: '5px'}} onClick={showMenu} />
            </Col>
            <Col flex="auto" className="window-dragable"></Col>
          </Row>
        </div>
        <FileTree siderWidth={siderWidth} recordList={fileRecords} folderPath={currentFolderPath} createEditor={readMarkdown} />
        <div style={{position: 'fixed', bottom: 0, left: 0, width: siderWidth, color: 'gray', height: 30, padding: '2px 10px'}}>
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
      <Layout className="site-layout" style={{ marginLeft: collapsed ? 0 : siderWidth, height: '100vh' }}>
        <EditorHeader collapsed={collapsed} siderWidth={siderWidth} />
        <Content id="main-content-box" style={{overflowY: sourceView ? 'unset' : 'scroll'}}>
          <Tabs type="editable-card" onChange={onChange} activeKey={activeKey} onEdit={tabsHandler} size="small" style={{height: '100%'}}>
            { editors.map(editor =>(
              <TabPane tab={editor.title} key={editor.key} style={{height: '100%'}}>
                <div style={{display: !sourceView ? '' : 'none', height: '100%'}}>
                  <MarkEditor editorId={editor.key} setWordCount={count => setWordCount(count)} />
                </div>
                <div style={{display: sourceView ? '' : 'none', height: '100%'}}>
                  <MilkEditor editorId={editor.key} setWordCount={count => setWordCount(count)} />
                </div>
              </TabPane>
            )) }
          </Tabs>
        </Content>
        <EditorFooter collapsed={collapsed} siderWidth={siderWidth} collapseHandler={switchToolView} switchSourceView={switchSourceView} wordCount={wordCount} />
      </Layout>
    </Layout>
  );
}
