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
    textDecoration
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { topic_group_url } from '../../Constants.js';
import { Spinner } from '@chakra-ui/spinner';
import TopicTreeHeader from "./TopicTreeHeader.js";
import { useHistory } from "react-router-dom";

export default function TopicTreeList() {
    const [data, setData] = useState([]);
    const [display, setDisplay] = useState([])
    const [view, setView] = useState("List View");

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
                    <Flex width="50%">
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
                        <Button bg="blue.400" color="white" _hover={{color:"black", bg:"blue.100"}} marginLeft={5}>
                            ADD GROUP
                        </Button>
                    </Flex>
                </Flex>
                <Flex justifyContent="center" marginTop={10}>
                    <Accordion allowMultiple width="50%">
                        {display.map(e => {
                            return (
                                <AccordionItem key={"topic-group-" + e.id}>
                                    <AccordionButton as={Flex} bg="white" cursor="pointer">
                                        <Flex flexDirection={["column", "column", "row"]}>
                                            <Box marginRight={20} textOverflow="ellipsis">
                                                <Heading fontSize="lg" width="200px" overflow="hidden" height="20px" textOverflow="ellipsis" whiteSpace="nowrap">
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
                                                    <Flex key={e.name + "-topic-" + topic.name } justifyContent="flex-start" padding={5} _hover={{bg:"gray.100", fontWeight:"medium"}}>
                                                        <Flex width="100%" cursor="pointer">
                                                            <Text>
                                                                {topic.name}
                                                            </Text>
                                                        </Flex>
                                                    </Flex>
                                                )
                                            })
                                        }
                                        </Stack>
                                        <Flex>
                                            <Flex flexGrow={1}></Flex>
                                            <Button bg="blue.400" color="white" _hover={{color:"black", bg:"blue.100"}}>ADD TOPIC</Button>
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