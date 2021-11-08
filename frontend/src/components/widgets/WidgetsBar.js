import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Text,
  Divider,
  Avatar,
  Flex,
  Menu,
  MenuButton,
  Portal,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import Calendar from "./Calendar.js";
import { isLoggedIn } from "../../utils/helpers";
import { useHistory } from "react-router-dom";
import { logOut } from "../../utils/helpers";
import { backend_url } from "../../Constants";
import Reminder from "./Reminder.js";

function WidgetsBar({ page, user }) {
  const history = useHistory();
  const [progress, setProgress] = useState("0%");
  const [reminders, setReminders] = useState([]);

    useEffect(() => {
        if (user) {
            if (page === "course") {
                let course_name = decodeURI(
                    document.location.pathname.split("/").filter((e) => e !== "")[1]
                );
        
                user.enrolled_courses.map((course) => {
                    
                    if (course.name === course_name) {
                        fetch(backend_url + "topicgroup/" + course.name, {
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        })
                        .then((e) => e.json())
                        .then(e => {
                            let total = 0
                            
                            e.topics_list.map(cpy => {
                                let uniq_list = []
                                cpy.course_materials.map(mat => {
                                    const mat_str = JSON.stringify(mat)
                                    if (uniq_list.indexOf(mat_str) === -1) {
                                        uniq_list.push(mat_str)
                                        total++
                                    }
                                })
                            })
                            
                            Promise.all(e.topics_list.map(topic => {
                                return fetch(backend_url + "user/" + localStorage.getItem("id") + "/progress/" + topic.id)
                            }))
                            .then(resp => Promise.all(resp.map(r => r.json())))
                            .then (data_list => {
                                let complete = 0
                                data_list.map(data => {
                                    if (data) {
                                        data.map(file => {
                                            if (file.completed) {
                                                complete++
                                            }
                                        })
                                    }
                                })
                                let progress = 0
                                if (total > 0) {
                                    progress = (complete/total) * 100
                                }
                                setProgress(parseInt(progress) + "%")
                            })
                            .catch(error => console.log(error))
                        })
                        .catch(error => console.log(error))
                    }
                })
            user.enrolled_courses.map((course) => {
            if (course.name === course_name) {
                fetch(backend_url + "topicgroup/" + course.name, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                })
                .then((e) => e.json())
                .then((e) => {
                    let total = 0;
                    let complete = 0;
                    Promise.all(
                        e.topics_list.map((topic) => {
                            total += topic.course_materials.length
                            return fetch(backend_url + "user/" + localStorage.getItem("id") + "/progress/" + topic.id);
                        })
                    )
                    .then((resp) => Promise.all(resp.map((r) => r.json())))
                    .then((data_list) => {
                        data_list.map((data) => {
                            if (data) {
                                data.map((file) => {
                                    if (file.completed) {
                                        complete++;
                                    }
                                });
                            }
                        });
                        let progress = 0;
                        if (total > 0) {
                            progress = (complete / total) * 100;
                        }
                        setProgress(parseInt(progress) + "%");
                    })
                    .catch(error => console.log(error));
                })
                .catch((error) => console.log(error));
            }
            });
      }

      fetch(backend_url + "user/" + localStorage.getItem("id") + "/calendar", {
        method: "GET",
        headers: {
          "Content-Type": "application/JSON",
          Authorisation: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          setReminders(data);
        });
    }
  }, [user]);

  return (
    <Box
      display={["none", "none", "none", "block"]}
      width={200}
      borderLeftWidth={1}
      height="100vh"
    >
      <Flex flexDirection="column">
        <Flex alignItems="center" marginTop={3} marginLeft={5}>
          <Menu isLazy>
            <MenuButton _hover={{ textDecoration: "underline" }}>
              {user ? (
                <Flex alignItems="center" justifyContent="start">
                  <Avatar src={user.img_url} name={user.user_name} />
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
              <MenuList zIndex={5}>
                <MenuItem
                  onClick={() => {
                    history.push("/account");
                  }}
                >
                  Account
                </MenuItem>
                {isLoggedIn() ? (
                  <MenuItem
                    onClick={(e) => {
                      logOut();
                      history.push("/login");
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
          <Text size="sm">Reminders</Text>
          <Divider color="black" opacity="1"></Divider>
          {reminders.slice(0, 5).map((reminder) => {
            return (
              <Reminder
                key={reminder.description + " " + reminder.remind_date}
                reminder={reminder}
              ></Reminder>
            );
          })}
        </Container>
        {page === "course" && user && !user.staff && (
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
              <Text position="absolute" left={"calc(50% - 2ch)"}>
                {progress}
              </Text>
              {parseInt(progress.substring(0, progress.length - 1)) > 0 ? (
                <Box
                  bg="blue.500"
                  width={progress}
                  height="100%"
                  borderRadius="10px"
                  textAlign="center"
                  color="blue.500"
                >
                  .
                </Box>
              ) : (
                <Box
                  bg="blue.100"
                  width={10}
                  height="100%"
                  borderRadius="10px"
                  textAlign="center"
                  color="blue.100"
                >
                  .
                </Box>
              )}
            </Box>
          </Container>
        )}
      </Flex>
    </Box>
  );
}

export default WidgetsBar;
