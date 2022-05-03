import React from 'react';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'katrina/components/Navbar';
import axios from 'axios';
import apiConstants from 'katrina/constants/api';
import { useParams } from 'react-router-dom';
import { filterDelta } from 'katrina/helperFunctions/helperFunctions';
import TabView from '../world/components/TabView';

/* Display for invalid url */
const Notes = () => {
  const urlParams = useParams();
  const [course, setCourse] = React.useState({
    course_code: urlParams.course,
    course_term: urlParams.term,
    lectures: {}
});

  React.useEffect(() => {
    let tmpCourse = {
      course_code: urlParams.course,
      course_term: urlParams.term,
      lectures: {}
    };

    axios.get(`${apiConstants.BASE_URL}/notes/public/${urlParams.course}/${urlParams.term}`)
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
          if (!tmpCourse.course_name) {
            tmpCourse.course_name = course_name
          }

          // if there's new lecutre, create lecture object
          if (!tmpCourse.lectures[lecture_id]) {
            tmpCourse.lectures[lecture_id] = {
              lecture_title: lecture_title,
              lecture_week: lecture_week,
              notes: {}
            }
          }

          // insert the notes info to the corresponding lecture
          // each user can only have one note in each course, so user_id will be key in lectures list
          tmpCourse.lectures[lecture_id].notes[user_id] = {
            user_name: user_name,
            last_update: new Date(last_update).toLocaleDateString(),
            is_public: is_public,
            concepts: list
          }
        }
      });
      // set the sorted concept
      setCourse(tmpCourse)
    })
      .catch(err => {
        alert(err)
        console.log(err)
      })
  },[])

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <TabView course={course} />
    </DashboardLayout>
  );
};

export default Notes;
