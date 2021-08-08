import React, { useState, useEffect } from "react"
import { useHistory } from 'react-router-dom'
import { Flex, Text, Heading, VStack, Spinner, Box, Divider, Stat, StatLabel, StatNumber, border } from "@chakra-ui/react"
import { get_topic_groups } from "../Constants.js"
import { ReactComponent as Learn } from "../static/svgs/undraw_Online_learning_re_qw08.svg"
import { ReactComponent as Study } from "../static/svgs/undraw_studying_s3l7.svg"

function MainSelection() {
    const [courses, setCourses] = useState([])
    //NEED TO CHANGE TO GET ENROLLED COURSES
    useEffect(() => {
        fetch(get_topic_groups()).then(e => e.json()).then(e => setCourses(e))
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
                            <Study width={[250, 350]} height={[150, 250]}></Study>
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
                                <Learn width={[0, 0]} height={[0, 0]}></Learn>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
            <Flex width="100%" marginTop={5}>
                <Flex shadow="xl" flexDirection="column" borderRadius={10} padding={5} width={["100%", "100%", "100%", "100%", "100%", "50%"]}>
                    <Text fontSize="2xl" letterSpacing="wide" fontWeight={600} marginBottom={5}>Your Progress</Text>
                    <VStack divider={<Divider></Divider>} spacing={5}>
                        {   courses.length > 0 ?
                            courses.map(course => {
                                //TODO GET COMPLETION
                                const progress = Math.floor(Math.random()*100) + "%"
                                return (
                                    <Flex width="100%">
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
            </Flex>
        </Flex>
    )
}

export default MainSelection