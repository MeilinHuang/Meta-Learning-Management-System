import React, {useEffect} from "react"
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
    Flex,
    Box,
    Spacer,
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
} from "@chakra-ui/react";
import { delete_topic_url } from "../../Constants";


export default function TopicTreeViewResource({data, isOpen, onClose, prereqs, topicGroupName}) {
  const deleteTopic = async () => {
    await fetch(delete_topic_url(topicGroupName, data.title), {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json'
      }
    });
    console.log('deleting topic', data);
    window.location.reload();
  };
  const typesOfFiles = ["Practice", "Content", "Preparation", "Assessments"];
  console.log('typesOfFiles', typesOfFiles);
  return (
    <>
    
      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
        <ModalHeader>Topic Resources - {data.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            
            <Heading as="h5" size="sm">Prerequisites</Heading>
            {prereqs.length == 0 ? <>No prerequisites here!</> : <></>}
            <UnorderedList mb={10}>
              {prereqs.map((prereq) => {
                return (
                  <ListItem key={prereq}>{prereq}</ListItem>
                );
              })}
            </UnorderedList>
            {typesOfFiles.map((typeOfFile) => {
              return (
              <Box key={typeOfFile} mb={3} >
              <Heading as="h5" size="sm">{typeOfFile}</Heading>
              <Table variant="simple">
                <Thead>
                  <Tr>
                      <Th>File Name</Th>
                      <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.materials_strings[typeOfFile.toLowerCase()].length == 0 ? <>No files here!</> : <></>}
                  {data.materials_strings[typeOfFile.toLowerCase()].map((file_string) => {
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
            )})}
          </Box>
        </ModalBody>

        <ModalFooter>
            <Flex>
              <Button colorScheme="red" mr={3} onClick={deleteTopic}>Delete Topic</Button>
              <Button colorScheme="blue" mr={3} onClick={onClose}>Close</Button>
            </Flex>
        </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}