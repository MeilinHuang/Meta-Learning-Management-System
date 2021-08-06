import React, { useEffect, useRef, useState } from 'react';
import { 
    Heading,
    Box,
    Stack,
    Flex,
    Divider,
    Button,
    Text,
    InputGroup,
    InputLeftElement,
    Input
} from '@chakra-ui/react';
import { ArrowRightIcon, SearchIcon } from '@chakra-ui/icons';
import { backend_url, topic_group_url } from '../../Constants.js';
import { Spinner } from '@chakra-ui/spinner';
import TopicTreeHeader from "./TopicTreeHeader.js";
import { useHistory } from "react-router-dom";

export default function TopicTreeList() {
    const [data, setData] = useState([]);
    const [view, setView] = useState("List View");
    const history = useHistory();

    useEffect(async function () {
        fetch(topic_group_url)
        .then(response => response.json())
        .then(function (response) {
            
            setData(response);
        });
    }, []);

    let pageView = null;
    if (data != null) {
        //Data is a list of topic groups
        pageView = (
        <div>
            <TopicTreeHeader id="topic-tree-header" view={view}></TopicTreeHeader>
            <Box paddingInline={[5, 15, 30]} paddingBlock={10}>
                <Flex flexDirection={["column", "column", "row"]}>
                    <Heading>Topic Groups</Heading>
                    <InputGroup variant="filled" marginLeft={["0", "0", "20%"]} width={["80%", "70%", "30%"]} alignSelf="center">
                        <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" />}/>
                        <Input placeholder="Search"></Input>
                    </InputGroup>
                </Flex>
                <Stack spacing={5} divider={<Divider></Divider>} marginTop={10}>
                    {data.map(e => {
                        let num_topics = e.topics_list.length + " topics"
                        if (e.topics_list.length == 1) {
                            num_topics.substring(0, num_topics.length - 1)
                        }
                        //TODO add links to topics when user clicks on topic group
                        // also direct to course page if user clicks on visit course page button
                        // could also show prerequesite topic groups
                        return (
                            <Flex key={"topic-group-" + e.id} padding={5} justifyContent="auto">
                                <Button as={Flex} bg="white" cursor="pointer" flexGrow={1}>
                                    <ArrowRightIcon color="blue.500" alignSelf="center" display={["none", "block"]} marginRight={10}></ArrowRightIcon>
                                    <Flex flexDirection={["column", "column", "row"]}>
                                        <Box marginLeft={10} width={[300]}>
                                            <Heading fontSize="lg">
                                                {e.name}
                                            </Heading>
                                        </Box>
                                        <Box>
                                            <Text>
                                                {e.topic_code}
                                            </Text>
                                        </Box>
                                    </Flex>
                                    <Box marginLeft={10} fontSize="sm" display={["none", "none", "block"]}>
                                        <Text>
                                            {num_topics}
                                        </Text>
                                    </Box>
                                    <Box flexGrow={1}></Box>
                                </Button>
                                <Button bg="blue.500" color="white">Course Page</Button>
                            </Flex>
                        )
                    })}
                </Stack>
            </Box>
            
        </div>
        )
    }
    else {
        pageView = <Spinner></Spinner>
    }
    return pageView;
}