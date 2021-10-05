import React, { useState, useEffect } from 'react'
import { SmallCloseIcon, WarningIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Center,
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  Heading,
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
  VStack
} from "@chakra-ui/react"
import { AddIcon, QuestionOutlineIcon } from "@chakra-ui/icons"

import './QuestionCreation.css'
import "react-datepicker/dist/react-datepicker.css";

// GET /quizzes
const quizzes = {
  quiz1: {
    id: 1,
    name: "Quiz1",
    open_date: "2016-06-22 19:10:25-07",
    close_date: "2016-06-22 19:10:25-07",
    time_given: 45,
    num_questions: 3,
  },
  quiz2: {
    id: 2,
    name: "Quiz2",
    open_date: "2016-06-22 19:10:25-07",
    close_date: "2016-06-22 19:10:25-07",
    time_given: 45,
    num_questions: 3,
  },
};

// POST /quiz
const sampleQuiz = {
  name: "SampleQuiz",
  open_date: "2016-06-22 19:10:25-07",
  close_date: "2016-06-22 19:10:25-07",
  time_given: 45,
  num_questions: 2,
  questions: [
    {
      question_text: "Question text",
      question_type: "mc", // sa, cb
      marks_awarded: 3,
      related_topic_id: 10, // Obtained via GET /topics
      answers: [
        {
          answer_text: "answer1",
          is_correct: true,
          explanation: ""
        },
        {
          answer_text: "answer2",
          is_correct: false,
          explanation: ""
        },
        {
          answer_text: "answer3",
          is_correct: false,
          explanation: ""
        },
        {
          answer_text: "answer4",
          is_correct: false,
          explanation: ""
        },
      ]
    },
    {
      question_text: "Question text",
      question_type: "cb",
      marks_awarded: 1,
      related_topic_id: 1,
      answers: [ // can have multiple answers correct
        {
          answer_text: "cb1",
          is_correct: true,
          explanation: ""
        },
        {
          answer_text: "cb2",
          is_correct: true,
          explanation: ""
        },
        {
          answer_text: "cb3",
          is_correct: false,
          explanation: ""
        },
      ]
    }
  ]
}

function generateNewQuestion() {
  return {
    question_text: "",
    question_type: "mc", // sa, cb
    marks_awarded: 0,
    related_topic_id: 0, // Obtained via GET /topics
    answers: [
      {
        answer_text: "answer1",
        is_correct: true,
        explanation: ""
      },
      {
        answer_text: "answer2",
        is_correct: false,
        explanation: ""
      },
    ],
    is_expanded: false,
    add_to_question_bank: false,
  }
};

const API_URL = "http://localhost:8000";

