import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
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
import { SearchIcon } from "@chakra-ui/icons";
import Filter from "../components/forums/Filter";
import PostTableContainer from "../components/forums/PostTableContainer";
import AddPostModal from "../components/forums/AddPostModal";
import { GrAdd } from "react-icons/gr";
import { StoreContext } from "../utils/store";
import { backend_url } from "../Constants"

function ForumOverviewPage({
  match: {
    params: { code },
  },
}) {
  const context = useContext(StoreContext);
  const history = useHistory();
  const {
    posts: [posts, setPosts],
    pinnedPosts: [pinnedPosts, setPinnedPosts],
    showPinned: [showPinned, setShowPinned],
  } = context;
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(`${backend_url}${code}/forum`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        setPosts(data);
      });
    fetch(`${backend_url}${code}/forum/pinned`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        setPinnedPosts(data);
        setShowPinned(!!data.length);
      });
  }, [setPosts, setPinnedPosts, setShowPinned, code]);

  const buttonContents = useBreakpointValue({ base: "", md: "Add Post" });
  const buttonIcon = useBreakpointValue({ base: <GrAdd />, md: null });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (searchTerm === "") {
      fetch(`${backend_url}${code}/forum`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((r) => r.json())
        .then((data) => {
          setPosts(data);
          setShowPinned(!!data.length);
        });
      return;
    }

    fetch(
      `${backend_url}${code}/forum/search/${searchTerm.toLowerCase()}`,
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
        setPosts(data);
        setShowPinned(false);
      });
  };

  const handleAddPostSubmit = (formData) => {
    fetch(`${backend_url}${code}/forum/post`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => {
        if (r.status === 200) {
          return r.json();
        }
        // TODO: Handle error case
      })
      .then((data) => {
        history.push(`/course-page/${code}/forums/${data.post_id}`);
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
            isForums
            onSubmit={handleAddPostSubmit}
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
      <Filter code={code} />
      <PostTableContainer
        posts={posts}
        pinnedPosts={pinnedPosts}
        showPinned={showPinned}
        code={code}
      />
    </>
  );
}

export default ForumOverviewPage;
