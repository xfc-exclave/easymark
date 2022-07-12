import { nanoid } from "nanoid";

export const generateToc = content => {
  let tempArr = []
  // FIXME 正则匹配校验不严谨
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
  const topLevel = Math.min.apply(null, tempArr.map(item => item.level))

  const emptyCategory = {
    title: '未设置',
    key: nanoid(),
    level: topLevel,
    children: []
  }
  tempArr = tempArr[0].level > topLevel ? [emptyCategory, ...tempArr] : tempArr
  return buildTree(tempArr, topLevel)
}

const buildTree = (arr, topLevel) => {
  const children = []
  const tempArr = arr.filter(item => item.level === topLevel)
  if (tempArr.length === 0) {
    return children
  }

  let group = []
  tempArr.forEach(_item => group.push([]))
  
  let index = -1;
  for(const item of arr) {
    if (item.level === topLevel) {
      index++;
      continue;
    }
    if (index === -1) continue;
    group[index] = [...group[index], item]
  }

  for(let idx in tempArr) {
    let item = tempArr[idx]
    if (item.level === topLevel) {
      children.push(item)
    }
    if (topLevel < 6) {
      item.children = buildTree(group[idx], topLevel + 1)
    }
  }
  return children
}