const content = `
### 简介

### 基础知识

RPC（Remote Procedure Call）意为[远程过程调用]{.blue}。

### Dubbo 概述

## 测试

### 知道

#### 这里

# 一级

## 有

### 唉

:balloon: **Dubbo 是什么？** 
`

const generateToc = content => {
    let array = []
    content.replace(/(#+)[^#][^\n]*?(?:\n)/g, function(match, m1) {
        let title = match.replace('\n', '');
        let level = m1.lenght;
        array.push({
            title: title.replace(/^#+/, '').replace(/\([^)]*?\)/, ''),
            level: level,
            children: []
        })
    })
    return array
}