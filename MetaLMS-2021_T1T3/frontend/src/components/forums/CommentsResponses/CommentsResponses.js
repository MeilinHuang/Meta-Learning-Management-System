import React, { useState } from "react";
import {
  Button,
  Box,
  Flex,
  Heading,
  Input,
  InputGroup,
} from "@chakra-ui/react";
import { AiOutlineSend, AiOutlineClose } from "react-icons/ai";
import CommentResponse from "../CommentResponse/CommentResponse";
import DraftEditor from "../DraftEditor/DraftEditor";
import styles from "./CommentsResponses.module.css";
import { isStaff } from "../../../utils/helpers"
import { backend_url } from "../../../Constants"

function CommentsResponses({ code, isComments, posts, post_id, setPost }) {
  const [editorState, setEditorState] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [details, setDetails] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const timeZoneOffset = new Date().getTimezoneOffset() * 60000;
    const date = new Date(Date.now() - timeZoneOffset).toISOString();

    const body = isComments
      ? {
          user_id: localStorage.getItem("id"),
          published_date: date,
          comment: details,
        }
      : {
          user_id: localStorage.getItem("id"),
          published_date: date,
          reply: details,
        };

    fetch(
      `${backend_url}${code}/forum/post/${post_id}/${
        isComments ? "comment" : "reply"
      }`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    ).then((r) => {
      if (r.status === 200) {
        fetch(`${backend_url}${code}/forum/post/${post_id}`, {
          headers: {
            "Content-Type": "application/JSON",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((r) => r.json())
          .then((data) => {
            setPost(data);
            setEditorState("");
            setShowEditor(false);
          });
      }
      // TODO: Handle error case
    });
  };

  console.log(posts)

  return (
    <Box
      width={{ base: "100%", lg: "80%" }}
      mt="24px"
      mb={isComments ? "32px" : ""}
      mx="auto"
      p="16px"
      borderRadius="8px"
      border="1px"
      borderColor="gray.300"
    >
      <Heading size="md" mb="12px">
        {isComments ? "Comments" : "Responses"}
      </Heading>
      {posts && posts.length &&
        posts[0] !== null ?
        posts.map(
          (post) =>
            post !== null && (
              <CommentResponse
                {...post}
                post_id={post_id}
                setPost={setPost}
                code={code}
              />
            )
        ) : (
          <Box mb="8px">No {isComments ? "comments" : "responses"} yet</Box>
        )}
      {isComments && (
        <form
          id={`create${isComments ? "Comment" : "Response"}`}
          onSubmit={handleSubmit}
        >
          <Flex>
            <InputGroup variant="filled" mr="8px">
              {showEditor ? (
                <DraftEditor
                  content={editorState}
                  setDetails={setDetails}
                  className={styles.editor}
                  showEditor={showEditor}
                  doFocus
                />
              ) : (
                <Input
                  variant="outline"
                  onClick={() => {
                    setEditorState("");
                    setShowEditor(true);
                  }}
                />
              )}
            </InputGroup>
            <Flex flexDirection="column">
              {showEditor && (
                <Button
                  pr="8px"
                  mb="8px"
                  leftIcon={<AiOutlineClose />}
                  onClick={() => setShowEditor(false)}
                />
              )}
              <Button
                pr="8px"
                leftIcon={<AiOutlineSend />}
                form={`create${isComments ? "Comment" : "Response"}`}
                type="submit"
              />
            </Flex>
          </Flex>
        </form>
      )}
      {!isComments && isStaff() && (
        <form
          id={`create${isComments ? "Comment" : "Response"}`}
          onSubmit={handleSubmit}
        >
          <Flex>
            <InputGroup variant="filled" mr="8px">
              {showEditor ? (
                <DraftEditor
                  content={editorState}
                  setDetails={setDetails}
                  className={styles.editor}
                  showEditor={showEditor}
                  doFocus
                />
              ) : (
                <Input
                  variant="outline"
                  onClick={() => {
                    setEditorState("");
                    setShowEditor(true);
                  }}
                />
              )}
            </InputGroup>
            <Flex flexDirection="column">
              {showEditor && (
                <Button
                  pr="8px"
                  mb="8px"
                  leftIcon={<AiOutlineClose />}
                  onClick={() => setShowEditor(false)}
                />
              )}
              <Button
                pr="8px"
                leftIcon={<AiOutlineSend />}
                form={`create${isComments ? "Comment" : "Response"}`}
                type="submit"
              />
            </Flex>
          </Flex>
        </form>
      )}
    </Box>
  );
}

export default CommentsResponses;
