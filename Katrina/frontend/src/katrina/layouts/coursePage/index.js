import { Container, Typography } from "@mui/material";
import axios from "axios";
import React from "react";
import { useParams } from 'react-router-dom';
import LectureList from "./components/LectureList";
import apiConstants from "katrina/constants/api";
import Navbar from "katrina/components/Navbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";

/* The page for listing all the lectures in an enrolled course */
const CoursePage = () => {
  const [course, setCourse] = React.useState();
  const urlParams = useParams();

  React.useEffect(() => {
    axios.get(`${apiConstants.BASE_URL}/courses/${urlParams.course}/${urlParams.term}`)
      .then(res => {
        setCourse(res.data);
      })
      .catch(err => {
        console.log(err);
        alert("ERROR fetching course info: ", err);
      })
    // eslint-disable-next-line 
  }, [urlParams]);

  // TOFIX: user content loader
  if (course === undefined) return (<></>);
  return (
    <DashboardLayout>
      <Navbar />
      <MDBox pt={6} pb={3}>
        <Typography variant="h4" align="center">{course.course_name}</Typography>
        <Typography variant="h6" align='center'>{course.course_code}-{course.term}</Typography>
      </MDBox>
      <LectureList courseId={course.course_id} courseCode={course.course_code} term={course.term} />
    </DashboardLayout>
  );
};

export default CoursePage;
