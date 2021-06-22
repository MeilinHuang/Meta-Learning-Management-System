import React, { useState } from "react"
import Header from "../components/Header.js"
import Sidebar from "../components/Sidebar.js"
import WidgetsBar from "../components/WidgetsBar.js"
import ForumOverviewPage from "../pages/ForumOverviewPage.js"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom"
import { Stack, Skeleton, useBreakpointValue, Flex, Container } from "@chakra-ui/react"

function CoursePage() {
    //currently hardcoded sidebar content
    // const links = ["Home", "Course Outline", "Content", "Forums", "Support"]
    const links = [
        {
            name: 'Home',
            url: '/',
        },
        {
            name: 'Course Outline',
            url: '/course-outline',
        },
        {
            name: 'Content',
            url: '/content',
        },
        {
            name: 'Forums',
            url: '/forums',
        },
        {
            name: 'Support',
            url: '/support',
        }
    ]
    const smVariant = 'drawer'
    const mdVariant = 'sidebar'
    const variants = useBreakpointValue({ base: smVariant, md: mdVariant })
    const [isOpen, setOpen] = useState(false)

    let counter = 0

    //EXAMPLE PAGE LAYOUT
    //CHANGE WHATEVER IS IN THE CONTAINER IN LINE 25-29
    //CURRENTLY IS A SKELETON BOX
    return (
        <Router>
            <Header sideBarLinks={links} setOpen={setOpen}></Header>
            <Flex>
                <Sidebar links={links} isOpen={isOpen} setOpen={setOpen} variant={variants}></Sidebar>
                <Container marginTop={50} maxWidth="100%">
                    <Switch>
                        <Route exact path="/forums"><ForumOverviewPage /></Route>
                    </Switch>
                </Container>
                <WidgetsBar></WidgetsBar>
            </Flex>
        </Router>
    )
}

export default CoursePage