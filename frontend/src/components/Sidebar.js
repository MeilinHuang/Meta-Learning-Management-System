import React, { useState, useEffect} from "react"
import { useHistory } from 'react-router-dom'
import { Stack, Text, Box, Flex, Drawer, DrawerOverlay, DrawerCloseButton, DrawerContent, Select, Avatar, DrawerHeader, Menu, MenuButton, Portal, MenuList, MenuItem} from "@chakra-ui/react"
import { ChevronDownIcon, ArrowBackIcon, HamburgerIcon } from '@chakra-ui/icons'
import { get_topic_group } from "../Constants.js"


function SidebarContent({history, links}) {
    let counter = 0
    let path = document.location.pathname.split("/").filter(elem => elem !== "")
    if (path.length > 2) {
        path = path.splice(0, 2)
    }
    else if (path.length === 1) {
        path = []
    }
    path = "/" + path.join("/")
    if (path === "/") {
        path = ""
    }
    return (
        <Stack spacing={0}>
            {links.map(({name, url}) => {
                counter += 1
                return (
                    <Flex key={"sidebar-link-" + counter} onClick={() => {history.push(path + url)}} width={200} height={70} alignContent="center" borderRadius={0} cursor="pointer" padding={4} _hover={{background:"white", color:"black", borderRadius:"0px 0px 0px 0px"}}>
                        <Flex alignItems="center">
                            <Text fontSize={["md", "md", "lg"]} marginLeft={1} textAlign="left" letterSpacing="wide">{name}</Text>
                        </Flex>
                    </Flex>
                )
            })}
        </Stack>
    )
}

function Sidebar({links, isOpen, setOpen, variant, page}) {
    const history = useHistory()
    const [code, setCode] = useState("")
    //MAYBE STORE IN LOCAL STORAGE INSTEAD OF FETCHING EVERYTIME
    const course = history.location.pathname.split("/").filter(e => e !== "")[1]
    fetch(get_topic_group(course)).then(e => e.json()).then(e => setCode(e.topic_code))

    let title = (
        <Menu isLazy placement="right">
            <MenuButton>
                <Flex flexDirection="column" bg="blue.500" color="white" width={200} height={90} textAlign="left" justifyContent="center" cursor="pointer">
                    <Box marginLeft={1} padding={4} fontSize="larger">
                        <Text fontWeight="medium" letterSpacing="wider">{code}</Text>
                        <Text fontSize="medium" letterSpacing="wider">{course}</Text>
                    </Box>
                </Flex>
            </MenuButton>
            <Portal>
                <MenuList zIndex={100} placement="right">
                    {
                        ["Course 1", "Course 2"].map(e => <MenuItem key={"course-menu-" + e}>{e}</MenuItem>)
                    }
                </MenuList>
            </Portal>
        </Menu>

    )
    if (page === "main") {
        title = (
            <Flex flexDirection="column" bg="blue.500" color="white" height={90} textAlign="left" justifyContent="center">
                <Box marginLeft={1} padding={4} fontSize="x-large">
                    <Text fontWeight="medium" letterSpacing="wider">MetaLMS</Text>
                </Box>
            </Flex>
        )
    }

    if (variant === "drawer") {
        return (
            <div>
                <Flex width="100vw" height={55} bg="blue.500">
                    <Flex alignItems="center" justifyContent="center" width={55} bg="blue.400">
                        <HamburgerIcon color="white" boxSize={7} onClick={() => setOpen(true)}></HamburgerIcon>
                    </Flex>
                    <Flex grow={1}></Flex>
                    <Flex alignItems="center" paddingInline={3} bg="blue.400">
                        <Menu isLazy>
                            <MenuButton>
                                <Flex alignItems="center">
                                    <Avatar name="John Smith" src="https://bit.ly/dan-abramov" />
                                    <Box display={["none", "block", "block"]}>
                                        <ChevronDownIcon boxSize={6} color="white"></ChevronDownIcon>
                                    </Box>
                                </Flex>
                            </MenuButton>
                            <Portal>
                                <MenuList zIndex={100}>
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
                            <Select placeholder={code} width="80%" size="lg" fontSize="xl" fontWeight="bold">
                                <option>Placeholder 1</option>
                                <option>Placeholder 2</option>
                            </Select>
                        </DrawerHeader>
                        <Box marginTop={15} fontWeight="medium">
                            <SidebarContent history={history} links={links}></SidebarContent>
                        </Box>
                        <Flex grow={1}></Flex>
                        <Flex>
                            <Flex key={"sidebar-link-return"} onClick={() => history.push("/")} width="100%" height={70} alignContent="center" justifyContent="flex-start" cursor="pointer" padding={4}>
                                <Flex alignItems="center">
                                    <Flex borderRadius={100} bg="blue.500" width="30px" height="30px" justifyContent="center" alignItems="center">
                                        <Flex borderRadius={100} bg="white" width="26px" height="26px" justifyContent="center" alignitems="center">
                                            <ArrowBackIcon color="blue.500" boxSize={5} alignSelf="center"></ArrowBackIcon>
                                        </Flex>
                                    </Flex>
                                    <Text fontSize={["md", "md", "lg"]} marginLeft={3} textAlign="left" letterSpacing="wider">Return</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    </DrawerContent>
                </Drawer>
            </div>
        )
    }
    else {
        return (
            <Box display={["none", "none", "flex"]} bg="blue.400" height="100vh" flexDirection="column" width={200}>
                {title}
                <Flex margin={0} paddingInline={0} color="white">
                    <SidebarContent history={history} links={links}></SidebarContent>
                </Flex>
                <Flex grow={1}></Flex>
                { page==="course" &&
                    <Flex>
                        <Flex key={"sidebar-link-return"} onClick={() => history.push("/")} color="white" width={200} height={70} alignContent="center" bg="blue.400" cursor="pointer" padding={4} _hover={{background:"white", color:"black", borderRadius:"0px 0px 0px 0px"}}>
                            <Flex alignItems="center">
                                <Flex borderRadius={100} bg="white" width="30px" height="30px" justifyContent="center" alignItems="center">
                                    <Flex borderRadius={100} bg="blue.400" width="26px" height="26px" justifyContent="center" alignitems="center">
                                        <ArrowBackIcon color="white" boxSize={5} alignSelf="center"></ArrowBackIcon>
                                    </Flex>
                                </Flex>
                                <Text fontSize={["md", "md", "lg"]} marginLeft={3} textAlign="left" letterSpacing="wider">Return</Text>
                            </Flex>
                        </Flex>
                    </Flex>
                }
            </Box> 
        )
    }
}

export default Sidebar