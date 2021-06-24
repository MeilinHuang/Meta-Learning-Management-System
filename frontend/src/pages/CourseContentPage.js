import React from "react"
import { Heading, Text, Button, Box, Accordion, AccordionItem, AccordionButton, AccordionPanel, Stack, Checkbox, Center, AccordionIcon, Flex, Divider } from "@chakra-ui/react"

function CourseContentPage() {
    return (
        <Center flexDirection="column">
            <Box width={["100%", "100%", "100%", "80%"]}>
                <Heading alignSelf="center">Course Content</Heading>
            </Box>
            <Accordion width={["100%", "100%", "100%", "80%"]} allowMultiple borderWidth={1}>
                { [...Array(5).keys()].map(e => {
                    return (
                        <AccordionItem>
                            <h2>
                                <AccordionButton color="white" bg="blue.500" _hover={{ bg:"blue.300"}}>
                                    <Box flex="1" textAlign="left">
                                        <Heading size="md">
                                            Section {e + 1}
                                        </Heading>
                                    </Box>
                                    <AccordionIcon></AccordionIcon>
                                </AccordionButton>
                            </h2>
                            <AccordionPanel>
                                <Stack spacing={5} divider={<Divider></Divider>} paddingTop={3}>
                                    {
                                        [...Array(5).keys()].map(e => {
                                            return (
                                                <Box>
                                                    <Flex>
                                                        <Checkbox></Checkbox>
                                                        <Text marginLeft={10}>Content {e + 1}</Text>
                                                    </Flex>
                                                </Box>
                                            )
                                        })
                                    }
                                </Stack>
                                <Flex flexDirection="column">
                                    <Button alignSelf="flex-end" bg="blue.300">DOWNLOAD</Button>
                                </Flex>
                            </AccordionPanel>
                        </AccordionItem>
                    )
                }) }
            </Accordion>
        </Center>
    )
}

export default CourseContentPage