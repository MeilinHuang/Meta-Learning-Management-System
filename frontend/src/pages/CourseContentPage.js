import React, { useEffect, useState } from "react"
import {  
    Spinner, 
    Heading, 
    Text, 
    Button, 
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
    const [loaded, setLoaded] = useState([])
    const treeButton = useBreakpointValue({base: <GrTree/>, md: "TOPIC TREE"})

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
    
    useEffect(() => {
        if (data) {
            data.map(topic => {
                topic.prereqs.map(prereq => {
                    let button = document.getElementById("prereq-" + prereq.name)
                    if (button) {
                        button.addEventListener("click", e => {
                            let prereq_button = document.getElementById("accordion-button-topic-" + prereq.name)
                            if (prereq_button) {
                                const position = prereq_button.getBoundingClientRect()
                                prereq_button.animate([{
                                    transform: "scale(1)",
                                },
                                {
                                    transform: "scale(1.04)",
                                },
                                {
                                    transform: "scale(1)",
                                }
                                ], 300)
                                window.scrollTo({
                                    top: position.top
                                })
                            }
                        })
                    }
                })
            })
        }
    })

    const categories = ["Preparation", "Content", "Practice", "Assessments"]

    let pageView = (

        <Center alignContent="center">
            <Spinner size="xl"/>
        </Center>
    )
    if (data != null) {
        pageView =  (
            <Flex justify="center" marginBottom={10}>
                <Flex flexDirection="column" width={["100%", "100%", "80%"]}>
                    <Accordion width="100%" allowMultiple>
                        { display.map(e => {
                            return (
                                <AccordionItem key={"section " + e.name} id={"topic-" + e.name}>
                                    <Flex width="100%">
                                        <AccordionButton>
                                            <Flex flexGrow={1} textAlign="left">
                                                <Checkbox colorScheme="green" size="lg" marginRight="20px"></Checkbox>
                                                <Heading size={["sm", "md"]} letterSpacing={1}>
                                                    {e.name}
                                                </Heading>
                                            </Flex>
                                            <AccordionIcon></AccordionIcon>
                                        </AccordionButton>
                                    </Flex>
                                    {   
                                        <AccordionPanel>
                                                <Accordion width="100%" allowMultiple>
                                                    <Flex paddingBlock={3}>
                                                        { e.prereqs.length > 0 ?
                                                            <Flex>
                                                                <Text>Prerequisites: </Text>
                                                                {e.prereqs.map(prereq => {
                                                                    return (
                                                                        <Button key={e.name + "-prereq-" + prereq.name} marginLeft={"1vw"} height={7} id={"prereq-" + prereq.name}>
                                                                            {prereq.name}
                                                                        </Button>
                                                                    )
                                                                })}
                                                            </Flex>
                                                            : <Text>No prerequisites</Text>
                                                        }
                                                    </Flex>
                                                    {
                                                        categories.map(category => {
                                                            return (
                                                                <AccordionItem key={e.name + "-" + category}>
                                                                    <AccordionButton paddingRight={0} paddingLeft={5}>
                                                                        <Checkbox colorScheme="green" size="md" marginRight="20px"></Checkbox>
                                                                        <Text flexGrow={1} textAlign="left" letterSpacing={1}>
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
                                                                                        <Flex key={mat + "-" + e.name} width="100%">
                                                                                            <Flex marginLeft="15px" flexGrow={1}>
                                                                                                <Flex _hover={{textDecoration: "underline", cursor: "pointer"}} onClick={() => {
                                                                                                    window.open("/_files/" + course + "/" + e.name + "/" + mat.name)
                                                                                                }}>
                                                                                                    <Checkbox colorScheme="green" size="md" marginRight="20px"></Checkbox>
                                                                                                    <Text overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" >{mat.name}</Text>
                                                                                                </Flex>
                                                                                            </Flex>
                                                                                        </Flex>
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
                                        </AccordionPanel>
                                    }
                                </AccordionItem>
                            )
                        }) }
                    </Accordion>
                </Flex>
            </Flex>
        )
    }
    return (
        <>
            <Flex justify="center" marginBottom={10}>
                <Flex alignItems="center" width={["100%", "100%", "80%"]}>
                    {/* TODO ONLY FOR ADMIN TO EDIT TOPIC TREE*/}
                    <Button onClick={() => history.push("/topictree")}>{treeButton}</Button>
                    <InputGroup marginLeft={5}>
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
                </Flex>
            </Flex>
            {pageView}
        </>
    )
}

export default CourseContentPage