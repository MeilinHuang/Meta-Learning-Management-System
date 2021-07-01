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
    FormHelperText
  } from "@chakra-ui/react"
import Select from "./ChakraReactSelect.js";

export default function TopicTreeAddTopic({isOpen, onClose}) {
    var colourOptions = [
        { value: "blue", label: "Blue", color: "#0052CC" },
        { value: "purple", label: "Purple", color: "#5243AA" },
        { value: "red", label: "Red", color: "#FF5630" },
        { value: "orange", label: "Orange", color: "#FF8B00" },
        { value: "yellow", label: "Yellow", color: "#FFC400" },
        { value: "green", label: "Green", color: "#36B37E" }
    ];
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
                            <Input type="text" />
                        </FormControl>
                        <FormControl id="new-topic-dependencies">
                            <FormLabel>Select Topic Prerequisites</FormLabel>
                            <Select
                                isMulti
                                name="topics"
                                options={colourOptions}
                                placeholder="Select some topics..."
                                closeMenuOnSelect={false}
                                size="sm"
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