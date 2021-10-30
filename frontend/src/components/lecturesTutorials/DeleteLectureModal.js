import React, { useState } from "react";
import {
  Button,
  Flex,
  Heading,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useToast,
} from "@chakra-ui/react";

function AddPostModal({
  isOpen,
  onClose,
  onSubmit,
  code
}) {
  const [week, setWeek] = useState();
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    e.target.reset();

    if (!week) {
      toast({
        title: "Required fields missing",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // const timeZoneOffset = new Date().getTimezoneOffset() * 60000;
    // const date = new Date(Date.now() - timeZoneOffset).toISOString();

    fetch(`http://localhost:8000/${code}/lecture/${week}`, {
      method: "DELETE",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(r => r.json())
    .then(data => {
      onSubmit();
    })

    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        isCentered
        size="xl"
        p="24px"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Delete Lecture
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              id="createLecture"
              onSubmit={handleSubmit}
              enctype="multipart/form-data"
            >
              <Flex flexDirection="column" mb="16px">
                <Heading size="sm" mb="4px">
                  Week:
                </Heading>
                <Input
                  name="lectureWeek"
                  onChange={(e) => setWeek(e.target.value)}
                  autoFocus
                />
              </Flex>
            </form>
          </ModalBody>
          <ModalFooter display="flex" justifyContent="center">
            <Button type="submit" form="createLecture">
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddPostModal;