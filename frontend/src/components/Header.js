import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import { Flex, Box, Input, InputGroup, InputLeftElement, Center, Divider, Container, Avatar, Menu, MenuButton, MenuList, MenuItem, Portal, Heading} from "@chakra-ui/react"
import { HamburgerIcon, ChevronDownIcon, ChevronRightIcon, SearchIcon } from '@chakra-ui/icons'

function Header({sideBarLinks, setOpen}) {
    const [loggedIn, setLoggedIn] = useState(sessionStorage.getItem('token')!==null)
    const history = useHistory()
    
    return (
        <Box height="100%">
            <Flex bg="blue.500" height={55}>
                <Box bg="blue.400" display={["block", "block", "none"]} onClick={() => {setOpen(true)}} cursor="pointer" color="white">
                    <Flex align="center" mr={5} paddingInline={5} margin={0} height="100%" width="100%">
                        <Box>
                            <ChevronRightIcon boxSize={6}></ChevronRightIcon> 
                        </Box>
                    </Flex>
                </Box>
                <Menu>
                    <MenuButton display={["none", "none", "block"]} bg="blue.400" width={200}>
                        <Flex align="center" mr={5} paddingInline={5} margin={0} height="100%" width="100%" color="white">
                            <Box>
                                <HamburgerIcon boxSize={6}></HamburgerIcon> 
                            </Box>
                            <Heading size="md" fontWeight="bold" marginLeft={2}>COMP1511</Heading>
                        </Flex>
                    </MenuButton>
                    <MenuList>
                        <MenuItem>COMP1521</MenuItem>
                        <MenuItem>COMP1531</MenuItem>
                    </MenuList>
                </Menu>
                <Flex grow={1}></Flex>
                <Divider orientation="vertical"></Divider>
                <Flex>
                    <Flex align="center" paddingInline={5} margin={0}>
                        <Menu isLazy>
                            <MenuButton>
                                <Flex alignItems="center">
                                    <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
                                    <Box display={["none", "block", "block"]}>
                                        <ChevronDownIcon boxSize={6} color="white"></ChevronDownIcon>
                                    </Box>
                                </Flex>
                            </MenuButton>
                            <Portal>
                                <MenuList>
                                    <MenuItem>Profile</MenuItem>
                                    <MenuItem>Settings</MenuItem>
                                    {loggedIn
                                    ? <MenuItem onClick={() => {history.push('/login')}}>Login</MenuItem> 
                                    : <MenuItem onClick={() => {
                                        sessionStorage.removeItem('token')
                                        setLoggedIn(false)
                                    }}>Logout</MenuItem>}
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Flex>
                </Flex>       
            </Flex>
        </Box>
    )
}

export default Header