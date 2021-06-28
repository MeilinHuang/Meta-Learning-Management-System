import React from "react"
import { Heading, Text, Button, Box, Accordion, AccordionItem, AccordionButton, AccordionPanel, Stack, Checkbox, Center, AccordionIcon, Flex, Divider, useBreakpointValue } from "@chakra-ui/react"

function CourseContentPage() {
    const buttonSize = useBreakpointValue({ base: 'xs', sm: 'sm', md: 'md' });
    return (
        <div>
            <Box marginBottom={10}>
                <Flex alignItems="center">
                    <Heading flexGrow={1}size="lg">Course Content</Heading>
                    {/* TODO ONLY FOR ADMIN */}
                    <Button color="white" bg="blue.400" size={buttonSize}>EDIT</Button>
                </Flex>
                <Divider></Divider>
            </Box>
            <Center flexDirection="column">
                <Accordion width="100%" allowMultiple>
                    {/*TODO NEED TO CHANGE TO ACTUAL DATA*/}
                    { [...Array(5).keys()].map(e => {
                        return (
                            <AccordionItem>
                                <h2>
                                    <AccordionButton>
                                        <Box flex="1" textAlign="left">
                                            <Heading size={["sm", "md"]}>
                                                Section {e + 1}
                                            </Heading>
                                        </Box>
                                        <AccordionIcon></AccordionIcon>
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel>
                                    <Stack spacing={5} divider={<Divider></Divider>} paddingTop={3}>
                                        {/*TODO NEED TO CHANGE TO ACTUAL DATA*/}
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
                                    <Flex flexDirection="column" marginTop={[5, 2, 0]}>
                                        {/*TODO NEED TO GET TICKED CONTENT */}
                                        <Button alignSelf="flex-end" color="white" bg="blue.400" size={buttonSize}>DOWNLOAD</Button>
                                    </Flex>
                                </AccordionPanel>
                            </AccordionItem>
                        )
                    }) }
                </Accordion>
            </Center>
        </div>
    )
}

export default CourseContentPage