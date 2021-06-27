import React, { useState, useEffect } from 'react'
import { 
          Box,
          Button,
          Checkbox, 
          CheckboxGroup, 
          Heading, 
          Radio, 
          RadioGroup, 
          Select, 
          Stack,
          Text, 
          Textarea 
        } from "@chakra-ui/react"

import './QuizCreation.css'

export default function QuizCreation() {
  const [questionNumber, setQuestionNumber] = useState(1);
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("Multiple choice");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [quiz, setQuiz] = useState([]); // list of dictionaries [{}, {}, ...]

  useEffect(() => {
    // setQuestionText("### Question fetched from API ###");
  });

  const renderQuestionEntry = () => {
    return (
      <Box>
        <Heading>Question {questionNumber}</Heading>
        <Box display="inline-flex">
          <p>Question type:</p>
          <Select defaultValue="Multiple choice" onChange={handleQuestionTypeChange} value={questionType}>
            <option value="Multiple choice">Multiple choice</option>
            <option value="Short answer">Short answer</option>
            <option value="Checkboxes">Checkboxes</option>
          </Select>
        </Box>
        
        <Text>Question: </Text>
        {renderQuestionText()}

        {renderPossibleAnswers()}
      </Box>
    );
  };

  const addQuestionToQuiz = () => {
    // TODO
  };

  const createNewQuestion = () => {
    // TODO
  };

  const deleteQuestionEntry = () => {

  };

  const renderQuestionText = () => {
    return (
      <>
      <Textarea placeholder="Enter question" onChange={(e) => setQuestionText(e.target.value)} value={questionText} />
      </>
    );
  };

  const renderPossibleAnswers = () => {
    if (questionType === "Multiple choice")
    {
      // Radio buttons
      return (
        <Box>
          <p>Answers (select the correct answer): </p>
          <RadioGroup onChange={setCorrectAnswer} value={correctAnswer}>
            <Stack>
              <Radio value="1">First</Radio>
              <Radio value="2">Second</Radio>
              <Radio value="3">Third</Radio>
            </Stack>
          </RadioGroup>
        </Box>
      );
    }
    else if (questionType === "Short answer")
    {
      // Text box
      return (
        <Box>
          <Text>Enter a possible correct answer: </Text>
          <Textarea onChange={(e) => {setCorrectAnswer(e.target.value)}} />
        </Box>
      );
    }
    else if (questionType === "Checkboxes")
    {
      // Checkboxes
      // Loop through list of possible answers
      return (
        <Box>
          <p>Answers (select the correct answer/s): </p>
          <CheckboxGroup colorScheme="green">
            <Stack>
              <Checkbox value="1">First</Checkbox>
              <Checkbox value="2">Second</Checkbox>
              <Checkbox value="3">Third</Checkbox>
              <Checkbox value="4">Fourth</Checkbox>
            </Stack>
          </CheckboxGroup>
        </Box>
      );
    }
      
    return (<p>Possible answers were not fetched properly</p>);
  };

  const deletePossibleAnswer = () => {

  };

  const handleQuestionTypeChange = (e) => {
    setQuestionType(e.target.value);
  };

  const resetQuestionFields = () => {
    setQuestionType("Multiple choice");
    setQuestionText("");
    setCorrectAnswer("");
  };

  const renderQuiz = () => {
    return (
      <Box>
        
      </Box>
    );
  };

  return (
    <Box>
      {renderQuestionEntry()}

      {/* Add question button */}
      <Button colorScheme="teal" variant="solid" onClick={addQuestionToQuiz}>Add to quiz</Button>

      <Button colorScheme="blue" variant="solid" onClick={resetQuestionFields}>Reset fields</Button>

      <Button colorScheme="red" variant="solid" onClick={createNewQuestion}>Create new question</Button>

      <p style={{ color: "red" }}>Correct answer will be: <b>{correctAnswer}</b></p>
      
      {renderQuiz()}
    </Box>
  );
}