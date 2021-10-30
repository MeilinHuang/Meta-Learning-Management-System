import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  VStack,
  useDisclosure
} from "@chakra-ui/react"

import {
  SearchIcon,
} from "@chakra-ui/icons"

import DatePicker from "react-datepicker";
import { useHistory, useParams } from "react-router-dom";
import { backend_url } from "../../Constants"
import QuestionCreation from '../question-creation/QuestionCreation';
import { forEach } from 'draft-js/lib/DefaultDraftBlockRenderMap';

function generateNewQuiz() {
  return {
    name: "",
    topicGroupId: 1, // 1 is currently COMP6771 (C++ Programming) - used for final demo
    openDate: new Date(),
    closeDate: new Date(),
    timeGiven: 30,
    numQuestions: 0,
    questions: [
    ]
  }
};

export default function EditQuiz() {
  const [quiz, setQuiz] = useState({}); // list of dictionaries [{}, {}, ...]
  const [questionBank, setQuestionBank] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef();
  const [selectingCreateOrImportQuestion, setSelectingCreateOrImportQuestion] = useState(false);
  const [isImportingQuestion, setIsImportingQuestion] = useState(false);
  const [topics, setTopics] = useState([]);
  let { quizName } = useParams();
  const [postedQuestionIds, setPostedQuestionIds] = useState([]); // add ids of questions that you've done a request to POST it
  const [questionsToUpdate, setQuestionsToUpdate] = useState([]);

  useEffect(() => {
    // Generate new quiz
    const newQuizTemplate = generateNewQuiz();
    newQuizTemplate.name = quizName;
    setQuiz(newQuizTemplate);

    getTopics();
    getQuestionBank();
  }, []);

  const getTopics = () => {
    fetch(backend_url + "topicGroup/C++ Programming/topic", {
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
        // Set question bank variable
        // setQuestionBank(data);
        setTopics(data.topics_list);
      });
  };

  const getQuestionBank = () => {
    // Get questions from question bank 
    fetch(backend_url + "questionBank/questions", {
      method: "GET",
      headers: {
        "Content-Type": "application/JSON",
        Authorisation: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => {
        if (r.status === 200) {
          return r.json();
        }
        // TODO: Handle error case
      })
      .then((data) => {
        // Set question bank variable
        setQuestionBank(data);
      });
  };

  const onChangeOpenDate = (date) => {
    setQuiz({ ...quiz, openDate: date });
  }

  const onChangeCloseDate = (date) => {
    setQuiz({ ...quiz, closeDate: date });
  }

  const getTopicName = (id) => {
    const foundTopic = topics.find((obj) => +obj.id === +id);

    if (foundTopic) {
      return foundTopic.name;
    }

    return "";
  };

  const renderQuizDetails = () => {
    const marksReducer = (accumulator, currentQuestion) => accumulator + currentQuestion.marksAwarded;

    let allRelatedTopics = {};
    let sortedRelatedTopicsList = [];
    for (let i = 0; i < quiz.questions?.length; i++) {
      const currentTopicId = quiz.questions[i].topicId;
      const currentTopic = getTopicName(currentTopicId); // topics[currentTopicId];

      // If topic not found, skip
      if (!currentTopic) {
        continue;
      }

      // Sorts topics based on frequency of questions for that particular topic
      if (!(currentTopic in allRelatedTopics)) {
        allRelatedTopics[currentTopic] = 1;
        sortedRelatedTopicsList.push(currentTopic);
      }
      else {
        allRelatedTopics[currentTopic] += 1;
      }
    }

    sortedRelatedTopicsList.sort();

    return (
      <Box>
        <Text fontWeight="bold" fontSize="2xl">Quiz Details</Text>
        <HStack maxWidth="300">
          <Text fontWeight="bold">Name: </Text>
          <Input placeholder="Enter quiz name" size="sm" onChange={(e) => setQuiz({ name: e.target.value })} value={quiz.name} />
        </HStack>

        <HStack maxWidth="300">
          <Text fontWeight="bold">Topic Group: </Text>
          <Input size="sm" isDisabled value={"C++ Programming"} />
        </HStack>

        <HStack d="flex" my="2">
          <Text fontWeight="bold">Open date: </Text>
          <DatePicker
            selected={quiz.openDate}
            onChange={onChangeOpenDate}
            showTimeSelect
            dateFormat="Pp"
          />
        </HStack>

        <HStack d="flex" my="2">
          <Text fontWeight="bold">Due date: </Text>
          <DatePicker
            selected={quiz.closeDate}
            onChange={onChangeCloseDate}
            showTimeSelect
            dateFormat="Pp"
          />
        </HStack>

        <HStack my="2" align>
          <Text fontWeight="bold">Time given: </Text>
          <Text>{quiz.timeGiven}</Text>
        </HStack>

        <HStack align>
          <Text mb="2" fontWeight="bold">Number of questions: </Text>
          <Text>{quiz.numQuestions}</Text>
        </HStack>

        <HStack align>
          <Text mb="2" fontWeight="bold">Total marks: </Text>
          <Text>{quiz.questions?.reduce(marksReducer, 0)}</Text>
        </HStack>

        <Box maxWidth="300">
          <Text mb="2" fontWeight="bold">Related topics: </Text>
          {sortedRelatedTopicsList.map((topicName) => <Box width="fit-content">{renderTag(topicName + " (" + allRelatedTopics[topicName] + ")")}</Box>)}
        </Box>

        <HStack mt="5" spacing="20px" alignItems="center">
          <Button size="sm" colorScheme="red">Delete quiz</Button>
          <Button size="sm" colorScheme="green" onClick={handleSubmitQuiz}>Create quiz</Button>
        </HStack>
      </Box>
    );
  }

  const handleSubmitQuiz = () => {
    // TODO: Finish this off 

    // TODO: PUT request to update questions (if they have changed since POSTed)
    // Will use ordering of questions to determine which questions need to be updated (since question order can't be moved around anyways)
    const updatePromises = [];

    // PUT request for any questions that need updating
    questionsToUpdate.forEach((questionIndex) => {
      const questionToUpdate = quiz.questions[+questionIndex];
      const id = postedQuestionIds[+questionIndex];

      const updateData = {
        questionId: id,
        topicId: questionToUpdate.topicId,
        questionText: questionToUpdate.questionText,
        marksAwarded: questionToUpdate.marksAwarded,
        questionType: questionToUpdate.questionType
      };

      updatePromises.push(
        fetch(`${backend_url}questionBank/question/edit/${id}`, {
          method: "PUT",
          body: updateData,
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        }).then((r) => {
          if (r.status === 200) {
            return r.json();
          }
          else {
            throw new Error(`Update question failed`);
          }
        })
      );
    });

    // Wait for all question updates to be successfully done before posting new quiz
    Promise.all(updatePromises).then((updates) => {
      const quizData = {
        name: quiz.name,
        topicGroupId: quiz.topicGroupId,
        openDate: quiz.openDate,
        closeDate: quiz.closeDate,
        timeGiven: quiz.timeGiven,
        questionIds: postedQuestionIds
      };

      // Post new quiz 
      fetch(`${backend_url}topicGroup/${quiz.topicGroupId}/quizzes`, {
        method: "POST",
        body: quizData,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((r) => {
        if (r.status === 200) {
          return r.json();
        }
        else {
          throw new Error(`Post new quiz failed`);
        }
      });
    });

    // TODO: Only keep post new quiz
    // Looks like you're meant to make POST requests for questions before posting new quiz
    // with references to those created questions' ids. 
    /*
    // Post new quiz 
    fetch(backend_url + "topicGroup/" + quizData.topicGroupId + "/quizzes", {
      method: "POST",
      body: quizData,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => {
        if (r.status === 200) {
          return r.json();
        }
        else {
          throw new Error(`Post new quiz ${quizData.name} failed`);
        }
      })
      .then((data) => {
        // TODO: Redirect back to QuizCreation/Quiz List
        // history.push(`/course-page/${course}/forums/${data.post_id}`);

        // Post each question
        // const questionPromises = [];

        for (const question of quiz.questions) {
          const questionData = {
            questionBankId: 1,
            topicId: question.topicId,
            questionText: question.questionText,
            marksAwarded: question.marksAwarded,
          };

            fetch(`${backend_url}questionBank/question`, {
              method: "POST",
              body: questionData,
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
              },
            })
            .then((r) => {
              if (r.status === 200) {
                return r.json();
              }
              else {
                throw new Error(`Quiz [${quizData.name}] - Post new question ${questionData.questionText} failed`);
              } 
            })
            .then((data) => {
              // const qAnswerPromises = [];

              // Post each question answer for this question
              const owningQuestionId = data.questionId;

              for (const qAnswer of question.answers) {
                const qAnswerData = {
                  questionId: owningQuestionId,
                  answerText: qAnswer.answerText,
                  isCorrect: qAnswer.isCorrect,
                  explanation: qAnswer.explanation
                };

                fetch(`${backend_url}topicGroup/quizzes/question/answer`, {
                  method: "POST",
                  body: qAnswerData,
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                  },
                })
                .then((r) => {
                  if (r.status === 200) {
                    return r.json();
                  }
                  else {
                    throw new Error(`Quiz [${quizData.name}] - Question ${questionData.questionText} - Answer ${qAnswerData.answerText} failed`);
                  } 
                })
              }
            })
          }
      });
      */

      // Post questions

      // Post each question's possible answers? 
  };

  const onClickDeleteQuestion = (qs, qsIndex) => {
    // TODO: Delete question in quiz variable and delete question in db using postedQuestionIds value in qsIndex index

    // DELETE request
    fetch(`${backend_url}topicGroup/quizzes/question/answer`, {
      method: "DELETE",
      body: { 
        questionId: postedQuestionIds[qsIndex] 
      },
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((r) => {
      if (r.status === 200) {
        return r.json();
      }
      else {
        throw new Error(`Delete Question ${quiz.questions[qsIndex].questionText} failed`);
      } 
    })
    .then((data) => {
        // Delete from local data (quiz.questions and postedQuestionIds)
        quiz.questions.splice(qsIndex, 1);
        
        const newPostedQuestionIds = postedQuestionIds;
        newPostedQuestionIds.splice(qsIndex, 1);
    });
  };

  const renderQuestionItem = (qs, qsIndex) => {
    // One accordion item per question 
    return (
      <Box>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              <Heading size="md" textAlign="left" color="gray.500">Question {qsIndex + 1}</Heading>
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Box>
            <QuestionCreation addQuestionToQuiz={addQuestionToQuiz} topics={topics} isCreatingQuestion={false} />
          </Box>
        </AccordionPanel>

        <Button size="lg" colorScheme="Red" onClick={onClickDeleteQuestion}>Delete question</Button>
      </Box>
    );
  };

  const renderQuestions = () => {
    return (
      <Box>
        <HStack>
          <Box d="flex">
            <Heading width="40rem">Questions</Heading>
            <HStack spacing="3">
              <Button size="sm" colorScheme="green" onClick={onClickNewQuestion}>New question</Button>
              <Button size="sm" colorScheme="blue" onClick={expandAllQuestions}>Expand all</Button>
              <Button size="sm" colorScheme="red" onClick={collapseAllQuestions}>Collapse all</Button>
            </HStack>
          </Box>
        </HStack>
        <Accordion my="3" allowToggle allowMultiple onChange={onChangeQuestionItems} index={getExpandedQuestions()}>
          {quiz.questions?.length > 0 && quiz.questions.map((qs, index) => <AccordionItem key={index}>{renderQuestionItem(qs, index)}</AccordionItem>)}
        </Accordion>
      </Box>
    );
  };

  const onClickNewQuestion = () => {
    onOpen();
    setSelectingCreateOrImportQuestion(true);
  };

  const onChangeQuestionItems = (expandedIndices) => {
    let newQuestions = quiz.questions?.map((qs, index) => {
      const obj = Object.assign({}, qs);
      if (expandedIndices.includes(index) && !obj.isExpanded) {
        obj.isExpanded = true;
      }
      else if (!expandedIndices.includes(index) && obj.isExpanded) {
        obj.isExpanded = false;
      }
      return obj;
    });

    setQuiz({ ...quiz, questions: newQuestions });
  };

  const toggleQuestionItem = (questionIndex) => {
    let updatedExpandedQuestions = getExpandedQuestions();

    if (updatedExpandedQuestions.includes(questionIndex)) {
      // Selected question is currently expanded so we want to collapse it
      updatedExpandedQuestions.pop(questionIndex);
    }
    else {
      // Selected question is currently collapsed so we want to expand it
      updatedExpandedQuestions.push(questionIndex);
    }

    // Update state of question items in Accordion list
    onChangeQuestionItems(updatedExpandedQuestions);
  };

  const getExpandedQuestions = () => {
    let expandedQuestions = [];
    quiz.questions?.forEach((qs, index) => {
      if (qs.isExpanded) {
        expandedQuestions.push(index);
      }
    });

    return expandedQuestions;
  };

  const expandAllQuestions = () => {
    let newQuestions = quiz.questions?.map((qs, index) => {
      const obj = Object.assign({}, qs);
      obj.isExpanded = true;
      return obj;
    });

    setQuiz({ ...quiz, questions: newQuestions });
  };

  const collapseAllQuestions = () => {
    let newQuestions = quiz.questions?.map((qs, index) => {
      const obj = Object.assign({}, qs);
      obj.isExpanded = false;
      return obj;
    });

    setQuiz({ ...quiz, questions: newQuestions });
  };

  const addQuestionToQuiz = (newQuestion) => {
    // Update questions in quiz
    const updatedQuestions = quiz.questions.concat([newQuestion])
    setQuiz({ ...quiz, numQuestions: quiz.numQuestions + 1, questions: updatedQuestions });

    // TODO: POST request - post new question 
    fetch(backend_url + "questionBank/question/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/JSON",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => {
        if (r.status === 200) {
          return r.json();
        }
        else {
          throw new Error(`Quiz [${quiz.name}] Post new question ${newQuestion.questionText} failed`);
        }
      })
      .then((data) => {
        // Add new question's id to questionIds array in quiz
        let newQuestionIds = postedQuestionIds;
        newQuestionIds.push(data.questionId);
        setPostedQuestionIds(newQuestionIds);

        // TODO: POST request possible question answers 
        for (const qAnswer of newQuestion.answers) {
          const qAnswerData = {
            questionId: data.questionId,
            answerText: qAnswer.answerText,
            isCorrect: qAnswer.isCorrect,
            explanation: qAnswer.explanation
          };

          fetch(`${backend_url}topicGroup/quizzes/question/answer`, {
            method: "POST",
            body: qAnswerData,
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((r) => {
            if (r.status === 200) {
              return r.json();
            }
            else {
              throw new Error(`Answer ${qAnswer.answerText} failed`);
            } 
          })
        }
        
      })

      console.log("Added question to quiz (and POSTed)");
      console.log(postedQuestionIds);
  };

  const renderQuestionLinks = () => {
    return (
      <Box mt="5">
        <Text mb="3">Click a question link below to jump to that question.</Text>
        <Stack flex="3" border="1px" borderColor="gray.300" p="2" borderRadius="md" minHeight="80">
          {quiz.questions?.map((qs, index) => renderQuestionLinkItem(qs, index))}
        </Stack>
      </Box>
    );
  }

  const renderQuestionLinkItem = (qs, index) => {
    const tagText = getTopicName(qs.topicId);

    return (
      <HStack key={index}>
        <Button colorScheme="teal" variant="link" onClick={() => toggleQuestionItem(+index)}>Question {index + 1}</Button>
        <Text size="sm" color="grey">({qs.marksAwarded} {qs.marksAwarded > 1 ? "marks" : "mark"})</Text>
        {renderTag(tagText)}
      </HStack>
    );
  }

  const renderTag = (tagText) => {

    return (
      <Box size="sm" bgColor="gray.500" borderRadius="md" py={0.5} px={1}>
        <Text fontWeight="bold" fontSize="sm" color="white">{tagText}</Text>
      </Box>
    );
  };

  const openAddQuestionModal = () => {
    return (
      <Box>

      </Box>
    );
  };

  const handleSubmit = (e) => {

  };

  const addQuestionToQuestionBank = (question) => {
    const newQuestionBank = questionBank.concat([question]);
    setQuestionBank(newQuestionBank);
  };

  const renderNewQuestionModal = () => {

    const creatingNewQuestion = (!selectingCreateOrImportQuestion && !isImportingQuestion);
    const importingNewQuestion = (!selectingCreateOrImportQuestion && isImportingQuestion);

    let modalHeaderText = "";

    if (selectingCreateOrImportQuestion) {
      modalHeaderText = "Create or import a question";
    }
    else if (creatingNewQuestion) {
      modalHeaderText = "Create a question";
    }
    else if (importingNewQuestion) {
      modalHeaderText = "Import a question";
    }

    return (
      <Modal
        onClose={handleOnClose}
        isOpen={isOpen}
        size="xl"
        finalFocusRef={finalRef}
      >
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit}>
          <ModalHeader>{modalHeaderText}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectingCreateOrImportQuestion && renderCreateOrImportBox()}
            {creatingNewQuestion && <QuestionCreation addQuestionToQuiz={addQuestionToQuiz} topics={topics} isCreatingQuestion={true} addToQuestionBank={addQuestionToQuestionBank} />}
            {importingNewQuestion && renderImportQuestionScreen()}
          </ModalBody>
          <ModalFooter>
            {/* <Button aria-label="Close" onClick={handleDialogClose}>Close</Button>
            <Button
              type="submit"
              ml={3}
              colorScheme="green"
              aria-label="add quiz"
            >
              Add Quiz
            </Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const handleOnClose = () => {
    onClose();
    setSelectingCreateOrImportQuestion(false);
    setIsImportingQuestion(false);
  };

  const renderCreateOrImportBox = () => {
    return (
      <VStack>
        <Button colorScheme="green" onClick={onClickCreateNewQuestion}>Create a new question</Button>
        <Heading size="md" color="gray.600">or</Heading>
        <Button colorScheme="orange" onClick={onClickImportQuestion}>Import from Question Bank</Button>
      </VStack>
    );
  };

  const renderImportQuestionScreen = () => {

    return (
      <Box>
        <Stack spacing={4}>
          <InputGroup>
            <Input placeholder="Enter keywords" />
            <InputRightElement>
              <SearchIcon color="gray.800" />

            </InputRightElement>
          </InputGroup>
        </Stack>

        <VStack spacing={10} px={3} mt={3}>
          {questionBank.map((qs, index) => {
            return (
              <InputGroup key={index}>
                <InputLeftElement>
                  <Checkbox mr={3} />
                  <Text>{qs.questionText}</Text>
                </InputLeftElement>
                <InputRightElement>
                  <Text>{renderTag(getTopicName(qs.topicId))}</Text>
                </InputRightElement>
              </InputGroup>
            );
          })}
        </VStack>
      </Box>
    );
  };

  const onClickCreateNewQuestion = () => {
    setSelectingCreateOrImportQuestion(false);
    setIsImportingQuestion(false);
  };

  const onClickImportQuestion = () => {
    setSelectingCreateOrImportQuestion(false);
    setIsImportingQuestion(true);
  };

  return (
    <>
      <Flex ref={finalRef} height="100" width="100" mt="10">
        <Box flex="1" px="5">
          <Text fontWeight="bold" fontSize="2xl">Question List</Text>
          {quiz.questions?.length !== 0 ? renderQuestionLinks() : <Text my="3">There are no questions in the quiz. Add a question!</Text>}
        </Box>
        <Box flex="0.1" borderLeft="1px" borderColor="gray.400" height="890px" />
        <Box flex="2.5" pl="10" pr="20">
          {renderQuestions()}
        </Box>
        <Box flex="0.1" borderLeft="1px" borderColor="gray.400" height="890px" />
        <Box flex="1">
          {renderQuizDetails()}
        </Box>
      </Flex>

      {renderNewQuestionModal()}
    </>
  );
}