import React, { Fragment } from 'react'
import {
  CodeFilled,
  GithubOutlined,
  UserOutlined,
  AppstoreFilled,
  CloudFilled,
  InfoCircleFilled,
  RobotFilled,
  FacebookOutlined
} from "@ant-design/icons";
import { Layout, Row, Col, Tooltip, Modal, Tag } from "antd";
import "./index.css";

const { Footer } = Layout;

export default function EditorFooter(props) {

  const {
    emptyPage,
    collapsed,
    siderWidth,
    wordCount
  } = props

  const collapseHandler = () => props.collapseHandler()
  const switchSourceView = () => props.switchSourceView()

  const currentEditorInfo = () => {
    Modal.info({
      title: 'Editor Information',
      content: (
        <div>
          <Row style={{ marginBottom: '5px' }}>
            <Col span={8}>Title</Col>
            <Col span={16}>Python 从入门到精通</Col>
          </Row>
          <Row style={{ marginBottom: '5px' }}>
            <Col span={8}>Words</Col>
            <Col span={16}><Tag color="#55acee">35,876</Tag></Col>
          </Row>
          <Row style={{ marginBottom: '5px' }}>
            <Col span={8}>Storage</Col>
            <Col span={16}><Tag icon={<FacebookOutlined />} color="#cd201f">Not Saved</Tag></Col>
          </Row>
          <Row style={{ marginBottom: '5px' }}>
            <Col span={8}>Path</Col>
            <Col span={16}>C://User/Administrator/Local/EasyMark/repository/python-tutorial.md</Col>
          </Row>
          <Row style={{ marginBottom: '5px' }}>
            <Col span={8}>Update Time</Col>
            <Col span={16}>2022-07-17 12:23:11</Col>
          </Row>
        </div>
      ),
      icon: <RobotFilled style={{ color: "#5c89ba" }} />,
      className: "easy-modal-info",
      okText: 'Close',
      onOk() {},
    });
  };

  return (
    <Fragment>
      <Footer style={{ padding: 0, width: collapsed ? '100%' : 'calc(100% - ' + siderWidth + 'px)', boxShadow: 'none' }}>
        <Row wrap={false} style={{ height: '100%' }}>
          <Col flex="auto" style={{ padding: '0 5px' }}>
            <Tooltip placement="topLeft" color='#b6b3b3' arrowPointAtCenter={true} style={{ fontSize: '12px' }} title="Hide / Show Sidebar">
              <AppstoreFilled className="footer-button-item" onClick={collapseHandler} />
            </Tooltip>
            { emptyPage ? <CodeFilled className="footer-button-item disabled" /> : <Tooltip placement="topLeft" color='#b6b3b3' arrowPointAtCenter={true} style={{ fontSize: '12px' }} title="View source code">
              <CodeFilled className="footer-button-item" onClick={switchSourceView} />
            </Tooltip> }
            <span className="footer-hint-text">Press <span style={{ color: '#98989b', fontWeight: 'bold' }}>Ctrl + L</span> to {collapsed ? 'show' : 'hide' } sidebar！</span>
          </Col>
          <Col flex="none" style={{ padding: '0 5px' }}>
            <div className="footer-hint-text" style={{ display: 'inline-block' }}>
              <Tooltip placement="top" color='#b6b3b3' arrowPointAtCenter={true} style={{ fontSize: '12px' }} title="Select Encoding">
                <span className="text-button">UTF-8</span>
              </Tooltip>
              <Tooltip placement="top" color='#b6b3b3' arrowPointAtCenter={true} style={{ fontSize: '12px' }} title="Word Count: 245">
                <InfoCircleFilled className="footer-button-item" onClick={currentEditorInfo} />
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
    </Fragment>
  )
}
