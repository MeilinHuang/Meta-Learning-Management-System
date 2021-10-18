import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";

import { StoreContext } from "../utils/store";
import { SearchIcon } from "@chakra-ui/icons";
import LectureTableContainer from "../components/lecturesTutorials/LectureTableContainer";
import AddPostModal from "../components/forums/AddPostModal";
import { GrAdd } from "react-icons/gr";

function LecturesPage({
  match: {
    params: { code },
  },
}) {
  const context = useContext(StoreContext);
  /* const {
    lectures: [lectures, setLectures]
  } = context; */

  const [lectures, setLectures] = useState();
  const [searchTerm, setSearchTerm] = useState("");

  const buttonContents = useBreakpointValue({ base: "", md: "Add lecture" });
  const buttonIcon = useBreakpointValue({ base: <GrAdd />, md: null });
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Load lectures list
  useEffect(() => {
    fetch(`http://localhost:8000/${code}/lectures`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        setLectures(data);
      });
  }, [setLectures, code]);

  // Filter lectures by number/file/week
  const handleSubmit = (e) => {
    e.preventDefault();

    if (searchTerm === "") {
      fetch(`http://localhost:8000/${code}/lectures`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((r) => r.json())
        .then((data) => {
          setLectures(data);
        });
    } else {
      fetch(
        `http://localhost:8000/${code}/lectures/search/${searchTerm.toLowerCase()}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((r) => r.json())
        .then((data) => {
          setLectures(data);
        });
    }
  };

  // Post lecture
  const handleAddLectureSubmit = (formData) => {
    fetch(`http://localhost:8000/${code}/lectures`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((r) => {
      if (r.status === 200) {
        fetch(`http://localhost:8000/${code}/lectures`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((r) => r.json())
          .then((data) => setLectures(data));
      }
    });
  };

  return (
    <>
      <Flex justify="center">
        <Center width={{ base: "100%", lg: "80%" }}>
          <Button
            onClick={onOpen}
            leftIcon={buttonIcon}
            pr={{ base: "8px", md: "16px" }}
          >
            {buttonContents}
          </Button>
          <AddPostModal
            isOpen={isOpen}
            onClose={onClose}
            isLectures
            onSubmit={handleAddLectureSubmit}
            code={code}
          />
          <Box
            as="form"
            onSubmit={handleSubmit}
            width="100%"
            ml={{ base: "16px", md: "24px" }}
          >
            <InputGroup variant="outline">
              <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon color="gray.300" />}
              />
              <Input
                placeholder="Search"
                onChange={(e) => setSearchTerm(e.target.value)}
              ></Input>
            </InputGroup>
          </Box>
        </Center>
      </Flex>
      <LectureTableContainer lectures={lectures} code={code} />
    </>
  );
}

export default LecturesPage;
