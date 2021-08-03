import React from "react"
import { Box, Container, Text, Divider, Stack, Skeleton, Avatar, Flex, Menu, MenuButton, Portal, MenuList, MenuItem } from "@chakra-ui/react"
import Calendar from './Calendar.js'
//import Calendar from 'react-calendar'
//import "./widgetBar.css"
//import 'react-calendar/dist/Calendar.css';

function WidgetsBar({page}) {
    return (
        <Box display={["none", "none", "none", "block"]} width={200} borderLeftWidth={1} height="100vh">
            <Flex flexDirection="column">
                <Flex alignItems="center" justifyContent="center" marginTop={3}>
                    <Menu isLazy>
                            <MenuButton _hover={{textDecoration: "underline"}}>
                                <Flex alignItems="center">
                                    <Avatar name="John Smith" src="https://bit.ly/dan-abramov" />
                                    <Box paddingLeft={3}>
                                        <Text fontWeight="medium">John Smith</Text>
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
                {   
                    page==="course"&&
                    <Container>
                        <Text size="sm">Course Progress</Text>
                        <Divider color="black" opacity="1"></Divider>
                        <Box bg="blue.100" marginTop={5} borderRadius={10} width="100%" height="100%">
                            <Box bg="blue.500" width="50%" height="100%" borderRadius="10px 0px 0px 10px" textAlign="center" color="blue.500">.</Box>
                        </Box>
                    </Container>
                }
                <Container padding={0} width="100%" marginTop={3} marginBottom={10} height={250} userSelect="none">
                    <Calendar></Calendar>
                </Container>
                <Container>
                    <Text size="sm">Due Dates</Text>
                    <Divider color="black" opacity="1"></Divider>
                    <Skeleton width="100%" marginTop={5} height={5}></Skeleton>
                    <Skeleton width="100%" marginTop={5} height={5}></Skeleton>
                    <Skeleton width="100%" marginTop={5} height={5}></Skeleton>
                </Container>
            </Flex>   
        </Box>
    )
}

export default WidgetsBar