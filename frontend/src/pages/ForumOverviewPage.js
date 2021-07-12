import React, { useContext, useEffect, useState } from "react"
import { 
    Button,
    Center,
    Flex,
    Input,
    InputGroup,
    InputLeftElement,
    useBreakpointValue,
    useDisclosure,
} from "@chakra-ui/react"
import { SearchIcon } from '@chakra-ui/icons'
import Filter from '../components/forums/Filter'
import PostTableContainer from '../components/forums/PostTableContainer'
import AddPostModal from '../components/forums/AddPostModal'
import { GrAdd } from 'react-icons/gr'
import { StoreContext } from '../utils/store'


function ForumOverviewPage() {
    const context = useContext(StoreContext)
    const { posts: [posts, setPosts], showPinned: [showPinned, setShowPinned] } = context;
    const [pinnedPosts, setPinnedPosts] = useState([])

    useEffect(() => {
        fetch('http://localhost:8000/forum').then(r => r.json()).then(data => setPosts(data))
        fetch('http://localhost:8000/forum/pinned').then(r => r.json()).then(data => {
            setPinnedPosts(data)
            setShowPinned(true)
        })
    }, [setPosts, setShowPinned])

    const buttonContents = useBreakpointValue({ base: '', md: 'Add Post' })
    const buttonIcon = useBreakpointValue({ base: <GrAdd />, md: null })
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Flex justify="center">
                <Center width={{ base: '100%', lg: '80%' }}>
                    <Button onClick={onOpen} leftIcon={buttonIcon} pr={{ base: '8px', md: '16px' }}>{buttonContents}</Button>
                    <AddPostModal isOpen={isOpen} onClose={onClose} />
                    <InputGroup variant="filled" ml={{ base: '16px', md: '24px'}}>
                        <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" />}/>
                        <Input placeholder="Search"></Input>
                    </InputGroup>
                </Center>
            </Flex>
            <Filter />
            <PostTableContainer posts={posts} pinnedPosts={pinnedPosts} showPinned={showPinned} />
        </>
    )
}

export default ForumOverviewPage