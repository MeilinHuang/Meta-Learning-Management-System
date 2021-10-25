import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { isLoggedIn, isStaff } from "../../utils/helpers";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  Flex,
  Box,
  Input,
  Heading,
  useToast,
  Button,
  FormControl,
  FormLabel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  InputGroup,
  InputRightElement,
  Tooltip,
  Link,
  Switch,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { DeleteIcon, CopyIcon, CloseIcon } from "@chakra-ui/icons";
import { backend_url } from "../../Constants";

async function generateCode(name, uses, valid) {
  const data = {};
  if (uses && uses !== "0") data.uses = uses;
  if (valid && valid !== "0") data.expiration = valid;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/JSON",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  };

  const r = await fetch(`${backend_url}enroll/code/${name}`, options);
  if (r.status !== 200) {
    return { error: "Unable to generate invite code" };
  }
  const ret = await r.json();
  return ret;
}

async function getCodes(name) {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/JSON",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const r = await fetch(`${backend_url}enroll/codes/${name}`, options);
  if (r.status !== 200) {
    return { error: "Unable to generate invite code" };
  }
  const ret = await r.json();
  return ret;
}

async function deleteCode(code) {
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/JSON",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const r = await fetch(`${backend_url}enroll/code/${code}`, options);
  if (r.status !== 200) {
    return { error: "Unable to delete invite code" };
  }
  const ret = await r.json();
  return ret;
}

