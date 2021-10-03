import React, { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
  Flex,
  Heading,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  ModalHeader,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"

import { BiQuestionMark } from "react-icons/bi";
import { TiTick } from "react-icons/ti";
import { FaQuestion } from "react-icons/fa";
import { BsQuestion } from "react-icons/bs";
import { select } from 'd3';

export default function QuizUsage() {
  const [quizId, setQuizId] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [studentSubmission, setStudentSubmission] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [currQuestionNo, setCurrQuestionNo] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // TODO: Replace with a GET call to get questions
    const receivedQuestions = [
      {
        question_id: 1,
        question_text: "This is example question text 1",
        question_type: "cb",
        marks_awarded: 4,
        possible_answers: [
          {
            id: 1,
            text: "answer1"
          },
          {
            id: 2,
            text: "answer2"
          },
        ]
      },
      {
        question_id: 2,
        question_text: "This is example question text 2",
        question_type: "sa",
        marks_awarded: 3,
        possible_answers: [
        ]
      },
      {
        question_id: 3,
        question_text: "This is example question text 3",
        question_type: "mc",
        marks_awarded: 3,
        possible_answers: [
          {
            id: 1,
            text: "answer1"
          },
          {
            id: 2,
            text: "answer2"
          },
          {
            id: 3,
            text: "answer3"
          }
        ]
      }
    ];

    // Store questions locally for quiz
    setQuestions(receivedQuestions);

    // Fill student submissions object with relevant details and setup
    const newSubmission = {
      quiz_id: 1,
      answers: []
    };

    receivedQuestions.forEach(qs => {
      const answerObj = {
        question_id: qs.question_id,
        student_answers: []
      };

      newSubmission.answers.push(answerObj);
    })

    setStudentSubmission(newSubmission);

    // Create new answer submission
    // TODO: GET studentSubmission from db (if editing the submission, else create new one)
    // const newSubmissionObj = generateNewAnswerSubmission();
    // setStudentSubmission(newSubmissionObj);
  }, []);

  const generateNewAnswerSubmission = () => {
    // TODO REMOVE: Calling this in useEffect does not work
    const newSubmission = {
      quiz_id: 1,
      answers: []
    };

    questions.forEach(qs => {
      const answerObj = {
        question_id: qs.question_id,
        student_answers: []
      };

      newSubmission.answers.push(answerObj);
    })

    return newSubmission;
  };

  const renderQuestion = (q, qIndex) => {
    /*
    // Get students' answers for currently shown question
    console.log(studentSubmission.answers);
    const answerToCurrQuestion = studentSubmission?.answers?.find(ansObj => ansObj.question_id === questions[currQuestionNo].question_id);
    // console.log(answerToCurrQuestion);
    if (answerToCurrQuestion)
    {
      console.log("answertoCurrQUestions");
      console.log(answerToCurrQuestion);
      setSelectedAnswers(answerToCurrQuestion.student_answers);  
    }
    */

    return (
      <Box width="70%" border="1px" borderColor="gray.300" borderRadius="md" p={10}>
        <Heading size="md">Question {qIndex}</Heading>
        <Text mt={3}>{q.question_text}</Text>

        {q.question_type === "mc" && renderMultipleChoiceAnswers(q)}
        {q.question_type === "sa" && renderShortAnswerAnswers(q)}
        {q.question_type === "cb" && renderCheckboxAnswers(q)}

        <Stack direction="row" spacing={10} mt={10} justifyContent="flex-end">
          {currQuestionNo !== 0 &&
            <Button colorScheme="orange" variant="solid" onClick={onClickPreviousQuestion}>
              Previous question
          </Button>}

          {currQuestionNo !== questions.length - 1 &&
            <Button colorScheme="green" onClick={onClickNextQuestion}>
              Next question
          </Button>}
        </Stack>

      </Box>
    );
  };

  const renderMultipleChoiceAnswers = (q) => {
    const studentAnswer = getStudentAnswerToCurrentQuestion();

    return (
      <Box my={5}>
        <RadioGroup onChange={onChangeMultipleChoice} value={studentAnswer[0]}>
          <Stack direction="column">
            {q.possible_answers.map(ans => <Radio key={ans.id} value={ans.id.toString()}>{ans.text}</Radio>)}
          </Stack>
        </RadioGroup>
      </Box>
    );
  };

  const onChangeMultipleChoice = (e) => {
    const updatedAnswers = studentSubmission.answers.map(ansObj => (ansObj.question_id === questions[currQuestionNo].question_id) ? { ...ansObj, student_answers: [e] } : ansObj);
    setStudentSubmission({ ...studentSubmission, answers: updatedAnswers });
  };

  const renderShortAnswerAnswers = (q) => {
    const studentAnswer = getStudentAnswerToCurrentQuestion();
    const displayedAnswer = studentAnswer.length > 0 ? studentAnswer[0] : "";

    return (
      <Box my={5}>
        <Text mb={2} fontWeight="bold" color="gray.600">Enter your answer</Text>
        <Textarea onChange={onChangeShortAnswer} value={displayedAnswer} />
      </Box>
    );
  };

  const onChangeShortAnswer = (e) => {
    const updatedAnswers = studentSubmission.answers.map(ansObj => (ansObj.question_id === questions[currQuestionNo].question_id) ? { ...ansObj, student_answers: [e.target.value] } : ansObj);
    setStudentSubmission({ ...studentSubmission, answers: updatedAnswers });
  };

  const renderCheckboxAnswers = (q) => {
    const studentAnswer = getStudentAnswerToCurrentQuestion();

    return (
      <Box my={5}>
        <CheckboxGroup colorScheme="green" value={studentAnswer}>
          <Stack direction="column">
            {q.possible_answers.map(ans => <Checkbox key={ans.id} value={ans.id.toString()} onChange={onChangeCheckboxAnswer(ans.id)}>{ans.text}</Checkbox>)}
          </Stack>
        </CheckboxGroup>
      </Box>
    );
  };

  const onChangeCheckboxAnswer = (idx) => (e) => {
    let updatedAnswersForQuestion = [];

    const foundAnswer = studentSubmission?.answers?.find(ansObj => ansObj.question_id === questions[currQuestionNo].question_id);

    if (foundAnswer && foundAnswer.student_answers.length > 0) {
      foundAnswer.student_answers.forEach(ans => {
        updatedAnswersForQuestion.push(ans);
      });
    }

    const newAnswer = idx.toString();
    const isAlreadySelected = updatedAnswersForQuestion.includes(newAnswer);

    if (e.target.checked && !isAlreadySelected) {
      // Add in new selected answer
      updatedAnswersForQuestion = updatedAnswersForQuestion.concat([newAnswer]);

      const updatedAnswers = studentSubmission.answers.map(ansObj => (ansObj.question_id === questions[currQuestionNo].question_id) ? { ...ansObj, student_answers: updatedAnswersForQuestion } : ansObj);
      setStudentSubmission({ ...studentSubmission, answers: updatedAnswers });
    }
    else if (!e.target.checked && isAlreadySelected) {
      // Remove unselected answer
      updatedAnswersForQuestion.pop(newAnswer);

      const updatedAnswers = studentSubmission.answers.map(ansObj => (ansObj.question_id === questions[currQuestionNo].question_id) ? { ...ansObj, student_answers: updatedAnswersForQuestion } : ansObj);
      setStudentSubmission({ ...studentSubmission, answers: updatedAnswers });
    }
  };

  const updateAnswerToCurrentQuestion = () => {
    // Update answer to current question in studentSubmission
    const updatedAnswers = studentSubmission.answers.map(ansObj => (ansObj.question_id === questions[currQuestionNo].question_id) ? { ...ansObj, student_answers: selectedAnswers } : ansObj);
    setStudentSubmission({ ...studentSubmission, answers: updatedAnswers });
  };

  const getStudentAnswerToCurrentQuestion = () => {
    let studentAnswers = [];
    console.log("Current q_id: " + questions[currQuestionNo]?.question_id);
    console.log(studentSubmission.answers);
    const foundAnswer = studentSubmission?.answers?.find(ansObj => +ansObj.question_id === +questions[currQuestionNo].question_id);
    console.log("ANSWER: ");
    console.log(foundAnswer);
    if (foundAnswer && foundAnswer.student_answers.length > 0) {
      console.log("valid found answer");
      studentAnswers = [...foundAnswer.student_answers];
    }


    return studentAnswers;
  };

  const onClickPreviousQuestion = () => {
    // Update answer in studentSubmission
    // updateAnswerToCurrentQuestion();

    // Update current question number
    if ((currQuestionNo - 1) < 0) {
      setCurrQuestionNo(0);
    }
    else {
      setCurrQuestionNo(currQuestionNo - 1);
    }

    // Update selectedAnswers with answers to the new current question
    // const studentAnswerToCurrQuestion = getStudentAnswerToCurrentQuestion();
    // setSelectedAnswers(studentAnswerToCurrQuestion);
  };

  const onClickNextQuestion = () => {
    // Update answer in studentSubmission
    // updateAnswerToCurrentQuestion();

    // Update current question number
    if ((currQuestionNo + 1) >= questions.length) {
      setCurrQuestionNo(questions.length - 1);
    }
    else {
      setCurrQuestionNo(currQuestionNo + 1);
    }

    // Update selectedAnswers with answers to the new current question
    // const studentAnswerToCurrQuestion = getStudentAnswerToCurrentQuestion();
    // setSelectedAnswers(studentAnswerToCurrQuestion);
  };

  const onClickSubmitAnswers = () => {
    console.log("Submitting answers....");
    // TODO: Add message indicating there are unanswered questions - "Are you sure?"

    // TODO: POST request to submit studentSubmission
  };

  const renderQuestionStatusBox = (qs, index) => {
    const answerAttempt = studentSubmission?.answers?.find(ansObj => ansObj.question_id === qs.question_id);
    // Considers case for Short Answer attempt where answer is empty string or all whitespaces
    const isValidFirstAnswer = true; //!answerAttempt?.student_answers[0].match(/^ *$/);
    const hasAttemptedQuestion = (answerAttempt?.student_answers.length > 0 && isValidFirstAnswer);

    return (
      <VStack w={8} h={12} spacing={0.1} borderRadius="md" bgColor={hasAttemptedQuestion ? "green.400" : "blue.400"}>
        <Text>{index}</Text>
        <Icon as={hasAttemptedQuestion ? TiTick : BiQuestionMark} color="white" />
      </VStack>
    );
  };

  const viewClickedQuestion = (qNumber) => {
    setCurrQuestionNo(qNumber);
  };

  const printStudentSubmissionAnswers = () => {
    console.log("---- Student submission ------");
    console.log(studentSubmission);
    console.log("--------------");

    return (
      <Box>

      </Box>
    );
  };

  const startTimer = () => {
    // TODO: Send POST request to make new student attempt with current time as start time

    // Get current time 

  };

  return (
    <Flex mt="10">
      <Box flex="0.7" pt={10} px={10}>
        <Heading size="md">Quiz progression</Heading>
        <Text mt={3}>The icons below represent the answer status to the questions. </Text>
        <Text>
          Those in blue with a question mark indicates the question hasn't been attempted yet and those
          in green with a tick indicate attempted questions.
        </Text>
        {/* TODO: Uncomment this when able to figure out render questions status box */}
        <Stack direction="row" mt={5} h="40%" p={4} border="1px" borderRadius="md" borderColor="gray.400">
          {questions.map((qs, index) => <Box key={index} onClick={() => viewClickedQuestion(index)}>{renderQuestionStatusBox(qs, index + 1)}</Box>)}
          {/* <Box>{renderQuestionStatusBox(questions[0], 1)}</Box>
          <Box>{renderQuestionStatusBox(questions[0], 2)}</Box>
          <Box>{renderQuestionStatusBox(questions[0], 3)}</Box> */}
        </Stack>

        <Box mt={10}>
          <Button colorScheme="blue" onClick={onOpen}>Submit answers</Button>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Submit answer</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>Are you sure you want to submit?</Text>
                <br></br>
                <Text>You will not be able to edit your answers after submitting.</Text>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Submit
              </Button>
                <Button variant="ghost" onClick={() => { onClose(); onClickSubmitAnswers(); }}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </Box>
      <Box flex="0.1" borderLeft="1px" borderColor="gray.400" height="890px" />
      <Box flex="3">
        {questions.length > 0 && renderQuestion(questions[currQuestionNo], currQuestionNo + 1)}
        {/* {getStudentAnswerToCurrentQuestion()?.map(a => <Text key={a}>{a}</Text>)} */}
      </Box>
      {printStudentSubmissionAnswers()}

      <Box>
        <Button variant="ghost" onClick={startTimer}>Start Timer</Button>
      </Box>
    </Flex>

  );
}

