import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Flex, useDisclosure } from "@chakra-ui/react";
import TagSelect from "./TagSelect/TagSelect";
import ManageTagsModal from "./ManageTagsModal";
import { isStaff } from "../../utils/helpers"
import { StoreContext } from "../../utils/store";

function Filter({ code }) {
  const [tags, setTags] = useState({});
  const [filteredTags, setFilteredTags] = useState([]);
  const context = useContext(StoreContext);
  const {
    posts: [, setPosts],
    showPinned: [, setShowPinned],
    pinnedPosts: [, setPinnedPosts],
  } = context;

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetch(`http://localhost:8000/${code}/forum/tags`, { method: "PUT" })
      .then((r) => r.json())
      .then((data) => {
        setTags(data);
      });
  }, [code]);

  useEffect(() => {
    if (!filteredTags.length) {
      fetch(`http://localhost:8000/${code}/forum`, {
        headers: {
          "Content-Type": "application/JSON",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((r) => r.json())
        .then((data) => {
          setPosts(data);
        });
      fetch(`http://localhost:8000/${code}/forum/pinned`, {
        headers: {
          "Content-Type": "application/JSON",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((r) => r.json())
        .then((data) => {
          setPinnedPosts(data);
          setShowPinned(!!data.length);
        });
      return;
    }

    const tagNames = filteredTags.map((t) => t.name.toLowerCase());
    setShowPinned(false);
    tagNames.forEach((t) => {
      fetch(`http://localhost:8000/${code}/forum/filter?forumFilterTerms=${tagNames}`, {
        headers: {
          "Content-Type": "application/JSON",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((r) => r.json())
        .then((data) => {
          console.log(data)
          if (data === []) {
              setPosts([])
          } else { 
              setPosts(data)
          }
        });
    });
  }, [setPosts, setShowPinned, filteredTags, code, setPinnedPosts]);

  return (
    <Flex
      my="24px"
      mx="auto"
      pb="8px"
      width={{ base: "100%", lg: "80%" }}
      justifyContent="space-between"
    >
      <Box width="100%" mr={isStaff() ? "24px" : "0"}>
        {!!Object.keys(tags).length && (
          <TagSelect isFilter setSelectedTags={setFilteredTags} tags={tags} />
        )}
      </Box>
      {/* Show if staff */}
      {isStaff() && <Button onClick={onOpen}>Manage Tags</Button>}
      {!!Object.keys(tags).length && (
        <ManageTagsModal
          isOpen={isOpen}
          onClose={onClose}
          tags={tags}
          setTags={setTags}
          code={code}
        />
      )}
    </Flex>
  );
}

export default Filter;
