import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Text,
  Divider,
  Skeleton,
  Avatar,
  Flex,
  Menu,
  MenuButton,
  Portal,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import Calendar from "./Calendar.js";
import { isLoggedIn } from "../utils/helpers";
import { useHistory } from "react-router-dom";
import { logOut } from "../utils/helpers";

function WidgetsBar({ page, user }) {
  const history = useHistory();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (page === "course") {
      if (user) {
        let course_name = decodeURI(
          document.location.pathname.split("/").filter((e) => e !== "")[1]
        );
        user.enrolled_courses.map((course) => {
          if (course.name === course_name) {
            setProgress(parseInt(course.progress) + "%");
          }
          return course;
        });
      }
    }
  });

  return (
    <Box
      display={["none", "none", "none", "block"]}
      width={200}
      borderLeftWidth={1}
      height="100vh"
    >
      <Flex flexDirection="column">
        <Flex alignItems="center" justifyContent="center" marginTop={3}>
          <Menu isLazy>
            <MenuButton _hover={{ textDecoration: "underline" }}>
              {user ? (
                <Flex alignItems="center">
                  <Avatar name={user.user_name} />
                  <Box paddingLeft={3}>
                    <Text fontWeight="medium">{user.user_name}</Text>
                  </Box>
                </Flex>
              ) : (
                <Flex alignItems="center">
                  <Avatar />
                  <Box paddingLeft={3}>
                    <Text fontWeight="medium">Log In</Text>
                  </Box>
                </Flex>
              )}
            </MenuButton>
            <Portal>
              <MenuList zIndex={100}>
                <MenuItem>Profile</MenuItem>
                <MenuItem>Settings</MenuItem>
                {isLoggedIn() ? (
                  <MenuItem
                    onClick={(e) => {
                      
                      logOut();
                      history.go(0);
                    }}
                  >
                    Log Out
                  </MenuItem>
                ) : (
                  <MenuItem
                    onClick={(e) => {
                      history.push("/login");
                    }}
                  >
                    Log In
                  </MenuItem>
                )}
              </MenuList>
            </Portal>
          </Menu>
        </Flex>
        <Container
          padding={0}
          width="100%"
          marginTop={3}
          marginBottom={10}
          height={200}
          userSelect="none"
        >
          <Calendar></Calendar>
        </Container>
        <Container>
          <Text size="sm">Due Dates</Text>
          <Divider color="black" opacity="1"></Divider>
          <Skeleton width="100%" marginTop={5} height={5}></Skeleton>
          <Skeleton width="100%" marginTop={5} height={5}></Skeleton>
          <Skeleton width="100%" marginTop={5} height={5}></Skeleton>
        </Container>
        {page === "course" && (
          <Container marginTop={10}>
            <Text size="sm">Course Progress</Text>
            <Divider color="black" opacity="1"></Divider>
            <Box
              bg="blue.100"
              marginTop={5}
              borderRadius={10}
              width="100%"
              position="relative"
            >
              <Text position="absolute" left="45%">
                {progress}
              </Text>
              <Box
                bg="blue.500"
                width={progress}
                height="100%"
                borderRadius="10px 0px 0px 10px"
                textAlign="center"
                color="blue.500"
              >
                .
              </Box>
            </Box>
          </Container>
        )}
      </Flex>
    </Box>
  );
}

export default WidgetsBar;
