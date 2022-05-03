import React from 'react';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import Navbar from "katrina/components/Navbar";
import { AppBar, Box, Tab, Tabs } from '@mui/material';
import breakpoints from "assets/theme/base/breakpoints";
import axios from 'axios';
import apiConstants from 'katrina/constants/api';
import useAuth from 'katrina/auth/useAuth';
import { filterDelta } from 'katrina/helperFunctions/helperFunctions';
import MDTypography from 'components/MDTypography';
import TabView from './components/TabView';


// by default only shows the public notes of active course
const World = props => {
  const [view, setView] = React.useState();
  const [tabsOrientation, setTabsOrientation] = React.useState("horizontal");
  const [courses, setCourses] = React.useState({})
  const { auth } = useAuth();

  React.useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);
  

  React.useEffect(() => {
    let tmpCourseList = {};
    // get current in progress course
    auth.id && axios.get(`${apiConstants.BASE_URL}/courses/in-progress/${auth.id}`)
      .then(res => {
        const courseIdList = [];
        res.data.forEach(item => {
          courseIdList.push(item.course_id)
          tmpCourseList[item.course_id] = { 
            'course_code': item.course_code,
            'course_name': item.course_name,
            'course_term': item.term,
          }
          if (!view) setView(Number(item.course_id))
        });
        return Promise.resolve(courseIdList.join(','))
      })
      .then (res => { return axios.get(`${apiConstants.BASE_URL}/notes/public/${res}`)})
      .then(res => {
        // extract concept from all the notes
        res.data.forEach(noteObj => {
          const {
            course_id,
            course_name,
            course_code,
            delta,
            is_public,
            last_update,
            lecture_id,
            lecture_title,
            lecture_week,
            term,
            user_id,
            user_name
          } = noteObj;
          // filter the concept object from note delta
          const list = filterDelta(JSON.parse(delta).ops, 'concept');
          
          // if there's concept in this lecture note, get the information and update react state
          if (list.length > 0) {
            // if it's new course, create an empty course object
            if (!tmpCourseList[course_id].lectures) {
              tmpCourseList[course_id] = {
                course_name: course_name,
                course_code: course_code,
                course_term: term,
                lectures: {}
              }
            }
            // if there's new lecutre, create lecture object
            if (!tmpCourseList[course_id].lectures[lecture_id]) {
              tmpCourseList[course_id].lectures[lecture_id] = {
                lecture_title:  lecture_title,
                lecture_week: lecture_week,
                notes: {}
              }
            }
            
            // insert the notes info to the corresponding lecture
            // each user can only have one note in each course, so user_id will be key in lectures list
            tmpCourseList[course_id].lectures[lecture_id].notes[user_id] = {
              user_name: user_name,
              last_update: new Date(last_update).toLocaleDateString(),
              is_public: is_public,
              concepts: list
            }
          }
        });
        // set the sorted concept
        setCourses(tmpCourseList)
      })
      .catch(err => {
        alert(err)
        console.log(err)
      })
  }, [])

  
  const handleViewChange = (event, newView) => {
    setView(newView);
  };

  return (
    <DashboardLayout>
      <Navbar />
      {
        Object.keys(courses).length === 0 
        ? <h1>Loading...</h1>
        : (
          <>
            <AppBar position="static">
              <Tabs orientation={tabsOrientation} value={view} onChange={handleViewChange}>
                {
                  Object.keys(courses).map(course_id =>  
                    <Tab key={course_id} label={courses[course_id].course_code} value={Number(course_id)} />
                  )
                }
              </Tabs>
            </AppBar>
            
            <Box sx={{ pb: 1 }}>
              <Box sx={{ height: '100%', width: 'auto', margin: '5px 20px 5px 20px' }}>
                <TabView course={courses[view]} />
              </Box>
            </Box>
          </>
        )
      }
    </DashboardLayout>
  );
};

World.propTypes = {
  
};

export default World;