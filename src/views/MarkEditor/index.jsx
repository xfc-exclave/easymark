import React from 'react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js'
import './index.css'

import MarkdownToc from '../../components/MarkdownToc'

export default function MarkEditor(props) {

  const {
    setWordCount
  } = props

  const easyEditor = props.data.editorReducer.filter(item => item.key === props.editorId)[0]

  const EasyEditor = React.useRef()
  const editorRef = React.useRef()

  const [test, setTest] = React.useState('')

  React.useEffect(() => {

    EasyEditor.current = monaco.editor.create(editorRef.current, {
      width: '100%',
      height: '100%',
      language: 'markdown',
      theme: 'vs-dark',
      options: {
        colorDecorators: true,
        scrollbar: {
          vertical: 'hidden',
          horizontalScrollbarSize: 5
        }
      },
      editorWillMount: monaco => {
        monaco.editor.defineTheme('theme-inherit', {
          base: 'vs-dark',
          inherit: true,
          colors: {},
          rules: []
        })
      },
      value: easyEditor.content,
      automaticLayout: true,
      editorDidMount: editor => window.onresize = _ => editor.layout(),
    })

    // if (EasyEditor.current != null) {
    //   EasyEditor.current.setValue(easyEditor.content)
    // }
    EasyEditor.current.onDidChangeModelContent(_ => {
      const text = EasyEditor.current.getValue()
      easyEditor.tempContent = text
      easyEditor.wordCount = text == null ? 0 :text.replaceAll(' ', '').length
      setWordCount(easyEditor.wordCount)
      setTest(text)
    })

    return () => {
      EasyEditor.current.dispose()
      EasyEditor.current = undefined
    }
  }, [])


  return (
    <div ref={editorRef} style={{height: '100%'}}>
      {/* <MarkdownToc content={test} /> */}
    </div>
  )
}
