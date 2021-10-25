import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { isLoggedIn } from "../../utils/helpers";

import {
  Flex,
  Box,
  Input,
  Heading,
  Button,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

export default function CourseInvite() {
  let { code } = useParams();
  const [invite, setInvite] = useState(code);
  const history = useHistory();

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
            <FormControl isRequired>
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
              }}
            >
              Join Course!
            </Button>
          </Box>
          <Box my={4} textAlign="center" width="40%">
            <FormControl isRequired>
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
