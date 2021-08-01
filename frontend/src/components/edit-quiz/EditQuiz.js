import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
  Textarea,
  VStack,
  useDisclosure
} from "@chakra-ui/react"

import DatePicker from "react-datepicker";
import QuestionCreation from '../question-creation/QuestionCreation';

function generateNewQuiz() {
  return {
    name: "New Quiz",
    due_date: new Date(),
    time_given: 30,
    num_questions: 0,
    questions: [
    ]
  }
};

export default function EditQuiz() {
  const [quiz, setQuiz] = useState({}); // list of dictionaries [{}, {}, ...]
  const [name, setName] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure()
  const finalRef = React.useRef()

  const topics = [
    "Arrays",
    "Variables",
    "Linked lists",
    "Functions"
  ]

  useEffect(() => {
    // Generate new quiz
    const newQuizTemplate = generateNewQuiz();
    setQuiz(newQuizTemplate);
  }, []);

  const onChangeDueDate = (date) => {
    setQuiz({ ...quiz, due_date: date });
  }

  const renderQuizDetails = () => {
    const marksReducer = (accumulator, currentQuestion) => accumulator + currentQuestion.marks_awarded;

    let allRelatedTopics = {};
    let sortedRelatedTopicsList = [];
    for (let i = 0; i < quiz.questions?.length; i++) 
    {
      const currentTopicId = quiz.questions[i].related_topic_id;
      const currentTopic = topics[currentTopicId];
      if (!(currentTopic in allRelatedTopics)) 
      {
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
          <Text fontWeight="bold">Due date: </Text>
          <DatePicker
            selected={quiz.due_date}
            onChange={onChangeDueDate}
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
          <Button size="sm" colorScheme="green">Save quiz</Button>
        </HStack>
      </Box>
    );
  }

  const renderQuiz = () => {
    return (
      <Box>
        
      </Box>
    );
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
              <Button size="sm" colorScheme="green" onClick={onOpen}>New question</Button>
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

  const onChangeQuestionItems = (expandedIndices) => {
    let newQuestions = quiz.questions?.map((qs, index) => { 
      const obj = Object.assign({}, qs);
      if (expandedIndices.includes(index) && !obj.is_expanded)
      {
        obj.is_expanded = true;
      }
      else if (!expandedIndices.includes(index) && obj.is_expanded)
      {
        obj.is_expanded = false;
      }
      return obj;
    });

    setQuiz({ ...quiz, questions: newQuestions});
  };

  const toggleQuestionItem = (questionIndex) => {
    let updatedExpandedQuestions = getExpandedQuestions();
    
    if (updatedExpandedQuestions.includes(questionIndex))
    {
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
      if (qs.is_expanded)
      {
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

    setQuiz({ ...quiz, questions: newQuestions});
  };

  const collapseAllQuestions = () => {
    let newQuestions = quiz.questions?.map((qs, index) => { 
      const obj = Object.assign({}, qs);
      obj.is_expanded = false;
      return obj;
    });

    setQuiz({ ...quiz, questions: newQuestions});
  };

  const addQuestionToQuiz = (newQuestion) => {

    // TODO: Add question to quiz (pass data)
    const updatedQuestions = quiz.questions.concat([newQuestion])
    setQuiz({ ...quiz, num_questions: quiz.num_questions + 1, questions: updatedQuestions});
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

  const renderNewQuestionModal = () => {
    return (
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        size="xl"
        finalFocusRef={finalRef}
      >
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit}>
          <ModalHeader>Add a Question</ModalHeader>
          <ModalCloseButton />
          <ModalBody>  
              <QuestionCreation addQuestionToQuiz={addQuestionToQuiz} topics={topics} isCreatingQuestion={true}/>
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

  return (
    <>
      <Flex ref={finalRef} height="100" width="100" mt="10">
        <Box flex="1" pl="5">
          <Text fontWeight="bold" fontSize="2xl">Question List</Text>
          {quiz.questions?.length !== 0 ? renderQuestionLinks() : <Text my="3">There are no questions in the quiz. Add a question!</Text>}
        </Box>
        <Divider orientation="vertical"/>
        <Box flex="2.5" px="20">
          {renderQuestions()}
        </Box>
        <Divider orientation="vertical" />
        <Box flex="1">
          {renderQuizDetails()}
        </Box>
      </Flex>

      {renderNewQuestionModal()}
    </>
  );
}