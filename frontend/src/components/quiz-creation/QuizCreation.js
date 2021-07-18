import React, { useState, useEffect } from 'react'
import { SmallCloseIcon } from '@chakra-ui/icons'
import { 
          Box,
          Button,
          Checkbox, 
          CheckboxGroup, 
          FormControl,
          FormErrorIcon,
          FormErrorMessage,
          FormLabel,
          Heading,
          Input,
          InputGroup,
          InputLeftElement, 
          InputRightElement,
          Radio, 
          RadioGroup, 
          Select, 
          Stack,
          Text, 
          Textarea 
        } from "@chakra-ui/react"

import './QuizCreation.css'

// GET /quizzes
const quizzes = {
  quiz1: {
    id: 1,
    name: "Quiz1",
    due_date: "2016-06-22 19:10:25-07",
    time_given: 45,
    num_questions: 3,
  },
  quiz2: {
    id: 2,
    name: "Quiz2",
    due_date: "2016-06-22 19:10:25-07",
    time_given: 45,
    num_questions: 3,
  },
};

// GET /quiz/:quizId
// [Student] Used for answering a question 
const getQuizWithId = {
  quiz1: {
    id: 1,
    name: "Quiz1",
    due_date: "2016-06-22 19:10:25-07",
    time_given: 45,
    num_questions: 3,
    questions: [
      {
        question_bank_id: 12,
        question_text: "Question text",
        question_type: "mc", // sa, cb
        marks_awarded: 3,
        related_topic_id: 10,
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
        question_bank_id: 12,
        question_text: "Question text",
        question_type: "mc", // sa, cb
        marks_awarded: 3,
        related_topic_id: 10,
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
        question_bank_id: 12,
        question_text: "Question text",
        question_type: "mc", // sa, cb
        marks_awarded: 3,
        related_topic_id: 10,
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
      }
    ]
  },
  quiz2: {
    id: 2,
    name: "Quiz2",
    due_date: "2016-06-22 19:10:25-07",
    time_given: 45,
    num_questions: 3,
    questions: [
      {
        question_bank_id: 12,
        question_text: "Question text",
        question_type: "mc", // sa, cb
        marks_awarded: 3,
        related_topic_id: 10,
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
        question_bank_id: 12,
        question_text: "Question text",
        question_type: "mc", // sa, cb
        marks_awarded: 3,
        related_topic_id: 10,
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
        question_bank_id: 12,
        question_text: "Question text",
        question_type: "mc", // sa, cb
        marks_awarded: 3,
        related_topic_id: 10,
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
      }
    ]
  },
};


