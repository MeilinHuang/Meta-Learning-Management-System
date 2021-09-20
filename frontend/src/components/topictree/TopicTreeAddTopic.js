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
import { get_topics_url, post_new_topic_url, post_new_prereq } from "../../Constants.js";

export default function TopicTreeAddTopic({isOpen, onClose, topicGroups}) {


    const [topics, setTopics] = useState([]);
    const [topicGroupName, setTopicGroupName] = useState("");
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [newTopicName, setNewTopicName] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");

    const convertToList = (jsonData) => {
        let tempTopics = [];
        for (let topic of jsonData.topics_list) {
            topic['value'] = topic.name;
            topic['label'] = topic.name;
            tempTopics.push(topic);
        }

        return tempTopics;
    };

    const onChangePrerequisites = (value, action) => {
        
        setSelectedTopics(value);
    }

    const onChangeTopicGroup = (value, action) => {
        
        setTopicGroupName(value.value);
    }


    const onChangeNewName = (value) => {
        
        setNewTopicName(value.target.value);
    }

    const onSubmitTopic = async () => {
        if (newTopicName == "") {
            setShowAlert(true);
            setAlertTitle("Please enter a topic title");
            return;
        }
        
        let response = await fetch(post_new_topic_url(topicGroupName, newTopicName), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        let responseJson = await response.json();

        if (response.status != 200) {
            setAlertTitle(responseJson.error);
            return;
        }
        let groupId = responseJson.id;
        for (let prereq of selectedTopics) {

            response = await fetch(post_new_prereq(topicGroupName, newTopicName), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "preReqId": prereq.id,
                    "topicId": groupId
                })
            });

            if (response.status != 200) {
                setAlertTitle(response.json().error);
                return;
            }
        }
        window.location.reload();
    }

    const closeAlert = () => {
        setShowAlert(false);
    }

    useEffect(() => {
        if (topicGroupName !== '') {
            fetch(get_topics_url(topicGroupName))
            .then(response => response.json())
            .then(function (data) {
                setTopics(convertToList(data));
            });
        }

    }, [topicGroupName]);
    return (
        <>
        
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Add a Topic</ModalHeader>
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
                        <FormControl mb={3} id="new-topic-name">
                            <FormLabel>Topic Name</FormLabel>
                            <Input onChange={onChangeNewName} placeholder="Enter topic name..." type="text" />
                        </FormControl>
                        <FormControl id="topic-group">
                            <FormLabel>Topic Group</FormLabel>
                            <Select
                                name="topicGroups"
                                options={topicGroups}
                                placeholder="Select a Topic Group"
                                size="sm" 
                                onChange={onChangeTopicGroup} />
                        </FormControl>
                        <FormControl id="new-topic-dependencies">
                            <FormLabel>Select Topic Prerequisites</FormLabel>
                            <Select
                                isMulti
                                name="topics"
                                options={topics}
                                placeholder="Select some topics..."
                                closeMenuOnSelect={false}
                                size="sm"
                                onChange={onChangePrerequisites}
                            />
                        </FormControl>
                    </Box>
                </ModalBody>
        
                <ModalFooter>
                    <Button colorScheme="blue" onClick={onSubmitTopic} mr={3}>Submit</Button>
                    <Button variant="ghost" onClick={onClose}>
                    Close
                    </Button>
                    
                </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}