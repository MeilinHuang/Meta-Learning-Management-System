import React from "react"
import { Link as RouterLink } from 'react-router-dom'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Button,
    Divider,
    Flex,
    Heading,
} from "@chakra-ui/react"
import Tags from '../components/forums/Tags'
import PostDetails from '../components/forums/PostDetails'
import Responses from '../components/forums/Responses'
import Comments from '../components/forums/Comments'
import { BsTrash } from 'react-icons/bs'

const dummyPosts = [
    {
        id: 1,
    },
    {
        id: 2,
    }
]

function ForumPostPage() {
    const dummyTags = ['tag1', 'tag2']
    return (
        <>
            <Breadcrumb separator=">">
                <BreadcrumbItem>
                    <BreadcrumbLink as={RouterLink} to="/forums" fontWeight="bold">Forums</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href="#">PostTitle</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Flex justifyContent="space-between" alignItems="baseline">
                <Heading mt="16px" textTransform="uppercase">Post Title</Heading>
                <Button pr="8px" leftIcon={<BsTrash />} variant="ghost" color="red" />
            </Flex>
            {/* add button to delete post for author */}
            <Divider />
            <Tags tags={dummyTags} />
            <PostDetails />
            <Responses />
            <Comments />
        </>
    )
}

export default ForumPostPage