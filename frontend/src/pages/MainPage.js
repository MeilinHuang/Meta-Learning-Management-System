import React, { useState } from "react"
import Sidebar from "../components/Sidebar.js"
import WidgetsBar from "../components/WidgetsBar.js"
import {
    Switch,
    Route,
} from "react-router-dom"
import MainSelection from "./MainSelection.js"
import { useBreakpointValue, Flex, Container, Box } from "@chakra-ui/react"

function CoursePage() {

    const links = [
        {
            name: 'Home',
            url: '/',
        },
        {
            name: 'Topic Tree',
            url: '/topictree',
        },
        {
            name: 'Enrolments',
            url: '/enrolments',
        },
        {
            name: 'Assessments',
            url: '/assessments',
        },
    ]
    const smVariant = 'drawer'
    const mdVariant = 'sidebar'
    const variants = useBreakpointValue({ base: smVariant, md: mdVariant })
    const [isOpen, setOpen] = useState(false)
    return (
        <div>
            <Box position="sticky" width="100%" top={0} zIndex={100}>
                <Box position="fixed" left={0}>
                    <Sidebar links={links} page="main" isOpen={isOpen} setOpen={setOpen} variant={variants}></Sidebar>
                </Box>
                <Box position="fixed" right={0}>
                    <WidgetsBar page="main"></WidgetsBar>
                </Box>
            </Box>
            <Flex marginLeft={[0, 0, 250, 250]} marginRight={[0, 0, 0, 250]}>
                <Container marginTop={50} mx={{ base: "0", md: "24px" }} maxWidth="100%">
                    <Switch>
                        {/* Add your page as a Route here */}
                        <Route path="/"><MainSelection /></Route>
                    </Switch>
                </Container>

            </Flex>
        </div>
    )
}

export default CoursePage
