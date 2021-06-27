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

const dummyPost = {
    id: 1,
    author: 'John Smith',
    title: 'This is a forum post',
    published_date: 1624724805,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur non tristique libero. Mauris sit amet est nisl. Cras a leo ipsum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nunc quam, elementum vitae ligula a, consequat mattis nisl. Sed ut nisl nisi. Nam turpis risus, vehicula egestas tortor ut, sagittis vehicula urna. Nulla facilisi. Vivamus efficitur scelerisque mi ac ultrices. Pellentesque sed porttitor lacus. Aliquam euismod tempus magna pharetra laoreet. In eget ipsum eleifend, tempus quam id, cursus nisi. Vestibulum nec mi eleifend, pharetra arcu in, rhoncus libero. Duis tempus posuere nisi et mollis. Vestibulum eget laoreet arcu. Aliquam facilisis arcu dolor, sed sodales lacus egestas et.',
    tags: [
        {
            id: 1,
            name: 'ass1',
        },
        {
            id: 2,
            name: 'lec1',
        }
    ],
    replies: [
        {
            id: 1,
            author: 'Course Admin',
            published_date: 1624725805,
            description: 'Nullam ut gravida ipsum, ut blandit diam. Nunc pulvinar dui a diam ultrices pretium. Nulla eleifend diam quis accumsan porta. Proin ut nibh quam. Sed et elementum arcu, a mattis augue. Suspendisse vestibulum mi quis mollis mollis. Integer ac egestas augue. Fusce ultrices imperdiet diam. Vestibulum interdum consequat lacus, non malesuada orci consectetur bibendum. Maecenas finibus dui eget sodales condimentum. Duis mollis leo in ex luctus tincidunt.',
        }
    ],
    comments: [
        {
            id: 1,
            author: 'Commenter',
            published_date: 1624725806,
            description: 'Nunc imperdiet nec felis quis porttitor. Aliquam placerat magna justo, vitae porta odio mollis et. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce lobortis, leo ac placerat rhoncus, diam nibh tempor nisi, eget eleifend felis justo sed massa. Praesent auctor magna consectetur, mollis ante vel, ornare velit. Vivamus tristique venenatis gravida. Proin in mauris sem.',
        }
    ]
}

function ForumPostPage() {
    return (
        <>
            <Breadcrumb separator=">">
                <BreadcrumbItem>
                    <BreadcrumbLink as={RouterLink} to="/forums" fontWeight="bold">Forums</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href="#">{dummyPost.title}</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Flex justifyContent="space-between" alignItems="baseline">
                <Heading mt="16px" textTransform="uppercase">Post Title</Heading>
                <Button pr="8px" leftIcon={<BsTrash />} variant="ghost" color="red" />
            </Flex>
            {/* add button to delete post for author */}
            <Divider />
            <Tags tags={dummyPost.tags} />
            <PostDetails post={dummyPost} />
            <Responses replies={dummyPost.replies} />
            <Comments comments={dummyPost.comments} />
        </>
    )
}

export default ForumPostPage