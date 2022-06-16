import React from "react";
import { Layout, Row, Col, Dropdown, Menu } from 'antd';
import {
  SettingFilled,
  MenuOutlined
} from "@ant-design/icons";
import Dashboard from "./components/Dashboard";
import FileTree from "./components/FileTree";
import EditorHeader from "./components/EditorHeader";
import EditorFooter from "./components/EditorFooter";
import "./index.css";

const { Content, Sider } = Layout;

export default function MainLayout(props) {

  const [collapsed, setCollapsed] = React.useState(false)
  const switchToolView = () => setCollapsed(!collapsed)
  const siderWidth = 250;
  const [siderType, setSiderType] = React.useState('folder')

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
        <EditorHeader collapsed={collapsed} siderWidth={siderWidth}></EditorHeader>
        <Content id="main-content-box">
          <Dashboard />
        </Content>
        <EditorFooter collapsed={collapsed} siderWidth={siderWidth} collapseHandler={switchToolView}></EditorFooter>
      </Layout>
    </Layout>
  );
}
