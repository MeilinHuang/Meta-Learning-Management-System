import React from "react";
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5';
import { pdfjs } from 'react-pdf';
import { Box } from "@mui/system";
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

import './PdfViewer.css'

// load worker from external CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

let myPageRef = null;
let setPage = null;

const options = {
  cMapUrl: 'cmaps/',
  cMapPacked: true,
  standardFontDataUrl: 'standard_fonts/',
};

const PdfViewer = ({fileName,courseCode}) => {
  const [numPages, setNumPages] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [myPage, setMyPage] = React.useState();

  React.useEffect(() => {
    myPageRef = myPage;
  }, [myPage]);

  React.useEffect(() => {
    setPage = setPageNumber;
  }, [pageNumber])


  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  }

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  const prevPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  if (fileName === null)
    return <h5>Lecture slides not available</h5>

  if (fileName === '') 
    return <h5>Loading slides...</h5>

  let file = ''
  try{
    file = require(`katrina/fakeData/files/${courseCode}/${fileName}`)
  } catch (err) {
    return <h5>Lecture slides not available</h5>
  }

  return (
    <Box 
      display='flex' 
      flexDirection='column' 
      alignItems='center' 
      p={3}
    >
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        options={options}
        style={{
          margin: '1em 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Page 
          pageNumber={pageNumber} 
          inputRef={ref => setMyPage(ref)}
          style={{
            marginLeft: 'auto', 
            marginRight: 'auto',
          }}
        />
      </Document>
      <Box 
        display='flex'
        flexDirection='row'
        justifyContent='center'
        p={1}
      >
        <MDButton 
          variant='contained'
          color='info'
          onClick={prevPage} 
          disabled={pageNumber === 1}
        >
          <ChevronLeftOutlinedIcon fontSize="small"/>
        </MDButton>
        <MDTypography 
          variant='h5'
          pl={2}
          pr={2}
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          Page {pageNumber} of {numPages}
        </MDTypography>
        <MDButton 
          variant='contained'
          color='info'
          onClick={nextPage} 
          disabled={pageNumber === numPages}
        >
          <ChevronRightOutlinedIcon fontSize="small"/>
        </MDButton>
      </Box>
    </Box>
  )
}

export {myPageRef, setPage};
export default PdfViewer;
