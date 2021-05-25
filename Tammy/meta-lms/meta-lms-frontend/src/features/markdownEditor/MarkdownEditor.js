import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Button, Dialog, DialogTitle, DialogContent, DialogContentText,
    TextField, Checkbox, DialogActions
} from '@material-ui/core';

import ReactMarkdown from 'react-markdown';

import { selectInput, selectTopicId, selectStage, setInput, setFilename, selectIsOpen, openEditor, closeEditor, selectFilename } from './markdownEditorSlice';


import { uploadFiles } from '../topicGraph/topicGraphSlice';
import './MarkdownEditor.css';
import SelectInput from '@material-ui/core/Select/SelectInput';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { selectValue } from '../disciplineDropdown/disciplineDropdownSlice';


export const MarkdownEditor = ({ initialFilename = "", initialInput = "", initialIsOpen = false, initialTopicId, initialStage }) => {
    // console.log({ initialFilename, initialInput, initialIsOpen })
    const disciplineVal = useSelector(selectValue);

    const dispatch = useDispatch();
    // set state to initial values
    // dispatch(setFilename(initialFilename));



    const input = useSelector(selectInput);
    const isOpen = useSelector(selectIsOpen);
    const filename = useSelector(selectFilename);
    const topicId = useSelector(selectTopicId);
    const stage = useSelector(selectStage);

    const makeTextFile = function (text) {
        let textFile = null;
        var data = new Blob([text], { type: 'text/plain' });

        // If we are replacing a previously generated file we need to
        // manually revoke the object URL to avoid memory leaks.
        if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
        }

        textFile = window.URL.createObjectURL(data);

        // returns a URL you can use as a href
        return textFile;
    };
    // https://stackoverflow.com/questions/18650168/convert-blob-to-base64
    const blobToBase64 = blob => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        return new Promise(resolve => {
            reader.onloadend = () => {
                resolve(reader.result);
            };
        });
    };

    return (
        <>
            <Dialog
                // fullWidth
                fullWidth
                maxWidth="lg"
                open={isOpen}
                // open={isOpen}
                onClose={() => {
                    console.log('close dialog!')
                    dispatch(closeEditor())

                }}
                // style={{ width: "100vw", height: "100vh" }}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Markdown Editor</DialogTitle>

                <div style={{ display: "flex", marginRight: "20px", justifyContent: 'center' }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Filename"
                        type="string"
                        placeholder="e.g. pointers_notes.md"
                        required={true}
                        onChange={
                            (e) => dispatch(setFilename({ filename: e.target.value }))
                        }
                        value={filename}
                    // onChange={(e) => dispatch(setTitle(e.target.value))}
                    // helperText="Invalid title"
                    // error={}
                    />

                    <Button
                        color="primary"
                        onClick={() => {
                            console.log('close dialog!')
                            console.log('input: ', input, filename, topicId, stage);
                            // create a file object

                            const blobData = new Blob([input], { type: 'text/markdown' });
                            console.log('file: ', blobData)

                            blobToBase64(blobData).then(res => {
                                // do what you wanna do
                                console.log(res); // res is base64 now
                                console.log('res:', res)
                                const processedFileUrl = res.replace(`data:text/markdown;base64,`, '');
                                console.log('processed: ', processedFileUrl);
                                console.log('uploading markdown: ', topicId, stage, filename, processedFileUrl)
                                dispatch(uploadFiles({
                                    topicId: topicId,
                                    body: {
                                        category: stage,
                                        materials: [{
                                            name: filename,
                                            file: processedFileUrl
                                        }]
                                    },
                                    disciplineVal
                                }))
                            });
                            // dispatch to backend
                            // dispatch(uploadFiles({ topicId: topicId, body: { category: stageInt, materials: materialsToUpload } }))
                            dispatch(closeEditor())

                        }}>
                        Save Markdown
                    </Button>
                    <Button
                        color="primary"
                        onClick={() => {
                            console.log('close dialog!')

                            dispatch(closeEditor())

                        }}
                    >
                        Cancel
                    </Button>

                </div>

                <DialogContent style={{ display: "flex" }}>
                    <textarea className="textarea" value={input}
                        autoFocus
                        placeholder="Enter your markdown content here..."
                        value={input}
                        onChange={
                            (e) => dispatch(setInput({ input: e.target.value }))
                        }
                    />

                    <ReactMarkdown source={input} className="markdown" renderers={{
                        code: Component
                    }} />
                </DialogContent>

            </Dialog>
        </>)

}


const Component = ({ value, language }) => {

    return (
        <SyntaxHighlighter language={language ?? null} style={docco}>
            {value ?? ''}
        </SyntaxHighlighter>
    );
};

// https://www.youtube.com/watch?v=x5JdT5KJBzw