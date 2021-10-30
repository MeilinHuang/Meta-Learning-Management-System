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

function generateNewQuiz() {
  return {
    name: "",
    topicGroupId: 1,
    open_date: new Date(),
    close_date: new Date(),
    time_given: 30,
    num_questions: 0,
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
  const [test, setTest] = useState([]);

  const stopics = [
    "Arrays",
    "Variables",
    "Linked lists",
    "Functions"
  ]

  /*
  useEffect(async function () {
    fetch(backend_url + "topicGroup", {
      headers: {
        "Content-Type": "application/JSON",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then(function (response) {
        setTest(response);
      });
  }, []);
  */

  useEffect(() => {
    // Generate new quiz
    const newQuizTemplate = generateNewQuiz();
    console.log("QUIZ NAME " + quizName);
    newQuizTemplate.name = quizName;
    setQuiz(newQuizTemplate);
    setTopics(stopics);

    async function fetchTopics() {
      let response = await fetch(backend_url + "topicGroup", {
        method: "GET",
        headers: {
          "Content-Type": "application/JSON",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const resJson = await response.json();
      setTest(resJson);
    }

    // fetchTopics();
    getTopics();
    getQuestionBank();
  }, []);

  const getTopics = () => {
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
        // Set question bank variable
        // setQuestionBank(data);
        setTest(data);
      });
  };

  const getQuestionBank = () => {
    console.log("TEST");
    console.log(test);
    // TODO: Get from database when connecting with backend

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
        console.log(data);
      });
  };

  const onChangeOpenDate = (date) => {
    setQuiz({ ...quiz, open_date: date });
  }

  const onChangeCloseDate = (date) => {
    setQuiz({ ...quiz, close_date: date });
  }

  const renderQuizDetails = () => {
    const marksReducer = (accumulator, currentQuestion) => accumulator + currentQuestion.marks_awarded;

    let allRelatedTopics = {};
    let sortedRelatedTopicsList = [];
    for (let i = 0; i < quiz.questions?.length; i++) {
      const currentTopicId = quiz.questions[i].related_topic_id;
      const currentTopic = topics[currentTopicId];
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

        <HStack d="flex" my="2">
          <Text fontWeight="bold">Open date: </Text>
          <DatePicker
            selected={quiz.open_date}
            onChange={onChangeOpenDate}
            showTimeSelect
            dateFormat="Pp"
          />
        </HStack>

        <HStack d="flex" my="2">
          <Text fontWeight="bold">Due date: </Text>
          <DatePicker
            selected={quiz.close_date}
            onChange={onChangeCloseDate}
            showTimeSelect
            dateFormat="Pp"
          />
        </HStack>

        <HStack my="2" align>
          <Text fontWeight="bold">Time given: </Text>
          <Text>{quiz.time_given}</Text>
        </HStack>

        <HStack align>
          <Text mb="2" fontWeight="bold">Number of questions: </Text>
          <Text>{quiz.num_questions}</Text>
        </HStack>

        <HStack align>
          <Text mb="2" fontWeight="bold">Total marks: </Text>
          <Text>{quiz.questions?.reduce(marksReducer, 0)}</Text>
        </HStack>

        <Box maxWidth="300">
          <Text mb="2" fontWeight="bold">Related topics: </Text>
          {sortedRelatedTopicsList.map((topic) => <Box width="fit-content">{renderTag(topic + " (" + allRelatedTopics[topic] + ")")}</Box>)}
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

    const quizData = {
      name: quiz.name,
      topicGroupId: quiz.topicGroupId,
      open_date: quiz.open_date,
      close_date: quiz.close_date,
      time_given: quiz.time_given,
      num_questions: quiz.num_questions,
    }

    // Post new quiz 
    fetch(`${backend_url}/topicGroup/${quiz.topicGroupId}/quizzes`, {
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
        // TODO: Handle error case
      })
      .then((data) => {
        // TODO: Redirect back to QuizCreation/Quiz List
        // history.push(`/course-page/${course}/forums/${data.post_id}`);

        // Post each question
      });

      // Post questions

      // Post each question's possible answers? 
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
      if (expandedIndices.includes(index) && !obj.is_expanded) {
        obj.is_expanded = true;
      }
      else if (!expandedIndices.includes(index) && obj.is_expanded) {
        obj.is_expanded = false;
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
      if (qs.is_expanded) {
        expandedQuestions.push(index);
      }
    });

    return expandedQuestions;
  };

  const expandAllQuestions = () => {
    let newQuestions = quiz.questions?.map((qs, index) => {
      const obj = Object.assign({}, qs);
      obj.is_expanded = true;
      return obj;
    });

    setQuiz({ ...quiz, questions: newQuestions });
  };

  const collapseAllQuestions = () => {
    let newQuestions = quiz.questions?.map((qs, index) => {
      const obj = Object.assign({}, qs);
      obj.is_expanded = false;
      return obj;
    });

    setQuiz({ ...quiz, questions: newQuestions });
  };

  const addQuestionToQuiz = (newQuestion) => {
    // Update questions in quiz
    const updatedQuestions = quiz.questions.concat([newQuestion])
    setQuiz({ ...quiz, num_questions: quiz.num_questions + 1, questions: updatedQuestions });
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
    return (
      <HStack key={index}>
        <Button colorScheme="teal" variant="link" onClick={() => toggleQuestionItem(+index)}>Question {index + 1}</Button>
        <Text size="sm" color="grey">({qs.marks_awarded} {qs.marks_awarded > 1 ? "marks" : "mark"})</Text>
        {renderTag(topics[qs.related_topic_id])}
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
    // TODO: Make POST request to add question to question bank

    // Remove this later once above TODO is complete
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
    console.log("RENDERED IMPORT QUESTION SCREEN - TEST");
    console.log(test);

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
                  <Text>{qs.questiontext}</Text>
                </InputLeftElement>
                <InputRightElement>
                  <Text>{renderTag(stopics[qs.topicid])}</Text>
                </InputRightElement>
              </InputGroup>
            );
          })}
        </VStack>
      </Box>
    );
  };

  const renderQuestionFromQuestionBank = (qs) => {
    return (
      <InputGroup>
        <InputLeftElement>
          <Text>{qs.question_text}</Text>
        </InputLeftElement>
        <InputRightElement>
          <Text>{renderTag(topics[qs.related_topic_id])}</Text>
        </InputRightElement>
      </InputGroup>
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
        <Box flex="1" pl="5">
          <Text fontWeight="bold" fontSize="2xl">Question List</Text>
          {quiz.questions?.length !== 0 ? renderQuestionLinks() : <Text my="3">There are no questions in the quiz. Add a question!</Text>}
        </Box>
        <Box flex="0.1" borderLeft="1px" borderColor="gray.400" height="890px" />
        <Box flex="2.5" px="20">
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