import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  Flex,
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

export default function AccountSettings() {
  const [userProfile, setUserProfile] = useState({});
  const [update, setUpdate] = useState(false);
  const [editing, setEditing] = useState(false);

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
              <Avatar size="2xl" name={userProfile.user_name} />
              <Box ml={4}>
                <Heading size="2xl">{userProfile.user_name}</Heading>
                <Text fontSize="xl" as="i">
                {userProfile.zid}{" - "}{userProfile.staff ? "Staff Member" : "Student"}
                </Text>
              </Box>
            </Flex>
            <Box my={4}>
              {editing ? (
                <>
                  <Input defaultValue={userProfile.email} />
                  <Input type="password" placeholder="Password" />
                  <Input type="password" placeholder="Confirm Password" />
                  <Button>Upload Profile Image</Button>
                  <br />
                  <Button
                    onClick={() => {
                      setEditing(false);
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Text>{userProfile.email}</Text>
                  <Text>Password</Text>
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
            <Box>
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
