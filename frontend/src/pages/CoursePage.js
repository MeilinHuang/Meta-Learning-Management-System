import React, { useState } from "react"
import Header from "../components/Header.js"
import Sidebar from "../components/Sidebar.js"
import WidgetsBar from "../components/WidgetsBar.js"
import AnnouncementPage from "../pages/AnnouncementPage.js"
import CourseContentPage from "../pages/CourseContentPage.js"
import CourseDashboard from "../pages/CourseDashboard.js"
import ForumOverviewPage from "../pages/ForumOverviewPage.js"
import ForumPostPage from '../pages/ForumPostPage'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom"

import { Stack, Skeleton, useBreakpointValue, Flex, Container } from "@chakra-ui/react"

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

    let counter = 0

    //EXAMPLE PAGE LAYOUT
    return (
        <div>
            
            <Header sideBarLinks={links} setOpen={setOpen}></Header>
            <Flex>
                <Sidebar links={links} isOpen={isOpen} setOpen={setOpen} variant={variants}></Sidebar>
                <Container marginTop={50} mx={{ base: "0", md: "24px"}} maxWidth="100%">
                    <Switch>
                        {/* Add your page as a Route here */}
                        <Route exact path="/" component={CourseDashboard} />
                        <Route exact path="/announcement/:id" component={AnnouncementPage} />
                        <Route exact path="/forums" component={ForumOverviewPage} />
                        <Route exact path="/content"><CourseContentPage /></Route>
                        <Route exact path="/forums/:id" component={ForumPostPage} />
                    </Switch>
                </Container>
                <WidgetsBar></WidgetsBar>
            </Flex>
        </div>
    )
}

export default CoursePage
