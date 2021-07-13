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


function ForumOverviewPage() {
    const context = useContext(StoreContext)
    const { posts: [posts, setPosts], showPinned: [showPinned, setShowPinned] } = context;
    const [pinnedPosts, setPinnedPosts] = useState([])
    const [searchTerm, setSearchTerm] = useState('')

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

    const handleSubmit = e => {
        e.preventDefault()

        if (searchTerm === '') {
            fetch('http://localhost:8000/forum').then(r => r.json()).then(data => {
                setPosts(data)
                setShowPinned(true)
            })
            return
        }

        fetch(`http://localhost:8000/forum/search/${searchTerm.toLowerCase()}`).then(r => r.json()).then(data => {
            setPosts(data)
            setShowPinned(false)
        })
        console.log(searchTerm)
    }

    const handleAddPostSubmit = ({ title, details, tags, date }) => {
        fetch(`http://localhost:8000/forum/post`, {
            method: 'POST',
            body: JSON.stringify({
                title,
                user_id: dummyAuthor,
                publishedDate: date,
                description: details,
                tags,
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(r => {
            if (r.status === 200) {
                window.location.reload()
            } 
            // TODO: Handle error case
        })
    }

    return (
        <>
            <Flex justify="center">
                <Center width={{ base: '100%', lg: '80%' }}>
                    <Button onClick={onOpen} leftIcon={buttonIcon} pr={{ base: '8px', md: '16px' }}>{buttonContents}</Button>
                    <AddPostModal isOpen={isOpen} onClose={onClose} showTags onSubmit={handleAddPostSubmit} />
                    <Box as="form" onSubmit={handleSubmit} width="100%" ml={{ base: '16px', md: '24px'}}>
                        <InputGroup variant="outline">
                            <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" />}/>
                            <Input placeholder="Search" onChange={e => setSearchTerm(e.target.value)}></Input>
                        </InputGroup>
                    </Box>
                </Center>
            </Flex>
            <Filter />
            <PostTableContainer posts={posts} pinnedPosts={pinnedPosts} showPinned={showPinned} />
        </>
    )
}

export default ForumOverviewPage