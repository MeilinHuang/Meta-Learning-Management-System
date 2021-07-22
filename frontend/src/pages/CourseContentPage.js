import React, { useEffect, useState } from "react"
import { useToast, Spinner, Heading, Text, Button, Box, Accordion, AccordionItem, AccordionButton, AccordionPanel, Stack, Checkbox, Center, AccordionIcon, Flex, Divider, useBreakpointValue } from "@chakra-ui/react"
import {get_topics_url} from "../Constants.js"
import { useHistory } from 'react-router-dom'

function CourseContentPage() {
    const buttonSize = useBreakpointValue({ base: 'xs', sm: 'sm', md: 'md' });
    const [data, setData] = useState(null)
    const [files, setFiles] = useState([])
    const download = useToast()
    let history = useHistory()

    useEffect(() => {
        //TODO get course page content
        fetch(get_topics_url("C++ Programming")).then(e => {
            return e.json()
        }).then(e => {
            setData(e)
        })
    }, [])
    
    let counter = 0

    let pageView = (
        <Center alignContent="center">
            <Spinner size="xl"/>
        </Center>
    )
    if (data != null) {
        pageView =  (
            <div>
                <Box marginBottom={10}>
                    <Flex alignItems="center">
                        <Heading flexGrow={1}size="lg">Course Content</Heading>
                        {/* TODO ONLY FOR ADMIN TO EDIT TOPIC TREE*/}
                        <Button color="white" bg="blue.400" size={buttonSize} onClick={() => history.push("/topictree")}>TOPIC TREE</Button>
                    </Flex>
                    <Divider></Divider>
                </Box>
                <Center flexDirection="column">
                    <Accordion width="100%" allowMultiple>
                        {/*TODO NEED TO CHANGE TO ACTUAL DATA*/}
                        { data.topics_list.map(e => {
                            return (
                                <AccordionItem key={"section " + e.name}>
                                    <h2>
                                        <AccordionButton>
                                            <Box flex="1" textAlign="left">
                                                <Heading size={["sm", "md"]}>
                                                    {e.name}
                                                </Heading>
                                            </Box>
                                            <AccordionIcon></AccordionIcon>
                                        </AccordionButton>
                                    </h2>
                                    {   
                                        e.course_materials.length > 0 &&
                                        <AccordionPanel>
                                            <Stack spacing={5} divider={<Divider></Divider>} paddingTop={3}>
                                                {/*TODO redirect to view content after click*/}
                                                {
                                                    e.course_materials.map(e => {
                                                        counter += 1
                                                        return (
                                                            <Box key={e.name +  counter}>
                                                                <Flex>
                                                                    <Checkbox onChange={box => {
                                                                        let checked = box.target.checked
                                                                        let old = files
                                                                        if (checked) {
                                                                            old.push(e.name)
                                                                            setFiles(old)
                                                                        }
                                                                        else {
                                                                            const index = old.indexOf(e.name)
                                                                            if (index > -1) {
                                                                                old.splice(index, 1)
                                                                                setFiles(old)
                                                                            }
                                                                        }
                                                                    }}></Checkbox>
                                                                    <Text marginLeft={10}>{e.name}</Text>
                                                                </Flex>
                                                            </Box>
                                                        )
                                                    })
                                                }
                                            </Stack>
                                        </AccordionPanel>
                                    }
                                </AccordionItem>
                            )
                        }) }
                    </Accordion>
                    {/*TODO actually download files after file system is implemented in backend */}
                    <Button marginTop={5} alignSelf="flex-end" color="white" bg="blue.400" size={buttonSize} onClick={e =>{
                        if (files.length > 0) {
                            return (
                                download({
                                    title: "Downloading",
                                    description: "The files will be downloaded shortly",
                                    status: "info",
                                    duration: 3000,
                                    isClosable: true,
                                })
                            )
                        }
                        else {
                            return (
                                download({
                                    title: "No selected files",
                                    description: "Please select files to download",
                                    status: "warning",
                                    duration: 3000,
                                    isClosable: true,
                                })
                            )
                        }
                    }}>DOWNLOAD</Button>
                </Center>
            </div>
        )
    }
    return pageView
}

export default CourseContentPage