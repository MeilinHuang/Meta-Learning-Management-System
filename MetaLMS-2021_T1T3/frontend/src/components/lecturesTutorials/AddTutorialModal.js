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

function AddTutorialModal({
  isOpen,
  onClose,
  onSubmit
}) {
  const [week, setWeek] = useState();
  const [attachments, setAttachments] = useState([]);
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    e.target.reset();

    if (!week || attachments.length === 0) {
      toast({
        title: "Required fields missing",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formArr = [];

    const formData = new FormData();
    formData.append("week", week);

    const fileFormData = new FormData();
    fileFormData.append("uploadFile", attachments);

    formArr.push(formData);
    formArr.push(fileFormData);

    onSubmit(formArr);
    setAttachments([]);

    onClose();
  };

  // handle upload
  const handleUpload = e => {
    setAttachments(e.target.files[0])
  }

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
            Create new tutorial week
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              id="createTutorial"
              onSubmit={handleSubmit}
              enctype="multipart/form-data"
            >
              <Flex flexDirection="column" mb="16px">
                <Heading size="sm" mb="4px" paddingBottom="1%">
                  Week:
                </Heading>
                <Input
                  name="tutorialWeek"
                  onChange={(e) => setWeek(e.target.value)}
                  autoFocus
                />
              </Flex>
              <Flex flexDirection="column" mb="16px" marginBottom="-2%">
                <Heading size="sm" mb="4px" paddingBottom="1%">
                  Attachments:
                </Heading>
                <input type="file" name="tutorialFiles" onChange={handleUpload} />
              </Flex>
            </form>
          </ModalBody>
          <ModalFooter display="flex" justifyContent="center">
            <Button type="submit" form="createTutorial">
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddTutorialModal;