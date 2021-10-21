import React, { useEffect, useState } from "react"
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
    Alert,
    AlertIcon,
    AlertDescription,
    CloseButton
  } from "@chakra-ui/react"
import Select from "./ChakraReactSelect.js";
import { get_topics_url, post_new_topic_url, post_new_prereq, new_topic_group } from "../../Constants.js";

export default function TopicTreeAddGroup({isOpen, onClose}) {
    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [newTopicGroupName, setNewTopicGroupName] = useState("");
    const [topicCode, setTopicCode] = useState("");
    const [firstTopicName, setFirstTopicName] = useState("");

    const closeAlert = () => {
        setShowAlert(false);
    }

    const onChangeNewName = (newName) => {
        setNewTopicGroupName(newName.target.value);
    }

    const onChangeTopicCode = (newTopicCode) => {
        setTopicCode(newTopicCode.target.value);
    }

    const onChangeFirstTopic = (firstTopicNew) => {
        setFirstTopicName(firstTopicNew.target.value);
    }

    const onTopicGroupSubmit = async () => {
        if (newTopicGroupName == "" || topicCode == "" || firstTopicName == "") {
            setShowAlert(true);
            setAlertTitle("Error: one of the fields are empty");
            return;
        }
        const formData = new FormData();
        formData.append('topic_code', topicCode);
        formData.append('uploadedFileTypes', 'pdf');
        await fetch(new_topic_group(newTopicGroupName),
        {
            method: 'POST',
            body: formData
        });
        await fetch(post_new_topic_url(newTopicGroupName, firstTopicName), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                'uploadedFileTypes': "pdf"
            })
        });
        window.location.reload();
    }
    return (
        <>
        
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Add a Topic Group</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                <Box>
                        {showAlert ? 
                        <Alert status="error" mb={2}>
                            <AlertIcon />
                            <AlertDescription mr={2}>{alertTitle}</AlertDescription>
                            <CloseButton onClick={closeAlert} position="absolute" right="8px" top="8px" />
                        </Alert>
                        : <></>
                        }
                        <FormControl mb={3} id="new-topic-group-name">
                            <FormLabel>Topic Group Name</FormLabel>
                            <Input onChange={onChangeNewName} value={newTopicGroupName} placeholder="Enter topic group name..." type="text" />
                        </FormControl>
                        <FormControl mb={3} id="new-topic-code">
                            <FormLabel>Topic Code</FormLabel>
                            <Input onChange={onChangeTopicCode} value={topicCode} placeholder="Enter topic code..." type="text" />
                        </FormControl>
                        <FormControl mb={3} id="first-topic">
                            <FormLabel>First Topic* (required)</FormLabel>
                            <Input onChange={onChangeFirstTopic} value={firstTopicName} placeholder="Enter first topic name..." type="text" />
                        </FormControl>
                    </Box>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onTopicGroupSubmit}>Submit</Button>
                    <Button variant="ghost" onClick={onClose}>
                    Close
                    </Button>
                    
                </ModalFooter>
            </ModalContent>
            </Modal>
        </>
    );
};