export default function QuestionCreation({ addQuestionToQuiz, topics, isCreatingQuestion, addToQuestionBank }) {
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("mc");
  const [relatedTopicId, setRelatedTopicId] = useState("0");
  const [newQuestion, setNewQuestion] = useState({});
  const [isValidQuestion, setIsValidQuestion] = useState(true);
  const [isNewQuestion, setIsNewQuestion] = useState(true);

  useEffect(() => {
    // Generate new question
    const newQuestionTemplate = generateNewQuestion();
    setNewQuestion(newQuestionTemplate);

    setIsNewQuestion(isCreatingQuestion);
  }, []);

  const generateNewAnswer = () => {
    return {
      answer_text: "new_answer",
      is_correct: false,
      explanation: ""
    }
  }

  const renderNewQuestionEntry = () => {
    return (
      <Box>
        <Box mt="3">
          <Text fontWeight="bold" color="gray.600">Question text: </Text>
          <Textarea size="md" placeholder="Enter question" onChange={onChangeQuestionText} value={newQuestion.question_text} />
        </Box>

        <HStack my="2">
          <Text fontWeight="bold" color="gray.600">Marks awarded: </Text>
          <NumberInput size="sm" maxW={16} min={0} onChange={onChangeMarksAwarded} value={newQuestion.marks_awarded}>
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
            <Select size="sm" defaultValue="0" onChange={onChangeRelatedTopicId} value={newQuestion.related_topic_id}>
              {topics?.map((t, i) => <option key={i} value={i}>{t}</option>)}
            </Select>
          </Box>
        </HStack>

        <HStack my="2">
          <Text mb="1" fontWeight="bold" color="gray.600">Question type:</Text>
          <Box>
            <Select size="sm" defaultValue="mc" onChange={onChangeQuestionType} value={newQuestion.question_type}>
              <option value="mc">Multiple choice</option>
              <option value="sa">Short answer</option>
              <option value="cb">Checkboxes</option>
            </Select>
          </Box>
        </HStack>

        {renderPossibleAnswers(newQuestion)}

        <HStack spacing={3} mt={5}>
          <Checkbox onChange={onChangeAddToQuestionBank}>Add to Question Bank</Checkbox>
          <QuestionOutlineIcon color="blue" />
        </HStack>
      </Box>
    );
  };

  const onChangeAddToQuestionBank = (e) => {
    setNewQuestion({ ...newQuestion, add_to_question_bank: e.target.checked });
  };

  const onChangeMarksAwarded = (newValue) => {
    setNewQuestion({ ...newQuestion, marks_awarded: +newValue });
  };

  const onChangeRelatedTopicId = (e) => {
    setNewQuestion({ ...newQuestion, related_topic_id: +e.target.value });
  };

  const getDefaultAnswers = () => {
    let defaultAnswers = [];

    // Reset answers based on question type
    if (questionType === "mc") {
      defaultAnswers = [
        {
          id: 1,
          answer_text: "answer1",
          is_correct: true,
          explanation: ""
        },
        {
          id: 2,
          answer_text: "answer2",
          is_correct: false,
          explanation: ""
        },
      ];
    }
    else if (questionType === "sa") {
      defaultAnswers = [
        {
          id: 1,
          answer_text: "",
          is_correct: true,
          explanation: ""
        }
      ];
    }
    else if (questionType === "cb") {
      defaultAnswers = [
        {
          id: 1,
          answer_text: "answer1",
          is_correct: true,
          explanation: ""
        },
        {
          id: 2,
          answer_text: "answer2",
          is_correct: false,
          explanation: ""
        },
        {
          id: 3,
          answer_text: "answer3",
          is_correct: false,
          explanation: ""
        },
      ];
    }

    return defaultAnswers;
  };

  const onChangeQuestionType = (e) => {
    const defaultAnswers = getDefaultAnswers();
    setNewQuestion({ ...newQuestion, question_type: e.target.value, answers: defaultAnswers });
  };

  const onChangeQuestionText = (e) => {
    setNewQuestion({ ...newQuestion, question_text: e.target.value });
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
    if (newQuestion.question_type === "mc") {
      let foundCorrectAnswerIndex = newQuestion.answers.findIndex(a => a.is_correct);
      return foundCorrectAnswerIndex.toString();
    }

    if (newQuestion.question_type === "sa") {
      const suggestedAnswer = (newQuestion.answers.length > 0) ? newQuestion.answers[0].answer_text : "";
      return suggestedAnswer;
    }

    if (newQuestion.question_type === "cb") {
      let correctAnswers = [];
      newQuestion.answers.forEach((answer, index) => {
        if (answer.is_correct) {
          correctAnswers.push(index.toString());
        }
      });

      return correctAnswers;
    }

    return [""];
  };

  const onChangeRadioAnswer = (e) => {
    const newAnswers = newQuestion.answers.map((answer, index) => (index === +e) ? { ...answer, is_correct: true } : { ...answer, is_correct: false });
    setNewQuestion({ ...newQuestion, answers: newAnswers });
  };

  const onChangeShortAnswer = (e) => {
    const newAnswers = newQuestion.answers.map((answer, index) => (index === 0) ? { ...answer, answer_text: e.target.value } : { ...answer, is_correct: false });
    setNewQuestion({ ...newQuestion, answers: newAnswers });
  };

  const onChangeCheckboxAnswer = (idx) => (e) => {
    const newAnswers = newQuestion.answers.map((answer, index) => (index === idx) ? { ...answer, is_correct: e.target.checked } : answer);
    setNewQuestion({ ...newQuestion, answers: newAnswers });
  };

  const onChangeAnswerText = (idx) => (e) => {
    const newAnswers = newQuestion.answers.map((answer, index) => (index === idx) ? { ...answer, answer_text: e.target.value } : answer);
    setNewQuestion({ ...newQuestion, answers: newAnswers });
  };

  const onClickAddExplanation = (idx) => {
    // TODO: Open up explanation textarea box to edit and cancel/save
  };

  const renderPossibleAnswers = (question) => {
    if (question.question_type === "mc") {
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
                      value={ans.answer_text}
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
    else if (question.question_type === "sa") {
      // Text box
      return (
        <Box mt={5}>
          <Text mb={2} fontWeight="bold" color="gray.600">Enter a possible correct answer</Text>
          <Textarea onChange={onChangeShortAnswer} value={getCorrectAnswers()} />
        </Box>
      );
    }
    else if (question.question_type === "cb") {
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
                      <Checkbox key={i} value={i} isChecked={ans.is_correct} onChange={onChangeCheckboxAnswer(+i)} />
                    </InputLeftElement>
                    <Input
                      pl="2.5rem"
                      value={ans.answer_text}
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
      if (ans.is_correct) {
        correctAnswersList.push(ans.answer_text);
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
    const correctAnswerExists = (ans) => ans.is_correct && ans.answer_text !== "";
    const hasSetCorrectAnswers = newQuestion.answers.some(correctAnswerExists);
    const isValidQuestionText = newQuestion.question_text !== "";

    if (!hasSetCorrectAnswers || !isValidQuestionText) {
      // TODO: Render user-friendly error message when not valid
      setIsValidQuestion(false);
      return;
    }

    setIsValidQuestion(true);

    if (newQuestion.add_to_question_bank) {
      // Add question to question bank
      addToQuestionBank(newQuestion);
    }

    addQuestionToQuiz(newQuestion);
  }

  return (
    <Box>
      {renderNewQuestionEntry()}

      {!isValidQuestion && printInvalidQuestionError()}

      <Box d="flex" justifyContent="flex-end" mt="6">
        {/* {newQuestion.question_type !== "sa" && <Button colorScheme="orange" variant="solid" mr="8" onClick={addPossibleAnswer}>Add new answer</Button>} */}
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