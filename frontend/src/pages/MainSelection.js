import React, { useState, useEffect } from "react"
import { useHistory } from 'react-router-dom'
import { Flex, Text, Heading, VStack, Spinner, Box, Stat, StatLabel, StatNumber } from "@chakra-ui/react"
import { get_topic_groups } from "../Constants.js"

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
            <Flex bg="blue.400" width="100%" paddingInline={[5, 5, 10]} paddingBlock={5} borderRadius={10}>
                <VStack textAlign="left" alignItems="flex-start" color="white" spacing={10}>
                    <Heading letterSpacing="wider">Welcome John!</Heading>
                    <Box>
                        <Text fontSize="large" fontWeight="medium">You have 3 assignments due</Text>
                        <Text fontSize="large" fontWeight="medium">The next assignment due is COMP1234 Assignment 1 on 22nd September</Text>
                    </Box>
                </VStack>
            </Flex>
            <Flex marginTop={50}>
                {   courses.length > 0 ?
                    <VStack alignItems="flex-start" spacing={30} width={["100%", "100%", "100%", "100%", "50%"]} alignSelf="start" shadow="base" borderRadius={10} paddingInline={5} paddingBlock={5}>
                        {
                            courses.map(course => {
                                counter += 1
                                return (
                                    <Flex justifyContent="space-between" key={"user-course-" + counter} width="100%" cursor="pointer" _hover={{textDecoration: "underline"}} onClick={e => {
                                        history.push("/course-page/" + course.name)
                                    }}>
                                        <Flex flexDirection="column">
                                            <Text letterSpacing="wide" fontWeight="bold">{course.name}</Text>
                                            <Text letterSpacing="wider">{course.topic_code}</Text>
                                        </Flex>
                                        <Flex width={["30%", "50%"]}>
                                            <Flex display={["none", "flex"]} width="100%" bg="blue.100" borderRadius={100} height="20px" alignSelf="center">
                                                <Flex width="60%" bg="blue.500" borderRadius={100}></Flex>
                                            </Flex>
                                            <Text display={["none", "flex"]} marginLeft={10} alignSelf="center" fontSize="large" fontWeight="bold">60%</Text>
                                            <Stat display={["flex", "none"]} justifyContent="center">
                                                <StatLabel>Progress</StatLabel>
                                                <StatNumber>60%</StatNumber>
                                            </Stat>
                                        </Flex>
                                    </Flex>
                                )
                            })
                        }
                    </VStack>
                    : <Spinner></Spinner>
                }
            </Flex>
        </Flex>
    )
}

export default MainSelection