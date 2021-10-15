import React from "react"
import {
    Flex,
    Stack,
    Divider,
    Checkbox,
    Text,
    AccordionItem,
    AccordionButton,
    AccordionIcon,
    AccordionPanel,
} from "@chakra-ui/react"

function CategoriesList({topic, course}) {
    const categories = ["Preparation", "Content", "Practice", "Assessments"]
    return (
        categories.map(category => {
            return (
                <AccordionItem key={topic.name + "-" + category}>
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
                            topic.course_materials.map(mat => {
                                if (category.toLowerCase().indexOf(mat.type) !== -1) {
                                    return (
                                        <Flex key={mat + "-" + topic.name} width="100%">
                                            <Flex marginLeft="15px" flexGrow={1}>
                                                <Checkbox colorScheme="green" size="md" marginRight="20px"></Checkbox>
                                                <Flex _hover={{textDecoration: "underline", cursor: "pointer"}} onClick={() => {
                                                    window.open("/_files/topicGroup" + course + "/topic" + topic.id + "/" + mat.name)
                                                }}>
                                                    <Text overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" >{mat.name}</Text>
                                                </Flex>
                                            </Flex>
                                        </Flex>
                                    )
                                }
                                return null
                            })
                        }
                        </Stack>
                    </AccordionPanel>
                </AccordionItem>
            )
        })
    )
}

export default CategoriesList