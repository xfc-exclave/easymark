import React from 'react'
import {
  CloseOutlined,
  MinusOutlined,
  CompressOutlined,
  ExpandOutlined,
  InfoCircleFilled,
  CheckCircleFilled,
} from "@ant-design/icons";
import { Layout, Row, Col, Breadcrumb } from "antd";

const { Header } = Layout;

export default function EditorHeader(props) {
  const [saved, setSaved] = React.useState(true)// 当前文本是否保存
  const [maximized, setMaximized] = React.useState(false)// 是否最大化

  return (
    <div>
      <Header className="site-layout-background" id="content-header" style={{ padding: 0, width: props.collapsed ? '100%' : 'calc(100% - ' + props.siderWidth + 'px)' }}>
        <Row wrap={false} style={{ height: '100%' }}>
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
    </div>
  )
}
