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

function EditLectureModal({
  isOpen,
  onClose,
  onSubmit,
  lectureId
}) {
  const [week, setWeek] = useState();
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    // e.target.reset();

    if (!week) {
      toast({
        title: "Required fields missing",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("week", week);

    onSubmit(formData, lectureId);
    setWeek();
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
            Update lecture
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              id="updateLecture"
              onSubmit={handleSubmit}
              enctype="multipart/form-data"
            >
              <Flex flexDirection="column" mb="16px">
                <Heading size="sm" mb="4px" paddingBottom="1%">
                  Week:
                </Heading>
                <Input
                  name="lectureWeek"
                  onChange={(e) => {
                    setWeek(e.target.value);
                  }}
                  autoFocus
                />
              </Flex>
            </form>
          </ModalBody>
          <ModalFooter display="flex" justifyContent="center">
          <Button type="submit" form="updateLecture" onClick={(e) => handleSubmit(e)}>
            Update
          </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EditLectureModal;