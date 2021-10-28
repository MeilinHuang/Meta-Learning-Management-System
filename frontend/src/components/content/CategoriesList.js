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

function CategoriesList({ topic, course }) {
    const [content, setContent] = useState({"Preparation": [], "Content": [], "Practice": [], "Assessments": []})

    useEffect(() => {
        let cpy = {"Preparation": [], "Content": [], "Practice": [], "Assessments": []}
        topic.course_materials.map(file => {
            if (file.type === "assessment") {
                cpy["Assessments"].push(file)
            }
            else {
                cpy[file.type[0].toUpperCase() + file.type.slice(1)].push(file)
            }
        })
        setContent(cpy)
    }, [])
    
    return Object.keys(content).map(category => {
        return (
            <div key={category + "-" + course.name}>
                {topic && <AccordionItem key={topic.name + "-" + category}>
                    <AccordionButton paddingRight={0} paddingLeft={5}>
                        <Checkbox
                            colorScheme="green"
                            size="md"
                            marginRight="20px"
                            isChecked={content[category].every(file => file.completed)}
                        ></Checkbox>
                        <Text flexGrow={1} textAlign="left" letterSpacing={1}>
                            {category}
                        </Text>
                        <AccordionIcon></AccordionIcon>
                    </AccordionButton>
                    <AccordionPanel>
                        <Stack spacing={5} divider={<Divider></Divider>} paddingTop={3}>
                            {
                                content[category].map(mat => {
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
                                                        //UPDATE PARENT CHECKBOX
                                                        //UPDATE CONTENT
                                                    }}
                                                ></Checkbox>
                                                <Flex
                                                    _hover={{
                                                        textDecoration: "underline",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => {
                                                        window.open(
                                                            "/_files/topicGroup" +
                                                            course +
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
        );
    })
}

export default CategoriesList;
