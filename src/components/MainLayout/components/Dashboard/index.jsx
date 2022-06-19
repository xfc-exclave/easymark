import React from "react";
import { marked } from 'marked'
import hljs from "highlight.js"
import 'highlight.js/styles/default.css';
import "./index.css";

export default function Dashboard(props) {

  marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function (code) {
      return hljs.highlightAuto(code).value;
    },
    gfm: true, // 允许 Git Hub标准的markdown.
    pedantic: false, // 不纠正原始模型任何的不良行为和错误（默认为false）
    sanitize: false, // 对输出进行过滤（清理），将忽略任何已经输入的html代码（标签）
    tables: true, // 允许支持表格语法（该选项要求 gfm 为true）
    breaks: false, // 允许回车换行（该选项要求 gfm 为true）
    smartLists: true, // 使用比原生markdown更时髦的列表
    smartypants: false, // 使用更为时髦的标点
  })

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 5px', height: '100%' }}>
      <div id='easymark-edit-area' style={{ height: '100%' }}>
        <div className='main-editor'>
          <div dangerouslySetInnerHTML={{ __html: marked(props.source) }}></div>
        </div>
      </div>
    </div>
  )
}