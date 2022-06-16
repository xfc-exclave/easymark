import React from "react";
import { BackTop } from "antd";
import MonacoEditor from "react-monaco-editor/lib/editor";
import "./index.css";

const style = {
    height: 40,
    width: 40,
    lineHeight: '40px',
    borderRadius: 4,
    backgroundColor: '#1088e9',
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
};

export default function Dashboard(props) {

    const editorDidMount = editor => editor.focus()
    
    const editorChangeHandler = (v, e) => console.log('change => ', v, e)
    const [view, setView] = React.useState('editor')

    const editorOptions = {
        selectOnLineNumbers: true
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '10px auto', padding: '0 5px', minHeight: '400px' }}>
            <div id='easymark-edit-area'>
                <div className='main-editor' style={{display: view === 'previewer' ? '' : 'none'}}>
                    <h1>H1 - Python Spider 从入门到入狱</h1>
                    <h2>H2 - Python Spider 从入门到入狱</h2>
                    <h3>H3 - Python Spider 从入门到入狱</h3>
                    <h4>H4 - Python Spider 从入门到入狱</h4>
                    <h5>H5 - Python Spider 从入门到入狱</h5>
                    <h6>H6 - Python Spider 从入门到入狱</h6>
                    <p>P - Python Spider 从入门到入狱</p>
                </div>
                <div style={{display: view === 'editor' ? '' : 'none'}}>
                    <MonacoEditor width="800" height="600" language="markdown" theme='vs'
                    options={editorOptions}
                    onChange={editorChangeHandler}
                    editorDidMount={editorDidMount} />
                </div>
            </div>
            <BackTop>
                <div style={style}>UP</div>
            </BackTop>
        </div>
    )
}