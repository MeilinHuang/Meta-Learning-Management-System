import React, { useContext, useEffect, useState } from "react"
import { 
    Box,
    Button,
    Flex,
    useDisclosure,
} from "@chakra-ui/react"
import TagSelect from './TagSelect/TagSelect'
import ManageTagsModal from "./ManageTagsModal"
import { StoreContext } from '../../utils/store'

function Filter() {
    const [tags, setTags] = useState([])
    const [filteredTags, setFilteredTags] = useState([])
    const context = useContext(StoreContext)
    const { posts: [, setPosts], showPinned: [, setShowPinned] } = context;

    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        fetch(`http://localhost:8000/forum/tags`, { method: 'PUT' }).then(r => r.json()).then(data => setTags(data))
    }, [])

    useEffect(() => {
        if (!filteredTags.length) {
            fetch('http://localhost:8000/forum').then(r => r.json()).then(data => {
                setPosts(data)
                setShowPinned(!!data.length)
            })
            return
        }

        const tagNames = filteredTags.map(t => t.name.toLowerCase())
        setShowPinned(false)
        const filteredPosts = []
        tagNames.forEach(t => {
            fetch(`http://localhost:8000/forum/${t}`).then(r => r.json()).then(data => {
                filteredPosts.push(...data)
                setPosts(filteredPosts)
            })
        })
    }, [setPosts, setShowPinned, filteredTags])
    
    // TODO: need to update the list of options in tagSelect when new tag added

    return (
        <Flex my="24px" mx="auto" pb="8px" width={{ base: '100%', lg: '80%' }} justifyContent="space-between">
            {/* 100% width if not admin */}
            <Box width="100%" mr="24px">
                <TagSelect isFilter setSelectedTags={setFilteredTags} tags={tags} />
            </Box>
            {/* Show if staff */}
            <Button onClick={onOpen}>Manage Tags</Button>
            <ManageTagsModal isOpen={isOpen} onClose={onClose} tags={tags} setTags={setTags} />
        </Flex>

    )
}

export default Filter