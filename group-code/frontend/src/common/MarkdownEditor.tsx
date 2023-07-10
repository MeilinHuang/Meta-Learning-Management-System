import { useState } from 'react';
import 'katex/dist/katex.css';
import katex from 'katex';
import { getCodeString } from 'rehype-rewrite';
import MDEditor from '@uiw/react-md-editor';

const MarkdownEditor: React.FC<any> = ({MDContent, setMDContent, MDfullscreen, setMDFullscreen}) => {
  const [MDpreview, setMDpreview] = useState<'live' | 'edit' | 'preview'>(
    'edit'
  );

  return (
    <MDEditor
      value={MDContent}
      onChange={(val: string | undefined) => {
        val !== undefined && setMDContent(val);
      }}
      textareaProps={{
        placeholder: 'Please enter Markdown text'
      }}
      commandsFilter={(command) => {
        if (command.name === 'fullscreen') {
          command.execute = () => {
            if (MDfullscreen) {
              // editor being minimised
              // only show edit panel
              setMDpreview('edit');
            } else {
              setMDpreview('live');
            }
            setMDFullscreen(!MDfullscreen);
          };
        }
        return command;
      }}
      preview={MDpreview}
      previewOptions={{
        components: {
          code: ({ inline, children = [], className, ...props }) => {
            const txt = children[0] || '';
            if (inline) {
              if (typeof txt === 'string' && /^\$\$(.*)\$\$/.test(txt)) {
                const html = katex.renderToString(
                  txt.replace(/^\$\$(.*)\$\$/, '$1'),
                  {
                    throwOnError: false
                  }
                );
                return <code dangerouslySetInnerHTML={{ __html: html }} />;
              }
              return <code>{txt}</code>;
            }
            const code =
              props.node && props.node.children
                ? getCodeString(props.node.children)
                : txt;
            if (
              typeof code === 'string' &&
              typeof className === 'string' &&
              /^language-katex/.test(className.toLocaleLowerCase())
            ) {
              const html = katex.renderToString(code, {
                throwOnError: false
              });
              return (
                <code
                  style={{ fontSize: '150%' }}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              );
            }
            return <code className={String(className)}>{txt}</code>;
          }
        }
      }}
    />
  );
};

export default MarkdownEditor;
