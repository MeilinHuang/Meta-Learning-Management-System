import React, { useEffect, useState } from "react";
import {
    Spinner,
    Button,
    Accordion,
    Center,
    Flex,
    useBreakpointValue,
    InputGroup,
    InputLeftElement,
    Input,
} from "@chakra-ui/react";
import { GrTree } from "react-icons/gr";
import { SearchIcon } from "@chakra-ui/icons";
import { useHistory } from "react-router-dom";
import TopicAccordion from "../components/content/TopicAccordion.js";
import { backend_url, topic_group_url } from "../Constants.js"

function CourseContentPage({ topicGroup }) {
    const [data, setData] = useState(null);
    const [display, setDisplay] = useState([]);
    const treeButton = useBreakpointValue({ base: <GrTree />, md: "TOPIC TREE" });

    let history = useHistory();
    useEffect(() => {
        if (topicGroup && topicGroup.topics_list.length > 0) {
            topicGroup.topics_list.map(topic => {
                let cpy = []
                topic.course_materials.map(mat => {
                    //console.log(cpy.indexOf(mat), mat, cpy)
                    const mat_str = JSON.stringify(mat)
                    if (cpy.indexOf(mat_str) === -1) {
                        cpy.push(mat_str)
                    }
                })
                let content = []
                cpy.map(data => {
                    content.push(JSON.parse(data))
                })
                topic.course_materials = content
            })
            Promise.all( 
                topicGroup.topics_list.map(topic => {
                    return fetch(backend_url + "user/" + localStorage.getItem("id") + "/progress/" + topic.id, {
                        headers: {
                            Accept: "application/json", "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    })
                })
            )
            .then(resp_list => Promise.all(resp_list.map(resp => resp.json())))
            .then(data_list => {
                data_list.map((data, index) => {
                    topicGroup.topics_list[index].course_materials.map(material => {
                        let found = false
                        data.map(file => {
                            if (file.topic_file_id === material.id) {
                                found = true
                                material.completed = file.completed
                            }
                        })
                        if (!found) {
                            material.completed = false
                        }
                    })
                })
                setData(topicGroup.topics_list);
                setDisplay(topicGroup.topics_list);
            })
            .catch(error => console.log(error))
        }
    }, [topicGroup]);

    useEffect(() => {
        if (data) {
            data.map((topic) => {
                topic.prereqs.map((prereq) => {
                    let button = document.getElementById("prereq-" + prereq.name);
                    if (button) {
                        button.addEventListener("click", (e) => {
                            let prereq_button = document.getElementById(
                                "accordion-button-topic-" + prereq.name
                            );
                            if (prereq_button) {
                                const position = prereq_button.getBoundingClientRect();
                                prereq_button.animate(
                                    [
                                        {
                                            transform: "scale(1)",
                                        },
                                        {
                                            transform: "scale(1.04)",
                                        },
                                        {
                                            transform: "scale(1)",
                                        },
                                    ],
                                    {
                                        duration: 300,
                                        delay: 300,
                                    }
                                );
                                window.scrollTo({
                                    top: position.top,
                                    behavior: "smooth",
                                });
                            }
                        });
                    }
                });
            });
        }
    });

    return (
        <>
            <Flex justify="center" marginBottom={10}>
                <Flex alignItems="center" width={["100%", "100%", "80%"]}>
                    {/* Check if user is staff */}
                    {localStorage.getItem("staff") === "1" ?
                        <Button marginRight={5} onClick={() => history.push("/topictree")}>
                            {treeButton}
                        </Button>
                        : null
                    }
                    <InputGroup>
                        <InputLeftElement
                            pointerEvents="none"
                            children={<SearchIcon color="gray.300" />}
                        />
                        <Input
                            placeholder="Search"
                            onChange={(e) => {
                                const value = e.target.value.toLowerCase();
                                let tmpArray = data.filter((e) => {
                                    if (e.name.toLowerCase().indexOf(value) !== -1) {
                                        return true;
                                    }
                                    for (let content of e.course_materials) {
                                        if (content.name.toLowerCase().indexOf(value) !== -1) {
                                            return true;
                                        }
                                    }
                                    return false;
                                });
                                setDisplay(tmpArray);
                            }}
                        ></Input>
                    </InputGroup>
                </Flex>
            </Flex>
            {display ? (
                <Flex justify="center" marginBottom={10}>
                    <Flex flexDirection="column" width={["100%", "100%", "80%"]}>
                        <Accordion width="100%" allowMultiple>
                            {display.map((e) => {
                                return (
                                    <TopicAccordion
                                        topic={e}
                                        course={topicGroup}
                                        key={"section " + e.name}
                                    ></TopicAccordion>
                                );
                            })}
                        </Accordion>
                    </Flex>
                </Flex>
            ) : (
                <Center alignContent="center">
                    <Spinner size="xl" />
                </Center>
            )}
        </>
    );
}

export default CourseContentPage;
