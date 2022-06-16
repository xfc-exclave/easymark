import React from "react";
import ReactMarkdown from 'react-markdown'
import Highlight, { defaultProps } from "prism-react-renderer";
import "./index.css";

export default function Dashboard(props) {

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 5px', height: '100%' }}>
      <div id='easymark-edit-area' style={{ height: '100%' }}>
        <div className='main-editor'>
          <ReactMarkdown>{props.source}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}