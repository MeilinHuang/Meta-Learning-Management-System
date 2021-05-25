import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import FilePreviewer from 'react-file-previewer';

import {
    Button, Dialog, DialogTitle, DialogContent, DialogContentText,
    TextField, Checkbox, DialogActions
} from '@material-ui/core';
import { closeViewer, selectFilename, selectIsOpen, selectSrc, selectType } from './documentViewerSlice';

import { MarkdownEditor } from '../markdownEditor/MarkdownEditor'
// should have added the mimetype in the file data
export const DocumentViewer = () => {
    const dispatch = useDispatch();
    const isOpen = useSelector(selectIsOpen)
    const filename = useSelector(selectFilename)
    const fileType = useSelector(selectType);
    const fileSrc = useSelector(selectSrc);

    return (
        <>
            <Dialog
                fullWidth
                maxWidth="sm"
                open={isOpen}
                onClose={() => {
                    console.log('close dialog!')
                    dispatch(closeViewer())

                }}
                aria-labelledby="form-dialog-title">
                {(fileType === 'application/pdf' || fileType === 'image/png' || fileType === 'image/jpg')
                    ? <FilePreviewer
                        file={{

                            data: fileSrc,
                            mimeType: fileType,
                            name: filename // for download
                        }}
                    /> :
                    (fileType === 'text/markdown'
                        ? <div><MarkdownEditor initialFilename={""} initialInput={""} initialIsOpen={true} /></div>
                        : <DialogContent>
                            <DialogContentText>A preview cannot be shown be this file. Please right click icon to download the file and view locally.</DialogContentText>
                        </DialogContent>)
                }
            </Dialog>
        </>
    )
}

