import React from "react"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    Box,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    Heading,
    UnorderedList,
    ListItem
} from "@chakra-ui/react"  


export default function TopicTreeViewResource({data, isOpen, onClose, prereqs}) {
  return (
    <>
    
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
        <ModalHeader>Topic Resources - {data.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Heading as="h5" size="sm">Prerequisites</Heading>
            <UnorderedList mb={10}>
              {prereqs.map((prereq) => {
                return (
                  <ListItem>{prereq}</ListItem>
                );
              })}
            </UnorderedList>
            <Heading as="h5" size="sm">Files</Heading>
            <Table variant="simple">
              <Thead>
                <Tr>
                    <Th>File Name</Th>
                    <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.materials_strings.content.map((file_string) => {
                  return (
                    <Tr>
                      <Td>{file_string}</Td>
                      <Td><Button colorScheme="green" mr={3}>Download file</Button></Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
            <Button colorScheme="green" mt={3}>Upload file</Button>
          </Box>
        </ModalBody>

        <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>Close</Button>
        </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}