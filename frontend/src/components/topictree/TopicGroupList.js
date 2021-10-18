import React, { useEffect, useRef, useState } from "react";
import {
  Heading,
  Box,
  Stack,
  Flex,
  Divider,
  Button,
  Text,
} from "@chakra-ui/react";
import { ArrowRightIcon } from "@chakra-ui/icons";
import { backend_url, topic_group_url } from "../../Constants.js";
import { Spinner } from "@chakra-ui/spinner";
import TopicTreeHeader from "./TopicTreeHeader.js";
import { useHistory } from "react-router-dom";

export default function TopicGroupList() {
  const [data, setData] = useState([]);
  const [view, setView] = useState("Graph View");
  const history = useHistory();

  function handleClick(route) {
    history.push("/topicTree/" + route);
  }

  useEffect(async function () {
    fetch(topic_group_url)
      .then((response) => response.json())
      .then(function (response) {
        setData(response);
      });
  }, []);
  return (
    <>
      <TopicTreeHeader id="topic-tree-header" view={view}></TopicTreeHeader>
      <Box padding={5}>
        <Heading marginLeft={4}>Topic Groups</Heading>
        <Heading as="h5" size="sm" marginLeft={4}>
          Click on a topic group to view the graph
        </Heading>
        <Stack spacing={5} divider={<Divider></Divider>} marginTop={10}>
          {data.map((e) => {
            return (
              <Flex
                key={"topic-group-" + e.id}
                paddingTop={5}
                paddingBottom={5}
                justifyContent="auto"
              >
                <Button as={Flex} bg="white" cursor="pointer" flexGrow={1}>
                  <ArrowRightIcon
                    color="blue.500"
                    alignSelf="center"
                  ></ArrowRightIcon>
                  <Box marginLeft={10} width={[300]}>
                    <Heading fontSize="lg">{e.name}</Heading>
                  </Box>
                  <Box marginLeft={10}>
                    <Text>{e.topic_code}</Text>
                  </Box>
                  <Box marginLeft={10} fontSize="sm">
                    <Text>{e.topics_list.length.toString()} topics</Text>
                  </Box>
                  <Box flexGrow={1}></Box>
                </Button>
                <Box flexGrow={0.1}></Box>
                <Button
                  bg="blue.500"
                  color="white"
                  onClick={() => handleClick(e.name)}
                >
                  Go to Topic Graph
                </Button>
              </Flex>
            );
          })}
        </Stack>
      </Box>
    </>
  );
}
