import React, { useState, useEffect } from 'react'
import { SmallCloseIcon } from '@chakra-ui/icons'
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
        <Heading>Question</Heading>
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

  const onChangeQuestionType = (e) => {
    // Reset correctAnswers
    setCorrectAnswers([]);
    setNewQuestion({ ...newQuestion, question_type: e.target.value });
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
    // TODO
    
    // TODO: Check if any field is invalid
    let isValid = true;
    if (!isValid)
    {
      // TODO: Render user-friendly error message when not valid
      return;
    }

    setQuiz({ num_questions: quiz.num_questions + 1});
  };

  const createNewQuestion = () => {
    // Create new question and setNewQuestion(newQuestion)

    // Render new question onto screen 
  };

  const deletePossibleAnswer = (answerId) => {
    const updatedPossibleAnswers = newQuestion.answers.filter(a => a.id !== answerId);

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

  const getCorrectAnswers = () => {

    if (newQuestion.question_type === "mc" || newQuestion.question_type === "sa")
    {
      // TODO
      const foundCorrectAnswer = newQuestion.answers.find(a => a.is_correct);
      console.log(typeof foundCorrectAnswer);
      return foundCorrectAnswer.id.toString(); // TODO: Check why this works when it's not a list
    }
    else if (newQuestion.question_type === "cb")
    {
      // TODO
      let foundCorrectAnswers = newQuestion.answers.filter(a => a.is_correct);
      return foundCorrectAnswers.map(m => m.id.toString());
    }
    else {
      return ['undefined'];
    }
  };

  const onChangeCheckboxAnswer = (e) => {
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

  const renderPossibleAnswers = (question) => {
    if (question.question_type === "mc")
    {
      // Radio buttons
      return (
        <Box>
          <p>Answers (select the correct answer): </p>
          {question.question_text}
          <RadioGroup onChange={onChangeCorrectAnswers} value={correctAnswers[0]}>
            <Stack>
              {question.answers.map(a => 
                <Box>
                  <Radio key={a.id} value={a.id.toString()}>{a.answer_text}</Radio>
                  <SmallCloseIcon color="red.500" ml={10} onClick={() => deletePossibleAnswer(a.id)}/>
                </Box>
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
          <Textarea onChange={onChangeCorrectAnswers} value={correctAnswers[0]} />
        </Box>
      );
    }
    else if (question.question_type === "cb")
    {
      // Checkboxes
      // Loop through list of possible answers
      const t = "Hello";

      return (
        <Box>
          <p>Answers (select the correct answer/s): </p>
          <CheckboxGroup colorScheme="green" onChange={onChangeCorrectAnswers} value={correctAnswers}> 
            <Stack>
              {question.answers.map(a => 
                <Box>
                  <Checkbox key={a.id} value={a.id.toString()}>{a.answer_text}</Checkbox>
                  
                    <SmallCloseIcon color="red.500" ml={10} onClick={() => deletePossibleAnswer(a.id)}/>
                </Box>
              )}
            </Stack>
          </CheckboxGroup>
        </Box>
      );
    }
      
    return (<p>Possible answers were not fetched properly</p>);
  };

  const resetQuestionFields = () => {
    setNewQuestion(generateNewQuestion());
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
   return (<>{correctAnswers.map(a => {return <p key={a.id}>{a}</p>})}</>);
  };

  return (
    <Box>
      {newQuestion.question_type}
      {renderQuizDetails()}
      {renderNewQuestionEntry()}

      <Button colorScheme="orange" variant="solid" onClick={addPossibleAnswer}>Add new possible answer</Button>
      {/* Add question button */}
      <Button colorScheme="teal" variant="solid" onClick={addQuestionToQuiz}>Add to quiz</Button>

      <Button colorScheme="blue" variant="solid" onClick={resetQuestionFields}>Reset fields</Button>

      <Button colorScheme="red" variant="solid" onClick={createNewQuestion}>Create new question</Button>

      <p style={{ color: "red" }}>Correct answer will be: </p>
      {printCorrectAnswers()}
      
      {/* {renderQuiz()} */}
    </Box>
  );
}