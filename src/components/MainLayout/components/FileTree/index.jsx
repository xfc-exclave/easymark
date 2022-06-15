import { Tree } from 'antd';
import "./index.css";

import { fileTreeNodes } from '../../../../mock/fileTree.js'

const { DirectoryTree } = Tree;

export default function FileTree() {
  const onSelect = (keys, info) => {
    console.log('Trigger Select', keys, info);
  };

  const onExpand = (keys, info) => {
    console.log('Trigger Expand', keys, info);
  };

  return (
    <div style={{padding: '0 10px', height: '100%'}}>
      <DirectoryTree
      multiple
      defaultExpandAll={false}
      onSelect={onSelect}
      onExpand={onExpand}
      treeData={fileTreeNodes}
      rootStyle={{
        background: 'none',
        color: '#9b9b9b'
      }}
    />
    </div>
  );
};