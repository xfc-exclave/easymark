import { Tree, Dropdown, Menu } from 'antd';
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

  const getDropdownMenu = v => {
    return (
      <Menu
        items={[
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
        ]}
      />
    )
  };

  return (
    <div style={{ padding: '0 10px', height: '100%' }}>
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
        titleRender={v => {
          return (
            <Dropdown overlay={() => getDropdownMenu(v)} trigger={['contextMenu']}>
              <span>{v.title}</span>
            </Dropdown>
          )
        }}
      />
    </div>
  );
};