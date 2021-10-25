import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Divider,
  Flex,
  InputGroup,
  Text,
  useToast,
} from "@chakra-ui/react";
import { GrEdit, GrShare } from "react-icons/gr";
import { AiOutlineClose, AiOutlineSend } from "react-icons/ai";
import { FaRegCheckCircle, FaCheckCircle } from "react-icons/fa";
import { ContentState, EditorState } from "draft-js";
import AuthorDetails from "../AuthorDetails";
import DraftEditor from "../DraftEditor/DraftEditor";
import UpvoteButton from '../UpvoteButton'
import htmlToDraft from "html-to-draftjs";
import styles from "./PostDetails.module.css";
import { isLoggedInUser, isStaff } from "../../../utils/helpers"

function PostDetails({
  post: {
    attachments,
    author,
    post_id,
    published_date,
    description,
    isendorsed,
    num_of_upvotes,
    user_id,
  },
  setPost,
  code,
}) {
  const [editorState, setEditorState] = useState("");
  const [details, setDetails] = useState();
  const toast = useToast();

  useEffect(() => {
    setDetails(description);
  }, [description]);

  const shareLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    toast({
      title: "Copied link",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const editPost = () => {
    const contentBlock = htmlToDraft(details);
    const contentState = ContentState.createFromBlockArray(
      contentBlock.contentBlocks
    );
    const editorState = EditorState.createWithContent(contentState);
    setEditorState(editorState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8000/${code}/forum/post/${post_id}`, {
      method: "PUT",
      body: JSON.stringify({
        description: details,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((r) => {
      if (r.status === 200) {
        fetch(`http://localhost:8000/${code}/forum/post/${post_id}`, {
          headers: {
            "Content-Type": "application/JSON",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((r) => r.json())
          .then((data) => setPost(data));
      }
    }); // TODO: handle errors
    setEditorState("");
  };

  const handleEndorse = () => {
    fetch(
      `http://localhost:8000/${code}/forum/post/endorse/${post_id}/${!isendorsed}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    ).then((r) => {
      if (r.status === 200) {
        fetch(`http://localhost:8000/${code}/forum/post/${post_id}`, {
          headers: {
            "Content-Type": "application/JSON",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((r) => r.json())
          .then((data) => setPost(data));
      }
      // TODO: handle errors
    });
  };

  const getImage = ({ id, name, file }) => (
    <img className={styles.attachment} key={id} alt={name} src={file} />
  );

  return (
    <Box
      width={{ base: "100%", lg: "80%" }}
      mt="24px"
      mx="auto"
      p="16px"
      borderRadius="8px"
      border="1px"
      borderColor="gray.300"
    >
      <AuthorDetails author={author} date={published_date} />
      {!!editorState ? (
        <form id="editPost" onSubmit={handleSubmit}>
          <Flex>
            <InputGroup variant="filled" mr="8px" width="100%">
              <DraftEditor content={editorState} setDetails={setDetails} />
            </InputGroup>
            <Flex flexDirection="column">
              <Button
                pr="8px"
                leftIcon={<AiOutlineClose />}
                onClick={() => {
                  setEditorState("")
                  setDetails(description)
                }}
              />
              <Button
                pr="8px"
                mb="16px"
                mt="8px"
                leftIcon={<AiOutlineSend />}
                form="editPost"
                type="submit"
              />
            </Flex>
          </Flex>
        </form>
      ) : (
        <>
          <Text
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: details }}
          />
          {!!attachments &&
            !!attachments.length &&
            attachments[0] !== null &&
            attachments.map((image) => getImage(image))}
          <Divider my="16px" />
          <Flex justifyContent="space-between">
            <Flex>
              <UpvoteButton value={num_of_upvotes} code={code} postId={post_id} isPostPage />
              {isStaff() && <Button
                pr="8px"
                ml="8px"
                leftIcon={isendorsed ? <FaCheckCircle /> : <FaRegCheckCircle />}
                onClick={handleEndorse}
              />}
              <Button
                pr="8px"
                leftIcon={<GrShare />}
                onClick={shareLink}
                ml="8px"
              />
            </Flex>
            {isLoggedInUser(user_id) && (
              <Flex>
                <Button
                  ml="8px"
                  pr="8px"
                  leftIcon={<GrEdit />}
                  onClick={editPost}
                />{" "}
                {/*  ONLY SHOW THIS IF USER IS AUTHOR OF POST */}
              </Flex>
            )}
          </Flex>
        </>
      )}
    </Box>
  );
}

export default PostDetails;
