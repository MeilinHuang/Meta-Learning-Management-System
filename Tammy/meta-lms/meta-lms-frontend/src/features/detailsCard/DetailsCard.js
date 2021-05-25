import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DropzoneArea } from 'material-ui-dropzone';
import { Card, CardContent, CardActions, Typography, Button } from '@material-ui/core';

import {
    setFilesToUpload,
    setUploadState,
    setViewOnlyState,
    setContextMenuAnchorEl,

    selectIsUploadPreparation,
    selectIsUploadContent,
    selectIsUploadPractice,
    selectIsUploadAssessment,

    selectPreparationFiles,
    selectContentFiles,
    selectPracticeFiles,
    selectAssessmentFiles
} from './detailsCardSlice';

import { uploadFiles } from '../topicGraph/topicGraphSlice'

import { fileToDataUrl } from './helpers.js';

import './DetailsCard.css';

import { ReactComponent as PdfIcon } from './assets/pdf.svg';



import { ContextMenu } from '../contextMenu/ContextMenu';
import { selectIsOpen, selectAnchorEl, openMenu, closeMenu } from '../contextMenu/contextMenuSlice';

import { DocumentViewer } from '../documentViewer/DocumentViewer';
import { closeViewer, openViewer, viewFile } from '../documentViewer/documentViewerSlice';

import { openEditor, setFilename } from '../markdownEditor/markdownEditorSlice'

import { viewMarkdown } from '../markdownEditor/markdownEditorSlice'

import pdfIcon from './assets/pdf.svg';
import mp4Icon from './assets/mp4.svg';
import mp3Icon from './assets/mp3.svg';
import txtIcon from './assets/txt.svg';
import pptIcon from './assets/ppt.svg';
import imgIcon from './assets/img.svg';
import { selectValue } from '../disciplineDropdown/disciplineDropdownSlice';


/// https://www.npmjs.com/package/react-file-previewer
///

// https://www.npmjs.com/package/material-ui-dropzone

// import untitledIcon from './assets/untitled.svg'

// materials is an object containing "attachments" which is a list of materials

