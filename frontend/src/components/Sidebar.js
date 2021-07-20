import React from "react"
import { useHistory } from 'react-router-dom'
import { Stack, Text, Button, Box, Flex, Drawer, DrawerOverlay, DrawerCloseButton, DrawerContent, Select, Container, DrawerHeader} from "@chakra-ui/react"
import { ArrowRightIcon, ArrowBackIcon } from '@chakra-ui/icons'


function SidebarContent({history, links}) {
    let counter = 0
    let path = document.location.pathname.split("/").filter(elem => elem != "")
    if (path.length > 2) {
        path = path.splice(0, 2)
    }
    path = "/" + path.join("/")
    return (
        <Stack spacing={0}>
            {links.map(({name, url}) => {
                counter += 1
                return (
                    <Button as={Box} key={"sidebar-link-" + counter} onClick={() => history.push(path + url)} width={200} display="auto" borderWidth="0px 0px 2px 0px" borderRadius={0} bg="white" cursor="pointer" padding={4} paddingBottom={8}>
                        <Flex alignItems="center">
                            <ArrowRightIcon boxSize={2} color="blue.500"></ArrowRightIcon>
                            <Text fontSize={["md", "md", "lg"]} marginLeft={3} textAlign="left">{name}</Text>
                        </Flex>
                    </Button>
                )
            })}
        </Stack>
    )
}

function Sidebar({links, isOpen, setOpen, variant}) {
    const history = useHistory()

    if (variant === "drawer") {
        return (<Drawer isOpen={isOpen} placement="left" onClose={() => {setOpen(false)}}>
            <DrawerOverlay></DrawerOverlay>
            <DrawerContent>
                <DrawerCloseButton></DrawerCloseButton>
                <DrawerHeader>
                    <Select placeholder="COMP1511" width="80%" size="lg" fontSize="xl" fontWeight="bold">
                        <option>COMP1521</option>
                        <option>COMP1531</option>
                    </Select>
                </DrawerHeader>
                <Box marginTop={15}>
                    <SidebarContent history={history} links={links}></SidebarContent>
                </Box>
            </DrawerContent>
        </Drawer>)
    }
    else {
        return (
            <Box display={["none", "none", "block"]} height={window.innerHeight - 55} borderRightWidth={1} display="flex" flexDirection="column">
                <Flex margin={0} paddingInline={0}>
                    <SidebarContent history={history} links={links}></SidebarContent>
                </Flex>
                <Flex grow={1}></Flex>
                <Flex>
                    <Button as={Box} key={"sidebar-link-return"} onClick={() => history.push("/")} width={200} display="auto" borderWidth="0px 0px 2px 0px" borderRadius={0} bg="white" cursor="pointer" padding={4} paddingBottom={8}>
                        <Flex alignItems="center">
                            <ArrowBackIcon></ArrowBackIcon>
                            <Text fontSize={["md", "md", "lg"]} marginLeft={3} textAlign="left">Return</Text>
                        </Flex>
                    </Button>
                </Flex>
            </Box> 
        )
    }
}

export default Sidebar