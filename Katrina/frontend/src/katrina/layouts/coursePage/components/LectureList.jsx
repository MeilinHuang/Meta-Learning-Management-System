import { Button, Typography } from "@mui/material";
import React from "react";
import { AccordionDetails, Accordion, AccordionSummary } from 'katrina/components/Accordions';
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { convertDeltaToHtml } from "katrina/helperFunctions/helperFunctions";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import useAuth from "katrina/auth/useAuth";
import apiConstants from "katrina/constants/api";
import MDButton from "components/MDButton";


const LectureList = ({ courseId, courseCode, term }) => {
  const [lectures, setLectures] = React.useState([]);
  const { auth } = useAuth();

  React.useEffect(() => {
    axios.get(`${apiConstants.BASE_URL}/notes/course/${auth.id}/${courseId}`)
      .then(res => {
        // eslint-disable-next-line
        res.data.map(l => {
          if (l.delta != null) {
            l.delta = convertDeltaToHtml(JSON.parse(l.delta).ops); 
            l.delta = l.delta.replaceAll('ql-timestamp', '');
          }
        })
        setLectures(res.data)
      })
      .catch((err) => {
        console.log(err);
      })
   // eslint-disable-next-line 
  }, []);

  const emptyNotes = (l) => l === null || l === '<p><br/></p>'


  return (
    <>
      {
        lectures.map(l => (
          <Accordion key={l.lecture_id}>
            <AccordionSummary aria-controls={`${l.id}-content`} id={`${l.id}-header`}>
              <Typography style={{marginTop: 'auto', marginBottom: 'auto'}}>{l.title}</Typography>
              <Link
                to={`/student/courses/${courseCode}/${term}/${l.lecture_id}`}
              >
                <MDButton 
                  sx={{ m: 1 }} 
                  color="dark" 
                  size='small' 
                  variant="outlined" 
                >
                  View Lecture
                </MDButton>
              </Link>
            </AccordionSummary>
            <AccordionDetails>
                <ReactQuill
                  theme="bubble"
                  value={emptyNotes(l.delta) ? "[No note taken in this lecture]" : l.delta}
                  readOnly={true}
                />
            </AccordionDetails>
          </Accordion>
        ))
      }
    </>
  );
};

export default LectureList;
