import React from 'react';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Box } from '@mui/system';
import MDButton from 'components/MDButton';
import MDBox from 'components/MDBox';
import LectureCard from './LectureCard';
import MDTypography from 'components/MDTypography';


const ConceptCardView = ({ courseList }) => {

  const navBtn = (content, href) =>
    <MDButton component={Link} variant='gradient' color="info" size='small' sx={{ m: 1 }} to={href}>
      {content}
    </MDButton>

  if (Object.keys(courseList).length === 0) {
    return <h4>You don't have concept.</h4>
  }

  return (
    <Box sx={{ pb: 1 }}>
      {
        // list all courses
        Object.keys(courseList).reverse().map((c, idx) => (
          <div key={idx}>
            <MDTypography variant="h4" m={2} style={{ fontWeight: 'bold' }}>
              {`${courseList[c].course_code} (${courseList[c].course_term}) - ${courseList[c].course_name}`}
              {navBtn('View Course', `/student/courses/${courseList[c].course_code}/${courseList[c].course_term}`)}
            </MDTypography>
            <Box display='flex' flexWrap='wrap' flexDirection='row'>
              {
                // list lectures in this course
                Object.keys(courseList[c].lectures).map((l, idx) => (
                  // <LectureCard 
                  //   key={idx} 
                  //   lectureObj={courseList[c].lectures[l]} 
                  //   courseCode={courseList[c].course_code} 
                  //   term={courseList[c].course_term} 
                  //   id={l}
                  // />
                  <LectureCard
                    color="primary"
                    key={idx} 
                    lectureObj={courseList[c].lectures[l]} 
                    courseCode={courseList[c].course_code} 
                    term={courseList[c].course_term} 
                    id={l}
                  />
                ))
              }
            </Box>
          </div>
        ))
      }
    </Box>
  );
};

export default ConceptCardView;
