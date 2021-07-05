import React from "react"
import { 
    Button,
    Center,
    Flex,
    Input,
    InputGroup,
    InputLeftElement,
    useBreakpointValue
} from "@chakra-ui/react"
import { SearchIcon } from '@chakra-ui/icons'
import Filter from '../components/forums/Filter'
import PostTableContainer from '../components/forums/PostTableContainer'
import { GrAdd } from 'react-icons/gr'

const dummyPosts = [
    {
        id: 1,
    },
    {
        id: 2,
    }
]

function ForumOverviewPage() {
    const buttonContents = useBreakpointValue({ base: '', md: 'Add Post' })
    const buttonIcon = useBreakpointValue({ base: <GrAdd />, md: null })

    return (
        <>
            <Flex justify="center">
                <Center width={{ base: '100%', lg: '80%' }}>
                    <Button leftIcon={buttonIcon} pr={{ base: '8px', md: '16px' }}>{buttonContents}</Button>
                    <InputGroup variant="filled" ml={{ base: '16px', md: '24px'}}>
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