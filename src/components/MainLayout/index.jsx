import React from "react";
import { Layout, Row, Col, Dropdown, Menu, Tabs, Modal } from 'antd';
import {
  SettingFilled,
  MenuOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import iconv from 'iconv-lite'
import { nanoid } from "nanoid";
import Dashboard from "./components/Dashboard";
import FileTree from "./components/FileTree";
import EditorHeader from "./components/EditorHeader";
import EditorFooter from "./components/EditorFooter";
import OriginEditor from "./components/OriginEditor";
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

  const [source, setSource] = React.useState('')// 当前预览的源文本
  const [wordCount, setWordCount] = React.useState(0)
  const switchSourceView = () => {
    if (sourceView) {
      editors.forEach(editor => {
        if (editor.key === activeKey) {
          setSource(editor.content)
        }
      })
    }
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

  // initialized-自动创建，temporary-自动创建修改未保存，saved-与本地保存文件一致，unsaved-与本地保存文件不一致
  const [editors, setEditors] = React.useState([
    {
      key: nanoid(),
      title: 'untitled-1.md',
      content: '',
      status: 'initialized',
      pathname: ''
    }
  ]);
  const findEditorByKey = key => editors.find(o => o.key === key)
  const findEditorByPath = pathname => editors.find(o => pathname !== '' && o.pathname === pathname)

  const [currentFolderPath, setCurrentFolderPath] = React.useState(null)

  window.ipcRenderer.on('file:readFileSuccess', (_, filePaths) => filePaths.forEach(pathname => readMarkdown(pathname)))
  window.ipcRenderer.on('file:readFolderSuccess', (_, paths) => setCurrentFolderPath(paths[0]))


  const [activeKey, setActiveKey] = React.useState(editors[0].key);
  const readMarkdown = async pathname => {
    const title = pathname.substring(pathname.lastIndexOf('\\') + 1)
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

  const createEditorWindow = (item = null, path) => {
    item = item == null ? {
      title: 'untitled-' + (newTabIndex.current++) + '.md',
      content: '',
      key: nanoid(),
      status: 'initialized',
      pathname: ''
    } : item
    setEditors([...editors, item]);
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

  const onEditorChange = (key, text) => {
    editors.forEach(editor => {
      if (editor.key === key) {
        if (editor.content.length !== text.length || editor.content !== text) {
          editor.status = editor.status === 'initialized' ? 'temporary' : editor.status === 'saved' ? 'unsaved' : editor.status
        }
        editor.content = text
        editor.wordCount = text == null ? 0 :text.replaceAll(' ', '').length
        setWordCount(editor.wordCount)
      }
    })
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
        <div style={{position: 'fixed', top: 0, left: 0, width: siderWidth, color: 'gray', height: 30, padding: '2px 10px'}}>
          <Row wrap={false}>
            <Col flex="auto" className="window-dragable"></Col>
            <Col flex="none">
              <Dropdown overlay={moreMenu} placement="bottomRight">
                <MenuOutlined style={{cursor: 'pointer', fontSize: '16px', paddingTop: '5px'}} />
              </Dropdown>
            </Col>
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
        <Content id="main-content-box">
          <Tabs type="editable-card" onChange={onChange} activeKey={activeKey} onEdit={tabsHandler} size="small" style={{height: '100%'}}>
            { editors.map(editor =>(
              <TabPane tab={editor.title} key={editor.key} style={{height: '100%'}}>
                <div style={{display: 'none'}}>{editor.content}</div>
                <div style={{display: !sourceView ? '' : 'none'}}>
                  <Dashboard source={source} />
                </div>
                <div style={{display: sourceView ? '' : 'none', height: '100%'}}>
                  <OriginEditor bindContent={text => onEditorChange(editor.key, text)} content={editor.content} />
                </div>
              </TabPane>
            )) }
          </Tabs>
        </Content>
        <EditorFooter collapsed={collapsed} siderWidth={siderWidth} collapseHandler={switchToolView} switchSourceView={switchSourceView} wordCount={wordCount}></EditorFooter>
      </Layout>
    </Layout>
  );
}
