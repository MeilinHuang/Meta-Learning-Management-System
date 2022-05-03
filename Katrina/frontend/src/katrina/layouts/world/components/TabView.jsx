import { Box } from '@mui/system';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import React from 'react';
import { Link } from 'react-router-dom';
import LectureCard from './LectureCard';


const TabView = ({ course }) => {
  return (
    <>
      <Box textAlign='center' p={3}>
        <MDTypography variant='h3'>{ course.course_name }</MDTypography>
        <MDTypography variant='h4'>{course.course_code} ({course.course_term})</MDTypography>
      </Box>
      <Box>
        {
          course.lectures && Object.keys(course.lectures).length > 0 
            ? Object.keys(course.lectures).map(lec => 
              // for erery lecture, display title and note card
              <div key = { lec }>
                <MDTypography variant="h4" m={2} style={{ fontWeight: 'bold' }}>
                  {`WK${course.lectures[lec].lecture_week} - ${course.lectures[lec].lecture_title}`}
                </MDTypography>
                  <Box display='flex'  flexDirection='row' >
                    {
                      Object.keys(course.lectures[lec].notes).map(user_id =>
                        <LectureCard 
                          note={course.lectures[lec].notes[user_id]} 
                          courseCode={course.course_code}
                          term={course.course_term}
                          lectureId={lec}
                          userId={user_id} 
                          key={user_id} 
                        />
                      )
                    }
                  </Box>
              </div>
            )
            : <MDTypography variant='h6'>No public notes in this course</MDTypography>
            
        }
      </Box>
    </>
  );
};

export default TabView;