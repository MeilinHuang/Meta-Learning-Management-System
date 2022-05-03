import { Box, width } from '@mui/system';
import axios from 'axios';
import React from 'react';
import Editor from './components/TextEditor/Editor';
import VideoPlayer from './components/VideoPlayer';
import PdfViewer from './components/PdfViewer';
import { convertDeltaToHtml } from "katrina/helperFunctions/helperFunctions";
import { useParams } from "react-router-dom";
import { Grid, Typography } from '@mui/material';
import apiConstants from 'katrina/constants/api';
import MDBox from 'components/MDBox';
import PageLayout from 'examples/LayoutContainers/PageLayout';
import Navbar from "./components/Navbar";
import useAuth from 'katrina/auth/useAuth';
import ReactQuill from 'react-quill';


/* The page to display the learning material of a lecture (e.g., video, notes, lecture slides) */
const LecturePage = ({self}) => {
  const { auth } = useAuth();
  const urlParams = useParams();
  const [lastUpdate, setLastUpdate] = React.useState();
  const [value, setValue] = React.useState();
  const [courseInfo, setCourseInfo] = React.useState({});
  const [newNote, setNewNote] = React.useState(false);
  const [video, setVideo] = React.useState('');
  const [file, setFile] = React.useState('');

  React.useEffect(() => {
      // retrieve note from database
      axios.get(`${apiConstants.BASE_URL}/lecture/${urlParams.lecture}`)
        .then(res => {
          setCourseInfo(res.data);
          setVideo(res.data.video);
          setFile(res.data.slides);
        })
        .then(() => axios.get(`${apiConstants.BASE_URL}/notes/${self ? auth.id : urlParams.userId }/${urlParams.lecture}`))
        .then((res) => {
          // code 200: there's note for the lecture
          // code 201: no note for the lecture (will create 1 when save)
          if (res.status === 200 && res.data.delta != null) {
            try {
              const html = convertDeltaToHtml(JSON.parse(res.data.delta).ops);
              setValue({
                html: html,
                delta: res.data.delta,
                is_public: res.data.is_public,
              });
              console.log(res.data.last_update)
              setLastUpdate(new Date(res.data.last_update).toLocaleString())
  
            } catch (e) {
              console.log('converter error: ', e);
            }
  
          } else if (res.status === 201) {
            setNewNote(true);
            setValue({
              html: null,
              delta: null,
              is_public: false
            })
          }
        })
        .catch((err) => {
          console.log(err)
        });
    
    
    // eslint-disable-next-line 
  }, [auth])

  // handle the save button. save the delta into database
  const handleSave = (e) => {
    // replace double quote to single quote
    const body = {
      user_id: auth.id,
      lecture_id: parseInt(urlParams.lecture),
      delta: value.delta,
      is_public: value.is_public,
      newNote: newNote,
    }
    setNewNote(false);
    axios.post(`${apiConstants.BASE_URL}/notes`,
      JSON.stringify(body),
      {
        headers: {
          "Content-type": "application/json",
        }
      })
      .then(res => {
        setLastUpdate(new Date().toLocaleString())
        alert("Note saved!")
      })
      .catch(err=> {
        console.log(err);
        alert("Error occurred!")
      })
  }

  // handle the change of the editor (update html content)
  const handleChange = (content, delta, source, editor) => {
    const newV = {...value};
    newV.html = content;
    newV.delta = JSON.stringify(editor.getContents())
    setValue(newV)
  }

  const handlePublic = (e) => {
    const newV = {...value};
    newV.is_public = e.target.checked;
    setValue(newV)
  }
  
  return (
    <PageLayout>
      <Navbar />
      <MDBox
        p={5}
        width="100%"
      />
      <MDBox width="90%" height="100vh" mx="auto">
        <Typography variant='h4' p={3}>(Week {courseInfo.week}) {courseInfo.title}</Typography>
        <Box
          display='flex'
          flexDirection='row'
          justifyContent='space-between'
        >
          <Box display='flex' flexDirection='column' justifyContent='flex-start' sx={{ width: '60%' }}>
            <VideoPlayer url={video} />
            <PdfViewer fileName={file} courseCode={urlParams.course}/>
          </Box>
          {
            value 
            ? 
              self 
              ? <Editor 
                  value={value} 
                  lastUpdate={lastUpdate}
                  key={value}
                  handleChange={handleChange} 
                  handleSave={handleSave} 
                  handlePublic={handlePublic}
                />
              : <MDBox
                  borderRadius='lg'
                  shadow='lg'
                  p={3}
                  sx={{
                    width: '40%',
                  }}
                >
                  <ReactQuill
                    theme="bubble"
                    value={value.html} 
                    readOnly={true}
                  />
                </MDBox>
            : <h1>Loading note...</h1>
          }
        </Box>
      </MDBox>
        
    </PageLayout>
  );
}

export default LecturePage;
