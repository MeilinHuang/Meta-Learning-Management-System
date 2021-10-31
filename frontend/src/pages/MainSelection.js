import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Flex,
  Text,
  Heading,
  VStack,
  Spinner,
  Box,
  Divider,
  Accordion,
  Button,
} from "@chakra-ui/react";
import { backend_url } from "../Constants.js";
import RecentAnnouncment from "../components/selection/RecentAnnouncement.js";
import { ReactComponent as Learn } from "../static/svgs/undraw_Online_learning_re_qw08.svg";
import { ReactComponent as Study } from "../static/svgs/undraw_studying_s3l7.svg";
import CategoriesList from "../components/content/CategoriesList.js";

function MainSelection({ user }) {
  const [courses, setCourses] = useState([]);
  const [recent_announce, setRecent] = useState(null);
  const [code, setCode] = useState(null);
  //Most recently accessed topic
  const [content, setContent] = useState(null);

  useEffect(() => {
    //NEED TO CHANGE TO GET ENROLLED COURSES AND MOST RECENTLY ACCESSED CONTENT
    //Getting currently enrolled courses and most recent announcement
    async function fetchData() {
      if (user) {
        if (user.enrolled_courses) {
          setCourses(user.enrolled_courses);

          Promise.all(
            user.enrolled_courses.map((course) => {
              return fetch(backend_url + "topicgroup/" + course.name, {
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              })
                .then((e) => e.json())
                .then((e) => {
                  e.topics_list.map((topic) => {
                    if (topic.id === user.last_accessed_topic) {
                      let cpy = topic;

                      let uniq_list = [];
                      topic.course_materials.map((mat) => {
                        const mat_str = JSON.stringify(mat);
                        if (uniq_list.indexOf(mat_str) === -1) {
                          uniq_list.push(mat_str);
                        }
                      });
                      let mat_list = [];
                      uniq_list.map((data) => {
                        mat_list.push(JSON.parse(data));
                      });

                      cpy.course_materials = mat_list;
                      cpy.course = course.name;

                      setContent(cpy);
                    }
                  });
                  user.enrolled_courses.map((course) => {
                    if (course.name === e.name) {
                      if (e && course) {
                        Promise.all(
                          e.topics_list.map((topic) => {
                            return fetch(
                              backend_url +
                                "user/" +
                                localStorage.getItem("id") +
                                "/progress/" +
                                topic.id
                            );
                          })
                        )
                          .then((resp) =>
                            Promise.all(resp.map((r) => r.json()))
                          )
                          .then((data) => {
                            let total = 0;
                            let complete = 0;
                            data.map((topic_progress) => {
                              topic_progress.map((progress) => {
                                total++;
                                if (progress.completed) {
                                  complete++;
                                }
                              });
                            });
                            let progress = 0;
                            if (total > 0) {
                              progress = (complete / total) * 100;
                            }
                            course.progress = progress;
                          });
                      }
                    }
                  });
                  setCourses(user.enrolled_courses);
                  return e;
                })
                .catch((error) => console.log(error));
            })
          ).then((topic_groups) => {
            topic_groups.map((e) => {
              if (e) {
                let latest = null;
                e.announcements_list.map((announce) => {
                  if (announce !== null) {
                    if (
                      latest === null ||
                      Date.parse(latest.post_date) <
                        Date.parse(announce.post_date)
                    ) {
                      latest = announce;
                    }
                  }
                });
                if (latest !== null) {
                  fetch(backend_url + "user/" + latest.author, {
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  })
                    .then((resp) => resp.json())
                    .then((user) => {
                      latest = { ...latest, author: user.user_name };
                      setRecent(latest);
                      setCode(e.name);
                    });
                }
              }
            });
          });
        }
      }
    }
    fetchData();
  }, [user]);

  let counter = 0;
  let history = useHistory();
  if (courses.length > 0) {
    return (
      <Flex marginTop={[30, 30, 0, 0]} flexDirection="column">
        <Flex
          width="100%"
          flexDirection={[
            "column",
            "column",
            "column",
            "column",
            "column",
            "row",
          ]}
        >
          <Flex
            width={["100%", "100%", "100%", "100%", "100%", "70%"]}
            borderRadius={10}
            shadow="lg"
          >
            <Flex paddingInline={[5, 5, 10]} paddingBlock={5}>
              {user ? (
                <VStack textAlign="left" alignItems="flex-start" spacing={5}>
                  <Flex>
                    <Heading
                      fontSize={["4xl", "5xl", "6xl"]}
                      letterSpacing="wider"
                      fontWeight="300"
                    >
                      Welcome
                    </Heading>
                    <Heading
                      fontSize={["4xl", "5xl", "6xl"]}
                      letterSpacing="wider"
                      fontWeight="500"
                      marginLeft={"10px"}
                    >
                      {user && user.user_name.split(" ")[0]}
                    </Heading>
                  </Flex>
                </VStack>
              ) : (
                <Spinner></Spinner>
              )}
            </Flex>
            <Flex flexGrow={1} alignItems="center" justifyContent="center">
              <Flex display={["none", "none", "none", "none", "flex"]}>
                <Study width={"100%"} height={"100%"}></Study>
              </Flex>
            </Flex>
          </Flex>
          <Flex
            width={["100%", "100%", "100%", "100%", "100%", "30%"]}
            marginLeft={[0, 0, 0, 0, 0, 10]}
            marginTop={[5, 5, 5, 5, 5, 0]}
          >
            <Flex
              width="100%"
              height="100%"
              shadow="xl"
              borderRadius={10}
              padding={5}
            >
              <Flex flexDirection="column" width="100%">
                <Text
                  fontSize="2xl"
                  letterSpacing="wide"
                  fontWeight={600}
                  marginBottom={5}
                >
                  Your Courses
                </Text>
                <VStack spacing={3} divider={<Divider></Divider>}>
                  {/* Display courses sorted by topic code numerical value */}
                  {courses.length > 0 ? (
                    courses
                      .sort((a, b) => {
                        return a.topic_code.replace(/\D/g, "") >
                          b.topic_code.replace(/\D/g, "")
                          ? 1
                          : -1;
                      })
                      .map((course) => {
                        counter += 1;
                        return (
                          <Flex
                            key={"user-course-" + counter}
                            width="100%"
                            cursor="pointer"
                            _hover={{ color: "blue.500" }}
                            onClick={(e) => {
                              history.push("/course-page/" + course.name);
                            }}
                          >
                            <Flex flexDirection={["row"]}>
                              <Text
                                letterSpacing="wide"
                                fontWeight={200}
                                overflow="hidden"
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                                width={[150, 150, 200]}
                              >
                                {course.name}
                              </Text>
                              <Text letterSpacing="wider" fontWeight={200}>
                                {course.topic_code}
                              </Text>
                            </Flex>
                          </Flex>
                        );
                      })
                  ) : (
                    <Spinner></Spinner>
                  )}
                </VStack>
              </Flex>
              <Flex flexGrow={1} alignItems="center" justifyContent="center">
                <Flex
                  display={["none", "flex", "flex", "flex", "flex", "none"]}
                >
                  <Learn width={"100%"} height={"100%"}></Learn>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Flex
          width="100%"
          marginTop={5}
          flexDirection={[
            "column",
            "column",
            "column",
            "column",
            "column",
            "row",
          ]}
        >
          <Flex
            width={["100%", "100%", "100%", "100%", "100%", "50%"]}
            flexDirection="column"
          >
            <RecentAnnouncment
              recent_announce={recent_announce}
              code={code}
            ></RecentAnnouncment>
            {/* Need to figure out what to put here
							<Flex shadow="xl" flexDirection="column" borderRadius={10} padding={5} marginTop={5}>
								<Text fontSize="2xl" letterSpacing="wide" fontWeight={600}>WORK IN PROGRESS</Text>
							</Flex>
						*/}
          </Flex>
          {!user.staff ? (
            <Flex
              width={["100%", "100%", "100%", "100%", "100%", "50%"]}
              marginLeft={[0, 0, 0, 0, 0, 10]}
              flexDirection={"column"}
            >
              <Flex
                shadow="xl"
                flexDirection="column"
                borderRadius={10}
                padding={5}
                width={["100%"]}
              >
                <Text
                  fontSize="2xl"
                  letterSpacing="wide"
                  fontWeight={600}
                  marginBottom={5}
                >
                  Your Progress
                </Text>
                <VStack divider={<Divider></Divider>} spacing={5}>
                  {courses.length > 0 ? (
                    courses.map((course) => {
                      const progress = parseInt(course.progress) + "%";
                      return (
                        <Flex width="100%" key={course.name + "-progress"}>
                          <Flex flexDirection={["column", "row"]}>
                            <Text
                              letterSpacing="wide"
                              fontWeight={200}
                              overflow="hidden"
                              textOverflow="ellipsis"
                              whiteSpace="nowrap"
                              width={[100, 150, 200]}
                            >
                              {course.name}
                            </Text>
                            <Text letterSpacing="wider" fontWeight={200}>
                              {course.topic_code}
                            </Text>
                          </Flex>
                          <Flex flexGrow={1} marginLeft={5} borderRadius={10}>
                            <Flex
                              width="100%"
                              maxHeight="15px"
                              alignSelf="center"
                              marginRight={2}
                            >
                              <Flex
                                width="100%"
                                bg="gray.200"
                                borderRadius={10}
                              >
                                <Flex
                                  bg="blue.400"
                                  width={progress}
                                  color="blue.400"
                                  borderRadius={10}
                                >
                                  '
                                </Flex>
                              </Flex>
                            </Flex>
                            <Text
                              color="blue.400"
                              width={"5ch"}
                              fontWeight={500}
                              alignSelf="center"
                            >
                              {progress}
                            </Text>
                          </Flex>
                        </Flex>
                      );
                    })
                  ) : (
                    <Spinner></Spinner>
                  )}
                </VStack>
              </Flex>
              {content ? (
                <Flex
                  shadow="xl"
                  flexDirection="column"
                  borderRadius={10}
                  padding={5}
                  marginBlock={5}
                >
                  <Text
                    fontSize="2xl"
                    letterSpacing="wide"
                    fontWeight={600}
                    marginBottom={5}
                  >
                    Continue
                  </Text>
                  <Flex flexDirection="column">
                    <Text fontSize="lg" letterSpacing="wide">
                      {content.course}
                    </Text>
                    <Text fontWeight="semibold" fontSize="lg">
                      {content.name}
                    </Text>
                    <Accordion allowMultiple>
                      <CategoriesList
                        topic={content}
                        course={content.name}
                        course_id={content.topic_group_id}
                      ></CategoriesList>
                    </Accordion>
                  </Flex>
                </Flex>
              ) : (
                <Flex
                  shadow="xl"
                  flexDirection="column"
                  borderRadius={10}
                  padding={5}
                  marginBlock={5}
                >
                  <Text
                    fontSize="2xl"
                    letterSpacing="wide"
                    fontWeight={600}
                    marginBottom={5}
                  >
                    Begin Learning
                  </Text>
                  <Flex flexDirection="column">
                    <Text fontSize="lg" letterSpacing="wide">
                      Navigate to a course page and begin learning!
                    </Text>
                  </Flex>
                </Flex>
              )}
            </Flex>
          ) : (
            <Flex
              width={["100%", "100%", "100%", "100%", "100%", "50%"]}
              marginLeft={[0, 0, 0, 0, 0, 10]}
              flexDirection={"column"}
            >
              <Flex
                shadow="xl"
                flexDirection="column"
                borderRadius={10}
                padding={5}
              >
                <Text
                  fontSize="2xl"
                  letterSpacing="wide"
                  fontWeight={600}
                  marginBottom={5}
                >
                  Staff Links
                </Text>
                {user.enrolled_courses.map((course) => {
                  return (
                    <Flex flexGrow={1} key={course.name + "staff-link"}>
                      <Text alignSelf="center">{course.name}</Text>
                      <Flex flexGrow={1} justifyContent="end">
                        <Button
                          onClick={() =>
                            history.push(
                              "/course-page/" + course.name + "/enrollment"
                            )
                          }
                        >
                          Enrollment
                        </Button>
                        <Button
                          onClick={() =>
                            history.push(
                              "/course-page/" + course.name + "/forums"
                            )
                          }
                          marginLeft={5}
                        >
                          Forums
                        </Button>
                      </Flex>
                    </Flex>
                  );
                })}
              </Flex>
            </Flex>
          )}
        </Flex>
      </Flex>
    );
  } else {
    if (user) {
      return (
        <Flex marginTop={[30, 30, 0, 0]}>
          <Flex
            width={["100%", "100%", "100%", "100%", "100%", "70%"]}
            borderRadius={10}
            shadow="lg"
          >
            <Flex paddingInline={[5, 5, 10]} paddingBlock={5}>
              {user ? (
                <VStack textAlign="left" alignItems="flex-start" spacing={5}>
                  <Flex>
                    <Heading
                      fontSize={["4xl", "5xl", "6xl"]}
                      letterSpacing="wider"
                      fontWeight="300"
                    >
                      Welcome
                    </Heading>
                    <Heading
                      fontSize={["4xl", "5xl", "6xl"]}
                      letterSpacing="wider"
                      fontWeight="500"
                      marginLeft={"10px"}
                    >
                      {user.user_name.split(" ")[0]}
                    </Heading>
                  </Flex>
                  <Box>
                    <Text
                      fontSize="large"
                      letterSpacing="wide"
                      fontWeight="200"
                    >
                      You have not enrolled in any courses
                    </Text>
                    <Text
                      fontSize="large"
                      letterSpacing="wide"
                      fontWeight="200"
                    >
                      To get started navigate to the enrolments tab and enrol
                      into a course
                    </Text>
                  </Box>
                </VStack>
              ) : (
                <Spinner></Spinner>
              )}
            </Flex>
            <Flex flexGrow={1} alignItems="center" justifyContent="center">
              <Flex display={["none", "none", "none", "none", "flex"]}>
                <Study width={"100%"} height={"100%"}></Study>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      );
    }
    return null;
  }
}

export default MainSelection;
