import React, { useEffect, useState } from "react"
import { useHistory } from 'react-router-dom'
import {
    Box,
    Flex,
    Avatar,
    HStack,
    Link,
    IconButton,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorModeValue,
    Stack,
    FormControl,
    FormLabel,
    Switch,
    Divider,
  } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, AddIcon, SearchIcon } from '@chakra-ui/icons';
import Select from "./ChakraReactSelect.js";
import { get_topics_url, get_prereqs, get_all_topics} from "../../Constants.js";
import TopicTreeViewResource from "./TopicTreeViewResource.js";

import TopicTreeAddTopic from './TopicTreeAddTopic.js';

const NavLink = ({ onClick, children, openUrl=true }) => (
    <Link
        px={2}
        py={1}
        color={'white'}
        rounded={'md'}
        onClick={onClick}
        _hover={
            {
                textDecoration: 'none',
                bg: useColorModeValue('gray.300', 'gray.300'),
            }
        }
        href={ openUrl ? children : '#'}>
        {children}
    </Link>
);



export default function TopicTreeHeader({id,  topicGroups, view}) {
    const history = useHistory();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [tempView, setTempView] = useState(view);
    const [topics, setTopics] = useState([]);
    const [actualTopics, setActualTopics] = useState([]);
    const [listPrereqs, setListPrereqs] = useState([]);
    const [notListPrereqs, setNotListPrereqs] = useState([]);
    const [topicGroupName, setTopicGroupName] = useState("");
    const [selectedNode, setSelectedNode] = useState({
        "id": 0,
        "title": "",
        "prerequisite_strings": [],
        "description": "",
        "materials_strings": {
            "preparation": [],
            "content": [],
            "practice": [],
            "assessments": []
        },
        'tags': [],
        "group": "",
        "discipline": "",
        "creator": ""
    });
    const {
        isOpen: isOpenViewModal,
        onOpen: onOpenViewModal,
        onClose: onCloseViewModal
    } = useDisclosure();

    const {
        isOpen:isOpenModal,
        onOpen: onOpenModal,
        onClose: onCloseModal
    } = useDisclosure();

    const convertToList = (jsonData) => {
        let tempTopics = [];
        let tempActualTopics = [];
        for (let topicGroup of jsonData.result) {
            for (let topic of topicGroup.topics_list) {
                console.log('topic', topic);
                topic['value'] = topic.name;
                topic['label'] = topic.name;
                topic['id'] = topic.id;
                topic['name'] = topic.name;
                topic['group'] = topicGroup.name;
                topic['groupId'] = topicGroup.id;
                tempTopics.push(topic);
                tempActualTopics.push(topic);
                if (topic.tags !== undefined) {
                    for (let tag of topic.tags) {
                        tempTopics.push({'value': topic.name, 'label': tag.name, 'id': topic.id, 'name': topic.name, 'course_materials': topic.course_materials,
                            'tags': topic.tags});
                    }
                }

            }
        }


        console.log('tempActualTopics', tempActualTopics);
        setActualTopics(tempActualTopics);
        return tempTopics;
    };

    const onChangeSearch = async (value, action) => {
        value['materials_strings'] = {};
        value.materials_strings['content'] = [];
        value.materials_strings['practice'] = [];
        value.materials_strings['preparation'] = [];
        value.materials_strings['assessments'] = [];

        for (let fileObj of value.course_materials) {
            if (fileObj.type == 'assessment') {
                value.materials_strings['assessments'].push(fileObj.name);
            } else {
                value.materials_strings[fileObj.type].push(fileObj.name);
            }
        }
        value.course_materials = [];
        console.log('selectedValue', value);

        value['title'] = value.name;
        setSelectedNode(value);

        let response = await fetch(get_prereqs(value.group, value.name));
        let responseJson = await response.json();
        let prereqList = [];
        for (let prereq of responseJson.prerequisites_list) {
            prereqList.push({'name': prereq.name, 'id': prereq.id});
        }

        setListPrereqs(prereqList);
        let notPrereqs = [];
        for (let topic of actualTopics) {
            let found = false;
            for (let prereq of prereqList) {
                if (topic.id === prereq.id) {
                    found = true;
                    break;
                }
            }
            if (!found && topic.id !== value.id) {
                notPrereqs.push({'value': topic.id, 'label': topic.name});
            }
        }
        setNotListPrereqs(notPrereqs);
        setTopicGroupName(value.group);




        onOpenViewModal();
    }

    useEffect(() => {
        fetch(get_all_topics())
        .then(response => response.json())
        .then(function (data) {
            console.log('data5', data);
            setTopics(convertToList(data));
        });


    }, []);

    function setView() {

        if (tempView == 'Graph View') {
            setTempView('List View');
            history.push('/topictreelist');
        } else {
            setTempView('Graph View');
            history.push('/topictree');
        }
    }

    function isChecked() {
        return tempView == "Graph View";
    }

    return (
        <div id={id}>
            <Box bg={useColorModeValue('blue.400', 'blue.400')} px={4}>
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                <IconButton
                size={'md'}
                icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                aria-label={'Open Menu'}
                display={{ md: 'none' }}
                onClick={isOpen ? onClose : onOpen}
                />
                <HStack spacing={8} alignItems={'center'}>
                    <Box color='white' fontSize={'1.2rem'} >Meta LMS  &nbsp;| &nbsp;<b>Topic Tree</b></Box>
                    <HStack
                        as={'nav'}
                        spacing={4}
                        display={{ base: 'none', md: 'flex' }}>

                        <Link mt={1} px={2} py={1} color={'white'} rounded={'md'}
                            onClick={onOpenModal}>Add a Topic</Link>
                        <Box bg='white'  w={200}>
                            <FormControl id="new-topic-dependencies">
                                <Select
                                    name="searchTopic"
                                    options={topics}
                                    placeholder="Search a topic"
                                    closeMenuOnSelect={true}
                                    size="sm"
                                    w={5000}
                                    onChange={onChangeSearch}
                                />
                            </FormControl>
                        </Box>

                    </HStack>
                </HStack>
                <Flex alignItems={'center'} height="100%">
                    <FormControl display="flex" alignItems="center" marginRight={5}>
                        <FormLabel htmlFor="topic-tree-view" color="white">
                            {view}
                        </FormLabel>
                        <Switch id="topic-tree-view" onChange={e => { if (e.target.checked) { setView("Graph View")} else setView("List View")}}
                            isChecked={isChecked()}/>
                    </FormControl>
                    <Divider orientation="vertical"></Divider>
                    <Menu>
                        <MenuButton
                        marginLeft={5}
                        as={Button}
                        rounded={'full'}
                        variant={'link'}
                        cursor={'pointer'}>
                            <Avatar
                                size={'sm'}
                                src={
                                'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                                }
                            />
                        </MenuButton>
                        <MenuList>
                            <MenuItem>Link 1</MenuItem>
                            <MenuItem>Link 2</MenuItem>
                            <MenuDivider />
                            <MenuItem>Link 3</MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </Flex>

            {isOpen ? (
                <Box pb={4} display={{ md: 'none' }}>
                <Stack as={'nav'} spacing={4}>
                    <NavLink key={"Add a Topic"} onClick={onOpenModal} openUrl={false}>Add a Topic</NavLink>

                </Stack>
                </Box>
            ) : null}
            </Box>
            <TopicTreeAddTopic isOpen={isOpenModal} onClose={onCloseModal} topicGroups={topicGroups}/>
            <TopicTreeViewResource data={selectedNode} isOpen={isOpenViewModal} onClose={onCloseViewModal} prereqs={listPrereqs} topicGroupName={topicGroupName} nodes={notListPrereqs} />
        </div>
    );
  }
