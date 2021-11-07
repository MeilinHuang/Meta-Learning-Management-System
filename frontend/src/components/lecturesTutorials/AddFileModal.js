import React, { useState } from "react";
import {
  Button,
  Flex,
  Heading,
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
  lectureId
}) {
  const [attachments, setAttachments] = useState([]);
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    e.target.reset();

    if (attachments.length === 0) {
      toast({
        title: "Required fields missing",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("targetId", lectureId);
    formData.append("uploadFile", attachments);

    onSubmit(formData);
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
            Add new file
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              id="createLecture"
              onSubmit={handleSubmit}
              enctype="multipart/form-data"
            >
              <Flex flexDirection="column" mb="16px" marginBottom="-2%">
                <Heading size="sm" mb="4px" paddingBottom="1%">
                  Attachments:
                </Heading>
                <input type="file" name="lectureFiles" onChange={handleUpload} />
              </Flex>
            </form>
          </ModalBody>
          <ModalFooter display="flex" justifyContent="center">
            <Button type="submit" form="createLecture">
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddPostModal;