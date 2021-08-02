import React, { useEffect, useState } from 'react';
import { 
    Heading,
    Box,
    Flex,
    Button,
    Text,
    InputGroup,
    InputLeftElement,
    Input,
    Accordion, 
    AccordionItem, 
    AccordionButton, 
    AccordionPanel,
    AccordionIcon,
    Stack,
    Divider,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    useToast
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { topic_group_url, post_new_topic_url, get_topic_group } from '../../Constants.js';
import { Spinner } from '@chakra-ui/spinner';
import TopicTreeHeader from "./TopicTreeHeader.js";

function FormModal({buttonText, modalName, topicGroup}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [input, setInput] = useState("")
    const toast = useToast()

    return (
        <Box>
            <Button bg="blue.400" color="white" _hover={{color:"black", bg:"blue.100"}} onClick={onOpen}>{buttonText}</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Add {modalName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>{modalName} Name</Text>
                        <InputGroup>
                            <Input onChange={e => setInput(e.target.value)}></Input>
                        </InputGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button bg="blue.400" color="white" _hover={{color:"black", bg:"blue.100"}} onClick={() => {
                            if (input === "") {
                                return toast({
                                    title: "Error",
                                    description: "Please specify the name",
                                    status: "error",
                                    duration: 3000,
                                    isClosable: true,
                                })
                            }

                            if (modalName === "Topic Group") {

                            }
                            else if (modalName === "Topic") {
                                fetch(post_new_topic_url(topicGroup, input), {method: "POST"}).then(e => {
                                    if (e.status === 200) {
                                        window.location.reload()

                                        return toast({
                                            title: "Success",
                                            status: "success",
                                            duration: 3000,
                                            isClosable: true,
                                        })
                                    }
                                    else {
                                        return toast({
                                            title: "Error",
                                            description: "Please try again",
                                            status: "error",
                                            duration: 3000,
                                            isClosable: true,
                                        })
                                    }
                                })
                            }
                        }}>ADD</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}

function TopicModal({topicGroup, topicName}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <Box>
            <Flex key={topicGroup + "-topic-" + topicName } justifyContent="flex-start" padding={5} cursor="pointer" _hover={{bg:"gray.100", fontWeight:"medium"}} onClick={onOpen}>
                <Flex width="100%">
                    <Text>
                        {topicName}
                    </Text>
                </Flex>
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>{topicGroup}</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Text fontWeight="medium">{topicName}</Text>
                        Honestly I dont know what to put here so :D
                    </ModalBody>
                    <ModalFooter>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default function TopicTreeList() {
    const [data, setData] = useState([]);
    const [display, setDisplay] = useState([])
    const [view, setView] = useState("List View");
    const [ form, setForm ] = useState({"topic_group": null, "topic": null})
    const toast = useToast()

    useEffect(async function () {
        fetch(topic_group_url)
        .then(response => response.json())
        .then(function (response) {
            setData(response);
            setDisplay(response)
        });
    }, []);

    let pageView = null;
    if (data != null) {
        console.log(data)
        //Data is a list of topic groups
        pageView = (
        <Box>
            <TopicTreeHeader id="topic-tree-header" view={view}></TopicTreeHeader>
            <Flex paddingBlock={10} justifyContent="center" flexDirection="column">
                <Flex justifyContent="center">
                    <Flex width={["95%", "95%", "90%", "70%"]}>
                        <InputGroup variant="filled" alignSelf="center">
                            <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" />}/>
                            <Input placeholder="Search" onChange={e => {
                                let tempArray = []
                                const target = e.target.value.toLowerCase()
                                tempArray = data.filter(group => {
                                    if (group.name.toLowerCase().indexOf(target) !== -1 || group.topic_code.toLowerCase().indexOf(target) !== -1) {
                                        return true
                                    }
                                    for (let topic of group.topics_list) {
                                        if (topic.name.toLowerCase().indexOf(target) !== -1) {
                                            return true
                                        }
                                    }
                                    return false
                                })
                                setDisplay(tempArray)
                            }}></Input>
                        </InputGroup>
                        <Box marginLeft={5}>
                        <FormModal buttonText="ADD TOPIC" modalName="Topic Group"></FormModal>
                        </Box>
                    </Flex>
                </Flex>
                <Flex justifyContent="center" marginTop={10}>
                    <Accordion allowMultiple width={["100%", "100%", "90%", "70%"]}>
                        {display.map(e => {
                            return (
                                <AccordionItem key={"topic-group-" + e.id}>
                                    <AccordionButton as={Flex} bg="white" cursor="pointer">
                                        <Flex flexDirection={["column", "column", "row"]}>
                                            <Box marginRight={20} textOverflow="ellipsis">
                                                <Heading fontSize="lg" width="200px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                                                    {e.name}
                                                </Heading>
                                            </Box>
                                            <Box>
                                                <Text>
                                                    {e.topic_code}
                                                </Text>
                                            </Box>
                                        </Flex>
                                        <Flex flexGrow={1}></Flex>
                                        <AccordionIcon></AccordionIcon>
                                    </AccordionButton>
                                    <AccordionPanel>
                                        <Stack>
                                        {
                                            e.topics_list.map(topic => {
                                                return (
                                                    <TopicModal topicGroup={e.name} topicName={topic.name}></TopicModal>
                                                )
                                            })
                                        }
                                        </Stack>
                                        <Flex>
                                            <Flex flexGrow={1}></Flex>
                                            <FormModal buttonText="ADD TOPIC" modalName="Topic" topicGroup={e.name}></FormModal>
                                        </Flex>
                                    </AccordionPanel>
                                </AccordionItem>
                            )
                        })}
                    </Accordion>
                </Flex>
            </Flex>      
        </Box>
        )
    }
    else {
        pageView = <Spinner></Spinner>
    }
    return pageView;
}