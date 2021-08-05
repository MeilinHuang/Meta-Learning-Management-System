import React, { useEffect, useState } from "react"
import { 
    useToast, 
    Spinner, 
    Heading, 
    Text, 
    Button, 
    Box, 
    Accordion, 
    AccordionItem, 
    AccordionButton, 
    AccordionPanel, 
    Stack, 
    Checkbox, 
    Center, 
    AccordionIcon, 
    Flex, 
    Divider, 
    useBreakpointValue, 
    InputGroup,
    InputLeftElement,
    Input, 
} from "@chakra-ui/react"
import { GrTree } from "react-icons/gr"
import { SearchIcon } from "@chakra-ui/icons"
import {get_topics_url} from "../Constants.js"
import { useHistory } from 'react-router-dom'

function CourseContentPage() {
    const [data, setData] = useState(null)
    const [display, setDisplay] = useState([])
    const [files, setFiles] = useState([])
    const treeButton = useBreakpointValue({base: <GrTree/>, md: "TOPIC TREE"})

    const download = useToast()
    let history = useHistory()
    let course = history.location.pathname.split("/").filter(e => e !== "")[1]
    useEffect(() => {
        fetch(get_topics_url(course)).then(e => {
            return e.json()
        }).then(e => {
            setData(e.topics_list)
            setDisplay(e.topics_list)
        })
    }, [])
    
    const categories = ["Preparation", "Content", "Practice", "Assessments"]

    let counter = 0
    let pageView = (
        <Center alignContent="center">
            <Spinner size="xl"/>
        </Center>
    )
    if (data != null) {
        pageView =  (
            <Box marginInline={[0, 0, 0, 30, 100]}>
                <Box marginBottom={10}>
                    <Flex alignItems="center">
                        <InputGroup variant="filled">
                            <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" />}/>
                            <Input placeholder="Search" onChange={e => {
                                const value = e.target.value.toLowerCase()
                                let tmpArray = data.filter(e => {
                                    if (e.name.toLowerCase().indexOf(value) !== -1) {
                                        return true
                                    }
                                    for (let content of e.course_materials) {
                                        if (content.name.toLowerCase().indexOf(value) !== -1) {
                                            return true
                                        }
                                    }
                                    return false
                                })
                                setDisplay(tmpArray)
                            }}></Input>
                        </InputGroup>
                        {/* TODO ONLY FOR ADMIN TO EDIT TOPIC TREE*/}
                        <Button marginLeft={5} onClick={() => history.push("/topictree")}>{treeButton}</Button>
                    </Flex>
                </Box>
                <Center flexDirection="column">
                    <Accordion width="100%" allowMultiple>
                        { display.map(e => {
                            return (
                                <AccordionItem key={"section " + e.name}>
                                    <h2>
                                        <AccordionButton>
                                            <Flex flexGrow={1} textAlign="left">
                                                <Heading size={["sm", "md"]}>
                                                    {e.name}
                                                </Heading>
                                            </Flex>
                                            <AccordionIcon></AccordionIcon>
                                        </AccordionButton>
                                    </h2>
                                    {   
                                        <AccordionPanel>
                                            
                                                <Accordion width="100%" allowMultiple>
                                                    {
                                                        categories.map(category => {
                                                            return (
                                                                <AccordionItem key={e.name + "-" + category}>
                                                                    <AccordionButton paddingRight={0} paddingLeft={5}>
                                                                        <Text flexGrow={1} textAlign="left">
                                                                            {category}
                                                                        </Text>
                                                                        <AccordionIcon></AccordionIcon>
                                                                    </AccordionButton>
                                                                    <AccordionPanel>
                                                                        <Stack spacing={5} divider={<Divider></Divider>} paddingTop={3}>
                                                                        { 
                                                                            e.course_materials.map(mat => {
                                                                                if (category.toLowerCase().indexOf(mat.type) != -1) {
                                                                                    return (
                                                                                        <Box key={mat + "-" + e.name}>
                                                                                            <Flex>
                                                                                                <Checkbox onChange={box => {
                                                                                                    let checked = box.target.checked
                                                                                                    let old = files
                                                                                                    if (checked) {
                                                                                                        old.push(mat.name)
                                                                                                        setFiles(old)
                                                                                                    }
                                                                                                    else {
                                                                                                        const index = old.indexOf(mat.name)
                                                                                                        if (index > -1) {
                                                                                                            old.splice(index, 1)
                                                                                                            setFiles(old)
                                                                                                        }
                                                                                                    }
                                                                                                }}></Checkbox>
                                                                                                <Text marginLeft={10} overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">{mat.name}</Text>
                                                                                            </Flex>
                                                                                        </Box>
                                                                                    )
                                                                                }
                                                                            })
                                                                        }
                                                                        </Stack>
                                                                    </AccordionPanel>
                                                                </AccordionItem>
                                                            )
                                                        })
                                                    }
                                                </Accordion>
                                                {/*TODO redirect to view content after click*/}
                                                {/*
                                                    e.course_materials.map(e => {
                                                        counter += 1
                                                        return (
                                                            
                                                        )
                                                    })
                                                */}
                                        </AccordionPanel>
                                    }
                                </AccordionItem>
                            )
                        }) }
                    </Accordion>
                    {/*TODO actually download files after file system is implemented in backend */}
                    <Button marginTop={5} alignSelf="flex-end" onClick={e =>{
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
            </Box>
        )
    }
    return pageView
}

export default CourseContentPage