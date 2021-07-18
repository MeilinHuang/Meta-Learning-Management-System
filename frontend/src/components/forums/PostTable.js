import React, { useContext } from "react"
import { Link as RouterLink } from 'react-router-dom'
import {
    IconButton,
    Link,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
} from "@chakra-ui/react"
import { RiPushpin2Fill, RiPushpin2Line } from 'react-icons/ri'
import { StoreContext } from '../../utils/store'

const getRow = ({ post_id, title, published_date, replies, comments, ispinned }, setPosts, setPinnedPosts) => {
    const date = new Date(published_date)
    const dateString = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`

    const handlePinUnpin = () => {
        fetch(`http://localhost:8000/forum/post/pin/${post_id}/${!ispinned}`, { method: 'PUT' })
            .then(r => { 
                if (r.status === 200) {
                    fetch('http://localhost:8000/forum').then(r => r.json()).then(data => setPosts(data))
                    fetch('http://localhost:8000/forum/pinned').then(r => r.json()).then(data => {
                        setPinnedPosts(data)
                    })
                }
            })
    }

    return (
        <Tr>
            {/* Only show if admin/staff */}
            <Td py="12px" px="0">
                <IconButton 
                    aria-label={ispinned ? 'Unpin post' : 'Pin post'}
                    icon={ispinned ? <RiPushpin2Fill /> : <RiPushpin2Line />} 
                    backgroundColor="white"
                    onClick={handlePinUnpin}
                />
            </Td>
            <Td width="40%" pl="0"><Link as={RouterLink} color="blue.500" to={`/forums/${post_id}`}>{title}</Link></Td>
            <Td>{dateString}</Td>
            <Td isNumeric>{replies.length}</Td>
            <Td isNumeric>{comments.length}</Td>
        </Tr>
    )
}

function PostTable({ isAdmin, posts: postData }) {
    const orderedPosts = [...postData].reverse()
    const context = useContext(StoreContext)
    const { posts: [, setPosts], pinnedPosts: [, setPinnedPosts] } = context;

    return (
        <Table variant="simple">
            <Thead>
                <Tr>
                    <Th />
                    <Th pl="0">Post</Th>
                    <Th>Date created</Th>
                    <Th isNumeric>Replies</Th>
                    <Th isNumeric>Comments</Th>
                </Tr>
            </Thead>
            <Tbody>
                {orderedPosts.map(post => getRow(post, setPosts, setPinnedPosts))}
            </Tbody>
        </Table>
    )
}

export default PostTable