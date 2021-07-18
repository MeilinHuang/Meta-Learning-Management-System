import React, { useEffect, useState } from 'react'
import { Box, Heading } from "@chakra-ui/react"

import QuizCreation from '../components/quiz-creation/QuizCreation';

export default function Assessments() {
  // const [id, setId] = useState(0);

  useEffect(() => {

  });

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
    <div>
      <QuizCreation />
    </div>
  );

}