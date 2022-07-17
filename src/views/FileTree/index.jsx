import React, { Fragment } from "react";
import { Tree, Empty, Button, Menu, List, Tooltip } from 'antd';
import {
  ProfileOutlined,
  NumberOutlined,
  CloudFilled,
  FontColorsOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import { nanoid } from "nanoid";
import "./index.css";

const fs = window.require('fs')
const { DirectoryTree } = Tree;
const fileChar = '/';
const { dialog } = window.remote;

export default function FileTree(props) {
  const [siderType, setSiderType] = React.useState('folder')
  const [fileTreeNodes, setFileTreeNodes] = React.useState([])

  const onSelect = (_, info) => {
    if (info.node.isLeaf) {
      props.createEditor(info.node.path)
    }
  };

  React.useEffect(() => {
    return () => {
      const folderPath = props.folderPath
      let folderTree = []
      if (folderPath == null) {
        return folderTree
      }
      folderTree = [{
        title: folderPath.substring(folderPath.lastIndexOf(fileChar) + 1),
        key: nanoid(),
        children: readSubFolder(folderPath)
      }]
      setFileTreeNodes(folderTree)
    }
  }, [props.folderPath])

  const readSubFolder = (path) => {
    path = path.replaceAll('\\', '/')
    const children = []

    const files = fs.readdirSync(path)

    if (files != null) {
      files.forEach(file => {
        const item = {title: '', key: nanoid(), isLeaf: false}
        const states = fs.statSync(path + fileChar + file);
        // 判断是否是目录，是就继续递归
        item.title = file
        if (states.isDirectory()) {
          item.isLeaf = false
          item.children = readSubFolder(path + fileChar + file);
          children.push(item)
        } else {
          // 是文件
          if (file.substring(file.lastIndexOf(".")) === '.md') {
            item.isLeaf = true
            item.path = path + fileChar + file
            children.push(item)
          }
        }
      });
    }
    return children
  }

  const chooseDirectoryHandler = () => {
    dialog.showOpenDialog({
      title: "选择文件夹",
      buttonLabel: "选择文件夹",
      properties: ['openDirectory'],
    }).then(result => {
      const webContents = window.webContents.getFocusedWebContents()
      if (!result.canceled) {
        webContents.send('file:readFolderSuccess', result.filePaths)
      }
    }).catch(err => {
      console.log(err)
    })
  }

  const showMenu = v => {
    if (v.node.pos !== '0-0') {
      return
    }
    const menu = window.remote.Menu.buildFromTemplate([
      {
        label: 'Close Directory'
      },
      {
        label: 'Reload Directory'
      },
      {
        label: 'Expand All'
      },
      {
        label: 'Collapse All'
      }
    ])
    menu.popup({ window: window.remote.getCurrentWindow() })
  }

  return (
    <Fragment>
      <div style={{position: 'absolute', top: '50px', left: '10px', width: '25px', textAlign: 'center', color: '#9b9b9b'}}>
        <Tooltip placement="right" color='#b6b3b3' style={{ fontSize: '12px' }} title="Opened Directory">
          <div className={"easymark-sider-type " + (siderType === 'folder' ? "active" : '')} onClick={() => setSiderType('folder')}><ProfileOutlined /></div>
        </Tooltip>
        <Tooltip placement="right" color='#b6b3b3' style={{ fontSize: '12px' }} title="Table of Contents">
          <div className={"easymark-sider-type " + (siderType === 'category' ? "active" : '')} onClick={() => setSiderType('category')}><NumberOutlined /></div>
        </Tooltip>
        <Tooltip placement="right" color='#b6b3b3' style={{ fontSize: '12px' }} title="Themes">
          <div className={"easymark-sider-type " + (siderType === 'recent' ? "active" : '')} onClick={() => setSiderType('recent')}><FontColorsOutlined /></div>
        </Tooltip>
        <Tooltip placement="right" color='#b6b3b3' style={{ fontSize: '12px' }} title="EasyMark Cloud Repository">
          <div className={"easymark-sider-type"}><CloudFilled /></div>
        </Tooltip>
      </div>
      <div style={{ padding: '0 5px 0 40px', height: '100%' }}>
        <div style={{ display: siderType === 'folder' ? 'block' : 'none', height: '100%' }}>
          <div style={{ display: fileTreeNodes.length === 0 ? 'none' : 'block' }}>
            <DirectoryTree
              multiple
              onSelect={onSelect}
              treeData={fileTreeNodes}
              rootStyle={{ background: 'none', color: '#9b9b9b' }}
              onRightClick={v => showMenu(v)}
            />
          </div>
          <div style={{ display: fileTreeNodes.length === 0 ? 'flex' : 'none', color: '#fff', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#9b9b9b' }}>
            <Empty image="8.png"
              description={
                <span>No <span style={{ fontWeight: 'bold' }}>Directory</span> selected<br/>
                  <a style={{color: '#75adf1', fontWeight: 'bold'}} onClick={chooseDirectoryHandler}>Choose Directory</a>
                </span>
              } />
          </div>
        </div>
        
        <div style={{ display: siderType === 'category' ? 'block' : 'none', height: '100%' }}>
          <Tree defaultExpandAll={true} treeData={props.tocData} rootStyle={{ background: 'none', color: '#9b9b9b' }} />
          <div style={{ display: props.tocData.length === 0 ? 'flex' : 'none', color: '#fff', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#9b9b9b' }}>
            <Empty image="10.png" description={ false }>
              <p>There were no <span style={{color: '#75adf1', fontWeight: 'bold'}}>Headings</span></p>
              <Button id="sider-oper-btn" icon={<ReloadOutlined />}>Synchronize</Button>
            </Empty>
          </div>
        </div>
        
        <div style={{display: siderType === 'recent' ? 'block' : 'none', height: '100%'}}>
          <div style={{ display: 'flex', color: '#fff', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#9b9b9b' }}>
            <Empty image="6.png" description={ <span>There were no <span style={{color: '#75adf1', fontWeight: 'bold'}}>Headings</span><br/>in current editor</span> } />
          </div>
        </div>
      </div>
    </Fragment>
  );
};