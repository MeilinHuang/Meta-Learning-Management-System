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
  isLectures,
  onSubmit,
  code
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

    // const timeZoneOffset = new Date().getTimezoneOffset() * 60000;
    // const date = new Date(Date.now() - timeZoneOffset).toISOString();

    const formArr = [];

    const formData = new FormData();
    formData.append("lecturerId", localStorage.getItem("id"));
    formData.append("week", week);
    // formData.append("startTime", date);
    // formData.append("endTime", date);

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
            Create new lecture week
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              id="createLecture"
              onSubmit={handleSubmit}
              enctype="multipart/form-data"
            >
              <Flex flexDirection="column" mb="16px">
                <Heading size="sm" mb="4px" paddingBottom="1%">
                  Week:
                </Heading>
                <Input
                  name="lectureWeek"
                  onChange={(e) => setWeek(e.target.value)}
                  autoFocus
                />
              </Flex>
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
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddPostModal;