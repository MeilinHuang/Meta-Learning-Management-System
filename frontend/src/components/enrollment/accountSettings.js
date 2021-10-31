import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  Flex,
  FormControl,
  FormLabel,
  Box,
  Heading,
  Avatar,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Link,
  Td,
  useToast,
  Button,
  Input,
} from "@chakra-ui/react";
import { isLoggedIn, isStaff } from "../../utils/helpers";
import { backend_url } from "../../Constants";

async function getUser(id) {
  const r = await fetch(`${backend_url}user/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const ret = await r.json();
  return ret;
}

async function doUpdate(pass, id, email, imgUrl, newPass, newPassConf) {
  if (newPass && newPass !== newPassConf) {
    return { error: "Passwords do not match." };
  }

  const lowerEmail = email ? email.toLowerCase() : undefined;
  const data = {
    email: lowerEmail,
    password: pass,
    newPassword: newPass,
    imgUrl: imgUrl,
  };

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/JSON",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  };

  const r = await fetch(`${backend_url}user/${id}`, options);
  const ret = await r.json();
  return ret;
}

export default function AccountSettings() {
  const [userProfile, setUserProfile] = useState({});
  const [update, setUpdate] = useState(false);
  const [password, setPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [newConfirmPassword, setNewConfirmPassword] = useState();
  const [email, setEmail] = useState();
  const [imgUrl, setImgUrl] = useState();
  const [editing, setEditing] = useState(false);
  const toast = useToast();

  const history = useHistory();
  useEffect(() => {
    if (!isLoggedIn()) {
      history.push("/login");
    } else {
      getUser(localStorage.getItem("id")).then((r) => {
        setUserProfile(r);
      });
    }
  }, [update]);

  console.log(userProfile);

  return (
    <Flex width="Full" align="center" justifyContent="center">
      <Box width="100%">
        <Box textAlign="center">
          <Heading>Account Information</Heading>
        </Box>
        <Flex
          pt={8}
          width="Full"
          align="center"
          direction="column"
          justifyContent="space-around"
        >
          {/* 
            Account type
            Photo
            Name
            zid
            email
            update password
            current courses
          */}
          <Box width="100%">
            <Flex align="center" width="full">
              <Avatar
                size="2xl"
                name={userProfile.user_name}
                src={userProfile.img_url}
              />
              <Box ml={4}>
                <Heading size="2xl">{userProfile.user_name}</Heading>
                <Text fontSize="xl" as="i">
                  {userProfile.zid}
                  {" - "}
                  {userProfile.staff ? "Staff Member" : "Student"}
                </Text>
              </Box>
            </Flex>
            <Box my={4}>
              <Flex width="100%" justify="space-around">
                <Box width="45%">
                  <FormControl>
                    <FormLabel> Email </FormLabel>
                    <Input
                      defaultValue={userProfile.email}
                      disabled={!editing}
                      type="email"
                      placeholder="name@mail.com"
                      size="lg"
                      onChange={(e) => setEmail(e.currentTarget.value)}
                    />
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel> Profile Picture URL </FormLabel>
                    <Input
                      defaultValue={userProfile.img_url}
                      disabled={!editing}
                      type="email"
                      placeholder="https://i.imgur.com/???????.jpg"
                      size="lg"
                      onChange={(e) => setImgUrl(e.currentTarget.value)}
                    />
                  </FormControl>
                </Box>
                <Box width="45%">
                  <FormControl>
                    <FormLabel>New Password </FormLabel>
                    <Input
                      disabled={!editing}
                      type="password"
                      placeholder="********"
                      size="lg"
                      onChange={(e) => setNewPassword(e.currentTarget.value)}
                    />
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Confirm New Password </FormLabel>
                    <Input
                      disabled={!editing}
                      type="password"
                      placeholder="********"
                      size="lg"
                      onChange={(e) =>
                        setNewConfirmPassword(e.currentTarget.value)
                      }
                    />
                  </FormControl>
                </Box>
              </Flex>
              <Flex justify="space-around" mt={4}>
                <Box width="45%">
                  <FormControl isRequired>
                    <FormLabel>Current Password </FormLabel>
                    <Input
                      disabled={!editing}
                      type="password"
                      placeholder="********"
                      size="lg"
                      onChange={(e) => setPassword(e.currentTarget.value)}
                    />
                  </FormControl>
                </Box>
                <Box width="45%" textAlign="right" mt={8}>
                  {editing ? (
                    <>
                      <Button
                        mr={2}
                        onClick={() => {
                          doUpdate(
                            password,
                            userProfile.id,
                            email,
                            imgUrl,
                            newPassword,
                            newConfirmPassword
                          ).then((r) => {
                            console.log(r);
                            if (!!r.error) {
                              toast({
                                title: `Unable to update profile`,
                                description: `${r.error} Please ensure you're entering all details correctly.`,
                                status: "error",
                                duration: 5000,
                                isClosable: true,
                              });
                            } else {
                              setEditing(false);
                              setUpdate((prev) => !prev);
                              toast({
                                title: "Successfully Updated Profile!",
                                status: "success",
                                duration: 5000,
                                isClosable: true,
                              });
                            }
                          });
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => {
                          setEditing(false);
                          setUpdate((prev) => !prev);
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => {
                          setEditing(true);
                        }}
                      >
                        Edit
                      </Button>
                    </>
                  )}
                </Box>
              </Flex>
              <br />
            </Box>
            <Box my={4}>
              <Text fontSize="2xl">
                <strong>Current Courses:</strong>
              </Text>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Code</Th>
                    <Th>Name</Th>
                    <Th>Outline</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {userProfile.enrolled_courses &&
                    userProfile.enrolled_courses.length > 0 &&
                    userProfile.enrolled_courses.map((k) => {
                      return (
                        <Tr>
                          <Td>
                            <Link
                              as="strong"
                              color="blue"
                              onClick={() => {
                                history.push(`/course-page/${k.name}`);
                              }}
                            >
                              {k.topic_code}
                            </Link>
                          </Td>
                          <Td>{k.name}</Td>
                          <Td>{k.course_outline}</Td>
                        </Tr>
                      );
                    })}
                </Tbody>
              </Table>
            </Box>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
