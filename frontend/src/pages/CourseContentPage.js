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

function CourseContentPage({ topicGroup }) {
  const [data, setData] = useState(null);
  const [display, setDisplay] = useState([]);
  const treeButton = useBreakpointValue({ base: <GrTree />, md: "TOPIC TREE" });

  let history = useHistory();
  let course = history.location.pathname.split("/").filter((e) => e !== "")[1];
  useEffect(() => {
    if (topicGroup) {
      setData(topicGroup.topics_list);
      setDisplay(topicGroup.topics_list);
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
          {/* TODO ONLY FOR ADMIN TO EDIT TOPIC TREE*/}
          <Button onClick={() => history.push("/topictree")}>
            {treeButton}
          </Button>
          <InputGroup marginLeft={5}>
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
                    course={topicGroup.id}
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
