import React, { useEffect, useState } from "react";
import {
    Flex,
    Checkbox,
    AccordionPanel,
    AccordionIcon,
    AccordionItem,
    AccordionButton,
    Heading,
    Accordion,
    Button,
    Text,
} from "@chakra-ui/react";
import CategoriesList from "./CategoriesList.js";
import { backend_url } from "../../Constants.js";

function TopicAccordion({ topic, course }) {
    const [allCompleted, setAll] = useState(false)

    useEffect(() => {
        if (topic) {
            const total = topic.course_materials.length
            let completed = 0
            topic.course_materials.map(file => {
                if (file.completed) {
                    completed++
                }
                return file
            })
            if (completed === total) {
                setAll(true)
            }
        }
    }, [topic])
    return (
        <AccordionItem id={"topic-" + topic.name}>
            <Flex width="100%">
                <AccordionButton onClick={e => {
                    fetch(backend_url + "user/" + localStorage.getItem("id"), {
                        method: "PUT",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                        body: JSON.stringify({
                            "lastTopic": topic.id
                        })
                    })
                    .then(resp => resp.json())
                }}>
                    <Flex flexGrow={1} textAlign="left">
                        <Checkbox
                            colorScheme="green"
                            size="lg"
                            marginRight="20px"
                            isChecked={allCompleted}
                        ></Checkbox>
                        <Heading size={["sm", "md"]} letterSpacing={1}>
                            {topic.name}
                        </Heading>
                    </Flex>
                    <AccordionIcon></AccordionIcon>
                </AccordionButton>
            </Flex>
            <AccordionPanel>
                <Accordion width="100%" allowMultiple>
                    <Flex paddingBlock={3}>
                        {topic.prereqs.length > 0 ? (
                            <Flex>
                                <Text>Prerequisites: </Text>
                                {topic.prereqs.map((prereq, index) => {
                                    return (
                                        <Button
                                            key={topic.name + "-prereq-" + prereq.name + " " + index}
                                            marginLeft={"1vw"}
                                            height={7}
                                            id={"prereq-" + prereq.name}
                                        >
                                            {prereq.name}
                                        </Button>
                                    );
                                })}
                            </Flex>
                        ) : (
                            <Text>No prerequisites</Text>
                        )}
                    </Flex>
                    <CategoriesList topic={topic} course={course.name} course_id={course.id}></CategoriesList>
                </Accordion>
            </AccordionPanel>
        </AccordionItem>
    );
}

export default TopicAccordion;
