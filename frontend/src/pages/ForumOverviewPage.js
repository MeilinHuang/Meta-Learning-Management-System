import React, { useContext, useEffect, useState } from "react"
import { 
    Box,
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

// DUMMY VALUES
const dummyAuthor = 3


function ForumOverviewPage({ match: { params: { code }}}) {
    const context = useContext(StoreContext)
    const {
        posts: [posts, setPosts],
        pinnedPosts: [pinnedPosts, setPinnedPosts],
        showPinned: [showPinned, setShowPinned]
    } = context;
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetch('http://localhost:8000/forum').then(r => r.json()).then(data => setPosts(data))
        fetch('http://localhost:8000/forum/pinned').then(r => r.json()).then(data => {
            setPinnedPosts(data)
            setShowPinned(!!data.length)
        })
    }, [setPosts, setPinnedPosts, setShowPinned])

    const buttonContents = useBreakpointValue({ base: '', md: 'Add Post' })
    const buttonIcon = useBreakpointValue({ base: <GrAdd />, md: null })
    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleSubmit = e => {
        e.preventDefault()

        if (searchTerm === '') {
            fetch('http://localhost:8000/forum').then(r => r.json()).then(data => {
                setPosts(data)
                setShowPinned(!!data.length)
            })
            return
        }

        fetch(`http://localhost:8000/forum/search/${searchTerm.toLowerCase()}`).then(r => r.json()).then(data => {
            setPosts(data)
            setShowPinned(false)
        })
    }

    const handleAddPostSubmit = (formData) => {
        fetch(`http://localhost:8000/forum/post`, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': '*/*',
            }
        }).then(r => {
            if (r.status === 200) {
                fetch('http://localhost:8000/forum').then(r => r.json()).then(data => setPosts(data))
            } 
            // TODO: Handle error case
        })
    }

    return (
        <>
            <Flex justify="center">
                <Center width={{ base: '100%', lg: '80%' }}>
                    <Button onClick={onOpen} leftIcon={buttonIcon} pr={{ base: '8px', md: '16px' }}>{buttonContents}</Button>
                    <AddPostModal isOpen={isOpen} onClose={onClose} isForums onSubmit={handleAddPostSubmit} />
                    <Box as="form" onSubmit={handleSubmit} width="100%" ml={{ base: '16px', md: '24px'}}>
                        <InputGroup variant="outline">
                            <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" />}/>
                            <Input placeholder="Search" onChange={e => setSearchTerm(e.target.value)}></Input>
                        </InputGroup>
                    </Box>
                </Center>
            </Flex>
            <Filter />
            <PostTableContainer posts={posts} pinnedPosts={pinnedPosts} showPinned={showPinned} code={code} />
        </>
    )
}

export default ForumOverviewPage
