import React from "react";
import { Tree, Row, Col, Dropdown, Menu, List  } from 'antd';
import "./index.css";
import { nanoid } from "nanoid";
const fs = window.require('fs')

const { DirectoryTree } = Tree;

export default function FileTree(props) {
  const [siderType, setSiderType] = React.useState('folder')

  const onSelect = (_, info) => {
    if (info.node.isLeaf) {
      props.createEditor(info.node.path)
    }
  };

  const readSubFolder = (path) => {
    const children = []

    const files = fs.readdirSync(path)

    if (files != null) {
      files.forEach(file => {
        const item = {title: '', key: nanoid(), isLeaf: false}
        const states = fs.statSync(path + "/" + file);
        // 判断是否是目录，是就继续递归
        item.title = file
        if (states.isDirectory()) {
          item.isLeaf = false
          item.children = readSubFolder(path + "\\" + file);
          children.push(item)
        } else {
          // 是文件
          if (file.substring(file.lastIndexOf(".")) === '.md') {
            item.isLeaf = true
            item.path = path + "\\" + file
            children.push(item)
          }
        }
      });
    }
    return children
  }

  const getFileTreeNodes = () => {
    const folderPath = props.folderPath
    let folderTree = []
    if (folderPath == null) {
      return folderTree
    }
    return [{
      title: folderPath.substring(folderPath.lastIndexOf('\\') + 1),
      key: nanoid(),
      children: readSubFolder(folderPath)
    }]
  }

  const getDropdownMenu = v => {
    const folderTree = [
      {
        label: 'Reveal in Finder',
        key: '1',
        onClick: () => {
          console.log(v.key)
        }
      },
      {
        label: 'Copy',
        key: '2',
      },
      {
        label: 'Upload to EasyMark Cloud',
        key: '3',
      },
      {
        label: <span style={{ color: 'red' }}>Delete</span>,
        key: '4',
      },
    ]
    return (
      <Menu items={folderTree} />
    )
  };

  return (
    <div>
      <div style={{position: 'fixed', top: 35, left: 0, width: props.siderWidth, textAlign: 'center'}}>
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
      <div style={{ padding: '0 10px', height: '100%' }}>
        <DirectoryTree
          multiple
          defaultExpandAll={false}
          onSelect={onSelect}
          treeData={getFileTreeNodes()}
          rootStyle={{
            background: 'none',
            color: '#9b9b9b',
            display: siderType === 'folder' ? 'block' : 'none'
          }}
          titleRender={v => {
            return (
              <Dropdown overlay={() => getDropdownMenu(v)} trigger={['contextMenu']}>
                <span>{v.title}</span>
              </Dropdown>
            )
          }}
        />
        <div style={{display: siderType === 'category' ? 'block' : 'none', color: '#9b9b9b'}}>
          category
        </div>
        <div style={{display: siderType === 'recent' ? 'block' : 'none', color: '#9b9b9b'}}>
          <List
            itemLayout="horizontal"
            dataSource={props.recordList}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta title={item.pathname} description="file xxxxxxx" />
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
};