import React, { useContext } from "react"
import { Link as RouterLink } from 'react-router-dom'
import {
    Button,
    Flex,
    Icon,
    IconButton,
    Link,
    Table,
    Text,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Tooltip,
} from "@chakra-ui/react"
import { RiPushpin2Fill, RiPushpin2Line } from 'react-icons/ri'
import { TiArrowUpOutline, TiArrowUpThick } from 'react-icons/ti'
import { FaCheckCircle } from 'react-icons/fa'
import { StoreContext } from '../../utils/store'

const getRow = ({ post_id, title, published_date, replies, comments, ispinned, description, isendorsed, num_of_upvotes, upvoters }, setPosts, setPinnedPosts, setShowPinned, code) => {
    const date = new Date(published_date)
    const dateString = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`

    const handlePinUnpin = () => {
        fetch(`http://localhost:8000/forum/post/pin/${post_id}/${!ispinned}`, { method: 'PUT' })
            .then(r => { 
                if (r.status === 200) {
                    fetch('http://localhost:8000/forum').then(r => r.json()).then(data => setPosts(data))
                    fetch('http://localhost:8000/forum/pinned').then(r => r.json()).then(data => {
                        setPinnedPosts(data)
                        setShowPinned(!!data.length)
                    })
                }
            })
    }

    let unformattedDesc
    if (description) {
        unformattedDesc = description.replace(/<[^>]+>/g, ' ')
        unformattedDesc = unformattedDesc.length > 120 ? unformattedDesc.substring(0, 119) + '...' : unformattedDesc
        unformattedDesc = `<p>${unformattedDesc}</p>`
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
            <Td width="40%" pl="0">
                <Flex alignItems="center">
                    <Link as={RouterLink} color="blue.500" to={`/course-page/${code}/forums/${post_id}`}>{title}</Link>
                    {isendorsed && (
                        <Tooltip
                            label="This post is endorsed by staff"
                            hasArrow
                            placement="bottom"
                            ml="8px"
                            w="90px"
                            textAlign="center"
                            fontSize="12px"
                        >
                            <span>
                                <Icon h="13px" w="13px" ml="8px" color="green" as={FaCheckCircle} />
                            </span>
                        </Tooltip>
                    )}
                </Flex>
                <Text fontSize="13px" lineHeight="16px" mt="4px" dangerouslySetInnerHTML={{__html: unformattedDesc}}></Text>
            </Td>
            <Td>{dateString}</Td>
            <Td>{replies[0] === null ? 0 : replies.length}</Td>
            <Td>{comments[0] === null ? 0 : comments.length}</Td>
            <Td>
                {/* if user is in upvoters list, show filled icon */}
                {/* TODO: handle upvote click */}
                <Button leftIcon={<TiArrowUpOutline />} backgroundColor="white">{num_of_upvotes}</Button>
            </Td>
        </Tr>
    )
}

function PostTable({ isAdmin, posts: postData, code }) {
    const orderedPosts = [...postData].reverse()
    const context = useContext(StoreContext)
    const { posts: [, setPosts], pinnedPosts: [, setPinnedPosts], showPinned: [, setShowPinned] } = context;
    console.log(orderedPosts)

    return (
        <Table variant="simple">
            <Thead>
                <Tr>
                    <Th />
                    {/* pl only if admin */}
                    <Th pl="0">Post</Th> 
                    <Th>Date created</Th>
                    <Th>Replies</Th>
                    <Th>Comments</Th>
                    <Th>Upvotes</Th>
                </Tr>
            </Thead>
            <Tbody>
                {orderedPosts.map(post => getRow(post, setPosts, setPinnedPosts, setShowPinned, code))}
            </Tbody>
        </Table>
    )
}

export default PostTable