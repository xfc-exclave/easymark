import React from 'react'
import {
  CodeFilled,
  GithubOutlined,
  UserOutlined,
  AppstoreFilled,
  CloudFilled
} from "@ant-design/icons";
import { Layout, Row, Col, Tooltip } from "antd";

const { Footer } = Layout;

export default function EditorFooter(props) {

  const collapseHandler = () => props.collapseHandler()
  const switchSourceView = () => props.switchSourceView()

  return (
    <div>
      <Footer style={{ padding: 0, width: props.collapsed ? '100%' : 'calc(100% - ' + props.siderWidth + 'px)' }}>
        <Row wrap={false} style={{ height: '100%' }}>
          <Col flex="auto" style={{ padding: '0 5px' }}>
            <Tooltip placement="topLeft" color='#b6b3b3' arrowPointAtCenter={true} style={{ fontSize: '12px' }} title="Hide / Show Sidebar">
              <AppstoreFilled className="footer-button-item" onClick={collapseHandler} />
            </Tooltip>
            <Tooltip placement="topLeft" color='#b6b3b3' arrowPointAtCenter={true} style={{ fontSize: '12px' }} title="View source code">
              <CodeFilled className="footer-button-item" onClick={switchSourceView} />
            </Tooltip>
            <span className="footer-hint-text">按 <span style={{ color: '#98989b', fontWeight: 'bold' }}>Ctrl+H</span> 获取快捷键提示！</span>
          </Col>
          <Col flex="none" style={{ padding: '0 5px' }}>
            <div className="footer-hint-text" style={{ display: 'inline-block' }}>
              <Tooltip placement="top" color='#b6b3b3' arrowPointAtCenter={true} style={{ fontSize: '12px' }} title="Word Count: 245">
                <span className="text-button">245 W</span>
              </Tooltip>
              <Tooltip placement="top" color='#b6b3b3' arrowPointAtCenter={true} style={{ fontSize: '12px' }} title="Select Encoding">
                <span className="text-button">UTF-8</span>
              </Tooltip>
            </div>
            <Tooltip placement="top" color='#b6b3b3' arrowPointAtCenter={true} style={{ fontSize: '12px' }} title="EasyMark Cloud Repository">
              <CloudFilled className="footer-button-item" />
            </Tooltip>
            <Tooltip placement="top" color='#b6b3b3' arrowPointAtCenter={true} style={{ fontSize: '12px' }} title="Visit our github">
              <GithubOutlined className="footer-button-item" />
            </Tooltip>
            <span className="text-button" style={{ padding: 0, cursor: 'pointer' }}>
              <UserOutlined className="footer-button-item" />
              <span style={{ fontSize: '12px' }}>Chinmoku</span>
            </span>
          </Col>
        </Row>
      </Footer>
    </div>
  )
}
