import React, { useContext, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  ButtonGroup,
  Button,
  Box,
  Divider,
  Flex,
  Heading,
  InputGroup,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { GrEdit, GrShare } from "react-icons/gr";
import { BiTrash } from "react-icons/bi";
import { AiOutlineSend, AiOutlineQuestionCircle, AiOutlineClose } from "react-icons/ai";
import { ContentState, EditorState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import DraftEditor from "../../forums/DraftEditor/DraftEditor";
import AuthorDetails from "../../forums/AuthorDetails";
import AddPostModal from "../../forums/AddPostModal";
import { StoreContext } from "../../../utils/store";
import { isLoggedInUser } from "../../../utils/helpers"
import styles from "./Announcement.module.css";

function Announcement({
  announcement: { attachments, author, id, title, content, post_date, username },
  course,
  setAnnouncements,
  isAnnouncementPage,
}) {
  const [editorState, setEditorState] = useState("");
  const [details, setDetails] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const context = useContext(StoreContext);
  const history = useHistory();
  const {
    posts: [, setPosts],
  } = context;
  const toast = useToast();

  useEffect(() => {
    setDetails(content);
  }, [content]);

  const shareLink = () => {
    const link = window.location.origin;
    navigator.clipboard.writeText(
      `${link}/course-page/${course}/announcement/${id}`
    );
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
    fetch(`http://localhost:8000/${course}/announcement/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        title,
        content: details,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((r) => {
      if (r.status === 200) {
        fetch(`http://localhost:8000/${course}/announcement`, {
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
      } else {
        toast({
          title: "Sorry, an error has occurred",
          description: "Please try again",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    });
    setEditorState("");
  };

  const handleDelete = (onClose) => {
    fetch(`http://localhost:8000/${course}/announcement/${id}`, {
      method: "DELETE",
    }).then((r) => {
      if (r.status === 200) {
        fetch(`http://localhost:8000/${course}/announcement`)
          .then((r) => r.json())
          .then((data) => {
            const promises = [];

            for (const post of data) {
              promises.push(
                fetch(`http://localhost:8000/user/${post.author}`).then((r) =>
                  r.json()
                )
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
              onClose();
            });
          });
      } else {
        toast({
          title: "Sorry, an error has occurred",
          description: "Please try again",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    });
  };

  const handleAddPostSubmit = (formData) => {
    fetch(`http://localhost:8000/${course}/forum/post`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "*/*",
      },
    })
      .then((r) => {
        if (r.status === 200) {
          return r.json();
        }
        // TODO: Handle error case
      })
      .then((data) => {
        history.push(`/course-page/${course}/forums/${data.post_id}`);
      });
  };

  const getImage = ({ id, name, file }) => (
    <img className={styles.attachment} key={id} alt={name} src={file} />
  );

  return (
    <Box
      id={`announcement-${id}`}
      width={{ base: "100%", lg: "80%" }}
      mt="24px"
      mx="auto"
      p="16px"
      borderRadius="8px"
      border="1px"
      borderColor="gray.300"
    >
      <Heading size="md">{title}</Heading>
      <Divider my="16px" />
      <AuthorDetails author={username} date={post_date} />
      {!!editorState ? (
        <form id="editPost" onSubmit={handleSubmit}>
          <Flex>
            <InputGroup variant="filled" mr="8px" width="100%">
              <DraftEditor content={editorState} setDetails={setDetails} />
            </InputGroup>
            <Flex flexDirection="column">
              <Button
                pr="8px"
                mb="8px"
                leftIcon={<AiOutlineClose />}
                onClick={() => {
                  setEditorState("")
                  setDetails(content)
                }}
              />
              <Button
                pr="8px"
                mb="16px"
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
            attachments.map((image) => getImage(image))}
          <Divider my="16px" />
          <Flex justifyContent="space-between">
            <Flex>
              <Button pr="8px" leftIcon={<GrShare />} onClick={shareLink} />
              {!isAnnouncementPage && (
                <Tooltip
                  label="Ask a question"
                  hasArrow
                  placement="bottom"
                  w="90px"
                  textAlign="center"
                  fontSize="12px"
                >
                  <Button
                    pr="8px"
                    ml="8px"
                    leftIcon={<AiOutlineQuestionCircle />}
                    onClick={onOpen}
                  />
                </Tooltip>
              )}
            </Flex>
            {!isAnnouncementPage && isLoggedInUser(author) && (
              <Flex>
                <Button
                  ml="8px"
                  pr="8px"
                  leftIcon={<GrEdit />}
                  onClick={editPost}
                />{" "}
                {/*  ONLY SHOW THIS IF USER IS AUTHOR OF POST */}
                <Popover placement="bottom-end">
                  {({ onClose }) => (
                    <>
                      <PopoverTrigger>
                        <Button
                          ml="8px"
                          pr="8px"
                          leftIcon={<BiTrash />}
                          color="red"
                        />
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverHeader fontWeight="semibold">
                          Confirmation
                        </PopoverHeader>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverBody>
                          Are you sure you want to delete this post?
                        </PopoverBody>
                        <PopoverFooter d="flex" justifyContent="flex-end">
                          <ButtonGroup size="sm">
                            <Button variant="outline">Cancel</Button>
                            <Button
                              colorScheme="red"
                              onClick={() => handleDelete(onClose)}
                            >
                              Delete
                            </Button>
                          </ButtonGroup>
                        </PopoverFooter>
                      </PopoverContent>
                    </>
                  )}
                </Popover>
              </Flex>
            )}
          </Flex>
          <AddPostModal
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleAddPostSubmit}
            code={course}
            isForums
            fromAnnouncement
          />
        </>
      )}
    </Box>
  );
}

export default Announcement;
