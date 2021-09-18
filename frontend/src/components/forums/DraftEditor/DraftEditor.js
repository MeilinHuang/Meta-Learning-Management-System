import React, { Component } from 'react';
import classnames from 'classnames'
import { convertToRaw } from 'draft-js';
import { EditorState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import styles from './DraftEditor.module.css'

export default class DraftEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
        editorState: this.props.content || EditorState.createEmpty(),
    }
  }

  setDomEditorRef = ref => this.domEditor = ref

  onEditorStateChange = (editorState) => {
    this.setState({
        editorState,
    });
    this.props.setDetails(draftToHtml(convertToRaw(editorState.getCurrentContent())))
  };

  componentDidMount() {
    // fixing issue with SSR https://github.com/facebook/draft-js/issues/2332#issuecomment-761573306
    // eslint-disable-next-line react/no-did-mount-set-state
    console.log(this.props.content)
    this.setState({
      editorState: this.props.content || EditorState.createEmpty(),
    });
    if (this.props.doFocus) {
      this.domEditor.focusEditor()
    }
  }

  render() {
    return (
      <div className={classnames(styles.editor, this.props.className)}>
        <Editor
          editorState={this.state.editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.onEditorStateChange}
          ref={this.setDomEditorRef}
          toolbar={{
              options: [
                'inline',
                'blockType',
                'fontSize',
                'fontFamily',
                'list',
                'textAlign',
                'colorPicker',
                'link',
                'emoji',
                'history'
              ]
          }}
        />
      </div>
    );
  }
}