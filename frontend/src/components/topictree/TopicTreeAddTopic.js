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
    Box
  } from "@chakra-ui/react"
import Select from "./ChakraReactSelect.js";
import { get_topics_url } from "../../Constants.js";

export default function TopicTreeAddTopic({isOpen, onClose, topicGroupName}) {


    const [topics, setTopics] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [newTopicName, setNewTopicName] = useState("");

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
        console.log('value', value);
        setSelectedTopics(value);
    }

    const onChangeNewName = (value) => {
        console.log('value', value.target.value);
        setNewTopicName(value.target.value);
    }

    useEffect(() => {
        fetch(get_topics_url(topicGroupName))
        .then(response => response.json())
        .then(function (data) {
            setTopics(convertToList(data));
        });
    }, []);
    return (
        <>
        
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Add a Topic</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box>
                        <FormControl mb={3} id="new-topic-name">
                            <FormLabel>Topic Name</FormLabel>
                            <Input onChange={onChangeNewName} placeholder="Enter topic name..." type="text" />
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
                    <Button colorScheme="blue" mr={3}>Submit</Button>
                    <Button variant="ghost" onClick={onClose}>
                    Close
                    </Button>
                    
                </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}