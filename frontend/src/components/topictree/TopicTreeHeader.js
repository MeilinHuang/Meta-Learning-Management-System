import React from "react"
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
    Divider
  } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons';
import Select from "./ChakraReactSelect.js";
import TopicTreeAddTopic from './TopicTreeAddTopic.js';

const Links = ['Add a Topic'];
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
        href={children}>
        {children}
    </Link>
);


  
export default function TopicTreeHeader({id, view, setView}) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { 
        isOpen:isOpenModal, 
        onOpen: onOpenModal, 
        onClose: onCloseModal 
    } = useDisclosure();

    var colourOptions = [
        { value: "blue", label: "Blue", color: "#0052CC" },
        { value: "purple", label: "Purple", color: "#5243AA" },
        { value: "red", label: "Red", color: "#FF5630" },
        { value: "orange", label: "Orange", color: "#FF8B00" },
        { value: "yellow", label: "Yellow", color: "#FFC400" },
        { value: "green", label: "Green", color: "#36B37E" }
    ];
  
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
                                    options={colourOptions}
                                    placeholder="Search a topic"
                                    closeMenuOnSelect={true}
                                    size="sm"
                                    w={5000}
                                    onKeyDown={(key) => {
                                        if (key.code == "Enter") {
                                            
                                        }
                                    }}
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
                        <Switch id="topic-tree-view" onChange={e => { if (e.target.checked) { setView("Graph View")} else setView("List View")}} defaultChecked/>
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
                    <NavLink key={"Add a Topic"} onClick={onOpenModal}>Add a Topic</NavLink>
                </Stack>
                </Box>
            ) : null}
            </Box>
            <TopicTreeAddTopic isOpen={isOpenModal} onClose={onCloseModal} />
        </div>
    );
  }