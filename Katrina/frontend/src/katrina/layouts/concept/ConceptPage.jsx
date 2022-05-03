import React from 'react';
import axios from "axios";
import { useParams } from 'react-router-dom';
import { Box } from '@mui/system';
import { Tab, Tabs, Typography } from '@mui/material';
import TabPanel from './components/TabPanel';
import { convertDeltaToHtml } from "katrina/helperFunctions/helperFunctions";
import apiConstants from 'katrina/constants/api';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import Navbar from "katrina/components/Navbar";
import useAuth from 'katrina/auth/useAuth';


/* The page to display a unique concept and it's related lecture notes */
const ConceptPage = () => {
  const {auth} = useAuth();
  const urlParams = useParams();
  const [info, setInfo] = React.useState([]);
  const [displayItem, setDisplayItem] = React.useState(0);

  React.useEffect(() => {

    axios.get(`${apiConstants.BASE_URL}/notes/keyword/${auth.id ?? JSON.parse(localStorage.getItem('auth')).id}/${urlParams.keyword}`)
      .then(res => {
        const courses = [];
        res.data.forEach(n => {
          let courseExists = courses.find(c => c.label === `${n.course_code} (${n.term})`);
          // if found new course
          if (courseExists === undefined) {
            courseExists = {
              label: `${n.course_code} (${n.term})`,
              course_code: n.course_code,
              course_id: n.course_id,
              course_name: n.course_name,
              course_term: n.term,
              lectures: []
            };
            courses.push(courseExists);
          }
          // push the lecture
          n.delta = convertDeltaToHtml(JSON.parse(n.delta).ops);
          courseExists.lectures.push({
            id: n.lecture_id,
            title: n.lecture_title,
            video: n.lecture_video,
            week: n.lecture_week,
            notes_id: n.notes_id,
            html: n.delta
          })
        })
        console.log(courses)
        setInfo(courses);
      })
      .catch(err => {
        console.log(err);
        alert(err)
      });
    // eslint-disable-next-line 
  }, []);

  function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }

  const handleChange = (event, newValue) => {
    setDisplayItem(newValue);
  };

  return (
    <DashboardLayout >
      <Navbar />
        <Box sx={{  display: 'flex', flexDirection: 'column' }}>
          <Tabs
            // orientation="vertical"
            variant="scrollable"
            value={displayItem}
            onChange={handleChange}
            // sx={{ borderRight: 1, borderColor: 'divider', minWidth: 200 }}
          >
            {
              info.map((i, index) => <Tab key={index} label={i.label} {...a11yProps(index)}/>)
            }
          </Tabs>
          <Box>
            {
              info.map((i, index) => (
                <TabPanel key={index} value={displayItem} index={index} lectureObj={i} />
              ))
            }
          </Box>
      </Box>
    </DashboardLayout>
  );
}

export default ConceptPage;
