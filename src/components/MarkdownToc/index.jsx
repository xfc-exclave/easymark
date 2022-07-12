import React from 'react'
import { nanoid } from "nanoid";

export default function MarkdownToc(props) {

  const generateToc = content => {
    let tempArr = []
    content.replace(/(#+)[^#][^\n]*?(?:\n)/g, function (match, m1) {
      const title = match.replace('\n', '');
      tempArr.push({
        level: m1.length,
        key: nanoid(),
        title: title.replace(/^#+/, '').replace(/\([^)]*?\)/, ''),
        children: []
      })
    })
    if (tempArr.length === 0) {
      return []
    }
    console.log('tempArr = ', tempArr)
    const topLevel = Math.min.apply(null, tempArr.map(item => item.level))

    const emptyCategory = {
      title: '未设置顶级目录 1',
      key: nanoid(),
      level: topLevel,
      children: []
    }
    tempArr = tempArr[0].level > topLevel ? [emptyCategory, ...tempArr] : tempArr
    console.log(JSON.stringify(tempArr))
    return buildTree(tempArr, topLevel)
  }

  const buildTree = (arr, topLevel) => {
    const children = []
    const tempArr = arr.filter(item => item.level === topLevel)
    if (tempArr.length === 0) {
      return children
    }

    for(let item of tempArr) {
      if (item.level === topLevel) {
        children.push(item)
      }
      if (topLevel < 6) {
        item.children = buildTree(arr, topLevel + 1)
      }
    }
    return children
  }

  if (props.content != null && props.content != '') {
    const toc = generateToc(props.content)
    console.log('toc = ', toc)
  }

  return (
    <div></div>
  )
}
