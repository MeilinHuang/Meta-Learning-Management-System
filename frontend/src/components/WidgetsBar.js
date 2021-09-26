import React from "react";
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
//import Calendar from 'react-calendar'
//import "./widgetBar.css"
//import 'react-calendar/dist/Calendar.css';

function logOut() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("staff");
}

function WidgetsBar({ page }) {
  const history = useHistory();
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
              <Flex alignItems="center">
                <Avatar name="John Smith" src="https://bit.ly/dan-abramov" />
                <Box paddingLeft={3}>
                  <Text fontWeight="medium">John Smith</Text>
                </Box>
              </Flex>
            </MenuButton>
            <Portal>
              <MenuList zIndex={100}>
                <MenuItem>Profile</MenuItem>
                <MenuItem>Settings</MenuItem>
                {isLoggedIn ? (
                  <MenuItem
                    onclick={(e) => {
                      console.log("here55");
                      logOut();
                      history.push("/");
                    }}
                  >
                    Log Out
                  </MenuItem>
                ) : (
                  <MenuItem>Log In</MenuItem>
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
              height="100%"
            >
              <Box
                bg="blue.500"
                width="50%"
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
