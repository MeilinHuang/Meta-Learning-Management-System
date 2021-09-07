import React, {useEffect, useState} from "react"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    CloseButton,
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
import Select from "./ChakraReactSelect.js";
import { delete_topic_url, delete_prereqs, add_prereqs } from "../../Constants";


export default function TopicTreeViewResource({data, isOpen, onClose, prereqs, topicGroupName, nodes}) {
  const [tempPrereqs, setTempPrereqs] = useState([]);
  const [hasDeleted, setHasDelete] = useState(false);
  const [showAddPrereqBox, setShowAddPrereqBox] = useState(false);
  const [notPrereqs, setNotPrereqs] = useState([]);
  useEffect(() => {
    setTempPrereqs(prereqs);
  }, [prereqs]);

  useEffect(() => {
    setNotPrereqs(nodes);
  }, [nodes]);

  const deleteTopic = async () => {
    await fetch(delete_topic_url(topicGroupName, data.title), {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json'
      }
    });
    
    window.location.reload();
  };

  const deletePrerequisite = async (prereqToDelete) => {
    // Delete from array
    let copyPrereqs = JSON.parse(JSON.stringify(tempPrereqs));
    const index = tempPrereqs.indexOf(prereqToDelete);
    
    if (index > -1) {
      copyPrereqs.splice(index, 1);
    }
    
    setTempPrereqs(copyPrereqs);
    setHasDelete(true);
    await fetch(delete_prereqs(topicGroupName, data.title), {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'preReqId': prereqToDelete.id,
        'topicId': data.id
      }),
    });
  }

  const closeModal = () => {
    if (hasDeleted) {
      window.location.reload();
    } else {
      onClose();
    }
  }

  const showAddPrereq = () => {
    setShowAddPrereqBox(true);
  }

  const hideAddPrereq = () => {
    setShowAddPrereqBox(false);
  }

  const addPrereq = async(newPrereq, action) => {
    console.log('newPrereqId', newPrereq);

    // Add to prereqs
    let copyPrereqs = JSON.parse(JSON.stringify(tempPrereqs));
    copyPrereqs.push({
      'name': newPrereq.label,
      'id': newPrereq.value
    });
    
    setTempPrereqs(copyPrereqs);

    // delete from non prereqs
    let copyNonPrereqs = JSON.parse(JSON.stringify(notPrereqs));
    console.log('copyNonPrereqs', copyNonPrereqs);
    const index = nodes.indexOf(newPrereq);
    if (copyNonPrereqs.length > 1) {
      if (index > -1) {
        copyNonPrereqs.splice(index, 1);
      }
    } else {
      copyNonPrereqs = [];
    }

    
    setNotPrereqs(copyNonPrereqs);

    setHasDelete(true); // reload when modal is closed so graph is updated
    setShowAddPrereqBox(false);
    
    fetch(add_prereqs(topicGroupName, data.title), {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'preReqId': newPrereq.value,
        'topicId': data.id
      }),
    })
  }

  const typesOfFiles = ["Content", "Practice", "Preparation", "Assessments"];
  return (
    <>
    
      <Modal isOpen={isOpen} onClose={() => closeModal()} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
        <ModalHeader>Topic Resources - {data.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Box>
              <Heading as="h5" size="sm">Prerequisites</Heading>
              <Table variant="simple" mb={8}>
              
                <Tbody>
                  
                  {tempPrereqs.map((prereq) => {
                    return (
                      <Tr key={prereq.name}>
                        <Td>{prereq.name}</Td>
                        <Td><Button colorScheme="red" onClick={() => {deletePrerequisite(prereq)}}>Delete</Button></Td>
                      </Tr>
                    );
                  })}
                  {showAddPrereqBox ?
                  <Tr>
                    <Td><Select
                                name="prereqs"
                                options={notPrereqs}
                                placeholder="Select a topic..."
                                closeMenuOnSelect={false}
                                size="sm"
                                onChange={addPrereq}
                            /></Td>
                    <Td><Flex flexDirection="row" w="8rem" alignItems="center" justifyContent="space-between"><Button colorScheme="green">Done</Button><CloseButton onClick={hideAddPrereq}/></Flex></Td>
                  </Tr>
                  : <></>}
                </Tbody>
              </Table>
              {tempPrereqs.length == 0 ? <h6>No prerequisites here!</h6> : <></>}
              <Button mb={5} colorScheme="blue" onClick={showAddPrereq}>Add prerequisite</Button>
            </Box>
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
                  
                  {data.materials_strings[typeOfFile.toLowerCase()].map((file_string) => {
                    return (
                      <Tr key={file_string}>
                        <Td>{file_string}</Td>
                        <Td><Button colorScheme="green" mr={3}>Download file</Button></Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
              {data.materials_strings[typeOfFile.toLowerCase()].length == 0 ? <h6>No files here!</h6> : <></>}
              <Button colorScheme="blue" mt={3}>Upload file</Button>
              </Box>
            )})}
          </Box>
        </ModalBody>

        <ModalFooter>
            <Flex>
              <Button colorScheme="red" mr={3} onClick={deleteTopic}>Delete Topic</Button>
              <Button colorScheme="blue" mr={3} onClick={() => closeModal()}>Close</Button>
            </Flex>
        </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}