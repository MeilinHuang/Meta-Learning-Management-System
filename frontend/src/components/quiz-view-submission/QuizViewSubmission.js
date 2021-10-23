import React, { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Textarea
} from "@chakra-ui/react"

export default function QuizViewSubmission() {
  const [studentAnswers, setStudentAnswers] = useState({});
  const [quiz, setQuiz] = useState({});
  const [visibleExplanations, setVisibleExplanations] = useState([1, 3]); // stores id of questions whose explanations should be shown

  useEffect(() => {
    // TODO: Grab student answers and quiz (which contains the answers)
    setQuiz({  
      name: "SampleQuiz",
      open_date: "2016-06-22 19:10:25-07",
      close_date: "2016-06-22 19:10:25-07",
      time_given: 45,
      num_questions: 2,
      questions: [
        {
          question_id: 1,
          question_text: "This is some question text",
          question_type: "mc", // sa, cb
          marks_awarded: 3,
          related_topic_id: 10, // Obtained via GET /topics
          answers: [
            {
              answer_text: "answer1",
              is_correct: true,
              explanation: "Answer1 is correct based on the X laws"
            },
            {
              answer_text: "answer2",
              is_correct: false,
              explanation: "Answer2 does not satisfy the 2nd law of X"
            },
            {
              answer_text: "answer3",
              is_correct: false,
              explanation: "Answer3 does not satisfy the 4th law of X"
            },
            {
              answer_text: "answer4",
              is_correct: false,
              explanation: "Answer4 does not satisfy the 1st and 2nd law of X"
            },
          ]
        },
        {
          question_id: 2,
          question_text: "This is some question text",
          question_type: "cb",
          marks_awarded: 1,
          related_topic_id: 1,
          answers: [ // can have multiple answers correct
            {
              answer_text: "cb1",
              is_correct: false,
              explanation: "Incorrect"
            },
            {
              answer_text: "cb2",
              is_correct: true,
              explanation: "Correct"
            },
            {
              answer_text: "cb3",
              is_correct: true,
              explanation: "Correct"
            },
            {
              answer_text: "cb4",
              is_correct: false,
              explanation: "Incorrect"
            },
          ]
        },
        {
          question_id: 3,
          question_text: "This is some question text",
          question_type: "sa",
          marks_awarded: 4,
          related_topic_id: 3,
          answers: [ // can have multiple answers correct
            {
              answer_text: "a possible correct short answer",
              is_correct: true,
              explanation: "This is a suggested answer and explanation"
            },
          ]
        }
    ]});

    setStudentAnswers({
        quiz_id: 1,
        attempt_start_time: new Date(),
        attempt_end_time: new Date(),
        answers: [
          {
            question_id: 1,
            student_answers: [
              "answer1"
            ]
          },
          {
            question_id: 2,
            student_answers: [
              "cb1",
              "cb2"
            ]
          },
          {
            question_id: 3,
            student_answers: [
              "This is student's short answer answer"
            ]
          },
        ]
    });
  }, []);

  const getStudentAnswerToCurrentQuestion = (questionId) => {
    let foundStudentAnswers = [];

    const foundAnswer = studentAnswers?.answers?.find(answerObj => +answerObj.question_id === +questionId);

    if (foundAnswer && foundAnswer.student_answers.length > 0)
    {
      foundStudentAnswers = foundAnswer.student_answers;
    }

    return foundStudentAnswers;
  };

  const updateVisibleExplanations = (questionId, shouldBeVisible) => {
    console.log("UPATE VISIBLE EXPLANATIOSN CALLED: " + questionId + " | " + shouldBeVisible);

    const newVisibleExplanations = visibleExplanations;
    console.log("ORIGINAL VISIBLE EXPL: " + visibleExplanations);

    if (shouldBeVisible) {
      if (!visibleExplanations.includes(+questionId)) {
        newVisibleExplanations.push(+questionId);
      }
    }
    else {
      if (visibleExplanations.includes(+questionId)) {
        const removeIndex = visibleExplanations.indexOf(+questionId);
        if (removeIndex > -1) {
          newVisibleExplanations.splice(removeIndex, 1);
        }
      }
    }

    console.log("NEW VISIBLE EXPLANATIONS: |" + newVisibleExplanations + "|");

    setVisibleExplanations(newVisibleExplanations);

    console.log("UVE: " + visibleExplanations);
  };

  const showExplanations = (q) => {
    // const studentAnswer = getStudentAnswerToCurrentQuestion(q.question_id);

    const correctAnswers = [];
    const incorrectAnswers = [];

    q.answers.forEach((ans) => {
      if (ans.is_correct) {
        correctAnswers.push(ans);
      }
      else {
        incorrectAnswers.push(ans);
      }
    });

    console.log("VE: " + visibleExplanations);

    // TODO: Get explanation for incorrect answer and correct answer
    return (
      <Box>
          {/* 
          { visibleExplanations.includes(+q.question_id) ? 
            <Button colorScheme="red" size="xs" mb={3} onClick={() => updateVisibleExplanations(+q.question_id, false)}>Hide Explanation</Button>
            :
            <Button colorScheme="blue" size="xs" mb={3} onClick={() => updateVisibleExplanations(+q.question_id, true)}>Show Explanation</Button>
          }
          */}
          
          { visibleExplanations.includes(+q.question_id) ? (q.question_type !== "sa" ? 
            <Box>
              <Text color="green">Correct answer/s: </Text>
              {correctAnswers.map((ans, index) => <Text key={index}>{ans.answer_text + ": " + ans.explanation}</Text>)}
              <br></br>
              <Text color="red">Incorrect answer/s:</Text>
              {incorrectAnswers.map((ans, index) => <Text key={index}>{ans.answer_text + ": " + ans.explanation}</Text>)}
            </Box>
            :
            <Box>
              <Text color="green">Suggested answer: </Text>
              {correctAnswers.map((ans, index) => <Text key={index}>{ans.answer_text + ": " + ans.explanation}</Text>)}
            </Box>
          ) 
          : 
          <Box>
          </Box>}
      </Box>
    );
  };

  const getAnswerTextColor = (possibleAnswer, studentAnswer) => {
    // Go through studentAnswers and if answer is in studentAnswer, return green if correct else red
    if (!possibleAnswer || studentAnswer.length === 0)
    {
      return "black";
    }

    if (possibleAnswer.is_correct)
    {
      return "green";
    }
    else if (studentAnswer.includes(possibleAnswer.answer_text))
    {
      return "red";
    }
    else 
    {
      return "black";
    }
  };

  const renderQuestion = (q, qIndex) => {

    return (
      <Box width="70%" border="1px" borderColor="gray.300" borderRadius="md" p={10}>
        <Heading size="md">Question {qIndex}</Heading>
        <Text mt={3}>{q.question_text}</Text>

        {q.question_type === "mc" && renderMultipleChoiceAnswers(q)}
        {q.question_type === "sa" && renderShortAnswerAnswers(q)}
        {q.question_type === "cb" && renderCheckboxAnswers(q)}

        {showExplanations(q)}
      </Box>
    );
  };

  const renderMultipleChoiceAnswers = (q) => {
    const studentAnswer = getStudentAnswerToCurrentQuestion(q.question_id);

    return (
      <Box my={5}>
        <RadioGroup value={studentAnswer[0]}>
          <Stack direction="column">
            {q.answers.map((ans, index) => <Radio key={index} value={ans.answer_text} readOnly><Box color={getAnswerTextColor(ans, studentAnswer)}>{ans.answer_text}</Box></Radio>)}
          </Stack>
        </RadioGroup>
      </Box>
    );
  };

  const renderShortAnswerAnswers = (q) => {
    const studentAnswer = getStudentAnswerToCurrentQuestion(q.question_id);
    const displayedAnswer = studentAnswer.length > 0 ? studentAnswer[0] : "";

    return (
      <Box my={5}>
        <Text mb={2} fontWeight="bold" color="gray.600">Your answer</Text>
        <Textarea color="blue.500" value={displayedAnswer} readOnly/>
      </Box>
    );
  };

  const renderCheckboxAnswers = (q) => {
    const studentAnswer = getStudentAnswerToCurrentQuestion(q.question_id);

    return (
      <Box my={5}>
        <CheckboxGroup colorScheme="green" value={studentAnswer}>
          <Stack direction="column">
            {q.answers.map((ans, index) => <Checkbox colorScheme="blue" color={getAnswerTextColor(ans, studentAnswer)} key={index} value={ans.answer_text} readOnly>{ans.answer_text}</Checkbox>)}
          </Stack>
        </CheckboxGroup>
      </Box>
    );
  };


  return (
    <Box>
      <Box flex="3">
        {quiz?.questions?.map((question, index) => <Box key={index}>{renderQuestion(question, index + 1)}</Box>)}
      </Box>

    </Box>
  );
}