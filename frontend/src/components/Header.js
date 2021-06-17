import React, { useState } from "react"
import { Flex, Box, Input, InputGroup, InputLeftElement, Text, Center, Divider, Container, Avatar, Menu, MenuButton, MenuList, MenuItem, Portal, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Button, Heading} from "@chakra-ui/react"
import { HamburgerIcon, ChevronDownIcon, ChevronRightIcon, SearchIcon } from '@chakra-ui/icons'
import Sidebar from "./Sidebar"

function Header({sideBarLinks}) {

    const [isOpen, setOpen] = useState(false)

    return (
        <Box>
            <Flex bg="blue.500" height={55}>
                <Box bg="blue.400" display={["block", "block", "none"]} onClick={() => {setOpen(true)}} cursor="pointer">
                    <Flex align="center" mr={5} paddingInline={5} margin={0} height="100%" width="100%">
                        <Box>
                            <ChevronRightIcon boxSize={6}></ChevronRightIcon> 
                        </Box>
                    </Flex>
                </Box>
                <Menu>
                    <MenuButton display={["none", "none", "block"]} bg="blue.400" width={200}>
                        <Flex align="center" mr={5} paddingInline={5} margin={0} height="100%" width="100%">
                            <Box>
                                <HamburgerIcon boxSize={6}></HamburgerIcon> 
                            </Box>
                            <Text fontWeight="bold" marginLeft={2}>COMP1511</Text>
                        </Flex>
                    </MenuButton>
                    <MenuList>
                        <MenuItem>COMP1521</MenuItem>
                        <MenuItem>COMP1531</MenuItem>
                    </MenuList>
                </Menu>
                <Flex grow={1}>
                    <Center height="100%" width="100%">
                        <Container>
                            <InputGroup variant="filled">
                                <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" />}/>
                                <Input placeholder="Search"></Input>
                            </InputGroup>
                        </Container>
                        <Divider orientation="vertical"></Divider>
                    </Center>
                </Flex>
                <Flex>
                    <Flex align="center" paddingInline={5} margin={0}>
                        <Menu isLazy>
                            <MenuButton>
                                <Flex alignItems="center">
                                    <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
                                    <Box display={["none", "block", "block"]}>
                                        <ChevronDownIcon boxSize={6}></ChevronDownIcon>
                                    </Box>
                                </Flex>
                            </MenuButton>
                            <Portal>
                                <MenuList>
                                    <MenuItem>Profile</MenuItem>
                                    <MenuItem>Settings</MenuItem>
                                    <MenuItem>Logout</MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Flex>
                </Flex>   
                <Drawer isOpen={isOpen} placement="left" onClose={() => {setOpen(false)}}>
                    <DrawerOverlay></DrawerOverlay>
                    <DrawerContent>
                        <DrawerCloseButton></DrawerCloseButton>
                        <DrawerHeader>
                            <Menu>
                                <MenuButton as={Button} rightIcon={<ChevronDownIcon></ChevronDownIcon>}>
                                    <Heading>COMP1511</Heading>
                                </MenuButton>
                                <MenuList>
                                    <MenuItem>COMP1521</MenuItem>
                                    <MenuItem>COMP1531</MenuItem>
                                </MenuList>
                            </Menu>
                        </DrawerHeader>
                        <DrawerBody>
                            <Sidebar links={sideBarLinks}></Sidebar>
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>      
            </Flex>
            <Box display={["none", "none", "block"]} width={200}>
                <Container margin={0} paddingInline={0} paddingTop={4}>
                    <Sidebar links={sideBarLinks}></Sidebar>
                    <Divider orientation="horizontal" marginTop={4}></Divider>
                </Container>
            </Box>
        </Box>
    )
}

export default Header