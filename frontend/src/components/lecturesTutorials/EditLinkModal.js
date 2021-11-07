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

function EditLinkModal({
  isOpen,
  onClose,
  onSubmit
}) {
  const [link, setLink] = useState();
  const toast = useToast();

  function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // e.target.reset();

    if (!link) {
      toast({
        title: "Required fields missing",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!validURL(link)) {
      toast({
        title: "Invalid link",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("link", link);

    onSubmit(formData);
    setLink();
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
            Update link
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
                  Link:
                </Heading>
                <Input
                  name="lectureLink"
                  onChange={(e) => {
                    setLink(e.target.value);
                  }}
                  autoFocus
                />
              </Flex>
            </form>
          </ModalBody>
          <ModalFooter display="flex" justifyContent="center">
          <Button 
          type="submit" 
          form="updateLecture" 
          onClick={(e) => handleSubmit(e)}
          marginTop="-2%"
          >
            Update
          </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EditLinkModal;