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
import { delete_topic_url, delete_prereqs, add_prereqs, update_topic, post_topic_tag } from "../../Constants";
import { set } from "draft-js/lib/DefaultDraftBlockRenderMap";


export default function TopicTreeViewResource({data, isOpen, onClose, prereqs, topicGroupName, nodes}) {
  const [tempFiles, setTempFiles] = useState({
    'content': [],
    'assessments': [],
    'practice': [],
    'preparation': []
  });
  const [tempPrereqs, setTempPrereqs] = useState([]);
  const [hasDeleted, setHasDelete] = useState(false);
  const [showAddPrereqBox, setShowAddPrereqBox] = useState(false);
  const [showAddTagBox, setShowAddTagBox] = useState(false);
  const [notPrereqs, setNotPrereqs] = useState([]);
  const [files, setFiles] = useState({});
  const [newTag, setNewTag] = useState("");
  const [tempTags, setTempTags] = useState([]);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    
    
    setTempPrereqs(prereqs);
    setTempTags(data.tags);
    setTempFiles(data.materials_strings);
  }, [prereqs]);

  useEffect(() => {
    let isStaff = localStorage.getItem('staff');
    if (isStaff !== null) {
        setIsStaff(parseInt(isStaff) !== 0);
    }
    setNotPrereqs(nodes);
  }, [nodes]);

  const createNewTag = async () => {
    await fetch(post_topic_tag(topicGroupName, data.title), {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        tagName: newTag
      })
    });
    let copyTempTags = JSON.parse(JSON.stringify(tempTags));
    copyTempTags.push({
      'name': newTag
    });
    setTempTags(copyTempTags);
    setNewTag("");
    hideAddTag();
    setHasDelete(true);
  }

  const deleteTopic = async () => {
    await fetch(delete_topic_url(topicGroupName, data.title), {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
      }
    });
    
    window.location.reload();
  };

  const deleteTag = async (tagToDelete) => {
    
    let copyTags = JSON.parse(JSON.stringify(tempTags));
    const result = copyTags.filter(tag => tag.name != tagToDelete.name);
    
    setTempTags(result);
    await fetch(post_topic_tag(topicGroupName, data.title), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        'tagName': tagToDelete.name
      })
    });

    // window.location.reload();
  }

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
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        'preReqId': prereqToDelete.id,
        'topicId': data.id
      }),
    });
  }

  const handleUpload = (e, typeOfFile) => {
    e.preventDefault();
    let tempFiles = JSON.parse(JSON.stringify(files));
    tempFiles[typeOfFile] = e.target.files[0];
    setFiles(tempFiles);
    
  }

  const uploadFile = async (e, typeOfFile) => {
    e.preventDefault();
    e.stopPropagation();
    const formData = new FormData();
    formData.append('name', data.title);
    formData.append('uploadFile', files[typeOfFile]);
    if (typeOfFile == 'Assessments') {
      formData.append('uploadedFileTypes', 'assessment');
    } else {
      formData.append('uploadedFileTypes', typeOfFile.toLowerCase());
    }
    let copyFiles = JSON.parse(JSON.stringify(tempFiles));
    console.log('copyFiles', copyFiles['practice']);
    if (typeOfFile == 'Assessments') {
      copyFiles['assessments'].push(files[typeOfFile].name); 
    } else {
      copyFiles[typeOfFile.toLowerCase()].push(files[typeOfFile].name);
    }
    console.log(files[typeOfFile]);

    setTempFiles(copyFiles);
    await fetch(update_topic(topicGroupName, data.title), {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData
    });
    return false;
  }

  const deleteFile = async (e, typeOfFile, name) => {
    e.preventDefault();
    
    let copyFiles = JSON.parse(JSON.stringify(tempFiles));
    const index = tempFiles[typeOfFile.toLowerCase()].indexOf(name);
    
    if (index > -1) {
      copyFiles[typeOfFile.toLowerCase()].splice(index, 1);
    }
    
    

    setTempFiles(copyFiles);
    const formData = new FormData();
    formData.append('name', data.title);
    formData.append('fileDeleteList', name);
    formData.append('uploadedFileTypes', 'pdf');
    
    await fetch(update_topic(topicGroupName, data.title), {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData
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

  const showAddTag = () => {
    setShowAddTagBox(true);
  }

  const hideAddTag = () => {
    setShowAddTagBox(false);
  }

  const addPrereq = async(newPrereq, action) => {
    

    // Add to prereqs
    let copyPrereqs = JSON.parse(JSON.stringify(tempPrereqs));
    copyPrereqs.push({
      'name': newPrereq.label,
      'id': newPrereq.value
    });
    
    setTempPrereqs(copyPrereqs);

    // delete from non prereqs
    let copyNonPrereqs = JSON.parse(JSON.stringify(notPrereqs));
    
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
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        'preReqId': newPrereq.value,
        'topicId': data.id
      }),
    })
  }

  const downloadFile = (e, fileString) => {
    window.open('/_files/topicGroup' + data.groupId + '/topic' + data.id + '/' + fileString);
  }

  const typesOfFiles = ["Content", "Practice", "Preparation", "Assessments"];
  return (
    <>
    
      <Modal isOpen={isOpen} onClose={() => closeModal()} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
        <ModalHeader>{data.title} - {data.group} Group</ModalHeader>
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
                        {isStaff ? 
                        <Td><Button colorScheme="red" onClick={() => {deletePrerequisite(prereq)}}>Delete</Button></Td> : <></>}
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
              {isStaff ? <Button mb={5} colorScheme="blue" onClick={showAddPrereq}>Add prerequisite</Button> : <></>}
            </Box>
            <Box>
              <Heading as="h5" size="sm">Tags</Heading>
              <Table variant="simple" mb={8}>
                <Tbody>
                  {tempTags.map((tag) => {
                    return (
                      <Tr key={tag.name}>
                        <Td>{tag.name}</Td>
                        {isStaff ? 
                        <Td><Button colorScheme="red" onClick={() => deleteTag(tag)}>Delete</Button></Td> : <></>}
                      </Tr>
                    );
                  })}
                  {showAddTagBox ? 
                  <Tr>
                    <Td>
                       <Input placeholder="New Tag" onChange={(event) => setNewTag(event.target.value)} size="sm" value={newTag} />
                    </Td>
                    <Td><Flex flexDirection="row" w="8rem" alignItems="center" justifyContent="space-between"><Button colorScheme="green" onClick={createNewTag}>Create</Button><CloseButton onClick={hideAddTag}/></Flex></Td>
                  </Tr>
                  : <></>}
                  {isStaff ? <Button mb={5} colorScheme="blue" onClick={showAddTag}>Add Tag</Button> : <></>}
                </Tbody>
              </Table>
              {tempTags.length == 0 ? <h6>No tags here!</h6> : <></> }
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
                  
                  {tempFiles[typeOfFile.toLowerCase()].map((file_string) => {
                    return (
                      <Tr key={file_string}>
                        <Td>{file_string}</Td>
                        <Td><Button colorScheme="green" mr={3} onClick={(e) => downloadFile(e, file_string)}>Download file</Button></Td>
                        {isStaff ? <Td><Button colorScheme="red" onClick={(e) => {deleteFile(e, typeOfFile, file_string)}}>Delete</Button></Td> : <></>}
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
              {tempFiles[typeOfFile.toLowerCase()].length == 0 ? <h6>No files here!</h6> : <></>}
              {isStaff ? 
              <Flex flexDirection="column" mb="16px" onSubmit={(e) => e.preventDefault()}>
                  <input type="file" name="images" onChange={(e) => handleUpload(e, typeOfFile)} />
                  <Button colorScheme="blue" mt={3} type="button" onClick={(e) => uploadFile(e, typeOfFile)}>Upload file</Button>
              </Flex> : <></>}
              
              </Box>
            )})}
          </Box>
        </ModalBody>

        <ModalFooter>
            <Flex>
              {isStaff ? 
              <Button colorScheme="red" mr={3} onClick={deleteTopic}>Delete Topic</Button> : <></>}
              <Button colorScheme="blue" mr={3} onClick={() => closeModal()}>Close</Button>
            </Flex>
        </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}