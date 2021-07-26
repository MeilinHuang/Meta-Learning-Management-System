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
  VStack
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
  const [dueDate, setDueDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const inputRef = React.useRef();

  useEffect(() => {
    // Generate new quiz
    const newQuizTemplate = generateNewQuiz();
    setQuiz(newQuizTemplate);
  }, []);

  const onChangeDueDate = (date) => {
    quiz.due_date = date;
  }

  const renderQuizDetails = () => {
    return (
      <Box>       
        <Text fontWeight="bold" fontSize="2xl">Quiz Details</Text>
        <Box display="inline-flex" my="2">
          <Text fontWeight="bold">Name: </Text>
          <Textarea placeholder="Enter quiz name" size="sm" onChange={(e) => setQuiz({ name: e.target.value })} value={quiz.name} />
        </Box>

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
              Question {qsIndex + 1}
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Box>
            <QuestionCreation />
          </Box>
        </AccordionPanel>        
      </Box>
    );
  };

  const renderQuestions = () => {
    return (
      <Box>
        <HStack>
          <Box d="flex" width="25rem">
            <Heading>Questions</Heading>
          </Box>
          <HStack spacing="5">
            <Button size="sm" colorScheme="green" onClick={onHandleButtonClick}>New question</Button>
            <Button size="sm" colorScheme="blue" onClick={expandAllQuestions}>Expand all</Button>
            <Button size="sm" colorScheme="red" onClick={collapseAllQuestions}>Collapse all</Button>
          </HStack>
        </HStack>
        <Accordion my="3" allowToggle allowMultiple>
          {quiz.questions?.length > 0 && quiz.questions.map((qs, index) => (<AccordionItem>{renderQuestionItem(qs, index)}</AccordionItem>))}
        </Accordion>
      </Box>
    );
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
          {quiz.questions?.map((qs, index) => <Link color="teal.500" href="#">Question {index + 1}</Link>)}
        </Stack>
      </Box>
    );
  }

  const expandAllQuestions = () => {

  };

  const collapseAllQuestions = () => {

  };

  const openAddQuestionModal = () => {
    return (
      <Box>

      </Box>
    );
  };

  const onHandleButtonClick = (e) => {
    setOpen(true);
  };

  const handleDialogClose = (e) => {
    setOpen(false);
  };

  const handleSubmit = (e) => {

  };

  const renderNewQuestionModal = () => {
    return (
      <Modal
        // initialFocusRef={inputRef}
        onClose={handleDialogClose}
        isOpen={open}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit}>
          <ModalHeader>Add a Question</ModalHeader>
          <ModalCloseButton />
          <ModalBody>  
              {/* <Text my={4} fontStyle="italic" textAlign="center" fontSize="lg">or</Text> */}
              <QuestionCreation addQuestionToQuiz={addQuestionToQuiz}/>
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
    <Flex height="100" width="100" mt="10">
      <Box flex="1" pl="5">
        <Text fontWeight="bold" fontSize="2xl">Question List</Text>
        {quiz.questions?.length !== 0 ? renderQuestionLinks() : <Text my="3">There are no questions in the quiz. Add a question!</Text>}
      </Box>
      <Divider orientation="vertical" />
      <Box flex="2.5" px="20">
        {renderQuestions()}
      </Box>
      <Divider orientation="vertical" />
      <Box flex="1">
        {renderQuizDetails()}
      </Box>
      <Box>
        {renderNewQuestionModal()}
      </Box>
    </Flex>
  );
}