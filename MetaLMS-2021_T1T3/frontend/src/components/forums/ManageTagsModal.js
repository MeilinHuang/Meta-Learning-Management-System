import React, { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Table,
  Tbody,
  Tr,
  Td,
  useToast,
} from "@chakra-ui/react";
import { GrAdd } from "react-icons/gr";
import { BsTrash } from "react-icons/bs";
import { backend_url } from "../../Constants"

function ManageTagsModal({ isOpen, onClose, tags, setTags, code }) {
  const [tagName, setTagName] = useState("");
  const toast = useToast();

  const handleDelete = (id, onClose) => {
    fetch(`${backend_url}${code}/forum/tags/${id}`, {
      method: "DELETE",
    }).then((r) => {
      if (r.status === 200) {
        fetch(`${backend_url}${code}/forum/tags`, { method: "PUT" })
          .then((r) => r.json())
          .then((data) => {
            setTags(data);
            onClose();
          });
      } else {
        toast({
          title: "Sorry, an error has occurred",
          description: "Please try again",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    });
  };

  const getRow = ({ tag_id, name }) => {
    return (
      <Tr>
        <Td width="80%" py="0">
          {name}
        </Td>
        <Td py="0">
          <Popover>
            {({ onClose }) => (
              <>
                <PopoverTrigger>
                  <IconButton
                    icon={<BsTrash />}
                    color="red"
                    borderRadius="6px"
                    backgroundColor="white"
                  />
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverHeader fontWeight="semibold">
                    Confirmation
                  </PopoverHeader>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverBody>
                    Are you sure you want to delete this tag? Existing posts
                    will lose this tag.
                  </PopoverBody>
                  <PopoverFooter d="flex" justifyContent="flex-end">
                    <ButtonGroup size="sm">
                      <Button variant="outline">Cancel</Button>
                      <Button
                        colorScheme="red"
                        onClick={() => handleDelete(tag_id, onClose)}
                      >
                        Delete
                      </Button>
                    </ButtonGroup>
                  </PopoverFooter>
                </PopoverContent>
              </>
            )}
          </Popover>
        </Td>
      </Tr>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${backend_url}${code}/forum/tags`, {
      method: "POST",
      body: JSON.stringify({
        tagName,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((r) => {
        if (r.status === 200) {
          e.target.reset();
          toast({
            description: `Tag ${tagName} has been added`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          fetch(`${backend_url}${code}/forum/tags`, { method: "PUT" })
            .then((r) => r.json())
            .then((data) => setTags(data));
        } else {
          return r.json();
        }
      })
      .then((r) => {
        if (r && r.error) {
          toast({
            title: r.error,
            description: "Please try a different tag name",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl" p="24px">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Manage Tags</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Heading size="sm" mb="4px">
            Tags
          </Heading>
          <Box height="250px" overflowY="scroll" mb="24px">
            <Table variant="simple" size="sm">
              <Tbody>
                {tags &&
                  tags[0] !== null &&
                  tags.tags &&
                  tags.tags.map((tag) => getRow(tag))}
              </Tbody>
            </Table>
          </Box>
          <form id="createTag" onSubmit={handleSubmit}>
            <Flex flexDirection="column" mb="16px">
              <Heading size="sm" mb="4px">
                Create Tags
              </Heading>
              <Flex>
                <Input
                  name="tagName"
                  placeholder="Tag Name"
                  onChange={(e) => setTagName(e.target.value)}
                />
                <IconButton
                  ml="8px"
                  icon={<GrAdd />}
                  borderRadius="6px"
                  form="createTag"
                  type="submit"
                />
              </Flex>
            </Flex>
          </form>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ManageTagsModal;
