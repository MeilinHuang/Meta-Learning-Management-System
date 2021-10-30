import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { backend_url } from "../../Constants";

function CategoryContent({topic, category, content, course, course_id}) {
    const [checked, setChecked] = useState(false)

    const allComplete = (list) => {
        let all = true
        list.map(data => {
            if (!data.completed) {
                all = false
            }
            return data
        })
        return all
    }

    useEffect(() => {
        setChecked(allComplete(content))
    }, [content])

    return (
        <div>
            {topic && <AccordionItem key={topic.name + "-" + category}>
                <AccordionButton paddingRight={0} paddingLeft={5}>
                    <Checkbox
                        colorScheme="green"
                        size="md"
                        marginRight="20px"
                        isChecked={checked}
                    ></Checkbox>
                    <Text flexGrow={1} textAlign="left" letterSpacing={1}>
                        {category}
                    </Text>
                    <AccordionIcon></AccordionIcon>
                </AccordionButton>
                <AccordionPanel>
                    <Stack spacing={5} divider={<Divider></Divider>} paddingTop={3}>
                        {
                            content.map(mat => {
                                return (
                                    <Flex key={mat + "-" + topic.name} width="100%">
                                        <Flex marginLeft="15px" flexGrow={1}>
                                            <Checkbox
                                                colorScheme="green"
                                                size="md"
                                                marginRight="20px"
                                                defaultIsChecked={mat.completed}
                                                onChange={e => {
                                                    fetch(backend_url + "user/" + localStorage.getItem("id") + "/progress/" + topic.id, {
                                                        method: "PUT",
                                                        headers: {
                                                            Accept: "application/json", "Content-Type": "application/json",
                                                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                                                        },
                                                        body: JSON.stringify({
                                                            topicFileId: mat.id,
                                                            completion: e.target.checked,
                                                        })
                                                    })
                                                    .then(resp => resp.json())
                                                    .then(data => {
                                                        content.map((file, index) => {
                                                            if (file.id === mat.id) {
                                                                content[index].completed = e.target.checked
                                                            }
                                                            return (file, index)
                                                        })
                                                        setChecked(allComplete(content))
                                                    })
                                                    
                                                }}
                                            ></Checkbox>
                                            <Flex
                                                flexGrow="1"
                                                _hover={{
                                                    textDecoration: "underline",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => {
                                                    window.open(
                                                        "/_files/topicGroup" +
                                                        course_id +
                                                        "/topic" +
                                                        topic.id +
                                                        "/" +
                                                        mat.name
                                                    );
                                                }}
                                            >
                                                <Text
                                                    overflow="hidden"
                                                    textOverflow="ellipsis"
                                                    whiteSpace="nowrap"
                                                >
                                                    {mat.name}
                                                </Text>
                                                {
                                                    mat.due_date &&
                                                    <Text flexGrow="1" textAlign="right">
                                                        {new Date(mat.due_date).toISOString().split("T")[0]}
                                                    </Text>
                                                }
                                            </Flex>
                                        </Flex>
                                    </Flex>
                                )
                            })
                        }
                    </Stack>
                </AccordionPanel>
            </AccordionItem>}
            </div>
    )
}

export default CategoryContent