import { AppBar, Box, Container, Tab, Tabs } from '@mui/material';
import MDBox from 'components/MDBox';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import Navbar from 'katrina/components/Navbar';
import api from 'katrina/constants/api';
import { filterDelta } from 'katrina/helperFunctions/helperFunctions';
import React from 'react';
import axios from 'axios';
import ConceptAlphabet from './components/ConceptAlphabet';
import ConceptCardView from './components/ConceptCardView';
import ConceptDataGrid from './components/ConceptDataGrid';
import ConceptGraphView from './components/ConceptGraphView';
import breakpoints from "assets/theme/base/breakpoints";

import BubbleChartOutlinedIcon from '@mui/icons-material/BubbleChartOutlined';
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined';
import SortByAlphaOutlinedIcon from '@mui/icons-material/SortByAlphaOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import useAuth from 'katrina/auth/useAuth';

const KnowledgeBase = () => {
  const [courseList, setCourseList] = React.useState([]);
  const [conceptList, setConceptList] = React.useState([]);
  const [view, setView] = React.useState('alphabet');
  const [tabsOrientation, setTabsOrientation] = React.useState("horizontal");
  const { auth } = useAuth();

  const handleViewChange = (event, newView) => {
    setView(newView);
  };
  

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
    axios.get(`${api.BASE_URL}/notes-user/${auth.id}`)
      .then(res => {
        let tmpCourseList = {};
        let tmpConceptList = [];
        // extract concept from all the notes
        res.data.forEach(noteObj => {
          // filter the concept object from note delta
          const list = filterDelta(JSON.parse(noteObj.delta).ops, 'concept');
          tmpConceptList = tmpConceptList.concat(list);

          // if there's concept in this lecture note, get the information and update react state
          if (list.length > 0) {
            // if it's new course, create an empty course object
            if (tmpCourseList[noteObj.course_id] === undefined) {
              tmpCourseList[noteObj.course_id] = {
                course_code: noteObj.course_code,
                course_name: noteObj.course_name,
                course_term: noteObj.term,
                lectures: {}
              }
            }
            // insert the lecture info to the corresponding course
            tmpCourseList[noteObj.course_id].lectures[noteObj.lecture_id] = {
              lecture_title: noteObj.lecture_title,
              lecture_week: noteObj.lecture_week,
              notes_id: noteObj.notes_id,
              last_update: new Date(noteObj.last_update).toLocaleDateString(),
              is_public: noteObj.is_public,
              concepts: list
            }
          }
        });

        // remove duplicate concepts
        tmpConceptList = tmpConceptList.filter(function (item, pos, self) {
          return self.indexOf(item) === pos;
        })
        // set the sorted concept
        setCourseList(tmpCourseList)
        setConceptList(tmpConceptList.sort())
      })
      .catch(err => {
        alert(err)
        console.log(err)
      })
  }, []);

  return (
    <DashboardLayout>
      <Navbar />
      <Box>
        <AppBar position="static">
          <Tabs orientation={tabsOrientation} value={view} onChange={handleViewChange}>
            <Tab
              label="Alphabet"
              value='alphabet'
              icon={<SortByAlphaOutlinedIcon fontSize="small" sx={{ mt: -0.25 }} />}
            />
            <Tab
              label="Card"
              value='card'
              icon={<GridViewOutlinedIcon fontSize="small" sx={{ mt: -0.25 }} />}
            />
            <Tab
              label="Grid"
              value='grid'
              icon={<TableRowsOutlinedIcon fontSize="small" sx={{ mt: -0.25 }} />}
            />
            <Tab
              label="Graph"
              value='graph'
              icon={<BubbleChartOutlinedIcon fontSize="small" sx={{ mt: -0.25 }} />}
            />
          </Tabs>
        </AppBar>
        <Box sx={{ height: '100%', width: 'auto', margin: '5px 20px 5px 20px'  }}>
          {
            (view === 'alphabet' && <ConceptAlphabet conceptList={conceptList} />) ||
            (view === 'card' && <ConceptCardView courseList={courseList} />) ||
            (view === 'grid' && <ConceptDataGrid courseList={courseList} />) ||
            (view === 'graph' && <ConceptGraphView courseList={courseList} />)
          }
        </Box>
      </Box>
    </DashboardLayout>
  )

}

export default KnowledgeBase;