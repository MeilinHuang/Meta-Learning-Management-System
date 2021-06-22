import React from "react"
import { 
    Button,
    Center,
    Flex,
    Input,
    InputGroup,
    InputLeftElement
} from "@chakra-ui/react"
import { SearchIcon } from '@chakra-ui/icons'
import Filter from '../components/forums/Filter'
import PostTableContainer from '../components/forums/PostTableContainer'

const dummyPosts = ['post1', 'post2']

function ForumOverviewPage() {
    return (
        <>
            <Flex justify="center">
                <Center width={{ base: '100%', md: '70%' }}>
                    <Button>Add Post</Button>
                    <InputGroup variant="filled" ml="24px">
                        <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" />}/>
                        <Input placeholder="Search"></Input>
                    </InputGroup>
                </Center>
            </Flex>
            <Filter />
            <PostTableContainer posts={dummyPosts} />
        </>
    )
}

export default ForumOverviewPage