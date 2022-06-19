import React from "react";
import { Layout, Row, Col, Dropdown, Menu, Tabs } from 'antd';
import {
  SettingFilled,
  MenuOutlined
} from "@ant-design/icons";
import Dashboard from "./components/Dashboard";
import FileTree from "./components/FileTree";
import EditorHeader from "./components/EditorHeader";
import EditorFooter from "./components/EditorFooter";
import OriginEditor from "./components/OriginEditor";
import "./index.css";

const { TabPane } = Tabs;
const { Content, Sider } = Layout;

export default function MainLayout(props) {

  const [collapsed, setCollapsed] = React.useState(false)
  const switchToolView = () => setCollapsed(!collapsed)
  const siderWidth = 250;
  const [siderType, setSiderType] = React.useState('folder')

  const [sourceView, setSourceView] = React.useState(true)

  const [source, setSource] = React.useState('')// 当前预览的源文本
  const switchSourceView = () => {
    if (sourceView) {
      panes.forEach(tab => {
        if (tab.key === activeKey) {
          setSource(tab.content)
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

  const currentFileList = [
    {
      key: '1',
      title: 'react-tutorial.md',
      content: ''
    }
  ]

  console.log(window)
  // window.ipcRenderer.on('readFileSuccess', (e, filePath) => {
  //   console.log('---------', filePath)
  // })

  const [newFileCounter, setNewFileCounter] = React.useState(1)

  const [panes, setPanes] = React.useState(currentFileList);
  const [activeKey, setActiveKey] = React.useState(currentFileList[0].key);
  const newTabIndex = React.useRef(0);
  const onChange = (key) => {
    setActiveKey(key);
  };
  const add = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    setPanes([
      ...panes,
      {
        title: 'new-easymark-' + newFileCounter + '.md',
        content: '',
        key: newActiveKey,
      },
    ]);
    setNewFileCounter(newFileCounter + 1)
    setActiveKey(newActiveKey);
  };
  const remove = (targetKey) => {
    console.log(targetKey)
    let lastIndex = -1;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });

    if (panes.length && activeKey === targetKey) {
      let newActiveKey;

      if (lastIndex >= 0) {
        newActiveKey = panes[lastIndex].key;
      } else {
        newActiveKey = panes[0].key;
      }

      setActiveKey(newActiveKey);
    }

    const newPanes = panes.filter((pane) => pane.key !== targetKey);
    setPanes(newPanes);
  };
  const onEdit = (targetKey, action) => {
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };

  const bindContent = (tabKey, text) => {
    panes.forEach(tab => {
      if (tab.key === tabKey) {
        tab.content = text
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
        <div style={{position: 'fixed', top: 35, left: 0, width: siderWidth, textAlign: 'center'}}>
          <Row style={{color: '#9b9b9b'}}>
            <Col span={8}>
              <div className={"easymark-sider-type " + (siderType === 'folder' ? "active" : '')} onClick={() => setSiderType('folder')}>Folder</div>
            </Col>
            <Col span={8}>
              <div className={"easymark-sider-type " + (siderType === 'category' ? "active" : '')} onClick={() => setSiderType('category')}>Category</div>
            </Col>
            <Col span={8}>
              <div className={"easymark-sider-type " + (siderType === 'recent' ? "active" : '')} onClick={() => setSiderType('recent')}>Recent</div>
            </Col>
          </Row>
        </div>
        <FileTree />
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
          <Tabs type="editable-card" onChange={onChange} activeKey={activeKey} onEdit={onEdit} size="small" style={{height: '100%'}}>
            { panes.map(pane =>(
              <TabPane tab={pane.title} key={pane.key} style={{height: '100%'}}>
                <div style={{display: !sourceView ? '' : 'none'}}>
                  <Dashboard source={source} />
                </div>
                <div style={{display: sourceView ? '' : 'none', height: '100%'}}>
                  <OriginEditor bindContent={text => bindContent(pane.key, text)} />
                </div>
              </TabPane>
            )) }
          </Tabs>
        </Content>
        <EditorFooter collapsed={collapsed} siderWidth={siderWidth} collapseHandler={switchToolView} switchSourceView={switchSourceView}></EditorFooter>
      </Layout>
    </Layout>
  );
}
