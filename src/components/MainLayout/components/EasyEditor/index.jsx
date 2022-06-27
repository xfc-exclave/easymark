import React from 'react'
import MonacoEditor from "react-monaco-editor/lib/editor";

export default function EasyEditor(props) {

    React.useEffect(() => {
      return () => {
        window.ipcRenderer.on('editor:parseShortcutKeyCommand', (_, command) => shortcutKeyCommandParser(command))
      }
    }, [])

    const [currentEditor, setCurrentEditor] = React.useState(null)
    const [selection, setSelection] = React.useState({lineNumber: 1, column: 1})

    const shortcutKeyCommandParser = command => {
        if (command === 'CTRL-1') {
            const range = {
                startLineNumber: selection.positionLineNumber,
                endLineNumber: selection.positionLineNumber,
                startColumn: 1,
                endColumn: 1
            }
            currentEditor.executeEdits("my-source", [{ identifier: { major: 1, minor: 1 }, range, text: '### ', forceMoveMarkers: true }]);
        }
    }

    const editorDidMount = editor => {
        window.onresize = () => editor.layout()

        editor.onDidChangeCursorPosition(() => {
            setSelection(editor.getSelection())
            setCurrentEditor(editor)
        })
    }
    
    const editorChangeHandler = (v, _) => props.bindContent(v)

    const editorWillMount = monaco => {
        monaco.editor.defineTheme('theme-inherit', {
            base: 'vs-dark',
            inherit: true,
            colors: {},
            rules: []
        })
    }

    const editorOptions = {
        colorDecorators: true,
        scrollbar: {
            vertical: 'hidden',
            horizontalScrollbarSize: 5
        }
    }

    return (
        <MonacoEditor width='100%' height="100%" language="markdown" theme='theme-inherit'
            options={editorOptions}
            onChange={editorChangeHandler}
            editorWillMount={editorWillMount}
            value={props.content}
            automaticLayout={true}
            editorDidMount={editorDidMount} />
    )
}
