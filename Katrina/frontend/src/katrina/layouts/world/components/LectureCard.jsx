import { Card, Divider } from '@mui/material';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import useAuth from 'katrina/auth/useAuth';
import React from 'react';
import { Link } from 'react-router-dom';

const LectureCard = ({note, userId, term, courseCode, lectureId}) => {

  const { auth } = useAuth();
  return (
    <Card
      variant="outlined"
      component={Link}
      to={ auth.staff
        ? `/staff/courses/${courseCode}/${term}/${lectureId}/${userId} `
        : `/student/courses/${courseCode}/${term}/${lectureId}/${userId == auth.id ? '' : userId}`
      }
      sx={{
        m: 1,
        pb: 1,
        borderRadius: '7px',
        border: '0px',
        height: '250px',
        width: '350px',
        transition: '0.3s',
        '&:hover': { transform: 'scale(1.05)' },
      }}
    >
      <MDBox 
        display="flex" 
        justifyContent="space-between" 
        pt={1} 
        px={2} 
      >
        <MDBox
          component={Link}
          to={`/${auth.staff? 'staff' : 'student'}/profile/${userId}`}
          variant="gradient"
          bgColor="primary"
          color="white"
          coloredShadow="primary"
          borderRadius="xl"
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="4rem"
          height="3.7rem"
          mt={-3}
          sx={{
            transition: '0.3s',
            '&:hover': { transform: 'scale(1.2)' },
          }}
        >
          {note.user_name.toUpperCase()[0]}
        </MDBox>
        <MDBox display="flex" flexDirection="column" alignItems="flex-end" textAlign="right" lineHeight={1.25} sx={{ width: '300px' }}>
          <MDTypography variant="button" fontWeight="light" color="text">
            {`Updated at: ${note.last_update}`}
          </MDTypography>
          <MDTypography fontWeight='bold' color='text' >{note.user_name}</MDTypography>
        </MDBox>
      </MDBox>
      <Divider />
      <MDBox pb={2} px={2} sx={{ overflow: 'auto'}}>
        {
          // list concepts added in this lecture
          note.concepts.sort().map((c, idx) =>
            <MDButton
              component={Link}
              to={`/student/knowledge-base/${c}`}
              variant='outlined'
              color='info'
              size="small"
              key={idx}
              sx={{ margin: '3px' }}
            >
              {c}
            </MDButton>
          )
        }
      </MDBox>
    </Card>
  );
};

export default LectureCard;