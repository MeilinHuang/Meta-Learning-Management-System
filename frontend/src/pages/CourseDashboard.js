import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { GrAdd } from "react-icons/gr";
import { SearchIcon } from "@chakra-ui/icons";
import Announcement from "../components/dashboard/Announcement/Announcement";
import AddPostModal from "../components/forums/AddPostModal";
import { isStaff } from "../utils/helpers"

// DUMMY VALUES
const dummyAuthor = 3;

function CourseDashboard({
  match: {
    params: { code },
  },
}) {
  const [announcements, setAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const buttonContents = useBreakpointValue({ base: "", md: "Add Post" });
  const buttonIcon = useBreakpointValue({ base: <GrAdd />, md: null });
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetch(`http://localhost:8000/${code}/announcement`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        const promises = [];

        for (const post of data) {
          promises.push(
            fetch(`http://localhost:8000/user/${post.author}`, {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }).then((r) => r.json())
          );
        }

        Promise.all(promises).then((authorData) => {
          const newPosts = [];
          for (const i in authorData) {
            const withAuthor = { ...data[i], username: authorData[i].user_name };
            newPosts.push(withAuthor);
          }
          setAnnouncements(newPosts.reverse());
          setLoading(false);
        });
      });
  }, [code, setAnnouncements]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (searchTerm === "") {
      fetch(`http://localhost:8000/${code}/announcement`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((r) => r.json())
        .then((data) => {
          const promises = [];

          for (const post of data) {
            promises.push(
              fetch(`http://localhost:8000/user/${post.author}`, {
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }).then((r) => r.json())
            );
          }

          Promise.all(promises).then((authorData) => {
            const newPosts = [];
            for (const i in authorData) {
              const withAuthor = {
                ...data[i],
                username: authorData[i].user_name,
              };
              newPosts.push(withAuthor);
            }
            setAnnouncements(newPosts.reverse());
          });
        });
      return;
    }

    fetch(
      `http://localhost:8000/${code}/announcement/search/${searchTerm.toLowerCase()}`,
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
        const promises = [];

        for (const post of data) {
          promises.push(
            fetch(`http://localhost:8000/user/${post.author}`, {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }).then((r) => r.json())
          );
        }

        Promise.all(promises).then((authorData) => {
          const newPosts = [];
          for (const i in authorData) {
            const withAuthor = { ...data[i], username: authorData[i].user_name };
            newPosts.push(withAuthor);
          }
          setAnnouncements(newPosts.reverse());
        });
      });
  };

  const handleAddPostSubmit = (formData) => {
    fetch(`http://localhost:8000/${code}/announcement/new`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((r) => {
      if (r.status === 200) {
        fetch(`http://localhost:8000/${code}/announcement`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((r) => r.json())
          .then((data) => {
            const promises = [];

            for (const post of data) {
              promises.push(
                fetch(`http://localhost:8000/user/${post.author}`, {
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }).then((r) => r.json())
              );
            }

            Promise.all(promises).then((authorData) => {
              const newPosts = [];
              for (const i in authorData) {
                const withAuthor = {
                  ...data[i],
                  username: authorData[i].user_name,
                };
                newPosts.push(withAuthor);
              }
              setAnnouncements(newPosts.reverse());
              setLoading(false);
            });
          });
      }
      // TODO: Handle error case
      // TODO: clear form
    });
  };

  console.log(announcements)

  return (
    <>
      <Flex justify="center">
        <Center width={{ base: "100%", lg: "80%" }}>
          {/* Only show for admin/staff */}
          {isStaff() && <Button
            onClick={onOpen}
            leftIcon={buttonIcon}
            pr={{ base: "8px", md: "16px" }}
          >
            {buttonContents}
          </Button>}
          <AddPostModal
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleAddPostSubmit}
          />
          <Box
            as="form"
            onSubmit={handleSubmit}
            width="100%"
            ml={isStaff() ? { base: "16px", md: "24px" } : "0" }
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
      <Box mb="32px">
        {loading && (
          <Flex mt="16px" justifyContent="center">
            <Spinner />
          </Flex>
        )}
        {announcements.map((announcement) => (
          <Announcement
            announcement={announcement}
            course={code}
            setAnnouncements={setAnnouncements}
          />
        ))}
      </Box>
    </>
  );
}

export default CourseDashboard;