// TODO: check and fix scrollable when overflow file contents
// TODO: reliable check to only accept certain types of files
export const DetailsCard = ({ topicId, stage, materials }) => {
    // TODO: when clicking on graph background - this component unmounts, the 
    // state should reset
    const disciplineVal = useSelector(selectValue);

    const isUploadPreparation = useSelector(selectIsUploadPreparation);
    const isUploadContent = useSelector(selectIsUploadContent);
    const isUploadPractice = useSelector(selectIsUploadPractice);
    const isUploadAssessment = useSelector(selectIsUploadAssessment);

    const preparationFilesToUpload = useSelector(selectPreparationFiles);
    const contentFilesToUpload = useSelector(selectContentFiles);
    const practiceFilesToUpload = useSelector(selectPracticeFiles);
    const assessmentFilesToUpload = useSelector(selectAssessmentFiles);

    const dispatch = useDispatch();

    const isUpload = (isUploadPreparation && stage === "Preparation")
        || (isUploadContent && stage === "Content")
        || (isUploadPractice && stage === "Practice")
        || (isUploadAssessment && stage === "Assessment")


    // convert stage string into  integer
    let stageInt = undefined;
    let materialsToUpload;
    switch (stage) {
        case "Preparation":
            // code block
            stageInt = 1;
            materialsToUpload = preparationFilesToUpload;
            break;
        case "Content":
            // code block
            stageInt = 2;
            materialsToUpload = contentFilesToUpload;
            break;
        case "Practice":
            stageInt = 3;
            materialsToUpload = practiceFilesToUpload;
            break;
        case "Assessment":
            stageInt = 4;
            materialsToUpload = assessmentFilesToUpload;
            break;
        default:
        // code block
    }

    const open_file = (file, stageNum, topicId) => {
        // console.log('test!!!')
        console.log(file, stageNum, topicId)

        dispatch(viewFile({ topicId, filename: file, category: stageNum }))
        // set open up file state to true?
        // fetch file to open
        // set file to open to the given file
    }



    const openMarkdown = (filename) => {

        console.log('open markdown!', topicId, stageInt, filename);
        dispatch(viewMarkdown({ topicId, filename: filename, category: stageInt }))
        // dispatch(openEditor({ topicId, stageInt }));
        // dispatch(setFilename({ filename }));
    }



    const handleFileChange = async (files) => {
        console.log('files: ', files, topicId, stage, materials)

        // let reader = new FileReader();

        let filesToUpload = [];

        // files.forEach(f => {
        //     // console.log(f.type, reader.readAsBinaryString(f));
        //     const fileUrl = await fileToDataUrl(f);

        //     // console.log('result: ', fileUrl.replace(`data:${f.type};base64,`, ''))
        //     const processedFileUrl = fileUrl.replace(`data:${f.type};base64,`, '');
        //     const fileName = f.name;
        //     const fileObj = {
        //         name: fileName,
        //         file: processedFileUrl
        //     }
        //     console.log('file object: ', fileObj)
        //     filesToUpload.push(fileObj)


        // })

        for (const f of files) {

            // console.log(f.type, reader.readAsBinaryString(f));
            const fileUrl = await fileToDataUrl(f);

            // console.log('result: ', fileUrl.replace(`data:${f.type};base64,`, ''))
            const processedFileUrl = fileUrl.replace(`data:${f.type};base64,`, '');
            const fileName = f.name;
            const fileObj = {
                name: fileName,
                file: processedFileUrl
            }
            console.log('file object: ', fileObj)
            filesToUpload.push(fileObj)
        }

        console.log('!files to upload: ', filesToUpload)
        // everytime file changes set state

        dispatch(setFilesToUpload({ stageInt, filesToUpload }))
    }

    let contextMenuAnchorEl = null;



    const handleContextMenu = (e, file) => {
        e.preventDefault();
        console.log(e.clientX, e.clientY, e.currentTarget);
        console.log('context menu!', file)
        dispatch(setContextMenuAnchorEl({ x: e.clientX, y: e.clientY, topicId, filename: file, category: stageInt }));
        dispatch(openMenu())
    }
    // TODO: simplify this code
    const materialsSection = (
        <div className="files-container">
            {materials.map((file) => {
                switch (file.split('.').pop()) {
                    // images
                    case "jpg":
                        return (
                            <div key={file} className="file"
                                onClick={() => open_file(file, stageInt, topicId)}
                                onContextMenu={(e) => handleContextMenu(e, file)}
                            >
                                <img src={imgIcon} width="30" alt="mp4 icon"></img>
                                <Typography variant="caption" className="file-part">
                                    {file}
                                </Typography>
                            </div>
                        )
                    case "png":
                        return (
                            <div key={file} className="file" onClick={() => open_file(file, stageInt, topicId)}
                                onContextMenu={(e) => handleContextMenu(e, file)}>
                                <img src={imgIcon} width="30" alt="mp4 icon"></img>
                                <Typography variant="caption" className="file-part">
                                    {file}
                                </Typography>
                            </div>
                        )
                    // video
                    case "mp4":
                        return (
                            <div key={file} className="file" onClick={() => open_file(file, stageInt, topicId)}
                                onContextMenu={(e) => handleContextMenu(e, file)}>
                                <img src={mp4Icon} width="30" alt="mp4 icon"></img>
                                <Typography variant="caption" className="file-part">
                                    {file}
                                </Typography>
                            </div>
                        )
                    case "mp3":
                        return (
                            <div key={file} className="file" onClick={() => open_file(file, stageInt, topicId)}
                                onContextMenu={(e) => handleContextMenu(e, file)}>
                                <img src={mp3Icon} width="30" alt="mp4 icon"></img>
                                <Typography variant="caption" className="file-part">
                                    {file}
                                </Typography>
                            </div>
                        )
                    // pdf
                    case "pdf":
                        return (
                            <div key={file} className="file"
                                onClick={() => open_file(file, stageInt, topicId)}
                                onContextMenu={(e) => handleContextMenu(e, file)}
                            >
                                <img src={pdfIcon} width="30" alt="pdf icon"></img>
                                <Typography variant="caption" className="file-part">
                                    {file}
                                </Typography>
                            </div>
                        )
                    case "md":
                        return (
                            <div key={file} className="file" onClick={() => openMarkdown(file)}
                                onContextMenu={(e) => handleContextMenu(e, file)}>
                                <img src={txtIcon} width="30" alt="txt icon"></img>
                                <Typography variant="caption" className="file-part"  >
                                    {file}
                                </Typography>
                            </div>
                        )
                    default:
                        return (
                            <div key={file} className="file" onClick={() => open_file(file, stageInt, topicId)}
                                onContextMenu={(e) => handleContextMenu(e, file)}>
                                <img src={txtIcon} width="30" alt="txt icon"></img>
                                <Typography variant="caption" className="file-part"  >
                                    {file}
                                </Typography>
                            </div>
                        )
                }
            })}
        </div>
    );



    return (
        <>
            <Card className="card" elevation={3}>

                <CardContent className="card-content">
                    <Typography variant="h5">
                        {stage}
                    </Typography>

                    <ContextMenu />
                    {
                        isUpload ?
                            <DropzoneArea
                                acceptedFiles={
                                    ['image/*',
                                        'video/*', 'audio/*', 'application/*', 'text/*']
                                }
                                // onChange={this.handleChange.bind(this)}
                                onChange={handleFileChange}
                                showFileNames
                                dropzoneText="Drag and drop a file here or click"
                                showAlerts={false}
                                filesLimit={10}
                            /> :
                            <div>{materials.length !== 0 ? materialsSection
                                : <Typography style={{
                                    paddingTop: "15px",
                                    color: "grey"
                                }}>No learning materials here.<br />
                                    Start by adding new learning materials!</Typography>}

                            </div>}

                </CardContent>
                <CardActions>
                    <Button
                        onClick={() => openMarkdown("")}>Create Markdown</Button>
                    {isUpload ?
                        <>
                            <Button onClick={() => {
                                // submit the files

                                dispatch(uploadFiles({ topicId: topicId, body: { category: stageInt, materials: materialsToUpload }, disciplineVal }))
                                dispatch(setViewOnlyState(stage))

                            }}>Submit</Button>
                            <Button onClick={() => { dispatch(setViewOnlyState(stage)) }}>Cancel</Button> </> :
                        <Button onClick={() => { dispatch(setUploadState(stage)) }}>Upload File(s)</Button>
                    }
                    {/* <Button>Export</Button> */}
                </CardActions>
            </Card>
        </>
    )

}

/**|| (isUpload && stage === "Content")
                        || (isUpload && stage === "Practice")
                        || (isUpload && stage === "Assessment") */