import React from 'react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js'
import './index.css'

export default function MarkEditor(props) {

  const {
    content,
    bindContent,
    active
  } = props

  const EasyEditor = React.useRef()
  const editorRef = React.useRef()

  React.useEffect(() => {
    EasyEditor.current = monaco.editor.create(editorRef.current, {
      width: '100%',
      height: '100%',
      language: 'markdown',
      theme: 'vs-dark',
      minimap: {
        enabled: false
      },
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
      value: content,
      automaticLayout: true,
      editorDidMount: editor => {
        window.onresize = () => editor.layout()
        editor.onDidChangeCursorPosition(() => {
          console.log(editor.getSelection())
        })
      },
    })

    EasyEditor.current.onDidChangeModelContent(() => bindContent(EasyEditor.current.getValue()))

    return () => {
      EasyEditor.current.dispose()
      EasyEditor.current = undefined
      window.ipcRenderer.on('editor:parseShortcutKeyCommand', (_, command) => shortcutKeyCommandParser(command))
    }
  }, [])

  const shortcutKeyCommandParser = command => {
    console.log(active)
    if (!active) {
      return
    }
    const position = EasyEditor.current.getPosition()
    const currentLineContent = EasyEditor.current.getModel().getLineContent(position.lineNumber)
    let replaceText = ''
    let range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: 1,
      endColumn: 1
    }
    if (currentLineContent.startsWith('#')) {
      replaceText = currentLineContent.substring(currentLineContent.indexOf(' ') + 1)
      range.endColumn = currentLineContent.length + 1
    } else {
      replaceText = '### '
    }
    if (command === 'CTRL-1') {
      EasyEditor.current.executeEdits("inert-title-charts", [{ range, text: replaceText }])
    }
  }

  return (
    <div ref={editorRef} style={{height: '100%'}}></div>
  )
}
