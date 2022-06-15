import React from "react";
import { Layout, Row, Col, Breadcrumb, Tooltip } from "antd";
import {
  CodeFilled,
  CloseOutlined,
  MinusOutlined,
  CompressOutlined,
  ExpandOutlined,
  InfoCircleFilled,
  CheckCircleFilled,
  GithubOutlined,
  UserOutlined,
  AppstoreFilled,
  CloudFilled
} from "@ant-design/icons";
import Dashboard from "./components/Dashboard";
import FileTree from "./components/FileTree";
import "./index.css";

const { Header, Content, Footer, Sider } = Layout;

export default function MainLayout(props) {

  const [collapsed, setCollapsed] = React.useState(false)
  const [saved, setSaved] = React.useState(true)// 当前文本是否保存
  const [maximized, setMaximized] = React.useState(false)// 是否最大化

  const switchToolView = () => setCollapsed(!collapsed)

  return (
    <Layout style={{minHeight: '100vh'}}>
      <Sider theme="light" collapsible collapsed={collapsed} trigger={null}
        collapsedWidth={0}
        style={{
          overflow: 'auto',
          position: 'fixed',
          paddingTop: '30px',
          left: 0,
          top: 0,
          bottom: 0,
          background: '#464b50'
        }}>
          <div style={{position: 'fixed'}}></div>
        <FileTree />
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: collapsed ? 0 : '200px', height: '100vh' }}>
        <Header className="site-layout-background" id="content-header" style={{ padding: 0, width: collapsed ? '100%': 'calc(100% - 200px)' }}>
          <Row wrap={false} style={{height: '100%'}}>
            <Col flex="none">
              {
              saved
              ? <CheckCircleFilled className="system-button-item info" />
              : <InfoCircleFilled className="system-button-item danger" />
              }
            </Col>
            <Col flex="auto" className="window-dragable">
              <Breadcrumb style={{ margin: '3px 0' }}>
                <Breadcrumb.Item>User</Breadcrumb.Item>
                <Breadcrumb.Item>Administrator</Breadcrumb.Item>
                <Breadcrumb.Item>Desktop</Breadcrumb.Item>
                <Breadcrumb.Item>python-tutorial.md</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
            <Col flex="none">
              <MinusOutlined className="system-button-item primary" />
              {
              maximized
              ? <CompressOutlined className="system-button-item primary" />
              : <ExpandOutlined className="system-button-item primary" />
              }
              <CloseOutlined className="system-button-item close" />
            </Col>
          </Row>
        </Header>
        <Content id="main-content-box">
          <Dashboard />
        </Content>
        <Footer style={{ padding: 0, width: collapsed ? '100%': 'calc(100% - 200px)' }}>
          <Row wrap={false} style={{height: '100%'}}>
            <Col flex="auto" style={{padding: '0 5px'}}>
              <Tooltip placement="topLeft" color='#b6b3b3' arrowPointAtCenter={true} style={{fontSize: '12px'}} title="Hide / Show Sidebar">
                <AppstoreFilled className="footer-button-item" onClick={switchToolView} />
              </Tooltip>
              <Tooltip placement="topLeft" color='#b6b3b3' arrowPointAtCenter={true} style={{fontSize: '12px'}} title="View source code">
                <CodeFilled className="footer-button-item" />
              </Tooltip>
              <span className="footer-hint-text">按 <span style={{color: '#98989b', fontWeight: 'bold'}}>Ctrl+H</span> 获取快捷键提示！</span>
            </Col>
            <Col flex="none" style={{padding: '0 5px'}}>
              <div className="footer-hint-text" style={{display: 'inline-block'}}>
                <Tooltip placement="top" color='#b6b3b3' arrowPointAtCenter={true} style={{fontSize: '12px'}} title="Word Count: 245">
                  <span className="text-button">245 W</span>
                </Tooltip>
                <Tooltip placement="top" color='#b6b3b3' arrowPointAtCenter={true} style={{fontSize: '12px'}} title="Select Encoding">
                  <span className="text-button">UTF-8</span>
                </Tooltip>
              </div>
              <Tooltip placement="top" color='#b6b3b3' arrowPointAtCenter={true} style={{fontSize: '12px'}} title="EasyMark Cloud">
                <CloudFilled className="footer-button-item" />
              </Tooltip>
              <Tooltip placement="top" color='#b6b3b3' arrowPointAtCenter={true} style={{fontSize: '12px'}} title="Visit our github">
                <GithubOutlined className="footer-button-item" />
              </Tooltip>
              <span className="text-button" style={{padding: 0, cursor: 'pointer'}}>
                <UserOutlined className="footer-button-item" />
                <span style={{fontSize: '12px'}}>Chinmoku</span>
              </span>
            </Col>
          </Row>
        </Footer>
      </Layout>
    </Layout>
  );
}
