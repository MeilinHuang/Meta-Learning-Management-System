import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
// import FileViewer from "react-file-viewer";

import { pdfjs, Document, Page } from 'react-pdf';
// import { pdfjs } from 'react-pdf';
// pdfjs.GlobalWorkerOptions.workerSrc = `/path/to/your/worker.js`
import './LearningMaterialViewer.css'; // pdf
// import { Document, Page, pdfjs   } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
//https://codesandbox.io/s/jovial-kirch-p95he?file=/src/fileViewer.js:130-231
// https://github.com/wojtekmaj/react-pdf/issues/97

// import { pdfjs } from 'react-pdf';
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// const pdfjsVersion = "2.0.305";
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.js`

// setOptions({
//     workerSrc: `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.js`
// });


// https://stackoverflow.com/questions/47225553/load-more-than-1-pdf-pages-in-react-pdf
const file = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
const type = "pdf";

const onError = e => {
    console.log(e, "error in file-viewer");
};
// https://stackoverflow.com/questions/27957766/how-do-i-render-a-word-document-doc-docx-in-the-browser-using-javascript
// pop up window to view the given file
export const LearningMaterialViewer = () => {
    const [numPages, setNumPages] = useState(null);
    // fullWidth={true} maxWidth='lg' Dialog
    return (
        <>

            <Dialog scroll='paper' onClose={() => { console.log('close!') }} aria-labelledby="customized-dialog-title" open={true}>
                <DialogTitle id="customized-dialog-title" onClose={() => { console.log('close!') }}>
                    Title
                </DialogTitle>
                <DialogContent dividers>
                    <div className="file-viewer">
                        {/* <FileViewer fileType={type} filePath={file} onError={onError} /> */}
                        {/* <Document
                            file="http://www.africau.edu/images/default/sample.pdf"
                        // onLoadSuccess={onDocumentLoadSuccess}
                        >
                            <Page pageNumber={1} />
                        </Document> */}

                        <Document width='100%'
                            height='100%'
                            file="http://www.africau.edu/images/default/sample.pdf"
                            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                        >
                            {Array.apply(null, Array(numPages))
                                .map((x, i) => i + 1)
                                .map(page => <Page pageNumber={page} />)}
                        </Document>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => { console.log('close!') }} color="primary">
                        Download
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );
}