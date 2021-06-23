import React, { useState } from "react"
import Header from "../components/Header.js"
import Sidebar from "../components/Sidebar.js"
import WidgetsBar from "../components/WidgetsBar.js"
import TopicTree from "../components/TopicTree.js"
import { Stack, Skeleton, useBreakpointValue, Flex, Container } from "@chakra-ui/react"

function CoursePage() {
    //currently hardcoded sidebar content
    const links = ["Home", "Course Outline", "Content", "Forums", "Support"]
    const smVariant = 'drawer'
    const mdVariant = 'sidebar'
    const variants = useBreakpointValue({ base: smVariant, md: mdVariant })
    const [isOpen, setOpen] = useState(false)

    let counter = 0

    //EXAMPLE PAGE LAYOUT
    //CHANGE WHATEVER IS IN THE CONTAINER IN LINE 25-29
    //CURRENTLY IS A SKELETON BOX
    return (
        <div>
            <Header sideBarLinks={links} setOpen={setOpen}></Header>
            <Flex>
                <Sidebar links={links} isOpen={isOpen} setOpen={setOpen} variant={variants}></Sidebar>
                <Container marginTop={50} maxWidth="100%">
                    {/* <Stack spacing={50}>
                        {[...Array(3).keys()].map(e => { counter += 1; return <Skeleton key={"feed_" + counter} height="300px" ></Skeleton>})}
                    </Stack> */}
                    <TopicTree />
                </Container>
                <WidgetsBar></WidgetsBar>
            </Flex>
        </div>
    )
}

export default CoursePage