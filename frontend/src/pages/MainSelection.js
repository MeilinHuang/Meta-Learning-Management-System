import React, { useState, useEffect } from "react"
import { useHistory } from 'react-router-dom'
import { Flex, Text, Heading, VStack, Spinner, Box, Divider, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Stack } from "@chakra-ui/react"
import { get_topic_groups } from "../Constants.js"
import Announcement from '../components/dashboard/Announcement/Announcement'
import { ReactComponent as Learn } from "../static/svgs/undraw_Online_learning_re_qw08.svg"
import { ReactComponent as Study } from "../static/svgs/undraw_studying_s3l7.svg"

function MainSelection() {
    const [courses, setCourses] = useState([])
    const [recent_announce, setRecent] = useState(null)
    const [code, setCode] = useState(null)
    //For announcement
    const [announcements, setAnnouncements] = useState([])
    const [content, setContent] = useState(null)

    const categories = ["Preparation", "Content", "Practice", "Assessments"]

    useEffect(() => {
        //NEED TO CHANGE TO GET ENROLLED COURSES AND MOST RECENTLY ACCESSED CONTENT
        //Getting currently enrolled courses and most recent announcement

        async function fetchData() {
            try {
                
                const enrolled = await fetch(get_topic_groups()).then(e => e.json()).then(e => {
                    //Getting first topic content
                    setContent([e[0].topics_list[0], e[0].topic_code])
                    setCourses(e)
                    return e
                })
                const announcements = await Promise.all(
                    enrolled.map(course => {
                        return fetch("http://localhost:8000/" + course.name + "/announcement").then(e => {
                            return [e, course.name]
                        })
                    })
                )
                Promise.all(
                    announcements.map(async e => {
                        let data = await e[0].json()
                        data = data[0]
                        if (recent_announce === null || Date.parse(recent_announce.post_date) > Date.parse(data.post_date)) {
                            fetch("http://localhost:8000/user/" + data.author).then(resp => resp.json()).then(user => {
                                data = {... data, author: user.user_name}
                                setRecent(data)
                                setCode(e[1])
                                
                            })
                        }
                    })
                )
            }
            catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [])


    let counter = 0
    let history = useHistory()
    return (
        <Flex marginTop={[30, 30, 0, 0]} flexDirection="column">
            <Flex width="100%" flexDirection={["column", "column", "column", "column", "column", "row"]}>
                <Flex width={["100%", "100%", "100%", "100%", "100%", "70%"]} borderRadius={10} shadow="lg">
                    <Flex paddingInline={[5, 5, 10]} paddingBlock={5}>
                        <VStack textAlign="left" alignItems="flex-start" spacing={5}>
                            <Flex>
                                <Heading fontSize={["4xl", "5xl", "6xl"]} letterSpacing="wider" fontWeight="300">Welcome</Heading>
                                <Heading fontSize={["4xl", "5xl", "6xl"]} letterSpacing="wider" fontWeight="500" marginLeft={"10px"}>{"John!"}</Heading>
                            </Flex>
                            <Box>
                                <Text fontSize="large" letterSpacing="wide" fontWeight="200">You have 3 assignments due</Text>
                                <Text fontSize="large" letterSpacing="wide" fontWeight="200">Your next assignment is COMP1234 Assignment 1</Text>
                            </Box>
                        </VStack>
                    </Flex>
                    <Flex flexGrow={1} alignItems="center" justifyContent="center">
                        <Flex display={["none", "none", "none", "none", "flex"]}>
                            <Study width={"100%"} height={"100%"}></Study>
                        </Flex>
                    </Flex>
                </Flex>
                <Flex width={["100%", "100%", "100%", "100%", "100%", "30%"]} marginLeft={[0, 0, 0, 0, 0, 10]} marginTop={[5, 5, 5, 5, 5, 0]}>
                    <Flex width="100%" height="100%" shadow="xl" borderRadius={10} padding={5}>
                        <Flex flexDirection="column" width="100%">
                            <Text fontSize="2xl" letterSpacing="wide" fontWeight={600} marginBottom={5}>Your Courses</Text>
                            <VStack spacing={3} divider={<Divider></Divider>}>
                                {   courses.length > 0 ?
                                    courses.map(course => {
                                        counter += 1
                                        return (
                                            <Flex key={"user-course-" + counter} width="100%" cursor="pointer" _hover={{color:"blue.500"}} onClick={e => {
                                                history.push("/course-page/" + course.name)
                                            }}>
                                                <Flex flexDirection={["row"]}>
                                                    <Text letterSpacing="wide" fontWeight={200} overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" width={[150, 150, 200]}>{course.name}</Text>
                                                    <Text letterSpacing="wider" fontWeight={200}>{course.topic_code}</Text>
                                                </Flex>
                                            </Flex>
                                        )
                                    })
                                    : <Spinner></Spinner>
                                }
                            </VStack>
                        </Flex>
                        <Flex flexGrow={1} alignItems="center" justifyContent="center">
                            <Flex display={["none", "flex", "flex", "flex", "flex", "none"]}>
                                <Learn width={"100%"} height={"100%"}></Learn>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
            <Flex width="100%" marginTop={5} flexDirection={["column", "column", "column", "column", "column", "row"]}>
                <Flex width={["100%", "100%", "100%", "100%", "100%", "50%"]} flexDirection="column">
                    <Flex shadow="xl" flexDirection="column" borderRadius={10} padding={5}>
                        <Text fontSize="2xl" letterSpacing="wide" fontWeight={600}>Recent Announcement</Text>
                        { recent_announce ?
                            <Announcement padding={0} margin={0} announcement={recent_announce} course={code} setAnnouncements={setAnnouncements} isAnnouncementPage={false}/>
                            : 
                                <Flex justifyContent="center">
                                    <Spinner></Spinner>
                                </Flex>
                        }
                    </Flex>
                    {/* Need to figure out what to put here
                        <Flex shadow="xl" flexDirection="column" borderRadius={10} padding={5} marginTop={5}>
                            <Text fontSize="2xl" letterSpacing="wide" fontWeight={600}>WORK IN PROGRESS</Text>
                        </Flex>
                    */}
                </Flex>
                <Flex width={["100%", "100%", "100%", "100%", "100%", "50%"]} marginLeft={[0, 0, 0, 0, 0, 10]} flexDirection={"column"}>
                    <Flex shadow="xl" flexDirection="column" borderRadius={10} padding={5} width={["100%"]}>
                        <Text fontSize="2xl" letterSpacing="wide" fontWeight={600} marginBottom={5}>Your Progress</Text>
                        <VStack divider={<Divider></Divider>} spacing={5}>
                            {   courses.length > 0 ?
                                courses.map(course => {
                                    //TODO GET COMPLETION
                                    const progress = Math.floor(Math.random()*100) + "%"
                                    return (
                                        <Flex width="100%" key={course.name + "-progress"}>
                                            <Flex flexDirection={["column", "row"]}>
                                                <Text letterSpacing="wide" fontWeight={200} overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" width={[100, 150, 200]}>{course.name}</Text>
                                                <Text letterSpacing="wider" fontWeight={200}>{course.topic_code}</Text>
                                            </Flex>
                                            <Flex flexGrow={1} marginLeft={5} borderRadius={10}>
                                                <Flex width="100%" maxHeight="15px" alignSelf="center" marginRight={2}>
                                                    <Flex width="100%" bg="gray.200" borderRadius={10}>
                                                        <Flex bg="blue.400" width={progress} color="blue.400" borderRadius={10}>'</Flex>
                                                    </Flex>
                                                </Flex>
                                                <Text color="blue.400" fontWeight={500} alignSelf="center">{progress}</Text>
                                            </Flex>
                                        </Flex>
                                    )
                                })
                                : <Spinner></Spinner>
                            }
                        </VStack>
                    </Flex>
                    <Flex shadow="xl" flexDirection="column" borderRadius={10} padding={5} marginTop={5}>
                        <Text fontSize="2xl" letterSpacing="wide" fontWeight={600} marginBottom={5}>Continue</Text>
                        { content ? 
                            <Flex flexDirection="column">
                                <Text fontSize="lg" letterSpacing="wide">{content[1] + " " + content[0].name}</Text>
                                <Accordion allowMultiple>
                                    { 
                                        categories.map(e => {
                                            return (
                                                <AccordionItem key={e + "-accordion"}>
                                                    <AccordionButton>
                                                        <Text flexGrow={1} textAlign="left" fontWeight="500">{e}</Text>
                                                        <AccordionIcon></AccordionIcon>
                                                    </AccordionButton>
                                                    <AccordionPanel>
                                                        <Stack divider={<Divider></Divider>} spacing={2}>
                                                            {
                                                                //Need to check if is correct category
                                                                content[0].course_materials.map(mat => {
                                                                    return (
                                                                        <Flex key={e + "-material-" + mat.name} marginLeft={5}>
                                                                            <Text fontSize="sm">{mat.name}</Text>
                                                                        </Flex>
                                                                    )
                                                                })
                                                            }
                                                        </Stack>
                                                    </AccordionPanel>
                                                </AccordionItem>
                                            )
                                        })
                                    }
                                </Accordion>
                            </Flex>
                            : 
                                <Flex justifyContent="center">
                                    <Spinner></Spinner>
                                </Flex>
                        }
                    </Flex>
                </Flex> 
            </Flex>
        </Flex>
    )
}

export default MainSelection