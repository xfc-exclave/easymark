import React, { Fragment } from 'react'
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
  const [fullScreen, setFullScreen] = React.useState(false)// 是否最大化
  const [minimized, setMinimized] = React.useState(false)// 是否最大化

  const command = {
    minimize: () => {
      const result = window.ipcRenderer.sendSync('window:global:display', 'minimize')
      setMinimized(result)
    },
    fullscreen: () => {
      const result = window.ipcRenderer.sendSync('window:global:display', 'fullscreen')
      setFullScreen(result)
    },
    normalscreen: () => {
      const result = window.ipcRenderer.sendSync('window:global:display', 'normalscreen')
      setFullScreen(result)
    },
    toTray: () => window.ipcRenderer.sendSync('window:global:display', 'to-tray')
  }

  const getBreadItem = () => {
    const editor = props.editor
    if (editor.pathname === '') {
      return ['...', editor.title]
    }
    const breadList = editor.pathname.split('/')
    const limit = 6
    const holder = []
    if (breadList.length > limit) {
      holder.push('...')
    }
    while(breadList.length > limit) {
      breadList.shift()
    }
    return [...holder, ...breadList]
  }

  return (
    <Fragment>
      <Header className="site-layout-background" id="content-header" style={{ padding: 0, width: props.collapsed ? '100%' : 'calc(100% - ' + props.siderWidth + 'px)' }}>
        <Row wrap={false} style={{ height: '100%' }}>
          <Col flex="none">
            {
              props.emptyPage ? <Fragment /> :
              saved
                ? <CheckCircleFilled className="system-button-item info" />
                : <InfoCircleFilled className="system-button-item danger" />
            }
          </Col>
          <Col flex="auto" className="window-dragable">
            {
              props.emptyPage ? <Fragment /> : 
              <Breadcrumb style={{ margin: '3px 0' }}>
                {
                  getBreadItem().map((item, index) => <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>)
                }
              </Breadcrumb>
            }
          </Col>
          <Col flex="none">
            <MinusOutlined className="system-button-item primary" onClick={() => command.minimize()} />
            {
              fullScreen
                ? <CompressOutlined className="system-button-item primary" onClick={() => command.normalscreen()} />
                : <ExpandOutlined className="system-button-item primary" onClick={() => command.fullscreen()} />
            }
            <CloseOutlined className="system-button-item close" onClick={() => command.toTray()} />
          </Col>
        </Row>
      </Header>
    </Fragment>
  )
}
