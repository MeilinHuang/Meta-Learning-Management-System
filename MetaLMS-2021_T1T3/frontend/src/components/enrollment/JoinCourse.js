import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { isLoggedIn, getCurrentUser } from "../../utils/helpers";
import { backend_url } from "../../Constants";
import {
  Flex,
  Box,
  Input,
  Heading,
  Button,
  FormControl,
  FormLabel,
  useToast,
  Text,
} from "@chakra-ui/react";

async function doCodeEnroll(code) {
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/JSON",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const r = await fetch(
    `${backend_url}enroll/code/${code}/${getCurrentUser()}`,
    options
  );
  const ret = await r.json();
  return ret;
}

async function doSearch(query) {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/JSON",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const r = await fetch(`${backend_url}enroll/search/${query}`, options);
  const ret = await r.json();
  return ret;
}

async function doEnroll(name) {
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/JSON",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const id = getCurrentUser();
  const r = await fetch(`${backend_url}enroll/${name}/id/${id}`, options);
  if (r.status !== 200) {
    return { error: "Enrollment failed." };
  }
  const ret = await r.json();
  return ret;
}

export default function CourseInvite() {
  let { code } = useParams();
  const [invite, setInvite] = useState(code);
  const [query, setQuery] = useState();
  const [results, setResults] = useState([]);
  const history = useHistory();
  const toast = useToast();

  useEffect(() => {
    if (!isLoggedIn()) {
      const redirect = encodeURIComponent(`redirect=invite/${code}`)
      history.push(`/login?${redirect}`);
    }
  }, []);

  //check login by session storage
  return (
    <Flex width="Full" align="center" justifyContent="center">
      <Box width="100%">
        <Box textAlign="center">
          <Heading>Join a course!</Heading>
        </Box>
        <Flex
          mt={8}
          width="Full"
          align="flex-start"
          justifyContent="space-around"
        >
          <Box my={4} textAlign="center" width="40%">
            <FormControl>
              <FormLabel>Join with an invite code</FormLabel>
              <Input
                type="text"
                defaultValue={code}
                placeholder="Enter a course invite code"
                size="lg"
                onChange={(e) => setInvite(e.currentTarget.value)}
              />
            </FormControl>
            <Button
              variant="outline"
              width="full"
              mt={4}
              type="submit"
              maxWidth="200px"
              onClick={(e) => {
                e.preventDefault();
                doCodeEnroll(invite).then((r) => {
                  if (!!r.error) {
                    toast({
                      title: `Unable to enroll in course`,
                      description: `${r.error}. Please ensure you're entering the correct invite code.`,
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                    });
                  } else {
                    toast({
                      title: "Successfully Enrolled.",
                      description: `Please return to the dashboard to view your new course!`,
                      status: "success",
                      duration: 5000,
                      isClosable: true,
                    });
                  }
                });
              }}
            >
              Join Course!
            </Button>
          </Box>
          <Box my={4} textAlign="center" width="40%">
            <FormControl>
              <FormLabel>Search for a course</FormLabel>
              <Input
                type="text"
                placeholder="Enter a course name"
                size="lg"
                onChange={(e) => setQuery(e.currentTarget.value)}
              />
            </FormControl>
            <Button
              variant="outline"
              width="full"
              mt={4}
              type="submit"
              maxWidth="200px"
              onClick={(e) => {
                e.preventDefault();
                doSearch(query).then((r) => {
                  setResults(r.results);
                });
              }}
            >
              Search
            </Button>
            <Box>
              {results.map((k) => {
                return (
                  <Box
                    backgroundColor="#dddddd"
                    p={2}
                    my={2}
                    borderRadius={10}
                    textAlign="left"
                  >
                    <Text fontSize="xl">
                      <strong>{k.topic_code}</strong> - {k.name}
                    </Text>
                    <Text noOfLines={2}>{k.course_outline}</Text>
                    <Box mr={4} textAlign="right">
                      <Button
                        my={2}
                        onClick={(e) => {
                          e.preventDefault();
                          doEnroll(k.name).then((r) => {
                            if (!!r.error) {
                              toast({
                                title: `Unable to enroll in course`,
                                description: `${r.error}`,
                                status: "error",
                                duration: 5000,
                                isClosable: true,
                              });
                            } else {
                              toast({
                                title: "Successfully Enrolled.",
                                description: `Please return to the dashboard to view your new course!`,
                                status: "success",
                                duration: 5000,
                                isClosable: true,
                              });
                            }
                          });
                        }}
                      >
                        Enroll
                      </Button>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
