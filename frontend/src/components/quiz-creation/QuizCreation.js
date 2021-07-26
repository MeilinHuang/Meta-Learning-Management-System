import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  Textarea
} from "@chakra-ui/react"

import QuestionCreation from '../question-creation/QuestionCreation';

export default function QuizCreation() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const inputRef = React.useRef();

  const onHandleButtonClick = (e) => {
    setOpen(true);
  };

  const handleDialogClose = (e) => {
    setOpen(false);
  };

  const handleSubmit = (e) => {

  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  return (
    <>
      <Button size="sm" id="add-quiz" aria-label="Add Quiz" variant="solid" colorScheme="green" onClick={onHandleButtonClick}>
        <Text as="span" display={{ base: 'none', sm: 'inline' }} ml={2}>
          New question
        </Text>
      </Button>

      <Modal
        // initialFocusRef={inputRef}
        onClose={handleDialogClose}
        isOpen={open}
      >
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit}>
          <ModalHeader>Add a Question</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl >
              <FormControl>
                <FormLabel htmlFor="name">
                  Give your quiz a name
                </FormLabel>
                <Input autoComplete="off" ref={inputRef} id="name" name="name" value={name} onChange={handleNameChange} />
              </FormControl>
              
              {/* <Text my={4} fontStyle="italic" textAlign="center" fontSize="lg">or</Text> */}
             
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button aria-label="Close" onClick={handleDialogClose}>Close</Button>
            <Button
              type="submit"
              ml={3}
              colorScheme="green"
              aria-label="add quiz"
            >
              Add Quiz
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};