async function getEnrollments(name) {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/JSON",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const r = await fetch(`${backend_url}enrollments/${name}`, options);
  if (r.status !== 200) {
    return { error: "Unable to get enrollments" };
  }
  const ret = await r.json();
  const students = [];
  for (const i of ret) {
    const student = {
      id: i.user_id,
      progress: i.progress,
    };

    await fetch(`http://localhost:8000/user/${i.user_id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => r.json())
      .then((r) => {
        student.name = r.user_name;
        student.zid = r.zid;
        if (String(r.id) !== localStorage.getItem("id")) students.push(student);
      });
  }
  return students;
}

async function doEnroll(name, zid, enrollments) {
  const found = enrollments.some((k) => k.zid === zid);
  if (found) return { error: "Student already enrolled in this course." };

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/JSON",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const r = await fetch(`${backend_url}enroll/${name}/${zid}`, options);
  if (r.status !== 200) {
    return { error: "Enrollment failed." };
  }
  const ret = await r.json();
  return ret;
}

async function doUnenroll(name, id) {
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/JSON",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const r = await fetch(`${backend_url}unenroll/${name}/${id}`, options);
  if (r.status !== 200) {
    return { error: "Unable to unenroll student" };
  }
  const ret = await r.json();
  return ret;
}

export default function EnrollmentDashboard() {
  let { code } = useParams();
  const [invite, setInvite] = useState();
  const [uses, setUses] = useState(0);
  const [time, setTime] = useState(0);
  const [codes, setCodes] = useState([]);
  const [update, setUpdate] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [studentName, setStudentName] = useState();
  const [studentId, setStudentId] = useState();
  const [zId, setZId] = useState();
  const history = useHistory();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (!isLoggedIn()) {
      history.push("/login");
    }
    if (!isStaff()) {
      history.push("/");
    }
  }, []);

  useEffect(() => {
    getCodes(code).then((r) => {
      setCodes(r);
    });
  }, [invite, update]);

  useEffect(() => {
    getEnrollments(code).then((r) => {
      setEnrollments(r);
    });
  }, [update]);

  //check login by session storage
  return (
    <Flex width="Full" align="center" justifyContent="center">
      <Box width="100%">
        <Box textAlign="center">
          <Heading>Enrollment Dashboard for {code}</Heading>
        </Box>
        <Box my={4} textAlign="center">
          <FormControl>
            <FormLabel>Generate Topic Group Invite Link</FormLabel>
            <InputGroup size="md">
              <Input
                type="text"
                value={
                  invite
                    ? `${`${
                        window.location.href.split("/")[2]
                      }/invite/${invite}`}`
                    : `${window.location.href.split("/")[2]}/invite/???????`
                }
                size="lg"
                disabled
              />
              <InputRightElement width="4.5rem">
                {invite && (
                  <Button
                    mt={2}
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.href.split("/")[2]}/invite/${invite}`
                      );
                      toast({
                        title: "Code copied to clipboard.",
                        description: `We've copied the invite link with code "${invite}"" to your clipboard for you to share with your students!`,
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                      });
                    }}
                  >
                    Copy <CopyIcon mt={1} ml={2} />
                  </Button>
                )}
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Flex width="Full" align="center" justifyContent="space-around">
            <FormControl width="40%">
              <FormLabel>Number of uses</FormLabel>
              <NumberInput
                defaultValue={0}
                min={0}
                onChange={(e) => {
                  setUses(e);
                }}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Text mt={2} color="gray" as="i">
                Setting to 0 will give unlimited uses
              </Text>
            </FormControl>

            <FormControl width="40%">
              <FormLabel>Hours valid</FormLabel>
              <NumberInput
                defaultValue={0}
                min={0}
                onChange={(e) => {
                  setTime(e);
                }}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Text mt={2} color="gray" as="i">
                Setting to 0 will give unlimited time
              </Text>
            </FormControl>
          </Flex>
          <Button
            variant="outline"
            width="full"
            mt={4}
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              generateCode(code, uses, time).then((r) => {
                setInvite(r.code);
              });
            }}
            maxWidth="500px"
          >
            Generate Link
          </Button>
          <Box my={4} textAlign="left">
            <FormLabel>Manage Invite Links</FormLabel>
            <Table variant="simple" maxHeight="800px" overflow="scroll">
              <Thead>
                <Tr>
                  <Th>Code</Th>
                  <Th isNumeric>Uses Remaining</Th>
                  <Th isNumeric>Time Remaining</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {codes &&
                  codes.length !== 0 &&
                  codes.map((k) => {
                    return (
                      <Tr>
                        <Td>
                          <Link
                            color="blue"
                            as="strong"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `${window.location.href.split("/")[2]}/invite/${
                                  k.code
                                }`
                              );
                              toast({
                                title: "Code copied to clipboard.",
                                description: `We've copied the invite link with code "${k.code}"" to your clipboard for you to share with your students!`,
                                status: "success",
                                duration: 5000,
                                isClosable: true,
                              });
                            }}
                          >
                            {k.code}
                          </Link>
                        </Td>
                        <Td isNumeric>
                          {k.uses ? (
                            k.uses
                          ) : (
                            <Text as="i" color="gray">
                              ∞
                            </Text>
                          )}
                        </Td>
                        <Td isNumeric>
                          {k.expiration ? (
                            k.expiration
                          ) : (
                            <Text as="i" color="gray">
                              ∞
                            </Text>
                          )}
                        </Td>
                        <Td>
                          <Tooltip label="Copy Invite Link">
                            <Link
                              as={CopyIcon}
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `${
                                    window.location.href.split("/")[2]
                                  }/invite/${k.code}`
                                );
                                toast({
                                  title: "Code copied to clipboard.",
                                  description: `We've copied the invite link with code "${k.code}"" to your clipboard for you to share with your students!`,
                                  status: "success",
                                  duration: 5000,
                                  isClosable: true,
                                });
                              }}
                            />
                          </Tooltip>
                          <Tooltip label="Delete Invite Code">
                            <Link
                              as={DeleteIcon}
                              onClick={() => {
                                deleteCode(k.code);
                                setUpdate((prev) => !prev);
                              }}
                            />
                          </Tooltip>
                        </Td>
                      </Tr>
                    );
                  })}
              </Tbody>
            </Table>
          </Box>
          <Box textAlign="center">
            <Flex width="Full" align="flex-start" justifyContent="space-around">
              <Box width="40%">
                <FormControl mb={4} display="flex" alignItems="center">
                  <FormLabel htmlFor="email-alerts" mb="0">
                    Make this course searchable (public)?
                  </FormLabel>
                  <Switch id="email-alerts" />
                </FormControl>
                <FormControl>
                  <FormLabel>Enroll Student by zID</FormLabel>
                  <Input
                    type="text"
                    placeholder="z#######"
                    size="lg"
                    onChange={(e) => setZId(e.currentTarget.value.trim())}
                  />
                </FormControl>
                <Button
                  variant="outline"
                  width="full"
                  mt={4}
                  type="submit"
                  onClick={(e) => {
                    doEnroll(code, zId, enrollments).then((r) => {
                      if (!!r.error) {
                        toast({
                          title: `Unable to enroll student ${zId}`,
                          description: `${r.error} Please ensure you're typing the student you wish to enroll's zId correctly.`,
                          status: "error",
                          duration: 5000,
                          isClosable: true,
                        });
                      }
                      setUpdate((prev) => !prev);
                    });
                    e.preventDefault();
                  }}
                  maxWidth="500px"
                >
                  Invite
                </Button>
              </Box>
              <Box width="40%">
                <FormLabel>Currently Enrolled Students</FormLabel>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>zID</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {enrollments &&
                      enrollments.length !== 0 &&
                      enrollments.map((k) => {
                        return (
                          <Tr>
                            <Td>{k.name}</Td>
                            <Td>{k.zid}</Td>
                            <Td>
                              <>
                                <Tooltip label="Unenroll Student">
                                  <Link
                                    as={CloseIcon}
                                    color="red"
                                    onClick={() => {
                                      setStudentName(k.name);
                                      setStudentId(k.id);
                                      onOpen();
                                    }}
                                  />
                                </Tooltip>
                              </>
                            </Td>
                          </Tr>
                        );
                      })}
                  </Tbody>
                </Table>
              </Box>
            </Flex>
          </Box>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Unenroll Student</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you wish to unenroll <strong>{studentName}</strong>.
            This action is irreversable and they will lose all previous progress
            in this course if re-enrolled later.
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => {
                // TODO unenroll student
                doUnenroll(code, studentId).then((r) => {
                  onClose();
                  setUpdate((prev) => !prev);
                });
              }}
            >
              Unenroll
            </Button>
            <Button colorScheme="blue" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
