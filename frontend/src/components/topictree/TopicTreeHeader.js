import React, { useEffect, useState } from "react"
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
    FormControl
  } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons';
import Select from "./ChakraReactSelect.js";
import { get_topics_url } from "../../Constants.js";

import TopicTreeAddTopic from './TopicTreeAddTopic.js';

const NavLink = ({ onClick, children }) => (
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
        href={'#'}>
        {children}
    </Link>
);


  
export default function TopicTreeHeader({id, topicGroupName=''}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [topics, setTopics] = useState([]);
    const [listPrereqs, setListPrereqs] = useState([]);
    const [selectedNode, setSelectedNode] = useState({
        "id": 0,
        "title": "",
        "prerequisite_strings": [],
        "description": "",
        "materials_strings": {
            "preparation": [],
            "content": [],
            "practice": [],
            "assessment": []
        },
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
        for (let topic of jsonData.topics_list) {
            topic['value'] = topic.name;
            topic['label'] = topic.name;
            tempTopics.push(topic);
        }

        return tempTopics;
    };

    const onChangeSearch = (value, action) => {
        console.log('setting selected topic', value);
        setSelectedNode(value);

        
    }

    useEffect(() => {
        if (topicGroupName != '') {
            fetch(get_topics_url(topicGroupName))
            .then(response => response.json())
            .then(function (data) {
                setTopics(convertToList(data));
            });
        }

    }, []);
  
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
                    <Box color='white' fontSize={'1.2rem'} >Meta LMS</Box>
                    <HStack
                        as={'nav'}
                        spacing={4}
                        display={{ base: 'none', md: 'flex' }}>
                        
                        <NavLink key={"Add a Topic"} onClick={onOpenModal}>Add a Topic</NavLink>
                        <Box bg='white' w={200}>
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
                <Flex alignItems={'center'}>
                <Menu>
                    <MenuButton
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
                    { topicGroupName != '' ? (
                        <NavLink key={"Add a Topic"} onClick={onOpenModal}>Add a Topic</NavLink>
                    ) : <></> }
                </Stack>
                </Box>
            ) : null}
            </Box>
            <TopicTreeAddTopic isOpen={isOpenModal} onClose={onCloseModal} topicGroupName={topicGroupName} />
        </div>
    );
  }