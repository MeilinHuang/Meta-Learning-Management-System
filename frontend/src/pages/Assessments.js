import React, { useEffect, useState } from 'react'
import { Box, Heading } from "@chakra-ui/react"

import EditQuiz from '../components/edit-quiz/EditQuiz';
import QuestionCreation from '../components/question-creation/QuestionCreation';
import QuizCreation from '../components/quiz-creation/QuizCreation';
import QuizUsage from '../components/quiz-usage/QuizUsage';
import QuizViewSubmission from '../components/quiz-view-submission/QuizViewSubmission';
import { backend_url, topic_group_url } from "../Constants"

export default function Assessments() {
  const [topicGroup, setTopicGroup] = useState([]);

  useEffect(() => {
    console.log("Hello");
    fetch(backend_url + "topicGroup", {
        method: "GET",
        headers: {
          "Content-Type": "application/JSON",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((r) => {
          if (r.status === 200) {
            return r.json();
          }
          // TODO: Handle error case
        })
        .then((data) => {
          console.log("Topic groups: ");
          console.log(data);
    });
  }, []);

  const fetchRequest = () => {
    /*
    fetch(`${API_URL}/user/${username}`)
      .then(response => response.json())
      .then(userData => {
        if (!userData.hasOwnProperty('message') && password === userData.password) {
          setAuthenticated(true);
          global.username=username;
          global.introPhase = -1;
          navigation.replace('Nav');
          Toast.show("Login successful");     
          setLoading(false);
        }
        else {
          setTriedLogin(true);
          setAuthenticated(false);
          setLoading(false);
        }
      })
      .catch(error => console.error(error));
      */
  };

  return (
    <Box>
      {/* <EditQuiz /> */}
      <QuizCreation />
      {/* <QuestionCreation /> */}
      {/* <QuizUsage /> */}
      {/* <QuizViewSubmission /> */}
    </Box>
  );

}