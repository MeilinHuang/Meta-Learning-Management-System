import React, { useEffect, useState } from "react"
import { Link as RouterLink } from 'react-router-dom'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Button,
    ButtonGroup,
    Divider,
    Flex,
    Heading,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
} from "@chakra-ui/react"
import Tags from '../components/forums/Tags'
import PostDetails from '../components/forums/PostDetails/PostDetails'
import CommentsResponses from '../components/forums/CommentsResponses/CommentsResponses'
import { BsTrash } from 'react-icons/bs'

function ForumPostPage({ match: { params: { id }}}) {
    const [post, setPost] = useState({})

    useEffect(() => {
        fetch(`http://localhost:8000/forum/post/${id}`).then(r => r.json()).then(data => setPost(data[0]))
    }, [id])

    console.log(post)

    return (
        <>
            <Breadcrumb separator=">">
                <BreadcrumbItem>
                    <BreadcrumbLink as={RouterLink} to="/forums" fontWeight="bold">Forums</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href="#">{post.title}</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Flex justifyContent="space-between" alignItems="baseline">
                <Heading mt="16px">{post.title}</Heading>
                <Popover>
                    <PopoverTrigger>
                        <Button pr="8px" leftIcon={<BsTrash />} variant="ghost" color="red" />
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
                            <Button colorScheme="red">Delete</Button>
                            </ButtonGroup>
                        </PopoverFooter>
                    </PopoverContent>
                </Popover>
            </Flex>
            <Divider />
            <Tags tags={post.tags} />
            <PostDetails post={post} />
            <CommentsResponses posts={post.replies} />
            <CommentsResponses isComments posts={post.comments} />
        </>
    )
}

export default ForumPostPage