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

export default function CourseInvite() {
  let { code } = useParams();
  const [invite, setInvite] = useState(code);
  const history = useHistory();
  const toast = useToast();

  useEffect(() => {
    if (!isLoggedIn()) {
      history.push("/login");
    }
  }, []);

  //check login by session storage
  return (
    <Flex width="Full" align="center" justifyContent="center">
      <Box width="100%">
        <Box textAlign="center">
          <Heading>Join a course!</Heading>
        </Box>
        <Flex width="Full" align="center" justifyContent="space-around">
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
              }}
            >
              Search
            </Button>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