// POST /quiz
const sampleQuiz = {
  name: "SampleQuiz",
  due_date: "2016-06-22 19:10:25-07",
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

function generateNewQuiz() {
  return {
    name: "New Quiz",
    due_date: "2021-07-30 12:00:00-00",
    time_given: 30,
    num_questions: 0,
    questions: [
    ]
  }
};

function generateNewQuestion() {
  return {
    question_text: "",
    question_type: "mc", // sa, cb
    marks_awarded: 0,
    related_topic_id: 0, // Obtained via GET /topics
    answers: [
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
    ]
  }
};

const API_URL = "http://localhost:8000";

export default function QuizCreation() {
  // const [questionNumber, setQuestionNumber] = useState(1);
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("mc");
  const [correctAnswers, setCorrectAnswers] = useState([""]); // can be one or multiple answers
  const [quiz, setQuiz] = useState({}); // list of dictionaries [{}, {}, ...]
  const [newQuestion, setNewQuestion] = useState({});
  const [testValue, setTestValue] = useState("");
  const [isValidQuestion, setIsValidQuestion] = useState(true);

  useEffect(() => {
    // Generate new quiz
    const newQuizTemplate = generateNewQuiz();
    setQuiz(newQuizTemplate);

    // Generate new question
    const newQuestionTemplate = generateNewQuestion();
    setNewQuestion(newQuestionTemplate);


  }, []);

  const generateNewAnswer = () => {
    // TODO: Change so ids aren't used anymore in newQuestion
    const ans_id = newQuestion.answers.length + 5;
  
    return {
      id: ans_id,
      answer_text: "new_answer",
      is_correct: false,
      explanation: ""
    }
  }

  const renderNewQuestionEntry = () => {
    return (
      <Box>
        <Heading>New Question</Heading>
        <Box display="inline-flex">
          <p>Question type:</p>
          <Select defaultValue="mc" onChange={onChangeQuestionType} value={newQuestion.question_type}>
            <option value="mc">Multiple choice</option>
            <option value="sa">Short answer</option>
            <option value="cb">Checkboxes</option>
          </Select>
        </Box>
        
        <Text>Question text: </Text>
        <Textarea placeholder="Enter question" onChange={onChangeQuestionText} value={newQuestion.question_text} />
        {renderPossibleAnswers(newQuestion)}
      </Box>
    );
  };

  const renderQuestionEntry = () => {
    return (
      <Box>
        <Heading>Question</Heading>
        <Box display="inline-flex">
          <p>Question type:</p>
          <Select defaultValue="Multiple choice" onChange={onChangeQuestionType} value={questionType}>
            <option value="Multiple choice">Multiple choice</option>
            <option value="Short answer">Short answer</option>
            <option value="Checkboxes">Checkboxes</option>
          </Select>
        </Box>
        
        <Text>Question: </Text>
        <Textarea placeholder="Enter question" onChange={(e) => setQuestionText(e.target.value)} value={questionText} />

      </Box>
    );
  };

  const renderQuizDetails = () => {
    return (
      <Box>        
        <Heading>Quiz Details</Heading>
        <Box display="inline-flex">
          <p>Name: </p>
          <Textarea placeholder="Enter quiz name" size="sm" onChange={(e) => setQuiz({ name: e.target.value })} value={quiz.name} />
        </Box>
        <p>Due date: {quiz.due_date}</p> {/*TODO: Add date-picker dropdown */}
        <p>Time given: {quiz.time_given}</p>
        <p>Number of questions: {quiz.num_questions}</p>
      </Box>
    );
  }

  const getDefaultAnswers = (questionType) => {
    let defaultAnswers = [];

    // Reset answers based on question type
    if (questionType === "mc")
    {
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
    else if (questionType === "sa")
    {
      defaultAnswers = [
        {
          id: 1,
          answer_text: "",
          is_correct: true,
          explanation: ""
        }
      ];
    }
    else if (questionType === "cb")
    {
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
    const defaultAnswers = getDefaultAnswers(e.target.value);

    setNewQuestion({ ...newQuestion, question_type: e.target.value, answers: defaultAnswers });
  };

  const onChangeQuestionText = (e) => {
    setNewQuestion({ ...newQuestion, question_text: e.target.value });
  };

  const addPossibleAnswer = () => {
    /*
    let newAnswers = newQuestion.answers.concat({
      id: newQuestion.answers.length + 1,
      answer_text: "new answer",
      is_correct: false,
      explanation: ""
    })
    */

    const newAns = generateNewAnswer();
    const newAnsList = newQuestion.answers.concat(newAns);

    setNewQuestion({ ...newQuestion, answers: newAnsList });
  };

  const addQuestionToQuiz = () => {
    // TODO: Check if correct answer/s has been selected
    const correctAnswerExists = (ans) => ans.is_correct;
    const hasSetCorrectAnswers = newQuestion.answers.some(correctAnswerExists);

    if (!hasSetCorrectAnswers)
    {
      // TODO: Render user-friendly error message when not valid
      setIsValidQuestion(false);
      return;
    }

    setIsValidQuestion(true);
    const updatedQuestions = quiz.questions.concat([newQuestion])

    setQuiz({ ...quiz, num_questions: quiz.num_questions + 1, questions: updatedQuestions});
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
    return (
      <>
      <Textarea placeholder="Enter question" onChange={(e) => setQuestionText(e.target.value)} value={questionText} />
      </>
    );
  };

  const handleChangeCorrectAnswers = () => {
    // Multiple choice & 

    // Short answer

    // Checkboxes
  };

  const handleChangeCorrectAnswer = (ans) => {

  };

  const getCorrectAnswers = () => {

    if (newQuestion.question_type === "mc")
    {
      // TODO
      let foundCorrectAnswerIndex = newQuestion.answers.findIndex(a => a.is_correct);
      console.log("Correct answers: " + foundCorrectAnswerIndex);
      return foundCorrectAnswerIndex.toString(); // TODO: Check why this works when it's not a list
    }
    else if (newQuestion.question_type === "sa")
    {
      if (newQuestion.answers.length > 0)
      {
        return newQuestion.answers[0].answer_text;
      }
      else {
        return "";
      }
    }
    else if (newQuestion.question_type === "cb")
    {
      // TODO
      let correctAnswersList = [];
      newQuestion.answers.forEach((answer, index) => {
        if (answer.is_correct)
        {
          correctAnswersList.push(index.toString());
        }
      });

      return correctAnswersList;
    }
    else {
      return ['undefined'];
    }
  };

  const onChangeCheckboxAnswer1 = (e) => {
    const newAnswers = newQuestion.answers.map(a => (a.id === e.target.valueAsNumber) ? { ...a, is_correct: false } : { ...a });
    setNewQuestion({ ...newQuestion, answers: newAnswers });
  };

  const onChangeCorrectAnswers = (e) => {
    /*
    let newAnswers;
    
    if (newQuestion.question_type === "mc")
    { 
      newAnswers = newQuestion.answers.map(a => (a.id === e.toString()) ? { ...a, is_correct: true } : { ...a, is_correct: false });
      setNewQuestion({ ...newQuestion, answers: newAnswers });
    }
    else if (newQuestion.question_type === "sa")
    {
      newAnswers = newQuestion.answers.map(a => (a.id === e.target.valueAsNumber) ? { ...a, is_correct: true } : { ...a, is_correct: false });
      setNewQuestion({ ...newQuestion, answers: newAnswers });
    }
    else if (newQuestion.question_type === "cb")
    {
      newAnswers = newQuestion.answers.map(a => (e.target.value.includes(a.id)) ? { ...a, is_correct: true } : { ...a, is_correct: false });
      setNewQuestion({ ...newQuestion, answers: newAnswers });
    }
    */

    if (newQuestion.question_type === "mc")
    { 
      setCorrectAnswers([e]);
    }
    else if (newQuestion.question_type === "sa")
    {
      setCorrectAnswers([e.target.value]);
    }
    else if (newQuestion.question_type === "cb")
    {
      setCorrectAnswers(e);
    }
  };

  const onChangeCorrectAnswers2 = (e) => {
    let newAnswers;
    
    if (newQuestion.question_type === "mc")
    { 
      newAnswers = newQuestion.answers.map(a => (a.id === e.toString()) ? { ...a, is_correct: true } : { ...a, is_correct: false });
      setNewQuestion({ ...newQuestion, answers: newAnswers });
    }
    else if (newQuestion.question_type === "sa")
    {
      newAnswers = newQuestion.answers.map(a => (a.id === e.target.valueAsNumber) ? { ...a, is_correct: true } : { ...a, is_correct: false });
      setNewQuestion({ ...newQuestion, answers: newAnswers });
    }
    else if (newQuestion.question_type === "cb")
    {
      newAnswers = newQuestion.answers.map(a => (e.target.value.includes(a.id)) ? { ...a, is_correct: true } : { ...a, is_correct: false });
      setNewQuestion({ ...newQuestion, answers: newAnswers });
    }
  };

  const onChangeRadioAnswer = (e) => {
    const newAnswers = newQuestion.answers.map((answer, index) => (index === +e) ? { ...answer, is_correct: true } : { ...answer, is_correct: false });
    // console.log(newAnswers);
    setNewQuestion({ ...newQuestion, answers: newAnswers });
  };

  const onChangeShortAnswer = (e) => {
    const newAnswers = newQuestion.answers.map((answer, index) => (index === 0) ? { ...answer, answer_text: e.target.value } : { ...answer, is_correct: false });
    setNewQuestion({ ...newQuestion, answers: newAnswers });
  };

  const onChangeCheckboxAnswer = (idx) => (e) => {
    // const newAnswers = newQuestion.answers.map((answer, index) => (e.includes(index)) ? { ...answer, is_correct: true } : { ...answer, is_correct: false });
    const newAnswers = newQuestion.answers.map((answer, index) => (index === idx) ? { ...answer, is_correct: e.target.checked } : answer);
    setNewQuestion({ ...newQuestion, answers: newAnswers });
  };

  const onChangeAnswerText = (idx) => (e) => {
    const newAnswers = newQuestion.answers.map((answer, index) => (index === idx) ? { ...answer, answer_text: e.target.value } : answer);
    setNewQuestion({ ...newQuestion, answers: newAnswers });
  };

  const deleteAnswer = (idx) => {

  };

  const renderAnswerItem = (ans) => {
    let answerItem;

    if (newQuestion.question_type === "mc")
    {
      // Multiple choice
      answerItem = <Radio key={ans.id} value={ans.id.toString()} onChange={onChangeRadioAnswer} />
    }
    else if (newQuestion.question_type === "sa")
    {
      // Short answer
      answerItem = <Textarea onChange={onChangeShortAnswer} value={correctAnswers[0]} />
    }
    else if (newQuestion.question_type === "cb")
    {
      // Checkboxes
      answerItem = <Checkbox key={ans.id} value={ans.id.toString()} onChange={onChangeCheckboxAnswer} />
    }

    return answerItem;
  }

  const renderPossibleAnswers = (question) => {
    if (question.question_type === "mc")
    {
      return (
        <Box>
          <RadioGroup onChange={onChangeRadioAnswer} value={getCorrectAnswers()}>
            <Stack>
              {Object.entries(question.answers).map(([i, ans]) =>
                <FormControl isInvalid={!ans} mb={2} key={i}>
                  <InputGroup>
                    <InputLeftElement px={4} width="2.5rem">
                      <Radio value={i} />
                    </InputLeftElement>
                    <Input
                      pl="2.5rem"
                      value={ans.answer_text}
                      onChange={onChangeAnswerText(+i)}
                    />
                    <InputRightElement width="6rem" zIndex="0">
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
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              )}
            </Stack>
          </RadioGroup>
        </Box>
      );
    }
    else if (question.question_type === "sa")
    {

      // Text box
      return (
        <Box>
          <Text>Enter a possible correct answer: </Text>
          <Textarea onChange={onChangeShortAnswer} value={getCorrectAnswers()} />
        </Box>
      );
    }
    else if (question.question_type === "cb")
    {
      // Checkboxes
      // Loop through list of possible answers

      return (
        <Box>
          <p>Answers (select the correct answer/s): </p>
          <CheckboxGroup colorScheme="green" defaultValue={getCorrectAnswers()}> 
            <Stack>
              {Object.entries(question.answers).map(([i, ans]) =>
                <FormControl isInvalid={!ans} mb={2} key={i}>
                  <InputGroup>
                    <InputLeftElement px={4} width="2.5rem">
                      <Checkbox key={i} value={i} isChecked={ans.is_correct} onChange={onChangeCheckboxAnswer(+i)} />
                    </InputLeftElement>
                    <Input
                      pl="2.5rem"
                      value={ans.answer_text}
                      onChange={onChangeAnswerText(+i)}
                    />
                    <InputRightElement width="6rem" zIndex="0">
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
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              )}
            </Stack>
          </CheckboxGroup>
        </Box>
      );
    }
      
    return (<p>Possible answers were not fetched properly</p>);
  };

  const resetQuestionFields = () => {
    // TODO: Fix this
    const defaultAnswers = getDefaultAnswers(newQuestion.question_type);

    setNewQuestion({ ...newQuestion, answers: defaultAnswers });
  };

  const renderQuiz = () => {
    return (
      <Box>
        
      </Box>
    );
  };

  const printCorrectAnswers = () => {
    /*
    const correctAnswers = getCorrectAnswers();
    if (!isNaN(correctAnswers))
    {
      return (
        <>
          <p>{correctAnswers}</p>
        </>
      )
    }
    else if (Array.isArray(correctAnswers))
    {
      return (
        <>
          {correctAnswers.map(a => {return <p key={a.id}>{a}</p>})}
        </>
      )
    }
    else {
      return (
        <p>Correct answers could not be found: {typeof correctAnswers} {correctAnswers}</p>
      )
    }
    */
  //  return (<>{correctAnswers.map(a => {return <p key={a.id}>{a}</p>})}</>);

    const correctAnswersList = [];

    newQuestion?.answers?.forEach(ans => {
      if (ans.is_correct)
      {
        correctAnswersList.push(ans.answer_text);
      }
    });

    return correctAnswersList.toString();
  };

  const printInvalidQuestionError = () => {
    return <Text color="red">Invalid question - please set a correct answer</Text>
  }

  return (
    <Box>
      {renderQuizDetails()}
      {renderNewQuestionEntry()}

      <Button colorScheme="orange" variant="solid" onClick={addPossibleAnswer}>Add new possible answer</Button>
      {/* Add question button */}
      <Button colorScheme="teal" variant="solid" onClick={addQuestionToQuiz}>Add to quiz</Button>

      {/* <Button colorScheme="blue" variant="solid" onClick={resetQuestionFields}>Reset fields</Button> */}

      {/* <Button colorScheme="red" variant="solid" onClick={createNewQuestion}>Create new question</Button> */}

      <p style={{ color: "red" }}>Correct answer will be: </p>
      {printCorrectAnswers()}
      
      {!isValidQuestion && printInvalidQuestionError()}

      {/* <Heading>Questions</Heading> */}
      {/* {renderQuiz()} */}
    </Box>
  );
}