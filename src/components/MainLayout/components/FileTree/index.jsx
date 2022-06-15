import { Tree } from 'antd';
import "./index.css";

const { DirectoryTree } = Tree;
const treeData = [
    {
        title: 'java-learning-path',
        key: '0-0',
        children: [
            {
                title: '1-basic',
                key: '0-0-0'
            },
            {
                title: '2-intermediate',
                key: '0-0-1',
                children: [
                    {
                        title: '01-java-low-level.md',
                        key: '0-0-1-0',
                        isLeaf: true
                    }
                ]
            },
        ],
    },
    {
        title: 'android',
        key: '0-1',
        children: [
            {
                title: 'Android 零基础入门教程.md',
                key: '0-1-0',
                isLeaf: true,
            },
            {
                title: '2022 年 Android 项目实践.md',
                key: '0-1-1',
                isLeaf: true,
            },
        ],
    },
];

export default function FileTree() {
    const onSelect = (keys, info) => {
        console.log('Trigger Select', keys, info);
    };

    const onExpand = (keys, info) => {
        console.log('Trigger Expand', keys, info);
    };

    return (
        <DirectoryTree
            multiple
            defaultExpandAll
            onSelect={onSelect}
            onExpand={onExpand}
            treeData={treeData}
            autoExpandParent={false}
            rootStyle={{
                background: 'none',
                color: '#9b9b9b'
            }}
        />
    );
};