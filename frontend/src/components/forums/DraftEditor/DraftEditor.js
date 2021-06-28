// Code based on sample code from https://www.draft-js-plugins.com/plugin/static-toolbar
import React, { Component } from 'react';
import Editor, { createEditorStateWithText } from '@draft-js-plugins/editor';
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
    CodeBlockButton,
} from '@draft-js-plugins/buttons';
import { convertToHTML } from 'draft-convert'

const staticToolbarPlugin = createToolbarPlugin();
const { Toolbar } = staticToolbarPlugin;
const plugins = [
    createMarkdownShortcutsPlugin(),
    staticToolbarPlugin,
];

export default class SimpleStaticToolbarEditor extends Component {
  state = {
    editorState: createEditorStateWithText(''),
  };

  onChange = (editorState) => {
    this.setState({
      editorState,
    });
    // this.props.setDetails(convertToHTML(editorState.getCurrentContent()))
  };

  componentDidMount() {
    // fixing issue with SSR https://github.com/facebook/draft-js/issues/2332#issuecomment-761573306
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      editorState: createEditorStateWithText(''),
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
            fontFamily: 'Monospace',
            padding: '4px'
        }
    }

    return (
        <div>
            <div className={styles.editor} onClick={this.focus}>
            <Editor
                blockStyleFn={this.styleBlocks}
                customStyleMap={styleMap}
                editorState={this.state.editorState}
                onChange={this.onChange}
                plugins={plugins}
                ref={(element) => {
                this.editor = element;
                }}
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
        </div>
    );
  }
}