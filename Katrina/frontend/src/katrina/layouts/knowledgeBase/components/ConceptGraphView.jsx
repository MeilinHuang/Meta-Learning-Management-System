import { FormControlLabel, Switch } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react'
import ConceptGraph from './ConceptGraph';


const findNode = (array, type, id) => {
  if (type !== null)
    return array.find(e => e.type === type && e.id === id);
  else
    return array.find(e => e.id === id);
}

const ConceptGraphView = ({ courseList }) => {

  const [groupNodes, setGroupNodes] = React.useState(true);

  const data = { nodes: [], links: [] }

  const offset = 60;
  let course_x = 350;
  let course_y = 50;
  let lecture_x = course_x + 100;
  let lecture_y = 50;
  let conc_x = lecture_x + 100;
  let conc_y = 50;
  // loop through courses
  Object.keys(courseList).sort().forEach((course_id, idx) => {
    const { course_code, course_name, course_term, lectures } = courseList[course_id];
    // if node not exists, add the course node
    course_y += offset;
    if (findNode(data.nodes, 'course', course_code) === undefined) {
      const newNode = {
        id: course_code,
        type: 'course',
        course_id: course_id,
        name: course_name,
        term: course_term,
        color: 'pink',
        size: 2000,
      }

      // set coordinates if groupNodes === true
      if (groupNodes) {
        newNode.x = course_x;
        newNode.y = course_y;
      }
      data.nodes.push(newNode)
    };

    // for each lecture in this course
    Object.keys(lectures).sort().forEach((lecture_id, idx) => {
      const { lecture_title, lecture_week, notes_id, last_update, concepts } = lectures[lecture_id];
      console.log(lectures[lecture_id])
      lecture_y += offset;
      // if node not exists, add the node
      if (findNode(data.nodes, 'lecture', lecture_title) === undefined) {
        const newNode = {
          id: lecture_title,
          type: 'lecture',
          course_code: course_code,
          course_term: course_term,
          lecture_id: lecture_id,
          last_update: last_update,
          lecture_week: lecture_week,
          color: 'skyblue',
          size: 1500,
        }

        // set coordinates if groupNodes === true
        if (groupNodes) {
          newNode.x = lecture_x;
          newNode.y = lecture_y;
        }

        data.nodes.push(newNode)
      }

      // add link
      data.links.push({
        source: lecture_title,
        target: course_code
      })

      // add concept
      concepts.forEach(e => {
        conc_y += offset;
        if (findNode(data.nodes, 'concept', e) === undefined) {
          const newNode = {
            id: e,
            type: 'concept',
            symbolType: 'star',
            color: 'yellow',
            size: 1000,
          }
          // set coordinates if groupNodes === true
          if (groupNodes) {
            newNode.x = conc_x;
            newNode.y = conc_y;
          }

          data.nodes.push(newNode);
        }

        // add link
        data.links.push({
          source: e,
          target: lecture_title,
        })
      });
    })
  });


  return (
    <Box display='flex' flexDirection='column' justifyContent='center'>
      {/* <FormControlLabel control={<Switch checked={groupNodes} onChange={() => {setGroupNodes(!groupNodes), }/>} label="Group Nodes" /> */}
      <ConceptGraph data={data} groupNodes={groupNodes} />
    </Box>
  )
}

export default ConceptGraphView;