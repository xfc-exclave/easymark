import React from 'react'
import MonacoEditor from "react-monaco-editor/lib/editor";

export default function OriginEditor(props) {

    const editorDidMount = editor => editor.focus()
    
    const editorChangeHandler = (v, _) => props.bindContent(v)
    const editorWillMount = monaco => {
        monaco.editor.defineTheme('theme-inherit', {
            base: 'vs-dark',
            inherit: true,
            colors: {
            },
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
        <MonacoEditor width="100%" height="100%" language="markdown" theme='theme-inherit'
            options={editorOptions}
            onChange={editorChangeHandler}
            editorWillMount={editorWillMount}
            value={props.content}
            editorDidMount={editorDidMount} />
    )
}
