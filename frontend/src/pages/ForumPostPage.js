import React from "react"
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

const dummyPost = {
    id: 1,
    author: 'John Smith',
    title: 'This is a forum post',
    published_date: 1624724805,
    description: '<p>unstyled <strong>bold</strong> <em>italics</em> <u>underline</u> <code>code</code> </p><ul><li>unorderded list</li><li>unorderded list</li></ul><ol type="1"><li>ordered list</li><li>ordered list</li></ol><blockquote>block quote</blockquote>',
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
        },
        {
            id: 2,
            author: 'Commenter2',
            published_date: 1624725806,
            description: '<p>unstyled <strong>bold</strong> <em>italics</em> <u>underline</u> <code>code</code> </p><ul><li>unorderded list</li><li>unorderded list</li></ul><ol type="1"><li>ordered list</li><li>ordered list</li></ol><blockquote>block quote</blockquote>',
        }
    ],
    comments: [
        {
            id: 1,
            author: 'Commenter',
            published_date: 1624725806,
            description: 'Nunc imperdiet nec felis quis porttitor. Aliquam placerat magna justo, vitae porta odio mollis et. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce lobortis, leo ac placerat rhoncus, diam nibh tempor nisi, eget eleifend felis justo sed massa. Praesent auctor magna consectetur, mollis ante vel, ornare velit. Vivamus tristique venenatis gravida. Proin in mauris sem.',
        },
        {
            id: 2,
            author: 'Commenter2',
            published_date: 1624725806,
            description: '<p>unstyled <strong>bold</strong> <em>italics</em> <u>underline</u> <code>code</code> </p><ul><li>unorderded list</li><li>unorderded list</li></ul><ol type="1"><li>ordered list</li><li>ordered list</li></ol><blockquote>block quote</blockquote>',
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
                <Heading mt="16px">{dummyPost.title}</Heading>
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
            <Tags tags={dummyPost.tags} />
            <PostDetails post={dummyPost} />
            <CommentsResponses posts={dummyPost.replies} />
            <CommentsResponses isComments posts={dummyPost.comments} />
        </>
    )
}

export default ForumPostPage