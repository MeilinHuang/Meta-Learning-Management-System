import React, { useState, useEffect } from 'react'
import { WarningIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Center,
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react"
import { AddIcon, QuestionOutlineIcon } from "@chakra-ui/icons"

import './QuestionCreation.css'
import "react-datepicker/dist/react-datepicker.css";

// GET /quizzes
const quizzes = {
  quiz1: {
    id: 1,
    name: "Quiz1",
    openDate: "2016-06-22 19:10:25-07",
    closeDate: "2016-06-22 19:10:25-07",
    timeGiven: 45,
    numQuestions: 3,
  },
  quiz2: {
    id: 2,
    name: "Quiz2",
    openDate: "2016-06-22 19:10:25-07",
    closeDate: "2016-06-22 19:10:25-07",
    timeGiven: 45,
    numQuestions: 3,
  },
};

// POST /quiz
const sampleQuiz = {
  name: "SampleQuiz",
  openDate: "2016-06-22 19:10:25-07",
  closeDate: "2016-06-22 19:10:25-07",
  timeGiven: 45,
  numQuestions: 2,
  questions: [
    {
      questionText: "Question text",
      questionType: "mc", // sa, cb
      marksAwarded: 3,
      topicId: 10, // Obtained via GET /topics
      answers: [
        {
          answerText: "answer1",
          isCorrect: true,
          explanation: ""
        },
        {
          answerText: "answer2",
          isCorrect: false,
          explanation: ""
        },
        {
          answerText: "answer3",
          isCorrect: false,
          explanation: ""
        },
        {
          answerText: "answer4",
          isCorrect: false,
          explanation: ""
        },
      ]
    },
    {
      questionText: "Question text",
      questionType: "cb",
      marksAwarded: 1,
      topicId: 1,
      answers: [ // can have multiple answers correct
        {
          answerText: "cb1",
          isCorrect: true,
          explanation: ""
        },
        {
          answerText: "cb2",
          isCorrect: true,
          explanation: ""
        },
        {
          answerText: "cb3",
          isCorrect: false,
          explanation: ""
        },
      ]
    }
  ]
}


const API_URL = "http://localhost:8000";

export default function QuestionCreation({ addQuestionToQuiz, topics, isCreatingQuestion, addToQuestionBank }) {
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("mc");
  const [newQuestion, setNewQuestion] = useState({});
  const [isValidQuestion, setIsValidQuestion] = useState(true);
  const [isNewQuestion, setIsNewQuestion] = useState(true);

  useEffect(() => {
    // Generate new question
    const newQuestionTemplate = generateNewQuestion();
    setNewQuestion(newQuestionTemplate);

    setIsNewQuestion(isCreatingQuestion);
  }, []);

  const generateNewQuestion = () => {
    return {
      questionText: "",
      questionType: "mc", // sa, cb
      marksAwarded: 0,
      topicId: topics[0].id, // Obtained via GET /topics
      answers: [
        {
          answerText: "answer1",
          isCorrect: true,
          explanation: ""
        },
        {
          answerText: "answer2",
          isCorrect: false,
          explanation: ""
        },
      ],
      isExpanded: false,
      shouldAddToQuestionBank: true,
    }
  };

  const generateNewAnswer = () => {
    return {
      answerText: "new answer",
      isCorrect: false,
      explanation: ""
    }
  }

  const renderNewQuestionEntry = () => {
    return (
      <Box>
        <Box mt="3">
          <Text fontWeight="bold" color="gray.600">Question text: </Text>
          <Textarea size="md" placeholder="Enter question" onChange={onChangeQuestionText} value={newQuestion.questionText} />
        </Box>

        <HStack my="2">
          <Text fontWeight="bold" color="gray.600">Marks awarded: </Text>
          <NumberInput size="sm" maxW={16} min={0} onChange={onChangeMarksAwarded} value={newQuestion.marksAwarded}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </HStack>

        <HStack my="2">
          <Text fontWeight="bold" color="gray.600">Related topic: </Text>
          {/* TODO: Replace values with backend GET /topics */}
          <Box>
            <Select size="sm" defaultValue="1" onChange={onChangeRelatedTopicId} value={newQuestion.topicId}>
              {topics?.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </Select>
          </Box>
        </HStack>

        <HStack my="2">
          <Text mb="1" fontWeight="bold" color="gray.600">Question type:</Text>
          <Box>
            <Select size="sm" defaultValue="mc" onChange={onChangeQuestionType} value={newQuestion.questionType}>
              <option value="mc">Multiple choice</option>
              <option value="sa">Short answer</option>
              <option value="cb">Checkboxes</option>
            </Select>
          </Box>
        </HStack>

        {renderPossibleAnswers(newQuestion)}

        <HStack spacing={3} mt={5}>
          <Checkbox isChecked={newQuestion.shouldAddToQuestionBank} onChange={onChangeAddToQuestionBank}>Add to Question Bank</Checkbox>
          <QuestionOutlineIcon color="blue" />
        </HStack>
      </Box>
    );
  };

  const onChangeAddToQuestionBank = (e) => {
    setNewQuestion({ ...newQuestion, shouldAddToQuestionBank: e.target.checked });
  };

  const onChangeMarksAwarded = (newValue) => {
    setNewQuestion({ ...newQuestion, marksAwarded: +newValue });
  };

  const onChangeRelatedTopicId = (e) => {
    setNewQuestion({ ...newQuestion, topicId: +e.target.value });
  };

  const getDefaultAnswers = () => {
    let defaultAnswers = [];

    // Reset answers based on question type
    if (questionType === "mc") {
      defaultAnswers = [
        {
          id: 1,
          answerText: "answer1",
          isCorrect: true,
          explanation: ""
        },
        {
          id: 2,
          answerText: "answer2",
          isCorrect: false,
          explanation: ""
        },
      ];
    }
    else if (questionType === "sa") {
      defaultAnswers = [
        {
          id: 1,
          answerText: "",
          isCorrect: true,
          explanation: ""
        }
      ];
    }
    else if (questionType === "cb") {
      defaultAnswers = [
        {
          id: 1,
          answerText: "answer1",
          isCorrect: true,
          explanation: ""
        },
        {
          id: 2,
          answerText: "answer2",
          isCorrect: false,
          explanation: ""
        },
        {
          id: 3,
          answerText: "answer3",
          isCorrect: false,
          explanation: ""
        },
      ];
    }

    return defaultAnswers;
  };

  const onChangeQuestionType = (e) => {
    const defaultAnswers = getDefaultAnswers();
    setNewQuestion({ ...newQuestion, questionType: e.target.value, answers: defaultAnswers });
  };

  const onChangeQuestionText = (e) => {
    setNewQuestion({ ...newQuestion, questionText: e.target.value });
  };

  const addPossibleAnswer = () => {
    const newAns = generateNewAnswer();
    const newAnsList = newQuestion.answers.concat(newAns);

    setNewQuestion({ ...newQuestion, answers: newAnsList });
  };

  const createNewQuestion = () => {
    // Create new question and setNewQuestion(newQuestion)

    // Render new question onto screen 
  };

  const deletePossibleAnswer = (idx) => {
    const updatedPossibleAnswers = newQuestion.answers.filter((answer, index) => index !== idx);

    setNewQuestion({ ...newQuestion, answers: updatedPossibleAnswers });
  };

  const deleteQuestionEntry = () => {

  };

  const renderQuestionText = () => {
    return <Textarea placeholder="Enter question" onChange={(e) => setQuestionText(e.target.value)} value={questionText} />
  };

  const getCorrectAnswers = () => {
    if (newQuestion.questionType === "mc") {
      let foundCorrectAnswerIndex = newQuestion.answers.findIndex(a => a.isCorrect);
      return foundCorrectAnswerIndex.toString();
    }

    if (newQuestion.questionType === "sa") {
      const suggestedAnswer = (newQuestion.answers.length > 0) ? newQuestion.answers[0].answerText : "";
      return suggestedAnswer;
    }

    if (newQuestion.questionType === "cb") {
      let correctAnswers = [];
      newQuestion.answers.forEach((answer, index) => {
        if (answer.isCorrect) {
          correctAnswers.push(index.toString());
        }
      });

      return correctAnswers;
    }

    return [""];
  };

  const onChangeRadioAnswer = (e) => {
    const newAnswers = newQuestion.answers.map((answer, index) => (index === +e) ? { ...answer, isCorrect: true } : { ...answer, isCorrect: false });
    setNewQuestion({ ...newQuestion, answers: newAnswers });
  };

  const onChangeShortAnswer = (e) => {
    const newAnswers = newQuestion.answers.map((answer, index) => (index === 0) ? { ...answer, answerText: e.target.value } : { ...answer, isCorrect: false });
    setNewQuestion({ ...newQuestion, answers: newAnswers });
  };

  const onChangeCheckboxAnswer = (idx) => (e) => {
    const newAnswers = newQuestion.answers.map((answer, index) => (index === idx) ? { ...answer, isCorrect: e.target.checked } : answer);
    setNewQuestion({ ...newQuestion, answers: newAnswers });
  };

  const onChangeAnswerText = (idx) => (e) => {
    const newAnswers = newQuestion.answers.map((answer, index) => (index === idx) ? { ...answer, answerText: e.target.value } : answer);
    setNewQuestion({ ...newQuestion, answers: newAnswers });
  };

  const onClickAddExplanation = (idx) => {
    // TODO: Open up explanation textarea box to edit and cancel/save
  };

  const renderPossibleAnswers = (question) => {
    if (question.questionType === "mc") {
      return (
        <Box mt={5}>
          <HStack mb={2} spacing={5}>
            <Text fontWeight="bold" color="gray.600">Answers (select the correct answer)</Text>
            <Button leftIcon={<AddIcon />} size="xs" colorScheme="green" variant="solid" onClick={addPossibleAnswer}>
              Add new answer
            </Button>
          </HStack>
          <RadioGroup mt="1" onChange={onChangeRadioAnswer} value={getCorrectAnswers()}>
            <Stack>
              {Object.entries(question.answers).map(([i, ans]) =>
                <FormControl isInvalid={!ans} mb={1} key={i}>
                  <InputGroup>
                    <InputLeftElement px={4} width="2.5rem">
                      <Radio value={i} />
                    </InputLeftElement>
                    <Input
                      pl="2.5rem"
                      value={ans.answerText}
                      onChange={onChangeAnswerText(+i)}
                    />
                    <InputRightElement width="15rem" zIndex="0">
                      <Box d="flex">
                        <Button
                          colorScheme="blue"
                          variant="outline"
                          size="sm"
                          height="1.75rem"
                          mr="3"
                          onClick={() => onClickAddExplanation(+i)}
                        // isDisabled={question.answers.length <= 2}
                        >
                          Add explanation
                        </Button>
                        <Button
                          colorScheme="red"
                          variant="outline"
                          size="sm"
                          height="1.75rem"
                          onClick={() => deletePossibleAnswer(+i)}
                        // isDisabled={question.answers.length <= 2}
                        >
                          Delete
                        </Button>
                      </Box>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              )}
            </Stack>
          </RadioGroup>
        </Box>
      );
    }
    else if (question.questionType === "sa") {
      // Text box
      return (
        <Box mt={5}>
          <Text mb={2} fontWeight="bold" color="gray.600">Enter a possible correct answer</Text>
          <Textarea onChange={onChangeShortAnswer} value={getCorrectAnswers()} />
        </Box>
      );
    }
    else if (question.questionType === "cb") {
      // Checkboxes
      // Loop through list of possible answers

      return (
        <Box mt={5}>
          <HStack mb={2} spacing={5}>
            <Text fontWeight="bold" color="gray.600">Answers (select the correct answer/s) </Text>
            <Button leftIcon={<AddIcon />} size="xs" colorScheme="green" variant="solid" onClick={addPossibleAnswer}>
              Add new answer
            </Button>
          </HStack>

          <CheckboxGroup mt="1" colorScheme="green" defaultValue={getCorrectAnswers()}>
            <Stack>
              {Object.entries(question.answers).map(([i, ans]) =>
                <FormControl isInvalid={!ans} key={i}>
                  <InputGroup>
                    <InputLeftElement px={4} width="2.5rem">
                      <Checkbox key={i} value={i} isChecked={ans.isCorrect} onChange={onChangeCheckboxAnswer(+i)} />
                    </InputLeftElement>
                    <Input
                      pl="2.5rem"
                      value={ans.answerText}
                      onChange={onChangeAnswerText(+i)}
                    />
                    <InputRightElement width="15rem" zIndex="0">
                      <Box d="flex">
                        <Button
                          colorScheme="blue"
                          variant="outline"
                          size="sm"
                          height="1.75rem"
                          mr="3"
                          onClick={() => onClickAddExplanation(+i)}
                        // isDisabled={question.answers.length <= 2}
                        >
                          Add explanation
                          </Button>
                        <Button
                          colorScheme="red"
                          variant="outline"
                          size="sm"
                          height="1.75rem"
                          onClick={() => deletePossibleAnswer(+i)}
                        // isDisabled={question.answers.length <= 2}
                        >
                          Delete
                          </Button>
                      </Box>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              )}
            </Stack>
          </CheckboxGroup>
        </Box>
      );
    }

    return (<Text color="gray.600">Possible answers were not fetched properly</Text>);
  };

  const resetQuestionFields = () => {
    // TODO: Fix this
    const defaultAnswers = getDefaultAnswers();
    setNewQuestion({ ...newQuestion, answers: defaultAnswers });
  };

  const printCorrectAnswers = () => {
    const correctAnswersList = [];

    newQuestion?.answers?.forEach(ans => {
      if (ans.isCorrect) {
        correctAnswersList.push(ans.answerText);
      }
    });

    return correctAnswersList.toString();
  };

  const printInvalidQuestionError = () => {
    return (
      <Flex mt="3" pb="1" borderWidth="1px" borderRadius="lg" bgColor="red.100">
        <Center mx="3">
          <WarningIcon w={5} h={5} color="red.500" />
        </Center>
        <Text mt="3" color="red">Question was not added to quiz - question text is empty or a correct answer was not set.</Text>
      </Flex>
    );
  }

  const checkQuestionValidity = () => {
    // TODO: Check if correct answer/s has been selected
    const correctAnswerExists = (ans) => ans.isCorrect && ans.answerText !== "";
    const hasSetCorrectAnswers = newQuestion.answers.some(correctAnswerExists);
    const isValidQuestionText = newQuestion.questionText !== "";

    if (!hasSetCorrectAnswers || !isValidQuestionText) {
      // TODO: Render user-friendly error message when not valid
      setIsValidQuestion(false);
      return;
    }

    setIsValidQuestion(true);

    if (newQuestion.shouldAddToQuestionBank) {
      // Add question to question bank
      addToQuestionBank(newQuestion);
    }

    console.log("NEW QUESTION TOPIC ID: " + newQuestion.topicId);
    addQuestionToQuiz(newQuestion);
  }

  return (
    <Box>
      {renderNewQuestionEntry()}

      {!isValidQuestion && printInvalidQuestionError()}

      <Box d="flex" justifyContent="flex-end" mt="6">
        {/* {newQuestion.questionType !== "sa" && <Button colorScheme="orange" variant="solid" mr="8" onClick={addPossibleAnswer}>Add new answer</Button>} */}
        {/* <Button colorScheme="blue" variant="solid" mr="8" onClick={resetQuestionFields}>Reset fields</Button> */}

        {isNewQuestion && <Button colorScheme="teal" variant="solid" onClick={checkQuestionValidity}>Add to quiz</Button>}
      </Box>

      {/* <p style={{ color: "red" }}>Correct answer will be: </p> */}
      {/* {printCorrectAnswers()} */}

      {/* <Heading>Questions</Heading> */}
      {/* {renderQuiz()} */}
    </Box>
  );
}