// Code based on sample code from https://www.draft-js-plugins.com/plugin/static-toolbar
import React, { Component } from 'react';
import classnames from 'classnames'
import Editor, { createEditorStateWithText } from '@draft-js-plugins/editor';
import { EditorState } from 'draft-js'
import createToolbarPlugin from '@draft-js-plugins/static-toolbar';
import '@draft-js-plugins/static-toolbar/lib/plugin.css'
import createMarkdownShortcutsPlugin from 'draft-js-md-keyboard-plugin';
import styles from './DraftEditor.module.css'
import {
    ItalicButton,
    BoldButton,
    UnderlineButton,
    CodeButton,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton,
    // CodeBlockButton,
} from '@draft-js-plugins/buttons';
import { convertToHTML } from 'draft-convert'



export default class SimpleStaticToolbarEditor extends Component {
  constructor(props) {
    super(props);
    const staticToolbarPlugin = createToolbarPlugin();
    this.PluginComponents = {
      Toolbar: staticToolbarPlugin.Toolbar
    };
    this.plugins = [
      createMarkdownShortcutsPlugin(),
      staticToolbarPlugin,
    ];
    this.state = {
      editorState: this.props.content ? EditorState.createWithContent(this.props.content) : createEditorStateWithText(''),
    };
  }
  
  onChange = (editorState) => {
    this.setState({
      editorState,
    });
    this.props.setDetails(convertToHTML(editorState.getCurrentContent()))
  };

  componentDidMount() {
    // fixing issue with SSR https://github.com/facebook/draft-js/issues/2332#issuecomment-761573306
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      editorState: this.props.content ? EditorState.createWithContent(this.props.content) : createEditorStateWithText(''),
    });
  }

  focus = () => {
    this.editor.focus();
  };

  styleBlocks = contentBlock => {
    const type = contentBlock.getType()
    switch (type) {
        case 'blockquote':
            return styles.blockquote
        case 'ordered-list-item':
            return styles.orderedListItem
        case 'unordered-list-item':
            return styles.unorderedListItem
        default:
            return
    }
  }

  render() {
    const styleMap = {
        'CODE': {
            backgroundColor: '#eee',
            borderRadius: '8px',
            fontFamily: 'Monospace',
            padding: '4px',
        }
    }

    const { Toolbar } = this.PluginComponents

    return (
        <>
            <div className={classnames(styles.editor, this.props.className)} onClick={this.focus}>
            <Editor
                blockStyleFn={this.styleBlocks}
                customStyleMap={styleMap}
                editorState={this.state.editorState}
                onChange={this.onChange}
                plugins={this.plugins}
                ref={(element) => { this.editor = element; }}
            />
            <Toolbar>
                {
                    externalProps => (
                        <>
                            <BoldButton {...externalProps} />
                            <ItalicButton {...externalProps} />
                            <UnderlineButton {...externalProps} />
                            <CodeButton {...externalProps} />
                            <UnorderedListButton {...externalProps} />
                            <OrderedListButton {...externalProps} />
                            <BlockquoteButton {...externalProps} />
                            {/* <CodeBlockButton {...externalProps} /> */}
                        </>
                    )
                }
            </Toolbar>
            </div>
        </>
    );
  }
}