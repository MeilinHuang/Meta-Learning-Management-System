import React, { useEffect, useState } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  Heading,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import Tags from "../components/forums/Tags";
import PostDetails from "../components/forums/PostDetails/PostDetails";
import CommentsResponses from "../components/forums/CommentsResponses/CommentsResponses";
import { BsTrash } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import { isLoggedInUser } from "../utils/helpers"
import { backend_url } from "../Constants"

function ForumPostPage({
  match: {
    params: { code, id },
  },
}) {
  const [post, setPost] = useState({});
  const history = useHistory();
  const toast = useToast();

  useEffect(() => {
    fetch(`${backend_url}${code}/forum/post/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        setPost(data);
      });
  }, [code, id]);

  const handleDelete = () => {
    fetch(`${backend_url}${code}/forum/post/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((r) => {
      if (r.status === 200) {
        history.push(`/course-page/${code}/forums`);
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

  return (
    <>
      <Breadcrumb separator=">">
        <BreadcrumbItem>
          <BreadcrumbLink
            as={RouterLink}
            to={`/course-page/${code}/forums`}
            fontWeight="bold"
          >
            Forums
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="#">{post.title}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Flex justifyContent="space-between" alignItems="baseline">
        <Flex alignItems="center" mt="16px">
          <Heading>{post.title}</Heading>
          {post.isendorsed && (
            <Tooltip
              label="This post is endorsed by staff"
              hasArrow
              placement="bottom"
              ml="12px"
              w="90px"
              textAlign="center"
              fontSize="12px"
            >
              <span>
                <Icon
                  h="16px"
                  w="16px"
                  ml="12px"
                  color="green"
                  as={FaCheckCircle}
                />
              </span>
            </Tooltip>
          )}
        </Flex>
        {isLoggedInUser(post.user_id) && (
          <Popover placement="bottom-end">
            <PopoverTrigger>
              <Button
                pr="8px"
                leftIcon={<BsTrash />}
                variant="ghost"
                color="red"
              />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverHeader fontWeight="semibold">Confirmation</PopoverHeader>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>
                Are you sure you want to delete this post?
              </PopoverBody>
              <PopoverFooter d="flex" justifyContent="flex-end">
                <ButtonGroup size="sm">
                  <Button variant="outline">Cancel</Button>
                  <Button colorScheme="red" onClick={handleDelete}>
                    Delete
                  </Button>
                </ButtonGroup>
              </PopoverFooter>
            </PopoverContent>
          </Popover>
        )}
      </Flex>
      <Divider />
      <Tags tags={post.tags} fromAnnouncement={post.fromannouncement} />
      <PostDetails post={post} setPost={setPost} code={code} />
      <CommentsResponses
        posts={post.replies}
        post_id={id}
        setPost={setPost}
        code={code}
      />
      <CommentsResponses
        isComments
        posts={post.comments}
        post_id={id}
        setPost={setPost}
        code={code}
      />
    </>
  );
}

export default ForumPostPage;
