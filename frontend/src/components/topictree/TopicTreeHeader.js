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
    Text
  } from '@chakra-ui/react';
  import WidgetsBar from "../widgets/WidgetsBar.js";
import { HamburgerIcon, CloseIcon, AddIcon, SearchIcon } from '@chakra-ui/icons';
import Select from "./ChakraReactSelect.js";
import { backend_url, get_topics_url, get_prereqs, get_all_topics} from "../../Constants.js";
import TopicTreeViewResource from "./TopicTreeViewResource.js";

import TopicTreeAddTopic from './TopicTreeAddTopic.js';
import TopicTreeAddGroup from "./TopicTreeAddGroup.js";

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
    const [isStaff, setIsStaff] = useState(true);
    const [user, setUser] = useState(null);
    const [name, setName] = useState(
        window.location.pathname.split("/").filter((e) => e !== "")[1]
    );
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

    const {
        isOpen: isOpenGroupModal,
        onOpen: onOpenGroupModal,
        onClose: onCloseGroupModal
    } = useDisclosure();

    const convertToList = (jsonData) => {
        let tempTopics = [];
        let tempActualTopics = [];
        for (let topicGroup of jsonData.result) {
            if (topicGroup === null) {
                continue;
            }
            for (let topic of topicGroup.topics_list) {
                
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
                            'tags': topic.tags, 'group': topicGroup.name, 'groupId': topicGroup.id});
                    }
                }

            }
        }


        
        setActualTopics(tempActualTopics);
        return tempTopics;
    };

    function isLoggedIn() {
        return localStorage.getItem("token") !== null;
    }

    const onChangeSearch = async (value, action) => {
        console.log('value', value);
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
        

        value['title'] = value.name;
        setSelectedNode(value);

        let response = await fetch(get_prereqs(value.group, value.name),
        {
            'headers': {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        });
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
        let isStaff = localStorage.getItem('staff');
        if (isStaff === null) {
            history.push('/login');
        } else {
            setIsStaff(parseInt(isStaff) !== 0);
        }

        if (!isLoggedIn()) {
            //Redirect to main page if not logged in
            window.location.pathname = "/"
        }
        else {
            //Need to get user logged in
            fetch(backend_url + `user/${localStorage.getItem("id")}`, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((e) => e.json())
            .then((e) => {
                setUser(e);
                
            });
        }
        fetch(get_all_topics(), {
            'headers': {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(response => response.json())
        .then(function (data) {
            
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

    function goHome() {
        history.push('/');
    }

    function logOut() {
        localStorage.removeItem("token");
        localStorage.removeItem("staff");
        localStorage.removeItem("id");
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
                    <Box color='white' fontSize={'1.2rem'} onClick={goHome} style={{cursor: "pointer"}}>Meta LMS  &nbsp;| &nbsp;<b>Topic Tree</b></Box>
                    <HStack
                        as={'nav'}
                        spacing={4}
                        display={{ base: 'none', md: 'flex' }}>
                        { isStaff ? 
                            <><Link mt={1} mb={1} px={2} py={1} color={'white'} rounded={'md'} onClick={onOpenGroupModal}>Add a Topic Group</Link>
                            <Link mt={1} px={2} py={1} color={'white'} rounded={'md'}
                                onClick={onOpenModal}>Add a Topic</Link></> : <></>}
                        
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
                            {user ? (
                                <Flex alignItems="center" justifyContent="start">
                                    <Avatar name={user.user_name} />
                                </Flex>
                            ) : (
                                <Flex alignItems="center">
                                    <Avatar />
                                    <Box paddingLeft={3}>
                                        <Text fontWeight="medium">Log In</Text>
                                    </Box>
                                </Flex>
                            )}
                        </MenuButton>
                        <MenuList zIndex={5}>
                            <MenuItem>Profile</MenuItem>
                            <MenuItem>Settings</MenuItem>
                            {isLoggedIn() ? (
                                <MenuItem
                                    onClick={(e) => {

                                        logOut();
                                        history.go(0);
                                    }}
                                >
                                    Log Out
                                </MenuItem>
                            ) : (
                                <MenuItem
                                    onClick={(e) => {
                                        history.push("/login");
                                    }}
                                >
                                    Log In
                                </MenuItem>
                            )}
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
            <TopicTreeAddGroup isOpen={isOpenGroupModal} onClose={onCloseGroupModal} />
            <TopicTreeViewResource data={selectedNode} isOpen={isOpenViewModal} onClose={onCloseViewModal} prereqs={listPrereqs} topicGroupName={topicGroupName} nodes={notListPrereqs} />
        </div>
    );
  }
