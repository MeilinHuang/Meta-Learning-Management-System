import React, { useState } from "react"
import Sidebar from "../components/Sidebar.js"
import WidgetsBar from "../components/WidgetsBar.js"
import AnnouncementPage from "../pages/AnnouncementPage.js"
import CourseContentPage from "../pages/CourseContentPage.js"
import CourseDashboard from "../pages/CourseDashboard.js"
import ForumOverviewPage from "../pages/ForumOverviewPage.js"
import ForumPostPage from '../pages/ForumPostPage'
import {
    Switch,
    Route,
} from "react-router-dom"

import { useBreakpointValue, Flex, Container, Box } from "@chakra-ui/react"

function CoursePage() {
    //currently hardcoded sidebar content
    // Add the name and url for your page here
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
        },
        {
            name: 'Topic Tree',
            url: '/topictree'
        }
    ]
    const smVariant = 'drawer'
    const mdVariant = 'sidebar'
    const variants = useBreakpointValue({ base: smVariant, md: mdVariant })
    const [isOpen, setOpen] = useState(false)

    return (
        <div>
            <Box position="sticky" width="100%" top={0} zIndex={100}>
                <Box position="fixed" left={0}>
                    <Sidebar links={links} page="course" isOpen={isOpen} setOpen={setOpen} variant={variants}></Sidebar>
                </Box>
                <Box position="fixed" right={0}>
                    <WidgetsBar page="course"></WidgetsBar>
                </Box>
            </Box>
            <Flex marginLeft={[0, 0, 200, 100]} marginRight={[0, 0, 0, 100]}>
                <Container marginTop={[70, 70, 50]} mx={{ base: "0", md: "24px"}} maxWidth="100%">
                    <Switch>
                        {/* Add your page as a Route here */}
                        <Route exact path="/course-page/:code/announcement/:id" component={AnnouncementPage} />
                        <Route exact path="/course-page/:code/forums" component={ForumOverviewPage} />
                        <Route exact path="/course-page/:code/content"><CourseContentPage /></Route>
                        <Route exact path="/course-page/:code/forums/:id" component={ForumPostPage} />
                        <Route path="/" component={CourseDashboard} />
                    </Switch>
                </Container>
                
            </Flex>
        </div>
    )
}

export default CoursePage
